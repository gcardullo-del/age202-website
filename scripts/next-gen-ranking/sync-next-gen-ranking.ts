import "dotenv/config";

import {
  chromium,
} from "playwright";

import {
  prisma,
} from "@/lib/prisma";

import {
  parseAtpPlayerProfile,
} from "./atp-player-profile-parser";

import {
  getActiveNextGenRankingPlayers,
} from "./players";


const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
  "AppleWebKit/537.36 (KHTML, like Gecko) " +
  "Chrome/151.0.0.0 Safari/537.36";


function parseCareerHighDate(
  value: string | null,
): Date | null {
  if (!value) {
    return null;
  }


  const match =
    value.match(
      /^(\d{4})\.(\d{2})\.(\d{2})$/,
    );


  if (!match) {
    return null;
  }


  const year =
    Number.parseInt(
      match[1],
      10,
    );

  const month =
    Number.parseInt(
      match[2],
      10,
    );

  const day =
    Number.parseInt(
      match[3],
      10,
    );


  const date =
    new Date(
      Date.UTC(
        year,
        month - 1,
        day,
      ),
    );


  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return null;
  }


  return date;
}


async function main() {
  console.log("");
  console.log(
    "🎾 AGE202 — NEXT GEN Ranking Sync",
  );

  console.log(
    "────────────────────────────────────────",
  );


  const players =
    getActiveNextGenRankingPlayers();


  console.log(
    `👥 Giocatori attivi: ${players.length}`,
  );

  console.log("");


  if (
    players.length ===
    0
  ) {
    throw new Error(
      "Nessun giocatore NEXT GEN attivo.",
    );
  }


  const browser =
    await chromium.launch({
      headless: true,
    });


  let successful =
    0;

  let failed =
    0;


  try {
    for (
      const [
        index,
        player,
      ] of players.entries()
    ) {
      console.log(
        `[${index + 1}/${players.length}] ${player.name}`,
      );


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


      try {
        const response =
          await page.goto(
            player.atpProfileUrl,
            {
              waitUntil:
                "domcontentloaded",

              timeout:
                60_000,
            },
          );


        const status =
          response?.status() ??
          null;


        console.log(
          `📡 HTTP: ${status ?? "unknown"}`,
        );


        if (
          status !== null &&
          status >= 400
        ) {
          throw new Error(
            `ATP ha risposto con HTTP ${status}.`,
          );
        }


        await page.waitForTimeout(
          6_000,
        );


        const parsed =
          await parseAtpPlayerProfile(
            page,
          );


        /*
         * Il ranking corrente è il dato minimo
         * necessario per considerare valido il sync.
         *
         * Se ATP non lo espone, NON tocchiamo
         * il record già presente nel database.
         */
        if (
          parsed.currentRank ===
          null
        ) {
          throw new Error(
            "Ranking corrente non trovato. Sync annullato per questo giocatore.",
          );
        }


        const careerHighDate =
          parseCareerHighDate(
            parsed.careerHighDate,
          );


        const existing =
          await prisma.nextGenRanking.findUnique({
            where: {
              playerKey:
                player.id,
            },
          });


        if (
          existing
        ) {
          /*
           * previousRank cambia solamente quando
           * cambia davvero il ranking corrente.
           *
           * Esempio:
           *
           * DB:
           * currentRank  = 200
           * previousRank = 205
           *
           * ATP restituisce ancora 200:
           *
           * previousRank rimane 205.
           *
           * ATP restituisce 198:
           *
           * previousRank diventa 200.
           */
          const nextPreviousRank =
            existing.currentRank ===
            parsed.currentRank
              ? existing.previousRank
              : existing.currentRank;


          await prisma.nextGenRanking.update({
            where: {
              playerKey:
                player.id,
            },

            data: {
              name:
                player.name,

              atpProfileUrl:
                player.atpProfileUrl,

              previousRank:
                nextPreviousRank,

              currentRank:
                parsed.currentRank,

              /*
               * Se ATP dovesse temporaneamente
               * non restituire il Career High,
               * preserviamo quello già presente.
               */
              careerHighRank:
                parsed.careerHighRank ??
                existing.careerHighRank,

              careerHighDate:
                careerHighDate ??
                existing.careerHighDate,

              source:
                "ATP_PROFILE",

              active:
                true,

              lastSyncedAt:
                new Date(),
            },
          });
        } else {
          /*
           * Primo ingresso del giocatore
           * nel database NEXT GEN.
           *
           * Non esiste ancora un previousRank.
           */
          await prisma.nextGenRanking.create({
            data: {
              playerKey:
                player.id,

              name:
                player.name,

              atpProfileUrl:
                player.atpProfileUrl,

              currentRank:
                parsed.currentRank,

              previousRank:
                null,

              careerHighRank:
                parsed.careerHighRank,

              careerHighDate,

              source:
                "ATP_PROFILE",

              active:
                true,

              lastSyncedAt:
                new Date(),
            },
          });
        }


        successful +=
          1;


        console.log(
          [
            "✅ Salvato — Rank ",
            parsed.currentRank,
            " · CH ",
            parsed.careerHighRank ??
              "—",
          ].join(
            "",
          ),
        );
      } catch (
        error: unknown
      ) {
        failed +=
          1;


        const message =
          error instanceof Error
            ? error.message
            : String(
                error,
              );


        console.log(
          `❌ ${message}`,
        );
      } finally {
        await page.close();
      }


      console.log("");


      /*
       * Piccola pausa tra un profilo ATP
       * e il successivo.
       */
      if (
        index <
        players.length - 1
      ) {
        await new Promise(
          (resolve) =>
            setTimeout(
              resolve,
              2_000,
            ),
        );
      }
    }
  } finally {
    await browser.close();
  }


  console.log(
    "────────────────────────────────────────",
  );

  console.log(
    "📊 SYNC COMPLETATO",
  );

  console.log(
    `✅ Riusciti: ${successful}`,
  );

  console.log(
    `❌ Falliti: ${failed}`,
  );


  /*
   * Snapshot finale del database.
   */
  const stored =
    await prisma.nextGenRanking.findMany({
      where: {
        active:
          true,
      },

      orderBy: {
        currentRank:
          "asc",
      },
    });


  console.log("");
  console.log(
    "🗃️ DATI NEXT GEN NEL DATABASE",
  );


  for (
    const row
    of stored
  ) {
    console.log(
      [
        "• ",
        row.name,
        " — Rank ",
        row.currentRank ??
          "—",
        " · Prev ",
        row.previousRank ??
          "—",
        " · CH ",
        row.careerHighRank ??
          "—",
      ].join(
        "",
      ),
    );
  }


  console.log("");
}


main()
  .catch(
    (error: unknown) => {
      console.error("");
      console.error(
        "❌ NEXT GEN Ranking Sync fallito.",
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


      process.exitCode =
        1;
    },
  )
  .finally(
    async () => {
      await prisma.$disconnect();
    },
  );