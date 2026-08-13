import {
  ChevronRight,
  History,
  Sparkles,
} from "lucide-react";

import type {
  GrandSlamSlug,
  GrandSlamTimelineEntry,
} from "@/lib/data/grand-slams";

import {
  getMuseumTournamentBySlug,
} from "@/lib/services/museum/tournament.service";

type GrandSlamTimelineSectionProps = {
  slug: GrandSlamSlug;
  cmsSlug?: string;
  fallbackEntries?: GrandSlamTimelineEntry[];
};

type TimelineDisplayEntry = {
  year: string;
  title: string;
  description: string;
  featured: boolean;
};

function buildCmsEntries(
  tournament: NonNullable<
    Awaited<
      ReturnType<
        typeof getMuseumTournamentBySlug
      >
    >
  >,
): TimelineDisplayEntry[] {
  return [...tournament.milestones]
    .sort(
      (a, b) => {
        if (
          a.featured !==
          b.featured
        ) {
          return a.featured
            ? -1
            : 1;
        }

        if (
          a.sortOrder !==
          b.sortOrder
        ) {
          return (
            a.sortOrder -
            b.sortOrder
          );
        }

        return (
          (a.year ?? 9999) -
          (b.year ?? 9999)
        );
      },
    )
    .map(
      (milestone) => ({
        year:
          milestone.year !== null
            ? String(
                milestone.year,
              )
            : "—",

        title:
          milestone.title,

        description:
          milestone.description ??
          milestone.subtitle ??
          "",

        featured:
          milestone.featured,
      }),
    );
}

function buildFallbackEntries(
  entries: GrandSlamTimelineEntry[],
): TimelineDisplayEntry[] {
  return entries.map(
    (entry) => ({
      year:
        entry.year,

      title:
        entry.title,

      description:
        entry.description,

      featured:
        false,
    }),
  );
}

