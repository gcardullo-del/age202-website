import "dotenv/config";
import { prisma } from "../lib/prisma";
import { getActiveAtpTournaments } from "../lib/data/tournaments/atp-active-tournament-selector";
import { syncAtpTournamentDailyMatches } from "../lib/services/atp-tournament-daily-match-sync.service";
import { syncAtpTournamentDraw } from "../lib/services/atp-tournament-draw-sync.service";
import { extractAtpTournamentDailyMatches } from "./atp-tournament-daily-matches-extractor";
import { extractAtpTournamentDraw } from "./atp-tournament-matches-extractor";
import { extractEspnAtpDailyMatches, extractEspnAtpCompletedResults, isAtpAccessBlocked } from "./espn-atp-tournament-extractor";

function toDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

async function main() {
  const write = process.argv.includes("--write");
  const now = new Date();
  const date = now.toISOString().slice(0, 10);
  const selection = getActiveAtpTournaments(now);
  console.log(`AGE202 ATP daily/results — ${date} — ${write ? "WRITE" : "DRY RUN"}`);
  if (!selection.tournaments.length) {
    console.log("No supported ATP tournament is active.");
    return;
  }
  // ATP 250 remains excluded from daily and completed-results sync.
  if (String(selection.category) === "ATP_250") {
    console.log("ATP 250 daily/results sync excluded.");
    return;
  }
  let failed = 0;
  let dailyCreated = 0, dailyUpdated = 0, resultsCreated = 0, resultsUpdated = 0;
  for (const tournament of selection.tournaments) {
    console.log(`\nTournament: ${tournament.name}`);
    const year = Number.parseInt(tournament.startDate.slice(0, 4), 10);
    const params = {
      cmsTournamentSlug: tournament.cmsSlug,
      tournamentSlug: tournament.atpSlug,
      tournamentId: tournament.atpTournamentId,
      year, date,
    };
    const common = {
      cmsTournamentSlug: tournament.cmsSlug,
      atpTournamentId: tournament.atpTournamentId,
      year, startDate: toDate(tournament.startDate), endDate: toDate(tournament.endDate),
    };
    // Keep the two phases independent: a daily error must not prevent closing results.
    try {
      const extracted = await (async () => {
        try { return await extractAtpTournamentDailyMatches(params); }
        catch (error) {
          if (!isAtpAccessBlocked(error)) throw error;
          console.warn("ATP daily access blocked; using ESPN.");
          return await extractEspnAtpDailyMatches(params);
        }
      })();
      console.log(`Daily source: ${extracted.source}; matches: ${extracted.matches.length}`);
      for (const match of extracted.matches) {
        console.log(`${match.status} ${match.roundLabel}: ${match.playerOne.name} vs ${match.playerTwo.name}${match.score ? ` — ${match.score}` : ""}`);
      }
      if (write && extracted.matches.length) {
        const result = await syncAtpTournamentDailyMatches({
          ...common, extractedAt: extracted.extractedAt,
          matches: extracted.matches,
        });
        dailyCreated += result.matches.created;
        dailyUpdated += result.matches.updated;
        console.log(`DAILY COMPLETE: created ${result.matches.created}; updated ${result.matches.updated}; matched by players ${result.matches.matchedByPlayers}.`);
      } else {
        console.log(write ? "No dated matches to sync today." : "Daily dry run: database unchanged.");
      }
    } catch (error) {
      failed += 1;
      console.error("DAILY FAILED:", error);
    }
    try {
      const draw = await (async () => {
        try { return await extractAtpTournamentDraw({ ...params, sourceMode: "current" }); }
        catch (error) {
          if (!isAtpAccessBlocked(error)) throw error;
          console.warn("ATP results access blocked; using ESPN.");
          return await extractEspnAtpCompletedResults(params);
        }
      })();
      console.log(`Results source: ${draw.source}; completed matches: ${draw.matches.length}`);
      if (write && draw.matches.length) {
        const result = await syncAtpTournamentDraw({
          ...common, drawSize: draw.drawSize,
          extractedAt: draw.extractedAt, syncMode: "progressive",
          players: draw.players, matches: draw.matches,
        });
        resultsCreated += result.matches.created;
        resultsUpdated += result.matches.updated;
        console.log(`RESULTS COMPLETE: created ${result.matches.created}; updated ${result.matches.updated}; progression links ${result.matches.linkedToNextRound}.`);
      } else {
        console.log(write ? "No completed main-draw results yet." : "Results dry run: database unchanged.");
      }
    } catch (error) {
      failed += 1;
      console.error("RESULTS FAILED:", error);
    }
  }
  console.log(`\nDaily: ${dailyCreated} created, ${dailyUpdated} updated.`);
  console.log(`Results: ${resultsCreated} created, ${resultsUpdated} updated. Failures: ${failed}.`);
  if (failed) process.exitCode = 1;
}

main().catch(error => {
  console.error("AGE202 ATP daily/results sync crashed:", error);
  process.exitCode = 1;
}).finally(async () => {
  await prisma.$disconnect();
});
