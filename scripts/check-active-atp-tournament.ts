import {
  appendFileSync,
} from "node:fs";

import {
  getActiveAtpTournaments,
  hasActiveAtpTournament,
} from "../lib/data/tournaments/atp-active-tournament-selector";


function writeGithubOutput(
  key: string,
  value: string,
) {
  const outputFile =
    process.env.GITHUB_OUTPUT;

  if (!outputFile) {
    return;
  }

  appendFileSync(
    outputFile,
    `${key}=${value}\n`,
    "utf8",
  );
}


function main() {
  const now =
    new Date();

  const selection =
    getActiveAtpTournaments(
      now,
    );

  const hasActiveTournament =
    hasActiveAtpTournament(
      now,
    );

  console.log(
    [
      "",
      "AGE202 ATP LIVE SYNC GUARD",
      "--------------------------",
      `UTC time: ${now.toISOString()}`,
      `Active tournament: ${
        hasActiveTournament
          ? "YES"
          : "NO"
      }`,
      `Category: ${
        selection.category ??
        "NONE"
      }`,
      "",
    ].join("\n"),
  );


  if (
    selection.tournaments.length >
    0
  ) {
    for (
      const tournament
      of selection.tournaments
    ) {
      console.log(
        `• ${tournament.name}`,
      );
    }
  } else {
    console.log(
      "No supported ATP tournament is active.",
    );

    console.log(
      "Live sync can stop here.",
    );
  }


  writeGithubOutput(
    "active",
    hasActiveTournament
      ? "true"
      : "false",
  );
}


main();