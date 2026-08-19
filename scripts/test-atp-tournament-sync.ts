import "dotenv/config";

import {
  parseAtpTournamentFinal,
  type RawAtpTournamentFinal,
} from "./atp-tournament-parser";

import {
  validateAtpTournamentResult,
} from "./atp-tournament-validator";


/*
 * PILOTA AGE202 — MADRID 2026
 *
 * Fonte ufficiale ATP:
 * Men's Singles - Final
 * Jannik Sinner (ITA) d Alexander Zverev (GER) 61 62
 *
 * IMPORTANTE:
 * questo script è SOLO DRY RUN.
 * Non importa Prisma e non scrive nulla nel database.
 */
const madrid2026: RawAtpTournamentFinal = {
  tournamentSlug:
    "madrid",

  year:
    2026,

  editionKey:
    "main",

  championName:
    "Jannik Sinner",

  championCountryCode:
    "ITA",

  runnerUpName:
    "Alexander Zverev",

  runnerUpCountryCode:
    "GER",

  score:
    "61 62",
};


async function main() {
  console.log("");
  console.log(
    "🎾 AGE202 · ATP Tournament Sync · DRY RUN",
  );
  console.log(
    "────────────────────────────────────────",
  );

  const parsed =
    parseAtpTournamentFinal(
      madrid2026,
    );

  const validation =
    validateAtpTournamentResult(
      parsed,
    );

  console.log("");
  console.log(
    "📦 Parsed result",
  );
  console.dir(
    parsed,
    {
      depth:
        null,
    },
  );

  console.log("");
  console.log(
    validation.valid
      ? "🟢 VALIDATION PASSED"
      : "🔴 VALIDATION FAILED",
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

  if (
    validation.errors.length >
    0
  ) {
    console.log("");
    console.log(
      "❌ Errors",
    );

    for (
      const error
      of validation.errors
    ) {
      console.log(
        `   • ${error}`,
      );
    }

    process.exitCode =
      1;

    return;
  }

  console.log("");
  console.log(
    "🛡️ DATABASE UNCHANGED",
  );
  console.log(
    "   Dry run only: syncAtpTournamentResult() was NOT called.",
  );
  console.log("");
}


main().catch(
  (error) => {
    console.error("");
    console.error(
      "❌ ATP Tournament dry run failed.",
    );
    console.error(
      error,
    );

    process.exitCode =
      1;
  },
);
