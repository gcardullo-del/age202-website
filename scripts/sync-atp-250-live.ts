import "dotenv/config";

import {
  atp250LiveRegistry,
  getCompletedAtp250,
  type Atp250LiveTournament,
} from "../lib/data/atp-250-live-tournaments";

import {
  AtpSourceBlockedError,
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
} from "../lib/services/atp-tournament-sync.service";

import {
  prisma,
} from "../lib/prisma";


const WRITE_FLAG = "--write";
const YEAR = 2026;


type TournamentRunResult = {
  tournament: Atp250LiveTournament;
  status:
    | "passed"
    | "written"
    | "blocked"
    | "failed"
    | "skipped";
  detail: string;
};


async function processTournament(
  tournament: Atp250LiveTournament,
  writeEnabled: boolean,
): Promise<TournamentRunResult> {
  console.log("");
  console.log(
    `🎾 ${tournament.name}`,
  );
  console.log(
    `   CMS: ${tournament.cmsSlug} · ATP: ${tournament.atpSlug}/${tournament.atpTournamentId}`,
  );

  try {
    const extracted =
      await extractAtpTournamentFinal({
        tournamentSlug:
          tournament.atpSlug,

        tournamentId:
          tournament.atpTournamentId,

        year:
          YEAR,
      });

    /*
     * ATP slug e CMS slug possono essere diversi.
     * Il parser deve ricevere lo slug AGE202 prima
     * della persistenza.
     */
    const raw = {
      ...extracted,
      tournamentSlug:
        tournament.cmsSlug,
    };

    const parsed =
      parseAtpTournamentFinal(
        raw,
      );

    const validation =
      validateAtpTournamentResult(
        parsed,
      );

    if (!validation.valid) {
      throw new Error(
        `Validation failed: ${validation.errors.join(" | ")}`,
      );
    }

    if (
      validation.warnings.length >
      0
    ) {
      for (
        const warning
        of validation.warnings
      ) {
        console.log(
          `   ⚠️ ${warning}`,
        );
      }
    }

    console.log(
      `   🏆 ${parsed.champion.name} d. ${parsed.runnerUp.name} · ${parsed.score}`,
    );

    if (!writeEnabled) {
      console.log(
        "   🟢 PASSED · dry run",
      );

      return {
        tournament,
        status:
          "passed",
        detail:
          `${parsed.champion.name} d. ${parsed.runnerUp.name} · ${parsed.score}`,
      };
    }

    const syncResult =
      await syncAtpTournamentResult(
        parsed,
      );

    console.log(
      `   💾 WRITTEN · ${syncResult.edition.created ? "created" : "updated"}`,
    );

    return {
      tournament,
      status:
        "written",
      detail:
        `${parsed.champion.name} d. ${parsed.runnerUp.name} · ${parsed.score}`,
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : String(error);

    if (
      error instanceof
      AtpSourceBlockedError
    ) {
      console.log(
        `   🛡️ BLOCKED · ${message}`,
      );
      console.log(
        "   No database write performed. A future sync can retry automatically.",
      );

      return {
        tournament,
        status:
          "blocked",
        detail:
          message,
      };
    }

    console.log(
      `   🔴 FAILED · ${message}`,
    );

    return {
      tournament,
      status:
        "failed",
      detail:
        message,
    };
  }
}


async function main() {
  const writeEnabled =
    process.argv.includes(
      WRITE_FLAG,
    );

  console.log("");
  console.log(
    "🎾 AGE202 · ATP 250 BULK LIVE SYNC",
  );
  console.log(
    "════════════════════════════════════════════",
  );
  console.log(
    writeEnabled
      ? "🔴 WRITE MODE"
      : "🛡️ BULK DRY RUN · DATABASE UNCHANGED",
  );

  const completed =
    getCompletedAtp250();

  const completedSlugs =
    new Set(
      completed.map(
        (tournament) =>
          tournament.cmsSlug,
      ),
    );

  const results:
    TournamentRunResult[] = [];

  for (
    const tournament
    of atp250LiveRegistry
  ) {
    if (
      !completedSlugs.has(
        tournament.cmsSlug,
      )
    ) {
      console.log("");
      console.log(
        `⏭️ ${tournament.name} · SKIPPED`,
      );
      console.log(
        `   Tournament not completed yet · ends ${tournament.endDate}`,
      );

      results.push({
        tournament,
        status:
          "skipped",
        detail:
          `Not completed · ends ${tournament.endDate}`,
      });

      continue;
    }

    results.push(
      await processTournament(
        tournament,
        writeEnabled,
      ),
    );
  }

  const passed =
    results.filter(
      (result) =>
        result.status ===
        "passed",
    ).length;

  const written =
    results.filter(
      (result) =>
        result.status ===
        "written",
    ).length;

  const blocked =
    results.filter(
      (result) =>
        result.status ===
        "blocked",
    ).length;

  const failed =
    results.filter(
      (result) =>
        result.status ===
        "failed",
    ).length;

  const skipped =
    results.filter(
      (result) =>
        result.status ===
        "skipped",
    ).length;

  console.log("");
  console.log(
    "════════════════════════════════════════════",
  );
  console.log(
    "🏆 AGE202 ATP 250 LIVE REPORT",
  );
  console.log(
    "════════════════════════════════════════════",
  );

  for (
    const result
    of results
  ) {
    const icon =
      result.status === "failed"
        ? "🔴"
        : result.status === "blocked"
          ? "🛡️"
          : result.status === "skipped"
            ? "⏭️"
            : result.status === "written"
              ? "💾"
              : "🟢";

    console.log(
      `${icon} ${result.tournament.name} · ${result.status.toUpperCase()}`,
    );
  }

  console.log("");
  console.log(
    `🟢 Passed:  ${passed}`,
  );
  console.log(
    `💾 Written: ${written}`,
  );
  console.log(
    `🛡️ Blocked: ${blocked}`,
  );
  console.log(
    `🔴 Failed:  ${failed}`,
  );
  console.log(
    `⏭️ Skipped: ${skipped}`,
  );

  if (!writeEnabled) {
    console.log(
      "🛡️ Database writes: 0",
    );
  }

  console.log("");

  if (failed > 0) {
    process.exitCode =
      1;
  }
}


main()
  .catch(
    (error: unknown) => {
      console.error("");
      console.error(
        "❌ ATP 250 bulk sync crashed.",
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