import type { Metadata } from "next";

import Link from "next/link";

import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CircleDot,
  Crown,
  Globe2,
  Landmark,
  Layers3,
  MapPin,
  Sparkles,
  Trophy,
} from "lucide-react";

import {
  getGrandSlamHref,
  grandSlamList,
  type GrandSlamData,
} from "@/lib/data/grand-slams";

export const metadata: Metadata = {
  title: "Grand Slam Archive | AGE202",
  description:
    "Explore the complete AGE202 Grand Slam archive, including the Australian Open, Roland Garros, Wimbledon and the US Open.",
  keywords: [
    "Grand Slam tennis",
    "Australian Open",
    "Roland Garros",
    "Wimbledon",
    "US Open",
    "tennis history",
    "tennis champions",
    "AGE202",
  ],
  openGraph: {
    title: "Grand Slam Archive | AGE202",
    description:
      "Explore the history, identity and champions of the four Grand Slam tournaments.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Grand Slam Archive | AGE202",
    description:
      "Explore the history, identity and champions of the four Grand Slam tournaments.",
  },
  robots: {
    index: true,
    follow: true,
  },
  category: "Grand Slam tennis",
};

export default function GrandSlamsPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050B18] text-white">
      <GrandSlamsHero />

      <GrandSlamsOverview />

      <GrandSlamGrid />

      <GrandSlamArchivePreview />

      <BackToResults />
    </main>
  );
}

function GrandSlamsHero() {
  return (
    <section className="relative isolate min-h-[760px] overflow-hidden border-b border-white/10 bg-[#020611]">
      <div className="absolute inset-0 bg-[linear-gradient(115deg,#020611_0%,#0A1D34_48%,#020611_100%)]" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_28%,rgba(43,155,255,0.22),transparent_31%)]" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_82%,rgba(255,255,255,0.055),transparent_27%)]" />

      <div className="absolute inset-0 opacity-[0.055] [background-image:linear-gradient(rgba(255,255,255,0.09)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.09)_1px,transparent_1px)] [background-size:72px_72px]" />

      <div className="pointer-events-none absolute -right-20 top-24 hidden select-none text-[18rem] font-black uppercase leading-none tracking-[-0.12em] text-white/[0.025] xl:block">
        GS
      </div>

      <div className="relative mx-auto flex min-h-[760px] max-w-[1480px] flex-col px-6 pb-14 pt-10 sm:px-10 lg:px-14 lg:pb-20 lg:pt-14">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <Link
            href="/results"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.025] px-4 py-2.5 font-mono text-[8px] font-black uppercase tracking-[0.18em] text-white/45 transition hover:border-[#4EB3FF] hover:text-[#4EB3FF]"
          >
            <ArrowLeft size={13} aria-hidden="true" />
            Results
          </Link>

          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.025] px-4 py-2.5 font-mono text-[8px] uppercase tracking-[0.18em] text-white/42">
            <Globe2 size={12} aria-hidden="true" />
            Four majors · One archive
          </span>
        </div>

        <div className="my-auto grid gap-14 py-20 lg:grid-cols-[minmax(0,1fr)_430px] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-3">
              <span className="h-px w-10 bg-[#4EB3FF]" />

              <span className="font-mono text-[9px] font-black uppercase tracking-[0.28em] text-[#4EB3FF]">
                AGE202 tournament archive
              </span>
            </div>

            <p className="mt-9 font-mono text-[9px] font-black uppercase tracking-[0.24em] text-white/24">
              GS · The four majors
            </p>

            <h1 className="mt-5 max-w-6xl text-[clamp(4.1rem,9.8vw,9.6rem)] font-black uppercase leading-[0.76] tracking-[-0.085em]">
              Grand Slams
            </h1>

            <p className="mt-9 max-w-4xl text-xl font-black uppercase leading-[1.05] tracking-[-0.035em] text-white/28 sm:text-2xl lg:text-3xl">
              The championships that define tennis history.
            </p>

            <p className="mt-8 max-w-3xl text-base leading-8 text-white/52 sm:text-lg">
              Explore the Australian Open, Roland Garros, Wimbledon and the US
              Open through dedicated historical archives, champions, editions,
              records and iconic moments.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href="#tournaments"
                className="inline-flex items-center gap-2 rounded-full bg-[#4EB3FF] px-6 py-3.5 text-[9px] font-black uppercase tracking-[0.18em] text-[#050B18] transition hover:scale-[1.02]"
              >
                Explore tournaments
                <ArrowRight size={14} aria-hidden="true" />
              </a>

              <Link
                href="/results"
                className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.025] px-6 py-3.5 text-[9px] font-black uppercase tracking-[0.18em] text-white/62 transition hover:border-[#4EB3FF] hover:text-[#4EB3FF]"
              >
                Results archive
                <Layers3 size={14} aria-hidden="true" />
              </Link>
            </div>
          </div>

          <aside className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#07101D]/82 p-7 shadow-[0_24px_80px_rgba(0,0,0,0.32)] backdrop-blur-xl sm:p-8">
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[rgba(43,155,255,0.18)] blur-3xl" />

            <div className="relative">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#4EB3FF]">
                    Grand Slam identity
                  </p>

                  <h2 className="mt-4 text-3xl font-black uppercase leading-[0.95] tracking-[-0.045em]">
                    The highest level of the sport
                  </h2>
                </div>

                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.035] text-[#4EB3FF]">
                  <Crown size={20} strokeWidth={1.4} aria-hidden="true" />
                </span>
              </div>

              <blockquote className="mt-8 border-l-2 border-[#4EB3FF] pl-5 text-xl font-black uppercase leading-tight tracking-[-0.035em] text-white/70">
                “Four tournaments. A lifetime of history.”
              </blockquote>

              <dl className="mt-9 space-y-1">
                <HeroDetail
                  label="Tournaments"
                  value="4 majors"
                  icon={Trophy}
                />

                <HeroDetail
                  label="Continents"
                  value="3 continents"
                  icon={Globe2}
                />

                <HeroDetail
                  label="Surfaces"
                  value="Hard · Clay · Grass"
                  icon={CircleDot}
                />

                <HeroDetail
                  label="Season"
                  value="January to September"
                  icon={CalendarDays}
                />
              </dl>
            </div>
          </aside>
        </div>

        <div className="grid gap-px overflow-hidden rounded-[1.8rem] border border-white/10 bg-white/10 sm:grid-cols-2 xl:grid-cols-4">
          <HeroFact value="4" label="Grand Slam tournaments" index={1} />
          <HeroFact value="1877" label="Oldest major founded" index={2} />
          <HeroFact value="3" label="Playing surfaces" index={3} />
          <HeroFact value="1" label="Complete AGE202 archive" index={4} />
        </div>
      </div>
    </section>
  );
}

