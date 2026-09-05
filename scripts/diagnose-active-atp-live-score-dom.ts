import "dotenv/config";

import {
  chromium,
  type Locator,
  type Page,
} from "playwright";

import {
  getActiveAtpTournaments,
} from "../lib/data/tournaments/atp-active-tournament-selector";


type InterestingElement = {
  tag: string;
  className: string;
  text: string;
  attributes: Record<string, string>;
};


const PAGE_TIMEOUT_MS =
  30_000;

const DOM_SETTLE_MS =
  4_000;

const MAX_ELEMENT_TEXT =
  220;

const MAX_HTML_LENGTH =
  2_500;


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


async function getText(
  locator: Locator,
): Promise<string> {
  const count =
    await locator
      .count()
      .catch(
        () => 0,
      );

  if (
    count ===
    0
  ) {
    return "";
  }

  return normalizeText(
    await locator
      .first()
      .innerText({
        timeout:
          2_000,
      })
      .catch(
        () => "",
      ),
  );
}


async function readPlayerNames(
  candidate: Locator,
): Promise<string[]> {
  const links =
    candidate.locator(
      'a[href*="/players/"][href*="/overview"]',
    );

  const count =
    await links
      .count()
      .catch(
        () => 0,
      );

  const names:
    string[] =
    [];

  for (
    let index = 0;
    index < count;
    index += 1
  ) {
    const name =
      normalizeText(
        await links
          .nth(
            index,
          )
          .innerText({
            timeout:
              1_500,
          })
          .catch(
            () => "",
          ),
      );

    if (
      name &&
      !names.includes(
        name,
      )
    ) {
      names.push(
        name,
      );
    }
  }

  return names;
}


async function readInterestingElements(
  candidate: Locator,
): Promise<InterestingElement[]> {
  return candidate
    .locator(
      [
        '[class*="live" i]',
        '[class*="score" i]',
        '[class*="status" i]',
        '[class*="set" i]',
        '[class*="game" i]',
        '[class*="serve" i]',
        '[class*="point" i]',
      ].join(","),
    )
    .evaluateAll(
      (
        elements,
        maxText,
      ) =>
        elements
          .slice(
            0,
            80,
          )
          .map(
            (element) => {
              const attributes =
                Object.fromEntries(
                  Array.from(
                    element.attributes,
                  ).map(
                    (attribute) => [
                      attribute.name,
                      attribute.value,
                    ],
                  ),
                );

              const rawText =
                (
                  element.textContent ??
                  ""
                )
                  .replace(
                    /\s+/g,
                    " ",
                  )
                  .trim();

              return {
                tag:
                  element.tagName.toLowerCase(),

                className:
                  element.getAttribute(
                    "class",
                  ) ??
                  "",

                text:
                  rawText.slice(
                    0,
                    maxText,
                  ),

                attributes,
              };
            },
          ),
      MAX_ELEMENT_TEXT,
    )
    .catch(
      () => [],
    );
}


