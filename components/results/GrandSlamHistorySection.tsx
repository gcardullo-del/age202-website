import {
  BookOpen,
  History,
  Landmark,
  Sparkles,
} from "lucide-react";

import type {
  GrandSlamSlug,
} from "@/lib/data/grand-slams";

import {
  getMuseumTournamentBySlug,
} from "@/lib/services/museum/tournament.service";

type GrandSlamHistorySectionProps = {
  slug: GrandSlamSlug;
  cmsSlug?: string;
  fallbackHistory?: string[];
  fallbackFounded?: string;
};

function splitHistory(
  history: string | null,
): string[] {
  if (!history) {
    return [];
  }

  return history
    .split(/\n\s*\n/)
    .map(
      (paragraph) =>
        paragraph.trim(),
    )
    .filter(Boolean);
}

export default async function GrandSlamHistorySection({
  slug,
  cmsSlug,
  fallbackHistory = [],
  fallbackFounded = "—",
}: GrandSlamHistorySectionProps) {
  const tournament =
    await getMuseumTournamentBySlug(
      cmsSlug ?? slug,
    );

  const cmsHistory =
    tournament
      ? splitHistory(
          tournament.history,
        )
      : [];

  const paragraphs =
    cmsHistory.length > 0
      ? cmsHistory
      : fallbackHistory;

  if (paragraphs.length === 0) {
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

  const founded =
    tournament?.foundedYear !== null &&
    tournament?.foundedYear !== undefined
      ? String(
          tournament.foundedYear,
        )
      : fallbackFounded;

  const isCmsLive =
    cmsHistory.length > 0;

  const leadParagraph =
    paragraphs[0];

  const remainingParagraphs =
    paragraphs.slice(1);

  return (
    <section
      id="history"
      className="relative isolate scroll-mt-24 overflow-hidden border-t border-white/10 px-5 py-20 sm:px-8 lg:px-12 lg:py-28"
    >
      <div className="pointer-events-none absolute -left-52 top-20 h-[36rem] w-[36rem] rounded-full bg-[var(--tournament-glow)] opacity-25 blur-3xl" />

      <div className="pointer-events-none absolute -right-48 bottom-20 h-[30rem] w-[30rem] rounded-full bg-[var(--tournament-glow)] opacity-10 blur-3xl" />

      <div className="pointer-events-none absolute inset-0 opacity-[0.025] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:72px_72px]" />

      <div className="relative mx-auto max-w-[1440px]">
        <div className="grid gap-12 xl:grid-cols-[390px_minmax(0,1fr)]">
          <aside className="xl:sticky xl:top-28 xl:self-start">
            <div className="inline-flex items-center gap-3">
              <span className="h-px w-10 bg-[var(--tournament-primary)]" />

              <p className="font-mono text-[9px] font-black uppercase tracking-[0.24em] text-[var(--tournament-primary)]">
                Tournament history
              </p>
            </div>

            <h2 className="mt-6 text-4xl font-black uppercase leading-[0.9] tracking-[-0.06em] sm:text-5xl">
              From {founded} to the modern era.
            </h2>

            <p className="mt-6 text-sm leading-7 text-white/43">
              The evolution of {tournamentName}, its setting and its place
              within Grand Slam history.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.025] px-4 py-2.5">
                <Landmark
                  size={12}
                  className="text-[var(--tournament-primary)]"
                  aria-hidden="true"
                />

                <span className="font-mono text-[7px] font-black uppercase tracking-[0.17em] text-[var(--tournament-primary)]">
                  Founded {founded}
                </span>
              </span>

              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.025] px-4 py-2.5">
                <Sparkles
                  size={11}
                  className="text-[var(--tournament-primary)]"
                  aria-hidden="true"
                />

                <span className="font-mono text-[7px] font-black uppercase tracking-[0.17em] text-white/30">
                  {isCmsLive
                    ? "Tournament Studio"
                    : "Fallback active"}
                </span>
              </span>
            </div>
          </aside>

          <div className="space-y-6">
            <article className="relative min-h-[390px] overflow-hidden rounded-[2.3rem] border border-white/10 bg-[linear-gradient(135deg,#081423_0%,#07101D_58%,#050B18_100%)] p-7 shadow-[0_28px_90px_rgba(0,0,0,0.22)] sm:p-9 lg:p-11">
              <div className="pointer-events-none absolute -right-8 -top-12 select-none text-[11rem] font-black leading-none tracking-[-0.08em] text-white/[0.025] sm:text-[14rem]">
                01
              </div>

              <div className="pointer-events-none absolute -bottom-28 -right-24 h-72 w-72 rounded-full bg-[var(--tournament-glow)] opacity-25 blur-3xl" />

              <div className="relative flex min-h-[300px] flex-col justify-between">
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className="font-mono text-[8px] font-black uppercase tracking-[0.2em] text-[var(--tournament-primary)]">
                      Historical profile
                    </p>

                    <h3 className="mt-4 text-3xl font-black uppercase tracking-[-0.045em] sm:text-4xl">
                      The story of {tournamentName}
                    </h3>
                  </div>

                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-[var(--tournament-primary)]">
                    <History
                      size={19}
                      strokeWidth={1.4}
                      aria-hidden="true"
                    />
                  </span>
                </div>

                <p className="mt-10 max-w-4xl text-base leading-8 text-white/54 sm:text-lg sm:leading-9">
                  {leadParagraph}
                </p>
              </div>
            </article>

            {remainingParagraphs.length > 0 ? (
              <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#07101D]">
                {remainingParagraphs.map(
                  (
                    paragraph,
                    index,
                  ) => (
                    <article
                      key={`${index}-${paragraph.slice(
                        0,
                        48,
                      )}`}
                      className={`group grid gap-6 p-7 transition duration-300 hover:bg-white/[0.03] sm:grid-cols-[80px_minmax(0,1fr)_44px] sm:items-start sm:p-9 ${
                        index ===
                        remainingParagraphs.length - 1
                          ? ""
                          : "border-b border-white/10"
                      }`}
                    >
                      <span className="text-4xl font-black tracking-[-0.06em] text-white/[0.1]">
                        {String(
                          index + 2,
                        ).padStart(
                          2,
                          "0",
                        )}
                      </span>

                      <p className="text-sm leading-8 text-white/46 sm:text-base">
                        {paragraph}
                      </p>

                      <span className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.025] text-white/20 transition group-hover:border-[var(--tournament-primary)] group-hover:text-[var(--tournament-primary)]">
                        <BookOpen
                          size={15}
                          strokeWidth={1.4}
                          aria-hidden="true"
                        />
                      </span>
                    </article>
                  ),
                )}
              </div>
            ) : null}

            <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.02] p-6">
              <p className="font-mono text-[7px] font-black uppercase tracking-[0.17em] text-white/28">
                {isCmsLive
                  ? "Historical copy is currently sourced from Tournament Studio."
                  : "Static Grand Slam history is being used as a safe fallback until CMS copy is available."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}