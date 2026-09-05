import "dotenv/config";


import {
  getActiveAtpTournaments,
} from "../lib/data/tournaments/atp-active-tournament-selector";

import {
  syncAtpTournamentDailyMatches,
} from "../lib/services/atp-tournament-daily-match-sync.service";

import {
  syncAtpTournamentDraw,
} from "../lib/services/atp-tournament-draw-sync.service";

import {
  extractAtpTournamentDailyMatches,
} from "./atp-tournament-daily-matches-extractor";

import {
  extractAtpTournamentDraw,
} from "./atp-tournament-matches-extractor";


const WRITE_FLAG =
  "--write";


function hasWriteFlag(): boolean {
  return process.argv.includes(
    WRITE_FLAG,
  );
}


function toDate(
  value:
    | string
    | null
    | undefined,
): Date | null {
  if (!value) {
    return null;
  }

  const parsed =
    new Date(
      `${value}T00:00:00.000Z`,
    );

  return Number.isNaN(
    parsed.getTime(),
  )
    ? null
    : parsed;
}


function formatMatch(
  match: Awaited<
    ReturnType<
      typeof extractAtpTournamentDailyMatches
    >
  >["matches"][number],
): string {
  const statusIcon =
    match.status === "COMPLETED"
      ? "✅"
      : match.status === "LIVE"
        ? "🔴"
        : "🕒";

  const round =
    match.roundLabel ??
    "Unknown round";

  const court =
    match.court
      ? ` · ${match.court}`
      : "";

  const score =
    match.score
      ? ` · ${match.score}`
      : "";

  return (
    `${statusIcon} ${round} · ` +
    `${match.playerOne.name} vs ${match.playerTwo.name}` +
    `${court}${score}`
  );
}


