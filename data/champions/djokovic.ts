import type { Champion } from "./types";

export const djokovic: Champion = {
  id: "novak-djokovic",
  slug: "djokovic",

  name: "Novak Djokovic",
  firstName: "Novak",
  lastName: "Djokovic",
  nickname: "The Record Breaker",

  nationality: "Serbia",
  debutYear: 2003,

  mainBrand: "Lacoste",
  archivePieces: 24,

  description:
    "Precision, resilience and extraordinary adaptability created one of the most complete competitive identities in tennis history.",

  quote:
    "Every challenge is an opportunity to evolve, endure and reach a higher level.",

  image: "/players/djokovic/hero.jpg",

  signatureImage:
    "/signatures/djokovic.svg",

  accent: "#2C5CC5",

  trophies: {
    grandSlams: 24,
    atpTitles: 101,
    weeksAtNo1: 428,
    masters1000: 40,
    olympicGold: 1,
  },

  careerTimeline: [
    {
      year: 2003,
      title: "Professional Debut",
      description:
        "Djokovic begins his professional career and starts his rise from Belgrade to the highest level of international tennis.",
    },
    {
      year: 2008,
      title: "First Australian Open",
      description:
        "He wins his first Grand Slam championship in Melbourne and establishes himself among the leading players of his generation.",
    },
    {
      year: 2011,
      title: "World No. 1",
      description:
        "A historic season of dominance brings three Grand Slam titles and Djokovic's first rise to the top of the ATP rankings.",
    },
    {
      year: 2016,
      title: "Career Grand Slam",
      description:
        "Victory at Roland Garros completes his collection of all four major championships and confirms his mastery on every surface.",
    },
    {
      year: 2023,
      title: "Twenty-Fourth Grand Slam",
      description:
        "Djokovic wins the US Open to reach a record twenty-four major singles championships.",
    },
    {
      year: 2024,
      title: "Olympic Gold",
      description:
        "He triumphs in Paris to complete the Career Golden Slam and secure the major honour that had remained missing from his career.",
    },
    {
      year: 2025,
      title: "One Hundred Tour Titles",
      description:
        "Djokovic captures the Geneva title and becomes only the third man in the Open Era to win one hundred tour-level singles trophies.",
    },
  ],

  legacy:
    "Novak Djokovic transformed consistency, movement and mental resilience into a record-breaking competitive standard. His ability to adapt across every surface, overcome the strongest era of rivals and perform under extreme pressure made him one of the most complete and successful champions in tennis history.",

  certificateId: "AGE-DJO-001",
};