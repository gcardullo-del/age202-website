import Image from "next/image";
import Link from "next/link";

import {
  Activity,
  ArrowRight,
  Link2,
  ListOrdered,
  Search,
  Trophy,
  UserRound,
  Users,
  X,
} from "lucide-react";

import AdminShell from "@/components/admin/AdminShell";
import AdminEmptyState from "@/components/admin/ui/AdminEmptyState";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import AdminPanel from "@/components/admin/ui/AdminPanel";
import AdminStatsGrid from "@/components/admin/ui/AdminStatsGrid";

import {
  getAdminAtpRanking,
  getAdminAtpRankingStats,
} from "@/lib/repositories/admin/admin-atp-ranking.repository";

export const dynamic =
  "force-dynamic";

type AtpRankingAdminPageProps = {
  searchParams: Promise<{
    q?: string;
    status?: string;
  }>;
};

function normalize(
  value: string | undefined,
): string {
  return value?.trim() ?? "";
}

function parseStatus(
  value: string | undefined,
): "" | "active" | "inactive" {
  const normalized =
    normalize(value);

  if (
    normalized === "active" ||
    normalized === "inactive"
  ) {
    return normalized;
  }

  return "";
}

function getMovement(
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

function formatPoints(
  points: number | null,
): string {
  if (points === null) {
    return "—";
  }

  return new Intl.NumberFormat(
    "en-US",
  ).format(points);
}

export default async function AtpRankingAdminPage({
  searchParams,
}: AtpRankingAdminPageProps) {
  const params =
    await searchParams;

  const query =
    normalize(params.q);

  const status =
    parseStatus(
      params.status,
    );

  const [
    ranking,
    stats,
  ] = await Promise.all([
    getAdminAtpRanking({
      query,

      active:
        status === "active"
          ? true
          : status ===
              "inactive"
            ? false
            : undefined,
    }),

    getAdminAtpRankingStats(),
  ]);

  const hasActiveFilters =
    Boolean(
      query ||
        status,
    );

  return (
    <AdminShell
      title="ATP Ranking"
      description="Manage the ATP Top 150 used throughout the AGE202 Digital Tennis Museum."
    >
      <div className="space-y-7">
        <AdminPageHeader
          eyebrow="Tour Intelligence"
          title="ATP Ranking"
          description="Review the current ATP Top 150, ranking movement, points and AGE202 Player Studio connections from one central workspace."
          icon={ListOrdered}
        />

        <AdminStatsGrid
          columns={4}
          items={[
            {
              label:
                "Top 150 records",
              value:
                stats.top150,
              icon: Users,
              tone: "neutral",
            },
            {
              label:
                "Active players",
              value:
                stats.active,
              icon: Activity,
              tone: "success",
            },
            {
              label:
                "AGE202 linked",
              value:
                stats.linkedPlayers,
              icon: Link2,
              tone: "museum",
            },
            {
              label:
                "Top 50 linked",
              value:
                stats.top50LinkedPlayers,
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
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/35">
                  Ranking filters
                </p>

                <p className="mt-2 text-sm text-white/45">
                  Search the Top 150 or filter records by publication status.
                </p>
              </div>

              {hasActiveFilters ? (
                <Link
                  href="/admin/atp-ranking"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-white/55 transition hover:text-white"
                >
                  <X className="h-4 w-4" />
                  Clear filters
                </Link>
              ) : null}
            </div>

            <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_200px_auto]">
              <label className="relative">
                <span className="sr-only">
                  Search ATP players
                </span>

                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />

                <input
                  type="search"
                  name="q"
                  defaultValue={
                    query
                  }
                  placeholder="Player, country or slug..."
                  className="h-12 w-full rounded-2xl border border-white/10 bg-[#08111F] pl-11 pr-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-lime-300/35"
                />
              </label>

              <select
                name="status"
                defaultValue={
                  status
                }
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

              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-white px-6 text-sm font-semibold text-[#050B18] transition hover:bg-lime-200"
              >
                <Search className="h-4 w-4" />
                Apply
              </button>
            </div>
          </form>
        </AdminPanel>

        {ranking.length >
        0 ? (
          <AdminPanel className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-[1050px] w-full border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.02]">
                    <th className="w-[90px] px-5 py-4 text-left text-[9px] font-black uppercase tracking-[0.18em] text-white/30">
                      Rank
                    </th>

                    <th className="px-5 py-4 text-left text-[9px] font-black uppercase tracking-[0.18em] text-white/30">
                      Player
                    </th>

                    <th className="w-[170px] px-5 py-4 text-left text-[9px] font-black uppercase tracking-[0.18em] text-white/30">
                      Country
                    </th>

                    <th className="w-[130px] px-5 py-4 text-right text-[9px] font-black uppercase tracking-[0.18em] text-white/30">
                      Points
                    </th>

                    <th className="w-[120px] px-5 py-4 text-center text-[9px] font-black uppercase tracking-[0.18em] text-white/30">
                      Movement
                    </th>

                    <th className="w-[150px] px-5 py-4 text-center text-[9px] font-black uppercase tracking-[0.18em] text-white/30">
                      AGE202
                    </th>

                    <th className="w-[170px] px-5 py-4 text-right text-[9px] font-black uppercase tracking-[0.18em] text-white/30">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {ranking.map(
                    (atpPlayer) => {
                      const movement =
                        getMovement(
                          atpPlayer.rank,
                          atpPlayer.previousRank,
                        );

                      const linkedPlayer =
                        atpPlayer.player;

                      return (
                        <tr
                          key={
                            atpPlayer.id
                          }
                          className="group border-b border-white/[0.07] transition last:border-b-0 hover:bg-white/[0.025]"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <span
                                className={[
                                  "grid h-10 w-10 place-items-center rounded-xl border text-sm font-black",
                                  atpPlayer.rank <=
                                  10
                                    ? "border-lime-300/25 bg-lime-300/10 text-lime-200"
                                    : "border-white/10 bg-white/[0.03] text-white/65",
                                ].join(
                                  " ",
                                )}
                              >
                                {
                                  atpPlayer.rank
                                }
                              </span>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-4">
                              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-[#08111F]">
                                {atpPlayer.imageUrl ? (
                                  <Image
                                    src={
                                      atpPlayer.imageUrl
                                    }
                                    alt={
                                      atpPlayer.name
                                    }
                                    fill
                                    sizes="48px"
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="absolute inset-0 grid place-items-center">
                                    <UserRound className="h-5 w-5 text-white/20" />
                                  </div>
                                )}
                              </div>

                              <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-white">
                                  {
                                    atpPlayer.name
                                  }
                                </p>

                                <div className="mt-1 flex items-center gap-2">
                                  <span
                                    className={[
                                      "h-1.5 w-1.5 rounded-full",
                                      atpPlayer.active
                                        ? "bg-emerald-300"
                                        : "bg-red-300",
                                    ].join(
                                      " ",
                                    )}
                                  />

                                  <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-white/30">
                                    {atpPlayer.active
                                      ? "Active"
                                      : "Inactive"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <p className="text-sm text-white/65">
                              {atpPlayer.country ??
                                "—"}
                            </p>

                            {atpPlayer.countryCode ? (
                              <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.14em] text-white/25">
                                {
                                  atpPlayer.countryCode
                                }
                              </p>
                            ) : null}
                          </td>

                          <td className="px-5 py-4 text-right">
                            <p className="text-sm font-semibold text-white">
                              {formatPoints(
                                atpPlayer.points,
                              )}
                            </p>
                          </td>

                          <td className="px-5 py-4 text-center">
                            <span
                              className={`text-sm font-semibold ${movement.className}`}
                            >
                              {
                                movement.label
                              }
                            </span>
                          </td>

                          <td className="px-5 py-4 text-center">
                            {linkedPlayer ? (
                              <span className="inline-flex items-center gap-2 rounded-full border border-lime-300/20 bg-lime-300/10 px-3 py-1.5 font-mono text-[7px] font-black uppercase tracking-[0.14em] text-lime-200">
                                <Link2 className="h-3 w-3" />
                                Linked
                              </span>
                            ) : (
                              <span className="inline-flex rounded-full border border-white/10 bg-white/[0.025] px-3 py-1.5 font-mono text-[7px] font-black uppercase tracking-[0.14em] text-white/30">
                                ATP only
                              </span>
                            )}
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex justify-end">
                              {linkedPlayer ? (
                                <Link
                                  href={`/admin/players/${linkedPlayer.id}?section=atp`}
                                  className="group/link inline-flex items-center gap-2 rounded-xl border border-lime-300/20 bg-lime-300/[0.05] px-3.5 py-2.5 text-xs font-semibold text-lime-200 transition hover:bg-lime-300/10"
                                >
                                  Edit Player

                                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-0.5" />
                                </Link>
                              ) : (
                                <span className="inline-flex items-center rounded-xl border border-white/10 px-3.5 py-2.5 text-xs font-semibold text-white/25">
                                  Not linked
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    },
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-3 border-t border-white/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-white/35">
                Showing{" "}
                <span className="font-semibold text-white/60">
                  {
                    ranking.length
                  }
                </span>{" "}
                ATP records
              </p>

              <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-white/25">
                AGE202 ATP Top 150
              </p>
            </div>
          </AdminPanel>
        ) : (
          <AdminPanel>
            <AdminEmptyState
  title="No ATP players found"
  description={
    hasActiveFilters
      ? "Adjust or clear the current filters to see the ATP ranking."
      : "No ATP ranking records are currently available."
  }
  actionLabel="Clear filters"
  actionHref="/admin/atp-ranking"
  icon={ListOrdered}
/>
          </AdminPanel>
        )}
      </div>
    </AdminShell>
  );
}