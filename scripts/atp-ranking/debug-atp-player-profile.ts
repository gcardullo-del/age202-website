import "dotenv/config";

import {
  chromium,
  type Response,
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


function isInterestingResponse(
  response: Response,
): boolean {
  const url =
    response.url().toLowerCase();

  const contentType =
    (
      response.headers()[
        "content-type"
      ] ?? ""
    ).toLowerCase();

  return (
    url.includes(
      "atptour",
    ) ||
    url.includes(
      "player",
    ) ||
    url.includes(
      "profile",
    ) ||
    url.includes(
      "api",
    ) ||
    url.includes(
      "graphql",
    ) ||
    contentType.includes(
      "json",
    )
  );
}


async function main() {
  console.log("");
  console.log(
    "🎾 AGE202 — ATP Player Profile Inspector v2",
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
        extraHTTPHeaders: {
          "Accept-Language":
            "en-US,en;q=0.9",
        },
      });

    const rankingPage =
      await context.newPage();

    console.log(
      "🌐 Lettura ATP Live Rankings...",
    );

    const rankingResponse =
      await rankingPage.goto(
        ATP_LIVE_RANKING_URL,
        {
          waitUntil:
            "domcontentloaded",
          timeout:
            60_000,
        },
      );

    const rankingStatus =
      rankingResponse?.status() ??
      null;

    console.log(
      `📡 Ranking HTTP: ${rankingStatus ?? "unknown"}`,
    );

    if (
      rankingStatus !== null &&
      rankingStatus >= 400
    ) {
      throw new Error(
        `ATP ranking ha risposto con HTTP ${rankingStatus}.`,
      );
    }

    await rankingPage.waitForTimeout(
      5_000,
    );

    const entries =
      await parseAtpLiveRanking(
        rankingPage,
      );

    const validation =
      validateAtpLiveRanking(
        entries,
      );

    if (!validation.valid) {
      throw new Error(
        [
          "ATP Top 100 non valida.",
          ...validation.errors,
        ].join("\n"),
      );
    }

    const target =
      entries.find(
        (entry) =>
          entry.profileSlug ===
          "martin-damm",
      ) ??
      entries.at(-1);

    if (
      !target ||
      !target.profileHref
    ) {
      throw new Error(
        "Nessun profilo ATP utilizzabile trovato.",
      );
    }

    const profileUrl =
      new URL(
        target.profileHref,
        "https://www.atptour.com",
      ).toString();

    console.log("");
    console.log(
      `👤 Profilo target: ${target.name}`,
    );
    console.log(
      `🏆 Ranking: ${target.rank}`,
    );
    console.log(
      `🔗 ${profileUrl}`,
    );

    const profilePage =
      await context.newPage();

    const interestingResponses:
      Array<{
        status: number;
        method: string;
        resourceType: string;
        contentType: string;
        url: string;
      }> = [];

    profilePage.on(
      "response",
      (response) => {
        if (
          !isInterestingResponse(
            response,
          )
        ) {
          return;
        }

        const request =
          response.request();

        interestingResponses.push({
          status:
            response.status(),
          method:
            request.method(),
          resourceType:
            request.resourceType(),
          contentType:
            response.headers()[
              "content-type"
            ] ?? "",
          url:
            response.url(),
        });
      },
    );

    console.log("");
    console.log(
      "🌐 Apertura profilo ATP tramite Playwright...",
    );

    let response: Response | null =
      null;

    try {
      response =
        await profilePage.goto(
          profileUrl,
          {
            waitUntil:
              "domcontentloaded",
            timeout:
              60_000,
          },
        );
    } catch (
      navigationError
    ) {
      console.log(
        "⚠️ goto() ha generato un errore, ma continuiamo l'ispezione.",
      );

      if (
        navigationError instanceof Error
      ) {
        console.log(
          `   ${navigationError.message}`,
        );
      }
    }

    const status =
      response?.status() ??
      null;

    console.log(
      `📡 Profile HTTP: ${status ?? "unknown"}`,
    );

    console.log(
      `📍 URL finale: ${profilePage.url()}`,
    );

    await profilePage.waitForTimeout(
      8_000,
    );

    console.log("");
    console.log(
      "🌐 RESPONSE INTERESSANTI",
    );
    console.log(
      "────────────────────────────────────────",
    );

    const uniqueResponses =
      Array.from(
        new Map(
          interestingResponses.map(
            (item) => [
              `${item.status}-${item.method}-${item.url}`,
              item,
            ],
          ),
        ).values(),
      );

    if (
      uniqueResponses.length === 0
    ) {
      console.log(
        "Nessuna response interessante rilevata.",
      );
    } else {
      for (
        const item
        of uniqueResponses.slice(
          0,
          80,
        )
      ) {
        console.log(
          [
            `[${item.status}]`,
            item.method,
            item.resourceType,
            item.contentType || "—",
          ].join(
            " | ",
          ),
        );

        console.log(
          `  ${item.url}`,
        );
      }
    }

    console.log("");
    console.log(
      "📄 DOCUMENTO",
    );
    console.log(
      "────────────────────────────────────────",
    );

    let title = "";

    try {
      title =
        await profilePage.title();
    } catch {
      title =
        "";
    }

    console.log(
      `Title: ${title || "—"}`,
    );

    let html = "";

    try {
      html =
        await profilePage.content();
    } catch {
      html =
        "";
    }

    console.log(
      `HTML length: ${html.length}`,
    );

    if (html) {
      console.log("");
      console.log(
        "HTML preview:",
      );

      console.log(
        compact(
          html,
        ).slice(
          0,
          2500,
        ),
      );
    }

    console.log("");
    console.log(
      "🚧 POSSIBILE BLOCCO / CHALLENGE",
    );
    console.log(
      "────────────────────────────────────────",
    );

    const challengeTerms = [
      "access denied",
      "forbidden",
      "cloudflare",
      "challenge",
      "captcha",
      "verify you are human",
      "checking your browser",
      "security check",
      "request blocked",
      "403 forbidden",
    ];

    const lowerHtml =
      html.toLowerCase();

    const detectedTerms =
      challengeTerms.filter(
        (term) =>
          lowerHtml.includes(
            term,
          ),
      );

    if (
      detectedTerms.length === 0
    ) {
      console.log(
        "Nessun termine di blocco evidente nell'HTML.",
      );
    } else {
      console.log(
        "Termini rilevati:",
      );

      for (
        const term
        of detectedTerms
      ) {
        console.log(
          `• ${term}`,
        );
      }
    }

    console.log("");
    console.log(
      "🏳️ IMMAGINI / FLAG / PLAYER IMAGE",
    );
    console.log(
      "────────────────────────────────────────",
    );

    const images =
      profilePage.locator(
        "img",
      );

    const imageCount =
      await images.count();

    console.log(
      `Immagini totali: ${imageCount}`,
    );

    let interestingImages = 0;

    for (
      let index = 0;
      index < imageCount;
      index += 1
    ) {
      const image =
        images.nth(
          index,
        );

      const alt =
        compact(
          (
            await image.getAttribute(
              "alt",
            )
          ) ?? "",
        );

      const src =
        (
          await image.getAttribute(
            "src",
          )
        ) ?? "";

      const srcset =
        (
          await image.getAttribute(
            "srcset",
          )
        ) ?? "";

      const className =
        (
          await image.getAttribute(
            "class",
          )
        ) ?? "";

      const candidateText =
        [
          alt,
          src,
          srcset,
          className,
        ]
          .join(
            " ",
          )
          .toLowerCase();

      const interesting =
        candidateText.includes(
          "flag",
        ) ||
        candidateText.includes(
          "country",
        ) ||
        candidateText.includes(
          "nation",
        ) ||
        candidateText.includes(
          "player",
        ) ||
        candidateText.includes(
          "damm",
        );

      if (!interesting) {
        continue;
      }

      interestingImages += 1;

      console.log(
        `IMG ${index}`,
      );
      console.log(
        `  alt: ${alt || "—"}`,
      );
      console.log(
        `  src: ${src || "—"}`,
      );
      console.log(
        `  srcset: ${srcset || "—"}`,
      );
      console.log(
        `  class: ${className || "—"}`,
      );
    }

    if (
      interestingImages === 0
    ) {
      console.log(
        "Nessuna immagine utile rilevata.",
      );
    }

    console.log("");
    console.log(
      "🧩 SCRIPT JSON CANDIDATI",
    );
    console.log(
      "────────────────────────────────────────",
    );

    const scriptCandidates =
      await profilePage
        .locator(
          [
            'script[type="application/ld+json"]',
            "script#__NEXT_DATA__",
            'script[type="application/json"]',
          ].join(
            ", ",
          ),
        )
        .evaluateAll(
          (scripts) =>
            scripts
              .map(
                (script) =>
                  script.textContent ??
                  "",
              )
              .filter(Boolean),
        );

    console.log(
      `Script JSON rilevati: ${scriptCandidates.length}`,
    );

    for (
      let index = 0;
      index < scriptCandidates.length;
      index += 1
    ) {
      const value =
        compact(
          scriptCandidates[
            index
          ],
        );

      console.log("");
      console.log(
        `SCRIPT ${index}`,
      );

      console.log(
        value.slice(
          0,
          2500,
        ),
      );
    }

    console.log("");
    console.log(
      "🔎 RICERCA METADATI NELL'HTML",
    );
    console.log(
      "────────────────────────────────────────",
    );

    const metadataTerms = [
      "country",
      "countrycode",
      "countryCode",
      "nationality",
      "birthdate",
      "birthDate",
      "birthday",
      "dateofbirth",
      "dateOfBirth",
      "playerimage",
      "playerImage",
      "profileimage",
      "profileImage",
      "martin damm",
      "d0dt",
    ];

    let metadataMatches = 0;

    for (
      const term
      of metadataTerms
    ) {
      const position =
        html
          .toLowerCase()
          .indexOf(
            term.toLowerCase(),
          );

      if (
        position === -1
      ) {
        continue;
      }

      metadataMatches += 1;

      const start =
        Math.max(
          0,
          position - 300,
        );

      const end =
        Math.min(
          html.length,
          position + 900,
        );

      console.log("");
      console.log(
        `🔑 ${term}`,
      );

      console.log(
        compact(
          html.slice(
            start,
            end,
          ),
        ),
      );
    }

    if (
      metadataMatches === 0
    ) {
      console.log(
        "Nessun metadato evidente trovato nell'HTML.",
      );
    }

    console.log("");
    console.log(
      "🔎 TESTO PAGINA",
    );
    console.log(
      "────────────────────────────────────────",
    );

    let bodyText = "";

    try {
      bodyText =
        await profilePage
          .locator(
            "body",
          )
          .innerText();
    } catch {
      bodyText =
        "";
    }

    const lines =
      bodyText
        .split(
          /\r?\n/,
        )
        .map(
          compact,
        )
        .filter(Boolean);

    console.log(
      `Righe testo: ${lines.length}`,
    );

    const keywords = [
      "country",
      "nationality",
      "united states",
      "usa",
      "born",
      "birth",
      "age",
      "martin damm",
    ];

    const matchingLines =
      lines.filter(
        (line) =>
          keywords.some(
            (keyword) =>
              line
                .toLowerCase()
                .includes(
                  keyword,
                ),
          ),
      );

    if (
      matchingLines.length === 0
    ) {
      console.log(
        "Nessuna riga testuale utile rilevata.",
      );
    } else {
      for (
        const line
        of matchingLines.slice(
          0,
          80,
        )
      ) {
        console.log(
          `• ${line}`,
        );
      }
    }

    console.log("");
    console.log(
      "🍪 COOKIE ATP",
    );
    console.log(
      "────────────────────────────────────────",
    );

    const cookies =
      await context.cookies(
        "https://www.atptour.com",
      );

    console.log(
      `Cookie rilevati: ${cookies.length}`,
    );

    for (
      const cookie
      of cookies
    ) {
      console.log(
        `• ${cookie.name} = ${cookie.value.slice(0, 80)}`,
      );
    }

    console.log("");
    console.log(
      "────────────────────────────────────────",
    );
    console.log(
      "🏁 Profile inspection completed.",
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
      "❌ ATP profile inspection failed.",
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