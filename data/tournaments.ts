export type TournamentSlug =
  | "australian-open"
  | "roland-garros"
  | "wimbledon"
  | "us-open"
  | "atp-finals"
  | "masters-1000"
  | "olympic-games";

export type TournamentSurface =
  | "Hard"
  | "Clay"
  | "Grass"
  | "Indoor Hard"
  | "Variable";

export type TournamentCategory =
  | "Grand Slam"
  | "ATP Finals"
  | "Masters 1000"
  | "Olympic Event";

export type Tournament = {
  slug: TournamentSlug;
  name: string;
  shortName: string;
  city: string;
  country: string;
  countryCode: string;
  surface: TournamentSurface;
  category: TournamentCategory;
  image?: string;
  mapX?: number;
  mapY?: number;
  archiveHref: string;
  description: string;
  featured: boolean;
  order: number;
};

export const tournaments: Tournament[] = [
  {
    slug: "australian-open",
    name: "Australian Open",
    shortName: "AO",
    city: "Melbourne",
    country: "Australia",
    countryCode: "AU",
    surface: "Hard",
    category: "Grand Slam",
    image: "/tournaments/australian-open.jpg",
    mapX: 84,
    mapY: 77,
    archiveHref: "/archive?tournament=Australian%20Open",
    description:
      "The opening Grand Slam of the season, defined by electric colour, extreme conditions and night-session history.",
    featured: true,
    order: 1,
  },
  {
    slug: "roland-garros",
    name: "Roland Garros",
    shortName: "RG",
    city: "Paris",
    country: "France",
    countryCode: "FR",
    surface: "Clay",
    category: "Grand Slam",
    image: "/tournaments/roland-garros.jpg",
    mapX: 48,
    mapY: 36,
    archiveHref: "/archive?tournament=Roland%20Garros",
    description:
      "The defining clay-court championship, where movement, endurance and earth-toned design become part of the spectacle.",
    featured: true,
    order: 2,
  },
  {
    slug: "wimbledon",
    name: "Wimbledon",
    shortName: "WIM",
    city: "London",
    country: "United Kingdom",
    countryCode: "GB",
    surface: "Grass",
    category: "Grand Slam",
    image: "/tournaments/wimbledon.jpg",
    mapX: 45,
    mapY: 31,
    archiveHref: "/archive?tournament=Wimbledon",
    description:
      "Tennis tradition at its most recognizable, marked by grass courts, white apparel and timeless visual codes.",
    featured: true,
    order: 3,
  },
  {
    slug: "us-open",
    name: "US Open",
    shortName: "USO",
    city: "New York",
    country: "United States",
    countryCode: "US",
    surface: "Hard",
    category: "Grand Slam",
    image: "/tournaments/us-open.jpg",
    mapX: 24,
    mapY: 39,
    archiveHref: "/archive?tournament=US%20Open",
    description:
      "A night-driven championship where bold design, energy and the atmosphere of New York shape tennis history.",
    featured: true,
    order: 4,
  },
  {
    slug: "atp-finals",
    name: "ATP Finals",
    shortName: "ATP Finals",
    city: "Turin",
    country: "Italy",
    countryCode: "IT",
    surface: "Indoor Hard",
    category: "ATP Finals",
    image: "/tournaments/atp-finals.jpg",
    archiveHref: "/archive?tournament=ATP%20Finals",
    description:
      "The season-ending event reserved for the leading players of the year.",
    featured: false,
    order: 5,
  },
  {
    slug: "masters-1000",
    name: "ATP Masters 1000",
    shortName: "Masters",
    city: "International",
    country: "International",
    countryCode: "INT",
    surface: "Variable",
    category: "Masters 1000",
    archiveHref: "/archive?tournament=Masters",
    description:
      "The prestigious international series connecting the major stages of the professional tennis season.",
    featured: false,
    order: 6,
  },
  {
    slug: "olympic-games",
    name: "Olympic Games",
    shortName: "Olympics",
    city: "International",
    country: "International",
    countryCode: "INT",
    surface: "Variable",
    category: "Olympic Event",
    archiveHref: "/archive?tournament=Olympic%20Games",
    description:
      "National identity and tennis history meet in one of sport's most significant global events.",
    featured: false,
    order: 7,
  },
];

export const grandSlams = tournaments
  .filter((tournament) => tournament.category === "Grand Slam")
  .sort((a, b) => a.order - b.order);

export const featuredTournaments = tournaments
  .filter((tournament) => tournament.featured)
  .sort((a, b) => a.order - b.order);

export function getTournamentBySlug(slug: string) {
  return tournaments.find(
    (tournament) =>
      tournament.slug.toLowerCase() === slug.toLowerCase()
  );
}

export function getTournamentByName(name: string) {
  const normalizedName = normalizeTournamentName(name);

  return tournaments.find(
    (tournament) =>
      normalizeTournamentName(tournament.name) === normalizedName ||
      normalizeTournamentName(tournament.shortName) === normalizedName
  );
}

function normalizeTournamentName(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replaceAll("-", " ")
    .replace(/\s+/g, " ");
}