import {
  MuseumPageStatus,
  Prisma,
  TennisHistoryEntryType,
  TennisHistoryEra,
  TennisHistoryGender,
  type MediaAsset,
  type TennisHistoryEntry,
} from "@/generated/prisma/client";

import { prisma } from "@/lib/prisma";


export type TennisHistoryEntryWithMedia =
  TennisHistoryEntry & {
    media: MediaAsset | null;
  };


export type TennisHistoryFilters = {
  query?: string;
  type?: TennisHistoryEntryType;
  era?: TennisHistoryEra;
  gender?: TennisHistoryGender;
  status?: MuseumPageStatus;
  featured?: boolean;
  year?: number;
  mediaId?: string | null;
};


export type CreateTennisHistoryEntryInput = {
  type: TennisHistoryEntryType;
  slug: string;
  year: number;
  sortOrder?: number;
  era: TennisHistoryEra;
  gender?: TennisHistoryGender | null;

  eyebrow?: string | null;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  quote?: string | null;
  achievement?: string | null;
  period?: string | null;

  country?: string | null;
  countryCode?: string | null;

  playerOne?: string | null;
  playerTwo?: string | null;
  players?: string[];

  href?: string | null;

  imageUrl?: string | null;
  mediaId?: string | null;

  featured?: boolean;
  status?: MuseumPageStatus;
  publishedAt?: Date | null;
};


export type UpdateTennisHistoryEntryInput = {
  type?: TennisHistoryEntryType;
  slug?: string;
  year?: number;
  sortOrder?: number;
  era?: TennisHistoryEra;
  gender?: TennisHistoryGender | null;

  eyebrow?: string | null;
  title?: string;
  subtitle?: string | null;
  description?: string | null;
  quote?: string | null;
  achievement?: string | null;
  period?: string | null;

  country?: string | null;
  countryCode?: string | null;

  playerOne?: string | null;
  playerTwo?: string | null;
  players?: string[];

  href?: string | null;

  imageUrl?: string | null;
  mediaId?: string | null;

  featured?: boolean;
  status?: MuseumPageStatus;
  publishedAt?: Date | null;
};


const tennisHistoryInclude = {
  media: true,
} satisfies Prisma.TennisHistoryEntryInclude;


const tennisHistoryOrder = [
  {
    year: "asc" as const,
  },
  {
    sortOrder: "asc" as const,
  },
  {
    createdAt: "asc" as const,
  },
];


function normalizeText(
  value: string | null | undefined,
): string | undefined {
  const normalized =
    value?.trim();

  return normalized || undefined;
}


function normalizeNullableText(
  value: string | null | undefined,
): string | null {
  return (
    normalizeText(value) ??
    null
  );
}


function normalizeSlug(
  value: string,
): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}


function normalizeCountryCode(
  value: string | null | undefined,
): string | null {
  const normalized =
    normalizeText(value);

  return normalized
    ? normalized.toUpperCase()
    : null;
}


function normalizePlayers(
  players: string[] | undefined,
): string[] {
  if (!players) {
    return [];
  }

  return Array.from(
    new Set(
      players
        .map((player) =>
          player.trim(),
        )
        .filter(Boolean),
    ),
  );
}


function normalizeYear(
  year: number,
): number {
  return Math.trunc(year);
}


function normalizeSortOrder(
  sortOrder:
    | number
    | undefined,
): number {
  return Math.trunc(
    sortOrder ?? 0,
  );
}


