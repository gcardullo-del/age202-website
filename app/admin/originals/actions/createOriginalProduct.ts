"use server";

import {
  revalidatePath,
} from "next/cache";

import {
  redirect,
} from "next/navigation";

import {
  requireAdmin,
} from "@/lib/auth/admin-auth";

import {
  prisma,
} from "@/lib/prisma";

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


type SubmittedVariantStock = {
  size: string;
  stock: number;
  active: boolean;
};


type SubmittedVariant = {
  id: string | null;
  mediaKey: string;
  name: string;
  colour: string;
  colourHex: string | null;
  logoTone:
    | "BLACK"
    | "WHITE";
  sku: string | null;
  active: boolean;
  isDefault: boolean;
  sortOrder: number;
  stock: SubmittedVariantStock[];
};


type SubmittedBrowserImage = {
  id: string;
  url: string;
  path: string | null;
  alt: string | null;
};


type SubmittedVariantMediaOrderItem =
  | {
      type: "library";
      mediaAssetId: string;
    }
  | {
      type: "new";
      uploadId: string;
    };


type SubmittedVariantMedia = {
  mediaKey: string;
  selectedMediaAssetIds: string[];
  libraryCoverMediaAssetId: string | null;
  browserUploadedCoverId: string | null;
  browserUploadedImages: SubmittedBrowserImage[];
  order: SubmittedVariantMediaOrderItem[];
};


function isRecord(
  value: unknown,
): value is Record<
  string,
  unknown
> {
  return (
    typeof value ===
      "object" &&
    value !== null &&
    !Array.isArray(
      value,
    )
  );
}


function parseBoolean(
  value: unknown,
  fallback: boolean,
): boolean {
  return typeof value ===
    "boolean"
    ? value
    : fallback;
}


function parseInteger(
  value: unknown,
  fallback: number,
): number {
  if (
    typeof value ===
      "number" &&
    Number.isFinite(
      value,
    )
  ) {
    return Math.trunc(
      value,
    );
  }

  if (
    typeof value ===
    "string"
  ) {
    const parsed =
      Number.parseInt(
        value,
        10,
      );

    if (
      Number.isFinite(
        parsed,
      )
    ) {
      return parsed;
    }
  }

  return fallback;
}


function parseOptionalStringValue(
  value: unknown,
): string | null {
  if (
    typeof value !==
    "string"
  ) {
    return null;
  }

  const normalized =
    value.trim();

  return normalized
    ? normalized
    : null;
}


function parseVariantStock(
  value: unknown,
): SubmittedVariantStock[] {
  if (
    !Array.isArray(
      value,
    )
  ) {
    return [];
  }

  const seenSizes =
    new Set<string>();

  const stockItems:
    SubmittedVariantStock[] =
      [];

  for (
    const rawItem
    of value
  ) {
    if (
      !isRecord(
        rawItem,
      )
    ) {
      continue;
    }

    const rawSize =
      parseOptionalStringValue(
        rawItem.size,
      );

    if (!rawSize) {
      continue;
    }

    const size =
      rawSize.toUpperCase();

    if (
      seenSizes.has(
        size,
      )
    ) {
      throw new Error(
        `Duplicate size "${size}" found in an Original variant.`,
      );
    }

    seenSizes.add(
      size,
    );

    const stock =
      Math.max(
        0,
        parseInteger(
          rawItem.stock,
          0,
        ),
      );

    stockItems.push({
      size,
      stock,
      active:
        parseBoolean(
          rawItem.active,
          true,
        ),
    });
  }

  return stockItems;
}


function buildVariantMediaFieldName(
  mediaKey: string,
  baseName: string,
): string {
  return `variantMedia_${mediaKey}_${baseName}`;
}


