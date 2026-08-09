import "dotenv/config";

import { prisma } from "../lib/prisma";

const TOURNAMENT_SLUG =
  "indian-wells";

const tournamentData = {
  name:
    "BNP Paribas Open",
  shortName:
    "Indian Wells",
  category:
    "MASTERS_1000" as const,
  surface:
    "HARD" as const,
  city:
    "Indian Wells",
  country:
    "United States",
  countryCode:
    "USA",
  venue:
    "Indian Wells Tennis Garden",
  foundedYear:
    1976,
  description:
    "ATP Masters 1000 event held in Indian Wells, California, and one of the most prestigious tournaments on the professional tennis calendar.",
  history:
    "The men's event began in 1976 and developed into one of the signature stops of the ATP Tour. Indian Wells is known for its large desert venue, strong fields and a roll of honour featuring many of the sport's defining champions.",
  logoUrl:
    null,
  heroImage:
    null,
  websiteUrl:
    "https://bnpparibasopen.com",
  active:
    true,
  featured:
    true,
  displayOrder:
    10,
  metaTitle:
    "Indian Wells | BNP Paribas Open",
  metaDescription:
    "Explore the AGE202 museum archive for the BNP Paribas Open in Indian Wells, including champions, editions and tournament history.",
};

const editions = [
  {
    year: 2026,
    championName:
      "Jannik Sinner",
    runnerUpName:
      "Daniil Medvedev",
    championSlugCandidates: [
      "jannik-sinner",
      "sinner",
    ],
    runnerUpSlugCandidates: [
      "daniil-medvedev",
      "medvedev",
    ],
    championCountryCode:
      "ITA",
    runnerUpCountryCode:
      "RUS",
    score:
      "7-6(6), 7-6(4)",
  },
  {
    year: 2025,
    championName:
      "Jack Draper",
    runnerUpName:
      "Holger Rune",
    championSlugCandidates: [
      "jack-draper",
      "draper",
    ],
    runnerUpSlugCandidates: [
      "holger-rune",
      "rune",
    ],
    championCountryCode:
      "GBR",
    runnerUpCountryCode:
      "DEN",
    score:
      "6-2, 6-2",
  },
  {
    year: 2024,
    championName:
      "Carlos Alcaraz",
    runnerUpName:
      "Daniil Medvedev",
    championSlugCandidates: [
      "carlos-alcaraz",
      "alcaraz",
    ],
    runnerUpSlugCandidates: [
      "daniil-medvedev",
      "medvedev",
    ],
    championCountryCode:
      "ESP",
    runnerUpCountryCode:
      "RUS",
    score:
      "7-6(5), 6-1",
  },
  {
    year: 2023,
    championName:
      "Carlos Alcaraz",
    runnerUpName:
      "Daniil Medvedev",
    championSlugCandidates: [
      "carlos-alcaraz",
      "alcaraz",
    ],
    runnerUpSlugCandidates: [
      "daniil-medvedev",
      "medvedev",
    ],
    championCountryCode:
      "ESP",
    runnerUpCountryCode:
      "RUS",
    score:
      "6-3, 6-2",
  },
  {
    year: 2022,
    championName:
      "Taylor Fritz",
    runnerUpName:
      "Rafael Nadal",
    championSlugCandidates: [
      "taylor-fritz",
      "fritz",
    ],
    runnerUpSlugCandidates: [
      "rafael-nadal",
      "nadal",
    ],
    championCountryCode:
      "USA",
    runnerUpCountryCode:
      "ESP",
    score:
      "6-3, 7-6(5)",
  },
  {
    year: 2021,
    championName:
      "Cameron Norrie",
    runnerUpName:
      "Nikoloz Basilashvili",
    championSlugCandidates: [
      "cameron-norrie",
      "norrie",
    ],
    runnerUpSlugCandidates: [
      "nikoloz-basilashvili",
      "basilashvili",
    ],
    championCountryCode:
      "GBR",
    runnerUpCountryCode:
      "GEO",
    score:
      "3-6, 6-4, 6-1",
  },
] as const;

async function findPlayerId(
  slugCandidates:
    readonly string[],
): Promise<string | null> {
  for (
    const slug
    of slugCandidates
  ) {
    const player =
      await prisma.player.findFirst({
        where: {
          slug,
          active: true,
        },
        select: {
          id: true,
        },
      });

    if (player) {
      return player.id;
    }
  }

  return null;
}

