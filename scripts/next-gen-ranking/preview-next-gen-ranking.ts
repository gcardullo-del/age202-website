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


type NextGenPreviewRow = {
  playerId: string;

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
    "🎾 AGE202 — NEXT GEN Ranking Preview",
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


  const browser =
    await chromium.launch({
      headless: true,
    });


  const rows:
    NextGenPreviewRow[] =
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


        if (
          status !== null &&
          status >= 400
        ) {
          throw new Error(
            `ATP HTTP ${status}.`,
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


        rows.push({
          playerId:
            player.id,

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
          `   ✅ Rank ${
            parsed.currentRank ??
            "—"
          } · CH ${
            parsed.careerHighRank ??
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


        rows.push({
          playerId:
            player.id,

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
          `   ❌ ${message}`,
        );
      } finally {
        await page.close();
      }


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
    rows.filter(
      (row) =>
        row.success,
    );


  const failed =
    rows.filter(
      (row) =>
        !row.success,
    );


  const ranked =
    rows.filter(
      (row) =>
        row.currentRank !==
        null,
    );


  const unranked =
    rows.filter(
      (row) =>
        row.currentRank ===
        null,
    );


  console.log("");
  console.log(
    "────────────────────────────────────────",
  );

  console.log(
    "📊 PREVIEW NEXT GEN",
  );

  console.log(
    `✅ Riusciti: ${successful.length}`,
  );

  console.log(
    `❌ Falliti: ${failed.length}`,
  );

  console.log(
    `🎾 Ranked: ${ranked.length}`,
  );

  console.log(
    `➖ Unranked: ${unranked.length}`,
  );

  console.log("");


  for (
    const row
    of rows
  ) {
    console.log(
      [
        row.success
          ? "✅ "
          : "❌ ",
        row.name,
        " — Rank ",
        row.currentRank ??
          "—",
        " · CH ",
        row.careerHighRank ??
          "—",
        row.careerHighDate
          ? ` (${row.careerHighDate})`
          : "",
      ].join(
        "",
      ),
    );


    if (
      row.error
    ) {
      console.log(
        `   ↳ ${row.error}`,
      );
    }
  }


  console.log("");
  console.log(
    "────────────────────────────────────────",
  );

  console.log(
    "🛡️ PREVIEW COMPLETATA — database invariato.",
  );

  console.log("");
}


main()
  .catch(
    (error: unknown) => {
      console.error("");
      console.error(
        "❌ NEXT GEN Ranking Preview fallita.",
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