type HeroDetailProps = {
  label: string;
  value: string;
  icon: typeof Trophy;
};

function HeroDetail({ label, value, icon: Icon }: HeroDetailProps) {
  return (
    <div className="flex items-center justify-between gap-5 border-b border-white/10 py-4 last:border-b-0">
      <dt className="inline-flex items-center gap-3 font-mono text-[8px] uppercase tracking-[0.18em] text-white/34">
        <Icon size={13} className="text-[#4EB3FF]" aria-hidden="true" />
        {label}
      </dt>

      <dd className="max-w-[210px] text-right text-[11px] font-black uppercase leading-5 tracking-[0.04em] text-white/66">
        {value}
      </dd>
    </div>
  );
}

type HeroFactProps = {
  value: string;
  label: string;
  index: number;
};

function HeroFact({ value, label, index }: HeroFactProps) {
  return (
    <div className="flex min-h-[112px] items-center justify-between bg-[#071021]/94 px-6 py-5">
      <div>
        <span className="block text-2xl font-black uppercase tracking-[-0.045em]">
          {value}
        </span>

        <span className="mt-2 block font-mono text-[7px] uppercase tracking-[0.18em] text-white/36">
          {label}
        </span>
      </div>

      <span className="font-mono text-[8px] font-black text-[#4EB3FF]">
        0{index}
      </span>
    </div>
  );
}

function GrandSlamsOverview() {
  return (
    <section className="relative px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
      <div className="pointer-events-none absolute -left-48 top-20 h-[32rem] w-[32rem] rounded-full bg-[rgba(43,155,255,0.12)] blur-3xl" />

      <div className="relative mx-auto max-w-[1440px]">
        <SectionHeading
          eyebrow="The four majors"
          title="One sport, four identities"
          description="Each Grand Slam has its own surface, atmosphere, traditions and historical character."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
          <OverviewCard
            icon={CalendarDays}
            label="Calendar"
            value="January to September"
            description="The majors define the principal chapters of the tennis season."
          />

          <OverviewCard
            icon={CircleDot}
            label="Surfaces"
            value="Hard, clay and grass"
            description="Each court surface demands a distinct style of movement and strategy."
          />

          <OverviewCard
            icon={MapPin}
            label="Locations"
            value="Melbourne, Paris, London and New York"
            description="Four global cities host the most prestigious events in the sport."
          />

          <OverviewCard
            icon={Landmark}
            label="History"
            value="From 1877 to today"
            description="More than a century of champions, rivalries and defining moments."
          />
        </div>
      </div>
    </section>
  );
}

