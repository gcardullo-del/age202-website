import "dotenv/config";

import type {
  Prisma,
} from "../generated/prisma/client";

import {
  CareerEventCategory,
} from "../generated/prisma/client";

import {
  prisma,
} from "../lib/prisma";


type CategoryBucket = {
  titles: number;
  runnerUps: number;
  finals: number;
};


type AuditCategory =
  | "GRAND_SLAM"
  | "ATP_FINALS"
  | "MASTERS_1000"
  | "ATP_500"
  | "ATP_250"
  | "OLYMPICS"
  | "DAVIS_CUP"
  | "OTHER";


const ATP_SINGLES_TITLE_CATEGORIES:
  AuditCategory[] = [
    "GRAND_SLAM",
    "ATP_FINALS",
    "MASTERS_1000",
    "ATP_500",
    "ATP_250",
  ];


const SPECIAL_ACHIEVEMENT_CATEGORIES:
  AuditCategory[] = [
    "OLYMPICS",
    "DAVIS_CUP",
    "OTHER",
  ];


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


function getPlayerSlugFromArgs(): string {
  const slug =
    process.argv[2]
      ?.trim()
      .toLowerCase();

  if (!slug) {
    throw new Error(
      [
        "Specifica lo slug del player.",
        "",
        "Esempi:",
        "npx tsx scripts/audit-player-tournament-history.ts jannik-sinner",
        "npx tsx scripts/audit-player-tournament-history.ts carlos-alcaraz",
        "npx tsx scripts/audit-player-tournament-history.ts novak-djokovic",
      ].join("\n"),
    );
  }

  return slug;
}


function getCategoryKey(
  category: string,
): AuditCategory {
  switch (category) {
    case "GRAND_SLAM":
      return "GRAND_SLAM";

    case "ATP_FINALS":
      return "ATP_FINALS";

    case "MASTERS_1000":
      return "MASTERS_1000";

    case "ATP_500":
      return "ATP_500";

    case "ATP_250":
      return "ATP_250";

    case "OLYMPICS":
      return "OLYMPICS";

    case "DAVIS_CUP":
      return "DAVIS_CUP";

    default:
      return "OTHER";
  }
}


function getCategoryLabel(
  category: AuditCategory,
): string {
  switch (category) {
    case "GRAND_SLAM":
      return "Grand Slam";

    case "ATP_FINALS":
      return "ATP Finals";

    case "MASTERS_1000":
      return "Masters 1000";

    case "ATP_500":
      return "ATP 500";

    case "ATP_250":
      return "ATP 250";

    case "OLYMPICS":
      return "Olympics";

    case "DAVIS_CUP":
      return "Davis Cup";

    default:
      return "Other";
  }
}


function createEmptyBucket(): CategoryBucket {
  return {
    titles: 0,
    runnerUps: 0,
    finals: 0,
  };
}


function createBuckets(): Record<
  AuditCategory,
  CategoryBucket
> {
  return {
    GRAND_SLAM:
      createEmptyBucket(),

    ATP_FINALS:
      createEmptyBucket(),

    MASTERS_1000:
      createEmptyBucket(),

    ATP_500:
      createEmptyBucket(),

    ATP_250:
      createEmptyBucket(),

    OLYMPICS:
      createEmptyBucket(),

    DAVIS_CUP:
      createEmptyBucket(),

    OTHER:
      createEmptyBucket(),
  };
}


function printDivider() {
  console.log(
    "────────────────────────────────────────────────────────────",
  );
}


function sumBuckets(
  buckets: Record<
    AuditCategory,
    CategoryBucket
  >,
  categories: readonly AuditCategory[],
): CategoryBucket {
  return categories.reduce<CategoryBucket>(
    (
      total,
      category,
    ) => {
      const bucket =
        buckets[category];

      return {
        titles:
          total.titles +
          bucket.titles,

        runnerUps:
          total.runnerUps +
          bucket.runnerUps,

        finals:
          total.finals +
          bucket.finals,
      };
    },
    createEmptyBucket(),
  );
}


