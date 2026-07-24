import { champions } from "@/data";
import ChampionShowcase from "@/components/home/champion-showcase";

export default function ChampionCollections() {
  return (
    <ChampionShowcase
      champions={champions}
      initialChampionId="roger-federer"
    />
  );
}