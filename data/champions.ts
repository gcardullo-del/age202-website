export type Champion = {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  nickname: string;
  nationality: string;
  debutYear: number;
  mainBrand: string;
  archivePieces: number;
  description: string;
  quote: string;
  image: string;
  slug: string;
  accent: string;
};

export const champions: Champion[] = [
  {
    id: "roger-federer",
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
    image: "/players/federernew.jpg",
    slug: "federer",
    accent: "#C8FF00",
  },
  {
    id: "rafael-nadal",
    name: "Rafael Nadal",
    firstName: "Rafael",
    lastName: "Nadal",
    nickname: "The King of Clay",
    nationality: "Spain",
    debutYear: 2001,
    mainBrand: "Nike",
    archivePieces: 18,
    description:
      "Intensity, strength and unmistakable silhouettes shaped one of tennis apparel's most iconic identities.",
    quote:
      "Built for endurance, movement and the unmistakable energy of competition.",
    image: "/players/nadal.webp",
    slug: "nadal",
    accent: "#FF6B35",
  },
  {
    id: "novak-djokovic",
    name: "Novak Djokovic",
    firstName: "Novak",
    lastName: "Djokovic",
    nickname: "The Complete Champion",
    nationality: "Serbia",
    debutYear: 2003,
    mainBrand: "Lacoste",
    archivePieces: 16,
    description:
      "Technical balance, precision and adaptability represent one of the most complete careers in tennis history.",
    quote:
      "Performance apparel refined through control, resilience and constant evolution.",
    image: "/players/djokovic.jpg",
    slug: "djokovic",
    accent: "#4CB5F5",
  },
  {
    id: "jannik-sinner",
    name: "Jannik Sinner",
    firstName: "Jannik",
    lastName: "Sinner",
    nickname: "The New Precision",
    nationality: "Italy",
    debutYear: 2018,
    mainBrand: "Nike",
    archivePieces: 12,
    description:
      "A new generation of clean design, modern athleticism and contemporary tennis culture.",
    quote:
      "Minimal aesthetics, explosive movement and the confidence of a new era.",
    image: "/players/sinner.jpeg",
    slug: "sinner",
    accent: "#FF7A00",
  },
  {
    id: "carlos-alcaraz",
    name: "Carlos Alcaraz",
    firstName: "Carlos",
    lastName: "Alcaraz",
    nickname: "The Future in Motion",
    nationality: "Spain",
    debutYear: 2018,
    mainBrand: "Nike",
    archivePieces: 10,
    description:
      "Energy, creativity and fearless movement define the visual identity of tennis's emerging generation.",
    quote:
      "A collection shaped by speed, spontaneity and the freedom to redefine the game.",
    image: "/players/alcaraz.jpg",
    slug: "alcaraz",
    accent: "#E85D75",
  },
];

export function getChampionBySlug(
  slug: string
): Champion | undefined {
  return champions.find(
    (champion) => champion.slug === slug
  );
}