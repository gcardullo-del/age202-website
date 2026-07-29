import Link from "next/link";
import { ArrowUpRight, CalendarDays, Crown, Medal, Trophy } from "lucide-react";

import type { Masters1000Final } from "@/lib/data/masters-1000-champions";
import { getPlayerArchiveHref } from "@/lib/player-links";

type Masters1000ChampionsTimelineProps = {
  tournamentName: string;
  entries: Masters1000Final[];
};

export default function Masters1000ChampionsTimeline({
  tournamentName,
  entries,
}: Masters1000ChampionsTimelineProps) {
  if (entries.length === 0) return null;

  const orderedEntries = [...entries].sort((a, b) => b.year - a.year);

  return (
    <section
      id="champions-timeline"
      className="relative scroll-mt-16 overflow-hidden border-t border-white/10 bg-[#020611] px-5 py-20 sm:px-8 lg:px-12 lg:py-28"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_88%_8%,var(--tournament-glow),transparent_32%)] opacity-40" />
      <div className="pointer-events-none absolute left-1/2 top-28 -translate-x-1/2 text-[clamp(7rem,18vw,18rem)] font-black uppercase leading-none tracking-[-0.1em] text-white/[0.022]">
        FINALS
      </div>

      <div className="relative mx-auto max-w-[1440px]">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-3">
              <span className="h-px w-12 bg-[var(--tournament-primary)]" />
              <span className="font-mono text-[9px] font-black uppercase tracking-[0.28em] text-[var(--tournament-primary)]">
                Champions timeline
              </span>
            </div>
            <h2 className="mt-7 max-w-5xl text-[clamp(4rem,8vw,8rem)] font-black uppercase leading-[0.76] tracking-[-0.085em]">
              Finals through time.
            </h2>
            <p className="mt-8 max-w-3xl text-base leading-8 text-white/48 sm:text-lg">
              The championship matches that defined the modern archive of {tournamentName}.
            </p>
          </div>

          <aside className="rounded-[2rem] border border-white/10 bg-[#07101D]/82 p-7 backdrop-blur-xl">
            <div className="flex items-center gap-3 text-[var(--tournament-primary)]">
              <CalendarDays size={19} aria-hidden="true" />
              <span className="font-mono text-[8px] font-black uppercase tracking-[0.2em]">
                Archive range
              </span>
            </div>
            <p className="mt-5 text-4xl font-black uppercase tracking-[-0.055em]">
              {orderedEntries.at(-1)?.year} — {orderedEntries[0]?.year}
            </p>
            <p className="mt-4 text-sm leading-7 text-white/38">
              Each champion is connected automatically to the AGE202 player archive when available.
            </p>
          </aside>
        </div>

        <div className="relative mt-16">
          <div className="absolute bottom-0 left-[35px] top-0 hidden w-px bg-gradient-to-b from-[var(--tournament-primary)] via-white/15 to-transparent md:block" />
          <div className="space-y-8">
            {orderedEntries.map((entry, index) => (
              <FinalEntry
                key={`${entry.year}-${entry.champion}`}
                entry={entry}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FinalEntry({
  entry,
  index,
}: {
  entry: Masters1000Final;
  index: number;
}) {
  const championHref = getPlayerArchiveHref(entry.champion);
  const runnerUpHref = getPlayerArchiveHref(entry.runnerUp);

  return (
    <article className="group relative md:pl-24">
      <div className="absolute left-0 top-9 z-10 hidden h-[70px] w-[70px] place-items-center rounded-full border border-[var(--tournament-primary)]/45 bg-[#07101D] text-[var(--tournament-primary)] shadow-[0_0_40px_var(--tournament-glow)] md:grid">
        {index === 0 ? <Crown size={24} /> : <Trophy size={22} />}
      </div>

      <div className="relative overflow-hidden rounded-[2.2rem] border border-white/10 bg-[#07101D]/92 transition duration-500 hover:-translate-y-1 hover:border-[var(--tournament-primary)]/55 hover:shadow-[0_35px_100px_rgba(0,0,0,0.4)]">
        <div className="pointer-events-none absolute right-5 top-0 text-[clamp(6rem,14vw,13rem)] font-black leading-none tracking-[-0.09em] text-white/[0.025]">
          {entry.year}
        </div>

        <div className="relative grid lg:grid-cols-[230px_minmax(0,1fr)_340px]">
          <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.025] p-7 lg:block lg:border-b-0 lg:border-r lg:p-9">
            <div>
              <span className="font-mono text-[8px] font-black uppercase tracking-[0.2em] text-white/25">
                Championship final
              </span>
              <p className="mt-3 text-6xl font-black tracking-[-0.075em] text-[var(--tournament-primary)] lg:mt-8 lg:text-7xl">
                {entry.year}
              </p>
            </div>
            <Medal className="text-white/10 lg:mt-10" size={34} aria-hidden="true" />
          </div>

          <div className="p-7 sm:p-9 lg:p-10">
            <span className="font-mono text-[8px] font-black uppercase tracking-[0.21em] text-[var(--tournament-primary)]">
              Champion
            </span>
            <div className="mt-5 flex items-start gap-4">
              <span className="text-4xl" role="img" aria-label={entry.championNation.name}>
                {entry.championNation.flag}
              </span>
              <div>
                {championHref ? (
                  <Link
                    href={championHref}
                    className="group/player inline-flex items-center gap-2 text-3xl font-black uppercase leading-[0.9] tracking-[-0.055em] transition hover:text-[var(--tournament-primary)] sm:text-5xl"
                  >
                    {entry.champion}
                    <ArrowUpRight size={18} className="opacity-0 transition group-hover/player:opacity-100" />
                  </Link>
                ) : (
                  <h3 className="text-3xl font-black uppercase leading-[0.9] tracking-[-0.055em] sm:text-5xl">
                    {entry.champion}
                  </h3>
                )}
                <p className="mt-4 font-mono text-[8px] font-black uppercase tracking-[0.18em] text-white/32">
                  {entry.championNation.code} · {entry.championNation.name}
                </p>
              </div>
            </div>

            {entry.note ? (
              <p className="mt-8 max-w-2xl border-l-2 border-[var(--tournament-primary)] pl-5 text-sm leading-7 text-white/45">
                {entry.note}
              </p>
            ) : null}
          </div>

          <div className="border-t border-white/10 bg-black/15 p-7 sm:p-9 lg:border-l lg:border-t-0">
            <span className="font-mono text-[8px] font-black uppercase tracking-[0.2em] text-white/28">
              Runner-up
            </span>
            <div className="mt-5 flex items-center gap-3">
              <span className="text-3xl" role="img" aria-label={entry.runnerUpNation.name}>
                {entry.runnerUpNation.flag}
              </span>
              <div>
                {runnerUpHref ? (
                  <Link
                    href={runnerUpHref}
                    className="inline-flex items-center gap-2 text-xl font-black uppercase tracking-[-0.03em] transition hover:text-[var(--tournament-primary)]"
                  >
                    {entry.runnerUp}
                    <ArrowUpRight size={14} />
                  </Link>
                ) : (
                  <p className="text-xl font-black uppercase tracking-[-0.03em]">{entry.runnerUp}</p>
                )}
                <p className="mt-2 font-mono text-[8px] uppercase tracking-[0.16em] text-white/28">
                  {entry.runnerUpNation.code}
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-white/[0.025] p-6">
              <span className="font-mono text-[8px] font-black uppercase tracking-[0.18em] text-white/25">
                Final score
              </span>
              <p className="mt-4 text-2xl font-black tracking-[-0.035em] text-white/82">
                {entry.score}
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
