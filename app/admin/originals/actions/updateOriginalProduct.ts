"use server";

import {
  revalidatePath,
} from "next/cache";
import { redirect } from "next/navigation";

import {
  requireAdmin,
} from "@/lib/auth/admin-auth";

import { prisma } from "@/lib/prisma";

import {
  deleteArtifactImage as deleteStoredImage,
  uploadArtifactImage,
} from "@/lib/services/artifactStorage.service";

import {
  MAX_ORIGINAL_IMAGES,
  getBoolean,
  getCommaSeparatedValues,
  getImageFiles,
  getOptionalNumber,
  getOptionalString,
  getOriginalAvailability,
  getOriginalCategory,
  getOriginalStatus,
  getRequiredString,
  getStringArray,
  slugify,
} from "./originalForm.utils";

type SubmittedMediaOrderItem =
  | {
      type: "existing";
      imageId: string;
    }
  | {
      type: "library";
      mediaAssetId: string;
    }
  | {
      type: "new";
    };

async function createAvailableSlug(
  requestedValue: string,
  productId: string,
): Promise<string> {
  const baseSlug =
    slugify(requestedValue);

  if (!baseSlug) {
    throw new Error(
      "Unable to generate a valid slug.",
    );
  }

  const existing =
    await prisma.originalProduct.findFirst(
      {
        where: {
          slug: baseSlug,
          id: {
            not: productId,
          },
        },
        select: {
          id: true,
        },
      },
    );

  return existing
    ? `${baseSlug}-${Date.now()}`
    : baseSlug;
}

function parseMediaOrder(
  formData: FormData,
): SubmittedMediaOrderItem[] {
  const rawOrder =
    getOptionalString(
      formData,
      "mediaOrder",
    );

  if (!rawOrder) {
    return [];
  }

  return rawOrder
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .flatMap(
      (
        entry,
      ): SubmittedMediaOrderItem[] => {
        const [
          type,
          value,
        ] = entry.split(":");

        if (
          type === "existing" &&
          value?.trim()
        ) {
          return [
            {
              type: "existing",
              imageId:
                value.trim(),
            },
          ];
        }

        if (
          type === "library" &&
          value?.trim()
        ) {
          return [
            {
              type: "library",
              mediaAssetId:
                value.trim(),
            },
          ];
        }

        if (type === "new") {
          return [
            {
              type: "new",
            },
          ];
        }

        return [];
      },
    );
}

