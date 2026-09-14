import "dotenv/config";

import {
  TournamentCategory,
  TournamentCircuit,
  TournamentMatchStatus,
  TournamentRound,
} from "../generated/prisma/client";

import {
  prisma,
} from "../lib/prisma";

import {
  syncAtpTournamentResult,
} from "../lib/services/atp-tournament-sync.service";


const WRITE_FLAG =
  "--write";


const FINALIZABLE_CATEGORIES =
  new Set<TournamentCategory>([
    TournamentCategory.GRAND_SLAM,
    TournamentCategory.MASTERS_1000,
    TournamentCategory.ATP_500,
  ]);


function getTargetYear(): number {
  const yearArgument =
    process.argv.find(
      (argument) =>
        argument.startsWith(
          "--year=",
        ),
    );


  if (!yearArgument) {
    return new Date()
      .getUTCFullYear();
  }


  const year =
    Number.parseInt(
      yearArgument.slice(
        "--year=".length,
      ),
      10,
    );


  if (
    !Number.isInteger(
      year,
    ) ||
    year < 2000 ||
    year > 2200
  ) {
    throw new Error(
      `Invalid --year value: ${yearArgument}`,
    );
  }


  return year;
}


function normalizeName(
  value:
    | string
    | null
    | undefined,
): string | null {
  const normalized =
    value
      ?.trim()
      .replace(
        /\s+/g,
        " ",
      );

  return normalized || null;
}


function getCategoryLabel(
  category: TournamentCategory,
): string {
  switch (
    category
  ) {
    case TournamentCategory.GRAND_SLAM:
      return "GRAND SLAM";

    case TournamentCategory.MASTERS_1000:
      return "MASTERS 1000";

    case TournamentCategory.ATP_500:
      return "ATP 500";

    default:
      return category;
  }
}


