import Link from "next/link";

import { ArrowRight, Trophy } from "lucide-react";

import {
  getMasters1000Href,
  type Masters1000Data,
} from "@/lib/data/masters-1000";

import TournamentFact from "./TournamentFact";

type MastersCardProps = {
  tournament: Masters1000Data;
  index: number;
};

export default function MastersCard({
  tournament,
  index,
}: MastersCardProps) {
  return (
    <Link
      href={getMasters1000Href(tournament.slug)}
      className="group relative min-h-[470px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#07101D] p-7 transition duration-300 hover:-translate-y-1 hover:border-white/25 sm:p-8"
      style={{
        background: `
          linear-gradient(
            135deg,
            ${tournament.colors.secondary},
            #07101D 72%
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

      <div className="pointer-events-none absolute -right-3 top-4 text-[7rem] font-black uppercase leading-none tracking-[-0.09em] text-white/[0.035]">
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
              M1000 · Stage 0{index + 1}
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

        <div className="mt-14">
          <h2 className="max-w-xl text-4xl font-black uppercase leading-[0.9] tracking-[-0.055em]">
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
