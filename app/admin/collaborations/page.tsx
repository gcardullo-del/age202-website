import Link from "next/link";

import {
  Building2,
  ChevronRight,
  CircleCheck,
  Eye,
  ImageIcon,
  Layers3,
  Palette,
  Plus,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";

import {
  CollaborationPartnerType,
  MuseumPageStatus,
} from "@/generated/prisma/client";

import AdminShell from "@/components/admin/AdminShell";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import AdminPanel from "@/components/admin/ui/AdminPanel";
import AdminStatsGrid from "@/components/admin/ui/AdminStatsGrid";

import {
  getCollaborationStats,
  listCollaborations,
} from "@/lib/services/collaboration.service";


export const dynamic =
  "force-dynamic";


function formatEnum(
  value: string,
): string {
  return value
    .replaceAll(
      "_",
      " ",
    )
    .toLowerCase()
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase(),
    );
}


function getPartnerIcon(
  type:
    CollaborationPartnerType,
) {
  switch (type) {
    case CollaborationPartnerType.TENNIS_BRAND:
      return Trophy;

    case CollaborationPartnerType.CLUB_EVENT:
      return Building2;

    case CollaborationPartnerType.CREATIVE_STUDIO:
      return Palette;

    case CollaborationPartnerType.COLLECTOR:
      return Users;

    case CollaborationPartnerType.OTHER:
    default:
      return Sparkles;
  }
}


function getPartnerTone(
  type:
    CollaborationPartnerType,
): string {
  switch (type) {
    case CollaborationPartnerType.TENNIS_BRAND:
      return "border-lime-300/20 bg-lime-300/10 text-lime-200";

    case CollaborationPartnerType.CLUB_EVENT:
      return "border-sky-300/20 bg-sky-300/10 text-sky-200";

    case CollaborationPartnerType.CREATIVE_STUDIO:
      return "border-violet-300/20 bg-violet-300/10 text-violet-200";

    case CollaborationPartnerType.COLLECTOR:
      return "border-orange-300/20 bg-orange-300/10 text-orange-200";

    case CollaborationPartnerType.OTHER:
    default:
      return "border-white/10 bg-white/[0.04] text-white/45";
  }
}


function getStatusTone(
  status:
    MuseumPageStatus,
): string {
  switch (status) {
    case MuseumPageStatus.PUBLISHED:
      return "border-emerald-400/20 bg-emerald-400/10 text-emerald-200";

    case MuseumPageStatus.ARCHIVED:
      return "border-white/10 bg-white/[0.04] text-white/35";

    case MuseumPageStatus.DRAFT:
    default:
      return "border-amber-300/20 bg-amber-300/10 text-amber-100";
  }
}


