export type Masters1000FactIcon =
  | "category"
  | "location"
  | "venue"
  | "surface"
  | "founded"
  | "capacity"
  | "climate"
  | "signature";

export type Masters1000Fact = {
  label: string;
  value: string;
  detail: string;
  icon: Masters1000FactIcon;
  featured?: boolean;
};

export type Masters1000FactsData = {
  eyebrow: string;
  title: string;
  description: string;
  note?: string;
  facts: Masters1000Fact[];
};

const factsBySlug: Record<string, Masters1000FactsData> = {
  "indian-wells": {
    eyebrow: "Tournament Facts",

    title: "The Desert Masterpiece",

    description:
      "More than an ATP Masters 1000. Indian Wells is considered one of the most iconic venues in world tennis, where architecture, climate and atmosphere combine to create a unique experience for players and fans.",

    note:
      "Nicknamed the 'Fifth Grand Slam', Indian Wells has become one of the defining stops of every ATP season thanks to its world-class facilities and unforgettable setting.",

    facts: [
      {
        label: "Category",
        value: "ATP Masters 1000",
        detail:
          "One of the most prestigious tournaments in professional tennis, second only to the Grand Slams and ATP Finals.",
        icon: "category",
      },

      {
        label: "Venue",
        value: "Indian Wells Tennis Garden",
        detail:
          "Home to Stadium 1, one of the largest permanent tennis stadiums ever built, surrounded by gardens, palm trees and spectacular mountain views.",
        icon: "venue",
        featured: true,
      },

      {
        label: "Surface",
        value: "Outdoor Hard Court",
        detail:
          "The slow hard court rewards patience, consistency and tactical intelligence, producing some of the highest-quality rallies on tour.",
        icon: "surface",
        featured: true,
      },

      {
        label: "Location",
        value: "Indian Wells, California",
        detail:
          "Located in the Coachella Valley, the tournament offers one of the most scenic environments in professional sport.",
        icon: "location",
      },

      {
        label: "Founded",
        value: "1974",
        detail:
          "From modest beginnings to one of the biggest events in tennis, the tournament has evolved into a global landmark.",
        icon: "founded",
      },

      {
        label: "Capacity",
        value: "16,100",
        detail:
          "Stadium 1 is among the largest dedicated tennis arenas in the world.",
        icon: "capacity",
      },

      {
        label: "Climate",
        value: "Dry Desert Conditions",
        detail:
          "Warm sunshine, dry air and cooler evenings create playing conditions unlike any other stop on the ATP Tour.",
        icon: "climate",
      },

      {
        label: "Signature",
        value: "Sunshine Double",
        detail:
          "Together with Miami, Indian Wells forms the legendary Sunshine Double, one of the toughest and most prestigious achievements in tennis.",
        icon: "signature",
      },
    ],
  },
};

export function getMasters1000Facts(
  slug: string,
): Masters1000FactsData | null {
  return factsBySlug[slug] ?? null;
}