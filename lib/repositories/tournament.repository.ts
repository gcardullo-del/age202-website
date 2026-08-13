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

const tournamentPublicInclude = {
  editions: {
    include: tournamentEditionInclude,

    orderBy: [
      {
        year: "desc" as const,
      },
      {
        editionKey: "asc" as const,
      },
    ],
  },

  champions: {
    include: {
      player: true,
    },

    orderBy: [
      {
        titles: "desc" as const,
      },
      {
        lastTitleYear: "desc" as const,
      },
      {
        sortOrder: "asc" as const,
      },
    ],
  },

  galleryItems: {
    orderBy: [
      {
        featured: "desc" as const,
      },
      {
        sortOrder: "asc" as const,
      },
      {
        createdAt: "asc" as const,
      },
    ],
  },

  milestones: {
    orderBy: [
      {
        featured: "desc" as const,
      },
      {
        sortOrder: "asc" as const,
      },
      {
        year: "asc" as const,
      },
      {
        createdAt: "asc" as const,
      },
    ],
  },

  chapters: {
    orderBy: [
      {
        featured: "desc" as const,
      },
      {
        sortOrder: "asc" as const,
      },
      {
        createdAt: "asc" as const,
      },
    ],
  },

  iconicMoments: {
    orderBy: [
      {
        featured: "desc" as const,
      },
      {
        sortOrder: "asc" as const,
      },
      {
        year: "asc" as const,
      },
      {
        createdAt: "asc" as const,
      },
    ],
  },
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

    include: tournamentPublicInclude,
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

    orderBy: [
      {
        year: "desc",
      },
      {
        editionKey: "asc",
      },
    ],
  });
}

export async function getTournamentEditionByYear(
  tournamentId: string,
  year: number,
  editionKey = "main",
) {
  return prisma.tournamentEdition.findUnique({
    where: {
      tournamentId_year_editionKey: {
        tournamentId,
        year,
        editionKey,
      },
    },

    include:
      tournamentEditionInclude,
  });
}