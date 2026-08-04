import type {
  MediaAsset,
  MediaFolder,
  Prisma,
} from "@/generated/prisma/client";

import { prisma } from "@/lib/prisma";

export type MediaAssetWithFolder =
  MediaAsset & {
    folder: MediaFolder | null;
  };

export type MediaLibraryFilters = {
  query?: string;
  folderId?: string | null;
  mimeType?: string;
  extension?: string;
  isUsed?: boolean;
  tags?: string[];
};

export type CreateMediaAssetInput = {
  title: string;
  alt?: string | null;
  originalName: string;
  url: string;
  mimeType: string;
  extension: string;
  size: number;
  width?: number | null;
  height?: number | null;
  tags?: string[];
  folderId?: string | null;
  isUsed?: boolean;
};

export type UpdateMediaAssetInput = {
  title?: string;
  alt?: string | null;
  folderId?: string | null;
  tags?: string[];
  isUsed?: boolean;
};

export type CreateMediaFolderInput = {
  name: string;
  slug: string;
  description?: string | null;
};

export type UpdateMediaFolderInput = {
  name?: string;
  slug?: string;
  description?: string | null;
};

function normalizeText(
  value: string | undefined | null,
): string | undefined {
  const normalized = value?.trim();

  return normalized || undefined;
}

function normalizeTags(
  tags: string[] | undefined,
): string[] {
  if (!tags) {
    return [];
  }

  return Array.from(
    new Set(
      tags
        .map((tag) => tag.trim())
        .filter(Boolean),
    ),
  );
}

function normalizeExtension(
  extension: string,
): string {
  return extension
    .trim()
    .toLowerCase()
    .replace(/^\./, "");
}

function buildMediaWhere(
  filters: MediaLibraryFilters = {},
): Prisma.MediaAssetWhereInput {
  const query = normalizeText(
    filters.query,
  );

  const mimeType = normalizeText(
    filters.mimeType,
  );

  const extension = normalizeText(
    filters.extension,
  );

  const tags = normalizeTags(
    filters.tags,
  );

  return {
    ...(query
      ? {
          OR: [
            {
              title: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              alt: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              originalName: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              extension: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              tags: {
                has: query,
              },
            },
          ],
        }
      : {}),

    ...(filters.folderId === null
      ? {
          folderId: null,
        }
      : filters.folderId
        ? {
            folderId:
              filters.folderId,
          }
        : {}),

    ...(mimeType
      ? {
          mimeType: {
            startsWith: mimeType,
            mode: "insensitive",
          },
        }
      : {}),

    ...(extension
      ? {
          extension:
            normalizeExtension(
              extension,
            ),
        }
      : {}),

    ...(typeof filters.isUsed ===
    "boolean"
      ? {
          isUsed:
            filters.isUsed,
        }
      : {}),

    ...(tags.length > 0
      ? {
          tags: {
            hasEvery: tags,
          },
        }
      : {}),
  };
}

/**
 * Restituisce tutti gli asset della Media Library.
 */
export async function getAllMedia(
  filters: MediaLibraryFilters = {},
): Promise<
  MediaAssetWithFolder[]
> {
  return prisma.mediaAsset.findMany({
    where: buildMediaWhere(filters),

    include: {
      folder: true,
    },

    orderBy: [
      {
        createdAt: "desc",
      },
      {
        title: "asc",
      },
    ],
  });
}

/**
 * Restituisce un asset tramite id.
 */
export async function getMediaById(
  id: string,
): Promise<
  MediaAssetWithFolder | null
> {
  return prisma.mediaAsset.findUnique({
    where: {
      id,
    },

    include: {
      folder: true,
    },
  });
}

/**
 * Restituisce un asset tramite URL.
 */
export async function getMediaByUrl(
  url: string,
): Promise<
  MediaAssetWithFolder | null
> {
  return prisma.mediaAsset.findFirst({
    where: {
      url,
    },

    include: {
      folder: true,
    },
  });
}

