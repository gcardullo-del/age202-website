import "dotenv/config";

import {
  prisma,
} from "../lib/prisma";

type MissingTitleCandidate = {
  year: number;
  tournamentNames: readonly string[];
  expectedOpponent: string;
  expectedScore: string;
};

const PLAYER_SLUG =
  "jannik-sinner";

const candidates: MissingTitleCandidate[] = [
  {
    year: 2020,
    tournamentNames: [
      "Sofia Open",
    ],
    expectedOpponent:
      "Vasek Pospisil",
    expectedScore:
      "6-4 3-6 7-6",
  },
  {
    year: 2021,
    tournamentNames: [
      "Great Ocean Road Open",
      "Great Ocean Road Open Melbourne",
    ],
    expectedOpponent:
      "Stefano Travaglia",
    expectedScore:
      "7-6 6-4",
  },
  {
    year: 2021,
    tournamentNames: [
      "Sofia Open",
    ],
    expectedOpponent:
      "Gael Monfils",
    expectedScore:
      "6-3 6-4",
  },
  {
    year: 2021,
    tournamentNames: [
      "European Open",
      "European Open Antwerp",
      "European Open Anversa",
    ],
    expectedOpponent:
      "Diego Schwartzman",
    expectedScore:
      "6-2 6-2",
  },
  {
    year: 2022,
    tournamentNames: [
      "Croatia Open Umag",
      "Plava Laguna Croatia Open Umag",
      "Umag Open",
    ],
    expectedOpponent:
      "Carlos Alcaraz",
    expectedScore:
      "6-7 6-1 6-1",
  },
  {
    year: 2023,
    tournamentNames: [
      "Open Sud de France",
      "Open Sud de France Montpellier",
    ],
    expectedOpponent:
      "Maxime Cressy",
    expectedScore:
      "7-6 6-3",
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
    "🎾 AGE202 · SINNER MISSING ATP 250 DISCOVERY",
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
        slug: PLAYER_SLUG,
      },

      select: {
        id: true,
        name: true,
        slug: true,
      },
    });

  if (!player) {
    throw new Error(
      `Player non trovato: ${PLAYER_SLUG}`,
    );
  }

  console.log(
    `👤 ${player.name}`,
  );
  console.log(
    `🆔 ${player.id}`,
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
        name: "asc",
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
      `   Expected final: Jannik Sinner d. ${candidate.expectedOpponent} · ${candidate.expectedScore}`,
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
        `      category: ${String(tournament.category)}`,
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

        const linkedToSinner =
          edition.championPlayerId ===
            player.id ||
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
          `         Sinner linked: ${linkedToSinner ? "YES" : "NO"}`,
        );
        console.log(
          `         cancelled: ${edition.cancelled ? "YES" : "NO"}`,
        );
      }
    }
  }

  printDivider();
  console.log("");
  console.log(
    "📊 DISCOVERY SUMMARY",
  );
  printDivider();

  console.log(
    `Candidates checked:     ${candidates.length}`,
  );
  console.log(
    `Tournament matches:     ${foundTournaments}`,
  );
  console.log(
    `Existing editions:      ${existingEditions}`,
  );
  console.log(
    `Missing candidate rows: ${missingEditions}`,
  );

  console.log("");
  console.log(
    "➡️ Next step: useremo gli slug reali trovati qui per costruire il backfill WRITE sicuro dei soli titoli mancanti.",
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
        "❌ Sinner missing-title discovery failed.",
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
