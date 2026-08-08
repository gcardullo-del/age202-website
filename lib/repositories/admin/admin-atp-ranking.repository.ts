import { prisma } from "@/lib/prisma";

export type AdminAtpRankingFilters = {
  query?: string;
  active?: boolean;
};

function normalize(
  value: string | undefined,
): string {
  return value?.trim() ?? "";
}

/**
 * Restituisce la classifica ATP amministrativa.
 *
 * La pagina pubblica AGE202 mostra esclusivamente
 * i primi 150 giocatori.
 */
export async function getAdminAtpRanking(
  filters: AdminAtpRankingFilters = {},
) {
  const query = normalize(
    filters.query,
  );

  return prisma.atpPlayer.findMany({
    where: {
      rank: {
        lte: 150,
      },

      ...(typeof filters.active ===
      "boolean"
        ? {
            active:
              filters.active,
          }
        : {}),

      ...(query
        ? {
            OR: [
              {
                name: {
                  contains:
                    query,
                  mode: "insensitive",
                },
              },
              {
                firstName: {
                  contains:
                    query,
                  mode: "insensitive",
                },
              },
              {
                lastName: {
                  contains:
                    query,
                  mode: "insensitive",
                },
              },
              {
                slug: {
                  contains:
                    query,
                  mode: "insensitive",
                },
              },
              {
                country: {
                  contains:
                    query,
                  mode: "insensitive",
                },
              },
              {
                countryCode: {
                  contains:
                    query,
                  mode: "insensitive",
                },
              },
            ],
          }
        : {}),
    },

    include: {
      player: {
        select: {
          id: true,
          name: true,
          slug: true,
          active: true,
          collectionType: true,
        },
      },
    },

    orderBy: [
      {
        rank: "asc",
      },
      {
        name: "asc",
      },
    ],

    take: 150,
  });
}

/**
 * Restituisce un singolo record ATP tramite ID.
 *
 * Verrà utilizzato dalla futura pagina Edit Ranking.
 */
export async function getAdminAtpPlayer(
  atpPlayerId: string,
) {
  const normalizedId =
    atpPlayerId.trim();

  if (!normalizedId) {
    return null;
  }

  return prisma.atpPlayer.findUnique({
    where: {
      id: normalizedId,
    },

    include: {
      player: {
        select: {
          id: true,
          name: true,
          slug: true,
          active: true,
          collectionType: true,
        },
      },
    },
  });
}

/**
 * Statistiche principali utilizzate nella dashboard
 * amministrativa ATP Ranking.
 */
export async function getAdminAtpRankingStats() {
  const [
    top150,
    active,
    linkedPlayers,
    top50LinkedPlayers,
  ] = await Promise.all([
    prisma.atpPlayer.count({
      where: {
        rank: {
          lte: 150,
        },
      },
    }),

    prisma.atpPlayer.count({
      where: {
        rank: {
          lte: 150,
        },
        active: true,
      },
    }),

    prisma.atpPlayer.count({
      where: {
        rank: {
          lte: 150,
        },
        playerId: {
          not: null,
        },
      },
    }),

    prisma.atpPlayer.count({
      where: {
        rank: {
          lte: 50,
        },
        playerId: {
          not: null,
        },
      },
    }),
  ]);

  return {
    top150,
    active,
    linkedPlayers,
    top50LinkedPlayers,
  };
}