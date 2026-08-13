import "dotenv/config";

import {
  chromium,
} from "playwright";

import {
  ATP_LIVE_RANKING_URL,
} from "./types";

import {
  parseAtpLiveRanking,
} from "./atp-live-parser";

import {
  validateAtpLiveRanking,
} from "./atp-live-validator";


const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
  "AppleWebKit/537.36 (KHTML, like Gecko) " +
  "Chrome/151.0.0.0 Safari/537.36";


function compact(
  value: string,
): string {
  return value
    .replace(
      /\s+/g,
      " ",
    )
    .trim();
}


async function main() {
  console.log("");
  console.log(
    "🎾 AGE202 — ATP Ranking Row Inspector",
  );
  console.log(
    "────────────────────────────────────────",
  );

  const browser =
    await chromium.launch({
      headless: true,
    });

  try {
    const context =
      await browser.newContext({
        viewport: {
          width: 1440,
          height: 1200,
        },
        locale:
          "en-US",
        userAgent:
          USER_AGENT,
      });

    const page =
      await context.newPage();

    console.log(
      "🌐 Lettura ATP Live Rankings...",
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
      `📡 Ranking HTTP: ${status ?? "unknown"}`,
    );

    if (
      status !== null &&
      status >= 400
    ) {
      throw new Error(
        `ATP ranking ha risposto con HTTP ${status}.`,
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

    if (!validation.valid) {
      throw new Error(
        [
          "ATP ranking non valida.",
          ...validation.errors,
        ].join("\n"),
      );
    }

    const target =
      entries.find(
        (entry) =>
          entry.profileSlug ===
          "martin-damm",
      );

    if (!target) {
      throw new Error(
        "Martin Damm non trovato nella classifica ATP.",
      );
    }

    console.log("");
    console.log(
      `👤 Target: ${target.name}`,
    );
    console.log(
      `🏆 Rank: ${target.rank}`,
    );
    console.log(
      `🔗 Slug: ${target.profileSlug}`,
    );

    const rows =
      page.locator(
        "tr",
      );

    const rowCount =
      await rows.count();

    let found = false;

    for (
      let index = 0;
      index < rowCount;
      index += 1
    ) {
      const row =
        rows.nth(
          index,
        );

      const playerLink =
        row
          .locator(
            'a[href*="/players/"][href*="/overview"]',
          )
          .first();

      if (
        await playerLink.count() ===
        0
      ) {
        continue;
      }

      const href =
        await playerLink.getAttribute(
          "href",
        );

      if (
        !href ||
        !href.includes(
          "/martin-damm/",
        )
      ) {
        continue;
      }

      found = true;

      console.log("");
      console.log(
        "────────────────────────────────────────",
      );
      console.log(
        `✅ ROW TROVATA — index ${index}`,
      );
      console.log(
        "────────────────────────────────────────",
      );

      const rowText =
        compact(
          await row.innerText(),
        );

      console.log("");
      console.log(
        "📝 ROW TEXT",
      );
      console.log(
        rowText || "—",
      );

      const rowHtml =
        await row.evaluate(
          (element) =>
            element.outerHTML,
        );

      console.log("");
      console.log(
        "🧩 ROW HTML",
      );
      console.log(
        rowHtml,
      );

      console.log("");
      console.log(
        "📦 CELLS",
      );
      console.log(
        "────────────────────────────────────────",
      );

      const cells =
        row.locator(
          "td",
        );

      const cellCount =
        await cells.count();

      console.log(
        `Numero celle: ${cellCount}`,
      );

      for (
        let cellIndex = 0;
        cellIndex < cellCount;
        cellIndex += 1
      ) {
        const cell =
          cells.nth(
            cellIndex,
          );

        const text =
          compact(
            await cell.innerText(),
          );

        const html =
          await cell.evaluate(
            (element) =>
              element.outerHTML,
          );

        console.log("");
        console.log(
          `CELL ${cellIndex}`,
        );
        console.log(
          `TEXT: ${text || "—"}`,
        );
        console.log(
          `HTML: ${html}`,
        );
      }

      console.log("");
      console.log(
        "🖼️ IMMAGINI NELLA RIGA",
      );
      console.log(
        "────────────────────────────────────────",
      );

      const images =
        row.locator(
          "img",
        );

      const imageCount =
        await images.count();

      console.log(
        `Immagini: ${imageCount}`,
      );

      for (
        let imageIndex = 0;
        imageIndex < imageCount;
        imageIndex += 1
      ) {
        const image =
          images.nth(
            imageIndex,
          );

        console.log("");
        console.log(
          `IMG ${imageIndex}`,
        );

        console.log(
          "alt:",
          await image.getAttribute(
            "alt",
          ),
        );

        console.log(
          "src:",
          await image.getAttribute(
            "src",
          ),
        );

        console.log(
          "srcset:",
          await image.getAttribute(
            "srcset",
          ),
        );

        console.log(
          "class:",
          await image.getAttribute(
            "class",
          ),
        );

        console.log(
          "title:",
          await image.getAttribute(
            "title",
          ),
        );

        console.log(
          "data-country:",
          await image.getAttribute(
            "data-country",
          ),
        );

        console.log(
          "data-country-code:",
          await image.getAttribute(
            "data-country-code",
          ),
        );

        console.log(
          "aria-label:",
          await image.getAttribute(
            "aria-label",
          ),
        );
      }

      console.log("");
      console.log(
        "🏷️ TUTTI GLI ELEMENTI CON ATTRIBUTI INTERESSANTI",
      );
      console.log(
        "────────────────────────────────────────",
      );

      const interestingElements =
        await row
          .locator(
            "*",
          )
          .evaluateAll(
            (elements) =>
              elements
                .map(
                  (element) => {
                    const attributes =
                      Array.from(
                        element.attributes,
                      ).reduce<
                        Record<
                          string,
                          string
                        >
                      >(
                        (
                          accumulator,
                          attribute,
                        ) => {
                          accumulator[
                            attribute.name
                          ] =
                            attribute.value;

                          return accumulator;
                        },
                        {},
                      );

                    return {
                      tag:
                        element.tagName,
                      text:
                        (
                          element.textContent ??
                          ""
                        )
                          .replace(
                            /\s+/g,
                            " ",
                          )
                          .trim(),
                      attributes,
                    };
                  },
                )
                .filter(
                  (item) => {
                    const haystack =
                      JSON.stringify(
                        item,
                      ).toLowerCase();

                    return (
                      haystack.includes(
                        "country",
                      ) ||
                      haystack.includes(
                        "nation",
                      ) ||
                      haystack.includes(
                        "flag",
                      ) ||
                      haystack.includes(
                        "usa",
                      ) ||
                      haystack.includes(
                        "united states",
                      ) ||
                      haystack.includes(
                        "damm",
                      )
                    );
                  },
                ),
          );

      if (
        interestingElements.length ===
        0
      ) {
        console.log(
          "Nessun elemento interessante rilevato.",
        );
      } else {
        for (
          const element
          of interestingElements
        ) {
          console.log("");
          console.log(
            JSON.stringify(
              element,
              null,
              2,
            ),
          );
        }
      }

      break;
    }

    if (!found) {
      throw new Error(
        "Riga HTML di Martin Damm non trovata.",
      );
    }

    console.log("");
    console.log(
      "────────────────────────────────────────",
    );
    console.log(
      "🏁 Ranking row inspection completed.",
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
      "❌ ATP ranking row inspection failed.",
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