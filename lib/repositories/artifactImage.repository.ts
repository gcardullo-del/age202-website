import { prisma } from "@/lib/prisma";

export async function getArtifactImages(
  artifactId: string,
) {
  return prisma.artifactImage.findMany({
    where: {
      artifactId,
    },
    orderBy: {
      sortOrder: "asc",
    },
  });
}

export async function createArtifactImage(data: {
  artifactId: string;
  url: string;
  alt?: string;
  isCover?: boolean;
  sortOrder?: number;
}) {
  return prisma.artifactImage.create({
    data: {
      artifactId: data.artifactId,
      url: data.url,
      alt: data.alt,
      isCover: data.isCover ?? false,
      sortOrder: data.sortOrder ?? 0,
    },
  });
}

export async function deleteArtifactImage(
  id: string,
) {
  return prisma.artifactImage.delete({
    where: {
      id,
    },
  });
}

export async function updateArtifactImage(
  id: string,
  data: {
    alt?: string;
    sortOrder?: number;
    isCover?: boolean;
  },
) {
  return prisma.artifactImage.update({
    where: {
      id,
    },
    data,
  });
}

export async function setCoverImage(
  artifactId: string,
  imageId: string,
) {
  await prisma.$transaction([
    prisma.artifactImage.updateMany({
      where: {
        artifactId,
      },
      data: {
        isCover: false,
      },
    }),

    prisma.artifactImage.update({
      where: {
        id: imageId,
      },
      data: {
        isCover: true,
      },
    }),
  ]);
}