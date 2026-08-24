import { prisma } from "@/lib/prisma";

export type LegendGender = "MALE" | "FEMALE";
export type LegendStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type CreateLegendInput = {
  name: string;
  slug: string;
  gender: LegendGender;
  status?: LegendStatus;

  firstName?: string | null;
  lastName?: string | null;
  nickname?: string | null;
  nationality?: string | null;
  countryCode?: string | null;
  birthDate?: Date | null;
  birthPlace?: string | null;
  deathDate?: Date | null;
  era?: string | null;
  turnedPro?: number | null;
  retiredYear?: number | null;
  plays?: string | null;
  backhand?: string | null;

  heroImage?: string | null;
  portraitImage?: string | null;
  quote?: string | null;
  biographyShort?: string | null;
  biographyLong?: string | null;
  legacy?: string | null;

  careerHigh?: number | null;
  careerTitles?: number;
  grandSlams?: number;
  australianOpen?: number;
  rolandGarros?: number;
  wimbledon?: number;
  usOpen?: number;
  weeksAtNo1?: number;
  yearEndNo1?: number;
  olympicGold?: number;

  displayOrder?: number;
  featured?: boolean;
  publishedAt?: Date | null;

  metaTitle?: string | null;
  metaDescription?: string | null;
  canonicalUrl?: string | null;
  openGraphImage?: string | null;
  robotsIndex?: boolean;
  robotsFollow?: boolean;
};

export type UpdateLegendInput =
  Partial<CreateLegendInput>;

export type CreateLegendMilestoneInput = {
  legendId: string;
  year: number;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  featured?: boolean;
  sortOrder?: number;
};

export type UpdateLegendMilestoneInput =
  Partial<Omit<CreateLegendMilestoneInput, "legendId">>;


export type CreateLegendImageInput = {
  legendId: string;
  url: string;
  alt?: string | null;
  caption?: string | null;
  sortOrder?: number;
};

export type UpdateLegendImageInput =
  Partial<Omit<CreateLegendImageInput, "legendId">>;

