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


type HistoricalTournamentDefinition = {
  slug: string;
  name: string;
  shortName: string;
  city: string;
  country: string;
  countryCode: string;
  surface: CourtSurface;
  foundedYear: number | null;
  description: string;
};


const historicalTournaments:
  HistoricalTournamentDefinition[] = [
    {
      slug: "sofia-open",
      name: "Sofia Open",
      shortName: "Sofia",
      city: "Sofia",
      country: "Bulgaria",
      countryCode: "BGR",
      surface: CourtSurface.HARD,
      foundedYear: 2016,
      description:
        "Historical indoor ATP 250 tournament staged in Sofia, Bulgaria. Retained in AGE202 for archival tournament editions.",
    },

    {
      slug: "great-ocean-road-open",
      name: "Great Ocean Road Open",
      shortName: "Melbourne 1",
      city: "Melbourne",
      country: "Australia",
      countryCode: "AUS",
      surface: CourtSurface.HARD,
      foundedYear: 2021,
      description:
        "Historical ATP 250 event staged in Melbourne in 2021 and preserved in AGE202 as a dedicated archival tournament identity.",
    },

    {
      slug: "antwerp",
      name: "European Open",
      shortName: "Antwerp",
      city: "Antwerp",
      country: "Belgium",
      countryCode: "BEL",
      surface: CourtSurface.HARD,
      foundedYear: 2016,
      description:
        "Historical Antwerp identity of the European Open, preserved separately in AGE202 so pre-2025 editions retain their correct city and archival context.",
    },
  ];


