import { prisma } from "@/lib/prisma";

type CreateOriginalProductData =
  Parameters<
    typeof prisma.originalProduct.create
  >[0]["data"];

type UpdateOriginalProductData =
  Parameters<
    typeof prisma.originalProduct.update
  >[0]["data"];


const publicOriginalProductInclude = {
  images: {
    where: {
      variantId: null,
    },

    orderBy: [
      {
        isCover: "desc" as const,
      },
      {
        sortOrder: "asc" as const,
      },
    ],
  },

  variants: {
    where: {
      active: true,
    },

    orderBy: [
      {
        isDefault: "desc" as const,
      },
      {
        sortOrder: "asc" as const,
      },
      {
        createdAt: "asc" as const,
      },
    ],

    include: {
      images: {
        orderBy: [
          {
            isCover: "desc" as const,
          },
          {
            sortOrder: "asc" as const,
          },
        ],
      },

      stock: {
        where: {
          active: true,
        },

        orderBy: {
          size: "asc" as const,
        },
      },
    },
  },
};


function normalizeLimit(
  limit: number,
  maximum: number,
): number {
  return Math.min(
    Math.max(
      Math.trunc(limit),
      1,
    ),
    maximum,
  );
}


/**
 * Crea un nuovo prodotto AGE202 Originals.
 *
 * Le immagini vengono caricate e registrate
 * separatamente tramite il repository immagini
 * e il relativo storage service.
 */
export async function createOriginalProduct(
  data: CreateOriginalProductData,
) {
  return prisma.originalProduct.create({
    data,
  });
}


/**
 * Aggiorna un prodotto AGE202 Originals.
 */
export async function updateOriginalProduct(
  id: string,
  data: UpdateOriginalProductData,
) {
  return prisma.originalProduct.update({
    where: {
      id,
    },

    data,
  });
}


/**
 * Elimina un prodotto AGE202 Originals.
 *
 * OriginalProductImage viene eliminato
 * automaticamente grazie a onDelete: Cascade.
 */
export async function deleteOriginalProduct(
  id: string,
) {
  return prisma.originalProduct.delete({
    where: {
      id,
    },
  });
}


/**
 * Restituisce tutti i prodotti Originals
 * per l'area Admin, indipendentemente dallo stato.
 */
export async function getAdminOriginalProducts() {
  return prisma.originalProduct.findMany({
    include: publicOriginalProductInclude,

    orderBy: [
      {
        featured: "desc",
      },
      {
        displayOrder: "asc",
      },
      {
        updatedAt: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
  });
}


/**
 * Restituisce un prodotto Originals tramite id.
 * Pensato per l'area Admin.
 */
export async function getOriginalProductById(
  id: string,
) {
  return prisma.originalProduct.findUnique({
    where: {
      id,
    },

    include: publicOriginalProductInclude,
  });
}


/**
 * Restituisce un prodotto Originals tramite slug
 * senza limitazioni sullo stato.
 * Pensato per l'area Admin.
 */
export async function getOriginalProductBySlug(
  slug: string,
) {
  return prisma.originalProduct.findUnique({
    where: {
      slug,
    },

    include: publicOriginalProductInclude,
  });
}


/**
 * Restituisce tutti i prodotti Originals
 * pubblicati e visibili nelle pagine pubbliche.
 */
export async function getPublishedOriginalProducts() {
  return prisma.originalProduct.findMany({
    where: {
      status: "PUBLISHED",
    },

    include: publicOriginalProductInclude,

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


/**
 * Restituisce i prodotti Originals pubblicati
 * e messi in evidenza.
 */
export async function getFeaturedOriginalProducts(
  limit = 6,
) {
  return prisma.originalProduct.findMany({
    where: {
      status: "PUBLISHED",
      featured: true,
    },

    include: publicOriginalProductInclude,

    orderBy: [
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

    take: normalizeLimit(
      limit,
      24,
    ),
  });
}


/**
 * Restituisce i prodotti pubblicati appartenenti
 * a una specifica categoria Originals.
 */
export async function getOriginalProductsByCategory(
  category:
    | "TSHIRT"
    | "POLO"
    | "HOODIE"
    | "SWEATSHIRT"
    | "CAP"
    | "BOTTLE"
    | "BAG"
    | "POSTER"
    | "ACCESSORY"
    | "OTHER",
) {
  return prisma.originalProduct.findMany({
    where: {
      status: "PUBLISHED",
      category,
    },

    include: publicOriginalProductInclude,

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


/**
 * Restituisce un singolo prodotto Originals
 * visibile pubblicamente.
 *
 * Include:
 * - gallery globale;
 * - varianti colore attive;
 * - immagini dedicate per variante;
 * - stock attivo per taglia.
 */
export async function getPublishedOriginalProductBySlug(
  slug: string,
) {
  return prisma.originalProduct.findFirst({
    where: {
      slug,
      status: "PUBLISHED",
    },

    include: publicOriginalProductInclude,
  });
}


/**
 * Restituisce prodotti correlati della stessa
 * categoria, escludendo il prodotto corrente.
 */
export async function getRelatedOriginalProducts({
  productId,
  category,
  limit = 4,
}: {
  productId: string;

  category:
    | "TSHIRT"
    | "POLO"
    | "HOODIE"
    | "SWEATSHIRT"
    | "CAP"
    | "BOTTLE"
    | "BAG"
    | "POSTER"
    | "ACCESSORY"
    | "OTHER";

  limit?: number;
}) {
  return prisma.originalProduct.findMany({
    where: {
      id: {
        not: productId,
      },

      category,
      status: "PUBLISHED",
    },

    include: publicOriginalProductInclude,

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

    take: normalizeLimit(
      limit,
      12,
    ),
  });
}


/**
 * Restituisce gli slug dei prodotti Originals
 * pubblicati per generateStaticParams().
 */
export async function getPublishedOriginalProductSlugs() {
  return prisma.originalProduct.findMany({
    where: {
      status: "PUBLISHED",
    },

    select: {
      slug: true,
    },

    orderBy: {
      createdAt: "asc",
    },
  });
}


/**
 * Restituisce i contatori principali
 * per la dashboard Admin Originals.
 */
export async function getOriginalProductStatistics() {
  const [
    total,
    published,
    draft,
    archived,
    available,
    sold,
    comingSoon,
    featured,
  ] = await Promise.all([
    prisma.originalProduct.count(),

    prisma.originalProduct.count({
      where: {
        status: "PUBLISHED",
      },
    }),

    prisma.originalProduct.count({
      where: {
        status: "DRAFT",
      },
    }),

    prisma.originalProduct.count({
      where: {
        status: "ARCHIVED",
      },
    }),

    prisma.originalProduct.count({
      where: {
        availability: "AVAILABLE",
      },
    }),

    prisma.originalProduct.count({
      where: {
        availability: "SOLD",
      },
    }),

    prisma.originalProduct.count({
      where: {
        availability: "COMING_SOON",
      },
    }),

    prisma.originalProduct.count({
      where: {
        featured: true,
      },
    }),
  ]);

  return {
    total,
    published,
    draft,
    archived,
    available,
    sold,
    comingSoon,
    featured,
  };
}