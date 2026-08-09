import {
  NextResponse,
} from "next/server";

import {
  getMuseumTournamentBySlug,
} from "@/lib/services/museum/tournament.service";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(
  _request: Request,
  context: RouteContext,
) {
  const {
    slug,
  } = await context.params;

  const tournament =
    await getMuseumTournamentBySlug(
      slug,
    );

  if (!tournament) {
    return NextResponse.json(
      {
        error:
          "Tournament not found.",
      },
      {
        status: 404,
      },
    );
  }

  return NextResponse.json(
    tournament,
    {
      status: 200,
    },
  );
}