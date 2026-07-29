import { prisma } from "@/lib/prisma";

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

function getFeaturedOrderIndex(slug: string): number {
  const index = featuredPlayerOrder.findIndex((aliases) =>
    aliases.includes(slug as never),
  );

  return index === -1 ? Number.MAX_SAFE_INTEGER : index;
}

export async function getFeaturedPlayers() {
  const players = await prisma.player.findMany({
    where: {
      active: true,
      OR: [
        {
          collectionType: "FEATURED",
        },
        {
          slug: {
            in: [...featuredPlayerSlugs],
          },
        },
      ],
    },
    include: publishedArtifactCount,
  });

  return players
    .filter(
      (player, index, collection) =>
        collection.findIndex(
          (candidate) =>
            getFeaturedOrderIndex(candidate.slug) ===
            getFeaturedOrderIndex(player.slug),
        ) === index,
    )
    .sort((first, second) => {
      const firstIndex = getFeaturedOrderIndex(first.slug);
      const secondIndex = getFeaturedOrderIndex(second.slug);

      if (firstIndex !== secondIndex) {
        return firstIndex - secondIndex;
      }

      if (first.displayOrder !== second.displayOrder) {
        return (
          (first.displayOrder ?? Number.MAX_SAFE_INTEGER) -
          (second.displayOrder ?? Number.MAX_SAFE_INTEGER)
        );
      }

      return first.name.localeCompare(second.name);
    })
    .slice(0, 5);
}

export async function getOtherPlayers() {
  return prisma.player.findMany({
    where: {
      active: true,
      atpPlayer: {
        is: {
          active: true,
          rank: {
            gte: 1,
            lte: 50,
          },
        },
      },
    },
    include: {
      ...publishedArtifactCount,
      atpPlayer: true,
    },
    orderBy: {
      atpPlayer: {
        rank: "asc",
      },
    },
  });
}

export async function getArchivePlayers() {
  return prisma.player.findMany({
    where: {
      active: true,
      collectionType: {
        in: ["FEATURED", "LEGEND", "RISING_STAR", "ARCHIVE"],
      },
    },
    include: {
      ...publishedArtifactCount,
      atpPlayer: true,
    },
    orderBy: activePlayerOrder,
  });
}

export async function getPlayerBySlug(slug: string) {
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
  const [previousPlayer, nextPlayer] = await Promise.all([
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
              lte: 50,
            },
          },
        },
      },
      include: {
        atpPlayer: true,
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

export async function getAllActivePlayers() {
  return prisma.player.findMany({
    where: {
      active: true,
    },
    include: {
      ...publishedArtifactCount,
      atpPlayer: true,
    },
    orderBy: activePlayerOrder,
  });
}
