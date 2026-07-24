import { prisma } from "@/lib/prisma";

export type MuseumStatistics = {
  artifacts: number;
  players: number;
  brands: number;
  certificates: number;

  verifiedCertificates: number;
  unverifiedCertificates: number;

  authenticArtifacts: number;
  vintageArtifacts: number;
  certifiedArtifacts: number;
  uncertifiedArtifacts: number;

  artifactsByAvailability: Record<string, number>;
  artifactsByRarity: Record<string, number>;
  artifactsByCategory: Record<string, number>;
};

function normalizeGroupKey(
  value: string | null,
  fallback: string,
): string {
  const normalizedValue = value?.trim();

  return normalizedValue
    ? normalizedValue
    : fallback;
}


function getGroupCount(value: unknown): number {
  if (typeof value !== "object" || value === null || !("_all" in value)) {
    return 0;
  }

  const count = (value as { _all?: unknown })._all;

  return typeof count === "number" ? count : 0;
}

export async function getMuseumStatistics(): Promise<MuseumStatistics> {
  const [
    artifacts,
    players,
    brands,
    certificates,

    verifiedCertificates,

    authenticArtifacts,
    vintageArtifacts,
    certifiedArtifacts,

    availabilityGroups,
    rarityGroups,
    categoryGroups,
  ] = await prisma.$transaction([
    prisma.artifact.count(),

    prisma.player.count(),

    prisma.brand.count(),

    prisma.certificate.count(),

    prisma.certificate.count({
      where: {
        verified: true,
      },
    }),

    prisma.artifact.count({
      where: {
        authentic: true,
      },
    }),

    prisma.artifact.count({
      where: {
        vintage: true,
      },
    }),

    prisma.artifact.count({
      where: {
        certificate: {
          isNot: null,
        },
      },
    }),

    prisma.artifact.groupBy({
      by: ["availability"],
      orderBy: {
        availability: "asc",
      },
      _count: {
        _all: true,
      },
    }),

    prisma.artifact.groupBy({
      by: ["rarity"],
      orderBy: {
        rarity: "asc",
      },
      _count: {
        _all: true,
      },
    }),

    prisma.artifact.groupBy({
      by: ["category"],
      orderBy: {
        category: "asc",
      },
      _count: {
        _all: true,
      },
    }),
  ]);

  const artifactsByAvailability =
    availabilityGroups.reduce<Record<string, number>>(
      (result, group) => {
        const key = normalizeGroupKey(
          group.availability,
          "UNSPECIFIED",
        );

        result[key] = getGroupCount(group._count);

        return result;
      },
      {},
    );

  const artifactsByRarity =
    rarityGroups.reduce<Record<string, number>>(
      (result, group) => {
        const key = normalizeGroupKey(
          group.rarity,
          "UNSPECIFIED",
        );

        result[key] = getGroupCount(group._count);

        return result;
      },
      {},
    );

  const artifactsByCategory =
    categoryGroups.reduce<Record<string, number>>(
      (result, group) => {
        const key = normalizeGroupKey(
          group.category,
          "UNSPECIFIED",
        );

        result[key] = getGroupCount(group._count);

        return result;
      },
      {},
    );

  return {
    artifacts,
    players,
    brands,
    certificates,

    verifiedCertificates,
    unverifiedCertificates:
      certificates - verifiedCertificates,

    authenticArtifacts,
    vintageArtifacts,
    certifiedArtifacts,
    uncertifiedArtifacts:
      artifacts - certifiedArtifacts,

    artifactsByAvailability,
    artifactsByRarity,
    artifactsByCategory,
  };
}

export async function getArtifactsCount(): Promise<number> {
  return prisma.artifact.count();
}

export async function getPlayersCount(): Promise<number> {
  return prisma.player.count();
}

export async function getBrandsCount(): Promise<number> {
  return prisma.brand.count();
}

export async function getCertificatesCount(): Promise<number> {
  return prisma.certificate.count();
}

export async function getVerifiedCertificatesCount(): Promise<number> {
  return prisma.certificate.count({
    where: {
      verified: true,
    },
  });
}

export async function getVintageArtifactsCount(): Promise<number> {
  return prisma.artifact.count({
    where: {
      vintage: true,
    },
  });
}

export async function getAuthenticArtifactsCount(): Promise<number> {
  return prisma.artifact.count({
    where: {
      authentic: true,
    },
  });
}

export async function getCertifiedArtifactsCount(): Promise<number> {
  return prisma.artifact.count({
    where: {
      certificate: {
        isNot: null,
      },
    },
  });
}