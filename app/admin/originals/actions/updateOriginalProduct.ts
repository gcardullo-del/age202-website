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
      type: "existing";
      imageId: string;
    }
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
  removedImageIds: string[];
  existingCoverImageId: string | null;
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
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function parseBoolean(
  value: unknown,
  fallback: boolean,
): boolean {
  return typeof value === "boolean"
    ? value
    : fallback;
}

function parseInteger(
  value: unknown,
  fallback: number,
): number {
  if (
    typeof value === "number" &&
    Number.isFinite(value)
  ) {
    return Math.trunc(value);
  }

  if (typeof value === "string") {
    const parsed =
      Number.parseInt(
        value,
        10,
      );

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return fallback;
}

function parseOptionalStringValue(
  value: unknown,
): string | null {
  if (typeof value !== "string") {
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
  if (!Array.isArray(value)) {
    return [];
  }

  const seenSizes =
    new Set<string>();

  const stockItems:
    SubmittedVariantStock[] = [];

  for (const rawItem of value) {
    if (!isRecord(rawItem)) {
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

    if (seenSizes.has(size)) {
      throw new Error(
        `Duplicate size "${size}" found in an Original variant.`,
      );
    }

    seenSizes.add(size);

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

    if (
      !id ||
      !url ||
      seenIds.has(id)
    ) {
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
          entry.split(
            ":",
            2,
          );

        const normalizedValue =
          value?.trim();

        if (
          type === "existing" &&
          normalizedValue
        ) {
          return [
            {
              type: "existing",
              imageId:
                normalizedValue,
            },
          ];
        }

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

  const removedImageIds =
    Array.from(
      new Set(
        getStringArray(
          formData,
          buildVariantMediaFieldName(
            mediaKey,
            "removedImageIds",
          ),
        ),
      ),
    );

  const browserUploadedImages =
    parseBrowserUploadedImages(
      formData,
      mediaKey,
    );

  return {
    mediaKey,
    selectedMediaAssetIds,
    removedImageIds,

    existingCoverImageId:
      getOptionalString(
        formData,
        buildVariantMediaFieldName(
          mediaKey,
          "existingCoverImageId",
        ),
      ),

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

  let parsed: unknown;

  try {
    parsed =
      JSON.parse(rawJson);
  } catch {
    throw new Error(
      "The submitted Original variants data is not valid JSON.",
    );
  }

  if (!Array.isArray(parsed)) {
    throw new Error(
      "The submitted Original variants data is invalid.",
    );
  }

  const variants:
    SubmittedVariant[] = [];

  const seenSkus =
    new Set<string>();

  const seenIds =
    new Set<string>();

  for (
    const [
      index,
      rawVariant,
    ] of parsed.entries()
  ) {
    if (!isRecord(rawVariant)) {
      throw new Error(
        `Original variant ${
          index + 1
        } is invalid.`,
      );
    }

    const id =
      parseOptionalStringValue(
        rawVariant.id,
      );

    if (id) {
      if (seenIds.has(id)) {
        throw new Error(
          "The same Original variant was submitted more than once.",
        );
      }

      seenIds.add(id);
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
      rawLogoTone !== "BLACK" &&
      rawLogoTone !== "WHITE"
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

      if (seenSkus.has(normalizedSku)) {
        throw new Error(
          `Duplicate SKU "${sku}" found in the submitted variants.`,
        );
      }

      seenSkus.add(normalizedSku);
    }

    variants.push({
      id,
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

  if (variants.length > 0) {
    const defaultIndex =
      variants.findIndex(
        (variant) =>
          variant.isDefault,
      );

    const normalizedDefaultIndex =
      defaultIndex >= 0
        ? defaultIndex
        : 0;

    for (
      let index = 0;
      index < variants.length;
      index += 1
    ) {
      variants[index].isDefault =
        index === normalizedDefaultIndex;

      variants[index].sortOrder =
        index;
    }
  }

  return variants;
}

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
            where: {
              variantId: null,
            },
            orderBy: {
              sortOrder: "asc",
            },
          },
          variants: {
            orderBy: {
              sortOrder: "asc",
            },
            include: {
              stock: {
                orderBy: {
                  size: "asc",
                },
              },
              images: {
                orderBy: {
                  sortOrder: "asc",
                },
              },
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

  const variants =
    parseVariants(formData);

  const variantMedia =
    variants.map(
      (variant) =>
        parseVariantMedia(
          formData,
          variant.mediaKey,
        ),
    );

  const variantMediaMap =
    new Map(
      variantMedia.map(
        (media) => [
          media.mediaKey,
          media,
        ],
      ),
    );

  const currentVariantIds =
    new Set(
      current.variants.map(
        (variant) => variant.id,
      ),
    );

  for (const variant of variants) {
    if (
      variant.id &&
      !currentVariantIds.has(
        variant.id,
      )
    ) {
      throw new Error(
        "One or more submitted variants do not belong to this Original product.",
      );
    }
  }

  const submittedExistingVariantIds =
    new Set(
      variants.flatMap(
        (variant) =>
          variant.id
            ? [variant.id]
            : [],
      ),
    );

  const removedVariantIds =
    current.variants
      .filter(
        (variant) =>
          !submittedExistingVariantIds.has(
            variant.id,
          ),
      )
      .map(
        (variant) =>
          variant.id,
      );

  const currentVariantMap =
    new Map(
      current.variants.map(
        (variant) => [
          variant.id,
          variant,
        ],
      ),
    );


  for (const variant of variants) {
    const media =
      variantMediaMap.get(
        variant.mediaKey,
      );

    if (!media) {
      continue;
    }

    const currentVariant =
      variant.id
        ? currentVariantMap.get(
            variant.id,
          )
        : undefined;

    const currentImages =
      currentVariant?.images ??
      [];

    const currentImageIds =
      new Set(
        currentImages.map(
          (image) =>
            image.id,
        ),
      );

    if (
      media.removedImageIds.some(
        (imageId) =>
          !currentImageIds.has(
            imageId,
          ),
      )
    ) {
      throw new Error(
        `One or more selected images do not belong to variant "${variant.name}".`,
      );
    }

    const removedImageIdSet =
      new Set(
        media.removedImageIds,
      );

    const remainingImageCount =
      currentImages.filter(
        (image) =>
          !removedImageIdSet.has(
            image.id,
          ),
      ).length;

    if (
      remainingImageCount +
        media.selectedMediaAssetIds.length +
        media.browserUploadedImages.length >
      MAX_ORIGINAL_IMAGES
    ) {
      throw new Error(
        `Variant "${variant.name}" can contain a maximum of ${MAX_ORIGINAL_IMAGES} images.`,
      );
    }
  }


  const variantBrowserUploadedUrls =
    variantMedia.flatMap(
      (media) =>
        media.browserUploadedImages.map(
          (image) =>
            image.url,
        ),
    );


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
      [
        ...uploadedImages.map(
          ({ url }) =>
            url,
        ),
        ...variantBrowserUploadedUrls,
      ].map(
        (url) =>
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
                ) ?? "EUR",
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
                status === "PUBLISHED"
                  ? current.publishedAt ??
                    new Date()
                  : null,
            },
          },
        );

        /*
         * Keep existing variant IDs stable so historical
         * OrderItem links remain meaningful.
         */
        if (removedVariantIds.length > 0) {
          await transaction.originalProductVariant.deleteMany(
            {
              where: {
                originalProductId:
                  productId,
                id: {
                  in:
                    removedVariantIds,
                },
              },
            },
          );
        }

        /*
         * Clear submitted SKUs temporarily so an SKU swap
         * between two existing variants cannot violate the
         * unique constraint mid-transaction.
         */
        const existingSubmittedVariantIds =
          variants.flatMap(
            (variant) =>
              variant.id
                ? [variant.id]
                : [],
          );

        if (
          existingSubmittedVariantIds.length >
          0
        ) {
          await transaction.originalProductVariant.updateMany(
            {
              where: {
                originalProductId:
                  productId,
                id: {
                  in:
                    existingSubmittedVariantIds,
                },
              },
              data: {
                sku: null,
              },
            },
          );
        }

        for (const variant of variants) {
          let savedVariantId:
            string;

          if (variant.id) {
            await transaction.originalProductVariant.update(
              {
                where: {
                  id:
                    variant.id,
                },
                data: {
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
                    deleteMany: {},
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
              },
            );

            savedVariantId =
              variant.id;
          } else {
            const createdVariant =
              await transaction.originalProductVariant.create(
                {
                  data: {
                    originalProductId:
                      productId,
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

            savedVariantId =
              createdVariant.id;
          }

          const media =
            variantMediaMap.get(
              variant.mediaKey,
            );

          if (!media) {
            continue;
          }

          const currentVariant =
            variant.id
              ? currentVariantMap.get(
                  variant.id,
                )
              : undefined;

          const removedVariantImageIdSet =
            new Set(
              media.removedImageIds,
            );

          const remainingVariantImages =
            (
              currentVariant?.images ??
              []
            ).filter(
              (image) =>
                !removedVariantImageIdSet.has(
                  image.id,
                ),
            );

          if (
            media.removedImageIds.length >
            0
          ) {
            await transaction.originalProductImage.deleteMany(
              {
                where: {
                  originalProductId:
                    productId,
                  variantId:
                    savedVariantId,
                  id: {
                    in:
                      media.removedImageIds,
                  },
                },
              },
            );
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

          const existingImageMap =
            new Map(
              remainingVariantImages.map(
                (image) => [
                  image.id,
                  image,
                ],
              ),
            );

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
            media.existingCoverImageId &&
            !existingImageMap.has(
              media.existingCoverImageId,
            )
          ) {
            throw new Error(
              `The existing cover for variant "${variant.name}" is not available.`,
            );
          }

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

          const usedExistingIds =
            new Set<string>();

          const usedLibraryIds =
            new Set<string>();

          const usedUploadIds =
            new Set<string>();

          for (const item of media.order) {
            if (
              item.type === "existing" &&
              existingImageMap.has(
                item.imageId,
              ) &&
              !usedExistingIds.has(
                item.imageId,
              )
            ) {
              orderedVariantItems.push(
                item,
              );

              usedExistingIds.add(
                item.imageId,
              );
            }

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
            const image
            of remainingVariantImages
          ) {
            if (
              !usedExistingIds.has(
                image.id,
              )
            ) {
              orderedVariantItems.push({
                type: "existing",
                imageId:
                  image.id,
              });

              usedExistingIds.add(
                image.id,
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

          await transaction.originalProductImage.updateMany(
            {
              where: {
                originalProductId:
                  productId,
                variantId:
                  savedVariantId,
              },
              data: {
                isCover: false,
              },
            },
          );

          let selectedVariantCoverId:
            string | undefined;

          for (
            const [
              sortOrder,
              item,
            ]
            of orderedVariantItems.entries()
          ) {
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
                      `${title} — ${variant.name} — image ${
                        sortOrder + 1
                      }`,
                    sortOrder,
                  },
                },
              );

              if (
                item.imageId ===
                media.existingCoverImageId
              ) {
                selectedVariantCoverId =
                  item.imageId;
              }

              continue;
            }

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

              const created =
                await transaction.originalProductImage.create(
                  {
                    data: {
                      originalProductId:
                        productId,
                      variantId:
                        savedVariantId,
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
                        false,
                    },
                  },
                );

              if (
                item.mediaAssetId ===
                media.libraryCoverMediaAssetId
              ) {
                selectedVariantCoverId =
                  created.id;
              }

              continue;
            }

            const uploaded =
              browserImageMap.get(
                item.uploadId,
              );

            if (!uploaded) {
              continue;
            }

            const created =
              await transaction.originalProductImage.create(
                {
                  data: {
                    originalProductId:
                      productId,
                    variantId:
                      savedVariantId,
                    url:
                      uploaded.url,
                    alt:
                      uploaded.alt ??
                      `${title} — ${variant.name} — image ${
                        sortOrder + 1
                      }`,
                    sortOrder,
                    isCover:
                      false,
                  },
                },
              );

            if (
              item.uploadId ===
              media.browserUploadedCoverId
            ) {
              selectedVariantCoverId =
                created.id;
            }
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

          if (!selectedVariantCoverId) {
            const previousCover =
              remainingVariantImages.find(
                (image) =>
                  image.isCover,
              );

            selectedVariantCoverId =
              previousCover?.id;
          }

          if (!selectedVariantCoverId) {
            const firstVariantImage =
              await transaction.originalProductImage.findFirst(
                {
                  where: {
                    originalProductId:
                      productId,
                    variantId:
                      savedVariantId,
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

            selectedVariantCoverId =
              firstVariantImage?.id;
          }

          if (selectedVariantCoverId) {
            await transaction.originalProductImage.update(
              {
                where: {
                  id:
                    selectedVariantCoverId,
                },
                data: {
                  isCover:
                    true,
                },
              },
            );
          }
        }


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
              variantId:
                null,
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
                    variantId:
                      null,
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
                  variantId:
                    null,
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
                  variantId:
                    null,
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