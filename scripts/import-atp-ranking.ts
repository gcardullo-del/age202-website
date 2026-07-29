import "dotenv/config";

import { MAX_ATP_PLAYERS } from "@/lib/atp/constants";
import { importAtpRanking } from "@/lib/atp/importer";
import { prisma } from "@/lib/prisma";

async function main(): Promise<void> {
  console.log("");
  console.log(
    "🎾 AGE202 — Aggiornamento ATP Rankings",
  );
  console.log(
    "────────────────────────────────────",
  );
  console.log(
    "📄 Lettura di data/atp-ranking.json...",
  );
  console.log(
    `🔍 Verifica della Top ${MAX_ATP_PLAYERS}...`,
  );

  const result = await importAtpRanking();

  console.log("");
  console.log("✅ Importazione completata.");
  console.log(
    `👤 Giocatori importati: ${result.importedPlayers}/${MAX_ATP_PLAYERS}`,
  );
  console.log(
    `📅 Data classifica: ${result.rankingDate}`,
  );
  console.log(
    `🗂️ Fonte dichiarata: ${result.source}`,
  );
  console.log(
    "🔌 Modalità: aggiornamento manuale locale",
  );
  console.log(
    `🏆 ATP Rankings Top ${MAX_ATP_PLAYERS} aggiornata correttamente.`,
  );
  console.log("");
}

main()
  .catch((error: unknown) => {
    console.error("");
    console.error(
      "❌ Aggiornamento ATP Rankings fallito.",
    );
    console.error(
      "La classifica già presente nel database non è stata sostituita.",
    );

    if (error instanceof Error) {
      console.error("");
      console.error(
        `Dettaglio: ${error.message}`,
      );

      if (error.cause) {
        console.error(
          "Causa originale:",
          error.cause,
        );
      }
    } else {
      console.error(error);
    }

    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
