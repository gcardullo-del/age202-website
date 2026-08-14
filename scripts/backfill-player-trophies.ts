import "dotenv/config";

import { prisma } from "../lib/prisma";

type TrophyAccumulator = {
  australianOpen: number;
  rolandGarros: number;
  wimbledon: number;
  usOpen: number;

  grandSlams: number;

  masters1000: number;
  atpFinals: number;
  olympicGold: number;
  davisCup: number;
};

function createEmptyTrophies(): TrophyAccumulator {
  return {
    australianOpen: 0,
    rolandGarros: 0,
    wimbledon: 0,
    usOpen: 0,

    grandSlams: 0,

    masters1000: 0,
    atpFinals: 0,
    olympicGold: 0,
    davisCup: 0,
  };
}

function normalizeSlug(
  value: string,
): string {
  return value
    .trim()
    .toLowerCase();
}

function isAustralianOpen(
  slug: string,
): boolean {
  return (
    slug === "australian-open" ||
    slug.includes("australian-open")
  );
}

function isRolandGarros(
  slug: string,
): boolean {
  return (
    slug === "roland-garros" ||
    slug.includes("roland-garros") ||
    slug.includes("french-open")
  );
}

function isWimbledon(
  slug: string,
): boolean {
  return slug.includes("wimbledon");
}

function isUsOpen(
  slug: string,
): boolean {
  return (
    slug === "us-open" ||
    slug.includes("us-open")
  );
}

function preserveHigherValue(
  existing: number | null | undefined,
  calculated: number,
): number {
  return Math.max(
    existing ?? 0,
    calculated,
  );
}

