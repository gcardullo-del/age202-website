export type MuseumStatistic = {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  description: string;
};

export const museumStatistics: MuseumStatistic[] = [
  {
    value: 20,
    suffix: "+",
    label: "Archive Pieces",
    description:
      "Collectible garments preserved inside the AGE202 digital archive.",
  },
  {
    value: 5,
    label: "Champions",
    description:
      "Five generations of tennis excellence represented through iconic apparel.",
  },
  {
    value: 4,
    label: "Grand Slams",
    description:
      "Historic pieces connected to the most prestigious stages in world tennis.",
  },
  {
    value: 100,
    suffix: "%",
    label: "Curated Collection",
    description:
      "Every archive piece is individually selected, documented and preserved.",
  },
];