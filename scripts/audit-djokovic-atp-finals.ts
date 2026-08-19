import "dotenv/config";

import {
  TournamentCategory,
} from "../generated/prisma/client";

import {
  prisma,
} from "../lib/prisma";

/* =========================================================
   CONSTANTS
========================================================= */

const DJOKOVIC_SLUG =
  "novak-djokovic";

const ATP_FINALS_YEARS = [
  2008,
  2012,
  2013,
  2014,
  2015,
  2022,
  2023,
] as const;

/* =========================================================
   HELPERS
========================================================= */

function printDivider() {
  console.log(
    "────────────────────────────────────────────────────────────",
  );
}

function normalizeName(
  value: string | null | undefined,
): string {
  return (
    value
      ?.trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(
        /[\u0300-\u036f]/g,
        "",
      )
      .replace(
        /[^a-z0-9]+/g,
        " ",
      )
      .trim() ?? ""
  );
}

function isDjokovicName(
  value: string | null | undefined,
): boolean {
  const normalized =
    normalizeName(value);

  return (
    normalized ===
      "novak djokovic" ||
    normalized ===
      "novak dokovic" ||
    normalized ===
      "novak djoković"
  );
}

/* =========================================================
   MAIN
========================================================= */

async function main() {
  console.log("");
  console.log(
    "🏆 AGE202 · DJOKOVIC ATP FINALS AUDIT",
  );
  console.log(
    "════════════════════════════════════════════════════════════",
  );
  console.log(
    "🛡️ READ ONLY · DATABASE UNCHANGED",
  );
  console.log("");

  /* =======================================================
     PLAYER
  ======================================================= */

  const djokovic =
    await prisma.player.findUnique({
      where: {
        slug:
          DJOKOVIC_SLUG,
      },

      select: {
        id: true,
        name: true,
        slug: true,
      },
    });

  if (!djokovic) {
    throw new Error(
      `Player "${DJOKOVIC_SLUG}" non trovato.`,
    );
  }

  console.log(
    `👤 ${djokovic.name} · ${djokovic.slug}`,
  );
  console.log(
    `🆔 ${djokovic.id}`,
  );

  console.log("");

  /* =======================================================
     ATP FINALS TOURNAMENT IDENTITY
  ======================================================= */

  const tournaments =
    await prisma.tournament.findMany({
      where: {
        category:
          TournamentCategory.ATP_FINALS,
      },

      select: {
        id: true,
        slug: true,
        name: true,
        shortName: true,
        city: true,
        country: true,
        surface: true,
        active: true,
      },

      orderBy: {
        name: "asc",
      },
    });

  printDivider();
  console.log(
    "🏛️ ATP FINALS TOURNAMENT IDENTITY",
  );
  printDivider();

  if (
    tournaments.length ===
    0
  ) {
    console.log(
      "❌ Nessun Tournament con categoria ATP_FINALS trovato.",
    );

    console.log("");
    console.log(
      "➡️ Prima di qualsiasi backfill dobbiamo creare/risolvere l'identità ATP Finals.",
    );

    return;
  }

  for (
    const tournament
    of tournaments
  ) {
    console.log(
      [
        "•",
        tournament.name,
        `· ${tournament.slug}`,
        `· ${tournament.city ?? "—"}`,
        `· ${tournament.country ?? "—"}`,
        `· ${String(
          tournament.surface,
        )}`,
      ].join(" "),
    );
  }

  if (
    tournaments.length >
    1
  ) {
    console.log("");
    console.log(
      "⚠️ Sono presenti più Tournament ATP_FINALS.",
    );
    console.log(
      "   L'audit continuerà su tutti, ma NON dobbiamo scrivere finché l'identità canonica non è chiara.",
    );
  }

  const tournamentIds =
    tournaments.map(
      (tournament) =>
        tournament.id,
    );

  console.log("");

  /* =======================================================
     TARGET EDITIONS
  ======================================================= */

  const editions =
    await prisma.tournamentEdition.findMany({
      where: {
        tournamentId: {
          in:
            tournamentIds,
        },

        year: {
          in: [
            ...ATP_FINALS_YEARS,
          ],
        },
      },

      select: {
        id: true,
        year: true,
        editionKey: true,

        championName: true,
        runnerUpName: true,

        championPlayerId: true,
        runnerUpPlayerId: true,

        championCountryCode: true,
        runnerUpCountryCode: true,

        score: true,
        cancelled: true,

        tournament: {
          select: {
            id: true,
            slug: true,
            name: true,
          },
        },
      },

      orderBy: [
        {
          year: "asc",
        },
        {
          editionKey: "asc",
        },
      ],
    });

  printDivider();
  console.log(
    "📚 DJOKOVIC ATP FINALS TARGET YEARS",
  );
  printDivider();

  console.log(
    ATP_FINALS_YEARS.join(
      ", ",
    ),
  );

  console.log("");

  /* =======================================================
     YEAR-BY-YEAR AUDIT
  ======================================================= */

  let linkedWins =
    0;

  let nameOnlyWins =
    0;

  let missingEditions =
    0;

  let wrongChampionLinks =
    0;

  let duplicateYears =
    0;

  const missingYears:
    number[] = [];

  const nameOnlyYears:
    number[] = [];

  const wrongLinkYears:
    number[] = [];

  for (
    const year
    of ATP_FINALS_YEARS
  ) {
    const yearEditions =
      editions.filter(
        (edition) =>
          edition.year ===
          year,
      );

    printDivider();

    console.log(
      `📅 ${year}`,
    );

    if (
      yearEditions.length ===
      0
    ) {
      console.log(
        "❌ TournamentEdition assente.",
      );

      missingEditions +=
        1;

      missingYears.push(
        year,
      );

      continue;
    }

    if (
      yearEditions.length >
      1
    ) {
      duplicateYears +=
        1;

      console.log(
        `⚠️ ${yearEditions.length} TournamentEdition trovate per lo stesso anno.`,
      );
    }

    for (
      const edition
      of yearEditions
    ) {
      console.log(
        `🏛️ ${edition.tournament.name} · ${edition.tournament.slug}`,
      );

      console.log(
        `🔑 ${edition.editionKey}`,
      );

      console.log(
        `🏆 Champion: ${edition.championName ?? "—"}`,
      );

      console.log(
        `🥈 Runner-up: ${edition.runnerUpName ?? "—"}`,
      );

      console.log(
        `🎾 Score: ${edition.score ?? "—"}`,
      );

      console.log(
        `🔗 Champion player id: ${edition.championPlayerId ?? "—"}`,
      );

      console.log(
        `🔗 Runner-up player id: ${edition.runnerUpPlayerId ?? "—"}`,
      );

      if (
        edition.cancelled
      ) {
        console.log(
          "⚠️ Edition marked CANCELLED.",
        );
      }

      const linkedToDjokovic =
        edition.championPlayerId ===
        djokovic.id;

      const championNameMatches =
        isDjokovicName(
          edition.championName,
        );

      if (
        linkedToDjokovic
      ) {
        console.log(
          "✅ Djokovic già collegato come champion.",
        );

        linkedWins +=
          1;

        continue;
      }

      if (
        championNameMatches &&
        !edition.championPlayerId
      ) {
        console.log(
          "🟡 Djokovic presente come championName ma championPlayerId è vuoto.",
        );

        nameOnlyWins +=
          1;

        nameOnlyYears.push(
          year,
        );

        continue;
      }

      if (
        championNameMatches &&
        edition.championPlayerId &&
        edition.championPlayerId !==
          djokovic.id
      ) {
        console.log(
          "🔴 championName è Djokovic ma championPlayerId punta a un altro Player.",
        );

        wrongChampionLinks +=
          1;

        wrongLinkYears.push(
          year,
        );

        continue;
      }

      console.log(
        "❌ L'edizione esiste ma Djokovic non risulta champion.",
      );
    }
  }

  /* =======================================================
     ALL DJOKOVIC ATP FINALS LINKS
  ======================================================= */

  console.log("");
  printDivider();
  console.log(
    "🔎 ALL PLAYER-LINKED ATP FINALS RECORDS",
  );
  printDivider();

  const allLinkedEditions =
    await prisma.tournamentEdition.findMany({
      where: {
        tournamentId: {
          in:
            tournamentIds,
        },

        OR: [
          {
            championPlayerId:
              djokovic.id,
          },
          {
            runnerUpPlayerId:
              djokovic.id,
          },
        ],
      },

      select: {
        year: true,
        championName: true,
        runnerUpName: true,
        championPlayerId: true,
        runnerUpPlayerId: true,
        score: true,

        tournament: {
          select: {
            slug: true,
            name: true,
          },
        },
      },

      orderBy: {
        year: "asc",
      },
    });

  if (
    allLinkedEditions.length ===
    0
  ) {
    console.log(
      "📭 Nessuna ATP Finals collegata direttamente a Djokovic.",
    );
  } else {
    for (
      const edition
      of allLinkedEditions
    ) {
      const result =
        edition.championPlayerId ===
        djokovic.id
          ? "🏆 WIN"
          : "🥈 RUNNER-UP";

      console.log(
        [
          result,
          edition.year,
          "·",
          edition.tournament.name,
          "·",
          `${edition.championName ?? "—"} d. ${edition.runnerUpName ?? "—"}`,
          edition.score
            ? `· ${edition.score}`
            : "",
        ]
          .filter(Boolean)
          .join(" "),
      );
    }
  }

  /* =======================================================
     EXPECTED FINALS
  ======================================================= */

  console.log("");
  printDivider();
  console.log(
    "🎯 EXPECTED DJOKOVIC ATP FINALS TITLES",
  );
  printDivider();

  const expectedFinals = [
    {
      year: 2008,
      runnerUp:
        "Nikolay Davydenko",
      score:
        "6-1, 7-5",
    },
    {
      year: 2012,
      runnerUp:
        "Roger Federer",
      score:
        "7-6(6), 7-5",
    },
    {
      year: 2013,
      runnerUp:
        "Rafael Nadal",
      score:
        "6-3, 6-4",
    },
    {
      year: 2014,
      runnerUp:
        "Roger Federer",
      score:
        "W/O",
    },
    {
      year: 2015,
      runnerUp:
        "Roger Federer",
      score:
        "6-3, 6-4",
    },
    {
      year: 2022,
      runnerUp:
        "Casper Ruud",
      score:
        "7-5, 6-3",
    },
    {
      year: 2023,
      runnerUp:
        "Jannik Sinner",
      score:
        "6-3, 6-3",
    },
  ] as const;

  for (
    const expected
    of expectedFinals
  ) {
    console.log(
      [
        "🏆",
        expected.year,
        "· Novak Djokovic d.",
        expected.runnerUp,
        "·",
        expected.score,
      ].join(" "),
    );
  }

  /* =======================================================
     SUMMARY
  ======================================================= */

  console.log("");
  printDivider();
  console.log(
    "📊 DISCOVERY SUMMARY",
  );
  printDivider();

  console.log(
    `Expected Djokovic titles:      ${ATP_FINALS_YEARS.length}`,
  );

  console.log(
    `Already player-linked wins:    ${linkedWins}`,
  );

  console.log(
    `Name-only wins:                ${nameOnlyWins}`,
  );

  console.log(
    `Missing TournamentEditions:    ${missingEditions}`,
  );

  console.log(
    `Wrong champion links:          ${wrongChampionLinks}`,
  );

  console.log(
    `Duplicate target years:        ${duplicateYears}`,
  );

  console.log("");

  if (
    missingYears.length >
    0
  ) {
    console.log(
      `❌ Missing years: ${missingYears.join(
        ", ",
      )}`,
    );
  }

  if (
    nameOnlyYears.length >
    0
  ) {
    console.log(
      `🟡 Name-only years: ${nameOnlyYears.join(
        ", ",
      )}`,
    );
  }

  if (
    wrongLinkYears.length >
    0
  ) {
    console.log(
      `🔴 Wrong-link years: ${wrongLinkYears.join(
        ", ",
      )}`,
    );
  }

  console.log("");

  const accountedTitles =
    linkedWins +
    nameOnlyWins;

  console.log(
    `Accounted Djokovic titles:     ${accountedTitles} / ${ATP_FINALS_YEARS.length}`,
  );

  console.log(
    `Still unresolved:              ${ATP_FINALS_YEARS.length - linkedWins}`,
  );

  console.log("");

  if (
    linkedWins ===
      ATP_FINALS_YEARS.length &&
    duplicateYears ===
      0
  ) {
    console.log(
      "✅ ATP FINALS ALREADY COMPLETE",
    );

    console.log(
      "➡️ Nessun backfill dei 7 titoli è necessario.",
    );
  } else {
    console.log(
      "➡️ Next step: costruire un backfill minimo SOLO per record mancanti/non collegati.",
    );
  }

  console.log("");
  console.log(
    "🛡️ AUDIT COMPLETED · DATABASE UNCHANGED",
  );
  console.log("");
}

/* =========================================================
   EXECUTION
========================================================= */

main()
  .catch(
    (error: unknown) => {
      console.error("");
      console.error(
        "❌ Djokovic ATP Finals audit failed.",
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