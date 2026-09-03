import {
  TournamentCircuit,
  TournamentDrawType,
  TournamentEntryStatus,
  TournamentMatchStatus,
  TournamentCategory,
} from "@/generated/prisma/client";

import {
  prisma,
} from "@/lib/prisma";

import {
  resolvePlayer,
} from "@/lib/services/atp-tournament-sync.service";


type DailyPlayerInput = {
  name: string;
  profileSlug?: string | null;
  externalId?: string | null;
};


type DailyMatchStatus =
  | "SCHEDULED"
  | "LIVE"
  | "COMPLETED";


type DailyMatchInput = {
  externalId: string;

  playerOne:
    DailyPlayerInput;

  playerTwo:
    DailyPlayerInput;

  status:
    DailyMatchStatus;

  scheduledAt:
    Date | null;

  court:
    string | null;

  roundLabel:
    string | null;

  winner:
    DailyPlayerInput | null;

  score:
    string | null;
};


export type SyncAtpTournamentDailyMatchesInput = {
  cmsTournamentSlug: string;

  atpTournamentId: string;

  year: number;

  startDate?: Date | null;

  endDate?: Date | null;

  extractedAt: Date;

  matches:
    DailyMatchInput[];
};


export type SyncAtpTournamentDailyMatchesResult = {
  tournament: {
    id: string;
    name: string;
    slug: string;
  };

  edition: {
    id: string;
    created: boolean;
  };

  entries: {
    created: number;
    updated: number;
  };

  matches: {
    created: number;
    updated: number;
    matchedByExternalId: number;
    matchedByPlayers: number;
  };
};


type TournamentRoundValue =
  | "ROUND_OF_128"
  | "ROUND_OF_64"
  | "ROUND_OF_32"
  | "ROUND_OF_16"
  | "QUARTERFINAL"
  | "SEMIFINAL"
  | "FINAL";


const SUPPORTED_CATEGORIES =
  new Set<TournamentCategory>([
    TournamentCategory.GRAND_SLAM,
    TournamentCategory.MASTERS_1000,
    TournamentCategory.ATP_500,
  ]);


const ROUND_ORDER: Record<
  TournamentRoundValue,
  number
> = {
  ROUND_OF_128: 1,
  ROUND_OF_64: 2,
  ROUND_OF_32: 3,
  ROUND_OF_16: 4,
  QUARTERFINAL: 5,
  SEMIFINAL: 6,
  FINAL: 7,
};


const PROVISIONAL_MATCH_NUMBER_BASE =
  1000;


function normalizeText(
  value:
    | string
    | null
    | undefined,
): string | null {
  const normalized =
    value
      ?.trim()
      .replace(
        /\s+/g,
        " ",
      );

  return normalized ||
    null;
}


function normalizeSlug(
  value:
    | string
    | null
    | undefined,
): string | null {
  const normalized =
    normalizeText(
      value,
    )
      ?.toLowerCase()
      .normalize(
        "NFD",
      )
      .replace(
        /[\u0300-\u036f]/g,
        "",
      )
      .replace(
        /[^a-z0-9]+/g,
        "-",
      )
      .replace(
        /^-+|-+$/g,
        "",
      );

  return normalized ||
    null;
}


function getPlayerKey(
  player:
    DailyPlayerInput,
): string {
  const externalId =
    normalizeText(
      player.externalId,
    )
      ?.toUpperCase();

  if (externalId) {
    return `atp:${externalId}`;
  }


  const profileSlug =
    normalizeSlug(
      player.profileSlug,
    );

  if (profileSlug) {
    return `atp-slug:${profileSlug}`;
  }


  const nameSlug =
    normalizeSlug(
      player.name,
    );

  if (!nameSlug) {
    throw new Error(
      "Unable to generate ATP daily player key.",
    );
  }


  return `atp-name:${nameSlug}`;
}


