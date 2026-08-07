import type {
  Metadata,
} from "next";

import Link from "next/link";

import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Gem,
  ImageIcon,
  Layers3,
  MapPin,
  Shirt,
  Sparkles,
  Star,
  Trophy,
  UserRound,
} from "lucide-react";

import {
  notFound,
} from "next/navigation";

import { prisma } from "@/lib/prisma";

export const dynamic =
  "force-dynamic";

type CollectionPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function formatCollectionType(
  value: string,
): string {
  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase(),
    );
}

function readableTextColor(
  hexColor: string,
): string {
  const normalized =
    hexColor
      .replace("#", "")
      .trim();

  if (
    !/^[0-9a-fA-F]{6}$/.test(
      normalized,
    )
  ) {
    return "#050B18";
  }

  const red =
    Number.parseInt(
      normalized.slice(0, 2),
      16,
    );

  const green =
    Number.parseInt(
      normalized.slice(2, 4),
      16,
    );

  const blue =
    Number.parseInt(
      normalized.slice(4, 6),
      16,
    );

  const luminance =
    (0.299 * red +
      0.587 * green +
      0.114 * blue) /
    255;

  return luminance > 0.58
    ? "#050B18"
    : "#FFFFFF";
}

async function getCollection(
  slug: string,
) {
  return prisma.museumCollection.findFirst(
    {
      where: {
        slug,
        status:
          "PUBLISHED",
      },

      include: {
        heroMedia: true,

        players: {
          orderBy: [
            {
              featured:
                "desc",
            },
            {
              sortOrder:
                "asc",
            },
          ],

          include: {
            player: true,
          },
        },

        artifacts: {
          orderBy: [
            {
              featured:
                "desc",
            },
            {
              sortOrder:
                "asc",
            },
          ],

          include: {
            artifact: {
              include: {
                player: true,
                brand: true,

                images: {
                  orderBy: [
                    {
                      isCover:
                        "desc",
                    },
                    {
                      sortOrder:
                        "asc",
                    },
                  ],

                  take: 1,
                },
              },
            },
          },
        },

        originals: {
          orderBy: [
            {
              featured:
                "desc",
            },
            {
              sortOrder:
                "asc",
            },
          ],

          include: {
            originalProduct: {
              include: {
                images: {
                  orderBy: [
                    {
                      isCover:
                        "desc",
                    },
                    {
                      sortOrder:
                        "asc",
                    },
                  ],

                  take: 1,
                },
              },
            },
          },
        },

        media: {
          orderBy: [
            {
              featured:
                "desc",
            },
            {
              sortOrder:
                "asc",
            },
          ],

          include: {
            mediaAsset: true,
          },
        },
      },
    },
  );
}

export async function generateMetadata({
  params,
}: CollectionPageProps): Promise<Metadata> {
  const { slug } =
    await params;

  const collection =
    await prisma.museumCollection.findFirst(
      {
        where: {
          slug,
          status:
            "PUBLISHED",
        },

        select: {
          title: true,
          subtitle: true,
          description: true,
          metaTitle: true,
          metaDescription: true,
          heroImageUrl: true,

          heroMedia: {
            select: {
              url: true,
            },
          },
        },
      },
    );

  if (!collection) {
    return {
      title:
        "Collection not found | AGE202",
    };
  }

  const description =
    collection.metaDescription ??
    collection.subtitle ??
    collection.description ??
    "Explore this curated AGE202 digital museum collection.";

  const image =
    collection.heroMedia?.url ??
    collection.heroImageUrl ??
    undefined;

  return {
    title:
      collection.metaTitle ??
      `${collection.title} | AGE202 Museum`,

    description,

    openGraph: {
      title:
        collection.metaTitle ??
        collection.title,

      description,

      images: image
        ? [
            {
              url: image,
            },
          ]
        : undefined,
    },
  };
}

