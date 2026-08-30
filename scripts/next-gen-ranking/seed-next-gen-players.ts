import "dotenv/config";
import {
  prisma,
} from "@/lib/prisma";

type NextGenSeedPlayer = {
  playerKey: string;
  archiveNumber: number;
  name: string;
  firstName: string;
  lastName: string;
  country: string;
  countryCode: string;
  flag: string;
  birthDate: Date;
  plays: string;
  backhand: string;
  story: string;
  highlights: string[];
  atpProfileUrl: string;
};

const players: NextGenSeedPlayer[] = [
  {
    playerKey: "moise-kouame",
    archiveNumber: 1,
    name: "Moïse Kouamé",
    firstName: "Moïse",
    lastName: "Kouamé",
    country: "France",
    countryCode: "FRA",
    flag: "🇫🇷",
    birthDate: new Date("2009-03-06T00:00:00.000Z"),
    plays: "Right-handed",
    backhand: "Two-handed",
    story:
      "One of the youngest players in the AGE202 Next Gen archive, Kouamé represents a new French generation already testing itself against professional competition.",
    highlights: [
      "Roland Garros 2026 — Third Round",
      "Three ITF professional titles",
      "AGE202 Next Gen Founding Player",
    ],
    atpProfileUrl:
      "https://www.atptour.com/en/players/moise-kouame/k0o4/overview",
  },
  {
    playerKey: "federico-cina",
    archiveNumber: 2,
    name: "Federico Cinà",
    firstName: "Federico",
    lastName: "Cinà",
    country: "Italy",
    countryCode: "ITA",
    flag: "🇮🇹",
    birthDate: new Date("2007-03-30T00:00:00.000Z"),
    plays: "Right-handed",
    backhand: "Two-handed",
    story:
      "An emerging Italian prospect whose technical maturity and progression through professional tennis have made him one of the players to document before the breakthrough.",
    highlights: [
      "Professional tour progression",
      "Italian Next Gen prospect",
      "AGE202 Next Gen Founding Player",
    ],
    atpProfileUrl:
      "https://www.atptour.com/en/players/federico-cina/c0nb/overview",
  },
  {
    playerKey: "diego-dedura",
    archiveNumber: 3,
    name: "Diego Dedura",
    firstName: "Diego",
    lastName: "Dedura",
    country: "Germany",
    countryCode: "GER",
    flag: "🇩🇪",
    birthDate: new Date("2008-03-12T00:00:00.000Z"),
    plays: "Left-handed",
    backhand: "Two-handed",
    story:
      "A German left-hander progressing rapidly through the professional pathway and already establishing himself as one of the most interesting players of his generation.",
    highlights: [
      "ATP ranking breakthrough",
      "German Next Gen prospect",
      "AGE202 Next Gen Founding Player",
    ],
    atpProfileUrl:
      "https://www.atptour.com/en/players/diego-dedura/d0lj/overview",
  },
  {
    playerKey: "nicolai-budkov-kjaer",
    archiveNumber: 4,
    name: "Nicolai Budkov Kjær",
    firstName: "Nicolai",
    lastName: "Budkov Kjær",
    country: "Norway",
    countryCode: "NOR",
    flag: "🇳🇴",
    birthDate: new Date("2006-09-01T00:00:00.000Z"),
    plays: "Right-handed",
    backhand: "Two-handed",
    story:
      "A leading Norwegian prospect whose junior success and rapid movement into the professional rankings mark him as one of the defining names of this emerging generation.",
    highlights: [
      "Strong junior career",
      "ATP Top 150 progression",
      "AGE202 Next Gen Founding Player",
    ],
    atpProfileUrl:
      "https://www.atptour.com/en/players/nicolai-budkov-kjaer/b0u4/overview",
  },
  {
    playerKey: "henry-searle",
    archiveNumber: 5,
    name: "Henry Searle",
    firstName: "Henry",
    lastName: "Searle",
    country: "Great Britain",
    countryCode: "GBR",
    flag: "🇬🇧",
    birthDate: new Date("2006-03-29T00:00:00.000Z"),
    plays: "Left-handed",
    backhand: "Two-handed",
    story:
      "A British left-hander whose junior pedigree and transition to the professional tour make him a natural part of the founding NEXT GEN archive.",
    highlights: [
      "Wimbledon junior champion",
      "Professional tour progression",
      "AGE202 Next Gen Founding Player",
    ],
    atpProfileUrl:
      "https://www.atptour.com/en/players/henry-searle/s0tx/overview",
  },
  {
    playerKey: "joel-schwaerzler",
    archiveNumber: 6,
    name: "Joel Schwärzler",
    firstName: "Joel",
    lastName: "Schwärzler",
    country: "Austria",
    countryCode: "AUT",
    flag: "🇦🇹",
    birthDate: new Date("2006-01-27T00:00:00.000Z"),
    plays: "Left-handed",
    backhand: "Two-handed",
    story:
      "One of Austria's most promising young professionals, combining junior success with steady progress into the ATP rankings.",
    highlights: [
      "Elite junior career",
      "ATP Top 200 progression",
      "AGE202 Next Gen Founding Player",
    ],
    atpProfileUrl:
      "https://www.atptour.com/en/players/joel-schwaerzler/s0wt/overview",
  },
  {
    playerKey: "maxim-mrva",
    archiveNumber: 7,
    name: "Maxim Mrva",
    firstName: "Maxim",
    lastName: "Mrva",
    country: "Czech Republic",
    countryCode: "CZE",
    flag: "🇨🇿",
    birthDate: new Date("2007-08-02T00:00:00.000Z"),
    plays: "Right-handed",
    backhand: "Two-handed",
    story:
      "A Czech prospect developing through the professional ranks with the profile of a player whose career is still being written in real time.",
    highlights: [
      "Czech Next Gen prospect",
      "ATP professional progression",
      "AGE202 Next Gen Founding Player",
    ],
    atpProfileUrl:
      "https://www.atptour.com/en/players/maxim-mrva/m0se/overview",
  },
  {
    playerKey: "cruz-hewitt",
    archiveNumber: 8,
    name: "Cruz Hewitt",
    firstName: "Cruz",
    lastName: "Hewitt",
    country: "Australia",
    countryCode: "AUS",
    flag: "🇦🇺",
    birthDate: new Date("2008-12-11T00:00:00.000Z"),
    plays: "Right-handed",
    backhand: "Two-handed",
    story:
      "An Australian prospect beginning his professional journey at a remarkably young age and one of the players AGE202 is documenting before his career fully develops.",
    highlights: [
      "Early professional progression",
      "Australian Next Gen prospect",
      "AGE202 Next Gen Founding Player",
    ],
    atpProfileUrl:
      "https://www.atptour.com/en/players/cruz-hewitt/h0k0/overview",
  },
  {
    playerKey: "max-schoenhaus",
    archiveNumber: 9,
    name: "Max Schönhaus",
    firstName: "Max",
    lastName: "Schönhaus",
    country: "Germany",
    countryCode: "GER",
    flag: "🇩🇪",
    birthDate: new Date("2007-08-01T00:00:00.000Z"),
    plays: "Right-handed",
    backhand: "One-handed",
    story:
      "A distinctive German prospect whose one-handed backhand and progression through the professional ranks give him a unique place within this generation.",
    highlights: [
      "One-handed backhand",
      "German Next Gen prospect",
      "AGE202 Next Gen Founding Player",
    ],
    atpProfileUrl:
      "https://www.atptour.com/en/players/max-schoenhaus/s0vu/overview",
  },
  {
    playerKey: "ognjen-milic",
    archiveNumber: 10,
    name: "Ognjen Milić",
    firstName: "Ognjen",
    lastName: "Milić",
    country: "Serbia",
    countryCode: "SRB",
    flag: "🇷🇸",
    birthDate: new Date("2007-06-22T00:00:00.000Z"),
    plays: "Left-handed",
    backhand: "Two-handed",
    story:
      "A Serbian left-hander building his professional career and representing another emerging chapter in a nation with a major modern tennis tradition.",
    highlights: [
      "Serbian Next Gen prospect",
      "Professional ranking progression",
      "AGE202 Next Gen Founding Player",
    ],
    atpProfileUrl:
      "https://www.atptour.com/en/players/ognjen-milic/m0ur/overview",
  },
];

