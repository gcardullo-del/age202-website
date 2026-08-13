import "dotenv/config";

import {
  chromium,
} from "playwright";

import {
  prisma,
} from "@/lib/prisma";

import {
  getStoredAtpPlayers,
  replaceAtpRanking,
  type AtpPlayerImportData,
} from "@/lib/repositories/atp-player.repository";

import {
  parseAtpLiveRanking,
} from "./atp-live-parser";

import {
  validateAtpLiveRanking,
} from "./atp-live-validator";

import {
  buildAtpCountryMap,
  resolveAtpCountry,
} from "./atp-country-resolver";

import {
  ATP_LIVE_RANKING_URL,
  ATP_RANKING_LIMIT,
  ATP_RANKING_SOURCE,
} from "./types";


const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
  "AppleWebKit/537.36 (KHTML, like Gecko) " +
  "Chrome/151.0.0.0 Safari/537.36";


function normalizeSlug(
  value: string | null | undefined,
): string {
  return (
    value
      ?.trim()
      .toLowerCase() ??
    ""
  );
}


async function main() {
  console.log("");
  console.log(
    "🎾 AGE202 — ATP LIVE RANKING SYNC",
  );
  console.log(
    "────────────────────────────────────────",
  );
  console.log(
    "⚠️ MODALITÀ LIVE — la classifica verrà sostituita.",
  );
  console.log("");


  /*
   * 1.
   * SNAPSHOT AGE202
   *
   * Prima di aprire ATP leggiamo i dati esistenti.
   * Serviranno sia per il country resolver sia per
   * conservare i metadati che ATP Live non espone.
   */

  const storedPlayers =
    await prisma.atpPlayer.findMany({
      select: {
        id: true,

        rank: true,
        previousRank: true,

        name: true,

        firstName: true,
        lastName: true,

        slug: true,

        country: true,
        countryCode: true,

        points: true,
        age: true,

        imageUrl: true,

        playerId: true,

        active: true,
      },
    });


  console.log(
    `📦 Snapshot AGE202: ${storedPlayers.length} giocatori.`,
  );


  /*
   * Manteniamo anche questa lettura attraverso il
   * repository come controllo di coerenza.
   */

  const storedReferences =
    await getStoredAtpPlayers();


  if (
    storedReferences.length !==
    storedPlayers.length
  ) {
    throw new Error(
      [
        "Snapshot ATP AGE202 incoerente.",
        `Repository=${storedReferences.length}`,
        `Snapshot=${storedPlayers.length}`,
      ].join(" "),
    );
  }


  /*
   * 2.
   * COUNTRY MAP
   */

  const countryMap =
    buildAtpCountryMap(
      storedPlayers.map(
        (player) => ({
          country:
            player.country,

          countryCode:
            player.countryCode,
        }),
      ),
    );


  console.log(
    `🌍 Country resolver: ${countryMap.size} codici disponibili.`,
  );


  /*
   * 3.
   * INDICE RECORD ESISTENTI
   */

  const storedBySlug =
    new Map(
      storedPlayers.map(
        (player) => [
          normalizeSlug(
            player.slug,
          ),

          player,
        ],
      ),
    );


  /*
   * 4.
   * LETTURA ATP LIVE
   */

  const browser =
    await chromium.launch({
      headless: true,
    });


  try {
    const page =
      await browser.newPage({
        viewport: {
          width: 1440,
          height: 1200,
        },

        locale:
          "en-US",

        userAgent:
          USER_AGENT,
      });


    console.log("");
    console.log(
      "🌐 Lettura ATP Live Rankings...",
    );


    const response =
      await page.goto(
        ATP_LIVE_RANKING_URL,
        {
          waitUntil:
            "domcontentloaded",

          timeout:
            60_000,
        },
      );


    const httpStatus =
      response?.status() ??
      null;


    console.log(
      `📡 HTTP: ${httpStatus ?? "unknown"}`,
    );


    if (
      httpStatus !== null &&
      httpStatus >= 400
    ) {
      throw new Error(
        `ATP ha risposto con HTTP ${httpStatus}.`,
      );
    }


    await page.waitForTimeout(
      5_000,
    );


    /*
     * 5.
     * PARSER
     */

    const entries =
      await parseAtpLiveRanking(
        page,
      );


    /*
     * 6.
     * VALIDAZIONE ATP
     */

    const validation =
      validateAtpLiveRanking(
        entries,
      );


    if (!validation.valid) {
      throw new Error(
        [
          "Dataset ATP non valido.",
          ...validation.errors,
        ].join("\n"),
      );
    }


    if (
      entries.length !==
      ATP_RANKING_LIMIT
    ) {
      throw new Error(
        [
          "SYNC BLOCCATO.",
          `Attesi ${ATP_RANKING_LIMIT} giocatori ATP,`,
          `ricevuti ${entries.length}.`,
        ].join(" "),
      );
    }


    console.log(
      `✅ ATP Top ${ATP_RANKING_LIMIT} validata.`,
    );


    if (
      validation.warnings.length >
      0
    ) {
      console.log("");
      console.log(
        "⚠️ WARNING VALIDAZIONE",
      );


      for (
        const warning
        of validation.warnings
      ) {
        console.log(
          `• ${warning}`,
        );
      }
    }


    /*
     * 7.
     * PREPARAZIONE DEI 100 RECORD
     */

    const rankingDate =
      new Date();


    const preparedPlayers:
      AtpPlayerImportData[] = [];


    const unresolved:
      string[] = [];


    let matched = 0;
    let created = 0;


    for (
      const incoming
      of entries
    ) {
      const slug =
        normalizeSlug(
          incoming.profileSlug,
        );


      if (!slug) {
        unresolved.push(
          `#${incoming.rank} ${incoming.name}: profileSlug mancante.`,
        );

        continue;
      }


      const existing =
        storedBySlug.get(
          slug,
        ) ??
        null;


      if (existing) {
        matched += 1;
      } else {
        created += 1;
      }


      /*
       * Il countryCode arriva dal DOM ATP.
       *
       * Il nome esteso viene risolto dal dizionario
       * AGE202 già verificato.
       */

      const resolution =
        resolveAtpCountry(
          incoming.countryCode,
          countryMap,
        );


      const countryCode =
        resolution?.countryCode ??
        existing?.countryCode ??
        null;


      const country =
        incoming.country ??
        resolution?.country ??
        existing?.country ??
        null;


      /*
       * Per un NUOVO giocatore non inventiamo nulla.
       *
       * Se ATP non ci dà un countryCode oppure AGE202
       * non sa risolverlo, il sync viene bloccato.
       */

      if (
        !existing &&
        (
          !countryCode ||
          !country
        )
      ) {
        unresolved.push(
          [
            `#${incoming.rank} ${incoming.name}:`,
            "nuovo giocatore con nazione non risolta.",
            `countryCode=${countryCode ?? "null"}`,
            `country=${country ?? "null"}`,
          ].join(" "),
        );

        continue;
      }


      /*
       * Anche per un giocatore esistente country e
       * countryCode devono essere presenti prima di
       * costruire il nuovo snapshot.
       */

      if (
        !countryCode ||
        !country
      ) {
        unresolved.push(
          [
            `#${incoming.rank} ${incoming.name}:`,
            "metadati nazione incompleti.",
          ].join(" "),
        );

        continue;
      }


      preparedPlayers.push({
        rank:
          incoming.rank,


        /*
         * Il rank presente nello snapshot precedente
         * diventa previousRank.
         *
         * Per un nuovo ingresso è null.
         */

        previousRank:
          existing?.rank ??
          null,


        name:
          incoming.name,


        /*
         * ATP Live al momento non ci fornisce sempre
         * firstName/lastName separati.
         *
         * Se mancano, preserviamo AGE202.
         */

        firstName:
          incoming.firstName ??
          existing?.firstName ??
          null,

        lastName:
          incoming.lastName ??
          existing?.lastName ??
          null,


        slug,


        country,

        countryCode,


        points:
          incoming.points,


        /*
         * Non inventiamo età.
         *
         * Se ATP non la fornisce, manteniamo quella
         * già presente in AGE202.
         *
         * Per Martin Damm potrà quindi essere null.
         */

        age:
          incoming.age ??
          existing?.age ??
          null,


        /*
         * ATP Live non viene usato come sorgente
         * dell'immagine.
         *
         * Manteniamo quella AGE202 esistente.
         * Un nuovo giocatore parte con null.
         */

        imageUrl:
          existing?.imageUrl ??
          null,


        rankingDate,

        source:
          ATP_RANKING_SOURCE,
      });
    }


    /*
     * 8.
     * PREFLIGHT BLOCCANTE
     */

    console.log("");
    console.log(
      "📊 PREFLIGHT SYNC",
    );
    console.log(
      "────────────────────────────────────────",
    );

    console.log(
      `✅ Match esistenti:   ${matched}`,
    );

    console.log(
      `🆕 Nuovi ingressi:    ${created}`,
    );

    console.log(
      `📋 Record preparati:  ${preparedPlayers.length}/${ATP_RANKING_LIMIT}`,
    );

    console.log(
      `⚠️ Non risolti:       ${unresolved.length}`,
    );


    if (
      unresolved.length >
      0
    ) {
      console.log("");
      console.log(
        "❌ RECORD NON RISOLTI",
      );
      console.log(
        "────────────────────────────────────────",
      );


      for (
        const error
        of unresolved
      ) {
        console.log(
          `• ${error}`,
        );
      }


      throw new Error(
        "SYNC BLOCCATO: almeno un giocatore ATP non è completamente risolvibile.",
      );
    }


    if (
      preparedPlayers.length !==
      ATP_RANKING_LIMIT
    ) {
      throw new Error(
        [
          "SYNC BLOCCATO.",
          `Preparati ${preparedPlayers.length}/${ATP_RANKING_LIMIT} giocatori.`,
        ].join(" "),
      );
    }


    /*
     * 9.
     * CONTROLLO RANK 1 → 100
     *
     * replaceAtpRanking() lo controlla nuovamente,
     * ma preferiamo fallire prima ancora di entrare
     * nella transazione.
     */

    const orderedPlayers =
      [...preparedPlayers].sort(
        (
          first,
          second,
        ) =>
          first.rank -
          second.rank,
      );


    for (
      let index = 0;
      index <
      orderedPlayers.length;
      index += 1
    ) {
      const expectedRank =
        index + 1;


      if (
        orderedPlayers[index]
          ?.rank !==
        expectedRank
      ) {
        throw new Error(
          [
            "SYNC BLOCCATO.",
            `Rank atteso ${expectedRank},`,
            `ricevuto ${orderedPlayers[index]?.rank ?? "missing"}.`,
          ].join(" "),
        );
      }
    }


    /*
     * 10.
     * MOSTRIAMO I NUOVI INGRESSI PRIMA DEL WRITE
     */

    const newPlayers =
      orderedPlayers.filter(
        (player) =>
          !storedBySlug.has(
            normalizeSlug(
              player.slug,
            ),
          ),
      );


    if (
      newPlayers.length >
      0
    ) {
      console.log("");
      console.log(
        "🆕 NUOVI GIOCATORI DA CREARE",
      );
      console.log(
        "────────────────────────────────────────",
      );


      for (
        const player
        of newPlayers
      ) {
        console.log(
          `${String(player.rank).padStart(3, " ")}  ${player.name}`,
        );

        console.log(
          `     slug:        ${player.slug}`,
        );

        console.log(
          `     countryCode: ${player.countryCode}`,
        );

        console.log(
          `     country:     ${player.country}`,
        );

        console.log(
          `     age:         ${player.age ?? "null"}`,
        );

        console.log(
          `     imageUrl:    ${player.imageUrl ?? "null"}`,
        );
      }
    }


    /*
     * 11.
     * WRITE
     *
     * Da questo punto non implementiamo una seconda
     * strategia Prisma.
     *
     * Tutta la sostituzione viene delegata alla
     * funzione repository AGE202 già esistente.
     *
     * replaceAtpRanking():
     *
     * - richiede esattamente 100 record;
     * - verifica la sequenza dei rank;
     * - preserva i link Player esistenti;
     * - aggiorna/crea ATP Archive Top 50;
     * - sostituisce AtpPlayer;
     * - verifica 100 giocatori active;
     * - verifica i 50 collegamenti Archive;
     * - usa una singola transazione.
     */

    console.log("");
    console.log(
      "💾 Avvio replaceAtpRanking()...",
    );


    const result =
      await replaceAtpRanking(
        orderedPlayers,
      );


    /*
     * 12.
     * CONTROLLO POST-WRITE
     */

    if (
      result.length !==
      ATP_RANKING_LIMIT
    ) {
      throw new Error(
        [
          "Risultato sync inatteso.",
          `Repository ha restituito ${result.length}/${ATP_RANKING_LIMIT} giocatori.`,
        ].join(" "),
      );
    }


    console.log("");
    console.log(
      "────────────────────────────────────────",
    );
    console.log(
      "🏆 ATP LIVE SYNC COMPLETATO",
    );
    console.log(
      "────────────────────────────────────────",
    );

    console.log(
      `✅ Classifica:       ${result.length}/${ATP_RANKING_LIMIT}`,
    );

    console.log(
      `🔄 Già presenti:     ${matched}`,
    );

    console.log(
      `🆕 Nuovi ingressi:   ${created}`,
    );

    console.log(
      `🌍 Country resolver: ${countryMap.size} codici`,
    );

    console.log(
      `📅 Ranking date:     ${rankingDate.toISOString()}`,
    );

    console.log(
      "🔒 Transazione AGE202 completata.",
    );

    console.log("");
  } finally {
    await browser.close();
  }
}


main()
  .catch(
    (error: unknown) => {
      console.error("");
      console.error(
        "❌ ATP LIVE SYNC FALLITO.",
      );


      if (
        error instanceof Error
      ) {
        console.error(
          error.message,
        );
      } else {
        console.error(
          error,
        );
      }


      process.exitCode = 1;
    },
  )
  .finally(
    async () => {
      await prisma.$disconnect();
    },
  );