import type {
  Masters1000Data,
  Masters1000Slug,
} from "@/lib/data/masters-1000";
import type {
  Masters1000ChampionsArchive,
  Masters1000Final,
} from "@/lib/data/masters-1000-champions";
import type { Masters1000FactsData } from "@/lib/data/masters-1000-facts";
import type { Masters1000GalleryData } from "@/lib/data/masters-1000-gallery";
import type { Masters1000LegendsData } from "@/lib/data/masters-1000-legends";
import type { Masters1000RecordsData } from "@/lib/data/masters-1000-records";

export type TournamentSections = {
  gallery: Masters1000GalleryData;
  facts: Masters1000FactsData | null;
  champions: Masters1000ChampionsArchive | null;
  championsTimeline: Masters1000Final[];
  legends: Masters1000LegendsData;
  records: Masters1000RecordsData | null;
};

/**
 * The engine replaces the original compact `facts` and `records` arrays with
 * the richer section datasets. Omit prevents incompatible intersections.
 */
export type TournamentConfig = Omit<
  Masters1000Data,
  keyof TournamentSections
> &
  TournamentSections;

export type TournamentConfigFactory = (
  tournament: Masters1000Data,
) => TournamentConfig;

export type TournamentRegistry = Partial<
  Record<Masters1000Slug, TournamentConfigFactory>
>;
