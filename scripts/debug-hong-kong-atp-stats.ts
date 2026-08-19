import "dotenv/config";

import {
  chromium,
} from "playwright";


const URL =
  "https://www.atptour.com/en/scores/stats-centre/archive/2026/336/ms001";


function shouldLogUrl(
  url: string,
): boolean {
  const value =
    url.toLowerCase();

  return (
    value.includes("score") ||
    value.includes("stats") ||
    value.includes("match") ||
    value.includes("tournament") ||
    value.includes("336") ||
    value.includes("ms001")
  );
}


async function main() {
  console.log("");
  console.log(
    "🎾 AGE202 · HONG KONG ATP STATS DEBUG",
  );
  console.log(
    "════════════════════════════════════════════",
  );
  console.log(
    `🌐 ${URL}`,
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

    const interestingResponses:
      Array<{
        status: number;
        contentType: string;
        url: string;
        preview: string;
      }> = [];


    page.on(
      "response",
      async (response) => {
        const url =
          response.url();

        if (
          !shouldLogUrl(
            url,
          )
        ) {
          return;
        }

        const contentType =
          response.headers()[
            "content-type"
          ] ??
          "";

        let preview =
          "";

        if (
          contentType.includes(
            "json",
          ) ||
          contentType.includes(
            "text",
          )
        ) {
          preview =
            await response
              .text()
              .then(
                (value) =>
                  value
                    .replace(
                      /\s+/g,
                      " ",
                    )
                    .slice(
                      0,
                      700,
                    ),
              )
              .catch(
                () =>
                  "",
              );
        }

        interestingResponses.push({
          status:
            response.status(),

          contentType,

          url,

          preview,
        });
      },
    );


    const response =
      await page.goto(
        URL,
        {
          waitUntil:
            "domcontentloaded",

          timeout:
            60_000,
        },
      );


    console.log(
      `HTTP: ${response?.status() ?? "?"}`,
    );


    /*
     * Diamo tempo alla pagina ATP di completare eventuali
     * chiamate XHR/fetch del suo Stats Centre.
     */
    await page.waitForTimeout(
      12_000,
    );


    const bodyText =
      (
        await page
          .locator(
            "body",
          )
          .innerText()
          .catch(
            () =>
              "",
          )
      )
        .replace(
          /\s+/g,
          " ",
        )
        .trim();


    console.log("");
    console.log(
      "📄 BODY CHECK",
    );
    console.log(
      `Contains "wins the match": ${/wins the match/i.test(bodyText)}`,
    );
    console.log(
      `Contains "Alexander Bublik": ${/Alexander Bublik/i.test(bodyText)}`,
    );
    console.log(
      `Contains "Lorenzo Musetti": ${/Lorenzo Musetti/i.test(bodyText)}`,
    );
    console.log(
      `Contains "Final": ${/\bFinal\b/i.test(bodyText)}`,
    );

    console.log("");
    console.log(
      "📄 BODY PREVIEW",
    );
    console.log(
      bodyText.slice(
        0,
        2500,
      ),
    );


    console.log("");
    console.log(
      "🌐 INTERESTING NETWORK RESPONSES",
    );
    console.log(
      `Found: ${interestingResponses.length}`,
    );


    for (
      const item
      of interestingResponses
    ) {
      console.log("");
      console.log(
        `[${item.status}] ${item.url}`,
      );
      console.log(
        `Content-Type: ${item.contentType || "?"}`,
      );

      if (
        item.preview
      ) {
        console.log(
          `Preview: ${item.preview}`,
        );
      }
    }


    console.log("");
    console.log(
      "✅ DEBUG COMPLETED",
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
      "❌ Hong Kong ATP debug failed.",
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
