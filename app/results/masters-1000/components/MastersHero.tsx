import Link from "next/link";

import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CircleDot,
  Crown,
  Globe2,
  Layers3,
  Trophy,
} from "lucide-react";

import HeroDetail from "./HeroDetail";
import HeroFact from "./HeroFact";

export default function MastersHero() {
  return (
    <section className="relative isolate min-h-[820px] overflow-hidden border-b border-white/10 bg-[#020611]">
      <div className="absolute inset-0 bg-[linear-gradient(115deg,#020611_0%,#102940_48%,#020611_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_28%,rgba(70,190,255,0.22),transparent_31%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_82%,rgba(255,255,255,0.055),transparent_27%)]" />
      <div className="absolute inset-0 opacity-[0.055] [background-image:linear-gradient(rgba(255,255,255,0.09)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.09)_1px,transparent_1px)] [background-size:72px_72px]" />

      <div className="pointer-events-none absolute -right-20 top-24 hidden select-none text-[16rem] font-black uppercase leading-none tracking-[-0.12em] text-white/[0.025] xl:block">
        M1000
      </div>

      <div className="relative mx-auto flex min-h-[820px] max-w-[1480px] flex-col px-6 pb-14 pt-10 sm:px-10 lg:px-14 lg:pb-20 lg:pt-14">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <Link
            href="/results"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.025] px-4 py-2.5 font-mono text-[8px] font-black uppercase tracking-[0.18em] text-white/45 transition hover:border-[#55C9FF] hover:text-[#55C9FF]"
          >
            <ArrowLeft size={13} aria-hidden="true" />
            Results
          </Link>

          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.025] px-4 py-2.5 font-mono text-[8px] uppercase tracking-[0.18em] text-white/42">
            <Globe2 size={12} aria-hidden="true" />
            Nine tournaments · One world tour
          </span>
        </div>

        <div className="my-auto grid gap-14 py-20 lg:grid-cols-[minmax(0,1fr)_430px] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-3">
              <span className="h-px w-10 bg-[#55C9FF]" />
              <span className="font-mono text-[9px] font-black uppercase tracking-[0.28em] text-[#55C9FF]">
                AGE202 elite tournament archive
              </span>
            </div>

            <p className="mt-9 font-mono text-[9px] font-black uppercase tracking-[0.24em] text-white/24">
              M1000 · The world tour
            </p>

            <h1 className="mt-5 max-w-6xl text-[clamp(3.7rem,8.8vw,8.8rem)] font-black uppercase leading-[0.76] tracking-[-0.085em]">
              ATP Masters
              <span className="block text-[#55C9FF]">1000</span>
            </h1>

            <p className="mt-9 max-w-4xl text-xl font-black uppercase leading-[1.05] tracking-[-0.035em] text-white/28 sm:text-2xl lg:text-3xl">
              Nine stages across the world. One season-long pursuit.
            </p>

            <p className="mt-8 max-w-3xl text-base leading-8 text-white/52 sm:text-lg">
              Travel from the California desert to the final indoor challenge
              in Paris through the nine tournaments that define the ATP Masters
              1000 season.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href="#world-tour"
                className="inline-flex items-center gap-2 rounded-full bg-[#55C9FF] px-6 py-3.5 text-[9px] font-black uppercase tracking-[0.18em] text-[#050B18] transition hover:scale-[1.02]"
              >
                Explore world tour
                <ArrowRight size={14} aria-hidden="true" />
              </a>

              <a
                href="#tournaments"
                className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.025] px-6 py-3.5 text-[9px] font-black uppercase tracking-[0.18em] text-white/62 transition hover:border-[#55C9FF] hover:text-[#55C9FF]"
              >
                View tournaments
                <Layers3 size={14} aria-hidden="true" />
              </a>
            </div>
          </div>

          <aside className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#07101D]/82 p-7 shadow-[0_24px_80px_rgba(0,0,0,0.32)] backdrop-blur-xl sm:p-8">
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[rgba(70,190,255,0.2)] blur-3xl" />

            <div className="relative">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#55C9FF]">
                    Masters identity
                  </p>
                  <h2 className="mt-4 text-3xl font-black uppercase leading-[0.95] tracking-[-0.045em]">
                    The elite tour beneath the majors
                  </h2>
                </div>

                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.035] text-[#55C9FF]">
                  <Crown size={20} strokeWidth={1.4} aria-hidden="true" />
                </span>
              </div>

              <blockquote className="mt-8 border-l-2 border-[#55C9FF] pl-5 text-xl font-black uppercase leading-tight tracking-[-0.035em] text-white/70">
                “Nine tournaments. One global race.”
              </blockquote>

              <dl className="mt-9 space-y-1">
                <HeroDetail label="Tournaments" value="9 Masters 1000" icon={Trophy} />
                <HeroDetail
                  label="Continents"
                  value="North America · Europe · Asia"
                  icon={Globe2}
                />
                <HeroDetail
                  label="Surfaces"
                  value="Hard · Clay · Indoor hard"
                  icon={CircleDot}
                />
                <HeroDetail
                  label="Season"
                  value="March to November"
                  icon={CalendarDays}
                />
              </dl>
            </div>
          </aside>
        </div>

        <div className="grid gap-px overflow-hidden rounded-[1.8rem] border border-white/10 bg-white/10 sm:grid-cols-2 xl:grid-cols-4">
          <HeroFact value="9" label="Masters 1000 tournaments" index={1} />
          <HeroFact value="3" label="Continental regions" index={2} />
          <HeroFact
            value="1,000"
            label="Ranking points for the champion"
            index={3}
          />
          <HeroFact value="1" label="Complete AGE202 world tour" index={4} />
        </div>
      </div>
    </section>
  );
}
