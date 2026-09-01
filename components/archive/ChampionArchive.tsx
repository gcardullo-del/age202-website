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

import FollowPlayerNotifications from "@/components/notifications/FollowPlayerNotifications";

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

const SITE_URL =
  "https://www.age202.com";

function serializeJsonLd(
  value: unknown,
) {
  return JSON.stringify(
    value,
  ).replace(
    /</g,
    "\\u003c",
  );
}

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

  const archiveUrl =
    `${SITE_URL}/archives/${champion.slug}`;

  const structuredData = {
    "@context":
      "https://schema.org",

    "@graph": [
      {
        "@type":
          "ProfilePage",

        "@id":
          `${archiveUrl}#profilepage`,

        url:
          archiveUrl,

        name:
          `${champion.name} Tennis Archive`,

        description:
          champion.description,

        isPartOf: {
          "@type":
            "WebSite",

          "@id":
            `${SITE_URL}/#website`,

          url:
            SITE_URL,

          name:
            "AGE202",

          alternateName:
            "AGE202 Digital Tennis Museum",
        },

        mainEntity: {
          "@id":
            `${archiveUrl}#person`,
        },

        breadcrumb: {
          "@id":
            `${archiveUrl}#breadcrumb`,
        },
      },

      {
        "@type":
          "Person",

        "@id":
          `${archiveUrl}#person`,

        name:
          champion.name,

        description:
          champion.description,

        url:
          archiveUrl,

        mainEntityOfPage: {
          "@id":
            `${archiveUrl}#profilepage`,
        },
      },

      {
        "@type":
          "BreadcrumbList",

        "@id":
          `${archiveUrl}#breadcrumb`,

        itemListElement: [
          {
            "@type":
              "ListItem",

            position:
              1,

            name:
              "AGE202",

            item:
              SITE_URL,
          },

          {
            "@type":
              "ListItem",

            position:
              2,

            name:
              `${champion.name} Tennis Archive`,

            item:
              archiveUrl,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            serializeJsonLd(
              structuredData,
            ),
        }}
      />

      <ArchiveHero
        champion={
          champion
        }
        liveStats={
          liveTrophyStats
        }
      />

      <MuseumNavigation
        accent={
          champion.accent
        }
        playerName={
          champion.name
        }
      />

      {museumPlayer ? (
        <FollowPlayerNotifications
          playerId={
            museumPlayer.id
          }
          playerName={
            museumPlayer.name
          }
          accent={
            champion.accent
          }
        />
      ) : null}

      <ChampionStory
        champion={
          champion
        }
      />

      <CareerTimeline
        champion={
          champion
        }
      />

      {museumPlayer ? (
        <PlayingStyle
          player={
            museumPlayer
          }
        />
      ) : null}

      {museumPlayer ? (
        <EquipmentSection
          player={
            museumPlayer
          }
        />
      ) : null}

      <TrophyRoom
        champion={
          champion
        }
        liveStats={
          liveTrophyStats
        }
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
        champion={
          champion
        }
      />

      {museumPlayer ? (
        <PlayerArtifacts
          player={
            museumPlayer
          }
        />
      ) : null}

      <DigitalCertificate
        champion={
          champion
        }
      />

      <NextChampion
        champion={
          champion
        }
        nextChampion={
          nextChampion
        }
      />
    </>
  );
}