export default async function GrandSlamTimelineSection({
  slug,
  cmsSlug,
  fallbackEntries = [],
}: GrandSlamTimelineSectionProps) {
  const tournament =
    await getMuseumTournamentBySlug(
      cmsSlug ?? slug,
    );

  const cmsEntries =
    tournament
      ? buildCmsEntries(
          tournament,
        )
      : [];

  const entries =
    cmsEntries.length > 0
      ? cmsEntries
      : buildFallbackEntries(
          fallbackEntries,
        );

  if (entries.length === 0) {
    return null;
  }

  const tournamentName =
    tournament?.shortName?.trim() ||
    tournament?.name?.trim() ||
    slug
      .replaceAll(
        "-",
        " ",
      )
      .replace(
        /\b\w/g,
        (letter) =>
          letter.toUpperCase(),
      );

  const featuredEntry =
    entries.find(
      (entry) =>
        entry.featured,
    );

  return (
    <section
      id="timeline"
      className="relative isolate scroll-mt-24 overflow-hidden border-t border-white/10 px-5 py-20 sm:px-8 lg:px-12 lg:py-28"
    >
      <div className="pointer-events-none absolute -right-52 top-20 h-[34rem] w-[34rem] rounded-full bg-[var(--tournament-glow)] opacity-25 blur-3xl" />

      <div className="pointer-events-none absolute -left-48 bottom-16 h-[28rem] w-[28rem] rounded-full bg-[var(--tournament-glow)] opacity-10 blur-3xl" />

      <div className="pointer-events-none absolute inset-0 opacity-[0.025] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:72px_72px]" />

      <div className="relative mx-auto max-w-[1440px]">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_470px] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-3">
              <span className="h-px w-10 bg-[var(--tournament-primary)]" />

              <p className="font-mono text-[9px] font-black uppercase tracking-[0.24em] text-[var(--tournament-primary)]">
                Historical timeline
              </p>
            </div>

            <h2 className="mt-6 max-w-5xl text-4xl font-black uppercase leading-[0.9] tracking-[-0.06em] sm:text-5xl lg:text-7xl">
              Defining milestones.
            </h2>
          </div>

          <p className="text-sm leading-7 text-white/43 lg:text-right">
            Key stages in the evolution of {tournamentName}, drawn from the
            live Tournament Studio whenever milestone data is available.
          </p>
        </div>

        {featuredEntry ? (
          <article className="relative mt-12 overflow-hidden rounded-[2.3rem] border border-white/10 bg-[linear-gradient(135deg,#081423_0%,#07101D_58%,#050B18_100%)] p-7 shadow-[0_28px_90px_rgba(0,0,0,0.22)] sm:p-9 lg:p-11">
            <div className="pointer-events-none absolute -right-8 -top-12 text-[10rem] font-black leading-none tracking-[-0.08em] text-white/[0.025] sm:text-[14rem]">
              {featuredEntry.year}
            </div>

            <div className="pointer-events-none absolute -bottom-28 -right-20 h-72 w-72 rounded-full bg-[var(--tournament-glow)] opacity-25 blur-3xl" />

            <div className="relative grid gap-8 lg:grid-cols-[180px_minmax(0,1fr)_52px] lg:items-center">
              <div>
                <span className="text-5xl font-black tracking-[-0.06em] text-[var(--tournament-primary)] sm:text-6xl">
                  {featuredEntry.year}
                </span>

                <p className="mt-3 font-mono text-[7px] font-black uppercase tracking-[0.18em] text-white/28">
                  Featured milestone
                </p>
              </div>

              <div>
                <h3 className="text-3xl font-black uppercase leading-[0.95] tracking-[-0.045em] sm:text-4xl">
                  {featuredEntry.title}
                </h3>

                {featuredEntry.description ? (
                  <p className="mt-5 max-w-3xl text-sm leading-7 text-white/46 sm:text-base">
                    {featuredEntry.description}
                  </p>
                ) : null}
              </div>

              <span className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-[var(--tournament-primary)]">
                <Sparkles
                  size={18}
                  strokeWidth={1.4}
                  aria-hidden="true"
                />
              </span>
            </div>
          </article>
        ) : null}

        <div
          className={`overflow-hidden rounded-[2rem] border border-white/10 bg-[#07101D] ${
            featuredEntry
              ? "mt-6"
              : "mt-12"
          }`}
        >
          {entries
            .filter(
              (entry) =>
                entry !==
                featuredEntry,
            )
            .map(
              (
                entry,
                index,
                list,
              ) => (
                <article
                  key={`${entry.year}-${entry.title}-${index}`}
                  className={`group grid gap-6 p-7 transition duration-300 hover:bg-white/[0.03] sm:grid-cols-[90px_130px_minmax(0,1fr)_48px] sm:items-center sm:p-8 ${
                    index ===
                    list.length - 1
                      ? ""
                      : "border-b border-white/10"
                  }`}
                >
                  <span className="font-mono text-[8px] font-black uppercase tracking-[0.18em] text-white/22">
                    {String(
                      index + 1,
                    ).padStart(
                      2,
                      "0",
                    )}
                  </span>

                  <span className="text-3xl font-black tracking-[-0.05em] text-[var(--tournament-primary)]">
                    {entry.year}
                  </span>

                  <div>
                    <h3 className="text-xl font-black uppercase tracking-[-0.03em]">
                      {entry.title}
                    </h3>

                    {entry.description ? (
                      <p className="mt-3 text-sm leading-7 text-white/40">
                        {entry.description}
                      </p>
                    ) : null}
                  </div>

                  <span className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.025] text-white/24 transition group-hover:border-[var(--tournament-primary)] group-hover:text-[var(--tournament-primary)]">
                    <ChevronRight
                      size={15}
                      aria-hidden="true"
                    />
                  </span>
                </article>
              ),
            )}
        </div>

        <div className="mt-6 flex flex-col gap-4 rounded-[1.6rem] border border-white/10 bg-white/[0.02] p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-[var(--tournament-primary)]">
              <History
                size={16}
                strokeWidth={1.4}
                aria-hidden="true"
              />
            </span>

            <div>
              <h3 className="text-sm font-black uppercase tracking-[-0.015em]">
                Timeline source
              </h3>

              <p className="mt-2 text-xs leading-6 text-white/34">
                {cmsEntries.length > 0
                  ? "Milestones are currently coming from Tournament Studio."
                  : "Static Grand Slam milestones are being used as a safe fallback."}
              </p>
            </div>
          </div>

          <span className="shrink-0 rounded-full border border-white/10 bg-white/[0.025] px-4 py-2 font-mono text-[7px] font-black uppercase tracking-[0.17em] text-white/30">
            {cmsEntries.length > 0
              ? "Tournament Studio"
              : "Fallback active"}
          </span>
        </div>
      </div>
    </section>
  );
}