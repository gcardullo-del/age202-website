export type MuseumQuote = {
  id: string;
  quote: string;
  category: string;
};

export const museumQuotes: MuseumQuote[] = [
  {
    id: "archive",
    quote:
      "Every garment preserves a match. Every match preserves a legend.",
    category: "The Archive",
  },
  {
    id: "collectible-culture",
    quote:
      "Tennis style becomes history when it carries the memory of an era.",
    category: "Collectible Culture",
  },
  {
    id: "legacy",
    quote:
      "The greatest champions are remembered not only for how they played, but for how they defined their time.",
    category: "Legacy",
  },
  {
    id: "age202-philosophy",
    quote:
      "Second hand does not mean second story. Every piece begins another chapter.",
    category: "AGE202 Philosophy",
  },
];