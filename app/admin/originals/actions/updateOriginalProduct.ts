"use server";

import { revalidatePath } from "next/cache";
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
  getCoverImageIndex,
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

export async function updateOriginalProduct(
  formData: FormData,
): Promise<void> {
  const productId =
    getRequiredString(
      formData,
      "productId",
    );

  const title = getRequiredString(
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

  const newImages =
    getImageFiles(formData);

  const requestedRemovedIds =
    getStringArray(
      formData,
      "removedImageIds",
    );

  const currentImageIds =
    new Set(
      current.images.map(
        (image) => image.id,
      ),
    );

  const removedIds =
    Array.from(
      new Set(
        requestedRemovedIds,
      ),
    );

  if (
    removedIds.some(
      (id) =>
        !currentImageIds.has(id),
    )
  ) {
    throw new Error(
      "One or more selected images do not belong to this product.",
    );
  }

  const removedIdSet =
    new Set(removedIds);

  const remainingImages =
    current.images.filter(
      (image) =>
        !removedIdSet.has(
          image.id,
        ),
    );

  if (
    remainingImages.length +
      newImages.length >
    MAX_ORIGINAL_IMAGES
  ) {
    throw new Error(
      `An Original product can contain a maximum of ${MAX_ORIGINAL_IMAGES} images.`,
    );
  }

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
    for (const file of newImages) {
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
          removedIds.length > 0
        ) {
          await transaction.originalProductImage.deleteMany(
            {
              where: {
                originalProductId:
                  productId,
                id: {
                  in: removedIds,
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

        for (const [
          index,
          image,
        ] of remainingImages.entries()) {
          await transaction.originalProductImage.update(
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
          uploaded,
        ] of uploadedImages.entries()) {
          const created =
            await transaction.originalProductImage.create(
              {
                data: {
                  originalProductId:
                    productId,
                  url: uploaded.url,
                  alt: `${title} — image ${
                    remainingImages.length +
                    index +
                    1
                  }`,
                  sortOrder:
                    remainingImages.length +
                    index,
                  isCover: false,
                },
              },
            );

          createdImages.push({
            id: created.id,
            index,
          });
        }

        const coverId =
          requestedExistingCoverId ??
          (submittedNewCoverIndex >= 0
            ? createdImages.find(
                (image) =>
                  image.index ===
                  submittedNewCoverIndex,
              )?.id
            : undefined) ??
          remainingImages.find(
            (image) =>
              image.isCover,
          )?.id ??
          remainingImages[0]?.id ??
          createdImages[0]?.id;

        if (coverId) {
          await transaction.originalProductImage.update(
            {
              where: {
                id: coverId,
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
