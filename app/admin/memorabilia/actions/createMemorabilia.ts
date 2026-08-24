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
  createMemorabiliaImage,
  deleteMemorabiliaImage as deleteMemorabiliaImageRepository,
} from "@/lib/repositories/memorabiliaImage.repository";

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

async function createUniqueSlug(
  requestedValue: string,
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
    await prisma.memorabilia.findUnique({
      where: {
        slug: base,
      },

      select: {
        id: true,
      },
    });

  return existing
    ? `${base}-${Date.now()}`
    : base;
}

async function createUniqueInventoryNumber(
  requestedValue:
    | string
    | null,
): Promise<string> {
  if (requestedValue) {
    const existing =
      await prisma.memorabilia.findUnique({
        where: {
          inventoryNumber:
            requestedValue,
        },

        select: {
          id: true,
        },
      });

    if (existing) {
      throw new Error(
        "Inventory number already in use.",
      );
    }

    return requestedValue;
  }

  return `AGE202-MEM-${Date.now()}`;
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

export async function createMemorabilia(
  formData: FormData,
): Promise<never> {
  await requireAdmin();

  const title =
    getRequiredString(
      formData,
      "title",
    );

  const images =
    getImageFiles(
      formData,
    );

  if (
    images.length >
    MAX_MEMORABILIA_IMAGES
  ) {
    throw new Error(
      `A memorabilia item can contain a maximum of ${MAX_MEMORABILIA_IMAGES} images.`,
    );
  }

  validateImageFiles(
    images,
  );

  const coverImageIndex =
    getCoverImageIndex(
      formData,
      images.length,
    );

  const slug =
    await createUniqueSlug(
      getOptionalString(
        formData,
        "slug",
      ) ?? title,
    );

  const inventoryNumber =
    await createUniqueInventoryNumber(
      getOptionalString(
        formData,
        "inventoryNumber",
      ),
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

  const memorabilia =
    await prisma.memorabilia.create({
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
          getTags(formData),

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

      select: {
        id: true,
        slug: true,
      },
    });

  const uploadedUrls: string[] = [];
  const createdImageIds: string[] = [];

  try {
    for (
      const [
        index,
        file,
      ] of images.entries()
    ) {
      const publicUrl =
        await uploadMemorabiliaImage(
          memorabilia.id,
          file,
        );

      uploadedUrls.push(
        publicUrl,
      );

      const image =
        await createMemorabiliaImage({
          memorabiliaId:
            memorabilia.id,

          url:
            publicUrl,

          alt:
            `${title} — image ${index + 1}`,

          sortOrder:
            index,

          isCover:
            index ===
            coverImageIndex,
        });

      createdImageIds.push(
        image.id,
      );
    }
  } catch (error) {
    await Promise.allSettled(
      createdImageIds.map(
        (id) =>
          deleteMemorabiliaImageRepository(
            id,
          ),
      ),
    );

    await Promise.allSettled(
      uploadedUrls.map(
        (url) =>
          deleteStoredMemorabiliaImage(
            url,
          ),
      ),
    );

    await prisma.memorabilia
      .delete({
        where: {
          id:
            memorabilia.id,
        },
      })
      .catch(
        () => undefined,
      );

    throw error;
  }

  try {
    await syncMemorabiliaWithStripe(
      memorabilia.id,
    );
  } catch (error) {
    console.error(
      `Sincronizzazione Stripe automatica fallita per Memorabilia ${memorabilia.id}:`,
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
    `/admin/memorabilia/${memorabilia.id}`,
  );

  revalidatePath(
    "/memorabilia",
  );

  revalidatePath(
    `/memorabilia/${memorabilia.slug}`,
  );

  redirect(
    "/admin/memorabilia",
  );
}