export default async function CollaborationsAdminPage() {
  const [
    collaborations,
    stats,
  ] =
    await Promise.all([
      listCollaborations(),
      getCollaborationStats(),
    ]);


  return (
    <AdminShell
      title="Collaborations"
      description="Manage AGE202 partnerships, cultural projects and selected collaboration stories."
    >
      <div className="space-y-7">
        <AdminPageHeader
          eyebrow="Partnership CMS"
          title="Collaborations"
          description="Manage selected AGE202 partnerships across tennis brands, clubs and events, creative studios and collectors. Editorial content and museum imagery can be published without changing the public page code."
          icon={Sparkles}
        />


        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-[9px] font-black uppercase tracking-[0.16em] text-emerald-200">
            <CircleCheck className="h-3.5 w-3.5" />

            Collaboration database online
          </div>


          <Link
            href="/admin/collaborations/new"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-lime-300 px-5 text-sm font-black text-[#050B18] transition hover:bg-lime-200"
          >
            <Plus className="h-4 w-4" />

            Add Collaboration
          </Link>
        </div>


        <AdminStatsGrid
          columns={4}
          items={[
            {
              label:
                "Tennis Brands",
              value:
                stats.tennisBrands,
              icon:
                Trophy,
              tone:
                "museum",
            },
            {
              label:
                "Clubs & Events",
              value:
                stats.clubsEvents,
              icon:
                Building2,
              tone:
                "neutral",
            },
            {
              label:
                "Creative Studios",
              value:
                stats.creativeStudios,
              icon:
                Palette,
              tone:
                "museum",
            },
            {
              label:
                "Collectors",
              value:
                stats.collectors,
              icon:
                Users,
              tone:
                "neutral",
            },
          ]}
        />


        <AdminPanel className="overflow-hidden">
          <div className="grid gap-px bg-white/10 sm:grid-cols-2 xl:grid-cols-4">
            <ArchiveFact
              label="Total projects"
              value={stats.total}
              icon={Layers3}
            />

            <ArchiveFact
              label="Published"
              value={stats.published}
              icon={Eye}
            />

            <ArchiveFact
              label="Featured"
              value={stats.featured}
              icon={Sparkles}
            />

            <ArchiveFact
              label="With media"
              value={stats.withMedia}
              icon={ImageIcon}
            />
          </div>
        </AdminPanel>


        <AdminPanel className="overflow-hidden">
          <div className="flex flex-col gap-3 border-b border-white/10 px-5 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-6">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-lime-300/70">
                Partnership Archive
              </p>

              <h2 className="mt-2 text-xl font-semibold tracking-tight text-white">
                Selected collaborations
              </h2>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-white/40">
                Projects are ordered by sort order and year, matching the archive used by the public Collaborations experience.
              </p>
            </div>

            <span className="text-xs font-semibold text-white/35">
              {collaborations.length} collaborations
            </span>
          </div>


          {collaborations.length > 0 ? (
            <div className="divide-y divide-white/10">
              {collaborations.map(
                (
                  collaboration,
                ) => {
                  const Icon =
                    getPartnerIcon(
                      collaboration.partnerType,
                    );

                  const mediaUrl =
                    collaboration.media?.url ??
                    collaboration.imageUrl ??
                    null;

                  return (
                    <div
                      key={collaboration.id}
                      className="group grid gap-5 px-5 py-5 transition hover:bg-white/[0.02] sm:px-6 lg:grid-cols-[100px_minmax(0,1fr)_auto] lg:items-center"
                    >
                      <div className="flex items-center gap-3 lg:block">
                        <div className="grid h-14 w-14 place-items-center rounded-2xl border border-lime-300/20 bg-lime-300/[0.06] text-sm font-black text-lime-200">
                          {collaboration.year ?? "—"}
                        </div>

                        <p className="text-[8px] font-black uppercase tracking-[0.16em] text-white/25 lg:mt-2">
                          Order {collaboration.sortOrder}
                        </p>
                      </div>


                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={[
                              "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.15em]",
                              getPartnerTone(
                                collaboration.partnerType,
                              ),
                            ].join(
                              " ",
                            )}
                          >
                            <Icon className="h-3.5 w-3.5" />

                            {formatEnum(
                              collaboration.partnerType,
                            )}
                          </span>

                          <span
                            className={[
                              "rounded-full border px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.15em]",
                              getStatusTone(
                                collaboration.status,
                              ),
                            ].join(
                              " ",
                            )}
                          >
                            {formatEnum(
                              collaboration.status,
                            )}
                          </span>

                          {collaboration.featured ? (
                            <span className="rounded-full border border-lime-300/20 bg-lime-300/10 px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.15em] text-lime-200">
                              Featured
                            </span>
                          ) : null}

                          {mediaUrl ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.15em] text-white/40">
                              <ImageIcon className="h-3 w-3" />
                              Media
                            </span>
                          ) : null}
                        </div>


                        <h3 className="mt-3 truncate text-lg font-semibold tracking-tight text-white sm:text-xl">
                          {collaboration.title}
                        </h3>

                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/30">
                          <span>
                            {collaboration.partnerName}
                          </span>

                          {collaboration.projectType ? (
                            <span>
                              {formatEnum(
                                collaboration.projectType,
                              )}
                            </span>
                          ) : null}

                          {collaboration.location ? (
                            <span>
                              {collaboration.location}
                            </span>
                          ) : null}

                          {collaboration.period ? (
                            <span>
                              {collaboration.period}
                            </span>
                          ) : null}

                          <span className="font-mono text-[10px] text-white/20">
                            {collaboration.slug}
                          </span>
                        </div>
                      </div>


                      <Link
                        href={`/admin/collaborations/${collaboration.id}`}
                        className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm font-semibold text-white/60 transition hover:border-lime-300/30 hover:bg-lime-300/10 hover:text-lime-200"
                      >
                        Manage

                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </div>
                  );
                },
              )}
            </div>
          ) : (
            <div className="px-6 py-16 text-center">
              <Sparkles className="mx-auto h-8 w-8 text-lime-300/50" />

              <h3 className="mt-5 text-lg font-semibold text-white">
                Collaboration database is ready
              </h3>

              <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-white/35">
                No collaborations have been created yet. Add the first partnership project and connect its imagery through the AGE202 Media Library.
              </p>

              <Link
                href="/admin/collaborations/new"
                className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-lime-300 px-5 text-sm font-black text-[#050B18] transition hover:bg-lime-200"
              >
                <Plus className="h-4 w-4" />

                Add First Collaboration
              </Link>
            </div>
          )}
        </AdminPanel>
      </div>
    </AdminShell>
  );
}


function ArchiveFact({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: typeof Layers3;
}) {
  return (
    <div className="bg-[#07101D] p-5 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <p className="text-[8px] font-black uppercase tracking-[0.18em] text-white/30">
          {label}
        </p>

        <Icon className="h-4 w-4 text-lime-300/50" />
      </div>

      <p className="mt-4 text-3xl font-black tracking-[-0.05em] text-white">
        {value}
      </p>
    </div>
  );
}