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


const PLAYER_SLUG =
  "novak-djokovic";

const DEFAULT_TOURNAMENT_SLUG =
  "paris-olympics";

const OLYMPIC_YEAR =
  2024;


function hasWriteFlag(): boolean {
  return process.argv.includes(
    "--write",
  );
}


function divider() {
  console.log(
    "────────────────────────────────────────────────────────────",
  );
}


async function resolveOlympicsTournament() {
  const categoryMatches =
    await prisma.tournament.findMany({
      where: {
        category:
          TournamentCategory.OLYMPICS,
      },

      select: {
        id: true,
        slug: true,
        name: true,
        shortName: true,
        city: true,
        country: true,
        surface: true,
        category: true,
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
        "Trovati più Tournament con categoria OLYMPICS.",
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
        category: true,
        active: true,
      },
    });

  if (slugMatch) {
    if (
      slugMatch.category !==
      TournamentCategory.OLYMPICS
    ) {
      throw new Error(
        `Lo slug "${DEFAULT_TOURNAMENT_SLUG}" esiste ma ha categoria ${String(
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


async function createOlympicsTournament() {
  return prisma.tournament.create({
    data: {
      slug:
        DEFAULT_TOURNAMENT_SLUG,

      name:
        "Paris Olympics",

      shortName:
        "Olympic Games",

      category:
        TournamentCategory.OLYMPICS,

      surface:
        CourtSurface.CLAY,

      city:
        "Paris",

      country:
        "France",

      countryCode:
        "FRA",

      foundedYear:
        1896,

      description:
        "Olympic tennis singles competition archive.",

      active:
        true,

      featured:
        true,

      metaTitle:
        "Olympic Tennis | Paris 2024 | AGE202",

      metaDescription:
        "Explore Olympic tennis champions and historical editions in the AGE202 tennis archive.",
    },

    select: {
      id: true,
      slug: true,
      name: true,
      shortName: true,
      city: true,
      country: true,
      surface: true,
      category: true,
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
          OLYMPIC_YEAR,

        editionLabel:
          "Paris 2024",

        championName:
          "Novak Djokovic",

        runnerUpName:
          "Carlos Alcaraz",

        championCountryCode:
          "SRB",

        runnerUpCountryCode:
          "ESP",

        championPlayer: {
          slugCandidates: [
            "novak-djokovic",
            "djokovic",
          ],
        },

        runnerUpPlayer: {
          slugCandidates: [
            "carlos-alcaraz",
            "alcaraz",
          ],
        },

        score:
          "7-6(3), 7-6(2)",
      },
    ],
  };
}


async function main() {
  const write =
    hasWriteFlag();

  console.log("");
  console.log(
    "🥇 AGE202 · DJOKOVIC PARIS 2024 OLYMPIC GOLD BACKFILL",
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
          PLAYER_SLUG,
      },

      select: {
        id: true,
        name: true,
        slug: true,
      },
    });

  if (!player) {
    throw new Error(
      `Player "${PLAYER_SLUG}" non trovato.`,
    );
  }

  console.log(
    `👤 ${player.name} · ${player.slug}`,
  );
  console.log(
    `🆔 ${player.id}`,
  );
  console.log("");

  const resolution =
    await resolveOlympicsTournament();

  divider();
  console.log(
    "🏛️ OLYMPIC TOURNAMENT IDENTITY",
  );
  divider();

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
      `   category: ${String(
        resolution.tournament.category,
      )}`,
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
  } else {
    console.log(
      `🆕 Olympic Tournament non presente: verrà creato con slug "${DEFAULT_TOURNAMENT_SLUG}".`,
    );
    console.log(
      "   category: OLYMPICS",
    );
    console.log(
      "   location: Paris, France",
    );
    console.log(
      "   surface: CLAY",
    );
  }

  const tournamentId =
    resolution.tournament?.id ??
    null;

  const existingEdition =
    tournamentId
      ? await prisma.tournamentEdition.findFirst({
          where: {
            tournamentId,

            year:
              OLYMPIC_YEAR,

            cancelled:
              false,
          },

          select: {
            id: true,
            editionKey: true,
            championName: true,
            runnerUpName: true,
            championPlayerId: true,
            runnerUpPlayerId: true,
            score: true,
          },
        })
      : null;

  console.log("");
  divider();
  console.log(
    "📚 PARIS 2024 EDITION STATUS",
  );
  divider();

  if (existingEdition) {
    console.log(
      `📚 ${existingEdition.editionKey}`,
    );
    console.log(
      `   ${existingEdition.championName ?? "—"} d. ${existingEdition.runnerUpName ?? "—"} · ${existingEdition.score ?? "—"}`,
    );

    if (
      existingEdition.championPlayerId ===
      player.id
    ) {
      console.log(
        "✅ Djokovic è già collegato come Olympic champion.",
      );
    } else if (
      existingEdition.championName
        ?.toLowerCase()
        .includes(
          "djokovic",
        ) &&
      !existingEdition.championPlayerId
    ) {
      console.log(
        "🟡 Djokovic presente come championName ma non collegato.",
      );
    } else {
      throw new Error(
        `Paris 2024 esiste già con champion "${existingEdition.championName ?? "—"}". Interruzione di sicurezza.`,
      );
    }
  } else {
    console.log(
      "❌ TournamentEdition Paris 2024 assente.",
    );
  }

  console.log("");
  divider();
  console.log(
    "🎯 BACKFILL PLAN",
  );
  divider();

  console.log(
    "🥇 2024 · Paris Olympics",
  );
  console.log(
    "   Novak Djokovic d. Carlos Alcaraz",
  );
  console.log(
    "   7-6(3), 7-6(2)",
  );
  console.log(
    "   category: OLYMPICS",
  );
  console.log(
    "   surface: CLAY",
  );

  if (
    existingEdition?.championPlayerId ===
    player.id
  ) {
    console.log("");
    console.log(
      "✅ RECORD ALREADY COMPLETE",
    );
    console.log(
      "🛡️ Nessuna scrittura necessaria.",
    );
    console.log("");

    return;
  }

  if (!write) {
    console.log("");
    console.log(
      `Tournament to create: ${resolution.mustCreate ? "YES" : "NO"}`,
    );
    console.log(
      "TournamentEdition to add/update: 1",
    );
    console.log("");
    console.log(
      "✅ DRY RUN COMPLETED",
    );
    console.log(
      "🛡️ DATABASE UNCHANGED",
    );
    console.log("");
    console.log(
      "➡️ Per applicare il backfill:",
    );
    console.log(
      "npx tsx scripts/backfill-djokovic-olympics-2024.ts --write",
    );
    console.log("");

    return;
  }

  let tournament =
    resolution.tournament;

  if (!tournament) {
    tournament =
      await createOlympicsTournament();

    console.log("");
    console.log(
      `🆕 Tournament creato · ${tournament.name} · ${tournament.slug}`,
    );
  }

  const result =
    await importTournamentEditions(
      buildDataset(
        tournament.slug,
      ),
    );

  await syncTournamentChampionSummaries(
    result.tournamentId,
  );

  console.log("");
  divider();
  console.log(
    "🔎 FINAL VERIFICATION",
  );
  divider();

  const storedEdition =
    await prisma.tournamentEdition.findFirst({
      where: {
        tournamentId:
          result.tournamentId,

        year:
          OLYMPIC_YEAR,

        championPlayerId:
          player.id,

        cancelled:
          false,
      },

      select: {
        year: true,
        championName: true,
        runnerUpName: true,
        score: true,
      },
    });

  if (!storedEdition) {
    throw new Error(
      "Paris 2024 Olympic edition non risulta collegata a Djokovic dopo il backfill.",
    );
  }

  console.log(
    `🥇 ${storedEdition.year} · ${storedEdition.championName ?? "—"} d. ${storedEdition.runnerUpName ?? "—"} · ${storedEdition.score ?? "—"}`,
  );

  console.log("");
  console.log(
    "✅ DJOKOVIC OLYMPIC GOLD LINKED: 1 / 1",
  );
  console.log("");
  console.log(
    "➡️ Ora esegui:",
  );
  console.log(
    "npx tsx scripts/audit-djokovic-career-gap.ts",
  );
  console.log("");
}


main()
  .catch(
    (error: unknown) => {
      console.error("");
      console.error(
        "❌ Djokovic Olympics 2024 backfill failed.",
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
