import {
  chromium,
  type Page,
} from "playwright";


const TARGET_URL =
  "https://www.usopen.org/en_US/index.html";

const PAGE_TIMEOUT_MS =
  35_000;

const SETTLE_MS =
  8_000;

const MAX_BODY =
  10_000;

const MAX_RESPONSE =
  12_000;


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


function isInterestingUrl(
  url: string,
): boolean {
  return /score|match|live|schedule|results|stat|ibm|slamtracker|point|event/i.test(
    url,
  );
}


async function main() {
  console.log(
    "AGE202 · US OPEN LIVE SOURCE DIAGNOSTIC",
  );

  console.log(
    "READ ONLY · NO DATABASE WRITES",
  );

  console.log(
    TARGET_URL,
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
      4_000,
    );

    page.setDefaultNavigationTimeout(
      PAGE_TIMEOUT_MS,
    );


    const captured:
      Array<{
        type: string;
        status: number;
        contentType: string;
        url: string;
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

        const type =
          request.resourceType();

        const url =
          response.url();

        if (
          !(
            type ===
              "xhr" ||
            type ===
              "fetch" ||
            isInterestingUrl(
              url,
            )
          )
        ) {
          return;
        }


        const contentType =
          response
            .headers()[
              "content-type"
            ] ??
          "";

        let body =
          "";

        if (
          /json|text|javascript/i.test(
            contentType,
          )
        ) {
          try {
            body =
              await response.text();
          } catch {
            body =
              "";
          }
        }


        if (
          !isInterestingUrl(
            url,
          ) &&
          !/score|live|match|point|set|game|player/i.test(
            body,
          )
        ) {
          return;
        }


        captured.push({
          type,
          status:
            response.status(),
          contentType,
          url,
          body:
            shorten(
              normalizeText(
                body,
              ),
              MAX_RESPONSE,
            ),
        });
      },
    );


    page.on(
      "websocket",
      (
        socket,
      ) => {
        console.log("");
        console.log(
          "WEBSOCKET OPENED",
        );

        console.log(
          socket.url(),
        );


        socket.on(
          "framereceived",
          (
            event,
          ) => {
            const payload =
              typeof event.payload ===
                "string"
                ? event.payload
                : event.payload.toString();

            if (
              /score|live|match|point|set|game|player/i.test(
                payload,
              )
            ) {
              console.log(
                "WS FRAME RECEIVED",
              );

              console.log(
                shorten(
                  normalizeText(
                    payload,
                  ),
                  4_000,
                ),
              );
            }
          },
        );
      },
    );


    await page.goto(
      TARGET_URL,
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


    console.log("");
    console.log(
      `TITLE: ${await page.title()}`,
    );


    const bodyText =
      shorten(
        normalizeText(
          await page
            .locator(
              "body",
            )
            .innerText()
            .catch(
              () => "",
            ),
        ),
        MAX_BODY,
      );


    console.log("");
    console.log(
      "PAGE TEXT SNAPSHOT",
    );

    console.log(
      "────────────────────────────────────────────",
    );

    console.log(
      bodyText,
    );


    const scoreNodes =
      await page
        .locator(
          [
            '[class*="score" i]',
            '[class*="live" i]',
            '[class*="match" i]',
            '[class*="set" i]',
            '[class*="game" i]',
            '[class*="point" i]',
            '[data-testid*="score" i]',
            '[data-testid*="match" i]',
          ].join(
            ",",
          ),
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
                        500,
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
                            /^(data-|aria-|id$|class$)/i.test(
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
      `SCORE/LIVE DOM NODES: ${scoreNodes.length}`,
    );

    console.log(
      "────────────────────────────────────────────",
    );


    for (
      const node
      of scoreNodes
    ) {
      if (
        !node.text
      ) {
        continue;
      }

      console.log(
        JSON.stringify(
          node,
        ),
      );
    }


    console.log("");
    console.log(
      `CAPTURED RESPONSES: ${captured.length}`,
    );

    console.log(
      "────────────────────────────────────────────",
    );


    for (
      const item
      of captured
    ) {
      console.log("");
      console.log(
        `${item.status} · ${item.type} · ${item.contentType}`,
      );

      console.log(
        item.url,
      );

      if (
        item.body
      ) {
        console.log(
          item.body,
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
                  /score|match|live|ibm|slam|main|app|bundle/i.test(
                    value,
                  ),
              )
              .slice(
                0,
                100,
              ),
        )
        .catch(
          () => [],
        );


    console.log("");
    console.log(
      `INTERESTING SCRIPTS: ${scripts.length}`,
    );

    console.log(
      "────────────────────────────────────────────",
    );


    for (
      const script
      of scripts
    ) {
      console.log(
        script,
      );
    }


    console.log("");
    console.log(
      "DIAGNOSTIC COMPLETE",
    );

    console.log(
      "NO DATABASE CHANGES WERE MADE",
    );
  } finally {
    await browser.close();
  }
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
