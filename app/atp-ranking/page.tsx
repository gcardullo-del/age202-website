"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  ChevronRight,
  CircleMinus,
  Search,
  Sparkles,
  Trophy,
} from "lucide-react";

type RankingPlayer = {
  position: number;
  previous: number;
  name: string;
  country: string;
  code: string;
  points: number;
  age: number;
  highlight?: boolean;
  href?: string;
};

const ranking: RankingPlayer[] = [
  { position: 1, previous: 1, name: "Jannik Sinner", country: "Italy", code: "ITA", points: 10330, age: 24, highlight: true, href: "/archives/sinner" },
  { position: 2, previous: 2, name: "Carlos Alcaraz", country: "Spain", code: "ESP", points: 8850, age: 23, highlight: true, href: "/archives/alcaraz" },
  { position: 3, previous: 4, name: "Novak Djokovic", country: "Serbia", code: "SRB", points: 7480, age: 39, highlight: true, href: "/archives/djokovic" },
  { position: 4, previous: 3, name: "Alexander Zverev", country: "Germany", code: "GER", points: 6910, age: 29 },
  { position: 5, previous: 5, name: "Taylor Fritz", country: "United States", code: "USA", points: 5210, age: 28 },
  { position: 6, previous: 7, name: "Jack Draper", country: "Great Britain", code: "GBR", points: 4860, age: 24 },
  { position: 7, previous: 6, name: "Lorenzo Musetti", country: "Italy", code: "ITA", points: 4520, age: 24 },
  { position: 8, previous: 8, name: "Alex de Minaur", country: "Australia", code: "AUS", points: 4215, age: 27 },
  { position: 9, previous: 11, name: "Ben Shelton", country: "United States", code: "USA", points: 3980, age: 23 },
  { position: 10, previous: 9, name: "Holger Rune", country: "Denmark", code: "DEN", points: 3755, age: 23 },
];

