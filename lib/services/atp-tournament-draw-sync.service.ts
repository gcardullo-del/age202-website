import {
  TournamentCircuit,
  TournamentDrawType,
  TournamentEntryStatus,
  TournamentMatchSlot,
  TournamentMatchStatus,
  TournamentCategory,
} from "@/generated/prisma/client";

import {
  prisma,
} from "@/lib/prisma";

import {
  resolvePlayer,
} from "@/lib/services/atp-tournament-sync.service";


type DrawPlayerInput = {
  name: string;
  profileSlug?: string | null;
  externalId?: string | null;
};


type DrawMatchInput = {
  externalId: string;
  round:
    | "ROUND_OF_128"
    | "ROUND_OF_64"
    | "ROUND_OF_32"
    | "ROUND_OF_16"
    | "QUARTERFINAL"
    | "SEMIFINAL"
    | "FINAL";
  roundOrder: number;
  matchNumber: number;
  bracketPosition: number;
  playerOne: DrawPlayerInput;
  playerTwo: DrawPlayerInput;
  winner: DrawPlayerInput;
  score: string | null;
  court: string | null;
  resultType:
    | "STANDARD"
    | "RETIREMENT"
    | "WALKOVER"
    | "DEFAULT"
    | "ABANDONED";
};


export type SyncAtpTournamentDrawInput = {
  cmsTournamentSlug: string;
  atpTournamentId: string;
  year: number;
  startDate?: Date | null;
  endDate?: Date | null;
  drawSize: number;
  extractedAt: Date;
  players: DrawPlayerInput[];
  matches: DrawMatchInput[];
  syncMode?: "progressive" | "final";
};


export type SyncAtpTournamentDrawResult = {
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
    linkedToNextRound: number;
  };
};


const SUPPORTED_CATEGORIES =
  new Set<TournamentCategory>([
    TournamentCategory.GRAND_SLAM,
    TournamentCategory.MASTERS_1000,
    TournamentCategory.ATP_500,
  ]);


function normalizeText(
  value: string | null | undefined,
): string | null {
  const normalized =
    value
      ?.trim()
      .replace(/\s+/g, " ");

  return normalized || null;
}


function normalizeSlug(
  value: string | null | undefined,
): string | null {
  const normalized =
    normalizeText(value)
      ?.toLowerCase()
      .normalize("NFD")
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

  return normalized || null;
}


function getPlayerKey(
  player: DrawPlayerInput,
): string {
  const externalId =
    normalizeText(
      player.externalId,
    )?.toUpperCase();

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
      "Unable to generate tournament entry key.",
    );
  }

  return `atp-name:${nameSlug}`;
}


function validateInput(
  input: SyncAtpTournamentDrawInput,
) {
  if (
    !Number.isInteger(input.year) ||
    input.year < 2000 ||
    input.year > 2200
  ) {
    throw new Error(
      `Invalid tournament year: ${input.year}.`,
    );
  }

  if (input.players.length === 0) {
    throw new Error(
      "ATP draw does not contain players.",
    );
  }

  if (input.matches.length === 0) {
    throw new Error(
      "ATP draw does not contain matches.",
    );
  }

  const finalMatches =
    input.matches.filter(
      (match) =>
        match.round === "FINAL",
    );

  const syncMode =
    input.syncMode ??
    "final";

  if (
    syncMode === "final" &&
    finalMatches.length !== 1
  ) {
    throw new Error(
      `ATP final draw must contain exactly one final; found ${finalMatches.length}.`,
    );
  }

  if (
    syncMode === "progressive" &&
    finalMatches.length > 1
  ) {
    throw new Error(
      `ATP progressive draw can contain at most one final; found ${finalMatches.length}.`,
    );
  }

  const matchIds =
    new Set(
      input.matches.map(
        (match) =>
          match.externalId,
      ),
    );

  if (
    matchIds.size !==
    input.matches.length
  ) {
    throw new Error(
      "ATP draw contains duplicate match external IDs.",
    );
  }
}


