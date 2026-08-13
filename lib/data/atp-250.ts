


export type ATP250Surface = "HARD" | "CLAY" | "GRASS";

export type ATP250LatestFinal = {
  year: number;
  champion: string;
  runnerUp: string;
  score: string;
};

export type ATP250Leader = {
  names: string[];
  titles: number;
};

export type ATP250Tournament = {
  slug: string;
  name: string;
  country: string;
  countryCode: string;
  city: string;
  foundedYear: number;
  surface: ATP250Surface;
  shortHistory: string;
  leader: ATP250Leader;
  latestFinal: ATP250LatestFinal;
};

export const atp250Tournaments: ATP250Tournament[] = [
  {
    slug: "brisbane",
    name: "Brisbane International",
    country: "Australia",
    countryCode: "AUS",
    city: "Brisbane",
    foundedYear: 2009,
    surface: "HARD",
    shortHistory:
      "A leading Australian summer event and an important preparation stop before the Australian Open. Brisbane returned to the men's ATP calendar in 2024.",
    leader: {
      names: ["Andy Murray"],
      titles: 2,
    },
    latestFinal: {
      year: 2026,
      champion: "Daniil Medvedev",
      runnerUp: "Brandon Nakashima",
      score: "6-2, 7-6(1)",
    },
  },
  {
    slug: "hong-kong",
    name: "Hong Kong Tennis Open",
    country: "Hong Kong",
    countryCode: "HKG",
    city: "Hong Kong",
    foundedYear: 1973,
    surface: "HARD",
    shortHistory:
      "Hong Kong has a long history of international men's tennis. The ATP event returned to the Tour in 2024 and opens the season on outdoor hard courts.",
    leader: {
      names: ["Andrey Rublev", "Alexandre Muller", "Alexander Bublik"],
      titles: 1,
    },
    latestFinal: {
      year: 2026,
      champion: "Alexander Bublik",
      runnerUp: "Lorenzo Musetti",
      score: "7-6(2), 6-3",
    },
  },
  {
    slug: "adelaide",
    name: "Adelaide International",
    country: "Australia",
    countryCode: "AUS",
    city: "Adelaide",
    foundedYear: 2020,
    surface: "HARD",
    shortHistory:
      "Adelaide is one of the key Australian Open warm-up tournaments. Its outdoor hard courts regularly attract a strong field in the opening weeks of the season.",
    leader: {
      names: ["Andrey Rublev", "Gael Monfils", "Thanasi Kokkinakis", "Novak Djokovic", "Kwon Soonwoo", "Jiri Lehecka", "Felix Auger-Aliassime", "Tomas Machac"],
      titles: 1,
    },
    latestFinal: {
      year: 2026,
      champion: "Tomas Machac",
      runnerUp: "Ugo Humbert",
      score: "6-4, 6-4",
    },
  },
  {
    slug: "auckland",
    name: "ASB Classic",
    country: "New Zealand",
    countryCode: "NZL",
    city: "Auckland",
    foundedYear: 1956,
    surface: "HARD",
    shortHistory:
      "One of the longest-running tournaments in the Southern Hemisphere, Auckland has been a traditional January stop for generations of ATP players.",
    leader: {
      names: ["David Ferrer"],
      titles: 4,
    },
    latestFinal: {
      year: 2026,
      champion: "Jakub Mensik",
      runnerUp: "Sebastian Baez",
      score: "6-3, 7-6(7)",
    },
  },
  {
    slug: "montpellier",
    name: "Open Occitanie",
    country: "France",
    countryCode: "FRA",
    city: "Montpellier",
    foundedYear: 2010,
    surface: "HARD",
    shortHistory:
      "Montpellier is a modern French indoor tournament traditionally staged early in the season. French players have enjoyed considerable success at the event.",
    leader: {
      names: ["Richard Gasquet"],
      titles: 4,
    },
    latestFinal: {
      year: 2026,
      champion: "Felix Auger-Aliassime",
      runnerUp: "Aleksandar Kovacevic",
      score: "6-2, 6-7(7), 7-6(2)",
    },
  },
  {
    slug: "buenos-aires",
    name: "Argentina Open",
    country: "Argentina",
    countryCode: "ARG",
    city: "Buenos Aires",
    foundedYear: 1921,
    surface: "CLAY",
    shortHistory:
      "A historic South American clay-court championship and a cornerstone of the Latin American swing, Buenos Aires has crowned many of the game's finest clay specialists.",
    leader: {
      names: ["David Ferrer"],
      titles: 3,
    },
    latestFinal: {
      year: 2026,
      champion: "Francisco Cerundolo",
      runnerUp: "Luciano Darderi",
      score: "6-4, 6-2",
    },
  },
  {
    slug: "delray-beach",
    name: "Delray Beach Open",
    country: "United States",
    countryCode: "USA",
    city: "Delray Beach",
    foundedYear: 1993,
    surface: "HARD",
    shortHistory:
      "A long-established Florida hard-court event, Delray Beach has become a distinctive stop on the American ATP calendar with a strong tradition of home champions.",
    leader: {
      names: ["Taylor Fritz"],
      titles: 3,
    },
    latestFinal: {
      year: 2026,
      champion: "Miomir Kecmanovic",
      runnerUp: "Alejandro Davidovich Fokina",
      score: "3-6, 6-1, 7-5",
    },
  },
  {
    slug: "santiago",
    name: "Chile Open",
    country: "Chile",
    countryCode: "CHI",
    city: "Santiago",
    foundedYear: 1993,
    surface: "CLAY",
    shortHistory:
      "Santiago is Chile's principal ATP Tour event and forms part of the South American clay swing, continuing the country's strong tradition on red clay.",
    leader: {
      names: ["Fernando Gonzalez"],
      titles: 4,
    },
    latestFinal: {
      year: 2026,
      champion: "Tomas Martin Etcheverry",
      runnerUp: "Alejandro Tabilo",
      score: "3-6, 7-6(3), 6-4",
    },
  },
  {
    slug: "bucharest",
    name: "Tiriac Open",
    country: "Romania",
    countryCode: "ROU",
    city: "Bucharest",
    foundedYear: 1993,
    surface: "CLAY",
    shortHistory:
      "Romania's principal ATP tournament has a history stretching back to the 1990s. After an absence from the Tour, Bucharest returned to the calendar in 2024.",
    leader: {
      names: ["Gilles Simon"],
      titles: 3,
    },
    latestFinal: {
      year: 2026,
      champion: "Flavio Cobolli",
      runnerUp: "Sebastian Baez",
      score: "6-4, 6-4",
    },
  },
  {
    slug: "houston",
    name: "U.S. Men's Clay Court Championship",
    country: "United States",
    countryCode: "USA",
    city: "Houston",
    foundedYear: 1910,
    surface: "CLAY",
    shortHistory:
      "One of the oldest championships in American tennis, Houston is the only ATP Tour event in the United States played on clay.",
    leader: {
      names: ["Andy Roddick"],
      titles: 3,
    },
    latestFinal: {
      year: 2026,
      champion: "Jenson Brooksby",
      runnerUp: "Frances Tiafoe",
      score: "6-4, 6-2",
    },
  },
  {
    slug: "marrakech",
    name: "Grand Prix Hassan II",
    country: "Morocco",
    countryCode: "MAR",
    city: "Marrakech",
    foundedYear: 1984,
    surface: "CLAY",
    shortHistory:
      "Morocco's ATP Tour tournament is a long-standing clay-court event and the Tour's principal stop in Africa, moving to Marrakech after years in Casablanca.",
    leader: {
      names: ["Pablo Andujar"],
      titles: 3,
    },
    latestFinal: {
      year: 2026,
      champion: "Luciano Darderi",
      runnerUp: "Tallon Griekspoor",
      score: "7-6(3), 7-6(4)",
    },
  },
  {
    slug: "geneva",
    name: "Geneva Open",
    country: "Switzerland",
    countryCode: "SUI",
    city: "Geneva",
    foundedYear: 1980,
    surface: "CLAY",
    shortHistory:
      "Geneva is a traditional Swiss clay-court championship staged immediately before Roland Garros and returned to the ATP Tour calendar in 2015.",
    leader: {
      names: ["Casper Ruud"],
      titles: 3,
    },
    latestFinal: {
      year: 2026,
      champion: "Casper Ruud",
      runnerUp: "Hubert Hurkacz",
      score: "6-4, 7-6(4)",
    },
  },
  {
    slug: "stuttgart",
    name: "BOSS OPEN",
    country: "Germany",
    countryCode: "GER",
    city: "Stuttgart",
    foundedYear: 1916,
    surface: "GRASS",
    shortHistory:
      "A historic German championship, Stuttgart switched from clay to grass in 2015 and became an important opening stop of the modern grass-court season.",
    leader: {
      names: ["Rafael Nadal"],
      titles: 3,
    },
    latestFinal: {
      year: 2026,
      champion: "Taylor Fritz",
      runnerUp: "Alexander Zverev",
      score: "6-3, 7-6(0)",
    },
  },
  {
    slug: "s-hertogenbosch",
    name: "Libema Open",
    country: "Netherlands",
    countryCode: "NED",
    city: "'s-Hertogenbosch",
    foundedYear: 1990,
    surface: "GRASS",
    shortHistory:
      "The Netherlands' principal grass-court tournament has been a fixture of the pre-Wimbledon calendar since 1990 and is known for its fast outdoor courts.",
    leader: {
      names: ["Nicolas Mahut", "Patrick Rafter"],
      titles: 3,
    },
    latestFinal: {
      year: 2026,
      champion: "Gabriel Diallo",
      runnerUp: "Zizou Bergs",
      score: "7-5, 7-6(8)",
    },
  },
  {
    slug: "mallorca",
    name: "Mallorca Championships",
    country: "Spain",
    countryCode: "ESP",
    city: "Mallorca",
    foundedYear: 2021,
    surface: "GRASS",
    shortHistory:
      "A modern grass-court tournament staged in Mallorca immediately before Wimbledon, giving Spain a rare ATP Tour event on grass.",
    leader: {
      names: ["Christopher Eubanks", "Tallon Griekspoor", "Daniil Medvedev", "Alejandro Tabilo", "Stefanos Tsitsipas", "Alejandro Davidovich Fokina"],
      titles: 1,
    },
    latestFinal: {
      year: 2026,
      champion: "Tallon Griekspoor",
      runnerUp: "Corentin Moutet",
      score: "7-5, 7-6(3)",
    },
  },
  {
    slug: "eastbourne",
    name: "Eastbourne Open",
    country: "Great Britain",
    countryCode: "GBR",
    city: "Eastbourne",
    foundedYear: 2009,
    surface: "GRASS",
    shortHistory:
      "Played on the English south coast, Eastbourne is a traditional final preparation tournament before Wimbledon and is known for classic outdoor grass-court tennis.",
    leader: {
      names: ["Taylor Fritz"],
      titles: 4,
    },
    latestFinal: {
      year: 2026,
      champion: "Ugo Humbert",
      runnerUp: "Taylor Fritz",
      score: "7-5, 6-3",
    },
  },
  {
    slug: "bastad",
    name: "Nordea Open",
    country: "Sweden",
    countryCode: "SWE",
    city: "Bastad",
    foundedYear: 1948,
    surface: "CLAY",
    shortHistory:
      "Bastad is one of Scandinavia's most historic tennis events. Its intimate clay courts have hosted generations of Swedish and international champions.",
    leader: {
      names: ["Magnus Gustafsson"],
      titles: 4,
    },
    latestFinal: {
      year: 2026,
      champion: "Andrey Rublev",
      runnerUp: "Luciano Darderi",
      score: "6-3, 6-4",
    },
  },
  {
    slug: "gstaad",
    name: "Swiss Open Gstaad",
    country: "Switzerland",
    countryCode: "SUI",
    city: "Gstaad",
    foundedYear: 1915,
    surface: "CLAY",
    shortHistory:
      "Set in the Swiss Alps, Gstaad is among the oldest tournaments on the ATP calendar and one of the Tour's most distinctive high-altitude clay-court events.",
    leader: {
      names: ["Sergi Bruguera", "Alex Corretja"],
      titles: 3,
    },
    latestFinal: {
      year: 2026,
      champion: "Alexander Bublik",
      runnerUp: "Juan Manuel Cerundolo",
      score: "6-4, 6-2",
    },
  },
  {
    slug: "umag",
    name: "Croatia Open Umag",
    country: "Croatia",
    countryCode: "CRO",
    city: "Umag",
    foundedYear: 1990,
    surface: "CLAY",
    shortHistory:
      "Umag has been Croatia's signature ATP tournament since 1990, combining Mediterranean summer atmosphere with traditional European clay-court tennis.",
    leader: {
      names: ["Carlos Moya"],
      titles: 5,
    },
    latestFinal: {
      year: 2026,
      champion: "Carlos Taberner",
      runnerUp: "Luciano Darderi",
      score: "6-4, 6-4",
    },
  },
  {
    slug: "kitzbuhel",
    name: "Generali Open",
    country: "Austria",
    countryCode: "AUT",
    city: "Kitzbuhel",
    foundedYear: 1894,
    surface: "CLAY",
    shortHistory:
      "Kitzbuhel is one of the oldest tennis championships in Europe, famous for its Alpine setting and demanding high-altitude clay courts.",
    leader: {
      names: ["Guillermo Vilas"],
      titles: 4,
    },
    latestFinal: {
      year: 2026,
      champion: "Alexander Bublik",
      runnerUp: "Tomas Martin Etcheverry",
      score: "6-4, 6-3",
    },
  },
  {
    slug: "estoril",
    name: "Millennium Estoril Open",
    country: "Portugal",
    countryCode: "POR",
    city: "Estoril",
    foundedYear: 1990,
    surface: "CLAY",
    shortHistory:
      "Portugal's leading men's tournament has a long clay-court tradition. After a brief absence from the ATP Tour, Estoril returned to the main calendar in 2026.",
    leader: {
      names: ["Nicolas Almagro", "Sebastian Baez", "Pablo Carreno Busta", "Richard Gasquet", "Hubert Hurkacz", "Albert Ramos-Vinolas", "Casper Ruud", "Joao Sousa", "Stefanos Tsitsipas", "Andrey Rublev"],
      titles: 1,
    },
    latestFinal: {
      year: 2026,
      champion: "Andrey Rublev",
      runnerUp: "Alex Michelsen",
      score: "6-4, 6-3",
    },
  },
  {
    slug: "los-cabos",
    name: "Los Cabos Open",
    country: "Mexico",
    countryCode: "MEX",
    city: "Los Cabos",
    foundedYear: 2016,
    surface: "HARD",
    shortHistory:
      "Los Cabos joined the ATP Tour in 2016 and has developed into an important Mexican hard-court tournament with a distinctive resort setting.",
    leader: {
      names: ["Fabio Fognini", "Ivo Karlovic", "Daniil Medvedev", "Cameron Norrie", "Sam Querrey", "Diego Schwartzman", "Denis Shapovalov", "Jordan Thompson", "Stefanos Tsitsipas"],
      titles: 1,
    },
    latestFinal: {
      year: 2026,
      champion: "Denis Shapovalov",
      runnerUp: "Aleksandar Kovacevic",
      score: "6-4, 6-2",
    },
  },
  {
    slug: "winston-salem",
    name: "Winston-Salem Open",
    country: "United States",
    countryCode: "USA",
    city: "Winston-Salem",
    foundedYear: 2011,
    surface: "HARD",
    shortHistory:
      "Winston-Salem is the final ATP Tour stop before the US Open and has been a regular part of the North American hard-court summer since 2011.",
    leader: {
      names: ["John Isner"],
      titles: 2,
    },
    latestFinal: {
      year: 2025,
      champion: "Marton Fucsovics",
      runnerUp: "Botic van de Zandschulp",
      score: "6-3, 7-6(3)",
    },
  },
  {
    slug: "chengdu",
    name: "Chengdu Open",
    country: "China",
    countryCode: "CHN",
    city: "Chengdu",
    foundedYear: 2016,
    surface: "HARD",
    shortHistory:
      "Chengdu joined the ATP Tour in 2016 and forms part of the Asian hard-court swing, bringing tour-level tennis to one of western China's largest cities.",
    leader: {
      names: ["Karen Khachanov", "Denis Istomin", "Bernard Tomic", "Pablo Carreno Busta", "Alexander Zverev", "Juncheng Shang", "Alejandro Tabilo"],
      titles: 1,
    },
    latestFinal: {
      year: 2025,
      champion: "Alejandro Tabilo",
      runnerUp: "Lorenzo Musetti",
      score: "6-3, 2-6, 7-6(5)",
    },
  },
  {
    slug: "hangzhou",
    name: "Hangzhou Open",
    country: "China",
    countryCode: "CHN",
    city: "Hangzhou",
    foundedYear: 2024,
    surface: "HARD",
    shortHistory:
      "One of the newest tournaments on the ATP Tour, Hangzhou debuted in 2024 and is part of the expanding Asian hard-court swing.",
    leader: {
      names: ["Marin Cilic", "Alexander Bublik"],
      titles: 1,
    },
    latestFinal: {
      year: 2025,
      champion: "Alexander Bublik",
      runnerUp: "Valentin Royer",
      score: "7-6(4), 7-6(4)",
    },
  },
  {
    slug: "almaty",
    name: "Almaty Open",
    country: "Kazakhstan",
    countryCode: "KAZ",
    city: "Almaty",
    foundedYear: 2020,
    surface: "HARD",
    shortHistory:
      "Kazakhstan's ATP Tour event began in Astana in 2020 before moving to Almaty, becoming an established indoor stop during the European-Asian autumn swing.",
    leader: {
      names: ["John Millman", "Soonwoo Kwon", "Novak Djokovic", "Adrian Mannarino", "Karen Khachanov", "Daniil Medvedev"],
      titles: 1,
    },
    latestFinal: {
      year: 2025,
      champion: "Daniil Medvedev",
      runnerUp: "Corentin Moutet",
      score: "7-5, 4-6, 6-3",
    },
  },
  {
    slug: "brussels",
    name: "European Open",
    country: "Belgium",
    countryCode: "BEL",
    city: "Brussels",
    foundedYear: 2016,
    surface: "HARD",
    shortHistory:
      "Belgium's indoor ATP event began in Antwerp in 2016 and moved to Brussels in 2025, continuing its place in the late-season European indoor swing.",
    leader: {
      names: ["Richard Gasquet", "Jo-Wilfried Tsonga", "Kyle Edmund", "Andy Murray", "Ugo Humbert", "Felix Auger-Aliassime"],
      titles: 1,
    },
    latestFinal: {
      year: 2025,
      champion: "Felix Auger-Aliassime",
      runnerUp: "Jiri Lehecka",
      score: "7-6(2), 6-7(6), 6-2",
    },
  },
  {
    slug: "lyon",
    name: "Grand Prix Auvergne-Rhone-Alpes",
    country: "France",
    countryCode: "FRA",
    city: "Lyon",
    foundedYear: 1993,
    surface: "HARD",
    shortHistory:
      "From 2026 the former Marseille ATP 250 moves to Lyon and the LDLC Arena, continuing the lineage of one of France's established indoor tournaments.",
    leader: {
      names: ["Thomas Enqvist", "Marc Rosset"],
      titles: 2,
    },
    latestFinal: {
      year: 2025,
      champion: "Ugo Humbert",
      runnerUp: "Hamad Medjedovic",
      score: "7-6(4), 6-4",
    },
  },
  {
    slug: "stockholm",
    name: "BNP Paribas Nordic Open",
    country: "Sweden",
    countryCode: "SWE",
    city: "Stockholm",
    foundedYear: 1969,
    surface: "HARD",
    shortHistory:
      "Stockholm is one of the ATP Tour's classic indoor tournaments. Founded in 1969, it has crowned generations of Swedish stars and major international champions.",
    leader: {
      names: ["Boris Becker", "John McEnroe"],
      titles: 4,
    },
    latestFinal: {
      year: 2025,
      champion: "Casper Ruud",
      runnerUp: "Ugo Humbert",
      score: "6-2, 6-3",
    },
  },
];

export const ATP_250_TOURNAMENT_COUNT = atp250Tournaments.length;