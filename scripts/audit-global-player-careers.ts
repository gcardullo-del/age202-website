import "dotenv/config";

import {
  prisma,
} from "../lib/prisma";

type AuditStatus =
  | "COMPLETE"
  | "PARTIAL"
  | "AHEAD"
  | "NO_PROFILE"
  | "NO_DATA";

type TargetCheck = {
  label: string;
  actual: number;
  expected: number;
};

type GlobalAuditRow = {
  name: string;
  slug: string;

  linkedEditions: number;
  linkedTitles: number;
  linkedRunnerUps: number;

  grandSlams: number;
  australianOpen: number;
  rolandGarros: number;
  wimbledon: number;
  usOpen: number;

  masters1000: number;
  atp500: number;
  atp250: number;
  atpFinals: number;
  olympics: number;

  profileAtpTitles:
    | number
    | null;

  profileDavisCup:
    | number
    | null;

  unknownOpponents: number;

  checks: TargetCheck[];

  missingTotal: number;
  extraTotal: number;

  status: AuditStatus;
};

const SLAM_ALIASES = {
  australianOpen: [
    "australian open",
    "australian-open",
  ],

  rolandGarros: [
    "roland garros",
    "roland-garros",
    "french open",
  ],

  wimbledon: [
    "wimbledon",
  ],

  usOpen: [
    "us open",
    "us-open",
    "u.s. open",
  ],
} as const;

