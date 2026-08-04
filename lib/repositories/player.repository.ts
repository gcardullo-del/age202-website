import { prisma } from "@/lib/prisma";

export const PREMIUM_PLAYER_MAX_RANK = 50;
export const ARCHIVE_DIRECTORY_MIN_RANK =
  PREMIUM_PLAYER_MAX_RANK + 1;
export const ARCHIVE_DIRECTORY_MAX_RANK = 100;

const activePlayerOrder = [
  {
    displayOrder: "asc" as const,
  },
  {
    name: "asc" as const,
  },
];

const publishedArtifactCount = {
  _count: {
    select: {
      artifacts: {
        where: {
          status: "PUBLISHED" as const,
        },
      },
    },
  },
};

const archivePlayerInclude = {
  ...publishedArtifactCount,
  atpPlayer: true,
  playerProfile: true,
};

const featuredPlayerSlugs = [
  "roger-federer",
  "federer",
  "rafael-nadal",
  "nadal",
  "novak-djokovic",
  "djokovic",
  "jannik-sinner",
  "sinner",
  "carlos-alcaraz",
  "alcaraz",
] as const;

const featuredPlayerOrder = [
  ["roger-federer", "federer"],
  ["rafael-nadal", "nadal"],
  ["novak-djokovic", "djokovic"],
  ["jannik-sinner", "sinner"],
  ["carlos-alcaraz", "alcaraz"],
] as const;

function getFeaturedOrderIndex(
  slug: string,
): number {
  const index =
    featuredPlayerOrder.findIndex(
      (aliases) =>
        aliases.includes(slug as never),
    );

  return index === -1
    ? Number.MAX_SAFE_INTEGER
    : index;
}

export async function getFeaturedPlayers() {
  const players =
    await prisma.player.findMany({
      where: {
        active: true,

        OR: [
          {
            collectionType: "FEATURED",
          },
          {
            slug: {
              in: [
                ...featuredPlayerSlugs,
              ],
            },
          },
        ],
      },

      include: publishedArtifactCount,
    });

  return players
    .filter(
      (
        player,
        index,
        collection,
      ) =>
        collection.findIndex(
          (candidate) =>
            getFeaturedOrderIndex(
              candidate.slug,
            ) ===
            getFeaturedOrderIndex(
              player.slug,
            ),
        ) === index,
    )
    .sort((first, second) => {
      const firstIndex =
        getFeaturedOrderIndex(
          first.slug,
        );

      const secondIndex =
        getFeaturedOrderIndex(
          second.slug,
        );

      if (
        firstIndex !== secondIndex
      ) {
        return firstIndex - secondIndex;
      }

      if (
        first.displayOrder !==
        second.displayOrder
      ) {
        return (
          (first.displayOrder ??
            Number.MAX_SAFE_INTEGER) -
          (second.displayOrder ??
            Number.MAX_SAFE_INTEGER)
        );
      }

      return first.name.localeCompare(
        second.name,
      );
    })
    .slice(0, 5);
}

/*
 * Top 50:
 * vengono letti da Player perché devono
 * possedere la card Premium e la pagina
 * completa /players/[slug].
 */
export async function getPremiumPlayers() {
  return prisma.player.findMany({
    where: {
      active: true,

      atpPlayer: {
        is: {
          active: true,

          rank: {
            gte: 1,
            lte:
              PREMIUM_PLAYER_MAX_RANK,
          },
        },
      },
    },

    include: archivePlayerInclude,

    orderBy: {
      atpPlayer: {
        rank: "asc",
      },
    },
  });
}

/*
 * Posizioni 51–100:
 * vengono lette direttamente da AtpPlayer.
 *
 * Questo è fondamentale perché la classifica
 * contiene già 150 record, mentre non tutti
 * possiedono ancora un record Player.
 *
 * La relazione player resta opzionale:
 * - se esiste, il nome è cliccabile;
 * - se non esiste, la riga resta informativa.
 */
