import Image from "next/image";
import Link from "next/link";

import {
  Activity,
  CircleOff,
  Crown,
  Filter,
  ImageIcon,
  LayoutDashboard,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Trophy,
  UserRound,
  Users,
  X,
} from "lucide-react";

import type {
  PlayerCollectionType,
} from "@/generated/prisma/client";

import AdminShell from "@/components/admin/AdminShell";
import AdminEmptyState from "@/components/admin/ui/AdminEmptyState";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import AdminPanel from "@/components/admin/ui/AdminPanel";
import AdminStatsGrid from "@/components/admin/ui/AdminStatsGrid";

import {
  getAdminPlayers,
  getPlayerStats,
  type AdminPlayerProfileFilter,
  type AdminPlayerStatusFilter,
} from "@/lib/repositories/admin/admin-player.repository";

export const dynamic =
  "force-dynamic";

type PlayersPageProps = {
  searchParams: Promise<{
    q?: string;
    status?: string;
    type?: string;
    profile?: string;
  }>;
};

const PLAYER_COLLECTION_TYPES =
  new Set<PlayerCollectionType>([
    "FEATURED",
    "LEGEND",
    "RISING_STAR",
    "ARCHIVE",
  ]);

const STATUS_FILTERS =
  new Set<AdminPlayerStatusFilter>([
    "",
    "active",
    "inactive",
  ]);

const PROFILE_FILTERS =
  new Set<AdminPlayerProfileFilter>([
    "",
    "complete",
    "missing",
  ]);

function normalize(
  value: string | undefined,
): string {
  return value?.trim() ?? "";
}

function parseCollectionType(
  value: string | undefined,
): PlayerCollectionType | "" {
  const normalized =
    normalize(value);

  if (
    !normalized ||
    !PLAYER_COLLECTION_TYPES.has(
      normalized as PlayerCollectionType,
    )
  ) {
    return "";
  }

  return normalized as PlayerCollectionType;
}

function parseStatus(
  value: string | undefined,
): AdminPlayerStatusFilter {
  const normalized =
    normalize(value) as AdminPlayerStatusFilter;

  return STATUS_FILTERS.has(
    normalized,
  )
    ? normalized
    : "";
}

