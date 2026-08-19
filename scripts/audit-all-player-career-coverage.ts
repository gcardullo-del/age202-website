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

type CoverageBand =
  | "NO_DATA"
  | "SPARSE"
  | "PARTIAL"
  | "BROAD";

const CATEGORY_KEYS: readonly CategoryKey[] = [
  "GRAND_SLAM",
  "MASTERS_1000",
  "ATP_500",
  "ATP_250",
  "ATP_FINALS",
  "OLYMPICS",
];

function divider() {
  console.log(
    "────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────",
  );
}

function pad(
  value: string | number,
  width: number,
): string {
  const text =
    String(value);

  return text.length >= width
    ? text.slice(
        0,
        width,
      )
    : text.padEnd(
        width,
        " ",
      );
}

function padLeft(
  value: string | number,
  width: number,
): string {
  return String(value).padStart(
    width,
    " ",
  );
}

function coverageBand(
  linkedEditions: number,
): CoverageBand {
  if (
    linkedEditions ===
    0
  ) {
    return "NO_DATA";
  }

  if (
    linkedEditions <
    5
  ) {
    return "SPARSE";
  }

  if (
    linkedEditions <
    20
  ) {
    return "PARTIAL";
  }

  return "BROAD";
}

function countDistinctYears(
  years: readonly number[],
): number {
  return new Set(
    years,
  ).size;
}

