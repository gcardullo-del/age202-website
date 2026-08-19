import "dotenv/config";

import {
  extractAtpTournamentFinal,
} from "./atp-tournament-extractor";

import {
  parseAtpTournamentFinal,
} from "./atp-tournament-parser";

import {
  validateAtpTournamentResult,
} from "./atp-tournament-validator";

import {
  syncAtpTournamentResult,
} from "@/lib/services/atp-tournament-sync.service";

import {
  prisma,
} from "@/lib/prisma";


const WRITE_FLAG =
  "--write";


async function main() {
  const writeEnabled =
    process.argv.includes(
      WRITE_FLAG,
    );

  console.log("");
  console.log(
    "🎾 AGE202 · ATP TOURNAMENT LIVE SYNC",
  );
  console.log(
    "────────────────────────────────────────",
  );

  console.log(
    writeEnabled
      ? "🔴 WRITE MODE — database updates are ENABLED."
      : "🛡️ DRY RUN — database will NOT be modified.",
  );


  /*
   * PRIMO PILOTA:
   * Mutua Madrid Open 2026
   * ATP tournament ID: 1536
   */
  const raw =
    await extractAtpTournamentFinal({
      tournamentSlug:
        "madrid",

      tournamentId:
        "1536",

      year:
        2026,
    });


  const parsed =
    parseAtpTournamentFinal(
      raw,
    );


  const validation =
    validateAtpTournamentResult(
      parsed,
    );


  console.log("");
  console.log(
    "📦 Normalized result",
  );

  console.dir(
    parsed,
    {
      depth:
        null,
    },
  );


  if (
    validation.warnings.length >
    0
  ) {
    console.log("");
    console.log(
      "⚠️ Warnings",
    );

    for (
      const warning
      of validation.warnings
    ) {
      console.log(
        `   • ${warning}`,
      );
    }
  }


  if (!validation.valid) {
    console.log("");
    console.log(
      "🔴 VALIDATION FAILED",
    );

    for (
      const error
      of validation.errors
    ) {
      console.log(
        `   • ${error}`,
      );
    }

    throw new Error(
      "Tournament sync stopped before database write.",
    );
  }


  console.log("");
  console.log(
    "🟢 VALIDATION PASSED",
  );


  if (!writeEnabled) {
    console.log("");
    console.log(
      "🛡️ DATABASE UNCHANGED",
    );
    console.log(
      `   Re-run with ${WRITE_FLAG} to persist this result.`,
    );
    console.log("");

    return;
  }


  console.log("");
  console.log(
    "💾 Starting AGE202 database transaction...",
  );


  const result =
    await syncAtpTournamentResult(
      parsed,
    );


  console.log("");
  console.log(
    "────────────────────────────────────────",
  );
  console.log(
    "🏆 ATP TOURNAMENT SYNC COMPLETED",
  );
  console.log(
    "────────────────────────────────────────",
  );

  console.log(
    `✅ Tournament: ${result.tournament.name} (${result.tournament.category})`,
  );

  console.log(
    `✅ Edition:    ${result.edition.year} · ${result.edition.editionKey} · ${result.edition.created ? "created" : "updated"}`,
  );

  console.log(
    `🏆 Champion:   ${result.champion.name}`,
  );

  console.log(
    `🥈 Runner-up:  ${result.runnerUp.name}`,
  );

  console.log(
    `🔗 Champion Player ID:  ${result.champion.playerId}`,
  );

  console.log(
    `🔗 Runner-up Player ID: ${result.runnerUp.playerId}`,
  );

  console.log("");
  console.log(
    "✅ TournamentEdition + Player links persisted.",
  );
  console.log("");
}


main()
  .catch(
    (error: unknown) => {
      console.error("");
      console.error(
        "❌ ATP TOURNAMENT LIVE SYNC FAILED.",
      );

      if (
        error instanceof Error
      ) {
        console.error(
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
