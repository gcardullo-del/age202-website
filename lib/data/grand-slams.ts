export const GRAND_SLAM_SLUGS = [
  "australian-open",
  "roland-garros",
  "wimbledon",
  "us-open",
] as const;

export type GrandSlamSlug = (typeof GRAND_SLAM_SLUGS)[number];

export type GrandSlamFact = {
  label: string;
  value: string;
};

export type GrandSlamTimelineEntry = {
  year: string;
  title: string;
  description: string;
};

export type GrandSlamRecord = {
  label: string;
  value: string;
  description: string;
};

export type GrandSlamIconicMoment = {
  year: string;
  title: string;
  description: string;
};

export type GrandSlamData = {
  slug: GrandSlamSlug;

  name: string;
  shortName: string;
  code: string;

  eyebrow: string;
  headline: string;
  introduction: string;
  history: string[];

  city: string;
  country: string;
  venue: string;
  surface: string;
  calendar: string;
  founded: string;

  identity: string;
  motto: string;
  visualCode: string;

  colors: {
    primary: string;
    secondary: string;
    glow: string;
  };

  facts: GrandSlamFact[];
  timeline: GrandSlamTimelineEntry[];
  records: GrandSlamRecord[];
  iconicMoments: GrandSlamIconicMoment[];

  previousTournament?: {
    name: string;
    slug: GrandSlamSlug;
  };

  nextTournament?: {
    name: string;
    slug: GrandSlamSlug;
  };
};