export async function syncAtpTournamentDraw(
  input: SyncAtpTournamentDrawInput,
): Promise<SyncAtpTournamentDrawResult> {
  validateInput(input);

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
            id: true,
            name: true,
            slug: true,
            category: true,
            active: true,
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
          `${tournament.name} is ${tournament.category}; draw sync supports only ATP Grand Slams, Masters 1000 and ATP 500.`,
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
            id: true,
          },
        });

      const syncMode =
        input.syncMode ??
        "final";

      const editionData = {
        startDate:
          input.startDate ??
          undefined,
        endDate:
          input.endDate ??
          undefined,
        drawSize:
          syncMode ===
          "progressive"
            ? undefined
            : input.drawSize,
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
                id: true,
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
                ...editionData,
              },
              select: {
                id: true,
              },
            });

      const uniquePlayers =
        new Map<string, DrawPlayerInput>();

      for (const player of input.players) {
        uniquePlayers.set(
          getPlayerKey(player),
          player,
        );
      }

      let entriesCreated =
        0;
      let entriesUpdated =
        0;

      const entryIdsByPlayerKey =
        new Map<string, string>();

      for (
        const [playerKey, playerInput]
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
              id: true,
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
                  id: true,
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
                  id: true,
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

      const matchIdsByExternalId =
        new Map<string, string>();

      for (const matchInput of input.matches) {
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

        const winnerEntryId =
          entryIdsByPlayerKey.get(
            getPlayerKey(
              matchInput.winner,
            ),
          );

        if (
          !playerOneEntryId ||
          !playerTwoEntryId ||
          !winnerEntryId
        ) {
          throw new Error(
            `Unable to resolve entries for match ${matchInput.externalId}.`,
          );
        }

        /*
         * 1. Identità ufficiale del draw.
         *
         * Se il match è già stato riconciliato in un sync
         * precedente, questa è la strada normale.
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
              id: true,
              externalId: true,
              matchNumber: true,
              bracketPosition: true,
              scheduledAt: true,
              court: true,
            },
          });

        let existingMatch =
          externalIdMatch;

        /*
         * 2. Reconciliation con il daily schedule.
         *
         * Il daily extractor usa un externalId "atp:daily:..."
         * diverso da quello del draw. Se l'ID ufficiale non
         * esiste ancora, cerchiamo quindi lo stesso incontro
         * tramite:
         *
         * - stessa edizione;
         * - stesso round;
         * - stessa coppia di giocatori;
         * - ordine dei giocatori indifferente.
         *
         * In questo modo trasformiamo il record daily già
         * esistente nel record ufficiale del draw invece di
         * crearne un duplicato.
         */
        if (!existingMatch) {
          existingMatch =
            await transaction.tournamentMatch.findFirst({
              where: {
                editionId:
                  edition.id,
                round:
                  matchInput.round,
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
                id: true,
                externalId: true,
                matchNumber: true,
                bracketPosition: true,
                scheduledAt: true,
                court: true,
              },
            });
        }

        /*
         * Progressive mode:
         * - never assigns the extractor's temporary 1..N positions;
         * - preserves an existing daily/progressive number when present;
         * - otherwise allocates a safe provisional number >= 1001.
         *
         * Final mode:
         * - assigns the official draw number/bracket position;
         * - checks the unique round+matchNumber constraint before writing.
         */
        let persistedMatchNumber:
          number;

        let persistedBracketPosition:
          number;

        if (
          syncMode ===
          "progressive"
        ) {
          if (existingMatch) {
            persistedMatchNumber =
              existingMatch.matchNumber;

            persistedBracketPosition =
              existingMatch.bracketPosition ??
              existingMatch.matchNumber;
          } else {
            const lastProvisionalMatch =
              await transaction.tournamentMatch.findFirst({
                where: {
                  editionId:
                    edition.id,
                  round:
                    matchInput.round,
                  matchNumber: {
                    gte:
                      1001,
                  },
                },
                orderBy: {
                  matchNumber:
                    "desc",
                },
                select: {
                  matchNumber:
                    true,
                },
              });

            persistedMatchNumber =
              Math.max(
                1001,
                (
                  lastProvisionalMatch
                    ?.matchNumber ??
                  1000
                ) + 1,
              );

            persistedBracketPosition =
              persistedMatchNumber;
          }
        } else {
          const officialNumberMatch =
            await transaction.tournamentMatch.findUnique({
              where: {
                editionId_round_matchNumber: {
                  editionId:
                    edition.id,
                  round:
                    matchInput.round,
                  matchNumber:
                    matchInput.matchNumber,
                },
              },
              select: {
                id: true,
                externalId: true,
              },
            });

          if (
            officialNumberMatch &&
            (
              !existingMatch ||
              officialNumberMatch.id !==
                existingMatch.id
            )
          ) {
            throw new Error(
              `Draw reconciliation conflict for ${matchInput.externalId}: ${matchInput.round} matchNumber ${matchInput.matchNumber} already belongs to ${officialNumberMatch.externalId}.`,
            );
          }

          persistedMatchNumber =
            matchInput.matchNumber;

          persistedBracketPosition =
            matchInput.bracketPosition;
        }

        const matchData = {
          externalId:
            matchInput.externalId,
          round:
            matchInput.round,
          roundOrder:
            matchInput.roundOrder,
          matchNumber:
            persistedMatchNumber,
          bracketPosition:
            persistedBracketPosition,
          playerOneEntryId,
          playerTwoEntryId,
          winnerEntryId,
          status:
            TournamentMatchStatus.COMPLETED,
          resultType:
            matchInput.resultType,
          completedAt:
            syncMode ===
            "progressive"
              ? input.extractedAt
              : (
                  input.endDate ??
                  input.extractedAt
                ),
          court:
            matchInput.court ??
            existingMatch?.court ??
            null,
          bestOf:
            tournament.category ===
            TournamentCategory.GRAND_SLAM
              ? 5
              : 3,
          scoreSummary:
            normalizeText(
              matchInput.score,
            ),
          source:
            "ATP",
          scoreUpdatedAt:
            input.extractedAt,
          lastSyncedAt:
            input.extractedAt,
        };

        const match =
          existingMatch
            ? await transaction.tournamentMatch.update({
                where: {
                  id:
                    existingMatch.id,
                },
                data:
                  matchData,
                select: {
                  id: true,
                },
              })
            : await transaction.tournamentMatch.create({
                data: {
                  editionId:
                    edition.id,
                  ...matchData,
                },
                select: {
                  id: true,
                },
              });

        if (existingMatch) {
          matchesUpdated +=
            1;
        } else {
          matchesCreated +=
            1;
        }

        /*
         * Usiamo sempre l'externalId ufficiale del draw come
         * chiave della mappa. Dopo la reconciliation anche il
         * record persistito possiede questo stesso externalId.
         */
        matchIdsByExternalId.set(
          matchInput.externalId,
          match.id,
        );
      }

      let linkedToNextRound =
        0;

      for (const matchInput of input.matches) {
        if (matchInput.round === "FINAL") {
          continue;
        }

        const winnerKey =
          getPlayerKey(
            matchInput.winner,
          );

        const nextMatchInput =
          input.matches.find(
            (candidate) =>
              candidate.roundOrder ===
                matchInput.roundOrder + 1 &&
              (
                getPlayerKey(candidate.playerOne) ===
                  winnerKey ||
                getPlayerKey(candidate.playerTwo) ===
                  winnerKey
              ),
          );

        if (!nextMatchInput) {
          continue;
        }

        const currentMatchId =
          matchIdsByExternalId.get(
            matchInput.externalId,
          );

        const nextMatchId =
          matchIdsByExternalId.get(
            nextMatchInput.externalId,
          );

        if (
          !currentMatchId ||
          !nextMatchId
        ) {
          continue;
        }

        const nextSlot =
          getPlayerKey(
            nextMatchInput.playerOne,
          ) === winnerKey
            ? TournamentMatchSlot.PLAYER_ONE
            : TournamentMatchSlot.PLAYER_TWO;

        await transaction.tournamentMatch.update({
          where: {
            id:
              currentMatchId,
          },
          data: {
            nextMatchId,
            nextSlot,
          },
        });

        linkedToNextRound +=
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
          linkedToNextRound,
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
