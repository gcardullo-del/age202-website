import "dotenv/config";

import {
  CourtSurface,
  TournamentCategory,
} from "../generated/prisma/client";

import {
  prisma,
} from "../lib/prisma";

import {
  syncTournamentChampionSummaries,
} from "./tournament-history/champion-summary";

import {
  importTournamentEditions,
} from "./tournament-history/edition-importer";

import type {
  TournamentHistoryDataset,
} from "./tournament-history/types";


const DEFAULT_TOURNAMENT_SLUG =
  "atp-finals";


type DjokovicAtpFinalsEdition = {
  year: number;
  editionLabel: string;
  runnerUpName: string;
  runnerUpCountryCode?: string;
  runnerUpSlugCandidates:
    readonly string[];
  score: string;
};


const editions:
  DjokovicAtpFinalsEdition[] = [
    {
      year:
        2008,

      editionLabel:
        "Shanghai",

      runnerUpName:
        "Nikolay Davydenko",

      runnerUpCountryCode:
        "RUS",

      runnerUpSlugCandidates: [
        "nikolay-davydenko",
        "davydenko",
      ],

      score:
        "6-1, 7-5",
    },

    {
      year:
        2012,

      editionLabel:
        "London",

      runnerUpName:
        "Roger Federer",

      runnerUpCountryCode:
        "SUI",

      runnerUpSlugCandidates: [
        "roger-federer",
        "federer",
      ],

      score:
        "7-6(6), 7-5",
    },

    {
      year:
        2013,

      editionLabel:
        "London",

      runnerUpName:
        "Rafael Nadal",

      runnerUpCountryCode:
        "ESP",

      runnerUpSlugCandidates: [
        "rafael-nadal",
        "nadal",
      ],

      score:
        "6-3, 6-4",
    },

    {
      year:
        2014,

      editionLabel:
        "London",

      runnerUpName:
        "Roger Federer",

      runnerUpCountryCode:
        "SUI",

      runnerUpSlugCandidates: [
        "roger-federer",
        "federer",
      ],

      score:
        "W/O",
    },

    {
      year:
        2015,

      editionLabel:
        "London",

      runnerUpName:
        "Roger Federer",

      runnerUpCountryCode:
        "SUI",

      runnerUpSlugCandidates: [
        "roger-federer",
        "federer",
      ],

      score:
        "6-3, 6-4",
    },

    {
      year:
        2022,

      editionLabel:
        "Turin",

      runnerUpName:
        "Casper Ruud",

      runnerUpCountryCode:
        "NOR",

      runnerUpSlugCandidates: [
        "casper-ruud",
        "ruud",
      ],

      score:
        "7-5, 6-3",
    },

    {
      year:
        2023,

      editionLabel:
        "Turin",

      runnerUpName:
        "Jannik Sinner",

      runnerUpCountryCode:
        "ITA",

      runnerUpSlugCandidates: [
        "jannik-sinner",
        "sinner",
      ],

      score:
        "6-3, 6-3",
    },
  ];


function hasWriteFlag(): boolean {
  return process.argv.includes(
    "--write",
  );
}


function printDivider() {
  console.log(
    "────────────────────────────────────────────────────────────",
  );
}


async function resolveAtpFinalsTournament() {
  const categoryMatches =
    await prisma.tournament.findMany({
      where: {
        category:
          TournamentCategory.ATP_FINALS,
      },

      select: {
        id: true,
        slug: true,
        name: true,
        shortName: true,
        city: true,
        country: true,
        surface: true,
        active: true,
      },

      orderBy: {
        name:
          "asc",
      },
    });

  if (
    categoryMatches.length >
    1
  ) {
    throw new Error(
      [
        "Trovati più tornei con categoria ATP_FINALS.",
        "Il backfill si interrompe per evitare di scrivere sul torneo sbagliato.",
        ...categoryMatches.map(
          (tournament) =>
            `- ${tournament.name} · ${tournament.slug}`,
        ),
      ].join("\n"),
    );
  }

  if (
    categoryMatches.length ===
    1
  ) {
    return {
      tournament:
        categoryMatches[0],

      mustCreate:
        false,
    };
  }

  const slugMatch =
    await prisma.tournament.findUnique({
      where: {
        slug:
          DEFAULT_TOURNAMENT_SLUG,
      },

      select: {
        id: true,
        slug: true,
        name: true,
        shortName: true,
        city: true,
        country: true,
        surface: true,
        active: true,
        category: true,
      },
    });

  if (slugMatch) {
    if (
      slugMatch.category !==
      TournamentCategory.ATP_FINALS
    ) {
      throw new Error(
        `Lo slug "${DEFAULT_TOURNAMENT_SLUG}" esiste già ma ha categoria ${String(
          slugMatch.category,
        )}.`,
      );
    }

    return {
      tournament:
        slugMatch,

      mustCreate:
        false,
    };
  }

  return {
    tournament:
      null,

    mustCreate:
      true,
  };
}


