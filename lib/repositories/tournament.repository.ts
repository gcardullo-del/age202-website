import { prisma } from "@/lib/prisma";

const tournamentOrder = [
  {
    displayOrder: "asc" as const,
  },
  {
    name: "asc" as const,
  },
];

const tournamentEditionInclude = {
  championPlayer: true,
  runnerUpPlayer: true,
};

export async function getAllTournaments() {
  return prisma.tournament.findMany({
    where: {
      active: true,
    },

    orderBy: tournamentOrder,
  });
}

export async function getFeaturedTournaments() {
  return prisma.tournament.findMany({
    where: {
      active: true,
      featured: true,
    },

    orderBy: tournamentOrder,
  });
}

export async function getTournamentBySlug(
  slug: string,
) {
  const normalizedSlug =
    slug.trim().toLowerCase();

  if (!normalizedSlug) {
    return null;
  }

  return prisma.tournament.findFirst({
    where: {
      slug: normalizedSlug,
      active: true,
    },

    include: {
      editions: {
        include:
          tournamentEditionInclude,

        orderBy: {
          year: "desc",
        },
      },

      champions: {
        include: {
          player: true,
        },

        orderBy: [
          {
            titles: "desc",
          },
          {
            lastTitleYear: "desc",
          },
        ],
      },
    },
  });
}

export async function getTournamentEditions(
  tournamentId: string,
) {
  return prisma.tournamentEdition.findMany({
    where: {
      tournamentId,
    },

    include:
      tournamentEditionInclude,

    orderBy: {
      year: "desc",
    },
  });
}

export async function getTournamentEditionByYear(
  tournamentId: string,
  year: number,
) {
  return prisma.tournamentEdition.findUnique({
    where: {
      tournamentId_year: {
        tournamentId,
        year,
      },
    },

    include:
      tournamentEditionInclude,
  });
}