import "dotenv/config";

import { prisma } from "../lib/prisma";

type PlayerCandidate = {
  id: string;
  name: string;
  slug: string;
  firstName: string | null;
  lastName: string | null;
  rank: number | null;
};

type PlayerMatchSummary = {
  playerId: string;
  playerName: string;
  playerSlug: string;
  rank: number | null;
  matchedEditions: number;
};

function normalizeName(
  value: string,
): string {
  return value
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      "",
    )
    .toLowerCase()
    .replace(
      /[^a-z0-9]+/g,
      " ",
    )
    .trim()
    .replace(
      /\s+/g,
      " ",
    );
}

function buildPlayerAliases(
  player: PlayerCandidate,
): string[] {
  const aliases =
    new Set<string>();

  aliases.add(
    normalizeName(
      player.name,
    ),
  );

  if (
    player.firstName &&
    player.lastName
  ) {
    aliases.add(
      normalizeName(
        `${player.firstName} ${player.lastName}`,
      ),
    );

    aliases.add(
      normalizeName(
        `${player.lastName} ${player.firstName}`,
      ),
    );
  }

  aliases.add(
    normalizeName(
      player.slug.replace(
        /-/g,
        " ",
      ),
    ),
  );

  return Array.from(
    aliases,
  ).filter(Boolean);
}

