import {
  TournamentCircuit,
  TournamentMatchStatus,
  TournamentRound,
} from "@/generated/prisma/client";

import {
  prisma,
} from "@/lib/prisma";


export type AtpLiveScoreSyncMatch = {
  roundLabel: string | null;

  court: string | null;

  playerOne: {
    name: string;
  };

  playerTwo: {
    name: string;
  };

  playerOneSetScores: string[];
  playerTwoSetScores: string[];
};


export type SyncAtpTournamentLiveScoresInput = {
  cmsTournamentSlug: string;

  year: number;

  extractedAt: Date;

  write: boolean;

  matches: AtpLiveScoreSyncMatch[];
};


export type AtpLiveScoreMatchResult = {
  livePlayerOne: string;
  livePlayerTwo: string;

  matchId: string | null;

  matched: boolean;
  ambiguous: boolean;
  updated: boolean;
  skippedCompleted: boolean;

  scoreSummary: string | null;

  message: string;
};


export type SyncAtpTournamentLiveScoresResult = {
  tournament: string;

  liveMatches: number;

  matched: number;
  updated: number;
  ambiguous: number;
  unmatched: number;
  skippedCompleted: number;

  results: AtpLiveScoreMatchResult[];
};


type ParsedSetScore = {
  score: number;
  tiebreak: number | null;
};


function normalizeName(
  value: string,
): string {
  return value
    .toLowerCase()
    .normalize(
      "NFD",
    )
    .replace(
      /[\u0300-\u036f]/g,
      "",
    )
    .replace(
      /[^a-z0-9]+/g,
      " ",
    )
    .replace(
      /\s+/g,
      " ",
    )
    .trim();
}


function splitName(
  value: string,
): string[] {
  return normalizeName(
    value,
  )
    .split(" ")
    .filter(Boolean);
}


function namesEquivalent(
  liveName: string,
  databaseName: string,
): boolean {
  const liveParts =
    splitName(
      liveName,
    );

  const databaseParts =
    splitName(
      databaseName,
    );


  if (
    liveParts.join(" ") ===
    databaseParts.join(" ")
  ) {
    return true;
  }


  if (
    liveParts.length < 2 ||
    databaseParts.length < 2
  ) {
    return false;
  }


  const liveFirst =
    liveParts[0];

  const databaseFirst =
    databaseParts[0];


  if (
    !liveFirst ||
    !databaseFirst
  ) {
    return false;
  }


  const sameInitial =
    liveFirst[0] ===
    databaseFirst[0];


  const liveSurname =
    liveParts
      .slice(1)
      .join(" ");

  const databaseSurname =
    databaseParts
      .slice(1)
      .join(" ");


  return (
    sameInitial &&
    liveSurname ===
      databaseSurname
  );
}


function parseRound(
  value: string | null,
): TournamentRound | null {
  if (!value) {
    return null;
  }


  if (
    /Round of 128/i.test(
      value,
    )
  ) {
    return TournamentRound.ROUND_OF_128;
  }


  if (
    /Round of 64/i.test(
      value,
    )
  ) {
    return TournamentRound.ROUND_OF_64;
  }


  if (
    /Round of 32/i.test(
      value,
    )
  ) {
    return TournamentRound.ROUND_OF_32;
  }


  if (
    /Round of 16/i.test(
      value,
    )
  ) {
    return TournamentRound.ROUND_OF_16;
  }


  if (
    /Quarterfinal/i.test(
      value,
    )
  ) {
    return TournamentRound.QUARTERFINAL;
  }


  if (
    /Semifinal/i.test(
      value,
    )
  ) {
    return TournamentRound.SEMIFINAL;
  }


  if (
    /\bFinal\b/i.test(
      value,
    )
  ) {
    return TournamentRound.FINAL;
  }


  return null;
}


function parseSetScore(
  value: string,
): ParsedSetScore | null {
  const numbers =
    value
      .match(
        /\d+/g,
      )
      ?.map(
        (number) =>
          Number.parseInt(
            number,
            10,
          ),
      ) ??
    [];


  const score =
    numbers[0];


  if (
    score === undefined ||
    !Number.isFinite(
      score,
    )
  ) {
    return null;
  }


  const possibleTiebreak =
    numbers[1];


  return {
    score,

    tiebreak:
      possibleTiebreak !==
      undefined
        ? possibleTiebreak
        : null,
  };
}


