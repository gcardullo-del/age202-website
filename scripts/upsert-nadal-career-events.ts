import "dotenv/config";

import { prisma } from "../lib/prisma";
import { CareerEventCategory } from "../generated/prisma/enums";

const NADAL_SLUG =
  "rafael-nadal";

async function replaceNadalCareerEvents() {
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

  const careerEvents = [
    {
      playerId: player.id,
      year: 2001,
      month: null,
      day: null,
      title:
        "The professional journey begins",
      subtitle:
        "A young champion leaves Manacor",
      description:
        "Nadal turned professional as a teenager, beginning a journey that would redefine competitive intensity and clay-court excellence.",
      category:
        CareerEventCategory.DEBUT,
      imageUrl: null,
      location:
        "Mallorca, Spain",
      tournament: null,
      featured: false,
      sortOrder: 10,
    },

    {
      playerId: player.id,
      year: 2004,
      month: 8,
      day: 15,
      title:
        "First ATP Tour title",
      subtitle:
        "Breakthrough in Sopot",
      description:
        "Nadal captured his first tour-level singles title on clay in Sopot, providing an early glimpse of the dominance that would follow.",
      category:
        CareerEventCategory.TITLE,
      imageUrl: null,
      location:
        "Sopot, Poland",
      tournament:
        "Idea Prokom Open",
      featured: false,
      sortOrder: 20,
    },

    {
      playerId: player.id,
      year: 2005,
      month: 6,
      day: 5,
      title:
        "First Roland Garros crown",
      subtitle:
        "A dynasty begins in Paris",
      description:
        "On his tournament debut, Nadal defeated Mariano Puerta to win his first Grand Slam title and begin an unprecedented relationship with Roland Garros.",
      category:
        CareerEventCategory.GRAND_SLAM,
      imageUrl: null,
      location:
        "Paris, France",
      tournament:
        "Roland Garros",
      featured: true,
      sortOrder: 30,
    },

    {
      playerId: player.id,
      year: 2008,
      month: 7,
      day: 6,
      title:
        "Wimbledon masterpiece",
      subtitle:
        "Victory in an all-time classic",
      description:
        "Nadal defeated Roger Federer in a five-set final to claim his first Wimbledon title and prove that his championship game extended far beyond clay.",
      category:
        CareerEventCategory.GRAND_SLAM,
      imageUrl: null,
      location:
        "London, United Kingdom",
      tournament:
        "Wimbledon",
      featured: true,
      sortOrder: 40,
    },

    {
      playerId: player.id,
      year: 2008,
      month: 8,
      day: 18,
      title:
        "Olympic champion and World No. 1",
      subtitle:
        "The summit of world tennis",
      description:
        "After winning the Beijing Olympic singles gold medal, Nadal officially rose to World No. 1 for the first time and finished the season as the year-end leader.",
      category:
        CareerEventCategory.MILESTONE,
      imageUrl: null,
      location:
        "Beijing, China",
      tournament:
        "Olympic Games",
      featured: true,
      sortOrder: 50,
    },

    {
      playerId: player.id,
      year: 2009,
      month: 2,
      day: 1,
      title:
        "Australian Open champion",
      subtitle:
        "A first major title on hard court",
      description:
        "Nadal overcame Federer in a five-set final to win his first Australian Open and strengthen his status as a complete all-surface champion.",
      category:
        CareerEventCategory.GRAND_SLAM,
      imageUrl: null,
      location:
        "Melbourne, Australia",
      tournament:
        "Australian Open",
      featured: false,
      sortOrder: 60,
    },

    {
      playerId: player.id,
      year: 2010,
      month: 9,
      day: 13,
      title:
        "Career Grand Slam completed",
      subtitle:
        "New York completes the collection",
      description:
        "Victory over Novak Djokovic in the US Open final gave Nadal the only major title missing from his collection and completed the Career Grand Slam.",
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
      year: 2013,
      month: 9,
      day: 9,
      title:
        "The comeback season",
      subtitle:
        "Resilience becomes triumph",
      description:
        "After a long injury absence, Nadal produced one of tennis history's greatest comeback seasons, winning Roland Garros and the US Open before returning to World No. 1.",
      category:
        CareerEventCategory.COMEBACK,
      imageUrl: null,
      location:
        "New York, United States",
      tournament:
        "US Open",
      featured: true,
      sortOrder: 80,
    },

    {
      playerId: player.id,
      year: 2017,
      month: 6,
      day: 11,
      title:
        "La Décima",
      subtitle:
        "Ten Roland Garros championships",
      description:
        "Nadal became the first player in the Open Era to win ten singles titles at the same Grand Slam tournament, reinforcing his unmatched Paris legacy.",
      category:
        CareerEventCategory.MILESTONE,
      imageUrl: null,
      location:
        "Paris, France",
      tournament:
        "Roland Garros",
      featured: true,
      sortOrder: 90,
    },

    {
      playerId: player.id,
      year: 2020,
      month: 10,
      day: 11,
      title:
        "Thirteen in Paris, twenty majors",
      subtitle:
        "A historic milestone",
      description:
        "Nadal won Roland Garros without dropping a set, collected his thirteenth title in Paris and reached twenty Grand Slam championships.",
      category:
        CareerEventCategory.MILESTONE,
      imageUrl: null,
      location:
        "Paris, France",
      tournament:
        "Roland Garros",
      featured: true,
      sortOrder: 100,
    },

    {
      playerId: player.id,
      year: 2022,
      month: 6,
      day: 5,
      title:
        "Fourteen Roland Garros titles",
      subtitle:
        "The record reaches twenty-two majors",
      description:
        "After an extraordinary Australian Open comeback earlier in the season, Nadal claimed a record-extending fourteenth Roland Garros title and his twenty-second major.",
      category:
        CareerEventCategory.MILESTONE,
      imageUrl: null,
      location:
        "Paris, France",
      tournament:
        "Roland Garros",
      featured: true,
      sortOrder: 110,
    },

    {
      playerId: player.id,
      year: 2024,
      month: 11,
      day: 19,
      title:
        "The final professional chapter",
      subtitle:
        "A career closes with Spain",
      description:
        "Nadal played the final match of his professional career at the Davis Cup Finals in Málaga, closing an era defined by courage, humility and relentless competition.",
      category:
        CareerEventCategory.RETIREMENT,
      imageUrl: null,
      location:
        "Málaga, Spain",
      tournament:
        "Davis Cup Finals",
      featured: true,
      sortOrder: 120,
    },
  ];

  const deleted =
    await prisma.playerCareerEvent.deleteMany({
      where: {
        playerId: player.id,
      },
    });

  console.log(
    `🧹 ${deleted.count} eventi precedenti rimossi.`,
  );

  const created =
    await prisma.playerCareerEvent.createMany({
      data: careerEvents,
    });

  console.log(
    `✅ ${created.count} eventi della carriera creati.`,
  );
}

async function main() {
  try {
    await replaceNadalCareerEvents();

    console.log(
      "🏛️ Career Timeline di Nadal pronta.",
    );
  } catch (error) {
    console.error(
      "❌ Impossibile aggiornare la Career Timeline di Nadal:",
      error,
    );

    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

void main();