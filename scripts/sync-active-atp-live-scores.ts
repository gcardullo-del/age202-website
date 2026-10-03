import "dotenv/config";
import { appendFile } from "node:fs/promises";
import { prisma } from "../lib/prisma";
import { getActiveAtpTournaments } from "../lib/data/tournaments/atp-active-tournament-selector";
import { syncAtpTournamentLiveScores } from "../lib/services/atp-tournament-live-score-sync.service";
import { extractAtpLiveScores } from "./atp-live-scores-extractor";

async function main() {
  const write = process.argv.includes("--write");
  const selection = getActiveAtpTournaments(new Date());

  console.log("\n🎾 AGE202 — ATP LIVE SCORE SYNC");
  console.log(write ? "✍️ WRITE MODE" : "🛡️ DRY RUN — database unchanged");

  if (selection.tournaments.length === 0) {
    console.log("ℹ️ No supported ATP tournament is active.");
    return;
  }

  console.log(`🏷️ Category: ${selection.category}`);
  console.log(`🎯 Active tournaments: ${selection.tournaments.length}`);

  let totalLive = 0;
  let totalMatched = 0;
  let totalUpdated = 0;
  let totalUnmatched = 0;
  let totalAmbiguous = 0;
  let failedTournaments = 0;
  const reportLines: string[] = [];

  for (const tournament of selection.tournaments) {
    console.log("\n────────────────────────────────────────");
    console.log(`🏆 ${tournament.name}`);
    console.log(`ATP: ${tournament.atpSlug}/${tournament.atpTournamentId}`);

    try {
      const year = Number.parseInt(tournament.startDate.slice(0, 4), 10);
      const extractedAt = new Date();

      const liveMatches = await extractAtpLiveScores({
        tournamentSlug: tournament.atpSlug,
        tournamentId: tournament.atpTournamentId,
      });

      totalLive += liveMatches.length;
      console.log(`🔴 Live matches extracted: ${liveMatches.length}`);

      if (liveMatches.length === 0) {
        reportLines.push(`- ${tournament.name}: no live matches extracted.`);
        continue;
      }

      const result = await syncAtpTournamentLiveScores({
        cmsTournamentSlug: tournament.cmsSlug,
        year,
        extractedAt,
        write,
        matches: liveMatches.map((match) => ({
          roundLabel: match.roundLabel,
          court: match.court,
          playerOne: { name: match.playerOne.name },
          playerTwo: { name: match.playerTwo.name },
          playerOneSetScores: match.playerOneSetScores,
          playerTwoSetScores: match.playerTwoSetScores,
        })),
      });

      totalMatched += result.matched;
      totalUpdated += result.updated;
      totalUnmatched += result.unmatched;
      totalAmbiguous += result.ambiguous;

      reportLines.push(
        `- ${tournament.name}: extracted ${liveMatches.length}, matched ${result.matched}, updated ${result.updated}.`,
      );

      for (const match of result.results) {
        console.log(`\n${match.livePlayerOne} vs ${match.livePlayerTwo}`);
        console.log(`   Match ID: ${match.matchId ?? "not found"}`);
        console.log(`   Score: ${match.scoreSummary ?? "unavailable"}`);
        console.log(`   ${match.message}`);
      }
    } catch (error: unknown) {
      failedTournaments += 1;
      const message = error instanceof Error ? error.message : String(error);

      console.error(`❌ ${tournament.name}: ${message}`);
      console.error(error);
      console.log("Continuing with the remaining tournaments.");

      reportLines.push(
        `- ${tournament.name}: FAILED — ${message.replace(/[\r\n]+/g, " ")}`,
      );
    }
  }

  console.log("\n════════════════════════════════════════");
  console.log("📊 AGE202 ATP LIVE REPORT");
  console.log(`🔴 Live extracted:     ${totalLive}`);
  console.log(`✅ Matched:            ${totalMatched}`);
  console.log(`💾 Updated:            ${totalUpdated}`);
  console.log(`❌ Unmatched:          ${totalUnmatched}`);
  console.log(`⚠️ Ambiguous:          ${totalAmbiguous}`);
  console.log(`❌ Failed tournaments: ${failedTournaments}`);
  console.log(`🗄️ DB writes:          ${write ? "ENABLED" : "0"}`);

  if (failedTournaments > 0) {
    process.exitCode = 1;
  }

  const summaryPath = process.env.GITHUB_STEP_SUMMARY;

  if (summaryPath) {
    await appendFile(
      summaryPath,
      [
        "## AGE202 ATP Live Sync",
        "",
        `Mode: ${write ? "WRITE" : "DRY RUN"}`,
        `Failed tournaments: ${failedTournaments}`,
        "",
        ...reportLines,
        "",
      ].join("\n"),
    );
  }
}

main()
  .catch((error: unknown) => {
    console.error("\n❌ AGE202 ATP live score sync failed.");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });