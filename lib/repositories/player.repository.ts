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

export async function getFeaturedPlayers() {
  return prisma.player.findMany({
    where: {
      active: true,
      collectionType: "FEATURED",
    },
    include: publishedArtifactCount,
    orderBy: activePlayerOrder,
  });
}

export async function getOtherPlayers() {
  return prisma.player.findMany({
    where: {
      active: true,
      collectionType: {
        in: [
          "LEGEND",
          "RISING_STAR",
          "ARCHIVE",
        ],
      },
    },
    include: publishedArtifactCount,
    orderBy: activePlayerOrder,
  });
}

export async function getArchivePlayers() {
  return prisma.player.findMany({
    where: {
      active: true,
      collectionType: {
        in: [
          "FEATURED",
          "LEGEND",
          "RISING_STAR",
          "ARCHIVE",
        ],
      },
    },
    include: publishedArtifactCount,
    orderBy: activePlayerOrder,
  });
}

export async function getPlayerBySlug(slug: string) {
  return prisma.player.findFirst({
    where: {
      slug,
      active: true,
    },
    include: publishedArtifactCount,
  });
}

export async function getAllActivePlayers() {
  return prisma.player.findMany({
    where: {
      active: true,
    },
    include: publishedArtifactCount,
    orderBy: activePlayerOrder,
  });
}