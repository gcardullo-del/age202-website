import {
   createHash,
} from "node:crypto";

import {
  chromium,
  type Page,
} from "playwright";


export type ExtractedAtpTournamentRound =
  | "ROUND_OF_128"
  | "ROUND_OF_64"
  | "ROUND_OF_32"
  | "ROUND_OF_16"
  | "QUARTERFINAL"
  | "SEMIFINAL"
  | "FINAL";


export type ExtractedAtpTournamentPlayer = {
  name: string;
  href: string | null;
  profileSlug: string | null;
  externalId: string | null;
};


export type ExtractedAtpTournamentMatch = {
  externalId: string;
  round: ExtractedAtpTournamentRound;
  roundOrder: number;
  matchNumber: number;
  bracketPosition: number;
  playerOne: ExtractedAtpTournamentPlayer;
  playerTwo: ExtractedAtpTournamentPlayer;
  winner: ExtractedAtpTournamentPlayer;
  loser: ExtractedAtpTournamentPlayer;
  score: string | null;
  court: string | null;
  resultType:
    | "STANDARD"
    | "RETIREMENT"
    | "WALKOVER"
    | "DEFAULT"
    | "ABANDONED";
  sourceText: string;
};


export type ExtractedAtpTournamentDraw = {
  source: "ATP";
  sourceUrl: string;
  tournamentSlug: string;
  tournamentId: string;
  year: number;
  drawSize: number;
  players: ExtractedAtpTournamentPlayer[];
  matches: ExtractedAtpTournamentMatch[];
  extractedAt: Date;
};


export type ExtractAtpTournamentDrawInput = {
  tournamentSlug: string;
  tournamentId: string;
  year: number;
  sourceMode?: "archive" | "current";
};


const ROUND_ORDER: Record<ExtractedAtpTournamentRound, number> = {
  ROUND_OF_128: 1,
  ROUND_OF_64: 2,
  ROUND_OF_32: 3,
  ROUND_OF_16: 4,
  QUARTERFINAL: 5,
  SEMIFINAL: 6,
  FINAL: 7,
};


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


function countOccurrences(
  text: string,
  phrase: string,
): number {
  return text
    .toLowerCase()
    .split(
      phrase.toLowerCase(),
    ).length - 1;
}


function parseRound(
  text: string,
): ExtractedAtpTournamentRound | null {
  if (/\bRound of 128\b/i.test(text)) {
    return "ROUND_OF_128";
  }

  if (/\bRound of 64\b/i.test(text)) {
    return "ROUND_OF_64";
  }

  if (/\bRound of 32\b/i.test(text)) {
    return "ROUND_OF_32";
  }

  if (/\bRound of 16\b/i.test(text)) {
    return "ROUND_OF_16";
  }

  if (/\bQuarter[- ]?Finals?\b/i.test(text)) {
    return "QUARTERFINAL";
  }

  if (/\bSemi[- ]?Finals?\b/i.test(text)) {
    return "SEMIFINAL";
  }

  if (/\bFinal\b/i.test(text)) {
    return "FINAL";
  }

  return null;
}


