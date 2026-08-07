import Link from "next/link";

import {
  ArrowDown,
  BookOpen,
  CircleDot,
  Quote,
  Sparkles,
} from "lucide-react";

import type {
  Champion,
} from "@/data/champions";

type ChampionStoryProps = {
  champion: Champion;
};

export default function ChampionStory({
  champion,
}: ChampionStoryProps) {
  const openingEvent =
    champion.careerTimeline[0] ??
    null;

  const definingEvent =
    champion.careerTimeline.find(
      (event) =>
        event.year ===
        Math.min(
          ...champion.careerTimeline.map(
            (item) => item.year,
          ),
        ),
    ) ?? openingEvent;

  const finalEvent =
    champion.careerTimeline.at(-1) ??
    null;

  return (
    <section
      id="champion-story"
      className="relative scroll-mt-20 overflow-hidden border-b border-white/[0.07] bg-[#060d1a] px-6 py-24 sm:px-8 sm:py-28 lg:px-12 lg:py-36"
    >
      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_16%,rgba(200,255,0,0.07),transparent_28%),radial-gradient(circle_at_82%_74%,rgba(255,255,255,0.035),transparent_30%)]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.022] [background-image:linear-gradient(rgba(255,255,255,.45)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.45)_1px,transparent_1px)] [background-size:72px_72px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-44 top-20 h-[420px] w-[420px] rounded-full opacity-[0.08] blur-[150px]"
        style={{
          backgroundColor:
            champion.accent,
        }}
      />

      <div className="relative mx-auto max-w-[1440px]">
        {/* =====================================================
            SECTION HEADER
        ====================================================== */}

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end">
          <div>
            <div className="flex items-center gap-4">
              <span
                aria-hidden="true"
                className="h-px w-12"
                style={{
                  backgroundColor:
                    champion.accent,
                  boxShadow:
                    `0 0 14px ${champion.accent}`,
                }}
              />

              <p
                className="text-[10px] font-black uppercase tracking-[0.32em]"
                style={{
                  color:
                    champion.accent,
                }}
              >
                Chapter I · Origin
              </p>
            </div>

            <h2 className="mt-7 max-w-5xl text-5xl font-black leading-[0.9] tracking-[-0.055em] text-white sm:text-6xl lg:text-8xl">
              The story behind

              <span className="block text-white/25">
                the legend.
              </span>
            </h2>
          </div>

          <div className="lg:pb-2 lg:text-right">
            <p className="font-mono text-[8px] uppercase leading-6 tracking-[0.22em] text-white/25">
              AGE202 narrative archive
              <br />
              Curated player biography
            </p>
          </div>
        </div>

        {/* =====================================================
            MAIN STORY
        ====================================================== */}

        <div className="mt-16 grid gap-10 lg:mt-20 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-16 xl:grid-cols-[360px_minmax(0,1fr)] xl:gap-20">
          <aside className="h-fit min-w-0 rounded-[2rem] border border-white/10 bg-white/[0.025] p-6 sm:p-8 lg:sticky lg:top-28">
            <span
              className="grid h-14 w-14 place-items-center rounded-2xl border"
              style={{
                borderColor:
                  `${champion.accent}40`,
                backgroundColor:
                  `${champion.accent}10`,
                color:
                  champion.accent,
              }}
            >
              <BookOpen
                className="h-6 w-6"
                aria-hidden="true"
              />
            </span>

            <p className="mt-7 font-mono text-[8px] font-black uppercase tracking-[0.23em] text-white/25">
              Museum portrait
            </p>

            <h3 className="mt-4 break-words text-3xl font-black leading-tight tracking-[-0.035em] text-white">
              {champion.name}
            </h3>

            <p
              className="mt-2 break-words text-[10px] font-black uppercase leading-5 tracking-[0.24em]"
              style={{
                color:
                  champion.accent,
              }}
            >
              {champion.nickname}
            </p>

            <div className="mt-8 space-y-5 border-t border-white/10 pt-7">
              <StoryFact
                label="Nationality"
                value={
                  champion.nationality
                }
              />

              <StoryFact
                label="Professional debut"
                value={String(
                  champion.debutYear,
                )}
              />

              <StoryFact
                label="Primary brand"
                value={
                  champion.mainBrand
                }
              />

              <StoryFact
                label="Archive pieces"
                value={String(
                  champion.archivePieces,
                )}
              />
            </div>
          </aside>

          <article className="min-w-0">
            <div className="rounded-[2rem] border border-white/10 bg-[#09111f] p-7 sm:p-10 lg:p-12">
              <div className="flex min-w-0 items-center gap-3">
                <Quote
                  className="h-5 w-5 shrink-0"
                  style={{
                    color:
                      champion.accent,
                  }}
                  aria-hidden="true"
                />

                <p className="min-w-0 break-words font-mono text-[8px] font-black uppercase leading-5 tracking-[0.24em] text-white/25">
                  Curatorial introduction
                </p>
              </div>

              <p className="mt-7 max-w-4xl break-words text-2xl font-medium leading-[1.55] tracking-[-0.025em] text-white/88 sm:text-3xl">
                {champion.description}
              </p>

              <div
                className="mt-10 border-l pl-6"
                style={{
                  borderColor:
                    champion.accent,
                }}
              >
                <p className="max-w-3xl break-words text-lg italic leading-9 text-white/58">
                  {champion.quote}
                </p>
              </div>
            </div>

            {/* =================================================
                STORY CHAPTER CARDS
            ================================================= */}

            <div className="mt-8 grid items-stretch gap-5 md:grid-cols-2 xl:grid-cols-3">
              <StoryChapterCard
                accent={
                  champion.accent
                }
                eyebrow="The beginning"
                title={
                  definingEvent?.title ??
                  "Professional debut"
                }
                description={
                  definingEvent?.description ??
                  `${champion.name} began a career that would reshape modern tennis.`
                }
                year={
                  definingEvent?.year ??
                  champion.debutYear
                }
              />

              <StoryChapterCard
                accent={
                  champion.accent
                }
                eyebrow="The champion"
                title={`${champion.trophies.grandSlams} Grand Slams`}
                description={`${champion.trophies.atpTitles} ATP titles and ${champion.trophies.weeksAtNo1} weeks at world No. 1 define one of the most significant careers in tennis history.`}
              />

              <StoryChapterCard
                accent={
                  champion.accent
                }
                eyebrow="The legacy"
                title={
                  finalEvent?.title ??
                  "Permanent legacy"
                }
                description={
                  finalEvent?.description ??
                  champion.legacy
                }
                year={
                  finalEvent?.year
                }
              />
            </div>

            <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.02] p-7 sm:p-9">
              <div className="flex min-w-0 items-start gap-4">
                <span
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border"
                  style={{
                    borderColor:
                      `${champion.accent}35`,
                    backgroundColor:
                      `${champion.accent}0d`,
                    color:
                      champion.accent,
                  }}
                >
                  <Sparkles
                    className="h-5 w-5"
                    aria-hidden="true"
                  />
                </span>

                <div className="min-w-0">
                  <p className="break-words font-mono text-[8px] font-black uppercase leading-5 tracking-[0.24em] text-white/25">
                    AGE202 museum note
                  </p>

                  <h3 className="mt-3 break-words text-2xl font-black leading-tight tracking-[-0.03em] text-white">
                    Why this story matters
                  </h3>
                </div>
              </div>

              <p className="mt-7 max-w-5xl break-words text-lg leading-9 text-white/58">
                {champion.legacy}
              </p>
            </div>

            <div className="mt-10 flex flex-col gap-5 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
              <p className="min-w-0 max-w-xl break-words text-sm leading-7 text-white/35">
                Continue through the defining
                moments that transformed{" "}
                {champion.firstName} from
                professional debutant into a
                permanent figure in tennis
                history.
              </p>

              <Link
                href="#career-timeline"
                className="group inline-flex min-h-12 w-fit shrink-0 items-center justify-center gap-3 rounded-full border px-6 py-3 text-center text-[9px] font-black uppercase leading-5 tracking-[0.19em] transition hover:-translate-y-0.5"
                style={{
                  borderColor:
                    `${champion.accent}45`,
                  backgroundColor:
                    `${champion.accent}0d`,
                  color:
                    champion.accent,
                }}
              >
                Continue to the timeline

                <ArrowDown
                  className="h-4 w-4 shrink-0 transition-transform group-hover:translate-y-1"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   STORY FACT