async function main() {
  const write =
    hasWriteFlag();

  const now =
    new Date();

  const date =
    now
      .toISOString()
      .slice(
        0,
        10,
      );


  console.log("");

  console.log(
    "════════════════════════════════════════════",
  );

  console.log(
    "🎾 AGE202 · ACTIVE ATP LIVE SYNC",
  );

  console.log(
    "════════════════════════════════════════════",
  );

  console.log(
    `📅 Date: ${date}`,
  );

  console.log(
    write
      ? "✍️ WRITE MODE"
      : "🛡️ DRY RUN · DATABASE UNCHANGED",
  );

  console.log(
    "📋 Daily schedule: SYNC THIS RUN",
  );

  console.log(
    "🏁 Completed results: SYNC THIS RUN",
  );

  console.log("");


  const selection =
    getActiveAtpTournaments(
      now,
    );


  if (
    selection.tournaments.length ===
    0
  ) {
    console.log(
      "ℹ️ No supported ATP tournament is active.",
    );

    console.log("");

    return;
  }


  console.log(
    `🏷️ Category: ${selection.category}`,
  );

  console.log(
    `🎯 Tournaments: ${selection.tournaments.length}`,
  );

  console.log("");


  let scheduleExtractedTotal =
    0;

  let resultExtractedTotal =
    0;

  let writtenCreated =
    0;

  let writtenUpdated =
    0;

  let drawCreated =
    0;

  let drawUpdated =
    0;

  let failed =
    0;


  for (
    const tournament
    of selection.tournaments
  ) {
    console.log(
      "────────────────────────────────────────────",
    );

    console.log(
      `🏆 ${tournament.name}`,
    );

    console.log(
      `   AGE202: ${tournament.cmsSlug}`,
    );

    console.log(
      `   ATP:    ${tournament.atpSlug}/${tournament.atpTournamentId}`,
    );

    console.log("");


    try {
      const year =
        Number.parseInt(
          tournament.startDate.slice(
            0,
            4,
          ),
          10,
        );


      /*
       * 1. DAILY SCHEDULE
       *
       * Questo alimenta MATCHES OF THE DAY.
       *
       * Viene sincronizzato ad OGNI esecuzione del workflow.
       *
       * In questo modo:
       *
       * - tutti gli incontri programmati per oggi sono presenti;
       * - eventuali modifiche di orario/campo vengono recepite;
       * - non dipendiamo più dall'orario esatto di partenza
       *   di GitHub Actions.
       *
       * Il live score rimane responsabilità del workflow
       * dedicato ATP Live Score Sync.
       */
      const extracted =
        await extractAtpTournamentDailyMatches({
          tournamentSlug:
            tournament.atpSlug,

          tournamentId:
            tournament.atpTournamentId,

          year,

          date,
        });


      scheduleExtractedTotal +=
        extracted.matches.length;


      console.log(
        `📋 Schedule: ${extracted.scheduleLabel ?? date}`,
      );

      console.log(
        `🎾 ATP singles scheduled: ${extracted.matches.length}`,
      );

      console.log("");


      for (
        const match
        of extracted.matches
      ) {
        console.log(
          formatMatch(
            match,
          ),
        );
      }


      console.log("");


      if (write) {
        const result =
          await syncAtpTournamentDailyMatches({
            cmsTournamentSlug:
              tournament.cmsSlug,

            atpTournamentId:
              tournament.atpTournamentId,

            year,

            startDate:
              toDate(
                tournament.startDate,
              ),

            endDate:
              toDate(
                tournament.endDate,
              ),

            extractedAt:
              extracted.extractedAt,

            matches:
              extracted.matches.map(
                (match) => ({
                  externalId:
                    match.externalId,

                  playerOne: {
                    name:
                      match.playerOne.name,

                    profileSlug:
                      match.playerOne.profileSlug,

                    externalId:
                      match.playerOne.externalId,
                  },

                  playerTwo: {
                    name:
                      match.playerTwo.name,

                    profileSlug:
                      match.playerTwo.profileSlug,

                    externalId:
                      match.playerTwo.externalId,
                  },

                  status:
                    match.status,

                  scheduledAt:
                    match.scheduledAt,

                  court:
                    match.court,

                  roundLabel:
                    match.roundLabel,

                  winner:
                    match.winner
                      ? {
                          name:
                            match.winner.name,

                          profileSlug:
                            match.winner.profileSlug,

                          externalId:
                            match.winner.externalId,
                        }
                      : null,

                  score:
                    match.score,
                }),
              ),
          });


        writtenCreated +=
          result.matches.created;

        writtenUpdated +=
          result.matches.updated;


        console.log(
          "✅ DAILY SCHEDULE DATABASE SYNC COMPLETE",
        );

        console.log(
          `   Edition created: ${result.edition.created ? "yes" : "no"}`,
        );

        console.log(
          `   Entries created: ${result.entries.created}`,
        );

        console.log(
          `   Entries updated: ${result.entries.updated}`,
        );

        console.log(
          `   Matches created: ${result.matches.created}`,
        );

        console.log(
          `   Matches updated: ${result.matches.updated}`,
        );

        console.log(
          `   Matched by external ID: ${result.matches.matchedByExternalId}`,
        );

        console.log(
          `   Matched by players: ${result.matches.matchedByPlayers}`,
        );

        console.log("");
      } else {
        console.log(
          "🛡️ Daily schedule dry run: no database changes.",
        );

        console.log("");
      }


      /*
       * 2. CURRENT RESULTS
       *
       * Questa parte continua ad aggiornare i risultati
       * completati e il tabellone progressivo.
       *
       * È separata dal live score.
       */
      const draw =
        await extractAtpTournamentDraw({
          tournamentSlug:
            tournament.atpSlug,

          tournamentId:
            tournament.atpTournamentId,

          year,

          sourceMode:
            "current",
        });


      resultExtractedTotal +=
        draw.matches.length;


      console.log(
        `🏁 Completed results extracted: ${draw.matches.length}`,
      );

      console.log(
        `👥 Players in progressive draw: ${draw.players.length}`,
      );

      console.log("");


      if (!write) {
        console.log(
          "🛡️ Progressive results dry run: no database changes.",
        );

        console.log("");

        continue;
      }


      const drawResult =
        await syncAtpTournamentDraw({
          cmsTournamentSlug:
            tournament.cmsSlug,

          atpTournamentId:
            tournament.atpTournamentId,

          year,

          startDate:
            toDate(
              tournament.startDate,
            ),

          endDate:
            toDate(
              tournament.endDate,
            ),

          drawSize:
            draw.drawSize,

          extractedAt:
            draw.extractedAt,

          syncMode:
            "progressive",

          players:
            draw.players,

          matches:
            draw.matches,
        });


      drawCreated +=
        drawResult.matches.created;

      drawUpdated +=
        drawResult.matches.updated;


      console.log(
        "✅ PROGRESSIVE RESULTS SYNC COMPLETE",
      );

      console.log(
        `   Edition created: ${drawResult.edition.created ? "yes" : "no"}`,
      );

      console.log(
        `   Entries created: ${drawResult.entries.created}`,
      );

      console.log(
        `   Entries updated: ${drawResult.entries.updated}`,
      );

      console.log(
        `   Matches created: ${drawResult.matches.created}`,
      );

      console.log(
        `   Matches updated: ${drawResult.matches.updated}`,
      );

      console.log(
        `   Progression links: ${drawResult.matches.linkedToNextRound}`,
      );

      console.log("");
    } catch (error) {
      failed +=
        1;

      const message =
        error instanceof Error
          ? error.message
          : String(
              error,
            );

      console.log(
        "🔴 SYNC FAILED",
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
    "📊 AGE202 ACTIVE ATP LIVE REPORT",
  );

  console.log(
    "════════════════════════════════════════════",
  );

  console.log(
    `📋 Schedule extracted: ${scheduleExtractedTotal}`,
  );

  console.log(
    `🏁 Results extracted:  ${resultExtractedTotal}`,
  );

  console.log(
    `🆕 Daily created:      ${writtenCreated}`,
  );

  console.log(
    `🔄 Daily updated:      ${writtenUpdated}`,
  );

  console.log(
    `🆕 Draw created:       ${drawCreated}`,
  );

  console.log(
    `🔄 Draw updated:       ${drawUpdated}`,
  );

  console.log(
    `🔴 Failed:             ${failed}`,
  );

  console.log(
    `💾 DB writes: ${write ? "ENABLED" : "0"}`,
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
    (error: unknown) => {
      console.error("");

      console.error(
        "❌ AGE202 active ATP live sync crashed.",
      );

      console.error(
        error,
      );

      process.exitCode =
        1;
    },
  );