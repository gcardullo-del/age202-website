import type {
  TournamentHistoryDataset,
  TournamentHistoryPlayerRef,
} from "../../tournament-history/types";

const player = (...slugCandidates: string[]): TournamentHistoryPlayerRef => ({
  slugCandidates,
});

const dataset = {
  tournamentSlug: "rio",

  tournament: {
    name: "Rio Open",
    shortName: "Rio",
    category: "ATP_500",
    surface: "CLAY",
    city: "Rio de Janeiro",
    country: "Brazil",
    countryCode: "BRA",
    venue: "Jockey Club Brasileiro",
    foundedYear: 2014,
    description:
      "The Rio Open brings ATP 500 tennis to the clay courts of Rio de Janeiro, combining South American tennis culture with one of the Tour's most distinctive settings.",
    history:
      "First staged in 2014 at the Jockey Club Brasileiro, the Rio Open immediately established itself as a major stop on the South American clay swing. Rafael Nadal won the inaugural singles title, and the tournament has since welcomed champions including David Ferrer, Dominic Thiem, Carlos Alcaraz and Sebastian Baez. It remains the only ATP 500 tournament in South America.",
    active: true,
    metaTitle:
      "Rio Open ATP 500 | History, Legends & Recent Finals | AGE202",
    metaDescription:
      "Explore the Rio Open: tournament history, iconic moments, legends and the five most recent ATP 500 finals in Rio de Janeiro.",
  },

  iconicMoments: [
    {
      year: 2014,
      title: "Nadal opens the Rio story",
      subtitle: "World No. 1 becomes the inaugural champion",
      description:
        "Rafael Nadal wins the first Rio Open, giving the new Brazilian ATP 500 an immediate connection with one of clay-court tennis's defining champions.",
      featured: true,
      sortOrder: 10,
    },
    {
      year: 2019,
      title: "Djere's breakthrough",
      subtitle: "A first ATP title in Rio",
      description:
        "Laslo Djere captures his first ATP Tour title and becomes the lowest-ranked singles champion in tournament history.",
      sortOrder: 20,
    },
    {
      year: 2022,
      title: "Alcaraz becomes the youngest champion",
      subtitle: "A teenage statement on Brazilian clay",
      description:
        "Carlos Alcaraz defeats Diego Schwartzman to win Rio at 18, becoming the youngest singles champion in the tournament's history.",
      featured: true,
      sortOrder: 30,
    },
    {
      year: 2025,
      title: "Baez makes Rio history",
      subtitle: "The tournament's first two-time singles champion",
      description:
        "Sebastian Baez defeats Alexandre Muller to retain his crown and becomes the first player to win two Rio Open singles titles.",
      featured: true,
      sortOrder: 40,
    },
    {
      year: 2026,
      title: "Etcheverry finally breaks through",
      subtitle: "A marathon Sunday ends with a maiden ATP title",
      description:
        "Tomas Martin Etcheverry survives a demanding final day and defeats Alejandro Tabilo in three sets to capture the first ATP Tour title of his career.",
      sortOrder: 50,
    },
  ],

  legends: [
    {
      player: player("rafael-nadal", "nadal"),
      name: "Rafael Nadal",
      country: "Spain",
      countryCode: "ESP",
      recordLabel: "Inaugural champion",
      quote:
        "Nadal gave the Rio Open an iconic beginning by winning its first edition in 2014 while ranked World No. 1.",
      legend: true,
      featured: true,
      sortOrder: 10,
    },
    {
      player: player("carlos-alcaraz", "alcaraz"),
      name: "Carlos Alcaraz",
      country: "Spain",
      countryCode: "ESP",
      recordLabel: "Youngest champion",
      quote:
        "Alcaraz won the 2022 title at 18 and returned to the final in 2023, making Rio an important stage in his early rise.",
      legend: true,
      featured: true,
      sortOrder: 20,
    },
    {
      name: "Sebastian Baez",
      country: "Argentina",
      countryCode: "ARG",
      recordLabel: "Record two-time champion",
      quote:
        "Baez won consecutive titles in 2024 and 2025 to become the first two-time singles champion in Rio Open history.",
      legend: true,
      featured: true,
      sortOrder: 30,
    },
    {
      name: "David Ferrer",
      country: "Spain",
      countryCode: "ESP",
      recordLabel: "2015 champion",
      quote:
        "Ferrer followed Nadal onto the Rio honour roll and remains the tournament's oldest singles champion.",
      legend: true,
      featured: false,
      sortOrder: 40,
    },
    {
      name: "Diego Schwartzman",
      country: "Argentina",
      countryCode: "ARG",
      recordLabel: "2018 champion",
      quote:
        "Schwartzman lifted the trophy in 2018 and later returned to the championship match against Alcaraz in 2022.",
      legend: true,
      featured: false,
      sortOrder: 50,
    },
    {
  name: "Dominic Thiem",
  country: "Austria",
  countryCode: "AUT",
  recordLabel: "2017 champion",
  quote:
    "Thiem captured the 2017 Rio Open title, adding the Brazilian ATP 500 crown to the clay-court legacy of one of his generation's finest players on the surface.",
  legend: true,
  featured: false,
  sortOrder: 60,
},
  ],

  editions: [
    {
      year: 2014,
      championName: "Rafael Nadal",
      runnerUpName: "Alexandr Dolgopolov",
      championCountryCode: "ESP",
      runnerUpCountryCode: "UKR",
      championPlayer: player("rafael-nadal", "nadal"),
      score: "6-3, 7-6(3)",
    },
    {
      year: 2015,
      championName: "David Ferrer",
      runnerUpName: "Fabio Fognini",
      championCountryCode: "ESP",
      runnerUpCountryCode: "ITA",
      score: "6-2, 6-3",
    },
    {
      year: 2016,
      championName: "Pablo Cuevas",
      runnerUpName: "Guido Pella",
      championCountryCode: "URU",
      runnerUpCountryCode: "ARG",
      score: "6-4, 6-7(5), 6-4",
    },
    {
      year: 2017,
      championName: "Dominic Thiem",
      runnerUpName: "Pablo Carreno Busta",
      championCountryCode: "AUT",
      runnerUpCountryCode: "ESP",
      score: "7-5, 6-4",
    },
    {
      year: 2018,
      championName: "Diego Schwartzman",
      runnerUpName: "Fernando Verdasco",
      championCountryCode: "ARG",
      runnerUpCountryCode: "ESP",
      score: "6-2, 6-3",
    },
    {
      year: 2019,
      championName: "Laslo Djere",
      runnerUpName: "Felix Auger-Aliassime",
      championCountryCode: "SRB",
      runnerUpCountryCode: "CAN",
      runnerUpPlayer: player("felix-auger-aliassime", "auger-aliassime"),
      score: "6-3, 7-5",
    },
    {
      year: 2020,
      championName: "Cristian Garin",
      runnerUpName: "Gianluca Mager",
      championCountryCode: "CHI",
      runnerUpCountryCode: "ITA",
      score: "7-6(3), 7-5",
    },
    {
      year: 2021,
      cancelled: true,
    },
    {
      year: 2022,
      championName: "Carlos Alcaraz",
      runnerUpName: "Diego Schwartzman",
      championCountryCode: "ESP",
      runnerUpCountryCode: "ARG",
      championPlayer: player("carlos-alcaraz", "alcaraz"),
      score: "6-4, 6-2",
    },
    {
      year: 2023,
      championName: "Cameron Norrie",
      runnerUpName: "Carlos Alcaraz",
      championCountryCode: "GBR",
      runnerUpCountryCode: "ESP",
      runnerUpPlayer: player("carlos-alcaraz", "alcaraz"),
      score: "5-7, 6-4, 7-5",
    },
    {
      year: 2024,
      championName: "Sebastian Baez",
      runnerUpName: "Mariano Navone",
      championCountryCode: "ARG",
      runnerUpCountryCode: "ARG",
      score: "6-2, 6-1",
    },
    {
      year: 2025,
      championName: "Sebastian Baez",
      runnerUpName: "Alexandre Muller",
      championCountryCode: "ARG",
      runnerUpCountryCode: "FRA",
      score: "6-2, 6-3",
    },
    {
      year: 2026,
      championName: "Tomas Martin Etcheverry",
      runnerUpName: "Alejandro Tabilo",
      championCountryCode: "ARG",
      runnerUpCountryCode: "CHI",
      score: "3-6, 7-6(3), 6-4",
    },
  ],
} satisfies TournamentHistoryDataset;

export default dataset;