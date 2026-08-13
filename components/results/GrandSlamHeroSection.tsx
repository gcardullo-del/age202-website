import type {
  GrandSlamData,
} from "@/lib/data/grand-slams";

import {
  ArrowDown,
  ArrowLeft,
  Building2,
  CalendarDays,
  CircleDot,
  Crown,
  Globe2,
  History,
  Landmark,
  Sparkles,
} from "lucide-react";

import Link from "next/link";

import {
  getMuseumTournamentBySlug,
} from "@/lib/services/museum/tournament.service";

type GrandSlamHeroSectionProps = {
  tournament: GrandSlamData;
};

function safeBackgroundImage(
  imageUrl: string,
): string {
  const safeUrl =
    imageUrl.replaceAll('"', '\\"');

  return `url("${safeUrl}")`;
}

export default async function GrandSlamHeroSection({
  tournament,
}: GrandSlamHeroSectionProps) {
  const cmsTournament =
    await getMuseumTournamentBySlug(
      tournament.slug,
    );

  const heroImage =
    cmsTournament?.heroImage?.trim() ||
    null;

  const logoUrl =
    cmsTournament?.logoUrl?.trim() ||
    null;

  const displayName =
    cmsTournament?.shortName?.trim() ||
    cmsTournament?.name?.trim() ||
    tournament.name;

  const city =
    cmsTournament?.city?.trim() ||
    tournament.city;

  const country =
    cmsTournament?.country?.trim() ||
    tournament.country;

  const venue =
    cmsTournament?.venue?.trim() ||
    tournament.venue;

  const surface =
    cmsTournament?.surface?.trim() ||
    tournament.surface;

  const founded =
    cmsTournament?.foundedYear !== null &&
    cmsTournament?.foundedYear !== undefined
      ? String(
          cmsTournament.foundedYear,
        )
      : tournament.founded;

  return (
    <section className="relative isolate min-h-[760px] overflow-hidden border-b border-white/10 bg-[#020611]">
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(
              115deg,
              #020611 0%,
              ${tournament.colors.secondary} 52%,
              #020611 100%
            )
          `,
        }}
      />

      {heroImage ? (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                safeBackgroundImage(
                  heroImage,
                ),
            }}
            role="img"
            aria-label={`${displayName} hero`}
          />

          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,17,0.98)_0%,rgba(2,6,17,0.90)_32%,rgba(2,6,17,0.54)_62%,rgba(2,6,17,0.34)_100%)]" />

          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,17,0.30)_0%,rgba(2,6,17,0.12)_48%,rgba(2,6,17,0.90)_100%)]" />
        </>
      ) : (
        <div
          className="absolute inset-0 opacity-80"
          style={{
            background: `
              radial-gradient(
                circle at 76% 28%,
                ${tournament.colors.glow},
                transparent 31%
              )
            `,
          }}
        />
      )}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_82%,rgba(255,255,255,0.055),transparent_27%)]" />

      <div className="absolute inset-0 opacity-[0.055] [background-image:linear-gradient(rgba(255,255,255,0.09)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.09)_1px,transparent_1px)] [background-size:72px_72px]" />

      <div className="pointer-events-none absolute -right-14 top-20 hidden select-none text-[20rem] font-black uppercase leading-none tracking-[-0.12em] text-white/[0.025] xl:block">
        {tournament.visualCode}
      </div>

      <div className="relative mx-auto flex min-h-[760px] max-w-[1480px] flex-col px-6 pb-8 pt-8 sm:px-10 lg:px-14 lg:pb-10 lg:pt-10">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <Link
            href="/results/grand-slams"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#050B18]/45 px-4 py-2.5 font-mono text-[8px] font-black uppercase tracking-[0.18em] text-white/52 backdrop-blur-xl transition hover:border-[var(--tournament-primary)] hover:text-[var(--tournament-primary)]"
          >
            <ArrowLeft
              size={13}
              aria-hidden="true"
            />
            Grand Slams
          </Link>

          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#050B18]/45 px-4 py-2.5 font-mono text-[8px] uppercase tracking-[0.18em] text-white/52 backdrop-blur-xl">
            <Globe2
              size={12}
              aria-hidden="true"
            />
            {city} · {country}
          </span>
        </div>

        <div className="my-auto grid gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-end xl:grid-cols-[minmax(0,1fr)_410px]">
          <div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="inline-flex items-center gap-3">
                <span
                  className="h-px w-10"
                  style={{
                    backgroundColor:
                      tournament.colors.primary,
                  }}
                />

                <span className="font-mono text-[9px] font-black uppercase tracking-[0.28em] text-[var(--tournament-primary)]">
                  {tournament.eyebrow}
                </span>
              </div>

              {cmsTournament ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#050B18]/42 px-3 py-1.5 font-mono text-[6px] font-black uppercase tracking-[0.16em] text-white/34 backdrop-blur-xl">
                  <Sparkles
                    size={10}
                    className="text-[var(--tournament-primary)]"
                    aria-hidden="true"
                  />
                  Tournament Studio
                </span>
              ) : null}
            </div>

            <p className="mt-6 font-mono text-[9px] font-black uppercase tracking-[0.24em] text-white/28">
              {tournament.code} · Grand Slam archive
            </p>

            {logoUrl ? (
              <div
                className="mt-5 h-14 w-44 bg-contain bg-left bg-no-repeat sm:h-16 sm:w-52"
                style={{
                  backgroundImage:
                    safeBackgroundImage(
                      logoUrl,
                    ),
                }}
                role="img"
                aria-label={`${displayName} logo`}
              />
            ) : null}

            <h1 className="mt-4 max-w-5xl text-[clamp(3.8rem,8.4vw,8.2rem)] font-black uppercase leading-[0.78] tracking-[-0.08em]">
              {displayName}
            </h1>

            <p className="mt-6 max-w-4xl text-lg font-black uppercase leading-[1.05] tracking-[-0.035em] text-white/38 sm:text-xl lg:text-2xl">
              {tournament.headline}
            </p>

            <p className="mt-5 max-w-3xl text-sm leading-7 text-white/60 sm:text-base">
              {tournament.introduction}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="#overview"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--tournament-primary)] px-6 py-3.5 text-[9px] font-black uppercase tracking-[0.18em] text-[#050B18] transition hover:scale-[1.02]"
              >
                Explore tournament
                <ArrowDown
                  size={14}
                  aria-hidden="true"
                />
              </a>

              <a
                href="#history"
                className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-[#050B18]/42 px-6 py-3.5 text-[9px] font-black uppercase tracking-[0.18em] text-white/68 backdrop-blur-xl transition hover:border-[var(--tournament-primary)] hover:text-[var(--tournament-primary)]"
              >
                Discover history
                <History
                  size={14}
                  aria-hidden="true"
                />
              </a>
            </div>
          </div>

          <aside className="relative overflow-hidden rounded-[1.8rem] border border-white/10 bg-[#07101D]/76 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.32)] backdrop-blur-xl sm:p-7 lg:translate-x-3">
            <div
              className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl"
              style={{
                backgroundColor:
                  tournament.colors.glow,
              }}
            />

            <div className="relative">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-[var(--tournament-primary)]">
                    Tournament identity
                  </p>

                  <h2 className="mt-3 text-2xl font-black uppercase leading-[0.95] tracking-[-0.045em] sm:text-3xl">
                    {tournament.identity}
                  </h2>
                </div>

                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.035] text-[var(--tournament-primary)]">
                  <Crown
                    size={20}
                    strokeWidth={1.4}
                    aria-hidden="true"
                  />
                </span>
              </div>

              <blockquote className="mt-6 border-l-2 border-[var(--tournament-primary)] pl-5 text-lg font-black uppercase leading-tight tracking-[-0.035em] text-white/72">
                “{tournament.motto}”
              </blockquote>

              <dl className="mt-6 space-y-1">
                <HeroDetail
                  label="Venue"
                  value={venue}
                  icon={Building2}
                />

                <HeroDetail
                  label="Surface"
                  value={surface}
                  icon={CircleDot}
                />

                <HeroDetail
                  label="Calendar"
                  value={tournament.calendar}
                  icon={CalendarDays}
                />

                <HeroDetail
                  label="Founded"
                  value={founded}
                  icon={Landmark}
                />
              </dl>
            </div>
          </aside>
        </div>

        <div className="grid gap-px overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/10 sm:grid-cols-2 xl:grid-cols-4">
          {tournament.facts.map(
            (
              fact,
              index,
            ) => (
              <div
                key={fact.label}
                className="flex min-h-[88px] items-center justify-between bg-[#071021]/88 px-6 py-4 backdrop-blur-xl"
              >
                <div>
                  <span className="block text-xl font-black uppercase tracking-[-0.045em] sm:text-2xl">
                    {fact.value}
                  </span>

                  <span className="mt-2 block font-mono text-[7px] uppercase tracking-[0.18em] text-white/38">
                    {fact.label}
                  </span>
                </div>

                <span className="font-mono text-[8px] font-black text-[var(--tournament-primary)]">
                  0{index + 1}
                </span>
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  );
}

type HeroDetailProps = {
  label: string;
  value: string;
  icon: typeof Building2;
};

function HeroDetail({
  label,
  value,
  icon: Icon,
}: HeroDetailProps) {
  return (
    <div className="flex items-center justify-between gap-5 border-b border-white/10 py-3 last:border-b-0">
      <dt className="inline-flex items-center gap-3 font-mono text-[8px] uppercase tracking-[0.18em] text-white/36">
        <Icon
          size={13}
          className="text-[var(--tournament-primary)]"
          aria-hidden="true"
        />
        {label}
      </dt>

      <dd className="max-w-[210px] text-right text-[11px] font-black uppercase leading-5 tracking-[0.04em] text-white/70">
        {value}
      </dd>
    </div>
  );
}