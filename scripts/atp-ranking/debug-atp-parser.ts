import "dotenv/config";

import {
  chromium,
} from "playwright";

import {
  parseAtpLiveRanking,
} from "./atp-live-parser";

import {
  validateAtpLiveRanking,
} from "./atp-live-validator";

import {
  ATP_LIVE_RANKING_URL,
} from "./types";


const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
  "AppleWebKit/537.36 (KHTML, like Gecko) " +
  "Chrome/151.0.0.0 Safari/537.36";


async function main() {
  console.log(
    "🎾 AGE202 ATP LIVE PARSER",
  );

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

    console.log(
      "🌐 Opening ATP Live Ranking...",
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

    const status =
      response?.status() ??
      null;

    console.log(
      `📡 Status: ${status ?? "unknown"}`,
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
      5_000,
    );

    const entries =
      await parseAtpLiveRanking(
        page,
      );

    const validation =
      validateAtpLiveRanking(
        entries,
      );

    console.log(
      `🎾 Players parsed: ${entries.length}`,
    );

    console.log(
      `🔢 Unique ranks: ${new Set(
        entries.map(
          (entry) =>
            entry.rank,
        ),
      ).size}`,
    );

    console.log("");

    for (
      const entry
      of entries.slice(
        0,
        10,
      )
    ) {
      console.log(
        `${String(entry.rank).padStart(3, " ")}  ${entry.name.padEnd(28, " ")} ${entry.points.toLocaleString("en-US").padStart(7, " ")}  ${entry.profileSlug}`,
      );
    }

    if (
      entries.length > 10
    ) {
      console.log(
        "   ...",
      );
    }

    const lastEntry =
      entries.at(-1);

    if (lastEntry) {
      console.log("");
      console.log(
        `🔻 Rank ${lastEntry.rank}: ${lastEntry.name} · ${lastEntry.points.toLocaleString("en-US")} points`,
      );
    }

    console.log("");

    if (
      validation.warnings.length >
      0
    ) {
      console.log(
        "⚠️ Warnings:",
      );

      for (
        const warning
        of validation.warnings
      ) {
        console.log(
          `   - ${warning}`,
        );
      }
    }

    if (!validation.valid) {
      console.log(
        "❌ ATP TOP 150 INVALID",
      );

      for (
        const error
        of validation.errors
      ) {
        console.log(
          `   - ${error}`,
        );
      }

      process.exitCode = 1;

      return;
    }

    console.log(
      "✅ ATP TOP 150 VALID",
    );
  } finally {
    await browser.close();
  }
}


main().catch(
  (error) => {
    console.error(
      "❌ ATP parser debug failed:",
      error,
    );

    process.exitCode = 1;
  },
);