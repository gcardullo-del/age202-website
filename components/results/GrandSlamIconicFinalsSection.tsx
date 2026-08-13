import {
  ArrowUpRight,
  Crown,
  Medal,
  Sparkles,
  Trophy,
} from "lucide-react";

import Link from "next/link";

import {
  getGrandSlamEditions,
} from "@/lib/data/grand-slam-editions";

import type {
  GrandSlamSlug,
} from "@/lib/data/grand-slams";

import {
  getMuseumTournamentBySlug,
} from "@/lib/services/museum/tournament.service";

type GrandSlamIconicFinalsSectionProps = {
  slug: GrandSlamSlug;
  cmsSlug?: string;
};

type IconicFinalDisplay = {
  year: number;
  champion: string;
  runnerUp?: string;
  score?: string;
  summary?: string;
  championSlug?: string;
};

export default async function GrandSlamIconicFinalsSection({
  slug,
  cmsSlug,
}: GrandSlamIconicFinalsSectionProps) {
  const fallback =
    getGrandSlamEditions(
      slug,
    );

  const tournament =
    await getMuseumTournamentBySlug(
      cmsSlug ?? slug,
    );

  const curatedYears =
    fallback?.editions
      .filter(
        (edition) =>
          Boolean(
            edition.summary,
          ),
      )
      .map(
        (edition) =>
          edition.year,
      ) ?? [];

  const cmsByYear =
    new Map(
      tournament?.editions.map(
        (edition) => [
          edition.year,
          edition,
        ],
      ) ?? [],
    );

  const fallbackByYear =
    new Map(
      fallback?.editions.map(
        (edition) => [
          edition.year,
          edition,
        ],
      ) ?? [],
    );

  const finals: IconicFinalDisplay[] = [];

  for (const year of curatedYears) {
    const cmsEdition =
      cmsByYear.get(
        year,
      );

    const fallbackEdition =
      fallbackByYear.get(
        year,
      );

    if (
      !cmsEdition &&
      !fallbackEdition
    ) {
      continue;
    }

    const champion =
      cmsEdition
        ? cmsEdition.championPlayer?.name ||
          cmsEdition.championName
        : fallbackEdition?.champion;

    if (!champion) {
      continue;
    }

    finals.push({
      year,

      champion,

      runnerUp:
        cmsEdition
          ? cmsEdition.runnerUpPlayer?.name ||
            cmsEdition.runnerUpName ||
            undefined
          : fallbackEdition?.runnerUp,

      score:
        cmsEdition
          ? cmsEdition.score ??
            undefined
          : fallbackEdition?.finalScore,

      summary:
        fallbackEdition?.summary,

      championSlug:
        cmsEdition
          ? cmsEdition.championPlayer?.slug ??
            undefined
          : fallbackEdition?.playerSlug,
    });
  }

  if (finals.length === 0) {
    return null;
  }

  const tournamentName =
    tournament?.shortName?.trim() ||
    tournament?.name?.trim() ||
    fallback?.tournamentName ||
    slug;

  const featuredFinal =
    finals[0];

  const secondaryFinals =
    finals.slice(
      1,
      5,
    );

  return (
    <section
      id="iconic-finals"
      className="relative isolate scroll-mt-16 overflow-hidden border-t border-white/10 px-5 py-20 sm:px-8 lg:px-12 lg:py-28"
    >
      <div className="pointer-events-none absolute -left-52 top-20 h-[36rem] w-[36rem] rounded-full bg-[var(--tournament-glow)] opacity-25 blur-3xl" />
      <div className="pointer-events-none absolute -right-44 bottom-20 h-[30rem] w-[30rem] rounded-full bg-[var(--tournament-glow)] opacity-15 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.025] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:72px_72px]" />

      <div className="relative mx-auto max-w-[1440px]">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_470px] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-3">
              <span className="h-px w-10 bg-[var(--tournament-primary)]" />

              <p className="font-mono text-[9px] font-black uppercase tracking-[0.24em] text-[var(--tournament-primary)]">
                Iconic finals
              </p>
            </div>

            <h2 className="mt-6 max-w-5xl text-4xl font-black uppercase leading-[0.88] tracking-[-0.06em] sm:text-5xl lg:text-7xl">
              Finals that defined {tournamentName}.
            </h2>
          </div>

          <p className="text-sm leading-7 text-white/43 lg:text-right">
            Selected championship matches preserved as part of the AGE202 Grand
            Slam archive, with live edition data used whenever available.
          </p>
        </div>

        <article className="relative mt-12 min-h-[500px] overflow-hidden rounded-[2.4rem] border border-white/10 bg-[linear-gradient(135deg,#081423_0%,#07101D_58%,#050B18_100%)] p-7 shadow-[0_28px_90px_rgba(0,0,0,0.28)] sm:p-10 lg:p-12">
          <div className="pointer-events-none absolute -right-8 -top-16 select-none text-[13rem] font-black leading-none tracking-[-0.09em] text-white/[0.025] sm:text-[17rem]">
            {featuredFinal.year}
          </div>

          <div className="pointer-events-none absolute -bottom-28 -right-24 h-[28rem] w-[28rem] rounded-full bg-[var(--tournament-glow)] opacity-30 blur-3xl" />

          <div className="relative grid gap-10 lg:min-h-[400px] lg:grid-cols-[minmax(0,1fr)_390px] lg:items-stretch">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--tournament-primary)]/30 bg-[var(--tournament-primary)]/10 px-4 py-2 font-mono text-[7px] font-black uppercase tracking-[0.17em] text-[var(--tournament-primary)]">
                <Sparkles
                  size={12}
                  aria-hidden="true"
                />
                Legendary final
              </span>

              <p className="mt-8 text-6xl font-black tracking-[-0.065em] text-[var(--tournament-primary)] sm:text-7xl">
                {featuredFinal.year}
              </p>

              <div className="mt-8 flex items-start gap-5">
                <span className="grid h-13 w-13 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.035] p-3 text-[var(--tournament-primary)]">
                  <Crown
                    size={23}
                    strokeWidth={1.4}
                    aria-hidden="true"
                  />
                </span>

                <div>
                  <p className="font-mono text-[8px] font-black uppercase tracking-[0.18em] text-white/28">
                    Champion
                  </p>

                  {featuredFinal.championSlug ? (
                    <Link
                      href={`/players/${featuredFinal.championSlug}`}
                      className="mt-3 inline-flex items-center gap-2 text-3xl font-black uppercase leading-none tracking-[-0.045em] text-white transition hover:text-[var(--tournament-primary)] sm:text-4xl"
                    >
                      {featuredFinal.champion}
                      <ArrowUpRight
                        size={17}
                        aria-hidden="true"
                      />
                    </Link>
                  ) : (
                    <h3 className="mt-3 text-3xl font-black uppercase leading-none tracking-[-0.045em] text-white sm:text-4xl">
                      {featuredFinal.champion}
                    </h3>
                  )}
                </div>
              </div>

              {featuredFinal.summary ? (
                <p className="mt-8 max-w-3xl text-sm leading-7 text-white/44 sm:text-base">
                  {featuredFinal.summary}
                </p>
              ) : null}
            </div>

            <div className="self-end overflow-hidden rounded-[1.7rem] border border-white/10 bg-black/15 lg:w-full">
              <FinalDetail
                icon={Medal}
                label="Runner-up"
                value={
                  featuredFinal.runnerUp
                }
              />

              <FinalDetail
                icon={Trophy}
                label="Final score"
                value={
                  featuredFinal.score
                }
              />
            </div>
          </div>
        </article>

        {secondaryFinals.length > 0 ? (
          <div className="mt-8">
            <div className="mb-5 flex items-center justify-between gap-5">
              <p className="font-mono text-[8px] font-black uppercase tracking-[0.2em] text-[var(--tournament-primary)]">
                Defining finals
              </p>

              <span className="font-mono text-[7px] uppercase tracking-[0.16em] text-white/24">
                Curated archive · Top 5
              </span>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {secondaryFinals.map(
              (
                final,
                index,
              ) => (
                <article
                  key={final.year}
                  className="group relative min-h-[330px] overflow-hidden rounded-[1.85rem] border border-white/10 bg-[#07101D] p-7 transition duration-300 hover:-translate-y-1 hover:border-[var(--tournament-primary)] hover:bg-[#091523]"
                >
                  <div className="pointer-events-none absolute -right-5 -top-8 text-[7rem] font-black leading-none tracking-[-0.08em] text-white/[0.025]">
                    {String(
                      index + 2,
                    ).padStart(
                      2,
                      "0",
                    )}
                  </div>

                  <div className="relative flex h-full flex-col">
                    <p className="text-4xl font-black tracking-[-0.055em] text-[var(--tournament-primary)]">
                      {final.year}
                    </p>

                    <p className="mt-7 font-mono text-[7px] font-black uppercase tracking-[0.17em] text-white/28">
                      Champion
                    </p>

                    <h3 className="mt-3 text-2xl font-black uppercase leading-[0.95] tracking-[-0.04em]">
                      {final.champion}
                    </h3>

                    {final.runnerUp ? (
                      <p className="mt-5 text-xs font-semibold uppercase leading-5 tracking-[-0.01em] text-white/42">
                        def. {final.runnerUp}
                      </p>
                    ) : null}

                    {final.score ? (
                      <p className="mt-3 font-mono text-[8px] uppercase tracking-[0.12em] text-white/26">
                        {final.score}
                      </p>
                    ) : null}

                    {final.summary ? (
                      <p className="mt-auto pt-7 text-xs leading-6 text-white/34">
                        {final.summary}
                      </p>
                    ) : null}
                  </div>
                </article>
              ),
            )}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

type FinalDetailProps = {
  icon: typeof Trophy;
  label: string;
  value?: string;
};

function FinalDetail({
  icon: Icon,
  label,
  value,
}: FinalDetailProps) {
  if (!value) {
    return null;
  }

  return (
    <div className="flex items-center justify-between gap-5 border-b border-white/10 px-6 py-5 last:border-b-0">
      <div className="inline-flex items-center gap-3">
        <Icon
          size={14}
          className="text-[var(--tournament-primary)]"
          strokeWidth={1.5}
          aria-hidden="true"
        />

        <p className="font-mono text-[7px] font-black uppercase tracking-[0.17em] text-white/28">
          {label}
        </p>
      </div>

      <p className="max-w-[210px] text-right text-[10px] font-black uppercase leading-5 tracking-[0.035em] text-white/58">
        {value}
      </p>
    </div>
  );
}