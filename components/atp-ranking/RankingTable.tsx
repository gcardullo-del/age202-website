import {
  SearchX,
  Trophy,
} from "lucide-react";

import RankingRow from "./RankingRow";

import type { RankingPlayer } from "./types";

type RankingTableProps = {
  players: RankingPlayer[];
  totalPlayers?: number;
};

export default function RankingTable({
  players,
  totalPlayers,
}: RankingTableProps) {
  const visiblePlayers = players.length;
  const overallPlayers = totalPlayers ?? visiblePlayers;

  return (
    <section
      id="atp-ranking-table"
      className="scroll-mt-28"
    >
      <div className="rounded-[2rem] border border-white/10 bg-[#050B18]/85 p-3 shadow-[0_28px_90px_rgba(0,0,0,0.34)] backdrop-blur-2xl sm:p-4">
        <div className="overflow-hidden rounded-[1.55rem] border border-white/10 bg-[#020711]">
          <div className="flex flex-col gap-5 border-b border-white/10 px-5 py-6 sm:px-7 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-[#D7FF00]/20 bg-[#D7FF00]/[0.07]">
                <Trophy
                  size={19}
                  className="text-[#D7FF00]"
                  aria-hidden="true"
                />
              </span>

              <div>
                <p className="font-mono text-[8px] font-black uppercase tracking-[0.22em] text-[#D7FF00]">
                  ATP World Ranking
                </p>

                <h2 className="mt-2 text-2xl font-black uppercase tracking-[-0.045em] text-white sm:text-3xl">
                  Top 150 Players
                </h2>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 font-mono text-[7px] font-black uppercase tracking-[0.16em] text-white/40">
                {visiblePlayers} visible
              </span>

              <span className="rounded-full border border-[#D7FF00]/15 bg-[#D7FF00]/[0.045] px-4 py-2 font-mono text-[7px] font-black uppercase tracking-[0.16em] text-[#D7FF00]">
                {overallPlayers} ranked
              </span>
            </div>
          </div>

          <div className="hidden grid-cols-[64px_58px_minmax(220px,1.4fr)_100px_80px_120px_minmax(150px,0.7fr)] items-center gap-4 border-b border-white/10 bg-white/[0.02] px-6 py-4 sm:grid">
            <p className="text-center font-mono text-[7px] font-black uppercase tracking-[0.18em] text-white/25">
              Rank
            </p>

            <p className="text-center font-mono text-[7px] font-black uppercase tracking-[0.18em] text-white/25">
              Trend
            </p>

            <p className="font-mono text-[7px] font-black uppercase tracking-[0.18em] text-white/25">
              Player
            </p>

            <p className="text-right font-mono text-[7px] font-black uppercase tracking-[0.18em] text-white/25">
              Age
            </p>

            <p className="text-right font-mono text-[7px] font-black uppercase tracking-[0.18em] text-white/25">
              Events
            </p>

            <p className="text-right font-mono text-[7px] font-black uppercase tracking-[0.18em] text-white/25">
              Points
            </p>

            <p className="text-right font-mono text-[7px] font-black uppercase tracking-[0.18em] text-white/25">
              AGE202
            </p>
          </div>

          {players.length > 0 ? (
            <div className="space-y-3 p-3 sm:p-4">
              {players.map((player) => (
                <RankingRow
                  key={player.id}
                  player={player}
                />
              ))}
            </div>
          ) : (
            <div className="grid min-h-[420px] place-items-center px-6 py-16 text-center">
              <div className="max-w-md">
                <span className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-white/10 bg-white/[0.035]">
                  <SearchX
                    size={24}
                    className="text-[#D7FF00]"
                    aria-hidden="true"
                  />
                </span>

                <p className="mt-6 font-mono text-[8px] font-black uppercase tracking-[0.22em] text-[#D7FF00]">
                  No ranking results
                </p>

                <h3 className="mt-3 text-2xl font-black uppercase tracking-[-0.04em] text-white">
                  No players found
                </h3>

                <p className="mt-4 text-sm leading-7 text-white/45">
                  Try changing the search term, country filter
                  or sorting option to view more ATP players.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}