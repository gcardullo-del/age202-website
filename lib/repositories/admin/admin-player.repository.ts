import type {
  PlayerCollectionType,
  Prisma,
} from "@/generated/prisma/client";

import { prisma } from "@/lib/prisma";

export type AdminPlayerStatusFilter =
  | "active"
  | "inactive"
  | "";

export type AdminPlayerProfileFilter =
  | "complete"
  | "missing"
  | "";

export type AdminPlayerFilters = {
  query?: string;
  status?: AdminPlayerStatusFilter;
  collectionType?: PlayerCollectionType | "";
  profile?: AdminPlayerProfileFilter;
};

export type AdminPlayerStats = {
  total: number;
  active: number;
  inactive: number;
  featured: number;
  legends: number;
  risingStars: number;
  archive: number;
  withProfile: number;
  linkedToAtp: number;
};

const PLAYER_COLLECTION_TYPES =
  new Set<PlayerCollectionType>([
    "FEATURED",
    "LEGEND",
    "RISING_STAR",
    "ARCHIVE",
  ]);

function normalize(
  value: string | undefined,
): string {
  return value?.trim() ?? "";
}

function parseCollectionType(
  value: string | undefined,
): PlayerCollectionType | undefined {
  const normalized = normalize(value);

  if (
    !normalized ||
    !PLAYER_COLLECTION_TYPES.has(
      normalized as PlayerCollectionType,
    )
  ) {
    return undefined;
  }

  return normalized as PlayerCollectionType;
}

function buildAdminPlayerWhere(
  filters: AdminPlayerFilters = {},
): Prisma.PlayerWhereInput {
  const query = normalize(
    filters.query,
  );

  const collectionType =
    typeof filters.collectionType ===
      "string" &&
    filters.collectionType
      ? parseCollectionType(
          filters.collectionType,
        )
      : undefined;

  return {
    ...(query
      ? {
          OR: [
            {
              name: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              firstName: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              lastName: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              nickname: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              slug: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              country: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              atpPlayer: {
                is: {
                  name: {
                    contains: query,
                    mode: "insensitive",
                  },
                },
              },
            },
          ],
        }
      : {}),

    ...(filters.status === "active"
      ? {
          active: true,
        }
      : filters.status ===
          "inactive"
        ? {
            active: false,
          }
        : {}),

    ...(collectionType
      ? {
          collectionType,
        }
      : {}),

    ...(filters.profile ===
    "complete"
      ? {
          playerProfile: {
            isNot: null,
          },
        }
      : filters.profile ===
          "missing"
        ? {
            playerProfile: {
              is: null,
            },
          }
        : {}),
  };
}

export async function getAdminPlayers(
  filters: AdminPlayerFilters = {},
) {
  const where =
    buildAdminPlayerWhere(filters);

  return prisma.player.findMany({
    where,

    include: {
      atpPlayer: true,
      playerProfile: true,

      museumCollections: {
        select: {
          id: true,
          featured: true,
          sortOrder: true,

          collection: {
            select: {
              id: true,
              title: true,
              slug: true,
              status: true,
              featured: true,
            },
          },
        },

        orderBy: [
          {
            featured: "desc",
          },
          {
            sortOrder: "asc",
          },
        ],
      },

      _count: {
        select: {
          artifacts: true,

          museumCollections: true,
        },
      },
    },

    orderBy: [
      {
        active: "desc",
      },
      {
        collectionType: "asc",
      },
      {
        displayOrder: {
          sort: "asc",
          nulls: "last",
        },
      },
      {
        atpPlayer: {
          rank: "asc",
        },
      },
      {
        name: "asc",
      },
    ],
  });
}

export async function getAdminPlayer(
  playerId: string,
) {
  const normalizedId =
    playerId.trim();

  if (!normalizedId) {
    return null;
  }

  return prisma.player.findUnique({
    where: {
      id: normalizedId,
    },

    include: {
      atpPlayer: true,
      playerProfile: true,

      careerEvents: {
        orderBy: [
          {
            year: "asc",
          },
          {
            month: {
              sort: "asc",
              nulls: "first",
            },
          },
          {
            day: {
              sort: "asc",
              nulls: "first",
            },
          },
          {
            sortOrder: "asc",
          },
        ],
      },

      artifacts: {
        include: {
          brand: true,

          images: {
            orderBy: [
              {
                isCover: "desc",
              },
              {
                sortOrder: "asc",
              },
            ],
          },
        },

        orderBy: [
          {
            featured: "desc",
          },
          {
            createdAt: "desc",
          },
        ],
      },

      museumCollections: {
        include: {
          collection: {
            include: {
              heroMedia: true,

              _count: {
                select: {
                  players: true,
                  artifacts: true,
                  originals: true,
                  media: true,
                },
              },
            },
          },
        },

        orderBy: [
          {
            featured: "desc",
          },
          {
            sortOrder: "asc",
          },
        ],
      },

      _count: {
        select: {
          artifacts: true,
          museumCollections: true,
        },
      },
    },
  });
}

