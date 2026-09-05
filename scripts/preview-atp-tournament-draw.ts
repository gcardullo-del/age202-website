

import {
  atpMasters1000LiveRegistry,
} from "../lib/data/atp-live-tournaments";

import {
  atp500LiveRegistry,
} from "../lib/data/atp-500-live-tournaments";

import {
  atpGrandSlamLiveRegistry,
} from "../lib/data/tournaments/atp-grand-slam-live-tournaments";

import {
  prisma,
} from "../lib/prisma";

import {
  syncAtpTournamentDraw,
} from "../lib/services/atp-tournament-draw-sync.service";

import {
  extractAtpTournamentDraw,
  type ExtractedAtpTournamentRound,
} from "./atp-tournament-matches-extractor";


const WRITE_FLAG =
  "--write";

const DEFAULT_YEAR =
  2026;


type SupportedLiveTournament = {
  cmsSlug: string;
  atpSlug: string;
  atpTournamentId: string;
  name: string;
  category:
    | "GRAND_SLAM"
    | "MASTERS_1000"
    | "ATP_500";
  startDate: string;
  endDate: string;
};


const ROUND_LABELS: Record<
  ExtractedAtpTournamentRound,
  string
> = {
  ROUND_OF_128: "Round of 128",
  ROUND_OF_64: "Round of 64",
  ROUND_OF_32: "Round of 32",
  ROUND_OF_16: "Round of 16",
  QUARTERFINAL: "Quarterfinals",
  SEMIFINAL: "Semifinals",
  FINAL: "Final",
};


type TournamentRunStatus =
  | "passed"
  | "written"
  | "failed"
  | "skipped";


type TournamentRunResult = {
  tournament:
    SupportedLiveTournament;
  status:
    TournamentRunStatus;
  detail:
    string;
};


function readArgument(
  name: string,
): string | null {
  const prefix =
    `--${name}=`;

  const argument =
    process.argv.find(
      (value) =>
        value.startsWith(
          prefix,
        ),
    );

  return argument
    ? argument.slice(
        prefix.length,
      )
    : null;
}


function parseYear(
  value: string | null,
): number {
  if (!value) {
    return DEFAULT_YEAR;
  }

  const year =
    Number.parseInt(
      value,
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
      `Invalid year: ${value}.`,
    );
  }

  return year;
}


function parseRegistryDate(
  value: string,
): Date {
  const date =
    new Date(
      `${value}T12:00:00.000Z`,
    );

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    throw new Error(
      `Invalid registry date: ${value}.`,
    );
  }

  return date;
}


function validateRegistryYear(
  tournament:
    SupportedLiveTournament,
  year: number,
) {
  const startYear =
    Number.parseInt(
      tournament.startDate.slice(
        0,
        4,
      ),
      10,
    );

  const endYear =
    Number.parseInt(
      tournament.endDate.slice(
        0,
        4,
      ),
      10,
    );

  if (
    startYear !== year ||
    endYear !== year
  ) {
    throw new Error(
      `${tournament.name} has ${startYear}/${endYear} dates in the registry, but --year=${year} was requested. Update the registry dates first.`,
    );
  }
}


function getTournamentPhase(
  tournament:
    SupportedLiveTournament,
  now = new Date(),
):
  | "upcoming"
  | "active"
  | "completed" {
  const start =
    new Date(
      `${tournament.startDate}T00:00:00.000Z`,
    );

  const end =
    new Date(
      `${tournament.endDate}T23:59:59.999Z`,
    );

  if (
    now.getTime() <
    start.getTime()
  ) {
    return "upcoming";
  }

  if (
    now.getTime() >
    end.getTime()
  ) {
    return "completed";
  }

  return "active";
}


function validateExtractedDraw(
  matches: Array<{
    round:
      ExtractedAtpTournamentRound;
  }>,
  playerCount: number,
) {
  if (playerCount < 2) {
    throw new Error(
      `Invalid player count: ${playerCount}.`,
    );
  }

  if (matches.length < 1) {
    throw new Error(
      "No completed matches were extracted.",
    );
  }

  const finalCount =
    matches.filter(
      (match) =>
        match.round ===
        "FINAL",
    ).length;

  if (finalCount > 1) {
    throw new Error(
      `Expected at most one final; found ${finalCount}.`,
    );
  }
}


function getAllSupportedTournaments():
  SupportedLiveTournament[] {
  return [
    ...atpGrandSlamLiveRegistry,
    ...atpMasters1000LiveRegistry,
    ...atp500LiveRegistry,
  ];
}


function getSelectedTournaments(
  requestedSlug: string | null,
): SupportedLiveTournament[] {
  const normalizedSlug =
    requestedSlug
      ?.trim()
      .toLowerCase();

  const all =
    getAllSupportedTournaments();

  if (
    !normalizedSlug ||
    normalizedSlug === "all"
  ) {
    return all;
  }

  const tournament =
    all.find(
      (item) =>
        item.cmsSlug ===
          normalizedSlug ||
        item.atpSlug ===
          normalizedSlug,
    );

  if (!tournament) {
    throw new Error(
      `Tournament not found in supported ATP draw registries: ${normalizedSlug}.`,
    );
  }

  return [
    tournament,
  ];
}


