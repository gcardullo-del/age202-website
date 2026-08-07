import {
  mapPlayerToMuseumData,
} from "@/lib/mappers/museum/player-museum.mapper";

import {
  getPlayerBySlug,
} from "@/lib/repositories/player.repository";

import type {
  PlayerMuseumData,
} from "@/lib/types/player-museum";

const museumPlayerSlugAliases: Record<
  string,
  string[]
> = {
  federer: [
    "federer",
    "roger-federer",
  ],
  nadal: [
    "nadal",
    "rafael-nadal",
  ],
  djokovic: [
    "djokovic",
    "novak-djokovic",
  ],
  sinner: [
    "sinner",
    "jannik-sinner",
  ],
  alcaraz: [
    "alcaraz",
    "carlos-alcaraz",
  ],
};

function getMuseumPlayerSlugCandidates(
  slug: string,
): string[] {
  const normalizedSlug =
    slug.trim().toLowerCase();

  const aliases =
    museumPlayerSlugAliases[
      normalizedSlug
    ] ?? [normalizedSlug];

  return Array.from(
    new Set([
      normalizedSlug,
      ...aliases,
    ]),
  );
}

export async function getMuseumPlayerBySlug(
  slug: string,
): Promise<PlayerMuseumData | null> {
  const slugCandidates =
    getMuseumPlayerSlugCandidates(
      slug,
    );

  for (const candidate of slugCandidates) {
    const player =
      await getPlayerBySlug(
        candidate,
      );

    if (player) {
      return mapPlayerToMuseumData(
        player,
      );
    }
  }

  return null;
}