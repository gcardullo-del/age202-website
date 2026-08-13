"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type {
  CollectionStatus,
  CollectionType,
} from "@/generated/prisma/client";

import {
  requireAdmin,
} from "@/lib/auth/admin-auth";

import { prisma } from "@/lib/prisma";

const COLLECTION_STATUSES =
  new Set<CollectionStatus>([
    "DRAFT",
    "PUBLISHED",
    "ARCHIVED",
  ]);

const COLLECTION_TYPES =
  new Set<CollectionType>([
    "PLAYER",
    "ERA",
    "TOURNAMENT",
    "THEME",
    "BRAND",
    "OTHER",
  ]);

function optionalString(
  formData: FormData,
  name: string,
): string | null {
  const value = formData.get(name);

  if (typeof value !== "string") {
    return null;
  }

  return value.trim() || null;
}

function requiredString(
  formData: FormData,
  name: string,
): string {
  const value = optionalString(
    formData,
    name,
  );

  if (!value) {
    throw new Error(
      `${name} is required.`,
    );
  }

  return value;
}

function optionalInteger(
  formData: FormData,
  name: string,
): number | null {
  const value = optionalString(
    formData,
    name,
  );

  if (!value) {
    return null;
  }

  const parsed = Number.parseInt(
    value,
    10,
  );

  return Number.isFinite(parsed)
    ? parsed
    : null;
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
    .replace(
      /[^a-z0-9]+/g,
      "-",
    )
    .replace(
      /^-+|-+$/g,
      "",
    );
}

function collectionStatus(
  formData: FormData,
): CollectionStatus {
  const value = optionalString(
    formData,
    "status",
  );

  if (
    value &&
    COLLECTION_STATUSES.has(
      value as CollectionStatus,
    )
  ) {
    return value as CollectionStatus;
  }

  return "DRAFT";
}

function collectionType(
  formData: FormData,
): CollectionType {
  const value = optionalString(
    formData,
    "type",
  );

  if (
    value &&
    COLLECTION_TYPES.has(
      value as CollectionType,
    )
  ) {
    return value as CollectionType;
  }

  return "PLAYER";
}

async function availableSlug(
  requestedValue: string,
  collectionId: string,
): Promise<string> {
  const baseSlug = slugify(
    requestedValue,
  );

  if (!baseSlug) {
    throw new Error(
      "Unable to generate a valid collection slug.",
    );
  }

  const existing =
    await prisma.museumCollection.findFirst(
      {
        where: {
          slug: baseSlug,
          id: {
            not: collectionId,
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

export async function updateCollection(
  formData: FormData,
): Promise<void> {
  await requireAdmin();

  const collectionId =
    requiredString(
      formData,
      "collectionId",
    );

  const current =
    await prisma.museumCollection.findUnique(
      {
        where: {
          id: collectionId,
        },
      },
    );

  if (!current) {
    throw new Error(
      "The collection could not be found.",
    );
  }

  const name = requiredString(
    formData,
    "name",
  );

  const title = requiredString(
    formData,
    "title",
  );

  const status = collectionStatus(
    formData,
  );

  const heroMediaId = optionalString(
    formData,
    "heroMediaId",
  );

  if (heroMediaId) {
    const mediaExists =
      await prisma.mediaAsset.findUnique(
        {
          where: {
            id: heroMediaId,
          },
          select: {
            id: true,
          },
        },
      );

    if (!mediaExists) {
      throw new Error(
        "The selected hero media asset could not be found.",
      );
    }
  }

  const slug = await availableSlug(
    optionalString(
      formData,
      "slug",
    ) ?? name,
    collectionId,
  );

  await prisma.$transaction(
    async (transaction) => {
      await transaction.museumCollection.update(
        {
          where: {
            id: collectionId,
          },
          data: {
            name,
            slug,
            eyebrow: optionalString(
              formData,
              "eyebrow",
            ),
            title,
            subtitle: optionalString(
              formData,
              "subtitle",
            ),
            description: optionalString(
              formData,
              "description",
            ),
            type: collectionType(
              formData,
            ),
            status,
            heroTitle: optionalString(
              formData,
              "heroTitle",
            ),
            heroSubtitle: optionalString(
              formData,
              "heroSubtitle",
            ),
            heroImageUrl: optionalString(
              formData,
              "heroImageUrl",
            ),
            heroMediaId,
            primaryColor:
              optionalString(
                formData,
                "primaryColor",
              ) ?? "#C8FF00",
            secondaryColor:
              optionalString(
                formData,
                "secondaryColor",
              ) ?? "#08111F",
            accentColor:
              optionalString(
                formData,
                "accentColor",
              ) ?? "#FFFFFF",
            featured:
              formData.get("featured") ===
              "on",
            displayOrder:
              optionalInteger(
                formData,
                "displayOrder",
              ),
            metaTitle: optionalString(
              formData,
              "metaTitle",
            ),
            metaDescription:
              optionalString(
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

      if (heroMediaId) {
        await transaction.mediaAsset.update(
          {
            where: {
              id: heroMediaId,
            },
            data: {
              isUsed: true,
            },
          },
        );
      }
    },
  );

  revalidatePath(
    "/admin/collections",
  );
  revalidatePath(
    `/admin/collections/${collectionId}`,
  );
  revalidatePath(
    "/collections",
  );
  revalidatePath(
    `/collections/${current.slug}`,
  );
  revalidatePath(
    `/collections/${slug}`,
  );

  redirect(
    "/admin/collections",
  );
}