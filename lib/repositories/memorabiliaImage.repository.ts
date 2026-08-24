import { prisma } from "@/lib/prisma";

export async function getMemorabiliaImages(
  memorabiliaId: string,
) {
  return prisma.memorabiliaImage.findMany({
    where: {
      memorabiliaId,
    },

    orderBy: {
      sortOrder: "asc",
    },
  });
}

export async function createMemorabiliaImage(data: {
  memorabiliaId: string;
  url: string;
  alt?: string;
  isCover?: boolean;
  sortOrder?: number;
}) {
  return prisma.memorabiliaImage.create({
    data: {
      memorabiliaId:
        data.memorabiliaId,

      url:
        data.url,

      alt:
        data.alt,

      isCover:
        data.isCover ??
        false,

      sortOrder:
        data.sortOrder ??
        0,
    },
  });
}

export async function deleteMemorabiliaImage(
  id: string,
) {
  return prisma.memorabiliaImage.delete({
    where: {
      id,
    },
  });
}

export async function updateMemorabiliaImage(
  id: string,
  data: {
    alt?: string;
    sortOrder?: number;
    isCover?: boolean;
  },
) {
  return prisma.memorabiliaImage.update({
    where: {
      id,
    },

    data,
  });
}

export async function setMemorabiliaCoverImage(
  memorabiliaId: string,
  imageId: string,
) {
  await prisma.$transaction([
    prisma.memorabiliaImage.updateMany({
      where: {
        memorabiliaId,
      },

      data: {
        isCover: false,
      },
    }),

    prisma.memorabiliaImage.update({
      where: {
        id: imageId,
      },

      data: {
        isCover: true,
      },
    }),
  ]);
}
