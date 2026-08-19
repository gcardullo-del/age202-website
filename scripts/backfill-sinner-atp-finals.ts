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
        name: "asc",
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

    editions: [
      {
        year:
          2024,

        editionLabel:
          "Turin",

        championName:
          "Jannik Sinner",

        runnerUpName:
          "Taylor Fritz",

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
            "taylor-fritz",
          ],
        },

        score:
          "6-4, 6-4",
      },

      {
        year:
          2025,

        editionLabel:
          "Turin",

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
          "7-6(4), 7-5",
      },
    ],
  };
}


async function printExistingEditions(
  tournamentId: string,
) {
  const editions =
    await prisma.tournamentEdition.findMany({
      where: {
        tournamentId,

        year: {
          in: [
            2024,
            2025,
          ],
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
        year: "asc",
      },
    });

  if (
    editions.length ===
    0
  ) {
    console.log(
      "📭 Nessuna TournamentEdition 2024/2025 presente.",
    );

    return;
  }

  console.log(
    "📚 Edizioni già presenti:",
  );

  for (
    const edition
    of editions
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
    "🏆 AGE202 · SINNER ATP FINALS BACKFILL",
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
      "   location: Turin, Italy",
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
      "npx tsx scripts/backfill-sinner-atp-finals.ts --write",
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

  /*
   * Ricostruiamo il dataset con lo slug reale,
   * così importTournamentEditions usa sempre
   * l'identità Tournament effettivamente salvata.
   */
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
    "🏁 ATP FINALS BACKFILL COMPLETED",
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
    "npx tsx scripts/audit-player-tournament-history.ts jannik-sinner",
  );

  console.log("");
}


main()
  .catch(
    (error: unknown) => {
      console.error("");
      console.error(
        "❌ Sinner ATP Finals backfill failed.",
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
