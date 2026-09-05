import "dotenv/config";

import {
  getActiveAtpTournaments,
} from "../lib/data/tournaments/atp-active-tournament-selector";

import {
  extractAtpTournamentDailyMatches,
} from "./atp-tournament-daily-matches-extractor";


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


function validateDate(
  value: string,
): string {
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(
      value,
    )
  ) {
    throw new Error(
      `Invalid date: ${value}. Expected YYYY-MM-DD.`,
    );
  }

  const parsed =
    new Date(
      `${value}T12:00:00.000Z`,
    );

  if (
    Number.isNaN(
      parsed.getTime(),
    )
  ) {
    throw new Error(
      `Invalid date: ${value}.`,
    );
  }

  return value;
}


function getRequestedDate(): {
  date: string;
  selectorDate: Date;
} {
  const argument =
    readArgument(
      "date",
    );

  if (argument) {
    const date =
      validateDate(
        argument,
      );

    return {
      date,

      selectorDate:
        new Date(
          `${date}T12:00:00.000Z`,
        ),
    };
  }


  const now =
    new Date();

  return {
    date:
      now
        .toISOString()
        .slice(
          0,
          10,
        ),

    selectorDate:
      now,
  };
}


function formatTime(
  value: Date | null,
): string {
  if (!value) {
    return "—";
  }

  return value
    .toISOString()
    .replace(
      "T",
      " ",
    )
    .replace(
      ".000Z",
      " UTC",
    );
}


async function main() {
  const {
    date,
    selectorDate,
  } =
    getRequestedDate();


  console.log("");
  console.log(
    "════════════════════════════════════════════",
  );
  console.log(
    "🎾 AGE202 · ACTIVE ATP DAILY MATCHES",
  );
  console.log(
    "════════════════════════════════════════════",
  );
  console.log(
    `📅 Date: ${date}`,
  );
  console.log(
    "🛡️ DRY RUN · DATABASE UNCHANGED",
  );
  console.log("");


  const selection =
    getActiveAtpTournaments(
      selectorDate,
    );


  if (
    selection.tournaments.length ===
    0
  ) {
    console.log(
      "ℹ️ No AGE202 ATP tournament active.",
    );
    console.log("");

    return;
  }


  console.log(
    `🏷️ Selected category: ${selection.category}`,
  );

  console.log(
    `🎯 Active tournaments: ${selection.tournaments.length}`,
  );

  console.log("");


  let totalMatches =
    0;

  let totalScheduled =
    0;

  let totalCompleted =
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
      `   AGE202 slug: ${tournament.cmsSlug}`,
    );

    console.log(
      `   ATP source:  ${tournament.atpSlug}/${tournament.atpTournamentId}`,
    );

    console.log(
      `   Category:    ${tournament.category}`,
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


      const result =
        await extractAtpTournamentDailyMatches({
          tournamentSlug:
            tournament.atpSlug,

          tournamentId:
            tournament.atpTournamentId,

          year,

          date,
        });


      console.log(
        `🔗 Source: ${result.sourceUrl}`,
      );

      console.log(
        `⏱️ Extracted: ${result.extractedAt.toISOString()}`,
      );

      console.log(
        `🎾 Matches found: ${result.matches.length}`,
      );

      console.log("");


      if (
        result.matches.length ===
        0
      ) {
        console.log(
          "⚠️ No daily matches extracted.",
        );

        console.log(
          "   This means we need to inspect the ATP daily schedule DOM.",
        );

        console.log("");

        continue;
      }


      for (
        const match
        of result.matches
      ) {
        totalMatches +=
          1;

        if (
          match.status ===
          "COMPLETED"
        ) {
          totalCompleted +=
            1;
        } else {
          totalScheduled +=
            1;
        }


        console.log(
          `${
            match.status ===
            "COMPLETED"
              ? "✅"
              : "🕒"
          } ${match.playerOne.name} vs ${match.playerTwo.name}`,
        );

        console.log(
          `   Status: ${match.status}`,
        );

        console.log(
          `   Round:  ${match.roundLabel ?? "—"}`,
        );

        console.log(
          `   Court:  ${match.court ?? "—"}`,
        );

        console.log(
          `   Time:   ${formatTime(match.scheduledAt)}`,
        );

        console.log(
          `   ID:     ${match.externalId}`,
        );


        if (match.winner) {
          console.log(
            `   Winner: ${match.winner.name}`,
          );
        }


        if (match.score) {
          console.log(
            `   Score:  ${match.score}`,
          );
        }


        console.log("");
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : String(
              error,
            );


      console.log(
        "🔴 EXTRACTION FAILED",
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
    "📊 AGE202 DAILY MATCHES REPORT",
  );

  console.log(
    "════════════════════════════════════════════",
  );

  console.log(
    `🎾 Matches:   ${totalMatches}`,
  );

  console.log(
    `🕒 Scheduled: ${totalScheduled}`,
  );

  console.log(
    `✅ Completed: ${totalCompleted}`,
  );

  console.log("");

  console.log(
    "🛡️ Database writes: 0",
  );

  console.log("");
}


main()
  .catch(
    (error: unknown) => {
      console.error("");
      console.error(
        "❌ AGE202 daily matches diagnostic crashed.",
      );

      console.error(
        error,
      );

      process.exitCode =
        1;
    },
  );