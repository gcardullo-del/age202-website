import "dotenv/config";

import {
  TournamentCategory,
} from "../generated/prisma/client";

import {
  prisma,
} from "../lib/prisma";


const PLAYER_SLUG =
  "novak-djokovic";

const EXPECTED = {
  tourLevelTitles:
    101,

  olympicGold:
    1,

  atpSinglesTitlesExcludingOlympics:
    100,

  grandSlams:
    24,

  masters1000:
    40,

  atpFinals:
    7,

  lowerTierCombined:
    29,
} as const;


function printDivider() {
  console.log(
    "────────────────────────────────────────────────────────────",
  );
}


async function main() {
  console.log("");
  console.log(
    "🎾 AGE202 · DJOKOVIC CAREER GAP AUDIT",
  );
  console.log(
    "════════════════════════════════════════════════════════════",
  );
  console.log(
    "🛡️ READ ONLY · DATABASE UNCHANGED",
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
    `👤 ${player.name}`,
  );
  console.log(
    `🔗 ${player.slug}`,
  );
  console.log(
    `🆔 ${player.id}`,
  );
  console.log("");

  const linkedEditions =
    await prisma.tournamentEdition.findMany({
      where: {
        cancelled:
          false,

        OR: [
          {
            championPlayerId:
              player.id,
          },
          {
            runnerUpPlayerId:
              player.id,
          },
        ],
      },

      include: {
        tournament: {
          select: {
            name: true,
            slug: true,
            category: true,
          },
        },
      },

      orderBy: [
        {
          year:
            "asc",
        },
        {
          tournament: {
            name:
              "asc",
          },
        },
      ],
    });

  const linkedTitles =
    linkedEditions.filter(
      (edition) =>
        edition.championPlayerId ===
        player.id,
    );

  const countTitlesByCategory = (
    category:
      TournamentCategory,
  ) =>
    linkedTitles.filter(
      (edition) =>
        edition.tournament.category ===
        category,
    ).length;

  const grandSlams =
    countTitlesByCategory(
      TournamentCategory.GRAND_SLAM,
    );

  const masters1000 =
    countTitlesByCategory(
      TournamentCategory.MASTERS_1000,
    );

  const atp500 =
    countTitlesByCategory(
      TournamentCategory.ATP_500,
    );

  const atp250 =
    countTitlesByCategory(
      TournamentCategory.ATP_250,
    );

  const atpFinals =
    countTitlesByCategory(
      TournamentCategory.ATP_FINALS,
    );

  const olympics =
    countTitlesByCategory(
      TournamentCategory.OLYMPICS,
    );

  const other =
    countTitlesByCategory(
      TournamentCategory.OTHER,
    );

  const davisCupTournamentRows =
    countTitlesByCategory(
      TournamentCategory.DAVIS_CUP,
    );

  const atpSinglesTitlesExcludingOlympics =
    grandSlams +
    masters1000 +
    atp500 +
    atp250 +
    atpFinals;

  const lowerTierCombined =
    atp500 +
    atp250;

  printDivider();
  console.log(
    "📊 LINKED TITLE RECORD",
  );
  printDivider();

  console.log(
    `Grand Slams:        ${grandSlams}`,
  );
  console.log(
    `Masters 1000:       ${masters1000}`,
  );
  console.log(
    `ATP 500:            ${atp500}`,
  );
  console.log(
    `ATP 250:            ${atp250}`,
  );
  console.log(
    `ATP Finals:         ${atpFinals}`,
  );
  console.log(
    `Olympics:           ${olympics}`,
  );
  console.log(
    `Other:              ${other}`,
  );
  console.log(
    `Davis Cup rows:     ${davisCupTournamentRows}`,
  );
  console.log("");

  printDivider();
  console.log(
    "🎯 VERIFIED CAREER TARGETS",
  );
  printDivider();

  console.log(
    `Tour-level titles incl. Olympics: ${EXPECTED.tourLevelTitles}`,
  );
  console.log(
    `Olympic singles gold:             ${EXPECTED.olympicGold}`,
  );
  console.log(
    `ATP categories excl. Olympics:    ${EXPECTED.atpSinglesTitlesExcludingOlympics}`,
  );
  console.log(
    `Grand Slams:                      ${EXPECTED.grandSlams}`,
  );
  console.log(
    `Masters 1000:                     ${EXPECTED.masters1000}`,
  );
  console.log(
    `ATP Finals:                       ${EXPECTED.atpFinals}`,
  );
  console.log(
    `ATP 500 + ATP 250 combined:       ${EXPECTED.lowerTierCombined}`,
  );
  console.log("");

  printDivider();
  console.log(
    "🧮 GAP ANALYSIS",
  );
  printDivider();

  console.log(
    `Grand Slam gap:        ${Math.max(
      0,
      EXPECTED.grandSlams -
        grandSlams,
    )}`,
  );

  console.log(
    `Masters 1000 gap:      ${Math.max(
      0,
      EXPECTED.masters1000 -
        masters1000,
    )}`,
  );

  console.log(
    `ATP Finals gap:        ${Math.max(
      0,
      EXPECTED.atpFinals -
        atpFinals,
    )}`,
  );

  console.log(
    `ATP 500+250 gap:       ${Math.max(
      0,
      EXPECTED.lowerTierCombined -
        lowerTierCombined,
    )}`,
  );

  console.log(
    `Olympics gap:          ${Math.max(
      0,
      EXPECTED.olympicGold -
        olympics,
    )}`,
  );

  console.log(
    `ATP-category gap:      ${Math.max(
      0,
      EXPECTED.atpSinglesTitlesExcludingOlympics -
        atpSinglesTitlesExcludingOlympics,
    )}`,
  );

  console.log("");

  printDivider();
  console.log(
    "📚 LINKED TITLES BY YEAR",
  );
  printDivider();

  const titlesByYear =
    new Map<
      number,
      typeof linkedTitles
    >();

  for (
    const edition
    of linkedTitles
  ) {
    const current =
      titlesByYear.get(
        edition.year,
      ) ??
      [];

    current.push(
      edition,
    );

    titlesByYear.set(
      edition.year,
      current,
    );
  }

  for (
    const [
      year,
      editions,
    ]
    of titlesByYear.entries()
  ) {
    console.log("");
    console.log(
      `📅 ${year} · ${editions.length} linked title${editions.length === 1 ? "" : "s"}`,
    );

    for (
      const edition
      of editions
    ) {
      console.log(
        `   🏆 ${String(
          edition.tournament.category,
        )} · ${edition.tournament.name}`,
      );
    }
  }

  console.log("");
  printDivider();
  console.log(
    "📊 AUDIT SUMMARY",
  );
  printDivider();

  console.log(
    `Linked editions:                  ${linkedEditions.length}`,
  );
  console.log(
    `Linked title rows (all cats):      ${linkedTitles.length}`,
  );
  console.log(
    `ATP-category titles excl Olympics: ${atpSinglesTitlesExcludingOlympics}`,
  );
  console.log(
    `Expected ATP-category titles:      ${EXPECTED.atpSinglesTitlesExcludingOlympics}`,
  );
  console.log(
    `Missing ATP-category titles:       ${Math.max(
      0,
      EXPECTED.atpSinglesTitlesExcludingOlympics -
        atpSinglesTitlesExcludingOlympics,
    )}`,
  );

  console.log("");
  console.log(
    "ℹ️ Nota: il totale ATP ufficiale di 101 include l'oro olimpico di Parigi 2024.",
  );
  console.log(
    "ℹ️ Nel motore AGE202 l'Olympics è una categoria separata, quindi il target delle categorie ATP usate dal Trophy Engine è 100.",
  );

  console.log("");
  console.log(
    "➡️ Next step: confrontiamo l'elenco per anno con il palmarès ufficiale e costruiamo discovery/backfill solo per i titoli realmente assenti.",
  );

  console.log("");
  console.log(
    "✅ DJOKOVIC CAREER GAP AUDIT COMPLETED",
  );
  console.log(
    "🛡️ DATABASE UNCHANGED",
  );
  console.log("");
}


main()
  .catch(
    (error: unknown) => {
      console.error("");
      console.error(
        "❌ Djokovic career gap audit failed.",
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
