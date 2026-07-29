import HallOfChampions from "@/components/results/HallOfChampions";

import { getGrandSlamChampions } from "@/lib/data/grand-slam-champions";
import type { GrandSlamSlug } from "@/lib/data/grand-slams";

type GrandSlamHallOfChampionsSectionProps = {
  slug: GrandSlamSlug;
};

export default function GrandSlamHallOfChampionsSection({
  slug,
}: GrandSlamHallOfChampionsSectionProps) {
  const championsData = getGrandSlamChampions(slug);

  if (!championsData) {
    return null;
  }

  return (
    <HallOfChampions
      tournamentName={championsData.tournamentName}
      tournamentCode={championsData.tournamentCode}
      eraLabel={championsData.eraLabel}
      updatedAt={championsData.updatedAt}
      entries={championsData.entries}
      leaders={championsData.leaders}
    />
  );
}