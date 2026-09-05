import {
  getActiveAtpTournaments,
} from "../lib/data/tournaments/atp-active-tournament-selector";

import {
  extractAtpLiveScores,
} from "./atp-live-scores-extractor";


async function main() {
  console.log("");
  console.log(
    "🎾 AGE202 — GENERIC ATP LIVE SCORE TEST",
  );
  console.log(
    "────────────────────────────────────────",
  );


  const selection =
    getActiveAtpTournaments(
      new Date(),
    );


  if (
    selection.tournaments.length ===
    0
  ) {
    console.log(
      "ℹ️ Nessun torneo ATP supportato attivo.",
    );

    return;
  }


  console.log(
    `🏷️ Category: ${selection.category}`,
  );

  console.log(
    `🎯 Active tournaments: ${selection.tournaments.length}`,
  );


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


    const matches =
      await extractAtpLiveScores({
        tournamentSlug:
          tournament.atpSlug,

        tournamentId:
          tournament.atpTournamentId,
      });


    console.log(
      `🔴 Live matches: ${matches.length}`,
    );


    for (
      const match
      of matches
    ) {
      console.log("");

      console.log(
        `${match.roundLabel ?? "Unknown round"} · ${match.court ?? "Unknown court"}`,
      );

      console.log(
        `${match.playerOne.name}: ${match.playerOneSetScores.join(" ")}`,
      );

      console.log(
        `${match.playerTwo.name}: ${match.playerTwoSetScores.join(" ")}`,
      );

      console.log(
        `Current game: ${match.playerOneCurrentGame ?? "-"} / ${match.playerTwoCurrentGame ?? "-"}`,
      );
    }
  }


  console.log("");
  console.log(
    "✅ Generic extractor test completed.",
  );

  console.log(
    "ℹ️ Database untouched.",
  );
}


main()
  .catch(
    (error: unknown) => {
      console.error("");
      console.error(
        "❌ TEST FAILED",
      );

      console.error(
        error,
      );

      process.exitCode =
        1;
    },
  );