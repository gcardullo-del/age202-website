import { alcaraz } from "./alcaraz";
import { djokovic } from "./djokovic";
import { federer } from "./federer";
import { nadal } from "./nadal";
import { sinner } from "./sinner";

import type { Champion } from "./types";

export type {
  Champion,
  CareerEvent,
  TrophyStats,
} from "./types";

export const champions: Champion[] = [
  federer,
  nadal,
  djokovic,
  sinner,
  alcaraz,
];

export function getChampionBySlug(
  slug: string
): Champion | undefined {
  return champions.find(
    (champion) =>
      champion.slug === slug ||
      champion.id === slug
  );
}