async function main() {
  console.log("");
  console.log("AGE202 NEXT GEN PLAYER SEED");
  console.log("===========================");
  console.log("");

  for (const player of players) {
    const existing =
      await prisma.nextGenPlayer.findUnique({
        where: {
          playerKey: player.playerKey,
        },
        select: {
          id: true,
          playerKey: true,
        },
      });

    if (existing) {
      await prisma.nextGenPlayer.update({
        where: {
          playerKey: player.playerKey,
        },
        data: {
          archiveNumber:
            player.archiveNumber,
          name: player.name,
          firstName: player.firstName,
          lastName: player.lastName,
          country: player.country,
          countryCode:
            player.countryCode,
          flag: player.flag,
          birthDate: player.birthDate,
          plays: player.plays,
          backhand: player.backhand,
          story: player.story,
          highlights:
            player.highlights,
          atpProfileUrl:
            player.atpProfileUrl,
          status: "PUBLISHED",
          publishedAt: new Date(),
        },
      });

      console.log(
        `UPDATED  ${String(
          player.archiveNumber,
        ).padStart(2, "0")} · ${
          player.name
        }`,
      );

      continue;
    }

    await prisma.nextGenPlayer.create({
      data: {
        playerKey: player.playerKey,
        archiveNumber:
          player.archiveNumber,
        name: player.name,
        firstName: player.firstName,
        lastName: player.lastName,
        country: player.country,
        countryCode:
          player.countryCode,
        flag: player.flag,
        birthDate: player.birthDate,
        plays: player.plays,
        backhand: player.backhand,
        story: player.story,
        highlights:
          player.highlights,
        atpProfileUrl:
          player.atpProfileUrl,
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
    });

    console.log(
      `CREATED  ${String(
        player.archiveNumber,
      ).padStart(2, "0")} · ${
        player.name
      }`,
    );
  }

  const total =
    await prisma.nextGenPlayer.count();

  console.log("");
  console.log("===========================");
  console.log(
    `NEXT GEN PLAYERS IN DB: ${total}`,
  );
  console.log("===========================");
  console.log("");
}

main()
  .catch((error) => {
    console.error(
      "NEXT GEN PLAYER SEED FAILED",
      error,
    );

    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });