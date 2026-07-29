import {
  MASTERS_1000_SLUGS,
  getMasters1000BySlug,
  type Masters1000Slug,
} from "@/lib/data/masters-1000";
import { getMasters1000Gallery } from "@/lib/data/masters-1000-gallery";
import { getMasters1000Legends } from "@/lib/data/masters-1000-legends";
import {
  tournamentRegistry,
  type TournamentConfig,
} from "@/lib/data/tournaments";

export { MASTERS_1000_SLUGS };
export type { TournamentConfig } from "@/lib/data/tournaments";

function isMasters1000Slug(slug: string): slug is Masters1000Slug {
  return (MASTERS_1000_SLUGS as readonly string[]).includes(slug);
}

function createFallbackTournament(slug: Masters1000Slug): TournamentConfig | null {
  const tournament = getMasters1000BySlug(slug);

  if (!tournament) {
    return null;
  }

  return {
    ...tournament,
    gallery: getMasters1000Gallery(slug),
    facts: null,
    champions: null,
    championsTimeline: [],
    legends: getMasters1000Legends(slug),
    records: null,
  };
}

export function getTournament(slug: string): TournamentConfig | null {
  if (!isMasters1000Slug(slug)) {
    return null;
  }

  const tournament = getMasters1000BySlug(slug);

  if (!tournament) {
    return null;
  }

  const factory = tournamentRegistry[slug];
  return factory ? factory(tournament) : createFallbackTournament(slug);
}

export function getTournamentGallery(slug: Masters1000Slug) {
  return getTournament(slug)?.gallery ?? getMasters1000Gallery(slug);
}

export function getTournamentFacts(slug: string) {
  return getTournament(slug)?.facts ?? null;
}

export function getTournamentChampions(slug: string) {
  return getTournament(slug)?.champions ?? null;
}

export function getTournamentLegends(slug: Masters1000Slug) {
  return getTournament(slug)?.legends ?? getMasters1000Legends(slug);
}

export function getTournamentRecords(slug: string) {
  return getTournament(slug)?.records ?? null;
}

export function getTournamentChampionsTimeline(slug: string) {
  return getTournament(slug)?.championsTimeline ?? [];
}
