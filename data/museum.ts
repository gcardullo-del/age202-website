export type MuseumNavigationItem = {
  label: string;
  href: string;
  description?: string;
};

export type MuseumStat = {
  label: string;
  value: string;
};

export const museum = {
  name: "AGE202",
  fullName: "AGE202 Digital Tennis Museum",
  tagline: "Second Hand. First Set.",
  description:
    "A digital archive dedicated to collectible tennis apparel, tournament history and the visual legacy of the game's greatest champions.",

  website: "https://www.age202.com",

  contactEmail: "info@age202.com",

  social: {
    instagram: "",
    facebook: "",
    tiktok: "",
    youtube: "",
    vinted: "",
  },

  seo: {
    title: "AGE202 | Digital Tennis Museum",
    titleTemplate: "%s | AGE202",
    description:
      "Explore collectible tennis apparel connected to Federer, Nadal, Djokovic, Sinner, Alcaraz and the greatest tournaments in tennis history.",
    keywords: [
      "AGE202",
      "tennis archive",
      "digital tennis museum",
      "collectible tennis apparel",
      "second hand tennis clothing",
      "Roger Federer",
      "Rafael Nadal",
      "Novak Djokovic",
      "Jannik Sinner",
      "Carlos Alcaraz",
      "Nike Tennis",
      "Adidas Tennis",
      "On Running Tennis",
      "ASICS Tennis",
    ],
  },

  navigation: {
    primary: [
      {
        label: "Home",
        href: "/",
      },
      {
        label: "Archive",
        href: "/archive",
        description: "Explore every documented archive piece.",
      },
      {
        label: "Hall of Fame",
        href: "/hall-of-fame",
        description: "Discover the champions represented by AGE202.",
      },
      {
        label: "Trophy Room",
        href: "/trophy-room",
        description: "Enter the room dedicated to tennis greatness.",
      },
      {
        label: "Saved",
        href: "/saved",
        description: "Review your saved archive records.",
      },
      {
        label: "About",
        href: "/about",
        description: "Read the story and mission of AGE202.",
      },
    ] satisfies MuseumNavigationItem[],

    museumRooms: [
      {
        label: "Archive Explorer",
        href: "/archive",
      },
      {
        label: "Hall of Fame",
        href: "/hall-of-fame",
      },
      {
        label: "Trophy Room",
        href: "/trophy-room",
      },
      {
        label: "Grand Slam Map",
        href: "/grand-slam-map",
      },
      {
        label: "Museum Statistics",
        href: "/statistics",
      },
    ] satisfies MuseumNavigationItem[],
  },

  homepage: {
    eyebrow: "Digital Tennis Museum",
    title: "Every piece has a match. Every match has a story.",
    introduction:
      "Explore a curated digital archive of tennis garments connected to legendary players, defining tournaments and unforgettable moments.",
    primaryCta: {
      label: "Enter the Archive",
      href: "/archive",
    },
    secondaryCta: {
      label: "Visit the Hall of Fame",
      href: "/hall-of-fame",
    },
  },

  archive: {
    title: "The Digital Archive",
    description:
      "A continuously evolving collection of documented tennis garments, tournament editions and pieces connected to the visual history of the sport.",
    emptyMessage:
      "No archive records currently match the selected filters.",
  },

  certificate: {
    title: "Certificate of Archive",
    issuer: "AGE202 Digital Tennis Museum",
    verificationText: "Documented and verified by AGE202",
    legalText:
      "This certificate records the information associated with an AGE202 archive piece. It does not constitute certification by the original manufacturer or athlete.",
  },

  footer: {
    statement:
      "Preserving the visual history of tennis, one archive piece at a time.",
    copyright:
      "AGE202. All trademarks, athlete names and tournament names remain the property of their respective owners.",
  },
} as const;

export const museumHighlights: MuseumStat[] = [
  {
    label: "Digital Archive",
    value: "Curated",
  },
  {
    label: "Museum Focus",
    value: "Tennis Apparel",
  },
  {
    label: "Archive Access",
    value: "Worldwide",
  },
  {
    label: "Project",
    value: "Independent",
  },
];