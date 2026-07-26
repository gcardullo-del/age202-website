import type { Champion } from "./types";

export const djokovic: Champion = {
  id: "novak-djokovic",
  slug: "djokovic",

  name: "Novak Djokovic",
  firstName: "Novak",
  lastName: "Djokovic",
  nickname: "The Complete Champion",

  nationality: "Serbia",
  debutYear: 2003,

  mainBrand: "Lacoste",
  archivePieces: 16,

  description:
    "Technical precision, extraordinary flexibility and relentless consistency define one of the greatest careers in tennis history.",

  quote:
    "Excellence is achieved through discipline, resilience and continuous evolution.",

  image: "/players/djokovic/hero.jpg",
  accent: "#4CB5F5",

  trophies: {
    grandSlams: 24,
    atpTitles: 100,
    weeksAtNo1: 428,
    masters1000: 40,
    olympicGold: 1,
  },

  careerTimeline: [
    {
      year: 2003,
      title: "Professional Debut",
      description:
        "Begins his professional career on the ATP Tour.",
    },
    {
      year: 2008,
      title: "First Grand Slam",
      description:
        "Wins the Australian Open, becoming Serbia's first men's Grand Slam champion.",
    },
    {
      year: 2011,
      title: "Historic Season",
      description:
        "Produces one of the greatest seasons ever, winning three Grand Slam titles and becoming World No.1.",
    },
    {
      year: 2016,
      title: "Career Grand Slam",
      description:
        "Captures Roland Garros and completes victories at all four major tournaments.",
    },
    {
      year: 2021,
      title: "20th Grand Slam",
      description:
        "Equals the all-time Grand Slam record with victories in Australia, Paris and Wimbledon.",
    },
    {
      year: 2023,
      title: "24 Grand Slam Titles",
      description:
        "Sets a new all-time record for Grand Slam singles championships.",
    },
    {
      year: 2024,
      title: "Olympic Gold",
      description:
        "Completes his career by winning the Olympic singles gold medal.",
    },
  ],

  legacy:
    "Novak Djokovic established new standards of physical preparation, mental resilience and consistency. His achievements across every surface make him one of the most accomplished players in tennis history.",

  certificateId: "AGE-DJO-001",
};