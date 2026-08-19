import "dotenv/config";

import {
  TournamentCategory,
} from "../generated/prisma/client";

import {
  prisma,
} from "../lib/prisma";


const PLAYER_SLUG =
  "carlos-alcaraz";


type MissingTitleCandidate = {
  year: number;
  tournamentNames: readonly string[];
  expectedOpponent: string;
  expectedScore: string;
};


const candidates:
  MissingTitleCandidate[] = [
    {
      year:
        2021,

      tournamentNames: [
        "Croatia Open Umag",
        "Plava Laguna Croatia Open Umag",
        "Umag Open",
        "Umag",
      ],

      expectedOpponent:
        "Richard Gasquet",

      expectedScore:
        "6-2 6-2",
    },

    {
      year:
        2023,

      tournamentNames: [
        "Argentina Open",
        "Buenos Aires",
        "Buenos Aires Open",
      ],

      expectedOpponent:
        "Cameron Norrie",

      expectedScore:
        "6-3 7-5",
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


async function main() {
  console.log("");
  console.log(
    "🎾 AGE202 · ALCARAZ MISSING ATP 250 DISCOVERY",
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
    });

  const linkedTitles =
    linkedEditions.filter(
      (edition) =>
        edition.championPlayerId ===
        player.id,
    );

  const categoryTotals = {
    grandSlams:
      linkedTitles.filter(
        (edition) =>
          edition.tournament.category ===
          TournamentCategory.GRAND_SLAM,
      ).length,

    masters1000:
      linkedTitles.filter(
        (edition) =>
          edition.tournament.category ===
          TournamentCategory.MASTERS_1000,
      ).length,

    atp500:
      linkedTitles.filter(
        (edition) =>
          edition.tournament.category ===
          TournamentCategory.ATP_500,
      ).length,

    atp250:
      linkedTitles.filter(
        (edition) =>
          edition.tournament.category ===
          TournamentCategory.ATP_250,
      ).length,

    atpFinals:
      linkedTitles.filter(
        (edition) =>
          edition.tournament.category ===
          TournamentCategory.ATP_FINALS,
      ).length,
  };

  printDivider();
  console.log(
    "📊 CURRENT LINKED TITLE RECORD",
  );
  printDivider();

  console.log(
    `Grand Slams:    ${categoryTotals.grandSlams}`,
  );
  console.log(
    `Masters 1000:   ${categoryTotals.masters1000}`,
  );
  console.log(
    `ATP 500:        ${categoryTotals.atp500}`,
  );
  console.log(
    `ATP 250:        ${categoryTotals.atp250}`,
  );
  console.log(
    `ATP Finals:     ${categoryTotals.atpFinals}`,
  );
  console.log(
    `Total titles:   ${linkedTitles.length}`,
  );
  console.log("");

  const allTournaments =
    await prisma.tournament.findMany({
      select: {
        id: true,
        name: true,
        shortName: true,
        slug: true,
        category: true,
        city: true,
        country: true,
      },

      orderBy: {
        name:
          "asc",
      },
    });

  let foundTournaments =
    0;

  let existingEditions =
    0;

  let missingEditions =
    0;

  for (
    const candidate
    of candidates
  ) {
    printDivider();

    console.log(
      `🔎 ${candidate.year} · ${candidate.tournamentNames[0]}`,
    );

    console.log(
      `   Expected final: Carlos Alcaraz d. ${candidate.expectedOpponent} · ${candidate.expectedScore}`,
    );

    const normalizedCandidateNames =
      candidate.tournamentNames.map(
        normalize,
      );

    const tournamentMatches =
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

          return normalizedCandidateNames.some(
            (candidateName) =>
              searchable.some(
                (value) =>
                  value ===
                    candidateName ||
                  value.includes(
                    candidateName,
                  ) ||
                  candidateName.includes(
                    value,
                  ),
              ),
          );
        },
      );

    if (
      tournamentMatches.length ===
      0
    ) {
      console.log(
        "   ❌ Tournament non trovato nel database.",
      );

      missingEditions +=
        1;

      continue;
    }

    for (
      const tournament
      of tournamentMatches
    ) {
      foundTournaments +=
        1;

      console.log(
        `   ✅ Tournament: ${tournament.name}`,
      );
      console.log(
        `      slug: ${tournament.slug}`,
      );
      console.log(
        `      category: ${String(
          tournament.category,
        )}`,
      );
      console.log(
        `      location: ${[
          tournament.city,
          tournament.country,
        ]
          .filter(Boolean)
          .join(", ") || "—"}`,
      );

      const editions =
        await prisma.tournamentEdition.findMany({
          where: {
            tournamentId:
              tournament.id,

            year:
              candidate.year,
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
            score: true,
            cancelled: true,
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
          "      ⚠️ TournamentEdition assente per quell'anno.",
        );

        missingEditions +=
          1;

        continue;
      }

      for (
        const edition
        of editions
      ) {
        existingEditions +=
          1;

        const championLinked =
          edition.championPlayerId ===
          player.id;

        const runnerUpLinked =
          edition.runnerUpPlayerId ===
          player.id;

        console.log(
          `      📚 Edition ${edition.editionKey}:`,
        );
        console.log(
          `         ${edition.championName ?? "—"} d. ${edition.runnerUpName ?? "—"}`,
        );
        console.log(
          `         score: ${edition.score ?? "—"}`,
        );
        console.log(
          `         Alcaraz champion linked: ${championLinked ? "YES" : "NO"}`,
        );
        console.log(
          `         Alcaraz runner-up linked: ${runnerUpLinked ? "YES" : "NO"}`,
        );
        console.log(
          `         cancelled: ${edition.cancelled ? "YES" : "NO"}`,
        );
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
    `Current linked titles:   ${linkedTitles.length}`,
  );
  console.log(
    `Expected career titles:  26`,
  );
  console.log(
    `Title gap:               ${Math.max(
      0,
      26 -
        linkedTitles.length,
    )}`,
  );
  console.log(
    `Candidates checked:      ${candidates.length}`,
  );
  console.log(
    `Tournament matches:      ${foundTournaments}`,
  );
  console.log(
    `Existing editions:       ${existingEditions}`,
  );
  console.log(
    `Missing candidate rows:  ${missingEditions}`,
  );

  console.log("");
  console.log(
    "➡️ Next step: se Umag 2021 e Buenos Aires 2023 risultano mancanti/non collegati, costruiamo il backfill WRITE sicuro dei soli due titoli.",
  );

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
        "❌ Alcaraz ATP 250 discovery failed.",
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
