import "dotenv/config";

import {
  TournamentCategory,
} from "../generated/prisma/client";

import {
  prisma,
} from "../lib/prisma";


const PLAYER_SLUG =
  "jannik-sinner";


function printDivider() {
  console.log(
    "────────────────────────────────────────────────────────────",
  );
}


async function main() {
  console.log("");
  console.log(
    "🇮🇹 AGE202 · SINNER DAVIS CUP DISCOVERY",
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
    `👤 ${player.name} · ${player.slug}`,
  );
  console.log(
    `🆔 ${player.id}`,
  );
  console.log("");

  printDivider();
  console.log(
    "🏛️ DAVIS CUP TOURNAMENT SEARCH",
  );
  printDivider();

  const davisCupTournaments =
    await prisma.tournament.findMany({
      where: {
        OR: [
          {
            category:
              TournamentCategory.DAVIS_CUP,
          },
          {
            name: {
              contains:
                "Davis",
              mode:
                "insensitive",
            },
          },
          {
            shortName: {
              contains:
                "Davis",
              mode:
                "insensitive",
            },
          },
          {
            slug: {
              contains:
                "davis",
              mode:
                "insensitive",
            },
          },
        ],
      },

      select: {
        id: true,
        name: true,
        shortName: true,
        slug: true,
        category: true,
        surface: true,
        city: true,
        country: true,
        countryCode: true,
        active: true,
      },

      orderBy: {
        name:
          "asc",
      },
    });

  if (
    davisCupTournaments.length ===
    0
  ) {
    console.log(
      "❌ Nessun Tournament Davis Cup trovato.",
    );
  } else {
    console.log(
      `✅ Tournament candidati trovati: ${davisCupTournaments.length}`,
    );

    for (
      const tournament
      of davisCupTournaments
    ) {
      console.log("");
      console.log(
        `🏆 ${tournament.name}`,
      );
      console.log(
        `   slug: ${tournament.slug}`,
      );
      console.log(
        `   category: ${String(
          tournament.category,
        )}`,
      );
      console.log(
        `   location: ${[
          tournament.city,
          tournament.country,
        ]
          .filter(Boolean)
          .join(", ") || "—"}`,
      );
      console.log(
        `   surface: ${String(
          tournament.surface,
        )}`,
      );
      console.log(
        `   active: ${tournament.active ? "YES" : "NO"}`,
      );
    }
  }

  printDivider();
  console.log("");
  console.log(
    "📚 DAVIS CUP EDITIONS 2023 / 2024",
  );
  printDivider();

  let matchingEditions =
    0;

  for (
    const tournament
    of davisCupTournaments
  ) {
    const editions =
      await prisma.tournamentEdition.findMany({
        where: {
          tournamentId:
            tournament.id,

          year: {
            in: [
              2023,
              2024,
            ],
          },
        },

        select: {
          id: true,
          year: true,
          editionKey: true,
          editionLabel: true,
          championName: true,
          runnerUpName: true,
          championPlayerId: true,
          runnerUpPlayerId: true,
          championCountryCode: true,
          runnerUpCountryCode: true,
          score: true,
          cancelled: true,
        },

        orderBy: {
          year:
            "asc",
        },
      });

    if (
      editions.length ===
      0
    ) {
      console.log(
        `⚠️ ${tournament.name}: nessuna TournamentEdition 2023/2024.`,
      );

      continue;
    }

    for (
      const edition
      of editions
    ) {
      matchingEditions +=
        1;

      const linkedToSinner =
        edition.championPlayerId ===
          player.id ||
        edition.runnerUpPlayerId ===
          player.id;

      console.log("");
      console.log(
        `📘 ${edition.year} · ${tournament.name}`,
      );
      console.log(
        `   key: ${edition.editionKey}`,
      );
      console.log(
        `   label: ${edition.editionLabel ?? "—"}`,
      );
      console.log(
        `   champion: ${edition.championName ?? "—"}`,
      );
      console.log(
        `   runner-up: ${edition.runnerUpName ?? "—"}`,
      );
      console.log(
        `   score: ${edition.score ?? "—"}`,
      );
      console.log(
        `   Sinner linked: ${linkedToSinner ? "YES" : "NO"}`,
      );
      console.log(
        `   cancelled: ${edition.cancelled ? "YES" : "NO"}`,
      );
    }
  }

  printDivider();
  console.log("");
  console.log(
    "🔎 PLAYER-LINKED DAVIS CUP RECORDS",
  );
  printDivider();

  const linkedDavisCupEditions =
    await prisma.tournamentEdition.findMany({
      where: {
        cancelled: false,

        tournament: {
          category:
            TournamentCategory.DAVIS_CUP,
        },

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

  if (
    linkedDavisCupEditions.length ===
    0
  ) {
    console.log(
      "📭 Nessuna Davis Cup collegata a Jannik Sinner.",
    );
  } else {
    for (
      const edition
      of linkedDavisCupEditions
    ) {
      const result =
        edition.championPlayerId ===
        player.id
          ? "🏆 W"
          : "🥈 F";

      console.log(
        [
          result,
          edition.year,
          "·",
          edition.tournament.name,
          "·",
          edition.championName ??
            "—",
          "d.",
          edition.runnerUpName ??
            "—",
          edition.score
            ? `· ${edition.score}`
            : "",
        ]
          .filter(Boolean)
          .join(" "),
      );
    }
  }

  printDivider();
  console.log("");
  console.log(
    "📊 DISCOVERY SUMMARY",
  );
  printDivider();

  console.log(
    `Tournament candidates:      ${davisCupTournaments.length}`,
  );

  console.log(
    `2023/2024 editions found:    ${matchingEditions}`,
  );

  console.log(
    `Linked Davis Cup editions:  ${linkedDavisCupEditions.length}`,
  );

  console.log("");

  if (
    davisCupTournaments.length ===
    0
  ) {
    console.log(
      "➡️ Next step: creare l'identità Tournament DAVIS_CUP e poi le edizioni 2023/2024.",
    );
  } else if (
    matchingEditions ===
    0
  ) {
    console.log(
      "➡️ Next step: usare il Tournament Davis Cup esistente e creare le edizioni 2023/2024.",
    );
  } else if (
    linkedDavisCupEditions.length <
    2
  ) {
    console.log(
      "➡️ Next step: verificare/collegare le edizioni 2023/2024 a Jannik Sinner.",
    );
  } else {
    console.log(
      "✅ Davis Cup 2023/2024 risultano già presenti e collegate.",
    );
  }

  console.log("");
  console.log(
    "✅ DISCOVERY COMPLETED",
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
        "❌ Sinner Davis Cup discovery failed.",
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