async function main() {
  console.log("");
  console.log(
    "🏆 AGE202 Trophy Cabinet Backfill",
  );
  console.log(
    "────────────────────────────────────────",
  );
  console.log("");

  const topPlayersRaw =
    await prisma.atpPlayer.findMany({
      where: {
        active: true,

        rank: {
          lte: 50,
        },

        playerId: {
          not: null,
        },
      },

      select: {
        rank: true,

        player: {
          select: {
            id: true,
            name: true,
            slug: true,

            playerProfile: {
              select: {
                atpTitles: true,
                australianOpen: true,
                rolandGarros: true,
                wimbledon: true,
                usOpen: true,
                grandSlams: true,
                masters1000: true,
                atpFinals: true,
                olympicGold: true,
                davisCup: true,
              },
            },
          },
        },
      },

      orderBy: {
        rank: "asc",
      },
    });

  const players =
    topPlayersRaw
      .filter(
        (
          entry,
        ): entry is typeof entry & {
          player: NonNullable<
            typeof entry.player
          >;
        } =>
          entry.player !== null,
      )
      .map((entry) => ({
        rank:
          entry.rank,

        id:
          entry.player.id,

        name:
          entry.player.name,

        slug:
          entry.player.slug,

        playerProfile:
          entry.player.playerProfile,
      }));

  const playerIds =
    players.map(
      (player) =>
        player.id,
    );

  const editions =
    await prisma.tournamentEdition.findMany({
      where: {
        cancelled: false,

        championPlayerId: {
          in: playerIds,
        },
      },

      select: {
        championPlayerId: true,

        tournament: {
          select: {
            name: true,
            slug: true,
            category: true,
          },
        },
      },
    });

  const trophiesByPlayer =
    new Map<
      string,
      TrophyAccumulator
    >();

  for (
    const player
    of players
  ) {
    trophiesByPlayer.set(
      player.id,
      createEmptyTrophies(),
    );
  }

  for (
    const edition
    of editions
  ) {
    const playerId =
      edition.championPlayerId;

    if (!playerId) {
      continue;
    }

    const trophies =
      trophiesByPlayer.get(
        playerId,
      );

    if (!trophies) {
      continue;
    }

    const tournamentSlug =
      normalizeSlug(
        edition.tournament.slug,
      );

    switch (
      edition.tournament.category
    ) {
      case "GRAND_SLAM": {
        if (
          isAustralianOpen(
            tournamentSlug,
          )
        ) {
          trophies.australianOpen +=
            1;
        } else if (
          isRolandGarros(
            tournamentSlug,
          )
        ) {
          trophies.rolandGarros +=
            1;
        } else if (
          isWimbledon(
            tournamentSlug,
          )
        ) {
          trophies.wimbledon +=
            1;
        } else if (
          isUsOpen(
            tournamentSlug,
          )
        ) {
          trophies.usOpen +=
            1;
        }

        break;
      }

      case "MASTERS_1000": {
        trophies.masters1000 +=
          1;
        break;
      }

      case "ATP_FINALS": {
        trophies.atpFinals +=
          1;
        break;
      }

      case "OLYMPICS": {
        trophies.olympicGold +=
          1;
        break;
      }

      case "DAVIS_CUP": {
        trophies.davisCup +=
          1;
        break;
      }

      default: {
        break;
      }
    }
  }

  let updatedPlayers =
    0;

  let createdProfiles =
    0;

  await prisma.$transaction(
    async (
      tx,
    ) => {
      for (
        const player
        of players
      ) {
        const calculated =
          trophiesByPlayer.get(
            player.id,
          );

        if (!calculated) {
          continue;
        }

        calculated.grandSlams =
          calculated.australianOpen +
          calculated.rolandGarros +
          calculated.wimbledon +
          calculated.usOpen;

        const existing =
          player.playerProfile;

        const finalAustralianOpen =
          preserveHigherValue(
            existing?.australianOpen,
            calculated.australianOpen,
          );

        const finalRolandGarros =
          preserveHigherValue(
            existing?.rolandGarros,
            calculated.rolandGarros,
          );

        const finalWimbledon =
          preserveHigherValue(
            existing?.wimbledon,
            calculated.wimbledon,
          );

        const finalUsOpen =
          preserveHigherValue(
            existing?.usOpen,
            calculated.usOpen,
          );

        const finalGrandSlams =
          preserveHigherValue(
            existing?.grandSlams,
            finalAustralianOpen +
              finalRolandGarros +
              finalWimbledon +
              finalUsOpen,
          );

        const finalMasters1000 =
          preserveHigherValue(
            existing?.masters1000,
            calculated.masters1000,
          );

        const finalAtpFinals =
          preserveHigherValue(
            existing?.atpFinals,
            calculated.atpFinals,
          );

        const finalOlympicGold =
          preserveHigherValue(
            existing?.olympicGold,
            calculated.olympicGold,
          );

        const finalDavisCup =
          preserveHigherValue(
            existing?.davisCup,
            calculated.davisCup,
          );

        await tx.playerProfile.upsert({
          where: {
            playerId:
              player.id,
          },

          create: {
            playerId:
              player.id,

            atpTitles:
              existing?.atpTitles ??
              0,

            australianOpen:
              finalAustralianOpen,

            rolandGarros:
              finalRolandGarros,

            wimbledon:
              finalWimbledon,

            usOpen:
              finalUsOpen,

            grandSlams:
              finalGrandSlams,

            masters1000:
              finalMasters1000,

            atpFinals:
              finalAtpFinals,

            olympicGold:
              finalOlympicGold,

            davisCup:
              finalDavisCup,
          },

          update: {
            australianOpen:
              finalAustralianOpen,

            rolandGarros:
              finalRolandGarros,

            wimbledon:
              finalWimbledon,

            usOpen:
              finalUsOpen,

            grandSlams:
              finalGrandSlams,

            masters1000:
              finalMasters1000,

            atpFinals:
              finalAtpFinals,

            olympicGold:
              finalOlympicGold,

            davisCup:
              finalDavisCup,
          },
        });

        if (
          existing
        ) {
          updatedPlayers +=
            1;
        } else {
          createdProfiles +=
            1;
        }

        console.log(
          [
            `#${String(
              player.rank,
            ).padStart(
              2,
              "0",
            )}`,
            player.name,
            `AO ${finalAustralianOpen}`,
            `RG ${finalRolandGarros}`,
            `WIM ${finalWimbledon}`,
            `USO ${finalUsOpen}`,
            `GS ${finalGrandSlams}`,
            `M1000 ${finalMasters1000}`,
            `FINALS ${finalAtpFinals}`,
            `OG ${finalOlympicGold}`,
            `DC ${finalDavisCup}`,
          ].join(
            " | ",
          ),
        );
      }
    },
  );

  console.log("");
  console.log(
    "────────────────────────────────────────",
  );

  console.log(
    `Top 50 players processed: ${players.length}`,
  );

  console.log(
    `Profiles updated: ${updatedPlayers}`,
  );

  console.log(
    `Profiles created: ${createdProfiles}`,
  );

  console.log("");
  console.log(
    "🏆 Trophy Cabinet backfill completed.",
  );

  console.log(
    "Existing higher values were preserved.",
  );

  console.log("");
}

main()
  .catch(
    (error) => {
      console.error("");
      console.error(
        "❌ AGE202 Trophy Cabinet backfill failed.",
      );

      console.error(
        error,
      );

      console.error("");

      process.exitCode =
        1;
    },
  )
  .finally(
    async () => {
      await prisma.$disconnect();
    },
  );