function buildTennisHistoryWhere(
  filters:
    TennisHistoryFilters = {},
): Prisma.TennisHistoryEntryWhereInput {
  const query =
    normalizeText(
      filters.query,
    );

  return {
    ...(query
      ? {
          OR: [
            {
              slug: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              eyebrow: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              title: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              subtitle: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              description: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              quote: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              achievement: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              period: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              country: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              countryCode: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              playerOne: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              playerTwo: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              players: {
                has: query,
              },
            },
          ],
        }
      : {}),

    ...(filters.type
      ? {
          type: filters.type,
        }
      : {}),

    ...(filters.era
      ? {
          era: filters.era,
        }
      : {}),

    ...(filters.gender
      ? {
          gender:
            filters.gender,
        }
      : {}),

    ...(filters.status
      ? {
          status:
            filters.status,
        }
      : {}),

    ...(typeof filters.featured ===
    "boolean"
      ? {
          featured:
            filters.featured,
        }
      : {}),

    ...(typeof filters.year ===
    "number"
      ? {
          year:
            normalizeYear(
              filters.year,
            ),
        }
      : {}),

    ...(filters.mediaId === null
      ? {
          mediaId: null,
        }
      : filters.mediaId
        ? {
            mediaId:
              filters.mediaId,
          }
        : {}),
  };
}


/**
 * Restituisce tutte le entry Tennis History.
 *
 * Usato principalmente dal CMS Admin.
 */
export async function getAllTennisHistoryEntries(
  filters:
    TennisHistoryFilters = {},
): Promise<
  TennisHistoryEntryWithMedia[]
> {
  return prisma.tennisHistoryEntry.findMany(
    {
      where:
        buildTennisHistoryWhere(
          filters,
        ),

      include:
        tennisHistoryInclude,

      orderBy:
        tennisHistoryOrder,
    },
  );
}


/**
 * Restituisce tutte le entry pubblicate
 * destinate alla pagina pubblica.
 */
export async function getPublishedTennisHistoryEntries(): Promise<
  TennisHistoryEntryWithMedia[]
> {
  return prisma.tennisHistoryEntry.findMany(
    {
      where: {
        status:
          MuseumPageStatus.PUBLISHED,
      },

      include:
        tennisHistoryInclude,

      orderBy:
        tennisHistoryOrder,
    },
  );
}


/**
 * Restituisce una entry tramite id.
 */
export async function getTennisHistoryEntryById(
  id: string,
): Promise<
  TennisHistoryEntryWithMedia | null
> {
  const normalizedId =
    normalizeText(id);

  if (!normalizedId) {
    return null;
  }

  return prisma.tennisHistoryEntry.findUnique(
    {
      where: {
        id:
          normalizedId,
      },

      include:
        tennisHistoryInclude,
    },
  );
}


/**
 * Restituisce una entry tramite slug.
 */
export async function getTennisHistoryEntryBySlug(
  slug: string,
): Promise<
  TennisHistoryEntryWithMedia | null
> {
  const normalizedSlug =
    normalizeSlug(slug);

  if (!normalizedSlug) {
    return null;
  }

  return prisma.tennisHistoryEntry.findUnique(
    {
      where: {
        slug:
          normalizedSlug,
      },

      include:
        tennisHistoryInclude,
    },
  );
}


/**
 * Crea una nuova entry Tennis History.
 */
export async function createTennisHistoryEntry(
  input:
    CreateTennisHistoryEntryInput,
): Promise<
  TennisHistoryEntryWithMedia
> {
  const slug =
    normalizeSlug(
      input.slug,
    );

  if (!slug) {
    throw new Error(
      "Tennis History slug is required.",
    );
  }

  const title =
    normalizeText(
      input.title,
    );

  if (!title) {
    throw new Error(
      "Tennis History title is required.",
    );
  }

  return prisma.tennisHistoryEntry.create(
    {
      data: {
        type:
          input.type,
        slug,
        year:
          normalizeYear(
            input.year,
          ),
        sortOrder:
          normalizeSortOrder(
            input.sortOrder,
          ),
        era:
          input.era,
        gender:
          input.gender ??
          null,

        eyebrow:
          normalizeNullableText(
            input.eyebrow,
          ),
        title,
        subtitle:
          normalizeNullableText(
            input.subtitle,
          ),
        description:
          normalizeNullableText(
            input.description,
          ),
        quote:
          normalizeNullableText(
            input.quote,
          ),
        achievement:
          normalizeNullableText(
            input.achievement,
          ),
        period:
          normalizeNullableText(
            input.period,
          ),

        country:
          normalizeNullableText(
            input.country,
          ),
        countryCode:
          normalizeCountryCode(
            input.countryCode,
          ),

        playerOne:
          normalizeNullableText(
            input.playerOne,
          ),
        playerTwo:
          normalizeNullableText(
            input.playerTwo,
          ),
        players:
          normalizePlayers(
            input.players,
          ),

        href:
          normalizeNullableText(
            input.href,
          ),

        imageUrl:
          normalizeNullableText(
            input.imageUrl,
          ),
        mediaId:
          normalizeNullableText(
            input.mediaId,
          ),

        featured:
          input.featured ??
          false,
        status:
          input.status ??
          MuseumPageStatus.DRAFT,
        publishedAt:
          input.publishedAt ??
          null,
      },

      include:
        tennisHistoryInclude,
    },
  );
}


