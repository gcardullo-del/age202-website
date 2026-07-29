import Link from "next/link";
import { ArrowUpRight, Baby, CalendarClock, Crown, Flame, Flag, Medal, Sparkles, Trophy } from "lucide-react";
import type { Masters1000Record, Masters1000RecordIcon } from "@/lib/data/masters-1000-records";
import { getTournamentRecords } from "@/lib/tournament-engine";
import { getPlayerArchiveHref } from "@/lib/player-links";

type Props = { slug: string };
const iconMap: Record<Masters1000RecordIcon, typeof Trophy> = { titles: Trophy, finals: Medal, streak: Flame, youngest: Baby, oldest: CalendarClock, italy: Flag, latest: Crown, era: Sparkles };

export default function Masters1000TournamentRecords({ slug }: Props) {
  const data = getTournamentRecords(slug);
  if (!data) return null;
  return (
    <section id="records" className="relative scroll-mt-16 border-t border-white/10 px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,var(--tournament-glow),transparent_34%)] opacity-25" />
      <div className="relative mx-auto max-w-[1440px]">
        <div className="max-w-3xl">
          <p className="font-mono text-[8px] font-black uppercase tracking-[0.22em] text-[var(--tournament-primary)]">{data.eyebrow}</p>
          <h2 className="mt-5 text-4xl font-black uppercase leading-[0.92] tracking-[-0.055em] sm:text-5xl lg:text-6xl">{data.title}</h2>
          <p className="mt-6 max-w-2xl text-sm leading-8 text-white/42 sm:text-base">{data.description}</p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {data.records.map((record, index) => <RecordCard key={`${record.label}-${record.value}`} record={record} index={index} />)}
        </div>
        <div className="mt-6 flex items-start gap-4 rounded-[1.6rem] border border-dashed border-white/12 bg-white/[0.018] p-6 sm:p-7">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-[var(--tournament-primary)]"><Sparkles size={16} aria-hidden="true" /></span>
          <p className="max-w-4xl text-xs leading-6 text-white/36 sm:text-sm sm:leading-7">{data.note}</p>
        </div>
      </div>
    </section>
  );
}

function RecordCard({ record, index }: { record: Masters1000Record; index: number }) {
  const Icon = iconMap[record.icon];
  const href = record.href ?? getPlayerArchiveHref(record.player);
  const content = (
    <article className="group relative h-full min-h-[310px] overflow-hidden rounded-[1.9rem] border border-white/10 bg-[#07101D]/92 p-7 backdrop-blur-xl transition duration-500 hover:-translate-y-1.5 hover:border-[var(--tournament-primary)] hover:shadow-[0_24px_70px_-30px_var(--tournament-glow)]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--tournament-primary)]/70 to-transparent opacity-0 transition group-hover:opacity-100" />
      <span className="absolute right-5 top-4 font-mono text-[3.8rem] font-black tracking-[-0.08em] text-white/[0.025]">0{index + 1}</span>
      <div className="relative flex h-full flex-col">
        <div className="flex items-start justify-between gap-4">
          <span className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.035] text-[var(--tournament-primary)] transition group-hover:scale-105 group-hover:border-[var(--tournament-primary)]/60"><Icon size={19} strokeWidth={1.5} aria-hidden="true" /></span>
          {href ? <ArrowUpRight size={17} className="text-white/20 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--tournament-primary)]" aria-hidden="true" /> : null}
        </div>
        <p className="mt-8 font-mono text-[8px] font-black uppercase tracking-[0.19em] text-white/30">{record.label}</p>
        <h3 className="mt-4 text-2xl font-black uppercase leading-[0.95] tracking-[-0.045em]">{record.player}</h3>
        <p className="mt-4 text-xl font-black tracking-[-0.035em] text-[var(--tournament-primary)]">{record.value}</p>
        <p className="mt-auto pt-8 text-xs leading-6 text-white/38">{record.detail}</p>
        {href ? <span className="mt-5 font-mono text-[7px] font-black uppercase tracking-[0.18em] text-white/28 transition group-hover:text-white/60">View archive →</span> : null}
      </div>
    </article>
  );
  return href ? <Link href={href} className="block h-full rounded-[1.9rem] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tournament-primary)]">{content}</Link> : content;
}
