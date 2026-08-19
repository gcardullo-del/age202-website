import "dotenv/config";

import {
  chromium,
} from "playwright";


const STATS_URL =
  "https://itp-atp-sls.infosys-platforms.com/prod/api/stats-plus/v1/ytdStats/year/2026/eventId/336/matchId/MS001";


async function main() {
  console.log("");
  console.log(
    "🎾 AGE202 · HONG KONG ATP STATS JSON DEBUG",
  );
  console.log(
    "════════════════════════════════════════════",
  );
  console.log(
    `🌐 ${STATS_URL}`,
  );
  console.log(
    "🛡️ Diagnostic only · DATABASE UNCHANGED",
  );
  console.log("");

  const browser =
    await chromium.launch({
      headless:
        true,
    });

  try {
    const context =
      await browser.newContext({
        locale:
          "en-US",

        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131.0.0.0 Safari/537.36",
      });

    const page =
      await context.newPage();

    const response =
      await page.request.get(
        STATS_URL,
        {
          headers: {
            accept:
              "application/json, text/plain, */*",

            origin:
              "https://www.atptour.com",

            referer:
              "https://www.atptour.com/",
          },

          timeout:
            60_000,
        },
      );

    console.log(
      `HTTP: ${response.status()}`,
    );

    console.log(
      `Content-Type: ${response.headers()["content-type"] ?? "?"}`,
    );

    if (!response.ok()) {
      const body =
        await response.text();

      throw new Error(
        `ATP Stats API returned ${response.status()}: ${body.slice(0, 1000)}`,
      );
    }

    const rawText =
      await response.text();

    let parsed:
      unknown;

    try {
      parsed =
        JSON.parse(
          rawText,
        );
    } catch {
      console.log("");
      console.log(
        "❌ Response is not valid JSON.",
      );
      console.log(
        rawText.slice(
          0,
          5000,
        ),
      );

      process.exitCode =
        1;

      return;
    }


    console.log("");
    console.log(
      "📦 FULL JSON",
    );
    console.log(
      JSON.stringify(
        parsed,
        null,
        2,
      ),
    );


    console.log("");
    console.log(
      "🔎 TOP-LEVEL KEYS",
    );

    if (
      parsed &&
      typeof parsed ===
        "object" &&
      !Array.isArray(
        parsed,
      )
    ) {
      console.log(
        Object.keys(
          parsed,
        ),
      );
    } else {
      console.log(
        "Response root is not an object.",
      );
    }


    console.log("");
    console.log(
      "✅ JSON DEBUG COMPLETED",
    );
    console.log(
      "🛡️ DATABASE UNCHANGED",
    );
    console.log("");
  } finally {
    await browser.close();
  }
}


main().catch(
  (error: unknown) => {
    console.error("");
    console.error(
      "❌ Hong Kong ATP Stats JSON debug failed.",
    );

    if (
      error instanceof Error
    ) {
      console.error(
        error.stack ??
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
);
