import "dotenv/config";

import {
  writeFile,
} from "node:fs/promises";

import {
  chromium,
} from "playwright";


const URL =
  "https://www.atptour.com/en/scores/current/us-open/560/results";

const OUTPUT_PATH =
  "atp-current-us-open-results-diagnostic.txt";


function normalizeText(
  value: string | null | undefined,
): string {
  return (
    value
      ?.replace(/\u00a0/g, " ")
      .replace(/\s+/g, " ")
      .trim() ??
    ""
  );
}


async function main() {
  console.log("");
  console.log(
    "🎾 AGE202 · ATP CURRENT RESULTS DOM DIAGNOSTIC",
  );
  console.log(
    "════════════════════════════════════════════",
  );
  console.log(
    `🌐 ${URL}`,
  );

  const browser =
    await chromium.launch({
      headless: true,
    });

  try {
    const context =
      await browser.newContext({
        locale: "en-US",
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131.0.0.0 Safari/537.36",
      });

    const page =
      await context.newPage();

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

    await page.waitForTimeout(
      12_000,
    );

    const title =
      await page.title();

    const rawBodyText =
      await page
        .locator("body")
        .innerText()
        .catch(
          () => "",
        );

    const bodyText =
      normalizeText(
        rawBodyText,
      );

    const playerLinks =
      await page
        .locator(
          'a[href*="/players/"]',
        )
        .count();

    const allElements =
      page.locator(
        "body *",
      );

    const elementCount =
      await allElements.count();

    const interesting: string[] =
      [];

    for (
      let index = 0;
      index < elementCount;
      index += 1
    ) {
      const locator =
        allElements.nth(
          index,
        );

      const text =
        normalizeText(
          await locator
            .innerText()
            .catch(
              () => "",
            ),
        );

      if (!text) {
        continue;
      }

      if (
        /Game Set and Match/i.test(
          text,
        ) ||
        /wins the match/i.test(
          text,
        ) ||
        /\bRound of 128\b/i.test(
          text,
        ) ||
        /\bRound of 64\b/i.test(
          text,
        ) ||
        /\bRound of 32\b/i.test(
          text,
        ) ||
        /\bRound of 16\b/i.test(
          text,
        ) ||
        /\bQuarter[- ]?Final/i.test(
          text,
        ) ||
        /\bSemi[- ]?Final/i.test(
          text,
        ) ||
        /\bFinal\b/i.test(
          text,
        )
      ) {
        const tagName =
          await locator.evaluate(
            (element) =>
              element.tagName.toLowerCase(),
          );

        const className =
          normalizeText(
            await locator.getAttribute(
              "class",
            ),
          );

        interesting.push(
          [
            `#${index}`,
            `tag=${tagName}`,
            className
              ? `class=${className}`
              : "class=(none)",
            `text=${text}`,
          ].join(
            " | ",
          ),
        );
      }
    }

    const report = [
      "AGE202 · ATP CURRENT RESULTS DOM DIAGNOSTIC",
      "==========================================",
      "",
      `URL: ${URL}`,
      `HTTP: ${response?.status() ?? "n/a"}`,
      `TITLE: ${title}`,
      `PLAYER LINKS: ${playerLinks}`,
      `BODY ELEMENTS: ${elementCount}`,
      "",
      `BODY HAS "Game Set and Match": ${/Game Set and Match/i.test(bodyText)}`,
      `BODY HAS "wins the match": ${/wins the match/i.test(bodyText)}`,
      `BODY HAS "Round of 16": ${/\bRound of 16\b/i.test(bodyText)}`,
      `BODY HAS "Quarter-Final": ${/\bQuarter[- ]?Final/i.test(bodyText)}`,
      "",
      "INTERESTING ELEMENTS",
      "====================",
      ...interesting.slice(
        0,
        500,
      ),
      "",
      "RAW BODY TEXT",
      "=============",
      rawBodyText,
      "",
    ].join(
      "\n",
    );

    await writeFile(
      OUTPUT_PATH,
      report,
      "utf8",
    );

    console.log(
      `📄 Title: ${title}`,
    );
    console.log(
      `🔗 Player links: ${playerLinks}`,
    );
    console.log(
      `🧩 Interesting elements: ${interesting.length}`,
    );
    console.log(
      `💾 Diagnostic written: ${OUTPUT_PATH}`,
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
        "❌ ATP current-results diagnostic crashed.",
      );
      console.error(
        error instanceof Error
          ? error.message
          : error,
      );
      console.error("");

      process.exitCode =
        1;
    },
  );