const datasets:
  TournamentHistoryDataset[] = [
    {
      tournamentSlug:
        "sofia-open",

      editions: [
        {
          year: 2020,

          championName:
            "Jannik Sinner",

          runnerUpName:
            "Vasek Pospisil",

          championCountryCode:
            "ITA",

          runnerUpCountryCode:
            "CAN",

          championPlayer: {
            slugCandidates: [
              "jannik-sinner",
              "sinner",
            ],
          },

          runnerUpPlayer: {
            slugCandidates: [
              "vasek-pospisil",
            ],
          },

          score:
            "6-4, 3-6, 7-6(3)",
        },

        {
          year: 2021,

          championName:
            "Jannik Sinner",

          runnerUpName:
            "Gael Monfils",

          championCountryCode:
            "ITA",

          runnerUpCountryCode:
            "FRA",

          championPlayer: {
            slugCandidates: [
              "jannik-sinner",
              "sinner",
            ],
          },

          runnerUpPlayer: {
            slugCandidates: [
              "gael-monfils",
            ],
          },

          score:
            "6-3, 6-4",
        },
      ],
    },

    {
      tournamentSlug:
        "great-ocean-road-open",

      editions: [
        {
          year: 2021,

          championName:
            "Jannik Sinner",

          runnerUpName:
            "Stefano Travaglia",

          championCountryCode:
            "ITA",

          runnerUpCountryCode:
            "ITA",

          championPlayer: {
            slugCandidates: [
              "jannik-sinner",
              "sinner",
            ],
          },

          runnerUpPlayer: {
            slugCandidates: [
              "stefano-travaglia",
            ],
          },

          score:
            "7-6(4), 6-4",
        },
      ],
    },

    {
      tournamentSlug:
        "antwerp",

      editions: [
        {
          year: 2021,

          editionLabel:
            "Antwerp",

          championName:
            "Jannik Sinner",

          runnerUpName:
            "Diego Schwartzman",

          championCountryCode:
            "ITA",

          runnerUpCountryCode:
            "ARG",

          championPlayer: {
            slugCandidates: [
              "jannik-sinner",
              "sinner",
            ],
          },

          runnerUpPlayer: {
            slugCandidates: [
              "diego-schwartzman",
            ],
          },

          score:
            "6-2, 6-2",
        },
      ],
    },

    {
      tournamentSlug:
        "umag",

      editions: [
        {
          year: 2022,

          championName:
            "Jannik Sinner",

          runnerUpName:
            "Carlos Alcaraz",

          championCountryCode:
            "ITA",

          runnerUpCountryCode:
            "ESP",

          championPlayer: {
            slugCandidates: [
              "jannik-sinner",
              "sinner",
            ],
          },

          runnerUpPlayer: {
            slugCandidates: [
              "carlos-alcaraz",
              "alcaraz",
            ],
          },

          score:
            "6-7(5), 6-1, 6-1",
        },
      ],
    },

    {
      tournamentSlug:
        "montpellier",

      editions: [
        {
          year: 2023,

          editionLabel:
            "Open Sud de France",

          championName:
            "Jannik Sinner",

          runnerUpName:
            "Maxime Cressy",

          championCountryCode:
            "ITA",

          runnerUpCountryCode:
            "USA",

          championPlayer: {
            slugCandidates: [
              "jannik-sinner",
              "sinner",
            ],
          },

          runnerUpPlayer: {
            slugCandidates: [
              "maxime-cressy",
            ],
          },

          score:
            "7-6(3), 6-3",
        },
      ],
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


async function ensureHistoricalTournament(
  definition:
    HistoricalTournamentDefinition,
) {
  const existing =
    await prisma.tournament.findUnique({
      where: {
        slug:
          definition.slug,
      },

      select: {
        id: true,
        name: true,
      },
    });

  if (existing) {
    return {
      id:
        existing.id,

      name:
        existing.name,

      created:
        false,
    };
  }

  const tournament =
    await prisma.tournament.create({
      data: {
        slug:
          definition.slug,

        name:
          definition.name,

        shortName:
          definition.shortName,

        category:
          TournamentCategory.ATP_250,

        surface:
          definition.surface,

        city:
          definition.city,

        country:
          definition.country,

        countryCode:
          definition.countryCode,

        foundedYear:
          definition.foundedYear,

        description:
          definition.description,

        active:
          false,

        featured:
          false,

        metaTitle:
          `${definition.name} | Historical ATP 250 Archive | AGE202`,

        metaDescription:
          `${definition.description} Explore the historical tournament record within AGE202.`,
      },
    });

  return {
    id:
      tournament.id,

    name:
      tournament.name,

    created:
      true,
  };
}


async function validateExistingTournament(
  tournamentSlug: string,
) {
  const tournament =
    await prisma.tournament.findUnique({
      where: {
        slug:
          tournamentSlug,
      },

      select: {
        id: true,
        name: true,
        category: true,
      },
    });

  return tournament;
}


async function main() {
  const write =
    hasWriteFlag();

  console.log("");
  console.log(
    "🎾 AGE202 · SINNER ATP 250 HISTORICAL BACKFILL",
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

  const sinner =
    await prisma.player.findUnique({
      where: {
        slug:
          "jannik-sinner",
      },

      select: {
        id: true,
        name: true,
        slug: true,
      },
    });

  if (!sinner) {
    throw new Error(
      'Player "jannik-sinner" non trovato.',
    );
  }

  console.log(
    `👤 ${sinner.name} · ${sinner.slug}`,
  );
  console.log("");

  printDivider();
  console.log(
    "🏛️ HISTORICAL TOURNAMENT IDENTITIES",
  );
  printDivider();

  for (
    const definition
    of historicalTournaments
  ) {
    const existing =
      await validateExistingTournament(
        definition.slug,
      );

    if (existing) {
      console.log(
        `✅ ${definition.slug} · già presente · ${existing.name}`,
      );

      continue;
    }

    if (!write) {
      console.log(
        `🆕 ${definition.slug} · da creare · ${definition.name} · active=false`,
      );

      continue;
    }

    const result =
      await ensureHistoricalTournament(
        definition,
      );

    console.log(
      result.created
        ? `🟢 ${definition.slug} · creato · ${definition.name}`
        : `✅ ${definition.slug} · già presente`,
    );
  }

  console.log("");
  printDivider();
  console.log(
    "📚 EDITION BACKFILL PLAN",
  );
  printDivider();

  let plannedEditions =
    0;

  for (
    const dataset
    of datasets
  ) {
    const historicalDefinition =
      historicalTournaments.find(
        (definition) =>
          definition.slug ===
          dataset.tournamentSlug,
      );

    const tournament =
      await validateExistingTournament(
        dataset.tournamentSlug,
      );

    if (
      !tournament &&
      !historicalDefinition
    ) {
      throw new Error(
        `Tournament AGE202 non trovato e non definito come storico: "${dataset.tournamentSlug}".`,
      );
    }

    for (
      const edition
      of dataset.editions
    ) {
      plannedEditions +=
        1;

      console.log(
        [
          write
            ? "💾"
            : "🧪",

          String(
            edition.year,
          ),

          "·",

          dataset.tournamentSlug,

          "·",

          `${edition.championName ?? "—"} d. ${edition.runnerUpName ?? "—"}`,

          "·",

          edition.score ??
            "score n/a",
        ].join(" "),
      );
    }
  }

  if (!write) {
    console.log("");
    printDivider();
    console.log(
      "📊 DRY RUN SUMMARY",
    );
    printDivider();

    console.log(
      `Historical tournaments to ensure: ${historicalTournaments.length}`,
    );

    console.log(
      `TournamentEdition planned:        ${plannedEditions}`,
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
      "npx tsx scripts/backfill-sinner-missing-atp250.ts --write",
    );

    console.log("");

    return;
  }

  /*
   * In WRITE mode assicuriamo nuovamente che le identità
   * storiche esistano prima dell'import delle edizioni.
   */
  for (
    const definition
    of historicalTournaments
  ) {
    await ensureHistoricalTournament(
      definition,
    );
  }

  console.log("");
  printDivider();
  console.log(
    "💾 WRITING TOURNAMENT EDITIONS",
  );
  printDivider();

  let importedEditions =
    0;

  for (
    const dataset
    of datasets
  ) {
    const result =
      await importTournamentEditions(
        dataset,
      );

    importedEditions +=
      result.importedEditions;

    await syncTournamentChampionSummaries(
      result.tournamentId,
    );

    console.log(
      `🏆 Hall of Champions sincronizzata · ${result.tournamentName}`,
    );
  }

  console.log("");
  printDivider();
  console.log(
    "🏁 BACKFILL COMPLETED",
  );
  printDivider();

  console.log(
    `TournamentEdition sincronizzate: ${importedEditions}`,
  );

  console.log("");
  console.log(
    "➡️ Ora esegui:",
  );

  console.log(
    "npx tsx scripts/audit-player-tournament-history.ts jannik-sinner",
  );

  console.log("");
}


main()
  .catch(
    (error: unknown) => {
      console.error("");
      console.error(
        "❌ Sinner ATP 250 historical backfill failed.",
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
