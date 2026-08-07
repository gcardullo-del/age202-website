import "dotenv/config";

import { prisma } from "../lib/prisma";

import {
  CareerEventCategory,
} from "../generated/prisma/enums";

const SINNER_SLUG =
  "jannik-sinner";

async function replaceSinnerCareerEvents() {
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
        "Sinner begins his professional career after choosing tennis over a promising path in competitive skiing.",
      category:
        CareerEventCategory.DEBUT,
      imageUrl: null,
      location:
        "Italy",
      tournament: null,
      featured: false,
      sortOrder: 10,
    },

    {
      playerId: player.id,
      year: 2019,
      month: 11,
      day: 9,
      title:
        "Next Gen ATP Finals Champion",
      subtitle:
        "Breakthrough in Milan",
      description:
        "Sinner wins the Next Gen ATP Finals and establishes himself among the brightest talents of a new generation.",
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
      year: 2020,
      month: 11,
      day: 14,
      title:
        "First ATP Tour Title",
      subtitle:
        "A first professional trophy",
      description:
        "Victory in Sofia gives Sinner his first ATP Tour singles title and confirms his transition from prospect to champion.",
      category:
        CareerEventCategory.TITLE,
      imageUrl: null,
      location:
        "Sofia, Bulgaria",
      tournament:
        "Sofia Open",
      featured: false,
      sortOrder: 30,
    },

    {
      playerId: player.id,
      year: 2023,
      month: 11,
      day: 26,
      title:
        "Davis Cup Champion",
      subtitle:
        "Italy returns to the summit",
      description:
        "Sinner leads Italy to its first Davis Cup title since 1976 and delivers one of the defining performances of his career.",
      category:
        CareerEventCategory.DAVIS_CUP,
      imageUrl: null,
      location:
        "Málaga, Spain",
      tournament:
        "Davis Cup Finals",
      featured: true,
      sortOrder: 40,
    },

    {
      playerId: player.id,
      year: 2024,
      month: 1,
      day: 28,
      title:
        "First Grand Slam",
      subtitle:
        "Australian Open champion",
      description:
        "Sinner completes a two-set comeback in the Melbourne final to win his first Grand Slam championship.",
      category:
        CareerEventCategory.GRAND_SLAM,
      imageUrl: null,
      location:
        "Melbourne, Australia",
      tournament:
        "Australian Open",
      featured: true,
      sortOrder: 50,
    },

    {
      playerId: player.id,
      year: 2024,
      month: 6,
      day: 10,
      title:
        "World No. 1",
      subtitle:
        "Italian tennis history",
      description:
        "Sinner becomes the first Italian singles player to reach the summit of the ATP rankings.",
      category:
        CareerEventCategory.RANKING,
      imageUrl: null,
      location: null,
      tournament: null,
      featured: true,
      sortOrder: 60,
    },

    {
      playerId: player.id,
      year: 2024,
      month: 9,
      day: 8,
      title:
        "US Open Champion",
      subtitle:
        "A second major crown",
      description:
        "Victory in New York confirms Sinner's authority on hard court and delivers his second Grand Slam title.",
      category:
        CareerEventCategory.GRAND_SLAM,
      imageUrl: null,
      location:
        "New York, United States",
      tournament:
        "US Open",
      featured: true,
      sortOrder: 70,
    },

    {
      playerId: player.id,
      year: 2025,
      month: 7,
      day: 13,
      title:
        "Wimbledon Champion",
      subtitle:
        "Triumph on grass",
      description:
        "Sinner wins his first Wimbledon crown and expands his championship identity onto the sport's most historic grass court.",
      category:
        CareerEventCategory.GRAND_SLAM,
      imageUrl: null,
      location:
        "London, United Kingdom",
      tournament:
        "Wimbledon",
      featured: true,
      sortOrder: 80,
    },

    {
      playerId: player.id,
      year: 2026,
      month: 7,
      day: 12,
      title:
        "Second Wimbledon Crown",
      subtitle:
        "Five-time major champion",
      description:
        "Sinner successfully defends Wimbledon, captures his fifth Grand Slam championship and reinforces his position as ATP World No. 1.",
      category:
        CareerEventCategory.GRAND_SLAM,
      imageUrl: null,
      location:
        "London, United Kingdom",
      tournament:
        "Wimbledon",
      featured: true,
      sortOrder: 90,
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
    await replaceSinnerCareerEvents();

    console.log(
      "🏛️ Career Timeline di Sinner pronta.",
    );
  } catch (error) {
    console.error(
      "❌ Impossibile aggiornare la Career Timeline di Sinner:",
      error,
    );

    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

void main();
