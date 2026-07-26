import { prisma } from "@/lib/prisma";

const rankingOrder = [
  {
    rank: "asc" as const,
  },
];

export type AtpPlayerImportData = {
  rank: number;
  previousRank: number | null;

  name: string;
  firstName?: string | null;
  lastName?: string | null;
  slug: string;

  country: string;
  countryCode: string;

  points: number;
  age?: number | null;

  imageUrl?: string | null;

  rankingDate: Date;
  source: string;
};

export async function getAtpRanking(limit = 150) {
  const safeLimit = Math.min(Math.max(limit, 1), 150);

  return prisma.atpPlayer.findMany({
    where: {
      active: true,
    },
    orderBy: rankingOrder,
    take: safeLimit,
    include: {
      player: true,
    },
  });
}

export async function getAtpPlayerBySlug(slug: string) {
  return prisma.atpPlayer.findFirst({
    where: {
      slug,
      active: true,
    },
    include: {
      player: true,
    },
  });
}

export async function getAtpPlayerByRank(rank: number) {
  return prisma.atpPlayer.findFirst({
    where: {
      rank,
      active: true,
    },
    include: {
      player: true,
    },
  });
}

export async function getLinkedAtpPlayers() {
  return prisma.atpPlayer.findMany({
    where: {
      active: true,
      playerId: {
        not: null,
      },
    },
    orderBy: rankingOrder,
    include: {
      player: true,
    },
  });
}

export async function getStoredAtpPlayers() {
  return prisma.atpPlayer.findMany({
    select: {
      id: true,
      slug: true,
      rank: true,
      playerId: true,
    },
  });
}

export async function replaceAtpRanking(
  players: AtpPlayerImportData[],
) {
  return prisma.$transaction(async (transaction) => {
    /*
     * I giocatori non presenti nel nuovo aggiornamento vengono
     * disattivati, senza cancellarli definitivamente.
     */
    await transaction.atpPlayer.updateMany({
      data: {
        active: false,
      },
    });

    for (const player of players) {
      await transaction.atpPlayer.upsert({
        where: {
          slug: player.slug,
        },
        create: {
          rank: player.rank,
          previousRank: player.previousRank,

          name: player.name,
          firstName: player.firstName ?? null,
          lastName: player.lastName ?? null,
          slug: player.slug,

          country: player.country,
          countryCode: player.countryCode,

          points: player.points,
          age: player.age ?? null,

          imageUrl: player.imageUrl ?? null,

          rankingDate: player.rankingDate,
          source: player.source,
          active: true,
        },
        update: {
          rank: player.rank,
          previousRank: player.previousRank,

          name: player.name,
          firstName: player.firstName ?? null,
          lastName: player.lastName ?? null,

          country: player.country,
          countryCode: player.countryCode,

          points: player.points,
          age: player.age ?? null,

          imageUrl: player.imageUrl ?? null,

          rankingDate: player.rankingDate,
          source: player.source,
          active: true,
        },
      });
    }

    return transaction.atpPlayer.findMany({
      where: {
        active: true,
      },
      orderBy: rankingOrder,
      include: {
        player: true,
      },
    });
  });
}