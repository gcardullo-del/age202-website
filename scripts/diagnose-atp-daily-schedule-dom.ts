import "dotenv/config";

import {
  writeFile,
} from "node:fs/promises";

import {
  chromium,
} from "playwright";


const SOURCE_URL =
  "https://www.atptour.com/en/scores/current/us-open/560/daily-schedule";

const OUTPUT_FILE =
  "atp-daily-schedule-diagnostic.txt";


function cleanText(
  value:
    | string
    | null
    | undefined,
): string {
  return (
    value
      ?.replace(
        /\u00a0/g,
        " ",
      )
      .replace(
        /\s+/g,
        " ",
      )
      .trim() ??
    ""
  );
}


async function main() {
  console.log("");
  console.log(
    "🎾 AGE202 · ATP DAILY SCHEDULE DOM DIAGNOSTIC",
  );
  console.log(
    "════════════════════════════════════════════",
  );
  console.log(
    "🛡️ READ ONLY · DATABASE UNCHANGED",
  );
  console.log("");


  const browser =
    await chromium.launch({
      headless: true,
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


    console.log(
      `🔗 Opening: ${SOURCE_URL}`,
    );


    const response =
      await page.goto(
        SOURCE_URL,
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


    const finalUrl =
      page.url();


    const bodyText =
      cleanText(
        await page
          .locator(
            "body",
          )
          .innerText()
          .catch(
            () => "",
          ),
      );


    const headings =
      await page
        .locator(
          "h1, h2, h3, h4, h5, h6",
        )
        .evaluateAll(
          (elements) =>
            elements.map(
              (element) => ({
                tag:
                  element.tagName,

                text:
                  element.textContent
                    ?.replace(
                      /\s+/g,
                      " ",
                    )
                    .trim() ??
                  "",

                className:
                  element.getAttribute(
                    "class",
                  ) ??
                  "",
              }),
            ),
        );


    const playerLinks =
      await page
        .locator(
          'a[href*="/players/"]',
        )
        .evaluateAll(
          (elements) =>
            elements.map(
              (element) => ({
                text:
                  element.textContent
                    ?.replace(
                      /\s+/g,
                      " ",
                    )
                    .trim() ??
                  "",

                href:
                  element.getAttribute(
                    "href",
                  ) ??
                  "",

                className:
                  element.getAttribute(
                    "class",
                  ) ??
                  "",
              }),
            ),
        );


    const interestingElements =
      await page
        .locator(
          [
            '[class*="match"]',
            '[class*="score"]',
            '[class*="schedule"]',
            '[class*="court"]',
            '[class*="day"]',
            '[class*="order"]',
          ].join(
            ", ",
          ),
        )
        .evaluateAll(
          (elements) =>
            elements
              .slice(
                0,
                250,
              )
              .map(
                (element) => ({
                  tag:
                    element.tagName,

                  className:
                    element.getAttribute(
                      "class",
                    ) ??
                    "",

                  text:
                    element.textContent
                      ?.replace(
                        /\s+/g,
                        " ",
                      )
                      .trim()
                      .slice(
                        0,
                        500,
                      ) ??
                    "",
                }),
              ),
        );


    const lines: string[] =
      [];


    lines.push(
      "AGE202 · ATP DAILY SCHEDULE DOM DIAGNOSTIC",
    );

    lines.push(
      "==========================================",
    );

    lines.push(
      "",
    );

    lines.push(
      `Requested URL: ${SOURCE_URL}`,
    );

    lines.push(
      `Final URL: ${finalUrl}`,
    );

    lines.push(
      `HTTP status: ${response?.status() ?? "unknown"}`,
    );

    lines.push(
      `Title: ${title}`,
    );

    lines.push(
      "",
    );


    lines.push(
      "HEADINGS",
    );

    lines.push(
      "--------",
    );


    if (
      headings.length ===
      0
    ) {
      lines.push(
        "(none)",
      );
    } else {
      for (
        const heading
        of headings
      ) {
        lines.push(
          `${heading.tag} | ${heading.className}`,
        );

        lines.push(
          heading.text,
        );

        lines.push(
          "",
        );
      }
    }


    lines.push(
      "",
    );

    lines.push(
      "PLAYER LINKS",
    );

    lines.push(
      "------------",
    );

    lines.push(
      `Count: ${playerLinks.length}`,
    );

    lines.push(
      "",
    );


    for (
      const link
      of playerLinks
    ) {
      lines.push(
        `TEXT: ${link.text}`,
      );

      lines.push(
        `HREF: ${link.href}`,
      );

      lines.push(
        `CLASS: ${link.className}`,
      );

      lines.push(
        "",
      );
    }


    lines.push(
      "",
    );

    lines.push(
      "INTERESTING ELEMENTS",
    );

    lines.push(
      "--------------------",
    );

    lines.push(
      `Count: ${interestingElements.length}`,
    );

    lines.push(
      "",
    );


    for (
      const element
      of interestingElements
    ) {
      lines.push(
        `TAG: ${element.tag}`,
      );

      lines.push(
        `CLASS: ${element.className}`,
      );

      lines.push(
        `TEXT: ${element.text}`,
      );

      lines.push(
        "",
      );
    }


    lines.push(
      "",
    );

    lines.push(
      "BODY TEXT",
    );

    lines.push(
      "---------",
    );

    lines.push(
      bodyText,
    );


    await writeFile(
      OUTPUT_FILE,
      lines.join(
        "\n",
      ),
      "utf8",
    );


    console.log(
      `📡 HTTP: ${response?.status() ?? "unknown"}`,
    );

    console.log(
      `📄 Title: ${title}`,
    );

    console.log(
      `🔗 Final URL: ${finalUrl}`,
    );

    console.log(
      `👤 Player links: ${playerLinks.length}`,
    );

    console.log(
      `🧩 Interesting elements: ${interestingElements.length}`,
    );

    console.log("");

    console.log(
      `💾 Diagnostic saved: ${OUTPUT_FILE}`,
    );

    console.log(
      "🛡️ Database writes: 0",
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
        "❌ ATP daily schedule diagnostic crashed.",
      );

      console.error(
        error,
      );

      process.exitCode =
        1;
    },
  );