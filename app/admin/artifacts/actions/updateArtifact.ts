"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type {
  ArtifactAvailability,
} from "@/generated/prisma/client";

import { prisma } from "@/lib/prisma";

import {
  deleteArtifactImage as deleteStoredArtifactImage,
  uploadArtifactImage,
} from "@/lib/services/artifactStorage.service";

import {
  MAX_ARTIFACT_IMAGES,
  getArtifactCategory,
  getArtifactCondition,
  getArtifactRarity,
  getArtifactStatus,
  getBoolean,
  getCoverImageIndex,
  getImageFiles,
  getOptionalNumber,
  getOptionalString,
  getRequiredString,
  getStringArray,
  slugify,
} from "./utils/artifactForm.utils";

const ARTIFACT_AVAILABILITIES =
  new Set<ArtifactAvailability>([
    "AVAILABLE",
    "SOLD",
    "COMING_SOON",
    "NOT_FOR_SALE",
  ]);

function getArtifactAvailability(
  formData: FormData,
): ArtifactAvailability {
  const value = getOptionalString(
    formData,
    "availability",
  );

  if (
    value &&
    ARTIFACT_AVAILABILITIES.has(
      value as ArtifactAvailability,
    )
  ) {
    return value as ArtifactAvailability;
  }

  return "COMING_SOON";
}

async function createAvailableSlug(
  requestedValue: string,
  artifactId: string,
): Promise<string> {
  const baseSlug = slugify(requestedValue);

  if (!baseSlug) {
    throw new Error(
      "Unable to generate a valid slug.",
    );
  }

  const existingArtifact =
    await prisma.artifact.findFirst({
      where: {
        slug: baseSlug,
        id: {
          not: artifactId,
        },
      },
      select: {
        id: true,
      },
    });

  if (!existingArtifact) {
    return baseSlug;
  }

  return `${baseSlug}-${Date.now()}`;
}

