export type GrandSlamSlug =
  | "australian-open"
  | "roland-garros"
  | "wimbledon"
  | "us-open";

export type GrandSlam = {
  slug: GrandSlamSlug;
  name: string;
  shortName: string;
  city: string;
  country: string;
  surface: string;
  season: string;
  description: string;
  archiveDescription: string;
  keywords: string[];
};

export const grandSlams: GrandSlam[] = [
  {
    slug: "australian-open",
    name: "Australian Open",
    shortName: "AO",
    city: "Melbourne",
    country: "Australia",
    surface: "Hard court",
    season: "January",
    description:
      "The opening Grand Slam of the tennis season, played beneath the intense Melbourne summer.",
    archiveDescription:
      "Explore collectible apparel connected to the Australian Open and its most memorable champions.",
    keywords: [
      "australian open",
      "melbourne",
      "ao",
    ],
  },
  {
    slug: "roland-garros",
    name: "Roland Garros",
    shortName: "RG",
    city: "Paris",
    country: "France",
    surface: "Clay",
    season: "May — June",
    description:
      "The legendary Parisian championship played on the red clay of Roland Garros.",
    archiveDescription:
      "Discover garments linked to historic clay-court campaigns and iconic moments in Paris.",
    keywords: [
      "roland garros",
      "french open",
      "paris",
    ],
  },
  {
    slug: "wimbledon",
    name: "Wimbledon",
    shortName: "W",
    city: "London",
    country: "United Kingdom",
    surface: "Grass",
    season: "June — July",
    description:
      "The oldest and most prestigious tennis championship, defined by tradition and grass courts.",
    archiveDescription:
      "Enter the AGE202 Wimbledon collection and explore apparel connected to Centre Court history.",
    keywords: [
      "wimbledon",
      "all england club",
      "london",
    ],
  },
  {
    slug: "us-open",
    name: "US Open",
    shortName: "USO",
    city: "New York",
    country: "United States",
    surface: "Hard court",
    season: "August — September",
    description:
      "The electric final Grand Slam of the season, staged beneath the lights of New York.",
    archiveDescription:
      "Explore collectible garments connected to unforgettable US Open nights and champions.",
    keywords: [
      "us open",
      "u.s. open",
      "new york",
      "flushing meadows",
    ],
  },
];

export function getGrandSlamBySlug(
  slug: string
): GrandSlam | undefined {
  return grandSlams.find(
    (grandSlam) => grandSlam.slug === slug
  );
}

export function normalizeGrandSlamText(
  value?: string | null
) {
  return value?.trim().toLowerCase() ?? "";
}

export function productMatchesGrandSlam(
  product: {
    title?: string | null;
    tournament?: string | null;
    collection?: string | null;
  },
  grandSlam: GrandSlam
) {
  const searchableText = [
    product.title,
    product.tournament,
    product.collection,
  ]
    .map(normalizeGrandSlamText)
    .join(" ");

  return grandSlam.keywords.some((keyword) =>
    searchableText.includes(
      normalizeGrandSlamText(keyword)
    )
  );
}