export default async function CollectionPage({
  params,
}: CollectionPageProps) {
  const { slug } =
    await params;

  const collection =
    await getCollection(
      slug,
    );

  if (!collection) {
    notFound();
  }

  const heroImage =
    collection.heroMedia?.url ??
    collection.heroImageUrl;

  const primaryTextColor =
    readableTextColor(
      collection.primaryColor,
    );

  const featuredArtifact =
    collection.artifacts.find(
      (entry) =>
        entry.featured,
    ) ??
    collection.artifacts[0] ??
    null;

  const remainingArtifacts =
    collection.artifacts.filter(
      (entry) =>
        entry.id !==
        featuredArtifact?.id,
    );

  const totalLinkedItems =
    collection.players.length +
    collection.artifacts.length +
    collection.originals.length +
    collection.media.length;

  return (
    <main
      className="min-h-screen overflow-hidden bg-[#050B18] text-white"
      style={{
        "--collection-primary":
          collection.primaryColor,
        "--collection-secondary":
          collection.secondaryColor,
        "--collection-accent":
          collection.accentColor,
      } as React.CSSProperties}
    >
      <section className="relative min-h-[88vh] overflow-hidden border-b border-white/10">
        {heroImage ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroImage}
              alt={
                collection.title
              }
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-black/30" />
          </>
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background:
                `radial-gradient(circle at 70% 20%, ${collection.primaryColor}33, transparent 34%), linear-gradient(135deg, ${collection.secondaryColor}, #050B18 70%)`,
            }}
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#050B18] via-[#050B18]/45 to-black/15" />

        <div className="relative mx-auto flex min-h-[88vh] w-full max-w-7xl flex-col px-5 py-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/collections"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/20 px-4 py-2.5 text-sm font-semibold text-white/70 backdrop-blur transition hover:border-white/30 hover:bg-black/35 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Collections
            </Link>

            <span
              className="rounded-full border px-4 py-2 text-[9px] font-black uppercase tracking-[0.2em] backdrop-blur"
              style={{
                borderColor:
                  `${collection.primaryColor}66`,
                backgroundColor:
                  `${collection.primaryColor}22`,
                color:
                  collection.primaryColor,
              }}
            >
              {formatCollectionType(
                collection.type,
              )}
            </span>
          </div>

          <div className="mt-auto max-w-5xl pb-10 pt-28 sm:pb-14">
            <p
              className="text-xs font-black uppercase tracking-[0.28em]"
              style={{
                color:
                  collection.primaryColor,
              }}
            >
              {collection.eyebrow ??
                "AGE202 Digital Museum"}
            </p>

            <h1
              className="mt-5 max-w-5xl text-5xl font-black uppercase leading-[0.88] tracking-[-0.06em] sm:text-7xl lg:text-[7.5rem]"
              style={{
                color:
                  collection.accentColor,
              }}
            >
              {collection.heroTitle ??
                collection.title}
            </h1>

            <p className="mt-7 max-w-3xl text-base leading-7 text-white/65 sm:text-xl sm:leading-8">
              {collection.heroSubtitle ??
                collection.subtitle ??
                collection.description}
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href="#collection-story"
                className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition hover:scale-[1.02]"
                style={{
                  backgroundColor:
                    collection.primaryColor,
                  color:
                    primaryTextColor,
                }}
              >
                Explore collection
                <ArrowRight className="h-4 w-4" />
              </a>

              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/20 px-5 py-3 text-sm text-white/55 backdrop-blur">
                <Layers3 className="h-4 w-4" />
                {totalLinkedItems} linked items
              </span>
            </div>
          </div>
        </div>
      </section>

      <section
        id="collection-story"
        className="border-b border-white/10"
      >
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-12 lg:py-28">
          <div>
            <p
              className="text-xs font-black uppercase tracking-[0.22em]"
              style={{
                color:
                  collection.primaryColor,
              }}
            >
              Collection story
            </p>

            <h2 className="mt-5 max-w-4xl text-4xl font-semibold tracking-[-0.04em] text-white sm:text-6xl">
              {collection.title}
            </h2>

            {collection.description ? (
              <div className="mt-8 max-w-4xl whitespace-pre-line text-base leading-8 text-white/55 sm:text-lg">
                {
                  collection.description
                }
              </div>
            ) : (
              <p className="mt-8 max-w-3xl text-base leading-8 text-white/45">
                This collection is being curated inside the AGE202 Museum.
              </p>
            )}
          </div>

          <aside
            className="rounded-[2rem] border border-white/10 p-6"
            style={{
              background:
                `linear-gradient(145deg, ${collection.secondaryColor}, #07101D)`,
            }}
          >
            <Sparkles
              className="h-7 w-7"
              style={{
                color:
                  collection.primaryColor,
              }}
            />

            <p className="mt-6 text-xs font-black uppercase tracking-[0.18em] text-white/30">
              Museum index
            </p>

            <div className="mt-5 divide-y divide-white/10">
              {[
                {
                  label:
                    "Players",
                  value:
                    collection.players.length,
                  icon:
                    UserRound,
                },
                {
                  label:
                    "Artifacts",
                  value:
                    collection.artifacts.length,
                  icon: Gem,
                },
                {
                  label:
                    "Originals",
                  value:
                    collection.originals.length,
                  icon: Shirt,
                },
                {
                  label:
                    "Gallery",
                  value:
                    collection.media.length,
                  icon:
                    ImageIcon,
                },
              ].map((item) => {
                const Icon =
                  item.icon;

                return (
                  <div
                    key={
                      item.label
                    }
                    className="flex items-center justify-between py-4"
                  >
                    <span className="flex items-center gap-3 text-sm text-white/50">
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </span>

                    <span className="text-lg font-semibold text-white">
                      {item.value}
                    </span>
                  </div>
                );
              })}
            </div>
          </aside>
        </div>
      </section>

      {collection.players.length >
      0 ? (
        <section className="border-b border-white/10">
          <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p
                  className="text-xs font-black uppercase tracking-[0.22em]"
                  style={{
                    color:
                      collection.primaryColor,
                  }}
                >
                  Collection icons
                </p>

                <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
                  Players
                </h2>
              </div>

              <p className="max-w-xl text-sm leading-6 text-white/40">
                The champions and personalities connected to this museum story.
              </p>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {collection.players.map(
                (entry) => {
                  const player =
                    entry.player;

                  const image =
                    player.portraitImage ??
                    player.heroImage;

                  return (
                    <Link
                      key={entry.id}
                      href={`/players/${player.slug}`}
                      className="group overflow-hidden rounded-[2rem] border border-white/10 bg-[#08111F] transition hover:-translate-y-1 hover:border-white/20"
                    >
                      <div className="relative aspect-[16/11] overflow-hidden bg-[#07101D]">
                        {image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={image}
                            alt={
                              player.name
                            }
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                          />
                        ) : (
                          <div className="absolute inset-0 grid place-items-center">
                            <UserRound className="h-12 w-12 text-white/15" />
                          </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-[#050B18] via-transparent to-transparent" />

                        {entry.featured ? (
                          <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/15 px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.16em] text-amber-200 backdrop-blur">
                            <Star className="h-3.5 w-3.5 fill-current" />
                            Primary player
                          </span>
                        ) : null}
                      </div>

                      <div className="p-5">
                        <p className="text-[9px] font-black uppercase tracking-[0.16em] text-white/30">
                          {player.country ??
                            "International"}
                        </p>

                        <h3 className="mt-2 text-2xl font-semibold text-white">
                          {player.name}
                        </h3>

                        <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white/45 transition group-hover:text-white">
                          View player
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      </div>
                    </Link>
                  );
                },
              )}
            </div>
          </div>
        </section>
      ) : null}

      {featuredArtifact ? (
        <section className="border-b border-white/10">
          <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
            <p
              className="text-xs font-black uppercase tracking-[0.22em]"
              style={{
                color:
                  collection.primaryColor,
              }}
            >
              Featured artifact
            </p>

            <div className="mt-8 overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#08111F]">
              <div className="grid lg:grid-cols-[1.05fr_.95fr]">
                <div className="relative min-h-[420px] overflow-hidden bg-[#07101D] lg:min-h-[620px]">
                  {featuredArtifact
                    .artifact.images[0]
                    ?.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={
                        featuredArtifact
                          .artifact
                          .images[0].url
                      }
                      alt={
                        featuredArtifact
                          .artifact
                          .title
                      }
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 grid place-items-center">
                      <Gem className="h-16 w-16 text-white/15" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-[#050B18]/70 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#08111F]/35" />
                </div>

                <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">
                  <p
                    className="text-[10px] font-black uppercase tracking-[0.2em]"
                    style={{
                      color:
                        collection.primaryColor,
                    }}
                  >
                    {
                      featuredArtifact
                        .artifact
                        .archiveNumber
                    }
                  </p>

                  <h2 className="mt-5 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
                    {
                      featuredArtifact
                        .artifact.title
                    }
                  </h2>

                  <p className="mt-5 text-base leading-7 text-white/45">
                    {featuredArtifact
                      .artifact
                      .description ??
                      featuredArtifact
                        .artifact
                        .subtitle ??
                      "A featured object from this AGE202 museum collection."}
                  </p>

                  <div className="mt-8 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                      <p className="text-[8px] font-black uppercase tracking-[0.16em] text-white/25">
                        Player
                      </p>

                      <p className="mt-2 text-sm font-semibold text-white">
                        {
                          featuredArtifact
                            .artifact
                            .player.name
                        }
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                      <p className="text-[8px] font-black uppercase tracking-[0.16em] text-white/25">
                        Brand
                      </p>

                      <p className="mt-2 text-sm font-semibold text-white">
                        {
                          featuredArtifact
                            .artifact
                            .brand.name
                        }
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                      <p className="text-[8px] font-black uppercase tracking-[0.16em] text-white/25">
                        Year
                      </p>

                      <p className="mt-2 text-sm font-semibold text-white">
                        {featuredArtifact
                          .artifact
                          .year ??
                          "Unknown"}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                      <p className="text-[8px] font-black uppercase tracking-[0.16em] text-white/25">
                        Rarity
                      </p>

                      <p className="mt-2 text-sm font-semibold text-white">
                        {
                          featuredArtifact
                            .artifact
                            .rarity
                        }
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/artifacts/${featuredArtifact.artifact.slug}`}
                    className="mt-8 inline-flex w-fit items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition hover:scale-[1.02]"
                    style={{
                      backgroundColor:
                        collection.primaryColor,
                      color:
                        primaryTextColor,
                    }}
                  >
                    Explore artifact
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {remainingArtifacts.length >
      0 ? (
        <section className="border-b border-white/10">
          <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
            <div>
              <p
                className="text-xs font-black uppercase tracking-[0.22em]"
                style={{
                  color:
                    collection.primaryColor,
                }}
              >
                Museum objects
              </p>

              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
                Artifacts
              </h2>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {remainingArtifacts.map(
                (entry) => {
                  const artifact =
                    entry.artifact;

                  const image =
                    artifact.images[0]
                      ?.url;

                  return (
                    <Link
                      key={entry.id}
                      href={`/artifacts/${artifact.slug}`}
                      className="group overflow-hidden rounded-[2rem] border border-white/10 bg-[#08111F] transition hover:-translate-y-1 hover:border-white/20"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-[#07101D]">
                        {image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={image}
                            alt={
                              artifact.title
                            }
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                          />
                        ) : (
                          <div className="absolute inset-0 grid place-items-center">
                            <Gem className="h-12 w-12 text-white/15" />
                          </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-[#050B18] via-transparent to-transparent" />

                        {entry.featured ? (
                          <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/15 px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.16em] text-amber-200 backdrop-blur">
                            <Star className="h-3.5 w-3.5 fill-current" />
                            Featured
                          </span>
                        ) : null}
                      </div>

                      <div className="p-5">
                        <p
                          className="text-[9px] font-black uppercase tracking-[0.16em]"
                          style={{
                            color:
                              collection.primaryColor,
                          }}
                        >
                          {
                            artifact.archiveNumber
                          }
                        </p>

                        <h3 className="mt-2 line-clamp-2 text-xl font-semibold text-white">
                          {
                            artifact.title
                          }
                        </h3>

                        <p className="mt-3 text-xs text-white/35">
                          {
                            artifact.player.name
                          }{" "}
                          ·{" "}
                          {
                            artifact.brand.name
                          }
                          {artifact.year
                            ? ` · ${artifact.year}`
                            : ""}
                        </p>

                        <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white/45 transition group-hover:text-white">
                          View artifact
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      </div>
                    </Link>
                  );
                },
              )}
            </div>
          </div>
        </section>
      ) : null}

      {collection.originals.length >
      0 ? (
        <section className="border-b border-white/10">
          <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
            <p
              className="text-xs font-black uppercase tracking-[0.22em]"
              style={{
                color:
                  collection.primaryColor,
              }}
            >
              AGE202 Originals
            </p>

            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
              Inspired by the archive
            </h2>

            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {collection.originals.map(
                (entry) => {
                  const product =
                    entry.originalProduct;

                  const image =
                    product.images[0]
                      ?.url;

                  return (
                    <Link
                      key={entry.id}
                      href={`/age202-originals/${product.slug}`}
                      className="group overflow-hidden rounded-[2rem] border border-white/10 bg-[#08111F] transition hover:-translate-y-1 hover:border-white/20"
                    >
                      <div className="relative aspect-square overflow-hidden bg-[#07101D]">
                        {image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={image}
                            alt={
                              product.title
                            }
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                          />
                        ) : (
                          <div className="absolute inset-0 grid place-items-center">
                            <Shirt className="h-12 w-12 text-white/15" />
                          </div>
                        )}
                      </div>

                      <div className="p-5">
                        <p
                          className="text-[9px] font-black uppercase tracking-[0.16em]"
                          style={{
                            color:
                              collection.primaryColor,
                          }}
                        >
                          {
                            product.category
                          }
                        </p>

                        <h3 className="mt-2 text-xl font-semibold text-white">
                          {
                            product.title
                          }
                        </h3>

                        <p className="mt-3 text-sm text-white/35">
                          {product.subtitle ??
                            product.collection ??
                            "AGE202 Original"}
                        </p>
                      </div>
                    </Link>
                  );
                },
              )}
            </div>
          </div>
        </section>
      ) : null}

      {collection.media.length >
      0 ? (
        <section className="border-b border-white/10">
          <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
            <p
              className="text-xs font-black uppercase tracking-[0.22em]"
              style={{
                color:
                  collection.primaryColor,
              }}
            >
              Visual archive
            </p>

            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
              Gallery
            </h2>

            <div className="mt-10 columns-1 gap-5 sm:columns-2 lg:columns-3">
              {collection.media.map(
                (entry) => (
                  <figure
                    key={entry.id}
                    className="mb-5 break-inside-avoid overflow-hidden rounded-[2rem] border border-white/10 bg-[#08111F]"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        entry.mediaAsset
                          .url
                      }
                      alt={
                        entry.mediaAsset
                          .alt ??
                        entry.mediaAsset
                          .title
                      }
                      className="h-auto w-full"
                    />

                    {entry.caption ? (
                      <figcaption className="p-4 text-sm leading-6 text-white/45">
                        {entry.caption}
                      </figcaption>
                    ) : null}
                  </figure>
                ),
              )}
            </div>
          </div>
        </section>
      ) : null}

      <section>
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-20 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-12 lg:py-24">
          <div>
            <p
              className="text-xs font-black uppercase tracking-[0.22em]"
              style={{
                color:
                  collection.primaryColor,
              }}
            >
              Continue exploring
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
              Discover more from the AGE202 Museum.
            </h2>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/collections"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white/60 transition hover:border-white/30 hover:bg-white/5 hover:text-white"
            >
              <Layers3 className="h-4 w-4" />
              All collections
            </Link>

            <Link
              href="/artifacts"
              className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition hover:scale-[1.02]"
              style={{
                backgroundColor:
                  collection.primaryColor,
                color:
                  primaryTextColor,
              }}
            >
              <Trophy className="h-4 w-4" />
              Explore artifacts
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}