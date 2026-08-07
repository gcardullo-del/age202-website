import "dotenv/config";

import { prisma } from "../lib/prisma";

const FEDERER_SLUG =
  "roger-federer";

const federerEquipment = [
  {
    category: "RACQUET" as const,
    name: "Wilson Pro Staff 85",
    brand: "Wilson",
    period:
      "Early professional career",
    description:
      "The compact Pro Staff frame associated with the beginning of Federer's professional journey, offering a traditional feel and a highly precise response.",
    curiosity:
      "Federer used three different head sizes during his professional career, beginning with an 85-square-inch frame before moving to 90 and then 97 square inches.",
    imageUrl: null,
    featured: false,
    sortOrder: 10,
  },
  {
    category: "RACQUET" as const,
    name: "Wilson Pro Staff 90",
    brand: "Wilson",
    period:
      "Career-defining years",
    description:
      "The smaller-head Pro Staff format connected to much of Federer's most successful period, combining control, stability and classic feel.",
    curiosity:
      "The 90-square-inch Pro Staff was the frame size Federer used for most of his professional career before changing to a larger head.",
    imageUrl: null,
    featured: true,
    sortOrder: 20,
  },
  {
    category: "RACQUET" as const,
    name:
      "Wilson Pro Staff RF97 Autograph",
    brand: "Wilson",
    period: "2014–2022",
    description:
      "Federer's signature 97-square-inch Pro Staff model, designed around precision, control, stability and a traditional head-light balance.",
    curiosity:
      "Federer moved to a 97-square-inch frame in 2014. The RF97 Autograph later became his signature playing model.",
    imageUrl: null,
    featured: true,
    sortOrder: 30,
  },
  {
    category: "APPAREL" as const,
    name:
      "UNIQLO On-Court Collection",
    brand: "UNIQLO",
    period: "2018–2022",
    description:
      "Performance apparel developed around Federer's refined visual identity, combining minimal design, freedom of movement and technical fabrics.",
    curiosity:
      "Federer first appeared at Wimbledon as a UNIQLO Global Brand Ambassador in July 2018.",
    imageUrl: null,
    featured: true,
    sortOrder: 40,
  },
];

async function getFedererPlayer() {
  console.log(
    "🎾 Ricerca del player Roger Federer...",
  );

  const player =
    await prisma.player.findUnique({
      where: {
        slug: FEDERER_SLUG,
      },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });

  if (!player) {
    throw new Error(
      `Player con slug "${FEDERER_SLUG}" non trovato.`,
    );
  }

  console.log(
    `✅ Player trovato: ${player.name} (${player.id})`,
  );

  return player;
}

async function upsertFedererProfile(
  playerId: string,
) {
  const profileData = {
    birthDate: new Date(
      "1981-08-08T00:00:00.000Z",
    ),

    birthPlace:
      "Basel, Switzerland",

    residence:
      "Valbella, Switzerland",

    height: 185,

    weight: 85,

    plays:
      "Right-handed",

    backhand:
      "One-handed",

    coach: null,

    turnedPro: 1998,

    careerHigh: 1,

    atpTitles: 103,

    australianOpen: 6,

    rolandGarros: 1,

    wimbledon: 8,

    usOpen: 5,

    grandSlams: 20,

    masters1000: 28,

    atpFinals: 6,

    olympicGold: 1,

    davisCup: 1,

    prizeMoney: null,

    playingStyle:
      "Federer combined effortless movement, early ball striking and exceptional variety to control rallies with speed and precision. His fluid serve, attacking forehand, one-handed backhand and instinctive net play created an elegant all-court style capable of moving seamlessly between defence and attack.",

    favouriteSurface:
      "Grass",

    biographyShort:
      "Swiss champion whose elegance, precision and all-court ability shaped an era of modern tennis.",

    biographyLong:
      "Roger Federer emerged from Basel to become one of the defining figures in tennis history. His career combined sustained excellence, technical refinement and a distinctive visual identity. Across more than two decades, he collected major championships on every surface, spent a historic period at world No. 1 and inspired generations through an elegant, attacking interpretation of the sport.",
  };

  const profile =
    await prisma.playerProfile.upsert({
      where: {
        playerId,
      },

      create: {
        playerId,
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
      },
    });

  console.log(
    "✅ PlayerProfile di Federer creato o aggiornato.",
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
    hasPlayingStyle:
      Boolean(
        profile.playingStyle,
      ),
  });
}

async function upsertFedererEquipment(
  playerId: string,
) {
  console.log(
    "🎒 Aggiornamento dell'equipaggiamento di Federer...",
  );

  const equipmentRecords =
    await Promise.all(
      federerEquipment.map(
        (item) =>
          prisma.playerEquipment.upsert({
            where: {
              playerId_category_name: {
                playerId,
                category:
                  item.category,
                name: item.name,
              },
            },

            create: {
              playerId,
              ...item,
            },

            update: {
              brand: item.brand,
              period: item.period,
              description:
                item.description,
              curiosity:
                item.curiosity,
              imageUrl:
                item.imageUrl,
              featured:
                item.featured,
              sortOrder:
                item.sortOrder,
            },

            select: {
              id: true,
              category: true,
              name: true,
              brand: true,
              period: true,
              featured: true,
              sortOrder: true,
            },
          }),
      ),
    );

  console.log(
    `✅ ${equipmentRecords.length} record Equipment creati o aggiornati.`,
  );

  equipmentRecords.forEach(
    (item) => {
      console.log(
        `   • ${item.category} — ${item.name}`,
      );
    },
  );
}

async function main() {
  try {
    const player =
      await getFedererPlayer();

    await upsertFedererProfile(
      player.id,
    );

    await upsertFedererEquipment(
      player.id,
    );

    console.log(
      "🏛️ Profilo museale ed Equipment di Federer pronti.",
    );
  } catch (error) {
    console.error(
      "❌ Impossibile aggiornare i dati museali di Federer:",
      error,
    );

    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

void main();