async function processTournament(
  tournament:
    SupportedLiveTournament,
  year: number,
  writeEnabled: boolean,
): Promise<TournamentRunResult> {
  console.log("");
  console.log(
    `🎾 ${tournament.name}`,
  );
  console.log(
    `   ${tournament.category} · AGE202: ${tournament.cmsSlug} · ATP: ${tournament.atpSlug}/${tournament.atpTournamentId}`,
  );

  try {
    validateRegistryYear(
      tournament,
      year,
    );

    const phase =
      getTournamentPhase(
        tournament,
      );

    if (
      phase ===
      "upcoming"
    ) {
      const detail =
        `Upcoming · starts ${tournament.startDate}`;

      console.log(
        `   ⏭️ SKIPPED · ${detail}`,
      );

      return {
        tournament,
        status:
          "skipped",
        detail,
      };
    }

    console.log(
      phase === "active"
        ? `   🟢 ACTIVE · progressive draw sync`
        : `   ✅ COMPLETED · full draw reconciliation`,
    );

    const draw =
      await extractAtpTournamentDraw({
        tournamentSlug:
          tournament.atpSlug,
        tournamentId:
          tournament.atpTournamentId,
        year,
        sourceMode:
          phase === "active"
            ? "current"
            : "archive",
      });

    validateExtractedDraw(
      draw.matches,
      draw.players.length,
    );

    const matchesByRound =
      new Map<
        ExtractedAtpTournamentRound,
        number
      >();

    for (
      const match
      of draw.matches
    ) {
      matchesByRound.set(
        match.round,
        (
          matchesByRound.get(
            match.round,
          ) ??
          0
        ) + 1,
      );
    }

    for (
      const round
      of Object.keys(
        ROUND_LABELS,
      ) as ExtractedAtpTournamentRound[]
    ) {
      const matchCount =
        matchesByRound.get(
          round,
        ) ??
        0;

      if (
        matchCount >
        0
      ) {
        console.log(
          `   🎾 ${ROUND_LABELS[round]}: ${matchCount}`,
        );
      }
    }

    console.log(
      `   👥 Players: ${draw.players.length}`,
    );
    console.log(
      `   🎾 Completed matches: ${draw.matches.length}`,
    );

    const final =
      draw.matches.find(
        (match) =>
          match.round ===
          "FINAL",
      );

    const detail =
      final
        ? `${final.winner.name} d. ${final.loser.name}${
            final.score
              ? ` · ${final.score}`
              : ""
          }`
        : phase === "active"
          ? `Progressive draw · ${draw.matches.length} completed matches`
          : `Completed draw without final result`;

    console.log(
      final
        ? `   🏆 ${detail}`
        : `   🔄 ${detail}`,
    );

    if (!writeEnabled) {
      console.log(
        "   🟢 PASSED · dry run",
      );

      return {
        tournament,
        status:
          "passed",
        detail,
      };
    }

    const result =
      await syncAtpTournamentDraw({
        cmsTournamentSlug:
          tournament.cmsSlug,
        atpTournamentId:
          tournament.atpTournamentId,
        year,
        startDate:
          parseRegistryDate(
            tournament.startDate,
          ),
        endDate:
          parseRegistryDate(
            tournament.endDate,
          ),
        drawSize:
          draw.drawSize,
        extractedAt:
          draw.extractedAt,
        syncMode:
          phase ===
          "active"
            ? "progressive"
            : "final",
        players:
          draw.players,
        matches:
          draw.matches,
      });

    console.log(
      `   💾 WRITTEN · edition ${result.edition.created ? "created" : "updated"}`,
    );
    console.log(
      `   👥 Entries: ${result.entries.created} created · ${result.entries.updated} updated`,
    );
    console.log(
      `   🎾 Matches: ${result.matches.created} created · ${result.matches.updated} updated`,
    );
    console.log(
      `   🔗 Progression links: ${result.matches.linkedToNextRound}`,
    );

    return {
      tournament,
      status:
        "written",
      detail,
    };
  } catch (error) {
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


function printSummary(
  results:
    TournamentRunResult[],
  writeEnabled: boolean,
) {
  const countStatus =
    (
      status:
        TournamentRunStatus,
    ) =>
      results.filter(
        (result) =>
          result.status ===
          status,
      ).length;

  const passed =
    countStatus(
      "passed",
    );

  const written =
    countStatus(
      "written",
    );

  const failed =
    countStatus(
      "failed",
    );

  const skipped =
    countStatus(
      "skipped",
    );

  console.log("");
  console.log(
    "════════════════════════════════════════════",
  );
  console.log(
    "🏆 AGE202 · ATP DRAW REPORT",
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
      `${icon} ${result.tournament.name} · ${result.status.toUpperCase()}`,
    );
    console.log(
      `   ${result.detail}`,
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

  if (!writeEnabled) {
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


async function main() {
  const writeEnabled =
    process.argv.includes(
      WRITE_FLAG,
    );

  const year =
    parseYear(
      readArgument(
        "year",
      ),
    );

  const tournaments =
    getSelectedTournaments(
      readArgument(
        "tournament",
      ),
    );

  console.log("");
  console.log(
    "🎾 AGE202 · ATP DRAW SYNC",
  );
  console.log(
    "════════════════════════════════════════════",
  );
  console.log(
    `📅 Season: ${year}`,
  );
  console.log(
    `🏟️ Tournaments selected: ${tournaments.length}`,
  );
  console.log(
    writeEnabled
      ? "🔴 WRITE MODE · database changes enabled"
      : "🛡️ DRY RUN · database unchanged",
  );

  const results:
    TournamentRunResult[] =
      [];

  for (
    const tournament
    of tournaments
  ) {
    results.push(
      await processTournament(
        tournament,
        year,
        writeEnabled,
      ),
    );
  }

  printSummary(
    results,
    writeEnabled,
  );
}


main()
  .catch(
    (
      error:
        unknown,
    ) => {
      console.error("");
      console.error(
        "❌ ATP draw sync crashed.",
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
