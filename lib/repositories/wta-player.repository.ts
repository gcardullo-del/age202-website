import { randomUUID } from "crypto";

import { prisma } from "@/lib/prisma";


const MAX_WTA_PLAYERS = 100;

const WTA_ARCHIVE_FIRST_RANK = 1;
const WTA_ARCHIVE_LAST_RANK = 50;


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
      collectionType: true,

      /*
       * Manteniamo la stessa struttura del repository ATP
       * per garantire compatibilità con i componenti AGE202.
       */
      artifacts: {
        where: availableArtifactFilter,

        select: {
          id: true,
        },

        take: 1,
      },

      /*
       * Conteggio reale degli Artifact pubblicati
       * e disponibili associati alla giocatrice.
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


export type WtaPlayerImportData = {
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


export async function getWtaRanking(
  limit = MAX_WTA_PLAYERS,
) {
  const safeLimit =
    Math.min(
      Math.max(
        Math.trunc(
          limit,
        ),
        1,
      ),
      MAX_WTA_PLAYERS,
    );

  return prisma.wtaPlayer.findMany({
    where: {
      active: true,
    },

    orderBy:
      rankingOrder,

    take:
      safeLimit,

    include:
      playerCollectionInclude,
  });
}


export async function getWtaPlayerBySlug(
  slug: string,
) {
  return prisma.wtaPlayer.findFirst({
    where: {
      slug,
      active: true,
    },

    include:
      playerCollectionInclude,
  });
}


export async function getWtaPlayerByRank(
  rank: number,
) {
  return prisma.wtaPlayer.findFirst({
    where: {
      rank,
      active: true,
    },

    include:
      playerCollectionInclude,
  });
}


export async function getLinkedWtaPlayers() {
  return prisma.wtaPlayer.findMany({
    where: {
      active: true,

      playerId: {
        not: null,
      },
    },

    orderBy:
      rankingOrder,

    include:
      playerCollectionInclude,
  });
}


export async function getStoredWtaPlayers() {
  return prisma.wtaPlayer.findMany({
    select: {
      id: true,
      slug: true,
      rank: true,
      playerId: true,
    },
  });
}


export async function replaceWtaRanking(
  players: WtaPlayerImportData[],
) {
  /*
   * PROTEZIONE 1
   *
   * Non sostituiamo mai la classifica WTA
   * con un dataset incompleto.
   */
  if (
    players.length !==
    MAX_WTA_PLAYERS
  ) {
    throw new Error(
      `La classifica WTA non può essere sostituita: attese ${MAX_WTA_PLAYERS} giocatrici, ricevute ${players.length}.`,
    );
  }


  const orderedPlayers =
    [...players].sort(
      (
        firstPlayer,
        secondPlayer,
      ) =>
        firstPlayer.rank -
        secondPlayer.rank,
    );


  /*
   * PROTEZIONE 2
   *
   * La classifica deve essere perfettamente
   * sequenziale:
   *
   * 1, 2, 3 ... MAX_WTA_PLAYERS.
   */
  orderedPlayers.forEach(
    (
      player,
      index,
    ) => {
      const expectedRank =
        index + 1;

      if (
        player.rank !==
        expectedRank
      ) {
        throw new Error(
          `Classifica WTA non sequenziale: attesa posizione ${expectedRank}, ricevuta ${player.rank}.`,
        );
      }
    },
  );


  return prisma.$transaction(
    async (
      transaction,
    ) => {
      /*
       * SNAPSHOT WTA ESISTENTE
       *
       * Conserviamo:
       *
       * - id WtaPlayer
       * - playerId
       *
       * indicizzati per slug.
       *
       * In questo modo:
       *
       * - una giocatrice già esistente mantiene
       *   il proprio ID;
       *
       * - un nuovo ingresso riceve un nuovo UUID;
       *
       * - i collegamenti con Player vengono
       *   preservati.
       */
      const storedWtaPlayers =
        await transaction.wtaPlayer.findMany({
          select: {
            id: true,
            slug: true,
            playerId: true,
          },
        });


      const storedWtaIdBySlug =
        new Map(
          storedWtaPlayers.map(
            (
              player,
            ) => [
              player.slug,
              player.id,
            ],
          ),
        );


      const storedPlayerIdBySlug =
        new Map(
          storedWtaPlayers.map(
            (
              player,
            ) => [
              player.slug,
              player.playerId,
            ],
          ),
        );


      /*
       * Mappa dei Player del WTA Archive Top 50
       * creati o aggiornati durante questa stessa
       * transazione.
       */
      const archivePlayerIdBySlug =
        new Map<
          string,
          string
        >();


      /*
       * WTA ARCHIVE TOP 50
       *
       * Prima della sostituzione della classifica
       * aggiorniamo o creiamo i Player necessari
       * all'Archive.
       *
       * La logica è intenzionalmente speculare
       * all'ATP Archive.
       */
      for (
        const wtaPlayer
        of orderedPlayers
      ) {
        if (
          wtaPlayer.rank <
            WTA_ARCHIVE_FIRST_RANK ||
          wtaPlayer.rank >
            WTA_ARCHIVE_LAST_RANK
        ) {
          continue;
        }


        const existingPlayer =
          await transaction.player.findUnique({
            where: {
              slug:
                wtaPlayer.slug,
            },
          });


        const archivePlayer =
          existingPlayer
            ? await transaction.player.update({
                where: {
                  id:
                    existingPlayer.id,
                },

                data: {
                  name:
                    wtaPlayer.name,

                  firstName:
                    wtaPlayer.firstName ??
                    null,

                  lastName:
                    wtaPlayer.lastName ??
                    null,

                  country:
                    wtaPlayer.country,

                  /*
                   * Non sovrascriviamo mai
                   * una portrait AGE202 esistente
                   * con null.
                   */
                  portraitImage:
                    existingPlayer.portraitImage ??
                    wtaPlayer.imageUrl ??
                    null,

                  /*
                   * Eventuali FEATURED collection
                   * restano FEATURED.
                   */
                  collectionType:
                    existingPlayer.collectionType ===
                    "FEATURED"
                      ? "FEATURED"
                      : getArchiveCollectionType(
                          wtaPlayer.age,
                        ),

                  displayOrder:
                    existingPlayer.collectionType ===
                    "FEATURED"
                      ? existingPlayer.displayOrder
                      : wtaPlayer.rank,

                  active:
                    true,
                },
              })
            : await transaction.player.create({
                data: {
                  name:
                    wtaPlayer.name,

                  slug:
                    wtaPlayer.slug,

                  firstName:
                    wtaPlayer.firstName ??
                    null,

                  lastName:
                    wtaPlayer.lastName ??
                    null,

                  country:
                    wtaPlayer.country,

                  portraitImage:
                    wtaPlayer.imageUrl ??
                    null,

                  collectionType:
                    getArchiveCollectionType(
                      wtaPlayer.age,
                    ),

                  displayOrder:
                    wtaPlayer.rank,

                  active:
                    true,
                },
              });


        archivePlayerIdBySlug.set(
          wtaPlayer.slug,
          archivePlayer.id,
        );
      }


      /*
       * SOSTITUZIONE WTA RANKING
       *
       * Tutto avviene nella stessa transazione.
       *
       * Se una delle operazioni successive fallisce,
       * PostgreSQL esegue rollback completo.
       */
      await transaction.wtaPlayer.deleteMany();


      await transaction.wtaPlayer.createMany({
        data:
          orderedPlayers.map(
            (
              player,
            ) => ({
              /*
               * Slug già esistente:
               * manteniamo lo stesso ID.
               *
               * Nuovo slug:
               * generiamo un nuovo UUID.
               */
              id:
                storedWtaIdBySlug.get(
                  player.slug,
                ) ??
                randomUUID(),

              rank:
                player.rank,

              previousRank:
                player.previousRank,

              name:
                player.name,

              firstName:
                player.firstName ??
                null,

              lastName:
                player.lastName ??
                null,

              slug:
                player.slug,

              country:
                player.country,

              countryCode:
                player.countryCode,

              points:
                player.points,

              age:
                player.age ??
                null,

              imageUrl:
                player.imageUrl ??
                null,

              /*
               * Per le prime 50 preferiamo
               * il Player Archive appena
               * verificato o creato.
               *
               * Per le altre conserviamo
               * l'eventuale collegamento
               * AGE202 precedente.
               */
              playerId:
                archivePlayerIdBySlug.get(
                  player.slug,
                ) ??
                storedPlayerIdBySlug.get(
                  player.slug,
                ) ??
                null,

              rankingDate:
                player.rankingDate,

              source:
                player.source,

              active:
                true,
            }),
          ),
      });


      /*
       * POST-CONDITION 1
       *
       * Devono esistere esattamente
       * MAX_WTA_PLAYERS giocatrici attive.
       */
      const activePlayers =
        await transaction.wtaPlayer.findMany({
          where: {
            active: true,
          },

          orderBy:
            rankingOrder,

          include:
            playerCollectionInclude,
        });


      if (
        activePlayers.length !==
        MAX_WTA_PLAYERS
      ) {
        throw new Error(
          `Transazione WTA annullata: dopo l'importazione risultano ${activePlayers.length}/${MAX_WTA_PLAYERS} giocatrici attive.`,
        );
      }


      /*
       * POST-CONDITION 2
       *
       * Tutte le giocatrici dalla posizione
       * 1 alla 50 devono essere collegate
       * al relativo Player Archive.
       */
      const linkedArchivePlayers =
        activePlayers.filter(
          (
            player,
          ) =>
            player.rank >=
              WTA_ARCHIVE_FIRST_RANK &&
            player.rank <=
              WTA_ARCHIVE_LAST_RANK &&
            player.player !==
              null,
        );


      const expectedArchivePlayers =
        WTA_ARCHIVE_LAST_RANK -
        WTA_ARCHIVE_FIRST_RANK +
        1;


      if (
        linkedArchivePlayers.length !==
        expectedArchivePlayers
      ) {
        throw new Error(
          `Transazione WTA annullata: collegate ${linkedArchivePlayers.length}/${expectedArchivePlayers} giocatrici del WTA Archive.`,
        );
      }


      /*
       * POST-CONDITION 3
       *
       * Ricontrolliamo la sequenza rank
       * direttamente sui record persistiti.
       */
      activePlayers.forEach(
        (
          player,
          index,
        ) => {
          const expectedRank =
            index + 1;

          if (
            player.rank !==
            expectedRank
          ) {
            throw new Error(
              `Transazione WTA annullata: ranking persistito non sequenziale alla posizione ${expectedRank}.`,
            );
          }
        },
      );


      return activePlayers;
    },
    {
      maxWait:
        10_000,

      timeout:
        30_000,
    },
  );
}