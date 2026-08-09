import {
  ChevronRight,
} from "lucide-react";

import Masters1000SectionHeading from "@/components/results/Masters1000SectionHeading";

import type {
  Masters1000TimelineEntry,
} from "@/lib/data/masters-1000";

type Masters1000TournamentTimelineProps = {
  tournamentName: string;
  entries: Masters1000TimelineEntry[];
};

export default function Masters1000TournamentTimeline({
  tournamentName,
  entries,
}: Masters1000TournamentTimelineProps) {
  return (
    <section
      id="timeline"
      className="relative scroll-mt-16 border-t border-white/10 px-5 py-16 sm:px-8 lg:px-12 lg:py-20"
    >
      <div className="mx-auto max-w-[1440px]">
        <Masters1000SectionHeading
          eyebrow="Historical timeline"
          title="Defining milestones"
          description={`Key stages in the evolution of ${tournamentName}.`}
        />

        <div className="mt-12 overflow-hidden rounded-[2rem] border border-white/10 bg-[#07101D]">
          {entries.map((entry, index) => (
            <TimelineEntry
              key={`${entry.year}-${entry.title}`}
              entry={entry}
              index={index}
              isLast={index === entries.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

type TimelineEntryProps = {
  entry: Masters1000TimelineEntry;
  index: number;
  isLast: boolean;
};

function TimelineEntry({
  entry,
  index,
  isLast,
}: TimelineEntryProps) {
  return (
    <article
      className={`group grid gap-6 p-7 transition hover:bg-white/[0.02] sm:grid-cols-[90px_130px_minmax(0,1fr)_48px] sm:items-center sm:p-8 ${
        isLast ? "" : "border-b border-white/10"
      }`}
    >
      <span className="font-mono text-[8px] font-black uppercase tracking-[0.18em] text-white/22">
        0{index + 1}
      </span>

      <span className="text-3xl font-black tracking-[-0.05em] text-[var(--tournament-primary)]">
        {entry.year}
      </span>

      <div>
        <h3 className="text-xl font-black uppercase tracking-[-0.03em]">
          {entry.title}
        </h3>

        <p className="mt-3 text-sm leading-7 text-white/40">
          {entry.description}
        </p>
      </div>

      <span className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.025] text-white/24 transition group-hover:border-[var(--tournament-primary)] group-hover:text-[var(--tournament-primary)]">
        <ChevronRight size={15} aria-hidden="true" />
      </span>
    </article>
  );
}