function printCategoryTable(
  buckets: Record<
    AuditCategory,
    CategoryBucket
  >,
) {
  const categories: AuditCategory[] = [
    "GRAND_SLAM",
    "ATP_FINALS",
    "MASTERS_1000",
    "ATP_500",
    "ATP_250",
    "OLYMPICS",
    "DAVIS_CUP",
    "OTHER",
  ];

  console.log("");
  console.log(
    "📊 LINKED TOURNAMENT RECORD",
  );
  printDivider();

  console.log(
    [
      "Category".padEnd(18),
      "Titles".padStart(7),
      "R-Up".padStart(7),
      "Finals".padStart(7),
    ].join(""),
  );

  printDivider();

  for (
    const category
    of categories
  ) {
    const bucket =
      buckets[category];

    if (
      bucket.finals ===
      0
    ) {
      continue;
    }

    console.log(
      [
        getCategoryLabel(
          category,
        ).padEnd(18),

        String(
          bucket.titles,
        ).padStart(7),

        String(
          bucket.runnerUps,
        ).padStart(7),

        String(
          bucket.finals,
        ).padStart(7),
      ].join(""),
    );
  }

  printDivider();
}


async function main() {
  const playerSlug =
    getPlayerSlugFromArgs();

  console.log("");
  console.log(
    "🎾 AGE202 · PLAYER TOURNAMENT HISTORY AUDIT",
  );
  console.log(
    "════════════════════════════════════════════════════════════",
  );
  console.log(
    "🛡️ READ ONLY · DATABASE UNCHANGED",
  );
  console.log("");

  const player =
    await prisma.player.findUnique({
      where: {
        slug:
          playerSlug,
      },

      select: {
        id: true,
        name: true,
        slug: true,
      },
    });

  if (!player) {
    throw new Error(
      `Player non trovato: "${playerSlug}".`,
    );
  }

  console.log(
    `👤 Player: ${player.name}`,
  );
  console.log(
    `🔗 Slug:   ${player.slug}`,
  );
  console.log(
    `🆔 ID:     ${player.id}`,
  );

  const linkedEditions =
    await prisma.tournamentEdition.findMany({
      where: {
        cancelled: false,

        OR: [
          {
            championPlayerId:
              player.id,
          },
          {
            runnerUpPlayerId:
              player.id,
          },
        ],
      },

      include: {
        tournament: {
          select: {
            name: true,
            slug: true,
            category: true,
            surface: true,
            city: true,
            country: true,
          },
        },

        championPlayer: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },

        runnerUpPlayer: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },

      orderBy: [
        {
          year:
            "desc",
        },
        {
          endDate:
            "desc",
        },
        {
          tournament: {
            name:
              "asc",
          },
        },
      ],
    });

  const buckets =
    createBuckets();

  for (
    const edition
    of linkedEditions
  ) {
    const category =
      getCategoryKey(
        String(
          edition.tournament.category,
        ),
      );

    const bucket =
      buckets[category];

    bucket.finals +=
      1;

    if (
      edition.championPlayerId ===
      player.id
    ) {
      bucket.titles +=
        1;
    }

    if (
      edition.runnerUpPlayerId ===
      player.id
    ) {
      bucket.runnerUps +=
        1;
    }
  }

  printCategoryTable(
    buckets,
  );

  const atpTotals =
    sumBuckets(
      buckets,
      ATP_SINGLES_TITLE_CATEGORIES,
    );

  const specialTotals =
    sumBuckets(
      buckets,
      SPECIAL_ACHIEVEMENT_CATEGORIES,
    );

  const allLinkedTotals =
    sumBuckets(
      buckets,
      [
        ...ATP_SINGLES_TITLE_CATEGORIES,
        ...SPECIAL_ACHIEVEMENT_CATEGORIES,
      ],
    );

  console.log("");
  console.log(
    "🏆 ATP SINGLES TOTALS",
  );
  printDivider();

  console.log(
    `Titles:     ${atpTotals.titles}`,
  );

  console.log(
    `Runner-up:  ${atpTotals.runnerUps}`,
  );

  console.log(
    `Finals:     ${atpTotals.finals}`,
  );

  console.log("");
  console.log(
    "🏅 SPECIAL / TEAM ACHIEVEMENTS",
  );
  printDivider();

  console.log(
    `Wins:       ${specialTotals.titles}`,
  );

  console.log(
    `Runner-up:  ${specialTotals.runnerUps}`,
  );

  console.log(
    `Finals:     ${specialTotals.finals}`,
  );

  console.log("");
  console.log(
    "📚 ALL LINKED EDITIONS",
  );
  printDivider();

  console.log(
    `Wins:       ${allLinkedTotals.titles}`,
  );

  console.log(
    `Runner-up:  ${allLinkedTotals.runnerUps}`,
  );

  console.log(
    `Finals:     ${allLinkedTotals.finals}`,
  );

  const recordedYears =
    linkedEditions.map(
      (edition) =>
        edition.year,
    );

  if (
    recordedYears.length >
    0
  ) {
    console.log(
      `Period:     ${Math.min(
        ...recordedYears,
      )} → ${Math.max(
        ...recordedYears,
      )}`,
    );
  } else {
    console.log(
      "Period:     —",
    );
  }


  const davisCupCareerEvents =
    await prisma.playerCareerEvent.findMany({
      where: {
        playerId:
          player.id,

        category:
          CareerEventCategory.DAVIS_CUP,
      },

      select: {
        id: true,
        year: true,
        title: true,
        subtitle: true,
        description: true,
        tournament: true,
        featured: true,
        sortOrder: true,
        createdAt: true,
      },

      orderBy: [
        {
          year:
            "asc",
        },
        {
          sortOrder:
            "asc",
        },
        {
          createdAt:
            "asc",
        },
      ],
    });

  const davisCupYears =
    Array.from(
      new Set(
        davisCupCareerEvents.map(
          (event) =>
            event.year,
        ),
      ),
    ).sort(
      (
        first,
        second,
      ) =>
        first -
        second,
    );

  const davisCupDuplicateYears =
    davisCupYears.filter(
      (year) =>
        davisCupCareerEvents.filter(
          (event) =>
            event.year ===
            year,
        ).length >
        1,
    );

  console.log("");
  console.log(
    "🇮🇹 DAVIS CUP CAREER RECORD",
  );
  printDivider();

  console.log(
    `Davis Cup titles:      ${davisCupYears.length}`,
  );

  console.log(
    `Career event rows:     ${davisCupCareerEvents.length}`,
  );

  if (
    davisCupYears.length >
    0
  ) {
    console.log(
      `Title years:           ${davisCupYears.join(", ")}`,
    );
  }

  if (
    davisCupCareerEvents.length ===
    0
  ) {
    console.log(
      "Nessun PlayerCareerEvent DAVIS_CUP.",
    );
  } else {
    console.log("");

    for (
      const event
      of davisCupCareerEvents
    ) {
      console.log(
        [
          "🏆",
          event.year,
          "·",
          event.title,
          event.subtitle
            ? `· ${event.subtitle}`
            : "",
          `· id=${event.id}`,
        ]
          .filter(Boolean)
          .join(" "),
      );
    }
  }

  if (
    davisCupDuplicateYears.length >
    0
  ) {
    console.log("");
    console.log(
      "⚠️ DAVIS CUP DUPLICATE-YEAR CHECK",
    );
    printDivider();

    for (
      const year
      of davisCupDuplicateYears
    ) {
      const yearEvents =
        davisCupCareerEvents.filter(
          (event) =>
            event.year ===
            year,
        );

      console.log(
        `⚠️ ${year}: ${yearEvents.length} PlayerCareerEvent DAVIS_CUP`,
      );

      for (
        const event
        of yearEvents
      ) {
        console.log(
          `   - ${event.id} · ${event.title} · ${event.subtitle ?? "—"}`,
        );
      }
    }

    console.log("");
    console.log(
      "ℹ️ Il conteggio Davis Cup titles usa gli anni unici, quindi eventuali duplicati non gonfiano il totale.",
    );
  }

  console.log("");
  console.log(
    "📚 LINKED EDITION DETAIL",
  );
  printDivider();

  if (
    linkedEditions.length ===
    0
  ) {
    console.log(
      "Nessuna TournamentEdition collegata.",
    );
  } else {
    for (
      const edition
      of linkedEditions
    ) {
      const isChampion =
        edition.championPlayerId ===
        player.id;

      const result =
        isChampion
          ? "🏆 W"
          : "🥈 F";

      const opponent =
        isChampion
          ? edition.runnerUpPlayer?.name ??
            edition.runnerUpName ??
            "?"
          : edition.championPlayer?.name ??
            edition.championName ??
            "?";

      console.log(
        [
          result,

          String(
            edition.year,
          ),

          "·",

          String(
            edition.tournament.category,
          ),

          "·",

          edition.tournament.name,

          "· vs",

          opponent,

          edition.score
            ? `· ${edition.score}`
            : "",
        ]
          .filter(Boolean)
          .join(" "),
      );
    }
  }

  /*
   * Cerchiamo anche TournamentEdition che nominano il player
   * ma non sono collegate al suo Player.id.
   *
   * Usiamo contains case-insensitive per ottenere candidati,
   * poi normalizziamo i nomi in memoria per ridurre i falsi
   * positivi.
   */
  const playerNameParts =
    normalizeName(
      player.name,
    )
      .split(" ")
      .filter(
        (part) =>
          part.length >=
          3,
      );

  const nameFilters:
    Prisma.TournamentEditionWhereInput[] =
      playerNameParts.flatMap(
        (part) => [
          {
            championName: {
              contains:
                part,

              mode:
                "insensitive",
            },
          },

          {
            runnerUpName: {
              contains:
                part,

              mode:
                "insensitive",
            },
          },
        ],
      );

  const possibleNameMatches =
    nameFilters.length >
    0
      ? await prisma.tournamentEdition.findMany({
          where: {
            cancelled:
              false,

            OR:
              nameFilters,
          },

          include: {
            tournament: {
              select: {
                name:
                  true,

                slug:
                  true,

                category:
                  true,
              },
            },
          },

          orderBy: [
            {
              year:
                "desc",
            },
            {
              tournament: {
                name:
                  "asc",
              },
            },
          ],
        })
      : [];

  const normalizedPlayerName =
    normalizeName(
      player.name,
    );

  const possibleUnlinked =
    possibleNameMatches.filter(
      (edition) => {
        const championName =
          edition.championName
            ? normalizeName(
                edition.championName,
              )
            : "";

        const runnerUpName =
          edition.runnerUpName
            ? normalizeName(
                edition.runnerUpName,
              )
            : "";

        const championMatches =
          championName ===
            normalizedPlayerName &&
          edition.championPlayerId !==
            player.id;

        const runnerUpMatches =
          runnerUpName ===
            normalizedPlayerName &&
          edition.runnerUpPlayerId !==
            player.id;

        return (
          championMatches ||
          runnerUpMatches
        );
      },
    );

  console.log("");
  console.log(
    "⚠️ POSSIBLE UNLINKED RECORDS",
  );
  printDivider();

  if (
    possibleUnlinked.length ===
    0
  ) {
    console.log(
      "Nessuna edizione con nome esatto del player risulta scollegata.",
    );
  } else {
    for (
      const edition
      of possibleUnlinked
    ) {
      const championMatch =
        edition.championName &&
        normalizeName(
          edition.championName,
        ) ===
          normalizedPlayerName;

      const side =
        championMatch
          ? "Champion"
          : "Runner-up";

      console.log(
        [
          "⚠️",

          edition.year,

          "·",

          String(
            edition.tournament.category,
          ),

          "·",

          edition.tournament.name,

          `· ${side}`,

          `· champion="${edition.championName ?? "—"}"`,

          `· runnerUp="${edition.runnerUpName ?? "—"}"`,
        ].join(" "),
      );
    }
  }

  console.log("");
  console.log(
    "🧭 AUDIT SUMMARY",
  );
  printDivider();

  console.log(
    `Linked editions:          ${linkedEditions.length}`,
  );

  console.log(
    `ATP singles titles:       ${atpTotals.titles}`,
  );

  console.log(
    `Special/team wins:        ${specialTotals.titles}`,
  );

  console.log(
    `Davis Cup titles:         ${davisCupYears.length}`,
  );

  console.log(
    `Davis Cup event rows:     ${davisCupCareerEvents.length}`,
  );

  console.log(
    `Duplicate Davis years:    ${davisCupDuplicateYears.length}`,
  );

  console.log(
    `Possible unlinked names:  ${possibleUnlinked.length}`,
  );

  if (
    possibleUnlinked.length >
    0
  ) {
    console.log("");
    console.log(
      "➡️ Next step: correggere prima i collegamenti Player delle edizioni già presenti.",
    );
  } else {
    console.log("");
    console.log(
      "➡️ Next step: se i record carriera restano superiori ai linked totals, le edizioni mancanti non sono ancora presenti in TournamentEdition.",
    );
  }

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
        "❌ Player tournament history audit failed.",
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