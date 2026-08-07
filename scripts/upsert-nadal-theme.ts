import "dotenv/config";

import { prisma } from "../lib/prisma";

const NADAL_SLUG =
  "rafael-nadal";

const NADAL_ACCENT =
  "#C65A1E";

async function updateNadalTheme() {
  console.log(
    "🎨 Aggiornamento tema di Rafael Nadal...",
  );

  const player =
    await prisma.player.update({
      where: {
        slug: NADAL_SLUG,
      },

      data: {
        accent:
          NADAL_ACCENT,
      },

      select: {
        id: true,
        name: true,
        slug: true,
        accent: true,
      },
    });

  console.log(
    `✅ Tema aggiornato: ${player.name} → ${player.accent}`,
  );
}

async function main() {
  try {
    await updateNadalTheme();

    console.log(
      "🏛️ Tema museale di Nadal pronto.",
    );
  } catch (error) {
    console.error(
      "❌ Impossibile aggiornare il tema di Nadal:",
      error,
    );

    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

void main();
