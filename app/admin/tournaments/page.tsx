import Link from "next/link";

import {
  Activity,
  CalendarDays,
  ChevronRight,
  CircleCheck,
  Crown,
  Eye,
  Flag,
  Layers3,
  MapPin,
  Plus,
  Sparkles,
  Trophy,
} from "lucide-react";

import type {
  TournamentCategory,
} from "@/generated/prisma/client";

import AdminShell from "@/components/admin/AdminShell";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import AdminPanel from "@/components/admin/ui/AdminPanel";
import AdminStatsGrid from "@/components/admin/ui/AdminStatsGrid";

import { prisma } from "@/lib/prisma";

export const dynamic =
  "force-dynamic";

type TournamentGroupConfig = {
  category: TournamentCategory;
  eyebrow: string;
  title: string;
  description: string;
  level: string;
  tone: string;
};

const tournamentGroups:
  TournamentGroupConfig[] = [
    {
      category: "GRAND_SLAM",
      eyebrow: "Level 01 · Signature",
      title: "Grand Slams",
      description:
        "The four flagship tournament experiences. Maximum editorial depth, visual storytelling and historical archive.",
      level: "WOW / MAX",
      tone:
        "border-fuchsia-400/20 bg-fuchsia-400/[0.06]",
    },
    {
      category: "MASTERS_1000",
      eyebrow: "Level 02 · Premium",
      title: "Masters 1000",
      description:
        "Nine premium tournament dossiers using Indian Wells as the shared structural template, with individual identity, colour and content.",
      level: "PREMIUM",
      tone:
        "border-violet-400/20 bg-violet-400/[0.06]",
    },
    {
      category: "ATP_500",
      eyebrow: "Level 03 · Editorial",
      title: "ATP 500",
      description:
        "Rich but more compact tournament pages focused on identity, venue, history, champions and results.",
      level: "EDITORIAL",
      tone:
        "border-sky-400/20 bg-sky-400/[0.06]",
    },
    {
      category: "ATP_250",
      eyebrow: "Level 04 · Archive",
      title: "ATP 250",
      description:
        "Fast archive pages centred on editions, winners, finalists, scores and connected AGE202 player records.",
      level: "ARCHIVE",
      tone:
        "border-emerald-400/20 bg-emerald-400/[0.06]",
    },
  ];

