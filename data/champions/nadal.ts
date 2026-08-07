import type { Champion } from "./types";

export const nadal: Champion = {
  id: "rafael-nadal",
  slug: "nadal",

  name: "Rafael Nadal",
  firstName: "Rafael",
  lastName: "Nadal",
  nickname: "The King of Clay",

  nationality: "Spain",
  debutYear: 2001,

  mainBrand: "Nike",
  archivePieces: 18,

  description:
    "Intensity, resilience and unmistakable style shaped one of the most iconic identities in tennis history.",

  quote:
    "Every point deserves maximum effort. Every match deserves total commitment.",

  image: "/players/nadal/hero.jpg",

  signatureImage:
    "/signatures/nadal.svg",

  accent: "#C65A1E",

  trophies: {
    grandSlams: 22,
    atpTitles: 92,
    weeksAtNo1: 209,
    masters1000: 36,
    olympicGold: 2,
  },

  careerTimeline: [
    {
      year: 2001,
      title: "Professional Debut",
      description:
        "Nadal begins his professional career and quickly establishes himself as one of Spain's brightest young talents.",
    },
    {
      year: 2005,
      title: "First Roland Garros",
      description:
        "Wins Roland Garros on his first appearance, beginning an unprecedented era on clay.",
    },
    {
      year: 2008,
      title: "Wimbledon Champion",
      description:
        "Defeats Roger Federer in one of the greatest matches in tennis history.",
    },
    {
      year: 2010,
      title: "Career Grand Slam",
      description:
        "Captures the US Open to complete victories at all four Grand Slam tournaments.",
    },
    {
      year: 2013,
      title: "Historic Comeback",
      description:
        "Returns from injury to reclaim the World No. 1 ranking after one of the greatest comeback seasons ever.",
    },
    {
      year: 2022,
      title: "22nd Grand Slam",
      description:
        "Becomes the first man to reach twenty-two Grand Slam singles titles.",
    },
    {
      year: 2024,
      title: "Farewell Season",
      description:
        "Closes one of the most influential careers in the history of professional tennis.",
    },
  ],

  legacy:
    "Rafael Nadal redefined determination and competitive spirit. His dominance on clay, relentless work ethic and unmistakable identity made him one of the greatest champions and ambassadors the sport has ever known.",

  certificateId: "AGE-NAD-001",
};