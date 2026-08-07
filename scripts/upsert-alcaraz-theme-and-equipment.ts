import "dotenv/config";

import { prisma } from "../lib/prisma";

import {
  PlayerEquipmentCategory,
} from "../generated/prisma/enums";

const ALCARAZ_SLUG =
  "carlos-alcaraz";

const ALCARAZ_ACCENT =
  "#D4AF37";

async function upsertAlcarazThemeAndEquipment() {
  console.log(
    "🎾 Ricerca del player Carlos Alcaraz...",
  );

  const player =
    await prisma.player.findUnique({
      where: {
        slug: ALCARAZ_SLUG,
      },

      select: {
        id: true,
        name: true,
        slug: true,
      },
    });

  if (!player) {
    throw new Error(
      `Player con slug "${ALCARAZ_SLUG}" non trovato.`,
    );
  }

  const equipment = [
    {
      playerId: player.id,
      category:
        PlayerEquipmentCategory.RACQUET,
      name:
        "Babolat Pure Aero 98",
      brand:
        "Babolat",
      period:
        "Professional career",
      description:
        "A spin-oriented performance racquet associated with Alcaraz's explosive forehand, fast acceleration and ability to create attacking angles from every area of the court.",
      curiosity:
        "Alcaraz's professional match frames are customised, while the Pure Aero 98 represents his public racquet identity.",
      imageUrl: null,
      featured: true,
      sortOrder: 10,
    },

    {
      playerId: player.id,
      category:
        PlayerEquipmentCategory.STRINGS,
      name:
        "Babolat RPM Blast",
      brand:
        "Babolat",
      period:
        "Professional career",
      description:
        "A spin-focused polyester string chosen to support aggressive acceleration, heavy rotation and confident directional changes.",
      curiosity:
        "The setup complements Alcaraz's ability to combine high racquet-head speed with control during explosive baseline exchanges.",
      imageUrl: null,
      featured: false,
      sortOrder: 20,
    },

    {
      playerId: player.id,
      category:
        PlayerEquipmentCategory.SHOES,
      name:
        "NikeCourt Air Zoom Vapor Pro",
      brand:
        "Nike",
      period:
        "Nike signature era",
      description:
        "Lightweight performance footwear selected for rapid first steps, sharp direction changes and aggressive movement toward the net.",
      curiosity:
        "Seasonal colourways are coordinated with Alcaraz's match apparel and energetic visual identity.",
      imageUrl: null,
      featured: false,
      sortOrder: 30,
    },

    {
      playerId: player.id,
      category:
        PlayerEquipmentCategory.APPAREL,
      name:
        "NikeCourt Carlos Alcaraz Match Collection",
      brand:
        "Nike",
      period:
        "Professional career",
      description:
        "Modern technical matchwear combining lightweight construction, athletic silhouettes and vivid seasonal colour combinations.",
      curiosity:
        "Alcaraz's Nike collections reinforce the sense of speed, freedom and youthful energy that defines his on-court presence.",
      imageUrl: null,
      featured: false,
      sortOrder: 40,
    },

    {
      playerId: player.id,
      category:
        PlayerEquipmentCategory.BAG,
      name:
        "Babolat Pure Aero Racquet Bag",
      brand:
        "Babolat",
      period:
        "Professional career",
      description:
        "A tournament bag designed to carry customised racquets, footwear, apparel and match-day accessories throughout the professional season.",
      curiosity:
        "Its design language is coordinated with the Pure Aero family associated with Alcaraz.",
      imageUrl: null,
      featured: false,
      sortOrder: 50,
    },

    {
      playerId: player.id,
      category:
        PlayerEquipmentCategory.ACCESSORY,
      name:
        "Nike Carlos Alcaraz Wristbands",
      brand:
        "Nike",
      period:
        "Professional career",
      description:
        "Performance wristbands that form part of Alcaraz's energetic match-day silhouette and support comfort during long rallies.",
      curiosity:
        "Their seasonal colours frequently complete the visual identity of his tournament outfits.",
      imageUrl: null,
      featured: false,
      sortOrder: 60,
    },

    {
      playerId: player.id,
      category:
        PlayerEquipmentCategory.ACCESSORY,
      name:
        "Carlos Alcaraz Personal Monogram",
      brand:
        "Carlos Alcaraz",
      period:
        "Signature identity",
      description:
        "A personal monogram used across selected apparel, accessories and communication materials as part of Alcaraz's growing visual identity.",
      curiosity:
        "The mark translates his initials into a compact symbol associated with movement, ambition and a new generation of champions.",
      imageUrl: null,
      featured: false,
      sortOrder: 70,
    },
  ];

  await prisma.$transaction(async (transaction) => {
    await transaction.player.update({
      where: {
        id: player.id,
      },

      data: {
        accent:
          ALCARAZ_ACCENT,
      },
    });

    await transaction.playerEquipment.deleteMany({
      where: {
        playerId: player.id,
      },
    });

    await transaction.playerEquipment.createMany({
      data: equipment,
    });
  });

  console.log(
    `🎨 Tema aggiornato: ${ALCARAZ_ACCENT}`,
  );

  console.log(
    `✅ ${equipment.length} record Equipment creati.`,
  );

  console.log(
    "🏛️ Tema ed Equipment museale di Alcaraz pronti.",
  );
}

async function main() {
  try {
    await upsertAlcarazThemeAndEquipment();
  } catch (error) {
    console.error(
      "❌ Impossibile aggiornare tema ed Equipment di Alcaraz:",
      error,
    );

    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

void main();
