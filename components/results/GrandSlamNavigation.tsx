import Link from "next/link";

import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CircleDot,
  Layers3,
} from "lucide-react";

import {
  getGrandSlamHref,
  grandSlamList,
  type GrandSlamData,
} from "@/lib/data/grand-slams";

type GrandSlamNavigationProps = {
  tournament: GrandSlamData;
};

export default function GrandSlamNavigation({
  tournament,
}: GrandSlamNavigationProps) {
  return (
    <section className="relative overflow-hidden border-t border-white/10 px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
      <div
        className="pointer-events-none absolute -right-48 top-8 h-[28rem] w-[28rem] rounded-full opacity-10 blur-3xl"
        style={{
          backgroundColor:
            tournament.colors.glow,
        }}
      />

      <div className="relative mx-auto max-w-[1440px]">
        <div className="grid gap-5 lg:grid-cols-2">
          {tournament.previousTournament ? (
            <TournamentDirectionCard
              direction="previous"
              name={tournament.previousTournament.name}
              href={getGrandSlamHref(
                tournament.previousTournament.slug,
              )}
            />
          ) : (
            <TournamentIndexCard />
          )}

          {tournament.nextTournament ? (
            <TournamentDirectionCard
              direction="next"
              name={tournament.nextTournament.name}
              href={getGrandSlamHref(
                tournament.nextTournament.slug,
              )}
            />
          ) : (
            <TournamentIndexCard />
          )}
        </div>

        <div className="mt-5 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.025]">
          <div className="flex flex-wrap items-center justify-between gap-5 border-b border-white/10 px-6 py-5 sm:px-8">
            <div>
              <p className="font-mono text-[8px] font-black uppercase tracking-[0.18em] text-[var(--tournament-primary)]">
                Grand Slam circuit
              </p>

              <h2 className="mt-2 text-xl font-black uppercase tracking-[-0.025em]">
                Explore all four majors
              </h2>
            </div>

            <Link
              href="/results/grand-slams"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.025] px-4 py-2.5 font-mono text-[7px] font-black uppercase tracking-[0.17em] text-white/38 transition hover:border-[var(--tournament-primary)] hover:text-[var(--tournament-primary)]"
            >
              Grand Slam hub
              <ArrowRight
                size={12}
                aria-hidden="true"
              />
            </Link>
          </div>

          <div className="grid gap-px bg-white/10 sm:grid-cols-2 xl:grid-cols-4">
            {grandSlamList.map(
              (slam) => {
                const isCurrent =
                  slam.slug ===
                  tournament.slug;

                return (
                  <Link
                    key={slam.slug}
                    href={getGrandSlamHref(
                      slam.slug,
                    )}
                    aria-current={
                      isCurrent
                        ? "page"
                        : undefined
                    }
                    className={`group flex min-h-[115px] items-center justify-between gap-4 bg-[#07101D] px-6 py-5 transition ${
                      isCurrent
                        ? "text-[var(--tournament-primary)]"
                        : "text-white/50 hover:text-white"
                    }`}
                  >
                    <div>
                      <span className="font-mono text-[7px] uppercase tracking-[0.17em] text-white/25">
                        {slam.code}
                      </span>

                      <h3 className="mt-2 text-sm font-black uppercase tracking-[-0.02em]">
                        {slam.name}
                      </h3>
                    </div>

                    {isCurrent ? (
                      <CircleDot
                        size={15}
                        aria-hidden="true"
                      />
                    ) : (
                      <ChevronRight
                        size={15}
                        className="text-white/18 transition group-hover:text-white/55"
                        aria-hidden="true"
                      />
                    )}
                  </Link>
                );
              },
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

type TournamentDirectionCardProps = {
  direction: "previous" | "next";
  name: string;
  href: string;
};

function TournamentDirectionCard({
  direction,
  name,
  href,
}: TournamentDirectionCardProps) {
  const isPrevious =
    direction === "previous";

  return (
    <Link
      href={href}
      className={`group flex min-h-[180px] items-center gap-6 rounded-[2rem] border border-white/10 bg-[#07101D] p-7 transition duration-300 hover:-translate-y-1 hover:border-[var(--tournament-primary)] sm:p-8 ${
        isPrevious
          ? ""
          : "justify-between text-right"
      }`}
    >
      {isPrevious ? (
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-white/30 transition group-hover:text-[var(--tournament-primary)]">
          <ChevronLeft
            size={19}
            aria-hidden="true"
          />
        </span>
      ) : null}

      <div
        className={
          isPrevious
            ? ""
            : "order-first ml-auto"
        }
      >
        <p className="font-mono text-[8px] font-black uppercase tracking-[0.18em] text-white/25">
          {isPrevious
            ? "Previous major"
            : "Next major"}
        </p>

        <h2 className="mt-4 text-2xl font-black uppercase tracking-[-0.035em]">
          {name}
        </h2>
      </div>

      {!isPrevious ? (
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-white/30 transition group-hover:text-[var(--tournament-primary)]">
          <ChevronRight
            size={19}
            aria-hidden="true"
          />
        </span>
      ) : null}
    </Link>
  );
}

function TournamentIndexCard() {
  return (
    <Link
      href="/results/grand-slams"
      className="group flex min-h-[180px] items-center justify-between gap-6 rounded-[2rem] border border-white/10 bg-[#07101D] p-7 transition duration-300 hover:-translate-y-1 hover:border-[var(--tournament-primary)] sm:p-8"
    >
      <div>
        <p className="font-mono text-[8px] font-black uppercase tracking-[0.18em] text-white/25">
          Grand Slam index
        </p>

        <h2 className="mt-4 text-2xl font-black uppercase tracking-[-0.035em]">
          All tournaments
        </h2>
      </div>

      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-white/30 transition group-hover:text-[var(--tournament-primary)]">
        <Layers3
          size={19}
          aria-hidden="true"
        />
      </span>
    </Link>
  );
}