import Link from "next/link";

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
} from "lucide-react";

import type { TournamentConfig } from "@/lib/data/tournaments/types";

type Masters1000TournamentHeroProps = {
  tournament: TournamentConfig;
  heroImage: string;
};

export default function Masters1000TournamentHero({
  tournament,
  heroImage,
}: Masters1000TournamentHeroProps) {
  const heroFacts = tournament.facts?.facts ?? [];

  return (
    <section className="relative isolate min-h-[calc(100svh-3rem)] overflow-hidden border-b border-white/10 bg-[#020611]">
      <div
        className="absolute inset-0 scale-[1.01] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url("${heroImage.replaceAll('"', '\\\"')}")`,
        }}
        aria-hidden="true"
      />

      <div
        className="absolute inset-0 bg-gradient-to-r from-[#020611]/92 via-[#020611]/62 to-[#020611]/16"
        aria-hidden="true"
      />

      <div
        className="absolute inset-0 bg-gradient-to-t from-[#020611]/82 via-[#020611]/10 to-[#020611]/18"
        aria-hidden="true"
      />

      <div
        className="absolute inset-0 opacity-28 mix-blend-color"
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
        aria-hidden="true"
      />

      <div
        className="absolute inset-0 opacity-48"
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

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_82%,rgba(255,255,255,0.055),transparent_27%)]" />

      <div className="absolute inset-0 opacity-[0.055] [background-image:linear-gradient(rgba(255,255,255,0.09)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.09)_1px,transparent_1px)] [background-size:72px_72px]" />

      <div className="pointer-events-none absolute -right-14 top-20 hidden select-none text-[20rem] font-black uppercase leading-none tracking-[-0.12em] text-white/[0.025] xl:block">
        {tournament.visualCode}
      </div>

      <div className="relative mx-auto flex min-h-[calc(100svh-3rem)] max-w-[1480px] flex-col px-5 pb-8 pt-7 sm:px-8 lg:px-12 lg:pb-10 lg:pt-8">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <Link
            href="/results/masters-1000"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.025] px-4 py-2.5 font-mono text-[8px] font-black uppercase tracking-[0.18em] text-white/45 transition hover:border-[var(--tournament-primary)] hover:text-[var(--tournament-primary)]"
          >
            <ArrowLeft size={13} aria-hidden="true" />
            Masters 1000
          </Link>

          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.025] px-4 py-2.5 font-mono text-[8px] uppercase tracking-[0.18em] text-white/42">
            <Globe2 size={12} aria-hidden="true" />
            {tournament.city} · {tournament.country}
          </span>
        </div>

        <div className="my-auto grid gap-10 py-14 lg:grid-cols-[minmax(0,1fr)_410px] lg:items-end lg:py-20">
          <div>
            <div className="inline-flex items-center gap-3">
              <span
                className="h-px w-10"
                style={{
                  backgroundColor: tournament.colors.primary,
                }}
              />

              <span className="font-mono text-[9px] font-black uppercase tracking-[0.28em] text-[var(--tournament-primary)]">
                {tournament.eyebrow}
              </span>
            </div>

            <p className="mt-8 font-mono text-[9px] font-black uppercase tracking-[0.3em] text-white/42">
              {tournament.code} · ATP Masters 1000 archive
            </p>

            <div className="mt-5 inline-flex items-center gap-3 rounded-full border border-white/12 bg-black/20 px-4 py-2 backdrop-blur-xl">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--tournament-primary)] shadow-[0_0_18px_var(--tournament-glow)]" />
              <span className="font-mono text-[8px] font-black uppercase tracking-[0.22em] text-white/55">
                {tournament.founded} — Today
              </span>
            </div>

            <h1 className="mt-6 max-w-6xl text-[clamp(4.6rem,11vw,11rem)] font-black uppercase leading-[0.72] tracking-[-0.095em] drop-shadow-[0_18px_55px_rgba(0,0,0,0.45)]">
              {tournament.name}
            </h1>

            <p className="mt-8 max-w-4xl text-xl font-black uppercase leading-[1.02] tracking-[-0.045em] text-white/46 sm:text-2xl lg:text-4xl">
              {tournament.headline}
            </p>

            <p className="mt-7 max-w-3xl text-base leading-8 text-white/62 sm:text-lg">
              {tournament.introduction}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="#overview"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--tournament-primary)] px-6 py-3.5 text-[9px] font-black uppercase tracking-[0.18em] text-[#050B18] transition hover:scale-[1.02]"
              >
                Explore tournament
                <ArrowDown size={14} aria-hidden="true" />
              </a>

              <a
                href="#history"
                className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.025] px-6 py-3.5 text-[9px] font-black uppercase tracking-[0.18em] text-white/62 transition hover:border-[var(--tournament-primary)] hover:text-[var(--tournament-primary)]"
              >
                Discover history
                <History size={14} aria-hidden="true" />
              </a>
            </div>
          </div>

          <aside className="relative overflow-hidden rounded-[1.75rem] border border-white/12 bg-[#07101D]/76 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-7">
            <div
              className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl"
              style={{
                backgroundColor: tournament.colors.glow,
              }}
            />

            <div className="relative">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-[var(--tournament-primary)]">
                    Tournament identity
                  </p>

                  <h2 className="mt-4 text-3xl font-black uppercase leading-[0.95] tracking-[-0.045em]">
                    {tournament.identity}
                  </h2>
                </div>

                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.035] text-[var(--tournament-primary)]">
                  <Crown size={20} strokeWidth={1.4} aria-hidden="true" />
                </span>
              </div>

              <blockquote className="mt-7 border-l-2 border-[var(--tournament-primary)] pl-5 text-xl font-black uppercase leading-tight tracking-[-0.035em] text-white/70">
                “{tournament.motto}”
              </blockquote>

              <dl className="mt-7 space-y-1">
                <HeroDetail
                  label="Venue"
                  value={tournament.venue}
                  icon={Building2}
                />

                <HeroDetail
                  label="Surface"
                  value={tournament.surface}
                  icon={CircleDot}
                />

                <HeroDetail
                  label="Calendar"
                  value={tournament.calendar}
                  icon={CalendarDays}
                />

                <HeroDetail
                  label="Founded"
                  value={tournament.founded}
                  icon={Landmark}
                />
              </dl>
            </div>
          </aside>
        </div>

        <div className="grid gap-px overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/10 shadow-[0_18px_60px_rgba(0,0,0,0.22)] sm:grid-cols-2 xl:grid-cols-4">
          {heroFacts.map((fact, index) => (
            <div
              key={fact.label}
              className="flex min-h-[88px] items-center justify-between bg-[#071021]/88 px-5 py-4 transition hover:bg-[#0A1628]"
            >
              <div>
                <span className="block text-2xl font-black uppercase tracking-[-0.045em]">
                  {fact.value}
                </span>

                <span className="mt-2 block font-mono text-[7px] uppercase tracking-[0.18em] text-white/36">
                  {fact.label}
                </span>
              </div>

              <span className="font-mono text-[8px] font-black text-[var(--tournament-primary)]">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
          ))}
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
    <div className="flex items-center justify-between gap-5 border-b border-white/10 py-4 last:border-b-0">
      <dt className="inline-flex items-center gap-3 font-mono text-[8px] uppercase tracking-[0.18em] text-white/34">
        <Icon
          size={13}
          className="text-[var(--tournament-primary)]"
          aria-hidden="true"
        />
        {label}
      </dt>

      <dd className="max-w-[210px] text-right text-[11px] font-black uppercase leading-5 tracking-[0.04em] text-white/66">
        {value}
      </dd>
    </div>
  );
}
