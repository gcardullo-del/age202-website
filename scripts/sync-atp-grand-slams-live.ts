import "dotenv/config";

import {
  atpGrandSlamLiveRegistry,
  getCompletedGrandSlams,
  type AtpGrandSlamLiveTournament,
} from "../lib/data/tournaments/atp-grand-slam-live-tournaments";

import {
  extractAtpTournamentFinal,
} from "./atp-tournament-extractor";

import {
  extractAtpTournamentDraw,
} from "./atp-tournament-matches-extractor";

import {
  extractOfficialGrandSlamFinal,
  type OfficialGrandSlamSlug,
} from "./grand-slam-official-final-extractor";

import {
  parseAtpTournamentFinal,
  type RawAtpTournamentFinal,
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


const WRITE_FLAG =
  "--write";

const YEAR =
  2026;


type TournamentRunResult = {
  tournament:
    AtpGrandSlamLiveTournament;

  status:
    | "passed"
    | "written"
    | "failed"
    | "skipped";

  detail:
    string;
};


function toRawFinalFromDraw(
  tournament:
    AtpGrandSlamLiveTournament,

  draw:
    Awaited<
      ReturnType<
        typeof extractAtpTournamentDraw
      >
    >,
): RawAtpTournamentFinal {
  const finalMatch =
    draw.matches.find(
      (match) =>
        match.round ===
        "FINAL",
    );


  if (!finalMatch) {
    throw new Error(
      "Draw fallback did not contain a FINAL match.",
    );
  }


  if (
    !finalMatch.winner?.name ||
    !finalMatch.loser?.name
  ) {
    throw new Error(
      "Draw fallback FINAL is missing winner or runner-up.",
    );
  }


  if (!finalMatch.score) {
    throw new Error(
      "Draw fallback FINAL is missing the final score.",
    );
  }


  return {
    tournamentSlug:
      tournament.cmsSlug,

    year:
      YEAR,

    editionKey:
      "main",

    startDate:
      tournament.startDate,

    endDate:
      tournament.endDate,

    drawSize:
      draw.drawSize,

    championName:
      finalMatch.winner.name,

    championProfileSlug:
      finalMatch.winner.profileSlug,

    championCountryCode:
      null,

    runnerUpName:
      finalMatch.loser.name,

    runnerUpProfileSlug:
      finalMatch.loser.profileSlug,

    runnerUpCountryCode:
      null,

    score:
      finalMatch.score,
  };
}


function toRawFinalFromOfficial(
  tournament:
    AtpGrandSlamLiveTournament,

  official:
    Awaited<
      ReturnType<
        typeof extractOfficialGrandSlamFinal
      >
    >,
): RawAtpTournamentFinal {
  return {
    tournamentSlug:
      tournament.cmsSlug,

    year:
      YEAR,

    editionKey:
      "main",

    startDate:
      tournament.startDate,

    endDate:
      tournament.endDate,

    /*
     * Grand Slam men's singles main draw.
     * Existing ATP extraction can still provide the exact draw size whenever
     * it succeeds. The official fallback is only reached after ATP failed.
     */
    drawSize:
      128,

    championName:
      official.championName,

    championProfileSlug:
      null,

    championCountryCode:
      null,

    runnerUpName:
      official.runnerUpName,

    runnerUpProfileSlug:
      null,

    runnerUpCountryCode:
      null,

    score:
      official.score,
  };
}


async function extractGrandSlamFinal(
  tournament:
    AtpGrandSlamLiveTournament,
): Promise<RawAtpTournamentFinal> {
  let primaryMessage =
    "unknown error";

  try {
    return await extractAtpTournamentFinal({
      tournamentSlug:
        tournament.atpSlug,

      tournamentId:
        tournament.atpTournamentId,

      year:
        YEAR,
    });
  } catch (
    primaryError
  ) {
    primaryMessage =
      primaryError instanceof Error
        ? primaryError.message
        : String(
            primaryError,
          );


    console.log(
      `   ⚠️ Primary ATP final extractor failed: ${primaryMessage}`,
    );
  }


  try {
    console.log(
      "   ↪ Trying completed ATP draw as secondary fallback.",
    );


    const draw =
      await extractAtpTournamentDraw({
        tournamentSlug:
          tournament.atpSlug,

        tournamentId:
          tournament.atpTournamentId,

        year:
          YEAR,

        sourceMode:
          "archive",
      });


    const raw =
      toRawFinalFromDraw(
        tournament,
        draw,
      );


    console.log(
      "   ✅ ATP draw fallback resolved the completed final.",
    );


    return raw;
  } catch (
    drawError
  ) {
    const drawMessage =
      drawError instanceof Error
        ? drawError.message
        : String(
            drawError,
          );


    console.log(
      `   ⚠️ ATP draw fallback failed: ${drawMessage}`,
    );
  }


  console.log(
    "   ↪ Trying official Grand Slam website as final fallback.",
  );


  const official =
    await extractOfficialGrandSlamFinal({
      tournamentSlug:
        tournament.cmsSlug as OfficialGrandSlamSlug,

      year:
        YEAR,
    });


  return toRawFinalFromOfficial(
    tournament,
    official,
  );
}


async function processTournament(
  tournament:
    AtpGrandSlamLiveTournament,

  writeEnabled:
    boolean,
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
      await extractGrandSlamFinal(
        tournament,
      );


    /*
     * Registry dates / CMS slug always win.
     * This prevents a fallback source from changing AGE202 identity data.
     */
    const raw:
      RawAtpTournamentFinal = {
        ...extracted,

        tournamentSlug:
          tournament.cmsSlug,

        startDate:
          tournament.startDate,

        endDate:
          tournament.endDate,
      };


    const parsed =
      parseAtpTournamentFinal(
        raw,
      );


    const validation =
      validateAtpTournamentResult(
        parsed,
      );


    if (
      !validation.valid
    ) {
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
      `   🏆 ${parsed.champion.name} d. ${parsed.runnerUp.name} · ${parsed.score ?? "score n/a"}`,
    );


    if (
      !writeEnabled
    ) {
      console.log(
        "   🟢 PASSED · dry run",
      );


      return {
        tournament,

        status:
          "passed",

        detail:
          `${parsed.champion.name} d. ${parsed.runnerUp.name} · ${parsed.score ?? "score n/a"}`,
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
        `${parsed.champion.name} d. ${parsed.runnerUp.name} · ${parsed.score ?? "score n/a"}`,
    };
  } catch (
    error
  ) {
    const message =
      error instanceof Error
        ? error.message
        : String(
            error,
          );


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
    "🎾 AGE202 · ATP GRAND SLAM BULK LIVE SYNC",
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
    getCompletedGrandSlams();


  const completedSlugs =
    new Set(
      completed.map(
        (tournament) =>
          tournament.cmsSlug,
      ),
    );


  const results:
    TournamentRunResult[] =
      [];


  for (
    const tournament
    of atpGrandSlamLiveRegistry
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
    "🏆 AGE202 GRAND SLAM LIVE REPORT",
  );

  console.log(
    "════════════════════════════════════════════",
  );


  for (
    const result
    of results
  ) {
    const icon =
      result.status ===
      "failed"
        ? "🔴"
        : result.status ===
          "skipped"
          ? "⏭️"
          : result.status ===
            "written"
            ? "💾"
            : "🟢";


    console.log(
      `${icon} ${result.tournament.name} · ${result.status.toUpperCase()} · ${result.detail}`,
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
    `🔴 Failed:  ${failed}`,
  );

  console.log(
    `⏭️ Skipped: ${skipped}`,
  );


  if (
    !writeEnabled
  ) {
    console.log(
      "🛡️ Database writes: 0",
    );
  }


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
        "❌ Grand Slam bulk sync crashed.",
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

