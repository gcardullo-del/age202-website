import "dotenv/config";

import { prisma } from "../lib/prisma";

import {
  PlayerEquipmentCategory,
} from "../generated/prisma/enums";

const NADAL_SLUG =
  "rafael-nadal";

async function replaceNadalEquipment() {
  console.log(
    "🎾 Ricerca del player Rafael Nadal...",
  );

  const player =
    await prisma.player.findUnique({
      where: {
        slug: NADAL_SLUG,
      },

      select: {
        id: true,
        name: true,
        slug: true,
      },
    });

  if (!player) {
    throw new Error(
      `Player con slug "${NADAL_SLUG}" non trovato.`,
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
        "Babolat AeroPro Drive Original",
      brand:
        "Babolat",
      period:
        "2004–2020",
      description:
        "The aerodynamic frame associated with Nadal's rise from teenage prodigy to global champion. Its spin-oriented design became one of the most recognisable racquet identities in modern tennis.",
      curiosity:
        "Although later retail generations changed names and cosmetics, Nadal remained closely connected to the original AeroPro Drive lineage throughout most of his career.",
      imageUrl: null,
      featured: true,
      sortOrder: 10,
    },

    {
      playerId: player.id,
      category:
        PlayerEquipmentCategory.RACQUET,
      name:
        "Babolat Pure Aero Rafa Origin",
      brand:
        "Babolat",
      period:
        "2023–2024",
      description:
        "A signature racquet developed to reproduce the weight, balance, lay-up and visual identity closest to the specifications used by Nadal.",
      curiosity:
        "The energetic yellow, pink and blue design was selected to reflect Nadal's playing style and personality.",
      imageUrl: null,
      featured: false,
      sortOrder: 20,
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
        "2010–2024",
      description:
        "A spin-focused polyester string associated with Nadal's heavy topspin, ball rotation and aggressive baseline control.",
      curiosity:
        "The string became closely linked to the visual and technical identity of Nadal's forehand during the second half of his career.",
      imageUrl: null,
      featured: false,
      sortOrder: 30,
    },

    {
      playerId: player.id,
      category:
        PlayerEquipmentCategory.SHOES,
      name:
        "NikeCourt Rafa Footwear",
      brand:
        "Nike",
      period:
        "Professional career",
      description:
        "Court-specific Nike footwear designed around Nadal's explosive movement, defensive slides, lateral stability and repeated changes of direction.",
      curiosity:
        "Nadal's shoes were frequently adapted for the demands of clay, hard court and grass while preserving a strong visual connection to his seasonal apparel.",
      imageUrl: null,
      featured: false,
      sortOrder: 40,
    },

    {
      playerId: player.id,
      category:
        PlayerEquipmentCategory.APPAREL,
      name:
        "NikeCourt Rafa Match Collection",
      brand:
        "Nike",
      period:
        "Professional career",
      description:
        "Performance apparel that evolved from sleeveless tops and long shorts into modern fitted shirts, polos and technical matchwear.",
      curiosity:
        "The changing silhouettes of Nadal's Nike collections document both the evolution of tennis fashion and the maturation of his public identity.",
      imageUrl: null,
      featured: false,
      sortOrder: 50,
    },

    {
      playerId: player.id,
      category:
        PlayerEquipmentCategory.BAG,
      name:
        "Babolat Pure Aero Rafa 12 Racquet Bag",
      brand:
        "Babolat",
      period:
        "Rafa signature era",
      description:
        "A large-capacity tournament bag created to carry racquets, footwear, apparel and match-day accessories within Nadal's signature equipment line.",
      curiosity:
        "Its colours and graphic language were coordinated with the Pure Aero Rafa family, creating a complete visual system around Nadal's equipment.",
      imageUrl: null,
      featured: false,
      sortOrder: 60,
    },

    {
      playerId: player.id,
      category:
        PlayerEquipmentCategory.ACCESSORY,
      name:
        "Nike Rafa Headband and Wristbands",
      brand:
        "Nike",
      period:
        "Professional career",
      description:
        "Essential match accessories that became part of Nadal's unmistakable on-court silhouette and helped manage the physical intensity of long matches.",
      curiosity:
        "The coordinated headband and wristband colours often completed the visual identity of each tournament outfit.",
      imageUrl: null,
      featured: false,
      sortOrder: 70,
    },

    {
      playerId: player.id,
      category:
        PlayerEquipmentCategory.ACCESSORY,
      name:
        "Rafa Bull Personal Logo",
      brand:
        "Nike",
      period:
        "Signature identity",
      description:
        "The stylised bull symbol used across Nadal's apparel, footwear and accessories as a visual expression of strength, courage and Mallorcan identity.",
      curiosity:
        "The bull became one of the most recognisable personal logos in tennis and extended Nadal's identity beyond individual tournament collections.",
      imageUrl: null,
      featured: false,
      sortOrder: 80,
    },
  ];

  const deleted =
    await prisma.playerEquipment.deleteMany({
      where: {
        playerId: player.id,
      },
    });

  console.log(
    `🧹 ${deleted.count} record Equipment precedenti rimossi.`,
  );

  const created =
    await prisma.playerEquipment.createMany({
      data: equipment,
    });

  console.log(
    `✅ ${created.count} record Equipment creati.`,
  );
}

async function main() {
  try {
    await replaceNadalEquipment();

    console.log(
      "🏛️ Equipment museale di Nadal pronto.",
    );
  } catch (error) {
    console.error(
      "❌ Impossibile aggiornare l'Equipment di Nadal:",
      error,
    );

    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

void main();