function parseScoreRows(
  playerOneValues: string[],
  playerTwoValues: string[],
) {
  const setCount =
    Math.min(
      playerOneValues.length,
      playerTwoValues.length,
    );


  const sets: Array<{
    setNumber: number;

    playerOneScore: number;
    playerTwoScore: number;

    playerOneTiebreak: number | null;
    playerTwoTiebreak: number | null;

    completed: boolean;
  }> = [];


  for (
    let index = 0;
    index < setCount;
    index += 1
  ) {
    const playerOneValue =
      playerOneValues[index];

    const playerTwoValue =
      playerTwoValues[index];


    if (
      playerOneValue === undefined ||
      playerTwoValue === undefined
    ) {
      continue;
    }


    const playerOne =
      parseSetScore(
        playerOneValue,
      );

    const playerTwo =
      parseSetScore(
        playerTwoValue,
      );


    if (
      !playerOne ||
      !playerTwo
    ) {
      continue;
    }


    sets.push({
      setNumber:
        index + 1,

      playerOneScore:
        playerOne.score,

      playerTwoScore:
        playerTwo.score,

      playerOneTiebreak:
        playerOne.tiebreak,

      playerTwoTiebreak:
        playerTwo.tiebreak,

      /*
       * Durante un match LIVE consideriamo
       * l'ultimo set come quello attualmente
       * in corso.
       *
       * I precedenti sono terminati.
       */
      completed:
        index <
        setCount - 1,
    });
  }


  return sets;
}


function buildScoreSummary(
  sets: Array<{
    playerOneScore: number;
    playerTwoScore: number;
  }>,
): string | null {
  if (
    sets.length ===
    0
  ) {
    return null;
  }


  return sets
    .map(
      (set) =>
        `${set.playerOneScore}-${set.playerTwoScore}`,
    )
    .join(" ");
}