/**
 * Aggiorna una entry Tennis History.
 */
export async function updateTennisHistoryEntry(
  id: string,
  input:
    UpdateTennisHistoryEntryInput,
): Promise<
  TennisHistoryEntryWithMedia
> {
  return prisma.tennisHistoryEntry.update(
    {
      where: {
        id,
      },

      data: {
        ...(input.type !==
        undefined
          ? {
              type:
                input.type,
            }
          : {}),

        ...(input.slug !==
        undefined
          ? {
              slug:
                normalizeSlug(
                  input.slug,
                ),
            }
          : {}),

        ...(input.year !==
        undefined
          ? {
              year:
                normalizeYear(
                  input.year,
                ),
            }
          : {}),

        ...(input.sortOrder !==
        undefined
          ? {
              sortOrder:
                normalizeSortOrder(
                  input.sortOrder,
                ),
            }
          : {}),

        ...(input.era !==
        undefined
          ? {
              era:
                input.era,
            }
          : {}),

        ...(input.gender !==
        undefined
          ? {
              gender:
                input.gender,
            }
          : {}),

        ...(input.eyebrow !==
        undefined
          ? {
              eyebrow:
                normalizeNullableText(
                  input.eyebrow,
                ),
            }
          : {}),

        ...(input.title !==
        undefined
          ? {
              title:
                input.title.trim(),
            }
          : {}),

        ...(input.subtitle !==
        undefined
          ? {
              subtitle:
                normalizeNullableText(
                  input.subtitle,
                ),
            }
          : {}),

        ...(input.description !==
        undefined
          ? {
              description:
                normalizeNullableText(
                  input.description,
                ),
            }
          : {}),

        ...(input.quote !==
        undefined
          ? {
              quote:
                normalizeNullableText(
                  input.quote,
                ),
            }
          : {}),

        ...(input.achievement !==
        undefined
          ? {
              achievement:
                normalizeNullableText(
                  input.achievement,
                ),
            }
          : {}),

        ...(input.period !==
        undefined
          ? {
              period:
                normalizeNullableText(
                  input.period,
                ),
            }
          : {}),

        ...(input.country !==
        undefined
          ? {
              country:
                normalizeNullableText(
                  input.country,
                ),
            }
          : {}),

        ...(input.countryCode !==
        undefined
          ? {
              countryCode:
                normalizeCountryCode(
                  input.countryCode,
                ),
            }
          : {}),

        ...(input.playerOne !==
        undefined
          ? {
              playerOne:
                normalizeNullableText(
                  input.playerOne,
                ),
            }
          : {}),

        ...(input.playerTwo !==
        undefined
          ? {
              playerTwo:
                normalizeNullableText(
                  input.playerTwo,
                ),
            }
          : {}),

        ...(input.players !==
        undefined
          ? {
              players:
                normalizePlayers(
                  input.players,
                ),
            }
          : {}),

        ...(input.href !==
        undefined
          ? {
              href:
                normalizeNullableText(
                  input.href,
                ),
            }
          : {}),

        ...(input.imageUrl !==
        undefined
          ? {
              imageUrl:
                normalizeNullableText(
                  input.imageUrl,
                ),
            }
          : {}),

        ...(input.mediaId !==
        undefined
          ? {
              mediaId:
                normalizeNullableText(
                  input.mediaId,
                ),
            }
          : {}),

        ...(input.featured !==
        undefined
          ? {
              featured:
                input.featured,
            }
          : {}),

        ...(input.status !==
        undefined
          ? {
              status:
                input.status,
            }
          : {}),

        ...(input.publishedAt !==
        undefined
          ? {
              publishedAt:
                input.publishedAt,
            }
          : {}),
      },

      include:
        tennisHistoryInclude,
    },
  );
}


