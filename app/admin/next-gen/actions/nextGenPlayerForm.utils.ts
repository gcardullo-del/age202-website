

export function getRequiredString(
  formData: FormData,
  name: string,
): string {
  const value = formData.get(name);

  if (typeof value !== "string") {
    throw new Error(`${name} mancante.`);
  }

  const normalized = value.trim();

  if (!normalized) {
    throw new Error(`${name} mancante.`);
  }

  return normalized;
}

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

export function getRequiredPositiveInteger(
  formData: FormData,
  name: string,
): number {
  const rawValue = getRequiredString(
    formData,
    name,
  );

  const value = Number(rawValue);

  if (
    !Number.isInteger(value) ||
    value <= 0
  ) {
    throw new Error(
      `${name} deve essere un numero intero maggiore di zero.`,
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

export function getOptionalDate(
  formData: FormData,
  name: string,
): Date | null {
  const value = getOptionalString(
    formData,
    name,
  );

  if (!value) {
    return null;
  }

  const date = new Date(
    `${value}T00:00:00.000Z`,
  );

  if (
    Number.isNaN(date.getTime())
  ) {
    throw new Error(
      `${name} non contiene una data valida.`,
    );
  }

  return date;
}

export function getHighlights(
  formData: FormData,
): string[] {
  const rawValue = getOptionalString(
    formData,
    "highlights",
  );

  if (!rawValue) {
    return [];
  }

  return rawValue
    .split("\n")
    .map((value) => value.trim())
    .filter(Boolean);
}

export function normalizePlayerKey(
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

export function validateAtpProfileUrl(
  value: string,
): string {
  let url: URL;

  try {
    url = new URL(value);
  } catch {
    throw new Error(
      "ATP Profile URL non valido.",
    );
  }

  if (
    url.protocol !== "https:" ||
    url.hostname !== "www.atptour.com"
  ) {
    throw new Error(
      "Inserisci un URL ufficiale ATP Tour https://www.atptour.com/...",
    );
  }

  if (
    !url.pathname
      .toLowerCase()
      .includes("/players/")
  ) {
    throw new Error(
      "L'URL ATP deve essere una pagina giocatore.",
    );
  }

  return url.toString();
}

export function getNextGenStatus(
  formData: FormData,
): "DRAFT" | "PUBLISHED" | "ARCHIVED" {
  const value = getRequiredString(
    formData,
    "status",
  );

  if (
    value !== "DRAFT" &&
    value !== "PUBLISHED" &&
    value !== "ARCHIVED"
  ) {
    throw new Error(
      "Stato NEXT GEN non valido.",
    );
  }

  return value;
}