async function main() {
  const writeEnabled =
    process.argv.includes(
      WRITE_FLAG,
    );

  const year =
    getTargetYear();


  console.log("");

  console.log(
    "════════════════════════════════════════════",
  );

  console.log(
    "🏆 AGE202 · ATP TOURNAMENT FINALIZATION FROM DB",
  );

  console.log(
    "════════════════════════════════════════════",
  );

  console.log(
    `📅 Year: ${year}`,
  );

  console.log(
    "🎯 Categories: GRAND_SLAM · MASTERS_1000 · ATP_500",
  );

  console.log(
    "🚫 ATP_250 excluded from DB finalization",
  );

  console.log(
    writeEnabled
      ? "✍️ WRITE MODE"
      : "🛡️ DRY RUN · DATABASE UNCHANGED",
  );

  console.log("");


  /*
   * SOURCE OF TRUTH
   *
   * AGE202 already owns the synchronized final result.
   *
   * A tournament can be finalized from the internal DB only when:
   *
   * - ATP circuit
   * - supported category:
   *     GRAND_SLAM
   *     MASTERS_1000
   *     ATP_500
   * - round = FINAL
   * - status = COMPLETED
   * - winnerEntryId present
   *
   * ATP 250 is intentionally excluded because it is not part of
   * the Daily Match / progressive-draw pipeline.
   */
  const finals =
    await prisma.tournamentMatch.findMany({
      where: {
        round:
          TournamentRound.FINAL,

        status:
          TournamentMatchStatus.COMPLETED,

        winnerEntryId: {
          not:
            null,
        },

        edition: {
          is: {
            year,

            circuit:
              TournamentCircuit.ATP,

            cancelled:
              false,

            tournament: {
              is: {
                category: {
                  in: [
                    TournamentCategory.GRAND_SLAM,
                    TournamentCategory.MASTERS_1000,
                    TournamentCategory.ATP_500,
                  ],
                },

                active:
                  true,
              },
            },
          },
        },
      },

      include: {
        edition: {
          include: {
            tournament:
              true,
          },
        },

        playerOne: {
          include: {
            player:
              true,
          },
        },

        playerTwo: {
          include: {
            player:
              true,
          },
        },

        winner: {
          include: {
            player:
              true,
          },
        },
      },

      orderBy: [
        {
          edition: {
            startDate:
              "asc",
          },
        },

        {
          completedAt:
            "asc",
        },
      ],
    });


  console.log(
    `🎾 Completed ATP finals found: ${finals.length}`,
  );

  console.log("");


  if (
    finals.length ===
    0
  ) {
    console.log(
      "ℹ️ Nothing to finalize.",
    );

    console.log("");

    return;
  }


  let ready =
    0;

  let written =
    0;

  let failed =
    0;

  let skipped =
    0;


  for (
    const finalMatch
    of finals
  ) {
    const tournament =
      finalMatch.edition
        .tournament;


    if (
      !FINALIZABLE_CATEGORIES.has(
        tournament.category,
      )
    ) {
      skipped +=
        1;

      continue;
    }


    console.log(
      "────────────────────────────────────────────",
    );

    console.log(
      `🏟️ ${tournament.name} ${finalMatch.edition.year}`,
    );

    console.log(
      `🏷️ ${getCategoryLabel(tournament.category)}`,
    );


    const winnerEntry =
      finalMatch.winner;


    if (!winnerEntry) {
      failed +=
        1;

      console.log(
        "🔴 FINALIZATION BLOCKED · winner relation is missing.",
      );

      console.log("");

      continue;
    }


    const playerOne =
      finalMatch.playerOne;

    const playerTwo =
      finalMatch.playerTwo;


    if (
      !playerOne ||
      !playerTwo
    ) {
      failed +=
        1;

      console.log(
        "🔴 FINALIZATION BLOCKED · one or both finalists are missing.",
      );

      console.log("");

      continue;
    }


    const runnerUpEntry =
      playerOne.id ===
      winnerEntry.id
        ? playerTwo
        : playerTwo.id ===
          winnerEntry.id
          ? playerOne
          : null;


    if (!runnerUpEntry) {
      failed +=
        1;

      console.log(
        "🔴 FINALIZATION BLOCKED · winner is not one of the two finalists.",
      );

      console.log("");

      continue;
    }


    const championName =
      normalizeName(
        winnerEntry.player
          ?.name ??
        winnerEntry.name,
      );


    const runnerUpName =
      normalizeName(
        runnerUpEntry.player
          ?.name ??
        runnerUpEntry.name,
      );


    const score =
      normalizeName(
        finalMatch.scoreSummary,
      );


    if (
      !championName ||
      !runnerUpName ||
      !score
    ) {
      failed +=
        1;

      console.log(
        "🔴 FINALIZATION BLOCKED · champion, runner-up or final score is missing.",
      );

      console.log(
        `   Champion: ${championName ?? "missing"}`,
      );

      console.log(
        `   Runner-up: ${runnerUpName ?? "missing"}`,
      );

      console.log(
        `   Score: ${score ?? "missing"}`,
      );

      console.log("");

      continue;
    }


    ready +=
      1;


    console.log(
      `🏆 Champion:  ${championName}`,
    );

    console.log(
      `🥈 Runner-up: ${runnerUpName}`,
    );

    console.log(
      `📊 Score:     ${score}`,
    );

    console.log(
      "✅ Stored match: FINAL · COMPLETED",
    );


    /*
     * If TournamentEdition already contains the same winner,
     * syncAtpTournamentResult() remains safe:
     *
     * - same TournamentEdition is updated;
     * - TournamentChampion summary is recalculated;
     * - no duplicate edition is created.
     *
     * The ATP Trophy Cabinet reads TournamentEdition, so no
     * separate trophy write is required here.
     */
    if (!writeEnabled) {
      console.log(
        "🛡️ READY · no database changes.",
      );

      console.log("");

      continue;
    }


    try {
      const result =
        await syncAtpTournamentResult({
          tournamentSlug:
            tournament.slug,

          year:
            finalMatch.edition.year,

          editionKey:
            finalMatch.edition.editionKey,

          editionLabel:
            finalMatch.edition.editionLabel,

          startDate:
            finalMatch.edition.startDate,

          endDate:
            finalMatch.edition.endDate,

          drawSize:
            finalMatch.edition.drawSize,

          champion: {
            name:
              championName,

            profileSlug:
              winnerEntry.player
                ?.slug ??
              null,

            countryCode:
              winnerEntry.countryCode,
          },

          runnerUp: {
            name:
              runnerUpName,

            profileSlug:
              runnerUpEntry.player
                ?.slug ??
              null,

            countryCode:
              runnerUpEntry.countryCode,
          },

          score,
        });


      written +=
        1;


      console.log(
        `💾 FINALIZED · TournamentEdition ${result.edition.created ? "created" : "updated"}`,
      );

      console.log(
        `   Winner: ${result.champion.name}`,
      );

      console.log(
        `   Runner-up: ${result.runnerUp.name}`,
      );

      console.log(
        "   Hall of Champions: synchronized",
      );

      console.log(
        "   ATP Trophy Cabinet: updated through TournamentEdition",
      );

      console.log("");
    } catch (
      error
    ) {
      failed +=
        1;


      const message =
        error instanceof Error
          ? error.message
          : String(
              error,
            );


      console.log(
        "🔴 FINALIZATION FAILED",
      );

      console.log(
        `   ${message}`,
      );

      console.log("");
    }
  }


  console.log(
    "════════════════════════════════════════════",
  );

  console.log(
    "📊 ATP TOURNAMENT FINALIZATION REPORT",
  );

  console.log(
    "════════════════════════════════════════════",
  );

  console.log(
    `✅ Ready:   ${ready}`,
  );

  console.log(
    `💾 Written: ${written}`,
  );

  console.log(
    `⏭️ Skipped: ${skipped}`,
  );

  console.log(
    `🔴 Failed:  ${failed}`,
  );

  console.log(
    `💾 DB writes: ${writeEnabled ? "ENABLED" : "0"}`,
  );

  console.log("");


  if (
    failed >
    0
  ) {
    process.exitCode =
      1;
  }
}


main()
  .catch(
    (
      error:
        unknown,
    ) => {
      console.error("");

      console.error(
        "❌ ATP tournament DB finalization crashed.",
      );

      console.error(
        error,
      );

      process.exitCode =
        1;
    },
  )
  .finally(
    async () => {
      await prisma.$disconnect();
    },
  );
