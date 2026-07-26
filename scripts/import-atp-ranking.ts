import "dotenv/config";

import { importAtpRanking } from "@/lib/atp/importer";
import { prisma } from "@/lib/prisma";

async function main(): Promise<void> {
  console.log("🎾 Avvio importazione classifica ATP...");

  const result = await importAtpRanking();

  console.log(
    `✅ Importazione completata: ${result.importedPlayers} giocatori.`,
  );
  console.log(`📅 Data classifica: ${result.rankingDate}`);
  console.log(`🗂️ Fonte: ${result.source}`);
}

main()
  .catch((error: unknown) => {
    console.error("❌ Importazione ATP fallita.");

    if (error instanceof Error) {
      console.error(error.message);

      if (error.cause) {
        console.error(error.cause);
      }
    } else {
      console.error(error);
    }

    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });