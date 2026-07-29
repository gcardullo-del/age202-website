
import { MAX_ATP_PLAYERS } from "@/lib/atp/constants";
import { prisma } from "@/lib/prisma";

const ATP_ARCHIVE_FIRST_RANK = 1;
const ATP_ARCHIVE_LAST_RANK = 50;

const rankingOrder = [
  {
    rank: "asc" as const,
  },
];

const availableArtifactFilter = {
  status: "PUBLISHED" as const,
  availability: "AVAILABLE" as const,
};

const playerCollectionInclude = {
  player: {
    select: {
      id: true,
      name: true,
      slug: true,
      active: true,
      portraitImage: true,

      /*
       * Mantenuto temporaneamente per garantire la compatibilità
       * con il service attuale, che controlla artifacts.length.
       */
      artifacts: {
        where: availableArtifactFilter,

        select: {
          id: true,
        },

        take: 1,
      },

      /*
       * Conteggio reale degli articoli pubblicati e disponibili.
       * Sarà utilizzato dal service nel prossimo passaggio.
       */
      _count: {
        select: {
          artifacts: {
            where: availableArtifactFilter,
          },
        },
      },
    },
  },
};

export type AtpPlayerImportData = {
  rank: number;
  previousRank: number | null;

  name: string;
  firstName?: string | null;
  lastName?: string | null;
  slug: string;

  country: string;
  countryCode: string;

  points: number | null;
  age?: number | null;

  imageUrl?: string | null;

  rankingDate: Date;
  source: string;
};

function getArchiveCollectionType(
  age: number | null | undefined,
) {
  return age !== null &&
    age !== undefined &&
    age <= 23
    ? ("RISING_STAR" as const)
    : ("ARCHIVE" as const);
}

export async function getAtpRanking(
  limit = MAX_ATP_PLAYERS,
) {
  const safeLimit = Math.min(
    Math.max(Math.trunc(limit), 1),
    MAX_ATP_PLAYERS,
  );

  return prisma.atpPlayer.findMany({
    where: {
      active: true,
    },

    orderBy: rankingOrder,

    take: safeLimit,

    include: playerCollectionInclude,
  });
}

export async function getAtpPlayerBySlug(
  slug: string,
) {
  return prisma.atpPlayer.findFirst({
    where: {
      slug,
      active: true,
    },

    include: playerCollectionInclude,
  });
}

export async function getAtpPlayerByRank(
  rank: number,
) {
  return prisma.atpPlayer.findFirst({
    where: {
      rank,
      active: true,
    },

    include: playerCollectionInclude,
  });
}

export async function getLinkedAtpPlayers() {
  return prisma.atpPlayer.findMany({
    where: {
      active: true,

      playerId: {
        not: null,
      },
    },

    orderBy: rankingOrder,

    include: playerCollectionInclude,
  });
}

export async function getStoredAtpPlayers() {
  return prisma.atpPlayer.findMany({
    select: {
      id: true,
      slug: true,
      rank: true,
      playerId: true,
    },
  });
}