export const grandSlams: Record<GrandSlamSlug, GrandSlamData> = {
  "australian-open": {
    slug: "australian-open",

    name: "Australian Open",
    shortName: "Australian Open",
    code: "AO",

    eyebrow: "The first major of the season",
    headline: "Melbourne starts the race for history.",
    introduction:
      "The Australian Open opens the Grand Slam season beneath the Melbourne summer, combining elite competition, modern facilities and one of the most energetic atmospheres in professional tennis.",

    history: [
      "The tournament began in 1905 and developed from a national championship into one of the four defining events of international tennis.",
      "Over time, the competition moved between several Australian cities before establishing Melbourne as its permanent home.",
      "Its transition to hard courts and the development of Melbourne Park helped shape the tournament into a modern global sporting event.",
    ],

    city: "Melbourne",
    country: "Australia",
    venue: "Melbourne Park",
    surface: "Hard",
    calendar: "January",
    founded: "1905",

    identity: "The Happy Slam",
    motto: "The season begins here.",
    visualCode: "MEL",

    colors: {
      primary: "#1597E5",
      secondary: "#062B48",
      glow: "rgba(21, 151, 229, 0.22)",
    },

    facts: [
      {
        label: "Founded",
        value: "1905",
      },
      {
        label: "Host city",
        value: "Melbourne",
      },
      {
        label: "Surface",
        value: "Hard",
      },
      {
        label: "Season",
        value: "January",
      },
    ],

    timeline: [
      {
        year: "1905",
        title: "The first championship",
        description:
          "The tournament is founded as the Australasian Championships.",
      },
      {
        year: "1927",
        title: "Australian Championships",
        description:
          "The competition adopts the Australian Championships name.",
      },
      {
        year: "1969",
        title: "The Open Era",
        description:
          "The tournament becomes the Australian Open and welcomes professional players.",
      },
      {
        year: "1988",
        title: "Melbourne Park",
        description:
          "The event moves to its modern home and changes from grass to hard courts.",
      },
    ],

    records: [
      {
        label: "Tournament identity",
        value: "First Major",
        description:
          "The Australian Open traditionally begins the annual Grand Slam journey.",
      },
      {
        label: "Playing environment",
        value: "Outdoor Hard",
        description:
          "Fast, physical conditions define the opening major of the season.",
      },
      {
        label: "Signature atmosphere",
        value: "Melbourne Summer",
        description:
          "Day sessions, night matches and energetic crowds shape the event.",
      },
      {
        label: "Archive scope",
        value: "All Editions",
        description:
          "Champions, finals and historical milestones will populate the AGE202 archive.",
      },
    ],

    iconicMoments: [
      {
        year: "1905",
        title: "The beginning",
        description:
          "The first edition establishes the foundation of the Australian championship.",
      },
      {
        year: "1988",
        title: "A new era in Melbourne",
        description:
          "The move to Melbourne Park transforms the identity of the tournament.",
      },
      {
        year: "2000",
        title: "A modern centre court",
        description:
          "The main arena receives the name Rod Laver Arena.",
      },
    ],

    nextTournament: {
      name: "Roland Garros",
      slug: "roland-garros",
    },
  },

  "roland-garros": {
    slug: "roland-garros",

    name: "Roland Garros",
    shortName: "Roland Garros",
    code: "RG",

    eyebrow: "The championship of clay",
    headline: "Paris rewards patience, movement and endurance.",
    introduction:
      "Roland Garros is the ultimate clay-court examination. Long rallies, tactical discipline and physical resilience make the Paris major one of the most demanding championships in tennis.",

    history: [
      "The French championship began in 1891 and gradually developed into an international competition.",
      "The tournament moved to its current Paris venue in 1928, built around the legacy of French aviation pioneer Roland Garros.",
      "Its red clay courts have created a distinct sporting identity and produced some of the most physically demanding matches in Grand Slam history.",
    ],

    city: "Paris",
    country: "France",
    venue: "Stade Roland-Garros",
    surface: "Clay",
    calendar: "May · June",
    founded: "1891",

    identity: "The Clay Major",
    motto: "Every point must be earned.",
    visualCode: "PAR",

    colors: {
      primary: "#D86432",
      secondary: "#4A1E10",
      glow: "rgba(216, 100, 50, 0.22)",
    },

    facts: [
      {
        label: "Founded",
        value: "1891",
      },
      {
        label: "Host city",
        value: "Paris",
      },
      {
        label: "Surface",
        value: "Clay",
      },
      {
        label: "Season",
        value: "May · June",
      },
    ],

    timeline: [
      {
        year: "1891",
        title: "French championship",
        description:
          "The first edition of the national championship is staged.",
      },
      {
        year: "1925",
        title: "International expansion",
        description:
          "The tournament opens to international amateur competitors.",
      },
      {
        year: "1928",
        title: "Stade Roland-Garros",
        description:
          "The championship moves to its permanent Paris home.",
      },
      {
        year: "1968",
        title: "The first Open",
        description:
          "Roland Garros becomes the first Grand Slam tournament of the Open Era.",
      },
    ],

    records: [
      {
        label: "Tournament identity",
        value: "Clay Major",
        description:
          "Roland Garros is the only Grand Slam championship played on clay.",
      },
      {
        label: "Playing environment",
        value: "Outdoor Clay",
        description:
          "The surface slows the ball and rewards construction, defence and endurance.",
      },
      {
        label: "Signature atmosphere",
        value: "Parisian Spring",
        description:
          "Tradition and intensity meet inside the historic Paris venue.",
      },
      {
        label: "Archive scope",
        value: "All Editions",
        description:
          "Champions, finals and historical milestones will populate the AGE202 archive.",
      },
    ],

    iconicMoments: [
      {
        year: "1928",
        title: "A permanent home",
        description:
          "The new Stade Roland-Garros becomes the centre of French tennis.",
      },
      {
        year: "1968",
        title: "The Open Era begins",
        description:
          "Professionals and amateurs compete together in a landmark edition.",
      },
      {
        year: "2020",
        title: "Court Philippe-Chatrier evolves",
        description:
          "The main stadium enters a new era with a retractable roof.",
      },
    ],

    previousTournament: {
      name: "Australian Open",
      slug: "australian-open",
    },

    nextTournament: {
      name: "Wimbledon",
      slug: "wimbledon",
    },
  },

  wimbledon: {
    slug: "wimbledon",

    name: "Wimbledon",
    shortName: "Wimbledon",
    code: "W",

    eyebrow: "The original championship",
    headline: "Tradition lives on the grass of London.",
    introduction:
      "Wimbledon is the oldest tennis tournament in the world and the sport's most recognisable championship. Grass courts, historic rituals and sporting prestige define its timeless identity.",

    history: [
      "The first Wimbledon Championship was staged in 1877 by the All England Club.",
      "The event grew from a domestic competition into one of the central institutions of international tennis.",
      "Its grass courts, all-white clothing tradition and distinctive presentation preserve a direct connection between modern tennis and the origins of the sport.",
    ],

    city: "London",
    country: "United Kingdom",
    venue: "All England Lawn Tennis and Croquet Club",
    surface: "Grass",
    calendar: "June · July",
    founded: "1877",

    identity: "The Championships",
    motto: "Tradition defines greatness.",
    visualCode: "LON",

    colors: {
      primary: "#6B4FA1",
      secondary: "#183D2B",
      glow: "rgba(107, 79, 161, 0.22)",
    },

    facts: [
      {
        label: "Founded",
        value: "1877",
      },
      {
        label: "Host city",
        value: "London",
      },
      {
        label: "Surface",
        value: "Grass",
      },
      {
        label: "Season",
        value: "June · July",
      },
    ],

    timeline: [
      {
        year: "1877",
        title: "The first Championship",
        description:
          "The inaugural gentlemen's singles competition is held in London.",
      },
      {
        year: "1884",
        title: "The tournament expands",
        description:
          "Ladies' singles and gentlemen's doubles are introduced.",
      },
      {
        year: "1922",
        title: "Church Road",
        description:
          "The tournament moves to its current home at Church Road.",
      },
      {
        year: "1968",
        title: "Open Era Wimbledon",
        description:
          "Professional players return to compete at the Championships.",
      },
    ],

    records: [
      {
        label: "Tournament identity",
        value: "Oldest Major",
        description:
          "Wimbledon has been staged since 1877.",
      },
      {
        label: "Playing environment",
        value: "Outdoor Grass",
        description:
          "The natural surface creates a distinctive rhythm and style of play.",
      },
      {
        label: "Signature atmosphere",
        value: "London Tradition",
        description:
          "History, ceremony and sporting excellence define the Championships.",
      },
      {
        label: "Archive scope",
        value: "All Editions",
        description:
          "Champions, finals and historical milestones will populate the AGE202 archive.",
      },
    ],

    iconicMoments: [
      {
        year: "1877",
        title: "Tennis history begins",
        description:
          "The first Championship establishes the oldest major in the sport.",
      },
      {
        year: "1922",
        title: "The move to Church Road",
        description:
          "Wimbledon enters a new chapter at its present-day grounds.",
      },
      {
        year: "2009",
        title: "Centre Court evolves",
        description:
          "A retractable roof transforms the tournament's main arena.",
      },
    ],

    previousTournament: {
      name: "Roland Garros",
      slug: "roland-garros",
    },

    nextTournament: {
      name: "US Open",
      slug: "us-open",
    },
  },

  "us-open": {
    slug: "us-open",

    name: "US Open",
    shortName: "US Open",
    code: "US",

    eyebrow: "The final major of the season",
    headline: "New York turns tennis into a spectacle.",
    introduction:
      "The US Open closes the annual Grand Slam season with night sessions, powerful hard-court tennis and the unmistakable energy of New York.",

    history: [
      "The tournament began in 1881 as the United States National Championship.",
      "It expanded through multiple venues and formats before moving to the USTA National Tennis Center in New York.",
      "The event is known for innovation, large crowds and a powerful atmosphere that makes its night sessions unique within the Grand Slam calendar.",
    ],

    city: "New York",
    country: "United States",
    venue: "USTA Billie Jean King National Tennis Center",
    surface: "Hard",
    calendar: "August · September",
    founded: "1881",

    identity: "New York's Major",
    motto: "The season ends under the lights.",
    visualCode: "NYC",

    colors: {
      primary: "#F5C542",
      secondary: "#123C69",
      glow: "rgba(245, 197, 66, 0.2)",
    },

    facts: [
      {
        label: "Founded",
        value: "1881",
      },
      {
        label: "Host city",
        value: "New York",
      },
      {
        label: "Surface",
        value: "Hard",
      },
      {
        label: "Season",
        value: "August · September",
      },
    ],

    timeline: [
      {
        year: "1881",
        title: "The national championship",
        description:
          "The first United States championship is held.",
      },
      {
        year: "1968",
        title: "The US Open",
        description:
          "The tournament enters the Open Era under its modern name.",
      },
      {
        year: "1978",
        title: "Flushing Meadows",
        description:
          "The event moves to its current New York home.",
      },
      {
        year: "1997",
        title: "Arthur Ashe Stadium",
        description:
          "The tournament opens its largest and most recognisable arena.",
      },
    ],

    records: [
      {
        label: "Tournament identity",
        value: "Final Major",
        description:
          "The US Open traditionally concludes the annual Grand Slam season.",
      },
      {
        label: "Playing environment",
        value: "Outdoor Hard",
        description:
          "Athletic, aggressive tennis defines the New York championship.",
      },
      {
        label: "Signature atmosphere",
        value: "Night Sessions",
        description:
          "Large crowds and evening matches create a distinctive spectacle.",
      },
      {
        label: "Archive scope",
        value: "All Editions",
        description:
          "Champions, finals and historical milestones will populate the AGE202 archive.",
      },
    ],

    iconicMoments: [
      {
        year: "1968",
        title: "A modern championship",
        description:
          "The first US Open signals the arrival of a new professional era.",
      },
      {
        year: "1978",
        title: "The move to New York",
        description:
          "Flushing Meadows becomes the permanent home of the tournament.",
      },
      {
        year: "1997",
        title: "Arthur Ashe Stadium opens",
        description:
          "The championship enters a new era of scale and spectacle.",
      },
    ],

    previousTournament: {
      name: "Wimbledon",
      slug: "wimbledon",
    },
  },
};

export const grandSlamList = GRAND_SLAM_SLUGS.map(
  (slug) => grandSlams[slug],
);

export function isGrandSlamSlug(
  value: string,
): value is GrandSlamSlug {
  return GRAND_SLAM_SLUGS.includes(value as GrandSlamSlug);
}

export function getGrandSlamBySlug(
  slug: string,
): GrandSlamData | null {
  if (!isGrandSlamSlug(slug)) {
    return null;
  }

  return grandSlams[slug];
}

export function getGrandSlamHref(slug: GrandSlamSlug): string {
  return `/results/grand-slams/${slug}`;
}