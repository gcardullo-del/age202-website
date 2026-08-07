import Image from "next/image";
import Link from "next/link";

import {
  Archive,
  Eye,
  Filter,
  FolderKanban,
  ImageIcon,
  Layers3,
  Pencil,
  Plus,
  Search,
  Star,
  Users,
  X,
} from "lucide-react";

import type {
  CollectionStatus,
  CollectionType,
  Prisma,
} from "@/generated/prisma/client";

import AdminShell from "@/components/admin/AdminShell";
import AdminEmptyState from "@/components/admin/ui/AdminEmptyState";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import AdminPanel from "@/components/admin/ui/AdminPanel";
import AdminStatsGrid from "@/components/admin/ui/AdminStatsGrid";

import { prisma } from "@/lib/prisma";

export const dynamic =
  "force-dynamic";

type CollectionsPageProps = {
  searchParams: Promise<{
    q?: string;
    status?: string;
    type?: string;
    featured?: string;
  }>;
};

const COLLECTION_STATUSES =
  new Set<CollectionStatus>([
    "DRAFT",
    "PUBLISHED",
    "ARCHIVED",
  ]);

const COLLECTION_TYPES =
  new Set<CollectionType>([
    "PLAYER",
    "ERA",
    "TOURNAMENT",
    "THEME",
    "BRAND",
    "OTHER",
  ]);

function normalize(
  value: string | undefined,
): string {
  return value?.trim() ?? "";
}

function parseEnumFilter<
  T extends string,
>(
  value: string | undefined,
  allowedValues: Set<T>,
): T | undefined {
  const normalized =
    value?.trim();

  if (
    !normalized ||
    !allowedValues.has(
      normalized as T,
    )
  ) {
    return undefined;
  }

  return normalized as T;
}

