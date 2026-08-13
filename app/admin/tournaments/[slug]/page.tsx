import Link from "next/link";
import { notFound } from "next/navigation";

import {
  ArrowLeft,
  CalendarDays,
  Crown,
  Eye,
  Flag,
  ImageIcon,
  ImagePlus,
  Landmark,
  Layers3,
  LibraryBig,
  Link2,
  MapPin,
  Medal,
  Save,
  Sparkles,
  Star,
  Trash2,
  Trophy,
} from "lucide-react";

import {
  updateTournamentIdentity,
} from "./actions/updateTournamentIdentity";

import {
  updateTournamentMedia,
} from "./actions/updateTournamentMedia";

import {
  updateTournamentStorySeo,
} from "./actions/updateTournamentStorySeo";

import {
  createTournamentGalleryItem,
  deleteTournamentGalleryItem,
  updateTournamentGalleryItem,
} from "./actions/tournamentGallery";

import {
  createTournamentMilestone,
  deleteTournamentMilestone,
  updateTournamentMilestone,
} from "./actions/tournamentMilestones";

import {
  createTournamentChapter,
  deleteTournamentChapter,
  updateTournamentChapter,
} from "./actions/tournamentChapters";

import {
  createTournamentIconicMoment,
  deleteTournamentIconicMoment,
  updateTournamentIconicMoment,
} from "./actions/tournamentIconicMoments";

import {
  createTournamentChampion,
  createTournamentEdition,
  deleteTournamentChampion,
  deleteTournamentEdition,
  updateTournamentChampion,
  updateTournamentEdition,
} from "./actions/tournamentChampionship";

import AdminShell from "@/components/admin/AdminShell";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import AdminPanel from "@/components/admin/ui/AdminPanel";
import AdminStatsGrid from "@/components/admin/ui/AdminStatsGrid";

import { prisma } from "@/lib/prisma";

export const dynamic =
  "force-dynamic";

type TournamentEditorPageProps = {
  params: Promise<{
    slug: string;
  }>;

  searchParams: Promise<{
    saved?: string;
  }>;
};

const tournamentCategories = [
  "GRAND_SLAM",
  "ATP_FINALS",
  "MASTERS_1000",
  "ATP_500",
  "ATP_250",
  "OLYMPICS",
  "DAVIS_CUP",
  "OTHER",
] as const;

const courtSurfaces = [
  "HARD",
  "CLAY",
  "GRASS",
  "CARPET",
  "INDOOR_HARD",
  "OTHER",
] as const;

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

function getEditorialLevel(
  category: string,
): {
  label: string;
  description: string;
} {
  switch (category) {
    case "GRAND_SLAM":
      return {
        label: "WOW / MAX",
        description:
          "Signature Grand Slam experience with maximum editorial and visual depth.",
      };

    case "MASTERS_1000":
      return {
        label: "PREMIUM",
        description:
          "Premium Masters 1000 structure using Indian Wells as the reference template.",
      };

    case "ATP_500":
      return {
        label: "EDITORIAL",
        description:
          "Rich but more compact editorial tournament experience.",
      };

    case "ATP_250":
      return {
        label: "ARCHIVE",
        description:
          "Fast archive experience focused on editions, winners and results.",
      };

    default:
      return {
        label: "STANDARD",
        description:
          "Standard AGE202 tournament archive.",
      };
  }
}

function getPublicTournamentHref(
  category: string,
  slug: string,
): string | null {
  if (
    category ===
    "MASTERS_1000"
  ) {
    return `/results/masters-1000/${slug}`;
  }

  if (
    category ===
    "ATP_250"
  ) {
    return "/results/atp-250";
  }

  return null;
}

