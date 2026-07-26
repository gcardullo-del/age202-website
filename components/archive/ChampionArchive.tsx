import type { Champion } from "@/data/champions";

import ArchiveHero from "./ArchiveHero";
import CareerTimeline from "./CareerTimeline";
import TrophyRoom from "./TrophyRoom";
import LegacySection from "./LegacySection";
import DigitalCertificate from "./DigitalCertificate";
import NextChampion from "./NextChampion";

type ChampionArchiveProps = {
  champion: Champion;
  nextChampion: Champion;
};

export default function ChampionArchive({
  champion,
  nextChampion,
}: ChampionArchiveProps) {
  return (
    <>
      <ArchiveHero champion={champion} />
      <CareerTimeline champion={champion} />
      <TrophyRoom champion={champion} />
      <LegacySection champion={champion} />
      <DigitalCertificate champion={champion} />

      <NextChampion
        champion={champion}
        nextChampion={nextChampion}
      />
    </>
  );
}