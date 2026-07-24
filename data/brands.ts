export type MuseumBrand = {
  id: string;
  name: string;
  description: string;
  logo: string;
  href: string;
};

export const museumBrands: MuseumBrand[] = [
  {
    id: "nike",
    name: "Nike",
    description:
      "Performance innovation and some of the most recognisable silhouettes in tennis history.",
    logo: "/brands/nike.svg",
    href: "/brands/nike",
  },
  {
    id: "adidas",
    name: "Adidas",
    description:
      "Technical heritage, iconic design and decades of presence on the world's greatest courts.",
    logo: "/brands/adidas.svg",
    href: "/brands/adidas",
  },
  {
    id: "lacoste",
    name: "Lacoste",
    description:
      "A direct connection between tennis tradition, elegance and modern performance.",
    logo: "/brands/lacoste.svg",
    href: "/brands/lacoste",
  },
  {
    id: "on-running",
    name: "On",
    description:
      "Contemporary Swiss engineering combined with a new vision of premium tennis apparel.",
    logo: "/brands/on.svg",
    href: "/brands/on-running",
  },
  {
    id: "asics",
    name: "Asics",
    description:
      "Technical precision and performance-driven design developed for demanding competition.",
    logo: "/brands/asics.svg",
    href: "/brands/asics",
  },
];