function parseBrowserUploadedImages(
  formData: FormData,
  mediaKey: string,
): SubmittedBrowserImage[] {
  const rawJson =
    getOptionalString(
      formData,
      buildVariantMediaFieldName(
        mediaKey,
        "browserUploadedImages",
      ),
    );

  if (!rawJson) {
    return [];
  }

  let parsed: unknown;

  try {
    parsed =
      JSON.parse(rawJson);
  } catch {
    throw new Error(
      `The submitted media for variant "${mediaKey}" is not valid JSON.`,
    );
  }

  if (!Array.isArray(parsed)) {
    throw new Error(
      `The submitted media for variant "${mediaKey}" is invalid.`,
    );
  }

  const seenIds =
    new Set<string>();

  const images:
    SubmittedBrowserImage[] = [];

  for (const rawImage of parsed) {
    if (!isRecord(rawImage)) {
      continue;
    }

    const id =
      parseOptionalStringValue(
        rawImage.id,
      );

    const url =
      parseOptionalStringValue(
        rawImage.url,
      );

    if (!id || !url) {
      continue;
    }

    if (seenIds.has(id)) {
      continue;
    }

    seenIds.add(id);

    images.push({
      id,
      url,
      path:
        parseOptionalStringValue(
          rawImage.path,
        ),
      alt:
        parseOptionalStringValue(
          rawImage.alt,
        ),
    });
  }

  return images;
}


function parseVariantMediaOrder(
  formData: FormData,
  mediaKey: string,
): SubmittedVariantMediaOrderItem[] {
  const rawOrder =
    getOptionalString(
      formData,
      buildVariantMediaFieldName(
        mediaKey,
        "mediaOrder",
      ),
    );

  if (!rawOrder) {
    return [];
  }

  return rawOrder
    .split(",")
    .map(
      (entry) =>
        entry.trim(),
    )
    .filter(Boolean)
    .flatMap(
      (
        entry,
      ): SubmittedVariantMediaOrderItem[] => {
        const [
          type,
          value,
        ] =
          entry.split(":");

        const normalizedValue =
          value?.trim();

        if (
          type === "library" &&
          normalizedValue
        ) {
          return [
            {
              type: "library",
              mediaAssetId:
                normalizedValue,
            },
          ];
        }

        if (
          type === "new" &&
          normalizedValue
        ) {
          return [
            {
              type: "new",
              uploadId:
                normalizedValue,
            },
          ];
        }

        return [];
      },
    );
}


function parseVariantMedia(
  formData: FormData,
  mediaKey: string,
): SubmittedVariantMedia {
  const selectedMediaAssetIds =
    Array.from(
      new Set(
        getStringArray(
          formData,
          buildVariantMediaFieldName(
            mediaKey,
            "selectedMediaAssetIds",
          ),
        ),
      ),
    );

  const browserUploadedImages =
    parseBrowserUploadedImages(
      formData,
      mediaKey,
    );

  if (
    selectedMediaAssetIds.length +
      browserUploadedImages.length >
    MAX_ORIGINAL_IMAGES
  ) {
    throw new Error(
      `Variant "${mediaKey}" can contain a maximum of ${MAX_ORIGINAL_IMAGES} images.`,
    );
  }

  return {
    mediaKey,
    selectedMediaAssetIds,

    libraryCoverMediaAssetId:
      getOptionalString(
        formData,
        buildVariantMediaFieldName(
          mediaKey,
          "libraryCoverMediaAssetId",
        ),
      ),

    browserUploadedCoverId:
      getOptionalString(
        formData,
        buildVariantMediaFieldName(
          mediaKey,
          "browserUploadedCoverId",
        ),
      ),

    browserUploadedImages,

    order:
      parseVariantMediaOrder(
        formData,
        mediaKey,
      ),
  };
}