function parseProfile(
  name: string,
  href: string | null,
): ExtractedAtpTournamentPlayer {
  if (!href) {
    return {
      name,
      href: null,
      profileSlug: null,
      externalId: null,
    };
  }

  const match =
    href.match(
      /\/players\/([^/]+)\/([^/?#]+)/i,
    );

  return {
    name,
    href,
    profileSlug:
      match?.[1]
        ?.trim()
        .toLowerCase() ??
      null,
    externalId:
      match?.[2]
        ?.trim()
        .toUpperCase() ??
      null,
  };
}


function parseWinner(
  text: string,
  players: ExtractedAtpTournamentPlayer[],
): ExtractedAtpTournamentPlayer | null {
  const lowerText =
    text.toLocaleLowerCase();

  return (
    players.find(
      (player) =>
        lowerText.includes(
          `${player.name.toLocaleLowerCase()} wins the match`,
        ),
    ) ??
    null
  );
}


function escapeRegExp(
  value: string,
): string {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&",
  );
}


function extractWinnerNameFromText(
  text: string,
): string | null {
  const match =
    text.match(
      /Game Set and Match\s+(.+?)\.\s*\1\s+wins the match/i,
    );

  return (
    normalizeText(
      match?.[1],
    ) ||
    null
  );
}


function removeLeadingResultTokens(
  value: string,
): string {
  let normalized =
    normalizeText(value);

  normalized =
    normalized.replace(
      /^\s*(?:\((?:\d+|Q|WC|LL|PR|SE|ALT)\)\s*)?/i,
      "",
    );

  normalized =
    normalized.replace(
      /^(?:(?:\d+(?:\(\d+\))?|RET|W\/O|DEF)\s+)+/i,
      "",
    );

  return normalizeText(
    normalized,
  );
}


function removeTrailingResultTokens(
  value: string,
): string {
  let normalized =
    normalizeText(value);

  normalized =
    normalized.replace(
      /\s+(?:(?:\d+(?:\(\d+\))?|RET|W\/O|DEF)\s*)+$/i,
      "",
    );

  normalized =
    normalized.replace(
      /\s*\((?:\d+|Q|WC|LL|PR|SE|ALT)\)\s*$/i,
      "",
    );

  return normalizeText(
    normalized,
  );
}


function parsePlayersFromText(
  text: string,
): ExtractedAtpTournamentPlayer[] {
  const winnerName =
    extractWinnerNameFromText(
      text,
    );

  if (!winnerName) {
    return [];
  }

  const resultSection =
    text.match(
      /\b\d{1,2}:\d{2}:\d{2}\b\s+(.+?)\s+Ump:/i,
    )?.[1];

  if (!resultSection) {
    return [];
  }

  const winnerPattern =
    new RegExp(
      escapeRegExp(winnerName),
      "i",
    );

  const winnerMatch =
    winnerPattern.exec(
      resultSection,
    );

  if (!winnerMatch) {
    return [];
  }

  const beforeWinner =
    normalizeText(
      resultSection.slice(
        0,
        winnerMatch.index,
      ),
    );

  const afterWinner =
    normalizeText(
      resultSection.slice(
        winnerMatch.index +
          winnerMatch[0].length,
      ),
    );

  const opponentName =
    beforeWinner
      ? removeTrailingResultTokens(
          beforeWinner,
        )
      : removeTrailingResultTokens(
          removeLeadingResultTokens(
            afterWinner,
          ),
        );

  if (
    !opponentName ||
    opponentName.localeCompare(
      winnerName,
      undefined,
      {
        sensitivity: "base",
      },
    ) === 0
  ) {
    return [];
  }

  const winner =
    parseProfile(
      winnerName,
      null,
    );

  const opponent =
    parseProfile(
      opponentName,
      null,
    );

  return beforeWinner
    ? [
        opponent,
        winner,
      ]
    : [
        winner,
        opponent,
      ];
}


function parseScore(
  text: string,
): string | null {
  const match =
    text.match(
      /wins the match\s+([^.!?]+?)(?:\s*[.!?](?:\s|$))/i,
    );

  const score =
    normalizeText(
      match?.[1],
    );

  if (
    !score ||
    /^(?:by\s+)?(?:walkover|default|abandoned)$/i.test(
      score,
    )
  ) {
    return null;
  }

  return score;
}


function parseCourt(
  text: string,
): string | null {
  const match =
    text.match(
      /(?:Round of \d+|Quarter[- ]?Finals?|Semi[- ]?Finals?|Final)\s*-\s*(.+?)\s+\d{1,2}:\d{2}:\d{2}\b/i,
    );

  return (
    normalizeText(
      match?.[1],
    ) ||
    null
  );
}


function parseResultType(
  text: string,
): ExtractedAtpTournamentMatch["resultType"] {
  if (/\bwalkover\b|\bw\/o\b/i.test(text)) {
    return "WALKOVER";
  }

  if (/\bretired\b|\bretirement\b|\bret\.?\b/i.test(text)) {
    return "RETIREMENT";
  }

  if (/\bdefault(?:ed)?\b|\bdef\.?\b/i.test(text)) {
    return "DEFAULT";
  }

  if (/\babandoned\b/i.test(text)) {
    return "ABANDONED";
  }

  return "STANDARD";
}


function createMatchExternalId(
  round: ExtractedAtpTournamentRound,
  players: ExtractedAtpTournamentPlayer[],
): string {
  const playerKeys =
    players
      .map(
        (player) =>
          player.externalId ??
          player.profileSlug ??
          player.name.toLocaleLowerCase(),
      )
      .sort();

  const digest =
    createHash("sha256")
      .update(
        `${round}:${playerKeys.join(":")}`,
      )
      .digest("hex")
      .slice(0, 20);

  return `atp:${round.toLowerCase()}:${digest}`;
}


function isSecurityPage(
  text: string,
): boolean {
  return (
    /performing security verification/i.test(text) ||
    /protect against malicious bots/i.test(text) ||
    /cloudflare/i.test(text)
  );
}


function stripSeedFromPlayerName(
  value: string,
): string {
  return normalizeText(
    value.replace(
      /\s*\((?:\d+|Q|WC|LL|PR|SE|ALT)\)\s*$/i,
      "",
    ),
  );
}


function isScoreLine(
  value: string,
): boolean {
  return /^\d+(?:\(\d+\))?$/.test(
    value,
  );
}


function parseScoreLine(
  value: string,
): number | null {
  const match =
    value.match(
      /^(\d+)/,
    );

  if (!match) {
    return null;
  }

  const score =
    Number.parseInt(
      match[1],
      10,
    );

  return Number.isInteger(score)
    ? score
    : null;
}


function extractFinalFromScoreboard(
  rawBodyText: string,
): Omit<
  ExtractedAtpTournamentMatch,
  "matchNumber" | "bracketPosition"
> | null {
  const lines =
    rawBodyText
      .split(/\r?\n/)
      .map(normalizeText)
      .filter(Boolean);

  const finalLineIndex =
    lines.findIndex(
      (line) =>
        /^Final\s*-\s*.+/i.test(
          line,
        ),
    );

  if (finalLineIndex < 0) {
    return null;
  }

  const timeLineIndex =
    lines.findIndex(
      (line, index) =>
        index > finalLineIndex &&
        index <= finalLineIndex + 4 &&
        /^\d{1,2}:\d{2}:\d{2}$/.test(
          line,
        ),
    );

  if (timeLineIndex < 0) {
    return null;
  }

  const playerOneLine =
    lines[timeLineIndex + 1];

  if (
    !playerOneLine ||
    isScoreLine(playerOneLine)
  ) {
    return null;
  }

  const playerOneScores: number[] =
    [];

  let cursor =
    timeLineIndex + 2;

  while (
    cursor < lines.length &&
    isScoreLine(lines[cursor])
  ) {
    const score =
      parseScoreLine(
        lines[cursor],
      );

    if (score !== null) {
      playerOneScores.push(score);
    }

    cursor += 1;
  }

  const playerTwoLine =
    lines[cursor];

  if (
    playerOneScores.length === 0 ||
    !playerTwoLine ||
    isScoreLine(playerTwoLine)
  ) {
    return null;
  }

  cursor += 1;

  const playerTwoScores: number[] =
    [];

  while (
    cursor < lines.length &&
    isScoreLine(lines[cursor])
  ) {
    const score =
      parseScoreLine(
        lines[cursor],
      );

    if (score !== null) {
      playerTwoScores.push(score);
    }

    cursor += 1;
  }

  if (playerTwoScores.length === 0) {
    return null;
  }

  const setCount =
    Math.min(
      playerOneScores.length,
      playerTwoScores.length,
    );

  if (
    setCount < 2 ||
    Math.abs(
      playerOneScores.length -
        playerTwoScores.length,
    ) > 1
  ) {
    return null;
  }

  const playerOneMainScores =
    playerOneScores.slice(
      0,
      setCount,
    );

  const playerTwoMainScores =
    playerTwoScores.slice(
      0,
      setCount,
    );

  let playerOneSets =
    0;
  let playerTwoSets =
    0;

  for (
    let index = 0;
    index < setCount;
    index += 1
  ) {
    if (
      playerOneMainScores[index] >
      playerTwoMainScores[index]
    ) {
      playerOneSets += 1;
    } else if (
      playerTwoMainScores[index] >
      playerOneMainScores[index]
    ) {
      playerTwoSets += 1;
    }
  }

  if (
    Math.max(
      playerOneSets,
      playerTwoSets,
    ) < 2 ||
    playerOneSets === playerTwoSets
  ) {
    return null;
  }

  const playerOne =
    parseProfile(
      stripSeedFromPlayerName(
        playerOneLine,
      ),
      null,
    );

  const playerTwo =
    parseProfile(
      stripSeedFromPlayerName(
        playerTwoLine,
      ),
      null,
    );

  if (
    !playerOne.name ||
    !playerTwo.name
  ) {
    return null;
  }

  const playerOneTieBreak =
    playerOneScores.length > setCount
      ? playerOneScores[setCount]
      : null;

  const playerTwoTieBreak =
    playerTwoScores.length > setCount
      ? playerTwoScores[setCount]
      : null;

  const formattedSets =
    playerOneMainScores.map(
      (playerOneScore, index) => {
        const playerTwoScore =
          playerTwoMainScores[index];

        const isLastSet =
          index === setCount - 1;

        const tieBreakScore =
          isLastSet
            ? playerOneTieBreak ??
              playerTwoTieBreak
            : null;

        return `${playerOneScore}-${playerTwoScore}${
          tieBreakScore !== null
            ? `(${tieBreakScore})`
            : ""
        }`;
      },
    );

  const winner =
    playerOneSets > playerTwoSets
      ? playerOne
      : playerTwo;

  const loser =
    winner === playerOne
      ? playerTwo
      : playerOne;

  const court =
    normalizeText(
      lines[finalLineIndex].replace(
        /^Final\s*-\s*/i,
        "",
      ),
    ) || null;

  const sourceText =
    lines
      .slice(
        finalLineIndex,
        Math.min(
          cursor + 1,
          lines.length,
        ),
      )
      .join(" ");

  return {
    externalId:
      createMatchExternalId(
        "FINAL",
        [
          playerOne,
          playerTwo,
        ],
      ),
    round: "FINAL",
    roundOrder:
      ROUND_ORDER.FINAL,
    playerOne,
    playerTwo,
    winner,
    loser,
    score:
      formattedSets.join(" "),
    court,
    resultType: "STANDARD",
    sourceText,
  };
}




type CurrentDomScoreItem = {
  game: number | null;
  tieBreak: number | null;
};


function formatCurrentDomScore(
  playerOneItems: CurrentDomScoreItem[],
  playerTwoItems: CurrentDomScoreItem[],
): string | null {
  const setCount =
    Math.min(
      playerOneItems.length,
      playerTwoItems.length,
    );

  if (setCount === 0) {
    return null;
  }

  const formattedSets: string[] =
    [];

  for (
    let index = 0;
    index < setCount;
    index += 1
  ) {
    const playerOne =
      playerOneItems[index];

    const playerTwo =
      playerTwoItems[index];

    if (
      playerOne.game === null ||
      playerTwo.game === null
    ) {
      continue;
    }

    const tieBreak =
      playerOne.tieBreak ??
      playerTwo.tieBreak;

    formattedSets.push(
      `${playerOne.game}-${playerTwo.game}${
        tieBreak !== null
          ? `(${tieBreak})`
          : ""
      }`,
    );
  }

  return (
    formattedSets.join(" ") ||
    null
  );
}


async function readCurrentDomScoreItems(
  statsItem: import("playwright").Locator,
): Promise<CurrentDomScoreItem[]> {
  const scoreItems =
    statsItem.locator(
      ".scores .score-item",
    );

  const scoreItemCount =
    await scoreItems.count();

  const parsed: CurrentDomScoreItem[] =
    [];

  for (
    let index = 0;
    index < scoreItemCount;
    index += 1
  ) {
    const scoreItem =
      scoreItems.nth(
        index,
      );

    const spans =
      scoreItem.locator(
        "span",
      );

    const spanCount =
      await spans.count();

    if (spanCount === 0) {
      continue;
    }

    const gameText =
      normalizeText(
        await spans
          .nth(0)
          .innerText()
          .catch(
            () => "",
          ),
      );

    const tieBreakText =
      spanCount > 1
        ? normalizeText(
            await spans
              .nth(1)
              .innerText()
              .catch(
                () => "",
              ),
          )
        : "";

    const game =
      /^\d+$/.test(
        gameText,
      )
        ? Number.parseInt(
            gameText,
            10,
          )
        : null;

    const tieBreak =
      /^\d+$/.test(
        tieBreakText,
      )
        ? Number.parseInt(
            tieBreakText,
            10,
          )
        : null;

    if (game === null) {
      continue;
    }

    parsed.push({
      game,
      tieBreak,
    });
  }

  return parsed;
}


async function extractCurrentResultsMatches(
  page: Page,
): Promise<
  Array<
    Omit<
      ExtractedAtpTournamentMatch,
      "matchNumber" | "bracketPosition"
    >
  >
> {
  const matchLocators =
    page.locator(
      ".match",
    );

  const matchCount =
    await matchLocators.count();

  const extractedMatches: Array<
    Omit<
      ExtractedAtpTournamentMatch,
      "matchNumber" | "bracketPosition"
    >
  > = [];

  const signatures =
    new Set<string>();

  for (
    let index = 0;
    index < matchCount;
    index += 1
  ) {
    const matchLocator =
      matchLocators.nth(
        index,
      );

    const rawText =
      await matchLocator
        .innerText()
        .catch(
          () => "",
        );

    const text =
      normalizeText(
        rawText,
      );

    if (
      !text ||
      /\bQualifying\b/i.test(
        text,
      )
    ) {
      continue;
    }

    const headerText =
      normalizeText(
        await matchLocator
          .locator(
            ".match-header",
          )
          .first()
          .innerText()
          .catch(
            () => "",
          ),
      );

    const round =
      parseRound(
        headerText ||
        text,
      );

    if (!round) {
      continue;
    }

    const statsItems =
      matchLocator.locator(
        ".match-stats > .stats-item",
      );

    const statsItemCount =
      await statsItems.count();

    if (
      statsItemCount !== 2
    ) {
      continue;
    }

    const players: ExtractedAtpTournamentPlayer[] =
      [];

    let winnerIndex:
      | 0
      | 1
      | null =
      null;

    const scoreRows: CurrentDomScoreItem[][] =
      [];

    for (
      let playerIndex = 0;
      playerIndex < 2;
      playerIndex += 1
    ) {
      const statsItem =
        statsItems.nth(
          playerIndex,
        );

      const playerLink =
        statsItem
          .locator(
            '.player-info a[href*="/players/"]',
          )
          .first();

      const href =
        await playerLink
          .getAttribute(
            "href",
          );

      const name =
        stripSeedFromPlayerName(
          normalizeText(
            await playerLink
              .innerText()
              .catch(
                () => "",
              ),
          ),
        );

      if (
        !href ||
        !name ||
        !/\/players\/[^/]+\/[^/?#]+\/overview(?:[?#].*)?$/i.test(
          href,
        )
      ) {
        players.length = 0;
        break;
      }

      players.push(
        parseProfile(
          name,
          href,
        ),
      );

      const hasWinnerMarker =
        await statsItem
          .locator(
            ".player-info .winner",
          )
          .count();

      if (
        hasWinnerMarker > 0
      ) {
        winnerIndex =
          playerIndex as 0 | 1;
      }

      scoreRows.push(
        await readCurrentDomScoreItems(
          statsItem,
        ),
      );
    }

    if (
      players.length !== 2 ||
      scoreRows.length !== 2 ||
      winnerIndex === null
    ) {
      continue;
    }

    const winner =
      players[
        winnerIndex
      ];

    const loser =
      players[
        winnerIndex === 0
          ? 1
          : 0
      ];

    const externalId =
      createMatchExternalId(
        round,
        players,
      );

    if (
      signatures.has(
        externalId,
      )
    ) {
      continue;
    }

    signatures.add(
      externalId,
    );

    const court =
      normalizeText(
        (
          headerText ||
          ""
        ).replace(
          /^(?:Round of \d+|Quarter[- ]?Finals?|Semi[- ]?Finals?|Final)\s*-\s*/i,
          "",
        ),
      ) || null;

    extractedMatches.push({
      externalId,
      round,
      roundOrder:
        ROUND_ORDER[round],
      playerOne:
        players[0],
      playerTwo:
        players[1],
      winner,
      loser,
      score:
        formatCurrentDomScore(
          scoreRows[0],
          scoreRows[1],
        ),
      court,
      resultType:
        parseResultType(
          text,
        ),
      sourceText:
        text,
    });
  }

  return extractedMatches;
}


export async function extractAtpTournamentDraw(
  input: ExtractAtpTournamentDrawInput,
): Promise<ExtractedAtpTournamentDraw> {
  const sourceMode =
    input.sourceMode ??
    "archive";

  const sourceUrl =
    sourceMode === "current"
      ? `https://www.atptour.com/en/scores/current/${input.tournamentSlug}/${input.tournamentId}/results`
      : `https://www.atptour.com/en/scores/archive/${input.tournamentSlug}/${input.tournamentId}/${input.year}/results`;

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
      sourceUrl,
      {
        waitUntil: "domcontentloaded",
        timeout: 60_000,
      },
    );

    await page.waitForTimeout(
      12_000,
    );

    const rawBodyText =
      await page
        .locator("body")
        .innerText()
        .catch(() => "");

    const bodyText =
      normalizeText(
        rawBodyText,
      );

    if (isSecurityPage(bodyText)) {
      throw new Error(
        "ATP security verification blocked automated access.",
      );
    }

    const extractedMatches: Array<
      Omit<
        ExtractedAtpTournamentMatch,
        "matchNumber" | "bracketPosition"
      >
    > =
      sourceMode === "current"
        ? await extractCurrentResultsMatches(
            page,
          )
        : [];

    const signatures =
      new Set<string>(
        extractedMatches.map(
          (match) =>
            match.externalId,
        ),
      );

    if (
      sourceMode === "archive"
    ) {
      const allTexts =
        await page
          .locator("body *")
          .allInnerTexts();

      for (
        let elementIndex = 0;
        elementIndex < allTexts.length;
        elementIndex += 1
      ) {
        const text =
          normalizeText(
            allTexts[elementIndex],
          );

        if (
          countOccurrences(
            text,
            "wins the match",
          ) !== 1 ||
          countOccurrences(
            text,
            "Game Set and Match",
          ) !== 1 ||
          /\bQualifying\b/i.test(text)
        ) {
          continue;
        }

        const round =
          parseRound(text);

        if (!round) {
          continue;
        }

        const players =
          parsePlayersFromText(
            text,
          );

        if (players.length !== 2) {
          continue;
        }

        const winner =
          parseWinner(
            text,
            players,
          );

        const loser =
          winner
            ? players.find(
                (player) =>
                  player !== winner,
              ) ?? null
            : null;

        if (!winner || !loser) {
          continue;
        }

        const externalId =
          createMatchExternalId(
            round,
            players,
          );

        if (
          signatures.has(
            externalId,
          )
        ) {
          continue;
        }

        signatures.add(
          externalId,
        );

        extractedMatches.push({
          externalId,
          round,
          roundOrder:
            ROUND_ORDER[round],
          playerOne:
            players[0],
          playerTwo:
            players[1],
          winner,
          loser,
          score:
            parseScore(text),
          court:
            parseCourt(text),
          resultType:
            parseResultType(text),
          sourceText:
            text,
        });
      }

      const hasFinal =
        extractedMatches.some(
          (match) =>
            match.round === "FINAL",
        );

      if (!hasFinal) {
        const scoreboardFinal =
          extractFinalFromScoreboard(
            rawBodyText,
          );

        if (
          scoreboardFinal &&
          !signatures.has(
            scoreboardFinal.externalId,
          )
        ) {
          signatures.add(
            scoreboardFinal.externalId,
          );

          extractedMatches.push(
            scoreboardFinal,
          );
        }
      }
    }

    const roundCounters =
      new Map<ExtractedAtpTournamentRound, number>();

    const matches =
      extractedMatches
        .sort((left, right) => {
          if (
            left.roundOrder !==
            right.roundOrder
          ) {
            return (
              left.roundOrder -
              right.roundOrder
            );
          }

          return left.externalId.localeCompare(
            right.externalId,
          );
        })
        .map((match) => {
          const matchNumber =
            (roundCounters.get(match.round) ?? 0) + 1;

          roundCounters.set(
            match.round,
            matchNumber,
          );

          return {
            ...match,
            matchNumber,
            bracketPosition:
              matchNumber,
          };
        });

    const playerMap =
      new Map<string, ExtractedAtpTournamentPlayer>();

    for (const match of matches) {
      for (
        const player
        of [
          match.playerOne,
          match.playerTwo,
        ]
      ) {
        const key =
          player.externalId ??
          player.profileSlug ??
          player.name.toLocaleLowerCase();

        playerMap.set(
          key,
          player,
        );
      }
    }

    const players =
      Array.from(
        playerMap.values(),
      );

    if (matches.length === 0) {
      throw new Error(
        `No completed main-draw singles matches found at ${sourceUrl}.`,
      );
    }

    return {
      source: "ATP",
      sourceUrl,
      tournamentSlug:
        input.tournamentSlug,
      tournamentId:
        input.tournamentId,
      year:
        input.year,
      drawSize:
        players.length,
      players,
      matches,
      extractedAt:
        new Date(),
    };
  } finally {
    await browser.close();
  }
}
