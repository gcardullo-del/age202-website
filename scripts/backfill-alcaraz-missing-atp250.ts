import "dotenv/config";

import {
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


type BackfillCandidate = {
  year: number;
  tournamentSlug: string;
  tournamentName: string;
  championName: string;
  championSlugCandidates: readonly string[];
  runnerUpName: string;
  runnerUpSlugCandidates: readonly string[];
  score: string;
};


const candidates:
  BackfillCandidate[] = [
    {
      year:
        2021,

      tournamentSlug:
        "umag",

      tournamentName:
        "Plava Laguna Croatia Open Umag",

      championName:
        "Carlos Alcaraz",

      championSlugCandidates: [
        "carlos-alcaraz",
        "alcaraz",
      ],

      runnerUpName:
        "Richard Gasquet",

      runnerUpSlugCandidates: [
        "richard-gasquet",
        "gasquet",
      ],

      score:
        "6-2, 6-2",
    },

    {
      year:
        2023,

      tournamentSlug:
        "buenos-aires",

      tournamentName:
        "Argentina Open",

      championName:
        "Carlos Alcaraz",

      championSlugCandidates: [
        "carlos-alcaraz",
        "alcaraz",
      ],

      runnerUpName:
        "Cameron Norrie",

      runnerUpSlugCandidates: [
        "cameron-norrie",
        "norrie",
      ],

      score:
        "6-3, 7-5",
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


function buildDataset(
  candidate: BackfillCandidate,
): TournamentHistoryDataset {
  return {
    tournamentSlug:
      candidate.tournamentSlug,

    editions: [
      {
        year:
          candidate.year,

        championName:
          candidate.championName,

        runnerUpName:
          candidate.runnerUpName,

        championPlayer: {
          slugCandidates: [
            ...candidate.championSlugCandidates,
          ],
        },

        runnerUpPlayer: {
          slugCandidates: [
            ...candidate.runnerUpSlugCandidates,
          ],
        },

        score:
          candidate.score,
      },
    ],
  };
}


async function main() {
  const write =
    hasWriteFlag();

  console.log("");
  console.log(
    "🎾 AGE202 · ALCARAZ MISSING ATP 250 BACKFILL",
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

  const player =
    await prisma.player.findUnique({
      where: {
        slug:
          "carlos-alcaraz",
      },

      select: {
        id: true,
        name: true,
        slug: true,
      },
    });

  if (!player) {
    throw new Error(
      'Player "carlos-alcaraz" non trovato.',
    );
  }

  console.log(
    `👤 ${player.name} · ${player.slug}`,
  );
  console.log(
    `🆔 ${player.id}`,
  );
  console.log("");

  printDivider();
  console.log(
    "🔎 TOURNAMENT VALIDATION",
  );
  printDivider();

  for (
    const candidate
    of candidates
  ) {
    const tournament =
      await prisma.tournament.findUnique({
        where: {
          slug:
            candidate.tournamentSlug,
        },

        select: {
          id: true,
          name: true,
          slug: true,
          category: true,
          city: true,
          country: true,
        },
      });

    if (!tournament) {
      throw new Error(
        `Tournament non trovato: "${candidate.tournamentSlug}".`,
      );
    }

    if (
      tournament.category !==
      TournamentCategory.ATP_250
    ) {
      throw new Error(
        [
          `Categoria inattesa per "${tournament.slug}".`,
          `Attesa: ATP_250`,
          `Trovata: ${String(
            tournament.category,
          )}`,
        ].join("\n"),
      );
    }

    const existingEdition =
      await prisma.tournamentEdition.findFirst({
        where: {
          tournamentId:
            tournament.id,

          year:
            candidate.year,
        },

        select: {
          id: true,
          editionKey: true,
          championName: true,
          runnerUpName: true,
          championPlayerId: true,
          runnerUpPlayerId: true,
          score: true,
          cancelled: true,
        },
      });

    console.log("");
    console.log(
      `🏟️ ${candidate.year} · ${tournament.name}`,
    );
    console.log(
      `   slug: ${tournament.slug}`,
    );
    console.log(
      `   location: ${[
        tournament.city,
        tournament.country,
      ]
        .filter(Boolean)
        .join(", ") || "—"}`,
    );

    if (existingEdition) {
      console.log(
        `   ⚠️ Existing edition: ${existingEdition.editionKey}`,
      );
      console.log(
        `   ${existingEdition.championName ?? "—"} d. ${existingEdition.runnerUpName ?? "—"} · ${existingEdition.score ?? "—"}`,
      );
    } else {
      console.log(
        "   ✅ TournamentEdition missing: safe candidate for backfill",
      );
    }

    console.log(
      `   Planned final: ${candidate.championName} d. ${candidate.runnerUpName} · ${candidate.score}`,
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
      `Candidates: ${candidates.length}`,
    );
    console.log(
      "Expected result after write:",
    );
    console.log(
      "ATP 250 titles: 0 → 2",
    );
    console.log(
      "ATP titles:     24 → 26",
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
      "npx tsx scripts/backfill-alcaraz-missing-atp250.ts --write",
    );
    console.log("");

    return;
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
    const candidate
    of candidates
  ) {
    const dataset =
      buildDataset(
        candidate,
      );

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
      `✅ ${candidate.year} · ${candidate.tournamentName} · synchronized`,
    );
  }

  console.log("");
  printDivider();
  console.log(
    "🔎 FINAL VERIFICATION",
  );
  printDivider();

  const linkedTitles =
    await prisma.tournamentEdition.findMany({
      where: {
        cancelled:
          false,

        championPlayerId:
          player.id,
      },

      include: {
        tournament: {
          select: {
            name: true,
            category: true,
          },
        },
      },

      orderBy: [
        {
          year:
            "asc",
        },
        {
          tournament: {
            name:
              "asc",
          },
        },
      ],
    });

  const atp250Titles =
    linkedTitles.filter(
      (edition) =>
        edition.tournament.category ===
        TournamentCategory.ATP_250,
    );

  console.log(
    `ATP titles linked: ${linkedTitles.length}`,
  );
  console.log(
    `ATP 250 linked:    ${atp250Titles.length}`,
  );

  for (
    const edition
    of atp250Titles
  ) {
    console.log(
      `🏆 ${edition.year} · ${edition.tournament.name} · ${edition.championName ?? "—"} d. ${edition.runnerUpName ?? "—"} · ${edition.score ?? "—"}`,
    );
  }

  console.log("");
  console.log(
    `TournamentEdition synchronized: ${importedEditions}`,
  );
  console.log("");
  console.log(
    "✅ ALCARAZ ATP 250 BACKFILL COMPLETED",
  );
  console.log("");
  console.log(
    "➡️ Ora esegui:",
  );
  console.log(
    "npx tsx scripts/audit-player-tournament-history.ts carlos-alcaraz",
  );
  console.log("");
}


main()
  .catch(
    (error: unknown) => {
      console.error("");
      console.error(
        "❌ Alcaraz ATP 250 backfill failed.",
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
