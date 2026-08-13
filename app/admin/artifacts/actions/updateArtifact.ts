"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  requireAdmin,
} from "@/lib/auth/admin-auth";

import { prisma } from "@/lib/prisma";

import {
  deleteArtifactImage as deleteStoredArtifactImage,
  uploadArtifactImage,
} from "@/lib/services/artifactStorage.service";

import {
  MAX_ARTIFACT_IMAGES,
  getArtifactAvailability,
  getArtifactCategory,
  getArtifactCondition,
  getArtifactRarity,
  getArtifactStatus,
  getArtifactTags,
  getBoolean,
  getCoverImageIndex,
  getImageFiles,
  getOptionalNumber,
  getOptionalString,
  getRequiredString,
  getStringArray,
  slugify,
} from "./utils/artifactForm.utils";

type OrderedMediaItem =
  | { type: "existing"; id: string }
  | { type: "new"; index: number };

function getSubmittedMediaOrder(
  formData: FormData,
  remainingImageIds: string[],
  newImageCount: number,
): OrderedMediaItem[] {
  const rawOrder = getOptionalString(formData, "mediaOrder");
  const remainingSet = new Set(remainingImageIds);
  const usedExisting = new Set<string>();
  let nextNewIndex = 0;
  const ordered: OrderedMediaItem[] = [];

  if (rawOrder) {
    for (const token of rawOrder.split(",")) {
      const [type, value] = token.split(":", 2);
      if (type === "existing" && value && remainingSet.has(value) && !usedExisting.has(value)) {
        ordered.push({ type: "existing", id: value });
        usedExisting.add(value);
      } else if (type === "new" && nextNewIndex < newImageCount) {
        ordered.push({ type: "new", index: nextNewIndex });
        nextNewIndex += 1;
      }
    }
  }

  for (const id of remainingImageIds) {
    if (!usedExisting.has(id)) ordered.push({ type: "existing", id });
  }
  while (nextNewIndex < newImageCount) {
    ordered.push({ type: "new", index: nextNewIndex });
    nextNewIndex += 1;
  }
  return ordered;
}

async function createAvailableSlug(requestedValue: string, artifactId: string): Promise<string> {
  const baseSlug = slugify(requestedValue);
  if (!baseSlug) throw new Error("Unable to generate a valid slug.");
  const existingArtifact = await prisma.artifact.findFirst({
    where: { slug: baseSlug, id: { not: artifactId } },
    select: { id: true },
  });
  return existingArtifact ? `${baseSlug}-${Date.now()}` : baseSlug;
}

