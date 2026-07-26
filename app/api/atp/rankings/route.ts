import { NextRequest, NextResponse } from "next/server";

import { getAtpRanking } from "@/lib/atp/ranking";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function parseLimit(value: string | null): number {
  if (!value) {
    return 150;
  }

  const parsedValue = Number(value);

  if (!Number.isFinite(parsedValue)) {
    return 150;
  }

  return Math.min(Math.max(Math.trunc(parsedValue), 1), 150);
}

export async function GET(request: NextRequest) {
  try {
    const limit = parseLimit(
      request.nextUrl.searchParams.get("limit"),
    );

    const ranking = await getAtpRanking(limit);

    return NextResponse.json(ranking, {
      status: 200,
      headers: {
        "Cache-Control":
          "public, s-maxage=43200, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("[API /api/atp/rankings]", error);

    return NextResponse.json(
      {
        players: [],
        metadata: {
          source: "ATP Tour",
          rankingType: "singles",
          totalPlayers: 0,
          updatedAt: new Date().toISOString(),
          isLive: false,
        },
        error: "Unable to load ATP rankings.",
      },
      {
        status: 500,
      },
    );
  }
}