import {
  chromium,
  type Browser,
  type Page,
} from "playwright";

import {
  config,
} from "dotenv";

import {
  PlayerTrophyCategory,
} from "@/generated/prisma/client";


config({
  path: ".env.local",
});

config();


type TrophyTournament = {
  tournamentKey: string;
  tournamentName: string;
  category: PlayerTrophyCategory;
  sourceUrl: string;
};


type ResolvedWinner = {
  playerId: string;
  name: string;
  slug: string;
};


type SyncResult = {
  tournamentKey: string;
  tournamentName: string;
  year: number;
  winnerLabel: string | null;
  resolvedWinner: ResolvedWinner | null;
  status:
    | "CREATED"
    | "EXISTS"
    | "DRY_RUN"
    | "NO_WINNER"
    | "UNRESOLVED"
    | "ERROR";
  message?: string;
};


const TROPHY_TOURNAMENTS: TrophyTournament[] = [
  // GRAND SLAM
  {
    tournamentKey:
      "australian-open",

    tournamentName:
      "Australian Open",

    category:
      PlayerTrophyCategory.GRAND_SLAM,

    sourceUrl:
      "https://www.wtatennis.com/tournaments/australian-open/past-winners",
  },

  {
    tournamentKey:
      "roland-garros",

    tournamentName:
      "Roland Garros",

    category:
      PlayerTrophyCategory.GRAND_SLAM,

    sourceUrl:
      "https://www.wtatennis.com/tournaments/roland-garros/past-winners",
  },

  {
    tournamentKey:
      "wimbledon",

    tournamentName:
      "Wimbledon",

    category:
      PlayerTrophyCategory.GRAND_SLAM,

    sourceUrl:
      "https://www.wtatennis.com/tournaments/wimbledon/past-winners",
  },

  {
    tournamentKey:
      "us-open",

    tournamentName:
      "US Open",

    category:
      PlayerTrophyCategory.GRAND_SLAM,

    sourceUrl:
      "https://www.wtatennis.com/tournaments/us-open/past-winners",
  },

  // WTA 1000
  {
    tournamentKey:
      "doha",

    tournamentName:
      "Doha",

    category:
      PlayerTrophyCategory.WTA_1000,

    sourceUrl:
      "https://www.wtatennis.com/tournaments/doha/past-winners",
  },

  {
    tournamentKey:
      "dubai",

    tournamentName:
      "Dubai",

    category:
      PlayerTrophyCategory.WTA_1000,

    sourceUrl:
      "https://www.wtatennis.com/tournaments/dubai/past-winners",
  },

  {
    tournamentKey:
      "indian-wells",

    tournamentName:
      "Indian Wells",

    category:
      PlayerTrophyCategory.WTA_1000,

    sourceUrl:
      "https://www.wtatennis.com/tournaments/indian-wells/past-winners",
  },

  {
    tournamentKey:
      "miami",

    tournamentName:
      "Miami",

    category:
      PlayerTrophyCategory.WTA_1000,

    sourceUrl:
      "https://www.wtatennis.com/tournaments/miami-open/past-winners",
  },

  {
    tournamentKey:
      "madrid",

    tournamentName:
      "Madrid",

    category:
      PlayerTrophyCategory.WTA_1000,

    sourceUrl:
      "https://www.wtatennis.com/tournaments/madrid-open/past-winners",
  },

  {
    tournamentKey:
      "rome",

    tournamentName:
      "Rome",

    category:
      PlayerTrophyCategory.WTA_1000,

    sourceUrl:
      "https://www.wtatennis.com/tournaments/rome/past-winners",
  },

  {
    tournamentKey:
      "canadian-open",

    tournamentName:
      "Canadian Open",

    category:
      PlayerTrophyCategory.WTA_1000,

    sourceUrl:
      "https://www.wtatennis.com/tournaments/canadian-open/past-winners",
  },

  {
    tournamentKey:
      "cincinnati",

    tournamentName:
      "Cincinnati",

    category:
      PlayerTrophyCategory.WTA_1000,

    sourceUrl:
      "https://www.wtatennis.com/tournaments/cincinnati-open/past-winners",
  },

  {
    tournamentKey:
      "beijing",

    tournamentName:
      "Beijing",

    category:
      PlayerTrophyCategory.WTA_1000,

    sourceUrl:
      "https://www.wtatennis.com/tournaments/china-open/past-winners",
  },

  {
    tournamentKey:
      "wuhan",

    tournamentName:
      "Wuhan",

    category:
      PlayerTrophyCategory.WTA_1000,

    sourceUrl:
      "https://www.wtatennis.com/tournaments/wuhan-open/past-winners",
  },
];


