import { prisma } from "@/lib/prisma";

export async function getAdminDashboardData() {
  const [
    playersCount,
    brandsCount,
    artifactsCount,
    publishedArtifactsCount,
    draftArtifactsCount,
    latestArtifacts,
  ] = await Promise.all([
    prisma.player.count(),
    prisma.brand.count(),
    prisma.artifact.count(),

    prisma.artifact.count({
      where: {
        status: "PUBLISHED",
      },
    }),

    prisma.artifact.count({
      where: {
        status: "DRAFT",
      },
    }),

    prisma.artifact.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
        slug: true,
        archiveNumber: true,
        status: true,
        availability: true,
        createdAt: true,

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
      },
    }),
  ]);

  return {
    playersCount,
    brandsCount,
    artifactsCount,
    publishedArtifactsCount,
    draftArtifactsCount,
    latestArtifacts,
  };
}