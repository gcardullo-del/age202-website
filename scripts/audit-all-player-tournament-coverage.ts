import "dotenv/config";

import {
  prisma,
} from "../lib/prisma";

type CategoryKey =
  | "GRAND_SLAM"
  | "MASTERS_1000"
  | "ATP_500"
  | "ATP_250"
  | "ATP_FINALS"
  | "OLYMPICS";

const CATEGORY_KEYS: readonly CategoryKey[] = [
  "GRAND_SLAM",
  "MASTERS_1000",
  "ATP_500",
  "ATP_250",
  "ATP_FINALS",
  "OLYMPICS",
];

function printDivider() {
  console.log(
    "────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────",
  );
}

function pad(
  value: string | number,
  length: number,
): string {
  const text =
    String(value);

  return text.length >= length
    ? text.slice(
        0,
        length,
      )
    : text.padEnd(
        length,
        " ",
      );
}

function padLeft(
  value: string | number,
  length: number,
): string {
  return String(value).padStart(
    length,
    " ",
  );
}

async function main() {
  console.log("");
  console.log(
    "🎾 AGE202 · ALL PLAYER TOURNAMENT COVERAGE AUDIT",
  );
  console.log(
    "════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════",
  );
  console.log(
    "🛡️ READ ONLY · DATABASE UNCHANGED",
  );
  console.log("");

  const players =
    await prisma.player.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        active: true,
        collectionType: true,
        displayOrder: true,
        tournamentWins: {
          where: {
            cancelled: false,
          },
          select: {
            id: true,
            year: true,
            tournament: {
              select: {
                category: true,
              },
            },
          },
        },
        tournamentRunnerUps: {
          where: {
            cancelled: false,
          },
          select: {
            id: true,
            year: true,
            tournament: {
              select: {
                category: true,
              },
            },
          },
        },
      },

      orderBy: [
        {
          displayOrder:
            "asc",
        },
        {
          name:
            "asc",
        },
      ],
    });

  const rows =
    players.map(
      (player) => {
        const titleCounts =
          Object.fromEntries(
            CATEGORY_KEYS.map(
              (category) => [
                category,
                0,
              ],
            ),
          ) as Record<
            CategoryKey,
            number
          >;

        for (
          const edition
          of player.tournamentWins
        ) {
          const category =
            String(
              edition.tournament.category,
            ) as CategoryKey;

          if (
            category in
            titleCounts
          ) {
            titleCounts[
              category
            ] += 1;
          }
        }

        const linkedEditionIds =
          new Set<string>([
            ...player.tournamentWins.map(
              (edition) =>
                edition.id,
            ),
            ...player.tournamentRunnerUps.map(
              (edition) =>
                edition.id,
            ),
          ]);

        const linkedYears = [
          ...player.tournamentWins.map(
            (edition) =>
              edition.year,
          ),
          ...player.tournamentRunnerUps.map(
            (edition) =>
              edition.year,
          ),
        ];

        const firstYear =
          linkedYears.length >
          0
            ? Math.min(
                ...linkedYears,
              )
            : null;

        const lastYear =
          linkedYears.length >
          0
            ? Math.max(
                ...linkedYears,
              )
            : null;

        const linkedEditions =
          linkedEditionIds.size;

        const titles =
          player.tournamentWins.length;

        const runnerUps =
          player.tournamentRunnerUps.length;

        const status =
          linkedEditions === 0
            ? "NO DATA"
            : titles === 0
              ? "RESULTS ONLY"
              : "SYNCED DATA";

        return {
          name:
            player.name,
          slug:
            player.slug,
          active:
            player.active,
          collectionType:
            String(
              player.collectionType,
            ),
          linkedEditions,
          titles,
          runnerUps,
          grandSlams:
            titleCounts.GRAND_SLAM,
          masters1000:
            titleCounts.MASTERS_1000,
          atp500:
            titleCounts.ATP_500,
          atp250:
            titleCounts.ATP_250,
          atpFinals:
            titleCounts.ATP_FINALS,
          olympics:
            titleCounts.OLYMPICS,
          firstYear,
          lastYear,
          status,
        };
      },
    );

  printDivider();

  console.log(
    [
      pad(
        "PLAYER",
        24,
      ),
      pad(
        "ACTIVE",
        7,
      ),
      padLeft(
        "ED",
        4,
      ),
      padLeft(
        "W",
        4,
      ),
      padLeft(
        "RU",
        4,
      ),
      padLeft(
        "GS",
        4,
      ),
      padLeft(
        "M1K",
        4,
      ),
      padLeft(
        "500",
        4,
      ),
      padLeft(
        "250",
        4,
      ),
      padLeft(
        "FIN",
        4,
      ),
      padLeft(
        "OLY",
        4,
      ),
      pad(
        "YEARS",
        11,
      ),
      "STATUS",
    ].join(
      "  ",
    ),
  );

  printDivider();

  for (
    const row
    of rows
  ) {
    const years =
      row.firstYear !== null &&
      row.lastYear !== null
        ? row.firstYear ===
          row.lastYear
          ? String(
              row.firstYear,
            )
          : `${row.firstYear}-${row.lastYear}`
        : "—";

    console.log(
      [
        pad(
          row.name,
          24,
        ),
        pad(
          row.active
            ? "YES"
            : "NO",
          7,
        ),
        padLeft(
          row.linkedEditions,
          4,
        ),
        padLeft(
          row.titles,
          4,
        ),
        padLeft(
          row.runnerUps,
          4,
        ),
        padLeft(
          row.grandSlams,
          4,
        ),
        padLeft(
          row.masters1000,
          4,
        ),
        padLeft(
          row.atp500,
          4,
        ),
        padLeft(
          row.atp250,
          4,
        ),
        padLeft(
          row.atpFinals,
          4,
        ),
        padLeft(
          row.olympics,
          4,
        ),
        pad(
          years,
          11,
        ),
        row.status,
      ].join(
        "  ",
      ),
    );
  }

  printDivider();
  console.log("");
  console.log(
    "📊 COVERAGE SUMMARY",
  );
  printDivider();

  const withData =
    rows.filter(
      (row) =>
        row.linkedEditions >
        0,
    );

  const withoutData =
    rows.filter(
      (row) =>
        row.linkedEditions ===
        0,
    );

  const activePlayers =
    rows.filter(
      (row) =>
        row.active,
    );

  const activeWithoutData =
    activePlayers.filter(
      (row) =>
        row.linkedEditions ===
        0,
    );

  const activeWithData =
    activePlayers.filter(
      (row) =>
        row.linkedEditions >
        0,
    );

  console.log(
    `Players checked:          ${rows.length}`,
  );
  console.log(
    `Players with data:        ${withData.length}`,
  );
  console.log(
    `Players without data:     ${withoutData.length}`,
  );
  console.log(
    `Active players:           ${activePlayers.length}`,
  );
  console.log(
    `Active with data:         ${activeWithData.length}`,
  );
  console.log(
    `Active without data:      ${activeWithoutData.length}`,
  );

  if (
    activeWithoutData.length >
    0
  ) {
    console.log("");
    console.log(
      "⚠️ ACTIVE PLAYERS WITHOUT TOURNAMENT DATA",
    );

    for (
      const row
      of activeWithoutData
    ) {
      console.log(
        `   • ${row.name} · ${row.slug}`,
      );
    }
  }

  console.log("");
  console.log(
    "ℹ️ IMPORTANT",
  );
  console.log(
    "This audit measures database coverage only.",
  );
  console.log(
    'A row marked "SYNCED DATA" means linked TournamentEdition records exist; it does NOT prove that the player career is historically complete.',
  );
  console.log(
    "Career completeness must be verified separately against expected official totals before any player is declared fully synced.",
  );

  console.log("");
  console.log(
    "✅ AUDIT COMPLETED",
  );
  console.log(
    "🛡️ DATABASE UNCHANGED",
  );
  console.log("");
}

main()
  .catch(
    (error: unknown) => {
      console.error("");
      console.error(
        "❌ All-player tournament coverage audit failed.",
      );

      if (
        error instanceof Error
      ) {
        console.error(
          error.stack ??
            error.message,
        );
      } else {
        console.error(
          error,
        );
      }

      process.exitCode =
        1;
    },
  )
  .finally(
    async () => {
      await prisma.$disconnect();
    },
  );