function parseVariants(
  formData: FormData,
): SubmittedVariant[] {
  const rawJson =
    getOptionalString(
      formData,
      "variantsJson",
    );

  if (!rawJson) {
    return [];
  }

  let parsed:
    unknown;

  try {
    parsed =
      JSON.parse(
        rawJson,
      );
  } catch {
    throw new Error(
      "The submitted Original variants data is not valid JSON.",
    );
  }

  if (
    !Array.isArray(
      parsed,
    )
  ) {
    throw new Error(
      "The submitted Original variants data is invalid.",
    );
  }

  const variants:
    SubmittedVariant[] =
      [];

  const seenSkus =
    new Set<string>();

  for (
    const [
      index,
      rawVariant,
    ]
    of parsed.entries()
  ) {
    if (
      !isRecord(
        rawVariant,
      )
    ) {
      throw new Error(
        `Original variant ${
          index + 1
        } is invalid.`,
      );
    }

    const mediaKey =
      parseOptionalStringValue(
        rawVariant.mediaKey,
      );

    if (
      !mediaKey ||
      !/^[A-Za-z0-9_-]+$/.test(
        mediaKey,
      )
    ) {
      throw new Error(
        `Original variant ${
          index + 1
        } has an invalid media key.`,
      );
    }

    const name =
      parseOptionalStringValue(
        rawVariant.name,
      );

    const colour =
      parseOptionalStringValue(
        rawVariant.colour,
      );

    if (!name) {
      throw new Error(
        `Original variant ${
          index + 1
        } requires a name.`,
      );
    }

    if (!colour) {
      throw new Error(
        `Original variant "${name}" requires a colour.`,
      );
    }

    const rawLogoTone =
      parseOptionalStringValue(
        rawVariant.logoTone,
      );

    if (
      rawLogoTone !==
        "BLACK" &&
      rawLogoTone !==
        "WHITE"
    ) {
      throw new Error(
        `Original variant "${name}" has an invalid AGE202 logo tone.`,
      );
    }

    const sku =
      parseOptionalStringValue(
        rawVariant.sku,
      );

    if (sku) {
      const normalizedSku =
        sku.toUpperCase();

      if (
        seenSkus.has(
          normalizedSku,
        )
      ) {
        throw new Error(
          `Duplicate SKU "${sku}" found in the submitted variants.`,
        );
      }

      seenSkus.add(
        normalizedSku,
      );
    }

    variants.push({
      id:
        parseOptionalStringValue(
          rawVariant.id,
        ),

      mediaKey,

      name,


      colour,

      colourHex:
        parseOptionalStringValue(
          rawVariant.colourHex,
        ),

      logoTone:
        rawLogoTone,

      sku,

      active:
        parseBoolean(
          rawVariant.active,
          true,
        ),

      isDefault:
        parseBoolean(
          rawVariant.isDefault,
          false,
        ),

      sortOrder:
        Math.max(
          0,
          parseInteger(
            rawVariant.sortOrder,
            index,
          ),
        ),

      stock:
        parseVariantStock(
          rawVariant.stock,
        ),
    });
  }

  /*
   * A product can have only one
   * default variant.
   *
   * If the form did not mark one,
   * the first variant becomes the
   * default automatically.
   */
  if (
    variants.length >
    0
  ) {
    const defaultIndexes =
      variants
        .map(
          (
            variant,
            index,
          ) =>
            variant.isDefault
              ? index
              : -1,
        )
        .filter(
          (index) =>
            index >= 0,
        );

    const defaultIndex =
      defaultIndexes[0] ??
      0;

    for (
      let index = 0;
      index <
      variants.length;
      index += 1
    ) {
      variants[
        index
      ].isDefault =
        index ===
        defaultIndex;

      /*
       * The form order is the
       * authoritative display order.
       */
      variants[
        index
      ].sortOrder =
        index;
    }
  }

  return variants;
}


