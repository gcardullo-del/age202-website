import "dotenv/config";

import { prisma } from "../lib/prisma";

import {
  CareerEventCategory,
} from "../generated/prisma/enums";

const ALCARAZ_SLUG =
  "carlos-alcaraz";

async function replaceAlcarazCareerEvents() {
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

  const careerEvents = [
    {
      playerId: player.id,
      year: 2018,
      month: null,
      day: null,
      title:
        "Professional Debut",
      subtitle:
        "The journey begins",
      description:
        "Alcaraz begins his professional career and immediately displays exceptional athleticism, creativity and competitive ambition.",
      category:
        CareerEventCategory.DEBUT,
      imageUrl: null,
      location:
        "Spain",
      tournament: null,
      featured: false,
      sortOrder: 10,
    },

    {
      playerId: player.id,
      year: 2021,
      month: 11,
      day: 13,
      title:
        "Next Gen ATP Finals Champion",
      subtitle:
        "Breakthrough in Milan",
      description:
        "Alcaraz wins the Next Gen ATP Finals and confirms his status as one of the brightest young talents in world tennis.",
      category:
        CareerEventCategory.TITLE,
      imageUrl: null,
      location:
        "Milan, Italy",
      tournament:
        "Next Gen ATP Finals",
      featured: true,
      sortOrder: 20,
    },

    {
      playerId: player.id,
      year: 2022,
      month: 9,
      day: 11,
      title:
        "US Open Champion",
      subtitle:
        "First Grand Slam title",
      description:
        "Victory in New York delivers Alcaraz's first major championship and completes a historic breakthrough season.",
      category:
        CareerEventCategory.GRAND_SLAM,
      imageUrl: null,
      location:
        "New York, United States",
      tournament:
        "US Open",
      featured: true,
      sortOrder: 30,
    },

    {
      playerId: player.id,
      year: 2022,
      month: 9,
      day: 12,
      title:
        "World No. 1",
      subtitle:
        "Youngest summit in ATP history",
      description:
        "Alcaraz becomes the youngest player to reach World No. 1 in the history of the ATP rankings.",
      category:
        CareerEventCategory.RANKING,
      imageUrl: null,
      location: null,
      tournament: null,
      featured: true,
      sortOrder: 40,
    },

    {
      playerId: player.id,
      year: 2023,
      month: 7,
      day: 16,
      title:
        "Wimbledon Champion",
      subtitle:
        "Triumph on grass",
      description:
        "Alcaraz defeats Novak Djokovic in a memorable final to claim his first Wimbledon crown and second Grand Slam title.",
      category:
        CareerEventCategory.GRAND_SLAM,
      imageUrl: null,
      location:
        "London, United Kingdom",
      tournament:
        "Wimbledon",
      featured: true,
      sortOrder: 50,
    },

    {
      playerId: player.id,
      year: 2024,
      month: 6,
      day: 9,
      title:
        "Roland Garros Champion",
      subtitle:
        "Mastery on clay",
      description:
        "Victory in Paris makes Alcaraz the youngest man to win Grand Slam titles on clay, grass and hard court.",
      category:
        CareerEventCategory.GRAND_SLAM,
      imageUrl: null,
      location:
        "Paris, France",
      tournament:
        "Roland Garros",
      featured: true,
      sortOrder: 60,
    },

    {
      playerId: player.id,
      year: 2025,
      month: null,
      day: null,
      title:
        "Modern Rivalry",
      subtitle:
        "A defining new-era contest",
      description:
        "The rivalry between Alcaraz and Jannik Sinner becomes one of the central competitive stories of the new era of men's tennis.",
      category:
        CareerEventCategory.RIVALRY,
      imageUrl: null,
      location: null,
      tournament: null,
      featured: true,
      sortOrder: 70,
    },

    {
      playerId: player.id,
      year: 2026,
      month: 2,
      day: 1,
      title:
        "Career Grand Slam",
      subtitle:
        "History in Melbourne",
      description:
        "Alcaraz wins the Australian Open and becomes the youngest man in the Open Era to complete the Career Grand Slam.",
      category:
        CareerEventCategory.GRAND_SLAM,
      imageUrl: null,
      location:
        "Melbourne, Australia",
      tournament:
        "Australian Open",
      featured: true,
      sortOrder: 80,
    },
  ];

  const result =
    await prisma.$transaction(async (transaction) => {
      const deleted =
        await transaction.playerCareerEvent.deleteMany({
          where: {
            playerId: player.id,
          },
        });

      const created =
        await transaction.playerCareerEvent.createMany({
          data: careerEvents,
        });

      return {
        deleted:
          deleted.count,
        created:
          created.count,
      };
    });

  console.log(
    `🧹 ${result.deleted} eventi precedenti rimossi.`,
  );

  console.log(
    `✅ ${result.created} eventi della carriera creati.`,
  );
}

async function main() {
  try {
    await replaceAlcarazCareerEvents();

    console.log(
      "🏛️ Career Timeline di Alcaraz pronta.",
    );
  } catch (error) {
    console.error(
      "❌ Impossibile aggiornare la Career Timeline di Alcaraz:",
      error,
    );

    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

void main();