function Movement({ position, previous }: Pick<RankingPlayer, "position" | "previous">) {
  const delta = previous - position;

  if (delta > 0) {
    return (
      <span className="inline-flex items-center gap-1 text-emerald-300">
        <ArrowUp size={13} /> {delta}
      </span>
    );
  }

  if (delta < 0) {
    return (
      <span className="inline-flex items-center gap-1 text-rose-300">
        <ArrowDown size={13} /> {Math.abs(delta)}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-white/35">
      <CircleMinus size={13} /> 0
    </span>
  );
}

export default function AtpRankingPage() {
  const [query, setQuery] = useState("");

  const filteredRanking = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) return ranking;

    return ranking.filter((player) =>
      `${player.name} ${player.country} ${player.code}`.toLowerCase().includes(normalizedQuery),
    );
  }, [query]);

  return (
    <main className="min-h-screen overflow-hidden bg-[#050b18] text-white">
      <section className="relative overflow-hidden border-b border-white/10 px-5 pb-20 pt-28 sm:px-8 lg:px-12 lg:pb-28 lg:pt-36">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(215,255,0,.13),transparent_30%)]" />
        <div className="absolute -right-28 top-24 h-80 w-80 rounded-full border border-[#d7ff00]/10" />
        <div className="absolute -right-10 top-6 h-80 w-80 rounded-full border border-white/[.04]" />

        <div className="relative mx-auto max-w-[1500px]">
          <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[.32em] text-[#d7ff00]">
            <span className="h-px w-10 bg-[#d7ff00]" /> AGE202 tennis intelligence
          </div>

          <div className="mt-9 grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
            <div>
              <h1 className="max-w-5xl text-[clamp(4rem,9vw,9rem)] font-black uppercase leading-[.78] tracking-[-.07em]">
                ATP<br /><span className="text-[#d7ff00]">Ranking.</span>
              </h1>
              <p className="mt-8 max-w-2xl text-base leading-8 text-white/60 sm:text-lg">
                A premium ranking experience designed to connect the current tour with player profiles, museum galleries and tennis history.
              </p>
            </div>

            <div className="rounded-[1.7rem] border border-white/10 bg-white/[.035] p-6 backdrop-blur">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black uppercase tracking-[.23em] text-white/45">Platform status</span>
                <Sparkles size={17} className="text-[#d7ff00]" />
              </div>
              <p className="mt-8 text-2xl font-black uppercase tracking-[-.04em]">Ranking preview</p>
              <p className="mt-3 text-sm leading-7 text-white/48">
                The interface is ready for connection to an official tennis data provider.
              </p>
              <div className="mt-6 border-t border-white/10 pt-5 text-[9px] font-bold uppercase tracking-[.18em] text-[#d7ff00]">
                Prototype data · Not live
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[1500px]">
          <div className="grid gap-4 lg:grid-cols-3">
            {[
              ["World No. 1", "Jannik Sinner", "10,330 pts"],
              ["Biggest mover", "Ben Shelton", "+2 places"],
              ["AGE202 galleries", "3 featured", "Open archive"],
            ].map(([label, value, detail]) => (
              <article key={label} className="rounded-[1.45rem] border border-white/10 bg-white/[.028] p-6">
                <p className="text-[9px] font-black uppercase tracking-[.24em] text-[#d7ff00]">{label}</p>
                <p className="mt-6 text-2xl font-black uppercase tracking-[-.035em]">{value}</p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[.16em] text-white/38">{detail}</p>
              </article>
            ))}
          </div>

          <div className="mt-12 flex flex-col justify-between gap-6 border-t border-white/10 pt-7 md:flex-row md:items-end">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[.26em] text-[#d7ff00]">Men&apos;s singles</p>
              <h2 className="mt-3 text-3xl font-black uppercase tracking-[-.045em] sm:text-5xl">Top 10 ranking</h2>
            </div>

            <label className="relative block w-full md:max-w-sm">
              <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search player or nation"
                className="h-12 w-full rounded-full border border-white/10 bg-white/[.035] pl-11 pr-5 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#d7ff00]/55"
              />
            </label>
          </div>

          <div className="mt-8 overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/[.018]">
            <div className="hidden grid-cols-[90px_1.7fr_1fr_150px_110px_54px] gap-4 border-b border-white/10 px-7 py-4 text-[9px] font-black uppercase tracking-[.22em] text-white/35 md:grid">
              <span>Rank</span>
              <span>Player</span>
              <span>Nation</span>
              <span>Points</span>
              <span>Movement</span>
              <span />
            </div>

            <div>
              {filteredRanking.map((player) => {
                const row = (
                  <article className={`group grid gap-5 border-b border-white/[.07] px-5 py-6 transition last:border-b-0 md:grid-cols-[90px_1.7fr_1fr_150px_110px_54px] md:items-center md:px-7 ${player.highlight ? "bg-[#d7ff00]/[.035] hover:bg-[#d7ff00]/[.065]" : "hover:bg-white/[.035]"}`}>
                    <div className="flex items-center justify-between md:block">
                      <span className="text-[9px] font-black uppercase tracking-[.2em] text-white/35 md:hidden">Rank</span>
                      <span className={`text-4xl font-black tracking-[-.06em] ${player.position <= 3 ? "text-[#d7ff00]" : "text-white"}`}>
                        {String(player.position).padStart(2, "0")}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-3">
                        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[.04] text-[9px] font-black tracking-[.12em] text-[#d7ff00]">
                          {player.code}
                        </div>
                        <div>
                          <h3 className="text-lg font-black uppercase tracking-[-.025em]">{player.name}</h3>
                          <p className="mt-1 text-[9px] font-bold uppercase tracking-[.17em] text-white/35">Age {player.age}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:block">
                      <span className="text-[9px] font-black uppercase tracking-[.2em] text-white/35 md:hidden">Nation</span>
                      <span className="text-sm font-semibold text-white/65">{player.country}</span>
                    </div>

                    <div className="flex items-center justify-between md:block">
                      <span className="text-[9px] font-black uppercase tracking-[.2em] text-white/35 md:hidden">Points</span>
                      <span className="text-base font-black tabular-nums">{player.points.toLocaleString("en-US")}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs font-black md:block">
                      <span className="text-[9px] font-black uppercase tracking-[.2em] text-white/35 md:hidden">Movement</span>
                      <Movement position={player.position} previous={player.previous} />
                    </div>

                    <div className="flex justify-end">
                      <span className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-white/40 transition group-hover:border-[#d7ff00]/50 group-hover:text-[#d7ff00]">
                        <ChevronRight size={17} />
                      </span>
                    </div>
                  </article>
                );

                return player.href ? <Link key={player.name} href={player.href}>{row}</Link> : <div key={player.name}>{row}</div>;
              })}

              {filteredRanking.length === 0 && (
                <div className="px-6 py-20 text-center">
                  <p className="text-sm font-black uppercase tracking-[.18em] text-white/60">No players found</p>
                  <button onClick={() => setQuery("")} className="mt-5 text-[10px] font-black uppercase tracking-[.2em] text-[#d7ff00]">
                    Clear search
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 flex flex-col justify-between gap-6 rounded-[1.5rem] border border-[#d7ff00]/20 bg-[#d7ff00]/[.045] p-6 sm:flex-row sm:items-center">
            <div className="flex items-start gap-4">
              <Trophy className="mt-1 shrink-0 text-[#d7ff00]" size={23} />
              <div>
                <p className="text-base font-black uppercase tracking-[-.02em]">From ranking to museum archive</p>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-white/48">
                  Featured champions can connect directly to their AGE202 galleries, artifacts and career stories.
                </p>
              </div>
            </div>
            <Link href="/players" className="group inline-flex shrink-0 items-center gap-3 text-[10px] font-black uppercase tracking-[.2em] text-[#d7ff00]">
              Explore players <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