async function upsertTournament() {
  console.log(
    "🏆 Aggiornamento del torneo Indian Wells...",
  );

  const tournament =
    await prisma.tournament.upsert({
      where: {
        slug:
          TOURNAMENT_SLUG,
      },

      create: {
        slug:
          TOURNAMENT_SLUG,
        ...tournamentData,
      },

      update:
        tournamentData,

      select: {
        id: true,
        name: true,
        slug: true,
      },
    });

  console.log(
    `✅ Torneo pronto: ${tournament.name} (${tournament.id})`,
  );

  return tournament;
}

async function upsertEditions(
  tournamentId: string,
) {
  console.log(
    "📚 Aggiornamento delle edizioni recenti...",
  );

  for (
    const edition
    of editions
  ) {
    const [
      championPlayerId,
      runnerUpPlayerId,
    ] =
      await Promise.all([
        findPlayerId(
          edition.championSlugCandidates,
        ),
        findPlayerId(
          edition.runnerUpSlugCandidates,
        ),
      ]);

    await prisma.tournamentEdition.upsert({
      where: {
        tournamentId_year: {
          tournamentId,
          year:
            edition.year,
        },
      },

      create: {
        tournamentId,
        year:
          edition.year,
        championName:
          edition.championName,
        runnerUpName:
          edition.runnerUpName,
        championPlayerId,
        runnerUpPlayerId,
        championCountryCode:
          edition.championCountryCode,
        runnerUpCountryCode:
          edition.runnerUpCountryCode,
        score:
          edition.score,
        cancelled:
          false,
      },

      update: {
        championName:
          edition.championName,
        runnerUpName:
          edition.runnerUpName,
        championPlayerId,
        runnerUpPlayerId,
        championCountryCode:
          edition.championCountryCode,
        runnerUpCountryCode:
          edition.runnerUpCountryCode,
        score:
          edition.score,
        cancelled:
          false,
      },
    });

    console.log(
      `   ✅ ${edition.year}: ${edition.championName} d. ${edition.runnerUpName}`,
    );
  }
}

async function rebuildChampionSummary(
  tournamentId: string,
) {
  console.log(
    "👑 Ricostruzione Hall of Champions...",
  );

  const linkedEditions =
    await prisma.tournamentEdition.findMany({
      where: {
        tournamentId,
        cancelled:
          false,
        championPlayerId: {
          not: null,
        },
      },

      select: {
        year: true,
        championPlayerId:
          true,
      },

      orderBy: {
        year: "asc",
      },
    });

  const summaries =
    new Map<
      string,
      {
        titles: number;
        firstTitleYear: number;
        lastTitleYear: number;
      }
    >();

  for (
    const edition
    of linkedEditions
  ) {
    if (
      !edition.championPlayerId
    ) {
      continue;
    }

    const current =
      summaries.get(
        edition.championPlayerId,
      );

    if (!current) {
      summaries.set(
        edition.championPlayerId,
        {
          titles: 1,
          firstTitleYear:
            edition.year,
          lastTitleYear:
            edition.year,
        },
      );

      continue;
    }

    summaries.set(
      edition.championPlayerId,
      {
        titles:
          current.titles + 1,
        firstTitleYear:
          Math.min(
            current.firstTitleYear,
            edition.year,
          ),
        lastTitleYear:
          Math.max(
            current.lastTitleYear,
            edition.year,
          ),
      },
    );
  }

  await prisma.tournamentChampion.deleteMany({
    where: {
      tournamentId,
    },
  });

  for (
    const [
      playerId,
      summary,
    ]
    of summaries
  ) {
    await prisma.tournamentChampion.create({
      data: {
        tournamentId,
        playerId,
        titles:
          summary.titles,
        firstTitleYear:
          summary.firstTitleYear,
        lastTitleYear:
          summary.lastTitleYear,
      },
    });
  }

  console.log(
    `✅ ${summaries.size} campioni collegati al museo.`,
  );
}

async function main() {
  try {
    const tournament =
      await upsertTournament();

    await upsertEditions(
      tournament.id,
    );

    await rebuildChampionSummary(
      tournament.id,
    );

    console.log(
      "🏛️ Indian Wells è pronto nel Tournament Engine AGE202.",
    );
  } catch (error) {
    console.error(
      "❌ Impossibile aggiornare Indian Wells:",
      error,
    );

    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

void main();