export async function replaceAtpRanking(
  players: AtpPlayerImportData[],
) {
  if (players.length !== MAX_ATP_PLAYERS) {
    throw new Error(
      `La classifica non può essere sostituita: attesi ${MAX_ATP_PLAYERS} giocatori, ricevuti ${players.length}.`,
    );
  }

  const orderedPlayers = [...players].sort(
    (firstPlayer, secondPlayer) =>
      firstPlayer.rank - secondPlayer.rank,
  );

  orderedPlayers.forEach((player, index) => {
    const expectedRank = index + 1;

    if (player.rank !== expectedRank) {
      throw new Error(
        `Classifica non sequenziale: attesa posizione ${expectedRank}, ricevuta ${player.rank}.`,
      );
    }
  });

  return prisma.$transaction(
    async (transaction) => {
      const storedAtpPlayers =
        await transaction.atpPlayer.findMany({
          select: {
            slug: true,
            playerId: true,
          },
        });

      const storedPlayerIdBySlug = new Map(
        storedAtpPlayers.map((player) => [
          player.slug,
          player.playerId,
        ]),
      );

      const archivePlayerIdBySlug = new Map<
        string,
        string
      >();

      for (const atpPlayer of orderedPlayers) {
        if (
          atpPlayer.rank < ATP_ARCHIVE_FIRST_RANK ||
          atpPlayer.rank > ATP_ARCHIVE_LAST_RANK
        ) {
          continue;
        }

        const existingPlayer =
          await transaction.player.findUnique({
            where: {
              slug: atpPlayer.slug,
            },
          });

        const archivePlayer = existingPlayer
          ? await transaction.player.update({
              where: {
                id: existingPlayer.id,
              },

              data: {
                name: atpPlayer.name,
                firstName:
                  atpPlayer.firstName ?? null,
                lastName:
                  atpPlayer.lastName ?? null,
                country: atpPlayer.country,

                portraitImage:
                  existingPlayer.portraitImage ??
                  atpPlayer.imageUrl ??
                  null,

                collectionType:
                  existingPlayer.collectionType ===
                  "FEATURED"
                    ? "FEATURED"
                    : getArchiveCollectionType(
                        atpPlayer.age,
                      ),

                displayOrder:
                  existingPlayer.collectionType ===
                  "FEATURED"
                    ? existingPlayer.displayOrder
                    : atpPlayer.rank,

                active: true,
              },
            })
          : await transaction.player.create({
              data: {
                name: atpPlayer.name,
                slug: atpPlayer.slug,

                firstName:
                  atpPlayer.firstName ?? null,

                lastName:
                  atpPlayer.lastName ?? null,

                country: atpPlayer.country,

                portraitImage:
                  atpPlayer.imageUrl ?? null,

                collectionType:
                  getArchiveCollectionType(
                    atpPlayer.age,
                  ),

                displayOrder: atpPlayer.rank,
                active: true,
              },
            });

        archivePlayerIdBySlug.set(
          atpPlayer.slug,
          archivePlayer.id,
        );
      }

      await transaction.atpPlayer.deleteMany();

      await transaction.atpPlayer.createMany({
        data: orderedPlayers.map((player) => ({
          rank: player.rank,
          previousRank: player.previousRank,

          name: player.name,

          firstName:
            player.firstName ?? null,

          lastName:
            player.lastName ?? null,

          slug: player.slug,

          country: player.country,
          countryCode: player.countryCode,

          points: player.points,

          age:
            player.age ?? null,

          imageUrl:
            player.imageUrl ?? null,

          playerId:
            archivePlayerIdBySlug.get(
              player.slug,
            ) ??
            storedPlayerIdBySlug.get(
              player.slug,
            ) ??
            null,

          rankingDate: player.rankingDate,
          source: player.source,

          active: true,
        })),
      });

      const activePlayers =
        await transaction.atpPlayer.findMany({
          where: {
            active: true,
          },

          orderBy: rankingOrder,

          include: playerCollectionInclude,
        });

      if (
        activePlayers.length !==
        MAX_ATP_PLAYERS
      ) {
        throw new Error(
          `Transazione annullata: dopo l'importazione risultano ${activePlayers.length}/${MAX_ATP_PLAYERS} giocatori attivi.`,
        );
      }

      const linkedArchivePlayers =
        activePlayers.filter(
          (player) =>
            player.rank >=
              ATP_ARCHIVE_FIRST_RANK &&
            player.rank <=
              ATP_ARCHIVE_LAST_RANK &&
            player.player !== null,
        );

      const expectedArchivePlayers =
        ATP_ARCHIVE_LAST_RANK -
        ATP_ARCHIVE_FIRST_RANK +
        1;

      if (
        linkedArchivePlayers.length !==
        expectedArchivePlayers
      ) {
        throw new Error(
          `Transazione annullata: collegati ${linkedArchivePlayers.length}/${expectedArchivePlayers} giocatori dell'ATP Archive.`,
        );
      }

      return activePlayers;
    },
    {
      maxWait: 10_000,
      timeout: 30_000,
    },
  );
}