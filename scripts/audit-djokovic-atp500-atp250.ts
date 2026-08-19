import "dotenv/config";

import {
  TournamentCategory,
} from "../generated/prisma/client";

import {
  prisma,
} from "../lib/prisma";


const PLAYER_SLUG =
  "novak-djokovic";


type ExpectedLowerTierTitle = {
  year: number;
  category:
    | "ATP_500"
    | "ATP_250";
  tournamentNames:
    readonly string[];
};


const expectedTitles:
  ExpectedLowerTierTitle[] = [
    {
      year: 2025,
      category: "ATP_250",
      tournamentNames: [
        "Athens",
        "Hellenic Championship",
        "Vanda Pharmaceuticals Hellenic Championship",
      ],
    },
    {
      year: 2025,
      category: "ATP_250",
      tournamentNames: [
        "Geneva",
        "Geneva Open",
        "Gonet Geneva Open",
      ],
    },
    {
      year: 2023,
      category: "ATP_250",
      tournamentNames: [
        "Adelaide 1",
        "Adelaide International 1",
        "Adelaide International",
      ],
    },
    {
      year: 2022,
      category: "ATP_500",
      tournamentNames: [
        "Astana",
        "Astana Open",
      ],
    },
    {
      year: 2022,
      category: "ATP_250",
      tournamentNames: [
        "Tel Aviv",
        "Tel Aviv Watergen Open",
      ],
    },
    {
      year: 2021,
      category: "ATP_250",
      tournamentNames: [
        "Belgrade 2",
        "Belgrade Open 2",
        "Belgrade Open",
      ],
    },
    {
      year: 2020,
      category: "ATP_500",
      tournamentNames: [
        "Dubai",
        "Dubai Duty Free Tennis Championships",
      ],
    },
    {
      year: 2019,
      category: "ATP_500",
      tournamentNames: [
        "Tokyo",
        "Japan Open",
        "Rakuten Japan Open",
      ],
    },
    {
      year: 2017,
      category: "ATP_250",
      tournamentNames: [
        "Eastbourne",
        "Eastbourne International",
        "AEGON International Eastbourne",
      ],
    },
    {
      year: 2017,
      category: "ATP_250",
      tournamentNames: [
        "Doha",
        "Qatar Open",
        "Qatar ExxonMobil Open",
      ],
    },
    {
      year: 2016,
      category: "ATP_250",
      tournamentNames: [
        "Doha",
        "Qatar Open",
        "Qatar ExxonMobil Open",
      ],
    },
    {
      year: 2015,
      category: "ATP_500",
      tournamentNames: [
        "Beijing",
        "China Open",
      ],
    },
    {
      year: 2014,
      category: "ATP_500",
      tournamentNames: [
        "Beijing",
        "China Open",
      ],
    },
    {
      year: 2013,
      category: "ATP_500",
      tournamentNames: [
        "Beijing",
        "China Open",
      ],
    },
    {
      year: 2013,
      category: "ATP_500",
      tournamentNames: [
        "Dubai",
        "Dubai Duty Free Tennis Championships",
      ],
    },
    {
      year: 2012,
      category: "ATP_500",
      tournamentNames: [
        "Beijing",
        "China Open",
      ],
    },
    {
      year: 2011,
      category: "ATP_250",
      tournamentNames: [
        "Belgrade",
        "Serbia Open",
      ],
    },
    {
      year: 2011,
      category: "ATP_500",
      tournamentNames: [
        "Dubai",
        "Dubai Duty Free Tennis Championships",
      ],
    },
    {
      year: 2010,
      category: "ATP_500",
      tournamentNames: [
        "Beijing",
        "China Open",
      ],
    },
    {
      year: 2010,
      category: "ATP_500",
      tournamentNames: [
        "Dubai",
        "Dubai Duty Free Tennis Championships",
      ],
    },
    {
      year: 2009,
      category: "ATP_500",
      tournamentNames: [
        "Basel",
        "Swiss Indoors Basel",
      ],
    },
    {
      year: 2009,
      category: "ATP_500",
      tournamentNames: [
        "Beijing",
        "China Open",
      ],
    },
    {
      year: 2009,
      category: "ATP_250",
      tournamentNames: [
        "Belgrade",
        "Serbia Open",
      ],
    },
    {
      year: 2009,
      category: "ATP_500",
      tournamentNames: [
        "Dubai",
        "Dubai Duty Free Tennis Championships",
      ],
    },
    {
      year: 2007,
      category: "ATP_500",
      tournamentNames: [
        "Vienna",
        "Vienna Open",
        "Erste Bank Open",
      ],
    },
    {
      year: 2007,
      category: "ATP_250",
      tournamentNames: [
        "Estoril",
        "Estoril Open",
      ],
    },
    {
      year: 2007,
      category: "ATP_250",
      tournamentNames: [
        "Adelaide",
        "Adelaide International",
      ],
    },
    {
      year: 2006,
      category: "ATP_250",
      tournamentNames: [
        "Metz",
        "Moselle Open",
      ],
    },
    {
      year: 2006,
      category: "ATP_250",
      tournamentNames: [
        "Amersfoort",
        "Dutch Open",
      ],
    },
  ];