export async function syncAtpTournamentLiveScores(
  input: SyncAtpTournamentLiveScoresInput,
): Promise<SyncAtpTournamentLiveScoresResult> {
  const tournament =
    await prisma.tournament.findUnique({
      where: {
        slug:
          input.cmsTournamentSlug,
      },

      select: {
        id:
          true,

        name:
          true,
      },
    });


  if (!tournament) {
    throw new Error(
      `Tournament not found in AGE202: ${input.cmsTournamentSlug}.`,
    );
  }


  const edition =
    await prisma.tournamentEdition.findUnique({
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
      },
    });


  if (!edition) {
    throw new Error(
      `ATP tournament edition not found: ${tournament.name} ${input.year}.`,
    );
  }


  const databaseMatches =
    await prisma.tournamentMatch.findMany({
      where: {
        editionId:
          edition.id,
      },

      select: {
        id:
          true,

        round:
          true,

        status:
          true,

        startedAt:
          true,

        court:
          true,

        playerOne: {
          select: {
            name:
              true,
          },
        },

        playerTwo: {
          select: {
            name:
              true,
          },
        },
      },
    });


  const results:
    AtpLiveScoreMatchResult[] = [];


  let matched =
    0;

  let updated =
    0;

  let ambiguous =
    0;

  let unmatched =
    0;

  let skippedCompleted =
    0;


  for (
    const liveMatch
    of input.matches
  ) {
    const liveRound =
      parseRound(
        liveMatch.roundLabel,
      );


    const possibleMatches =
      databaseMatches
        .filter(
          (databaseMatch) => {
            if (
              !databaseMatch.playerOne ||
              !databaseMatch.playerTwo
            ) {
              return false;
            }


            if (
              liveRound &&
              databaseMatch.round !==
                liveRound
            ) {
              return false;
            }


            const sameOrder =
              namesEquivalent(
                liveMatch.playerOne.name,
                databaseMatch.playerOne.name,
              ) &&
              namesEquivalent(
                liveMatch.playerTwo.name,
                databaseMatch.playerTwo.name,
              );


            const reversedOrder =
              namesEquivalent(
                liveMatch.playerOne.name,
                databaseMatch.playerTwo.name,
              ) &&
              namesEquivalent(
                liveMatch.playerTwo.name,
                databaseMatch.playerOne.name,
              );


            return (
              sameOrder ||
              reversedOrder
            );
          },
        );


    if (
      possibleMatches.length ===
      0
    ) {
      unmatched +=
        1;


      results.push({
        livePlayerOne:
          liveMatch.playerOne.name,

        livePlayerTwo:
          liveMatch.playerTwo.name,

        matchId:
          null,

        matched:
          false,

        ambiguous:
          false,

        updated:
          false,

        skippedCompleted:
          false,

        scoreSummary:
          null,

        message:
          "No AGE202 match found.",
      });


      continue;
    }


    if (
      possibleMatches.length >
      1
    ) {
      ambiguous +=
        1;


      results.push({
        livePlayerOne:
          liveMatch.playerOne.name,

        livePlayerTwo:
          liveMatch.playerTwo.name,

        matchId:
          null,

        matched:
          false,

        ambiguous:
          true,

        updated:
          false,

        skippedCompleted:
          false,

        scoreSummary:
          null,

        message:
          `${possibleMatches.length} AGE202 matches found; update blocked.`,
      });


      continue;
    }


    const databaseMatch =
      possibleMatches[0];


    if (
      !databaseMatch ||
      !databaseMatch.playerOne ||
      !databaseMatch.playerTwo
    ) {
      continue;
    }


    matched +=
      1;


    if (
      databaseMatch.status ===
      TournamentMatchStatus.COMPLETED
    ) {
      skippedCompleted +=
        1;


      results.push({
        livePlayerOne:
          liveMatch.playerOne.name,

        livePlayerTwo:
          liveMatch.playerTwo.name,

        matchId:
          databaseMatch.id,

        matched:
          true,

        ambiguous:
          false,

        updated:
          false,

        skippedCompleted:
          true,

        scoreSummary:
          null,

        message:
          "AGE202 match already completed; live update skipped.",
      });


      continue;
    }


    const sameOrder =
      namesEquivalent(
        liveMatch.playerOne.name,
        databaseMatch.playerOne.name,
      ) &&
      namesEquivalent(
        liveMatch.playerTwo.name,
        databaseMatch.playerTwo.name,
      );


    const playerOneValues =
      sameOrder
        ? liveMatch.playerOneSetScores
        : liveMatch.playerTwoSetScores;

    const playerTwoValues =
      sameOrder
        ? liveMatch.playerTwoSetScores
        : liveMatch.playerOneSetScores;


    const sets =
      parseScoreRows(
        playerOneValues,
        playerTwoValues,
      );


    const scoreSummary =
      buildScoreSummary(
        sets,
      );


    if (!input.write) {
      results.push({
        livePlayerOne:
          liveMatch.playerOne.name,

        livePlayerTwo:
          liveMatch.playerTwo.name,

        matchId:
          databaseMatch.id,

        matched:
          true,

        ambiguous:
          false,

        updated:
          false,

        skippedCompleted:
          false,

        scoreSummary,

        message:
          "Dry run: match would be updated to IN_PROGRESS.",
      });


      continue;
    }


    await prisma.$transaction(
      async (
        transaction,
      ) => {
        await transaction.tournamentMatch.update({
          where: {
            id:
              databaseMatch.id,
          },

          data: {
            status:
              TournamentMatchStatus.IN_PROGRESS,

            startedAt:
              databaseMatch.startedAt ??
              input.extractedAt,

            court:
              liveMatch.court ??
              databaseMatch.court,

            scoreSummary,

            source:
              "ATP_LIVE_SCORES",

            scoreUpdatedAt:
              input.extractedAt,

            lastSyncedAt:
              input.extractedAt,
          },
        });


        for (
          const set
          of sets
        ) {
          await transaction.tournamentMatchSet.upsert({
            where: {
              matchId_setNumber: {
                matchId:
                  databaseMatch.id,

                setNumber:
                  set.setNumber,
              },
            },

            create: {
              matchId:
                databaseMatch.id,

              setNumber:
                set.setNumber,

              playerOneScore:
                set.playerOneScore,

              playerTwoScore:
                set.playerTwoScore,

              playerOneTiebreak:
                set.playerOneTiebreak,

              playerTwoTiebreak:
                set.playerTwoTiebreak,

              completed:
                set.completed,
            },

            update: {
              playerOneScore:
                set.playerOneScore,

              playerTwoScore:
                set.playerTwoScore,

              playerOneTiebreak:
                set.playerOneTiebreak,

              playerTwoTiebreak:
                set.playerTwoTiebreak,

              completed:
                set.completed,
            },
          });
        }
      },
    );


    updated +=
      1;


    results.push({
      livePlayerOne:
        liveMatch.playerOne.name,

      livePlayerTwo:
        liveMatch.playerTwo.name,

      matchId:
        databaseMatch.id,

      matched:
        true,

      ambiguous:
        false,

      updated:
        true,

      skippedCompleted:
        false,

      scoreSummary,

      message:
        "AGE202 live score updated.",
    });
  }


  return {
    tournament:
      tournament.name,

    liveMatches:
      input.matches.length,

    matched,
    updated,
    ambiguous,
    unmatched,
    skippedCompleted,

    results,
  };
}