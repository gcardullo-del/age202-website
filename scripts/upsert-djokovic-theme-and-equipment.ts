import "dotenv/config";

import { prisma } from "../lib/prisma";

import {
  PlayerEquipmentCategory,
} from "../generated/prisma/enums";

const DJOKOVIC_SLUG =
  "novak-djokovic";

const DJOKOVIC_ACCENT =
  "#2C5CC5";

async function upsertDjokovicThemeAndEquipment() {
  console.log(
    "🎾 Ricerca del player Novak Djokovic...",
  );

  const player =
    await prisma.player.findUnique({
      where: {
        slug: DJOKOVIC_SLUG,
      },

      select: {
        id: true,
        name: true,
        slug: true,
      },
    });

  if (!player) {
    throw new Error(
      `Player con slug "${DJOKOVIC_SLUG}" non trovato.`,
    );
  }

  console.log(
    `✅ Player trovato: ${player.name} (${player.id})`,
  );

  const equipment = [
    {
      playerId: player.id,
      category:
        PlayerEquipmentCategory.RACQUET,
      name:
        "Head Speed Pro",
      brand:
        "Head",
      period:
        "Signature era",
      description:
        "A control-oriented racquet identity associated with Djokovic's exceptional timing, directional accuracy and ability to redirect pace from every area of the court.",
      curiosity:
        "Djokovic's personal match racquets are professionally customised, while the Speed line represents his public equipment identity.",
      imageUrl: null,
      featured: true,
      sortOrder: 10,
    },

    {
      playerId: player.id,
      category:
        PlayerEquipmentCategory.STRINGS,
      name:
        "Hybrid String Setup",
      brand:
        "Head / Luxilon",
      period:
        "Professional career",
      description:
        "A hybrid string configuration designed to balance control, feel, durability and precise response during aggressive baseline exchanges.",
      curiosity:
        "The combination supports Djokovic's ability to absorb pace and immediately transform defence into controlled attack.",
      imageUrl: null,
      featured: false,
      sortOrder: 20,
    },

    {
      playerId: player.id,
      category:
        PlayerEquipmentCategory.SHOES,
      name:
        "ASICS Court FF Novak",
      brand:
        "ASICS",
      period:
        "Signature footwear era",
      description:
        "Performance footwear developed around stability, rapid direction changes and controlled sliding across different court surfaces.",
      curiosity:
        "The shoe line reflects the movement patterns that define Djokovic's defence, balance and recovery speed.",
      imageUrl: null,
      featured: false,
      sortOrder: 30,
    },

    {
      playerId: player.id,
      category:
        PlayerEquipmentCategory.APPAREL,
      name:
        "Lacoste Novak Djokovic Collection",
      brand:
        "Lacoste",
      period:
        "2017–present",
      description:
        "Technical match apparel combining lightweight construction, clean tailoring and visual references to Djokovic's Serbian identity.",
      curiosity:
        "The crocodile logo and Djokovic's personal emblem form one of the most recognisable visual partnerships in modern tennis.",
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
        "A tournament bag designed to carry customised racquets, footwear, apparel and match-day accessories throughout the professional season.",
      curiosity:
        "Its graphic identity is coordinated with the Head Speed family used throughout Djokovic's signature equipment era.",
      imageUrl: null,
      featured: false,
      sortOrder: 50,
    },

    {
      playerId: player.id,
      category:
        PlayerEquipmentCategory.ACCESSORY,
      name:
        "Lacoste Novak Cap",
      brand:
        "Lacoste",
      period:
        "Professional career",
      description:
        "A lightweight performance cap used as part of Djokovic's training and competition identity.",
      curiosity:
        "The cap frequently combines Lacoste branding with Djokovic's personal logo and seasonal colour palette.",
      imageUrl: null,
      featured: false,
      sortOrder: 60,
    },

    {
      playerId: player.id,
      category:
        PlayerEquipmentCategory.ACCESSORY,
      name:
        "Novak Djokovic Personal Logo",
      brand:
        "Novak Djokovic",
      period:
        "Signature identity",
      description:
        "A geometric personal mark used across apparel, accessories and selected equipment as the visual signature of Djokovic's global brand.",
      curiosity:
        "The emblem translates the athlete's initials into a compact symbol associated with precision, balance and movement.",
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
          DJOKOVIC_ACCENT,
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
    `🎨 Tema aggiornato: ${DJOKOVIC_ACCENT}`,
  );

  console.log(
    `✅ ${equipment.length} record Equipment creati.`,
  );

  console.log(
    "🏛️ Tema ed Equipment museale di Djokovic pronti.",
  );
}

async function main() {
  try {
    await upsertDjokovicThemeAndEquipment();
  } catch (error) {
    console.error(
      "❌ Impossibile aggiornare tema ed Equipment di Djokovic:",
      error,
    );

    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

void main();