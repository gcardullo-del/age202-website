import { notFound } from "next/navigation";

import AdminShell from "@/components/admin/AdminShell";

import AtpSection, {
  type AvailableAtpPlayer,
} from "@/components/admin/player-studio/sections/AtpSection";

import BiographySection from "@/components/admin/player-studio/sections/BiographySection";
import CareerSection from "@/components/admin/player-studio/sections/CareerSection";
import CareerTimelineSection from "@/components/admin/player-studio/sections/CareerTimelineSection";
import CollectionsSection from "@/components/admin/player-studio/sections/CollectionsSection";
import IdentitySection from "@/components/admin/player-studio/sections/IdentitySection";
import MediaSection from "@/components/admin/player-studio/sections/MediaSection";
import PublishingSection from "@/components/admin/player-studio/sections/PublishingSection";
import SeoSection from "@/components/admin/player-studio/sections/SeoSection";

import PlayerStudioForm from "@/components/admin/player-studio/PlayerStudioForm";

import type {
  CareerTimelineDraft,
} from "@/components/admin/player-studio/types/CareerTimeline";

import { updatePlayer } from "../actions/updatePlayer";

import {
  getAdminPlayer,
  getAvailableAtpPlayers,
} from "@/lib/repositories/admin/admin-player.repository";

import {
  getAllMedia,
} from "@/lib/repositories/media.repository";

import {
  getAllMuseumCollections,
} from "@/lib/repositories/museum-collection.repository";

export const dynamic =
  "force-dynamic";

type EditPlayerPageProps = {
  params: Promise<{
    playerId: string;
  }>;
};

function formatDateInput(
  value: Date | null | undefined,
): string {
  if (!value) {
    return "";
  }

  return value
    .toISOString()
    .slice(0, 10);
}

function toOptionalNumberString(
  value:
    | {
        toString(): string;
      }
    | string
    | number
    | null
    | undefined,
): string {
  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  return value.toString();
}

function mapCareerEvents(
  events: Array<{
    id: string;
    year: number;
    month: number | null;
    day: number | null;
    title: string;
    subtitle: string | null;
    description: string | null;
    category: CareerTimelineDraft["category"];
    imageUrl: string | null;
    location: string | null;
    tournament: string | null;
    featured: boolean;
    sortOrder: number;
  }>,
): CareerTimelineDraft[] {
  return events.map(
    (event) => ({
      clientId: event.id,
      year: String(event.year),
      month:
        event.month === null
          ? ""
          : String(event.month),
      day:
        event.day === null
          ? ""
          : String(event.day),
      title: event.title,
      subtitle:
        event.subtitle ?? "",
      description:
        event.description ?? "",
      category:
        event.category,
      imageUrl:
        event.imageUrl ?? "",
      location:
        event.location ?? "",
      tournament:
        event.tournament ?? "",
      featured:
        event.featured,
      sortOrder:
        event.sortOrder,
    }),
  );
}

function mergeAvailableAtpPlayers({
  availablePlayers,
  currentPlayer,
}: {
  availablePlayers: AvailableAtpPlayer[];
  currentPlayer: AvailableAtpPlayer | null;
}): AvailableAtpPlayer[] {
  if (!currentPlayer) {
    return availablePlayers;
  }

  const withoutDuplicate =
    availablePlayers.filter(
      (player) =>
        player.id !==
        currentPlayer.id,
    );

  return [
    currentPlayer,
    ...withoutDuplicate,
  ].sort(
    (first, second) =>
      first.rank - second.rank,
  );
}