export default async function TournamentEditorPage({
  params,
  searchParams,
}: TournamentEditorPageProps) {
  const [
    resolvedParams,
    resolvedSearchParams,
  ] = await Promise.all([
    params,
    searchParams,
  ]);

  const tournament =
    await prisma.tournament.findUnique({
      where: {
        slug:
          resolvedParams.slug,
      },

      include: {
        editions: {
          include: {
            championPlayer: true,
            runnerUpPlayer: true,
          },

          orderBy: {
            year: "desc",
          },
        },

        champions: {
          include: {
            player: true,
          },

          orderBy: [
            {
              titles: "desc",
            },
            {
              lastTitleYear: "desc",
            },
          ],
        },

        galleryItems: {
          orderBy: [
            {
              featured: "desc",
            },
            {
              sortOrder: "asc",
            },
            {
              createdAt: "asc",
            },
          ],
        },

        milestones: {
          orderBy: [
            {
              featured: "desc",
            },
            {
              sortOrder: "asc",
            },
            {
              year: "asc",
            },
            {
              createdAt: "asc",
            },
          ],
        },

        chapters: {
          orderBy: [
            {
              featured: "desc",
            },
            {
              sortOrder: "asc",
            },
            {
              createdAt: "asc",
            },
          ],
        },

        iconicMoments: {
          orderBy: [
            {
              featured: "desc",
            },
            {
              sortOrder: "asc",
            },
            {
              year: "asc",
            },
            {
              createdAt: "asc",
            },
          ],
        },

        _count: {
          select: {
            editions: true,
            champions: true,
            galleryItems: true,
            milestones: true,
            chapters: true,
            iconicMoments: true,
          },
        },
      },
    });

  if (!tournament) {
    notFound();
  }

  const players =
    await prisma.player.findMany({
      where: {
        active: true,
      },

      select: {
        id: true,
        name: true,
        country: true,
      },

      orderBy: {
        name: "asc",
      },
    });

  const editorialLevel =
    getEditorialLevel(
      tournament.category,
    );

  const publicPageHref =
    getPublicTournamentHref(
      tournament.category,
      tournament.slug,
    );

  const locationLabel = [
    tournament.city,
    tournament.country,
  ]
    .filter(Boolean)
    .join(", ");

  const latestEdition =
    tournament.editions[0] ??
    null;

  const identitySaved =
    resolvedSearchParams.saved ===
    "identity";

  const mediaSaved =
    resolvedSearchParams.saved ===
    "media";

  const storySeoSaved =
    resolvedSearchParams.saved ===
    "story-seo";

  const gallerySaved =
    resolvedSearchParams.saved ===
    "gallery";

  const milestoneSaved =
    resolvedSearchParams.saved ===
    "milestone";

  const chapterSaved =
    resolvedSearchParams.saved ===
    "chapter";

  const iconicMomentSaved =
    resolvedSearchParams.saved ===
    "iconic-moment";

  const editionSaved =
    resolvedSearchParams.saved ===
    "edition";

  const championSaved =
    resolvedSearchParams.saved ===
    "champion";

  const updateIdentity =
    updateTournamentIdentity.bind(
      null,
      tournament.id,
    );

  const updateMedia =
    updateTournamentMedia.bind(
      null,
      tournament.id,
    );

  const updateStorySeo =
    updateTournamentStorySeo.bind(
      null,
      tournament.id,
    );

  const createGalleryItem =
    createTournamentGalleryItem.bind(
      null,
      tournament.id,
    );

  const createMilestone =
    createTournamentMilestone.bind(
      null,
      tournament.id,
    );

  const createChapter =
    createTournamentChapter.bind(
      null,
      tournament.id,
    );

  const createIconicMoment =
    createTournamentIconicMoment.bind(
      null,
      tournament.id,
    );

  const createEdition =
    createTournamentEdition.bind(
      null,
      tournament.id,
    );

  const createChampion =
    createTournamentChampion.bind(
      null,
      tournament.id,
    );

  const isATP250 =
    tournament.category ===
    "ATP_250";

  const leader =
    tournament.champions[0] ??
    null;

  if (isATP250) {
    const saveLatestWinner =
      latestEdition
        ? updateTournamentEdition.bind(
            null,
            tournament.id,
            latestEdition.id,
          )
        : createEdition;

    const saveLeader =
      leader
        ? updateTournamentChampion.bind(
            null,
            tournament.id,
            leader.id,
          )
        : createChampion;

    return (
      <AdminShell
        title={
          tournament.shortName ??
          tournament.name
        }
        description="ATP 250 · Tournament Studio Lite"
      >
        <div className="space-y-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/admin/tournaments"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white/45 transition hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Tournament Studio
            </Link>

            {publicPageHref ? (
              <Link
                href={publicPageHref}
                target="_blank"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm font-semibold text-white/60 transition hover:border-lime-300/30 hover:bg-lime-300/10 hover:text-lime-200"
              >
                <Eye className="h-4 w-4" />
                View ATP 250 table
              </Link>
            ) : null}
          </div>

          <AdminPageHeader
            eyebrow="ATP 250 · Tournament Studio Lite"
            title={
              tournament.shortName ??
              tournament.name
            }
            description="Only the two values used by the ATP 250 public table are managed here: Latest Winner and Leader."
            icon={Trophy}
          />

          {editionSaved ? (
            <div
              role="status"
              className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-4 text-sm font-semibold text-emerald-100"
            >
              Latest winner saved successfully.
            </div>
          ) : null}

          {championSaved ? (
            <div
              role="status"
              className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-4 text-sm font-semibold text-emerald-100"
            >
              Tournament leader saved successfully.
            </div>
          ) : null}

          <div className="grid gap-5 xl:grid-cols-2">
            <AdminPanel className="overflow-hidden">
              <div className="border-b border-white/10 px-5 py-5 sm:px-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-lime-300/70">
                      ATP 250 · Result
                    </p>

                    <h2 className="mt-2 text-xl font-semibold tracking-tight text-white">
                      Latest Winner
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-white/40">
                      Update only the latest completed final shown in the ATP 250 table.
                    </p>
                  </div>

                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-lime-300/20 bg-lime-300/10 text-lime-300">
                    <Trophy className="h-5 w-5" />
                  </span>
                </div>
              </div>

              <form
                action={saveLatestWinner}
                className="space-y-5 p-5 sm:p-6"
              >
                {latestEdition ? (
                  <>
                    <input
                      type="hidden"
                      name="editionKey"
                      value={
                        latestEdition.editionKey
                      }
                    />
                    <input
                      type="hidden"
                      name="editionLabel"
                      value={
                        latestEdition.editionLabel ??
                        ""
                      }
                    />
                    <input
                      type="hidden"
                      name="drawSize"
                      value={
                        latestEdition.drawSize ??
                        ""
                      }
                    />
                    <input
                      type="hidden"
                      name="startDate"
                      value={
                        latestEdition.startDate
                          ? latestEdition.startDate
                              .toISOString()
                              .slice(0, 10)
                          : ""
                      }
                    />
                    <input
                      type="hidden"
                      name="endDate"
                      value={
                        latestEdition.endDate
                          ? latestEdition.endDate
                              .toISOString()
                              .slice(0, 10)
                          : ""
                      }
                    />
                    <input
                      type="hidden"
                      name="championPlayerId"
                      value={
                        latestEdition.championPlayerId ??
                        ""
                      }
                    />
                    <input
                      type="hidden"
                      name="championCountryCode"
                      value={
                        latestEdition.championCountryCode ??
                        ""
                      }
                    />
                    <input
                      type="hidden"
                      name="runnerUpPlayerId"
                      value={
                        latestEdition.runnerUpPlayerId ??
                        ""
                      }
                    />
                    <input
                      type="hidden"
                      name="runnerUpCountryCode"
                      value={
                        latestEdition.runnerUpCountryCode ??
                        ""
                      }
                    />
                    {latestEdition.cancelled ? (
                      <input
                        type="hidden"
                        name="cancelled"
                        value="on"
                      />
                    ) : null}
                  </>
                ) : null}

                <Field
                  label="Year"
                  name="year"
                  type="number"
                  defaultValue={
                    latestEdition?.year ??
                    new Date().getFullYear()
                  }
                  min="1800"
                  max="2200"
                  required
                />

                <Field
                  label="Winner"
                  name="championName"
                  defaultValue={
                    latestEdition?.championName ??
                    latestEdition?.championPlayer?.name ??
                    ""
                  }
                  required
                />

                <Field
                  label="Runner-up"
                  name="runnerUpName"
                  defaultValue={
                    latestEdition?.runnerUpName ??
                    latestEdition?.runnerUpPlayer?.name ??
                    ""
                  }
                  required
                />

                <Field
                  label="Final score"
                  name="score"
                  defaultValue={
                    latestEdition?.score ??
                    ""
                  }
                  hint="Example: 7-6(4), 6-4"
                  required
                />

                <button
                  type="submit"
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-lime-300 px-5 text-sm font-black text-[#050B18] transition hover:bg-lime-200"
                >
                  <Save className="h-4 w-4" />
                  Save latest winner
                </button>
              </form>
            </AdminPanel>

            <AdminPanel className="overflow-hidden">
              <div className="border-b border-white/10 px-5 py-5 sm:px-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-300/70">
                      ATP 250 · Record
                    </p>

                    <h2 className="mt-2 text-xl font-semibold tracking-tight text-white">
                      Leader
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-white/40">
                      Player with the most tournament titles. The public table renders the total with the trophy symbol.
                    </p>
                  </div>

                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-amber-300/20 bg-amber-300/10 text-amber-300">
                    <Crown className="h-5 w-5" />
                  </span>
                </div>
              </div>

              <form
                action={saveLeader}
                className="space-y-5 p-5 sm:p-6"
              >
                {leader ? (
                  <>
                    <input
                      type="hidden"
                      name="playerId"
                      value={
                        leader.playerId ??
                        ""
                      }
                    />
                    <input
                      type="hidden"
                      name="country"
                      value={
                        leader.country ??
                        ""
                      }
                    />
                    <input
                      type="hidden"
                      name="countryCode"
                      value={
                        leader.countryCode ??
                        ""
                      }
                    />
                    <input
                      type="hidden"
                      name="firstTitleYear"
                      value={
                        leader.firstTitleYear ??
                        ""
                      }
                    />
                    <input
                      type="hidden"
                      name="lastTitleYear"
                      value={
                        leader.lastTitleYear ??
                        ""
                      }
                    />
                   <input
  type="hidden"
  name="titleYears"
  value={
    leader.titleYears.join(", ")
  }
/>

<input
  type="hidden"
  name="finals"
  value={
    leader.finals?.toString() ??
    ""
  }
/>

<input
  type="hidden"
  name="wins"
  value={
    leader.wins?.toString() ??
    ""
  }
/>

<input
  type="hidden"
  name="sortOrder"
  value={
    leader.sortOrder.toString()
  }
/>

<input
  type="hidden"
  name="recordLabel"
  value={
    leader.recordLabel ??
    ""
  }
/>

<input
  type="hidden"
  name="quote"
  value={
    leader.quote ??
    ""
  }
/>

<input
  type="hidden"
  name="imageUrl"
  value={
    leader.imageUrl ??
    ""
  }
/>

{leader.legend ? (
  <input
    type="hidden"
    name="legend"
    value="on"
  />
) : null}

{leader.featured ? (
  <input
    type="hidden"
    name="featured"
    value="on"
  />
) : null}
                  </>
                ) : null}

                <Field
                  label="Player"
                  name="name"
                  defaultValue={
                    leader?.name ??
                    leader?.player?.name ??
                    ""
                  }
                  hint="Example: Roger Federer"
                  required
                />

                <Field
                  label="Titles"
                  name="titles"
                  type="number"
                  defaultValue={
                    leader?.titles ??
                    1
                  }
                  min="1"
                  required
                  hint="The public table will display this value as trophies."
                />

                <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                  <p className="text-[8px] font-black uppercase tracking-[0.16em] text-white/25">
                    Public preview
                  </p>

                  <div className="mt-3 flex items-center justify-between gap-4">
                    <span className="text-base font-black uppercase text-white/75">
                      {leader?.name ??
                        leader?.player?.name ??
                        "Leader"}
                    </span>

                    <span className="text-sm font-black text-amber-300">
                      {leader?.titles ??
                        1}{" "}
                      🏆
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-lime-300 px-5 text-sm font-black text-[#050B18] transition hover:bg-lime-200"
                >
                  <Save className="h-4 w-4" />
                  Save leader
                </button>
              </form>
            </AdminPanel>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.025] px-5 py-4 text-sm leading-6 text-white/35">
            ATP 250 Studio Lite intentionally hides Identity, Hero & Media, Gallery, Story, Milestones, Chapters, Iconic Moments, SEO and the full historical Championship managers. Those modules remain available to the richer tournament categories.
          </div>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell
      title={
        tournament.shortName ??
        tournament.name
      }
      description={`${formatLabel(
        tournament.category,
      )} · Tournament Studio`}
    >
      <div className="space-y-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/admin/tournaments"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/45 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Tournament Studio
          </Link>

          {publicPageHref ? (
            <Link
              href={
                publicPageHref
              }
              target="_blank"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm font-semibold text-white/60 transition hover:border-lime-300/30 hover:bg-lime-300/10 hover:text-lime-200"
            >
              <Eye className="h-4 w-4" />
              View public page
            </Link>
          ) : null}
        </div>

        <AdminPageHeader
          eyebrow="Tournament Editor"
          title={
            tournament.shortName ??
            tournament.name
          }
          description={`${editorialLevel.description} Manage identity, visuals, story, editions, champions and publishing from one workspace.`}
          icon={Trophy}
        />

        {identitySaved ? (
          <div
            role="status"
            className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-4 text-sm font-semibold text-emerald-100"
          >
            Tournament identity saved successfully.
          </div>
        ) : null}

        {mediaSaved ? (
          <div
            role="status"
            className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-4 text-sm font-semibold text-emerald-100"
          >
            Hero & media settings saved successfully.
          </div>
        ) : null}

        {storySeoSaved ? (
          <div
            role="status"
            className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-4 text-sm font-semibold text-emerald-100"
          >
            Story & SEO settings saved successfully.
          </div>
        ) : null}

        {gallerySaved ? (
          <div
            role="status"
            className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-4 text-sm font-semibold text-emerald-100"
          >
            Tournament gallery saved successfully.
          </div>
        ) : null}

        {milestoneSaved ? (
          <div
            role="status"
            className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-4 text-sm font-semibold text-emerald-100"
          >
            Tournament milestone saved successfully.
          </div>
        ) : null}

        {chapterSaved ? (
          <div
            role="status"
            className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-4 text-sm font-semibold text-emerald-100"
          >
            Tournament chapter saved successfully.
          </div>
        ) : null}

        {iconicMomentSaved ? (
          <div
            role="status"
            className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-4 text-sm font-semibold text-emerald-100"
          >
            Iconic moment saved successfully.
          </div>
        ) : null}

        {editionSaved ? (
          <div
            role="status"
            className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-4 text-sm font-semibold text-emerald-100"
          >
            Tournament edition saved successfully.
          </div>
        ) : null}

        {championSaved ? (
          <div
            role="status"
            className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-4 text-sm font-semibold text-emerald-100"
          >
            Tournament champion saved successfully.
          </div>
        ) : null}

        <AdminStatsGrid
          columns={4}
          items={[
            {
              label:
                "Editorial level",
              value:
                editorialLevel.label,
              icon: Sparkles,
              tone: "museum",
            },
            {
              label: "Editions",
              value:
                tournament._count
                  .editions,
              icon: CalendarDays,
              tone: "neutral",
            },
            {
              label: "Champions",
              value:
                tournament._count
                  .champions,
              icon: Crown,
              tone: "neutral",
            },
            {
              label:
                "Latest edition",
              value:
                latestEdition?.year ??
                "—",
              icon: Trophy,
              tone: "success",
            },
          ]}
        />

        <AdminPanel className="overflow-hidden">
          <div className="border-b border-white/10 px-5 py-5 sm:px-6">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-lime-300/70">
              Editor sections
            </p>

            <h2 className="mt-2 text-xl font-semibold tracking-tight text-white">
              Tournament content map
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-white/40">
              The public design stays untouched. Tournament Studio progressively becomes the source of truth for its content.
            </p>
          </div>

          <div className="grid gap-px bg-white/10 md:grid-cols-2 xl:grid-cols-4">
            <EditorModule
              eyebrow="01"
              title="Identity"
              description="Name, slug, category, surface, country, city, venue and founded year."
              status="EDITABLE"
            />

            <EditorModule
              eyebrow="02"
              title="Hero & Media"
              description="Hero image, logo, website and visual references for the existing public experience."
              status="EDITABLE"
            />

            <EditorModule
              eyebrow="03"
              title="Story"
              description="Description, history, milestones and chapters are now editable; iconic moments come next."
              status="EDITABLE"
            />

            <EditorModule
              eyebrow="04"
              title="Championship"
              description="Editions, finals, champions, player links, scores and title leaders are editable from Tournament Studio."
              status="EDITABLE"
            />

            <EditorModule
              eyebrow="05"
              title="Museum"
              description="Iconic moments are now editable; legends and archive connections can build on this layer."
              status="EDITABLE"
            />

            <EditorModule
              eyebrow="06"
              title="Publishing"
              description="Active, featured, display order and public visibility."
              status="EDITABLE"
            />

            <EditorModule
              eyebrow="07"
              title="SEO"
              description="Meta title and meta description are now editable from Tournament Studio."
              status="EDITABLE"
            />

            <EditorModule
              eyebrow="08"
              title="Preview"
              description="Open the existing public experience without changing its visual design."
              status={
                publicPageHref
                  ? "LIVE"
                  : "PENDING"
              }
            />
          </div>
        </AdminPanel>

        <AdminPanel className="overflow-hidden">
          <div className="border-b border-white/10 px-5 py-5 sm:px-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-lime-300/70">
                  Identity · Editable
                </p>

                <h2 className="mt-2 text-xl font-semibold tracking-tight text-white">
                  Tournament profile
                </h2>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-white/40">
                  These fields are stored directly in Prisma/Supabase. Changing the slug also changes the Tournament Studio URL after saving.
                </p>
              </div>

              <span className="rounded-full border border-lime-300/20 bg-lime-300/10 px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.15em] text-lime-200">
                {formatLabel(
                  tournament.category,
                )}
              </span>
            </div>
          </div>

          <form
            action={updateIdentity}
            className="p-5 sm:p-6"
          >
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              <Field
                label="Official name"
                name="name"
                defaultValue={
                  tournament.name
                }
                required
              />

              <Field
                label="Short name"
                name="shortName"
                defaultValue={
                  tournament.shortName ??
                  ""
                }
              />

              <Field
                label="Slug"
                name="slug"
                defaultValue={
                  tournament.slug
                }
                required
                hint="Used by CMS and public URLs."
              />

              <SelectField
                label="Category"
                name="category"
                defaultValue={
                  tournament.category
                }
                options={
                  tournamentCategories
                }
              />

              <SelectField
                label="Surface"
                name="surface"
                defaultValue={
                  tournament.surface
                }
                options={
                  courtSurfaces
                }
              />

              <Field
                label="Founded year"
                name="foundedYear"
                type="number"
                defaultValue={
                  tournament.foundedYear ??
                  ""
                }
                min="1800"
                max="2200"
              />

              <Field
                label="City"
                name="city"
                defaultValue={
                  tournament.city ??
                  ""
                }
              />

              <Field
                label="Country"
                name="country"
                defaultValue={
                  tournament.country
                }
                required
              />

              <Field
                label="Country code"
                name="countryCode"
                defaultValue={
                  tournament.countryCode ??
                  ""
                }
                hint="Example: USA, ITA, ESP."
              />

              <Field
                label="Venue"
                name="venue"
                defaultValue={
                  tournament.venue ??
                  ""
                }
                className="md:col-span-2"
              />

              <Field
                label="Display order"
                name="displayOrder"
                type="number"
                defaultValue={
                  tournament.displayOrder ??
                  ""
                }
              />
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <ToggleCard
                name="active"
                label="Active tournament"
                description="Controls whether the tournament is available to the museum engine."
                defaultChecked={
                  tournament.active
                }
              />

              <ToggleCard
                name="featured"
                label="Featured tournament"
                description="Marks the tournament as featured within AGE202 tournament experiences."
                defaultChecked={
                  tournament.featured
                }
              />
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5">
              <div className="flex flex-wrap items-center gap-4 text-xs text-white/30">
                <span>
                  Current location:{" "}
                  {locationLabel ||
                    "—"}
                </span>

                <span className="hidden h-4 w-px bg-white/10 sm:block" />

                <span>
                  Editorial mode:{" "}
                  {
                    editorialLevel.label
                  }
                </span>
              </div>

              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-lime-300 px-5 text-sm font-black text-[#050B18] transition hover:bg-lime-200"
              >
                <Save className="h-4 w-4" />
                Save identity
              </button>
            </div>
          </form>
        </AdminPanel>

        <AdminPanel className="overflow-hidden">
          <div className="border-b border-white/10 px-5 py-5 sm:px-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-lime-300/70">
                  Hero & Media · Editable
                </p>

                <h2 className="mt-2 text-xl font-semibold tracking-tight text-white">
                  Visual identity
                </h2>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-white/40">
                  This first media layer uses the fields already available in Tournament. Gallery management will be added as a dedicated media module without changing the existing public design.
                </p>
              </div>

              <span className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.15em] text-sky-200">
                <ImageIcon className="h-3.5 w-3.5" />
                Media V1
              </span>
            </div>
          </div>

          <form
            action={updateMedia}
            className="p-5 sm:p-6"
          >
            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
              <div className="grid gap-5 md:grid-cols-2">
                <Field
                  label="Hero image URL"
                  name="heroImage"
                  defaultValue={
                    tournament.heroImage ??
                    ""
                  }
                  className="md:col-span-2"
                  hint="Use the exact image path or URL that should feed the existing tournament hero."
                />

                <Field
                  label="Logo URL"
                  name="logoUrl"
                  defaultValue={
                    tournament.logoUrl ??
                    ""
                  }
                  hint="Tournament logo or official mark."
                />

                <Field
                  label="Official website"
                  name="websiteUrl"
                  defaultValue={
                    tournament.websiteUrl ??
                    ""
                  }
                  hint="Optional external tournament website."
                />

                <TextAreaField
                  label="Hero / overview description"
                  name="description"
                  defaultValue={
                    tournament.description ??
                    ""
                  }
                  className="md:col-span-2"
                  rows={5}
                  hint="Base editorial copy. The public Masters 1000 design remains unchanged."
                />
              </div>

              <div className="space-y-4">
                <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#07101D]">
                  <div className="relative aspect-[16/10] overflow-hidden bg-[radial-gradient(circle_at_50%_30%,rgba(190,242,100,.15),transparent_38%),#050B18]">
                    {tournament.heroImage ? (
                      <img
                        src={tournament.heroImage}
                        alt={`${tournament.name} hero preview`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 grid place-items-center">
                        <ImageIcon className="h-10 w-10 text-lime-300/30" />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-[#050B18] via-transparent to-transparent" />
                  </div>

                  <div className="p-4">
                    <p className="text-[8px] font-black uppercase tracking-[0.16em] text-white/25">
                      Current hero
                    </p>

                    <p className="mt-2 truncate text-sm font-semibold text-white/65">
                      {tournament.heroImage ??
                        "No hero image stored in Tournament yet."}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                  <div className="flex items-center gap-2 text-lime-300/60">
                    <Link2 className="h-4 w-4" />

                    <p className="text-[8px] font-black uppercase tracking-[0.16em]">
                      Public experience
                    </p>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-white/35">
                    The existing Indian Wells page keeps its current layout. In the next integration step we will replace its hardcoded media values with these CMS fields one by one.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end border-t border-white/10 pt-5">
              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-lime-300 px-5 text-sm font-black text-[#050B18] transition hover:bg-lime-200"
              >
                <Save className="h-4 w-4" />
                Save hero & media
              </button>
            </div>
          </form>
        </AdminPanel>

        <AdminPanel className="overflow-hidden">
          <div className="border-b border-white/10 px-5 py-5 sm:px-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-lime-300/70">
                  Gallery Manager · Premium
                </p>

                <h2 className="mt-2 text-xl font-semibold tracking-tight text-white">
                  Tournament gallery
                </h2>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-white/40">
                  Create, edit, reorder and feature the images that will feed the existing public Masters 1000 gallery without changing its visual layout.
                </p>
              </div>

              <span className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.15em] text-sky-200">
                <ImagePlus className="h-3.5 w-3.5" />
                {tournament._count.galleryItems} images
              </span>
            </div>
          </div>

          <div className="grid gap-px bg-white/10 xl:grid-cols-[380px_minmax(0,1fr)]">
            <div className="bg-[#07101D] p-5 sm:p-6">
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-white/30">
                Add gallery image
              </p>

              <form
                action={createGalleryItem}
                className="mt-5 space-y-4"
              >
                <Field
                  label="Image URL"
                  name="imageUrl"
                  defaultValue=""
                  required
                  hint="Public path or image URL used by the tournament gallery."
                />

                <Field
                  label="Title"
                  name="title"
                  defaultValue=""
                />

                <Field
                  label="Eyebrow"
                  name="eyebrow"
                  defaultValue=""
                  hint="Example: Stadium 1, Night session, Practice courts."
                />

                <TextAreaField
                  label="Caption"
                  name="caption"
                  defaultValue=""
                  rows={4}
                />

                <Field
                  label="Alt text"
                  name="alt"
                  defaultValue=""
                />

                <Field
                  label="Sort order"
                  name="sortOrder"
                  type="number"
                  defaultValue="0"
                />

                <ToggleCard
                  name="featured"
                  label="Featured image"
                  description="Prioritise this image in the premium tournament gallery."
                  defaultChecked={false}
                />

                <button
                  type="submit"
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-lime-300 px-5 text-sm font-black text-[#050B18] transition hover:bg-lime-200"
                >
                  <ImagePlus className="h-4 w-4" />
                  Add gallery image
                </button>
              </form>
            </div>

            <div className="bg-[#050B18] p-5 sm:p-6">
              {tournament.galleryItems.length > 0 ? (
                <div className="grid gap-4 2xl:grid-cols-2">
                  {tournament.galleryItems.map(
                    (item) => {
                      const updateGalleryItem =
                        updateTournamentGalleryItem.bind(
                          null,
                          tournament.id,
                          item.id,
                        );

                      const deleteGalleryItem =
                        deleteTournamentGalleryItem.bind(
                          null,
                          tournament.id,
                          item.id,
                        );

                      return (
                        <div
                          key={item.id}
                          className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#07101D]"
                        >
                          <div
                            className="relative aspect-[16/9] bg-cover bg-center"
                            style={{
                              backgroundImage: `linear-gradient(to top, rgba(5,11,24,.9), rgba(5,11,24,.04)), url("${item.imageUrl.replaceAll('"', '\\"')}")`,
                            }}
                          >
                            <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                              {item.featured ? (
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-lime-300/20 bg-lime-300/15 px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.14em] text-lime-200 backdrop-blur">
                                  <Star className="h-3 w-3 fill-current" />
                                  Featured
                                </span>
                              ) : null}

                              <span className="rounded-full border border-white/10 bg-black/35 px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.14em] text-white/55 backdrop-blur">
                                Order {item.sortOrder}
                              </span>
                            </div>

                            <div className="absolute inset-x-4 bottom-4">
                              <p className="text-[8px] font-black uppercase tracking-[0.16em] text-lime-300/70">
                                {item.eyebrow ??
                                  "Tournament Gallery"}
                              </p>

                              <h3 className="mt-1 text-lg font-semibold text-white">
                                {item.title ??
                                  "Untitled image"}
                              </h3>
                            </div>
                          </div>

                          <form
                            action={updateGalleryItem}
                            className="space-y-4 p-4"
                          >
                            <Field
                              label="Image URL"
                              name="imageUrl"
                              defaultValue={item.imageUrl}
                              required
                            />

                            <div className="grid gap-4 sm:grid-cols-2">
                              <Field
                                label="Title"
                                name="title"
                                defaultValue={item.title ?? ""}
                              />

                              <Field
                                label="Eyebrow"
                                name="eyebrow"
                                defaultValue={item.eyebrow ?? ""}
                              />
                            </div>

                            <TextAreaField
                              label="Caption"
                              name="caption"
                              defaultValue={item.caption ?? ""}
                              rows={3}
                            />

                            <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_120px]">
                              <Field
                                label="Alt text"
                                name="alt"
                                defaultValue={item.alt ?? ""}
                              />

                              <Field
                                label="Order"
                                name="sortOrder"
                                type="number"
                                defaultValue={item.sortOrder}
                              />
                            </div>

                            <ToggleCard
                              name="featured"
                              label="Featured"
                              description="Prioritise in gallery ordering."
                              defaultChecked={item.featured}
                            />

                            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
                              <button
                                type="submit"
                                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-lime-300/20 bg-lime-300/10 px-4 text-sm font-semibold text-lime-200 transition hover:bg-lime-300/15"
                              >
                                <Save className="h-4 w-4" />
                                Save image
                              </button>

                              <button
                                formAction={deleteGalleryItem}
                                type="submit"
                                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 text-sm font-semibold text-red-200 transition hover:bg-red-400/15"
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </button>
                            </div>
                          </form>
                        </div>
                      );
                    },
                  )}
                </div>
              ) : (
                <div className="grid min-h-[320px] place-items-center rounded-[1.5rem] border border-dashed border-white/10 bg-white/[0.02] p-8 text-center">
                  <div>
                    <ImagePlus className="mx-auto h-10 w-10 text-lime-300/30" />

                    <p className="mt-4 text-sm font-semibold text-white/55">
                      No gallery images yet.
                    </p>

                    <p className="mt-2 max-w-md text-sm leading-6 text-white/30">
                      Add the first Indian Wells image from the form. Nothing on the public page changes until we connect its existing gallery component to this CMS data.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </AdminPanel>

        <AdminPanel className="overflow-hidden">
          <div className="border-b border-white/10 px-5 py-5 sm:px-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-lime-300/70">
                  Milestones Manager · Premium
                </p>

                <h2 className="mt-2 text-xl font-semibold tracking-tight text-white">
                  Tournament milestones
                </h2>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-white/40">
                  Build the chronological moments that shape the tournament story. These records will later feed the existing public Masters 1000 timeline without changing its visual structure.
                </p>
              </div>

              <span className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.15em] text-violet-200">
                <Landmark className="h-3.5 w-3.5" />
                {tournament._count.milestones} milestones
              </span>
            </div>
          </div>

          <div className="grid gap-px bg-white/10 xl:grid-cols-[380px_minmax(0,1fr)]">
            <div className="bg-[#07101D] p-5 sm:p-6">
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-white/30">
                Add milestone
              </p>

              <form
                action={createMilestone}
                className="mt-5 space-y-4"
              >
                <Field
                  label="Year"
                  name="year"
                  type="number"
                  defaultValue=""
                  min="1800"
                  max="2200"
                />

                <Field
                  label="Title"
                  name="title"
                  defaultValue=""
                  required
                />

                <Field
                  label="Subtitle"
                  name="subtitle"
                  defaultValue=""
                />

                <TextAreaField
                  label="Description"
                  name="description"
                  defaultValue=""
                  rows={5}
                />

                <Field
                  label="Image URL"
                  name="imageUrl"
                  defaultValue=""
                />

                <Field
                  label="Sort order"
                  name="sortOrder"
                  type="number"
                  defaultValue="0"
                />

                <ToggleCard
                  name="featured"
                  label="Featured milestone"
                  description="Highlight this moment in the premium tournament story."
                  defaultChecked={false}
                />

                <button
                  type="submit"
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-lime-300 px-5 text-sm font-black text-[#050B18] transition hover:bg-lime-200"
                >
                  <Landmark className="h-4 w-4" />
                  Add milestone
                </button>
              </form>
            </div>

            <div className="bg-[#050B18] p-5 sm:p-6">
              {tournament.milestones.length > 0 ? (
                <div className="space-y-4">
                  {tournament.milestones.map(
                    (milestone) => {
                      const updateMilestone =
                        updateTournamentMilestone.bind(
                          null,
                          tournament.id,
                          milestone.id,
                        );

                      const deleteMilestone =
                        deleteTournamentMilestone.bind(
                          null,
                          tournament.id,
                          milestone.id,
                        );

                      return (
                        <div
                          key={milestone.id}
                          className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#07101D]"
                        >
                          <div className="grid gap-5 p-5 lg:grid-cols-[120px_minmax(0,1fr)]">
                            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                              <p className="text-[8px] font-black uppercase tracking-[0.16em] text-white/25">
                                Year
                              </p>

                              <p className="mt-2 text-3xl font-black tracking-[-0.04em] text-lime-300">
                                {milestone.year ??
                                  "—"}
                              </p>

                              <p className="mt-4 text-[8px] font-black uppercase tracking-[0.14em] text-white/25">
                                Order {milestone.sortOrder}
                              </p>

                              {milestone.featured ? (
                                <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-lime-300/20 bg-lime-300/10 px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.12em] text-lime-200">
                                  <Star className="h-3 w-3 fill-current" />
                                  Featured
                                </span>
                              ) : null}
                            </div>

                            <form
                              action={updateMilestone}
                              className="space-y-4"
                            >
                              <div className="grid gap-4 sm:grid-cols-2">
                                <Field
                                  label="Year"
                                  name="year"
                                  type="number"
                                  defaultValue={
                                    milestone.year ??
                                    ""
                                  }
                                  min="1800"
                                  max="2200"
                                />

                                <Field
                                  label="Order"
                                  name="sortOrder"
                                  type="number"
                                  defaultValue={
                                    milestone.sortOrder
                                  }
                                />
                              </div>

                              <Field
                                label="Title"
                                name="title"
                                defaultValue={
                                  milestone.title
                                }
                                required
                              />

                              <Field
                                label="Subtitle"
                                name="subtitle"
                                defaultValue={
                                  milestone.subtitle ??
                                  ""
                                }
                              />

                              <TextAreaField
                                label="Description"
                                name="description"
                                defaultValue={
                                  milestone.description ??
                                  ""
                                }
                                rows={4}
                              />

                              <Field
                                label="Image URL"
                                name="imageUrl"
                                defaultValue={
                                  milestone.imageUrl ??
                                  ""
                                }
                              />

                              <ToggleCard
                                name="featured"
                                label="Featured"
                                description="Highlight this milestone in premium storytelling."
                                defaultChecked={
                                  milestone.featured
                                }
                              />

                              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
                                <button
                                  type="submit"
                                  className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-lime-300/20 bg-lime-300/10 px-4 text-sm font-semibold text-lime-200 transition hover:bg-lime-300/15"
                                >
                                  <Save className="h-4 w-4" />
                                  Save milestone
                                </button>

                                <button
                                  formAction={deleteMilestone}
                                  type="submit"
                                  className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 text-sm font-semibold text-red-200 transition hover:bg-red-400/15"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Delete
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      );
                    },
                  )}
                </div>
              ) : (
                <div className="grid min-h-[320px] place-items-center rounded-[1.5rem] border border-dashed border-white/10 bg-white/[0.02] p-8 text-center">
                  <div>
                    <Landmark className="mx-auto h-10 w-10 text-violet-300/30" />

                    <p className="mt-4 text-sm font-semibold text-white/55">
                      No milestones yet.
                    </p>

                    <p className="mt-2 max-w-md text-sm leading-6 text-white/30">
                      Add the first historical milestone for Indian Wells. The public page stays untouched until we connect its existing timeline to these records.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </AdminPanel>

        <AdminPanel className="overflow-hidden">
          <div className="border-b border-white/10 px-5 py-5 sm:px-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-lime-300/70">
                  Chapters Manager · Premium
                </p>

                <h2 className="mt-2 text-xl font-semibold tracking-tight text-white">
                  Editorial chapters
                </h2>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-white/40">
                  Build the large narrative chapters behind the premium Masters 1000 experience. Indian Wells remains the visual reference; this module only moves chapter content into the CMS.
                </p>
              </div>

              <span className="inline-flex items-center gap-2 rounded-full border border-fuchsia-400/20 bg-fuchsia-400/10 px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.15em] text-fuchsia-200">
                <LibraryBig className="h-3.5 w-3.5" />
                {tournament._count.chapters} chapters
              </span>
            </div>
          </div>

          <div className="grid gap-px bg-white/10 xl:grid-cols-[380px_minmax(0,1fr)]">
            <div className="bg-[#07101D] p-5 sm:p-6">
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-white/30">
                Add chapter
              </p>

              <form action={createChapter} className="mt-5 space-y-4">
                <Field label="Eyebrow" name="eyebrow" defaultValue="" hint="Example: Chapter II · The King" />
                <Field label="Title" name="title" defaultValue="" required />
                <Field label="Subtitle" name="subtitle" defaultValue="" />
                <Field label="Year label" name="yearLabel" defaultValue="" hint="Free editorial label: 2004–2017, The Federer Era, etc." />
                <TextAreaField label="Description" name="description" defaultValue="" rows={6} />
                <Field label="Image URL" name="imageUrl" defaultValue="" />
                <Field label="Sort order" name="sortOrder" type="number" defaultValue="0" />

                <ToggleCard
                  name="featured"
                  label="Featured chapter"
                  description="Mark this as one of the primary narrative chapters."
                  defaultChecked={false}
                />

                <button
                  type="submit"
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-lime-300 px-5 text-sm font-black text-[#050B18] transition hover:bg-lime-200"
                >
                  <LibraryBig className="h-4 w-4" />
                  Add chapter
                </button>
              </form>
            </div>

            <div className="bg-[#050B18] p-5 sm:p-6">
              {tournament.chapters.length > 0 ? (
                <div className="space-y-4">
                  {tournament.chapters.map((chapter) => {
                    const updateChapter =
                      updateTournamentChapter.bind(
                        null,
                        tournament.id,
                        chapter.id,
                      );

                    const deleteChapter =
                      deleteTournamentChapter.bind(
                        null,
                        tournament.id,
                        chapter.id,
                      );

                    return (
                      <div
                        key={chapter.id}
                        className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#07101D]"
                      >
                        {chapter.imageUrl ? (
                          <div
                            className="relative min-h-48 bg-cover bg-center"
                            style={{
                              backgroundImage: `linear-gradient(to top, rgba(5,11,24,.96), rgba(5,11,24,.22)), url("${chapter.imageUrl.replaceAll('"', '\\"')}")`,
                            }}
                          >
                            <div className="absolute inset-x-5 bottom-5">
                              <p className="text-[8px] font-black uppercase tracking-[0.18em] text-fuchsia-300/80">
                                {chapter.eyebrow ?? "Editorial chapter"}
                              </p>
                              <h3 className="mt-1 text-2xl font-black tracking-[-0.03em] text-white">
                                {chapter.title}
                              </h3>
                            </div>
                          </div>
                        ) : null}

                        <form action={updateChapter} className="space-y-4 p-5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.14em] text-white/35">
                              Order {chapter.sortOrder}
                            </span>

                            {chapter.yearLabel ? (
                              <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.14em] text-white/45">
                                {chapter.yearLabel}
                              </span>
                            ) : null}

                            {chapter.featured ? (
                              <span className="inline-flex items-center gap-1.5 rounded-full border border-lime-300/20 bg-lime-300/10 px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.12em] text-lime-200">
                                <Star className="h-3 w-3 fill-current" />
                                Featured
                              </span>
                            ) : null}
                          </div>

                          <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="Eyebrow" name="eyebrow" defaultValue={chapter.eyebrow ?? ""} />
                            <Field label="Year label" name="yearLabel" defaultValue={chapter.yearLabel ?? ""} />
                          </div>

                          <Field label="Title" name="title" defaultValue={chapter.title} required />
                          <Field label="Subtitle" name="subtitle" defaultValue={chapter.subtitle ?? ""} />

                          <TextAreaField
                            label="Description"
                            name="description"
                            defaultValue={chapter.description ?? ""}
                            rows={5}
                          />

                          <Field label="Image URL" name="imageUrl" defaultValue={chapter.imageUrl ?? ""} />

                          <Field
                            label="Sort order"
                            name="sortOrder"
                            type="number"
                            defaultValue={chapter.sortOrder}
                          />

                          <ToggleCard
                            name="featured"
                            label="Featured"
                            description="Prioritise this chapter in premium storytelling."
                            defaultChecked={chapter.featured}
                          />

                          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
                            <button
                              type="submit"
                              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-lime-300/20 bg-lime-300/10 px-4 text-sm font-semibold text-lime-200 transition hover:bg-lime-300/15"
                            >
                              <Save className="h-4 w-4" />
                              Save chapter
                            </button>

                            <button
                              formAction={deleteChapter}
                              type="submit"
                              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 text-sm font-semibold text-red-200 transition hover:bg-red-400/15"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </button>
                          </div>
                        </form>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="grid min-h-[320px] place-items-center rounded-[1.5rem] border border-dashed border-white/10 bg-white/[0.02] p-8 text-center">
                  <div>
                    <LibraryBig className="mx-auto h-10 w-10 text-fuchsia-300/30" />
                    <p className="mt-4 text-sm font-semibold text-white/55">
                      No editorial chapters yet.
                    </p>
                    <p className="mt-2 max-w-md text-sm leading-6 text-white/30">
                      Create the first Indian Wells chapter. The existing public Masters 1000 design remains untouched until we wire its narrative sections to these CMS records.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </AdminPanel>

        <AdminPanel className="overflow-hidden">
          <div className="border-b border-white/10 px-5 py-5 sm:px-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-lime-300/70">
                  Iconic Moments Manager · Premium
                </p>

                <h2 className="mt-2 text-xl font-semibold tracking-tight text-white">
                  Iconic moments
                </h2>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-white/40">
                  Curate the matches, finals, breakthroughs and unforgettable scenes that define each Masters 1000 tournament. The public design remains untouched until the final CMS integration.
                </p>
              </div>

              <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.15em] text-amber-200">
                <Medal className="h-3.5 w-3.5" />
                {tournament._count.iconicMoments} moments
              </span>
            </div>
          </div>

          <div className="grid gap-px bg-white/10 xl:grid-cols-[380px_minmax(0,1fr)]">
            <div className="bg-[#07101D] p-5 sm:p-6">
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-white/30">
                Add iconic moment
              </p>

              <form action={createIconicMoment} className="mt-5 space-y-4">
                <Field label="Year" name="year" type="number" defaultValue="" min="1800" max="2200" />
                <Field label="Moment date" name="momentDate" type="date" defaultValue="" />
                <Field label="Title" name="title" defaultValue="" required />
                <Field label="Subtitle" name="subtitle" defaultValue="" />
                <TextAreaField label="Description" name="description" defaultValue="" rows={6} />
                <Field label="Image URL" name="imageUrl" defaultValue="" />
                <Field label="Sort order" name="sortOrder" type="number" defaultValue="0" />

                <ToggleCard
                  name="featured"
                  label="Featured moment"
                  description="Highlight this as one of the defining moments of the tournament."
                  defaultChecked={false}
                />

                <button
                  type="submit"
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-lime-300 px-5 text-sm font-black text-[#050B18] transition hover:bg-lime-200"
                >
                  <Medal className="h-4 w-4" />
                  Add iconic moment
                </button>
              </form>
            </div>

            <div className="bg-[#050B18] p-5 sm:p-6">
              {tournament.iconicMoments.length > 0 ? (
                <div className="grid gap-4 2xl:grid-cols-2">
                  {tournament.iconicMoments.map((moment) => {
                    const updateIconicMoment =
                      updateTournamentIconicMoment.bind(
                        null,
                        tournament.id,
                        moment.id,
                      );

                    const deleteIconicMoment =
                      deleteTournamentIconicMoment.bind(
                        null,
                        tournament.id,
                        moment.id,
                      );

                    return (
                      <div
                        key={moment.id}
                        className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#07101D]"
                      >
                        {moment.imageUrl ? (
                          <div
                            className="relative aspect-[16/9] bg-cover bg-center"
                            style={{
                              backgroundImage: `linear-gradient(to top, rgba(5,11,24,.96), rgba(5,11,24,.08)), url("${moment.imageUrl.replaceAll('"', '\\"')}")`,
                            }}
                          >
                            <div className="absolute inset-x-4 bottom-4">
                              <p className="text-[8px] font-black uppercase tracking-[0.16em] text-amber-300/80">
                                {moment.year ?? "Iconic moment"}
                              </p>
                              <h3 className="mt-1 text-xl font-semibold text-white">
                                {moment.title}
                              </h3>
                            </div>
                          </div>
                        ) : null}

                        <form action={updateIconicMoment} className="space-y-4 p-4">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.14em] text-white/35">
                              Order {moment.sortOrder}
                            </span>

                            {moment.featured ? (
                              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/20 bg-amber-300/10 px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.12em] text-amber-200">
                                <Star className="h-3 w-3 fill-current" />
                                Featured
                              </span>
                            ) : null}
                          </div>

                          <div className="grid gap-4 sm:grid-cols-2">
                            <Field
                              label="Year"
                              name="year"
                              type="number"
                              defaultValue={moment.year ?? ""}
                              min="1800"
                              max="2200"
                            />

                            <Field
                              label="Moment date"
                              name="momentDate"
                              type="date"
                              defaultValue={
                                moment.momentDate
                                  ? moment.momentDate.toISOString().slice(0, 10)
                                  : ""
                              }
                            />
                          </div>

                          <Field label="Title" name="title" defaultValue={moment.title} required />
                          <Field label="Subtitle" name="subtitle" defaultValue={moment.subtitle ?? ""} />

                          <TextAreaField
                            label="Description"
                            name="description"
                            defaultValue={moment.description ?? ""}
                            rows={5}
                          />

                          <Field label="Image URL" name="imageUrl" defaultValue={moment.imageUrl ?? ""} />

                          <Field
                            label="Sort order"
                            name="sortOrder"
                            type="number"
                            defaultValue={moment.sortOrder}
                          />

                          <ToggleCard
                            name="featured"
                            label="Featured"
                            description="Prioritise this moment in the premium tournament museum."
                            defaultChecked={moment.featured}
                          />

                          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
                            <button
                              type="submit"
                              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-lime-300/20 bg-lime-300/10 px-4 text-sm font-semibold text-lime-200 transition hover:bg-lime-300/15"
                            >
                              <Save className="h-4 w-4" />
                              Save moment
                            </button>

                            <button
                              formAction={deleteIconicMoment}
                              type="submit"
                              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 text-sm font-semibold text-red-200 transition hover:bg-red-400/15"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </button>
                          </div>
                        </form>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="grid min-h-[320px] place-items-center rounded-[1.5rem] border border-dashed border-white/10 bg-white/[0.02] p-8 text-center">
                  <div>
                    <Medal className="mx-auto h-10 w-10 text-amber-300/30" />
                    <p className="mt-4 text-sm font-semibold text-white/55">
                      No iconic moments yet.
                    </p>
                    <p className="mt-2 max-w-md text-sm leading-6 text-white/30">
                      Add the first defining Indian Wells moment. Later, the existing public museum sections will read these records directly from Tournament Studio.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </AdminPanel>

        <AdminPanel className="overflow-hidden">
          <div className="border-b border-white/10 px-5 py-5 sm:px-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-lime-300/70">
                  Story & SEO · Editable
                </p>

                <h2 className="mt-2 text-xl font-semibold tracking-tight text-white">
                  Editorial narrative
                </h2>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-white/40">
                  Manage the narrative fields already supported by Tournament. Rich Masters 1000 modules such as milestones, chapters and iconic moments will be added in the next schema expansion.
                </p>
              </div>

              <span className="rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.15em] text-violet-200">
                Story V1
              </span>
            </div>
          </div>

          <form
            action={updateStorySeo}
            className="p-5 sm:p-6"
          >
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,.75fr)]">
              <div className="space-y-5">
                <TextAreaField
                  label="Tournament description"
                  name="description"
                  defaultValue={
                    tournament.description ??
                    ""
                  }
                  rows={5}
                  hint="Short editorial introduction used by the tournament archive."
                />

                <TextAreaField
                  label="History"
                  name="history"
                  defaultValue={
                    tournament.history ??
                    ""
                  }
                  rows={10}
                  hint="Long-form historical narrative. This will later feed the existing public story sections."
                />
              </div>

              <div className="space-y-5">
                <Field
                  label="Meta title"
                  name="metaTitle"
                  defaultValue={
                    tournament.metaTitle ??
                    ""
                  }
                  hint="Optional SEO title. Leave empty to use the page fallback."
                />

                <TextAreaField
                  label="Meta description"
                  name="metaDescription"
                  defaultValue={
                    tournament.metaDescription ??
                    ""
                  }
                  rows={6}
                  hint="Recommended: concise summary for search and social previews."
                />

                <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                  <p className="text-[8px] font-black uppercase tracking-[0.16em] text-white/25">
                    Editorial roadmap
                  </p>

                  <div className="mt-4 space-y-3 text-sm leading-6 text-white/35">
                    <p>
                      Next schema layer: Tournament Milestones.
                    </p>

                    <p>
                      Then: Chapters, iconic moments, gallery captions and tournament character.
                    </p>

                    <p>
                      Indian Wells remains the reference Masters 1000 layout throughout the migration.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end border-t border-white/10 pt-5">
              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-lime-300 px-5 text-sm font-black text-[#050B18] transition hover:bg-lime-200"
              >
                <Save className="h-4 w-4" />
                Save story & SEO
              </button>
            </div>
          </form>
        </AdminPanel>

        <AdminPanel className="overflow-hidden">
          <div className="border-b border-white/10 px-5 py-5 sm:px-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-lime-300/70">
                  Championship Manager · Editions
                </p>

                <h2 className="mt-2 text-xl font-semibold tracking-tight text-white">
                  Tournament editions & finals
                </h2>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-white/40">
                  Manage every edition, champion, runner-up, score and final date. AGE202 player links are optional, so historical finalists can be recorded even when they do not have a player archive.
                </p>
              </div>

              <span className="inline-flex items-center gap-2 rounded-full border border-lime-300/20 bg-lime-300/10 px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.15em] text-lime-200">
                <CalendarDays className="h-3.5 w-3.5" />
                {tournament._count.editions} editions
              </span>
            </div>
          </div>

          <div className="grid gap-px bg-white/10 xl:grid-cols-[390px_minmax(0,1fr)]">
            <div className="bg-[#07101D] p-5 sm:p-6">
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-white/30">
                Add edition
              </p>

              <form
                action={createEdition}
                className="mt-5 space-y-4"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Year"
                    name="year"
                    type="number"
                    defaultValue=""
                    min="1800"
                    max="2200"
                    required
                  />

                  <Field
                    label="Draw size"
                    name="drawSize"
                    type="number"
                    defaultValue=""
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Edition key"
                    name="editionKey"
                    defaultValue="main"
                    required
                    hint='Use "main" normally. Historical exceptions can use keys such as "january" or "december".'
                  />

                  <Field
                    label="Edition label"
                    name="editionLabel"
                    defaultValue=""
                    hint='Optional public label, for example "January edition".'
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Start date"
                    name="startDate"
                    type="date"
                    defaultValue=""
                  />

                  <Field
                    label="Final / end date"
                    name="endDate"
                    type="date"
                    defaultValue=""
                  />
                </div>

                <PlayerSelectField
                  label="Champion AGE202 player"
                  name="championPlayerId"
                  defaultValue=""
                  players={players}
                  optional
                />

                <Field
                  label="Champion name"
                  name="championName"
                  defaultValue=""
                  hint="Use this for display and for champions without an AGE202 player archive."
                />

                <Field
                  label="Champion country code"
                  name="championCountryCode"
                  defaultValue=""
                  hint="Example: ITA, ESP, USA."
                />

                <PlayerSelectField
                  label="Runner-up AGE202 player"
                  name="runnerUpPlayerId"
                  defaultValue=""
                  players={players}
                  optional
                />

                <Field
                  label="Runner-up name"
                  name="runnerUpName"
                  defaultValue=""
                />

                <Field
                  label="Runner-up country code"
                  name="runnerUpCountryCode"
                  defaultValue=""
                />

                <Field
                  label="Score"
                  name="score"
                  defaultValue=""
                  hint="Example: 7-6(4), 6-4"
                />

                <ToggleCard
                  name="cancelled"
                  label="Cancelled edition"
                  description="Mark the season as cancelled instead of recording a completed final."
                  defaultChecked={false}
                />

                <button
                  type="submit"
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-lime-300 px-5 text-sm font-black text-[#050B18] transition hover:bg-lime-200"
                >
                  <Trophy className="h-4 w-4" />
                  Add edition
                </button>
              </form>
            </div>

            <div className="bg-[#050B18] p-5 sm:p-6">
              {tournament.editions.length > 0 ? (
                <div className="space-y-4">
                  {tournament.editions.map(
                    (edition) => {
                      const updateEdition =
                        updateTournamentEdition.bind(
                          null,
                          tournament.id,
                          edition.id,
                        );

                      const deleteEdition =
                        deleteTournamentEdition.bind(
                          null,
                          tournament.id,
                          edition.id,
                        );

                      return (
                        <div
                          key={edition.id}
                          className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#07101D]"
                        >
                          <div className="border-b border-white/10 px-5 py-4">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <div>
                                <div className="flex flex-wrap items-baseline gap-3">
                                  <p className="text-2xl font-black tracking-[-0.04em] text-lime-300">
                                    {edition.year}
                                  </p>

                                  {edition.editionLabel ? (
                                    <span className="font-mono text-[8px] font-black uppercase tracking-[0.16em] text-white/32">
                                      {edition.editionLabel}
                                    </span>
                                  ) : null}
                                </div>

                                <p className="mt-1 text-xs text-white/35">
                                  {edition.championPlayer?.name ??
                                    edition.championName ??
                                    "Champion pending"}{" "}
                                  vs{" "}
                                  {edition.runnerUpPlayer?.name ??
                                    edition.runnerUpName ??
                                    "Runner-up pending"}
                                </p>
                              </div>

                              <div className="flex flex-wrap items-center gap-2">
                                {edition.cancelled ? (
                                  <span className="rounded-full border border-red-400/20 bg-red-400/10 px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.14em] text-red-200">
                                    Cancelled
                                  </span>
                                ) : null}

                                <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.14em] text-white/35">
                                  {edition.score ?? "Score pending"}
                                </span>
                              </div>
                            </div>
                          </div>

                          <form
                            action={updateEdition}
                            className="space-y-4 p-5"
                          >
                            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                              <Field
                                label="Year"
                                name="year"
                                type="number"
                                defaultValue={edition.year}
                                min="1800"
                                max="2200"
                                required
                              />

                              <Field
                                label="Edition key"
                                name="editionKey"
                                defaultValue={edition.editionKey}
                                required
                                hint='Use "main" normally.'
                              />

                              <Field
                                label="Edition label"
                                name="editionLabel"
                                defaultValue={edition.editionLabel ?? ""}
                              />

                              <Field
                                label="Draw size"
                                name="drawSize"
                                type="number"
                                defaultValue={edition.drawSize ?? ""}
                              />

                              <Field
                                label="Start date"
                                name="startDate"
                                type="date"
                                defaultValue={
                                  edition.startDate
                                    ? edition.startDate.toISOString().slice(0, 10)
                                    : ""
                                }
                              />

                              <Field
                                label="Final / end date"
                                name="endDate"
                                type="date"
                                defaultValue={
                                  edition.endDate
                                    ? edition.endDate.toISOString().slice(0, 10)
                                    : ""
                                }
                              />
                            </div>

                            <div className="grid gap-4 lg:grid-cols-2">
                              <div className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                                <p className="text-[8px] font-black uppercase tracking-[0.16em] text-lime-300/60">
                                  Champion
                                </p>

                                <PlayerSelectField
                                  label="AGE202 player"
                                  name="championPlayerId"
                                  defaultValue={edition.championPlayerId ?? ""}
                                  players={players}
                                  optional
                                />

                                <Field
                                  label="Display name"
                                  name="championName"
                                  defaultValue={
                                    edition.championName ??
                                    edition.championPlayer?.name ??
                                    ""
                                  }
                                />

                                <Field
                                  label="Country code"
                                  name="championCountryCode"
                                  defaultValue={edition.championCountryCode ?? ""}
                                />
                              </div>

                              <div className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                                <p className="text-[8px] font-black uppercase tracking-[0.16em] text-white/35">
                                  Runner-up
                                </p>

                                <PlayerSelectField
                                  label="AGE202 player"
                                  name="runnerUpPlayerId"
                                  defaultValue={edition.runnerUpPlayerId ?? ""}
                                  players={players}
                                  optional
                                />

                                <Field
                                  label="Display name"
                                  name="runnerUpName"
                                  defaultValue={
                                    edition.runnerUpName ??
                                    edition.runnerUpPlayer?.name ??
                                    ""
                                  }
                                />

                                <Field
                                  label="Country code"
                                  name="runnerUpCountryCode"
                                  defaultValue={edition.runnerUpCountryCode ?? ""}
                                />
                              </div>
                            </div>

                            <Field
                              label="Score"
                              name="score"
                              defaultValue={edition.score ?? ""}
                            />

                            <ToggleCard
                              name="cancelled"
                              label="Cancelled edition"
                              description="Keep this edition in the archive but mark it as cancelled."
                              defaultChecked={edition.cancelled}
                            />

                            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
                              <button
                                type="submit"
                                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-lime-300/20 bg-lime-300/10 px-4 text-sm font-semibold text-lime-200 transition hover:bg-lime-300/15"
                              >
                                <Save className="h-4 w-4" />
                                Save edition
                              </button>

                              <button
                                formAction={deleteEdition}
                                type="submit"
                                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 text-sm font-semibold text-red-200 transition hover:bg-red-400/15"
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </button>
                            </div>
                          </form>
                        </div>
                      );
                    },
                  )}
                </div>
              ) : (
                <div className="grid min-h-[320px] place-items-center rounded-[1.5rem] border border-dashed border-white/10 bg-white/[0.02] p-8 text-center">
                  <div>
                    <Trophy className="mx-auto h-10 w-10 text-lime-300/30" />

                    <p className="mt-4 text-sm font-semibold text-white/55">
                      No tournament editions yet.
                    </p>

                    <p className="mt-2 max-w-md text-sm leading-6 text-white/30">
                      Add the first final from the form. The public Recent Finals and Tournament Editions sections already know how to read these records.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </AdminPanel>

        <AdminPanel className="overflow-hidden">
          <div className="border-b border-white/10 px-5 py-5 sm:px-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-lime-300/70">
                  Champions Manager · Legends source
                </p>

                <h2 className="mt-2 text-xl font-semibold tracking-tight text-white">
                  Title leaders & AGE202 legends
                </h2>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-white/40">
                  Link tournament champions to AGE202 Player records and maintain their title totals. These records are the shared source for Title Leaders and the future dynamic Legends section.
                </p>
              </div>

              <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.15em] text-amber-200">
                <Crown className="h-3.5 w-3.5" />
                {tournament._count.champions} champions
              </span>
            </div>
          </div>

          <div className="grid gap-px bg-white/10 xl:grid-cols-[390px_minmax(0,1fr)]">
            <div className="bg-[#07101D] p-5 sm:p-6">
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-white/30">
                Add champion
              </p>

              <form
                action={createChampion}
                className="mt-5 space-y-4"
              >
                <PlayerSelectField
                  label="AGE202 player"
                  name="playerId"
                  defaultValue=""
                  players={players}
                  optional
                />

                <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                  <p className="text-[8px] font-black uppercase tracking-[0.16em] text-amber-300/65">
                    Historical legend
                  </p>

                  <p className="mt-2 text-xs leading-6 text-white/30">
                    Leave AGE202 player empty and use these fields for a champion without a Player archive.
                  </p>

                  <div className="mt-4 space-y-4">
                    <Field
                      label="Historical name"
                      name="name"
                      defaultValue=""
                      hint="Example: Andre Agassi"
                    />

                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field
                        label="Country"
                        name="country"
                        defaultValue=""
                        hint="Example: United States"
                      />

                      <Field
                        label="Country code"
                        name="countryCode"
                        defaultValue=""
                        hint="Example: USA"
                      />
                    </div>
                  </div>
                </div>

                <Field
                  label="Titles"
                  name="titles"
                  type="number"
                  defaultValue="1"
                  min="1"
                  required
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="First title year"
                    name="firstTitleYear"
                    type="number"
                    defaultValue=""
                    min="1800"
                    max="2200"
                  />

                  <Field
                    label="Last title year"
                    name="lastTitleYear"
                    type="number"
                    defaultValue=""
                    min="1800"
                    max="2200"
                  />
                </div>

                <Field
                  label="Title years"
                  name="titleYears"
                  defaultValue=""
                  hint="Comma-separated years. Example: 2007, 2011, 2012, 2014, 2015, 2016"
                />

                <div className="grid gap-4 sm:grid-cols-3">
                  <Field
                    label="Finals"
                    name="finals"
                    type="number"
                    defaultValue=""
                    min="0"
                  />

                  <Field
                    label="Wins"
                    name="wins"
                    type="number"
                    defaultValue=""
                    min="0"
                  />

                  <Field
                    label="Sort order"
                    name="sortOrder"
                    type="number"
                    defaultValue="0"
                  />
                </div>

                <Field
                  label="Record label"
                  name="recordLabel"
                  defaultValue=""
                  hint="Example: Joint record holder, Six-time champion."
                />

                <TextAreaField
                  label="Legend quote"
                  name="quote"
                  defaultValue=""
                  rows={3}
                />

                <Field
                  label="Legend image URL"
                  name="imageUrl"
                  defaultValue=""
                  hint="Example: /tournaments/miami/legends/djokovic.jpg"
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <ToggleCard
                    name="legend"
                    label="Show as Legend"
                    description="Include this champion in the premium Legends section."
                    defaultChecked={false}
                  />

                  <ToggleCard
                    name="featured"
                    label="Featured Legend"
                    description="Prioritise this legend in the public presentation."
                    defaultChecked={false}
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-lime-300 px-5 text-sm font-black text-[#050B18] transition hover:bg-lime-200"
                >
                  <Crown className="h-4 w-4" />
                  Add champion
                </button>
              </form>

              <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                <p className="text-xs leading-6 text-white/30">
                  AGE202 champions can link to Player archives. Historical legends can be created without a Player record by using the name, country and country code fields above.
                </p>
              </div>
            </div>

            <div className="bg-[#050B18] p-5 sm:p-6">
              {tournament.champions.length > 0 ? (
                <div className="grid gap-4 2xl:grid-cols-2">
                  {tournament.champions.map(
                    (champion) => {
                      const updateChampion =
                        updateTournamentChampion.bind(
                          null,
                          tournament.id,
                          champion.id,
                        );

                      const deleteChampion =
                        deleteTournamentChampion.bind(
                          null,
                          tournament.id,
                          champion.id,
                        );

                      return (
                        <form
                          key={champion.id}
                          action={updateChampion}
                          className="space-y-4 rounded-[1.5rem] border border-white/10 bg-[#07101D] p-5"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-[8px] font-black uppercase tracking-[0.16em] text-amber-300/65">
                                Tournament legend
                              </p>

                              <h3 className="mt-2 text-xl font-semibold text-white">
                                {champion.player?.name ??
                              champion.name ??
                              "Historical legend"}
                              </h3>

                              <p className="mt-1 text-xs text-white/30">
                                {champion.player?.country ??
                              champion.country ??
                              "Country pending"}
                              </p>

                              <div className="mt-3 flex flex-wrap gap-2">
                                {champion.legend ? (
                                  <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.12em] text-amber-200">
                                    Legend
                                  </span>
                                ) : null}

                                {champion.featured ? (
                                  <span className="rounded-full border border-lime-300/20 bg-lime-300/10 px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.12em] text-lime-200">
                                    Featured
                                  </span>
                                ) : null}
                              </div>
                            </div>

                            <div className="text-right">
                              <span className="block text-4xl font-black tracking-[-0.05em] text-lime-300">
                                {champion.titles}
                              </span>

                              <span className="text-[8px] font-black uppercase tracking-[0.14em] text-white/25">
                                Titles
                              </span>
                            </div>
                          </div>

                          <PlayerSelectField
                            label="AGE202 player"
                            name="playerId"
                            defaultValue={champion.playerId ?? ""}
                            players={players}
                            optional
                          />

                          <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                            <p className="text-[8px] font-black uppercase tracking-[0.16em] text-amber-300/65">
                              Historical identity
                            </p>

                            <div className="mt-4 space-y-4">
                              <Field
                                label="Historical name"
                                name="name"
                                defaultValue={champion.name ?? ""}
                                hint="Used when no AGE202 player is linked."
                              />

                              <div className="grid gap-4 sm:grid-cols-2">
                                <Field
                                  label="Country"
                                  name="country"
                                  defaultValue={champion.country ?? ""}
                                />

                                <Field
                                  label="Country code"
                                  name="countryCode"
                                  defaultValue={champion.countryCode ?? ""}
                                />
                              </div>
                            </div>
                          </div>

                          <Field
                            label="Titles"
                            name="titles"
                            type="number"
                            defaultValue={champion.titles}
                            min="1"
                            required
                          />

                          <div className="grid gap-4 sm:grid-cols-2">
                            <Field
                              label="First title year"
                              name="firstTitleYear"
                              type="number"
                              defaultValue={champion.firstTitleYear ?? ""}
                              min="1800"
                              max="2200"
                            />

                            <Field
                              label="Last title year"
                              name="lastTitleYear"
                              type="number"
                              defaultValue={champion.lastTitleYear ?? ""}
                              min="1800"
                              max="2200"
                            />
                          </div>

                          <Field
                            label="Title years"
                            name="titleYears"
                            defaultValue={champion.titleYears.join(", ")}
                            hint="Exact championship years separated by commas."
                          />

                          <div className="grid gap-4 sm:grid-cols-3">
                            <Field
                              label="Finals"
                              name="finals"
                              type="number"
                              defaultValue={champion.finals ?? ""}
                              min="0"
                            />

                            <Field
                              label="Wins"
                              name="wins"
                              type="number"
                              defaultValue={champion.wins ?? ""}
                              min="0"
                            />

                            <Field
                              label="Sort order"
                              name="sortOrder"
                              type="number"
                              defaultValue={champion.sortOrder}
                            />
                          </div>

                          <Field
                            label="Record label"
                            name="recordLabel"
                            defaultValue={champion.recordLabel ?? ""}
                          />

                          <TextAreaField
                            label="Legend quote"
                            name="quote"
                            defaultValue={champion.quote ?? ""}
                            rows={3}
                          />

                          <Field
                            label="Legend image URL"
                            name="imageUrl"
                            defaultValue={champion.imageUrl ?? ""}
                          />

                          <div className="grid gap-4 sm:grid-cols-2">
                            <ToggleCard
                              name="legend"
                              label="Show as Legend"
                              description="Include this champion in the premium Legends section."
                              defaultChecked={champion.legend}
                            />

                            <ToggleCard
                              name="featured"
                              label="Featured Legend"
                              description="Prioritise this legend in the public presentation."
                              defaultChecked={champion.featured}
                            />
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
                            <button
                              type="submit"
                              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-lime-300/20 bg-lime-300/10 px-4 text-sm font-semibold text-lime-200 transition hover:bg-lime-300/15"
                            >
                              <Save className="h-4 w-4" />
                              Save champion
                            </button>

                            <button
                              formAction={deleteChampion}
                              type="submit"
                              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 text-sm font-semibold text-red-200 transition hover:bg-red-400/15"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </button>
                          </div>
                        </form>
                      );
                    },
                  )}
                </div>
              ) : (
                <div className="grid min-h-[320px] place-items-center rounded-[1.5rem] border border-dashed border-white/10 bg-white/[0.02] p-8 text-center">
                  <div>
                    <Crown className="mx-auto h-10 w-10 text-amber-300/30" />

                    <p className="mt-4 text-sm font-semibold text-white/55">
                      No AGE202 champions linked yet.
                    </p>

                    <p className="mt-2 max-w-md text-sm leading-6 text-white/30">
                      Link the tournament&apos;s major champions here. Their title totals will drive Title Leaders and, in the next public integration step, Legends.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </AdminPanel>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(340px,.75fr)]">
          <AdminPanel className="p-5 sm:p-6">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-lime-300/70">
              Championship snapshot
            </p>

            <h2 className="mt-2 text-xl font-semibold tracking-tight text-white">
              Recorded finals
            </h2>

            <div className="mt-5 divide-y divide-white/10">
              {tournament.editions.length > 0 ? (
                tournament.editions
                  .slice(0, 8)
                  .map(
                    (edition) => (
                      <div
                        key={edition.id}
                        className="grid gap-3 py-4 sm:grid-cols-[70px_minmax(0,1fr)_minmax(0,1fr)_auto]"
                      >
                        <span className="text-lg font-black text-lime-300">
                          {edition.year}
                        </span>

                        <div>
                          <p className="text-[8px] font-black uppercase tracking-[0.14em] text-white/25">
                            Champion
                          </p>

                          <p className="mt-1 text-sm font-semibold text-white/75">
                            {edition.championPlayer?.name ??
                              edition.championName ??
                              "—"}
                          </p>
                        </div>

                        <div>
                          <p className="text-[8px] font-black uppercase tracking-[0.14em] text-white/25">
                            Runner-up
                          </p>

                          <p className="mt-1 text-sm font-semibold text-white/60">
                            {edition.runnerUpPlayer?.name ??
                              edition.runnerUpName ??
                              "—"}
                          </p>
                        </div>

                        <span className="text-sm font-semibold text-white/35">
                          {edition.score ?? "—"}
                        </span>
                      </div>
                    ),
                  )
              ) : (
                <p className="py-5 text-sm text-white/30">
                  No finals recorded yet.
                </p>
              )}
            </div>
          </AdminPanel>

          <AdminPanel className="p-5 sm:p-6">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-lime-300/70">
              Hall of Champions
            </p>

            <h2 className="mt-2 text-xl font-semibold tracking-tight text-white">
              Linked AGE202 players
            </h2>

            <div className="mt-5 space-y-3">
              {tournament.champions.length > 0 ? (
                tournament.champions
                  .slice(0, 8)
                  .map(
                    (champion) => (
                      <div
                        key={champion.id}
                        className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.025] px-4 py-4"
                      >
                        <div>
                          <p className="text-sm font-semibold text-white/75">
                            {champion.player?.name ??
                              champion.name ??
                              "Historical legend"}
                          </p>

                          <p className="mt-1 text-[8px] font-black uppercase tracking-[0.14em] text-white/25">
                            {champion.firstTitleYear ?? "—"} ·{" "}
                            {champion.lastTitleYear ?? "—"}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-2xl font-black text-lime-300">
                            {champion.titles}
                          </p>

                          <p className="text-[8px] font-black uppercase tracking-[0.14em] text-white/25">
                            Titles
                          </p>
                        </div>
                      </div>
                    ),
                  )
              ) : (
                <p className="text-sm leading-6 text-white/35">
                  No champions are currently linked to AGE202 player archives.
                </p>
              )}
            </div>
          </AdminPanel>
        </div>

        <AdminPanel className="p-5 sm:p-6">
          <div className="grid gap-4 md:grid-cols-3">
            <QuickFact
              icon={MapPin}
              label="Location"
              value={
                locationLabel || "—"
              }
            />

            <QuickFact
              icon={Flag}
              label="Country"
              value={
                tournament.country
              }
            />

            <QuickFact
              icon={Layers3}
              label="Editorial mode"
              value={
                editorialLevel.label
              }
            />
          </div>
        </AdminPanel>
      </div>
    </AdminShell>
  );
}

type EditorModuleProps = {
  eyebrow: string;
  title: string;
  description: string;
  status: string;
};

function EditorModule({
  eyebrow,
  title,
  description,
  status,
}: EditorModuleProps) {
  return (
    <div className="bg-[#07101D] p-5">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[8px] font-black uppercase tracking-[0.18em] text-white/25">
          {eyebrow}
        </span>

        <span className="text-[8px] font-black uppercase tracking-[0.14em] text-lime-300/70">
          {status}
        </span>
      </div>

      <h3 className="mt-3 text-lg font-semibold text-white">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-5 text-white/35">
        {description}
      </p>
    </div>
  );
}

type FieldProps = {
  label: string;
  name: string;
  defaultValue:
    | string
    | number;
  type?: "text" | "number" | "date";
  required?: boolean;
  hint?: string;
  min?: string;
  max?: string;
  className?: string;
};

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  required = false,
  hint,
  min,
  max,
  className = "",
}: FieldProps) {
  return (
    <label
      className={`block ${className}`}
    >
      <span className="text-[9px] font-black uppercase tracking-[0.16em] text-white/35">
        {label}
      </span>

      <input
        type={type}
        name={name}
        defaultValue={
          defaultValue
        }
        required={required}
        min={min}
        max={max}
        className="mt-2 h-12 w-full rounded-2xl border border-white/10 bg-[#08111F] px-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-lime-300/35"
      />

      {hint ? (
        <span className="mt-2 block text-xs leading-5 text-white/25">
          {hint}
        </span>
      ) : null}
    </label>
  );
}

type SelectFieldProps = {
  label: string;
  name: string;
  defaultValue: string;
  options:
    readonly string[];
};

function SelectField({
  label,
  name,
  defaultValue,
  options,
}: SelectFieldProps) {
  return (
    <label className="block">
      <span className="text-[9px] font-black uppercase tracking-[0.16em] text-white/35">
        {label}
      </span>

      <select
        name={name}
        defaultValue={
          defaultValue
        }
        className="mt-2 h-12 w-full rounded-2xl border border-white/10 bg-[#08111F] px-4 text-sm text-white outline-none transition focus:border-lime-300/35"
      >
        {options.map(
          (option) => (
            <option
              key={option}
              value={option}
            >
              {formatLabel(
                option,
              )}
            </option>
          ),
        )}
      </select>
    </label>
  );
}

type PlayerSelectFieldProps = {
  label: string;
  name: string;
  defaultValue: string;
  players: {
    id: string;
    name: string;
    country: string | null;
  }[];
  optional?: boolean;
};

function PlayerSelectField({
  label,
  name,
  defaultValue,
  players,
  optional = false,
}: PlayerSelectFieldProps) {
  return (
    <label className="block">
      <span className="text-[9px] font-black uppercase tracking-[0.16em] text-white/35">
        {label}
      </span>

      <select
        name={name}
        defaultValue={defaultValue}
        required={!optional}
        className="mt-2 h-12 w-full rounded-2xl border border-white/10 bg-[#08111F] px-4 text-sm text-white outline-none transition focus:border-lime-300/35"
      >
        {optional ? (
          <option value="">
            No AGE202 player link
          </option>
        ) : (
          <option value="" disabled>
            Select player
          </option>
        )}

        {players.map(
          (player) => (
            <option
              key={player.id}
              value={player.id}
            >
              {player.name}
              {player.country
                ? ` · ${player.country}`
                : ""}
            </option>
          ),
        )}
      </select>
    </label>
  );
}

type TextAreaFieldProps = {
  label: string;
  name: string;
  defaultValue: string;
  rows?: number;
  hint?: string;
  className?: string;
};

function TextAreaField({
  label,
  name,
  defaultValue,
  rows = 5,
  hint,
  className = "",
}: TextAreaFieldProps) {
  return (
    <label
      className={`block ${className}`}
    >
      <span className="text-[9px] font-black uppercase tracking-[0.16em] text-white/35">
        {label}
      </span>

      <textarea
        name={name}
        defaultValue={defaultValue}
        rows={rows}
        className="mt-2 w-full resize-y rounded-2xl border border-white/10 bg-[#08111F] px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-white/20 focus:border-lime-300/35"
      />

      {hint ? (
        <span className="mt-2 block text-xs leading-5 text-white/25">
          {hint}
        </span>
      ) : null}
    </label>
  );
}

type ToggleCardProps = {
  name: string;
  label: string;
  description: string;
  defaultChecked: boolean;
};

function ToggleCard({
  name,
  label,
  description,
  defaultChecked,
}: ToggleCardProps) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.025] px-4 py-4">
      <input
        type="checkbox"
        name={name}
        defaultChecked={
          defaultChecked
        }
        className="mt-1 size-4 accent-lime-300"
      />

      <span>
        <span className="block text-sm font-semibold text-white/75">
          {label}
        </span>

        <span className="mt-1 block text-xs leading-5 text-white/30">
          {description}
        </span>
      </span>
    </label>
  );
}

type QuickFactProps = {
  icon: React.ComponentType<{
    className?: string;
  }>;
  label: string;
  value: string;
};

function QuickFact({
  icon: Icon,
  label,
  value,
}: QuickFactProps) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.025] px-4 py-4">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-lime-300/10 text-lime-300">
        <Icon className="h-4 w-4" />
      </span>

      <div className="min-w-0">
        <p className="text-[8px] font-black uppercase tracking-[0.16em] text-white/25">
          {label}
        </p>

        <p className="mt-1 truncate text-sm font-semibold text-white/70">
          {value}
        </p>
      </div>
    </div>
  );
}