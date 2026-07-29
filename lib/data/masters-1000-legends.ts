import type { Masters1000Slug } from "@/lib/data/masters-1000";

export type Masters1000Legend = {
  name: string;
  initials: string;
  country: string;
  countryCode: string;
  titles: number;
  titleYears: number[];
  finals?: number;
  wins?: number;
  recordLabel: string;
  quote: string;
  image?: string;
  playerHref?: string;
};

export type Masters1000LegendsData = {
  tournamentName: string;
  eyebrow: string;
  title: string;
  description: string;
  legends: Masters1000Legend[];
};

const emptyLegends = (tournamentName: string): Masters1000LegendsData => ({
  tournamentName,
  eyebrow: "Tournament legends",
  title: `Legends of ${tournamentName}`,
  description:
    "The champions whose victories, rivalries and longevity shaped the identity of this Masters 1000 tournament.",
  legends: [],
});

export const masters1000Legends: Record<
  Masters1000Slug,
  Masters1000LegendsData
> = {
  "indian-wells": {
    tournamentName: "Indian Wells",
    eyebrow: "Desert icons",
    title: "Legends of Indian Wells",
    description:
      "The champions who defined the desert through repeat titles, unforgettable runs and lasting tournament records.",
    legends: [
      {
        name: "Roger Federer",
        initials: "RF",
        country: "Switzerland",
        countryCode: "SUI",
        titles: 5,
        titleYears: [2004, 2005, 2006, 2012, 2017],
        recordLabel: "Joint record holder",
        quote: "The King of the Desert",
        image: "/tournaments/indian-wells/legends/federer.jpg",
        playerHref: "/players/federer",
      },
      {
        name: "Novak Djokovic",
        initials: "ND",
        country: "Serbia",
        countryCode: "SRB",
        titles: 5,
        titleYears: [2008, 2011, 2014, 2015, 2016],
        recordLabel: "Joint record holder",
        quote: "Five crowns across two dominant eras",
        image: "/tournaments/indian-wells/legends/djokovic.jpg",
        playerHref: "/players/djokovic",
      },
      {
        name: "Rafael Nadal",
        initials: "RN",
        country: "Spain",
        countryCode: "ESP",
        titles: 3,
        titleYears: [2007, 2009, 2013],
        recordLabel: "Three-time champion",
        quote: "Clay-court intensity translated to the desert",
        image: "/tournaments/indian-wells/legends/nadal.jpg",
        playerHref: "/players/nadal",
      },
      {
        name: "Jimmy Connors",
        initials: "JC",
        country: "United States",
        countryCode: "USA",
        titles: 3,
        titleYears: [1976, 1981, 1984],
        recordLabel: "American pioneer",
        quote: "A champion across the tournament’s formative years",
        image: "/tournaments/indian-wells/legends/connors.jpg",
      },
      {
        name: "Michael Chang",
        initials: "MC",
        country: "United States",
        countryCode: "USA",
        titles: 3,
        titleYears: [1992, 1996, 1997],
        recordLabel: "Back-to-back champion",
        quote: "Speed, resilience and Californian success",
        image: "/tournaments/indian-wells/legends/chang.jpg",
      },
      {
        name: "Carlos Alcaraz",
        initials: "CA",
        country: "Spain",
        countryCode: "ESP",
        titles: 2,
        titleYears: [2023, 2024],
        recordLabel: "Back-to-back champion",
        quote: "A new generation takes control of the desert",
        image: "/tournaments/indian-wells/legends/alcaraz.jpg",
        playerHref: "/players/alcaraz",
      },
      {
        name: "Jannik Sinner",
        initials: "JS",
        country: "Italy",
        countryCode: "ITA",
        titles: 1,
        titleYears: [2026],
        recordLabel: "Reigning champion",
        quote: "Italian precision at the opening Masters",
        image: "/tournaments/indian-wells/legends/sinner.jpg",
        playerHref: "/players/sinner",
      },
    ],
  },
  miami: emptyLegends("Miami Open"),
  "monte-carlo": emptyLegends("Monte-Carlo Masters"),
  madrid: emptyLegends("Madrid Open"),
  rome: emptyLegends("Italian Open"),
  canada: emptyLegends("Canadian Open"),
  cincinnati: emptyLegends("Cincinnati Open"),
  shanghai: emptyLegends("Shanghai Masters"),
  paris: emptyLegends("Paris Masters"),
};

export function getMasters1000Legends(
  slug: Masters1000Slug,
): Masters1000LegendsData {
  return masters1000Legends[slug];
}
