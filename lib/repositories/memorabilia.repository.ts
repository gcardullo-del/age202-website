import { prisma } from "@/lib/prisma";

export async function getPublishedMemorabiliaSlugs() {
  return prisma.memorabilia.findMany({
    where: {
      status: "PUBLISHED",
    },

    select: {
      slug: true,
    },

    orderBy: [
      {
        featured: "desc",
      },
      {
        displayOrder: "asc",
      },
      {
        publishedAt: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
  });
}

export async function getPublishedMemorabiliaBySlug(
  slug: string,
) {
  return prisma.memorabilia.findFirst({
    where: {
      slug,
      status: "PUBLISHED",
    },

    include: {
      player: {
        select: {
          id: true,
          name: true,
          slug: true,
          country: true,
        },
      },

      images: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  });
}

export async function getRelatedMemorabilia({
  memorabiliaId,
  playerId,
  type,
  limit = 3,
}: {
  memorabiliaId: string;
  playerId?: string | null;
  type?: string | null;
  limit?: number;
}) {
  return prisma.memorabilia.findMany({
    where: {
      id: {
        not: memorabiliaId,
      },

      status: "PUBLISHED",

      OR: [
        ...(playerId
          ? [
              {
                playerId,
              },
            ]
          : []),

        ...(type
          ? [
              {
                type: type as never,
              },
            ]
          : []),
      ],
    },

    include: {
      player: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },

      images: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },

    orderBy: [
      {
        featured: "desc",
      },
      {
        displayOrder: "asc",
      },
      {
        publishedAt: "desc",
      },
      {
        createdAt: "desc",
      },
    ],

    take: limit,
  });
}