export async function updateArtifact(
  formData: FormData,
): Promise<void> {
  const artifactId = getRequiredString(
    formData,
    "artifactId",
  );

  const title = getRequiredString(
    formData,
    "title",
  );

  const playerId = getRequiredString(
    formData,
    "playerId",
  );

  const brandId = getRequiredString(
    formData,
    "brandId",
  );

  const currentArtifact =
    await prisma.artifact.findUnique({
      where: {
        id: artifactId,
      },
      include: {
        images: {
          orderBy: {
            sortOrder: "asc",
          },
        },
      },
    });

  if (!currentArtifact) {
    throw new Error(
      "The artifact could not be found.",
    );
  }

  const newImages = getImageFiles(formData);

  const requestedRemovedImageIds =
    getStringArray(
      formData,
      "removedImageIds",
    );

  const currentImageIds = new Set(
    currentArtifact.images.map(
      (image) => image.id,
    ),
  );

  const removedImageIds = Array.from(
    new Set(requestedRemovedImageIds),
  );

  const invalidRemovedImage =
    removedImageIds.find(
      (imageId) =>
        !currentImageIds.has(imageId),
    );

  if (invalidRemovedImage) {
    throw new Error(
      "One or more selected images do not belong to this artifact.",
    );
  }

  const removedImageIdSet = new Set(
    removedImageIds,
  );

  const remainingImages =
    currentArtifact.images.filter(
      (image) =>
        !removedImageIdSet.has(image.id),
    );

  const finalImageCount =
    remainingImages.length +
    newImages.length;

  if (
    finalImageCount >
    MAX_ARTIFACT_IMAGES
  ) {
    throw new Error(
      `An artifact can contain a maximum of ${MAX_ARTIFACT_IMAGES} images.`,
    );
  }

  const requestedExistingCoverImageId =
    getOptionalString(
      formData,
      "existingCoverImageId",
    );

  if (
    requestedExistingCoverImageId &&
    !remainingImages.some(
      (image) =>
        image.id ===
        requestedExistingCoverImageId,
    )
  ) {
    throw new Error(
      "The selected cover image is not available.",
    );
  }

  const submittedNewCoverIndex =
    newImages.length > 0
      ? getCoverImageIndex(
          formData,
          newImages.length,
        )
      : -1;

  const submittedSlug = getOptionalString(
    formData,
    "slug",
  );

  const slug = await createAvailableSlug(
    submittedSlug ?? title,
    artifactId,
  );

  const uploadedImages: Array<{
    url: string;
    file: File;
  }> = [];

  try {
    for (const file of newImages) {
      const url = await uploadArtifactImage(
        artifactId,
        file,
      );

      uploadedImages.push({
        url,
        file,
      });
    }
  } catch (error) {
    await Promise.allSettled(
      uploadedImages.map(({ url }) =>
        deleteStoredArtifactImage(url),
      ),
    );

    throw error;
  }

  const removedImages =
    currentArtifact.images.filter(
      (image) =>
        removedImageIdSet.has(image.id),
    );

  try {
    await prisma.$transaction(
      async (transaction) => {
        await transaction.artifact.update({
          where: {
            id: artifactId,
          },

          data: {
            archiveNumber:
              getOptionalString(
                formData,
                "archiveNumber",
              ) ??
              currentArtifact.archiveNumber,

            title,

            subtitle:
              getOptionalString(
                formData,
                "subtitle",
              ) ?? null,

            slug,

            description:
              getOptionalString(
                formData,
                "description",
              ) ?? null,

            museumStory:
              getOptionalString(
                formData,
                "museumStory",
              ) ?? null,

            historicalContext:
              getOptionalString(
                formData,
                "historicalContext",
              ) ?? null,

            curatorNote:
              getOptionalString(
                formData,
                "curatorNote",
              ) ?? null,

            year:
              getOptionalNumber(
                formData,
                "year",
              ) ?? null,

            season:
              getOptionalString(
                formData,
                "season",
              ) ?? null,

            tournament:
              getOptionalString(
                formData,
                "tournament",
              ) ?? null,

            collection:
              getOptionalString(
                formData,
                "collection",
              ) ?? null,

            edition:
              getOptionalString(
                formData,
                "edition",
              ) ?? null,

            category:
              getArtifactCategory(
                formData,
              ) ?? null,

            rarity:
              getArtifactRarity(formData),

            size:
              getOptionalString(
                formData,
                "size",
              ) ?? null,

            colour:
              getOptionalString(
                formData,
                "colour",
              ) ?? null,

            material:
              getOptionalString(
                formData,
                "material",
              ) ?? null,

            condition:
              getArtifactCondition(formData),

            availability:
              getArtifactAvailability(
                formData,
              ),

            price:
              getOptionalNumber(
                formData,
                "price",
              ) ?? null,

            currency:
              getOptionalString(
                formData,
                "currency",
              ) ?? "EUR",

            vintedUrl:
              getOptionalString(
                formData,
                "vintedUrl",
              ) ?? null,

            status:
              getArtifactStatus(formData),

            featured:
              getBoolean(
                formData,
                "featured",
              ),

            player: {
              connect: {
                id: playerId,
              },
            },

            brand: {
              connect: {
                id: brandId,
              },
            },
          },
        });

        if (removedImageIds.length > 0) {
          await transaction.artifactImage.deleteMany(
            {
              where: {
                artifactId,
                id: {
                  in: removedImageIds,
                },
              },
            },
          );
        }

        await transaction.artifactImage.updateMany(
          {
            where: {
              artifactId,
            },
            data: {
              isCover: false,
            },
          },
        );

        for (const [
          index,
          image,
        ] of remainingImages.entries()) {
          await transaction.artifactImage.update(
            {
              where: {
                id: image.id,
              },

              data: {
                alt:
                  image.alt ??
                  `${title} — image ${
                    index + 1
                  }`,

                sortOrder: index,
              },
            },
          );
        }

        const createdImages: Array<{
          id: string;
          index: number;
        }> = [];

        for (const [
          index,
          uploadedImage,
        ] of uploadedImages.entries()) {
          const sortOrder =
            remainingImages.length +
            index;

          const createdImage =
            await transaction.artifactImage.create(
              {
                data: {
                  artifactId,
                  url: uploadedImage.url,
                  alt: `${title} — image ${
                    sortOrder + 1
                  }`,
                  sortOrder,
                  isCover: false,
                },
              },
            );

          createdImages.push({
            id: createdImage.id,
            index,
          });
        }

        let coverImageId:
          | string
          | undefined;

        if (
          requestedExistingCoverImageId
        ) {
          coverImageId =
            requestedExistingCoverImageId;
        } else if (
          submittedNewCoverIndex >= 0
        ) {
          coverImageId =
            createdImages.find(
              (image) =>
                image.index ===
                submittedNewCoverIndex,
            )?.id;
        } else {
          coverImageId =
            remainingImages.find(
              (image) => image.isCover,
            )?.id ??
            remainingImages[0]?.id ??
            createdImages[0]?.id;
        }

        if (coverImageId) {
          await transaction.artifactImage.update(
            {
              where: {
                id: coverImageId,
              },

              data: {
                isCover: true,
              },
            },
          );
        }
      },
    );
  } catch (error) {
    await Promise.allSettled(
      uploadedImages.map(({ url }) =>
        deleteStoredArtifactImage(url),
      ),
    );

    throw error;
  }

  await Promise.allSettled(
    removedImages.map((image) =>
      deleteStoredArtifactImage(
        image.url,
      ),
    ),
  );

  revalidatePath("/admin");
  revalidatePath("/admin/artifacts");

  revalidatePath(
    `/admin/artifacts/${artifactId}`,
  );

  revalidatePath("/archive");

  revalidatePath(
    `/archive/${currentArtifact.slug}`,
  );

  revalidatePath(
    `/archive/${slug}`,
  );

  redirect("/admin/artifacts");
}