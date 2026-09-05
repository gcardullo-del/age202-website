import "dotenv/config";

import {
  chromium,
  type Page,
} from "playwright";

import {
  getActiveAtpTournaments,
} from "../lib/data/tournaments/atp-active-tournament-selector";


const PAGE_TIMEOUT_MS =
  30_000;

const SETTLE_MS =
  5_000;

const MAX_BODY_TEXT =
  12_000;

const MAX_RESPONSE_TEXT =
  8_000;


function normalizeText(
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


function shorten(
  value: string,
  maxLength: number,
): string {
  if (
    value.length <=
    maxLength
  ) {
    return value;
  }

  return (
    value.slice(
      0,
      maxLength,
    ) +
    "…"
  );
}


function looksInterestingUrl(
  url: string,
): boolean {
  return /score|live|match|schedule|result|draw|event|tournament/i.test(
    url,
  );
}


function looksInterestingBody(
  body: string,
): boolean {
  return /live|score|sets?|games?|server|serving|winner|loser|match|status/i.test(
    body,
  );
}


async function inspectPage(
  page: Page,
  url: string,
  label: string,
) {
  const capturedResponses:
    Array<{
      status: number;
      resourceType: string;
      url: string;
      contentType: string;
      body: string;
    }> =
    [];

  page.on(
    "response",
    async (
      response,
    ) => {
      const request =
        response.request();

      const resourceType =
        request.resourceType();

      const responseUrl =
        response.url();

      const headers =
        response.headers();

      const contentType =
        headers["content-type"] ??
        "";

      const candidate =
        (
          resourceType ===
            "xhr" ||
          resourceType ===
            "fetch" ||
          /json|javascript|text/i.test(
            contentType,
          )
        ) &&
        looksInterestingUrl(
          responseUrl,
        );

      if (
        !candidate
      ) {
        return;
      }

      let body =
        "";

      try {
        body =
          await response.text();
      } catch {
        body =
          "";
      }

      if (
        body &&
        !looksInterestingBody(
          body,
        ) &&
        !looksInterestingUrl(
          responseUrl,
        )
      ) {
        return;
      }

      capturedResponses.push({
        status:
          response.status(),

        resourceType,

        url:
          responseUrl,

        contentType,

        body:
          shorten(
            normalizeText(
              body,
            ),
            MAX_RESPONSE_TEXT,
          ),
      });
    },
  );


  console.log("");
  console.log(
    "════════════════════════════════════════════",
  );

  console.log(
    label,
  );

  console.log(
    "════════════════════════════════════════════",
  );

  console.log(
    url,
  );


  await page.goto(
    url,
    {
      waitUntil:
        "domcontentloaded",

      timeout:
        PAGE_TIMEOUT_MS,
    },
  );

  await page.waitForTimeout(
    SETTLE_MS,
  );


  const title =
    await page
      .title()
      .catch(
        () => "",
      );

  console.log("");
  console.log(
    `TITLE: ${title}`,
  );


  const bodyText =
    shorten(
      normalizeText(
        await page
          .locator(
            "body",
          )
          .innerText({
            timeout:
              4_000,
          })
          .catch(
            () => "",
          ),
      ),
      MAX_BODY_TEXT,
    );

  console.log("");
  console.log(
    "PAGE TEXT SNAPSHOT",
  );

  console.log(
    "────────────────────────────────────────────",
  );

  console.log(
    bodyText ||
    "(empty)",
  );


  const liveLikeElements =
    await page
      .locator(
        [
          '[class*="live" i]',
          '[class*="score" i]',
          '[class*="status" i]',
          '[class*="set" i]',
          '[class*="game" i]',
          '[class*="serve" i]',
          '[class*="point" i]',
          '[data-*]',
        ].join(","),
      )
      .evaluateAll(
        (
          elements,
        ) =>
          elements
            .slice(
              0,
              120,
            )
            .map(
              (
                element,
              ) => ({
                tag:
                  element.tagName.toLowerCase(),

                className:
                  element.getAttribute(
                    "class",
                  ) ??
                  "",

                text:
                  (
                    element.textContent ??
                    ""
                  )
                    .replace(
                      /\s+/g,
                      " ",
                    )
                    .trim()
                    .slice(
                      0,
                      300,
                    ),

                attrs:
                  Object.fromEntries(
                    Array.from(
                      element.attributes,
                    )
                      .filter(
                        (
                          attribute,
                        ) =>
                          /^(data-|aria-|class$|id$)/i.test(
                            attribute.name,
                          ),
                      )
                      .map(
                        (
                          attribute,
                        ) => [
                          attribute.name,
                          attribute.value,
                        ],
                      ),
                  ),
              })),
      )
      .catch(
        () => [],
      );


  console.log("");
  console.log(
    `LIVE/SCORE-LIKE DOM ELEMENTS: ${liveLikeElements.length}`,
  );

  for (
    const element
    of liveLikeElements
  ) {
    if (
      !element.text &&
      Object.keys(
        element.attrs,
      ).length ===
      0
    ) {
      continue;
    }

    console.log(
      JSON.stringify(
        element,
      ),
    );
  }


  console.log("");
  console.log(
    `CAPTURED INTERESTING RESPONSES: ${capturedResponses.length}`,
  );

  console.log(
    "────────────────────────────────────────────",
  );

  for (
    const response
    of capturedResponses
  ) {
    console.log("");
    console.log(
      `${response.status} · ${response.resourceType} · ${response.contentType}`,
    );

    console.log(
      response.url,
    );

    if (
      response.body
    ) {
      console.log(
        response.body,
      );
    }
  }


  const scripts =
    await page
      .locator(
        "script[src]",
      )
      .evaluateAll(
        (
          elements,
        ) =>
          elements
            .map(
              (
                element,
              ) =>
                element.getAttribute(
                  "src",
                ),
            )
            .filter(
              (
                value,
              ):
                value is string =>
                  Boolean(
                    value,
                  ),
            )
            .filter(
              (
                value,
              ) =>
                /score|live|match|result|tour|main|app/i.test(
                  value,
                ),
            )
            .slice(
              0,
              80,
            ),
      )
      .catch(
        () => [],
      );


  console.log("");
  console.log(
    `INTERESTING SCRIPT SOURCES: ${scripts.length}`,
  );

  for (
    const script
    of scripts
  ) {
    console.log(
      script,
    );
  }
}


async function main() {
  const now =
    new Date();

  const selection =
    getActiveAtpTournaments(
      now,
    );

  if (
    selection.tournaments.length ===
    0
  ) {
    console.log(
      "No supported ATP tournament is active.",
    );

    return;
  }


  console.log("");
  console.log(
    "AGE202 · ATP LIVE SOURCE DIAGNOSTIC",
  );

  console.log(
    "READ ONLY · NO DATABASE WRITES",
  );


  for (
    const tournament
    of selection.tournaments
  ) {
    const baseUrl =
      `https://www.atptour.com/en/scores/current/${tournament.atpSlug}/${tournament.atpTournamentId}`;

    const urls = [
      {
        label:
          "TOURNAMENT ROOT / LIVE TAB",
        url:
          baseUrl,
      },
      {
        label:
          "RESULTS PAGE",
        url:
          `${baseUrl}/results?matchType=singles`,
      },
      {
        label:
          "DAILY SCHEDULE",
        url:
          `${baseUrl}/daily-schedule`,
      },
      {
        label:
          "DRAWS PAGE",
        url:
          `${baseUrl}/draws`,
      },
    ];


    console.log("");
    console.log(
      `TOURNAMENT: ${tournament.name}`,
    );


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


      for (
        const target
        of urls
      ) {
        const page =
          await context.newPage();

        page.setDefaultTimeout(
          4_000,
        );

        page.setDefaultNavigationTimeout(
          PAGE_TIMEOUT_MS,
        );

        try {
          await inspectPage(
            page,
            target.url,
            target.label,
          );
        } catch (
          error
        ) {
          console.log("");
          console.log(
            `PAGE FAILED: ${target.label}`,
          );

          console.log(
            error instanceof Error
              ? error.message
              : String(
                  error,
                ),
          );
        } finally {
          await page.close();
        }
      }
    } finally {
      await browser.close();
    }
  }


  console.log("");
  console.log(
    "════════════════════════════════════════════",
  );

  console.log(
    "DIAGNOSTIC COMPLETE",
  );

  console.log(
    "NO DATABASE CHANGES WERE MADE",
  );

  console.log(
    "════════════════════════════════════════════",
  );
}


main()
  .catch(
    (
      error: unknown,
    ) => {
      console.error(
        error instanceof Error
          ? error.message
          : error,
      );

      process.exitCode =
        1;
    },
  );
