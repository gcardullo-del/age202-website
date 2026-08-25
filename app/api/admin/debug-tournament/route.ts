import {
  NextResponse,
} from "next/server";

import {
  requireAdmin,
  getAdminAuthErrorStatus,
} from "@/lib/auth/admin-auth";

import {
  prisma,
} from "@/lib/prisma";

import {
  getArtifactsByTournamentId,
} from "@/lib/repositories/artifact.repository";

export const dynamic =
  "force-dynamic";

export const revalidate =
  0;

export async function GET() {
  try {
    await requireAdmin();

    const tournament =
      await prisma.tournament.findFirst({
        where: {
          slug: "cincinnati",
        },

        select: {
          id: true,
          name: true,
          slug: true,
          active: true,
        },
      });

    if (!tournament) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Tournament Cincinnati non trovato.",
        },
        {
          status: 404,
        },
      );
    }

    const directArtifacts =
      await prisma.artifact.findMany({
        where: {
          tournamentId:
            tournament.id,
        },

        select: {
          id: true,
          title: true,
          slug: true,
          status: true,
          tournament: true,
          tournamentId: true,

          player: {
            select: {
              id: true,
              name: true,
              slug: true,
              active: true,
            },
          },
        },
      });

    const publicArtifacts =
      await getArtifactsByTournamentId(
        tournament.id,
      );

    return NextResponse.json(
      {
        ok: true,

        environment:
          process.env.VERCEL_ENV ??
          process.env.NODE_ENV ??
          "unknown",

        tournament,

        directArtifacts,

        publicRepositoryArtifacts:
          publicArtifacts.map(
            (artifact) => ({
              id:
                artifact.id,

              title:
                artifact.title,

              slug:
                artifact.slug,

              status:
                artifact.status,

              tournament:
                artifact.tournament,

              tournamentId:
                artifact.tournamentId,

              player: {
                id:
                  artifact.player.id,

                name:
                  artifact.player.name,

                slug:
                  artifact.player.slug,

                active:
                  artifact.player.active,
              },
            }),
          ),
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
      "Debug tournament error:",
      error,
    );

    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Unexpected error",
      },
      {
        status:
          getAdminAuthErrorStatus(
            error,
          ),
      },
    );
  }
}