function normalize(
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

function isTournament(
  tournament: {
    name: string;
    slug: string;
  },

  aliases: readonly string[],
): boolean {
  const searchable = [
    tournament.name,
    tournament.slug,
  ].map(
    normalize,
  );

  const normalizedAliases =
    aliases.map(
      normalize,
    );

  return normalizedAliases.some(
    (alias) =>
      searchable.some(
        (value) =>
          value === alias ||
          value.includes(
            alias,
          ) ||
          alias.includes(
            value,
          ),
      ),
  );
}

function pad(
  value: string | number,
  width: number,
): string {
  const text =
    String(
      value,
    );

  return text.length >=
    width
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
  return String(
    value,
  ).padStart(
    width,
    " ",
  );
}

function divider(
  width = 142,
) {
  console.log(
    "─".repeat(
      width,
    ),
  );
}

function statusIcon(
  status: AuditStatus,
): string {
  switch (
    status
  ) {
    case "COMPLETE":
      return "✅";

    case "PARTIAL":
      return "⚠️";

    case "AHEAD":
      return "🟦";

    case "NO_PROFILE":
      return "🟨";

    case "NO_DATA":
      return "❌";
  }
}

function buildStatus({
  hasProfile,
  linkedEditions,
  missingTotal,
  extraTotal,
}: {
  hasProfile: boolean;
  linkedEditions: number;
  missingTotal: number;
  extraTotal: number;
}): AuditStatus {
  if (
    linkedEditions ===
    0
  ) {
    return "NO_DATA";
  }

  if (
    !hasProfile
  ) {
    return "NO_PROFILE";
  }

  if (
    missingTotal === 0 &&
    extraTotal === 0
  ) {
    return "COMPLETE";
  }

  if (
    missingTotal === 0 &&
    extraTotal > 0
  ) {
    return "AHEAD";
  }

  return "PARTIAL";
}

async function main() {
  console.log("");
  console.log(
    "🎾 AGE202 · GLOBAL PLAYER CAREER INTEGRITY AUDIT",
  );
  console.log(
    "═".repeat(
      142,
    ),
  );
  console.log(
    "🛡️ READ ONLY · DATABASE UNCHANGED",
  );
  console.log("");

  console.log(
    "ℹ️ PlayerProfile supplies the AGE202 reference totals that actually exist in the current Prisma schema.",
  );

  console.log(
    "ℹ️ ATP 500 / ATP 250 are calculated directly from TournamentEdition and are observation-only fields in this audit.",
  );

  console.log(
    "ℹ️ COMPLETE means AGE202 internal consistency; it is not independent ATP-source certification.",
  );

  console.log("");

  const players =
    await prisma.player.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        displayOrder: true,

        playerProfile: {
          select: {
            atpTitles: true,
            australianOpen: true,
            rolandGarros: true,
            wimbledon: true,
            usOpen: true,
            grandSlams: true,
            masters1000: true,
            atpFinals: true,
            olympicGold: true,
            davisCup: true,
          },
        },

        tournamentWins: {
          where: {
            cancelled:
              false,
          },

          select: {
            id: true,
            year: true,

            runnerUpName:
              true,

            runnerUpPlayerId:
              true,

            tournament: {
              select: {
                name: true,
                slug: true,
                category: true,
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

            championName:
              true,

            championPlayerId:
              true,

            tournament: {
              select: {
                name: true,
                slug: true,
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

  const rows: GlobalAuditRow[] =
    players.map(
      (player) => {
        const wins =
          player.tournamentWins;

        const runnerUps =
          player.tournamentRunnerUps;

        const countTitlesByCategory = (
          category: string,
        ) =>
          wins.filter(
            (edition) =>
              String(
                edition.tournament.category,
              ) ===
              category,
          ).length;

        const grandSlamWins =
          wins.filter(
            (edition) =>
              String(
                edition.tournament.category,
              ) ===
              "GRAND_SLAM",
          );

        const grandSlams =
          grandSlamWins.length;

        const australianOpen =
          grandSlamWins.filter(
            (edition) =>
              isTournament(
                edition.tournament,
                SLAM_ALIASES.australianOpen,
              ),
          ).length;

        const rolandGarros =
          grandSlamWins.filter(
            (edition) =>
              isTournament(
                edition.tournament,
                SLAM_ALIASES.rolandGarros,
              ),
          ).length;

        const wimbledon =
          grandSlamWins.filter(
            (edition) =>
              isTournament(
                edition.tournament,
                SLAM_ALIASES.wimbledon,
              ),
          ).length;

        const usOpen =
          grandSlamWins.filter(
            (edition) =>
              isTournament(
                edition.tournament,
                SLAM_ALIASES.usOpen,
              ),
          ).length;

        const masters1000 =
          countTitlesByCategory(
            "MASTERS_1000",
          );

        const atp500 =
          countTitlesByCategory(
            "ATP_500",
          );

        const atp250 =
          countTitlesByCategory(
            "ATP_250",
          );

        const atpFinals =
          countTitlesByCategory(
            "ATP_FINALS",
          );

        const olympics =
          countTitlesByCategory(
            "OLYMPICS",
          );

        /*
         * AGE202 keeps Olympics as a dedicated category.
         * For the global tour-level total shown by this audit,
         * Olympic singles gold is included in linkedTitles.
         */
        const linkedTitles =
          grandSlams +
          masters1000 +
          atp500 +
          atp250 +
          atpFinals +
          olympics;

        const linkedEditionIds =
          new Set<string>([
            ...wins.map(
              (edition) =>
                edition.id,
            ),

            ...runnerUps.map(
              (edition) =>
                edition.id,
            ),
          ]);

        const unknownWinnerOpponents =
          wins.filter(
            (edition) => {
              const normalizedName =
                edition.runnerUpName
                  ? normalize(
                      edition.runnerUpName,
                    )
                  : "";

              return (
                !edition.runnerUpPlayerId &&
                (
                  !normalizedName ||
                  normalizedName.includes(
                    "unknown opponent",
                  )
                )
              );
            },
          ).length;

        const unknownRunnerUpOpponents =
          runnerUps.filter(
            (edition) => {
              const normalizedName =
                edition.championName
                  ? normalize(
                      edition.championName,
                    )
                  : "";

              return (
                !edition.championPlayerId &&
                (
                  !normalizedName ||
                  normalizedName.includes(
                    "unknown opponent",
                  )
                )
              );
            },
          ).length;

        const unknownOpponents =
          unknownWinnerOpponents +
          unknownRunnerUpOpponents;

        const profile =
          player.playerProfile;

        const checks: TargetCheck[] =
          profile
            ? [
                {
                  label:
                    "ATP titles",

                  actual:
                    linkedTitles,

                  expected:
                    profile.atpTitles,
                },

                {
                  label:
                    "Grand Slams",

                  actual:
                    grandSlams,

                  expected:
                    profile.grandSlams,
                },

                {
                  label:
                    "Australian Open",

                  actual:
                    australianOpen,

                  expected:
                    profile.australianOpen,
                },

                {
                  label:
                    "Roland Garros",

                  actual:
                    rolandGarros,

                  expected:
                    profile.rolandGarros,
                },

                {
                  label:
                    "Wimbledon",

                  actual:
                    wimbledon,

                  expected:
                    profile.wimbledon,
                },

                {
                  label:
                    "US Open",

                  actual:
                    usOpen,

                  expected:
                    profile.usOpen,
                },

                {
                  label:
                    "Masters 1000",

                  actual:
                    masters1000,

                  expected:
                    profile.masters1000,
                },

                {
                  label:
                    "ATP Finals",

                  actual:
                    atpFinals,

                  expected:
                    profile.atpFinals,
                },

                {
                  label:
                    "Olympic Gold",

                  actual:
                    olympics,

                  expected:
                    profile.olympicGold,
                },
              ]
            : [];

        const missingTotal =
          checks.reduce(
            (
              total,
              check,
            ) =>
              total +
              Math.max(
                0,
                check.expected -
                  check.actual,
              ),
            0,
          );

        const extraTotal =
          checks.reduce(
            (
              total,
              check,
            ) =>
              total +
              Math.max(
                0,
                check.actual -
                  check.expected,
              ),
            0,
          );

        const status =
          buildStatus({
            hasProfile:
              Boolean(
                profile,
              ),

            linkedEditions:
              linkedEditionIds.size,

            missingTotal,

            extraTotal,
          });

        return {
          name:
            player.name,

          slug:
            player.slug,

          linkedEditions:
            linkedEditionIds.size,

          linkedTitles,

          linkedRunnerUps:
            runnerUps.length,

          grandSlams,
          australianOpen,
          rolandGarros,
          wimbledon,
          usOpen,

          masters1000,
          atp500,
          atp250,
          atpFinals,
          olympics,

          profileAtpTitles:
            profile?.atpTitles ??
            null,

          profileDavisCup:
            profile?.davisCup ??
            null,

          unknownOpponents,

          checks,

          missingTotal,
          extraTotal,

          status,
        };
      },
    );

  /*
   * ========================================================
   * MATRIX
   * ========================================================
   */

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
        "TTL",
        4,
      ),

      padLeft(
        "EXP",
        4,
      ),

      padLeft(
        "RU",
        4,
      ),

      padLeft(
        "GS",
        3,
      ),

      padLeft(
        "AO",
        3,
      ),

      padLeft(
        "RG",
        3,
      ),

      padLeft(
        "WIM",
        3,
      ),

      padLeft(
        "US",
        3,
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
        "UNK",
        4,
      ),

      padLeft(
        "MISS",
        5,
      ),

      padLeft(
        "EXTRA",
        5,
      ),

      "STATUS",
    ].join(
      "  ",
    ),
  );

  divider();

  for (
    const row
    of rows
  ) {
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
          row.linkedTitles,
          4,
        ),

        padLeft(
          row.profileAtpTitles ??
            "—",
          4,
        ),

        padLeft(
          row.linkedRunnerUps,
          4,
        ),

        padLeft(
          row.grandSlams,
          3,
        ),

        padLeft(
          row.australianOpen,
          3,
        ),

        padLeft(
          row.rolandGarros,
          3,
        ),

        padLeft(
          row.wimbledon,
          3,
        ),

        padLeft(
          row.usOpen,
          3,
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
          row.unknownOpponents,
          4,
        ),

        padLeft(
          row.missingTotal,
          5,
        ),

        padLeft(
          row.extraTotal,
          5,
        ),

        `${statusIcon(
          row.status,
        )} ${row.status}`,
      ].join(
        "  ",
      ),
    );
  }

  /*
   * ========================================================
   * SUMMARY
   * ========================================================
   */

  console.log("");
  divider();
  console.log(
    "📊 GLOBAL SUMMARY",
  );
  divider();

  const statuses: AuditStatus[] = [
    "COMPLETE",
    "PARTIAL",
    "AHEAD",
    "NO_PROFILE",
    "NO_DATA",
  ];

  console.log(
    `Players checked: ${rows.length}`,
  );

  for (
    const status
    of statuses
  ) {
    console.log(
      `${pad(
        status,
        12,
      )}: ${
        rows.filter(
          (row) =>
            row.status ===
            status,
        ).length
      }`,
    );
  }

  const totalUnknownOpponents =
    rows.reduce(
      (
        total,
        row,
      ) =>
        total +
        row.unknownOpponents,
      0,
    );

  console.log(
    `Unknown opponents: ${totalUnknownOpponents}`,
  );

  /*
   * ========================================================
   * COMPLETE
   * ========================================================
   */

  const completeRows =
    rows.filter(
      (row) =>
        row.status ===
        "COMPLETE",
    );

  if (
    completeRows.length >
    0
  ) {
    console.log("");
    divider();
    console.log(
      "✅ COMPLETE PLAYERS",
    );
    divider();

    for (
      const row
      of completeRows
    ) {
      console.log(
        `• ${row.name} · ${row.slug}`,
      );
    }
  }

  /*
   * ========================================================
   * PARTIAL
   * ========================================================
   */

  const partialRows =
    rows.filter(
      (row) =>
        row.status ===
        "PARTIAL",
    );

  if (
    partialRows.length >
    0
  ) {
    console.log("");
    divider();
    console.log(
      "⚠️ PARTIAL PLAYERS",
    );
    divider();

    for (
      const row
      of partialRows
    ) {
      console.log("");
      console.log(
        `⚠️ ${row.name} · ${row.slug}`,
      );

      console.log(
        `   Linked editions: ${row.linkedEditions}`,
      );

      console.log(
        `   Missing target points: ${row.missingTotal}`,
      );

      console.log(
        `   Unknown opponents: ${row.unknownOpponents}`,
      );

      console.log(
        `   ATP 500 recorded: ${row.atp500}`,
      );

      console.log(
        `   ATP 250 recorded: ${row.atp250}`,
      );

      for (
        const check
        of row.checks
      ) {
        if (
          check.actual >=
          check.expected
        ) {
          continue;
        }

        console.log(
          `   • ${pad(
            check.label,
            18,
          )} AGE202 ${padLeft(
            check.actual,
            3,
          )} · PROFILE ${padLeft(
            check.expected,
            3,
          )} · MISSING ${
            check.expected -
            check.actual
          }`,
        );
      }
    }
  }

  /*
   * ========================================================
   * AHEAD
   * ========================================================
   */

  const aheadRows =
    rows.filter(
      (row) =>
        row.status ===
        "AHEAD",
    );

  if (
    aheadRows.length >
    0
  ) {
    console.log("");
    divider();
    console.log(
      "🟦 AHEAD / POSSIBLY STALE PROFILE",
    );
    divider();

    for (
      const row
      of aheadRows
    ) {
      console.log("");
      console.log(
        `🟦 ${row.name} · ${row.slug}`,
      );

      for (
        const check
        of row.checks
      ) {
        if (
          check.actual <=
          check.expected
        ) {
          continue;
        }

        console.log(
          `   • ${pad(
            check.label,
            18,
          )} AGE202 ${padLeft(
            check.actual,
            3,
          )} · PROFILE ${padLeft(
            check.expected,
            3,
          )} · EXTRA ${
            check.actual -
            check.expected
          }`,
        );
      }

      if (
        row.unknownOpponents >
        0
      ) {
        console.log(
          `   • Unknown opponents: ${row.unknownOpponents}`,
        );
      }
    }
  }

  /*
   * ========================================================
   * NO PROFILE
   * ========================================================
   */

  const noProfileRows =
    rows.filter(
      (row) =>
        row.status ===
        "NO_PROFILE",
    );

  if (
    noProfileRows.length >
    0
  ) {
    console.log("");
    divider();
    console.log(
      "🟨 PLAYERS WITHOUT PLAYERPROFILE TARGETS",
    );
    divider();

    for (
      const row
      of noProfileRows
    ) {
      console.log(
        `• ${row.name} · ${row.slug} · ${row.linkedEditions} linked editions`,
      );
    }
  }

  /*
   * ========================================================
   * NO DATA
   * ========================================================
   */

  const noDataRows =
    rows.filter(
      (row) =>
        row.status ===
        "NO_DATA",
    );

  if (
    noDataRows.length >
    0
  ) {
    console.log("");
    divider();
    console.log(
      "❌ PLAYERS WITHOUT TOURNAMENT DATA",
    );
    divider();

    for (
      const row
      of noDataRows
    ) {
      console.log(
        `• ${row.name} · ${row.slug}`,
      );
    }
  }

  /*
   * ========================================================
   * UNKNOWN OPPONENTS
   * ========================================================
   */

  const unknownRows =
    rows.filter(
      (row) =>
        row.unknownOpponents >
        0,
    );

  if (
    unknownRows.length >
    0
  ) {
    console.log("");
    divider();
    console.log(
      "👤 UNKNOWN OPPONENT CLEANUP QUEUE",
    );
    divider();

    for (
      const row
      of unknownRows
    ) {
      console.log(
        `• ${row.name} · ${row.unknownOpponents} unresolved opponent record${
          row.unknownOpponents ===
          1
            ? ""
            : "s"
        }`,
      );
    }
  }

  /*
   * ========================================================
   * NOTES
   * ========================================================
   */

  console.log("");
  divider();
  console.log(
    "🧠 NOTES",
  );
  divider();

  console.log(
    "• COMPLETE = every available PlayerProfile target matches TournamentEdition data.",
  );

  console.log(
    "• PARTIAL = one or more AGE202 TournamentEdition counts are below PlayerProfile targets.",
  );

  console.log(
    "• AHEAD = TournamentEdition data exceeds PlayerProfile; the stored profile may be stale.",
  );

  console.log(
    "• NO_PROFILE = tournament data exists but there is no PlayerProfile target to compare against.",
  );

  console.log(
    "• NO_DATA = no linked TournamentEdition exists for the player.",
  );

  console.log(
    "• ATP 500 / ATP 250 are observation-only because those fields do not exist in PlayerProfile.",
  );

  console.log(
    "• Davis Cup is intentionally excluded from status because AGE202 also stores team achievements separately.",
  );

  console.log(
    "• Before any WRITE/backfill, verify the PlayerProfile target for that player.",
  );

  console.log("");
  console.log(
    "✅ GLOBAL PLAYER CAREER INTEGRITY AUDIT COMPLETED",
  );

  console.log(
    "🛡️ DATABASE UNCHANGED",
  );

  console.log("");
}

main()
  .catch(
    (
      error: unknown,
    ) => {
      console.error("");
      console.error(
        "❌ Global player career integrity audit failed.",
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