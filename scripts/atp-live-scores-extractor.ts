import {
  chromium,
  type Page,
} from "playwright";


export type ExtractedAtpLiveScoreMatch = {
  roundLabel: string | null;

  court: string | null;

  status: "LIVE";

  playerOne: {
    name: string;
  };

  playerTwo: {
    name: string;
  };

  playerOneCurrentGame: string | null;
  playerTwoCurrentGame: string | null;

  playerOneSetScores: string[];
  playerTwoSetScores: string[];

  sourceText: string;
};


const USER_AGENT =
  [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    "AppleWebKit/537.36 (KHTML, like Gecko)",
    "Chrome/152.0.0.0 Safari/537.36",
  ].join(" ");


function cleanText(
  value: string | null | undefined,
): string {
  return (
    value
      ?.replace(
        /\s+/g,
        " ",
      )
      .trim() ??
    ""
  );
}


function cleanPlayerName(
  value: string,
): string {
  return value
    .replace(
      /\s*\(\d+\)\s*$/,
      "",
    )
    .trim();
}


function escapeRegExp(
  value: string,
): string {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&",
  );
}


async function getPlayerNames(
  matchNode: ReturnType<
    Page["locator"]
  >,
): Promise<string[]> {
  const playerNodes =
    matchNode.locator(
      "[class*='player']",
    );

  const count =
    await playerNodes.count();

  const names:
    string[] = [];


  for (
    let index = 0;
    index < count;
    index += 1
  ) {
    const text =
      cleanText(
        await playerNodes
          .nth(
            index,
          )
          .innerText()
          .catch(
            () => "",
          ),
      );


    if (!text) {
      continue;
    }


    if (
      text.length >
      60
    ) {
      continue;
    }


    if (
      /^[\d\s]+$/.test(
        text,
      )
    ) {
      continue;
    }


    if (
      /\b(profile|rank|serve|career|latest|news)\b/i.test(
        text,
      )
    ) {
      continue;
    }


    const normalized =
      cleanPlayerName(
        text,
      );


    if (
      normalized.length <
      2
    ) {
      continue;
    }


    if (
      !names.includes(
        normalized,
      )
    ) {
      names.push(
        normalized,
      );
    }
  }


  return names;
}


async function getScoreRows(
  matchNode: ReturnType<
    Page["locator"]
  >,
): Promise<string[][]> {
  /*
   * ATP espone un contenitore `.scores`
   * per ciascun giocatore.
   *
   * All'interno:
   *
   * score-item[0] = game corrente
   * score-item[1...] = score dei set
   */
  const scoreContainers =
    matchNode.locator(
      ".scores",
    );

  const containerCount =
    await scoreContainers.count();

  const rows:
    string[][] = [];


  for (
    let containerIndex = 0;
    containerIndex <
    containerCount;
    containerIndex += 1
  ) {
    const container =
      scoreContainers.nth(
        containerIndex,
      );

    const scoreItems =
      container.locator(
        ".score-item",
      );

    const itemCount =
      await scoreItems.count();

    const values:
      string[] = [];


    for (
      let itemIndex = 0;
      itemIndex <
      itemCount;
      itemIndex += 1
    ) {
      const value =
        cleanText(
          await scoreItems
            .nth(
              itemIndex,
            )
            .innerText()
            .catch(
              () => "",
            ),
        );


      if (!value) {
        continue;
      }


      values.push(
        value,
      );
    }


    if (
      values.length >
      0
    ) {
      rows.push(
        values,
      );
    }
  }


  return rows;
}


async function extractLiveMatchesFromPage(
  page: Page,
): Promise<
  ExtractedAtpLiveScoreMatch[]
> {
  const candidates =
    page.locator(
      "[class*='match']",
    );

  const candidateCount =
    await candidates.count();

  const matches:
    ExtractedAtpLiveScoreMatch[] = [];

  const seen =
    new Set<string>();


  for (
    let index = 0;
    index <
    candidateCount;
    index += 1
  ) {
    const candidate =
      candidates.nth(
        index,
      );


    const sourceText =
      cleanText(
        await candidate
          .innerText()
          .catch(
            () => "",
          ),
      );


    if (
      !sourceText ||
      !/\blive\b/i.test(
        sourceText,
      )
    ) {
      continue;
    }


    const playerNames =
      await getPlayerNames(
        candidate,
      );


    if (
      playerNames.length <
      2
    ) {
      continue;
    }


    const playerOne =
      playerNames[0];

    const playerTwo =
      playerNames[1];


    if (
      !playerOne ||
      !playerTwo
    ) {
      continue;
    }


    const dedupeKey =
      [
        playerOne
          .toLowerCase(),
        playerTwo
          .toLowerCase(),
      ]
        .sort()
        .join("|");


    if (
      seen.has(
        dedupeKey,
      )
    ) {
      continue;
    }


    const scoreRows =
      await getScoreRows(
        candidate,
      );


    if (
      scoreRows.length <
      2
    ) {
      continue;
    }


    const playerOneRow =
      scoreRows[0] ??
      [];

    const playerTwoRow =
      scoreRows[1] ??
      [];


    const playerOneCurrentGame =
      playerOneRow[0] ??
      null;

    const playerTwoCurrentGame =
      playerTwoRow[0] ??
      null;


    const playerOneSetScores =
      playerOneRow.slice(
        1,
      );

    const playerTwoSetScores =
      playerTwoRow.slice(
        1,
      );


    const roundMatch =
      sourceText.match(
        /Round of 128|Round of 64|Round of 32|Round of 16|Quarterfinals?|Semifinals?|Final/i,
      );


    const roundLabel =
      roundMatch?.[0] ??
      null;


    let court:
      string | null = null;


    if (roundLabel) {
      const courtPattern =
        new RegExp(
          [
            escapeRegExp(
              roundLabel,
            ),
            "\\.?\\s*Live\\s+",
            "(.+?)\\s+",
            escapeRegExp(
              playerOne,
            ),
          ].join(""),
          "i",
        );


      const courtMatch =
        sourceText.match(
          courtPattern,
        );


      court =
        cleanText(
          courtMatch?.[1],
        ) ||
        null;
    }


    seen.add(
      dedupeKey,
    );


    matches.push({
      roundLabel,

      court,

      status:
        "LIVE",

      playerOne: {
        name:
          playerOne,
      },

      playerTwo: {
        name:
          playerTwo,
      },

      playerOneCurrentGame,
      playerTwoCurrentGame,

      playerOneSetScores,
      playerTwoSetScores,

      sourceText,
    });
  }


  return matches;
}


export async function extractAtpLiveScores(
  params: {
    tournamentSlug: string;
    tournamentId: string;
  },
): Promise<
  ExtractedAtpLiveScoreMatch[]
> {
  const {
    tournamentSlug,
    tournamentId,
  } = params;


  const url =
    [
      "https://www.atptour.com/en/scores/current",
      tournamentSlug,
      tournamentId,
      "live-scores",
    ].join("/");


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


    const response =
      await page.goto(
        url,
        {
          waitUntil:
            "domcontentloaded",

          timeout:
            60_000,
        },
      );


    const httpStatus =
      response?.status() ??
      null;


    if (
      httpStatus !== null &&
      httpStatus >= 400
    ) {
      throw new Error(
        `ATP live scores HTTP ${httpStatus}.`,
      );
    }


    await page.waitForTimeout(
      5_000,
    );


    return await extractLiveMatchesFromPage(
      page,
    );
  } finally {
    await browser.close();
  }
}