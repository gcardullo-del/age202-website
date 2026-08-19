import "dotenv/config";

import {
  CareerEventCategory,
} from "../generated/prisma/client";

import {
  prisma,
} from "../lib/prisma";


const PLAYER_SLUG =
  "jannik-sinner";


type CanonicalDavisCupEvent = {
  year: number;
  title: string;
  subtitle: string;
  description: string;
  tournament: string;
  featured: boolean;
  sortOrder: number;
};


const canonicalEvents:
  CanonicalDavisCupEvent[] = [
    {
      year:
        2023,

      title:
        "Davis Cup Champion",

      subtitle:
        "Italy defeated Australia 2–0",

      description:
        "Jannik Sinner helped Italy win the 2023 Davis Cup. In the final against Australia, Sinner defeated Alex de Minaur 6-3, 6-0.",

      tournament:
        "Davis Cup",

      featured:
        true,

      sortOrder:
        202301,
    },

    {
      year:
        2024,

      title:
        "Davis Cup Champion",

      subtitle:
        "Italy defeated the Netherlands 2–0",

      description:
        "Jannik Sinner helped Italy defend the Davis Cup title in 2024. In the final against the Netherlands, Sinner defeated Tallon Griekspoor 7-5, 6-2.",

      tournament:
        "Davis Cup",

      featured:
        true,

      sortOrder:
        202401,
    },
  ];


function hasWriteFlag(): boolean {
  return process.argv.includes(
    "--write",
  );
}


function printDivider() {
  console.log(
    "────────────────────────────────────────────────────────────",
  );
}


