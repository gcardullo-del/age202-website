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
  validYears: (
    year: number,
    currentYear: number,
  ) => boolean;
};


type Top50Player = {
  playerId: string;
  playerName: string;
  playerSlug: string;
  wtaName: string;
  wtaSlug: string;
  rank: number;
};


type WinnerResolution =
  | {
      status: "MATCH";
      player: Top50Player;
    }
  | {
      status: "OUTSIDE_TOP_50";
    }
  | {
      status: "UNRESOLVED";
    };


type BackfillResult = {
  tournamentName: string;
  tournamentKey: string;
  year: number;
  winnerLabel: string | null;
  status:
    | "CREATED"
    | "EXISTS"
    | "DRY_RUN"
    | "OUTSIDE_TOP_50"
    | "UNRESOLVED"
    | "NO_EDITION"
    | "ERROR";
  playerName?: string;
  playerSlug?: string;
  message?: string;
};


const GRAND_SLAM_START_YEAR =
  1968;

const WTA_1000_START_YEAR =
  2009;


function between(
  year: number,
  from: number,
  to: number,
): boolean {
  return (
    year >= from &&
    year <= to
  );
}


function isOdd(
  year: number,
): boolean {
  return (
    year %
      2 ===
    1
  );
}


function isEven(
  year: number,
): boolean {
  return (
    year %
      2 ===
    0
  );
}


const TROPHY_TOURNAMENTS: TrophyTournament[] = [
  // ─────────────────────────────────────
  // GRAND SLAM
  // ─────────────────────────────────────
  {
    tournamentKey:
      "australian-open",

    tournamentName:
      "Australian Open",

    category:
      PlayerTrophyCategory.GRAND_SLAM,

    sourceUrl:
      "https://www.wtatennis.com/tournaments/australian-open/past-winners",

    validYears:
      (
        year,
        currentYear,
      ) =>
        between(
          year,
          GRAND_SLAM_START_YEAR,
          currentYear,
        ),
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

    validYears:
      (
        year,
        currentYear,
      ) =>
        between(
          year,
          GRAND_SLAM_START_YEAR,
          currentYear,
        ),
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

    validYears:
      (
        year,
        currentYear,
      ) =>
        between(
          year,
          GRAND_SLAM_START_YEAR,
          currentYear,
        ),
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

    validYears:
      (
        year,
        currentYear,
      ) =>
        between(
          year,
          GRAND_SLAM_START_YEAR,
          currentYear,
        ),
  },

  // ─────────────────────────────────────
  // WTA 1000 / historical equivalents
  // Premier Mandatory + Premier 5 from 2009
  // ─────────────────────────────────────
  {
    tournamentKey:
      "dubai",

    tournamentName:
      "Dubai",

    category:
      PlayerTrophyCategory.WTA_1000,

    sourceUrl:
      "https://www.wtatennis.com/tournaments/dubai/past-winners",

    validYears:
      (
        year,
        currentYear,
      ) => {
        if (
          year <
            WTA_1000_START_YEAR ||
          year >
            currentYear
        ) {
          return false;
        }

        if (
          between(
            year,
            2009,
            2011,
          )
        ) {
          return true;
        }

        if (
          between(
            year,
            2015,
            2023,
          )
        ) {
          return isOdd(
            year,
          );
        }

        return (
          year >=
          2024
        );
      },
  },

  {
    tournamentKey:
      "doha",

    tournamentName:
      "Doha",

    category:
      PlayerTrophyCategory.WTA_1000,

    sourceUrl:
      "https://www.wtatennis.com/tournaments/doha/past-winners",

    validYears:
      (
        year,
        currentYear,
      ) => {
        if (
          year <
            WTA_1000_START_YEAR ||
          year >
            currentYear
        ) {
          return false;
        }

        if (
          between(
            year,
            2012,
            2014,
          )
        ) {
          return true;
        }

        if (
          between(
            year,
            2015,
            2023,
          )
        ) {
          return isEven(
            year,
          );
        }

        return (
          year >=
          2024
        );
      },
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

    validYears:
      (
        year,
        currentYear,
      ) =>
        year >= 2009 &&
        year <= currentYear &&
        year !== 2020,
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

    validYears:
      (
        year,
        currentYear,
      ) =>
        year >= 2009 &&
        year <= currentYear &&
        year !== 2020,
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

    validYears:
      (
        year,
        currentYear,
      ) =>
        year >= 2009 &&
        year <= currentYear &&
        year !== 2020,
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

    validYears:
      (
        year,
        currentYear,
      ) =>
        year >= 2009 &&
        year <= currentYear,
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

    validYears:
      (
        year,
        currentYear,
      ) =>
        year >= 2009 &&
        year <= currentYear &&
        year !== 2020,
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

    validYears:
      (
        year,
        currentYear,
      ) =>
        year >= 2009 &&
        year <= currentYear,
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

    validYears:
      (
        year,
        currentYear,
      ) => {
        if (
          year <
            2009 ||
          year >
            currentYear
        ) {
          return false;
        }

        if (
          between(
            year,
            2020,
            2022,
          )
        ) {
          return false;
        }

        return true;
      },
  },

  {
    tournamentKey:
      "tokyo",

    tournamentName:
      "Tokyo",

    category:
      PlayerTrophyCategory.WTA_1000,

    sourceUrl:
      "https://www.wtatennis.com/tournaments/1056/tokyo/2013/past-winners",

    validYears:
      (
        year,
        _currentYear,
      ) =>
        between(
          year,
          2009,
          2013,
        ),
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

    validYears:
      (
        year,
        currentYear,
      ) => {
        if (
          year >
          currentYear
        ) {
          return false;
        }

        return (
          between(
            year,
            2014,
            2019,
          ) ||
          year >=
            2024
        );
      },
  },

  {
    tournamentKey:
      "guadalajara",

    tournamentName:
      "Guadalajara",

    category:
      PlayerTrophyCategory.WTA_1000,

    sourceUrl:
      "https://www.wtatennis.com/tournaments/2075/guadalajara/2023/past-winners",

    validYears:
      (
        year,
        _currentYear,
      ) =>
        year === 2022 ||
        year === 2023,
  },
];