async function main() {
  console.log("");
  console.log(
    "AGE202 TROPHY MATCH AUDIT",
  );
  console.log(
    "────────────────────────────────────────",
  );
  console.log("");

  const topPlayersRaw =
    await prisma.atpPlayer.findMany({
      where: {
        active: true,

        rank: {
          lte: 50,
        },

        playerId: {
          not: null,
        },
      },

      select: {
        rank: true,

        player: {
          select: {
            id: true,
            name: true,
            slug: true,
            firstName: true,
            lastName: true,
          },
        },
      },

      orderBy: {
        rank: "asc",
      },
    });

  const players: PlayerCandidate[] =
    topPlayersRaw
      .filter(
        (
          entry,
        ): entry is typeof entry & {
          player: NonNullable<
            typeof entry.player
          >;
        } =>
          entry.player !== null,
      )
      .map((entry) => ({
        id:
          entry.player.id,

        name:
          entry.player.name,

        slug:
          entry.player.slug,

        firstName:
          entry.player.firstName,

        lastName:
          entry.player.lastName,

        rank:
          entry.rank,
      }));

  const unlinkedEditions =
    await prisma.tournamentEdition.findMany({
      where: {
        cancelled: false,

        championPlayerId: null,

        championName: {
          not: null,
        },
      },

      select: {
        id: true,
        year: true,
        championName: true,

        tournament: {
          select: {
            name: true,
            slug: true,
            category: true,
          },
        },
      },

      orderBy: [
        {
          year: "asc",
        },
      ],
    });

  const aliasToPlayers =
    new Map<
      string,
      PlayerCandidate[]
    >();

  for (const player of players) {
    const aliases =
      buildPlayerAliases(
        player,
      );

    for (const alias of aliases) {
      const existing =
        aliasToPlayers.get(
          alias,
        ) ?? [];

      existing.push(
        player,
      );

      aliasToPlayers.set(
        alias,
        existing,
      );
    }
  }

  const matchedByPlayer =
    new Map<
      string,
      PlayerMatchSummary
    >();

  const ambiguousMatches: {
    championName: string;
    tournamentName: string;
    year: number;
    candidates: string[];
  }[] = [];

  const unmatchedNames =
    new Map<
      string,
      number
    >();

  let recoverableEditions = 0;

  for (
    const edition
    of unlinkedEditions
  ) {
    const championName =
      edition.championName;

    if (!championName) {
      continue;
    }

    const normalizedChampionName =
      normalizeName(
        championName,
      );

    const candidates =
      aliasToPlayers.get(
        normalizedChampionName,
      ) ?? [];

    if (
      candidates.length === 1
    ) {
      const player =
        candidates[0];

      const current =
        matchedByPlayer.get(
          player.id,
        );

      if (current) {
        current.matchedEditions += 1;
      } else {
        matchedByPlayer.set(
          player.id,
          {
            playerId:
              player.id,

            playerName:
              player.name,

            playerSlug:
              player.slug,

            rank:
              player.rank,

            matchedEditions:
              1,
          },
        );
      }

      recoverableEditions += 1;

      continue;
    }

    if (
      candidates.length > 1
    ) {
      ambiguousMatches.push({
        championName,
        tournamentName:
          edition.tournament.name,
        year:
          edition.year,
        candidates:
          candidates.map(
            (candidate) =>
              candidate.name,
          ),
      });

      continue;
    }

    const currentCount =
      unmatchedNames.get(
        championName,
      ) ?? 0;

    unmatchedNames.set(
      championName,
      currentCount + 1,
    );
  }

  const matchedPlayers =
    Array.from(
      matchedByPlayer.values(),
    ).sort(
      (a, b) =>
        (a.rank ?? 9999) -
        (b.rank ?? 9999),
    );

  const unmatchedPlayers =
    players.filter(
      (player) =>
        !matchedByPlayer.has(
          player.id,
        ),
    );

  console.log(
    `Top 50 linked players: ${players.length}`,
  );

  console.log(
    `Unlinked named editions: ${unlinkedEditions.length}`,
  );

  console.log(
    `Recoverable editions: ${recoverableEditions}`,
  );

  console.log(
    `Players with historical matches: ${matchedPlayers.length}`,
  );

  console.log(
    `Players without historical matches: ${unmatchedPlayers.length}`,
  );

  console.log(
    `Ambiguous editions: ${ambiguousMatches.length}`,
  );

  console.log("");
  console.log(
    "MATCHED TOP 50 PLAYERS",
  );
  console.log(
    "────────────────────────────────────────",
  );

  for (
    const player
    of matchedPlayers
  ) {
    console.log(
      [
        `#${String(
          player.rank ?? "—",
        ).padStart(2, " ")}`,
        player.playerName,
        `${player.matchedEditions} editions`,
      ].join(
        " | ",
      ),
    );
  }

  console.log("");

  if (
    unmatchedPlayers.length > 0
  ) {
    console.log(
      "TOP 50 WITHOUT HISTORICAL MATCHES",
    );
    console.log(
      "────────────────────────────────────────",
    );

    for (
      const player
      of unmatchedPlayers
    ) {
      console.log(
        [
          `#${String(
            player.rank ?? "—",
          ).padStart(2, " ")}`,
          player.name,
          player.slug,
        ].join(
          " | ",
        ),
      );
    }

    console.log("");
  }

  if (
    ambiguousMatches.length > 0
  ) {
    console.log(
      "AMBIGUOUS MATCHES",
    );
    console.log(
      "────────────────────────────────────────",
    );

    for (
      const match
      of ambiguousMatches.slice(
        0,
        25,
      )
    ) {
      console.log(
        [
          `${match.year}`,
          match.tournamentName,
          match.championName,
          `Candidates: ${match.candidates.join(
            ", ",
          )}`,
        ].join(
          " | ",
        ),
      );
    }

    if (
      ambiguousMatches.length >
      25
    ) {
      console.log(
        `...and ${
          ambiguousMatches.length -
          25
        } more ambiguous editions`,
      );
    }

    console.log("");
  }

  const sortedUnmatchedNames =
    Array.from(
      unmatchedNames.entries(),
    )
      .sort(
        (a, b) =>
          b[1] -
          a[1],
      )
      .slice(
        0,
        30,
      );

  if (
    sortedUnmatchedNames.length >
    0
  ) {
    console.log(
      "MOST COMMON UNMATCHED CHAMPION NAMES",
    );
    console.log(
      "────────────────────────────────────────",
    );

    for (
      const [
        championName,
        count,
      ]
      of sortedUnmatchedNames
    ) {
      console.log(
        `${championName} | ${count} editions`,
      );
    }

    console.log("");
  }

  console.log(
    "────────────────────────────────────────",
  );

  console.log(
    `SAFE RECOVERABLE EDITIONS: ${recoverableEditions}`,
  );

  console.log(
    "READ-ONLY AUDIT COMPLETE",
  );

  console.log(
    "No database records were modified.",
  );

  console.log("");
}

main()
  .catch(
    (error) => {
      console.error("");
      console.error(
        "❌ AGE202 trophy match audit failed.",
      );

      console.error(
        error,
      );

      console.error("");

      process.exitCode = 1;
    },
  )
  .finally(
    async () => {
      await prisma.$disconnect();
    },
  );