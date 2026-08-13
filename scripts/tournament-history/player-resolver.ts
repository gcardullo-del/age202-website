import { prisma } from "../../lib/prisma";

import type {
  TournamentHistoryPlayerRef,
} from "./types";

async function findActivePlayerIdBySlug(
  slug: string,
): Promise<string | null> {
  const normalizedSlug =
    slug.trim().toLowerCase();

  if (!normalizedSlug) {
    return null;
  }

  const player =
    await prisma.player.findFirst({
      where: {
        slug: normalizedSlug,
        active: true,
      },
      select: {
        id: true,
      },
    });

  return player?.id ?? null;
}

async function findActivePlayerIdByName(
  name: string,
): Promise<string | null> {
  const normalizedName =
    name.trim();

  if (!normalizedName) {
    return null;
  }

  const player =
    await prisma.player.findFirst({
      where: {
        name: {
          equals: normalizedName,
          mode: "insensitive",
        },
        active: true,
      },
      select: {
        id: true,
      },
    });

  return player?.id ?? null;
}

export async function resolveTournamentHistoryPlayerId(
  playerRef:
    | TournamentHistoryPlayerRef
    | null
    | undefined,
  playerName?: string | null,
): Promise<string | null> {
  if (playerRef) {
    for (
      const slug
      of playerRef.slugCandidates
    ) {
      const playerId =
        await findActivePlayerIdBySlug(
          slug,
        );

      if (playerId) {
        return playerId;
      }
    }
  }

  if (playerName) {
    const playerId =
      await findActivePlayerIdByName(
        playerName,
      );

    if (playerId) {
      return playerId;
    }
  }

  return null;
}

export async function resolveTournamentHistoryPlayerIds(
  championPlayer:
    | TournamentHistoryPlayerRef
    | null
    | undefined,
  runnerUpPlayer:
    | TournamentHistoryPlayerRef
    | null
    | undefined,
  championName?: string | null,
  runnerUpName?: string | null,
): Promise<{
  championPlayerId: string | null;
  runnerUpPlayerId: string | null;
}> {
  const [
    championPlayerId,
    runnerUpPlayerId,
  ] = await Promise.all([
    resolveTournamentHistoryPlayerId(
      championPlayer,
      championName,
    ),
    resolveTournamentHistoryPlayerId(
      runnerUpPlayer,
      runnerUpName,
    ),
  ]);

  return {
    championPlayerId,
    runnerUpPlayerId,
  };
}