async function main() {
  console.log("");
  console.log(
    "🎾 AGE202 · GLOBAL PLAYER CAREER COVERAGE AUDIT",
  );
  console.log(
    "════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════",
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
            cancelled:
              false,
          },

          select: {
            id: true,
            year: true,

            tournament: {
              select: {
                category:
                  true,
              },
            },
          },
        },

        tournamentRunnerUps: {
          where: {
            cancelled:
              false,
          },

          select: {
            id: true,
            year: true,

            tournament: {
              select: {
                category:
                  true,
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

        const finalCounts =
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

            finalCounts[
              category
            ] += 1;
          }
        }

        for (
          const edition
          of player.tournamentRunnerUps
        ) {
          const category =
            String(
              edition.tournament.category,
            ) as CategoryKey;

          if (
            category in
            finalCounts
          ) {
            finalCounts[
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

        const categoriesWithTitles =
          CATEGORY_KEYS.filter(
            (category) =>
              titleCounts[
                category
              ] >
              0,
          ).length;

        const categoriesWithFinals =
          CATEGORY_KEYS.filter(
            (category) =>
              finalCounts[
                category
              ] >
              0,
          ).length;

        const linkedEditions =
          linkedEditionIds.size;

        const titles =
          player.tournamentWins.length;

        const runnerUps =
          player.tournamentRunnerUps.length;

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

          finals:
            linkedEditions,

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

          grandSlamFinals:
            finalCounts.GRAND_SLAM,

          masters1000Finals:
            finalCounts.MASTERS_1000,

          atp500Finals:
            finalCounts.ATP_500,

          atp250Finals:
            finalCounts.ATP_250,

          atpFinalsFinals:
            finalCounts.ATP_FINALS,

          olympicsFinals:
            finalCounts.OLYMPICS,

          categoriesWithTitles,

          categoriesWithFinals,

          distinctYears:
            countDistinctYears(
              linkedYears,
            ),

          firstYear,

          lastYear,

          coverageBand:
            coverageBand(
              linkedEditions,
            ),
        };
      },
    );

  divider();

  console.log(
    [
      pad(
        "PLAYER",
        24,
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
      padLeft(
        "YRS",
        4,
      ),
      pad(
        "SPAN",
        11,
      ),
      pad(
        "DENSITY",
        10,
      ),
    ].join(
      "  ",
    ),
  );

  divider();

  for (
    const row
    of rows
  ) {
    const span =
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

        padLeft(
          row.distinctYears,
          4,
        ),

        pad(
          span,
          11,
        ),

        pad(
          row.coverageBand,
          10,
        ),
      ].join(
        "  ",
      ),
    );
  }

  console.log("");
  divider();
  console.log(
    "📊 DATABASE COVERAGE SUMMARY",
  );
  divider();

  const noData =
    rows.filter(
      (row) =>
        row.coverageBand ===
        "NO_DATA",
    );

  const sparse =
    rows.filter(
      (row) =>
        row.coverageBand ===
        "SPARSE",
    );

  const partial =
    rows.filter(
      (row) =>
        row.coverageBand ===
        "PARTIAL",
    );

  const broad =
    rows.filter(
      (row) =>
        row.coverageBand ===
        "BROAD",
    );

  console.log(
    `Players checked:    ${rows.length}`,
  );
  console.log(
    `NO_DATA:            ${noData.length}`,
  );
  console.log(
    `SPARSE (<5 ed.):    ${sparse.length}`,
  );
  console.log(
    `PARTIAL (5-19):     ${partial.length}`,
  );
  console.log(
    `BROAD (20+):        ${broad.length}`,
  );

  console.log("");
  divider();
  console.log(
    "🏆 CATEGORY PRESENCE",
  );
  divider();

  const categoryPresence =
    CATEGORY_KEYS.map(
      (category) => {
        const withTitle =
          rows.filter(
            (row) => {
              switch (
                category
              ) {
                case "GRAND_SLAM":
                  return row.grandSlams >
                    0;

                case "MASTERS_1000":
                  return row.masters1000 >
                    0;

                case "ATP_500":
                  return row.atp500 >
                    0;

                case "ATP_250":
                  return row.atp250 >
                    0;

                case "ATP_FINALS":
                  return row.atpFinals >
                    0;

                case "OLYMPICS":
                  return row.olympics >
                    0;
              }
            },
          ).length;

        const withFinal =
          rows.filter(
            (row) => {
              switch (
                category
              ) {
                case "GRAND_SLAM":
                  return row.grandSlamFinals >
                    0;

                case "MASTERS_1000":
                  return row.masters1000Finals >
                    0;

                case "ATP_500":
                  return row.atp500Finals >
                    0;

                case "ATP_250":
                  return row.atp250Finals >
                    0;

                case "ATP_FINALS":
                  return row.atpFinalsFinals >
                    0;

                case "OLYMPICS":
                  return row.olympicsFinals >
                    0;
              }
            },
          ).length;

        return {
          category,
          withTitle,
          withFinal,
        };
      },
    );

  for (
    const item
    of categoryPresence
  ) {
    console.log(
      `${pad(
        item.category,
        14,
      )} players with title: ${padLeft(
        item.withTitle,
        3,
      )} · players with final: ${padLeft(
        item.withFinal,
        3,
      )}`,
    );
  }

  if (
    noData.length >
    0
  ) {
    console.log("");
    divider();
    console.log(
      "❌ NO TOURNAMENT DATA",
    );
    divider();

    for (
      const row
      of noData
    ) {
      console.log(
        `• ${row.name} · ${row.slug}`,
      );
    }
  }

  if (
    sparse.length >
    0
  ) {
    console.log("");
    divider();
    console.log(
      "⚠️ SPARSE COVERAGE",
    );
    divider();

    for (
      const row
      of sparse
    ) {
      console.log(
        `• ${row.name} · ${row.slug} · ${row.linkedEditions} linked editions`,
      );
    }
  }

  console.log("");
  divider();
  console.log(
    "🧠 INTERPRETATION",
  );
  divider();

  console.log(
    'The labels NO_DATA / SPARSE / PARTIAL / BROAD measure only how much TournamentEdition data is linked in AGE202.',
  );

  console.log(
    "They do NOT certify that a player's career is historically complete.",
  );

  console.log(
    "To certify completeness, each active player's AGE202 totals must be compared with an external expected career target (official ATP/Grand Slam/Olympic record).",
  );

  console.log("");
  console.log(
    "➡️ Recommended next step:",
  );

  console.log(
    "Create an expected-career target registry for active Player Index athletes, then compare this audit automatically against those targets.",
  );

  console.log("");
  console.log(
    "✅ GLOBAL CAREER COVERAGE AUDIT COMPLETED",
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
        "❌ Global player career coverage audit failed.",
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
