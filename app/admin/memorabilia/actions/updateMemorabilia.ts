"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type {
  MemorabiliaAvailability,
  MemorabiliaCondition,
  MemorabiliaRarity,
  MemorabiliaStatus,
  MemorabiliaType,
} from "@/generated/prisma/client";

import {
  requireAdmin,
} from "@/lib/auth/admin-auth";

import { prisma } from "@/lib/prisma";

import {
  syncMemorabiliaWithStripe,
} from "@/lib/services/stripeCatalog.service";


import {
  deleteMemorabiliaImage as deleteStoredMemorabiliaImage,
  uploadMemorabiliaImage,
} from "@/lib/services/memorabiliaStorage.service";


const MAX_MEMORABILIA_IMAGES = 10;

function getImageFiles(
  formData: FormData,
): File[] {
  return formData
    .getAll("images")
    .filter(
      (value): value is File =>
        value instanceof File &&
        value.size > 0,
    );
}

function getStringArray(
  formData: FormData,
  key: string,
): string[] {
  return formData
    .getAll(key)
    .filter(
      (value): value is string =>
        typeof value === "string",
    )
    .map((value) => value.trim())
    .filter(Boolean);
}

function getCoverImageIndex(
  formData: FormData,
  imageCount: number,
): number {
  const raw =
    getString(
      formData,
      "coverImageIndex",
    );

  if (!raw) {
    return imageCount > 0
      ? 0
      : -1;
  }

  const value =
    Number(raw);

  if (
    !Number.isInteger(value) ||
    value < 0 ||
    value >= imageCount
  ) {
    return imageCount > 0
      ? 0
      : -1;
  }

  return value;
}

function validateImageFiles(
  files: File[],
): void {
  const allowedTypes =
    new Set([
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
    ]);

  const maxFileSize =
    10 * 1024 * 1024;

  for (const file of files) {
    if (
      !allowedTypes.has(
        file.type,
      )
    ) {
      throw new Error(
        `Unsupported image format: ${file.name}`,
      );
    }

    if (
      file.size >
      maxFileSize
    ) {
      throw new Error(
        `Image ${file.name} exceeds the 10 MB limit.`,
      );
    }
  }
}


type OrderedMediaItem =
  | {
      type: "existing";
      id: string;
    }
  | {
      type: "new";
      index: number;
    };

function getSubmittedMediaOrder(
  formData: FormData,
  remainingImageIds: string[],
  newImageCount: number,
): OrderedMediaItem[] {
  const rawOrder =
    getOptionalString(
      formData,
      "mediaOrder",
    );

  const remainingSet =
    new Set(
      remainingImageIds,
    );

  const usedExisting =
    new Set<string>();

  let nextNewIndex = 0;

  const ordered:
    OrderedMediaItem[] = [];

  if (rawOrder) {
    for (
      const token of rawOrder.split(
        ",",
      )
    ) {
      const [
        type,
        value,
      ] = token.split(
        ":",
        2,
      );

      if (
        type ===
          "existing" &&
        value &&
        remainingSet.has(
          value,
        ) &&
        !usedExisting.has(
          value,
        )
      ) {
        ordered.push({
          type:
            "existing",
          id:
            value,
        });

        usedExisting.add(
          value,
        );
      } else if (
        type ===
          "new" &&
        nextNewIndex <
          newImageCount
      ) {
        ordered.push({
          type:
            "new",
          index:
            nextNewIndex,
        });

        nextNewIndex += 1;
      }
    }
  }

  for (
    const id of remainingImageIds
  ) {
    if (
      !usedExisting.has(
        id,
      )
    ) {
      ordered.push({
        type:
          "existing",
        id,
      });
    }
  }

  while (
    nextNewIndex <
    newImageCount
  ) {
    ordered.push({
      type:
        "new",
      index:
        nextNewIndex,
    });

    nextNewIndex += 1;
  }

  return ordered;
}

const MEMORABILIA_TYPES = new Set([
  "TRADING_CARD",
  "SIGNED_JERSEY",
  "SIGNED_RACQUET",
  "SIGNED_BALL",
  "SIGNED_PHOTO",
  "SIGNED_ITEM",
  "RACQUET",
  "TROPHY",
  "PROGRAMME",
  "TICKET",
  "OTHER",
]);

const MEMORABILIA_STATUSES = new Set([
  "DRAFT",
  "PUBLISHED",
  "ARCHIVED",
]);

const MEMORABILIA_AVAILABILITIES = new Set([
  "AVAILABLE",
  "RESERVED",
  "SOLD",
  "COMING_SOON",
  "NOT_FOR_SALE",
]);

