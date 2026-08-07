import type {
  PlayerCollectionType,
} from "@/generated/prisma/client";

export const DEFAULT_PLAYER_ACCENT =
  "#C8FF00";

export const PLAYER_COLLECTION_TYPES =
  new Set<PlayerCollectionType>([
    "FEATURED",
    "LEGEND",
    "RISING_STAR",
    "ARCHIVE",
  ]);

export function getRequiredString(
  formData: FormData,
  name: string,
): string {
  const value =
    formData.get(name);

  if (
    typeof value !==
      "string" ||
    !value.trim()
  ) {
    throw new Error(
      `${name} is required.`,
    );
  }

  return value.trim();
}

export function getOptionalString(
  formData: FormData,
  name: string,
): string | null {
  const value =
    formData.get(name);

  if (
    typeof value !==
    "string"
  ) {
    return null;
  }

  const normalized =
    value.trim();

  return normalized || null;
}

export function getBoolean(
  formData: FormData,
  name: string,
): boolean {
  const value =
    formData.get(name);

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
  const value =
    formData.get(name);

  if (
    typeof value !==
      "string" ||
    !value.trim()
  ) {
    return null;
  }

  const parsed =
    Number(value);

  if (
    !Number.isFinite(parsed)
  ) {
    throw new Error(
      `${name} must be a valid number.`,
    );
  }

  return parsed;
}

export function getOptionalInteger(
  formData: FormData,
  name: string,
): number | null {
  const value =
    getOptionalNumber(
      formData,
      name,
    );

  if (value === null) {
    return null;
  }

  if (
    !Number.isInteger(value)
  ) {
    throw new Error(
      `${name} must be a whole number.`,
    );
  }

  return value;
}

export function getOptionalDate(
  formData: FormData,
  name: string,
): Date | null {
  const value =
    getOptionalString(
      formData,
      name,
    );

  if (!value) {
    return null;
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    throw new Error(
      `${name} must be a valid date.`,
    );
  }

  return date;
}

export function getPlayerCollectionType(
  formData: FormData,
): PlayerCollectionType {
  const value =
    getOptionalString(
      formData,
      "collectionType",
    ) ?? "ARCHIVE";

  if (
    !PLAYER_COLLECTION_TYPES.has(
      value as PlayerCollectionType,
    )
  ) {
    throw new Error(
      "Invalid player collection type.",
    );
  }

  return value as PlayerCollectionType;
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

export function normalizeCountry(
  value: string | null,
): string | null {
  if (!value) {
    return null;
  }

  return value
    .split(/\s+/)
    .filter(Boolean)
    .map(
      (part) =>
        part
          .charAt(0)
          .toUpperCase() +
        part
          .slice(1)
          .toLowerCase(),
    )
    .join(" ");
}

export function normalizeNickname(
  value: string | null,
): string | null {
  if (!value) {
    return null;
  }

  return value
    .replace(
      /^["“”']+|["“”']+$/g,
      "",
    )
    .trim() || null;
}

export function cleanLongText(
  value: string | null,
): string | null {
  if (!value) {
    return null;
  }

  const normalized =
    value
      .replace(
        /\r\n/g,
        "\n",
      )
      .replace(
        /\n{3,}/g,
        "\n\n",
      )
      .trim();

  return normalized || null;
}

export function getAccentColor(
  formData: FormData,
): string {
  const value =
    getOptionalString(
      formData,
      "accent",
    ) ??
    DEFAULT_PLAYER_ACCENT;

  if (
    !/^#[0-9a-fA-F]{6}$/.test(
      value,
    )
  ) {
    throw new Error(
      "Accent color must use the format #RRGGBB.",
    );
  }

  return value.toUpperCase();
}

export function validateNonNegativeInteger(
  value: number | null,
  label: string,
): number | null {
  if (value === null) {
    return null;
  }

  if (
    !Number.isInteger(value) ||
    value < 0
  ) {
    throw new Error(
      `${label} must be a non-negative whole number.`,
    );
  }

  return value;
}

export function validatePositiveInteger(
  value: number | null,
  label: string,
): number | null {
  if (value === null) {
    return null;
  }

  if (
    !Number.isInteger(value) ||
    value <= 0
  ) {
    throw new Error(
      `${label} must be a positive whole number.`,
    );
  }

  return value;
}

export function validateYear(
  value: number | null,
  label: string,
): number | null {
  if (value === null) {
    return null;
  }

  const currentYear =
    new Date().getFullYear();

  if (
    !Number.isInteger(value) ||
    value < 1800 ||
    value >
      currentYear + 1
  ) {
    throw new Error(
      `${label} must be between 1800 and ${currentYear + 1}.`,
    );
  }

  return value;
}

export function validateUrl(
  value: string | null,
  label: string,
): string | null {
  if (!value) {
    return null;
  }

  if (
    value.startsWith("/")
  ) {
    return value;
  }

  try {
    const url =
      new URL(value);

    if (
      url.protocol !==
        "http:" &&
      url.protocol !==
        "https:"
    ) {
      throw new Error();
    }

    return value;
  } catch {
    throw new Error(
      `${label} must be a valid URL or a path beginning with /.`,
    );
  }
}