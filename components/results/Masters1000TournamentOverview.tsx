import {
  Building2,
  CalendarDays,
  CircleDot,
  Flag,
  MapPin,
} from "lucide-react";

import Masters1000SectionHeading from "@/components/results/Masters1000SectionHeading";

import type { TournamentConfig } from "@/lib/data/tournaments/types";

type Masters1000TournamentOverviewProps = {
  tournament: TournamentConfig;
};

export default function Masters1000TournamentOverview({
  tournament,
}: Masters1000TournamentOverviewProps) {
  return (
    <section
      id="overview"
      className="relative scroll-mt-16 px-5 py-16 sm:px-8 lg:px-12 lg:py-20"
    >
      <div
        className="pointer-events-none absolute -left-48 top-20 h-[32rem] w-[32rem] rounded-full blur-3xl"
        style={{
          backgroundColor: tournament.colors.glow,
          opacity: 0.32,
        }}
      />

      <div className="relative mx-auto max-w-[1440px]">
        <Masters1000SectionHeading
          eyebrow="Tournament overview"
          title={`Inside ${tournament.name}`}
          description="The essential identity, setting and competitive characteristics of this Masters 1000 tournament."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
          <OverviewCard
            icon={MapPin}
            label="Location"
            value={`${tournament.city}, ${tournament.country}`}
            description="The city and country connected to the tournament."
          />

          <OverviewCard
            icon={Building2}
            label="Venue"
            value={tournament.venue}
            description="The principal setting and permanent home of the championship."
          />

          <OverviewCard
            icon={CircleDot}
            label="Court"
            value={tournament.surface}
            description="The surface that shapes movement, rhythm and strategy."
          />

          <OverviewCard
            icon={CalendarDays}
            label="Calendar"
            value={tournament.calendar}
            description="Its traditional position within the ATP season."
          />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#07101D] p-7 sm:p-9 lg:p-11">
            <div className="pointer-events-none absolute -right-12 -top-20 text-[10rem] font-black uppercase leading-none tracking-[-0.09em] text-white/[0.025]">
              {tournament.code}
            </div>

            <div className="relative">
              <span className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-[var(--tournament-primary)]">
                <Flag size={20} strokeWidth={1.4} aria-hidden="true" />
              </span>

              <p className="mt-8 font-mono text-[8px] font-black uppercase tracking-[0.2em] text-[var(--tournament-primary)]">
                Tournament character
              </p>

              <h3 className="mt-4 max-w-3xl text-3xl font-black uppercase leading-[0.95] tracking-[-0.045em] sm:text-4xl">
                {tournament.identity}
              </h3>

              <p className="mt-6 max-w-3xl text-sm leading-7 text-white/45 sm:text-base">
                {tournament.introduction}
              </p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.025] p-7 sm:p-9">
            <p className="font-mono text-[8px] font-black uppercase tracking-[0.2em] text-[var(--tournament-primary)]">
              Tournament statement
            </p>

            <blockquote className="mt-7 text-3xl font-black uppercase leading-[0.98] tracking-[-0.045em] text-white/76">
              “{tournament.motto}”
            </blockquote>

            <div className="mt-9 border-t border-white/10 pt-6">
              <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/28">
                AGE202 Masters 1000 archive
              </p>
            </div>
          </div>
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
};

function OverviewCard({
  icon: Icon,
  label,
  value,
  description,
}: OverviewCardProps) {
  return (
    <article className="group rounded-[1.7rem] border border-white/10 bg-[#07101D] p-6 transition hover:-translate-y-1 hover:border-[var(--tournament-primary)]">
      <span className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-[var(--tournament-primary)]">
        <Icon size={18} strokeWidth={1.4} aria-hidden="true" />
      </span>

      <p className="mt-7 font-mono text-[8px] font-black uppercase tracking-[0.18em] text-white/28">
        {label}
      </p>

      <h3 className="mt-3 text-xl font-black uppercase leading-tight tracking-[-0.03em]">
        {value}
      </h3>

      <p className="mt-4 text-xs leading-6 text-white/35">
        {description}
      </p>
    </article>
  );
}
