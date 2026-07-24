export type PlayerSlug =
  | "federer"
  | "nadal"
  | "djokovic"
  | "sinner"
  | "alcaraz";

export type PlayerTimelineCategory =
  | "career"
  | "ranking"
  | "grand-slam"
  | "team"
  | "olympics"
  | "legacy";

export type PlayerTimelineEvent = {
  year: number;
  title: string;
  description: string;
  category?: PlayerTimelineCategory;
};

export type PlayerTrophy = {
  tournament:
    | "Australian Open"
    | "Roland Garros"
    | "Wimbledon"
    | "US Open";
  titles: number;
};

export type PlayerTheme = {
  accent: string;
  secondary: string;
  glow: string;
  gradientFrom: string;
  gradientTo: string;
};

export type PlayerProfile = {
  id: string;
  slug: PlayerSlug;

  name: string;
  nickname: string;

  firstName: string;
  lastName: string;
  initials: string;

  country: string;
  countryCode: string;

  born: string;
  birthplace: string;
  turnedPro: number;

  playingHand: string;
  backhand: string;

  careerTitles: number;
  grandSlamTitles: number;
  highestRanking: number;
  weeksAtNumberOne: number;

  status: "active" | "retired";
  retiredYear?: number;

  biography: string;
  museumDescription: string;
  signature: string;

  /**
   * Backwards-compatible image used by existing cards and components.
   * It intentionally matches portraitImage so that old components do not
   * reference a missing file.
   */
  image: string;

  /**
   * Wide image used by the cinematic player hero.
   */
  heroImage: string;

  /**
   * Vertical or portrait-oriented image used by PlayerBiography.
   */
  portraitImage: string;

  /**
   * Image used by compact player cards and related-legend sections.
   */
  cardImage: string;

  theme: PlayerTheme;

  trophies: PlayerTrophy[];
  timeline: PlayerTimelineEvent[];
};

