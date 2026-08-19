import "dotenv/config";

import {
  CareerEventCategory,
} from "../generated/prisma/client";

import {
  prisma,
} from "../lib/prisma";


const PLAYER_SLUG =
  "jannik-sinner";


type DavisCupCareerEventInput = {
  year: number;
  title: string;
  subtitle: string;
  description: string;
  tournament: string;
  featured: boolean;
  sortOrder: number;
};


const events:
  DavisCupCareerEventInput[] = [
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


async function findExistingEvent(
  playerId: string,
  event:
    DavisCupCareerEventInput,
) {
  return prisma.playerCareerEvent.findFirst({
    where: {
      playerId,

      year:
        event.year,

      category:
        CareerEventCategory.DAVIS_CUP,

      title:
        event.title,

      tournament:
        event.tournament,
    },

    select: {
      id: true,
      year: true,
      title: true,
      subtitle: true,
      description: true,
      category: true,
      tournament: true,
      featured: true,
      sortOrder: true,
    },
  });
}


async function main() {
  const write =
    hasWriteFlag();

  console.log("");
  console.log(
    "🇮🇹 AGE202 · SINNER DAVIS CUP CAREER BACKFILL",
  );
  console.log(
    "════════════════════════════════════════════════════════════",
  );

  console.log(
    write
      ? "💾 WRITE MODE · DATABASE WILL BE UPDATED"
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
    "🏆 DAVIS CUP CAREER EVENT PLAN",
  );
  printDivider();

  let toCreate =
    0;

  let toUpdate =
    0;

  for (
    const event
    of events
  ) {
    const existing =
      await findExistingEvent(
        player.id,
        event,
      );

    if (existing) {
      toUpdate +=
        1;

      console.log(
        `🟡 ${event.year} · existing PlayerCareerEvent · ${existing.id}`,
      );
    } else {
      toCreate +=
        1;

      console.log(
        `🆕 ${event.year} · new PlayerCareerEvent`,
      );
    }

    console.log(
      `   ${event.title}`,
    );
    console.log(
      `   ${event.subtitle}`,
    );
    console.log(
      `   ${event.description}`,
    );
    console.log("");
  }

  if (!write) {
    printDivider();
    console.log(
      "📊 DRY RUN SUMMARY",
    );
    printDivider();

    console.log(
      `Events to create: ${toCreate}`,
    );
    console.log(
      `Events to update: ${toUpdate}`,
    );
    console.log(
      `Total planned:    ${events.length}`,
    );

    console.log("");
    console.log(
      "✅ VALIDATION PLAN COMPLETED",
    );
    console.log(
      "🛡️ DATABASE UNCHANGED",
    );

    console.log("");
    console.log(
      "➡️ Per applicare il backfill:",
    );
    console.log(
      "npx tsx scripts/backfill-sinner-davis-cup.ts --write",
    );
    console.log("");

    return;
  }

  console.log("");
  printDivider();
  console.log(
    "💾 WRITING PLAYER CAREER EVENTS",
  );
  printDivider();

  let created =
    0;

  let updated =
    0;

  for (
    const event
    of events
  ) {
    const existing =
      await findExistingEvent(
        player.id,
        event,
      );

    const data = {
      year:
        event.year,

      title:
        event.title,

      subtitle:
        event.subtitle,

      description:
        event.description,

      category:
        CareerEventCategory.DAVIS_CUP,

      tournament:
        event.tournament,

      featured:
        event.featured,

      sortOrder:
        event.sortOrder,
    };

    if (existing) {
      await prisma.playerCareerEvent.update({
        where: {
          id:
            existing.id,
        },

        data,
      });

      updated +=
        1;

      console.log(
        `🟡 ${event.year} · Davis Cup career event updated`,
      );

      continue;
    }

    await prisma.playerCareerEvent.create({
      data: {
        playerId:
          player.id,

        ...data,
      },
    });

    created +=
      1;

    console.log(
      `🟢 ${event.year} · Davis Cup career event created`,
    );
  }

  console.log("");
  printDivider();
  console.log(
    "🔎 VERIFYING DAVIS CUP CAREER EVENTS",
  );
  printDivider();

  const storedEvents =
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
        tournament: true,
      },

      orderBy: {
        year:
          "asc",
      },
    });

  for (
    const event
    of storedEvents
  ) {
    console.log(
      [
        "🏆",
        event.year,
        "·",
        event.title,
        event.subtitle
          ? `· ${event.subtitle}`
          : "",
      ]
        .filter(Boolean)
        .join(" "),
    );
  }

  console.log("");
  printDivider();
  console.log(
    "🏁 DAVIS CUP BACKFILL COMPLETED",
  );
  printDivider();

  console.log(
    `Created: ${created}`,
  );
  console.log(
    `Updated: ${updated}`,
  );
  console.log(
    `Stored Davis Cup events: ${storedEvents.length}`,
  );

  console.log("");
  console.log(
    "ℹ️ Questi record sono PlayerCareerEvent, non ATP TournamentEdition.",
  );
  console.log(
    "ℹ️ Il totale ATP singles resta quindi separato dai trofei di squadra.",
  );
  console.log("");
}


main()
  .catch(
    (error: unknown) => {
      console.error("");
      console.error(
        "❌ Sinner Davis Cup career backfill failed.",
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
