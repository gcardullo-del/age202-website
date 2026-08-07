import "dotenv/config";

import { prisma } from "../lib/prisma";

const NADAL_SLUG = "rafael-nadal";

async function upsertNadalProfile() {
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

  const profileData = {
    birthDate: new Date(
      "1986-06-03T00:00:00.000Z",
    ),

    birthPlace:
      "Manacor, Mallorca, Spain",

    residence:
      "Manacor, Mallorca, Spain",

    height: 185,

    weight: 85,

    plays:
      "Left-handed",

    backhand:
      "Two-handed",

    coach:
      "Carlos Moyá",

    turnedPro: 2001,

    careerHigh: 1,

    atpTitles: 92,

    australianOpen: 2,

    rolandGarros: 14,

    wimbledon: 2,

    usOpen: 4,

    grandSlams: 22,

    masters1000: 36,

    atpFinals: 0,

    olympicGold: 2,

    davisCup: 5,

    prizeMoney: null,

    playingStyle:
      "Nadal built his game around exceptional intensity, physical resilience and extraordinary control of heavy topspin. His left-handed forehand produced extreme height and rotation, especially on clay, while his court coverage, defensive anticipation and competitive discipline allowed him to transform difficult positions into attacking opportunities. A reliable two-handed backhand, improved serve and fearless movement toward the net made his game effective on every surface.",

    favouriteSurface:
      "Clay",

    biographyShort:
      "Spanish champion whose intensity, resilience and dominance on clay created one of the greatest careers in tennis history.",

    biographyLong:
      "Rafael Nadal emerged from Manacor, Mallorca, to become one of the defining champions of the modern era. Renowned for his competitive intensity, physical resilience and extraordinary mastery of clay-court tennis, he built a career marked by historic achievements across every major surface. His record at Roland Garros became one of the most remarkable accomplishments in sport, while victories in Melbourne, London and New York confirmed the completeness of his game. Beyond trophies, Nadal became a symbol of humility, discipline and relentless determination.",
  };

  const profile =
    await prisma.playerProfile.upsert({
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
        playingStyle: true,
        favouriteSurface: true,
        careerHigh: true,
        grandSlams: true,
        atpTitles: true,
        masters1000: true,
      },
    });

  console.log(
    "✅ PlayerProfile di Nadal creato o aggiornato.",
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
    await upsertNadalProfile();

    console.log(
      "🏛️ Profilo museale di Nadal pronto.",
    );
  } catch (error) {
    console.error(
      "❌ Impossibile aggiornare il profilo di Nadal:",
      error,
    );

    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

void main();