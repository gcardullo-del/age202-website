import type {
  Prisma,
} from "@/generated/prisma/client";

import { prisma } from "@/lib/prisma";

const HOMEPAGE_GROUP =
  "homepage";

export const homepageSettingKeys = {
  heroEyebrow:
    "homepage.hero.eyebrow",

  heroTitle:
    "homepage.hero.title",

  heroSubtitle:
    "homepage.hero.subtitle",

  heroDescription:
    "homepage.hero.description",

  heroCtaLabel:
    "homepage.hero.cta.label",

  heroCtaHref:
    "homepage.hero.cta.href",

  heroImage:
    "homepage.hero.image",

  museumTagline:
    "homepage.museum.tagline",

  museumIntroduction:
    "homepage.museum.introduction",

  featuredPlayers:
    "homepage.featuredPlayers",
} as const;

export type HomepageSettings = {
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  heroCtaLabel: string;
  heroCtaHref: string;
  heroImage: string;
  museumTagline: string;
  museumIntroduction: string;
  featuredPlayers: string[];
};

export const defaultHomepageSettings:
  HomepageSettings = {
  heroEyebrow:
    "The Digital Tennis Museum",

  heroTitle:
    "Second Hand.",

  heroSubtitle:
    "First Set.",

  heroDescription:
    "Preserving tennis history through authentic apparel, unforgettable champions and the stories behind every artifact.",

  heroCtaLabel:
    "Explore Museum",

  heroCtaHref:
    "#collections",

  heroImage:
    "/hero/museum-hero.jpg",

  museumTagline:
    "Every shirt holds a chapter.",

  museumIntroduction:
    "AGE202 preserves the visual culture of tennis through authentic apparel, legendary champions and the stories behind the game.",

  featuredPlayers: [],
};

function readStringValue(
  value: Prisma.JsonValue | undefined,
  fallback: string,
): string {
  return typeof value === "string"
    ? value
    : fallback;
}

function readStringArrayValue(
  value: Prisma.JsonValue | undefined,
  fallback: string[],
): string[] {
  if (
    Array.isArray(value) &&
    value.every(
      (item) =>
        typeof item === "string",
    )
  ) {
    return value;
  }

  return fallback;
}

export async function getAdminHomepageSettings():
  Promise<HomepageSettings> {
  const settings =
    await prisma.museumSetting.findMany({
      where: {
        group: HOMEPAGE_GROUP,
      },

      orderBy: {
        key: "asc",
      },
    });

  const values = new Map(
    settings.map(
      (setting) => [
        setting.key,
        setting.value,
      ],
    ),
  );

  return {
    heroEyebrow:
      readStringValue(
        values.get(
          homepageSettingKeys
            .heroEyebrow,
        ),
        defaultHomepageSettings
          .heroEyebrow,
      ),

    heroTitle:
      readStringValue(
        values.get(
          homepageSettingKeys
            .heroTitle,
        ),
        defaultHomepageSettings
          .heroTitle,
      ),

    heroSubtitle:
      readStringValue(
        values.get(
          homepageSettingKeys
            .heroSubtitle,
        ),
        defaultHomepageSettings
          .heroSubtitle,
      ),

    heroDescription:
      readStringValue(
        values.get(
          homepageSettingKeys
            .heroDescription,
        ),
        defaultHomepageSettings
          .heroDescription,
      ),

    heroCtaLabel:
      readStringValue(
        values.get(
          homepageSettingKeys
            .heroCtaLabel,
        ),
        defaultHomepageSettings
          .heroCtaLabel,
      ),

    heroCtaHref:
      readStringValue(
        values.get(
          homepageSettingKeys
            .heroCtaHref,
        ),
        defaultHomepageSettings
          .heroCtaHref,
      ),

    heroImage:
      readStringValue(
        values.get(
          homepageSettingKeys
            .heroImage,
        ),
        defaultHomepageSettings
          .heroImage,
      ),

    museumTagline:
      readStringValue(
        values.get(
          homepageSettingKeys
            .museumTagline,
        ),
        defaultHomepageSettings
          .museumTagline,
      ),

    museumIntroduction:
      readStringValue(
        values.get(
          homepageSettingKeys
            .museumIntroduction,
        ),
        defaultHomepageSettings
          .museumIntroduction,
      ),

    featuredPlayers:
      readStringArrayValue(
        values.get(
          homepageSettingKeys
            .featuredPlayers,
        ),
        defaultHomepageSettings
          .featuredPlayers,
      ),
  };
}

export async function updateAdminHomepageSettings(
  settings: HomepageSettings,
) {
  const entries = [
    {
      key:
        homepageSettingKeys
          .heroEyebrow,

      label:
        "Hero Eyebrow",

      description:
        "Small label displayed above the main homepage title.",

      value:
        settings.heroEyebrow,
    },

    {
      key:
        homepageSettingKeys
          .heroTitle,

      label:
        "Hero Title",

      description:
        "Primary homepage hero title.",

      value:
        settings.heroTitle,
    },

    {
      key:
        homepageSettingKeys
          .heroSubtitle,

      label:
        "Hero Subtitle",

      description:
        "Highlighted second line of the homepage hero.",

      value:
        settings.heroSubtitle,
    },

    {
      key:
        homepageSettingKeys
          .heroDescription,

      label:
        "Hero Description",

      description:
        "Introductory text displayed in the homepage hero.",

      value:
        settings.heroDescription,
    },

    {
      key:
        homepageSettingKeys
          .heroCtaLabel,

      label:
        "Hero CTA Label",

      description:
        "Text displayed inside the homepage hero button.",

      value:
        settings.heroCtaLabel,
    },

    {
      key:
        homepageSettingKeys
          .heroCtaHref,

      label:
        "Hero CTA Link",

      description:
        "Destination of the homepage hero button.",

      value:
        settings.heroCtaHref,
    },

    {
      key:
        homepageSettingKeys
          .heroImage,

      label:
        "Hero Image",

      description:
        "Image displayed in the homepage hero.",

      value:
        settings.heroImage,
    },

    {
      key:
        homepageSettingKeys
          .museumTagline,

      label:
        "Museum Tagline",

      description:
        "Short AGE202 museum statement used on the homepage.",

      value:
        settings.museumTagline,
    },

    {
      key:
        homepageSettingKeys
          .museumIntroduction,

      label:
        "Museum Introduction",

      description:
        "Main introductory text for the AGE202 museum homepage.",

      value:
        settings.museumIntroduction,
    },

    {
      key:
        homepageSettingKeys
          .featuredPlayers,

      label:
        "Featured Players",

      description:
        "Ordered list of Player IDs featured in the homepage Champion Collections section.",

      value:
        settings.featuredPlayers,
    },
  ];

  await prisma.$transaction(
    entries.map(
      (entry) =>
        prisma.museumSetting.upsert({
          where: {
            key: entry.key,
          },

          create: {
            key: entry.key,
            group:
              HOMEPAGE_GROUP,
            label:
              entry.label,
            description:
              entry.description,
            value:
              entry.value,
          },

          update: {
            group:
              HOMEPAGE_GROUP,
            label:
              entry.label,
            description:
              entry.description,
            value:
              entry.value,
          },
        }),
    ),
  );
}