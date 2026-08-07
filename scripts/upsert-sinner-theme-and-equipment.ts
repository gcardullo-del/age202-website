import "dotenv/config";

import { prisma } from "../lib/prisma";

import {
  PlayerEquipmentCategory,
} from "../generated/prisma/enums";

const SINNER_SLUG =
  "jannik-sinner";

const SINNER_ACCENT =
  "#FF7A00";

async function upsertSinnerThemeAndEquipment() {
  console.log(
    "🎾 Ricerca del player Jannik Sinner...",
  );

  const player =
    await prisma.player.findUnique({
      where: {
        slug: SINNER_SLUG,
      },

      select: {
        id: true,
        name: true,
        slug: true,
      },
    });

  if (!player) {
    throw new Error(
      `Player con slug "${SINNER_SLUG}" non trovato.`,
    );
  }

  const equipment = [
    {
      playerId: player.id,
      category:
        PlayerEquipmentCategory.RACQUET,
      name:
        "Head Speed MP",
      brand:
        "Head",
      period:
        "Professional career",
      description:
        "A fast, control-oriented racquet identity associated with Sinner's compact preparation, early timing and exceptional acceleration through the ball.",
      curiosity:
        "Sinner's professional match frames are customised, while the Speed family represents his public racquet identity.",
      imageUrl: null,
      featured: true,
      sortOrder: 10,
    },

    {
      playerId: player.id,
      category:
        PlayerEquipmentCategory.STRINGS,
      name:
        "Head Hybrid String Setup",
      brand:
        "Head",
      period:
        "Professional career",
      description:
        "A performance string configuration developed to balance control, feel and stability during high-speed baseline exchanges.",
      curiosity:
        "The setup supports Sinner's ability to strike early while preserving directional accuracy from both wings.",
      imageUrl: null,
      featured: false,
      sortOrder: 20,
    },

    {
      playerId: player.id,
      category:
        PlayerEquipmentCategory.SHOES,
      name:
        "NikeCourt GP Challenge",
      brand:
        "Nike",
      period:
        "Nike signature era",
      description:
        "Performance footwear selected for explosive first steps, lateral stability and controlled recovery across changing court surfaces.",
      curiosity:
        "Seasonal colourways are coordinated with Sinner's match apparel and his orange visual identity.",
      imageUrl: null,
      featured: false,
      sortOrder: 30,
    },

    {
      playerId: player.id,
      category:
        PlayerEquipmentCategory.APPAREL,
      name:
        "NikeCourt Jannik Sinner Match Collection",
      brand:
        "Nike",
      period:
        "Professional career",
      description:
        "Modern technical apparel characterised by clean silhouettes, lightweight construction and a restrained contemporary visual language.",
      curiosity:
        "Sinner's Nike collections often combine minimal design with bright accents linked to his personal identity.",
      imageUrl: null,
      featured: false,
      sortOrder: 40,
    },

    {
      playerId: player.id,
      category:
        PlayerEquipmentCategory.BAG,
      name:
        "Head Tour Racquet Bag",
      brand:
        "Head",
      period:
        "Professional career",
      description:
        "A tournament bag used to carry customised racquets, footwear, apparel and match-day equipment throughout the professional season.",
      curiosity:
        "Its design language is coordinated with the Head Speed family associated with Sinner.",
      imageUrl: null,
      featured: false,
      sortOrder: 50,
    },

    {
      playerId: player.id,
      category:
        PlayerEquipmentCategory.ACCESSORY,
      name:
        "Nike Jannik Sinner Cap",
      brand:
        "Nike",
      period:
        "Training and competition",
      description:
        "A lightweight performance cap used during training sessions and selected competitive appearances.",
      curiosity:
        "The cap has become part of Sinner's clean and understated off-court visual identity.",
      imageUrl: null,
      featured: false,
      sortOrder: 60,
    },

    {
      playerId: player.id,
      category:
        PlayerEquipmentCategory.ACCESSORY,
      name:
        "Jannik Sinner Fox Logo",
      brand:
        "Jannik Sinner",
      period:
        "Signature identity",
      description:
        "A personal emblem used across selected apparel, accessories and communication materials as part of Sinner's developing visual identity.",
      curiosity:
        "The fox motif reflects intelligence, agility and the athlete's connection to the mountains of South Tyrol.",
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
          SINNER_ACCENT,
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
    `🎨 Tema aggiornato: ${SINNER_ACCENT}`,
  );

  console.log(
    `✅ ${equipment.length} record Equipment creati.`,
  );

  console.log(
    "🏛️ Tema ed Equipment museale di Sinner pronti.",
  );
}

async function main() {
  try {
    await upsertSinnerThemeAndEquipment();
  } catch (error) {
    console.error(
      "❌ Impossibile aggiornare tema ed Equipment di Sinner:",
      error,
    );

    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

void main();
