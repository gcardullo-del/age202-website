import "dotenv/config";

import { prisma } from "../lib/prisma";

async function main() {
  const totalEditions =
    await prisma.tournamentEdition.count({
      where: {
        cancelled: false,
      },
    });

  const linkedChampions =
    await prisma.tournamentEdition.count({
      where: {
        cancelled: false,

        championPlayerId: {
          not: null,
        },
      },
    });

  const unlinkedChampions =
    await prisma.tournamentEdition.count({
      where: {
        cancelled: false,

        championPlayerId: null,

        championName: {
          not: null,
        },
      },
    });

  console.log("");
  console.log(
    "AGE202 TROPHY AUDIT",
  );
  console.log(
    "────────────────────────────",
  );

  console.log(
    `Tournament editions: ${totalEditions}`,
  );

  console.log(
    `Linked champions: ${linkedChampions}`,
  );

  console.log(
    `Named but unlinked champions: ${unlinkedChampions}`,
  );

  console.log(
    "────────────────────────────",
  );
  console.log("");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });