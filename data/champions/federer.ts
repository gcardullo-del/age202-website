import type { Champion } from "./types";

export const federer: Champion = {
  id: "roger-federer",
  slug: "federer",

  name: "Roger Federer",
  firstName: "Roger",
  lastName: "Federer",
  nickname: "The Maestro",

  nationality: "Switzerland",
  debutYear: 1998,

  mainBrand: "Nike",
  archivePieces: 20,

  description:
    "Elegance, precision and effortless movement defined an era of modern tennis style.",

  quote:
    "A visual language built around simplicity, refinement and timeless performance.",

  image: "/players/federer/hero.jpg",
  signatureImage: "/signatures/federer.svg",
  accent: "#C8FF00",

  trophies: {
    grandSlams: 20,
    atpTitles: 103,
    weeksAtNo1: 310,
    masters1000: 28,
    olympicGold: 1,
  },

  careerTimeline: [
    {
      year: 1998,
      title: "Professional Debut",
      description:
        "Roger Federer begins his professional career and enters the international tennis circuit.",
    },
    {
      year: 2003,
      title: "First Wimbledon Title",
      description:
        "Federer wins his first Grand Slam championship at Wimbledon.",
    },
    {
      year: 2004,
      title: "World No. 1",
      description:
        "He reaches the top of the ATP rankings and begins a historic period of dominance.",
    },
    {
      year: 2009,
      title: "Career Grand Slam",
      description:
        "Victory at Roland Garros completes his collection of all four major titles.",
    },
    {
      year: 2017,
      title: "Historic Comeback",
      description:
        "Federer returns from injury and wins the Australian Open in one of his most iconic victories.",
    },
    {
      year: 2018,
      title: "Twentieth Grand Slam",
      description:
        "He wins the Australian Open and reaches a record twenty major singles titles.",
    },
    {
      year: 2022,
      title: "Final Match",
      description:
        "Federer concludes his professional career at the Laver Cup in London.",
    },
  ],

  legacy:
    "Roger Federer transformed tennis into an expression of elegance, precision and timeless excellence. His influence extended far beyond trophies, shaping generations of players, redefining modern tennis style and becoming one of the most recognisable athletes in sporting history.",

  certificateId: "AGE-FED-001",
};