type OverviewCardProps = {
  icon: typeof CalendarDays;
  label: string;
  value: string;
  description: string;
};

function OverviewCard({
  icon: Icon,
  label,
  value,
  description,
}: OverviewCardProps) {
  return (
    <article className="group rounded-[1.7rem] border border-white/10 bg-[#07101D] p-6 transition hover:-translate-y-1 hover:border-[#4EB3FF]">
      <span className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-[#4EB3FF]">
        <Icon size={18} strokeWidth={1.4} aria-hidden="true" />
      </span>

      <p className="mt-7 font-mono text-[8px] font-black uppercase tracking-[0.18em] text-white/28">
        {label}
      </p>

      <h3 className="mt-3 text-xl font-black uppercase leading-tight tracking-[-0.03em]">
        {value}
      </h3>

      <p className="mt-4 text-xs leading-6 text-white/35">{description}</p>
    </article>
  );
}

function GrandSlamGrid() {
  return (
    <section
      id="tournaments"
      className="scroll-mt-16 border-t border-white/10 px-5 py-20 sm:px-8 lg:px-12 lg:py-28"
    >
      <div className="mx-auto max-w-[1440px]">
        <SectionHeading
          eyebrow="Tournament halls"
          title="Explore every Grand Slam"
          description="Enter each dedicated tournament archive to discover its identity, history, champions, editions and records."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {grandSlamList.map((tournament, index) => (
            <GrandSlamCard
              key={tournament.slug}
              tournament={tournament}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

type GrandSlamCardProps = {
  tournament: GrandSlamData;
  index: number;
};

function GrandSlamCard({
  tournament,
  index,
}: GrandSlamCardProps) {
  return (
    <Link
      href={getGrandSlamHref(tournament.slug)}
      className="group relative min-h-[460px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#07101D] p-7 transition duration-300 hover:-translate-y-1 hover:border-white/25 sm:p-9"
      style={{
        background: `
          linear-gradient(
            135deg,
            ${tournament.colors.secondary},
            #07101D 70%
          )
        `,
      }}
    >
      <div
        className="pointer-events-none absolute -bottom-28 -right-28 h-96 w-96 rounded-full opacity-40 blur-3xl"
        style={{
          backgroundColor: tournament.colors.glow,
        }}
      />

      <div className="pointer-events-none absolute -right-4 top-4 text-[8rem] font-black uppercase leading-none tracking-[-0.09em] text-white/[0.035]">
        {tournament.visualCode}
      </div>

      <div className="relative flex h-full flex-col">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p
              className="font-mono text-[8px] font-black uppercase tracking-[0.2em]"
              style={{
                color: tournament.colors.primary,
              }}
            >
              {tournament.code} · Grand Slam 0{index + 1}
            </p>

            <p className="mt-4 font-mono text-[8px] uppercase tracking-[0.18em] text-white/28">
              {tournament.city} · {tournament.country}
            </p>
          </div>

          <span
            className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.035]"
            style={{
              color: tournament.colors.primary,
            }}
          >
            <Trophy size={19} strokeWidth={1.4} aria-hidden="true" />
          </span>
        </div>

        <div className="mt-16">
          <h2 className="max-w-2xl text-4xl font-black uppercase leading-[0.9] tracking-[-0.055em] sm:text-5xl">
            {tournament.name}
          </h2>

          <p className="mt-5 max-w-xl text-lg font-black uppercase leading-tight tracking-[-0.03em] text-white/30">
            {tournament.headline}
          </p>

          <p className="mt-6 max-w-2xl text-sm leading-7 text-white/45">
            {tournament.introduction}
          </p>
        </div>

        <div className="mt-auto grid gap-3 pt-10 sm:grid-cols-3">
          <TournamentFact label="Surface" value={tournament.surface} />
          <TournamentFact label="Founded" value={tournament.founded} />
          <TournamentFact label="Calendar" value={tournament.calendar} />
        </div>

        <div className="mt-7 flex items-center justify-between border-t border-white/10 pt-6">
          <span className="font-mono text-[8px] font-black uppercase tracking-[0.18em] text-white/34">
            Enter archive
          </span>

          <span
            className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.035] transition group-hover:translate-x-1"
            style={{
              color: tournament.colors.primary,
            }}
          >
            <ArrowRight size={17} aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  );
}

type TournamentFactProps = {
  label: string;
  value: string;
};

function TournamentFact({ label, value }: TournamentFactProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/15 px-4 py-4">
      <span className="block font-mono text-[7px] uppercase tracking-[0.16em] text-white/25">
        {label}
      </span>

      <span className="mt-2 block text-[11px] font-black uppercase leading-5 text-white/62">
        {value}
      </span>
    </div>
  );
}

function GrandSlamArchivePreview() {
  const archiveFeatures = [
    {
      icon: Crown,
      title: "Hall of Champions",
      description:
        "Complete tournament winners and championship records across every edition.",
    },
    {
      icon: CalendarDays,
      title: "Tournament Editions",
      description:
        "Season-by-season finals, dates, champions and historical context.",
    },
    {
      icon: Sparkles,
      title: "Iconic Moments",
      description:
        "Matches, rivalries and milestones that became part of tennis history.",
    },
    {
      icon: Layers3,
      title: "AGE202 Archive",
      description:
        "Memorabilia and apparel connected to tournaments and their champions.",
    },
  ];

  return (
    <section className="border-t border-white/10 px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
      <div className="mx-auto max-w-[1440px]">
        <div className="relative overflow-hidden rounded-[2.2rem] border border-white/10 bg-[#07101D] p-7 sm:p-10 lg:p-14">
          <div className="pointer-events-none absolute -right-32 -top-32 h-[26rem] w-[26rem] rounded-full bg-[rgba(43,155,255,0.18)] blur-3xl" />

          <div className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:48px_48px]" />

          <div className="relative">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_430px] lg:items-end">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#4EB3FF]">
                  Grand Slam archive
                </p>

                <h2 className="mt-5 max-w-4xl text-4xl font-black uppercase leading-[0.9] tracking-[-0.055em] sm:text-5xl lg:text-6xl">
                  Four tournaments. One historical collection.
                </h2>
              </div>

              <p className="text-sm leading-7 text-white/42 lg:text-right">
                Every tournament archive shares the same architecture, creating
                a consistent journey through champions, editions, records and
                tennis history.
              </p>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-2">
              {archiveFeatures.map((feature) => {
                const Icon = feature.icon;

                return (
                  <article
                    key={feature.title}
                    className="flex items-start gap-5 rounded-[1.5rem] border border-white/10 bg-black/15 p-6"
                  >
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-[#4EB3FF]">
                      <Icon size={18} strokeWidth={1.4} aria-hidden="true" />
                    </span>

                    <div>
                      <h3 className="text-base font-black uppercase tracking-[-0.02em]">
                        {feature.title}
                      </h3>

                      <p className="mt-3 text-xs leading-6 text-white/35">
                        {feature.description}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BackToResults() {
  return (
    <section className="border-t border-white/10 px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
      <div className="mx-auto max-w-[1440px]">
        <Link
          href="/results"
          className="group flex min-h-[180px] items-center justify-between gap-6 rounded-[2rem] border border-white/10 bg-[#07101D] p-7 transition hover:-translate-y-1 hover:border-[#4EB3FF] sm:p-8"
        >
          <div>
            <p className="font-mono text-[8px] font-black uppercase tracking-[0.18em] text-[#4EB3FF]">
              AGE202 results
            </p>

            <h2 className="mt-4 text-2xl font-black uppercase tracking-[-0.035em]">
              Return to the results archive
            </h2>
          </div>

          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-white/30 transition group-hover:text-[#4EB3FF]">
            <ArrowRight size={19} aria-hidden="true" />
          </span>
        </Link>
      </div>
    </section>
  );
}

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
};

function SectionHeading({
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_470px] lg:items-end">
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#4EB3FF]">
          {eyebrow}
        </p>

        <h2 className="mt-5 max-w-5xl text-4xl font-black uppercase leading-[0.9] tracking-[-0.055em] sm:text-5xl lg:text-6xl">
          {title}
        </h2>
      </div>

      <p className="text-sm leading-7 text-white/43 lg:text-right">
        {description}
      </p>
    </div>
  );
}