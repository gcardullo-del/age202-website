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


type MissingTitle = {
  year: number;
  tournamentSlug: string;
  tournamentName: string;
  tournamentShortName: string;
  category: TournamentCategory;
  surface: CourtSurface;
  city: string;
  country: string;
  countryCode: string;
  runnerUpName: string;
  runnerUpCountryCode: string;
  runnerUpSlugCandidates: readonly string[];
  score: string;
  createTournamentIfMissing: boolean;
};


const missingTitles:
  MissingTitle[] = [
    {
      year: 2025,
      tournamentSlug: "athens",
      tournamentName: "Hellenic Championship",
      tournamentShortName: "Athens",
      category: TournamentCategory.ATP_250,
      surface: CourtSurface.INDOOR_HARD,
      city: "Athens",
      country: "Greece",
      countryCode: "GRE",
      runnerUpName: "Lorenzo Musetti",
      runnerUpCountryCode: "ITA",
      runnerUpSlugCandidates: [
        "lorenzo-musetti",
        "musetti",
      ],
      score: "4-6, 6-3, 7-5",
      createTournamentIfMissing: true,
    },

    {
      year: 2025,
      tournamentSlug: "geneva",
      tournamentName: "Geneva Open",
      tournamentShortName: "Geneva",
      category: TournamentCategory.ATP_250,
      surface: CourtSurface.CLAY,
      city: "Geneva",
      country: "Switzerland",
      countryCode: "SUI",
      runnerUpName: "Hubert Hurkacz",
      runnerUpCountryCode: "POL",
      runnerUpSlugCandidates: [
        "hubert-hurkacz",
        "hurkacz",
      ],
      score: "5-7, 7-6(2), 7-6(2)",
      createTournamentIfMissing: false,
    },

    {
      year: 2023,
      tournamentSlug: "adelaide",
      tournamentName: "Adelaide International",
      tournamentShortName: "Adelaide",
      category: TournamentCategory.ATP_250,
      surface: CourtSurface.HARD,
      city: "Adelaide",
      country: "Australia",
      countryCode: "AUS",
      runnerUpName: "Sebastian Korda",
      runnerUpCountryCode: "USA",
      runnerUpSlugCandidates: [
        "sebastian-korda",
        "korda",
      ],
      score: "6-7(8), 7-6(3), 6-4",
      createTournamentIfMissing: false,
    },

    {
      year: 2022,
      tournamentSlug: "astana",
      tournamentName: "Astana Open",
      tournamentShortName: "Astana",
      category: TournamentCategory.ATP_500,
      surface: CourtSurface.INDOOR_HARD,
      city: "Astana",
      country: "Kazakhstan",
      countryCode: "KAZ",
      runnerUpName: "Stefanos Tsitsipas",
      runnerUpCountryCode: "GRE",
      runnerUpSlugCandidates: [
        "stefanos-tsitsipas",
        "tsitsipas",
      ],
      score: "6-3, 6-4",
      createTournamentIfMissing: true,
    },

    {
      year: 2022,
      tournamentSlug: "tel-aviv",
      tournamentName: "Tel Aviv Watergen Open",
      tournamentShortName: "Tel Aviv",
      category: TournamentCategory.ATP_250,
      surface: CourtSurface.INDOOR_HARD,
      city: "Tel Aviv",
      country: "Israel",
      countryCode: "ISR",
      runnerUpName: "Marin Cilic",
      runnerUpCountryCode: "CRO",
      runnerUpSlugCandidates: [
        "marin-cilic",
        "cilic",
      ],
      score: "6-3, 6-4",
      createTournamentIfMissing: true,
    },

    {
      year: 2021,
      tournamentSlug: "belgrade-2",
      tournamentName: "Belgrade Open",
      tournamentShortName: "Belgrade 2",
      category: TournamentCategory.ATP_250,
      surface: CourtSurface.CLAY,
      city: "Belgrade",
      country: "Serbia",
      countryCode: "SRB",
      runnerUpName: "Alex Molcan",
      runnerUpCountryCode: "SVK",
      runnerUpSlugCandidates: [
        "alex-molcan",
        "molcan",
      ],
      score: "6-4, 6-3",
      createTournamentIfMissing: true,
    },

    {
      year: 2017,
      tournamentSlug: "eastbourne",
      tournamentName: "Eastbourne International",
      tournamentShortName: "Eastbourne",
      category: TournamentCategory.ATP_250,
      surface: CourtSurface.GRASS,
      city: "Eastbourne",
      country: "United Kingdom",
      countryCode: "GBR",
      runnerUpName: "Gael Monfils",
      runnerUpCountryCode: "FRA",
      runnerUpSlugCandidates: [
        "gael-monfils",
        "monfils",
      ],
      score: "6-3, 6-4",
      createTournamentIfMissing: false,
    },

    {
      year: 2011,
      tournamentSlug: "belgrade",
      tournamentName: "Serbia Open",
      tournamentShortName: "Belgrade",
      category: TournamentCategory.ATP_250,
      surface: CourtSurface.CLAY,
      city: "Belgrade",
      country: "Serbia",
      countryCode: "SRB",
      runnerUpName: "Feliciano Lopez",
      runnerUpCountryCode: "ESP",
      runnerUpSlugCandidates: [
        "feliciano-lopez",
        "lopez",
      ],
      score: "7-6(4), 6-2",
      createTournamentIfMissing: true,
    },

    {
      year: 2009,
      tournamentSlug: "belgrade",
      tournamentName: "Serbia Open",
      tournamentShortName: "Belgrade",
      category: TournamentCategory.ATP_250,
      surface: CourtSurface.CLAY,
      city: "Belgrade",
      country: "Serbia",
      countryCode: "SRB",
      runnerUpName: "Lukasz Kubot",
      runnerUpCountryCode: "POL",
      runnerUpSlugCandidates: [
        "lukasz-kubot",
        "kubot",
      ],
      score: "6-3, 7-6(0)",
      createTournamentIfMissing: true,
    },

    {
      year: 2007,
      tournamentSlug: "estoril",
      tournamentName: "Estoril Open",
      tournamentShortName: "Estoril",
      category: TournamentCategory.ATP_250,
      surface: CourtSurface.CLAY,
      city: "Estoril",
      country: "Portugal",
      countryCode: "POR",
      runnerUpName: "Richard Gasquet",
      runnerUpCountryCode: "FRA",
      runnerUpSlugCandidates: [
        "richard-gasquet",
        "gasquet",
      ],
      score: "7-6(7), 0-6, 6-1",
      createTournamentIfMissing: false,
    },

    {
      year: 2007,
      tournamentSlug: "adelaide",
      tournamentName: "Adelaide International",
      tournamentShortName: "Adelaide",
      category: TournamentCategory.ATP_250,
      surface: CourtSurface.HARD,
      city: "Adelaide",
      country: "Australia",
      countryCode: "AUS",
      runnerUpName: "Chris Guccione",
      runnerUpCountryCode: "AUS",
      runnerUpSlugCandidates: [
        "chris-guccione",
        "guccione",
      ],
      score: "6-3, 6-7(6), 6-4",
      createTournamentIfMissing: false,
    },

    {
      year: 2006,
      tournamentSlug: "metz",
      tournamentName: "Moselle Open",
      tournamentShortName: "Metz",
      category: TournamentCategory.ATP_250,
      surface: CourtSurface.INDOOR_HARD,
      city: "Metz",
      country: "France",
      countryCode: "FRA",
      runnerUpName: "Jurgen Melzer",
      runnerUpCountryCode: "AUT",
      runnerUpSlugCandidates: [
        "jurgen-melzer",
        "melzer",
      ],
      score: "4-6, 6-3, 6-2",
      createTournamentIfMissing: true,
    },

    {
      year: 2006,
      tournamentSlug: "amersfoort",
      tournamentName: "Dutch Open",
      tournamentShortName: "Amersfoort",
      category: TournamentCategory.ATP_250,
      surface: CourtSurface.CLAY,
      city: "Amersfoort",
      country: "Netherlands",
      countryCode: "NED",
      runnerUpName: "Nicolas Massu",
      runnerUpCountryCode: "CHI",
      runnerUpSlugCandidates: [
        "nicolas-massu",
        "massu",
      ],
      score: "7-6(5), 6-4",
      createTournamentIfMissing: true,
    },
  ];


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


