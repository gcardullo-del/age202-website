import {
  config as loadEnv,
} from "dotenv";

import {
  chromium,
  type Page,
} from "playwright";

import type {
  WtaPlayerImportData,
} from "@/lib/repositories/wta-player.repository";

import {
  parseWtaLiveRanking,
  debugWtaRankingPage,
} from "./wta-live-parser";

import {
  validateWtaLiveRanking,
} from "./wta-live-validator";

import {
  buildWtaCountryMap,
  resolveWtaCountry,
} from "./wta-country-resolver";

import {
  WTA_LIVE_RANKING_URL,
  WTA_RANKING_LIMIT,
  WTA_RANKING_SOURCE,
} from "./wta-ranking-types";


const WRITE_FLAG =
  "--write";


const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
  "AppleWebKit/537.36 (KHTML, like Gecko) " +
  "Chrome/151.0.0.0 Safari/537.36";


let prismaForShutdown:
  | (typeof import("@/lib/prisma"))["prisma"]
  | undefined;


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


async function dismissCookieConsent(
  page: Page,
): Promise<void> {
  /*
   * OneTrust può coprire il pulsante "Load More"
   * con un overlay che intercetta i click.
   *
   * Proviamo prima ad accettare il consenso
   * attraverso il pulsante ufficiale.
   */
  const acceptButton =
    page
      .locator(
        "#onetrust-accept-btn-handler",
      )
      .first();


  if (
    await acceptButton.count() >
    0
  ) {
    const visible =
      await acceptButton
        .isVisible()
        .catch(
          () => false,
        );


    if (visible) {
      console.log(
        "🍪 OneTrust rilevato · accetto i cookie tecnici per continuare il sync.",
      );


      try {
        await acceptButton.click({
          force: true,
          timeout: 5_000,
        });
      } catch {
        await acceptButton.evaluate(
          (
            element,
          ) => {
            (
              element as HTMLElement
            ).click();
          },
        );
      }


      await page.waitForTimeout(
        700,
      );
    }
  }


  /*
   * Fallback:
   * se OneTrust mantiene ancora un dark-filter
   * sopra la pagina, lo rendiamo non interattivo.
   *
   * Non modifichiamo dati o contenuti WTA:
   * eliminiamo soltanto l'ostacolo UI che
   * impedisce a Playwright di premere Load More.
   */
  await page
    .locator(
      ".onetrust-pc-dark-filter, #onetrust-consent-sdk",
    )
    .evaluateAll(
      (
        elements,
      ) => {
        for (
          const element
          of elements
        ) {
          const htmlElement =
            element as HTMLElement;

          htmlElement.style.pointerEvents =
            "none";
        }
      },
    )
    .catch(
      () => undefined,
    );
}


async function countRankingRows(
  page: Page,
): Promise<number> {
  const rows =
    page.locator(
      "tr",
    );


  const count =
    await rows.count();


  let rankingRows =
    0;


  for (
    let index = 0;
    index < count;
    index += 1
  ) {
    const cells =
      rows
        .nth(
          index,
        )
        .locator(
          "td",
        );


    if (
      await cells.count() <
      5
    ) {
      continue;
    }


    const rankText =
      (
        await cells
          .nth(
            0,
          )
          .innerText()
          .catch(
            () => "",
          )
      )
        .replace(
          /\s+/g,
          " ",
        )
        .trim();


    const rankMatch =
      rankText.match(
        /^(\d{1,3})\b/,
      );


    if (
      !rankMatch?.[1]
    ) {
      continue;
    }


    const rank =
      Number.parseInt(
        rankMatch[1],
        10,
      );


    if (
      Number.isInteger(
        rank,
      ) &&
      rank >= 1 &&
      rank <=
        WTA_RANKING_LIMIT
    ) {
      rankingRows +=
        1;
    }
  }


  return rankingRows;
}


async function clickLoadMore(
  page: Page,
): Promise<boolean> {
  await dismissCookieConsent(
    page,
  );


  const loadMore =
    page
      .getByRole(
        "button",
        {
          name:
            /load more/i,
        },
      )
      .first();


  if (
    await loadMore.count() ===
    0
  ) {
    return false;
  }


  const visible =
    await loadMore
      .isVisible()
      .catch(
        () => false,
      );


  if (!visible) {
    return false;
  }


  await loadMore.scrollIntoViewIfNeeded();


  try {
    await loadMore.click({
      force: true,
      timeout: 7_000,
    });


    return true;
  } catch {
    /*
     * Ultimo fallback:
     * dispatch DOM diretto sul bottone WTA.
     */
    try {
      await loadMore.evaluate(
        (
          element,
        ) => {
          (
            element as HTMLButtonElement
          ).click();
        },
      );


      return true;
    } catch {
      return false;
    }
  }
}