function formatLabel(
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

function statusClasses(
  status: CollectionStatus,
): string {
  switch (status) {
    case "PUBLISHED":
      return "border-emerald-400/20 bg-emerald-400/10 text-emerald-200";

    case "DRAFT":
      return "border-amber-400/20 bg-amber-400/10 text-amber-200";

    case "ARCHIVED":
      return "border-white/10 bg-white/[0.05] text-white/45";
  }
}

function typeClasses(
  type: CollectionType,
): string {
  switch (type) {
    case "PLAYER":
      return "border-lime-300/20 bg-lime-300/10 text-lime-200";

    case "TOURNAMENT":
      return "border-sky-400/20 bg-sky-400/10 text-sky-200";

    case "ERA":
      return "border-violet-400/20 bg-violet-400/10 text-violet-200";

    case "BRAND":
      return "border-orange-400/20 bg-orange-400/10 text-orange-200";

    case "THEME":
      return "border-fuchsia-400/20 bg-fuchsia-400/10 text-fuchsia-200";

    case "OTHER":
      return "border-white/10 bg-white/[0.05] text-white/45";
  }
}

export default async function CollectionsPage({
  searchParams,
}: CollectionsPageProps) {
  const params =
    await searchParams;

  const query =
    normalize(params.q);

  const status =
    parseEnumFilter(
      params.status,
      COLLECTION_STATUSES,
    );

  const type =
    parseEnumFilter(
      params.type,
      COLLECTION_TYPES,
    );

  const featured =
    normalize(
      params.featured,
    );

  const where = {
    ...(query
      ? {
          OR: [
            {
              name: {
                contains: query,
                mode:
                  "insensitive" as const,
              },
            },
            {
              title: {
                contains: query,
                mode:
                  "insensitive" as const,
              },
            },
            {
              subtitle: {
                contains: query,
                mode:
                  "insensitive" as const,
              },
            },
            {
              slug: {
                contains: query,
                mode:
                  "insensitive" as const,
              },
            },
          ],
        }
      : {}),

    ...(status
      ? {
          status,
        }
      : {}),

    ...(type
      ? {
          type,
        }
      : {}),

    ...(featured === "yes"
      ? {
          featured: true,
        }
      : featured === "no"
        ? {
            featured: false,
          }
        : {}),
  } satisfies Prisma.MuseumCollectionWhereInput;

  const [
    collections,
    totalCount,
    publishedCount,
    draftCount,
    featuredCount,
  ] = await Promise.all([
    prisma.museumCollection.findMany(
      {
        where,

        include: {
          heroMedia: true,

          _count: {
            select: {
              players: true,
              artifacts: true,
              originals: true,
              media: true,
            },
          },
        },

        orderBy: [
          {
            featured: "desc",
          },
          {
            displayOrder: "asc",
          },
          {
            updatedAt: "desc",
          },
        ],
      },
    ),

    prisma.museumCollection.count(),

    prisma.museumCollection.count(
      {
        where: {
          status:
            "PUBLISHED",
        },
      },
    ),

    prisma.museumCollection.count(
      {
        where: {
          status: "DRAFT",
        },
      },
    ),

    prisma.museumCollection.count(
      {
        where: {
          featured: true,
        },
      },
    ),
  ]);

  const hasActiveFilters =
    Boolean(
      query ||
        status ||
        type ||
        featured,
    );

  return (
    <AdminShell
      title="Collections"
      description="Build and publish the curated stories of the AGE202 digital museum."
    >
      <div className="space-y-7">
        <AdminPageHeader
          eyebrow="Digital Museum Builder"
          title="Museum Collections"
          description="Create player archives, tournament stories, historical eras and thematic exhibitions from one central workspace."
          icon={FolderKanban}
          actionLabel="New Collection"
          actionHref="/admin/collections/new"
          actionIcon={Plus}
        />

        <AdminStatsGrid
          columns={4}
          items={[
            {
              label:
                "Total collections",
              value: totalCount,
              icon: Layers3,
              tone: "neutral",
            },
            {
              label: "Published",
              value:
                publishedCount,
              icon: Eye,
              tone: "success",
            },
            {
              label: "Drafts",
              value: draftCount,
              icon: Pencil,
              tone: "warning",
            },
            {
              label: "Featured",
              value:
                featuredCount,
              icon: Star,
              tone: "museum",
            },
          ]}
        />

        <AdminPanel className="p-5 sm:p-6">
          <form
            method="get"
            className="space-y-4"
          >
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/35">
                  <Filter className="h-4 w-4" />
                  Collection filters
                </div>

                <p className="mt-2 text-sm text-white/45">
                  Search and filter the
                  museum collection
                  catalog.
                </p>
              </div>

              {hasActiveFilters ? (
                <Link
                  href="/admin/collections"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-white/55 transition hover:text-white"
                >
                  <X className="h-4 w-4" />
                  Clear filters
                </Link>
              ) : null}
            </div>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_190px_190px_190px_auto]">
              <label className="relative md:col-span-2 xl:col-span-1">
                <span className="sr-only">
                  Search collections
                </span>

                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />

                <input
                  type="search"
                  name="q"
                  defaultValue={query}
                  placeholder="Name, title, subtitle or slug..."
                  className="h-12 w-full rounded-2xl border border-white/10 bg-[#08111F] pl-11 pr-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-lime-300/35"
                />
              </label>

              <select
                name="status"
                defaultValue={
                  status ?? ""
                }
                className="h-12 rounded-2xl border border-white/10 bg-[#08111F] px-4 text-sm text-white/70 outline-none focus:border-lime-300/35"
              >
                <option value="">
                  All statuses
                </option>
                <option value="DRAFT">
                  Draft
                </option>
                <option value="PUBLISHED">
                  Published
                </option>
                <option value="ARCHIVED">
                  Archived
                </option>
              </select>

              <select
                name="type"
                defaultValue={
                  type ?? ""
                }
                className="h-12 rounded-2xl border border-white/10 bg-[#08111F] px-4 text-sm text-white/70 outline-none focus:border-lime-300/35"
              >
                <option value="">
                  All types
                </option>
                <option value="PLAYER">
                  Player
                </option>
                <option value="ERA">
                  Era
                </option>
                <option value="TOURNAMENT">
                  Tournament
                </option>
                <option value="THEME">
                  Theme
                </option>
                <option value="BRAND">
                  Brand
                </option>
                <option value="OTHER">
                  Other
                </option>
              </select>

              <select
                name="featured"
                defaultValue={
                  featured
                }
                className="h-12 rounded-2xl border border-white/10 bg-[#08111F] px-4 text-sm text-white/70 outline-none focus:border-lime-300/35"
              >
                <option value="">
                  All visibility
                </option>
                <option value="yes">
                  Featured
                </option>
                <option value="no">
                  Not featured
                </option>
              </select>

              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-white px-5 text-sm font-semibold text-[#050B18] transition hover:bg-lime-200"
              >
                <Search className="h-4 w-4" />
                Apply
              </button>
            </div>
          </form>
        </AdminPanel>

        {collections.length > 0 ? (
          <div className="grid gap-5 lg:grid-cols-2 2xl:grid-cols-3">
            {collections.map(
              (collection) => {
                const heroImage =
                  collection.heroMedia
                    ?.url ??
                  collection.heroImageUrl;

                const linkedContentCount =
                  collection._count
                    .players +
                  collection._count
                    .artifacts +
                  collection._count
                    .originals +
                  collection._count
                    .media;

                return (
                  <AdminPanel
                    key={
                      collection.id
                    }
                    className="group overflow-hidden"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden bg-[radial-gradient(circle_at_50%_25%,rgba(190,242,100,.13),transparent_38%),#07101D]">
                      {heroImage ? (
                        <Image
                          src={
                            heroImage
                          }
                          alt={
                            collection.title
                          }
                          fill
                          sizes="(max-width: 1024px) 100vw, 33vw"
                          className="object-cover transition duration-500 group-hover:scale-[1.025]"
                        />
                      ) : (
                        <div className="absolute inset-0 grid place-items-center">
                          <ImageIcon className="h-10 w-10 text-lime-300/35" />
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-[#050B18] via-[#050B18]/15 to-transparent" />

                      <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                        <span
                          className={[
                            "rounded-full border px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.16em] backdrop-blur",
                            statusClasses(
                              collection.status,
                            ),
                          ].join(" ")}
                        >
                          {formatLabel(
                            collection.status,
                          )}
                        </span>

                        <span
                          className={[
                            "rounded-full border px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.16em] backdrop-blur",
                            typeClasses(
                              collection.type,
                            ),
                          ].join(" ")}
                        >
                          {formatLabel(
                            collection.type,
                          )}
                        </span>
                      </div>

                      {collection.featured ? (
                        <span className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-lime-300/25 bg-lime-300/15 text-lime-200 backdrop-blur">
                          <Star className="h-4 w-4 fill-current" />
                        </span>
                      ) : null}
                    </div>

                    <div className="p-5">
                      <p className="text-[9px] font-black uppercase tracking-[0.18em] text-lime-300/70">
                        {collection.eyebrow ??
                          "AGE202 Museum"}
                      </p>

                      <h2 className="mt-2 text-xl font-semibold tracking-tight text-white">
                        {collection.title}
                      </h2>

                      <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-white/40">
                        {collection.subtitle ??
                          collection.description ??
                          "No collection introduction has been added yet."}
                      </p>

                      <div className="mt-5 grid grid-cols-4 gap-2 border-y border-white/10 py-4 text-center">
                        <div>
                          <p className="text-lg font-semibold text-white">
                            {
                              collection
                                ._count
                                .players
                            }
                          </p>
                          <p className="mt-1 text-[8px] font-black uppercase tracking-[0.14em] text-white/30">
                            Players
                          </p>
                        </div>

                        <div>
                          <p className="text-lg font-semibold text-white">
                            {
                              collection
                                ._count
                                .artifacts
                            }
                          </p>
                          <p className="mt-1 text-[8px] font-black uppercase tracking-[0.14em] text-white/30">
                            Artifacts
                          </p>
                        </div>

                        <div>
                          <p className="text-lg font-semibold text-white">
                            {
                              collection
                                ._count
                                .originals
                            }
                          </p>
                          <p className="mt-1 text-[8px] font-black uppercase tracking-[0.14em] text-white/30">
                            Originals
                          </p>
                        </div>

                        <div>
                          <p className="text-lg font-semibold text-white">
                            {
                              collection
                                ._count
                                .media
                            }
                          </p>
                          <p className="mt-1 text-[8px] font-black uppercase tracking-[0.14em] text-white/30">
                            Media
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-xs text-white/35">
                          {linkedContentCount >
                          0 ? (
                            <Users className="h-3.5 w-3.5" />
                          ) : (
                            <Archive className="h-3.5 w-3.5" />
                          )}

                          {linkedContentCount}{" "}
                          linked items
                        </div>

                        <Link
                          href={`/admin/collections/${collection.id}`}
                          className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs font-semibold text-white/60 transition hover:border-lime-300/25 hover:bg-lime-300/5 hover:text-lime-200"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Edit
                        </Link>
                      </div>
                    </div>
                  </AdminPanel>
                );
              },
            )}
          </div>
        ) : (
          <AdminPanel>
            {hasActiveFilters ? (
              <AdminEmptyState
                title="No matching collections"
                description="Adjust or clear the current filters to see the museum collection catalog."
                actionLabel="Clear filters"
                actionHref="/admin/collections"
                icon={Search}
              />
            ) : (
              <AdminEmptyState
                title="Build the first museum collection"
                description="Create Federer, Nadal, Djokovic, Sinner, Alcaraz or any future AGE202 exhibition from the Collections Builder."
                actionLabel="New Collection"
                actionHref="/admin/collections/new"
                icon={FolderKanban}
              />
            )}
          </AdminPanel>
        )}
      </div>
    </AdminShell>
  );
}