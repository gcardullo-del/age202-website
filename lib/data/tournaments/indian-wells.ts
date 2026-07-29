import { getMasters1000ChampionsArchive } from "@/lib/data/masters-1000-champions";
import { getMasters1000Facts } from "@/lib/data/masters-1000-facts";
import { getMasters1000Gallery } from "@/lib/data/masters-1000-gallery";
import { getMasters1000Legends } from "@/lib/data/masters-1000-legends";
import { getMasters1000Records } from "@/lib/data/masters-1000-records";

import type { TournamentConfigFactory } from "./types";

/**
 * Indian Wells tournament configuration.
 *
 * STEP 10.1 introduces a single assembly point for every section. Existing
 * section datasets remain available as compatibility sources, so the visual
 * result does not change while the page and components move to the engine.
 * Future steps can migrate each literal dataset into this file without
 * touching any component or route.
 */
export const createIndianWellsTournament: TournamentConfigFactory = (
  tournament,
) => {
  const champions = getMasters1000ChampionsArchive("indian-wells") ?? null;

  return {
    ...tournament,
    gallery: getMasters1000Gallery("indian-wells"),
    facts: getMasters1000Facts("indian-wells"),
    champions,
    championsTimeline: champions?.recentFinals ?? [],
    legends: getMasters1000Legends("indian-wells"),
    records: getMasters1000Records("indian-wells"),
  };
};
