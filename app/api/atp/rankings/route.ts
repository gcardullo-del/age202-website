import {
  NextRequest,
  NextResponse,
} from "next/server";

import { getRanking } from "@/lib/services/atp-ranking.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEFAULT_LIMIT = 150;
const MAX_LIMIT = 150;

function parseLimit(
  value: string | null,
): number {
  if (!value) {
    return DEFAULT_LIMIT;
  }

  const parsedValue = Number(value);

  if (!Number.isFinite(parsedValue)) {
    return DEFAULT_LIMIT;
  }

  return Math.min(
    Math.max(Math.trunc(parsedValue), 1),
    MAX_LIMIT,
  );
}

export async function GET(
  request: NextRequest,
) {
  try {
    const limit = parseLimit(
      request.nextUrl.searchParams.get("limit"),
    );

    const players = await getRanking(limit);

    const latestRankingDate =
      players.length > 0
        ? players.reduce(
            (latestDate, player) => {
              const playerDate = new Date(
                player.rankingDate,
              );

              return playerDate > latestDate
                ? playerDate
                : latestDate;
            },
            new Date(players[0].rankingDate),
          )
        : null;

    const source =
      players.length > 0
        ? players[0].source
        : "AGE202";

    const playersWithCollections =
      players.filter(
        (player) =>
          player.hasAvailableArtifacts,
      ).length;

    return NextResponse.json(
      {
        players,
        metadata: {
          source,
          rankingType: "singles",
          requestedLimit: limit,
          totalPlayers: players.length,
          playersWithCollections,
          updatedAt:
            latestRankingDate?.toISOString() ??
            null,
          isLive: false,
          isComplete:
            players.length === MAX_LIMIT,
        },
      },
      {
        status: 200,
        headers: {
          "Cache-Control":
            "no-store, max-age=0",
        },
      },
    );
  } catch (error) {
    console.error(
      "[API /api/atp/rankings]",
      error,
    );

    return NextResponse.json(
      {
        players: [],
        metadata: {
          source: "AGE202",
          rankingType: "singles",
          requestedLimit: DEFAULT_LIMIT,
          totalPlayers: 0,
          playersWithCollections: 0,
          updatedAt: null,
          isLive: false,
          isComplete: false,
        },
        error:
          "Impossibile caricare la classifica ATP.",
      },
      {
        status: 500,
        headers: {
          "Cache-Control":
            "no-store, max-age=0",
        },
      },
    );
  }
}