/**
 * Elimina una entry Tennis History.
 *
 * L'eventuale MediaAsset collegato non viene
 * eliminato: rimane disponibile nella Media Library.
 */
export async function deleteTennisHistoryEntry(
  id: string,
): Promise<
  TennisHistoryEntry
> {
  return prisma.tennisHistoryEntry.delete(
    {
      where: {
        id,
      },
    },
  );
}


/**
 * Pubblica una entry.
 */
export async function publishTennisHistoryEntry(
  id: string,
): Promise<
  TennisHistoryEntryWithMedia
> {
  return prisma.tennisHistoryEntry.update(
    {
      where: {
        id,
      },

      data: {
        status:
          MuseumPageStatus.PUBLISHED,
        publishedAt:
          new Date(),
      },

      include:
        tennisHistoryInclude,
    },
  );
}


/**
 * Riporta una entry in bozza.
 */
export async function unpublishTennisHistoryEntry(
  id: string,
): Promise<
  TennisHistoryEntryWithMedia
> {
  return prisma.tennisHistoryEntry.update(
    {
      where: {
        id,
      },

      data: {
        status:
          MuseumPageStatus.DRAFT,
        publishedAt:
          null,
      },

      include:
        tennisHistoryInclude,
    },
  );
}


/**
 * Imposta l'ordine di visualizzazione
 * di una singola entry.
 */
export async function setTennisHistorySortOrder(
  id: string,
  sortOrder: number,
): Promise<
  TennisHistoryEntryWithMedia
> {
  return prisma.tennisHistoryEntry.update(
    {
      where: {
        id,
      },

      data: {
        sortOrder:
          normalizeSortOrder(
            sortOrder,
          ),
      },

      include:
        tennisHistoryInclude,
    },
  );
}


/**
 * Restituisce le principali statistiche
 * del CMS Tennis History.
 */
export async function getTennisHistoryStatistics() {
  const [
    total,
    published,
    draft,
    archived,
    milestones,
    legends,
    rivalries,
    generations,
    withMedia,
  ] =
    await Promise.all([
      prisma.tennisHistoryEntry.count(),

      prisma.tennisHistoryEntry.count(
        {
          where: {
            status:
              MuseumPageStatus.PUBLISHED,
          },
        },
      ),

      prisma.tennisHistoryEntry.count(
        {
          where: {
            status:
              MuseumPageStatus.DRAFT,
          },
        },
      ),

      prisma.tennisHistoryEntry.count(
        {
          where: {
            status:
              MuseumPageStatus.ARCHIVED,
          },
        },
      ),

      prisma.tennisHistoryEntry.count(
        {
          where: {
            type:
              TennisHistoryEntryType.MILESTONE,
          },
        },
      ),

      prisma.tennisHistoryEntry.count(
        {
          where: {
            type:
              TennisHistoryEntryType.LEGEND,
          },
        },
      ),

      prisma.tennisHistoryEntry.count(
        {
          where: {
            type:
              TennisHistoryEntryType.RIVALRY,
          },
        },
      ),

      prisma.tennisHistoryEntry.count(
        {
          where: {
            type:
              TennisHistoryEntryType.GENERATION,
          },
        },
      ),

      prisma.tennisHistoryEntry.count(
        {
          where: {
            mediaId: {
              not: null,
            },
          },
        },
      ),
    ]);

  return {
    total,
    published,
    draft,
    archived,
    milestones,
    legends,
    rivalries,
    generations,
    withMedia,
  };
}