/**
 * Crea un nuovo asset nella Media Library.
 */
export async function createMedia(
  input: CreateMediaAssetInput,
): Promise<
  MediaAssetWithFolder
> {
  return prisma.mediaAsset.create({
    data: {
      title: input.title.trim(),
      alt:
        normalizeText(input.alt) ??
        null,
      originalName:
        input.originalName.trim(),
      url: input.url.trim(),
      mimeType:
        input.mimeType.trim(),
      extension:
        normalizeExtension(
          input.extension,
        ),
      size: Math.max(
        0,
        Math.trunc(input.size),
      ),
      width:
        input.width === null ||
        input.width === undefined
          ? null
          : Math.max(
              0,
              Math.trunc(
                input.width,
              ),
            ),
      height:
        input.height === null ||
        input.height === undefined
          ? null
          : Math.max(
              0,
              Math.trunc(
                input.height,
              ),
            ),
      tags: normalizeTags(
        input.tags,
      ),
      folderId:
        normalizeText(
          input.folderId,
        ) ?? null,
      isUsed:
        input.isUsed ?? false,
    },

    include: {
      folder: true,
    },
  });
}

/**
 * Aggiorna i metadati di un asset.
 */
export async function updateMedia(
  id: string,
  input: UpdateMediaAssetInput,
): Promise<
  MediaAssetWithFolder
> {
  return prisma.mediaAsset.update({
    where: {
      id,
    },

    data: {
      ...(input.title !==
      undefined
        ? {
            title:
              input.title.trim(),
          }
        : {}),

      ...(input.alt !== undefined
        ? {
            alt:
              normalizeText(
                input.alt,
              ) ?? null,
          }
        : {}),

      ...(input.folderId !==
      undefined
        ? {
            folderId:
              normalizeText(
                input.folderId,
              ) ?? null,
          }
        : {}),

      ...(input.tags !== undefined
        ? {
            tags:
              normalizeTags(
                input.tags,
              ),
          }
        : {}),

      ...(input.isUsed !==
      undefined
        ? {
            isUsed:
              input.isUsed,
          }
        : {}),
    },

    include: {
      folder: true,
    },
  });
}

/**
 * Elimina il record dal database.
 *
 * La rimozione fisica dal bucket Supabase
 * va eseguita dal service/action chiamante.
 */
export async function deleteMedia(
  id: string,
): Promise<MediaAsset> {
  return prisma.mediaAsset.delete({
    where: {
      id,
    },
  });
}

/**
 * Ricerca asset nella Media Library.
 */
export async function searchMedia(
  query: string,
  filters: Omit<
    MediaLibraryFilters,
    "query"
  > = {},
): Promise<
  MediaAssetWithFolder[]
> {
  return getAllMedia({
    ...filters,
    query,
  });
}

/**
 * Restituisce gli asset non ancora utilizzati.
 */
export async function getUnusedMedia(): Promise<
  MediaAssetWithFolder[]
> {
  return getAllMedia({
    isUsed: false,
  });
}

/**
 * Restituisce gli asset utilizzati.
 */
export async function getUsedMedia(): Promise<
  MediaAssetWithFolder[]
> {
  return getAllMedia({
    isUsed: true,
  });
}

/**
 * Restituisce gli asset di una cartella.
 */
export async function getMediaByFolder(
  folderId: string,
): Promise<
  MediaAssetWithFolder[]
> {
  return getAllMedia({
    folderId,
  });
}

/**
 * Contrassegna un asset come utilizzato.
 */
export async function markAsUsed(
  id: string,
): Promise<
  MediaAssetWithFolder
> {
  return updateMedia(id, {
    isUsed: true,
  });
}

/**
 * Contrassegna un asset come non utilizzato.
 */
export async function markAsUnused(
  id: string,
): Promise<
  MediaAssetWithFolder
