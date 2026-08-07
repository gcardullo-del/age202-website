import "dotenv/config";

import { prisma } from "../lib/prisma";

const SINNER_SLUG =
  "jannik-sinner";

const SINNER_ACCENT =
  "#FF7A00";

async function upsertSinnerProfile() {
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

  console.log(
    `✅ Player trovato: ${player.name} (${player.id})`,
  );

  const profileData = {
    birthDate: new Date(
      "2001-08-16T00:00:00.000Z",
    ),

    birthPlace:
      "San Candido, Italy",

    residence:
      "Monte Carlo, Monaco",

    height: 191,

    weight: 77,

    plays:
      "Right-handed",

    backhand:
      "Two-handed",

    coach:
      "Simone Vagnozzi",

    turnedPro: 2018,

    careerHigh: 1,

    atpTitles: 30,

    australianOpen: 2,

    rolandGarros: 0,

    wimbledon: 2,

    usOpen: 1,

    grandSlams: 5,

    masters1000: 10,

    atpFinals: 2,

    olympicGold: 0,

    davisCup: 2,

    prizeMoney: null,

    playingStyle:
      "Sinner combines exceptionally clean ball striking with compact preparation, early timing and controlled acceleration from both wings. His two-handed backhand is one of the most stable and penetrating shots in the modern game, while his forehand creates depth through speed and precise directional changes. Improved movement, serve variation and composure under pressure allow him to control rallies without sacrificing defensive balance.",

    favouriteSurface:
      "Hard court",

    biographyShort:
      "Italian champion whose precision, composure and relentless improvement established him at the summit of modern tennis.",

    biographyLong:
      "Jannik Sinner emerged from South Tyrol after choosing tennis over a promising path in competitive skiing. His rise was defined by disciplined development, unusually clean technique and a calm competitive identity. Victories at the Next Gen ATP Finals and Davis Cup preceded his breakthrough at Grand Slam level, his historic rise to World No. 1 and a run of major championships across hard court and grass. Sinner became the leading figure of a new Italian tennis era while maintaining a reputation for humility, precision and continuous improvement.",
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
            SINNER_ACCENT,
        },
      }),
    ]);

  console.log(
    "✅ PlayerProfile di Sinner creato o aggiornato.",
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
    await upsertSinnerProfile();

    console.log(
      "🏛️ Profilo museale di Sinner pronto.",
    );
  } catch (error) {
    console.error(
      "❌ Impossibile aggiornare il profilo di Sinner:",
      error,
    );

    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

void main();