========================================================= */

type StoryFactProps = {
  label: string;
  value: string;
};

function StoryFact({
  label,
  value,
}: StoryFactProps) {
  return (
    <div className="min-w-0">
      <p className="break-words font-mono text-[8px] uppercase leading-5 tracking-[0.22em] text-white/25">
        {label}
      </p>

      <p className="mt-2 break-words text-sm font-black uppercase leading-6 tracking-[0.08em] text-white/75">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   STORY CHAPTER CARD
========================================================= */

type StoryChapterCardProps = {
  accent: string;
  eyebrow: string;
  title: string;
  description: string;
  year?: number;
};

function StoryChapterCard({
  accent,
  eyebrow,
  title,
  description,
  year,
}: StoryChapterCardProps) {
  return (
    <section className="relative flex min-h-[215px] min-w-0 flex-col rounded-[1.7rem] border border-white/10 bg-[#09111f] px-6 py-7 sm:min-h-[230px] sm:px-7 sm:py-8">
      {/* Glow */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-[1.7rem]"
      >
        <div
          className="absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-[0.08] blur-[45px]"
          style={{
            backgroundColor: accent,
          }}
        />
      </div>

      <div className="relative flex h-full flex-col">
        {/* Header */}

        <div className="flex items-center justify-between">
          <p
            className="font-mono text-[9px] font-black uppercase tracking-[0.18em]"
            style={{
              color: accent,
              lineHeight: "1.8",
            }}
          >
            {eyebrow}
          </p>

          {year ? (
            <span
              className="font-mono text-[9px] font-black text-white/20"
              style={{
                lineHeight: "1.8",
              }}
            >
              {year}
            </span>
          ) : (
            <CircleDot
              className="h-4 w-4 text-white/15"
            />
          )}
        </div>

        <h3 className="mt-4 min-w-0 break-words text-xl font-black leading-[1.25] tracking-[-0.025em] text-white">
          {title}
        </h3>

        <p className="mt-4 min-w-0 break-words whitespace-normal text-sm leading-7 text-white/48">
          {description}
        </p>

        <span
          aria-hidden="true"
          className="mt-auto block h-px w-10 pt-6"
          style={{
            borderBottom:
              `1px solid ${accent}`,
          }}
        />
      </div>
    </section>
  );
}