> {
  return updateMedia(id, {
    isUsed: false,
  });
}

/**
 * Imposta lo stato di utilizzo di più asset.
 */
export async function setMediaUsage(
  ids: string[],
  isUsed: boolean,
): Promise<number> {
  const normalizedIds =
    Array.from(
      new Set(
        ids
          .map((id) => id.trim())
          .filter(Boolean),
      ),
    );

  if (
    normalizedIds.length === 0
  ) {
    return 0;
  }

  const result =
    await prisma.mediaAsset.updateMany(
      {
        where: {
          id: {
            in: normalizedIds,
          },
        },

        data: {
          isUsed,
        },
      },
    );

  return result.count;
}

/**
 * Restituisce tutte le cartelle Media.
 */
export async function getMediaFolders() {
  return prisma.mediaFolder.findMany({
    include: {
      _count: {
        select: {
          assets: true,
        },
      },
    },

    orderBy: {
      name: "asc",
    },
  });
}

/**
 * Restituisce una cartella tramite id.
 */
export async function getMediaFolderById(
  id: string,
) {
  return prisma.mediaFolder.findUnique({
    where: {
      id,
    },

    include: {
      _count: {
        select: {
          assets: true,
        },
      },
    },
  });
}

/**
 * Restituisce una cartella tramite slug.
 */
export async function getMediaFolderBySlug(
  slug: string,
) {
  return prisma.mediaFolder.findUnique({
    where: {
      slug,
    },

    include: {
      _count: {
        select: {
          assets: true,
        },
      },
    },
  });
}

/**
 * Crea una nuova cartella Media.
 */
export async function createMediaFolder(
  input: CreateMediaFolderInput,
) {
  return prisma.mediaFolder.create({
    data: {
      name: input.name.trim(),
      slug: input.slug.trim(),
      description:
        normalizeText(
          input.description,
        ) ?? null,
    },
  });
}

/**
 * Aggiorna una cartella Media.
 */
export async function updateMediaFolder(
  id: string,
  input: UpdateMediaFolderInput,
) {
  return prisma.mediaFolder.update({
    where: {
      id,
    },

    data: {
      ...(input.name !== undefined
        ? {
            name:
              input.name.trim(),
          }
        : {}),

      ...(input.slug !== undefined
        ? {
            slug:
              input.slug.trim(),
          }
        : {}),

      ...(input.description !==
      undefined
        ? {
            description:
              normalizeText(
                input.description,
              ) ?? null,
          }
        : {}),
    },
  });
}

/**
 * Elimina una cartella.
 *
 * Gli asset collegati mantengono il record
 * ma vengono spostati fuori dalla cartella.
 */
export async function deleteMediaFolder(
  id: string,
) {
  return prisma.$transaction(
    async (transaction) => {
      await transaction.mediaAsset.updateMany(
        {
          where: {
            folderId: id,
          },

          data: {
            folderId: null,
          },
        },
      );

      return transaction.mediaFolder.delete(
        {
          where: {
            id,
          },
        },
      );
    },
  );
}

/**
 * Restituisce le statistiche principali
 * della Media Library.
 */
export async function getMediaStatistics() {
  const [
    total,
    used,
    unused,
    images,
    folders,
  ] = await Promise.all([
    prisma.mediaAsset.count(),

    prisma.mediaAsset.count({
      where: {
        isUsed: true,
      },
    }),

    prisma.mediaAsset.count({
      where: {
        isUsed: false,
      },
    }),

    prisma.mediaAsset.count({
      where: {
        mimeType: {
          startsWith: "image/",
        },
      },
    }),

    prisma.mediaFolder.count(),
  ]);

  const sizeAggregation =
    await prisma.mediaAsset.aggregate(
      {
        _sum: {
          size: true,
        },
      },
    );

  return {
    total,
    used,
    unused,
    images,
    folders,
    totalSize:
      sizeAggregation._sum.size ??
      0,
  };
}