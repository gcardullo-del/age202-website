import "dotenv/config";

import {
  chromium,
} from "playwright";

import {
  parseAtpPlayerProfile,
} from "./atp-player-profile-parser";

import {
  NEXT_GEN_RANKING_PLAYERS,
} from "./players";


const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
  "AppleWebKit/537.36 (KHTML, like Gecko) " +
  "Chrome/151.0.0.0 Safari/537.36";


async function main() {
  console.log("");
  console.log(
    "🎾 AGE202 — NEXT GEN Player Profile Parser",
  );

  console.log(
    "────────────────────────────────────",
  );


  const player =
    NEXT_GEN_RANKING_PLAYERS.find(
      (candidate) =>
        candidate.id ===
        "moise-kouame",
    );


  if (!player) {
    throw new Error(
      "Moïse Kouamé non trovato nel NEXT GEN registry.",
    );
  }


  console.log(
    `👤 Player: ${player.name}`,
  );

  console.log(
    `🔗 ATP: ${player.atpProfileUrl}`,
  );

  console.log("");


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


    console.log(
      "⏳ Attesa dati ATP...",
    );


    await page.waitForTimeout(
      8_000,
    );


    const parsed =
      await parseAtpPlayerProfile(
        page,
      );


    console.log("");
    console.log(
      "✅ DATI ESTRATTI",
    );

    console.log(
      `Current Rank: ${
        parsed.currentRank ??
        "—"
      }`,
    );

    console.log(
      `Career High: ${
        parsed.careerHighRank ??
        "—"
      }`,
    );

    console.log(
      `Career High Date: ${
        parsed.careerHighDate ??
        "—"
      }`,
    );


    console.log("");
    console.log(
      "────────────────────────────────────",
    );

    console.log(
      "🛡️ Debug completato — database invariato.",
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
        "❌ NEXT GEN parser fallito.",
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