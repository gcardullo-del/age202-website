import {
  prisma,
} from "@/lib/prisma";


export type NextGenRankingView = {
  playerKey: string;

  currentRank: number | null;

  previousRank: number | null;

  careerHighRank: number | null;

  careerHighDate: Date | null;

  lastSyncedAt: Date | null;
};


export async function getNextGenRankings():
  Promise<Map<string, NextGenRankingView>> {
  const rows =
    await prisma.nextGenRanking.findMany({
      where: {
        active:
          true,
      },

      select: {
        playerKey:
          true,

        currentRank:
          true,

        previousRank:
          true,

        careerHighRank:
          true,

        careerHighDate:
          true,

        lastSyncedAt:
          true,
      },
    });


  return new Map(
    rows.map(
      (row) => [
        row.playerKey,

        {
          playerKey:
            row.playerKey,

          currentRank:
            row.currentRank,

          previousRank:
            row.previousRank,

          careerHighRank:
            row.careerHighRank,

          careerHighDate:
            row.careerHighDate,

          lastSyncedAt:
            row.lastSyncedAt,
        },
      ],
    ),
  );
}


export async function getNextGenRankingByPlayerKey(
  playerKey: string,
): Promise<NextGenRankingView | null> {
  const row =
    await prisma.nextGenRanking.findUnique({
      where: {
        playerKey,
      },

      select: {
        playerKey:
          true,

        currentRank:
          true,

        previousRank:
          true,

        careerHighRank:
          true,

        careerHighDate:
          true,

        lastSyncedAt:
          true,
      },
    });


  if (
    !row
  ) {
    return null;
  }


  return {
    playerKey:
      row.playerKey,

    currentRank:
      row.currentRank,

    previousRank:
      row.previousRank,

    careerHighRank:
      row.careerHighRank,

    careerHighDate:
      row.careerHighDate,

    lastSyncedAt:
      row.lastSyncedAt,
  };
}