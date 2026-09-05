import "dotenv/config";

import {
  prisma,
} from "../lib/prisma";

import {
  getActiveAtpTournaments,
} from "../lib/data/tournaments/atp-active-tournament-selector";

import {
  extractAtpLiveScores,
} from "./atp-live-scores-extractor";


type RoundValue =
  | "ROUND_OF_128"
  | "ROUND_OF_64"
  | "ROUND_OF_32"
  | "ROUND_OF_16"
  | "QUARTERFINAL"
  | "SEMIFINAL"
  | "FINAL";


function normalizeName(
  value: string,
): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      "",
    )
    .replace(
      /[^a-z0-9]+/g,
      " ",
    )
    .replace(
      /\s+/g,
      " ",
    )
    .trim();
}


function splitName(
  value: string,
): string[] {
  return normalizeName(
    value,
  )
    .split(" ")
    .filter(Boolean);
}


function namesEquivalent(
  liveName: string,
  dbName: string,
): boolean {
  const live =
    splitName(
      liveName,
    );

  const db =
    splitName(
      dbName,
    );


  if (
    live.join(" ") ===
    db.join(" ")
  ) {
    return true;
  }


  if (
    live.length <
      2 ||
    db.length <
      2
  ) {
    return false;
  }


  const liveFirst =
    live[0];

  const dbFirst =
    db[0];


  if (
    !liveFirst ||
    !dbFirst
  ) {
    return false;
  }


  /*
   * ATP Live può mostrare:
   *
   * A. Zverev
   *
   * mentre AGE202 conserva:
   *
   * Alexander Zverev
   *
   * Confrontiamo quindi:
   *
   * - iniziale del nome;
   * - tutta la parte restante del cognome.
   *
   * Funziona anche con cognomi composti,
   * ad esempio Auger-Aliassime.
   */
  const sameInitial =
    liveFirst[0] ===
    dbFirst[0];


  const liveSurname =
    live
      .slice(1)
      .join(" ");

  const dbSurname =
    db
      .slice(1)
      .join(" ");


  return (
    sameInitial &&
    liveSurname ===
      dbSurname
  );
}


function parseRound(
  value:
    | string
    | null,
): RoundValue | null {
  if (!value) {
    return null;
  }


  if (
    /Round of 128/i.test(
      value,
    )
  ) {
    return "ROUND_OF_128";
  }


  if (
    /Round of 64/i.test(
      value,
    )
  ) {
    return "ROUND_OF_64";
  }


  if (
    /Round of 32/i.test(
      value,
    )
  ) {
    return "ROUND_OF_32";
  }


  if (
    /Round of 16/i.test(
      value,
    )
  ) {
    return "ROUND_OF_16";
  }


  if (
    /Quarterfinal/i.test(
      value,
    )
  ) {
    return "QUARTERFINAL";
  }


  if (
    /Semifinal/i.test(
      value,
    )
  ) {
    return "SEMIFINAL";
  }


  if (
    /\bFinal\b/i.test(
      value,
    )
  ) {
    return "FINAL";
  }


  return null;
}


