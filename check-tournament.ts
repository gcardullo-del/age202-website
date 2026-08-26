import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

async function main() {
  const { prisma } = await import("./lib/prisma");

  const {
    getArtifactsByTournamentId,
  } = await import(
    "./lib/repositories/artifact.repository"
  );

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

  console.log(
    "\n========== TOURNAMENT ==========",
  );

  console.dir(
    tournament,
    {
      depth: null,
    },
  );

  if (!tournament) {
    throw new Error(
      "Tournament Cincinnati non trovato.",
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

  console.log(
    "\n========== DIRECT DATABASE QUERY ==========",
  );

  console.dir(
    directArtifacts,
    {
      depth: null,
    },
  );

  const repositoryArtifacts =
    await getArtifactsByTournamentId(
      tournament.id,
    );

  console.log(
    "\n========== PUBLIC REPOSITORY QUERY ==========",
  );

  console.dir(
    repositoryArtifacts.map(
      (artifact) => ({
        id:
          artifact.id,

        title:
          artifact.title,

        slug:
          artifact.slug,

        status:
          artifact.status,

        tournamentId:
          artifact.tournamentId,

        player: {
          name:
            artifact.player.name,

          active:
            artifact.player.active,
        },
      }),
    ),
    {
      depth: null,
    },
  );

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});