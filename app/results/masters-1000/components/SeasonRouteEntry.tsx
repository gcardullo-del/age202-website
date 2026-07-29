import Link from "next/link";

import { ArrowRight, CircleDot } from "lucide-react";

import {
  getMasters1000Href,
  type Masters1000Data,
} from "@/lib/data/masters-1000";

type SeasonRouteEntryProps = {
  tournament: Masters1000Data;
  index: number;
  isLast: boolean;
};

export default function SeasonRouteEntry({
  tournament,
  index,
  isLast,
}: SeasonRouteEntryProps) {
  return (
    <Link
      href={getMasters1000Href(tournament.slug)}
      className={`group grid gap-5 p-6 transition hover:bg-white/[0.025] sm:grid-cols-[65px_120px_minmax(0,1fr)_180px_48px] sm:items-center sm:p-8 ${
        isLast ? "" : "border-b border-white/10"
      }`}
    >
      <span
        className="font-mono text-[8px] font-black uppercase tracking-[0.18em]"
        style={{
          color: tournament.colors.primary,
        }}
      >
        0{index + 1}
      </span>

      <span className="font-mono text-[8px] font-black uppercase tracking-[0.18em] text-white/30">
        {tournament.calendar}
      </span>

      <div>
        <h3 className="text-xl font-black uppercase tracking-[-0.03em]">
          {tournament.name}
        </h3>

        <p className="mt-2 text-xs leading-6 text-white/34">
          {tournament.city} · {tournament.country}
        </p>
      </div>

      <div className="flex items-center gap-3 sm:justify-end">
        <CircleDot
          size={13}
          style={{
            color: tournament.colors.primary,
          }}
          aria-hidden="true"
        />

        <span className="font-mono text-[7px] font-black uppercase tracking-[0.16em] text-white/34">
          {tournament.surface}
        </span>
      </div>

      <span
        className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.025] text-white/24 transition group-hover:translate-x-1"
        style={{
          color: tournament.colors.primary,
        }}
      >
        <ArrowRight size={15} aria-hidden="true" />
      </span>
    </Link>
  );
}
