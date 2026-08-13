import type {
  TournamentHistoryDataset,
  TournamentHistoryPlayerRef,
} from "../../tournament-history/types";

const player = (...slugCandidates: string[]): TournamentHistoryPlayerRef => ({
  slugCandidates,
});

const dataset = {
  tournamentSlug: "acapulco",

  tournament: {
    name: "Abierto Mexicano Telcel",
    shortName: "Acapulco",
    category: "ATP_500",
    surface: "HARD",
    city: "Acapulco",
    country: "Mexico",
    countryCode: "MEX",
    venue: "Arena GNP Seguros",
    foundedYear: 1993,
    description:
      "Acapulco combines night-session hard-court tennis, a spectacular Pacific setting and one of the strongest championship traditions on the ATP 500 calendar.",
    history:
      "Established in 1993, the Mexican Open began as a clay-court tournament before moving to hard courts in 2014. Thomas Muster dominated the opening era, while Rafael Nadal and David Ferrer later matched his record of four singles titles. The tournament's modern Acapulco identity has produced champions including Juan Martin del Potro, Alexander Zverev, Alex de Minaur, Tomas Machac and Flavio Cobolli.",
    active: true,
    metaTitle:
      "Acapulco ATP 500 | History, Legends & Recent Finals | AGE202",
    metaDescription:
      "Explore the Abierto Mexicano Telcel in Acapulco: tournament history, iconic moments, legends and the five most recent ATP 500 finals.",
  },

  iconicMoments: [
    {
      year: 1993,
      title: "Muster begins a dynasty",
      subtitle: "The first chapter of the Mexican Open",
      description:
        "Thomas Muster wins the inaugural edition and begins an extraordinary run of four consecutive titles that defines the tournament's first era.",
      featured: true,
      sortOrder: 10,
    },
    {
      year: 2005,
      title: "Nadal becomes the youngest champion",
      subtitle: "An 18-year-old announces himself in Mexico",
      description:
        "Rafael Nadal captures his first Acapulco title at 18, becoming the youngest singles champion in tournament history.",
      featured: true,
      sortOrder: 20,
    },
    {
      year: 2014,
      title: "A new hard-court era",
      subtitle: "Acapulco changes surface",
      description:
        "The tournament moves from clay to outdoor hard courts, beginning the modern chapter of the Mexican ATP 500.",
      sortOrder: 30,
    },
    {
      year: 2022,
      title: "Nadal completes the circle",
      subtitle: "Youngest and oldest champion",
      description:
        "Seventeen years after his first Acapulco crown, Nadal wins his fourth title and becomes the tournament's oldest singles champion at age 35.",
      featured: true,
      sortOrder: 40,
    },
    {
      year: 2026,
      title: "Cobolli makes Italian history",
      subtitle: "A first hard-court title",
      description:
        "Flavio Cobolli defeats Frances Tiafoe to become the first Italian singles champion in Acapulco and capture his first ATP Tour title on hard courts.",
      sortOrder: 50,
    },
  ],

  legends: [
    {
      player: player("rafael-nadal", "nadal"),
      name: "Rafael Nadal",
      country: "Spain",
      countryCode: "ESP",
      recordLabel: "Record four-time champion",
      quote:
        "Nadal won Acapulco in 2005, 2013, 2020 and 2022, becoming both the youngest and oldest singles champion in tournament history.",
      legend: true,
      featured: true,
      sortOrder: 10,
    },
    {
      name: "David Ferrer",
      country: "Spain",
      countryCode: "ESP",
      recordLabel: "Four titles · record 32 match wins",
      quote:
        "Ferrer won three consecutive clay-court titles from 2010 to 2012 and added a hard-court crown in 2015, while compiling the tournament record for match wins.",
      legend: true,
      featured: true,
      sortOrder: 20,
    },
    {
      name: "Thomas Muster",
      country: "Austria",
      countryCode: "AUT",
      recordLabel: "Four consecutive titles",
      quote:
        "Muster dominated the tournament's opening years, winning every edition from 1993 through 1996.",
      legend: true,
      featured: true,
      sortOrder: 30,
    },
    {
      name: "Nicolas Almagro",
      country: "Spain",
      countryCode: "ESP",
      recordLabel: "Back-to-back champion",
      quote:
        "Almagro captured consecutive Acapulco titles in 2008 and 2009 and reached three singles finals at the event.",
      legend: true,
      featured: false,
      sortOrder: 40,
    },
    {
      player: player("alex-de-minaur", "de-minaur"),
      name: "Alex de Minaur",
      country: "Australia",
      countryCode: "AUS",
      recordLabel: "Back-to-back hard-court champion",
      quote:
        "De Minaur won consecutive titles in 2023 and 2024, becoming the first player to defend the Acapulco crown after the switch to hard courts.",
      legend: true,
      featured: false,
      sortOrder: 50,
    },
    {
      name: "Carlos Moya",
      country: "Spain",
      countryCode: "ESP",
      recordLabel: "Two-time champion",
      quote:
        "Moya won the Mexican Open in 2002 and 2004 and became one of the defining champions of its early Acapulco clay-court era.",
      legend: true,
      featured: false,
      sortOrder: 60,
    },
  ],

  editions: [
    { year: 1993, championName: "Thomas Muster", championCountryCode: "AUT" },
    { year: 1994, championName: "Thomas Muster", championCountryCode: "AUT" },
    { year: 1995, championName: "Thomas Muster", championCountryCode: "AUT" },
    { year: 1996, championName: "Thomas Muster", championCountryCode: "AUT" },
    { year: 1997, championName: "Francisco Clavet", championCountryCode: "ESP" },
    { year: 1998, championName: "Jiri Novak", championCountryCode: "CZE" },
    { year: 1999, cancelled: true },
    { year: 2000, championName: "Juan Ignacio Chela", championCountryCode: "ARG" },
    { year: 2001, championName: "Gustavo Kuerten", championCountryCode: "BRA" },
    { year: 2002, championName: "Carlos Moya", championCountryCode: "ESP" },
    { year: 2003, championName: "Agustin Calleri", championCountryCode: "ARG" },
    { year: 2004, championName: "Carlos Moya", championCountryCode: "ESP" },
    {
      year: 2005,
      championName: "Rafael Nadal",
      championCountryCode: "ESP",
      championPlayer: player("rafael-nadal", "nadal"),
    },
    { year: 2006, championName: "Luis Horna", championCountryCode: "PER" },
    { year: 2007, championName: "Juan Ignacio Chela", championCountryCode: "ARG" },
    { year: 2008, championName: "Nicolas Almagro", championCountryCode: "ESP" },
    { year: 2009, championName: "Nicolas Almagro", championCountryCode: "ESP" },
    { year: 2010, championName: "David Ferrer", championCountryCode: "ESP" },
    { year: 2011, championName: "David Ferrer", championCountryCode: "ESP" },
    { year: 2012, championName: "David Ferrer", championCountryCode: "ESP" },
    {
      year: 2013,
      championName: "Rafael Nadal",
      championCountryCode: "ESP",
      championPlayer: player("rafael-nadal", "nadal"),
    },
    { year: 2014, championName: "Grigor Dimitrov", championCountryCode: "BUL" },
    { year: 2015, championName: "David Ferrer", championCountryCode: "ESP" },
    { year: 2016, championName: "Dominic Thiem", championCountryCode: "AUT" },
    { year: 2017, championName: "Sam Querrey", championCountryCode: "USA" },
    { year: 2018, championName: "Juan Martin del Potro", championCountryCode: "ARG" },
    { year: 2019, championName: "Nick Kyrgios", championCountryCode: "AUS" },
    {
      year: 2020,
      championName: "Rafael Nadal",
      championCountryCode: "ESP",
      championPlayer: player("rafael-nadal", "nadal"),
    },
    { year: 2021, championName: "Alexander Zverev", championCountryCode: "GER" },
    {
      year: 2022,
      championName: "Rafael Nadal",
      runnerUpName: "Cameron Norrie",
      championCountryCode: "ESP",
      runnerUpCountryCode: "GBR",
      championPlayer: player("rafael-nadal", "nadal"),
      score: "6-4, 6-4",
    },
    {
      year: 2023,
      championName: "Alex de Minaur",
      runnerUpName: "Tommy Paul",
      championCountryCode: "AUS",
      runnerUpCountryCode: "USA",
      championPlayer: player("alex-de-minaur", "de-minaur"),
      score: "3-6, 6-4, 6-1",
    },
    {
      year: 2024,
      championName: "Alex de Minaur",
      runnerUpName: "Casper Ruud",
      championCountryCode: "AUS",
      runnerUpCountryCode: "NOR",
      championPlayer: player("alex-de-minaur", "de-minaur"),
      score: "6-4, 6-4",
    },
    {
      year: 2025,
      championName: "Tomas Machac",
      runnerUpName: "Alejandro Davidovich Fokina",
      championCountryCode: "CZE",
      runnerUpCountryCode: "ESP",
      score: "7-6(6), 6-2",
    },
    {
      year: 2026,
      championName: "Flavio Cobolli",
      runnerUpName: "Frances Tiafoe",
      championCountryCode: "ITA",
      runnerUpCountryCode: "USA",
      score: "7-6(4), 6-4",
    },
  ],
} satisfies TournamentHistoryDataset;

export default dataset;