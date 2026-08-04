"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

import {
  deleteArtifactImage as deleteStoredImage,
  uploadArtifactImage,
} from "@/lib/services/artifactStorage.service";

import {
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
  slugify,
} from "./originalForm.utils";

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

export async function createOriginalProduct(
  formData: FormData,
): Promise<void> {
  const title = getRequiredString(
    formData,
    "title",
  );

  const status =
    getOriginalStatus(formData);

  const images =
    getImageFiles(formData);

  const coverImageIndex =
    getCoverImageIndex(
      formData,
      images.length,
    );

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

  const uploadedUrls: string[] = [];

  try {
    for (const [
      index,
      file,
    ] of images.entries()) {
      const url =
        await uploadArtifactImage(
          product.id,
          file,
        );

      uploadedUrls.push(url);

      await prisma.originalProductImage.create(
        {
          data: {
            originalProductId:
              product.id,
            url,
            alt: `${title} — image ${
              index + 1
            }`,
            sortOrder: index,
            isCover:
              index ===
              coverImageIndex,
          },
        },
      );
    }
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