async function resolveTournament(
  title: MissingTitle,
) {
  const bySlug =
    await prisma.tournament.findUnique({
      where: {
        slug:
          title.tournamentSlug,
      },
    });

  if (bySlug) {
    if (
      bySlug.category !==
      title.category
    ) {
      throw new Error(
        `${title.year} ${title.tournamentName}: category mismatch (${String(
          bySlug.category,
        )} != ${String(
          title.category,
        )}).`,
      );
    }

    return bySlug;
  }

  const candidates =
    await prisma.tournament.findMany({
      where: {
        category:
          title.category,

        OR: [
          {
            name: {
              contains:
                title.tournamentShortName,
              mode:
                "insensitive",
            },
          },
          {
            shortName: {
              contains:
                title.tournamentShortName,
              mode:
                "insensitive",
            },
          },
          {
            city: {
              equals:
                title.city,
              mode:
                "insensitive",
            },
          },
        ],
      },
    });

  if (
    candidates.length ===
    1
  ) {
    return candidates[0];
  }

  if (
    candidates.length >
    1
  ) {
    throw new Error(
      `${title.year} ${title.tournamentName}: trovati più Tournament candidati. Nessuna scrittura eseguita.`,
    );
  }

  return null;
}


async function createTournament(
  title: MissingTitle,
) {
  return prisma.tournament.create({
    data: {
      slug:
        title.tournamentSlug,

      name:
        title.tournamentName,

      shortName:
        title.tournamentShortName,

      category:
        title.category,

      surface:
        title.surface,

      city:
        title.city,

      country:
        title.country,

      countryCode:
        title.countryCode,

      active:
        false,

      featured:
        false,

      description:
        `${title.tournamentName} tournament archive.`,

      metaTitle:
        `${title.tournamentName} | AGE202`,

      metaDescription:
        `Historical champions and finals from ${title.tournamentName}.`,
    },
  });
}


