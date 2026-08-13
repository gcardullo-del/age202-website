import type {
  TournamentHistoryDataset,
  TournamentHistoryPlayerRef,
} from "../../tournament-history/types";

const player = (...slugCandidates: string[]): TournamentHistoryPlayerRef => ({
  slugCandidates,
});

const dataset = {
  tournamentSlug: "dubai",

  tournament: {
    name: "Dubai Duty Free Tennis Championships",
    shortName: "Dubai",
    category: "ATP_500",
    surface: "HARD",
    city: "Dubai",
    country: "United Arab Emirates",
    countryCode: "UAE",
    venue: "Dubai Duty Free Tennis Stadium",
    foundedYear: 1993,
    description:
      "Dubai combines elite outdoor hard-court tennis, a global field and one of the most polished tournament environments on the ATP Tour.",
    history:
      "Established in 1993, the Dubai Duty Free Tennis Championships quickly became one of the signature events of the Middle East. Its outdoor hard courts have hosted generations of major champions, with Roger Federer building a record eight-title legacy and Novak Djokovic winning five times. The tournament remains one of the defining ATP 500 stops of the early season.",
    active: true,
    metaTitle:
      "Dubai ATP 500 | History, Legends & Recent Finals | AGE202",
    metaDescription:
      "Explore the Dubai Duty Free Tennis Championships: tournament history, iconic moments, legends and the five most recent ATP 500 finals.",
  },

  iconicMoments: [
    {
      year: 1993,
      title: "Dubai joins the ATP Tour",
      subtitle: "Karel Novacek becomes the inaugural champion",
      description:
        "The first edition establishes Dubai as a new international tennis destination, with Karel Novacek lifting the inaugural singles trophy.",
      sortOrder: 10,
    },
    {
      year: 2003,
      title: "Federer's Dubai era begins",
      subtitle: "The first of a record eight titles",
      description:
        "Roger Federer wins Dubai for the first time, beginning the most successful singles reign in tournament history.",
      featured: true,
      sortOrder: 20,
    },
    {
      year: 2006,
      title: "Nadal ends Federer's hard-court streak",
      subtitle: "A teenage champion defeats the World No. 1",
      description:
        "Rafael Nadal defeats Roger Federer in the final and ends Federer's 56-match hard-court winning streak, creating one of Dubai's defining rivalry moments.",
      featured: true,
      sortOrder: 30,
    },
    {
      year: 2019,
      title: "Federer reaches 100",
      subtitle: "A century of tour-level titles",
      description:
        "Roger Federer defeats Stefanos Tsitsipas to win his eighth Dubai crown and become only the second man in the Open Era to reach 100 tour-level singles titles.",
      featured: true,
      sortOrder: 40,
    },
    {
      year: 2026,
      title: "Medvedev becomes a two-time champion",
      subtitle: "A second Dubai crown",
      description:
        "Daniil Medvedev claims his second Dubai title after Tallon Griekspoor withdraws before the final because of injury.",
      sortOrder: 50,
    },
  ],

  legends: [
    {
      player: player("roger-federer", "federer"),
      name: "Roger Federer",
      country: "Switzerland",
      countryCode: "SUI",
      recordLabel: "Record eight-time champion",
      quote:
        "Federer's eight titles and 53 match wins make him the defining singles champion in Dubai history.",
      legend: true,
      featured: true,
      sortOrder: 10,
    },
    {
      player: player("novak-djokovic", "djokovic"),
      name: "Novak Djokovic",
      country: "Serbia",
      countryCode: "SRB",
      recordLabel: "Five-time champion",
      quote:
        "Djokovic won five Dubai titles between 2009 and 2020, establishing one of the tournament's greatest championship records.",
      legend: true,
      featured: true,
      sortOrder: 20,
    },
    {
      player: player("rafael-nadal", "nadal"),
      name: "Rafael Nadal",
      country: "Spain",
      countryCode: "ESP",
      recordLabel: "Youngest champion",
      quote:
        "Nadal became Dubai's youngest singles champion in 2006 at age 19 after defeating Federer in a classic final.",
      legend: true,
      featured: true,
      sortOrder: 30,
    },
    {
      player: player("andy-murray", "murray"),
      name: "Andy Murray",
      country: "Great Britain",
      countryCode: "GBR",
      recordLabel: "2017 champion",
      quote:
        "Murray captured the 2017 Dubai title during his reign as World No. 1.",
      legend: true,
      featured: false,
      sortOrder: 40,
    },
    {
      player: player("stan-wawrinka", "wawrinka"),
      name: "Stan Wawrinka",
      country: "Switzerland",
      countryCode: "SUI",
      recordLabel: "2016 champion",
      quote:
        "Wawrinka lifted the Dubai trophy in 2016 and became part of the event's deep Swiss championship history.",
      legend: true,
      featured: false,
      sortOrder: 50,
    },
    {
      player: player("daniil-medvedev", "medvedev"),
      name: "Daniil Medvedev",
      country: "Russia",
      countryCode: "RUS",
      recordLabel: "Two-time champion",
      quote:
        "Medvedev won Dubai in 2023 and again in 2026, becoming one of the defining champions of the tournament's current era.",
      legend: true,
      featured: false,
      sortOrder: 60,
    },
  ],

  editions: [

    {
      year: 1993,
      championName: "Karel Novacek",
      championCountryCode: "CZE",
    },
    {
      year: 1994,
      championName: "Magnus Gustafsson",
      championCountryCode: "SWE",
    },
    {
      year: 1995,
      championName: "Wayne Ferreira",
      championCountryCode: "RSA",
    },
    {
      year: 1996,
      championName: "Goran Ivanisevic",
      championCountryCode: "CRO",
    },
    {
      year: 1997,
      championName: "Thomas Muster",
      championCountryCode: "AUT",
    },
    {
      year: 1998,
      championName: "Alex Corretja",
      championCountryCode: "ESP",
    },
    {
      year: 1999,
      championName: "Jerome Golmard",
      championCountryCode: "FRA",
    },
    {
      year: 2000,
      championName: "Nicolas Kiefer",
      championCountryCode: "GER",
    },
    {
      year: 2001,
      championName: "Juan Carlos Ferrero",
      championCountryCode: "ESP",
    },
    {
      year: 2002,
      championName: "Fabrice Santoro",
      championCountryCode: "FRA",
    },
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
      championName: "Rafael Nadal",
      championCountryCode: "ESP",
      championPlayer: player("rafael-nadal", "nadal"),
    },
    {
      year: 2007,
      championName: "Roger Federer",
      championCountryCode: "SUI",
      championPlayer: player("roger-federer", "federer"),
    },
    {
      year: 2008,
      championName: "Andy Roddick",
      championCountryCode: "USA",
    },
    {
      year: 2009,
      championName: "Novak Djokovic",
      championCountryCode: "SRB",
      championPlayer: player("novak-djokovic", "djokovic"),
    },
    {
      year: 2010,
      championName: "Novak Djokovic",
      championCountryCode: "SRB",
      championPlayer: player("novak-djokovic", "djokovic"),
    },
    {
      year: 2011,
      championName: "Novak Djokovic",
      championCountryCode: "SRB",
      championPlayer: player("novak-djokovic", "djokovic"),
    },
    {
      year: 2012,
      championName: "Roger Federer",
      championCountryCode: "SUI",
      championPlayer: player("roger-federer", "federer"),
    },
    {
      year: 2013,
      championName: "Novak Djokovic",
      championCountryCode: "SRB",
      championPlayer: player("novak-djokovic", "djokovic"),
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
    {
      year: 2016,
      championName: "Stan Wawrinka",
      championCountryCode: "SUI",
      championPlayer: player("stan-wawrinka", "wawrinka"),
    },
    {
      year: 2017,
      championName: "Andy Murray",
      championCountryCode: "GBR",
      championPlayer: player("andy-murray", "murray"),
    },
    {
      year: 2018,
      championName: "Roberto Bautista Agut",
      championCountryCode: "ESP",
    },
    {
      year: 2019,
      championName: "Roger Federer",
      championCountryCode: "SUI",
      championPlayer: player("roger-federer", "federer"),
    },
    {
      year: 2020,
      championName: "Novak Djokovic",
      championCountryCode: "SRB",
      championPlayer: player("novak-djokovic", "djokovic"),
    },
    {
      year: 2021,
      championName: "Aslan Karatsev",
      championCountryCode: "RUS",
    },
    {
      year: 2022,
      championName: "Andrey Rublev",
      championCountryCode: "RUS",
      championPlayer: player("andrey-rublev", "rublev"),
      runnerUpName: "Jiri Vesely",
      runnerUpCountryCode: "CZE",
      score: "6-3, 6-4",
    },
    {
      year: 2023,
      championName: "Daniil Medvedev",
      championCountryCode: "RUS",
      championPlayer: player("daniil-medvedev", "medvedev"),
      runnerUpName: "Andrey Rublev",
      runnerUpCountryCode: "RUS",
      runnerUpPlayer: player("andrey-rublev", "rublev"),
      score: "6-2, 6-2",
    },
    {
      year: 2024,
      championName: "Ugo Humbert",
      championCountryCode: "FRA",
      runnerUpName: "Alexander Bublik",
      runnerUpCountryCode: "KAZ",
      score: "6-4, 6-3",
    },
    {
      year: 2025,
      championName: "Stefanos Tsitsipas",
      championCountryCode: "GRE",
      championPlayer: player("stefanos-tsitsipas", "tsitsipas"),
      runnerUpName: "Felix Auger-Aliassime",
      runnerUpCountryCode: "CAN",
      runnerUpPlayer: player("felix-auger-aliassime", "auger-aliassime"),
      score: "6-3, 6-3",
    },
    {
      year: 2026,
      championName: "Daniil Medvedev",
      championCountryCode: "RUS",
      championPlayer: player("daniil-medvedev", "medvedev"),
      runnerUpName: "Tallon Griekspoor",
      runnerUpCountryCode: "NED",
      score: "W/O",
    },
  ],
} satisfies TournamentHistoryDataset;

export default dataset;