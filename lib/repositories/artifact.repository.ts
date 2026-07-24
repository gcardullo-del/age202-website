import type {
  ArtifactAvailability,
  ArtifactCategory,
  ArtifactCondition,
  ArtifactRarity,
  ArtifactStatus,
  Prisma,
} from "@/generated/prisma/client";

import { prisma } from "@/lib/prisma";

const artifactRelations = {
  player: true,
  brand: true,
  images: {
    orderBy: {
      sortOrder: "asc",
    },
  },
} satisfies Prisma.ArtifactInclude;

const publishedArtifactWhere = {
  status: "PUBLISHED",
} satisfies Prisma.ArtifactWhereInput;

export type CreateArtifactData = {
  archiveNumber: string;
  title: string;
  subtitle?: string;

  slug: string;

  description?: string;
  museumStory?: string;
  historicalContext?: string;
  curatorNote?: string;

  year?: number;
  season?: string;
  tournament?: string;
  collection?: string;
  edition?: string;

  category?: ArtifactCategory;
  rarity?: ArtifactRarity;

  size?: string;
  colour?: string;
  material?: string;

  condition: ArtifactCondition;

  availability?: ArtifactAvailability;
  price?: number | string;
  currency?: string;
  vintedUrl?: string;

  authentic?: boolean;
  authenticityCode?: string;
  vintage?: boolean;
  tags?: string[];

  status?: ArtifactStatus;
  featured?: boolean;

  playerId: string;
  brandId: string;
};

export type UpdateArtifactData =
  Partial<CreateArtifactData>;

export async function getArtifacts() {
  return prisma.artifact.findMany({
    include: artifactRelations,
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getArtifactById(
  id: string,
) {
  return prisma.artifact.findUnique({
    where: {
      id,
    },
    include: artifactRelations,
  });
}

export async function getArtifactBySlug(
  slug: string,
) {
  return prisma.artifact.findUnique({
    where: {
      slug,
    },
    include: artifactRelations,
  });
}

export async function getArtifactByArchiveNumber(
  archiveNumber: string,
) {
  return prisma.artifact.findUnique({
    where: {
      archiveNumber,
    },
    include: artifactRelations,
  });
}

export async function getPublishedArtifacts() {
  return prisma.artifact.findMany({
    where: publishedArtifactWhere,
    include: artifactRelations,
    orderBy: [
      {
        featured: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
  });
}

export async function getPublishedArtifactBySlug(
  slug: string,
) {
  return prisma.artifact.findFirst({
    where: {
      ...publishedArtifactWhere,
      slug,
    },
    include: artifactRelations,
  });
}

export async function getRelatedPublishedArtifacts(
  artifactId: string,
  playerId: string,
  brandId: string,
  limit = 4,
) {
  return prisma.artifact.findMany({
    where: {
      ...publishedArtifactWhere,

      id: {
        not: artifactId,
      },

      OR: [
        {
          playerId,
        },
        {
          brandId,
        },
      ],
    },

    include: artifactRelations,

    orderBy: [
      {
        featured: "desc",
      },
      {
        createdAt: "desc",
      },
    ],

    take: Math.max(
      1,
      Math.min(limit, 12),
    ),
  });
}

export async function createArtifact(
  data: CreateArtifactData,
) {
  return prisma.artifact.create({
    data: {
      archiveNumber: data.archiveNumber,

      title: data.title,
      subtitle: data.subtitle,

      slug: data.slug,

      description: data.description,
      museumStory: data.museumStory,
      historicalContext:
        data.historicalContext,
      curatorNote: data.curatorNote,

      year: data.year,
      season: data.season,
      tournament: data.tournament,
      collection: data.collection,
      edition: data.edition,

      category: data.category,

      rarity:
        data.rarity ?? "COMMON",

      size: data.size,
      colour: data.colour,
      material: data.material,

      condition: data.condition,

      availability:
        data.availability ??
        "COMING_SOON",

      price: data.price,

      currency:
        data.currency ?? "EUR",

      vintedUrl: data.vintedUrl,

      authentic:
        data.authentic ?? false,

      authenticityCode:
        data.authenticityCode,

      vintage:
        data.vintage ?? false,

      tags:
        data.tags ?? [],

      status:
        data.status ?? "DRAFT",

      featured:
        data.featured ?? false,

      player: {
        connect: {
          id: data.playerId,
        },
      },

      brand: {
        connect: {
          id: data.brandId,
        },
      },
    },

    include: artifactRelations,
  });
}

export async function updateArtifact(
  id: string,
  data: UpdateArtifactData,
) {
  const {
    playerId,
    brandId,
    ...artifactData
  } = data;

  return prisma.artifact.update({
    where: {
      id,
    },

    data: {
      ...artifactData,

      ...(playerId
        ? {
            player: {
              connect: {
                id: playerId,
              },
            },
          }
        : {}),

      ...(brandId
        ? {
            brand: {
              connect: {
                id: brandId,
              },
            },
          }
        : {}),
    },

    include: artifactRelations,
  });
}

export async function deleteArtifact(
  id: string,
) {
  return prisma.artifact.delete({
    where: {
      id,
    },
  });
}

export async function searchArtifacts(
  query: string,
) {
  const q = query.trim();

  if (!q) {
    return getArtifacts();
  }

  return prisma.artifact.findMany({
    where: {
      OR: [
        {
          title: {
            contains: q,
            mode: "insensitive",
          },
        },

        {
          subtitle: {
            contains: q,
            mode: "insensitive",
          },
        },

        {
          archiveNumber: {
            contains: q,
            mode: "insensitive",
          },
        },

        {
          description: {
            contains: q,
            mode: "insensitive",
          },
        },

        {
          museumStory: {
            contains: q,
            mode: "insensitive",
          },
        },

        {
          historicalContext: {
            contains: q,
            mode: "insensitive",
          },
        },

        {
          tournament: {
            contains: q,
            mode: "insensitive",
          },
        },

        {
          collection: {
            contains: q,
            mode: "insensitive",
          },
        },

        {
          vintedUrl: {
            contains: q,
            mode: "insensitive",
          },
        },

        {
          authenticityCode: {
            contains: q,
            mode: "insensitive",
          },
        },

        {
          player: {
            name: {
              contains: q,
              mode: "insensitive",
            },
          },
        },

        {
          brand: {
            name: {
              contains: q,
              mode: "insensitive",
            },
          },
        },
      ],
    },

    include: artifactRelations,

    orderBy: {
      createdAt: "desc",
    },
  });
}