function normalize(
  value: string,
): string {
  return value
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      "",
    )
    .toLowerCase()
    .replace(
      /[^a-z0-9]+/g,
      " ",
    )
    .trim()
    .replace(
      /\s+/g,
      " ",
    );
}


function printDivider() {
  console.log(
    "────────────────────────────────────────────────────────────",
  );
}


function categoryEnum(
  category:
    | "ATP_500"
    | "ATP_250",
) {
  return category ===
    "ATP_500"
    ? TournamentCategory.ATP_500
    : TournamentCategory.ATP_250;
}


async function main() {
  console.log("");
  console.log(
    "🎾 AGE202 · DJOKOVIC ATP 500/250 DISCOVERY",
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

  const allTournaments =
    await prisma.tournament.findMany({
      where: {
        category: {
          in: [
            TournamentCategory.ATP_500,
            TournamentCategory.ATP_250,
          ],
        },
      },

      select: {
        id: true,
        slug: true,
        name: true,
        shortName: true,
        category: true,
        city: true,
        country: true,
      },

      orderBy: {
        name:
          "asc",
      },
    });

  let alreadyLinked =
    0;

  let nameOnly =
    0;

  let missingEdition =
    0;

  let tournamentNotFound =
    0;

  let wrongChampion =
    0;

  let categoryMismatch =
    0;

  const unresolved:
    {
      year: number;
      expectedName: string;
      status: string;
    }[] = [];

  for (
    const expected
    of expectedTitles
  ) {
    printDivider();

    console.log(
      `🔎 ${expected.year} · ${expected.category} · ${expected.tournamentNames[0]}`,
    );

    const aliases =
      expected.tournamentNames.map(
        normalize,
      );

    const matches =
      allTournaments.filter(
        (tournament) => {
          const searchable =
            [
              tournament.name,
              tournament.shortName ??
                "",
              tournament.slug,
            ].map(
              normalize,
            );

          return aliases.some(
            (alias) =>
              searchable.some(
                (value) =>
                  value ===
                    alias ||
                  value.includes(
                    alias,
                  ) ||
                  alias.includes(
                    value,
                  ),
              ),
          );
        },
      );

    if (
      matches.length ===
      0
    ) {
      console.log(
        "❌ Tournament non trovato.",
      );

      tournamentNotFound +=
        1;

      unresolved.push({
        year:
          expected.year,

        expectedName:
          expected.tournamentNames[0],

        status:
          "TOURNAMENT_NOT_FOUND",
      });

      continue;
    }

    if (
      matches.length >
      1
    ) {
      console.log(
        `⚠️ ${matches.length} possibili Tournament trovati.`,
      );
    }

    let resolved =
      false;

    for (
      const tournament
      of matches
    ) {
      console.log(
        `🏟️ ${tournament.name} · ${tournament.slug} · ${String(
          tournament.category,
        )}`,
      );

      if (
        tournament.category !==
        categoryEnum(
          expected.category,
        )
      ) {
        categoryMismatch +=
          1;

        console.log(
          `   ⚠️ Category mismatch: attesa ${expected.category}, trovata ${String(
            tournament.category,
          )}`,
        );
      }

      const editions =
        await prisma.tournamentEdition.findMany({
          where: {
            tournamentId:
              tournament.id,

            year:
              expected.year,

            cancelled:
              false,
          },

          select: {
            id: true,
            editionKey: true,
            championName: true,
            runnerUpName: true,
            championPlayerId: true,
            runnerUpPlayerId: true,
            score: true,
          },

          orderBy: {
            editionKey:
              "asc",
          },
        });

      if (
        editions.length ===
        0
      ) {
        console.log(
          "   ❌ TournamentEdition assente.",
        );

        continue;
      }

      for (
        const edition
        of editions
      ) {
        console.log(
          `   📚 ${edition.editionKey}`,
        );
        console.log(
          `      ${edition.championName ?? "—"} d. ${edition.runnerUpName ?? "—"} · ${edition.score ?? "—"}`,
        );

        if (
          edition.championPlayerId ===
          player.id
        ) {
          alreadyLinked +=
            1;

          resolved =
            true;

          console.log(
            "      ✅ Djokovic già collegato come champion.",
          );

          continue;
        }

        const normalizedChampion =
          normalize(
            edition.championName ??
              "",
          );

        if (
          normalizedChampion ===
            "novak djokovic" &&
          !edition.championPlayerId
        ) {
          nameOnly +=
            1;

          resolved =
            true;

          console.log(
            "      🟡 Djokovic presente come championName ma non collegato.",
          );

          continue;
        }

        wrongChampion +=
          1;

        console.log(
          "      🔴 Edition presente ma champion non è Djokovic.",
        );
      }
    }

    if (!resolved) {
      const anyEdition =
        await prisma.tournamentEdition.findFirst({
          where: {
            tournamentId: {
              in:
                matches.map(
                  (match) =>
                    match.id,
                ),
            },

            year:
              expected.year,

            cancelled:
              false,
          },

          select: {
            id: true,
          },
        });

      if (!anyEdition) {
        missingEdition +=
          1;

        unresolved.push({
          year:
            expected.year,

          expectedName:
            expected.tournamentNames[0],

          status:
            "EDITION_MISSING",
        });
      } else {
        unresolved.push({
          year:
            expected.year,

          expectedName:
            expected.tournamentNames[0],

          status:
            "EDITION_WRONG_OR_UNLINKED",
        });
      }
    }
  }

  console.log("");
  printDivider();
  console.log(
    "📊 DISCOVERY SUMMARY",
  );
  printDivider();

  console.log(
    `Expected lower-tier titles:   ${expectedTitles.length}`,
  );
  console.log(
    `Already linked wins:          ${alreadyLinked}`,
  );
  console.log(
    `Name-only wins:               ${nameOnly}`,
  );
  console.log(
    `Missing TournamentEditions:   ${missingEdition}`,
  );
  console.log(
    `Tournament not found:         ${tournamentNotFound}`,
  );
  console.log(
    `Wrong champion rows seen:     ${wrongChampion}`,
  );
  console.log(
    `Category mismatches seen:     ${categoryMismatch}`,
  );
  console.log(
    `Unresolved expected titles:   ${unresolved.length}`,
  );

  if (
    unresolved.length >
    0
  ) {
    console.log("");
    console.log(
      "❌ UNRESOLVED TITLES",
    );
    printDivider();

    for (
      const item
      of unresolved
    ) {
      console.log(
        `• ${item.year} · ${item.expectedName} · ${item.status}`,
      );
    }
  }

  console.log("");
  console.log(
    "➡️ Next step: costruiremo il backfill esclusivamente sull'elenco UNRESOLVED, senza toccare i titoli già collegati.",
  );

  console.log("");
  console.log(
    "✅ DJOKOVIC ATP 500/250 DISCOVERY COMPLETED",
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
        "❌ Djokovic ATP 500/250 discovery failed.",
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
