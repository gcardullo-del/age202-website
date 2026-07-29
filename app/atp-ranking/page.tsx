import type { Metadata } from "next";

import { AtpRankingTable } from "@/components/atp-ranking/AtpRankingTable";
import { getRanking } from "@/lib/services/atp-ranking.service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ATP World Rankings | AGE202",
  description:
    "La classifica ATP Top 150 con punti ufficiali, variazioni, nazionalità e collegamenti alle collezioni AGE202.",
};

function formatDate(value: Date | null): string {
  if (!value) return "Data non disponibile";

  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(value);
}

export default async function AtpRankingPage() {
  const players = await getRanking(150);
  const leader = players[0] ?? null;

  const latestDate =
    players.length > 0
      ? players.reduce(
          (latest, player) => {
            const value = new Date(player.rankingDate);
            return value > latest ? value : latest;
          },
          new Date(players[0].rankingDate),
        )
      : null;

  const source = leader?.source ?? "AGE202";

  return (
    <main className="min-h-screen bg-[#030a16] text-white">
      <section className="relative overflow-hidden border-b border-white/10 bg-[linear-gradient(110deg,#030a16_0%,#07111d_58%,#172111_100%)]">
        <div className="pointer-events-none absolute right-[-90px] top-8 size-[390px] rounded-full border border-[#ccff00]/10" />
        <div className="pointer-events-none absolute right-[-15px] top-24 size-[250px] rounded-full border border-[#ccff00]/10" />

        <div className="mx-auto grid w-full max-w-[1680px] gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1.45fr_0.75fr] lg:px-10 lg:py-12">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.32em] text-[#ccff00]">
              AGE202 Tour Intelligence
            </p>

            <h1 className="mt-3 max-w-4xl text-[clamp(3.8rem,8vw,8.8rem)] font-black uppercase leading-[0.76] tracking-[-0.075em]">
              ATP World
              <span className="block text-[#ccff00]">
                Rankings.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
              Un archivio aggiornato dei migliori 150 giocatori
              del circuito maschile, con punti ufficiali,
              variazioni e collegamenti alle collezioni AGE202.
            </p>
          </div>

          <div className="self-end rounded-2xl border border-white/10 bg-[#07101d]/80 p-5 shadow-2xl shadow-black/30">
            <p className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-500">
              Platform status
            </p>
            <p className="mt-1 text-2xl font-black uppercase">
              Rankings data
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Dataset manuale verificato sulla classifica
              ufficiale ATP.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#ccff00]">
                  Leader
                </p>
                <p className="mt-2 text-base font-black">
                  {leader?.name ?? "—"}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#ccff00]">
                  Leader points
                </p>
                <p className="mt-2 text-base font-black tabular-nums">
                  {leader?.points?.toLocaleString("it-IT") ?? "—"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto grid w-full max-w-[1680px] border-t border-white/10 px-4 sm:grid-cols-4 sm:px-6 lg:px-10">
          {[
            ["Players", `${players.length}`],
            ["Ranking range", "Top 150"],
            ["Updated", formatDate(latestDate)],
            ["Source", source],
          ].map(([label, value]) => (
            <div
              key={label}
              className="border-b border-white/10 py-4 sm:border-b-0 sm:border-r sm:px-5 first:sm:pl-0 last:sm:border-r-0"
            >
              <p className="text-[9px] font-black uppercase tracking-[0.22em] text-[#ccff00]">
                {label}
              </p>
              <p className="mt-1 text-sm font-black uppercase text-white">
                {value}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1680px] px-4 py-8 sm:px-6 lg:px-10">
        <div className="mb-4">
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#ccff00]">
            Season overview
          </p>
          <h2 className="mt-1 text-4xl font-black uppercase tracking-[-0.05em] sm:text-5xl">
            Ranking table
          </h2>
        </div>

        <AtpRankingTable players={players} />
      </section>
    </main>
  );
}