function hasFlag(
  name: string,
): boolean {
  return process.argv.includes(
    `--${name}`,
  );
}


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


function lastNameOnly(
  fullName: string,
): string {
  const parts =
    normalizeText(
      fullName,
    )
      .split(
        " ",
      )
      .filter(
        Boolean,
      );

  return (
    parts[
      parts.length -
      1
    ] ??
    ""
  );
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
      "View Score Score" ||
    normalized ===
      "View Score"
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


function extractSinglesHonorRoll(
  bodyText: string,
): Map<number, string> {
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

  const winners =
    new Map<
      number,
      string
    >();

  for (
    let index =
      0;
    index <
    lines.length;
    index +=
      1
  ) {
    const line =
      lines[
        index
      ];

    if (
      !/^\d{4}$/.test(
        line,
      )
    ) {
      continue;
    }

    const year =
      Number.parseInt(
        line,
        10,
      );

    if (
      winners.has(
        year,
      )
    ) {
      continue;
    }

    for (
      let offset =
        index + 1;
      offset <
        Math.min(
          lines.length,
          index + 12,
        );
      offset +=
        1
    ) {
      const candidate =
        lines[
          offset
        ];

      if (
        /^\d{4}$/.test(
          candidate,
        )
      ) {
        break;
      }

      if (
        isIgnoredHonorRollLine(
          candidate,
        )
      ) {
        continue;
      }

      winners.set(
        year,
        candidate,
      );

      break;
    }
  }

  return winners;
}


async function loadHonorRoll(
  page: Page,
  tournament: TrophyTournament,
): Promise<Map<number, string>> {
  console.log(
    `🌐 ${tournament.tournamentName}`,
  );

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
    1_500,
  );

  const bodyText =
    await page
      .locator(
        "body",
      )
      .innerText();

  return extractSinglesHonorRoll(
    bodyText,
  );
}


async function getTop50Players(): Promise<
  Top50Player[]
