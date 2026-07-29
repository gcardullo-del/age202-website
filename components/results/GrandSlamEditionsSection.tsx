import TournamentEditions from "@/components/results/TournamentEditions";

import { getGrandSlamEditions } from "@/lib/data/grand-slam-editions";
import type { GrandSlamSlug } from "@/lib/data/grand-slams";

type GrandSlamEditionsSectionProps = {
  slug: GrandSlamSlug;
};

export default function GrandSlamEditionsSection({
  slug,
}: GrandSlamEditionsSectionProps) {
  const editionsData = getGrandSlamEditions(slug);

  if (!editionsData) {
    return null;
  }

  return (
    <TournamentEditions
      tournamentName={editionsData.tournamentName}
      tournamentCode={editionsData.tournamentCode}
      editions={editionsData.editions}
      updatedAt={editionsData.updatedAt}
    />
  );
}