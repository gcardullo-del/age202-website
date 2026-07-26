import { prisma } from "@/lib/prisma";

type CreateArtifactData =
  Parameters<typeof prisma.artifact.create>[0]["data"];

const publicArtifactInclude = {
  player: true,
  brand: true,
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
  certificate: true,
};

/**
 * Crea un nuovo reperto.
 *
 * Le immagini vengono caricate e registrate separatamente
 * attraverso ArtifactImageRepository e ArtifactStorageService.
 */
export async function createArtifact(
  data: CreateArtifactData,
) {
  return prisma.artifact.create({
    data,
  });
}

/**
 * Elimina un reperto dal database.
 *
 * ArtifactImage e Certificate vengono eliminati automaticamente
 * grazie alle relazioni Prisma configurate con onDelete: Cascade.
 */
export async function deleteArtifact(
  id: string,
) {
  return prisma.artifact.delete({
    where: {
      id,
    },
  });
}

/**
 * Restituisce i reperti pubblicati e messi in evidenza.
 */
export async function getFeaturedArtifacts(
  limit = 6,
) {
  return prisma.artifact.findMany({
    where: {
      featured: true,
      status: "PUBLISHED",
    },
    include: publicArtifactInclude,
    orderBy: [
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

/**
 * Restituisce i reperti pubblicati appartenenti
 * a un giocatore attivo.
 */
export async function getArtifactsByPlayerSlug(
  playerSlug: string,
) {
  return prisma.artifact.findMany({
    where: {
      status: "PUBLISHED",
      player: {
        slug: playerSlug,
        active: true,
      },
    },
    include: publicArtifactInclude,
    orderBy: [
      {
        featured: "desc",
      },
      {
        year: "desc",
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
 * Restituisce un reperto tramite slug senza applicare
 * restrizioni sullo stato.
 *
 * Questa funzione può essere utilizzata dall'area Admin.
 */
export async function getArtifactBySlug(
  slug: string,
) {
  return prisma.artifact.findUnique({
    where: {
      slug,
    },
    include: publicArtifactInclude,
  });
}

/**
 * Restituisce un singolo reperto visibile pubblicamente.
 *
 * Le bozze e i reperti archiviati non vengono restituiti.
 * Anche il giocatore collegato deve essere attivo.
 */
export async function getPublishedArtifactBySlug(
  slug: string,
) {
  return prisma.artifact.findFirst({
    where: {
      slug,
      status: "PUBLISHED",
      player: {
        active: true,
      },
    },
    include: publicArtifactInclude,
  });
}

/**
 * Restituisce reperti correlati appartenenti allo stesso
 * giocatore del reperto corrente.
 */
export async function getRelatedArtifacts({
  artifactId,
  playerId,
  limit = 3,
}: {
  artifactId: string;
  playerId: string;
  limit?: number;
}) {
  return prisma.artifact.findMany({
    where: {
      id: {
        not: artifactId,
      },
      playerId,
      status: "PUBLISHED",
    },
    include: publicArtifactInclude,
    orderBy: [
      {
        featured: "desc",
      },
      {
        year: "desc",
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

/**
 * Restituisce gli slug di tutti i reperti pubblicati.
 *
 * Verrà utilizzata da generateStaticParams() nella pagina
 * pubblica /artifacts/[slug].
 */
export async function getPublishedArtifactSlugs() {
  return prisma.artifact.findMany({
    where: {
      status: "PUBLISHED",
      player: {
        active: true,
      },
    },
    select: {
      slug: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}