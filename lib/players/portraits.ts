type PlayerPortraitInput = {
  name: string;
  slug?: string | null;
};

function normalizePlayerPortraitSlug(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getPlayerPortraitPath({
  name,
  slug,
}: PlayerPortraitInput): string {
  const portraitSlug =
    normalizePlayerPortraitSlug(slug ?? "") ||
    normalizePlayerPortraitSlug(name);

  return `/players/portraits/${portraitSlug}.webp`;
}