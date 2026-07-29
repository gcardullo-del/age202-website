export type ArchiveEntityType = "player" | "brand" | "tournament";

export type ArchiveLink = {
  type: ArchiveEntityType;
  label: string;
  href: string;
};

const normalizeArchiveKey = (value: string) =>
  value.trim().toLocaleLowerCase("en-US").replace(/\s+/g, " ");

const archiveLinks = new Map<string, ArchiveLink>();

export function registerArchiveLink(link: ArchiveLink) {
  archiveLinks.set(`${link.type}:${normalizeArchiveKey(link.label)}`, link);
}

export function getArchiveLink(type: ArchiveEntityType, label: string) {
  return archiveLinks.get(`${type}:${normalizeArchiveKey(label)}`) ?? null;
}

export function hasArchiveLink(type: ArchiveEntityType, label: string) {
  return getArchiveLink(type, label) !== null;
}