async function inspectCandidate(
  candidate: Locator,
  index: number,
) {
  const playerContainerCount =
    await candidate
      .locator(
        ".schedule-players",
      )
      .count()
      .catch(
        () => 0,
      );

  if (
    playerContainerCount ===
    0
  ) {
    return;
  }

  const matchType =
    await getText(
      candidate.locator(
        ".match-type",
      ),
    );

  if (
    /^WTA$/i.test(
      matchType,
    )
  ) {
    return;
  }

  const players =
    await readPlayerNames(
      candidate,
    );

  if (
    players.length !==
    2
  ) {
    return;
  }

  const sourceText =
    normalizeText(
      await candidate
        .innerText({
          timeout:
            2_000,
        })
        .catch(
          () => "",
        ),
    );

  const round =
    await getText(
      candidate.locator(
        ".schedule-type",
      ),
    );

  const location =
    await getText(
      candidate.locator(
        ".schedule-location-timestamp",
      ),
    );

  const ctaScore =
    await getText(
      candidate.locator(
        ".schedule-cta-score",
      ),
    );

  const className =
    await candidate
      .getAttribute(
        "class",
      )
      .catch(
        () => null,
      );

  const interestingElements =
    await readInterestingElements(
      candidate,
    );

  const html =
    shorten(
      normalizeText(
        await candidate
          .evaluate(
            (element) =>
              element.outerHTML,
          )
          .catch(
            () => "",
          ),
      ),
      MAX_HTML_LENGTH,
    );

  console.log("");
  console.log(
    "────────────────────────────────────────────",
  );

  console.log(
    `MATCH CANDIDATE ${index}`,
  );

  console.log(
    `Players: ${players.join(" vs ")}`,
  );

  console.log(
    `Round: ${round || "(none)"}`,
  );

  console.log(
    `Location: ${location || "(none)"}`,
  );

  console.log(
    `Match type: ${matchType || "(none)"}`,
  );

  console.log(
    `Candidate class: ${className || "(none)"}`,
  );

  console.log(
    `CTA score: ${ctaScore || "(empty)"}`,
  );

  console.log(
    `Text: ${shorten(sourceText, 800)}`,
  );

  console.log("");
  console.log(
    `Interesting descendants: ${interestingElements.length}`,
  );

  for (
    const element
    of interestingElements
  ) {
    console.log(
      [
        `  <${element.tag}>`,
        `class="${element.className || "(none)"}"`,
        `text="${element.text || "(empty)"}"`,
      ].join(
        " | ",
      ),
    );

    const usefulAttributes =
      Object.entries(
        element.attributes,
      ).filter(
        ([name]) =>
          /live|score|status|set|game|serve|point|data-/i.test(
            name,
          ),
      );

    if (
      usefulAttributes.length >
      0
    ) {
      console.log(
        `    attrs: ${JSON.stringify(Object.fromEntries(usefulAttributes))}`,
      );
    }
  }

  console.log("");
  console.log(
    "HTML SNAPSHOT:",
  );

  console.log(
    html ||
    "(empty)",
  );
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
    "════════════════════════════════════════════",
  );

  console.log(
    "AGE202 · ATP LIVE SCORE DOM DIAGNOSTIC",
  );

  console.log(
    "════════════════════════════════════════════",
  );

  console.log(
    `Category: ${selection.category}`,
  );

  console.log(
    `Tournaments: ${selection.tournaments.length}`,
  );

  console.log(
    "READ ONLY · NO DATABASE WRITES",
  );


  for (
    const tournament
    of selection.tournaments
  ) {
    const sourceUrl =
      `https://www.atptour.com/en/scores/current/${tournament.atpSlug}/${tournament.atpTournamentId}/daily-schedule`;

    console.log("");
    console.log(
      `Tournament: ${tournament.name}`,
    );

    console.log(
      `URL: ${sourceUrl}`,
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

      const page:
        Page =
        await context.newPage();

      page.setDefaultTimeout(
        3_000,
      );

      page.setDefaultNavigationTimeout(
        PAGE_TIMEOUT_MS,
      );


      const networkUrls =
        new Set<string>();

      page.on(
        "response",
        (response) => {
          const url =
            response.url();

          const resourceType =
            response
              .request()
              .resourceType();

          if (
            (
              resourceType ===
                "xhr" ||
              resourceType ===
                "fetch"
            ) &&
            /score|live|match|schedule|tournament|event/i.test(
              url,
            )
          ) {
            networkUrls.add(
              `${response.status()} · ${resourceType} · ${url}`,
            );
          }
        },
      );


      await page.goto(
        sourceUrl,
        {
          waitUntil:
            "domcontentloaded",

          timeout:
            PAGE_TIMEOUT_MS,
        },
      );

      await page
        .locator(
          ".schedule",
        )
        .first()
        .waitFor({
          state:
            "attached",

          timeout:
            15_000,
        })
        .catch(
          () => undefined,
        );

      await page.waitForTimeout(
        DOM_SETTLE_MS,
      );


      console.log("");
      console.log(
        "NETWORK ENDPOINTS",
      );

      console.log(
        "────────────────────────────────────────────",
      );

      if (
        networkUrls.size ===
        0
      ) {
        console.log(
          "No interesting XHR/fetch endpoints captured.",
        );
      } else {
        for (
          const url
          of networkUrls
        ) {
          console.log(
            url,
          );
        }
      }


      const candidates =
        page.locator(
          ".schedule",
        );

      const count =
        await candidates.count();

      console.log("");
      console.log(
        `Schedule DOM candidates: ${count}`,
      );


      for (
        let index = 0;
        index < count;
        index += 1
      ) {
        await inspectCandidate(
          candidates.nth(
            index,
          ),
          index,
        );
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
    "════════════════════════════════════════════",
  );

  console.log(
    "No database changes were made.",
  );

  console.log("");
}


main()
  .catch(
    (error: unknown) => {
      console.error(
        error instanceof Error
          ? error.message
          : error,
      );

      process.exitCode =
        1;
    },
  );
