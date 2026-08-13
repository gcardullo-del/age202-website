export type Atp500Surface =
  | "Hard"
  | "Clay"
  | "Grass";

export type Atp500Tournament = {
  slug: string;

  name: string;
  shortName: string;
  officialName: string;

  country: string;
  countryCode: string;
  city: string;
  venue: string;

  founded: number;
  surface: Atp500Surface;
  drawSize: number;

  introduction: string;
  history: string[];

  colors: {
    primary: string;
    secondary: string;
    glow: string;
  };

  heroImage?: string;
};

export const atp500Tournaments: readonly Atp500Tournament[] = [
  {
    slug: "dallas",
    name: "Dallas Open",
    shortName: "Dallas",
    officialName: "Dallas Open",
    country: "United States",
    countryCode: "USA",
    city: "Dallas",
    venue: "Ford Center at The Star",
    founded: 2022,
    surface: "Hard",
    drawSize: 32,
    introduction:
      "A modern indoor hard-court event in Texas, Dallas brings ATP 500 tennis to one of the fastest-growing sports markets in the United States.",
    history: [
      "The Dallas Open began in 2022 and quickly established itself as a major stop on the early-season American indoor calendar.",
      "Its elevation to ATP 500 status strengthened its place within the North American tournament landscape.",
    ],
    colors: {
      primary: "#55B7FF",
      secondary: "#102B49",
      glow: "rgba(85, 183, 255, 0.38)",
    },
  },
  {
    slug: "rotterdam",
    name: "ABN AMRO Open",
    shortName: "Rotterdam",
    officialName: "ABN AMRO Open",
    country: "Netherlands",
    countryCode: "NED",
    city: "Rotterdam",
    venue: "Rotterdam Ahoy",
    founded: 1974,
    surface: "Hard",
    drawSize: 32,
    introduction:
      "Rotterdam combines elite indoor hard-court tennis with one of the most recognisable tournament identities in Europe.",
    history: [
      "First staged in 1974, Rotterdam developed into one of the leading indoor tournaments in European tennis.",
      "The event became closely associated with Rotterdam Ahoy and a long list of champions from successive generations.",
    ],
    colors: {
      primary: "#45D7FF",
      secondary: "#0D2A39",
      glow: "rgba(69, 215, 255, 0.38)",
    },
  },
  {
    slug: "doha",
    name: "Qatar Open",
    shortName: "Doha",
    officialName: "Qatar ExxonMobil Open",
    country: "Qatar",
    countryCode: "QAT",
    city: "Doha",
    venue: "Khalifa International Tennis & Squash Complex",
    founded: 1993,
    surface: "Hard",
    drawSize: 32,
    introduction:
      "Doha brings fast outdoor hard-court tennis to the Gulf and has developed into a major international stop on the ATP calendar.",
    history: [
      "The tournament began in 1993 and built its identity around outdoor hard courts and strong fields at the start of the season.",
      "Its rise to ATP 500 level reflects Doha's long-term role in elite international tennis.",
    ],
    colors: {
      primary: "#A85A78",
      secondary: "#351826",
      glow: "rgba(168, 90, 120, 0.38)",
    },
  },
  {
    slug: "rio",
    name: "Rio Open",
    shortName: "Rio",
    officialName: "Rio Open presented by Claro",
    country: "Brazil",
    countryCode: "BRA",
    city: "Rio de Janeiro",
    venue: "Jockey Club Brasileiro",
    founded: 2014,
    surface: "Clay",
    drawSize: 32,
    introduction:
      "Rio is the ATP 500 showcase of South America, combining outdoor clay with the atmosphere of one of the world's most distinctive cities.",
    history: [
      "The Rio Open launched in 2014 and immediately became one of the largest men's tennis events in South America.",
      "Its clay-court identity and location at the Jockey Club Brasileiro give the tournament a character unlike any other ATP 500.",
    ],
    colors: {
      primary: "#F0A23A",
      secondary: "#44280D",
      glow: "rgba(240, 162, 58, 0.38)",
    },
  },
  {
    slug: "acapulco",
    name: "Abierto Mexicano de Tenis",
    shortName: "Acapulco",
    officialName:
      "Abierto Mexicano Telcel presentado por HSBC",
    country: "Mexico",
    countryCode: "MEX",
    city: "Acapulco",
    venue: "Arena GNP Seguros",
    founded: 1993,
    surface: "Hard",
    drawSize: 32,
    introduction:
      "Acapulco blends elite hard-court tennis, night sessions and a distinctive Mexican atmosphere into one of the Tour's most recognisable ATP 500 events.",
    history: [
      "The tournament began in 1993 and evolved from a clay-court event into a hard-court showcase.",
      "Its move to modern facilities strengthened Acapulco's place as one of the central ATP stops in Latin America.",
    ],
    colors: {
      primary: "#30D5C8",
      secondary: "#0E3836",
      glow: "rgba(48, 213, 200, 0.36)",
    },
  },
  {
    slug: "dubai",
    name: "Dubai Tennis Championships",
    shortName: "Dubai",
    officialName:
      "Dubai Duty Free Tennis Championships",
    country: "United Arab Emirates",
    countryCode: "UAE",
    city: "Dubai",
    venue: "Dubai Duty Free Tennis Stadium",
    founded: 1993,
    surface: "Hard",
    drawSize: 32,
    introduction:
      "Dubai combines premium hard-court tennis, a global field and one of the most polished tournament environments on the ATP Tour.",
    history: [
      "Established in 1993, Dubai quickly became one of the signature tournaments of the Middle East.",
      "Its outdoor hard courts and consistent attraction of leading players helped build a prestigious ATP 500 identity.",
    ],
    colors: {
      primary: "#D7B45A",
      secondary: "#40320E",
      glow: "rgba(215, 180, 90, 0.38)",
    },
  },
  {
    slug: "barcelona",
    name: "Barcelona Open",
    shortName: "Barcelona",
    officialName:
      "Barcelona Open Banc Sabadell",
    country: "Spain",
    countryCode: "ESP",
    city: "Barcelona",
    venue: "Real Club de Tenis Barcelona 1899",
    founded: 1953,
    surface: "Clay",
    drawSize: 32,
    introduction:
      "Barcelona is one of the great traditional clay-court tournaments, combining history, prestige and a deep connection with Spanish tennis.",
    history: [
      "Founded in 1953, Barcelona became one of Europe's most important clay-court championships.",
      "The tournament's home at Real Club de Tenis Barcelona 1899 and its long champion list give it a uniquely historic identity.",
    ],
    colors: {
      primary: "#E96E3A",
      secondary: "#431C0E",
      glow: "rgba(233, 110, 58, 0.38)",
    },
  },
  {
    slug: "munich",
    name: "BMW Open",
    shortName: "Munich",
    officialName:
      "BMW Open by Bitpanda",
    country: "Germany",
    countryCode: "GER",
    city: "Munich",
    venue: "MTTC Iphitos",
    founded: 1900,
    surface: "Clay",
    drawSize: 32,
    introduction:
      "Munich combines one of the oldest tournament traditions in Germany with a modern ATP 500 clay-court identity.",
    history: [
      "The tournament traces its roots to 1900, giving Munich one of the deepest histories on the ATP calendar.",
      "Its modern edition at MTTC Iphitos continues that tradition while bringing leading players to Bavaria each spring.",
    ],
    colors: {
      primary: "#7BA7FF",
      secondary: "#142A4C",
      glow: "rgba(123, 167, 255, 0.38)",
    },
  },
  {
    slug: "hamburg",
    name: "Hamburg Open",
    shortName: "Hamburg",
    officialName:
      "Bitpanda Hamburg Open",
    country: "Germany",
    countryCode: "GER",
    city: "Hamburg",
    venue: "Am Rothenbaum",
    founded: 1892,
    surface: "Clay",
    drawSize: 32,
    introduction:
      "Hamburg carries one of the oldest championship traditions in world tennis and remains a major clay-court stage in Germany.",
    history: [
      "First held in 1892, Hamburg is one of the longest-running tournaments in international tennis.",
      "Its home at Am Rothenbaum and long championship history give the event a historic status within the ATP 500 category.",
    ],
    colors: {
      primary: "#C86D52",
      secondary: "#3E1F18",
      glow: "rgba(200, 109, 82, 0.38)",
    },
  },
  {
    slug: "halle",
    name: "Terra Wortmann Open",
    shortName: "Halle",
    officialName:
      "Terra Wortmann Open",
    country: "Germany",
    countryCode: "GER",
    city: "Halle",
    venue: "OWL Arena",
    founded: 1993,
    surface: "Grass",
    drawSize: 32,
    introduction:
      "Halle is one of the leading grass-court tournaments in the world and a major stop in the short European grass season.",
    history: [
      "Founded in 1993, Halle quickly became one of the premier preparation events for Wimbledon.",
      "Its grass courts and retractable-roof centre court created a distinctive modern tournament identity.",
    ],
    colors: {
      primary: "#B7E35A",
      secondary: "#26380C",
      glow: "rgba(183, 227, 90, 0.36)",
    },
  },
  {
    slug: "queens",
    name: "HSBC Championships",
    shortName: "Queen's",
    officialName:
      "HSBC Championships",
    country: "Great Britain",
    countryCode: "GBR",
    city: "London",
    venue: "Queen's Club",
    founded: 1890,
    surface: "Grass",
    drawSize: 32,
    introduction:
      "Queen's is one of tennis's great grass-court institutions, combining London tradition with a central role in preparation for Wimbledon.",
    history: [
      "First staged in 1890, the Queen's Club tournament has one of the richest histories in British tennis.",
      "Its intimate grass courts and long list of champions have made it a defining event of the pre-Wimbledon season.",
    ],
    colors: {
      primary: "#8FE06A",
      secondary: "#1F3715",
      glow: "rgba(143, 224, 106, 0.36)",
    },
  },
  {
    slug: "washington",
    name: "Mubadala Citi DC Open",
    shortName: "Washington",
    officialName:
      "Mubadala Citi DC Open",
    country: "United States",
    countryCode: "USA",
    city: "Washington",
    venue: "William H.G. FitzGerald Tennis Center",
    founded: 1969,
    surface: "Hard",
    drawSize: 32,
    introduction:
      "Washington opens a major chapter of the North American hard-court summer with fast conditions and a distinctive capital-city setting.",
    history: [
      "Founded in 1969, Washington developed into one of the longest-standing professional tournaments in the United States.",
      "Its position at the start of the North American hard-court swing gives the event an important role each summer.",
    ],
    colors: {
      primary: "#F15D6F",
      secondary: "#43151D",
      glow: "rgba(241, 93, 111, 0.38)",
    },
  },
  {
    slug: "tokyo",
    name: "Japan Open",
    shortName: "Tokyo",
    officialName:
      "Kinoshita Group Japan Open Tennis Championships",
    country: "Japan",
    countryCode: "JPN",
    city: "Tokyo",
    venue: "Ariake Coliseum",
    founded: 1972,
    surface: "Hard",
    drawSize: 32,
    introduction:
      "Tokyo is one of Asia's longest-established ATP tournaments and a major hard-court event in the final phase of the season.",
    history: [
      "The Japan Open began in 1972 and became a central part of elite men's tennis in Asia.",
      "Its modern home at Ariake Coliseum provides one of the most recognisable tournament settings on the continent.",
    ],
    colors: {
      primary: "#FF5B6E",
      secondary: "#43131B",
      glow: "rgba(255, 91, 110, 0.38)",
    },
  },
  {
    slug: "beijing",
    name: "China Open",
    shortName: "Beijing",
    officialName:
      "China Open",
    country: "China",
    countryCode: "CHN",
    city: "Beijing",
    venue: "National Tennis Center",
    founded: 1993,
    surface: "Hard",
    drawSize: 32,
    introduction:
      "Beijing combines major hard-court tennis with one of the largest tournament complexes in Asia.",
    history: [
      "The China Open traces its origins to 1993 and developed into a major international tournament in Beijing.",
      "Its position within the Asian swing and the scale of the National Tennis Center give it a distinctive ATP 500 identity.",
    ],
    colors: {
      primary: "#E24B4B",
      secondary: "#401313",
      glow: "rgba(226, 75, 75, 0.38)",
    },
  },
  {
    slug: "basel",
    name: "Swiss Indoors Basel",
    shortName: "Basel",
    officialName:
      "Swiss Indoors Basel",
    country: "Switzerland",
    countryCode: "SUI",
    city: "Basel",
    venue: "St. Jakobshalle",
    founded: 1970,
    surface: "Hard",
    drawSize: 32,
    introduction:
      "Basel is a classic European indoor tournament with a rich champion list and one of the most recognisable late-season atmospheres on Tour.",
    history: [
      "Founded in 1970, the Swiss Indoors became one of the leading indoor tournaments in Europe.",
      "Its long association with St. Jakobshalle and Swiss tennis gives Basel a strong place in ATP history.",
    ],
    colors: {
      primary: "#E85F68",
      secondary: "#41171C",
      glow: "rgba(232, 95, 104, 0.38)",
    },
  },
  {
    slug: "vienna",
    name: "Erste Bank Open",
    shortName: "Vienna",
    officialName:
      "Erste Bank Open",
    country: "Austria",
    countryCode: "AUT",
    city: "Vienna",
    venue: "Wiener Stadthalle",
    founded: 1974,
    surface: "Hard",
    drawSize: 32,
    introduction:
      "Vienna is one of the most important indoor tournaments of the European autumn and a decisive stop in the race toward the season finale.",
    history: [
      "First held in 1974, Vienna developed into one of the strongest indoor events in Central Europe.",
      "The tournament's place late in the season often gives it major significance for ranking goals and ATP Finals qualification.",
    ],
    colors: {
      primary: "#C787FF",
      secondary: "#31194A",
      glow: "rgba(199, 135, 255, 0.38)",
    },
  },
];

export const ATP_500_SLUGS =
  atp500Tournaments.map(
    (tournament) =>
      tournament.slug,
  );

export function getAtp500Tournament(
  slug: string,
): Atp500Tournament | undefined {
  return atp500Tournaments.find(
    (tournament) =>
      tournament.slug === slug,
  );
}

export function getAtp500Href(
  slug: string,
): string {
  return `/results/atp-500/${slug}`;
}