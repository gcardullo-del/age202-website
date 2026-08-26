import {
  config,
} from "dotenv";

import {
  PlayerTrophyCategory,
} from "@/generated/prisma/client";


config();


type TrophySeed = {
  tournamentKey: string;
  tournamentName: string;
  category: PlayerTrophyCategory;
  year: number;
};


const SABALENKA_TROPHIES: TrophySeed[] = [
  // ─────────────────────────────────────
  // GRAND SLAM
  // ─────────────────────────────────────

  {
    tournamentKey: "australian-open",
    tournamentName: "Australian Open",
    category: PlayerTrophyCategory.GRAND_SLAM,
    year: 2023,
  },
  {
    tournamentKey: "australian-open",
    tournamentName: "Australian Open",
    category: PlayerTrophyCategory.GRAND_SLAM,
    year: 2024,
  },
  {
    tournamentKey: "us-open",
    tournamentName: "US Open",
    category: PlayerTrophyCategory.GRAND_SLAM,
    year: 2024,
  },
  {
    tournamentKey: "us-open",
    tournamentName: "US Open",
    category: PlayerTrophyCategory.GRAND_SLAM,
    year: 2025,
  },

  // ─────────────────────────────────────
  // WTA 1000
  // ─────────────────────────────────────

  {
    tournamentKey: "wuhan",
    tournamentName: "Wuhan",
    category: PlayerTrophyCategory.WTA_1000,
    year: 2018,
  },
  {
    tournamentKey: "wuhan",
    tournamentName: "Wuhan",
    category: PlayerTrophyCategory.WTA_1000,
    year: 2019,
  },
  {
    tournamentKey: "doha",
    tournamentName: "Doha",
    category: PlayerTrophyCategory.WTA_1000,
    year: 2020,
  },
  {
    tournamentKey: "madrid",
    tournamentName: "Madrid",
    category: PlayerTrophyCategory.WTA_1000,
    year: 2021,
  },
  {
    tournamentKey: "madrid",
    tournamentName: "Madrid",
    category: PlayerTrophyCategory.WTA_1000,
    year: 2023,
  },
  {
    tournamentKey: "cincinnati",
    tournamentName: "Cincinnati",
    category: PlayerTrophyCategory.WTA_1000,
    year: 2024,
  },
  {
    tournamentKey: "wuhan",
    tournamentName: "Wuhan",
    category: PlayerTrophyCategory.WTA_1000,
    year: 2024,
  },
  {
    tournamentKey: "miami",
    tournamentName: "Miami",
    category: PlayerTrophyCategory.WTA_1000,
    year: 2025,
  },
  {
    tournamentKey: "madrid",
    tournamentName: "Madrid",
    category: PlayerTrophyCategory.WTA_1000,
    year: 2025,
  },
  {
    tournamentKey: "indian-wells",
    tournamentName: "Indian Wells",
    category: PlayerTrophyCategory.WTA_1000,
    year: 2026,
  },
  {
    tournamentKey: "miami",
    tournamentName: "Miami",
    category: PlayerTrophyCategory.WTA_1000,
    year: 2026,
  },
];


async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is missing.",
    );
  }

  const {
    prisma,
  } =
    await import(
      "@/lib/prisma"
    );

  console.log("");
  console.log(
    "🏆 AGE202 · SABALENKA TROPHY CABINET BACKFILL",
  );
  console.log(
    "─────────────────────────────────────────────",
  );
  console.log("");

  const player =
    await prisma.player.findUnique({
      where: {
        slug:
          "aryna-sabalenka",
      },

      select: {
        id: true,
        name: true,
        slug: true,
      },
    });

  if (!player) {
    throw new Error(
      'AGE202 Player "aryna-sabalenka" not found.',
    );
  }

  console.log(
    `🎾 Player: ${player.name} (${player.slug})`,
  );
  console.log("");

  let created =
    0;

  let existing =
    0;

  for (
    const trophy of SABALENKA_TROPHIES
  ) {
    const current =
      await prisma.playerTrophyWin.findUnique({
        where: {
          playerId_tournamentKey_year: {
            playerId:
              player.id,

            tournamentKey:
              trophy.tournamentKey,

            year:
              trophy.year,
          },
        },

        select: {
          id: true,
        },
      });

    if (current) {
      existing +=
        1;

      console.log(
        `↩️  Già presente: ${trophy.tournamentName} ${trophy.year}`,
      );

      continue;
    }

    await prisma.playerTrophyWin.create({
      data: {
        playerId:
          player.id,

        tournamentKey:
          trophy.tournamentKey,

        tournamentName:
          trophy.tournamentName,

        category:
          trophy.category,

        year:
          trophy.year,

        verified:
          true,
      },
    });

    created +=
      1;

    console.log(
      `✅ Creato: ${trophy.tournamentName} ${trophy.year}`,
    );
  }

  const trophies =
    await prisma.playerTrophyWin.findMany({
      where: {
        playerId:
          player.id,

        category: {
          in: [
            PlayerTrophyCategory.GRAND_SLAM,
            PlayerTrophyCategory.WTA_1000,
          ],
        },
      },

      select: {
        tournamentKey:
          true,

        tournamentName:
          true,

        category:
          true,

        year:
          true,
      },

      orderBy: [
        {
          category:
            "asc",
        },
        {
          year:
            "asc",
        },
      ],
    });

  const grandSlams =
    trophies.filter(
      (trophy) =>
        trophy.category ===
        PlayerTrophyCategory.GRAND_SLAM,
    );

  const wta1000 =
    trophies.filter(
      (trophy) =>
        trophy.category ===
        PlayerTrophyCategory.WTA_1000,
    );

  function printCabinet(
    title: string,
    items: typeof trophies,
  ) {
    console.log("");
    console.log(
      title,
    );
    console.log(
      "─────────────────────────────────────────────",
    );

    const grouped =
      new Map<
        string,
        {
          name: string;
          years: number[];
        }
      >();

    for (
      const trophy of items
    ) {
      const current =
        grouped.get(
          trophy.tournamentKey,
        );

      if (current) {
        current.years.push(
          trophy.year,
        );

        continue;
      }

      grouped.set(
        trophy.tournamentKey,
        {
          name:
            trophy.tournamentName,

          years: [
            trophy.year,
          ],
        },
      );
    }

    for (
      const trophy of grouped.values()
    ) {
      console.log(
        `🏆 ${trophy.name} × ${trophy.years.length}`,
      );

      console.log(
        `   ${trophy.years.join(", ")}`,
      );
    }

    console.log("");
    console.log(
      `Totale: ${items.length}`,
    );
  }

  printCabinet(
    "🏛️ GRAND SLAM",
    grandSlams,
  );

  printCabinet(
    "🏛️ WTA 1000",
    wta1000,
  );

  console.log("");
  console.log(
    "─────────────────────────────────────────────",
  );
  console.log(
    `🏆 Trophy Cabinet totale: ${trophies.length}`,
  );
  console.log(
    `   Grand Slam: ${grandSlams.length}`,
  );
  console.log(
    `   WTA 1000: ${wta1000.length}`,
  );
  console.log("");
  console.log(
    `🆕 Creati: ${created}`,
  );
  console.log(
    `↩️  Già presenti: ${existing}`,
  );
}


main().catch(
  (
    error: unknown,
  ) => {
    console.error("");
    console.error(
      "❌ Sabalenka Trophy Cabinet backfill fallito.",
    );

    console.error(
      error,
    );

    process.exitCode =
      1;
  },
);