export async function getArchiveDirectory() {
  return prisma.atpPlayer.findMany({
    where: {
      active: true,

      rank: {
        gte:
          ARCHIVE_DIRECTORY_MIN_RANK,

        lte:
          ARCHIVE_DIRECTORY_MAX_RANK,
      },
    },

    orderBy: {
      rank: "asc",
    },

    include: {
      player: {
        select: {
          id: true,
          name: true,
          slug: true,
          country: true,
          biography: true,
          heroImage: true,
          portraitImage: true,
          active: true,
          collectionType: true,
          playerProfile: {
            select: {
              id: true,
            },
          },
          _count: {
            select: {
              artifacts: {
                where: {
                  status:
                    "PUBLISHED",
                },
              },
            },
          },
        },
      },
    },
  });
}

/*
 * Alias temporaneo:
 * le vecchie pagine che chiamano
 * getOtherPlayers() continuano a ricevere
 * i Top 50 Premium.
 */
export async function getOtherPlayers() {
  return getPremiumPlayers();
}

/*
 * Elenco ATP 1–100 direttamente dalla
 * classifica corrente. Utile per ricerca,
 * controlli e future directory.
 */
export async function getArchiveRanking() {
  return prisma.atpPlayer.findMany({
    where: {
      active: true,

      rank: {
        gte: 1,
        lte:
          ARCHIVE_DIRECTORY_MAX_RANK,
      },
    },

    orderBy: {
      rank: "asc",
    },

    include: {
      player: {
        select: {
          id: true,
          slug: true,
          active: true,
        },
      },
    },
  });
}

export async function getArchivePlayers() {
  return prisma.player.findMany({
    where: {
      active: true,

      atpPlayer: {
        is: {
          active: true,

          rank: {
            gte: 1,
            lte:
              ARCHIVE_DIRECTORY_MAX_RANK,
          },
        },
      },
    },

    include: archivePlayerInclude,

    orderBy: {
      atpPlayer: {
        rank: "asc",
      },
    },
  });
}

export async function getPlayerBySlug(
  slug: string,
) {
  return prisma.player.findFirst({
    where: {
      slug,
      active: true,
    },

    include: {
      atpPlayer: true,
      playerProfile: true,

      artifacts: {
        where: {
          status: "PUBLISHED",
        },

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
            publishedAt: "desc",
          },
          {
            createdAt: "desc",
          },
        ],
      },

      ...publishedArtifactCount,
    },
  });
}

export async function getAdjacentArchivePlayers(
  currentRank: number,
  currentPlayerId: string,
) {
  const [
    previousPlayer,
    nextPlayer,
  ] = await Promise.all([
    prisma.player.findFirst({
      where: {
        id: {
          not: currentPlayerId,
        },

        active: true,

        atpPlayer: {
          is: {
            active: true,

            rank: {
              lt: currentRank,
              gte: 1,
            },
          },
        },
      },

      include: {
        atpPlayer: true,
        playerProfile: true,
      },

      orderBy: {
        atpPlayer: {
          rank: "desc",
        },
      },
    }),

    prisma.player.findFirst({
      where: {
        id: {
          not: currentPlayerId,
        },

        active: true,

        atpPlayer: {
          is: {
            active: true,

            rank: {
              gt: currentRank,

              lte:
                ARCHIVE_DIRECTORY_MAX_RANK,
            },
          },
        },
      },

      include: {
        atpPlayer: true,
        playerProfile: true,
      },

      orderBy: {
        atpPlayer: {
          rank: "asc",
        },
      },
    }),
  ]);

  return {
    previousPlayer,
    nextPlayer,
  };
}

export async function searchPlayers(
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
    where: {
      active: true,

      OR: [
        {
          name: {
            contains:
              normalizedQuery,

            mode: "insensitive",
          },
        },
        {
          firstName: {
            contains:
              normalizedQuery,

            mode: "insensitive",
          },
        },
        {
          lastName: {
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
          country: {
            contains:
              normalizedQuery,

            mode: "insensitive",
          },
        },
        {
          atpPlayer: {
            is: {
              name: {
                contains:
                  normalizedQuery,

                mode: "insensitive",
              },
            },
          },
        },
      ],
    },

    include: archivePlayerInclude,

    orderBy: [
      {
        atpPlayer: {
          rank: "asc",
        },
      },
      {
        displayOrder: "asc",
      },
      {
        name: "asc",
      },
    ],

    take: safeLimit,
  });
}

export async function getAllActivePlayers() {
  return prisma.player.findMany({
    where: {
      active: true,
    },

    include: archivePlayerInclude,

    orderBy: activePlayerOrder,
  });
}
