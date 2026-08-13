"use server";

import {
  revalidatePath,
} from "next/cache";

import {
  requireAdmin,
} from "@/lib/auth/admin-auth";

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

export async function updateCollectionArtifacts(
  formData: FormData,
): Promise<void> {
  await requireAdmin();

  const collectionId =
    requiredString(
      formData,
      "collectionId",
    );

  const artifactIds =
    stringArray(
      formData,
      "artifactIds",
    );

  const featuredArtifactIds =
    new Set(
      stringArray(
        formData,
        "featuredArtifactIds",
      ),
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
    Array.from(
      featuredArtifactIds,
    ).some(
      (id) =>
        !artifactIds.includes(id),
    )
  ) {
    throw new Error(
      "Featured artifacts must also be selected.",
    );
  }

  if (
    artifactIds.length > 0
  ) {
    const artifacts =
      await prisma.artifact.findMany(
        {
          where: {
            id: {
              in: artifactIds,
            },
          },
          select: {
            id: true,
          },
        },
      );

    if (
      artifacts.length !==
      artifactIds.length
    ) {
      throw new Error(
        "One or more selected artifacts could not be found.",
      );
    }
  }

  await prisma.$transaction(
    async (transaction) => {
      await transaction.museumCollectionArtifact.deleteMany(
        {
          where: {
            collectionId,
          },
        },
      );

      if (
        artifactIds.length > 0
      ) {
        await transaction.museumCollectionArtifact.createMany(
          {
            data: artifactIds.map(
              (
                artifactId,
                index,
              ) => ({
                collectionId,
                artifactId,
                sortOrder: index,
                featured:
                  featuredArtifactIds.has(
                    artifactId,
                  ),
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