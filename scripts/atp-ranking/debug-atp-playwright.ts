import "dotenv/config";

import {
  chromium,
} from "playwright";

import {
  parseAtpLiveRanking,
} from "./atp-live-parser";

import {
  ATP_LIVE_RANKING_URL,
} from "./types";


const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
  "AppleWebKit/537.36 (KHTML, like Gecko) " +
  "Chrome/151.0.0.0 Safari/537.36";


async function main() {
  console.log("");
  console.log(
    "🎾 AGE202 — ATP Navigation Response Inspector",
  );
  console.log(
    "────────────────────────────────────",
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
      "🌐 Apertura ATP Live...",
    );


    const baseResponse =
      await page.goto(
        ATP_LIVE_RANKING_URL,
        {
          waitUntil:
            "domcontentloaded",

          timeout:
            60_000,
        },
      );


    console.log(
      `📡 Base HTTP: ${baseResponse?.status() ?? "unknown"}`,
    );


    await page.waitForTimeout(
      5_000,
    );


    const baseEntries =
      await parseAtpLiveRanking(
        page,
      );


    console.log(
      `✅ Base: ${baseEntries.length} giocatori`,
    );

    console.log(
      `📊 Rank base: ${baseEntries[0]?.rank ?? "—"} → ${baseEntries.at(-1)?.rank ?? "—"}`,
    );


    const rankingSelect =
      page.locator(
        "#rankRange-filter",
      );


    await rankingSelect.waitFor({
      state:
        "attached",

      timeout:
        30_000,
    });


    console.log("");
    console.log(
      "➡️ Cambio reale ATP → 101-200",
    );


    const responsePromise =
      page.waitForResponse(
        (response) =>
          response.url().includes(
            "rankRange=101-200",
          ) &&
          response.request().isNavigationRequest(),
        {
          timeout:
            30_000,
        },
      );


    const urlPromise =
      page.waitForURL(
        (url) =>
          url.searchParams.get(
            "rankRange",
          ) ===
          "101-200",
        {
          timeout:
            30_000,
        },
      );


    await rankingSelect.selectOption(
      "101-200",
    );


    const [
      navigationResponse,
    ] =
      await Promise.all([
        responsePromise,
        urlPromise,
      ]);


    console.log("");
    console.log(
      `📍 URL finale: ${page.url()}`,
    );

    console.log(
      `📡 Navigation HTTP: ${navigationResponse.status()}`,
    );

    console.log(
      `📡 Status text: ${navigationResponse.statusText()}`,
    );


    const headers =
      await navigationResponse.allHeaders();


    console.log(
      `🌐 Server: ${headers.server ?? "—"}`,
    );

    console.log(
      `📄 Content-Type: ${headers["content-type"] ?? "—"}`,
    );


    await page
      .waitForLoadState(
        "domcontentloaded",
        {
          timeout:
            30_000,
        },
      )
      .catch(
        () => undefined,
      );


    await page.waitForTimeout(
      3_000,
    );


    const title =
      await page.title();


    const bodyText =
      (
        await page
          .locator(
            "body",
          )
          .innerText()
          .catch(
            () => "",
          )
      )
        .replace(
          /\s+/g,
          " ",
        )
        .trim();


    console.log("");
    console.log(
      `📄 Page title: ${title || "—"}`,
    );

    console.log(
      `📏 Body length: ${bodyText.length}`,
    );

    console.log(
      `📝 Body preview: ${bodyText.slice(0, 500) || "—"}`,
    );


    const afterEntries =
      await parseAtpLiveRanking(
        page,
      );


    console.log("");
    console.log(
      `🎾 Giocatori parsati: ${afterEntries.length}`,
    );


    if (
      afterEntries.length >
      0
    ) {
      console.log(
        `📊 Rank: ${afterEntries[0].rank} → ${afterEntries.at(-1)?.rank ?? "—"}`,
      );
    }


    console.log("");
    console.log(
      "────────────────────────────────────",
    );


    if (
      navigationResponse.status() ===
      403
    ) {
      console.log(
        "🔒 CONFERMATO: ATP blocca la navigazione parametrizzata del browser headless.",
      );
    } else {
      console.log(
        `ℹ️ La navigazione ha restituito HTTP ${navigationResponse.status()}.`,
      );
    }


    console.log(
      "🛡️ Database invariato.",
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
        "❌ ATP Navigation Response Inspector fallito.",
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