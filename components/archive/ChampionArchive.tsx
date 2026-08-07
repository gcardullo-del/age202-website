import type {
  Champion,
} from "@/data/champions";

import type {
  PlayerMuseumData,
} from "@/lib/types/player-museum";

import PlayerArtifacts from "@/components/players/atp/PlayerArtifacts";

import ArchiveHero from "./ArchiveHero";
import ChampionStory from "./ChampionStory";
import CareerTimeline from "./CareerTimeline";
import PlayingStyle from "./PlayingStyle";
import EquipmentSection from "./EquipmentSection";
import TrophyRoom from "./TrophyRoom";
import LegacySection from "./LegacySection";
import DigitalCertificate from "./DigitalCertificate";
import NextChampion from "./NextChampion";

import MuseumNavigation from "./ui/MuseumNavigation";

type ChampionArchiveProps = {
  champion: Champion;
  nextChampion: Champion;
  museumPlayer:
    | PlayerMuseumData
    | null;
};

export default function ChampionArchive({
  champion,
  nextChampion,
  museumPlayer,
}: ChampionArchiveProps) {
  return (
    <>
      <ArchiveHero
        champion={champion}
      />

      <MuseumNavigation
        accent={champion.accent}
        playerName={champion.name}
      />

      <ChampionStory
        champion={champion}
      />

      <CareerTimeline
        champion={champion}
      />

      {museumPlayer ? (
        <PlayingStyle
          player={museumPlayer}
        />
      ) : null}

      {museumPlayer ? (
        <EquipmentSection
          player={museumPlayer}
        />
      ) : null}

      <TrophyRoom
        champion={champion}
      />

      <LegacySection
        champion={champion}
      />

      {museumPlayer ? (
        <PlayerArtifacts
          player={museumPlayer}
        />
      ) : null}

      <DigitalCertificate
        champion={champion}
      />

      <NextChampion
        champion={champion}
        nextChampion={nextChampion}
      />
    </>
  );
}