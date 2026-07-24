export type ArchiveTimelineEntry = {
  id: string;
  year: number;
  player: string;
  label: string;
  description: string;
  href: string;
};

export const archiveTimeline: ArchiveTimelineEntry[] = [
  {
    id: "federer-era",
    year: 1998,
    player: "Roger Federer",
    label: "The Era of Elegance",
    description:
      "The beginning of an era defined by precision, refinement and timeless tennis style.",
    href: "/archive?player=federer#archive-explorer",
  },
  {
    id: "nadal-era",
    year: 2001,
    player: "Rafael Nadal",
    label: "The Era of Intensity",
    description:
      "Powerful silhouettes and unmistakable energy reshaped the visual language of the sport.",
    href: "/archive?player=nadal#archive-explorer",
  },
  {
    id: "djokovic-era",
    year: 2003,
    player: "Novak Djokovic",
    label: "The Era of Precision",
    description:
      "Technical evolution and total control became central elements of modern performance apparel.",
    href: "/archive?player=djokovic#archive-explorer",
  },
  {
    id: "sinner-era",
    year: 2018,
    player: "Jannik Sinner",
    label: "The New Generation",
    description:
      "Minimal design, clean lines and contemporary performance mark the arrival of a new era.",
    href: "/archive?player=sinner#archive-explorer",
  },
  {
    id: "alcaraz-era",
    year: 2018,
    player: "Carlos Alcaraz",
    label: "The Future in Motion",
    description:
      "Freedom, creativity and explosive movement redefine the identity of the modern champion.",
    href: "/archive?player=alcaraz#archive-explorer",
  },
];