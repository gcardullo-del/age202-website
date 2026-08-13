import {
  BookOpen,
  Crown,
  Quote,
  Sparkles,
} from "lucide-react";

import type {
  GrandSlamSlug,
} from "@/lib/data/grand-slams";

import {
  getMuseumTournamentBySlug,
} from "@/lib/services/museum/tournament.service";

type GrandSlamEditorialChaptersSectionProps = {
  slug: GrandSlamSlug;
  cmsSlug?: string;
};

function safeBackgroundImage(
  imageUrl: string,
): string {
  const safeUrl =
    imageUrl.replaceAll('"', '\\"');

  return `linear-gradient(180deg, rgba(2,6,17,0.08) 0%, rgba(2,6,17,0.24) 42%, rgba(2,6,17,0.96) 100%), url("${safeUrl}")`;
}

export default async function GrandSlamEditorialChaptersSection({
  slug,
  cmsSlug,
}: GrandSlamEditorialChaptersSectionProps) {
  const tournament =
    await getMuseumTournamentBySlug(
      cmsSlug ?? slug,
    );

  if (
    !tournament ||
    tournament.chapters.length === 0
  ) {
    return null;
  }

  const tournamentName =
    tournament.shortName?.trim() ||
    tournament.name;

  const chapters =
    [...tournament.chapters].sort(
      (a, b) => {
        if (
          a.featured !==
          b.featured
        ) {
          return a.featured
            ? -1
            : 1;
        }

        return (
          a.sortOrder -
          b.sortOrder
        );
      },
    );

  const featuredChapter =
    chapters.find(
      (chapter) =>
        chapter.featured,
    ) ??
    chapters[0];

  const secondaryChapters =
    chapters.filter(
      (chapter) =>
        chapter.id !==
        featuredChapter.id,
    );

  return (
    <section
      id="chapters"
      className="relative scroll-mt-16 overflow-hidden border-t border-white/10 px-5 py-20 sm:px-8 lg:px-12 lg:py-28"
    >
      <div className="pointer-events-none absolute -right-52 top-24 h-[36rem] w-[36rem] rounded-full bg-[var(--tournament-glow)] opacity-25 blur-3xl" />

      <div className="pointer-events-none absolute left-0 top-0 font-mono text-[12rem] font-black leading-none tracking-[-0.08em] text-white/[0.012] sm:text-[18rem] lg:text-[26rem]">
        STORY
      </div>

      <div className="relative mx-auto w-full max-w-[1440px]">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_430px] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-3">
              <span className="h-px w-10 bg-[var(--tournament-primary)]" />

              <p className="font-mono text-[9px] font-black uppercase tracking-[0.24em] text-[var(--tournament-primary)]">
                Editorial archive
              </p>
            </div>

            <h2 className="mt-6 max-w-5xl text-4xl font-black uppercase leading-[0.88] tracking-[-0.06em] sm:text-5xl lg:text-7xl">
              Chapters that shaped{" "}
              {tournamentName}.
            </h2>
          </div>

          <p className="text-sm leading-7 text-white/42 lg:text-right">
            The defining eras, turning
            points and stories behind one
            of tennis&apos; greatest
            championships.
          </p>
        </div>

        <div className="mt-12">
          <article
            className={`group relative overflow-hidden rounded-[2.4rem] border border-white/10 bg-[#07101D] ${
              featuredChapter.imageUrl
                ? "min-h-[660px]"
                : ""
            }`}
          >
            {featuredChapter.imageUrl ? (
              <>
                <div
                  className="absolute inset-0 bg-cover bg-center transition duration-1000 group-hover:scale-[1.02]"
                  style={{
                    backgroundImage:
                      safeBackgroundImage(
                        featuredChapter.imageUrl,
                      ),
                  }}
                  role="img"
                  aria-label={
                    featuredChapter.title
                  }
                />

                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,17,0.94)_0%,rgba(2,6,17,0.62)_46%,rgba(2,6,17,0.18)_100%)]" />
              </>
            ) : (
              <>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_28%,var(--tournament-glow),transparent_35%)] opacity-30" />

                <div className="pointer-events-none absolute -right-8 bottom-[-4rem] font-mono text-[18rem] font-black leading-none tracking-[-0.1em] text-white/[0.025] sm:text-[24rem]">
                  01
                </div>
              </>
            )}

            <div
              className={`relative flex flex-col justify-between p-7 sm:p-10 lg:p-14 ${
                featuredChapter.imageUrl
                  ? "min-h-[660px]"
                  : "min-h-[480px]"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-5">
                <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-[#050B18]/60 px-4 py-2 backdrop-blur-xl">
                  <Crown
                    size={13}
                    strokeWidth={1.5}
                    className="text-[var(--tournament-primary)]"
                    aria-hidden="true"
                  />

                  <span className="font-mono text-[7px] font-black uppercase tracking-[0.2em] text-white/65">
                    Featured chapter
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {featuredChapter.yearLabel ? (
                    <span className="rounded-full border border-white/10 bg-[#050B18]/60 px-4 py-2 font-mono text-[8px] font-black uppercase tracking-[0.18em] text-[var(--tournament-primary)] backdrop-blur-xl">
                      {
                        featuredChapter.yearLabel
                      }
                    </span>
                  ) : null}

                  <span className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-[#050B18]/60 text-[var(--tournament-primary)] backdrop-blur-xl">
                    <BookOpen
                      size={19}
                      strokeWidth={1.4}
                      aria-hidden="true"
                    />
                  </span>
                </div>
              </div>

              <div className="max-w-4xl">
                {featuredChapter.eyebrow ? (
                  <p className="font-mono text-[8px] font-black uppercase tracking-[0.22em] text-[var(--tournament-primary)]">
                    {
                      featuredChapter.eyebrow
                    }
                  </p>
                ) : null}

                <h3 className="mt-5 text-4xl font-black uppercase leading-[0.88] tracking-[-0.06em] sm:text-6xl lg:text-7xl">
                  {
                    featuredChapter.title
                  }
                </h3>

                {featuredChapter.subtitle ? (
                  <p className="mt-5 max-w-3xl text-lg font-semibold leading-7 text-white/72 sm:text-xl">
                    {
                      featuredChapter.subtitle
                    }
                  </p>
                ) : null}

                {featuredChapter.description ? (
                  <p className="mt-6 max-w-3xl text-sm leading-7 text-white/52 sm:text-base sm:leading-8">
                    {
                      featuredChapter.description
                    }
                  </p>
                ) : null}
              </div>
            </div>
          </article>
        </div>

        {secondaryChapters.length > 0 ? (
          <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {secondaryChapters.map(
              (
                chapter,
                index,
              ) => (
                <article
                  key={chapter.id}
                  className={`group relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#07101D] ${
                    chapter.imageUrl
                      ? "min-h-[420px]"
                      : "min-h-[360px]"
                  }`}
                >
                  {chapter.imageUrl ? (
                    <>
                      <div
                        className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-[1.035]"
                        style={{
                          backgroundImage:
                            safeBackgroundImage(
                              chapter.imageUrl,
                            ),
                        }}
                        role="img"
                        aria-label={
                          chapter.title
                        }
                      />

                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,17,0.12)_0%,rgba(2,6,17,0.42)_42%,rgba(2,6,17,0.98)_100%)]" />
                    </>
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_18%,var(--tournament-glow),transparent_38%)] opacity-20" />

                      <div className="pointer-events-none absolute -right-5 top-5 font-mono text-[8rem] font-black leading-none tracking-[-0.08em] text-white/[0.025]">
                        {String(
                          index + 2,
                        ).padStart(
                          2,
                          "0",
                        )}
                      </div>
                    </>
                  )}

                  <div className="relative flex min-h-[inherit] h-full flex-col justify-between p-7">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-mono text-[7px] font-black uppercase tracking-[0.2em] text-white/32">
                          Chapter{" "}
                          {String(
                            index + 2,
                          ).padStart(
                            2,
                            "0",
                          )}
                        </p>

                        {chapter.yearLabel ? (
                          <p className="mt-2 font-mono text-[8px] font-black uppercase tracking-[0.18em] text-[var(--tournament-primary)]">
                            {
                              chapter.yearLabel
                            }
                          </p>
                        ) : null}
                      </div>

                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-[#050B18]/50 text-[var(--tournament-primary)] backdrop-blur-lg">
                        <BookOpen
                          size={15}
                          strokeWidth={1.4}
                          aria-hidden="true"
                        />
                      </span>
                    </div>

                    <div className="mt-24">
                      {chapter.eyebrow ? (
                        <p className="font-mono text-[7px] font-black uppercase tracking-[0.18em] text-[var(--tournament-primary)]">
                          {
                            chapter.eyebrow
                          }
                        </p>
                      ) : null}

                      <h3 className="mt-3 text-3xl font-black uppercase leading-[0.92] tracking-[-0.05em]">
                        {
                          chapter.title
                        }
                      </h3>

                      {chapter.subtitle ? (
                        <p className="mt-4 text-sm font-semibold leading-6 text-white/68">
                          {
                            chapter.subtitle
                          }
                        </p>
                      ) : null}

                      {chapter.description ? (
                        <p className="mt-4 text-xs leading-6 text-white/42">
                          {
                            chapter.description
                          }
                        </p>
                      ) : null}
                    </div>
                  </div>
                </article>
              ),
            )}
          </div>
        ) : null}

        <div className="mt-8 flex items-center gap-4 border-t border-white/8 pt-6">
          <Quote
            size={15}
            strokeWidth={1.4}
            className="shrink-0 text-[var(--tournament-primary)]"
            aria-hidden="true"
          />

          <p className="font-mono text-[7px] font-black uppercase tracking-[0.18em] text-white/28">
            The editorial history of{" "}
            {tournamentName} is preserved
            and curated through the
            AGE202 Tournament Studio.
          </p>

          <Sparkles
            size={13}
            strokeWidth={1.4}
            className="ml-auto shrink-0 text-[var(--tournament-primary)]"
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
}