async function waitForRankingGrowth(
  page: Page,
  previousCount: number,
): Promise<number> {
  const deadline =
    Date.now() +
    12_000;


  let latestCount =
    previousCount;


  while (
    Date.now() <
    deadline
  ) {
    await page.waitForTimeout(
      750,
    );


    latestCount =
      await countRankingRows(
        page,
      );


    if (
      latestCount >
      previousCount
    ) {
      return latestCount;
    }
  }


  return latestCount;
}


async function expandWtaRanking(
  page: Page,
): Promise<void> {
  console.log("");
  console.log(
    "📖 Espansione classifica WTA...",
  );


  await dismissCookieConsent(
    page,
  );


  let previousCount =
    await countRankingRows(
      page,
    );


  console.log(
    `   Righe ranking iniziali: ${previousCount}`,
  );


  for (
    let attempt = 1;
    attempt <= 6;
    attempt += 1
  ) {
    if (
      previousCount >=
      WTA_RANKING_LIMIT
    ) {
      break;
    }


    console.log(
      `   ➕ Load More · tentativo ${attempt}`,
    );


    const clicked =
      await clickLoadMore(
        page,
      );


    if (!clicked) {
      console.log(
        "   ⚠️ Impossibile attivare Load More.",
      );

      break;
    }


    const currentCount =
      await waitForRankingGrowth(
        page,
        previousCount,
      );


    console.log(
      `   Righe ranking dopo il click: ${currentCount}`,
    );


    if (
      currentCount <=
      previousCount
    ) {
      console.log(
        "   ⚠️ Nessun nuovo record dopo Load More.",
      );

      break;
    }


    previousCount =
      currentCount;
  }


  console.log(
    `✅ Righe ranking disponibili: ${previousCount}`,
  );


  if (
    previousCount <
    WTA_RANKING_LIMIT
  ) {
    throw new Error(
      [
        "Impossibile caricare la WTA Top 100.",
        `Righe disponibili: ${previousCount}/${WTA_RANKING_LIMIT}.`,
      ].join(" "),
    );
  }
}


