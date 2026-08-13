import type {
  TournamentHistoryDataset,
  TournamentHistoryPlayerRef,
} from "../../tournament-history/types";

const player = (...slugCandidates: string[]): TournamentHistoryPlayerRef => ({
  slugCandidates,
});

const dataset = {
  tournamentSlug: "halle",

  tournament: {
    name: "Terra Wortmann Open",
    shortName: "Halle",
    category: "ATP_500",
    surface: "GRASS",
    city: "Halle",
    country: "Germany",
    countryCode: "GER",
    venue: "OWL Arena",
    foundedYear: 1993,
    description:
      "Halle is one of the defining grass-court tournaments of the ATP Tour, combining fast conditions, a distinctive German setting and an extraordinary championship legacy.",
    history:
      "Established in 1993, Halle became one of the central stops of the grass-court season and was upgraded to ATP 500 status in 2015. Roger Federer transformed the tournament record book with ten singles titles and 69 match wins. Later champions including Alexander Bublik and World No. 1 Jannik Sinner carried Halle into a new generation, while Frances Tiafoe became the first American singles champion in 2026.",
    active: true,
    metaTitle:
      "Halle ATP 500 | History, Legends & Recent Finals | AGE202",
    metaDescription:
      "Explore the Terra Wortmann Open in Halle: tournament history, iconic moments, legends and the five most recent ATP 500 finals.",
  },

  iconicMoments: [
    {
      year: 1993,
      title: "Grass-court history begins",
      subtitle: "Halle joins the ATP Tour",
      description:
        "The inaugural tournament establishes Halle as a new German destination during the short and prestigious grass-court season.",
      sortOrder: 10,
    },
    {
      year: 2003,
      title: "The Federer era begins",
      subtitle: "The first of ten titles",
      description:
        "Roger Federer wins Halle for the first time, beginning one of the most dominant player-tournament relationships in ATP history.",
      featured: true,
      sortOrder: 20,
    },
    {
      year: 2019,
      title: "Federer reaches ten",
      subtitle: "A unique tournament milestone",
      description:
        "Federer defeats David Goffin to capture his tenth Halle singles title and extend his tournament records for championships and match wins.",
      featured: true,
      sortOrder: 30,
    },
    {
      year: 2024,
      title: "Sinner wins as World No. 1",
      subtitle: "A first title at the top of the rankings",
      description:
        "Jannik Sinner defeats Hubert Hurkacz in two tie-break sets to win Halle in his first tournament after becoming World No. 1.",
      featured: true,
      sortOrder: 40,
    },
    {
      year: 2026,
      title: "Tiafoe makes American history",
      subtitle: "The first American champion in Halle",
      description:
        "Frances Tiafoe defeats Taylor Fritz 6-4, 6-4 to claim the biggest title of his career and become Halle's first American singles champion.",
      sortOrder: 50,
    },
  ],

  legends: [
    {
      player: player("roger-federer", "federer"),
      name: "Roger Federer",
      country: "Switzerland",
      countryCode: "SUI",
      recordLabel: "Record ten-time champion",
      quote:
        "Federer's ten titles and 69 match wins make Halle one of the defining tournament relationships of his career.",
      legend: true,
      featured: true,
      sortOrder: 10,
    },
    {
      name: "Yevgeny Kafelnikov",
      country: "Russia",
      countryCode: "RUS",
      recordLabel: "Three-time champion",
      quote:
        "Kafelnikov won three Halle titles during the 1990s and became one of the tournament's first dominant champions.",
      legend: true,
      featured: true,
      sortOrder: 20,
    },
    {
      name: "Tommy Haas",
      country: "Germany",
      countryCode: "GER",
      recordLabel: "Two-time home champion",
      quote:
        "Haas won Halle in 2009 and again in 2012, giving the home crowd two memorable championship runs.",
      legend: true,
      featured: false,
      sortOrder: 30,
    },
    {
      name: "Alexander Bublik",
      country: "Kazakhstan",
      countryCode: "KAZ",
      recordLabel: "Two-time champion",
      quote:
        "Bublik captured Halle in 2023 and 2025, establishing himself as one of the tournament's leading modern grass-court champions.",
      legend: true,
      featured: true,
      sortOrder: 40,
    },
    {
      player: player("jannik-sinner", "sinner"),
      name: "Jannik Sinner",
      country: "Italy",
      countryCode: "ITA",
      recordLabel: "2024 champion",
      quote:
        "Sinner won Halle in 2024 while ranked World No. 1, defeating Hubert Hurkacz in a final decided by two tie-breaks.",
      legend: true,
      featured: true,
      sortOrder: 50,
    },
    {
      name: "Florian Mayer",
      country: "Germany",
      countryCode: "GER",
      recordLabel: "2016 champion",
      quote:
        "Mayer produced one of Halle's great underdog runs in 2016, winning the title as World No. 192 and becoming the tournament's lowest-ranked champion.",
      legend: true,
      featured: false,
      sortOrder: 60,
    },
  ],

  editions: [
    { year: 1993, championName: "Henri Leconte", championCountryCode: "FRA" },
    { year: 1994, championName: "Michael Stich", championCountryCode: "GER" },
    { year: 1995, championName: "Yevgeny Kafelnikov", championCountryCode: "RUS" },
    { year: 1996, championName: "Nicklas Kulti", championCountryCode: "SWE" },
    { year: 1997, championName: "Yevgeny Kafelnikov", championCountryCode: "RUS" },
    { year: 1998, championName: "Yevgeny Kafelnikov", championCountryCode: "RUS" },
    { year: 1999, championName: "Nicolas Kiefer", championCountryCode: "GER" },
    { year: 2000, championName: "David Prinosil", championCountryCode: "GER" },
    { year: 2001, championName: "Thomas Johansson", championCountryCode: "SWE" },
    { year: 2002, championName: "Yevgeny Kafelnikov", championCountryCode: "RUS" },
    {
      year: 2003,
      championName: "Roger Federer",
      championCountryCode: "SUI",
      championPlayer: player("roger-federer", "federer"),
    },
    {
      year: 2004,
      championName: "Roger Federer",
      championCountryCode: "SUI",
      championPlayer: player("roger-federer", "federer"),
    },
    {
      year: 2005,
      championName: "Roger Federer",
      championCountryCode: "SUI",
      championPlayer: player("roger-federer", "federer"),
    },
    {
      year: 2006,
      championName: "Roger Federer",
      championCountryCode: "SUI",
      championPlayer: player("roger-federer", "federer"),
    },
    { year: 2007, championName: "Tomas Berdych", championCountryCode: "CZE" },
    {
      year: 2008,
      championName: "Roger Federer",
      championCountryCode: "SUI",
      championPlayer: player("roger-federer", "federer"),
    },
    { year: 2009, championName: "Tommy Haas", championCountryCode: "GER" },
    { year: 2010, championName: "Lleyton Hewitt", championCountryCode: "AUS" },
    { year: 2011, championName: "Philipp Kohlschreiber", championCountryCode: "GER" },
    { year: 2012, championName: "Tommy Haas", championCountryCode: "GER" },
    {
      year: 2013,
      championName: "Roger Federer",
      championCountryCode: "SUI",
      championPlayer: player("roger-federer", "federer"),
    },
    {
      year: 2014,
      championName: "Roger Federer",
      championCountryCode: "SUI",
      championPlayer: player("roger-federer", "federer"),
    },
    {
      year: 2015,
      championName: "Roger Federer",
      championCountryCode: "SUI",
      championPlayer: player("roger-federer", "federer"),
    },
    { year: 2016, championName: "Florian Mayer", championCountryCode: "GER" },
    {
      year: 2017,
      championName: "Roger Federer",
      championCountryCode: "SUI",
      championPlayer: player("roger-federer", "federer"),
    },
    { year: 2018, championName: "Borna Coric", championCountryCode: "CRO" },
    {
      year: 2019,
      championName: "Roger Federer",
      championCountryCode: "SUI",
      championPlayer: player("roger-federer", "federer"),
    },
    { year: 2020, cancelled: true },
    { year: 2021, championName: "Ugo Humbert", championCountryCode: "FRA" },
    {
      year: 2022,
      championName: "Hubert Hurkacz",
      runnerUpName: "Daniil Medvedev",
      championCountryCode: "POL",
      runnerUpCountryCode: "RUS",
      runnerUpPlayer: player("daniil-medvedev", "medvedev"),
      score: "6-1, 6-4",
    },
    {
      year: 2023,
      championName: "Alexander Bublik",
      runnerUpName: "Andrey Rublev",
      championCountryCode: "KAZ",
      runnerUpCountryCode: "RUS",
      runnerUpPlayer: player("andrey-rublev", "rublev"),
      score: "6-3, 3-6, 6-3",
    },
    {
      year: 2024,
      championName: "Jannik Sinner",
      runnerUpName: "Hubert Hurkacz",
      championCountryCode: "ITA",
      runnerUpCountryCode: "POL",
      championPlayer: player("jannik-sinner", "sinner"),
      score: "7-6(8), 7-6(2)",
    },
    {
      year: 2025,
      championName: "Alexander Bublik",
      runnerUpName: "Daniil Medvedev",
      championCountryCode: "KAZ",
      runnerUpCountryCode: "RUS",
      runnerUpPlayer: player("daniil-medvedev", "medvedev"),
      score: "6-3, 7-6(4)",
    },
    {
      year: 2026,
      championName: "Frances Tiafoe",
      runnerUpName: "Taylor Fritz",
      championCountryCode: "USA",
      runnerUpCountryCode: "USA",
      score: "6-4, 6-4",
    },
  ],
} satisfies TournamentHistoryDataset;

export default dataset;