export async function updateArtifact(formData: FormData): Promise<never> {
  await requireAdmin();

  const artifactId = getRequiredString(formData, "artifactId");
  const title = getRequiredString(formData, "title");
  const playerId = getRequiredString(formData, "playerId");
  const brandId = getRequiredString(formData, "brandId");

  const currentArtifact = await prisma.artifact.findUnique({
    where: { id: artifactId },
    include: { images: { orderBy: { sortOrder: "asc" } } },
  });
  if (!currentArtifact) throw new Error("The artifact could not be found.");

  const newImages = getImageFiles(formData);
  const requestedRemovedImageIds = getStringArray(formData, "removedImageIds");
  const currentImageIds = new Set(currentArtifact.images.map((image) => image.id));
  const removedImageIds = Array.from(new Set(requestedRemovedImageIds));
  const invalidRemovedImage = removedImageIds.find((id) => !currentImageIds.has(id));
  if (invalidRemovedImage) {
    throw new Error("One or more selected images do not belong to this artifact.");
  }

  const removedImageIdSet = new Set(removedImageIds);
  const remainingImages = currentArtifact.images.filter((image) => !removedImageIdSet.has(image.id));
  const finalImageCount = remainingImages.length + newImages.length;
  if (finalImageCount > MAX_ARTIFACT_IMAGES) {
    throw new Error(`An artifact can contain a maximum of ${MAX_ARTIFACT_IMAGES} images.`);
  }

  const requestedExistingCoverImageId = getOptionalString(formData, "existingCoverImageId");
  if (requestedExistingCoverImageId && !remainingImages.some((image) => image.id === requestedExistingCoverImageId)) {
    throw new Error("The selected cover image is not available.");
  }

  const submittedNewCoverIndex = newImages.length > 0
    ? getCoverImageIndex(formData, newImages.length)
    : -1;
  const slug = await createAvailableSlug(
    getOptionalString(formData, "slug") ?? title,
    artifactId,
  );

  const uploadedImages: Array<{ url: string; file: File }> = [];
  try {
    for (const file of newImages) {
      const url = await uploadArtifactImage(artifactId, file);
      uploadedImages.push({ url, file });
    }
  } catch (error) {
    await Promise.allSettled(uploadedImages.map(({ url }) => deleteStoredArtifactImage(url)));
    throw error;
  }

  const removedImages = currentArtifact.images.filter((image) => removedImageIdSet.has(image.id));
  const submittedOrder = getSubmittedMediaOrder(
    formData,
    remainingImages.map((image) => image.id),
    uploadedImages.length,
  );

  try {
    await prisma.$transaction(async (transaction) => {
      await transaction.artifact.update({
        where: { id: artifactId },
        data: {
          archiveNumber: getOptionalString(formData, "archiveNumber") ?? currentArtifact.archiveNumber,
          title,
          subtitle: getOptionalString(formData, "subtitle") ?? null,
          slug,
          description: getOptionalString(formData, "description") ?? null,
          museumStory: getOptionalString(formData, "museumStory") ?? null,
          historicalContext: getOptionalString(formData, "historicalContext") ?? null,
          curatorNote: getOptionalString(formData, "curatorNote") ?? null,
          year: getOptionalNumber(formData, "year") ?? null,
          season: getOptionalString(formData, "season") ?? null,
          tournament: getOptionalString(formData, "tournament") ?? null,
          collection: getOptionalString(formData, "collection") ?? null,
          edition: getOptionalString(formData, "edition") ?? null,
          category: getArtifactCategory(formData) ?? null,
          rarity: getArtifactRarity(formData),
          size: getOptionalString(formData, "size") ?? null,
          colour: getOptionalString(formData, "colour") ?? null,
          material: getOptionalString(formData, "material") ?? null,
          condition: getArtifactCondition(formData),
          availability: getArtifactAvailability(formData),
          price: getOptionalNumber(formData, "price") ?? null,
          currency: getOptionalString(formData, "currency") ?? "EUR",
          vintedUrl: getOptionalString(formData, "vintedUrl") ?? null,
          authentic: getBoolean(formData, "authentic"),
          authenticityCode: getOptionalString(formData, "authenticityCode") ?? null,
          vintage: getBoolean(formData, "vintage"),
          tags: getArtifactTags(formData),
          status: getArtifactStatus(formData),
          featured: getBoolean(formData, "featured"),
          player: { connect: { id: playerId } },
          brand: { connect: { id: brandId } },
        },
      });

      if (removedImageIds.length > 0) {
        await transaction.artifactImage.deleteMany({
          where: { artifactId, id: { in: removedImageIds } },
        });
      }

      await transaction.artifactImage.updateMany({
        where: { artifactId },
        data: { isCover: false },
      });

      const createdImages: Array<{ id: string; index: number }> = [];
      for (const [index, uploadedImage] of uploadedImages.entries()) {
        const created = await transaction.artifactImage.create({
          data: {
            artifactId,
            url: uploadedImage.url,
            alt: `${title} — image ${index + 1}`,
            sortOrder: remainingImages.length + index,
            isCover: false,
          },
        });
        createdImages.push({ id: created.id, index });
      }

      for (const [sortOrder, item] of submittedOrder.entries()) {
        const imageId = item.type === "existing"
          ? item.id
          : createdImages.find((image) => image.index === item.index)?.id;
        if (!imageId) continue;
        await transaction.artifactImage.update({
          where: { id: imageId },
          data: { sortOrder, alt: `${title} — image ${sortOrder + 1}` },
        });
      }

      let coverImageId: string | undefined;
      if (requestedExistingCoverImageId) {
        coverImageId = requestedExistingCoverImageId;
      } else if (submittedNewCoverIndex >= 0) {
        coverImageId = createdImages.find((image) => image.index === submittedNewCoverIndex)?.id;
      } else {
        coverImageId = remainingImages.find((image) => image.isCover)?.id
          ?? submittedOrder.map((item) => item.type === "existing" ? item.id : createdImages.find((image) => image.index === item.index)?.id).find(Boolean);
      }

      if (coverImageId) {
        await transaction.artifactImage.update({
          where: { id: coverImageId },
          data: { isCover: true },
        });
      }
    });
  } catch (error) {
    await Promise.allSettled(uploadedImages.map(({ url }) => deleteStoredArtifactImage(url)));
    throw error;
  }

  await Promise.allSettled(removedImages.map((image) => deleteStoredArtifactImage(image.url)));
  revalidatePath("/admin");
  revalidatePath("/admin/artifacts");
  revalidatePath(`/admin/artifacts/${artifactId}`);
  revalidatePath("/archive");
  revalidatePath(`/archive/${currentArtifact.slug}`);
  revalidatePath(`/archive/${slug}`);
  redirect("/admin/artifacts");
}