function parseRound(
  value:
    | string
    | null
    | undefined,
): TournamentRoundValue | null {
  const text =
    normalizeText(
      value,
    );

  if (!text) {
    return null;
  }


  if (
    /\b(?:R128|Round of 128)\b/i.test(
      text,
    )
  ) {
    return "ROUND_OF_128";
  }


  if (
    /\b(?:R64|Round of 64)\b/i.test(
      text,
    )
  ) {
    return "ROUND_OF_64";
  }


  if (
    /\b(?:R32|Round of 32)\b/i.test(
      text,
    )
  ) {
    return "ROUND_OF_32";
  }


  if (
    /\b(?:R16|Round of 16)\b/i.test(
      text,
    )
  ) {
    return "ROUND_OF_16";
  }


  if (
    /\b(?:QF|Quarter[- ]?Finals?)\b/i.test(
      text,
    )
  ) {
    return "QUARTERFINAL";
  }


  if (
    /\b(?:SF|Semi[- ]?Finals?)\b/i.test(
      text,
    )
  ) {
    return "SEMIFINAL";
  }


  if (
    /\bFinal\b/i.test(
      text,
    )
  ) {
    return "FINAL";
  }


  return null;
}


function toPrismaStatus(
  value:
    DailyMatchStatus,
): TournamentMatchStatus {
  switch (value) {
    case "COMPLETED":
      return TournamentMatchStatus.COMPLETED;

    case "LIVE":
      return TournamentMatchStatus.IN_PROGRESS;

    case "SCHEDULED":
    default:
      return TournamentMatchStatus.SCHEDULED;
  }
}


function getStatusRank(
  value:
    TournamentMatchStatus,
): number {
  switch (value) {
    case TournamentMatchStatus.COMPLETED:
      return 3;

    case TournamentMatchStatus.IN_PROGRESS:
      return 2;

    case TournamentMatchStatus.SCHEDULED:
      return 1;

    default:
      return 0;
  }
}


function keepMostAdvancedStatus(
  existing:
    TournamentMatchStatus | null,

  incoming:
    TournamentMatchStatus,
): TournamentMatchStatus {
  if (!existing) {
    return incoming;
  }


  return (
    getStatusRank(
      existing,
    ) >=
    getStatusRank(
      incoming,
    )
  )
    ? existing
    : incoming;
}


function validateInput(
  input:
    SyncAtpTournamentDailyMatchesInput,
) {
  if (
    !Number.isInteger(
      input.year,
    ) ||
    input.year < 2000 ||
    input.year > 2200
  ) {
    throw new Error(
      `Invalid tournament year: ${input.year}.`,
    );
  }


  if (
    input.matches.length ===
    0
  ) {
    throw new Error(
      "ATP daily schedule does not contain matches.",
    );
  }


  const externalIds =
    new Set(
      input.matches.map(
        (match) =>
          match.externalId,
      ),
    );


  if (
    externalIds.size !==
    input.matches.length
  ) {
    throw new Error(
      "ATP daily schedule contains duplicate match external IDs.",
    );
  }
}