export async function getAdminPlayerBySlug(
  slug: string,
) {
  const normalizedSlug =
    slug.trim();

  if (!normalizedSlug) {
    return null;
  }

  return prisma.player.findUnique({
    where: {
      slug: normalizedSlug,
    },

    include: {
      atpPlayer: true,
      playerProfile: true,

      _count: {
        select: {
          artifacts: true,
          museumCollections: true,
        },
      },
    },
  });
}

export async function getPlayerStats(): Promise<AdminPlayerStats> {
  const [
    total,
    active,
    inactive,
    featured,
    legends,
    risingStars,
    archive,
    withProfile,
    linkedToAtp,
  ] = await Promise.all([
    prisma.player.count(),

    prisma.player.count({
      where: {
        active: true,
      },
    }),

    prisma.player.count({
      where: {
        active: false,
      },
    }),

    prisma.player.count({
      where: {
        collectionType:
          "FEATURED",
      },
    }),

    prisma.player.count({
      where: {
        collectionType:
          "LEGEND",
      },
    }),

    prisma.player.count({
      where: {
        collectionType:
          "RISING_STAR",
      },
    }),

    prisma.player.count({
      where: {
        collectionType:
          "ARCHIVE",
      },
    }),

    prisma.player.count({
      where: {
        playerProfile: {
          isNot: null,
        },
      },
    }),

    prisma.player.count({
      where: {
        atpPlayer: {
          isNot: null,
        },
      },
    }),
  ]);

  return {
    total,
    active,
    inactive,
    featured,
    legends,
    risingStars,
    archive,
    withProfile,
    linkedToAtp,
  };
}

export async function searchAdminPlayers(
  query: string,
  limit = 20,
) {
  const normalizedQuery =
    query.trim();

  if (!normalizedQuery) {
    return [];
  }

  const safeLimit = Math.min(
    Math.max(
      Math.trunc(limit),
      1,
    ),
    50,
  );

  return prisma.player.findMany({
    where:
      buildAdminPlayerWhere({
        query:
          normalizedQuery,
      }),

    select: {
      id: true,
      name: true,
      slug: true,
      country: true,
      nickname: true,
      heroImage: true,
      portraitImage: true,
      active: true,
      collectionType: true,

      atpPlayer: {
        select: {
          rank: true,
          previousRank: true,
          points: true,
          country: true,
          imageUrl: true,
        },
      },

      playerProfile: {
        select: {
          id: true,
        },
      },

      _count: {
        select: {
          artifacts: true,
          museumCollections: true,
        },
      },
    },

    orderBy: [
      {
        atpPlayer: {
          rank: "asc",
        },
      },
      {
        displayOrder: {
          sort: "asc",
          nulls: "last",
        },
      },
      {
        name: "asc",
      },
    ],

    take: safeLimit,
  });
}

export async function getAvailableAtpPlayers(
  query = "",
) {
  const normalizedQuery =
    query.trim();

  return prisma.atpPlayer.findMany({
    where: {
      active: true,

      playerId: null,

      ...(normalizedQuery
        ? {
            OR: [
              {
                name: {
                  contains:
                    normalizedQuery,
                  mode:
                    "insensitive",
                },
              },
              {
                firstName: {
                  contains:
                    normalizedQuery,
                  mode:
                    "insensitive",
                },
              },
              {
                lastName: {
                  contains:
                    normalizedQuery,
                  mode:
                    "insensitive",
                },
              },
              {
                country: {
                  contains:
                    normalizedQuery,
                  mode:
                    "insensitive",
                },
              },
              {
                countryCode: {
                  contains:
                    normalizedQuery,
                  mode:
                    "insensitive",
                },
              },
            ],
          }
        : {}),
    },

    orderBy: {
      rank: "asc",
    },

    take: 100,
  });
}