async function main() {
  const write =
    hasWriteFlag();

  console.log("");
  console.log(
    "🇮🇹 AGE202 · SINNER DAVIS CUP DEDUPLICATION",
  );
  console.log(
    "════════════════════════════════════════════════════════════",
  );

  console.log(
    write
      ? "💾 WRITE MODE · DUPLICATES WILL BE REMOVED"
      : "🛡️ DRY RUN · DATABASE UNCHANGED",
  );

  console.log("");

  const player =
    await prisma.player.findUnique({
      where: {
        slug:
          PLAYER_SLUG,
      },

      select: {
        id: true,
        name: true,
        slug: true,
      },
    });

  if (!player) {
    throw new Error(
      `Player non trovato: "${PLAYER_SLUG}".`,
    );
  }

  console.log(
    `👤 ${player.name} · ${player.slug}`,
  );
  console.log(
    `🆔 ${player.id}`,
  );

  console.log("");
  printDivider();
  console.log(
    "🔎 CURRENT DAVIS CUP EVENTS",
  );
  printDivider();

  const currentEvents =
    await prisma.playerCareerEvent.findMany({
      where: {
        playerId:
          player.id,

        category:
          CareerEventCategory.DAVIS_CUP,

        year: {
          in:
            canonicalEvents.map(
              (event) =>
                event.year,
            ),
        },
      },

      select: {
        id: true,
        year: true,
        title: true,
        subtitle: true,
        description: true,
        tournament: true,
        featured: true,
        sortOrder: true,
        createdAt: true,
      },

      orderBy: [
        {
          year:
            "asc",
        },
        {
          createdAt:
            "asc",
        },
      ],
    });

  for (
    const event
    of currentEvents
  ) {
    console.log(
      [
        "•",
        event.year,
        "·",
        event.id,
        "·",
        event.title,
        "·",
        event.subtitle ??
          "—",
      ].join(" "),
    );
  }

  console.log("");
  printDivider();
  console.log(
    "🧭 DEDUPLICATION PLAN",
  );
  printDivider();

  let duplicateRows =
    0;

  for (
    const canonical
    of canonicalEvents
  ) {
    const yearEvents =
      currentEvents.filter(
        (event) =>
          event.year ===
          canonical.year,
      );

    if (
      yearEvents.length ===
      0
    ) {
      console.log(
        `🆕 ${canonical.year} · no event found · canonical row will be created`,
      );

      continue;
    }

    console.log(
      `✅ ${canonical.year} · keep/update ${yearEvents[0].id}`,
    );

    if (
      yearEvents.length >
      1
    ) {
      for (
        const duplicate
        of yearEvents.slice(1)
      ) {
        duplicateRows +=
          1;

        console.log(
          `🗑️ ${canonical.year} · duplicate to remove ${duplicate.id} · ${duplicate.subtitle ?? "—"}`,
        );
      }
    }
  }

  console.log("");
  console.log(
    `Duplicate rows detected: ${duplicateRows}`,
  );

  if (!write) {
    console.log("");
    console.log(
      "✅ DEDUPLICATION PLAN VALIDATED",
    );
    console.log(
      "🛡️ DATABASE UNCHANGED",
    );

    console.log("");
    console.log(
      "➡️ Per applicare la pulizia:",
    );
    console.log(
      "npx tsx scripts/dedupe-sinner-davis-cup.ts --write",
    );
    console.log("");

    return;
  }

  console.log("");
  printDivider();
  console.log(
    "💾 APPLYING DEDUPLICATION",
  );
  printDivider();

  await prisma.$transaction(
    async (
      transaction,
    ) => {
      for (
        const canonical
        of canonicalEvents
      ) {
        const yearEvents =
          await transaction.playerCareerEvent.findMany({
            where: {
              playerId:
                player.id,

              category:
                CareerEventCategory.DAVIS_CUP,

              year:
                canonical.year,
            },

            select: {
              id: true,
              createdAt: true,
            },

            orderBy: {
              createdAt:
                "asc",
            },
          });

        const data = {
          year:
            canonical.year,

          title:
            canonical.title,

          subtitle:
            canonical.subtitle,

          description:
            canonical.description,

          category:
            CareerEventCategory.DAVIS_CUP,

          tournament:
            canonical.tournament,

          featured:
            canonical.featured,

          sortOrder:
            canonical.sortOrder,
        };

        if (
          yearEvents.length ===
          0
        ) {
          const created =
            await transaction.playerCareerEvent.create({
              data: {
                playerId:
                  player.id,

                ...data,
              },

              select: {
                id: true,
              },
            });

          console.log(
            `🟢 ${canonical.year} · canonical event created · ${created.id}`,
          );

          continue;
        }

        const keeper =
          yearEvents[0];

        await transaction.playerCareerEvent.update({
          where: {
            id:
              keeper.id,
          },

          data,
        });

        console.log(
          `🟡 ${canonical.year} · canonical event updated · ${keeper.id}`,
        );

        const duplicateIds =
          yearEvents
            .slice(1)
            .map(
              (event) =>
                event.id,
            );

        if (
          duplicateIds.length >
          0
        ) {
          const deleted =
            await transaction.playerCareerEvent.deleteMany({
              where: {
                id: {
                  in:
                    duplicateIds,
                },
              },
            });

          console.log(
            `🗑️ ${canonical.year} · duplicates removed: ${deleted.count}`,
          );
        }
      }
    },
  );

  console.log("");
  printDivider();
  console.log(
    "🔎 FINAL VERIFICATION",
  );
  printDivider();

  const finalEvents =
    await prisma.playerCareerEvent.findMany({
      where: {
        playerId:
          player.id,

        category:
          CareerEventCategory.DAVIS_CUP,
      },

      select: {
        id: true,
        year: true,
        title: true,
        subtitle: true,
      },

      orderBy: {
        year:
          "asc",
      },
    });

  for (
    const event
    of finalEvents
  ) {
    console.log(
      `🏆 ${event.year} · ${event.title} · ${event.subtitle ?? "—"} · ${event.id}`,
    );
  }

  console.log("");
  console.log(
    `Stored Davis Cup rows: ${finalEvents.length}`,
  );
  console.log(
    `Unique Davis Cup years: ${new Set(
      finalEvents.map(
        (event) =>
          event.year,
      ),
    ).size}`,
  );

  console.log("");
  console.log(
    "✅ DAVIS CUP DEDUPLICATION COMPLETED",
  );
  console.log("");
}


main()
  .catch(
    (error: unknown) => {
      console.error("");
      console.error(
        "❌ Davis Cup deduplication failed.",
      );

      if (
        error instanceof Error
      ) {
        console.error(
          error.stack ??
            error.message,
        );
      } else {
        console.error(
          error,
        );
      }

      process.exitCode =
        1;
    },
  )
  .finally(
    async () => {
      await prisma.$disconnect();
    },
  );