export async function syncAtpTournamentDailyMatches(
  input:
    SyncAtpTournamentDailyMatchesInput,
): Promise<SyncAtpTournamentDailyMatchesResult> {
  validateInput(
    input,
  );


  const cmsTournamentSlug =
    normalizeSlug(
      input.cmsTournamentSlug,
    );


  if (!cmsTournamentSlug) {
    throw new Error(
      "CMS tournament slug is required.",
    );
  }


  return prisma.$transaction(
    async (transaction) => {
      const tournament =
        await transaction.tournament.findUnique({
          where: {
            slug:
              cmsTournamentSlug,
          },

          select: {
            id:
              true,

            name:
              true,

            slug:
              true,

            category:
              true,

            active:
              true,
          },
        });


      if (!tournament) {
        throw new Error(
          `Tournament not found in AGE202: ${cmsTournamentSlug}.`,
        );
      }


      if (!tournament.active) {
        throw new Error(
          `Tournament is inactive in AGE202: ${cmsTournamentSlug}.`,
        );
      }


      if (
        !SUPPORTED_CATEGORIES.has(
          tournament.category,
        )
      ) {
        throw new Error(
          `${tournament.name} is ${tournament.category}; daily sync supports only ATP Grand Slams, Masters 1000 and ATP 500.`,
        );
      }


      const editionExternalId =
        `atp:${input.atpTournamentId}:${input.year}:singles`;


      const existingEdition =
        await transaction.tournamentEdition.findUnique({
          where: {
            tournamentId_year_editionKey_circuit: {
              tournamentId:
                tournament.id,

              year:
                input.year,

              editionKey:
                "main",

              circuit:
                TournamentCircuit.ATP,
            },
          },

          select: {
            id:
              true,

            drawSize:
              true,
          },
        });


      const editionData = {
        startDate:
          input.startDate ??
          undefined,

        endDate:
          input.endDate ??
          undefined,

        drawType:
          TournamentDrawType.SINGLES,

        source:
          "ATP",

        externalId:
          editionExternalId,

        syncEnabled:
          true,

        lastSyncedAt:
          input.extractedAt,

        cancelled:
          false,
      };


      const edition =
        existingEdition
          ? await transaction.tournamentEdition.update({
              where: {
                id:
                  existingEdition.id,
              },

              data:
                editionData,

              select: {
                id:
                  true,

                drawSize:
                  true,
              },
            })
          : await transaction.tournamentEdition.create({
              data: {
                tournamentId:
                  tournament.id,

                year:
                  input.year,

                editionKey:
                  "main",

                circuit:
                  TournamentCircuit.ATP,

                drawSize:
                  null,

                ...editionData,
              },

              select: {
                id:
                  true,

                drawSize:
                  true,
              },
            });


      /*
       * Creiamo una mappa unica dei giocatori
       * presenti nel programma giornaliero.
       */
      const uniquePlayers =
        new Map<
          string,
          DailyPlayerInput
        >();


      for (
        const match
        of input.matches
      ) {
        uniquePlayers.set(
          getPlayerKey(
            match.playerOne,
          ),
          match.playerOne,
        );

        uniquePlayers.set(
          getPlayerKey(
            match.playerTwo,
          ),
          match.playerTwo,
        );


        if (match.winner) {
          uniquePlayers.set(
            getPlayerKey(
              match.winner,
            ),
            match.winner,
          );
        }
      }


      const entryIdsByPlayerKey =
        new Map<
          string,
          string
        >();


      let entriesCreated =
        0;

      let entriesUpdated =
        0;


      for (
        const [
          playerKey,
          playerInput,
        ]
        of uniquePlayers
      ) {
        const resolvedPlayer =
          await resolvePlayer(
            transaction,
            {
              name:
                playerInput.name,

              profileSlug:
                playerInput.profileSlug,
            },
          );


        const existingEntry =
          await transaction.tournamentEntry.findUnique({
            where: {
              editionId_externalId: {
                editionId:
                  edition.id,

                externalId:
                  playerKey,
              },
            },

            select: {
              id:
                true,
            },
          });


        const entryData = {
          name:
            resolvedPlayer.name,

          playerId:
            resolvedPlayer.id,

          countryCode:
            resolvedPlayer.countryCode,

          entryStatus:
            TournamentEntryStatus.DIRECT_ACCEPTANCE,
        };


        const entry =
          existingEntry
            ? await transaction.tournamentEntry.update({
                where: {
                  id:
                    existingEntry.id,
                },

                data:
                  entryData,

                select: {
                  id:
                    true,
                },
              })
            : await transaction.tournamentEntry.create({
                data: {
                  editionId:
                    edition.id,

                  externalId:
                    playerKey,

                  ...entryData,
                },

                select: {
                  id:
                    true,
                },
              });


        if (existingEntry) {
          entriesUpdated +=
            1;
        } else {
          entriesCreated +=
            1;
        }


        entryIdsByPlayerKey.set(
          playerKey,
          entry.id,
        );
      }


      let matchesCreated =
        0;

      let matchesUpdated =
        0;

      let matchedByExternalId =
        0;

      let matchedByPlayers =
        0;


      /*
       * Il matchNumber del daily schedule
       * è volutamente provvisorio.
       *
       * Usiamo numeri >= 1001 per non
       * collidere con i matchNumber reali
       * del draw (1, 2, 3...).
       *
       * Quando faremo la reconciliation
       * del draw, questi valori saranno
       * sostituiti con quelli ufficiali.
       */
      const provisionalCounters =
        new Map<
          TournamentRoundValue,
          number
        >();


      for (
        const matchInput
        of input.matches
      ) {
        const round =
          parseRound(
            matchInput.roundLabel,
          );


        if (!round) {
          throw new Error(
            `Unable to resolve round for daily match ${matchInput.externalId}: ${matchInput.roundLabel ?? "null"}.`,
          );
        }


        const playerOneEntryId =
          entryIdsByPlayerKey.get(
            getPlayerKey(
              matchInput.playerOne,
            ),
          );


        const playerTwoEntryId =
          entryIdsByPlayerKey.get(
            getPlayerKey(
              matchInput.playerTwo,
            ),
          );


        if (
          !playerOneEntryId ||
          !playerTwoEntryId
        ) {
          throw new Error(
            `Unable to resolve entries for daily match ${matchInput.externalId}.`,
          );
        }


        const winnerEntryId =
          matchInput.winner
            ? entryIdsByPlayerKey.get(
                getPlayerKey(
                  matchInput.winner,
                ),
              ) ??
              null
            : null;


        /*
         * 1. Prima tentiamo l'identità
         *    esatta del daily extractor.
         */
        const externalIdMatch =
          await transaction.tournamentMatch.findUnique({
            where: {
              editionId_externalId: {
                editionId:
                  edition.id,

                externalId:
                  matchInput.externalId,
              },
            },

            select: {
              id:
                true,

              externalId:
                true,

              status:
                true,

              matchNumber:
                true,

              bracketPosition:
                true,

              scheduledAt:
                true,

              startedAt:
                true,

              completedAt:
                true,

              winnerEntryId:
                true,

              scoreSummary:
                true,
            },
          });


        let existingMatch =
          externalIdMatch;


        if (externalIdMatch) {
          matchedByExternalId +=
            1;
        }


        /*
         * 2. Se l'externalId non coincide,
         *    cerchiamo lo stesso match nella
         *    stessa edizione tramite:
         *
         *    round + coppia di giocatori.
         *
         *    L'ordine dei giocatori non conta.
         */
        if (!existingMatch) {
          const pairMatches =
            await transaction.tournamentMatch.findMany({
              where: {
                editionId:
                  edition.id,

                round,

                OR: [
                  {
                    playerOneEntryId,
                    playerTwoEntryId,
                  },

                  {
                    playerOneEntryId:
                      playerTwoEntryId,

                    playerTwoEntryId:
                      playerOneEntryId,
                  },
                ],
              },

              select: {
                id:
                  true,

                externalId:
                  true,

                status:
                  true,

                matchNumber:
                  true,

                bracketPosition:
                  true,

                scheduledAt:
                  true,

                startedAt:
                  true,

                completedAt:
                  true,

                winnerEntryId:
                  true,

                scoreSummary:
                  true,
              },

              take:
                2,
            });


          if (
            pairMatches.length >
            1
          ) {
            throw new Error(
              `Multiple AGE202 matches found for ${matchInput.playerOne.name} vs ${matchInput.playerTwo.name} in ${round}.`,
            );
          }


          if (
            pairMatches.length ===
            1
          ) {
            existingMatch =
              pairMatches[0];

            matchedByPlayers +=
              1;
          }
        }


        const incomingStatus =
          toPrismaStatus(
            matchInput.status,
          );


        const finalStatus =
          keepMostAdvancedStatus(
            existingMatch?.status ??
              null,

            incomingStatus,
          );


        /*
         * Non permettiamo mai al daily sync
         * di retrocedere un match già
         * COMPLETED a LIVE/SCHEDULED.
         */
        const completedAt =
          finalStatus ===
          TournamentMatchStatus.COMPLETED
            ? (
                existingMatch?.completedAt ??
                input.extractedAt
              )
            : null;


        const startedAt =
          (
            finalStatus ===
              TournamentMatchStatus.IN_PROGRESS ||
            finalStatus ===
              TournamentMatchStatus.COMPLETED
          )
            ? (
                existingMatch?.startedAt ??
                input.extractedAt
              )
            : null;


        const scoreSummary =
          normalizeText(
            matchInput.score,
          ) ??
          existingMatch?.scoreSummary ??
          null;


        const finalWinnerEntryId =
          winnerEntryId ??
          existingMatch?.winnerEntryId ??
          null;


        if (existingMatch) {
          /*
           * Se il record proviene già dal draw,
           * manteniamo il suo externalId.
           *
           * È importante: il daily sync non deve
           * trasformare un ID storico del draw
           * in un ID provvisorio daily.
           */
          await transaction.tournamentMatch.update({
            where: {
              id:
                existingMatch.id,
            },

            data: {
              playerOneEntryId,

              playerTwoEntryId,

              winnerEntryId:
                finalWinnerEntryId,

              status:
                finalStatus,

              scheduledAt:
                 matchInput.scheduledAt ??
                 existingMatch.scheduledAt,

              startedAt,

              completedAt,

              court:
                matchInput.court ??
                undefined,

              bestOf:
                tournament.category ===
                TournamentCategory.GRAND_SLAM
                  ? 5
                  : 3,

              scoreSummary,

              source:
                "ATP",

              scoreUpdatedAt:
                input.extractedAt,

              lastSyncedAt:
                input.extractedAt,
            },
          });


          matchesUpdated +=
            1;

          continue;
        }


        const currentCounter =
          (
            provisionalCounters.get(
              round,
            ) ??
            0
          ) + 1;


        provisionalCounters.set(
          round,
          currentCounter,
        );


        const provisionalMatchNumber =
          PROVISIONAL_MATCH_NUMBER_BASE +
          currentCounter;


        await transaction.tournamentMatch.create({
          data: {
            editionId:
              edition.id,

            externalId:
              matchInput.externalId,

            round,

            roundOrder:
              ROUND_ORDER[
                round
              ],

            matchNumber:
              provisionalMatchNumber,

            bracketPosition:
              null,

            playerOneEntryId,

            playerTwoEntryId,

            winnerEntryId:
              finalWinnerEntryId,

            status:
              finalStatus,

            scheduledAt:
              matchInput.scheduledAt,

            startedAt,

            completedAt,

            court:
              matchInput.court,

            bestOf:
              tournament.category ===
              TournamentCategory.GRAND_SLAM
                ? 5
                : 3,

            scoreSummary,

            source:
              "ATP",

            scoreUpdatedAt:
              input.extractedAt,

            lastSyncedAt:
              input.extractedAt,
          },
        });


        matchesCreated +=
          1;
      }


      return {
        tournament: {
          id:
            tournament.id,

          name:
            tournament.name,

          slug:
            tournament.slug,
        },

        edition: {
          id:
            edition.id,

          created:
            !existingEdition,
        },

        entries: {
          created:
            entriesCreated,

          updated:
            entriesUpdated,
        },

        matches: {
          created:
            matchesCreated,

          updated:
            matchesUpdated,

          matchedByExternalId,

          matchedByPlayers,
        },
      };
    },
    {
      maxWait:
        20_000,

      timeout:
        120_000,
    },
  );
}