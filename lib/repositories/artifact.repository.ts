import { prisma } from "@/lib/prisma";

type CreateArtifactData =
  Parameters<
    typeof prisma.artifact.create
  >[0]["data"];

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
 * Restituisce tutti i reperti pubblicati destinati
 * alle pagine pubbliche, incluso lo Shop.
 */
export async function getPublishedArtifacts() {
  return prisma.artifact.findMany({
    where: {
      status: "PUBLISHED",

      player: {
        active: true,
      },
    },

    include:
      publicArtifactInclude,

    orderBy: [
      {
        featured: "desc",
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
 * Restituisce gli ultimi reperti pubblicati.
 *
 * Questa query alimenta la sezione Latest Museum Pieces
 * della homepage e privilegia esclusivamente la data
 * di pubblicazione, senza dare priorità a featured.
 */
export async function getLatestArtifacts(
  limit = 6,
) {
  return prisma.artifact.findMany({
    where: {
      status: "PUBLISHED",

      player: {
        active: true,
      },
    },

    include:
      publicArtifactInclude,

    orderBy: [
      {
        publishedAt: "desc",
      },
      {
        createdAt: "desc",
      },
    ],

    take: Math.max(
      1,
      Math.min(
        Math.trunc(limit),
        12,
      ),
    ),
  });
}

/**
 * Restituisce i reperti pubblicati
 * attualmente disponibili per l'acquisizione.
 *
 * Questa query alimenta la sezione
 * "Available to Collect" della homepage.
 *
 * L'ordine privilegia:
 * 1. reperti featured;
 * 2. pubblicazione più recente;
 * 3. creazione più recente.
 */
export async function getAvailableArtifacts(
  limit = 3,
) {
  return prisma.artifact.findMany({
    where: {
      status: "PUBLISHED",

      availability:
        "AVAILABLE",

      player: {
        active: true,
      },
    },

    include:
      publicArtifactInclude,

    orderBy: [
      {
        featured: "desc",
      },
      {
        publishedAt: "desc",
      },
      {
        createdAt: "desc",
      },
    ],

    take: Math.max(
      1,
      Math.min(
        Math.trunc(limit),
        12,
      ),
    ),
  });
}

/**
 * Restituisce i reperti recentemente acquisiti
 * da collezioni private.
 *
 * Per la prima versione utilizziamo `updatedAt`
 * come riferimento temporale, perché Artifact
 * non possiede ancora un campo `soldAt`.
 *
 * Questa query alimenta la sezione
 * "Recently Acquired" della homepage.
 */
export async function getRecentlyAcquiredArtifacts(
  limit = 3,
) {
  return prisma.artifact.findMany({
    where: {
      status: "PUBLISHED",

      availability:
        "SOLD",

      player: {
        active: true,
      },
    },

    include:
      publicArtifactInclude,

    orderBy: [
      {
        updatedAt: "desc",
      },
      {
        publishedAt: "desc",
      },
      {
        createdAt: "desc",
      },
    ],

    take: Math.max(
      1,
      Math.min(
        Math.trunc(limit),
        12,
      ),
    ),
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

      player: {
        active: true,
      },
    },

    include:
      publicArtifactInclude,

    orderBy: [
      {
        publishedAt: "desc",
      },
      {
        createdAt: "desc",
      },
    ],

    take: Math.max(
      1,
      Math.min(
        Math.trunc(limit),
        24,
      ),
    ),
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
        slug:
          playerSlug,

        active:
          true,
      },
    },

    include:
      publicArtifactInclude,

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
 * Restituisce i reperti pubblicati collegati
 * direttamente a uno specifico torneo tramite
 * la relazione Prisma Artifact -> Tournament.
 *
 * Questa è la query principale utilizzata
 * dalle pagine pubbliche dei tornei.
 */
export async function getArtifactsByTournamentId(
  tournamentId: string,
  limit = 12,
) {
  const normalizedTournamentId =
    tournamentId.trim();

  if (!normalizedTournamentId) {
    return [];
  }

  return prisma.artifact.findMany({
    where: {
      status: "PUBLISHED",

      player: {
        active: true,
      },

      tournamentId:
        normalizedTournamentId,
    },

    include:
      publicArtifactInclude,

    orderBy: [
      {
        availability: "asc",
      },
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

    take: Math.max(
      1,
      Math.min(
        Math.trunc(limit),
        24,
      ),
    ),
  });
}

/**
 * Compatibilità con i reperti più vecchi.
 *
 * Cerca i reperti utilizzando il vecchio campo
 * testuale `tournament`.
 *
 * Questa funzione viene mantenuta durante
 * la migrazione verso la relazione Prisma
 * Artifact -> Tournament.
 */
export async function getArtifactsByTournamentNames(
  tournamentNames: string[],
  limit = 12,
) {
  const normalizedNames =
    Array.from(
      new Set(
        tournamentNames
          .map((name) =>
            name.trim(),
          )
          .filter(
            (name) =>
              name.length > 0,
          ),
      ),
    );

  if (
    normalizedNames.length === 0
  ) {
    return [];
  }

  return prisma.artifact.findMany({
    where: {
      status: "PUBLISHED",

      player: {
        active: true,
      },

      OR: normalizedNames.map(
        (name) => ({
          tournament: {
            equals: name,
            mode: "insensitive",
          },
        }),
      ),
    },

    include:
      publicArtifactInclude,

    orderBy: [
      {
        availability: "asc",
      },
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

    take: Math.max(
      1,
      Math.min(
        Math.trunc(limit),
        24,
      ),
    ),
  });
}

/**
 * Restituisce un reperto tramite ID senza applicare
 * restrizioni sullo stato.
 *
 * Questa funzione è destinata all'area Admin e alle Dashboard.
 */
export async function getArtifactById(
  artifactId: string,
) {
  const normalizedId =
    artifactId.trim();

  if (!normalizedId) {
    return null;
  }

  return prisma.artifact.findUnique({
    where: {
      id:
        normalizedId,
    },

    include:
      publicArtifactInclude,
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
  const normalizedSlug =
    slug.trim();

  if (!normalizedSlug) {
    return null;
  }

  return prisma.artifact.findUnique({
    where: {
      slug:
        normalizedSlug,
    },

    include:
      publicArtifactInclude,
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

      status:
        "PUBLISHED",

      player: {
        active: true,
      },
    },

    include:
      publicArtifactInclude,
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
        not:
          artifactId,
      },

      playerId,

      status:
        "PUBLISHED",
    },

    include:
      publicArtifactInclude,

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

    take: Math.max(
      1,
      Math.min(
        Math.trunc(limit),
        12,
      ),
    ),
  });
}

/**
 * Restituisce gli slug di tutti i reperti pubblicati.
 *
 * Utilizzata da generateStaticParams() nella pagina
 * pubblica /artifacts/[slug].
 */
export async function getPublishedArtifactSlugs() {
  return prisma.artifact.findMany({
    where: {
      status:
        "PUBLISHED",

      player: {
        active:
          true,
      },
    },

    select: {
      slug:
        true,
    },

    orderBy: {
      createdAt:
        "asc",
    },
  });
}