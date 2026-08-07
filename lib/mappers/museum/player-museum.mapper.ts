import type {
  PlayerMuseumData,
} from "@/lib/types/player-museum";

import type {
  getPlayerBySlug,
} from "@/lib/repositories/player.repository";

type MuseumPlayerRecord =
  NonNullable<
    Awaited<
      ReturnType<
        typeof getPlayerBySlug
      >
    >
  >;

export function mapPlayerToMuseumData(
  player: MuseumPlayerRecord,
): PlayerMuseumData {
  return {
    id: player.id,

    name: player.name,

    slug: player.slug,

    firstName:
      player.firstName,

    lastName:
      player.lastName,

    nickname:
      player.nickname,

    country:
      player.country ??
      player.atpPlayer?.country ??
      null,

    quote:
      player.quote,

    biography:
      player.biography,

    heroImage:
      player.heroImage,

    portraitImage:
      player.portraitImage,

    accent:
      player.accent,

    collectionType:
      player.collectionType,

    profile:
      player.playerProfile
        ? {
            birthDate:
              player.playerProfile
                .birthDate,

            birthPlace:
              player.playerProfile
                .birthPlace,

            residence:
              player.playerProfile
                .residence,

            height:
              player.playerProfile
                .height,

            weight:
              player.playerProfile
                .weight,

            plays:
              player.playerProfile
                .plays,

            backhand:
              player.playerProfile
                .backhand,

            coach:
              player.playerProfile
                .coach,

            turnedPro:
              player.playerProfile
                .turnedPro,

            careerHigh:
              player.playerProfile
                .careerHigh,

            atpTitles:
              player.playerProfile
                .atpTitles,

            australianOpen:
              player.playerProfile
                .australianOpen,

            rolandGarros:
              player.playerProfile
                .rolandGarros,

            wimbledon:
              player.playerProfile
                .wimbledon,

            usOpen:
              player.playerProfile
                .usOpen,

            grandSlams:
              player.playerProfile
                .grandSlams,

            masters1000:
              player.playerProfile
                .masters1000,

            atpFinals:
              player.playerProfile
                .atpFinals,

            olympicGold:
              player.playerProfile
                .olympicGold,

            davisCup:
              player.playerProfile
                .davisCup,

            prizeMoney:
              player.playerProfile
                .prizeMoney
                ? player.playerProfile
                    .prizeMoney
                    .toString()
                : null,

            playingStyle:
              player.playerProfile
                .playingStyle,

            favouriteSurface:
              player.playerProfile
                .favouriteSurface,

            biographyShort:
              player.playerProfile
                .biographyShort,

            biographyLong:
              player.playerProfile
                .biographyLong,
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

    careerEvents: [],

    equipment:
      player.equipment.map(
        (item) => ({
          id: item.id,

          category:
            item.category,

          name: item.name,

          brand:
            item.brand,

          period:
            item.period,

          description:
            item.description,

          curiosity:
            item.curiosity,

          imageUrl:
            item.imageUrl,

          featured:
            item.featured,

          sortOrder:
            item.sortOrder,
        }),
      ),

    artifacts:
      player.artifacts.map(
        (artifact) => ({
          id: artifact.id,

          slug: artifact.slug,

          title: artifact.title,

          subtitle:
            artifact.subtitle,

          archiveNumber:
            artifact.archiveNumber,

          availability:
            artifact.availability,

          vintedUrl:
            artifact.vintedUrl,

          price:
            artifact.price
              ? artifact.price.toString()
              : null,

          currency:
            artifact.currency,

          brand: {
            name:
              artifact.brand.name,
          },

          images:
            artifact.images.map(
              (image) => ({
                id: image.id,

                url: image.url,

                alt: image.alt,

                isCover:
                  image.isCover,

                sortOrder:
                  image.sortOrder,
              }),
            ),
        }),
      ),
  };
}