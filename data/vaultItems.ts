export type VaultRarity =
  | "Common"
  | "Rare"
  | "Match Worn"
  | "Signed"
  | "Prototype";

export type VaultItem = {
  id: string;
  slug: string;

  title: string;
  subtitle?: string;

  player: string;
  brand: string;

  year: number;

  image: string;

  rarity: VaultRarity;

  collection: string;

  description: string;

  available: boolean;

  featured: boolean;

  accent: string;
};

export const vaultItems: VaultItem[] = [
  {
    id: "fed-2006-nike-polo",

    slug: "federer-2006-nike-polo",

    title: "Nike Polo Roland Garros",

    subtitle: "Roger Federer",

    player: "Roger Federer",

    brand: "Nike",

    year: 2006,

    image: "/vault/federer-2006.jpg",

    rarity: "Rare",

    collection: "Roger Federer Archive",

    description:
      "One of the most iconic Nike polos worn during the 2006 clay season.",

    available: true,

    featured: true,

    accent: "#9FE870",
  },

  {
    id: "nadal-2010-shirt",

    slug: "nadal-2010-shirt",

    title: "Nike Australian Open",

    subtitle: "Rafael Nadal",

    player: "Rafael Nadal",

    brand: "Nike",

    year: 2010,

    image: "/vault/nadal-2010.jpg",

    rarity: "Match Worn",

    collection: "Rafael Nadal Archive",

    description:
      "Historic apparel inspired by Nadal's Australian Open campaign.",

    available: false,

    featured: false,

    accent: "#F28B35",
  },

  {
    id: "djokovic-2015",

    slug: "djokovic-2015-lacoste",

    title: "Lacoste Polo",

    subtitle: "Novak Djokovic",

    player: "Novak Djokovic",

    brand: "Lacoste",

    year: 2015,

    image: "/vault/djokovic-2015.jpg",

    rarity: "Signed",

    collection: "Novak Djokovic Archive",

    description:
      "Limited archive piece celebrating Djokovic's dominant season.",

    available: true,

    featured: false,

    accent: "#69B7FF",
  },

  {
    id: "sinner-2024",

    slug: "sinner-2024-nike",

    title: "Nike Melbourne Kit",

    subtitle: "Jannik Sinner",

    player: "Jannik Sinner",

    brand: "Nike",

    year: 2024,

    image: "/vault/sinner-2024.jpg",

    rarity: "Prototype",

    collection: "Jannik Sinner Archive",

    description:
      "Exclusive early collection inspired by Sinner's breakthrough era.",

    available: true,

    featured: false,

    accent: "#B4FF5A",
  },

  {
    id: "alcaraz-2023",

    slug: "alcaraz-2023-kit",

    title: "Nike Wimbledon Kit",

    subtitle: "Carlos Alcaraz",

    player: "Carlos Alcaraz",

    brand: "Nike",

    year: 2023,

    image: "/vault/alcaraz-2023.jpg",

    rarity: "Rare",

    collection: "Carlos Alcaraz Archive",

    description:
      "Inspired by one of the most memorable Wimbledon victories.",

    available: true,

    featured: false,

    accent: "#66E3FF",
  },
];