const MEMORABILIA_CONDITIONS = new Set([
  "MINT",
  "NEAR_MINT",
  "EXCELLENT",
  "VERY_GOOD",
  "GOOD",
  "FAIR",
  "POOR",
]);

const MEMORABILIA_RARITIES = new Set([
  "COMMON",
  "UNCOMMON",
  "RARE",
  "VERY_RARE",
  "ULTRA_RARE",
  "ONE_OF_ONE",
]);

function getString(
  formData: FormData,
  key: string,
): string {
  const value =
    formData.get(key);

  return typeof value === "string"
    ? value.trim()
    : "";
}

function getRequiredString(
  formData: FormData,
  key: string,
): string {
  const value =
    getString(
      formData,
      key,
    );

  if (!value) {
    throw new Error(
      `${key} is required.`,
    );
  }

  return value;
}

function getOptionalString(
  formData: FormData,
  key: string,
): string | null {
  const value =
    getString(
      formData,
      key,
    );

  return value || null;
}

function getOptionalNumber(
  formData: FormData,
  key: string,
): number | null {
  const raw =
    getString(
      formData,
      key,
    );

  if (!raw) {
    return null;
  }

  const value =
    Number(raw);

  if (!Number.isFinite(value)) {
    throw new Error(
      `${key} must be a valid number.`,
    );
  }

  return value;
}

function getBoolean(
  formData: FormData,
  key: string,
): boolean {
  return (
    formData.get(key) ===
    "on"
  );
}

function getTags(
  formData: FormData,
): string[] {
  const raw =
    getString(
      formData,
      "tags",
    );

  if (!raw) {
    return [];
  }

  return Array.from(
    new Set(
      raw
        .split(",")
        .map((tag) =>
          tag.trim(),
        )
        .filter(Boolean),
    ),
  );
}

function slugify(
  value: string,
): string {
  return value
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      "",
    )
    .toLowerCase()
    .trim()
    .replace(
      /[^a-z0-9]+/g,
      "-",
    )
    .replace(
      /^-+|-+$/g,
      "",
    );
}

async function createAvailableSlug(
  requestedValue: string,
  memorabiliaId: string,
): Promise<string> {
  const base =
    slugify(
      requestedValue,
    );

  if (!base) {
    throw new Error(
      "Unable to generate a valid slug.",
    );
  }

  const existing =
    await prisma.memorabilia.findFirst({
      where: {
        slug: base,
        id: {
          not: memorabiliaId,
        },
      },

      select: {
        id: true,
      },
    });

  return existing
    ? `${base}-${Date.now()}`
    : base;
}

function getEnumValue<T extends string>(
  value: string,
  allowedValues: Set<string>,
  fallback: T,
): T {
  return allowedValues.has(
    value,
  )
    ? (value as T)
    : fallback;
}