async function main() {
  /*
   * ENV BOOTSTRAP
   *
   * Carichiamo esplicitamente .env PRIMA di importare
   * Prisma e il repository WTA.
   *
   * Questo evita che lib/prisma.ts venga valutato
   * quando DATABASE_URL non è ancora disponibile.
   */
  loadEnv();

  const databaseUrl =
    process.env.DATABASE_URL
      ?.trim();

  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL non trovata nel file .env",
    );
  }


  const {
    prisma: db,
  } =
    await import(
      "@/lib/prisma"
    );


  prismaForShutdown =
    db;


  const {
    getStoredWtaPlayers,
    replaceWtaRanking,
  } =
    await import(
      "@/lib/repositories/wta-player.repository"
    );


  const writeEnabled =
    process.argv.includes(
      WRITE_FLAG,
    );


  console.log("");
  console.log(
    "🎾 AGE202 — WTA LIVE RANKING SYNC",
  );
  console.log(
    "────────────────────────────────────────",
  );


  if (writeEnabled) {
    console.log(
      "🔴 WRITE MODE — la classifica WTA verrà sostituita.",
    );
  } else {
    console.log(
      "🛡️ DRY RUN — il database NON verrà modificato.",
    );
  }


  console.log("");


  /*
   * 1.
   * SNAPSHOT WTA AGE202
   */
  const storedPlayers =
    await db.wtaPlayer.findMany({
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
    `📦 Snapshot WTA AGE202: ${storedPlayers.length} giocatrici.`,
  );


  const storedReferences =
    await getStoredWtaPlayers();


  if (
    storedReferences.length !==
    storedPlayers.length
  ) {
    throw new Error(
      [
        "Snapshot WTA AGE202 incoerente.",
        `Repository=${storedReferences.length}`,
        `Snapshot=${storedPlayers.length}`,
      ].join(" "),
    );
  }


  /*
   * 2.
   * COUNTRY REFERENCES
   */
  const atpCountryReferences =
    await db.atpPlayer.findMany({
      select: {
        country: true,
        countryCode: true,
      },
    });


  const countryMap =
    buildWtaCountryMap([
      ...storedPlayers.map(
        (player) => ({
          country:
            player.country,

          countryCode:
            player.countryCode,
        }),
      ),

      ...atpCountryReferences.map(
        (player) => ({
          country:
            player.country,

          countryCode:
            player.countryCode,
        }),
      ),
    ]);


  console.log(
    `🌍 Country resolver: ${countryMap.size} codici disponibili.`,
  );


  /*
   * 3.
   * INDICE RECORD WTA ESISTENTI
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
   * LETTURA WTA
   */
  const browser =
    await chromium.launch({
      headless:
        true,
    });


  try {
    const page =
      await browser.newPage({
        viewport: {
          width:
            1440,

          height:
            1400,
        },

        locale:
          "en-US",

        userAgent:
          USER_AGENT,
      });


    console.log("");
    console.log(
      "🌐 Lettura WTA Singles Rankings...",
    );

    console.log(
      `   ${WTA_LIVE_RANKING_URL}`,
    );


    const response =
      await page.goto(
        WTA_LIVE_RANKING_URL,
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
        `WTA ha risposto con HTTP ${httpStatus}.`,
      );
    }


    await page.waitForTimeout(
      8_000,
    );


    /*
     * 5.
     * COOKIE CONSENT
     */
    await dismissCookieConsent(
      page,
    );


    /*
     * 6.
     * ESPANSIONE TOP 100
     */
    await expandWtaRanking(
      page,
    );


    /*
     * 7.
     * PARSER
     */
    const entries =
      await parseWtaLiveRanking(
        page,
      );


    console.log(
      `📥 Record WTA estratti: ${entries.length}`,
    );


    if (
      entries.length !==
      WTA_RANKING_LIMIT
    ) {
      await debugWtaRankingPage(
        page,
      );
    }


    /*
     * 8.
     * VALIDAZIONE
     */
    const validation =
      validateWtaLiveRanking(
        entries,
      );


    if (
      !validation.valid
    ) {
      throw new Error(
        [
          "Dataset WTA non valido.",
          ...validation.errors,
        ].join("\n"),
      );
    }


    console.log(
      `✅ WTA Top ${WTA_RANKING_LIMIT} validata.`,
    );


    if (
      validation.warnings.length >
      0
    ) {
      console.log("");
      console.log(
        "⚠️ WARNING VALIDAZIONE WTA",
      );
      console.log(
        "────────────────────────────────────────",
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
     * 9.
     * PREPARAZIONE RECORD
     */
    const rankingDate =
      new Date();


    const preparedPlayers:
      WtaPlayerImportData[] =
      [];


    const unresolved:
      string[] =
      [];


    const countryFallbacks:
      string[] =
      [];


    let matched =
      0;

    let created =
      0;


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
        matched +=
          1;
      } else {
        created +=
          1;
      }


      const resolution =
        resolveWtaCountry(
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
        countryCode ??
        null;


      if (
        !countryCode
      ) {
        unresolved.push(
          [
            `#${incoming.rank} ${incoming.name}:`,
            "countryCode WTA non risolto.",
          ].join(" "),
        );

        continue;
      }


      if (
        !country
      ) {
        unresolved.push(
          [
            `#${incoming.rank} ${incoming.name}:`,
            "country WTA non risolto.",
          ].join(" "),
        );

        continue;
      }


      if (
        resolution?.country ===
          null &&
        !existing?.country &&
        country ===
          countryCode
      ) {
        countryFallbacks.push(
          `#${incoming.rank} ${incoming.name}: ${countryCode}`,
        );
      }


      preparedPlayers.push({
        rank:
          incoming.rank,

        previousRank:
          existing?.rank ??
          null,

        name:
          incoming.name,

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

        age:
          incoming.age ??
          existing?.age ??
          null,

        imageUrl:
          existing?.imageUrl ??
          null,

        rankingDate,

        source:
          WTA_RANKING_SOURCE,
      });
    }


    /*
     * 10.
     * PREFLIGHT
     */
    console.log("");
    console.log(
      "📊 PREFLIGHT WTA SYNC",
    );
    console.log(
      "────────────────────────────────────────",
    );


    console.log(
      `✅ Match esistenti:      ${matched}`,
    );

    console.log(
      `🆕 Nuovi ingressi:       ${created}`,
    );

    console.log(
      `📋 Record preparati:     ${preparedPlayers.length}/${WTA_RANKING_LIMIT}`,
    );

    console.log(
      `🌍 Country fallback:     ${countryFallbacks.length}`,
    );

    console.log(
      `⚠️ Non risolti:          ${unresolved.length}`,
    );


    if (
      countryFallbacks.length >
      0
    ) {
      console.log("");
      console.log(
        "🌍 COUNTRY CODE USATI COME LABEL TEMPORANEA",
      );
      console.log(
        "────────────────────────────────────────",
      );


      for (
        const fallback
        of countryFallbacks
      ) {
        console.log(
          `• ${fallback}`,
        );
      }
    }


    if (
      unresolved.length >
      0
    ) {
      console.log("");
      console.log(
        "❌ RECORD WTA NON RISOLTI",
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
        "SYNC WTA BLOCCATO: almeno una giocatrice non è completamente risolvibile.",
      );
    }


    if (
      preparedPlayers.length !==
      WTA_RANKING_LIMIT
    ) {
      throw new Error(
        [
          "SYNC WTA BLOCCATO.",
          `Preparati ${preparedPlayers.length}/${WTA_RANKING_LIMIT} record.`,
        ].join(" "),
      );
    }


    /*
     * 11.
     * CONTROLLO RANK 1 → 100
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
            "SYNC WTA BLOCCATO.",
            `Rank atteso ${expectedRank},`,
            `ricevuto ${orderedPlayers[index]?.rank ?? "missing"}.`,
          ].join(" "),
        );
      }
    }


    /*
     * 12.
     * PREVIEW TOP 20
     */
    console.log("");
    console.log(
      "🏆 WTA RANKING PREVIEW",
    );
    console.log(
      "────────────────────────────────────────",
    );


    for (
      const player
      of orderedPlayers.slice(
        0,
        20,
      )
    ) {
      console.log(
        [
          String(
            player.rank,
          ).padStart(
            3,
            " ",
          ),
          player.name.padEnd(
            28,
            " ",
          ),
          player.countryCode.padEnd(
            4,
            " ",
          ),
          String(
            player.points ??
            0,
          ).padStart(
            6,
            " ",
          ),
          "pts",
        ].join(
          " ",
        ),
      );
    }


    console.log("");


    /*
     * 13.
     * DRY RUN STOP
     */
    if (
      !writeEnabled
    ) {
      console.log(
        "🟢 WTA DRY RUN COMPLETATO",
      );
      console.log(
        "────────────────────────────────────────",
      );


      console.log(
        `✅ Classifica validata: ${orderedPlayers.length}/${WTA_RANKING_LIMIT}`,
      );

      console.log(
        `🔄 Già presenti:        ${matched}`,
      );

      console.log(
        `🆕 Nuovi ingressi:      ${created}`,
      );

      console.log(
        `🌍 Country resolver:    ${countryMap.size} codici`,
      );

      console.log(
        `📅 Ranking date:        ${rankingDate.toISOString()}`,
      );

      console.log(
        "🛡️ Database writes:     0",
      );

      console.log("");

      return;
    }


    /*
     * 14.
     * WRITE
     */
    console.log("");
    console.log(
      "💾 Avvio replaceWtaRanking()...",
    );


    const result =
      await replaceWtaRanking(
        orderedPlayers,
      );


    if (
      result.length !==
      WTA_RANKING_LIMIT
    ) {
      throw new Error(
        [
          "Risultato sync WTA inatteso.",
          `Repository ha restituito ${result.length}/${WTA_RANKING_LIMIT} giocatrici.`,
        ].join(" "),
      );
    }


    console.log("");
    console.log(
      "────────────────────────────────────────",
    );
    console.log(
      "🏆 WTA LIVE SYNC COMPLETATO",
    );
    console.log(
      "────────────────────────────────────────",
    );


    console.log(
      `✅ Classifica:       ${result.length}/${WTA_RANKING_LIMIT}`,
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
    (
      error: unknown,
    ) => {
      console.error("");
      console.error(
        "❌ WTA LIVE SYNC FALLITO.",
      );


      if (
        error instanceof
        Error
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
      await prismaForShutdown
        ?.$disconnect();
    },
  );