> {
  const {
    prisma,
  } =
    await import(
      "@/lib/prisma"
    );

  const rows =
    await prisma.wtaPlayer.findMany({
      where: {
        active:
          true,

        rank: {
          gte:
            1,

          lte:
            50,
        },

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

        rank:
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

      orderBy: {
        rank:
          "asc",
      },
    });

  return rows.flatMap(
    (
      row,
    ) => {
      if (
        !row.player
      ) {
        return [];
      }

      return [
        {
          playerId:
            row.player.id,

          playerName:
            row.player.name,

          playerSlug:
            row.player.slug,

          wtaName:
            row.name,

          wtaSlug:
            row.slug,

          rank:
            row.rank,
        },
      ];
    },
  );
}


function resolveAgainstTop50(
  winnerLabel: string,
  top50: Top50Player[],
): WinnerResolution {
  const normalizedWinner =
    normalizeText(
      winnerLabel,
    );

  const exactMatches =
    top50.filter(
      (
        player,
      ) =>
        normalizeText(
          player.wtaName,
        ) ===
          normalizedWinner ||
        normalizeText(
          player.playerName,
        ) ===
          normalizedWinner,
    );

  if (
    exactMatches.length ===
    1
  ) {
    return {
      status:
        "MATCH",

      player:
        exactMatches[0],
    };
  }

  const abbreviatedMatches =
    top50.filter(
      (
        player,
      ) =>
        abbreviatedName(
          player.wtaName,
        ) ===
          normalizedWinner ||
        abbreviatedName(
          player.playerName,
        ) ===
          normalizedWinner,
    );

  if (
    abbreviatedMatches.length ===
    1
  ) {
    return {
      status:
        "MATCH",

      player:
        abbreviatedMatches[0],
    };
  }

  const labelLastName =
    lastNameOnly(
      winnerLabel,
    );

  const lastNameMatches =
    top50.filter(
      (
        player,
      ) =>
        lastNameOnly(
          player.wtaName,
        ) ===
          labelLastName ||
        lastNameOnly(
          player.playerName,
        ) ===
          labelLastName,
    );

  if (
    lastNameMatches.length ===
    1
  ) {
    return {
      status:
        "MATCH",

      player:
        lastNameMatches[0],
    };
  }

  return {
    status:
      "OUTSIDE_TOP_50",
  };
}


async function persistTrophy({
  tournament,
  year,
  winnerLabel,
  player,
  write,
}: {
  tournament: TrophyTournament;
  year: number;
  winnerLabel: string;
  player: Top50Player;
  write: boolean;
}): Promise<BackfillResult> {
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
            player.playerId,

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
    return {
      tournamentName:
        tournament.tournamentName,

      tournamentKey:
        tournament.tournamentKey,

      year,

      winnerLabel,

      status:
        "EXISTS",

      playerName:
        player.playerName,

      playerSlug:
        player.playerSlug,
    };
  }

  if (
    !write
  ) {
    return {
      tournamentName:
        tournament.tournamentName,

      tournamentKey:
        tournament.tournamentKey,

      year,

      winnerLabel,

      status:
        "DRY_RUN",

      playerName:
        player.playerName,

      playerSlug:
        player.playerSlug,
    };
  }

  await prisma.playerTrophyWin.create({
    data: {
      playerId:
        player.playerId,

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

  return {
    tournamentName:
      tournament.tournamentName,

    tournamentKey:
      tournament.tournamentKey,

    year,

    winnerLabel,

    status:
      "CREATED",

    playerName:
      player.playerName,

    playerSlug:
      player.playerSlug,
  };
}


function printTop50Summary(
  top50: Top50Player[],
  counts: Map<string, number>,
) {
  console.log("");
  console.log(
    "🏛️ TOP 50 TROPHY CABINET COVERAGE",
  );
  console.log(
    "────────────────────────────────────────────",
  );

  for (
    const player of top50
  ) {
    const count =
      counts.get(
        player.playerId,
      ) ??
      0;

    console.log(
      `${String(
        player.rank,
      ).padStart(
        2,
        "0",
      )}. ${player.playerName} · ${count}`,
    );
  }
}


async function main() {
  if (
    !process.env.DATABASE_URL
  ) {
    throw new Error(
      "DATABASE_URL is missing.",
    );
  }

  const write =
    hasFlag(
      "write",
    );

  const only =
    getArgumentValue(
      "only",
    )
      ?.trim()
      .toLowerCase() ??
    null;

  const currentYear =
    new Date().getFullYear();

  const tournaments =
    only
      ? TROPHY_TOURNAMENTS.filter(
          (
            tournament,
          ) =>
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

  const top50 =
    await getTop50Players();

  console.log("");
  console.log(
    "🏆 AGE202 · WTA TOP 50 TROPHY BACKFILL",
  );
  console.log(
    "────────────────────────────────────────────",
  );
  console.log(
    `👥 AGE202 Top 50 profiles: ${top50.length}`,
  );
  console.log(
    `📅 Through: ${currentYear}`,
  );
  console.log(
    `🎾 Tournaments: ${tournaments.length}`,
  );
  console.log(
    `💾 Mode: ${write ? "WRITE" : "DRY RUN"}`,
  );
  console.log("");

  if (
    top50.length <
    50
  ) {
    console.warn(
      `⚠️ Expected 50 linked WTA profiles, found ${top50.length}.`,
    );
    console.warn(
      "   The backfill will continue for the profiles currently linked.",
    );
    console.log("");
  }

  let browser:
    | Browser
    | null =
      null;

  const results:
    BackfillResult[] =
      [];

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

    for (
      const tournament of tournaments
    ) {
      let honorRoll:
        Map<
          number,
          string
        >;

      try {
        honorRoll =
          await loadHonorRoll(
            page,
            tournament,
          );
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
          `❌ ${tournament.tournamentName}: ${message}`,
        );

        results.push({
          tournamentName:
            tournament.tournamentName,

          tournamentKey:
            tournament.tournamentKey,

          year:
            currentYear,

          winnerLabel:
            null,

          status:
            "ERROR",

          message,
        });

        console.log("");
        continue;
      }

      let relevantEditions =
        0;

      let matchedTop50 =
        0;

      for (
        const [
          year,
          winnerLabel,
        ] of honorRoll.entries()
      ) {
        if (
          !tournament.validYears(
            year,
            currentYear,
          )
        ) {
          continue;
        }

        relevantEditions +=
          1;

        const resolution =
          resolveAgainstTop50(
            winnerLabel,
            top50,
          );

        if (
          resolution.status !==
          "MATCH"
        ) {
          results.push({
            tournamentName:
              tournament.tournamentName,

            tournamentKey:
              tournament.tournamentKey,

            year,

            winnerLabel,

            status:
              "OUTSIDE_TOP_50",
          });

          continue;
        }

        matchedTop50 +=
          1;

        const result =
          await persistTrophy({
            tournament,
            year,
            winnerLabel,
            player:
              resolution.player,
            write,
          });

        results.push(
          result,
        );

        const marker =
          result.status ===
            "CREATED"
            ? "✅"
            : result.status ===
                "EXISTS"
              ? "↩️"
              : "🛡️";

        console.log(
          `   ${marker} ${year} · ${resolution.player.playerName} · ${result.status}`,
        );
      }

      console.log(
        `   📚 Valid editions found: ${relevantEditions}`,
      );
      console.log(
        `   👤 Current Top 50 winners: ${matchedTop50}`,
      );
      console.log("");
    }
  } finally {
    if (
      browser
    ) {
      await browser.close();
    }
  }

  const {
    prisma,
  } =
    await import(
      "@/lib/prisma"
    );

  const storedCounts =
    await prisma.playerTrophyWin.groupBy({
      by: [
        "playerId",
      ],

      where: {
        playerId: {
          in:
            top50.map(
              (
                player,
              ) =>
                player.playerId,
            ),
        },

        category: {
          in: [
            PlayerTrophyCategory.GRAND_SLAM,
            PlayerTrophyCategory.WTA_1000,
          ],
        },
      },

      _count: {
        _all:
          true,
      },
    });

  const counts =
    new Map(
      storedCounts.map(
        (
          row,
        ) => [
          row.playerId,
          row._count._all,
        ],
      ),
    );

  printTop50Summary(
    top50,
    counts,
  );

  const created =
    results.filter(
      (
        result,
      ) =>
        result.status ===
        "CREATED",
    ).length;

  const existing =
    results.filter(
      (
        result,
      ) =>
        result.status ===
        "EXISTS",
    ).length;

  const dryRun =
    results.filter(
      (
        result,
      ) =>
        result.status ===
        "DRY_RUN",
    ).length;

  const outsideTop50 =
    results.filter(
      (
        result,
      ) =>
        result.status ===
        "OUTSIDE_TOP_50",
    ).length;

  const errors =
    results.filter(
      (
        result,
      ) =>
        result.status ===
        "ERROR",
    ).length;

  console.log("");
  console.log(
    "────────────────────────────────────────────",
  );
  console.log(
    "📊 RIEPILOGO BACKFILL",
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
    `👥 Vittorie fuori dalla Top 50 corrente: ${outsideTop50}`,
  );
  console.log(
    `❌ Errori sorgente: ${errors}`,
  );

  if (
    errors >
    0
  ) {
    process.exitCode =
      1;
  }
}


main().catch(
  (
    error: unknown,
  ) => {
    console.error("");
    console.error(
      "❌ WTA Top 50 Trophy Backfill fallito.",
    );

    console.error(
      error,
    );

    process.exitCode =
      1;
  },
);
