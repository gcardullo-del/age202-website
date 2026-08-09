import {
  Crown,
  Medal,
} from "lucide-react";

import Masters1000SectionHeading from "@/components/results/Masters1000SectionHeading";

import type {
  Masters1000IconicMoment,
} from "@/lib/data/masters-1000";

type Masters1000IconicMomentsProps = {
  tournamentName: string;
  moments: Masters1000IconicMoment[];
};

export default function Masters1000IconicMoments({
  tournamentName,
  moments,
}: Masters1000IconicMomentsProps) {
  return (
    <section
      id="moments"
      className="scroll-mt-16 border-t border-white/10 px-5 py-16 sm:px-8 lg:px-12 lg:py-20"
    >
      <div className="mx-auto max-w-[1440px]">
        <Masters1000SectionHeading
          eyebrow="Iconic moments"
          title="Chapters that shaped the tournament"
          description={`Selected milestones from the history of ${tournamentName}.`}
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {moments.map((moment, index) => (
            <MomentCard
              key={`${moment.year}-${moment.title}`}
              moment={moment}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

type MomentCardProps = {
  moment: Masters1000IconicMoment;
  index: number;
};

function MomentCard({
  moment,
  index,
}: MomentCardProps) {
  return (
    <article className="group relative min-h-[330px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#07101D] p-7 transition hover:-translate-y-1 hover:border-[var(--tournament-primary)] sm:p-8">
      <div
        className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full opacity-30 blur-3xl"
        style={{
          backgroundColor: "var(--tournament-glow)",
        }}
      />

      <div className="relative flex h-full flex-col">
        <div className="flex items-start justify-between gap-5">
          <span className="font-mono text-[8px] font-black uppercase tracking-[0.18em] text-white/23">
            Moment 0{index + 1}
          </span>

          <span className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-[var(--tournament-primary)]">
            <Medal size={16} strokeWidth={1.4} aria-hidden="true" />
          </span>
        </div>

        <p className="mt-14 text-5xl font-black tracking-[-0.06em] text-[var(--tournament-primary)]">
          {moment.year}
        </p>

        <h3 className="mt-5 text-3xl font-black uppercase leading-[0.95] tracking-[-0.045em]">
          {moment.title}
        </h3>

        <p className="mt-auto pt-8 text-sm leading-7 text-white/40">
          {moment.description}
        </p>
      </div>
    </article>
  );
}
