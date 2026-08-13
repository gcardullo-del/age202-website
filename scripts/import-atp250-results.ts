import "dotenv/config";

import {
  atp250Tournaments,
} from "../lib/data/atp-250";

import {
  prisma,
} from "../lib/prisma";

async function main() {
  console.log(
    "🎾 AGE202 · ATP 250 Latest Winner + Leader importer",
  );

  console.log(
    `📚 Dataset: ${atp250Tournaments.length} tornei`,
  );

  let processed = 0;
  let editionsCreated = 0;
  let editionsUpdated = 0;
  let leadersCreated = 0;

  for (const tournamentData of atp250Tournaments) {
    const tournament =
      await prisma.tournament.findUnique({
        where: {
          slug: tournamentData.slug,
        },
        select: {
          id: true,
          name: true,
          category: true,
        },
      });

    if (!tournament) {
      throw new Error(
        `Tournament non trovato nel CMS: ${tournamentData.slug}`,
      );
    }

    if (tournament.category !== "ATP_250") {
      throw new Error(
        `${tournament.name} (${tournamentData.slug}) non è classificato ATP_250.`,
      );
    }

    const existingEdition =
      await prisma.tournamentEdition.findUnique({
      where: {
  tournamentId_year_editionKey: {
    tournamentId: tournament.id,
    year: tournamentData.latestFinal.year,
    editionKey: "main",
  },
},
        select: {
          id: true,
        },
      });

    await prisma.$transaction(async (tx) => {
      if (existingEdition) {
        await tx.tournamentEdition.update({
          where: {
            id: existingEdition.id,
          },
          data: {
            championName:
              tournamentData.latestFinal.champion,
            runnerUpName:
              tournamentData.latestFinal.runnerUp,
            score:
              tournamentData.latestFinal.score,
            cancelled:
              false,
          },
        });

        editionsUpdated += 1;
      } else {
        await tx.tournamentEdition.create({
          data: {
            tournamentId:
              tournament.id,
            year:
              tournamentData.latestFinal.year,
            championName:
              tournamentData.latestFinal.champion,
            runnerUpName:
              tournamentData.latestFinal.runnerUp,
            score:
              tournamentData.latestFinal.score,
            cancelled:
              false,
          },
        });

        editionsCreated += 1;
      }

      const leaderName =
        tournamentData.leader.names.join(
          " / ",
        );

      await tx.tournamentChampion.deleteMany({
        where: {
          tournamentId:
            tournament.id,
        },
      });

      await tx.tournamentChampion.create({
        data: {
          tournamentId:
            tournament.id,
          playerId:
            null,
          name:
            leaderName,
          titles:
            tournamentData.leader.titles,
          sortOrder:
            0,
        },
      });

      leadersCreated += 1;
    });

    processed += 1;

    console.log(
      `🟢 ${String(processed).padStart(2, "0")}/${atp250Tournaments.length} · ${tournamentData.name}`,
    );

    console.log(
      `   Latest: ${tournamentData.latestFinal.year} · ${tournamentData.latestFinal.champion} d. ${tournamentData.latestFinal.runnerUp} · ${tournamentData.latestFinal.score}`,
    );

    console.log(
      `   Leader: ${tournamentData.leader.names.join(" / ")} · ${tournamentData.leader.titles} 🏆`,
    );
  }

  console.log("");
  console.log(
    "✅ ATP 250 Latest Winner + Leader import completato.",
  );
  console.log(
    `   Tornei processati: ${processed}`,
  );
  console.log(
    `   Latest Winner creati: ${editionsCreated}`,
  );
  console.log(
    `   Latest Winner aggiornati: ${editionsUpdated}`,
  );
  console.log(
    `   Leader sincronizzati: ${leadersCreated}`,
  );
  console.log("");
  console.log(
    "🏆 Ora apri Brisbane nel Tournament Studio Lite e verifica che entrambi i pannelli siano popolati.",
  );
}

main()
  .catch((error) => {
    console.error("");
    console.error(
      "❌ Import ATP 250 Latest Winner + Leader fallito.",
    );
    console.error(error);

    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });