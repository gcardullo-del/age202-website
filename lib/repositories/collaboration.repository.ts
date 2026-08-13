import {
  CollaborationPartnerType,
  CollaborationProjectType,
  MuseumPageStatus,
  Prisma,
  type Collaboration,
  type MediaAsset,
} from "@/generated/prisma/client";

import { prisma } from "@/lib/prisma";


/* =========================================================
 * TYPES
 * ======================================================= */

export type CollaborationWithMedia =
  Collaboration & {
    media: MediaAsset | null;
  };


export type CollaborationFilters = {
  query?: string;
  partnerType?: CollaborationPartnerType;
  projectType?: CollaborationProjectType;
  status?: MuseumPageStatus;
  featured?: boolean;
  year?: number;
  mediaId?: string | null;
};


export type CreateCollaborationInput = {
  slug: string;
  sortOrder?: number;

  eyebrow?: string | null;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  story?: string | null;

  partnerName: string;
  partnerType: CollaborationPartnerType;
  location?: string | null;
  year?: number | null;
  period?: string | null;

  projectTitle?: string | null;
  projectType?: CollaborationProjectType | null;
  outcome?: string | null;

  websiteUrl?: string | null;
  href?: string | null;

  imageUrl?: string | null;
  mediaId?: string | null;

  featured?: boolean;
  status?: MuseumPageStatus;
  publishedAt?: Date | null;
};


export type UpdateCollaborationInput = {
  slug?: string;
  sortOrder?: number;

  eyebrow?: string | null;
  title?: string;
  subtitle?: string | null;
  description?: string | null;
  story?: string | null;

  partnerName?: string;
  partnerType?: CollaborationPartnerType;
  location?: string | null;
  year?: number | null;
  period?: string | null;

  projectTitle?: string | null;
  projectType?: CollaborationProjectType | null;
  outcome?: string | null;

  websiteUrl?: string | null;
  href?: string | null;

  imageUrl?: string | null;
  mediaId?: string | null;

  featured?: boolean;
  status?: MuseumPageStatus;
  publishedAt?: Date | null;
};


/* =========================================================
 * PRISMA CONFIG
 * ======================================================= */

const collaborationInclude = {
  media: true,
} satisfies Prisma.CollaborationInclude;


const collaborationOrder = [
  {
    sortOrder: "asc" as const,
  },
  {
    year: "desc" as const,
  },
  {
    createdAt: "asc" as const,
  },
];


/* =========================================================
 * HELPERS
 * ======================================================= */

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


function normalizeSortOrder(
  sortOrder:
    | number
    | undefined,
): number {
  return Math.trunc(
    sortOrder ?? 0,
  );
}


function normalizeNullableYear(
  year:
    | number
    | null
    | undefined,
): number | null {
  if (
    year === null ||
    year === undefined
  ) {
    return null;
  }

  return Math.trunc(year);
}


