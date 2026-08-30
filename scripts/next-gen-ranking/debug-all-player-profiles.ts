import "dotenv/config";

import {
  chromium,
} from "playwright";

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


type PlayerDebugResult = {
  name: string;

  currentRank: number | null;

  careerHighRank: number | null;

  careerHighDate: string | null;

  success: boolean;

  error: string | null;
};


async function main() {
  console.log("");
  console.log(
    "🎾 AGE202 — NEXT GEN All Player Profiles",
  );

  console.log(
    "────────────────────────────────────────",
  );


  const players =
    getActiveNextGenRankingPlayers();


  console.log(
    `👥 Giocatori da verificare: ${players.length}`,
  );

  console.log("");


  const browser =
    await chromium.launch({
      headless: true,
    });


  const results:
    PlayerDebugResult[] =
      [];


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

      console.log(
        `🔗 ${player.atpProfileUrl}`,
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


        const success =
          parsed.currentRank !==
          null;


        results.push({
          name:
            player.name,

          currentRank:
            parsed.currentRank,

          careerHighRank:
            parsed.careerHighRank,

          careerHighDate:
            parsed.careerHighDate,

          success,

          error:
            success
              ? null
              : "Ranking corrente non trovato.",
        });


        console.log(
          `✅ Rank: ${
            parsed.currentRank ??
            "—"
          }`,
        );

        console.log(
          `🏆 Career High: ${
            parsed.careerHighRank ??
            "—"
          }`,
        );

        console.log(
          `📅 Career High Date: ${
            parsed.careerHighDate ??
            "—"
          }`,
        );
      } catch (
        error: unknown
      ) {
        const message =
          error instanceof Error
            ? error.message
            : String(
                error,
              );


        results.push({
          name:
            player.name,

          currentRank:
            null,

          careerHighRank:
            null,

          careerHighDate:
            null,

          success:
            false,

          error:
            message,
        });


        console.log(
          `❌ ${message}`,
        );
      } finally {
        await page.close();
      }


      console.log("");


      /*
       * Piccola pausa fra i profili.
       *
       * Evitiamo di martellare ATP
       * con richieste consecutive.
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


  const successful =
    results.filter(
      (result) =>
        result.success,
    );


  const failed =
    results.filter(
      (result) =>
        !result.success,
    );


  console.log(
    "────────────────────────────────────────",
  );

  console.log(
    "📊 RISULTATO FINALE",
  );

  console.log(
    `✅ Riusciti: ${successful.length}/${results.length}`,
  );

  console.log(
    `❌ Falliti: ${failed.length}/${results.length}`,
  );

  console.log("");


  for (
    const result
    of results
  ) {
    const status =
      result.success
        ? "✅"
        : "❌";


    console.log(
      [
        status,
        " ",
        result.name,
        " — Rank ",
        result.currentRank ??
          "—",
        " · CH ",
        result.careerHighRank ??
          "—",
        result.careerHighDate
          ? ` (${result.careerHighDate})`
          : "",
      ].join(
        "",
      ),
    );


    if (
      result.error
    ) {
      console.log(
        `   ↳ ${result.error}`,
      );
    }
  }


  console.log("");
  console.log(
    "🛡️ Test completato — database invariato.",
  );

  console.log("");
}


main()
  .catch(
    (error: unknown) => {
      console.error("");
      console.error(
        "❌ NEXT GEN all-player debug fallito.",
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
  );