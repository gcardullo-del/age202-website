import type {
  GrandSlamData,
} from "@/lib/data/grand-slams";

import {
  Building2,
  CalendarDays,
  CircleDot,
  Flag,
  Landmark,
  MapPin,
  Sparkles,
} from "lucide-react";

import {
  getMuseumTournamentBySlug,
} from "@/lib/services/museum/tournament.service";

type GrandSlamOverviewSectionProps = {
  tournament: GrandSlamData;
};

export default async function GrandSlamOverviewSection({
  tournament,
}: GrandSlamOverviewSectionProps) {
  const cmsTournament =
    await getMuseumTournamentBySlug(
      tournament.slug,
    );

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

  const introduction =
    cmsTournament?.description?.trim() ||
    tournament.introduction;

  const overviewCards = [
    {
      icon: MapPin,
      label: "Location",
      value: `${city}, ${country}`,
      description:
        "The host city and country of the championship.",
      code: "01",
    },
    {
      icon: Building2,
      label: "Venue",
      value: venue,
      description:
        "The permanent home and principal setting of the event.",
      code: "02",
    },
    {
      icon: CircleDot,
      label: "Court",
      value: surface,
      description:
        "The surface that shapes movement, rhythm and tactics.",
      code: "03",
    },
    {
      icon: CalendarDays,
      label: "Calendar",
      value: tournament.calendar,
      description:
        "Its traditional position within the tennis season.",
      code: "04",
    },
  ];

  return (
    <section
      id="overview"
      className="relative scroll-mt-24 overflow-hidden border-b border-white/10 px-5 py-20 sm:px-8 lg:px-12 lg:py-28"
    >
      <div
        className="pointer-events-none absolute -left-48 top-20 h-[34rem] w-[34rem] rounded-full blur-3xl"
        style={{
          backgroundColor:
            tournament.colors.glow,
          opacity: 0.26,
        }}
      />

      <div className="pointer-events-none absolute -right-32 bottom-0 h-[28rem] w-[28rem] rounded-full bg-[var(--tournament-glow)] opacity-10 blur-3xl" />

      <div className="relative mx-auto max-w-[1440px]">
        <SectionHeading
          eyebrow="Tournament overview"
          title={`Inside ${displayName}`}
          description="The essential identity, setting and sporting characteristics of the championship."
          cmsLive={Boolean(
            cmsTournament,
          )}
        />

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {overviewCards.map(
            (card) => (
              <OverviewCard
                key={card.code}
                {...card}
              />
            ),
          )}
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.65fr)]">
          <article className="relative min-h-[360px] overflow-hidden rounded-[2.15rem] border border-white/10 bg-[#07101D] p-7 sm:p-9 lg:p-11">
            <div className="pointer-events-none absolute -right-10 -top-20 select-none text-[11rem] font-black uppercase leading-none tracking-[-0.09em] text-white/[0.025]">
              {tournament.code}
            </div>

            <div
              className="pointer-events-none absolute -bottom-24 -left-20 h-72 w-72 rounded-full blur-3xl"
              style={{
                backgroundColor:
                  tournament.colors.glow,
                opacity: 0.22,
              }}
            />

            <div className="relative flex h-full flex-col justify-between">
              <div className="flex items-start justify-between gap-6">
                <span className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-[var(--tournament-primary)]">
                  <Flag
                    size={20}
                    strokeWidth={1.4}
                    aria-hidden="true"
                  />
                </span>

                <span className="rounded-full border border-white/10 bg-white/[0.025] px-4 py-2 font-mono text-[7px] font-black uppercase tracking-[0.17em] text-white/28">
                  Archive identity
                </span>
              </div>

              <div className="mt-14 max-w-4xl">
                <p className="font-mono text-[8px] font-black uppercase tracking-[0.2em] text-[var(--tournament-primary)]">
                  Tournament character
                </p>

                <h3 className="mt-4 text-3xl font-black uppercase leading-[0.94] tracking-[-0.045em] sm:text-4xl lg:text-5xl">
                  {tournament.identity}
                </h3>

                <p className="mt-6 max-w-3xl text-sm leading-7 text-white/48 sm:text-base">
                  {introduction}
                </p>
              </div>
            </div>
          </article>

          <article className="relative overflow-hidden rounded-[2.15rem] border border-white/10 bg-white/[0.025] p-7 sm:p-9">
            <div className="pointer-events-none absolute -right-8 -top-8 text-[8rem] font-black leading-none text-white/[0.025]">
              “
            </div>

            <div className="relative flex h-full min-h-[360px] flex-col">
              <div className="flex items-center justify-between gap-5">
                <div>
                  <p className="font-mono text-[8px] font-black uppercase tracking-[0.2em] text-[var(--tournament-primary)]">
                    Tournament statement
                  </p>

                  <p className="mt-2 font-mono text-[7px] uppercase tracking-[0.17em] text-white/25">
                    AGE202 archive voice
                  </p>
                </div>

                <span className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-[var(--tournament-primary)]">
                  <Sparkles
                    size={17}
                    strokeWidth={1.4}
                    aria-hidden="true"
                  />
                </span>
              </div>

              <blockquote className="my-auto py-10 text-3xl font-black uppercase leading-[0.98] tracking-[-0.045em] text-white/78 sm:text-4xl">
                “{tournament.motto}”
              </blockquote>

              <div className="border-t border-white/10 pt-6">
                <div className="flex items-center justify-between gap-5">
                  <div className="inline-flex items-center gap-3">
                    <Landmark
                      size={13}
                      className="text-[var(--tournament-primary)]"
                      aria-hidden="true"
                    />

                    <span className="font-mono text-[7px] uppercase tracking-[0.18em] text-white/28">
                      Founded
                    </span>
                  </div>

                  <span className="text-sm font-black uppercase tracking-[-0.02em] text-white/62">
                    {founded}
                  </span>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

