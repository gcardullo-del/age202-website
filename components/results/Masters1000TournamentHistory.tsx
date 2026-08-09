import {
  History,
  Landmark,
} from "lucide-react";

import type { TournamentConfig } from "@/lib/data/tournaments/types";

type Masters1000TournamentHistoryProps = {
  tournament: TournamentConfig;
};

export default function Masters1000TournamentHistory({
  tournament,
}: Masters1000TournamentHistoryProps) {
  return (
    <section
      id="history"
      className="scroll-mt-16 border-t border-white/10 px-5 py-16 sm:px-8 lg:px-12 lg:py-20"
    >
      <div className="mx-auto grid max-w-[1440px] gap-12 xl:grid-cols-[390px_minmax(0,1fr)]">
        <div className="xl:sticky xl:top-28 xl:self-start">
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[var(--tournament-primary)]">
            Tournament history
          </p>

          <h2 className="mt-5 text-4xl font-black uppercase leading-[0.92] tracking-[-0.055em] sm:text-5xl">
            From {tournament.founded} to the modern era.
          </h2>

          <p className="mt-6 text-sm leading-7 text-white/43">
            The evolution of {tournament.name}, its venue and its role within
            the ATP Masters 1000 season.
          </p>

          <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.025] px-5 py-3">
            <Landmark
              size={13}
              className="text-[var(--tournament-primary)]"
              aria-hidden="true"
            />

            <span className="font-mono text-[8px] font-black uppercase tracking-[0.18em] text-[var(--tournament-primary)]">
              Founded {tournament.founded}
            </span>
          </div>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#07101D]">
          <div className="border-b border-white/10 p-7 sm:p-9">
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="font-mono text-[8px] font-black uppercase tracking-[0.2em] text-[var(--tournament-primary)]">
                  Historical profile
                </p>

                <h3 className="mt-4 text-3xl font-black uppercase tracking-[-0.045em]">
                  The story of {tournament.name}
                </h3>
              </div>

              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-[var(--tournament-primary)]">
                <History size={19} strokeWidth={1.4} aria-hidden="true" />
              </span>
            </div>
          </div>

          <div>
            {tournament.history.map((paragraph, index) => (
              <article
                key={`${index}-${paragraph}`}
                className="grid gap-5 border-b border-white/10 p-7 last:border-b-0 sm:grid-cols-[70px_minmax(0,1fr)] sm:p-9"
              >
                <span className="text-4xl font-black tracking-[-0.06em] text-white/[0.1]">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <p className="text-sm leading-8 text-white/48 sm:text-base">
                  {paragraph}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
