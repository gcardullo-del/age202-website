"use server";

import {
  revalidatePath,
} from "next/cache";

import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

import {
  parseAndNormalizeCareerTimeline,
  replacePlayerCareerTimeline,
} from "@/lib/services/player-career-timeline.service";

import {
  cleanLongText,
  getAccentColor,
  getBoolean,
  getOptionalDate,
  getOptionalInteger,
  getOptionalString,
  getPlayerCollectionType,
  getRequiredString,
  normalizeCountry,
  normalizeNickname,
  slugify,
  validateNonNegativeInteger,
  validatePositiveInteger,
  validateUrl,
  validateYear,
} from "./playerForm.utils";

async function createAvailablePlayerSlug({
  requestedValue,
  playerId,
}: {
  requestedValue: string;
  playerId: string;
}): Promise<string> {
  const baseSlug =
    slugify(requestedValue);

  if (!baseSlug) {
    throw new Error(
      "Unable to generate a valid player slug.",
    );
  }

  const existingPlayer =
    await prisma.player.findFirst({
      where: {
        slug: baseSlug,
        id: {
          not: playerId,
        },
      },

      select: {
        id: true,
      },
    });

  if (!existingPlayer) {
    return baseSlug;
  }

  let suffix = 2;

  while (suffix < 1000) {
    const candidate =
      `${baseSlug}-${suffix}`;

    const existingCandidate =
      await prisma.player.findFirst({
        where: {
          slug: candidate,
          id: {
            not: playerId,
          },
        },

        select: {
          id: true,
        },
      });

    if (!existingCandidate) {
      return candidate;
    }

    suffix += 1;
  }

  return `${baseSlug}-${Date.now()}`;
}

function getOptionalDecimalString(
  formData: FormData,
  name: string,
): string | null {
  const value =
    getOptionalString(
      formData,
      name,
    );

  if (!value) {
    return null;
  }

  const normalized =
    value.replace(",", ".");

  const parsed =
    Number(normalized);

  if (
    !Number.isFinite(parsed) ||
    parsed < 0
  ) {
    throw new Error(
      `${name} must be a valid non-negative number.`,
    );
  }

  return normalized;
}

function getMuseumCollectionIds(
  formData: FormData,
): string[] {
  const rawValue =
    getOptionalString(
      formData,
      "museumCollectionIds",
    );

  if (!rawValue) {
    return [];
  }

  let parsed: unknown;

  try {
    parsed =
      JSON.parse(rawValue);
  } catch {
    throw new Error(
      "Museum collection selection is not valid JSON.",
    );
  }

  if (!Array.isArray(parsed)) {
    throw new Error(
      "Museum collection selection must be an array.",
    );
  }

  const normalizedIds =
    parsed.map(
      (value, index) => {
        if (
          typeof value !==
          "string"
        ) {
          throw new Error(
            `Museum collection ID ${index + 1} must be a string.`,
          );
        }

        const normalized =
          value.trim();

        if (!normalized) {
          throw new Error(
            `Museum collection ID ${index + 1} cannot be empty.`,
          );
        }

        return normalized;
      },
    );

  return [
    ...new Set(
      normalizedIds,
    ),
  ];
}