export const players: PlayerProfile[] = [
  {
    id: "federer",
    slug: "federer",

    name: "Roger Federer",
    nickname: "The Maestro",

    firstName: "Roger",
    lastName: "Federer",
    initials: "RF",

    country: "Switzerland",
    countryCode: "CH",

    born: "8 August 1981",
    birthplace: "Basel, Switzerland",
    turnedPro: 1998,

    playingHand: "Right-handed",
    backhand: "One-handed",

    careerTitles: 103,
    grandSlamTitles: 20,
    highestRanking: 1,
    weeksAtNumberOne: 310,

    status: "retired",
    retiredYear: 2022,

    biography:
      "Roger Federer combined technical elegance, attacking tennis and extraordinary longevity to become one of the most influential champions in the history of the sport.",

    museumDescription:
      "Explore collectible apparel connected to Roger Federer’s defining seasons, legendary Grand Slam victories and unmistakable court style.",

    signature:
      "Elegance, precision and a legacy that changed tennis forever.",

    image: "/players/federer.jpg",
    heroImage: "/players/federer.jpg",
    portraitImage: "/players/federer.jpg",
    cardImage: "/players/federer.jpg",

    theme: {
      accent: "#C8FF00",
      secondary: "#16210C",
      glow: "#C8FF00",
      gradientFrom: "#08101D",
      gradientTo: "#030711",
    },

    trophies: [
      { tournament: "Australian Open", titles: 6 },
      { tournament: "Roland Garros", titles: 1 },
      { tournament: "Wimbledon", titles: 8 },
      { tournament: "US Open", titles: 5 },
    ],

    timeline: [
      {
        year: 1998,
        title: "Professional debut",
        description:
          "Federer began his professional career and entered the ATP Tour.",
        category: "career",
      },
      {
        year: 2001,
        title: "Wimbledon breakthrough",
        description:
          "He defeated seven-time champion Pete Sampras at Wimbledon.",
        category: "grand-slam",
      },
      {
        year: 2003,
        title: "First Grand Slam",
        description:
          "Federer won his first Wimbledon title and first major championship.",
        category: "grand-slam",
      },
      {
        year: 2004,
        title: "World number one",
        description:
          "He reached the top of the ATP rankings for the first time.",
        category: "ranking",
      },
      {
        year: 2009,
        title: "Career Grand Slam",
        description:
          "Victory at Roland Garros completed his collection of all four majors.",
        category: "legacy",
      },
      {
        year: 2017,
        title: "Historic comeback",
        description:
          "Federer returned from injury and won the Australian Open and Wimbledon.",
        category: "grand-slam",
      },
      {
        year: 2018,
        title: "Twentieth major",
        description:
          "He captured his twentieth Grand Slam title at the Australian Open.",
        category: "grand-slam",
      },
      {
        year: 2022,
        title: "Final professional match",
        description:
          "Federer concluded his professional career at the Laver Cup.",
        category: "legacy",
      },
    ],
  },

  {
    id: "nadal",
    slug: "nadal",

    name: "Rafael Nadal",
    nickname: "The King of Clay",

    firstName: "Rafael",
    lastName: "Nadal",
    initials: "RN",

    country: "Spain",
    countryCode: "ES",

    born: "3 June 1986",
    birthplace: "Manacor, Spain",
    turnedPro: 2001,

    playingHand: "Left-handed",
    backhand: "Two-handed",

    careerTitles: 92,
    grandSlamTitles: 22,
    highestRanking: 1,
    weeksAtNumberOne: 209,

    status: "retired",
    retiredYear: 2024,

    biography:
      "Rafael Nadal built his career on extraordinary intensity, resilience and competitive spirit, becoming the most successful clay-court player in tennis history.",

    museumDescription:
      "Discover collectible apparel connected to Rafael Nadal’s historic Roland Garros campaigns, powerful playing identity and unforgettable victories.",

    signature:
      "Intensity, resilience and unmatched dominance on clay.",

    /*
     * The previous image value referenced /players/nadal.jpg while the working
     * hero asset was /players/nadal.webp. All portrait-compatible fields now
     * use the same existing asset to prevent a broken Museum Portrait.
     */
    image: "/players/nadal.webp",
    heroImage: "/players/nadal.webp",
    portraitImage: "/players/nadal.webp",
    cardImage: "/players/nadal.webp",

    theme: {
      accent: "#FF7A18",
      secondary: "#29150A",
      glow: "#FF7A18",
      gradientFrom: "#140B08",
      gradientTo: "#04070E",
    },

    trophies: [
      { tournament: "Australian Open", titles: 2 },
      { tournament: "Roland Garros", titles: 14 },
      { tournament: "Wimbledon", titles: 2 },
      { tournament: "US Open", titles: 4 },
    ],

    timeline: [
      {
        year: 2001,
        title: "Professional debut",
        description:
          "Nadal began competing professionally as a teenager.",
        category: "career",
      },
      {
        year: 2005,
        title: "First Roland Garros title",
        description:
          "He won the French Open on his tournament debut.",
        category: "grand-slam",
      },
      {
        year: 2008,
        title: "Wimbledon masterpiece",
        description:
          "Nadal defeated Federer in one of tennis history’s most celebrated finals.",
        category: "grand-slam",
      },
      {
        year: 2008,
        title: "Olympic champion",
        description:
          "He won the singles gold medal at the Beijing Olympic Games.",
        category: "olympics",
      },
      {
        year: 2010,
        title: "Career Grand Slam",
        description:
          "Victory at the US Open completed his collection of all four majors.",
        category: "legacy",
      },
      {
        year: 2020,
        title: "Twentieth Grand Slam",
        description:
          "Nadal won his thirteenth Roland Garros title without dropping a set.",
        category: "grand-slam",
      },
      {
        year: 2022,
        title: "Australian Open comeback",
        description:
          "He recovered from two sets down to win an extraordinary final.",
        category: "grand-slam",
      },
      {
        year: 2024,
        title: "Final professional season",
        description:
          "Nadal concluded his professional tennis career.",
        category: "legacy",
      },
    ],
  },

  {
    id: "djokovic",
    slug: "djokovic",

    name: "Novak Djokovic",
    nickname: "The Complete Champion",

    firstName: "Novak",
    lastName: "Djokovic",
    initials: "ND",

    country: "Serbia",
    countryCode: "RS",

    born: "22 May 1987",
    birthplace: "Belgrade, Serbia",
    turnedPro: 2003,

    playingHand: "Right-handed",
    backhand: "Two-handed",

    careerTitles: 101,
    grandSlamTitles: 24,
    highestRanking: 1,
    weeksAtNumberOne: 428,

    status: "active",

    biography:
      "Novak Djokovic redefined consistency and all-court excellence through exceptional movement, return of serve and mental strength.",

    museumDescription:
      "Explore collectible apparel documenting Novak Djokovic’s record-breaking seasons, Grand Slam triumphs and evolution across tennis eras.",

    signature:
      "Precision, resilience and record-breaking excellence.",

    image: "/players/djokovic.jpg",
    heroImage: "/players/djokovic.jpg",
    portraitImage: "/players/djokovic.jpg",
    cardImage: "/players/djokovic.jpg",

    theme: {
      accent: "#4EA5FF",
      secondary: "#0A1D33",
      glow: "#4EA5FF",
      gradientFrom: "#071423",
      gradientTo: "#030711",
    },

    trophies: [
      { tournament: "Australian Open", titles: 10 },
      { tournament: "Roland Garros", titles: 3 },
      { tournament: "Wimbledon", titles: 7 },
      { tournament: "US Open", titles: 4 },
    ],

    timeline: [
      {
        year: 2003,
        title: "Professional debut",
        description:
          "Djokovic began his professional career on the international tour.",
        category: "career",
      },
      {
        year: 2008,
        title: "First Grand Slam",
        description:
          "He won his first Australian Open championship.",
        category: "grand-slam",
      },
      {
        year: 2011,
        title: "Dominant season",
        description:
          "Djokovic won three majors and reached world number one.",
        category: "ranking",
      },
      {
        year: 2016,
        title: "Career Grand Slam",
        description:
          "Victory at Roland Garros completed his collection of all four majors.",
        category: "legacy",
      },
      {
        year: 2021,
        title: "Three-major season",
        description:
          "He won the Australian Open, Roland Garros and Wimbledon.",
        category: "grand-slam",
      },
      {
        year: 2023,
        title: "Record twenty-fourth major",
        description:
          "Djokovic won the US Open to reach twenty-four Grand Slam singles titles.",
        category: "grand-slam",
      },
      {
        year: 2024,
        title: "Olympic gold",
        description:
          "He completed his major career objectives by winning Olympic singles gold.",
        category: "olympics",
      },
      {
        year: 2025,
        title: "One hundred and first title",
        description:
          "Djokovic extended his historic career total to 101 tour-level trophies.",
        category: "legacy",
      },
    ],
  },

  {
    id: "sinner",
    slug: "sinner",

    name: "Jannik Sinner",
    nickname: "The New Precision",

    firstName: "Jannik",
    lastName: "Sinner",
    initials: "JS",

    country: "Italy",
    countryCode: "IT",

    born: "16 August 2001",
    birthplace: "San Candido, Italy",
    turnedPro: 2018,

    playingHand: "Right-handed",
    backhand: "Two-handed",

    /*
     * Official ATP figures checked on 22 July 2026.
     */
    careerTitles: 30,
    grandSlamTitles: 5,
    highestRanking: 1,
    weeksAtNumberOne: 81,

    status: "active",

    biography:
      "Jannik Sinner emerged as the leading figure of a new Italian tennis generation through clean ball striking, composure and relentless progression. His rise from Next Gen champion to World No. 1 developed into a sustained era of major titles and record-setting consistency.",

    museumDescription:
      "Discover collectible apparel connected to Jannik Sinner’s rise to world number one, five Grand Slam victories and defining championship seasons.",

    signature:
      "Modern precision and the rise of a new Italian champion.",

    /*
     * The old portrait field pointed to /players/sinner.jpg, while the working
     * hero asset was /players/sinner.jpeg. The paths are now aligned.
     */
    image: "/players/sinner.jpeg",
    heroImage: "/players/sinner.jpeg",
    portraitImage: "/players/sinner.jpeg",
    cardImage: "/players/sinner.jpeg",

    theme: {
      accent: "#8DFF61",
      secondary: "#102512",
      glow: "#8DFF61",
      gradientFrom: "#08150E",
      gradientTo: "#030711",
    },

    trophies: [
      { tournament: "Australian Open", titles: 2 },
      { tournament: "Roland Garros", titles: 0 },
      { tournament: "Wimbledon", titles: 2 },
      { tournament: "US Open", titles: 1 },
    ],

    timeline: [
      {
        year: 2018,
        title: "Professional beginning",
        description:
          "Sinner began competing regularly on the professional circuit.",
        category: "career",
      },
      {
        year: 2019,
        title: "Next Gen champion",
        description:
          "He won the Next Generation ATP Finals in Milan.",
        category: "career",
      },
      {
        year: 2021,
        title: "Top-ten breakthrough",
        description:
          "Sinner established himself among the world’s leading players.",
        category: "ranking",
      },
      {
        year: 2023,
        title: "Davis Cup champion",
        description:
          "He led Italy to its first Davis Cup title since 1976.",
        category: "team",
      },
      {
        year: 2024,
        title: "First Grand Slam",
        description:
          "Sinner won the Australian Open after an extraordinary comeback.",
        category: "grand-slam",
      },
      {
        year: 2024,
        title: "World number one",
        description:
          "He became the first Italian singles player to reach number one.",
        category: "ranking",
      },
      {
        year: 2024,
        title: "US Open champion",
        description:
          "Sinner captured his second Grand Slam title in New York.",
        category: "grand-slam",
      },
      {
        year: 2025,
        title: "Wimbledon champion",
        description:
          "He lifted his first Wimbledon trophy and added a fourth major title.",
        category: "grand-slam",
      },
      {
        year: 2026,
        title: "Wimbledon title defence",
        description:
          "Sinner successfully defended Wimbledon to win his fifth Grand Slam title.",
        category: "grand-slam",
      },
      {
        year: 2026,
        title: "Top ten for weeks at No. 1",
        description:
          "He reached 81 total weeks at world number one and entered the all-time top ten.",
        category: "ranking",
      },
    ],
  },

  {
    id: "alcaraz",
    slug: "alcaraz",

    name: "Carlos Alcaraz",
    nickname: "The Future in Motion",

    firstName: "Carlos",
    lastName: "Alcaraz",
    initials: "CA",

    country: "Spain",
    countryCode: "ES",

    born: "5 May 2003",
    birthplace: "El Palmar, Spain",
    turnedPro: 2018,

    playingHand: "Right-handed",
    backhand: "Two-handed",

    /*
     * Official ATP figures checked on 22 July 2026.
     */
    careerTitles: 26,
    grandSlamTitles: 7,
    highestRanking: 1,
    weeksAtNumberOne: 66,

    status: "active",

    biography:
      "Carlos Alcaraz combines explosive athleticism, creativity and fearless attacking tennis. His rapid ascent developed into a historic seven-major career and made him the youngest man to complete the Career Grand Slam.",

    museumDescription:
      "Explore collectible apparel connected to Carlos Alcaraz’s rise to world number one, seven Grand Slam victories and dynamic modern playing identity.",

    signature:
      "Explosive movement, fearless creativity and a new era of tennis.",

    image: "/players/alcaraz.jpg",
    heroImage: "/players/alcaraz.jpg",
    portraitImage: "/players/alcaraz.jpg",
    cardImage: "/players/alcaraz.jpg",

    theme: {
      accent: "#FFD54A",
      secondary: "#2C2208",
      glow: "#FFD54A",
      gradientFrom: "#171208",
      gradientTo: "#030711",
    },

    trophies: [
      { tournament: "Australian Open", titles: 1 },
      { tournament: "Roland Garros", titles: 2 },
      { tournament: "Wimbledon", titles: 2 },
      { tournament: "US Open", titles: 2 },
    ],

    timeline: [
      {
        year: 2018,
        title: "Professional debut",
        description:
          "Alcaraz began his professional tennis career.",
        category: "career",
      },
      {
        year: 2021,
        title: "First ATP title",
        description:
          "He won his first tour-level championship in Umag.",
        category: "career",
      },
      {
        year: 2022,
        title: "US Open champion",
        description:
          "Alcaraz captured his first Grand Slam title in New York.",
        category: "grand-slam",
      },
      {
        year: 2022,
        title: "Youngest world number one",
        description:
          "He became the youngest ATP world number one in history.",
        category: "ranking",
      },
      {
        year: 2023,
        title: "Wimbledon champion",
        description:
          "Alcaraz defeated Djokovic in a five-set Centre Court final.",
        category: "grand-slam",
      },
      {
        year: 2024,
        title: "Roland Garros champion",
        description:
          "He won his first title on the clay of Paris.",
        category: "grand-slam",
      },
      {
        year: 2024,
        title: "Wimbledon title defence",
        description:
          "Alcaraz successfully defended his Wimbledon championship.",
        category: "grand-slam",
      },
      {
        year: 2025,
        title: "Second Roland Garros crown",
        description:
          "He won a second consecutive title in Paris.",
        category: "grand-slam",
      },
      {
        year: 2025,
        title: "Second US Open title",
        description:
          "Alcaraz returned to the summit in New York and claimed his sixth major.",
        category: "grand-slam",
      },
      {
        year: 2026,
        title: "Career Grand Slam",
        description:
          "Victory at the Australian Open made him the youngest man to complete the Career Grand Slam.",
        category: "legacy",
      },
      {
        year: 2026,
        title: "Twenty-sixth tour title",
        description:
          "Alcaraz won in Doha to lift the twenty-sixth tour-level trophy of his career.",
        category: "career",
      },
    ],
  },
];

