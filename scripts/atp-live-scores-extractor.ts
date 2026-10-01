import {
  chromium,
  type Locator,
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

const USER_AGENT = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
  "AppleWebKit/537.36 (KHTML, like Gecko)",
  "Chrome/152.0.0.0 Safari/537.36",
].join(" ");

function cleanText(
  value: string | null | undefined,
): string {
  return value?.replace(/\s+/g, " ").trim() ?? "";
}

function cleanPlayerName(value: string): string {
  return value.replace(/\s*\(\d+\)\s*$/, "").trim();
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function getPlayerNames(
  matchNode: Locator,
): Promise<string[]> {
  const playerNodes = matchNode.locator("[class*='player']");
  const count = await playerNodes.count();
  const names: string[] = [];

  for (let index = 0; index < count; index += 1) {
    const text = cleanText(
      await playerNodes
        .nth(index)
        .innerText()
        .catch(() => ""),
    );

    if (
      !text ||
      text.length > 60 ||
      /^[\d\s]+$/.test(text) ||
      /\b(profile|rank|serve|career|latest|news)\b/i.test(text)
    ) {
      continue;
    }

    const normalized = cleanPlayerName(text);

    if (
      normalized.length >= 2 &&
      !names.includes(normalized)
    ) {
      names.push(normalized);
    }
  }

  return names;
}

async function getScoreRows(
  matchNode: Locator,
): Promise<string[][]> {
  /*
   * Ogni contenitore .scores rappresenta un giocatore.
   * Il primo .score-item è il game corrente;
   * i successivi contengono i punteggi dei set.
   */
  const containers = matchNode.locator(".scores");
  const count = await containers.count();
  const rows: string[][] = [];

  for (let index = 0; index < count; index += 1) {
    const items = containers.nth(index).locator(".score-item");
    const itemCount = await items.count();
    const values: string[] = [];

    for (let itemIndex = 0; itemIndex < itemCount; itemIndex += 1) {
      const value = cleanText(
        await items
          .nth(itemIndex)
          .innerText()
          .catch(() => ""),
      );

      if (value) {
        values.push(value);
      }
    }

    if (values.length > 0) {
      rows.push(values);
    }
  }

  return rows;
}

async function extractLiveMatchesFromPage(
  page: Page,
): Promise<ExtractedAtpLiveScoreMatch[]> {
  const candidates = page.locator("[class*='match']");
  const count = await candidates.count();
  const matches: ExtractedAtpLiveScoreMatch[] = [];
  const seen = new Set<string>();

  for (let index = 0; index < count; index += 1) {
    const candidate = candidates.nth(index);
    const sourceText = cleanText(
      await candidate.innerText().catch(() => ""),
    );

    if (!sourceText || !/\blive\b/i.test(sourceText)) {
      continue;
    }

    const playerNames = await getPlayerNames(candidate);
    const playerOne = playerNames[0];
    const playerTwo = playerNames[1];

    if (!playerOne || !playerTwo) {
      continue;
    }

    const dedupeKey = [
      playerOne.toLowerCase(),
      playerTwo.toLowerCase(),
    ]
      .sort()
      .join("|");

    if (seen.has(dedupeKey)) {
      continue;
    }

    const scoreRows = await getScoreRows(candidate);

    if (scoreRows.length < 2) {
      continue;
    }

    const playerOneRow = scoreRows[0] ?? [];
    const playerTwoRow = scoreRows[1] ?? [];

    const roundMatch = sourceText.match(
      /Round of 128|Round of 64|Round of 32|Round of 16|Quarterfinals?|Semifinals?|Final/i,
    );

    const roundLabel = roundMatch?.[0] ?? null;
    let court: string | null = null;

    if (roundLabel) {
      const courtPattern = new RegExp(
        [
          escapeRegExp(roundLabel),
          "\\.?\\s*Live\\s+",
          "(.+?)\\s+",
          escapeRegExp(playerOne),
        ].join(""),
        "i",
      );

      court = cleanText(sourceText.match(courtPattern)?.[1]) || null;
    }

    seen.add(dedupeKey);

    matches.push({
      roundLabel,
      court,
      status: "LIVE",
      playerOne: {
        name: playerOne,
      },
      playerTwo: {
        name: playerTwo,
      },
      playerOneCurrentGame: playerOneRow[0] ?? null,
      playerTwoCurrentGame: playerTwoRow[0] ?? null,
      playerOneSetScores: playerOneRow.slice(1),
      playerTwoSetScores: playerTwoRow.slice(1),
      sourceText,
    });
  }

  return matches;
}

export async function extractAtpLiveScores(params: {
  tournamentSlug: string;
  tournamentId: string;
}): Promise<ExtractedAtpLiveScoreMatch[]> {
  const { tournamentSlug, tournamentId } = params;

  const url = [
    "https://www.atptour.com/en/scores/current",
    encodeURIComponent(tournamentSlug),
    encodeURIComponent(tournamentId),
    "live-scores",
  ].join("/");

  const browser = await chromium.launch({
    headless: true,
  });

  try {
    const page = await browser.newPage({
      viewport: {
        width: 1440,
        height: 1200,
      },
      locale: "en-US",
      userAgent: USER_AGENT,
    });

    console.log(`🌐 ATP live scores: ${url}`);

    const response = await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 60_000,
    });

    if (!response) {
      throw new Error(
        `ATP live scores: risposta HTTP assente per ${tournamentSlug}/${tournamentId}.`,
      );
    }

    const httpStatus = response.status();

    console.log(`📡 ATP live scores HTTP: ${httpStatus}`);

    if (httpStatus === 401 || httpStatus === 403) {
      throw new Error(
        [
          `ATP live scores HTTP ${httpStatus}: accesso rifiutato`,
          `per ${tournamentSlug}/${tournamentId}.`,
          "Estrazione non eseguita; nessun dato live disponibile da salvare.",
        ].join(" "),
      );
    }

    if (httpStatus >= 400) {
      throw new Error(
        `ATP live scores HTTP ${httpStatus} per ${tournamentSlug}/${tournamentId}.`,
      );
    }

    await page.waitForTimeout(5_000);

    const pageTitle = await page.title();
    const bodyText = cleanText(
      await page.locator("body").innerText(),
    );

    /*
     * Una pagina di verifica può essere restituita anche con HTTP 200.
     * Non deve essere interpretata come "nessuna partita live".
     */
    const verificationPattern =
      /verify you are human|verifying you are human|security verification|access denied|request blocked|pardon our interruption|just a moment/i;

    if (
      verificationPattern.test(pageTitle) ||
      (
        bodyText.length < 12_000 &&
        verificationPattern.test(bodyText)
      )
    ) {
      throw new Error(
        [
          "ATP live scores: pagina di verifica o blocco di accesso",
          `per ${tournamentSlug}/${tournamentId}.`,
          "La pagina non viene trattata come un elenco live vuoto.",
        ].join(" "),
      );
    }

    return await extractLiveMatchesFromPage(page);
  } finally {
    await browser.close();
  }
}