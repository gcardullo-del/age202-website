"use server";

import {
  revalidatePath,
} from "next/cache";

import { prisma } from "@/lib/prisma";

function requiredString(
  formData: FormData,
  name: string,
): string {
  const value =
    formData.get(name);

  if (
    typeof value !==
      "string" ||
    !value.trim()
  ) {
    throw new Error(
      `${name} is required.`,
    );
  }

  return value.trim();
}

function stringArray(
  formData: FormData,
  name: string,
): string[] {
  return Array.from(
    new Set(
      formData
        .getAll(name)
        .filter(
          (
            value,
          ): value is string =>
            typeof value ===
            "string",
        )
        .map((value) =>
          value.trim(),
        )
        .filter(Boolean),
    ),
  );
}

export async function updateCollectionPlayers(
  formData: FormData,
): Promise<void> {
  const collectionId =
    requiredString(
      formData,
      "collectionId",
    );

  const playerIds =
    stringArray(
      formData,
      "playerIds",
    );

  const featuredPlayerId =
    formData.get(
      "featuredPlayerId",
    );

  const collection =
    await prisma.museumCollection.findUnique(
      {
        where: {
          id: collectionId,
        },
        select: {
          id: true,
          slug: true,
        },
      },
    );

  if (!collection) {
    throw new Error(
      "The collection could not be found.",
    );
  }

  if (
    playerIds.length > 0
  ) {
    const players =
      await prisma.player.findMany(
        {
          where: {
            id: {
              in: playerIds,
            },
          },
          select: {
            id: true,
          },
        },
      );

    if (
      players.length !==
      playerIds.length
    ) {
      throw new Error(
        "One or more selected players could not be found.",
      );
    }
  }

  const normalizedFeaturedId =
    typeof featuredPlayerId ===
      "string" &&
    featuredPlayerId.trim()
      ? featuredPlayerId.trim()
      : null;

  if (
    normalizedFeaturedId &&
    !playerIds.includes(
      normalizedFeaturedId,
    )
  ) {
    throw new Error(
      "The featured player must also be selected in the collection.",
    );
  }

  await prisma.$transaction(
    async (transaction) => {
      await transaction.museumCollectionPlayer.deleteMany(
        {
          where: {
            collectionId,
          },
        },
      );

      if (
        playerIds.length > 0
      ) {
        await transaction.museumCollectionPlayer.createMany(
          {
            data: playerIds.map(
              (
                playerId,
                index,
              ) => ({
                collectionId,
                playerId,
                sortOrder: index,
                featured:
                  playerId ===
                  normalizedFeaturedId,
              }),
            ),
          },
        );
      }
    },
  );

  revalidatePath(
    "/admin/collections",
  );
  revalidatePath(
    `/admin/collections/${collectionId}`,
  );
  revalidatePath(
    `/collections/${collection.slug}`,
  );
}