function formatSurface(
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


function getTournamentPublicHref(
  category: TournamentCategory,
  slug: string,
): string {
  switch (category) {
    case "MASTERS_1000":
      return `/results/masters-1000/${slug}`;
    case "ATP_500":
      return `/results/atp-500/${slug}`;
    case "ATP_250":
      return `/results/atp-250/${slug}`;
    case "GRAND_SLAM":
      return `/results/grand-slams/${slug}`;
    default:
      return `/tournaments/${slug}`;
  }
}

export default async function TournamentsPage() {
  const [
    tournaments,
    totalCount,
    grandSlamCount,
    mastersCount,
    atp500Count,
    atp250Count,
  ] = await Promise.all([
    prisma.tournament.findMany({
      where: {
        category: {
          in: [
            "GRAND_SLAM",
            "MASTERS_1000",
            "ATP_500",
            "ATP_250",
          ],
        },
      },

      include: {
        _count: {
          select: {
            editions: true,
            champions: true,
          },
        },
      },

      orderBy: [
        {
          category: "asc",
        },
        {
          displayOrder: "asc",
        },
        {
          name: "asc",
        },
      ],
    }),

    prisma.tournament.count({
      where: {
        category: {
          in: [
            "GRAND_SLAM",
            "MASTERS_1000",
            "ATP_500",
            "ATP_250",
          ],
        },
      },
    }),

    prisma.tournament.count({
      where: {
        category: "GRAND_SLAM",
      },
    }),

    prisma.tournament.count({
      where: {
        category: "MASTERS_1000",
      },
    }),

    prisma.tournament.count({
      where: {
        category: "ATP_500",
      },
    }),

    prisma.tournament.count({
      where: {
        category: "ATP_250",
      },
    }),
  ]);

  return (
    <AdminShell
      title="Tournament Studio"
      description="Manage Grand Slams, Masters 1000, ATP 500 and ATP 250 from one AGE202 workspace."
    >
      <div className="space-y-7">
        <AdminPageHeader
          eyebrow="Tournament CMS"
          title="Tournament Studio"
          description="One tournament engine, four editorial levels. Indian Wells remains the Masters 1000 reference template while each category unlocks the appropriate depth of content."
          icon={Trophy}
        />


        <div className="flex justify-end">
          <Link
            href="/admin/tournaments/new"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-lime-300 px-5 text-sm font-black text-[#050B18] transition hover:bg-lime-200"
          >
            <Plus className="h-4 w-4" />
            New Tournament
          </Link>
        </div>

        <AdminStatsGrid
          columns={4}
          items={[
            {
              label:
                "Grand Slams",
              value:
                grandSlamCount,
              icon: Crown,
              tone: "museum",
            },
            {
              label:
                "Masters 1000",
              value:
                mastersCount,
              icon: Trophy,
              tone: "museum",
            },
            {
              label: "ATP 500",
              value:
                atp500Count,
              icon: Layers3,
              tone: "neutral",
            },
            {
              label: "ATP 250",
              value:
                atp250Count,
              icon: CalendarDays,
              tone: "neutral",
            },
          ]}
        />

        <AdminPanel className="overflow-hidden">
          <div className="flex flex-col gap-4 border-b border-white/10 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-lime-300/70">
                Tournament Engine
              </p>

              <h2 className="mt-2 text-xl font-semibold tracking-tight text-white">
                Editorial architecture
              </h2>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-white/40">
                The public page depth is controlled by tournament category. This keeps the CMS consistent without forcing ATP 250 events to carry Grand Slam-level content.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-[9px] font-black uppercase tracking-[0.16em] text-emerald-200">
              <CircleCheck className="h-3.5 w-3.5" />
              Engine online
            </div>
          </div>

          <div className="grid gap-px bg-white/10 lg:grid-cols-4">
            {tournamentGroups.map(
              (group) => (
                <div
                  key={
                    group.category
                  }
                  className={`bg-[#07101D] p-5 ${group.tone}`}
                >
                  <p className="text-[8px] font-black uppercase tracking-[0.18em] text-white/30">
                    {group.eyebrow}
                  </p>

                  <h3 className="mt-3 text-lg font-semibold text-white">
                    {group.title}
                  </h3>

                  <p className="mt-2 min-h-20 text-sm leading-5 text-white/40">
                    {
                      group.description
                    }
                  </p>

                  <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                    <span className="text-[8px] font-black uppercase tracking-[0.18em] text-white/25">
                      Page depth
                    </span>

                    <span className="text-[9px] font-black uppercase tracking-[0.14em] text-lime-300">
                      {group.level}
                    </span>
                  </div>
                </div>
              ),
            )}
          </div>
        </AdminPanel>

        <div className="space-y-7">
          {tournamentGroups.map(
            (group) => {
              const groupTournaments =
                tournaments.filter(
                  (tournament) =>
                    tournament.category ===
                    group.category,
                );

              return (
                <section
                  key={
                    group.category
                  }
                  className="space-y-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-lime-300/65">
                        {group.eyebrow}
                      </p>

                      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                        {group.title}
                      </h2>

                      <p className="mt-2 max-w-3xl text-sm leading-6 text-white/40">
                        {
                          group.description
                        }
                      </p>
                    </div>

                    <span className="text-xs font-semibold text-white/35">
                      {
                        groupTournaments.length
                      }{" "}
                      tournaments
                    </span>
                  </div>

                  {groupTournaments.length >
                  0 ? (
                    <div className="grid gap-4 xl:grid-cols-2">
                      {groupTournaments.map(
                        (
                          tournament,
                        ) => (
                          <AdminPanel
                            key={
                              tournament.id
                            }
                            className="group overflow-hidden"
                          >
                            <div className="p-5 sm:p-6">
                              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                                <div className="min-w-0">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.15em] text-white/45">
                                      {formatSurface(
                                        tournament.surface,
                                      )}
                                    </span>

                                    {tournament.featured ? (
                                      <span className="rounded-full border border-lime-300/20 bg-lime-300/10 px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.15em] text-lime-200">
                                        Featured
                                      </span>
                                    ) : null}

                                    <span
                                      className={[
                                        "rounded-full border px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.15em]",
                                        tournament.active
                                          ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
                                          : "border-white/10 bg-white/[0.04] text-white/35",
                                      ].join(
                                        " ",
                                      )}
                                    >
                                      {tournament.active
                                        ? "Active"
                                        : "Inactive"}
                                    </span>
                                  </div>

                                  <h3 className="mt-4 truncate text-xl font-semibold tracking-tight text-white sm:text-2xl">
                                    {
                                      tournament.shortName ??
                                      tournament.name
                                    }
                                  </h3>

                                  <p className="mt-1 text-sm text-white/35">
                                    {
                                      tournament.name
                                    }
                                  </p>
                                </div>

                                <Link
                                  href={`/admin/tournaments/${tournament.slug}`}
                                  className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm font-semibold text-white/60 transition hover:border-lime-300/30 hover:bg-lime-300/10 hover:text-lime-200"
                                >
                                  Manage
                                  <ChevronRight className="h-4 w-4" />
                                </Link>
                              </div>

                              <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-4">
                                <TournamentFact
                                  icon={
                                    MapPin
                                  }
                                  label="Location"
                                  value={[
                                    tournament.city,
                                    tournament.country,
                                  ]
                                    .filter(
                                      Boolean,
                                    )
                                    .join(
                                      ", ",
                                    )}
                                />

                                <TournamentFact
                                  icon={
                                    CalendarDays
                                  }
                                  label="Founded"
                                  value={
                                    tournament.foundedYear
                                      ? String(
                                          tournament.foundedYear,
                                        )
                                      : "—"
                                  }
                                />

                                <TournamentFact
                                  icon={
                                    Trophy
                                  }
                                  label="Editions"
                                  value={String(
                                    tournament
                                      ._count
                                      .editions,
                                  )}
                                />

                                <TournamentFact
                                  icon={
                                    Flag
                                  }
                                  label="Champions"
                                  value={String(
                                    tournament
                                      ._count
                                      .champions,
                                  )}
                                />
                              </div>

                              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
                                <div className="flex items-center gap-2 text-xs text-white/30">
                                  <Activity className="h-4 w-4 text-lime-300/55" />

                                  <span>
                                    {
                                      tournament.slug
                                    }
                                  </span>
                                </div>

                                <div className="flex items-center gap-2">
                                  <Link
                                    href={getTournamentPublicHref(
                                      tournament.category,
                                      tournament.slug,
                                    )}
                                    target="_blank"
                                    className="inline-flex items-center gap-2 text-xs font-semibold text-white/45 transition hover:text-white"
                                  >
                                    <Eye className="h-4 w-4" />
                                    Public page
                                  </Link>

                                  <span className="h-4 w-px bg-white/10" />

                                  <span className="inline-flex items-center gap-2 text-xs font-semibold text-lime-300/60">
                                    <Sparkles className="h-4 w-4" />
                                    {group.level}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </AdminPanel>
                        ),
                      )}
                    </div>
                  ) : (
                    <AdminPanel className="border-dashed p-6 sm:p-8">
                      <p className="text-sm font-semibold text-white/55">
                        No{" "}
                        {group.title}{" "}
                        tournaments have
                        been added yet.
                      </p>

                      <p className="mt-2 text-sm leading-6 text-white/30">
                        This category is
                        ready in the CMS
                        and will appear
                        here as soon as
                        tournament records
                        are created.
                      </p>
                    </AdminPanel>
                  )}
                </section>
              );
            },
          )}
        </div>

        <AdminPanel className="p-5 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-lime-300/70">
                CMS roadmap
              </p>

              <h2 className="mt-2 text-xl font-semibold tracking-tight text-white">
                Next: Tournament editor
              </h2>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-white/40">
                The next screen will manage identity, media, editions, champions and category-specific modules. Indian Wells remains visually untouched and becomes the reference content structure for every Masters 1000.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.025] px-4 py-3">
              <p className="text-[8px] font-black uppercase tracking-[0.16em] text-white/25">
                Managed tournaments
              </p>

              <p className="mt-1 text-2xl font-semibold text-white">
                {totalCount}
              </p>
            </div>
          </div>
        </AdminPanel>
      </div>
    </AdminShell>
  );
}

type TournamentFactProps = {
  icon: React.ComponentType<{
    className?: string;
  }>;
  label: string;
  value: string;
};

function TournamentFact({
  icon: Icon,
  label,
  value,
}: TournamentFactProps) {
  return (
    <div className="bg-[#07101D] px-4 py-4">
      <div className="flex items-center gap-2 text-white/25">
        <Icon className="h-3.5 w-3.5" />

        <span className="text-[7px] font-black uppercase tracking-[0.16em]">
          {label}
        </span>
      </div>

      <p className="mt-2 truncate text-sm font-semibold text-white/70">
        {value || "—"}
      </p>
    </div>
  );
}