export function getPlayerBySlug(
  slug: string
): PlayerProfile | undefined {
  return players.find((player) => player.slug === slug);
}

export function getPlayerName(
  slugOrName: string
): string {
  const normalizedValue = slugOrName
    .trim()
    .toLowerCase();

  const player = players.find(
    (currentPlayer) =>
      currentPlayer.slug === normalizedValue ||
      currentPlayer.name.toLowerCase() === normalizedValue ||
      currentPlayer.lastName.toLowerCase() === normalizedValue
  );

  return player?.name ?? slugOrName;
}

export function getPlayerSlug(
  slugOrName: string
): PlayerSlug | undefined {
  const normalizedValue = slugOrName
    .trim()
    .toLowerCase();

  return players.find(
    (player) =>
      player.slug === normalizedValue ||
      player.name.toLowerCase() === normalizedValue ||
      player.lastName.toLowerCase() === normalizedValue
  )?.slug;
}

export function productMatchesPlayer(
  product: {
    player?: string | null;
    title?: string | null;
    collection?: string | null;
  },
  player: PlayerProfile
): boolean {
  const searchableText = [
    product.player,
    product.title,
    product.collection,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return [
    player.slug,
    player.name,
    player.firstName,
    player.lastName,
  ].some((value) =>
    searchableText.includes(value.toLowerCase())
  );
}