import type {
  TournamentHistoryDataset,
  TournamentHistoryPlayerRef,
} from "../../tournament-history/types";

const player = (...slugCandidates: string[]): TournamentHistoryPlayerRef => ({
  slugCandidates,
});

const dataset = {
  tournamentSlug: "basel",

  tournament: {
    name: "Swiss Indoors Basel",
    shortName: "Basel",
    category: "ATP_500",
    surface: "HARD",
    city: "Basel",
    country: "Switzerland",
    countryCode: "SUI",
    venue: "St. Jakobshalle",
    foundedYear: 1970,
    description:
      "Basel is one of the great indoor championships of the ATP Tour, combining more than five decades of tradition with a unique connection to Roger Federer and Swiss tennis history.",
    history:
      "Founded in 1970, the Swiss Indoors Basel grew from a modest indoor event into one of the leading tournaments of the European autumn. The championship moved to St. Jakobshalle in 1975 and later became part of the ATP 500 series. Its list of champions includes Bjorn Borg, Ivan Lendl, John McEnroe, Boris Becker, Pete Sampras, Novak Djokovic and many other major winners. No player is more closely associated with Basel than Roger Federer, who grew up in the region, served as a ball boy at the tournament and later won a record ten singles titles. In 2025, Brazilian teenager Joao Fonseca captured his first ATP 500 title at St. Jakobshalle.",
    active: true,
    metaTitle:
      "Basel ATP 500 | History, Legends & Recent Finals | AGE202",
    metaDescription:
      "Explore the Swiss Indoors Basel: tournament history, iconic moments, legends and the five most recent completed ATP 500 finals.",
  },

  iconicMoments: [
    {
      year: 1970,
      title: "Swiss Indoors begins",
      subtitle: "A new indoor championship is born",
      description:
        "The first Swiss Indoors is staged in Basel, beginning a tournament tradition that will grow into one of the leading indoor events on the ATP Tour.",
      sortOrder: 10,
    },
    {
      year: 1975,
      title: "St. Jakobshalle becomes home",
      subtitle: "The tournament enters its defining arena",
      description:
        "Swiss Indoors moves to St. Jakobshalle, establishing the venue that becomes inseparable from the tournament's modern identity.",
      sortOrder: 20,
    },
    {
      year: 2006,
      title: "Federer finally wins at home",
      subtitle: "From ball boy to Basel champion",
      description:
        "After two previous final defeats, Roger Federer captures his first hometown title and begins the most dominant championship reign in Basel history.",
      featured: true,
      sortOrder: 30,
    },
    {
      year: 2019,
      title: "Federer reaches ten",
      subtitle: "A record-extending hometown crown",
      description:
        "Federer defeats Alex de Minaur to win Basel for the tenth time, completing one of tennis's most remarkable player-tournament relationships.",
      featured: true,
      sortOrder: 40,
    },
    {
      year: 2025,
      title: "Fonseca's breakthrough",
      subtitle: "A teenage champion at St. Jakobshalle",
      description:
        "Joao Fonseca defeats Alejandro Davidovich Fokina 6-3, 6-4 to win his first ATP 500 title and become Basel's youngest champion since 1989.",
      featured: true,
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
        "Federer transformed his hometown tournament into one of the defining stages of his career, winning a record ten Basel singles titles.",
      legend: true,
      featured: true,
      sortOrder: 10,
    },
    {
      name: "Ivan Lendl",
      country: "Czechoslovakia",
      countryCode: "TCH",
      recordLabel: "Two-time champion",
      quote:
        "Lendl won Basel twice during the 1980s and belongs to the generation of World No. 1 champions who elevated the tournament's international stature.",
      legend: true,
      featured: false,
      sortOrder: 20,
    },
    {
      name: "Stefan Edberg",
      country: "Sweden",
      countryCode: "SWE",
      recordLabel: "Two-time champion",
      quote:
        "Edberg captured two Basel titles and brought his classic attacking indoor game to St. Jakobshalle.",
      legend: true,
      featured: false,
      sortOrder: 30,
    },
    {
      player: player("novak-djokovic", "djokovic"),
      name: "Novak Djokovic",
      country: "Serbia",
      countryCode: "SRB",
      recordLabel: "2009 champion",
      quote:
        "Djokovic defeated Federer in the 2009 final, becoming one of the few players to beat the hometown legend in a Basel championship match.",
      legend: true,
      featured: true,
      sortOrder: 40,
    },
    {
      name: "Felix Auger-Aliassime",
      country: "Canada",
      countryCode: "CAN",
      recordLabel: "Back-to-back champion",
      quote:
        "Auger-Aliassime won consecutive Basel titles in 2022 and 2023, establishing himself as one of the tournament's defining modern indoor champions.",
      legend: true,
      featured: true,
      sortOrder: 50,
    },
    {
      name: "Joao Fonseca",
      country: "Brazil",
      countryCode: "BRA",
      recordLabel: "2025 champion",
      quote:
        "Fonseca won his first ATP 500 title in Basel at age 19, becoming the tournament's youngest champion since 1989.",
      legend: true,
      featured: true,
      sortOrder: 60,
    },
  ],

  editions: [
    { year: 1970, championName: "Klaus Berger", championCountryCode: "FRG" },
    { year: 1971, championName: "Peter Pokorny", championCountryCode: "AUT" },
    { year: 1972, championName: "Jan Kodes", championCountryCode: "TCH" },
    { year: 1973, championName: "Ilie Nastase", championCountryCode: "ROU" },
    { year: 1974, championName: "Guillermo Vilas", championCountryCode: "ARG" },
    { year: 1975, championName: "Jiri Hrebec", championCountryCode: "TCH" },
    { year: 1976, championName: "Jan Kodes", championCountryCode: "TCH" },
    { year: 1977, championName: "Bjorn Borg", championCountryCode: "SWE" },
    { year: 1978, championName: "Guillermo Vilas", championCountryCode: "ARG" },
    { year: 1979, championName: "Brian Gottfried", championCountryCode: "USA" },
    { year: 1980, championName: "Ivan Lendl", championCountryCode: "TCH" },
    { year: 1981, championName: "Ivan Lendl", championCountryCode: "TCH" },
    { year: 1982, championName: "Yannick Noah", championCountryCode: "FRA" },
    { year: 1983, championName: "Vitas Gerulaitis", championCountryCode: "USA" },
    { year: 1984, championName: "Joakim Nystrom", championCountryCode: "SWE" },
    { year: 1985, championName: "Stefan Edberg", championCountryCode: "SWE" },
    { year: 1986, championName: "Stefan Edberg", championCountryCode: "SWE" },
    { year: 1987, championName: "Yannick Noah", championCountryCode: "FRA" },
    { year: 1988, championName: "Stefan Edberg", championCountryCode: "SWE" },
    { year: 1989, championName: "Jim Courier", championCountryCode: "USA" },
    { year: 1990, championName: "John McEnroe", championCountryCode: "USA" },
    { year: 1991, championName: "John McEnroe", championCountryCode: "USA" },
    { year: 1992, championName: "Boris Becker", championCountryCode: "GER" },
    { year: 1993, championName: "Michael Stich", championCountryCode: "GER" },
    { year: 1994, championName: "Wayne Ferreira", championCountryCode: "RSA" },
    { year: 1995, championName: "Jim Courier", championCountryCode: "USA" },
    { year: 1996, championName: "Pete Sampras", championCountryCode: "USA" },
    { year: 1997, championName: "Greg Rusedski", championCountryCode: "GBR" },
    { year: 1998, championName: "Tim Henman", championCountryCode: "GBR" },
    { year: 1999, championName: "Karol Kucera", championCountryCode: "SVK" },
    { year: 2000, championName: "Thomas Enqvist", championCountryCode: "SWE" },
    { year: 2001, championName: "Tim Henman", championCountryCode: "GBR" },
    { year: 2002, championName: "David Nalbandian", championCountryCode: "ARG" },
    { year: 2003, championName: "Guillermo Coria", championCountryCode: "ARG" },
    { year: 2004, championName: "Jiri Novak", championCountryCode: "CZE" },
    { year: 2005, championName: "Fernando Gonzalez", championCountryCode: "CHI" },
    {
      year: 2006,
      championName: "Roger Federer",
      championCountryCode: "SUI",
      championPlayer: player("roger-federer", "federer"),
    },
    {
      year: 2007,
      championName: "Roger Federer",
      championCountryCode: "SUI",
      championPlayer: player("roger-federer", "federer"),
    },
    {
      year: 2008,
      championName: "Roger Federer",
      championCountryCode: "SUI",
      championPlayer: player("roger-federer", "federer"),
    },
    {
      year: 2009,
      championName: "Novak Djokovic",
      championCountryCode: "SRB",
      championPlayer: player("novak-djokovic", "djokovic"),
    },
    {
      year: 2010,
      championName: "Roger Federer",
      championCountryCode: "SUI",
      championPlayer: player("roger-federer", "federer"),
    },
    {
      year: 2011,
      championName: "Roger Federer",
      championCountryCode: "SUI",
      championPlayer: player("roger-federer", "federer"),
    },
    { year: 2012, championName: "Juan Martin del Potro", championCountryCode: "ARG" },
    { year: 2013, championName: "Juan Martin del Potro", championCountryCode: "ARG" },
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
    {
      year: 2016,
      championName: "Marin Cilic",
      championCountryCode: "CRO",
    },
    {
      year: 2017,
      championName: "Roger Federer",
      championCountryCode: "SUI",
      championPlayer: player("roger-federer", "federer"),
    },
    {
      year: 2018,
      championName: "Roger Federer",
      championCountryCode: "SUI",
      championPlayer: player("roger-federer", "federer"),
    },
    {
      year: 2019,
      championName: "Roger Federer",
      championCountryCode: "SUI",
      championPlayer: player("roger-federer", "federer"),
    },
    { year: 2020, cancelled: true },
    { year: 2021, cancelled: true },
    {
      year: 2022,
      championName: "Felix Auger-Aliassime",
      runnerUpName: "Holger Rune",
      championCountryCode: "CAN",
      runnerUpCountryCode: "DEN",
      score: "6-3, 7-5",
    },
    {
      year: 2023,
      championName: "Felix Auger-Aliassime",
      runnerUpName: "Hubert Hurkacz",
      championCountryCode: "CAN",
      runnerUpCountryCode: "POL",
      score: "7-6(3), 7-6(5)",
    },
    {
      year: 2024,
      championName: "Giovanni Mpetshi Perricard",
      runnerUpName: "Ben Shelton",
      championCountryCode: "FRA",
      runnerUpCountryCode: "USA",
      runnerUpPlayer: player("ben-shelton", "shelton"),
      score: "6-4, 7-6(4)",
    },
    {
      year: 2025,
      championName: "Joao Fonseca",
      runnerUpName: "Alejandro Davidovich Fokina",
      championCountryCode: "BRA",
      runnerUpCountryCode: "ESP",
      score: "6-3, 6-4",
    },
  ],
} satisfies TournamentHistoryDataset;

export default dataset;