import type {
  PlayerCollectionType,
  Prisma,
} from "@/generated/prisma/client";

import { prisma } from "@/lib/prisma";

const HOMEPAGE_GROUP =
  "homepage";

const homepageSettingKeys = {
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

export type PublicHomepageFeaturedPlayer = {
  id: string;
  name: string;
  slug: string;
  nickname: string | null;
  country: string | null;
  heroImage: string | null;
  portraitImage: string | null;
  accent: string;
  collectionType: PlayerCollectionType;
  displayOrder: number | null;
};

export type PublicHomepageSettings = {
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  heroCtaLabel: string;
  heroCtaHref: string;
  heroImage: string;
  museumTagline: string;
  museumIntroduction: string;
  featuredPlayers: PublicHomepageFeaturedPlayer[];
};

const defaultHomepageSettings = {
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

  return [];
}

async function getFeaturedPlayers(
  playerIds: string[],
): Promise<
  PublicHomepageFeaturedPlayer[]
> {
  if (playerIds.length === 0) {
    return [];
  }

  const players =
    await prisma.player.findMany({
      where: {
        id: {
          in: playerIds,
        },

        active: true,
      },

      select: {
        id: true,
        name: true,
        slug: true,
        nickname: true,
        country: true,
        heroImage: true,
        portraitImage: true,
        accent: true,
        collectionType: true,
        displayOrder: true,
      },
    });

  const playersById =
    new Map(
      players.map(
        (player) => [
          player.id,
          player,
        ],
      ),
    );

  return playerIds.flatMap(
    (playerId) => {
      const player =
        playersById.get(
          playerId,
        );

      return player
        ? [player]
        : [];
    },
  );
}

export async function getPublicHomepageSettings():
  Promise<PublicHomepageSettings> {
  const settings =
    await prisma.museumSetting.findMany({
      where: {
        group: HOMEPAGE_GROUP,
      },

      select: {
        key: true,
        value: true,
      },
    });

  const values =
    new Map(
      settings.map(
        (setting) => [
          setting.key,
          setting.value,
        ],
      ),
    );

  const featuredPlayerIds =
    readStringArrayValue(
      values.get(
        homepageSettingKeys
          .featuredPlayers,
      ),
    );

  const featuredPlayers =
    await getFeaturedPlayers(
      featuredPlayerIds,
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

    featuredPlayers,
  };
}