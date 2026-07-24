import type {
  ArtifactCategory,
  ArtifactCondition,
  ArtifactRarity,
  ArtifactStatus,
} from "@/generated/prisma/client";

export const MAX_ARTIFACT_IMAGES = 10;

export const MAX_ARTIFACT_IMAGE_SIZE =
  10 * 1024 * 1024;

export const ALLOWED_ARTIFACT_IMAGE_TYPES =
  new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
  ]);

const ARTIFACT_CONDITIONS =
  new Set<ArtifactCondition>([
    "MINT",
    "EXCELLENT",
    "VERY_GOOD",
    "GOOD",
    "FAIR",
  ]);

const ARTIFACT_STATUSES =
  new Set<ArtifactStatus>([
    "DRAFT",
    "PUBLISHED",
    "ARCHIVED",
  ]);

const ARTIFACT_CATEGORIES =
  new Set<ArtifactCategory>([
    "SHIRT",
    "POLO",
    "JACKET",
    "SHORTS",
    "SHOES",
    "CAP",
    "ACCESSORY",
  ]);

const ARTIFACT_RARITIES =
  new Set<ArtifactRarity>([
    "COMMON",
    "RARE",
    "VERY_RARE",
    "LEGENDARY",
  ]);

export function getRequiredString(
  formData: FormData,
  fieldName: string,
): string {
  const value = formData.get(fieldName);

  if (
    typeof value !== "string" ||
    !value.trim()
  ) {
    throw new Error(
      `${fieldName} is required.`,
    );
  }

  return value.trim();
}

export function getOptionalString(
  formData: FormData,
  fieldName: string,
): string | undefined {
  const value = formData.get(fieldName);

  if (typeof value !== "string") {
    return undefined;
  }

  const normalizedValue = value.trim();

  return normalizedValue || undefined;
}

export function getOptionalNumber(
  formData: FormData,
  fieldName: string,
): number | undefined {
  const value = getOptionalString(
    formData,
    fieldName,
  );

  if (!value) {
    return undefined;
  }

  const parsedValue = Number(value);

  if (!Number.isFinite(parsedValue)) {
    throw new Error(
      `${fieldName} must be a valid number.`,
    );
  }

  return parsedValue;
}

export function getBoolean(
  formData: FormData,
  fieldName: string,
): boolean {
  const value = formData.get(fieldName);

  return value === "true" || value === "on";
}

export function getArtifactCondition(
  formData: FormData,
  fieldName = "condition",
  fallback: ArtifactCondition = "EXCELLENT",
): ArtifactCondition {
  const value = getOptionalString(
    formData,
    fieldName,
  );

  if (!value) {
    return fallback;
  }

  if (
    !ARTIFACT_CONDITIONS.has(
      value as ArtifactCondition,
    )
  ) {
    throw new Error(
      `${fieldName} contains an invalid artifact condition.`,
    );
  }

  return value as ArtifactCondition;
}

export function getArtifactStatus(
  formData: FormData,
  fieldName = "status",
  fallback: ArtifactStatus = "DRAFT",
): ArtifactStatus {
  const value = getOptionalString(
    formData,
    fieldName,
  );

  if (!value) {
    return fallback;
  }

  if (
    !ARTIFACT_STATUSES.has(
      value as ArtifactStatus,
    )
  ) {
    throw new Error(
      `${fieldName} contains an invalid publication status.`,
    );
  }

  return value as ArtifactStatus;
}

export function getArtifactCategory(
  formData: FormData,
  fieldName = "category",
): ArtifactCategory | undefined {
  const value = getOptionalString(
    formData,
    fieldName,
  );

  if (!value) {
    return undefined;
  }

  if (
    !ARTIFACT_CATEGORIES.has(
      value as ArtifactCategory,
    )
  ) {
    throw new Error(
      `${fieldName} contains an invalid artifact category.`,
    );
  }

  return value as ArtifactCategory;
}

export function getArtifactRarity(
  formData: FormData,
  fieldName = "rarity",
  fallback: ArtifactRarity = "COMMON",
): ArtifactRarity {
  const value = getOptionalString(
    formData,
    fieldName,
  );

  if (!value) {
    return fallback;
  }

  if (
    !ARTIFACT_RARITIES.has(
      value as ArtifactRarity,
    )
  ) {
    throw new Error(
      `${fieldName} contains an invalid artifact rarity.`,
    );
  }

  return value as ArtifactRarity;
}

export function getImageFiles(
  formData: FormData,
  fieldName = "images",
): File[] {
  const files = formData
    .getAll(fieldName)
    .filter(
      (value): value is File =>
        value instanceof File &&
        value.size > 0,
    );

  if (
    files.length >
    MAX_ARTIFACT_IMAGES
  ) {
    throw new Error(
      `You can upload a maximum of ${MAX_ARTIFACT_IMAGES} images.`,
    );
  }

  files.forEach((file) => {
    if (
      !ALLOWED_ARTIFACT_IMAGE_TYPES.has(
        file.type,
      )
    ) {
      throw new Error(
        `${file.name} has an unsupported image format.`,
      );
    }

    if (
      file.size >
      MAX_ARTIFACT_IMAGE_SIZE
    ) {
      throw new Error(
        `${file.name} exceeds the 10 MB size limit.`,
      );
    }
  });

  return files;
}

export function getCoverImageIndex(
  formData: FormData,
  imageCount: number,
  fieldName = "coverImageIndex",
): number {
  if (imageCount === 0) {
    return -1;
  }

  const value = formData.get(fieldName);

  if (
    typeof value !== "string" ||
    !value.trim()
  ) {
    return 0;
  }

  const parsedValue = Number.parseInt(
    value,
    10,
  );

  if (
    !Number.isInteger(parsedValue) ||
    parsedValue < 0 ||
    parsedValue >= imageCount
  ) {
    return 0;
  }

  return parsedValue;
}

export function getStringArray(
  formData: FormData,
  fieldName: string,
): string[] {
  return formData
    .getAll(fieldName)
    .filter(
      (value): value is string =>
        typeof value === "string",
    )
    .map((value) => value.trim())
    .filter(Boolean);
}

export function slugify(
  value: string,
): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function createUniqueSlug(
  value: string,
): string {
  const baseSlug = slugify(value);

  if (!baseSlug) {
    throw new Error(
      "Unable to generate a valid slug.",
    );
  }

  return `${baseSlug}-${Date.now()}`;
}