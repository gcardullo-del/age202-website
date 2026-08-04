import type {
  OriginalProductAvailability,
  OriginalProductCategory,
  OriginalProductStatus,
} from "@/generated/prisma/client";

export const MAX_ORIGINAL_IMAGES = 10;

const CATEGORIES =
  new Set<OriginalProductCategory>([
    "TSHIRT",
    "POLO",
    "HOODIE",
    "SWEATSHIRT",
    "CAP",
    "BOTTLE",
    "BAG",
    "POSTER",
    "ACCESSORY",
    "OTHER",
  ]);

const STATUSES =
  new Set<OriginalProductStatus>([
    "DRAFT",
    "PUBLISHED",
    "ARCHIVED",
  ]);

const AVAILABILITIES =
  new Set<OriginalProductAvailability>([
    "AVAILABLE",
    "SOLD",
    "COMING_SOON",
    "NOT_FOR_SALE",
  ]);

export function getOptionalString(
  formData: FormData,
  name: string,
): string | null {
  const value = formData.get(name);

  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();

  return normalized || null;
}

export function getRequiredString(
  formData: FormData,
  name: string,
): string {
  const value = getOptionalString(
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

export function getBoolean(
  formData: FormData,
  name: string,
): boolean {
  const value = formData.get(name);

  return (
    value === "on" ||
    value === "true" ||
    value === "1"
  );
}

export function getOptionalNumber(
  formData: FormData,
  name: string,
): number | null {
  const value = getOptionalString(
    formData,
    name,
  );

  if (!value) {
    return null;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    throw new Error(
      `${name} must be a valid number.`,
    );
  }

  return parsed;
}

export function getStringArray(
  formData: FormData,
  name: string,
): string[] {
  return formData
    .getAll(name)
    .filter(
      (value): value is string =>
        typeof value === "string",
    )
    .map((value) => value.trim())
    .filter(Boolean);
}

export function getCommaSeparatedValues(
  formData: FormData,
  name: string,
): string[] {
  const value = getOptionalString(
    formData,
    name,
  );

  if (!value) {
    return [];
  }

  return Array.from(
    new Set(
      value
        .split(",")
        .map((entry) =>
          entry.trim(),
        )
        .filter(Boolean),
    ),
  );
}

export function getOriginalCategory(
  formData: FormData,
): OriginalProductCategory {
  const value = getOptionalString(
    formData,
    "category",
  );

  if (
    value &&
    CATEGORIES.has(
      value as OriginalProductCategory,
    )
  ) {
    return value as OriginalProductCategory;
  }

  return "OTHER";
}

export function getOriginalStatus(
  formData: FormData,
): OriginalProductStatus {
  const value = getOptionalString(
    formData,
    "status",
  );

  if (
    value &&
    STATUSES.has(
      value as OriginalProductStatus,
    )
  ) {
    return value as OriginalProductStatus;
  }

  return "DRAFT";
}

export function getOriginalAvailability(
  formData: FormData,
): OriginalProductAvailability {
  const value = getOptionalString(
    formData,
    "availability",
  );

  if (
    value &&
    AVAILABILITIES.has(
      value as OriginalProductAvailability,
    )
  ) {
    return value as OriginalProductAvailability;
  }

  return "COMING_SOON";
}

export function getImageFiles(
  formData: FormData,
): File[] {
  return formData
    .getAll("images")
    .filter(
      (value): value is File =>
        value instanceof File &&
        value.size > 0,
    )
    .slice(
      0,
      MAX_ORIGINAL_IMAGES,
    );
}

export function getCoverImageIndex(
  formData: FormData,
  imageCount: number,
): number {
  const raw = getOptionalString(
    formData,
    "coverImageIndex",
  );

  const parsed =
    raw === null
      ? 0
      : Number.parseInt(raw, 10);

  if (
    !Number.isInteger(parsed) ||
    parsed < 0 ||
    parsed >= imageCount
  ) {
    return imageCount > 0 ? 0 : -1;
  }

  return parsed;
}

export function slugify(
  value: string,
): string {
  return value
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      "",
    )
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