export async function updateOriginalProduct(
  formData: FormData,
): Promise<void> {
  await requireAdmin();

  const productId =
    getRequiredString(
      formData,
      "productId",
    );

  const title =
    getRequiredString(
      formData,
      "title",
    );

  const current =
    await prisma.originalProduct.findUnique(
      {
        where: {
          id: productId,
        },
        include: {
          images: {
            orderBy: {
              sortOrder: "asc",
            },
          },
        },
      },
    );

  if (!current) {
    throw new Error(
      "The Original product could not be found.",
    );
  }

  const newImageFiles =
    getImageFiles(formData);

  const selectedMediaAssetIds =
    Array.from(
      new Set(
        getStringArray(
          formData,
          "selectedMediaAssetIds",
        ),
      ),
    );

  const requestedRemovedIds =
    Array.from(
      new Set(
        getStringArray(
          formData,
          "removedImageIds",
        ),
      ),
    );

  const currentImageIds =
    new Set(
      current.images.map(
        (image) => image.id,
      ),
    );

  if (
    requestedRemovedIds.some(
      (id) =>
        !currentImageIds.has(id),
    )
  ) {
    throw new Error(
      "One or more selected images do not belong to this product.",
    );
  }

  const removedIdSet =
    new Set(
      requestedRemovedIds,
    );

  const remainingImages =
    current.images.filter(
      (image) =>
        !removedIdSet.has(
          image.id,
        ),
    );

  if (
    remainingImages.length +
      newImageFiles.length +
      selectedMediaAssetIds.length >
    MAX_ORIGINAL_IMAGES
  ) {
    throw new Error(
      `An Original product can contain a maximum of ${MAX_ORIGINAL_IMAGES} images.`,
    );
  }

  const libraryAssets =
    selectedMediaAssetIds.length > 0
      ? await prisma.mediaAsset.findMany(
          {
            where: {
              id: {
                in: selectedMediaAssetIds,
              },
            },
          },
        )
      : [];

  if (
    libraryAssets.length !==
    selectedMediaAssetIds.length
  ) {
    throw new Error(
      "One or more selected Media Library images could not be found.",
    );
  }

  const libraryAssetMap =
    new Map(
      libraryAssets.map(
        (asset) => [
          asset.id,
          asset,
        ],
      ),
    );

  const requestedExistingCoverId =
    getOptionalString(
      formData,
      "existingCoverImageId",
    );

  if (
    requestedExistingCoverId &&
    !remainingImages.some(
      (image) =>
        image.id ===
        requestedExistingCoverId,
    )
  ) {
    throw new Error(
      "The selected existing cover image is not available.",
    );
  }

  const requestedLibraryCoverId =
    getOptionalString(
      formData,
      "libraryCoverMediaAssetId",
    );

  if (
    requestedLibraryCoverId &&
    !libraryAssetMap.has(
      requestedLibraryCoverId,
    )
  ) {
    throw new Error(
      "The selected Media Library cover image is not available.",
    );
  }

  const submittedOrder =
    parseMediaOrder(formData);

  const orderedItems:
    SubmittedMediaOrderItem[] = [];

  const usedExistingIds =
    new Set<string>();

  const usedLibraryIds =
    new Set<string>();

  let usedNewCount = 0;

  for (const item of submittedOrder) {
    if (
      item.type === "existing" &&
      remainingImages.some(
        (image) =>
          image.id ===
          item.imageId,
      ) &&
      !usedExistingIds.has(
        item.imageId,
      )
    ) {
      orderedItems.push(item);
      usedExistingIds.add(
        item.imageId,
      );
    }

    if (
      item.type === "library" &&
      libraryAssetMap.has(
        item.mediaAssetId,
      ) &&
      !usedLibraryIds.has(
        item.mediaAssetId,
      )
    ) {
      orderedItems.push(item);
      usedLibraryIds.add(
        item.mediaAssetId,
      );
    }

    if (
      item.type === "new" &&
      usedNewCount <
        newImageFiles.length
    ) {
      orderedItems.push(item);
      usedNewCount += 1;
    }
  }

  for (const image of remainingImages) {
    if (
      !usedExistingIds.has(
        image.id,
      )
    ) {
      orderedItems.push({
        type: "existing",
        imageId: image.id,
      });
    }
  }

  for (const id of selectedMediaAssetIds) {
    if (!usedLibraryIds.has(id)) {
      orderedItems.push({
        type: "library",
        mediaAssetId: id,
      });
    }
  }

  while (
    usedNewCount <
    newImageFiles.length
  ) {
    orderedItems.push({
      type: "new",
    });

    usedNewCount += 1;
  }

  const slug =
    await createAvailableSlug(
      getOptionalString(
        formData,
        "slug",
      ) ?? title,
      productId,
    );

  const status =
    getOriginalStatus(formData);

  const uploadedImages: Array<{
    url: string;
    file: File;
  }> = [];

  try {
    for (const file of newImageFiles) {
      const url =
        await uploadArtifactImage(
          productId,
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
          deleteStoredImage(url),
      ),
    );

    throw error;
  }

  const removedImages =
    current.images.filter(
      (image) =>
        removedIdSet.has(
          image.id,
        ),
    );

  try {
    await prisma.$transaction(
      async (transaction) => {
        await transaction.originalProduct.update(
          {
            where: {
              id: productId,
            },
            data: {
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
              category:
                getOriginalCategory(
                  formData,
                ),
              material:
                getOptionalString(
                  formData,
                  "material",
                ),
              colour:
                getOptionalString(
                  formData,
                  "colour",
                ),
              sizes:
                getCommaSeparatedValues(
                  formData,
                  "sizes",
                ),
              tags:
                getCommaSeparatedValues(
                  formData,
                  "tags",
                ),
              price:
                getOptionalNumber(
                  formData,
                  "price",
                ),
              currency:
                getOptionalString(
                  formData,
                  "currency",
                ) ?? "EUR",
              vintedUrl:
                getOptionalString(
                  formData,
                  "vintedUrl",
                ),
              availability:
                getOriginalAvailability(
                  formData,
                ),
              status,
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
          },
        );

        if (
          requestedRemovedIds.length >
          0
        ) {
          await transaction.originalProductImage.deleteMany(
            {
              where: {
                originalProductId:
                  productId,
                id: {
                  in: requestedRemovedIds,
                },
              },
            },
          );
        }

        await transaction.originalProductImage.updateMany(
          {
            where: {
              originalProductId:
                productId,
            },
            data: {
              isCover: false,
            },
          },
        );

        const existingImageMap =
          new Map(
            remainingImages.map(
              (image) => [
                image.id,
                image,
              ],
            ),
          );

        let uploadedIndex = 0;

        let selectedCoverImageId:
          string | undefined;

        for (const [
          sortOrder,
          item,
        ] of orderedItems.entries()) {
          if (
            item.type === "existing"
          ) {
            const existingImage =
              existingImageMap.get(
                item.imageId,
              );

            if (!existingImage) {
              continue;
            }

            await transaction.originalProductImage.update(
              {
                where: {
                  id:
                    existingImage.id,
                },
                data: {
                  alt:
                    existingImage.alt ??
                    `${title} — image ${
                      sortOrder + 1
                    }`,
                  sortOrder,
                },
              },
            );

            if (
              item.imageId ===
              requestedExistingCoverId
            ) {
              selectedCoverImageId =
                item.imageId;
            }

            continue;
          }

          if (
            item.type === "library"
          ) {
            const asset =
              libraryAssetMap.get(
                item.mediaAssetId,
              );

            if (!asset) {
              throw new Error(
                "A selected Media Library asset is no longer available.",
              );
            }

            const created =
              await transaction.originalProductImage.create(
                {
                  data: {
                    originalProductId:
                      productId,
                    url: asset.url,
                    alt:
                      asset.alt ??
                      asset.title ??
                      `${title} — image ${
                        sortOrder + 1
                      }`,
                    sortOrder,
                    isCover: false,
                  },
                },
              );

            if (
              item.mediaAssetId ===
              requestedLibraryCoverId
            ) {
              selectedCoverImageId =
                created.id;
            }

            continue;
          }

          const uploaded =
            uploadedImages[
              uploadedIndex
            ];

          uploadedIndex += 1;

          if (!uploaded) {
            continue;
          }

          const created =
            await transaction.originalProductImage.create(
              {
                data: {
                  originalProductId:
                    productId,
                  url: uploaded.url,
                  alt: `${title} — image ${
                    sortOrder + 1
                  }`,
                  sortOrder,
                  isCover: false,
                },
              },
            );

          if (
            !selectedCoverImageId &&
            !requestedExistingCoverId &&
            !requestedLibraryCoverId
          ) {
            const requestedNewCoverIndex =
              Number.parseInt(
                getOptionalString(
                  formData,
                  "coverImageIndex",
                ) ?? "-1",
                10,
              );

            if (
              requestedNewCoverIndex ===
              uploadedIndex - 1
            ) {
              selectedCoverImageId =
                created.id;
            }
          }
        }

        if (
          selectedMediaAssetIds.length >
          0
        ) {
          await transaction.mediaAsset.updateMany(
            {
              where: {
                id: {
                  in: selectedMediaAssetIds,
                },
              },
              data: {
                isUsed: true,
              },
            },
          );
        }

        if (!selectedCoverImageId) {
          const previousCover =
            remainingImages.find(
              (image) =>
                image.isCover,
            );

          if (
            previousCover &&
            !removedIdSet.has(
              previousCover.id,
            )
          ) {
            selectedCoverImageId =
              previousCover.id;
          }
        }

        if (!selectedCoverImageId) {
          const firstImage =
            await transaction.originalProductImage.findFirst(
              {
                where: {
                  originalProductId:
                    productId,
                },
                orderBy: {
                  sortOrder: "asc",
                },
                select: {
                  id: true,
                },
              },
            );

          selectedCoverImageId =
            firstImage?.id;
        }

        if (selectedCoverImageId) {
          await transaction.originalProductImage.update(
            {
              where: {
                id:
                  selectedCoverImageId,
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
      uploadedImages.map(
        ({ url }) =>
          deleteStoredImage(url),
      ),
    );

    throw error;
  }

  await Promise.allSettled(
    removedImages.map((image) =>
      deleteStoredImage(
        image.url,
      ),
    ),
  );

  revalidatePath(
    "/admin/originals",
  );
  revalidatePath(
    `/admin/originals/${productId}`,
  );
  revalidatePath(
    "/age202-originals",
  );
  revalidatePath(
    `/age202-originals/${current.slug}`,
  );
  revalidatePath(
    `/age202-originals/${slug}`,
  );

  redirect(
    "/admin/originals",
  );
}