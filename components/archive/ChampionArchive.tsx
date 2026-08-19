import type {
  Champion,
} from "@/data/champions";

import type {
  PlayerMuseumData,
} from "@/lib/types/player-museum";

import type {
  getPlayerTournamentEditions,
} from "@/lib/repositories/player.repository";

import {
  getPlayerTrophyStats,
} from "@/lib/services/players/player-trophy-stats.service";

import PlayerArtifacts from "@/components/players/atp/PlayerArtifacts";

import ArchiveHero from "./ArchiveHero";
import ArchiveTournamentResults from "./ArchiveTournamentResults";
import ChampionStory from "./ChampionStory";
import CareerTimeline from "./CareerTimeline";
import PlayingStyle from "./PlayingStyle";
import EquipmentSection from "./EquipmentSection";
import TrophyRoom from "./TrophyRoom";
import LegacySection from "./LegacySection";
import DigitalCertificate from "./DigitalCertificate";
import NextChampion from "./NextChampion";

import MuseumNavigation from "./ui/MuseumNavigation";

type TournamentEditions = Awaited<
  ReturnType<
    typeof getPlayerTournamentEditions
  >
>;

type ChampionArchiveProps = {
  champion: Champion;
  nextChampion: Champion;
  museumPlayer:
    | PlayerMuseumData
    | null;
  archivePlayerId:
    | string
    | null;
  tournamentEditions:
    TournamentEditions;
  davisCupTitles?: number;
};

export default function ChampionArchive({
  champion,
  nextChampion,
  museumPlayer,
  archivePlayerId,
  tournamentEditions,
  davisCupTitles = 0,
}: ChampionArchiveProps) {
  const liveTrophyStats =
    getPlayerTrophyStats({
      playerId:
        archivePlayerId,

      tournamentEditions,

      davisCupTitles,
    });

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
        liveStats={liveTrophyStats}
      />

      {archivePlayerId &&
      tournamentEditions.length >
        0 ? (
        <ArchiveTournamentResults
          playerId={
            archivePlayerId
          }
          playerName={
            champion.name
          }
          accent={
            champion.accent
          }
          editions={
            tournamentEditions
          }
        />
      ) : null}

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