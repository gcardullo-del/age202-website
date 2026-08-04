"use server";

import {
  revalidatePath,
} from "next/cache";
import { redirect } from "next/navigation";

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
      type: "library";
      mediaAssetId: string;
    }
  | {
      type: "new";
    };

async function createAvailableSlug(
  requestedValue: string,
): Promise<string> {
  const baseSlug =
    slugify(requestedValue);

  if (!baseSlug) {
    throw new Error(
      "Unable to generate a valid slug.",
    );
  }

  const existing =
    await prisma.originalProduct.findUnique(
      {
        where: {
          slug: baseSlug,
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

export async function createOriginalProduct(
  formData: FormData,
): Promise<void> {
  const title =
    getRequiredString(
      formData,
      "title",
    );

  const status =
    getOriginalStatus(formData);

  const imageFiles =
    getImageFiles(formData);

  const submittedMediaAssetIds =
    Array.from(
      new Set(
        getStringArray(
          formData,
          "selectedMediaAssetIds",
        ),
      ),
    );

  if (
    imageFiles.length +
      submittedMediaAssetIds.length >
    MAX_ORIGINAL_IMAGES
  ) {
    throw new Error(
      `An Original product can contain a maximum of ${MAX_ORIGINAL_IMAGES} images.`,
    );
  }

  const libraryAssets =
    submittedMediaAssetIds.length > 0
      ? await prisma.mediaAsset.findMany(
          {
            where: {
              id: {
                in: submittedMediaAssetIds,
              },
            },
          },
        )
      : [];

  if (
    libraryAssets.length !==
    submittedMediaAssetIds.length
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
      "The selected Media Library cover is not available.",
    );
  }

  const submittedOrder =
    parseMediaOrder(formData);

  const orderedItems:
    SubmittedMediaOrderItem[] = [];

  const orderedLibraryIds =
    new Set<string>();

  let orderedNewCount = 0;

  for (const item of submittedOrder) {
    if (
      item.type === "library" &&
      libraryAssetMap.has(
        item.mediaAssetId,
      ) &&
      !orderedLibraryIds.has(
        item.mediaAssetId,
      )
    ) {
      orderedItems.push(item);
      orderedLibraryIds.add(
        item.mediaAssetId,
      );
    }

    if (
      item.type === "new" &&
      orderedNewCount <
        imageFiles.length
    ) {
      orderedItems.push(item);
      orderedNewCount += 1;
    }
  }

  for (const id of submittedMediaAssetIds) {
    if (!orderedLibraryIds.has(id)) {
      orderedItems.push({
        type: "library",
        mediaAssetId: id,
      });
    }
  }

  while (
    orderedNewCount <
    imageFiles.length
  ) {
    orderedItems.push({
      type: "new",
    });

    orderedNewCount += 1;
  }

  const slug =
    await createAvailableSlug(
      getOptionalString(
        formData,
        "slug",
      ) ?? title,
    );

  const product =
    await prisma.originalProduct.create(
      {
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
              ? new Date()
              : null,
        },
      },
    );

  const uploadedUrls: string[] =
    [];

  try {
    const uploadedImages: Array<{
      url: string;
      file: File;
    }> = [];

    for (const file of imageFiles) {
      const url =
        await uploadArtifactImage(
          product.id,
          file,
        );

      uploadedUrls.push(url);
      uploadedImages.push({
        url,
        file,
      });
    }

    let nextUploadedIndex = 0;

    await prisma.$transaction(
      async (transaction) => {
        for (const [
          sortOrder,
          item,
        ] of orderedItems.entries()) {
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

            await transaction.originalProductImage.create(
              {
                data: {
                  originalProductId:
                    product.id,
                  url: asset.url,
                  alt:
                    asset.alt ??
                    asset.title ??
                    `${title} — image ${
                      sortOrder + 1
                    }`,
                  sortOrder,
                  isCover:
                    item.mediaAssetId ===
                    requestedLibraryCoverId,
                },
              },
            );

            continue;
          }

          const uploaded =
            uploadedImages[
              nextUploadedIndex
            ];

          nextUploadedIndex += 1;

          if (!uploaded) {
            continue;
          }

          await transaction.originalProductImage.create(
            {
              data: {
                originalProductId:
                  product.id,
                url: uploaded.url,
                alt: `${title} — image ${
                  sortOrder + 1
                }`,
                sortOrder,
                isCover: false,
              },
            },
          );
        }

        if (
          submittedMediaAssetIds.length >
          0
        ) {
          await transaction.mediaAsset.updateMany(
            {
              where: {
                id: {
                  in: submittedMediaAssetIds,
                },
              },
              data: {
                isUsed: true,
              },
            },
          );
        }

        const currentCover =
          await transaction.originalProductImage.findFirst(
            {
              where: {
                originalProductId:
                  product.id,
                isCover: true,
              },
              select: {
                id: true,
              },
            },
          );

        if (!currentCover) {
          const firstImage =
            await transaction.originalProductImage.findFirst(
              {
                where: {
                  originalProductId:
                    product.id,
                },
                orderBy: {
                  sortOrder: "asc",
                },
                select: {
                  id: true,
                },
              },
            );

          if (firstImage) {
            await transaction.originalProductImage.update(
              {
                where: {
                  id: firstImage.id,
                },
                data: {
                  isCover: true,
                },
              },
            );
          }
        }
      },
    );
  } catch (error) {
    await Promise.allSettled(
      uploadedUrls.map((url) =>
        deleteStoredImage(url),
      ),
    );

    await prisma.originalProduct
      .delete({
        where: {
          id: product.id,
        },
      })
      .catch(() => undefined);

    throw error;
  }

  revalidatePath(
    "/admin/originals",
  );
  revalidatePath(
    "/age202-originals",
  );
  revalidatePath(
    `/age202-originals/${slug}`,
  );

  redirect(
    "/admin/originals",
  );
}
