import { prisma } from "@/lib/prisma";

function normalizeSearchLimit(
  limit: number,
): number {
  return Math.max(
    1,
    Math.min(
      Math.trunc(limit),
      12,
    ),
  );
}

export async function searchPublishedArtifacts(
  query: string,
  limit = 6,
) {
  const normalizedQuery =
    query.trim();

  if (!normalizedQuery) {
    return [];
  }

  return prisma.artifact.findMany({
    where: {
      status: "PUBLISHED",

      player: {
        active: true,
      },

      OR: [
        {
          title: {
            contains:
              normalizedQuery,
            mode: "insensitive",
          },
        },
        {
          subtitle: {
            contains:
              normalizedQuery,
            mode: "insensitive",
          },
        },
        {
          slug: {
            contains:
              normalizedQuery,
            mode: "insensitive",
          },
        },
        {
          archiveNumber: {
            contains:
              normalizedQuery,
            mode: "insensitive",
          },
        },
        {
          tournament: {
            contains:
              normalizedQuery,
            mode: "insensitive",
          },
        },
        {
          collection: {
            contains:
              normalizedQuery,
            mode: "insensitive",
          },
        },
        {
          player: {
            name: {
              contains:
                normalizedQuery,
              mode: "insensitive",
            },
          },
        },
        {
          brand: {
            name: {
              contains:
                normalizedQuery,
              mode: "insensitive",
            },
          },
        },
      ],
    },

    select: {
      id: true,
      title: true,
      subtitle: true,
      slug: true,
      archiveNumber: true,
      year: true,
      tournament: true,
      collection: true,

      player: {
        select: {
          name: true,
        },
      },

      brand: {
        select: {
          name: true,
        },
      },

      images: {
        orderBy: [
          {
            isCover: "desc",
          },
          {
            sortOrder: "asc",
          },
        ],

        take: 1,

        select: {
          url: true,
        },
      },
    },

    orderBy: [
      {
        featured: "desc",
      },
      {
        publishedAt: "desc",
      },
      {
        createdAt: "desc",
      },
    ],

    take:
      normalizeSearchLimit(
        limit,
      ),
  });
}

export async function searchBrands(
  query: string,
  limit = 6,
) {
  const normalizedQuery =
    query.trim();

  if (!normalizedQuery) {
    return [];
  }

  return prisma.brand.findMany({
    where: {
      OR: [
        {
          name: {
            contains:
              normalizedQuery,
            mode: "insensitive",
          },
        },
        {
          slug: {
            contains:
              normalizedQuery,
            mode: "insensitive",
          },
        },
        {
          history: {
            contains:
              normalizedQuery,
            mode: "insensitive",
          },
        },
      ],
    },

    select: {
      id: true,
      name: true,
      slug: true,
      logo: true,
    },

    orderBy: {
      name: "asc",
    },

    take:
      normalizeSearchLimit(
        limit,
      ),
  });
}