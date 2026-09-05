import "dotenv/config";

import {
  extractAtpTournamentDraw,
} from "./atp-tournament-matches-extractor";


const TOURNAMENT_SLUG =
  "us-open";

const TOURNAMENT_ID =
  "560";

const YEAR =
  2026;


async function main() {
  console.log("");
  console.log(
    "🎾 AGE202 · US OPEN PROGRESSIVE DRAW DIAGNOSTIC",
  );
  console.log(
    "═══════════════════════════════════════════════",
  );

  const draw =
    await extractAtpTournamentDraw({
      tournamentSlug:
        TOURNAMENT_SLUG,
      tournamentId:
        TOURNAMENT_ID,
      year:
        YEAR,
      sourceMode:
        "current",
    });

  const roundOf128 =
    draw.matches.filter(
      (match) =>
        match.round ===
        "ROUND_OF_128",
    );

  const roundOf64 =
    draw.matches.filter(
      (match) =>
        match.round ===
        "ROUND_OF_64",
    );

  console.log(
    `🌐 Source: ${draw.sourceUrl}`,
  );
  console.log(
    `👥 Players: ${draw.players.length}`,
  );
  console.log(
    `🎾 Completed matches: ${draw.matches.length}`,
  );
  console.log(
    `🎾 Round of 128: ${roundOf128.length}`,
  );
  console.log(
    `🎾 Round of 64: ${roundOf64.length}`,
  );

  console.log("");
  console.log(
    "ROUND OF 128",
  );
  console.log(
    "════════════",
  );

  roundOf128.forEach(
    (
      match,
      index,
    ) => {
      console.log(
        `${String(index + 1).padStart(2, "0")}. ${match.playerOne.name} vs ${match.playerTwo.name}`,
      );
      console.log(
        `    Winner: ${match.winner.name}`,
      );
      console.log(
        `    Score: ${match.score ?? "—"}`,
      );
      console.log(
        `    Court: ${match.court ?? "—"}`,
      );
      console.log(
        `    ATP IDs: ${match.playerOne.externalId ?? "—"} / ${match.playerTwo.externalId ?? "—"}`,
      );
      console.log(
        `    External ID: ${match.externalId}`,
      );
    },
  );

  console.log("");
  console.log(
    "ROUND OF 64",
  );
  console.log(
    "═══════════",
  );

  roundOf64.forEach(
    (
      match,
      index,
    ) => {
      console.log(
        `${String(index + 1).padStart(2, "0")}. ${match.playerOne.name} vs ${match.playerTwo.name}`,
      );
      console.log(
        `    Winner: ${match.winner.name}`,
      );
      console.log(
        `    Score: ${match.score ?? "—"}`,
      );
      console.log(
        `    Court: ${match.court ?? "—"}`,
      );
      console.log(
        `    ATP IDs: ${match.playerOne.externalId ?? "—"} / ${match.playerTwo.externalId ?? "—"}`,
      );
      console.log(
        `    External ID: ${match.externalId}`,
      );
    },
  );

  console.log("");
  console.log(
    "✅ Diagnostic complete · database unchanged.",
  );
  console.log("");
}


main()
  .catch(
    (
      error: unknown,
    ) => {
      console.error("");
      console.error(
        "❌ US Open draw diagnostic crashed.",
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
  );