function buildDataset(
  title: MissingTitle,
  resolvedSlug: string,
): TournamentHistoryDataset {
  return {
    tournamentSlug:
      resolvedSlug,

    editions: [
      {
        year:
          title.year,

        championName:
          "Novak Djokovic",

        runnerUpName:
          title.runnerUpName,

        championCountryCode:
          "SRB",

        runnerUpCountryCode:
          title.runnerUpCountryCode,

        championPlayer: {
          slugCandidates: [
            "novak-djokovic",
            "djokovic",
          ],
        },

        runnerUpPlayer: {
          slugCandidates: [
            ...title.runnerUpSlugCandidates,
          ],
        },

        score:
          title.score,
      },
    ],
  };
}


async function main() {
  const write =
    hasWriteFlag();

  console.log("");
  console.log(
    "🏆 AGE202 · DJOKOVIC MISSING ATP 500/250 BACKFILL",
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

  type PlanItem = {
    title: MissingTitle;
    tournament:
      | Awaited<
          ReturnType<
            typeof resolveTournament
          >
        >
      | null;
    existingEditionId:
      | string
      | null;
  };

  const plan:
    PlanItem[] = [];

  divider();
  console.log(
    "🔎 VALIDATING 13 TARGET TITLES",
  );
  divider();

  for (
    const title
    of missingTitles
  ) {
    const tournament =
      await resolveTournament(
        title,
      );

    if (
      !tournament &&
      !title.createTournamentIfMissing
    ) {
      throw new Error(
        `${title.year} ${title.tournamentName}: il Tournament doveva già esistere ma non è stato trovato.`,
      );
    }

    let existingEditionId:
      | string
      | null =
        null;

    if (tournament) {
      const existingEdition =
        await prisma.tournamentEdition.findFirst({
          where: {
            tournamentId:
              tournament.id,

            year:
              title.year,

            cancelled:
              false,
          },

          select: {
            id: true,
            championName: true,
            championPlayerId: true,
            runnerUpName: true,
            score: true,
          },
        });

      if (existingEdition) {
        if (
          existingEdition.championPlayerId ===
            player.id ||
          existingEdition.championName
            ?.toLowerCase()
            .includes(
              "djokovic",
            )
        ) {
          existingEditionId =
            existingEdition.id;
        } else {
          throw new Error(
            `${title.year} ${title.tournamentName}: TournamentEdition già presente con champion "${existingEdition.championName ?? "—"}". Interruzione di sicurezza.`,
          );
        }
      }
    }

    plan.push({
      title,
      tournament,
      existingEditionId,
    });

    console.log(
      [
        existingEditionId
          ? "✅"
          : tournament
            ? "🟡"
            : "🆕",

        title.year,

        `· ${title.tournamentName}`,

        `· ${String(
          title.category,
        )}`,

        `· Djokovic d. ${title.runnerUpName}`,

        `· ${title.score}`,

        existingEditionId
          ? "· EDITION ALREADY PRESENT"
          : tournament
            ? "· CREATE EDITION"
            : "· CREATE TOURNAMENT + EDITION",
      ].join(" "),
    );
  }

  const alreadyPresent =
    plan.filter(
      (item) =>
        Boolean(
          item.existingEditionId,
        ),
    ).length;

  const editionsToWrite =
    plan.length -
    alreadyPresent;

  const tournamentsToCreate =
    new Set(
      plan
        .filter(
          (item) =>
            !item.tournament,
        )
        .map(
          (item) =>
            item.title
              .tournamentSlug,
        ),
    ).size;

  console.log("");
  divider();
  console.log(
    "📊 BACKFILL PLAN",
  );
  divider();

  console.log(
    `Target titles:             ${plan.length}`,
  );
  console.log(
    `Already present:           ${alreadyPresent}`,
  );
  console.log(
    `Tournament to create:      ${tournamentsToCreate}`,
  );
  console.log(
    `TournamentEdition to add:  ${editionsToWrite}`,
  );

  if (!write) {
    console.log("");
    console.log(
      "✅ DRY RUN COMPLETED",
    );
    console.log(
      "🛡️ DATABASE UNCHANGED",
    );
    console.log("");
    console.log(
      "➡️ Se il piano sopra è corretto, esegui:",
    );
    console.log(
      "npx tsx scripts/backfill-djokovic-missing-atp500-atp250.ts --write",
    );
    console.log("");

    return;
  }

  console.log("");
  divider();
  console.log(
    "💾 APPLYING BACKFILL",
  );
  divider();

  for (
    const item
    of plan
  ) {
    if (
      item.existingEditionId
    ) {
      console.log(
        `⏭️ ${item.title.year} · ${item.title.tournamentName} · già presente`,
      );

      continue;
    }

    let tournament =
      item.tournament;

    if (!tournament) {
      tournament =
        await createTournament(
          item.title,
        );

      console.log(
        `🆕 Tournament creato · ${tournament.name} · ${tournament.slug}`,
      );
    }

    const result =
      await importTournamentEditions(
        buildDataset(
          item.title,
          tournament.slug,
        ),
      );

    await syncTournamentChampionSummaries(
      result.tournamentId,
    );

    console.log(
      `🏆 ${item.title.year} · ${item.title.tournamentName} · sincronizzato`,
    );
  }

  console.log("");
  divider();
  console.log(
    "🔎 FINAL VERIFICATION",
  );
  divider();

  let verified =
    0;

  for (
    const title
    of missingTitles
  ) {
    const tournament =
      await resolveTournament(
        title,
      );

    if (!tournament) {
      console.log(
        `❌ ${title.year} · ${title.tournamentName} · tournament missing`,
      );

      continue;
    }

    const edition =
      await prisma.tournamentEdition.findFirst({
        where: {
          tournamentId:
            tournament.id,

          year:
            title.year,

          championPlayerId:
            player.id,

          cancelled:
            false,
        },

        select: {
          runnerUpName: true,
          score: true,
        },
      });

    if (!edition) {
      console.log(
        `❌ ${title.year} · ${title.tournamentName} · edition not linked`,
      );

      continue;
    }

    verified +=
      1;

    console.log(
      `✅ ${title.year} · ${title.tournamentName} · Djokovic d. ${edition.runnerUpName ?? "—"} · ${edition.score ?? "—"}`,
    );
  }

  console.log("");
  console.log(
    `Missing-title backfill verified: ${verified} / ${missingTitles.length}`,
  );

  if (
    verified !==
    missingTitles.length
  ) {
    throw new Error(
      `Verifica incompleta: ${verified}/${missingTitles.length}.`,
    );
  }

  console.log("");
  console.log(
    "🏁 DJOKOVIC ATP 500/250 BACKFILL COMPLETED",
  );
  console.log("");
  console.log(
    "➡️ Ora esegui:",
  );
  console.log(
    "npx tsx scripts/audit-djokovic-atp500-atp250.ts",
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
        "❌ Djokovic ATP 500/250 backfill failed.",
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
