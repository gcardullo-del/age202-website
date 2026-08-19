import "dotenv/config";

import {
  chromium,
} from "playwright";


const URL =
  "https://www.atptour.com/en/scores/stats-centre/archive/2026/336/ms001";


async function main() {
  console.log("");
  console.log(
    "🎾 AGE202 · HONG KONG RENDERED DOM DEBUG",
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

    await page.goto(
      URL,
      {
        waitUntil:
          "domcontentloaded",

        timeout:
          60_000,
      },
    );

    /*
     * Diamo alla SPA ATP il tempo di ricevere e decodificare
     * il payload Stats Plus e renderizzare il match.
     */
    await page.waitForTimeout(
      15_000,
    );

    /*
     * IMPORTANTE:
     * dentro page.evaluate NON definiamo helper locali.
     * tsx/esbuild può trasformarli introducendo __name,
     * che non esiste nel contesto browser di Playwright.
     */
    const result =
      await page.evaluate(() => {
        const bodyText =
          (
            document.body?.innerText ??
            ""
          )
            .replace(/\u00a0/g, " ")
            .replace(/\s+/g, " ")
            .trim();

        const playerLinks =
          Array.from(
            document.querySelectorAll(
              'a[href*="/players/"]',
            ),
          ).map(
            (anchor) => ({
              text:
                (
                  anchor.textContent ??
                  ""
                )
                  .replace(/\u00a0/g, " ")
                  .replace(/\s+/g, " ")
                  .trim(),

              href:
                anchor.getAttribute(
                  "href",
                ),
            }),
          );

        const uniquePlayerLinks =
          Array.from(
            new Map(
              playerLinks.map(
                (item) => [
                  `${item.text}|${item.href ?? ""}`,
                  item,
                ],
              ),
            ).values(),
          );

        const interestingText =
          Array.from(
            document.querySelectorAll(
              "body *",
            ),
          )
            .map(
              (element) =>
                (
                  element.textContent ??
                  ""
                )
                  .replace(/\u00a0/g, " ")
                  .replace(/\s+/g, " ")
                  .trim(),
            )
            .filter(
              (text) =>
                Boolean(
                  text,
                ) &&
                (
                  /bublik/i.test(
                    text,
                  ) ||
                  /musetti/i.test(
                    text,
                  ) ||
                  /7-6/i.test(
                    text,
                  ) ||
                  /6-3/i.test(
                    text,
                  ) ||
                  /\bfinal\b/i.test(
                    text,
                  )
                ),
            )
            .sort(
              (
                first,
                second,
              ) =>
                first.length -
                second.length,
            )
            .slice(
              0,
              80,
            );

        return {
          bodyText,
          uniquePlayerLinks,
          interestingText,
        };
      });


    console.log(
      "🔎 BODY CHECK",
    );
    console.log(
      `Contains Bublik:  ${/bublik/i.test(result.bodyText)}`,
    );
    console.log(
      `Contains Musetti: ${/musetti/i.test(result.bodyText)}`,
    );
    console.log(
      `Contains 7-6:     ${/7-6/i.test(result.bodyText)}`,
    );
    console.log(
      `Contains 6-3:     ${/6-3/i.test(result.bodyText)}`,
    );
    console.log(
      `Contains Final:   ${/\bfinal\b/i.test(result.bodyText)}`,
    );


    console.log("");
    console.log(
      "👤 PLAYER LINKS",
    );

    if (
      result.uniquePlayerLinks.length ===
      0
    ) {
      console.log(
        "No ATP player links found.",
      );
    } else {
      for (
        const link
        of result.uniquePlayerLinks
      ) {
        console.log(
          `• ${link.text || "(no text)"} → ${link.href ?? "(no href)"}`,
        );
      }
    }


    console.log("");
    console.log(
      "🎯 INTERESTING RENDERED TEXT",
    );

    if (
      result.interestingText.length ===
      0
    ) {
      console.log(
        "No matching rendered text found.",
      );
    } else {
      for (
        const text
        of result.interestingText
      ) {
        console.log(
          `• ${text.slice(0, 1000)}`,
        );
      }
    }


    console.log("");
    console.log(
      "📄 BODY PREVIEW",
    );
    console.log(
      result.bodyText.slice(
        0,
        5000,
      ),
    );


    console.log("");
    console.log(
      "✅ RENDERED DOM DEBUG COMPLETED",
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
      "❌ Hong Kong rendered DOM debug failed.",
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
