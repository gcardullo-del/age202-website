import "dotenv/config";

import { prisma } from "../lib/prisma";

const ALCARAZ_SLUG =
  "carlos-alcaraz";

const ALCARAZ_ACCENT =
  "#D4AF37";

async function upsertAlcarazProfile() {
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

  console.log(
    `✅ Player trovato: ${player.name} (${player.id})`,
  );

  const profileData = {
    birthDate: new Date(
      "2003-05-05T00:00:00.000Z",
    ),

    birthPlace:
      "El Palmar, Murcia, Spain",

    residence:
      "Villena, Spain",

    height: 183,

    weight: 74,

    plays:
      "Right-handed",

    backhand:
      "Two-handed",

    coach:
      "Juan Carlos Ferrero",

    turnedPro: 2018,

    careerHigh: 1,

    atpTitles: 26,

    australianOpen: 1,

    rolandGarros: 1,

    wimbledon: 2,

    usOpen: 1,

    grandSlams: 7,

    masters1000: 8,

    atpFinals: 0,

    olympicGold: 0,

    davisCup: 0,

    prizeMoney: null,

    playingStyle:
      "Alcaraz combines explosive movement, creative shot-making and fearless attacking instincts with the physical coverage of an elite defender. His forehand produces heavy pace and spin, while his two-handed backhand remains compact and stable under pressure. A refined drop shot, improving serve and natural willingness to move forward allow him to change rhythm constantly and construct points with unusual freedom.",

    favouriteSurface:
      "Clay",

    biographyShort:
      "Spanish champion whose creativity, athleticism and fearless attacking tennis made him one of the defining players of a new generation.",

    biographyLong:
      "Carlos Alcaraz emerged from Murcia as one of the most dynamic young champions in modern tennis. Guided by former World No. 1 Juan Carlos Ferrero, he developed a game built on explosive movement, powerful groundstrokes and rare creative freedom. His rapid rise brought Grand Slam titles across hard court, grass and clay, the World No. 1 ranking and, by 2026, completion of the Career Grand Slam. Alcaraz became a symbol of the sport's new era through his energy, versatility and instinctive connection with audiences around the world.",
  };

  const [profile] =
    await prisma.$transaction([
      prisma.playerProfile.upsert({
        where: {
          playerId: player.id,
        },

        create: {
          playerId: player.id,
          ...profileData,
        },

        update: profileData,

        select: {
          id: true,
          playerId: true,
          favouriteSurface: true,
          careerHigh: true,
          grandSlams: true,
          atpTitles: true,
          masters1000: true,
          playingStyle: true,
        },
      }),

      prisma.player.update({
        where: {
          id: player.id,
        },

        data: {
          accent:
            ALCARAZ_ACCENT,
        },
      }),
    ]);

  console.log(
    "✅ PlayerProfile di Alcaraz creato o aggiornato.",
  );

  console.log({
    profileId: profile.id,
    playerId: profile.playerId,
    favouriteSurface:
      profile.favouriteSurface,
    careerHigh:
      profile.careerHigh,
    grandSlams:
      profile.grandSlams,
    atpTitles:
      profile.atpTitles,
    masters1000:
      profile.masters1000,
    hasPlayingStyle:
      Boolean(
        profile.playingStyle,
      ),
  });
}

async function main() {
  try {
    await upsertAlcarazProfile();

    console.log(
      "🏛️ Profilo museale di Alcaraz pronto.",
    );
  } catch (error) {
    console.error(
      "❌ Impossibile aggiornare il profilo di Alcaraz:",
      error,
    );

    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

void main();