export async function updatePlayer(
  formData: FormData,
): Promise<void> {
  const playerId =
    getRequiredString(
      formData,
      "playerId",
    );

  const existingPlayer =
    await prisma.player.findUnique({
      where: {
        id: playerId,
      },

      select: {
        id: true,
        slug: true,
        atpPlayer: {
          select: {
            id: true,
          },
        },
      },
    });

  if (!existingPlayer) {
    throw new Error(
      "The Player record could not be found.",
    );
  }

  const name =
    getRequiredString(
      formData,
      "name",
    );

  const requestedSlug =
    getOptionalString(
      formData,
      "slug",
    ) ?? name;

  const slug =
    await createAvailablePlayerSlug({
      requestedValue:
        requestedSlug,
      playerId,
    });

  const firstName =
    getOptionalString(
      formData,
      "firstName",
    );

  const lastName =
    getOptionalString(
      formData,
      "lastName",
    );

  const nickname =
    normalizeNickname(
      getOptionalString(
        formData,
        "nickname",
      ),
    );

  const country =
    normalizeCountry(
      getOptionalString(
        formData,
        "country",
      ),
    );

  const biography =
    cleanLongText(
      getOptionalString(
        formData,
        "biography",
      ),
    );

  const quote =
    cleanLongText(
      getOptionalString(
        formData,
        "quote",
      ),
    );

  const heroImage =
    validateUrl(
      getOptionalString(
        formData,
        "heroImage",
      ),
      "Hero image",
    );

  const portraitImage =
    validateUrl(
      getOptionalString(
        formData,
        "portraitImage",
      ),
      "Portrait image",
    );

  const collectionType =
    getPlayerCollectionType(
      formData,
    );

  const accent =
    getAccentColor(
      formData,
    );

  const active =
    getBoolean(
      formData,
      "active",
    );

  const debutYear =
    validateYear(
      getOptionalInteger(
        formData,
        "debutYear",
      ),
      "Debut year",
    );

  const displayOrder =
    validateNonNegativeInteger(
      getOptionalInteger(
        formData,
        "displayOrder",
      ),
      "Display order",
    );

  const metaTitle =
    getOptionalString(
      formData,
      "metaTitle",
    );

  const metaDescription =
    cleanLongText(
      getOptionalString(
        formData,
        "metaDescription",
      ),
    );

  const canonicalUrl =
    validateUrl(
      getOptionalString(
        formData,
        "canonicalUrl",
      ),
      "Canonical URL",
    );

  const openGraphImage =
    validateUrl(
      getOptionalString(
        formData,
        "openGraphImage",
      ),
      "Open Graph image",
    );

  const robotsIndex =
    getBoolean(
      formData,
      "robotsIndex",
    );

  const robotsFollow =
    getBoolean(
      formData,
      "robotsFollow",
    );

  const publishedAt =
    getOptionalDate(
      formData,
      "publishedAt",
    );

  const atpPlayerId =
    getOptionalString(
      formData,
      "atpPlayerId",
    );

  const careerEvents =
    parseAndNormalizeCareerTimeline(
      getOptionalString(
        formData,
        "careerEvents",
      ),
    );

  const museumCollectionIds =
    getMuseumCollectionIds(
      formData,
    );

  const createProfile =
    getBoolean(
      formData,
      "createProfile",
    );

  const birthDate =
    getOptionalDate(
      formData,
      "birthDate",
    );

  const birthPlace =
    getOptionalString(
      formData,
      "birthPlace",
    );

  const residence =
    getOptionalString(
      formData,
      "residence",
    );

  const height =
    validatePositiveInteger(
      getOptionalInteger(
        formData,
        "height",
      ),
      "Height",
    );

  const weight =
    validatePositiveInteger(
      getOptionalInteger(
        formData,
        "weight",
      ),
      "Weight",
    );

  const plays =
    getOptionalString(
      formData,
      "plays",
    );

  const backhand =
    getOptionalString(
      formData,
      "backhand",
    );

  const coach =
    getOptionalString(
      formData,
      "coach",
    );

  const turnedPro =
    validateYear(
      getOptionalInteger(
        formData,
        "turnedPro",
      ),
      "Turned pro year",
    );

  const careerHigh =
    validatePositiveInteger(
      getOptionalInteger(
        formData,
        "careerHigh",
      ),
      "Career high",
    );

  const atpTitles =
    validateNonNegativeInteger(
      getOptionalInteger(
        formData,
        "atpTitles",
      ) ?? 0,
      "ATP titles",
    ) ?? 0;

  const australianOpen =
    validateNonNegativeInteger(
      getOptionalInteger(
        formData,
        "australianOpen",
      ) ?? 0,
      "Australian Open titles",
    ) ?? 0;

  const rolandGarros =
    validateNonNegativeInteger(
      getOptionalInteger(
        formData,
        "rolandGarros",
      ) ?? 0,
      "Roland Garros titles",
    ) ?? 0;

  const wimbledon =
    validateNonNegativeInteger(
      getOptionalInteger(
        formData,
        "wimbledon",
      ) ?? 0,
      "Wimbledon titles",
    ) ?? 0;

  const usOpen =
    validateNonNegativeInteger(
      getOptionalInteger(
        formData,
        "usOpen",
      ) ?? 0,
      "US Open titles",
    ) ?? 0;

  const grandSlams =
    validateNonNegativeInteger(
      getOptionalInteger(
        formData,
        "grandSlams",
      ) ??
        australianOpen +
          rolandGarros +
          wimbledon +
          usOpen,
      "Grand Slam titles",
    ) ?? 0;

  const masters1000 =
    validateNonNegativeInteger(
      getOptionalInteger(
        formData,
        "masters1000",
      ) ?? 0,
      "Masters 1000 titles",
    ) ?? 0;

  const atpFinals =
    validateNonNegativeInteger(
      getOptionalInteger(
        formData,
        "atpFinals",
      ) ?? 0,
      "ATP Finals titles",
    ) ?? 0;

  const olympicGold =
    validateNonNegativeInteger(
      getOptionalInteger(
        formData,
        "olympicGold",
      ) ?? 0,
      "Olympic gold medals",
    ) ?? 0;

  const davisCup =
    validateNonNegativeInteger(
      getOptionalInteger(
        formData,
        "davisCup",
      ) ?? 0,
      "Davis Cup titles",
    ) ?? 0;

  const prizeMoney =
    getOptionalDecimalString(
      formData,
      "prizeMoney",
    );

  const playingStyle =
    cleanLongText(
      getOptionalString(
        formData,
        "playingStyle",
      ),
    );

  const favouriteSurface =
    getOptionalString(
      formData,
      "favouriteSurface",
    );

  const biographyShort =
    cleanLongText(
      getOptionalString(
        formData,
        "biographyShort",
      ),
    );

  const biographyLong =
    cleanLongText(
      getOptionalString(
        formData,
        "biographyLong",
      ),
    );

  const shouldCreateProfile =
    createProfile ||
    Boolean(
      birthDate ||
        birthPlace ||
        residence ||
        height ||
        weight ||
        plays ||
        backhand ||
        coach ||
        turnedPro ||
        careerHigh ||
        atpTitles ||
        grandSlams ||
        masters1000 ||
        atpFinals ||
        olympicGold ||
        davisCup ||
        prizeMoney ||
        playingStyle ||
        favouriteSurface ||
        biographyShort ||
        biographyLong,
    );

  if (atpPlayerId) {
    const selectedAtpPlayer =
      await prisma.atpPlayer.findUnique({
        where: {
          id: atpPlayerId,
        },

        select: {
          id: true,
          playerId: true,
        },
      });

    if (!selectedAtpPlayer) {
      throw new Error(
        "The selected ATP player could not be found.",
      );
    }

    if (
      selectedAtpPlayer.playerId &&
      selectedAtpPlayer.playerId !==
        playerId
    ) {
      throw new Error(
        "The selected ATP player is already linked to another Player record.",
      );
    }
  }

  if (
    museumCollectionIds.length >
    0
  ) {
    const existingCollections =
      await prisma.museumCollection.findMany({
        where: {
          id: {
            in:
              museumCollectionIds,
          },
        },

        select: {
          id: true,
        },
      });

    if (
      existingCollections.length !==
      museumCollectionIds.length
    ) {
      throw new Error(
        "One or more selected Museum Collections could not be found.",
      );
    }
  }

  await prisma.$transaction(
    async (transaction) => {
      await transaction.player.update({
        where: {
          id: playerId,
        },

        data: {
          name,
          slug,
          firstName,
          lastName,
          nickname,
          country,
          biography,
          quote,
          heroImage,
          portraitImage,
          accent,
          active,
          collectionType,
          debutYear,
          displayOrder,
          metaTitle,
          metaDescription,
          canonicalUrl,
          openGraphImage,
          robotsIndex,
          robotsFollow,
          publishedAt,
        },
      });

      if (shouldCreateProfile) {
        await transaction.playerProfile.upsert({
          where: {
            playerId,
          },

          create: {
            playerId,
            birthDate,
            birthPlace,
            residence,
            height,
            weight,
            plays,
            backhand,
            coach,
            turnedPro,
            careerHigh,
            atpTitles,
            australianOpen,
            rolandGarros,
            wimbledon,
            usOpen,
            grandSlams,
            masters1000,
            atpFinals,
            olympicGold,
            davisCup,
            prizeMoney,
            playingStyle,
            favouriteSurface,
            biographyShort,
            biographyLong,
          },

          update: {
            birthDate,
            birthPlace,
            residence,
            height,
            weight,
            plays,
            backhand,
            coach,
            turnedPro,
            careerHigh,
            atpTitles,
            australianOpen,
            rolandGarros,
            wimbledon,
            usOpen,
            grandSlams,
            masters1000,
            atpFinals,
            olympicGold,
            davisCup,
            prizeMoney,
            playingStyle,
            favouriteSurface,
            biographyShort,
            biographyLong,
          },
        });
      } else {
        await transaction.playerProfile.deleteMany({
          where: {
            playerId,
          },
        });
      }

      const previousAtpPlayerId =
        existingPlayer.atpPlayer?.id ??
        null;

      if (
        previousAtpPlayerId &&
        previousAtpPlayerId !==
          atpPlayerId
      ) {
        await transaction.atpPlayer.update({
          where: {
            id:
              previousAtpPlayerId,
          },

          data: {
            playerId: null,
          },
        });
      }

      if (
        atpPlayerId &&
        atpPlayerId !==
          previousAtpPlayerId
      ) {
        await transaction.atpPlayer.update({
          where: {
            id: atpPlayerId,
          },

          data: {
            playerId,
          },
        });
      }

      await replacePlayerCareerTimeline({
        transaction,
        playerId,
        events:
          careerEvents,
      });

      await transaction.museumCollectionPlayer.deleteMany({
        where: {
          playerId,
        },
      });

      if (
        museumCollectionIds.length >
        0
      ) {
        await transaction.museumCollectionPlayer.createMany({
          data:
            museumCollectionIds.map(
              (
                collectionId,
                index,
              ) => ({
                collectionId,
                playerId,
                sortOrder: index,
                featured: false,
              }),
            ),
        });
      }
    },
  );

  revalidatePath(
    "/admin/players",
  );

  revalidatePath(
    `/admin/players/${playerId}`,
  );

  revalidatePath(
    "/players",
  );

  revalidatePath(
    `/players/${existingPlayer.slug}`,
  );

  revalidatePath(
    `/players/${slug}`,
  );

  revalidatePath(
    "/admin/collections",
  );

  revalidatePath(
    "/collections",
  );

  redirect(
    `/admin/players/${playerId}`,
  );
}