function getArgumentValue(
  name: string,
): string | null {
  const prefix =
    `--${name}=`;

  const argument =
    process.argv.find(
      (value) =>
        value.startsWith(
          prefix,
        ),
    );

  if (!argument) {
    return null;
  }

  const value =
    argument
      .slice(
        prefix.length,
      )
      .trim();

  return value || null;
}


function hasFlag(
  name: string,
): boolean {
  return process.argv.includes(
    `--${name}`,
  );
}


function parseYear(
  raw: string | null,
): number {
  if (!raw) {
    return new Date().getFullYear();
  }

  const parsed =
    Number.parseInt(
      raw,
      10,
    );

  if (
    !Number.isInteger(
      parsed,
    ) ||
    parsed < 2000 ||
    parsed > 2200
  ) {
    throw new Error(
      `Invalid --year value: ${raw}`,
    );
  }

  return parsed;
}


function normalizeText(
  value: string,
): string {
  return value
    .normalize(
      "NFD",
    )
    .replace(
      /\p{Diacritic}/gu,
      "",
    )
    .replace(
      /[’']/g,
      "",
    )
    .replace(
      /[^a-zA-Z0-9]+/g,
      " ",
    )
    .trim()
    .toLowerCase();
}


function compactWhitespace(
  value: string,
): string {
  return value
    .replace(
      /\s+/g,
      " ",
    )
    .trim();
}


function isDateRangeLine(
  value: string,
): boolean {
  return /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\b/i.test(
    value,
  );
}


function isIgnoredHonorRollLine(
  value: string,
): boolean {
  const normalized =
    compactWhitespace(
      value,
    );

  if (!normalized) {
    return true;
  }

  if (
    normalized ===
    "View Score Score"
  ) {
    return true;
  }

  if (
    normalized ===
    "View Score"
  ) {
    return true;
  }

  if (
    /^\d{4}$/.test(
      normalized,
    )
  ) {
    return true;
  }

  if (
    isDateRangeLine(
      normalized,
    )
  ) {
    return true;
  }

  return false;
}


async function extractSinglesWinner(
  page: Page,
  tournament: TrophyTournament,
  year: number,
): Promise<string | null> {
  await page.goto(
    tournament.sourceUrl,
    {
      waitUntil:
        "domcontentloaded",

      timeout:
        45_000,
    },
  );

  await page.waitForTimeout(
    2_000,
  );

  const bodyText =
    await page.locator(
      "body",
    ).innerText();

  const honorRollIndex =
    bodyText.indexOf(
      "Honor Roll",
    );

  const relevantText =
    honorRollIndex >=
    0
      ? bodyText.slice(
          honorRollIndex,
        )
      : bodyText;

  const lines =
    relevantText
      .split(
        /\r?\n/,
      )
      .map(
        compactWhitespace,
      )
      .filter(
        Boolean,
      );

  const yearLabel =
    String(
      year,
    );

  const yearIndex =
    lines.findIndex(
      (line) =>
        line ===
        yearLabel,
    );

  if (
    yearIndex <
    0
  ) {
    return null;
  }

  for (
    let index =
      yearIndex + 1;
    index <
    Math.min(
      lines.length,
      yearIndex + 12,
    );
    index +=
      1
  ) {
    const line =
      lines[index];

    if (
      isIgnoredHonorRollLine(
        line,
      )
    ) {
      continue;
    }

    // If another year appears before a winner,
    // the requested edition is not available.
    if (
      /^\d{4}$/.test(
        line,
      )
    ) {
      return null;
    }

    return line;
  }

  return null;
}


function abbreviatedName(
  fullName: string,
): string {
  const parts =
    compactWhitespace(
      fullName,
    )
      .split(
        " ",
      )
      .filter(
        Boolean,
      );

  if (
    parts.length <
    2
  ) {
    return normalizeText(
      fullName,
    );
  }

  const firstName =
    parts[0];

  const lastName =
    parts[
      parts.length -
      1
    ];

  return normalizeText(
    `${firstName.charAt(0)} ${lastName}`,
  );
}


async function resolveWinner(
  winnerLabel: string,
): Promise<ResolvedWinner | null> {
  const {
    prisma,
  } =
    await import(
      "@/lib/prisma"
    );

  const candidates =
    await prisma.wtaPlayer.findMany({
      where: {
        active:
          true,

        player: {
          isNot:
            null,
        },
      },

      select: {
        name:
          true,

        slug:
          true,

        player: {
          select: {
            id:
              true,

            name:
              true,

            slug:
              true,
          },
        },
      },
    });

  const normalizedWinner =
    normalizeText(
      winnerLabel,
    );

  const exact =
    candidates.find(
      (candidate) =>
        normalizeText(
          candidate.name,
        ) ===
        normalizedWinner ||
        (
          candidate.player &&
          normalizeText(
            candidate.player.name,
          ) ===
          normalizedWinner
        ),
    );

  if (
    exact?.player
  ) {
    return {
      playerId:
        exact.player.id,

      name:
        exact.player.name,

      slug:
        exact.player.slug,
    };
  }

  const abbreviatedMatches =
    candidates.filter(
      (candidate) =>
        abbreviatedName(
          candidate.name,
        ) ===
        normalizedWinner ||
        (
          candidate.player &&
          abbreviatedName(
            candidate.player.name,
          ) ===
          normalizedWinner
        ),
    );

  if (
    abbreviatedMatches.length !==
    1
  ) {
    return null;
  }

  const match =
    abbreviatedMatches[0];

  if (
    !match.player
  ) {
    return null;
  }

  return {
    playerId:
      match.player.id,

    name:
      match.player.name,

    slug:
      match.player.slug,
  };
}


async function syncTournament(
  page: Page,
  tournament: TrophyTournament,
  year: number,
  write: boolean,
): Promise<SyncResult> {
  try {
    console.log(
      `🔎 ${tournament.tournamentName}...`,
    );

    const winnerLabel =
      await extractSinglesWinner(
        page,
        tournament,
        year,
      );

    if (
      !winnerLabel
    ) {
      console.log(
        "   ⏳ Nessuna vincitrice pubblicata per questo anno.",
      );

      return {
        tournamentKey:
          tournament.tournamentKey,

        tournamentName:
          tournament.tournamentName,

        year,

        winnerLabel:
          null,

        resolvedWinner:
          null,

        status:
          "NO_WINNER",
      };
    }

    console.log(
      `   🏆 WTA: ${winnerLabel}`,
    );

    const winner =
      await resolveWinner(
        winnerLabel,
      );

    if (
      !winner
    ) {
      console.log(
        "   ⚠️ Impossibile associare la vincitrice a un profilo AGE202.",
      );

      return {
        tournamentKey:
          tournament.tournamentKey,

        tournamentName:
          tournament.tournamentName,

        year,

        winnerLabel,

        resolvedWinner:
          null,

        status:
          "UNRESOLVED",
      };
    }

    console.log(
      `   👤 AGE202: ${winner.name} (${winner.slug})`,
    );

    const {
      prisma,
    } =
      await import(
        "@/lib/prisma"
      );

    const existing =
      await prisma.playerTrophyWin.findUnique({
        where: {
          playerId_tournamentKey_year: {
            playerId:
              winner.playerId,

            tournamentKey:
              tournament.tournamentKey,

            year,
          },
        },

        select: {
          id:
            true,
        },
      });

    if (
      existing
    ) {
      console.log(
        "   ↩️ Già presente.",
      );

      return {
        tournamentKey:
          tournament.tournamentKey,

        tournamentName:
          tournament.tournamentName,

        year,

        winnerLabel,

        resolvedWinner:
          winner,

        status:
          "EXISTS",
      };
    }

    if (
      !write
    ) {
      console.log(
        "   🛡️ DRY RUN: verrebbe creato.",
      );

      return {
        tournamentKey:
          tournament.tournamentKey,

        tournamentName:
          tournament.tournamentName,

        year,

        winnerLabel,

        resolvedWinner:
          winner,

        status:
          "DRY_RUN",
      };
    }

    await prisma.playerTrophyWin.create({
      data: {
        playerId:
          winner.playerId,

        tournamentKey:
          tournament.tournamentKey,

        tournamentName:
          tournament.tournamentName,

        category:
          tournament.category,

        year,

        sourceUrl:
          tournament.sourceUrl,

        verified:
          true,
      },
    });

    console.log(
      "   ✅ Vittoria aggiunta al Trophy Cabinet.",
    );

    return {
      tournamentKey:
        tournament.tournamentKey,

      tournamentName:
        tournament.tournamentName,

      year,

      winnerLabel,

      resolvedWinner:
        winner,

      status:
        "CREATED",
    };
  } catch (
    error: unknown
  ) {
    const message =
      error instanceof Error
        ? error.message
        : String(
            error,
          );

    console.error(
      `   ❌ ${message}`,
    );

    return {
      tournamentKey:
        tournament.tournamentKey,

      tournamentName:
        tournament.tournamentName,

      year,

      winnerLabel:
        null,

      resolvedWinner:
        null,

      status:
        "ERROR",

      message,
    };
  }
}


async function main() {
  const year =
    parseYear(
      getArgumentValue(
        "year",
      ),
    );

  const only =
    getArgumentValue(
      "only",
    )
      ?.trim()
      .toLowerCase() ??
    null;

  const write =
    hasFlag(
      "write",
    );

  if (
    !process.env.DATABASE_URL
  ) {
    throw new Error(
      "DATABASE_URL is missing.",
    );
  }

  const tournaments =
    only
      ? TROPHY_TOURNAMENTS.filter(
          (tournament) =>
            tournament.tournamentKey ===
            only,
        )
      : TROPHY_TOURNAMENTS;

  if (
    tournaments.length ===
    0
  ) {
    throw new Error(
      `Unknown --only tournament key: ${only}`,
    );
  }

  console.log("");
  console.log(
    "🏆 AGE202 · WTA TROPHY CABINET SYNC",
  );
  console.log(
    "────────────────────────────────────────────",
  );
  console.log(
    `📅 Year: ${year}`,
  );
  console.log(
    `💾 Mode: ${write ? "WRITE" : "DRY RUN"}`,
  );
  console.log(
    `🎾 Tournaments: ${tournaments.length}`,
  );
  console.log("");

  let browser:
    | Browser
    | null =
      null;

  try {
    browser =
      await chromium.launch({
        headless:
          true,
      });

    const context =
      await browser.newContext({
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/151 Safari/537.36",
      });

    const page =
      await context.newPage();

    const results:
      SyncResult[] =
        [];

    for (
      const tournament of tournaments
    ) {
      const result =
        await syncTournament(
          page,
          tournament,
          year,
          write,
        );

      results.push(
        result,
      );

      console.log("");
    }

    const created =
      results.filter(
        (result) =>
          result.status ===
          "CREATED",
      ).length;

    const existing =
      results.filter(
        (result) =>
          result.status ===
          "EXISTS",
      ).length;

    const dryRun =
      results.filter(
        (result) =>
          result.status ===
          "DRY_RUN",
      ).length;

    const noWinner =
      results.filter(
        (result) =>
          result.status ===
          "NO_WINNER",
      ).length;

    const unresolved =
      results.filter(
        (result) =>
          result.status ===
          "UNRESOLVED",
      ).length;

    const errors =
      results.filter(
        (result) =>
          result.status ===
          "ERROR",
      ).length;

    console.log(
      "────────────────────────────────────────────",
    );
    console.log(
      "📊 RIEPILOGO",
    );
    console.log(
      `✅ Creati: ${created}`,
    );
    console.log(
      `↩️ Già presenti: ${existing}`,
    );
    console.log(
      `🛡️ Dry run: ${dryRun}`,
    );
    console.log(
      `⏳ Senza vincitrice: ${noWinner}`,
    );
    console.log(
      `⚠️ Non risolti: ${unresolved}`,
    );
    console.log(
      `❌ Errori: ${errors}`,
    );

    if (
      unresolved >
        0 ||
      errors >
        0
    ) {
      process.exitCode =
        1;
    }
  } finally {
    if (
      browser
    ) {
      await browser.close();
    }
  }
}


main().catch(
  (
    error: unknown,
  ) => {
    console.error("");
    console.error(
      "❌ WTA Trophy Cabinet sync fallito.",
    );

    console.error(
      error,
    );

    process.exitCode =
      1;
  },
);
