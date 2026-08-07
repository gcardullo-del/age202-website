import type {
  PlayerDashboardData,
} from "@/lib/types/player-dashboard";

import type {
  getAdminPlayer,
} from "@/lib/repositories/admin/admin-player.repository";

type AdminPlayerRecord =
  NonNullable<
    Awaited<
      ReturnType<
        typeof getAdminPlayer
      >
    >
  >;

export function mapPlayerToDashboardData(
  player: AdminPlayerRecord,
): PlayerDashboardData {
  return {
    id: player.id,
    name: player.name,
    slug: player.slug,
    firstName: player.firstName,
    lastName: player.lastName,
    nickname: player.nickname,
    country:
      player.country ??
      player.atpPlayer?.country ??
      null,
    quote: player.quote,
    biography:
      player.biography,
    heroImage:
      player.heroImage,
    portraitImage:
      player.portraitImage,
    accent: player.accent,
    active: player.active,
    collectionType:
      player.collectionType,
    publishedAt:
      player.publishedAt,
    createdAt:
      player.createdAt,
    updatedAt:
      player.updatedAt,

    profile:
      player.playerProfile
        ? {
            careerHigh:
              player.playerProfile
                .careerHigh,
            atpTitles:
              player.playerProfile
                .atpTitles,
            grandSlams:
              player.playerProfile
                .grandSlams,
            masters1000:
              player.playerProfile
                .masters1000,
          }
        : null,

    ranking:
      player.atpPlayer
        ? {
            rank:
              player.atpPlayer
                .rank,
            previousRank:
              player.atpPlayer
                .previousRank,
            points:
              player.atpPlayer
                .points,
            country:
              player.atpPlayer
                .country,
            countryCode:
              player.atpPlayer
                .countryCode,
            imageUrl:
              player.atpPlayer
                .imageUrl,
          }
        : null,

    careerEvents:
      player.careerEvents.map(
        (event) => ({
          id: event.id,
          year: event.year,
          month: event.month,
          day: event.day,
          title: event.title,
          subtitle:
            event.subtitle,
          description:
            event.description,
          category:
            event.category,
          imageUrl:
            event.imageUrl,
          location:
            event.location,
          tournament:
            event.tournament,
          featured:
            event.featured,
          sortOrder:
            event.sortOrder,
        }),
      ),

    stats: {
      artifacts:
        player._count
          .artifacts,
      collections:
        player._count
          .museumCollections,
      careerEvents:
        player.careerEvents
          .length,
    },
  };
}