function parseProfile(
  value: string | undefined,
): AdminPlayerProfileFilter {
  const normalized =
    normalize(value) as AdminPlayerProfileFilter;

  return PROFILE_FILTERS.has(
    normalized,
  )
    ? normalized
    : "";
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

function collectionTypeClasses(
  type: PlayerCollectionType,
): string {
  switch (type) {
    case "FEATURED":
      return "border-lime-300/20 bg-lime-300/10 text-lime-200";

    case "LEGEND":
      return "border-amber-300/20 bg-amber-300/10 text-amber-200";

    case "RISING_STAR":
      return "border-sky-400/20 bg-sky-400/10 text-sky-200";

    case "ARCHIVE":
      return "border-white/10 bg-white/[0.05] text-white/45";
  }
}

function rankingMovement(
  rank: number,
  previousRank: number | null,
): {
  label: string;
  className: string;
} {
  if (
    previousRank === null ||
    previousRank === rank
  ) {
    return {
      label: "—",
      className:
        "text-white/30",
    };
  }

  const difference =
    previousRank - rank;

  if (difference > 0) {
    return {
      label: `+${difference}`,
      className:
        "text-emerald-300",
    };
  }

  return {
    label:
      difference.toString(),
    className:
      "text-red-300",
  };
}

export default async function PlayersPage({
  searchParams,
}: PlayersPageProps) {
  const params =
    await searchParams;

  const query =
    normalize(params.q);

  const status =
    parseStatus(
      params.status,
    );

  const collectionType =
    parseCollectionType(
      params.type,
    );

  const profile =
    parseProfile(
      params.profile,
    );

  const [
    players,
    stats,
  ] = await Promise.all([
    getAdminPlayers({
      query,
      status,
      collectionType,
      profile,
    }),

    getPlayerStats(),
  ]);

  const hasActiveFilters =
    Boolean(
      query ||
        status ||
        collectionType ||
        profile,
    );

  return (
    <AdminShell
      title="Players"
      description="Manage the champions, legends and ATP profiles that power the AGE202 archive."
    >
      <div className="space-y-7">
        <AdminPageHeader
          eyebrow="Player Studio"
          title="Players"
          description="Create and maintain player identities, ATP links, biographies, collections and archive profiles from one central workspace."
          icon={Users}
          actionLabel="New Player"
          actionHref="/admin/players/new"
          actionIcon={Plus}
        />

        <AdminStatsGrid
          columns={4}
          items={[
            {
              label:
                "Total players",
              value: stats.total,
              icon: Users,
              tone: "neutral",
            },
            {
              label: "Active",
              value: stats.active,
              icon: Activity,
              tone: "success",
            },
            {
              label: "Featured",
              value:
                stats.featured,
              icon: Crown,
              tone: "museum",
            },
            {
              label:
                "ATP linked",
              value:
                stats.linkedToAtp,
              icon: Trophy,
              tone: "warning",
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
                  Player filters
                </div>

                <p className="mt-2 text-sm text-white/45">
                  Search and filter the complete AGE202 player archive.
                </p>
              </div>

              {hasActiveFilters ? (
                <Link
                  href="/admin/players"
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
                  Search players
                </span>

                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />

                <input
                  type="search"
                  name="q"
                  defaultValue={query}
                  placeholder="Name, nickname, slug or country..."
                  className="h-12 w-full rounded-2xl border border-white/10 bg-[#08111F] pl-11 pr-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-lime-300/35"
                />
              </label>

              <select
                name="status"
                defaultValue={status}
                className="h-12 rounded-2xl border border-white/10 bg-[#08111F] px-4 text-sm text-white/70 outline-none focus:border-lime-300/35"
              >
                <option value="">
                  All statuses
                </option>
                <option value="active">
                  Active
                </option>
                <option value="inactive">
                  Inactive
                </option>
              </select>

              <select
                name="type"
                defaultValue={
                  collectionType
                }
                className="h-12 rounded-2xl border border-white/10 bg-[#08111F] px-4 text-sm text-white/70 outline-none focus:border-lime-300/35"
              >
                <option value="">
                  All archive types
                </option>
                <option value="FEATURED">
                  Featured
                </option>
                <option value="LEGEND">
                  Legend
                </option>
                <option value="RISING_STAR">
                  Rising Star
                </option>
                <option value="ARCHIVE">
                  Archive
                </option>
              </select>

              <select
                name="profile"
                defaultValue={profile}
                className="h-12 rounded-2xl border border-white/10 bg-[#08111F] px-4 text-sm text-white/70 outline-none focus:border-lime-300/35"
              >
                <option value="">
                  All profiles
                </option>
                <option value="complete">
                  Profile created
                </option>
                <option value="missing">
                  Profile missing
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

        {players.length > 0 ? (
          <div className="grid gap-5 lg:grid-cols-2 2xl:grid-cols-3">
            {players.map(
              (player) => {
                const image =
                  player.heroImage ??
                  player.portraitImage ??
                  player.atpPlayer
                    ?.imageUrl ??
                  null;

                const ranking =
                  player.atpPlayer;

                const movement =
                  ranking
                    ? rankingMovement(
                        ranking.rank,
                        ranking.previousRank,
                      )
                    : null;

                const publishedCollections =
                  player.museumCollections.filter(
                    (entry) =>
                      entry.collection
                        .status ===
                      "PUBLISHED",
                  ).length;

                const dashboardHref =
  `/admin/players/${player.id}`;

                const editHref =
                  `/admin/players/${player.id}`;

                return (
                  <AdminPanel
                    key={player.id}
                    className="group overflow-hidden"
                  >
                    <Link
                      href={dashboardHref}
                      className="block outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-lime-300/40"
                      aria-label={`Open ${player.name} dashboard`}
                    >
                      <div className="relative aspect-[16/10] overflow-hidden bg-[radial-gradient(circle_at_50%_25%,rgba(190,242,100,.13),transparent_38%),#07101D]">
                        {image ? (
                          <Image
                            src={image}
                            alt={player.name}
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
                              player.active
                                ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
                                : "border-red-400/20 bg-red-400/10 text-red-200",
                            ].join(" ")}
                          >
                            {player.active
                              ? "Active"
                              : "Inactive"}
                          </span>

                          <span
                            className={[
                              "rounded-full border px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.16em] backdrop-blur",
                              collectionTypeClasses(
                                player.collectionType,
                              ),
                            ].join(" ")}
                          >
                            {formatLabel(
                              player.collectionType,
                            )}
                          </span>
                        </div>

                        {ranking ? (
                          <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-2xl border border-white/10 bg-black/45 px-3 py-2 backdrop-blur">
                            <span className="text-lg font-semibold text-white">
                              ATP #{ranking.rank}
                            </span>

                            <span
                              className={[
                                "text-xs font-semibold",
                                movement?.className ??
                                  "text-white/30",
                              ].join(" ")}
                            >
                              {movement?.label ??
                                "—"}
                            </span>
                          </div>
                        ) : null}

                        {player.playerProfile ? (
                          <span className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full border border-lime-300/25 bg-lime-300/15 px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.16em] text-lime-200 backdrop-blur">
                            <Sparkles className="h-3.5 w-3.5" />
                            Profile
                          </span>
                        ) : null}
                      </div>

                      <div className="p-5 pb-4">
                        <p className="text-[9px] font-black uppercase tracking-[0.18em] text-lime-300/70">
                          {player.country ??
                            ranking?.country ??
                            "International"}
                        </p>

                        <h2 className="mt-2 text-xl font-semibold tracking-tight text-white">
                          {player.name}
                        </h2>

                        <p className="mt-2 min-h-5 text-sm text-white/40">
                          {player.nickname
                            ? `“${player.nickname}”`
                            : player.slug}
                        </p>

                        <div className="mt-5 grid grid-cols-3 gap-2 border-y border-white/10 py-4 text-center">
                          <div>
                            <p className="text-lg font-semibold text-white">
                              {
                                player._count
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
                                player._count
                                  .museumCollections
                              }
                            </p>

                            <p className="mt-1 text-[8px] font-black uppercase tracking-[0.14em] text-white/30">
                              Collections
                            </p>
                          </div>

                          <div>
                            <p className="text-lg font-semibold text-white">
                              {publishedCollections}
                            </p>

                            <p className="mt-1 text-[8px] font-black uppercase tracking-[0.14em] text-white/30">
                              Published
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>

                    <div className="flex items-center justify-between gap-3 px-5 pb-5">
                      <div className="flex items-center gap-2 text-xs text-white/35">
                        {ranking ? (
                          <Trophy className="h-3.5 w-3.5" />
                        ) : player.active ? (
                          <UserRound className="h-3.5 w-3.5" />
                        ) : (
                          <CircleOff className="h-3.5 w-3.5" />
                        )}

                        {ranking
                          ? `${ranking.points ?? 0} ATP points`
                          : "No ATP link"}
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={dashboardHref}
                          className="inline-flex items-center gap-2 rounded-xl border border-lime-300/20 bg-lime-300/[0.05] px-3 py-2 text-xs font-semibold text-lime-200 transition hover:bg-lime-300/10"
                        >
                          <LayoutDashboard className="h-3.5 w-3.5" />
                          Dashboard
                        </Link>

                        <Link
                          href={editHref}
                          className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs font-semibold text-white/60 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
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
                title="No matching players"
                description="Adjust or clear the current filters to see the player archive."
                actionLabel="Clear filters"
                actionHref="/admin/players"
                icon={Search}
              />
            ) : (
              <AdminEmptyState
                title="Create the first player"
                description="Add a champion, legend or rising star to begin building the AGE202 Player Studio."
                actionLabel="New Player"
                actionHref="/admin/players/new"
                icon={UserRound}
              />
            )}
          </AdminPanel>
        )}
      </div>
    </AdminShell>
  );
}