export async function getLegends() {
  return prisma.legend.findMany({
    orderBy: [
      {
        gender: "asc",
      },
      {
        displayOrder: "asc",
      },
      {
        name: "asc",
      },
    ],
    include: {
      milestones: {
        orderBy: [
          {
            sortOrder: "asc",
          },
          {
            year: "asc",
          },
        ],
      },
      images: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  });
}

export async function getPublishedLegends() {
  return prisma.legend.findMany({
    where: {
      status: "PUBLISHED",
    },
    orderBy: [
      {
        gender: "asc",
      },
      {
        displayOrder: "asc",
      },
      {
        name: "asc",
      },
    ],
    include: {
      milestones: {
        orderBy: [
          {
            sortOrder: "asc",
          },
          {
            year: "asc",
          },
        ],
      },
      images: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  });
}

export async function getLegendsByGender(
  gender: LegendGender,
) {
  return prisma.legend.findMany({
    where: {
      gender,
    },
    orderBy: [
      {
        displayOrder: "asc",
      },
      {
        name: "asc",
      },
    ],
    include: {
      milestones: {
        orderBy: [
          {
            sortOrder: "asc",
          },
          {
            year: "asc",
          },
        ],
      },
      images: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  });
}

export async function getPublishedLegendsByGender(
  gender: LegendGender,
) {
  return prisma.legend.findMany({
    where: {
      gender,
      status: "PUBLISHED",
    },
    orderBy: [
      {
        displayOrder: "asc",
      },
      {
        name: "asc",
      },
    ],
    include: {
      milestones: {
        orderBy: [
          {
            sortOrder: "asc",
          },
          {
            year: "asc",
          },
        ],
      },
      images: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  });
}

export async function getLegendById(
  id: string,
) {
  return prisma.legend.findUnique({
    where: {
      id,
    },
    include: {
      milestones: {
        orderBy: [
          {
            sortOrder: "asc",
          },
          {
            year: "asc",
          },
        ],
      },
      images: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  });
}

export async function getLegendBySlug(
  slug: string,
) {
  return prisma.legend.findUnique({
    where: {
      slug,
    },
    include: {
      milestones: {
        orderBy: [
          {
            sortOrder: "asc",
          },
          {
            year: "asc",
          },
        ],
      },
      images: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  });
}

export async function createLegend(
  data: CreateLegendInput,
) {
  return prisma.legend.create({
    data: {
      name: data.name,
      slug: data.slug,
      gender: data.gender,
      status: data.status ?? "DRAFT",

      firstName: data.firstName ?? null,
      lastName: data.lastName ?? null,
      nickname: data.nickname ?? null,
      nationality: data.nationality ?? null,
      countryCode: data.countryCode ?? null,
      birthDate: data.birthDate ?? null,
      birthPlace: data.birthPlace ?? null,
      deathDate: data.deathDate ?? null,
      era: data.era ?? null,
      turnedPro: data.turnedPro ?? null,
      retiredYear: data.retiredYear ?? null,
      plays: data.plays ?? null,
      backhand: data.backhand ?? null,

      heroImage: data.heroImage ?? null,
      portraitImage: data.portraitImage ?? null,
      quote: data.quote ?? null,
      biographyShort:
        data.biographyShort ?? null,
      biographyLong:
        data.biographyLong ?? null,
      legacy: data.legacy ?? null,

      careerHigh: data.careerHigh ?? null,
      careerTitles: data.careerTitles ?? 0,
      grandSlams: data.grandSlams ?? 0,
      australianOpen:
        data.australianOpen ?? 0,
      rolandGarros:
        data.rolandGarros ?? 0,
      wimbledon: data.wimbledon ?? 0,
      usOpen: data.usOpen ?? 0,
      weeksAtNo1: data.weeksAtNo1 ?? 0,
      yearEndNo1: data.yearEndNo1 ?? 0,
      olympicGold: data.olympicGold ?? 0,

      displayOrder: data.displayOrder ?? 0,
      featured: data.featured ?? false,
      publishedAt: data.publishedAt ?? null,

      metaTitle: data.metaTitle ?? null,
      metaDescription:
        data.metaDescription ?? null,
      canonicalUrl:
        data.canonicalUrl ?? null,
      openGraphImage:
        data.openGraphImage ?? null,
      robotsIndex:
        data.robotsIndex ?? true,
      robotsFollow:
        data.robotsFollow ?? true,
    },
  });
}

export async function updateLegend(
  id: string,
  data: UpdateLegendInput,
) {
  return prisma.legend.update({
    where: {
      id,
    },
    data,
  });
}

export async function deleteLegend(
  id: string,
) {
  return prisma.legend.delete({
    where: {
      id,
    },
  });
}

export async function createLegendMilestone(
  data: CreateLegendMilestoneInput,
) {
  return prisma.legendMilestone.create({
    data: {
      legendId: data.legendId,
      year: data.year,
      title: data.title,
      subtitle: data.subtitle ?? null,
      description:
        data.description ?? null,
      imageUrl: data.imageUrl ?? null,
      featured: data.featured ?? false,
      sortOrder: data.sortOrder ?? 0,
    },
  });
}

export async function updateLegendMilestone(
  id: string,
  data: UpdateLegendMilestoneInput,
) {
  return prisma.legendMilestone.update({
    where: {
      id,
    },
    data,
  });
}

export async function deleteLegendMilestone(
  id: string,
) {
  return prisma.legendMilestone.delete({
    where: {
      id,
    },
  });
}

export async function createLegendImage(
  data: CreateLegendImageInput,
) {
  return prisma.legendImage.create({
    data: {
      legendId: data.legendId,
      url: data.url,
      alt: data.alt ?? null,
      caption: data.caption ?? null,
      sortOrder: data.sortOrder ?? 0,
    },
  });
}

export async function updateLegendImage(
  id: string,
  data: UpdateLegendImageInput,
) {
  return prisma.legendImage.update({
    where: {
      id,
    },
    data,
  });
}

export async function deleteLegendImage(
  id: string,
) {
  return prisma.legendImage.delete({
    where: {
      id,
    },
  });
}

export async function replaceLegendImages(
  legendId: string,
  images: Array<
    Omit<
      CreateLegendImageInput,
      "legendId"
    >
  >,
) {
  if (images.length > 7) {
    throw new Error(
      "A Legend gallery can contain a maximum of 7 images.",
    );
  }

  return prisma.$transaction(async (tx) => {
    await tx.legendImage.deleteMany({
      where: {
        legendId,
      },
    });

    if (images.length === 0) {
      return [];
    }

    await tx.legendImage.createMany({
      data: images.map(
        (image, index) => ({
          legendId,
          url: image.url,
          alt: image.alt ?? null,
          caption: image.caption ?? null,
          sortOrder:
            image.sortOrder ?? index,
        }),
      ),
    });

    return tx.legendImage.findMany({
      where: {
        legendId,
      },
      orderBy: {
        sortOrder: "asc",
      },
    });
  });
}

export async function replaceLegendMilestones(
  legendId: string,
  milestones: Array<
    Omit<
      CreateLegendMilestoneInput,
      "legendId"
    >
  >,
) {
  return prisma.$transaction(async (tx) => {
    await tx.legendMilestone.deleteMany({
      where: {
        legendId,
      },
    });

    if (milestones.length === 0) {
      return [];
    }

    await tx.legendMilestone.createMany({
      data: milestones.map(
        (milestone, index) => ({
          legendId,
          year: milestone.year,
          title: milestone.title,
          subtitle:
            milestone.subtitle ?? null,
          description:
            milestone.description ?? null,
          imageUrl:
            milestone.imageUrl ?? null,
          featured:
            milestone.featured ?? false,
          sortOrder:
            milestone.sortOrder ?? index,
        }),
      ),
    });

    return tx.legendMilestone.findMany({
      where: {
        legendId,
      },
      orderBy: [
        {
          sortOrder: "asc",
        },
        {
          year: "asc",
        },
      ],
    });
  });
}