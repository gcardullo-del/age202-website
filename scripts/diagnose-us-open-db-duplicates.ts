import "dotenv/config";

import {
  TournamentCircuit,
} from "../generated/prisma/client";

import {
  prisma,
} from "../lib/prisma";


const TOURNAMENT_SLUG =
  "us-open";

const YEAR =
  2026;


function pairKey(
  round: string,
  playerOneName:
    string | null,
  playerTwoName:
    string | null,
): string {
  const names = [
    playerOneName ??
      "<unknown>",
    playerTwoName ??
      "<unknown>",
  ]
    .map(
      (name) =>
        name
          .trim()
          .toLowerCase(),
    )
    .sort();

  return `${round}:${names.join("::")}`;
}


async function main() {
  console.log("");
  console.log(
    "🎾 AGE202 · US OPEN DB DUPLICATION DIAGNOSTIC",
  );
  console.log(
    "══════════════════════════════════════════════",
  );
  console.log(
    "🛡️ READ ONLY · no database writes",
  );
  console.log("");

  const tournament =
    await prisma.tournament.findUnique({
      where: {
        slug:
          TOURNAMENT_SLUG,
      },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });

  if (!tournament) {
    throw new Error(
      `Tournament not found: ${TOURNAMENT_SLUG}.`,
    );
  }

  const edition =
    await prisma.tournamentEdition.findUnique({
      where: {
        tournamentId_year_editionKey_circuit: {
          tournamentId:
            tournament.id,
          year:
            YEAR,
          editionKey:
            "main",
          circuit:
            TournamentCircuit.ATP,
        },
      },
      select: {
        id: true,
        year: true,
        drawSize: true,
        externalId: true,
        lastSyncedAt: true,
      },
    });

  if (!edition) {
    throw new Error(
      `${tournament.name} ${YEAR} main ATP edition not found.`,
    );
  }

  const matches =
    await prisma.tournamentMatch.findMany({
      where: {
        editionId:
          edition.id,
      },
      orderBy: [
        {
          roundOrder:
            "asc",
        },
        {
          matchNumber:
            "asc",
        },
      ],
      select: {
        id: true,
        externalId: true,
        round: true,
        roundOrder: true,
        matchNumber: true,
        bracketPosition: true,
        status: true,
        scheduledAt: true,
        completedAt: true,
        scoreSummary: true,
        court: true,
        createdAt: true,
        updatedAt: true,
        playerOne: {
          select: {
            id: true,
            name: true,
          },
        },
        playerTwo: {
          select: {
            id: true,
            name: true,
          },
        },
        winner: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

  const dailyMatches =
    matches.filter(
      (match) =>
        match.externalId
          ?.startsWith(
            "atp:daily:",
          ) ??
        false,
    );

  const drawMatches =
    matches.filter(
      (match) =>
        (
          match.externalId
            ?.startsWith(
              "atp:",
            ) ??
          false
        ) &&
        !(
          match.externalId
            ?.startsWith(
              "atp:daily:",
            ) ??
          false
        ),
    );

  const nullExternalId =
    matches.filter(
      (match) =>
        !match.externalId,
    );

  console.log(
    `🏟️ Tournament: ${tournament.name}`,
  );
  console.log(
    `📅 Edition: ${edition.year}`,
  );
  console.log(
    `🧩 Edition ID: ${edition.id}`,
  );
  console.log(
    `📐 Draw size: ${edition.drawSize ?? "null"}`,
  );
  console.log(
    `🎾 Total DB matches: ${matches.length}`,
  );
  console.log(
    `📅 Daily IDs: ${dailyMatches.length}`,
  );
  console.log(
    `🏆 Draw IDs: ${drawMatches.length}`,
  );
  console.log(
    `❔ Null external IDs: ${nullExternalId.length}`,
  );
  console.log("");

  const groupedByPair =
    new Map<
      string,
      typeof matches
    >();

  for (const match of matches) {
    const key =
      pairKey(
        match.round,
        match.playerOne?.name ??
          null,
        match.playerTwo?.name ??
          null,
      );

    const existing =
      groupedByPair.get(
        key,
      ) ??
      [];

    existing.push(
      match,
    );

    groupedByPair.set(
      key,
      existing,
    );
  }

  const duplicatePairs =
    Array.from(
      groupedByPair.entries(),
    )
      .filter(
        (
          [, pairMatches],
        ) =>
          pairMatches.length >
          1,
      );

  const dailyDrawOverlaps =
    duplicatePairs.filter(
      (
        [, pairMatches],
      ) => {
        const hasDaily =
          pairMatches.some(
            (match) =>
              match.externalId
                ?.startsWith(
                  "atp:daily:",
                ) ??
              false,
          );

        const hasDraw =
          pairMatches.some(
            (match) =>
              (
                match.externalId
                  ?.startsWith(
                    "atp:",
                  ) ??
                false
              ) &&
              !(
                match.externalId
                  ?.startsWith(
                    "atp:daily:",
                  ) ??
                false
              ),
          );

        return (
          hasDaily &&
          hasDraw
        );
      },
    );

  console.log(
    `🔎 Duplicate round+player pairs: ${duplicatePairs.length}`,
  );
  console.log(
    `⚠️ Daily ↔ draw overlaps: ${dailyDrawOverlaps.length}`,
  );
  console.log("");

  if (
    dailyDrawOverlaps.length >
    0
  ) {
    console.log(
      "DAILY ↔ DRAW OVERLAPS",
    );
    console.log(
      "─────────────────────",
    );

    for (
      const [
        key,
        pairMatches,
      ]
      of dailyDrawOverlaps
    ) {
      console.log(
        `PAIR: ${key}`,
      );

      for (
        const match
        of pairMatches
      ) {
        console.log(
          [
            `  ${match.playerOne?.name ?? "?"} vs ${match.playerTwo?.name ?? "?"}`,
            `externalId=${match.externalId ?? "null"}`,
            `status=${match.status}`,
            `matchNumber=${match.matchNumber}`,
            `scheduledAt=${match.scheduledAt?.toISOString() ?? "null"}`,
            `score=${match.scoreSummary ?? "null"}`,
          ].join(
            " · ",
          ),
        );
      }

      console.log("");
    }
  } else {
    console.log(
      "✅ No daily ↔ draw duplicate pairs found.",
    );
    console.log("");
  }

  console.log(
    "DAILY MATCHES CURRENTLY IN DB",
  );
  console.log(
    "─────────────────────────────",
  );

  if (
    dailyMatches.length ===
    0
  ) {
    console.log(
      "None.",
    );
  } else {
    for (
      const match
      of dailyMatches
    ) {
      console.log(
        [
          `${match.round}`,
          `${match.playerOne?.name ?? "?"} vs ${match.playerTwo?.name ?? "?"}`,
          `status=${match.status}`,
          `matchNumber=${match.matchNumber}`,
          `scheduledAt=${match.scheduledAt?.toISOString() ?? "null"}`,
          `externalId=${match.externalId ?? "null"}`,
        ].join(
          " · ",
        ),
      );
    }
  }

  console.log("");
  console.log(
    "SUMMARY",
  );
  console.log(
    "───────",
  );
  console.log(
    `Total matches: ${matches.length}`,
  );
  console.log(
    `Daily matches: ${dailyMatches.length}`,
  );
  console.log(
    `Draw matches: ${drawMatches.length}`,
  );
  console.log(
    `Daily/draw duplicate pairs: ${dailyDrawOverlaps.length}`,
  );
  console.log(
    dailyDrawOverlaps.length ===
    0
      ? "✅ No duplicate reconciliation problem detected."
      : "⚠️ Duplicate daily/draw records detected. Do not run another write sync until reviewed.",
  );
  console.log("");
  console.log(
    "🛡️ Diagnostic complete · database unchanged.",
  );
  console.log("");
}


main()
  .catch(
    (
      error: unknown,
    ) => {
      console.error("");
      console.error(
        "❌ US Open DB diagnostic crashed.",
      );
      console.error(
        error instanceof Error
          ? error.message
          : error,
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
