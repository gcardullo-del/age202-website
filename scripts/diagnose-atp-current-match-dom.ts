import "dotenv/config";

import {
  chromium,
} from "playwright";


const URL =
  "https://www.atptour.com/en/scores/current/us-open/560/results";

const TARGETS = [
  {
    label:
      "Rublev vs Virtanen",
    players: [
      "Andrey Rublev",
      "Otto Virtanen",
    ],
  },
  {
    label:
      "Djokovic vs Navone",
    players: [
      "Novak Djokovic",
      "Mariano Navone",
    ],
  },
  {
    label:
      "Zverev vs Sonego",
    players: [
      "Alexander Zverev",
      "Lorenzo Sonego",
    ],
  },
  {
    label:
      "Sakamoto R128 candidate",
    players: [
      "Rei Sakamoto",
    ],
  },
] as const;


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
    "🎾 AGE202 · ATP CURRENT MATCH DOM INSPECTOR",
  );
  console.log(
    "══════════════════════════════════════════",
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

    const matches =
      page.locator(
        ".match",
      );

    const matchCount =
      await matches.count();

    console.log(
      `🌐 ${URL}`,
    );
    console.log(
      `🎾 .match elements: ${matchCount}`,
    );
    console.log("");

    for (
      const target
      of TARGETS
    ) {
      console.log(
        `===== ${target.label} =====`,
      );

      let found =
        false;

      for (
        let index = 0;
        index < matchCount;
        index += 1
      ) {
        const match =
          matches.nth(
            index,
          );

        const text =
          normalizeText(
            await match
              .innerText()
              .catch(
                () => "",
              ),
          );

        if (
          !target.players.every(
            (player) =>
              text.includes(
                player,
              ),
          )
        ) {
          continue;
        }

        found =
          true;

        const rawText =
          await match
            .innerText()
            .catch(
              () => "",
            );

        const html =
          await match
            .innerHTML()
            .catch(
              () => "",
            );

        console.log(
          `MATCH INDEX: ${index}`,
        );
        console.log("");
        console.log(
          "INNER TEXT",
        );
        console.log(
          "----------",
        );
        console.log(
          rawText,
        );
        console.log("");
        console.log(
          "INNER HTML",
        );
        console.log(
          "----------",
        );
        console.log(
          html,
        );
        console.log("");

        const interestingSelectors = [
          ".match-header",
          ".player",
          ".player-info",
          ".player-stats",
          ".score",
          ".score-item",
          ".set",
          ".sets",
          ".winner",
          "[class*='score']",
          "[class*='player']",
          "[class*='winner']",
          "a[href*='/players/']",
        ];

        for (
          const selector
          of interestingSelectors
        ) {
          const locator =
            match.locator(
              selector,
            );

          const count =
            await locator.count();

          if (
            count === 0
          ) {
            continue;
          }

          console.log(
            `SELECTOR ${selector} · ${count}`,
          );

          for (
            let itemIndex = 0;
            itemIndex < Math.min(
              count,
              20,
            );
            itemIndex += 1
          ) {
            const item =
              locator.nth(
                itemIndex,
              );

            const itemText =
              normalizeText(
                await item
                  .innerText()
                  .catch(
                    () => "",
                  ),
              );

            const className =
              normalizeText(
                await item.getAttribute(
                  "class",
                ),
              );

            const ariaLabel =
              normalizeText(
                await item.getAttribute(
                  "aria-label",
                ),
              );

            const dataWinner =
              normalizeText(
                await item.getAttribute(
                  "data-winner",
                ),
              );

            console.log(
              [
                `  #${itemIndex}`,
                className
                  ? `class=${className}`
                  : null,
                ariaLabel
                  ? `aria-label=${ariaLabel}`
                  : null,
                dataWinner
                  ? `data-winner=${dataWinner}`
                  : null,
                `text=${itemText}`,
              ]
                .filter(
                  Boolean,
                )
                .join(
                  " | ",
                ),
            );
          }

          console.log("");
        }

        break;
      }

      if (!found) {
        console.log(
          "NOT FOUND",
        );
        console.log("");
      }
    }

    console.log(
      "✅ Diagnostic complete · database unchanged.",
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
        "❌ ATP current match DOM inspector crashed.",
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