type OverviewCardProps = {
  icon: typeof MapPin;
  label: string;
  value: string;
  description: string;
  code: string;
};

function OverviewCard({
  icon: Icon,
  label,
  value,
  description,
  code,
}: OverviewCardProps) {
  return (
    <article className="group relative min-h-[220px] overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#07101D] p-6 transition duration-300 hover:-translate-y-1 hover:border-[var(--tournament-primary)]">
      <div className="pointer-events-none absolute -right-3 -top-4 text-[6rem] font-black leading-none tracking-[-0.08em] text-white/[0.025]">
        {code}
      </div>

      <div className="relative flex h-full flex-col">
        <div className="flex items-start justify-between gap-4">
          <span className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-[var(--tournament-primary)]">
            <Icon
              size={18}
              strokeWidth={1.4}
              aria-hidden="true"
            />
          </span>

          <span className="font-mono text-[7px] font-black tracking-[0.15em] text-[var(--tournament-primary)]/45">
            {code}
          </span>
        </div>

        <p className="mt-7 font-mono text-[8px] font-black uppercase tracking-[0.18em] text-white/30">
          {label}
        </p>

        <h3 className="mt-3 text-xl font-black uppercase leading-tight tracking-[-0.03em]">
          {value}
        </h3>

        <p className="mt-auto pt-5 text-xs leading-6 text-white/36">
          {description}
        </p>
      </div>
    </article>
  );
}

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
  cmsLive: boolean;
};

function SectionHeading({
  eyebrow,
  title,
  description,
  cmsLive,
}: SectionHeadingProps) {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_470px] lg:items-end">
      <div>
        <div className="flex flex-wrap items-center gap-4">
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[var(--tournament-primary)]">
            {eyebrow}
          </p>

          {cmsLive ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.025] px-3 py-1.5 font-mono text-[6px] font-black uppercase tracking-[0.16em] text-white/28">
              <Sparkles
                size={10}
                className="text-[var(--tournament-primary)]"
                aria-hidden="true"
              />
              Tournament Studio
            </span>
          ) : null}
        </div>

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