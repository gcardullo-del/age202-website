import { prisma } from "@/lib/prisma";

export async function getHomepagePlayerOptions() {
  return prisma.player.findMany({
    where: {
      active: true,
    },

    select: {
      id: true,
      name: true,
      slug: true,
      nickname: true,
      country: true,
      heroImage: true,
      portraitImage: true,
      accent: true,
      collectionType: true,
      displayOrder: true,
    },

    orderBy: [
      {
        displayOrder: "asc",
      },
      {
        name: "asc",
      },
    ],
  });
}