export async function updateMemorabilia(
  formData: FormData,
): Promise<never> {
  await requireAdmin();

  const memorabiliaId =
    getRequiredString(
      formData,
      "memorabiliaId",
    );

  const current =
    await prisma.memorabilia.findUnique({
      where: {
        id: memorabiliaId,
      },

      include: {
        images: {
          orderBy: {
            sortOrder:
              "asc",
          },
        },
      },
    });

  if (!current) {
    throw new Error(
      "Memorabilia item not found.",
    );
  }

  const newImages =
    getImageFiles(
      formData,
    );

  validateImageFiles(
    newImages,
  );

  const requestedRemovedImageIds =
    getStringArray(
      formData,
      "removedImageIds",
    );

  const currentImageIds =
    new Set(
      current.images.map(
        (image) =>
          image.id,
      ),
    );

  const removedImageIds =
    Array.from(
      new Set(
        requestedRemovedImageIds,
      ),
    );

  const invalidRemovedImage =
    removedImageIds.find(
      (id) =>
        !currentImageIds.has(
          id,
        ),
    );

  if (invalidRemovedImage) {
    throw new Error(
      "One or more selected images do not belong to this memorabilia item.",
    );
  }

  const removedImageIdSet =
    new Set(
      removedImageIds,
    );

  const remainingImages =
    current.images.filter(
      (image) =>
        !removedImageIdSet.has(
          image.id,
        ),
    );

  const finalImageCount =
    remainingImages.length +
    newImages.length;

  if (
    finalImageCount >
    MAX_MEMORABILIA_IMAGES
  ) {
    throw new Error(
      `A memorabilia item can contain a maximum of ${MAX_MEMORABILIA_IMAGES} images.`,
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

  const title =
    getRequiredString(
      formData,
      "title",
    );

  const inventoryNumber =
    getRequiredString(
      formData,
      "inventoryNumber",
    );

  const inventoryConflict =
    await prisma.memorabilia.findFirst({
      where: {
        inventoryNumber,
        id: {
          not: memorabiliaId,
        },
      },

      select: {
        id: true,
      },
    });

  if (inventoryConflict) {
    throw new Error(
      "Inventory number already in use.",
    );
  }

  const slug =
    await createAvailableSlug(
      getOptionalString(
        formData,
        "slug",
      ) ?? title,
      memorabiliaId,
    );

  const type =
    getEnumValue<MemorabiliaType>(
      getString(
        formData,
        "type",
      ),
      MEMORABILIA_TYPES,
      "OTHER",
    );

  const status =
    getEnumValue<MemorabiliaStatus>(
      getString(
        formData,
        "status",
      ),
      MEMORABILIA_STATUSES,
      "DRAFT",
    );

  const availability =
    getEnumValue<MemorabiliaAvailability>(
      getString(
        formData,
        "availability",
      ),
      MEMORABILIA_AVAILABILITIES,
      "COMING_SOON",
    );

  const conditionRaw =
    getString(
      formData,
      "condition",
    );

  const condition =
    conditionRaw
      ? getEnumValue<MemorabiliaCondition>(
          conditionRaw,
          MEMORABILIA_CONDITIONS,
          "EXCELLENT",
        )
      : null;

  const rarity =
    getEnumValue<MemorabiliaRarity>(
      getString(
        formData,
        "rarity",
      ),
      MEMORABILIA_RARITIES,
      "COMMON",
    );

  const playerId =
    getOptionalString(
      formData,
      "playerId",
    );

  if (playerId) {
    const player =
      await prisma.player.findUnique({
        where: {
          id: playerId,
        },

        select: {
          id: true,
        },
      });

    if (!player) {
      throw new Error(
        "Selected player does not exist.",
      );
    }
  }

  const price =
    getOptionalNumber(
      formData,
      "price",
    );

  if (
    price !== null &&
    price < 0
  ) {
    throw new Error(
      "Price cannot be negative.",
    );
  }

  const currency =
    (
      getOptionalString(
        formData,
        "currency",
      ) ?? "EUR"
    )
      .toUpperCase()
      .slice(0, 3);

  const uploadedImages:
    Array<{
      url: string;
      file: File;
    }> = [];

  try {
    for (
      const file of newImages
    ) {
      const url =
        await uploadMemorabiliaImage(
          memorabiliaId,
          file,
        );

      uploadedImages.push({
        url,
        file,
      });
    }
  } catch (error) {
    await Promise.allSettled(
      uploadedImages.map(
        ({ url }) =>
          deleteStoredMemorabiliaImage(
            url,
          ),
      ),
    );

    throw error;
  }

  const removedImages =
    current.images.filter(
      (image) =>
        removedImageIdSet.has(
          image.id,
        ),
    );

  const submittedOrder =
    getSubmittedMediaOrder(
      formData,
      remainingImages.map(
        (image) =>
          image.id,
      ),
      uploadedImages.length,
    );

  try {
    await prisma.$transaction(
      async (transaction) => {
        await transaction.memorabilia.update({
          where: {
            id:
              memorabiliaId,
          },

          data: {
      inventoryNumber,
      title,

      subtitle:
        getOptionalString(
          formData,
          "subtitle",
        ),

      slug,

      description:
        getOptionalString(
          formData,
          "description",
        ),

      type,
      status,
      availability,
      condition,
      rarity,

      featured:
        getBoolean(
          formData,
          "featured",
        ),

      displayOrder:
        getOptionalNumber(
          formData,
          "displayOrder",
        ),

      playerId,

      year:
        getOptionalNumber(
          formData,
          "year",
        ),

      brand:
        getOptionalString(
          formData,
          "brand",
        ),

      collection:
        getOptionalString(
          formData,
          "collection",
        ),

      edition:
        getOptionalString(
          formData,
          "edition",
        ),

      serialNumber:
        getOptionalString(
          formData,
          "serialNumber",
        ),

      cardSet:
        getOptionalString(
          formData,
          "cardSet",
        ),

      cardNumber:
        getOptionalString(
          formData,
          "cardNumber",
        ),

      gradingCompany:
        getOptionalString(
          formData,
          "gradingCompany",
        ),

      grade:
        getOptionalString(
          formData,
          "grade",
        ),

      gradingCertNumber:
        getOptionalString(
          formData,
          "gradingCertNumber",
        ),

      signed:
        getBoolean(
          formData,
          "signed",
        ),

      signedBy:
        getOptionalString(
          formData,
          "signedBy",
        ),

      signatureLocation:
        getOptionalString(
          formData,
          "signatureLocation",
        ),

      authentic:
        getBoolean(
          formData,
          "authentic",
        ),

      authenticationCompany:
        getOptionalString(
          formData,
          "authenticationCompany",
        ),

      authenticityCode:
        getOptionalString(
          formData,
          "authenticityCode",
        ),

      certificateUrl:
        getOptionalString(
          formData,
          "certificateUrl",
        ),

      material:
        getOptionalString(
          formData,
          "material",
        ),

      size:
        getOptionalString(
          formData,
          "size",
        ),

      colour:
        getOptionalString(
          formData,
          "colour",
        ),

      price,
      currency,

      tags:
        getTags(
          formData,
        ),

      metaTitle:
        getOptionalString(
          formData,
          "metaTitle",
        ),

      metaDescription:
        getOptionalString(
          formData,
          "metaDescription",
        ),

      publishedAt:
        status === "PUBLISHED"
          ? current.publishedAt ??
            new Date()
          : null,
          },
        });

        if (
          removedImageIds.length >
          0
        ) {
          await transaction.memorabiliaImage.deleteMany({
            where: {
              memorabiliaId,

              id: {
                in:
                  removedImageIds,
              },
            },
          });
        }

        await transaction.memorabiliaImage.updateMany({
          where: {
            memorabiliaId,
          },

          data: {
            isCover:
              false,
          },
        });

        const createdImages:
          Array<{
            id: string;
            index: number;
          }> = [];

        for (
          const [
            index,
            uploadedImage,
          ] of uploadedImages.entries()
        ) {
          const created =
            await transaction.memorabiliaImage.create({
              data: {
                memorabiliaId,

                url:
                  uploadedImage.url,

                alt:
                  `${title} — image ${index + 1}`,

                sortOrder:
                  remainingImages.length +
                  index,

                isCover:
                  false,
              },
            });

          createdImages.push({
            id:
              created.id,

            index,
          });
        }

        for (
          const [
            sortOrder,
            item,
          ] of submittedOrder.entries()
        ) {
          const imageId =
            item.type ===
            "existing"
              ? item.id
              : createdImages.find(
                  (image) =>
                    image.index ===
                    item.index,
                )?.id;

          if (!imageId) {
            continue;
          }

          await transaction.memorabiliaImage.update({
            where: {
              id:
                imageId,
            },

            data: {
              sortOrder,

              alt:
                `${title} — image ${sortOrder + 1}`,
            },
          });
        }

        let coverImageId:
          string | undefined;

        if (
          requestedExistingCoverImageId
        ) {
          coverImageId =
            requestedExistingCoverImageId;
        } else if (
          submittedNewCoverIndex >=
          0
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
              (image) =>
                image.isCover,
            )?.id ??
            submittedOrder
              .map(
                (item) =>
                  item.type ===
                  "existing"
                    ? item.id
                    : createdImages.find(
                        (image) =>
                          image.index ===
                          item.index,
                      )?.id,
              )
              .find(
                (
                  value,
                ): value is string =>
                  Boolean(value),
              );
        }

        if (coverImageId) {
          await transaction.memorabiliaImage.update({
            where: {
              id:
                coverImageId,
            },

            data: {
              isCover:
                true,
            },
          });
        }
      },
    );
  } catch (error) {
    await Promise.allSettled(
      uploadedImages.map(
        ({ url }) =>
          deleteStoredMemorabiliaImage(
            url,
          ),
      ),
    );

    throw error;
  }

  await Promise.allSettled(
    removedImages.map(
      (image) =>
        deleteStoredMemorabiliaImage(
          image.url,
        ),
    ),
  );


  try {
    await syncMemorabiliaWithStripe(
      memorabiliaId,
    );
  } catch (error) {
    console.error(
      `Sincronizzazione Stripe automatica fallita per Memorabilia ${memorabiliaId}:`,
      error,
    );
  }

  revalidatePath(
    "/admin",
  );

  revalidatePath(
    "/admin/memorabilia",
  );

  revalidatePath(
    `/admin/memorabilia/${memorabiliaId}`,
  );

  revalidatePath(
    "/memorabilia",
  );

  revalidatePath(
    `/memorabilia/${current.slug}`,
  );

  revalidatePath(
    `/memorabilia/${slug}`,
  );

  redirect(
    "/admin/memorabilia",
  );
}