async function createAvailableSlug(
  requestedValue: string,
): Promise<string> {
  const baseSlug =
    slugify(
      requestedValue,
    );

  if (!baseSlug) {
    throw new Error(
      "Unable to generate a valid slug.",
    );
  }

  const existing =
    await prisma.originalProduct.findUnique(
      {
        where: {
          slug:
            baseSlug,
        },

        select: {
          id:
            true,
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
    .map(
      (entry) =>
        entry.trim(),
    )
    .filter(Boolean)
    .flatMap(
      (
        entry,
      ): SubmittedMediaOrderItem[] => {
        const [
          type,
          value,
        ] =
          entry.split(
            ":",
          );

        if (
          type ===
            "library" &&
          value?.trim()
        ) {
          return [
            {
              type:
                "library",

              mediaAssetId:
                value.trim(),
            },
          ];
        }

        if (
          type ===
          "new"
        ) {
          return [
            {
              type:
                "new",
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
  await requireAdmin();


  const title =
    getRequiredString(
      formData,
      "title",
    );


  const status =
    getOriginalStatus(
      formData,
    );


  const variants =
    parseVariants(
      formData,
    );


  const variantMedia =
    variants.map(
      (variant) =>
        parseVariantMedia(
          formData,
          variant.mediaKey,
        ),
    );


  const variantBrowserUploadedUrls =
    variantMedia.flatMap(
      (media) =>
        media.browserUploadedImages.map(
          (image) =>
            image.url,
        ),
    );


  /*
   * Keep the old product-level
   * colour and sizes populated for
   * backward compatibility while
   * the public shop is migrated to
   * the new variant architecture.
   */
  const defaultVariant =
    variants.find(
      (variant) =>
        variant.isDefault,
    ) ??
    variants[0] ??
    null;


  const legacyColour =
    defaultVariant?.colour ??
    null;


  const legacySizes =
    defaultVariant
      ? defaultVariant.stock
          .filter(
            (item) =>
              item.active,
          )
          .map(
            (item) =>
              item.size,
          )
      : [];


  const imageFiles =
    getImageFiles(
      formData,
    );


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
    submittedMediaAssetIds.length >
    0
      ? await prisma.mediaAsset.findMany(
          {
            where: {
              id: {
                in:
                  submittedMediaAssetIds,
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
        (
          asset,
        ) => [
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
    parseMediaOrder(
      formData,
    );


  const orderedItems:
    SubmittedMediaOrderItem[] =
      [];


  const orderedLibraryIds =
    new Set<string>();


  let orderedNewCount =
    0;


  for (
    const item
    of submittedOrder
  ) {
    if (
      item.type ===
        "library" &&
      libraryAssetMap.has(
        item.mediaAssetId,
      ) &&
      !orderedLibraryIds.has(
        item.mediaAssetId,
      )
    ) {
      orderedItems.push(
        item,
      );

      orderedLibraryIds.add(
        item.mediaAssetId,
      );
    }


    if (
      item.type ===
        "new" &&
      orderedNewCount <
        imageFiles.length
    ) {
      orderedItems.push(
        item,
      );

      orderedNewCount +=
        1;
    }
  }


  for (
    const id
    of submittedMediaAssetIds
  ) {
    if (
      !orderedLibraryIds.has(
        id,
      )
    ) {
      orderedItems.push({
        type:
          "library",

        mediaAssetId:
          id,
      });
    }
  }


  while (
    orderedNewCount <
    imageFiles.length
  ) {
    orderedItems.push({
      type:
        "new",
    });

    orderedNewCount +=
      1;
  }


  const slug =
    await createAvailableSlug(
      getOptionalString(
        formData,
        "slug",
      ) ??
        title,
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

          /*
           * Legacy snapshot.
           * Variants are now the source
           * of truth for colour/sizes.
           */
          colour:
            legacyColour,

          sizes:
            legacySizes,

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
            ) ??
            "EUR",

          /*
           * AGE202 Originals are sold
           * directly on AGE202.com.
           */
          vintedUrl:
            null,

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
            status ===
            "PUBLISHED"
              ? new Date()
              : null,
        },
      },
    );


  const uploadedUrls:
    string[] =
      [];


  try {
    const uploadedImages:
      Array<{
        url: string;
        file: File;
      }> =
        [];


    for (
      const file
      of imageFiles
    ) {
      const url =
        await uploadArtifactImage(
          product.id,
          file,
        );

      uploadedUrls.push(
        url,
      );

      uploadedImages.push({
        url,
        file,
      });
    }


    let nextUploadedIndex =
      0;


    await prisma.$transaction(
      async (
        transaction,
      ) => {
        /*
         * ============================
         * MAIN PRODUCT MEDIA
         * ============================
         */

        for (
          const [
            sortOrder,
            item,
          ]
          of orderedItems.entries()
        ) {
          if (
            item.type ===
            "library"
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

                  variantId:
                    null,

                  url:
                    asset.url,

                  alt:
                    asset.alt ??
                    asset.title ??
                    `${title} — image ${
                      sortOrder +
                      1
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

          nextUploadedIndex +=
            1;

          if (!uploaded) {
            continue;
          }

          await transaction.originalProductImage.create(
            {
              data: {
                originalProductId:
                  product.id,

                variantId:
                  null,

                url:
                  uploaded.url,

                alt:
                  `${title} — image ${
                    sortOrder +
                    1
                  }`,

                sortOrder,

                isCover:
                  false,
              },
            },
          );
        }


        /*
         * ============================
         * PRODUCT VARIANTS + MEDIA
         * ============================
         */

        for (
          const variant
          of variants
        ) {
          const createdVariant =
            await transaction.originalProductVariant.create(
              {
                data: {
                  originalProductId:
                    product.id,

                  name:
                    variant.name,

                  colour:
                    variant.colour,

                  colourHex:
                    variant.colourHex,

                  logoTone:
                    variant.logoTone,

                  sku:
                    variant.sku,

                  active:
                    variant.active,

                  isDefault:
                    variant.isDefault,

                  sortOrder:
                    variant.sortOrder,

                  stock: {
                    create:
                      variant.stock.map(
                        (
                          stockItem,
                        ) => ({
                          size:
                            stockItem.size,

                          stock:
                            stockItem.stock,

                          active:
                            stockItem.active,
                        }),
                      ),
                  },
                },

                select: {
                  id: true,
                },
              },
            );


          const media =
            variantMedia.find(
              (item) =>
                item.mediaKey ===
                variant.mediaKey,
            );


          if (!media) {
            continue;
          }


          const libraryAssetsForVariant =
            media.selectedMediaAssetIds.length >
            0
              ? await transaction.mediaAsset.findMany(
                  {
                    where: {
                      id: {
                        in:
                          media.selectedMediaAssetIds,
                      },
                    },
                  },
                )
              : [];


          if (
            libraryAssetsForVariant.length !==
            media.selectedMediaAssetIds.length
          ) {
            throw new Error(
              `One or more Media Library images for variant "${variant.name}" could not be found.`,
            );
          }


          const variantLibraryMap =
            new Map(
              libraryAssetsForVariant.map(
                (asset) => [
                  asset.id,
                  asset,
                ],
              ),
            );


          if (
            media.libraryCoverMediaAssetId &&
            !variantLibraryMap.has(
              media.libraryCoverMediaAssetId,
            )
          ) {
            throw new Error(
              `The Media Library cover for variant "${variant.name}" is not available.`,
            );
          }


          const browserImageMap =
            new Map(
              media.browserUploadedImages.map(
                (image) => [
                  image.id,
                  image,
                ],
              ),
            );


          if (
            media.browserUploadedCoverId &&
            !browserImageMap.has(
              media.browserUploadedCoverId,
            )
          ) {
            throw new Error(
              `The uploaded cover for variant "${variant.name}" is not available.`,
            );
          }


          const orderedVariantItems:
            SubmittedVariantMediaOrderItem[] =
              [];

          const usedLibraryIds =
            new Set<string>();

          const usedUploadIds =
            new Set<string>();


          for (
            const item
            of media.order
          ) {
            if (
              item.type === "library" &&
              variantLibraryMap.has(
                item.mediaAssetId,
              ) &&
              !usedLibraryIds.has(
                item.mediaAssetId,
              )
            ) {
              orderedVariantItems.push(
                item,
              );

              usedLibraryIds.add(
                item.mediaAssetId,
              );
            }


            if (
              item.type === "new" &&
              browserImageMap.has(
                item.uploadId,
              ) &&
              !usedUploadIds.has(
                item.uploadId,
              )
            ) {
              orderedVariantItems.push(
                item,
              );

              usedUploadIds.add(
                item.uploadId,
              );
            }
          }


          for (
            const mediaAssetId
            of media.selectedMediaAssetIds
          ) {
            if (
              !usedLibraryIds.has(
                mediaAssetId,
              )
            ) {
              orderedVariantItems.push({
                type: "library",
                mediaAssetId,
              });

              usedLibraryIds.add(
                mediaAssetId,
              );
            }
          }


          for (
            const image
            of media.browserUploadedImages
          ) {
            if (
              !usedUploadIds.has(
                image.id,
              )
            ) {
              orderedVariantItems.push({
                type: "new",
                uploadId:
                  image.id,
              });

              usedUploadIds.add(
                image.id,
              );
            }
          }


          for (
            const [
              sortOrder,
              item,
            ]
            of orderedVariantItems.entries()
          ) {
            if (
              item.type === "library"
            ) {
              const asset =
                variantLibraryMap.get(
                  item.mediaAssetId,
                );

              if (!asset) {
                continue;
              }

              await transaction.originalProductImage.create(
                {
                  data: {
                    originalProductId:
                      product.id,

                    variantId:
                      createdVariant.id,

                    url:
                      asset.url,

                    alt:
                      asset.alt ??
                      asset.title ??
                      `${title} — ${variant.name} — image ${
                        sortOrder + 1
                      }`,

                    sortOrder,

                    isCover:
                      item.mediaAssetId ===
                      media.libraryCoverMediaAssetId,
                  },
                },
              );

              continue;
            }


            const uploaded =
              browserImageMap.get(
                item.uploadId,
              );

            if (!uploaded) {
              continue;
            }

            await transaction.originalProductImage.create(
              {
                data: {
                  originalProductId:
                    product.id,

                  variantId:
                    createdVariant.id,

                  url:
                    uploaded.url,

                  alt:
                    uploaded.alt ??
                    `${title} — ${variant.name} — image ${
                      sortOrder + 1
                    }`,

                  sortOrder,

                  isCover:
                    item.uploadId ===
                    media.browserUploadedCoverId,
                },
              },
            );
          }


          if (
            media.selectedMediaAssetIds.length >
            0
          ) {
            await transaction.mediaAsset.updateMany(
              {
                where: {
                  id: {
                    in:
                      media.selectedMediaAssetIds,
                  },
                },

                data: {
                  isUsed:
                    true,
                },
              },
            );
          }


          const variantCover =
            await transaction.originalProductImage.findFirst(
              {
                where: {
                  originalProductId:
                    product.id,

                  variantId:
                    createdVariant.id,

                  isCover:
                    true,
                },

                select: {
                  id: true,
                },
              },
            );


          if (!variantCover) {
            const firstVariantImage =
              await transaction.originalProductImage.findFirst(
                {
                  where: {
                    originalProductId:
                      product.id,

                    variantId:
                      createdVariant.id,
                  },

                  orderBy: {
                    sortOrder:
                      "asc",
                  },

                  select: {
                    id: true,
                  },
                },
              );


            if (firstVariantImage) {
              await transaction.originalProductImage.update(
                {
                  where: {
                    id:
                      firstVariantImage.id,
                  },

                  data: {
                    isCover:
                      true,
                  },
                },
              );
            }
          }
        }


        /*
         * ============================
         * MEDIA LIBRARY USAGE
         * ============================
         */

        if (
          submittedMediaAssetIds.length >
          0
        ) {
          await transaction.mediaAsset.updateMany(
            {
              where: {
                id: {
                  in:
                    submittedMediaAssetIds,
                },
              },

              data: {
                isUsed:
                  true,
              },
            },
          );
        }


        /*
         * ============================
         * COVER FALLBACK
         * ============================
         */

        const currentCover =
          await transaction.originalProductImage.findFirst(
            {
              where: {
                originalProductId:
                  product.id,

                variantId:
                  null,

                isCover:
                  true,
              },

              select: {
                id:
                  true,
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

                  variantId:
                    null,
                },

                orderBy: {
                  sortOrder:
                    "asc",
                },

                select: {
                  id:
                    true,
                },
              },
            );


          if (firstImage) {
            await transaction.originalProductImage.update(
              {
                where: {
                  id:
                    firstImage.id,
                },

                data: {
                  isCover:
                    true,
                },
              },
            );
          }
        }
      },
    );
  } catch (
    error
  ) {
    await Promise.allSettled(
      [
        ...uploadedUrls,
        ...variantBrowserUploadedUrls,
      ].map(
        (
          url,
        ) =>
          deleteStoredImage(
            url,
          ),
      ),
    );


    /*
     * Deleting the product also
     * removes variants and stock
     * through Prisma cascade rules.
     */
    await prisma.originalProduct
      .delete({
        where: {
          id:
            product.id,
        },
      })
      .catch(
        () =>
          undefined,
      );


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