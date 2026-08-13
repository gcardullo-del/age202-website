import "dotenv/config";

import {
  chromium,
} from "playwright";


const ATP_URL =
  "https://www.atptour.com/en/rankings/singles/live";


async function main() {
  console.log(
    "🎾 AGE202 ATP DOM Inspector",
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
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
          "AppleWebKit/537.36 (KHTML, like Gecko) " +
          "Chrome/151.0.0.0 Safari/537.36",
      });


    console.log(
      "🌐 Opening ATP Live Ranking...",
    );


    const response =
      await page.goto(
        ATP_URL,
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
      console.log(
        "❌ ATP blocked this browser request.",
      );

      console.log(
        "Stopping DOM inspection.",
      );

      return;
    }


    await page.waitForTimeout(
      5_000,
    );


    const title =
      await page.title();


    const bodyText =
      await page
        .locator("body")
        .innerText();


    console.log(
      `📄 Title: ${title}`,
    );


    console.log(
      `📏 Body length: ${bodyText.length.toLocaleString(
        "en-US",
      )}`,
    );


    console.log(
      `🎾 Contains Jannik Sinner: ${
        bodyText
          .toLowerCase()
          .includes(
            "jannik sinner",
          )
          ? "YES"
          : "NO"
      }`,
    );


    console.log(
      `📊 Contains Live Rank: ${
        bodyText
          .toLowerCase()
          .includes(
            "live rank",
          )
          ? "YES"
          : "NO"
      }`,
    );


    const playerLinks =
      await page
        .locator(
          'a[href*="/en/players/"]',
        )
        .count();


    console.log(
      `🔗 Player links detected: ${playerLinks}`,
    );


    const tables =
      page.locator(
        "table",
      );


    const tableCount =
      await tables.count();


    console.log(
      `📊 Tables detected: ${tableCount}`,
    );


    const rows =
      page.locator(
        "tr",
      );


    const rowCount =
      await rows.count();


    console.log(
      `📋 TR elements detected: ${rowCount}`,
    );


    console.log("");
    console.log(
      "────────────────────────────────",
    );

    console.log(
      "🔬 FIRST TABLE ROWS",
    );

    console.log(
      "────────────────────────────────",
    );


    const rowsToInspect =
      Math.min(
        rowCount,
        8,
      );


    for (
      let index = 0;
      index < rowsToInspect;
      index += 1
    ) {
      const row =
        rows.nth(
          index,
        );


      const text =
        (
          await row.innerText()
        )
          .replace(
            /\s+/g,
            " ",
          )
          .trim();


      console.log("");
      console.log(
        `ROW ${index}`,
      );


      console.log(
        text,
      );


      const cells =
        row.locator(
          "th, td",
        );


      const cellCount =
        await cells.count();


      console.log(
        `Cells: ${cellCount}`,
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


        const cellText =
          (
            await cell.innerText()
          )
            .replace(
              /\s+/g,
              " ",
            )
            .trim();


        console.log(
          `  [${cellIndex}] ${cellText}`,
        );
      }


      const links =
        row.locator(
          'a[href*="/en/players/"]',
        );


      const linkCount =
        await links.count();


      for (
        let linkIndex = 0;
        linkIndex < linkCount;
        linkIndex += 1
      ) {
        const link =
          links.nth(
            linkIndex,
          );


        const href =
          await link.getAttribute(
            "href",
          );


        console.log(
          `  🔗 ${href}`,
        );
      }
    }


    console.log("");
    console.log(
      "────────────────────────────────",
    );

    console.log(
      "🏁 DOM inspection completed.",
    );
  } finally {
    await browser.close();
  }
}


main().catch(
  (error) => {
    console.error(
      "❌ ATP DOM inspection failed:",
      error,
    );

    process.exitCode = 1;
  },
);