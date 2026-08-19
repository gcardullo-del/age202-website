import "dotenv/config";

import {
  chromium,
  type Response,
} from "playwright";


const PAGE_URL =
  "https://www.atptour.com/en/scores/stats-centre/archive/2026/336/ms001";

const TARGET_FRAGMENT =
  "/api/stats-plus/v1/ytdStats/year/2026/eventId/336/matchId/MS001";


type CapturedJson = {
  url: string;
  status: number;
  contentType: string;
  json: unknown;
};


function isTargetResponse(
  response: Response,
): boolean {
  const url =
    response.url();

  return (
    url.includes(
      TARGET_FRAGMENT,
    ) &&
    response.status() ===
      200
  );
}


async function main() {
  console.log("");
  console.log(
    "🎾 AGE202 · HONG KONG NETWORK JSON INTERCEPTOR",
  );
  console.log(
    "════════════════════════════════════════════",
  );
  console.log(
    `🌐 ${PAGE_URL}`,
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


    const capturedPromise =
      new Promise<CapturedJson>(
        (resolve, reject) => {
          let settled =
            false;

          const timeout =
            setTimeout(
              () => {
                if (settled) {
                  return;
                }

                settled =
                  true;

                reject(
                  new Error(
                    "Timed out waiting for ATP Stats Plus JSON response.",
                  ),
                );
              },
              30_000,
            );


          page.on(
            "response",
            async (response) => {
              if (
                settled ||
                !isTargetResponse(
                  response,
                )
              ) {
                return;
              }

              const contentType =
                response.headers()[
                  "content-type"
                ] ??
                "";

              if (
                !contentType.includes(
                  "application/json",
                )
              ) {
                return;
              }

              try {
                const json =
                  await response.json();

                settled =
                  true;

                clearTimeout(
                  timeout,
                );

                resolve({
                  url:
                    response.url(),

                  status:
                    response.status(),

                  contentType,

                  json,
                });
              } catch (error) {
                settled =
                  true;

                clearTimeout(
                  timeout,
                );

                reject(
                  error,
                );
              }
            },
          );
        },
      );


    const navigation =
      await page.goto(
        PAGE_URL,
        {
          waitUntil:
            "domcontentloaded",

          timeout:
            60_000,
        },
      );


    console.log(
      `PAGE HTTP: ${navigation?.status() ?? "?"}`,
    );

    console.log(
      "⏳ Waiting for ATP Stats Plus JSON...",
    );


    const captured =
      await capturedPromise;


    console.log("");
    console.log(
      "🎯 STATS PLUS RESPONSE INTERCEPTED",
    );
    console.log(
      `Status: ${captured.status}`,
    );
    console.log(
      `Content-Type: ${captured.contentType}`,
    );
    console.log(
      `URL: ${captured.url}`,
    );


    console.log("");
    console.log(
      "📦 FULL JSON",
    );
    console.log(
      JSON.stringify(
        captured.json,
        null,
        2,
      ),
    );


    console.log("");
    console.log(
      "🔎 TOP-LEVEL KEYS",
    );

    if (
      captured.json &&
      typeof captured.json ===
        "object" &&
      !Array.isArray(
        captured.json,
      )
    ) {
      console.log(
        Object.keys(
          captured.json as Record<
            string,
            unknown
          >,
        ),
      );
    } else {
      console.log(
        "Response root is not an object.",
      );
    }


    console.log("");
    console.log(
      "✅ NETWORK JSON DEBUG COMPLETED",
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
      "❌ Hong Kong network JSON debug failed.",
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
