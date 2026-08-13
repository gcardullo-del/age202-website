"use server";

import { revalidatePath } from "next/cache";

import {
  requireAdmin,
} from "@/lib/auth/admin-auth";

import { prisma } from "@/lib/prisma";

function requiredString(formData: FormData, name: string): string {
  const value = formData.get(name);

  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${name} is required.`);
  }

  return value.trim();
}

function stringArray(formData: FormData, name: string): string[] {
  return Array.from(
    new Set(
      formData
        .getAll(name)
        .filter((value): value is string => typeof value === "string")
        .map((value) => value.trim())
        .filter(Boolean),
    ),
  );
}

export async function updateCollectionOriginals(
  formData: FormData,
): Promise<void> {
  await requireAdmin();

  const collectionId = requiredString(formData, "collectionId");
  const originalProductIds = stringArray(formData, "originalProductIds");
  const featuredOriginalIds = new Set(
    stringArray(formData, "featuredOriginalIds"),
  );

  const collection = await prisma.museumCollection.findUnique({
    where: { id: collectionId },
    select: { id: true, slug: true },
  });

  if (!collection) {
    throw new Error("The collection could not be found.");
  }

  if (
    Array.from(featuredOriginalIds).some(
      (id) => !originalProductIds.includes(id),
    )
  ) {
    throw new Error("Featured Originals must also be selected.");
  }

  if (originalProductIds.length > 0) {
    const originals = await prisma.originalProduct.findMany({
      where: {
        id: {
          in: originalProductIds,
        },
      },
      select: {
        id: true,
      },
    });

    if (originals.length !== originalProductIds.length) {
      throw new Error("One or more selected Originals could not be found.");
    }
  }

  await prisma.$transaction(async (transaction) => {
    await transaction.museumCollectionOriginal.deleteMany({
      where: {
        collectionId,
      },
    });

    if (originalProductIds.length > 0) {
      await transaction.museumCollectionOriginal.createMany({
        data: originalProductIds.map((originalProductId, index) => ({
          collectionId,
          originalProductId,
          sortOrder: index,
          featured: featuredOriginalIds.has(originalProductId),
        })),
      });
    }
  });

  revalidatePath("/admin/collections");
  revalidatePath(`/admin/collections/${collectionId}`);
  revalidatePath(`/collections/${collection.slug}`);
}