export default async function EditPlayerPage({
  params,
}: EditPlayerPageProps) {
  const {
    playerId,
  } = await params;

  const player =
    await getAdminPlayer(
      playerId,
    );

  if (!player) {
    notFound();
  }

  const [
    availableAtpPlayers,
    mediaAssets,
    museumCollections,
  ] = await Promise.all([
    getAvailableAtpPlayers(),

    getAllMedia({
      mimeType: "image/",
    }),

    getAllMuseumCollections(),
  ]);

  const currentAtpPlayer:
    AvailableAtpPlayer | null =
    player.atpPlayer
      ? {
          id:
            player.atpPlayer.id,
          rank:
            player.atpPlayer.rank,
          previousRank:
            player.atpPlayer
              .previousRank,
          name:
            player.atpPlayer.name,
          firstName:
            player.atpPlayer
              .firstName,
          lastName:
            player.atpPlayer
              .lastName,
          slug:
            player.atpPlayer.slug,
          country:
            player.atpPlayer.country,
          countryCode:
            player.atpPlayer
              .countryCode,
          points:
            player.atpPlayer.points,
          age:
            player.atpPlayer.age,
          imageUrl:
            player.atpPlayer
              .imageUrl,
        }
      : null;

  const selectableAtpPlayers =
    mergeAvailableAtpPlayers({
      availablePlayers:
        availableAtpPlayers,
      currentPlayer:
        currentAtpPlayer,
    });

  const profile =
    player.playerProfile;

  const initialCareerEvents =
    mapCareerEvents(
      player.careerEvents,
    );

  const selectedCollectionIds =
    player.museumCollections.map(
      (relationship) =>
        relationship.collectionId,
    );

  const playerStatus =
    player.active
      ? player.publishedAt
        ? "Published"
        : "Active"
      : "Inactive";

  return (
    <AdminShell
      title={`Edit ${player.name}`}
      description="Update the complete AGE202 player identity, archive profile and museum relationships."
    >
      <PlayerStudioForm
        mode="edit"
        playerId={player.id}
        formAction={updatePlayer}
        initialSection="identity"
        previewHref={
          `/players/${player.slug}`
        }
        playerStatus={
          playerStatus
        }
        submitLabel="Save Player"
        backHref="/admin/players"
        initialPreview={{
          name: player.name,
          nickname:
            player.nickname,
          country:
            player.country ??
            player.atpPlayer
              ?.country ??
            null,
          heroImage:
            player.heroImage,
          portraitImage:
            player.portraitImage,
          accent:
            player.accent,
          collectionType:
            player.collectionType,
          ranking:
            player.atpPlayer
              ?.rank ??
            null,
          points:
            player.atpPlayer
              ?.points ??
            null,
          artifactCount:
            player._count.artifacts,
          collectionCount:
            player._count
              .museumCollections,
          atpTitles:
            profile?.atpTitles ??
            0,
          grandSlams:
            profile?.grandSlams ??
            0,
          active:
            player.active,
        }}
        sections={{
          identity: (
            <IdentitySection
              initialSlug={
                player.slug
              }
              initialFirstName={
                player.firstName
              }
              initialLastName={
                player.lastName
              }
              initialDebutYear={
                player.debutYear
              }
              initialDisplayOrder={
                player.displayOrder
              }
            />
          ),

          atp: (
            <AtpSection
              availablePlayers={
                selectableAtpPlayers
              }
              initialAtpPlayerId={
                player.atpPlayer
                  ?.id ??
                null
              }
            />
          ),

          media: (
            <MediaSection
              libraryAssets={
                mediaAssets
              }
            />
          ),

          biography: (
            <BiographySection
              initialBiography={
                player.biography
              }
              initialBiographyShort={
                profile?.biographyShort
              }
              initialBiographyLong={
                profile?.biographyLong
              }
              initialQuote={
                player.quote
              }
              initialPlayingStyle={
                profile?.playingStyle
              }
            />
          ),

          career: (
            <div className="space-y-10">
              <CareerSection
                initialBirthDate={formatDateInput(
                  profile?.birthDate,
                )}
                initialBirthPlace={
                  profile?.birthPlace
                }
                initialResidence={
                  profile?.residence
                }
                initialHeight={
                  profile?.height
                }
                initialWeight={
                  profile?.weight
                }
                initialPlays={
                  profile?.plays
                }
                initialBackhand={
                  profile?.backhand
                }
                initialCoach={
                  profile?.coach
                }
                initialTurnedPro={
                  profile?.turnedPro
                }
                initialCareerHigh={
                  profile?.careerHigh
                }
                initialAtpTitles={
                  profile?.atpTitles ??
                  0
                }
                initialAustralianOpen={
                  profile?.australianOpen ??
                  0
                }
                initialRolandGarros={
                  profile?.rolandGarros ??
                  0
                }
                initialWimbledon={
                  profile?.wimbledon ??
                  0
                }
                initialUsOpen={
                  profile?.usOpen ??
                  0
                }
                initialGrandSlams={
                  profile?.grandSlams ??
                  0
                }
                initialMasters1000={
                  profile?.masters1000 ??
                  0
                }
                initialAtpFinals={
                  profile?.atpFinals ??
                  0
                }
                initialOlympicGold={
                  profile?.olympicGold ??
                  0
                }
                initialDavisCup={
                  profile?.davisCup ??
                  0
                }
                initialPrizeMoney={toOptionalNumberString(
                  profile?.prizeMoney,
                )}
                initialFavouriteSurface={
                  profile?.favouriteSurface
                }
                createProfileByDefault={
                  Boolean(profile)
                }
              />

              <div className="border-t border-white/10 pt-10">
                <CareerTimelineSection
                  initialEvents={
                    initialCareerEvents
                  }
                />
              </div>
            </div>
          ),

          collections: (
            <CollectionsSection
              collections={
                museumCollections
              }
              initialSelectedCollectionIds={
                selectedCollectionIds
              }
            />
          ),

          seo: (
            <SeoSection
              initialMetaTitle={
                player.metaTitle
              }
              initialMetaDescription={
                player.metaDescription
              }
              initialCanonicalUrl={
                player.canonicalUrl
              }
              initialOpenGraphImage={
                player.openGraphImage
              }
              initialRobotsIndex={
                player.robotsIndex
              }
              initialRobotsFollow={
                player.robotsFollow
              }
            />
          ),

          publishing: (
            <PublishingSection
              previewHref={
                `/players/${player.slug}`
              }
            />
          ),
        }}
      />
    </AdminShell>
  );
}