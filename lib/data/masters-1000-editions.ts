export type Masters1000EditionPlayer = {
  name: string;
  slug?: string;
  countryCode: string;
  flag: string;
  seed?: string;
};

export type Masters1000Edition = {
  year: number;
  champion: Masters1000EditionPlayer;
  runnerUp: Masters1000EditionPlayer;
  score: string;
  date: string;
  venue: string;
  note: string;
  milestone?: string;
};

export type Masters1000EditionsData = {
  tournamentName: string;
  firstEditionYear: number;
  featuredEditions: Masters1000Edition[];
};

const editionsBySlug: Record<string, Masters1000EditionsData> = {
  "indian-wells": {
    tournamentName: "Indian Wells",
    firstEditionYear: 1974,
    featuredEditions: [
      {
        year: 2026,
        champion: {
          name: "Jannik Sinner",
          countryCode: "ITA",
          flag: "🇮🇹",
          seed: "2",
        },
        runnerUp: {
          name: "Daniil Medvedev",
          countryCode: "RUS",
          flag: "",
          seed: "11",
        },
        score: "7-6(6), 7-6(4)",
        date: "15 March 2026",
        venue: "Indian Wells Tennis Garden",
        note:
          "Sinner won his first Indian Wells title without dropping a set during the tournament.",
        milestone: "Maiden Indian Wells crown",
      },
      {
        year: 2025,
        champion: {
          name: "Jack Draper",
          countryCode: "GBR",
          flag: "🇬🇧",
          seed: "13",
        },
        runnerUp: {
          name: "Holger Rune",
          countryCode: "DEN",
          flag: "🇩🇰",
          seed: "12",
        },
        score: "6-2, 6-2",
        date: "16 March 2025",
        venue: "Indian Wells Tennis Garden",
        note:
          "Draper delivered a dominant final to capture the first ATP Masters 1000 title of his career.",
        milestone: "First Masters 1000 title",
      },
      {
        year: 2024,
        champion: {
          name: "Carlos Alcaraz",
          countryCode: "ESP",
          flag: "🇪🇸",
          seed: "2",
        },
        runnerUp: {
          name: "Daniil Medvedev",
          countryCode: "RUS",
          flag: "",
          seed: "4",
        },
        score: "7-6(5), 6-1",
        date: "17 March 2024",
        venue: "Indian Wells Tennis Garden",
        note:
          "Alcaraz defeated Medvedev for the second consecutive year to retain the desert title.",
        milestone: "Back-to-back champion",
      },
      {
        year: 2023,
        champion: {
          name: "Carlos Alcaraz",
          countryCode: "ESP",
          flag: "🇪🇸",
          seed: "1",
        },
        runnerUp: {
          name: "Daniil Medvedev",
          countryCode: "RUS",
          flag: "",
          seed: "5",
        },
        score: "6-3, 6-2",
        date: "19 March 2023",
        venue: "Indian Wells Tennis Garden",
        note:
          "Alcaraz completed the tournament without losing a set and returned to World No. 1.",
        milestone: "Maiden Indian Wells title",
      },
      {
        year: 2022,
        champion: {
          name: "Taylor Fritz",
          countryCode: "USA",
          flag: "🇺🇸",
          seed: "20",
        },
        runnerUp: {
          name: "Rafael Nadal",
          countryCode: "ESP",
          flag: "🇪🇸",
          seed: "4",
        },
        score: "6-3, 7-6(5)",
        date: "20 March 2022",
        venue: "Indian Wells Tennis Garden",
        note:
          "Fritz became the first American men's singles champion at Indian Wells since Andre Agassi in 2001.",
        milestone: "Home champion",
      },
    ],
  },
};

export function getMasters1000Editions(slug: string) {
  return editionsBySlug[slug] ?? null;
}