async function createAtpFinalsTournament() {
  return prisma.tournament.create({
    data: {
      slug:
        DEFAULT_TOURNAMENT_SLUG,

      name:
        "ATP Finals",

      shortName:
        "ATP Finals",

      category:
        TournamentCategory.ATP_FINALS,

      surface:
        CourtSurface.INDOOR_HARD,

      city:
        "Turin",

      country:
        "Italy",

      countryCode:
        "ITA",

      foundedYear:
        1970,

      description:
        "The ATP Finals are the season-ending championship featuring the leading singles players of the ATP season.",

      active:
        true,

      featured:
        true,

      metaTitle:
        "ATP Finals | Season-Ending Championship | AGE202",

      metaDescription:
        "Explore ATP Finals champions, finalists and historical editions in the AGE202 tennis archive.",
    },

    select: {
      id: true,
      slug: true,
      name: true,
      shortName: true,
      city: true,
      country: true,
      surface: true,
      active: true,
    },
  });
}


function buildDataset(
  tournamentSlug: string,
): TournamentHistoryDataset {
  return {
    tournamentSlug,

    editions:
      editions.map(
        (edition) => ({
          year:
            edition.year,

          editionLabel:
            edition.editionLabel,

          championName:
            "Novak Djokovic",

          runnerUpName:
            edition.runnerUpName,

          championCountryCode:
            "SRB",

          runnerUpCountryCode:
            edition.runnerUpCountryCode,

          championPlayer: {
            slugCandidates: [
              "novak-djokovic",
              "djokovic",
            ],
          },

          runnerUpPlayer: {
            slugCandidates: [
              ...edition.runnerUpSlugCandidates,
            ],
          },

          score:
            edition.score,
        }),
      ),
  };
}


async function printExistingEditions(
  tournamentId: string,
) {
  const targetYears =
    editions.map(
      (edition) =>
        edition.year,
    );

  const existing =
    await prisma.tournamentEdition.findMany({
      where: {
        tournamentId,

        year: {
          in:
            targetYears,
        },
      },

      select: {
        year: true,
        editionKey: true,
        championName: true,
        runnerUpName: true,
        championPlayerId: true,
        runnerUpPlayerId: true,
        score: true,
        cancelled: true,
      },

      orderBy: {
        year:
          "asc",
      },
    });

  if (
    existing.length ===
    0
  ) {
    console.log(
      "📭 Nessuna delle 7 TournamentEdition target è presente.",
    );

    return;
  }

  console.log(
    "📚 Edizioni target già presenti:",
  );

  for (
    const edition
    of existing
  ) {
    console.log(
      [
        `   ${edition.year}`,
        `· ${edition.championName ?? "—"}`,
        `d. ${edition.runnerUpName ?? "—"}`,
        edition.score
          ? `· ${edition.score}`
          : "",
        edition.cancelled
          ? "· CANCELLED"
          : "",
      ]
        .filter(Boolean)
        .join(" "),
    );
  }
}


async function main() {
  const write =
    hasWriteFlag();

  console.log("");
  console.log(
    "🏆 AGE202 · DJOKOVIC ATP FINALS BACKFILL",
  );
  console.log(
    "════════════════════════════════════════════════════════════",
  );

  console.log(
    write
      ? "💾 WRITE MODE · DATABASE WILL BE UPDATED"
      : "🛡️ DRY RUN · DATABASE UNCHANGED",
  );

  console.log("");

  const djokovic =
    await prisma.player.findUnique({
      where: {
        slug:
          "novak-djokovic",
      },

      select: {
        id: true,
        name: true,
        slug: true,
      },
    });

  if (!djokovic) {
    throw new Error(
      'Player "novak-djokovic" non trovato.',
    );
  }

  console.log(
    `👤 ${djokovic.name} · ${djokovic.slug}`,
  );
  console.log(
    `🆔 ${djokovic.id}`,
  );
  console.log("");

  const resolution =
    await resolveAtpFinalsTournament();

  printDivider();
  console.log(
    "🏛️ ATP FINALS TOURNAMENT IDENTITY",
  );
  printDivider();

  if (
    resolution.tournament
  ) {
    console.log(
      `✅ Existing tournament: ${resolution.tournament.name}`,
    );

    console.log(
      `   slug: ${resolution.tournament.slug}`,
    );

    console.log(
      `   location: ${[
        resolution.tournament.city,
        resolution.tournament.country,
      ]
        .filter(Boolean)
        .join(", ") || "—"}`,
    );

    console.log(
      `   surface: ${String(
        resolution.tournament.surface,
      )}`,
    );

    await printExistingEditions(
      resolution.tournament.id,
    );
  } else {
    console.log(
      `🆕 ATP Finals non presente: verrà creato con slug "${DEFAULT_TOURNAMENT_SLUG}".`,
    );

    console.log(
      "   category: ATP_FINALS",
    );

    console.log(
      "   canonical location: Turin, Italy",
    );

    console.log(
      "   surface: INDOOR_HARD",
    );
  }

  const resolvedSlug =
    resolution.tournament?.slug ??
    DEFAULT_TOURNAMENT_SLUG;

  const dataset =
    buildDataset(
      resolvedSlug,
    );

  console.log("");
  printDivider();
  console.log(
    "📚 EDITION BACKFILL PLAN",
  );
  printDivider();

  for (
    const edition
    of dataset.editions
  ) {
    console.log(
      [
        write
          ? "💾"
          : "🧪",

        edition.year,

        "· ATP Finals",

        "·",

        `${edition.championName ?? "—"} d. ${edition.runnerUpName ?? "—"}`,

        "·",

        edition.score ??
          "score n/a",
      ].join(" "),
    );
  }

  if (!write) {
    console.log("");
    printDivider();
    console.log(
      "📊 DRY RUN SUMMARY",
    );
    printDivider();

    console.log(
      `Tournament to create: ${resolution.mustCreate ? "YES" : "NO"}`,
    );

    console.log(
      `TournamentEdition planned: ${dataset.editions.length}`,
    );

    console.log(
      "Expected Djokovic ATP Finals total after write: 7",
    );

    console.log("");
    console.log(
      "✅ VALIDATION PLAN COMPLETED",
    );

    console.log(
      "🛡️ DATABASE UNCHANGED",
    );

    console.log("");
    console.log(
      "➡️ Per applicare il backfill:",
    );

    console.log(
      "npx tsx scripts/backfill-djokovic-atp-finals.ts --write",
    );

    console.log("");

    return;
  }

  let tournament =
    resolution.tournament;

  if (!tournament) {
    tournament =
      await createAtpFinalsTournament();

    console.log("");
    console.log(
      `🟢 Tournament creato · ${tournament.name} · ${tournament.slug}`,
    );
  }

  const writeDataset =
    buildDataset(
      tournament.slug,
    );

  console.log("");
  printDivider();
  console.log(
    "💾 WRITING ATP FINALS EDITIONS",
  );
  printDivider();

  const result =
    await importTournamentEditions(
      writeDataset,
    );

  await syncTournamentChampionSummaries(
    result.tournamentId,
  );

  console.log(
    `🏆 Hall of Champions sincronizzata · ${result.tournamentName}`,
  );

  console.log("");
  printDivider();
  console.log(
    "🔎 FINAL VERIFICATION",
  );
  printDivider();

  const storedEditions =
    await prisma.tournamentEdition.findMany({
      where: {
        tournamentId:
          result.tournamentId,

        year: {
          in:
            editions.map(
              (edition) =>
                edition.year,
            ),
        },

        championPlayerId:
          djokovic.id,

        cancelled:
          false,
      },

      select: {
        year: true,
        championName: true,
        runnerUpName: true,
        score: true,
      },

      orderBy: {
        year:
          "asc",
      },
    });

  for (
    const edition
    of storedEditions
  ) {
    console.log(
      `🏆 ${edition.year} · ${edition.championName ?? "—"} d. ${edition.runnerUpName ?? "—"} · ${edition.score ?? "—"}`,
    );
  }

  console.log("");
  console.log(
    `Djokovic ATP Finals linked: ${storedEditions.length} / 7`,
  );

  console.log("");
  printDivider();
  console.log(
    "🏁 DJOKOVIC ATP FINALS BACKFILL COMPLETED",
  );
  printDivider();

  console.log(
    `TournamentEdition sincronizzate: ${result.importedEditions}`,
  );

  console.log("");
  console.log(
    "➡️ Ora esegui:",
  );

  console.log(
    "npx tsx scripts/audit-player-tournament-history.ts novak-djokovic",
  );

  console.log("");
}


main()
  .catch(
    (error: unknown) => {
      console.error("");
      console.error(
        "❌ Djokovic ATP Finals backfill failed.",
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