async function main() {
  console.log("");
  console.log(
    "🎾 AGE202 — ATP LIVE → DB DRY RUN",
  );
  console.log(
    "────────────────────────────────────────",
  );

  console.log(
    "🛡️ READ ONLY — database non modificato",
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
      "ℹ️ Nessun torneo ATP supportato attivo.",
    );

    return;
  }


  console.log("");
  console.log(
    `🏷️ Category: ${selection.category}`,
  );


  for (
    const tournament
    of selection.tournaments
  ) {
    const year =
      Number.parseInt(
        tournament.startDate.slice(
          0,
          4,
        ),
        10,
      );


    console.log("");
    console.log(
      "════════════════════════════════════════",
    );

    console.log(
      `🏆 ${tournament.name}`,
    );

    console.log(
      `ATP: ${tournament.atpSlug}/${tournament.atpTournamentId}`,
    );


    const liveMatches =
      await extractAtpLiveScores({
        tournamentSlug:
          tournament.atpSlug,

        tournamentId:
          tournament.atpTournamentId,
      });


    console.log(
      `🔴 Live ATP matches: ${liveMatches.length}`,
    );


    if (
      liveMatches.length ===
      0
    ) {
      console.log(
        "ℹ️ Nessun match live in questo momento.",
      );

      continue;
    }


    const tournamentRecord =
      await prisma.tournament.findUnique({
        where: {
          slug:
            tournament.cmsSlug,
        },

        select: {
          id:
            true,

          name:
            true,
        },
      });


    if (!tournamentRecord) {
      console.log(
        "❌ Torneo AGE202 non trovato.",
      );

      continue;
    }


    const edition =
      await prisma.tournamentEdition.findUnique({
        where: {
          tournamentId_year_editionKey_circuit: {
            tournamentId:
              tournamentRecord.id,

            year,

            editionKey:
              "main",

            circuit:
              "ATP",
          },
        },

        select: {
          id:
            true,
        },
      });


    if (!edition) {
      console.log(
        "❌ Edizione AGE202 non trovata.",
      );

      continue;
    }


    const dbMatches =
      await prisma.tournamentMatch.findMany({
        where: {
          editionId:
            edition.id,
        },

        select: {
          id:
            true,

          externalId:
            true,

          round:
            true,

          status:
            true,

          scoreSummary:
            true,

          court:
            true,

          scheduledAt:
            true,

          playerOne: {
            select: {
              name:
                true,
            },
          },

          playerTwo: {
            select: {
              name:
                true,
            },
          },
        },
      });


    console.log(
      `🗄️ AGE202 matches in edition: ${dbMatches.length}`,
    );


    for (
      const liveMatch
      of liveMatches
    ) {
      console.log("");
      console.log(
        "────────────────────────────────────────",
      );

      console.log(
        `🔴 ${liveMatch.playerOne.name} vs ${liveMatch.playerTwo.name}`,
      );

      console.log(
        `${liveMatch.roundLabel ?? "Unknown round"} · ${liveMatch.court ?? "Unknown court"}`,
      );

      console.log(
        `${liveMatch.playerOne.name}: ${liveMatch.playerOneSetScores.join(" ")}`,
      );

      console.log(
        `${liveMatch.playerTwo.name}: ${liveMatch.playerTwoSetScores.join(" ")}`,
      );


      const liveRound =
        parseRound(
          liveMatch.roundLabel,
        );


      const possibleMatches =
        dbMatches.filter(
          (dbMatch) => {
            if (
              !dbMatch.playerOne ||
              !dbMatch.playerTwo
            ) {
              return false;
            }


            if (
              liveRound &&
              dbMatch.round !==
                liveRound
            ) {
              return false;
            }


            const sameOrder =
              namesEquivalent(
                liveMatch.playerOne.name,
                dbMatch.playerOne.name,
              ) &&
              namesEquivalent(
                liveMatch.playerTwo.name,
                dbMatch.playerTwo.name,
              );


            const reversedOrder =
              namesEquivalent(
                liveMatch.playerOne.name,
                dbMatch.playerTwo.name,
              ) &&
              namesEquivalent(
                liveMatch.playerTwo.name,
                dbMatch.playerOne.name,
              );


            return (
              sameOrder ||
              reversedOrder
            );
          },
        );


      if (
        possibleMatches.length ===
        0
      ) {
        console.log("");
        console.log(
          "❌ Nessun match AGE202 trovato.",
        );

        continue;
      }


      if (
        possibleMatches.length >
        1
      ) {
        console.log("");
        console.log(
          `⚠️ Trovati ${possibleMatches.length} possibili match AGE202.`,
        );


        for (
          const match
          of possibleMatches
        ) {
          console.log(
            [
              `   ${match.id}`,
              match.round,
              match.status,
              match.externalId ??
                "no-external-id",
            ].join(
              " · ",
            ),
          );
        }


        continue;
      }


      const match =
        possibleMatches[0];


      if (!match) {
        continue;
      }


      console.log("");
      console.log(
        "✅ MATCH AGE202 TROVATO",
      );

      console.log(
        `ID: ${match.id}`,
      );

      console.log(
        `External ID: ${match.externalId ?? "null"}`,
      );

      console.log(
        `Round DB: ${match.round}`,
      );

      console.log(
        `Status DB: ${match.status}`,
      );

      console.log(
        `Score DB: ${match.scoreSummary ?? "null"}`,
      );

      console.log(
        `Court DB: ${match.court ?? "null"}`,
      );

      console.log(
        `Scheduled DB: ${match.scheduledAt?.toISOString() ?? "null"}`,
      );

      console.log("");
      console.log(
        "🎯 Questo è il record che AGE202 aggiornerebbe a LIVE.",
      );

      console.log(
        "🛡️ Nessuna scrittura eseguita.",
      );
    }
  }


  console.log("");
  console.log(
    "════════════════════════════════════════",
  );

  console.log(
    "✅ Dry-run completato.",
  );

  console.log(
    "🛡️ Database invariato.",
  );
}


main()
  .catch(
    (error: unknown) => {
      console.error("");
      console.error(
        "❌ DRY RUN FAILED",
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