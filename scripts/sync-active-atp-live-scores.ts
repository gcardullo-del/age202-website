import "dotenv/config";

import {
  prisma,
} from "../lib/prisma";

import {
  getActiveAtpTournaments,
} from "../lib/data/tournaments/atp-active-tournament-selector";

import {
  syncAtpTournamentLiveScores,
} from "../lib/services/atp-tournament-live-score-sync.service";

import {
  extractAtpLiveScores,
} from "./atp-live-scores-extractor";


const WRITE_FLAG =
  "--write";


function hasWriteFlag() {
  return process.argv.includes(
    WRITE_FLAG,
  );
}


async function main() {
  const write =
    hasWriteFlag();


  console.log("");
  console.log(
    "🎾 AGE202 — ATP LIVE SCORE SYNC",
  );

  console.log(
    "════════════════════════════════════════",
  );

  console.log(
    write
      ? "✍️ WRITE MODE"
      : "🛡️ DRY RUN — database unchanged",
  );


  const now =
    new Date();


  const selection =
    getActiveAtpTournaments(
      now,
    );


  if (
    selection.tournaments.length ===
    0
  ) {
    console.log("");
    console.log(
      "ℹ️ No supported ATP tournament is active.",
    );

    return;
  }


  console.log("");
  console.log(
    `🏷️ Category: ${selection.category}`,
  );

  console.log(
    `🎯 Active tournaments: ${selection.tournaments.length}`,
  );


  let totalLive =
    0;

  let totalMatched =
    0;

  let totalUpdated =
    0;

  let totalUnmatched =
    0;

  let totalAmbiguous =
    0;


  for (
    const tournament
    of selection.tournaments
  ) {
    console.log("");
    console.log(
      "────────────────────────────────────────",
    );

    console.log(
      `🏆 ${tournament.name}`,
    );

    console.log(
      `ATP: ${tournament.atpSlug}/${tournament.atpTournamentId}`,
    );


    const year =
      Number.parseInt(
        tournament.startDate.slice(
          0,
          4,
        ),
        10,
      );


    const extractedAt =
      new Date();


    const liveMatches =
      await extractAtpLiveScores({
        tournamentSlug:
          tournament.atpSlug,

        tournamentId:
          tournament.atpTournamentId,
      });


    console.log(
      `🔴 Live matches extracted: ${liveMatches.length}`,
    );


    totalLive +=
      liveMatches.length;


    if (
      liveMatches.length ===
      0
    ) {
      continue;
    }


    const result =
      await syncAtpTournamentLiveScores({
        cmsTournamentSlug:
          tournament.cmsSlug,

        year,

        extractedAt,

        write,

        matches:
          liveMatches.map(
            (match) => ({
              roundLabel:
                match.roundLabel,

              court:
                match.court,

              playerOne: {
                name:
                  match.playerOne.name,
              },

              playerTwo: {
                name:
                  match.playerTwo.name,
              },

              playerOneSetScores:
                match.playerOneSetScores,

              playerTwoSetScores:
                match.playerTwoSetScores,
            }),
          ),
      });


    totalMatched +=
      result.matched;

    totalUpdated +=
      result.updated;

    totalUnmatched +=
      result.unmatched;

    totalAmbiguous +=
      result.ambiguous;


    for (
      const match
      of result.results
    ) {
      console.log("");

      console.log(
        `${match.livePlayerOne} vs ${match.livePlayerTwo}`,
      );

      console.log(
        `   Match ID: ${match.matchId ?? "not found"}`,
      );

      console.log(
        `   Score: ${match.scoreSummary ?? "unavailable"}`,
      );

      console.log(
        `   ${match.message}`,
      );
    }
  }


  console.log("");
  console.log(
    "════════════════════════════════════════",
  );

  console.log(
    "📊 AGE202 ATP LIVE REPORT",
  );

  console.log(
    "════════════════════════════════════════",
  );

  console.log(
    `🔴 Live extracted: ${totalLive}`,
  );

  console.log(
    `✅ Matched:        ${totalMatched}`,
  );

  console.log(
    `💾 Updated:        ${totalUpdated}`,
  );

  console.log(
    `❌ Unmatched:      ${totalUnmatched}`,
  );

  console.log(
    `⚠️ Ambiguous:      ${totalAmbiguous}`,
  );

  console.log(
    `🗄️ DB writes:      ${write ? "ENABLED" : "0"}`,
  );

  console.log("");
}


main()
  .catch(
    (error: unknown) => {
      console.error("");
      console.error(
        "❌ AGE202 ATP live score sync failed.",
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