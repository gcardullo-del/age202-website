import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type NavigationPlayer = {
  slug: string;
  name: string;
  atpPlayer: {
    rank: number | null;
  } | null;
};

type PlayerNavigationProps = {
  previousPlayer: NavigationPlayer | null;
  nextPlayer: NavigationPlayer | null;
};

export default function PlayerNavigation({
  previousPlayer,
  nextPlayer,
}: PlayerNavigationProps) {
  return (
    <section className="border-t border-white/10 px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
      <div className="mx-auto grid max-w-[1440px] gap-4 md:grid-cols-2">
        {previousPlayer ? (
          <Link
            href={`/players/${previousPlayer.slug}`}
            className="group rounded-[1.6rem] border border-white/10 bg-white/[0.025] p-6 transition hover:border-[#D7FF00]/35"
          >
            <span className="inline-flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.18em] text-white/35">
              <ChevronLeft size={13} aria-hidden="true" />
              Previous player
            </span>

            <div className="mt-4 flex items-end justify-between gap-5">
              <div>
                <span className="text-2xl font-black uppercase tracking-[-0.04em]">
                  {previousPlayer.name}
                </span>

                <span className="mt-2 block font-mono text-[8px] uppercase tracking-[0.18em] text-[#D7FF00]">
                  {previousPlayer.atpPlayer?.rank
                    ? `ATP #${previousPlayer.atpPlayer.rank}`
                    : "ATP ranking unavailable"}
                </span>
              </div>

              <ArrowLeft
                size={19}
                className="text-white/25 transition group-hover:text-[#D7FF00]"
                aria-hidden="true"
              />
            </div>
          </Link>
        ) : (
          <div />
        )}

        {nextPlayer ? (
          <Link
            href={`/players/${nextPlayer.slug}`}
            className="group rounded-[1.6rem] border border-white/10 bg-white/[0.025] p-6 transition hover:border-[#D7FF00]/35 md:text-right"
          >
            <span className="inline-flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.18em] text-white/35">
              Next player
              <ChevronRight size={13} aria-hidden="true" />
            </span>

            <div className="mt-4 flex items-end justify-between gap-5 md:flex-row-reverse">
              <div>
                <span className="text-2xl font-black uppercase tracking-[-0.04em]">
                  {nextPlayer.name}
                </span>

                <span className="mt-2 block font-mono text-[8px] uppercase tracking-[0.18em] text-[#D7FF00]">
                  {nextPlayer.atpPlayer?.rank
                    ? `ATP #${nextPlayer.atpPlayer.rank}`
                    : "ATP ranking unavailable"}
                </span>
              </div>

              <ArrowRight
                size={19}
                className="text-white/25 transition group-hover:text-[#D7FF00]"
                aria-hidden="true"
              />
            </div>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </section>
  );
}