function buildCollaborationWhere(
  filters:
    CollaborationFilters = {},
): Prisma.CollaborationWhereInput {
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
              story: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              partnerName: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              location: {
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
              projectTitle: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              outcome: {
                contains: query,
                mode: "insensitive",
              },
            },
          ],
        }
      : {}),

    ...(filters.partnerType
      ? {
          partnerType:
            filters.partnerType,
        }
      : {}),

    ...(filters.projectType
      ? {
          projectType:
            filters.projectType,
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
            Math.trunc(
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


/* =========================================================
 * READ
 * ======================================================= */

/**
 * Restituisce tutte le collaborazioni.
 *
 * Usato principalmente dal CMS Admin.
 */
export async function getAllCollaborations(
  filters:
    CollaborationFilters = {},
): Promise<
  CollaborationWithMedia[]
> {
  return prisma.collaboration.findMany(
    {
      where:
        buildCollaborationWhere(
          filters,
        ),

      include:
        collaborationInclude,

      orderBy:
        collaborationOrder,
    },
  );
}


/**
 * Restituisce soltanto le collaborazioni pubblicate
 * destinate alla pagina pubblica Collaborations.
 */
export async function getPublishedCollaborations(): Promise<
  CollaborationWithMedia[]
> {
  return prisma.collaboration.findMany(
    {
      where: {
        status:
          MuseumPageStatus.PUBLISHED,
      },

      include:
        collaborationInclude,

      orderBy:
        collaborationOrder,
    },
  );
}


/**
 * Restituisce una collaborazione tramite id.
 */
export async function getCollaborationById(
  id: string,
): Promise<
  CollaborationWithMedia | null
> {
  const normalizedId =
    normalizeText(id);

  if (!normalizedId) {
    return null;
  }

  return prisma.collaboration.findUnique(
    {
      where: {
        id:
          normalizedId,
      },

      include:
        collaborationInclude,
    },
  );
}


/**
 * Restituisce una collaborazione tramite slug.
 */
export async function getCollaborationBySlug(
  slug: string,
): Promise<
  CollaborationWithMedia | null
> {
  const normalizedSlug =
    normalizeSlug(slug);

  if (!normalizedSlug) {
    return null;
  }

  return prisma.collaboration.findUnique(
    {
      where: {
        slug:
          normalizedSlug,
      },

      include:
        collaborationInclude,
    },
  );
}


/* =========================================================
 * CREATE
 * ======================================================= */

export async function createCollaboration(
  input:
    CreateCollaborationInput,
): Promise<
  CollaborationWithMedia
> {
  const slug =
    normalizeSlug(
      input.slug,
    );

  if (!slug) {
    throw new Error(
      "Collaboration slug is required.",
    );
  }


  const title =
    normalizeText(
      input.title,
    );

  if (!title) {
    throw new Error(
      "Collaboration title is required.",
    );
  }


  const partnerName =
    normalizeText(
      input.partnerName,
    );

  if (!partnerName) {
    throw new Error(
      "Collaboration partner name is required.",
    );
  }


  return prisma.collaboration.create(
    {
      data: {
        slug,
        sortOrder:
          normalizeSortOrder(
            input.sortOrder,
          ),

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
        story:
          normalizeNullableText(
            input.story,
          ),

        partnerName,
        partnerType:
          input.partnerType,
        location:
          normalizeNullableText(
            input.location,
          ),
        year:
          normalizeNullableYear(
            input.year,
          ),
        period:
          normalizeNullableText(
            input.period,
          ),

        projectTitle:
          normalizeNullableText(
            input.projectTitle,
          ),
        projectType:
          input.projectType ??
          null,
        outcome:
          normalizeNullableText(
            input.outcome,
          ),

        websiteUrl:
          normalizeNullableText(
            input.websiteUrl,
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
        collaborationInclude,
    },
  );
}


/* =========================================================
 * UPDATE
 * ======================================================= */

export async function updateCollaboration(
  id: string,
  input:
    UpdateCollaborationInput,
): Promise<
  CollaborationWithMedia
> {
  return prisma.collaboration.update(
    {
      where: {
        id,
      },

      data: {
        ...(input.slug !==
        undefined
          ? {
              slug:
                normalizeSlug(
                  input.slug,
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

        ...(input.story !==
        undefined
          ? {
              story:
                normalizeNullableText(
                  input.story,
                ),
            }
          : {}),

        ...(input.partnerName !==
        undefined
          ? {
              partnerName:
                input.partnerName.trim(),
            }
          : {}),

        ...(input.partnerType !==
        undefined
          ? {
              partnerType:
                input.partnerType,
            }
          : {}),

        ...(input.location !==
        undefined
          ? {
              location:
                normalizeNullableText(
                  input.location,
                ),
            }
          : {}),

        ...(input.year !==
        undefined
          ? {
              year:
                normalizeNullableYear(
                  input.year,
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

        ...(input.projectTitle !==
        undefined
          ? {
              projectTitle:
                normalizeNullableText(
                  input.projectTitle,
                ),
            }
          : {}),

        ...(input.projectType !==
        undefined
          ? {
              projectType:
                input.projectType,
            }
          : {}),

        ...(input.outcome !==
        undefined
          ? {
              outcome:
                normalizeNullableText(
                  input.outcome,
                ),
            }
          : {}),

        ...(input.websiteUrl !==
        undefined
          ? {
              websiteUrl:
                normalizeNullableText(
                  input.websiteUrl,
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
        collaborationInclude,
    },
  );
}


/* =========================================================
 * DELETE
 * ======================================================= */

export async function deleteCollaboration(
  id: string,
): Promise<
  Collaboration
> {
  return prisma.collaboration.delete(
    {
      where: {
        id,
      },
    },
  );
}


/* =========================================================
 * PUBLICATION
 * ======================================================= */

export async function publishCollaboration(
  id: string,
): Promise<
  CollaborationWithMedia
> {
  return prisma.collaboration.update(
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
        collaborationInclude,
    },
  );
}


export async function unpublishCollaboration(
  id: string,
): Promise<
  CollaborationWithMedia
> {
  return prisma.collaboration.update(
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
        collaborationInclude,
    },
  );
}


/* =========================================================
 * SORT ORDER
 * ======================================================= */

export async function setCollaborationSortOrder(
  id: string,
  sortOrder: number,
): Promise<
  CollaborationWithMedia
> {
  return prisma.collaboration.update(
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
        collaborationInclude,
    },
  );
}


/* =========================================================
 * STATISTICS
 * ======================================================= */

export async function getCollaborationStatistics() {
  const [
    total,
    published,
    draft,
    archived,
    featured,
    tennisBrands,
    clubsEvents,
    creativeStudios,
    collectors,
    withMedia,
  ] =
    await Promise.all([
      prisma.collaboration.count(),

      prisma.collaboration.count(
        {
          where: {
            status:
              MuseumPageStatus.PUBLISHED,
          },
        },
      ),

      prisma.collaboration.count(
        {
          where: {
            status:
              MuseumPageStatus.DRAFT,
          },
        },
      ),

      prisma.collaboration.count(
        {
          where: {
            status:
              MuseumPageStatus.ARCHIVED,
          },
        },
      ),

      prisma.collaboration.count(
        {
          where: {
            featured:
              true,
          },
        },
      ),

      prisma.collaboration.count(
        {
          where: {
            partnerType:
              CollaborationPartnerType.TENNIS_BRAND,
          },
        },
      ),

      prisma.collaboration.count(
        {
          where: {
            partnerType:
              CollaborationPartnerType.CLUB_EVENT,
          },
        },
      ),

      prisma.collaboration.count(
        {
          where: {
            partnerType:
              CollaborationPartnerType.CREATIVE_STUDIO,
          },
        },
      ),

      prisma.collaboration.count(
        {
          where: {
            partnerType:
              CollaborationPartnerType.COLLECTOR,
          },
        },
      ),

      prisma.collaboration.count(
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
    featured,
    tennisBrands,
    clubsEvents,
    creativeStudios,
    collectors,
    withMedia,
  };
}