import Link from "next/link";

import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CircleDot,
  Layers3,
} from "lucide-react";

import {
  getMasters1000Href,
  masters1000List,
} from "@/lib/data/masters-1000";

import type { TournamentConfig } from "@/lib/data/tournaments/types";

type Masters1000MastersNavigationProps = {
  tournament: TournamentConfig;
};

export default function Masters1000MastersNavigation({
  tournament,
}: Masters1000MastersNavigationProps) {
  return (
    <section
      id="masters-navigation"
      className="border-t border-white/10 px-5 py-16 sm:px-8 lg:px-12 lg:py-20"
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-4 md:grid-cols-2">
          {tournament.previousTournament ? (
            <TournamentDirectionCard
              direction="previous"
              name={tournament.previousTournament.name}
              href={getMasters1000Href(
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
              href={getMasters1000Href(
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
                Masters 1000 world tour
              </p>

              <h2 className="mt-2 text-xl font-black uppercase tracking-[-0.025em]">
                Explore all nine tournaments
              </h2>

              <p className="mt-2 max-w-2xl text-xs leading-6 text-white/32">
                Move through the complete Masters 1000 collection or jump
                directly to another tournament archive.
              </p>
            </div>

            <Link
              href="/results/masters-1000"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.025] px-4 py-2.5 font-mono text-[7px] font-black uppercase tracking-[0.17em] text-white/38 transition hover:border-[var(--tournament-primary)] hover:text-[var(--tournament-primary)]"
            >
              Masters hub
              <ArrowRight
                size={12}
                aria-hidden="true"
              />
            </Link>
          </div>

          <div className="grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
            {masters1000List.map(
              (
                mastersTournament,
                index,
              ) => {
                const isCurrent =
                  mastersTournament.slug ===
                  tournament.slug;

                const content = (
                  <>
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[7px] uppercase tracking-[0.17em] text-white/25">
                          {String(
                            index + 1,
                          ).padStart(
                            2,
                            "0",
                          )}
                        </span>

                        <span className="h-px w-5 bg-white/10" />

                        <span className="font-mono text-[7px] uppercase tracking-[0.17em] text-white/25">
                          {mastersTournament.code}
                        </span>
                      </div>

                      <h3 className="mt-3 text-sm font-black uppercase tracking-[-0.02em]">
                        {mastersTournament.name}
                      </h3>

                      {isCurrent ? (
                        <span className="mt-3 inline-flex items-center gap-2 rounded-full border border-[var(--tournament-primary)]/25 bg-[var(--tournament-primary)]/8 px-3 py-1.5 font-mono text-[6px] font-black uppercase tracking-[0.16em] text-[var(--tournament-primary)]">
                          <CircleDot
                            size={10}
                            aria-hidden="true"
                          />
                          You are here
                        </span>
                      ) : null}
                    </div>

                    {isCurrent ? (
                      <CircleDot
                        size={15}
                        aria-hidden="true"
                      />
                    ) : (
                      <ChevronRight
                        size={15}
                        className="text-white/18 transition group-hover:translate-x-0.5 group-hover:text-white/55"
                        aria-hidden="true"
                      />
                    )}
                  </>
                );

                if (isCurrent) {
                  return (
                    <div
                      key={mastersTournament.slug}
                      aria-current="page"
                      className="flex min-h-[128px] items-center justify-between gap-4 bg-[#07101D] px-6 py-5 text-[var(--tournament-primary)]"
                    >
                      {content}
                    </div>
                  );
                }

                return (
                  <Link
                    key={mastersTournament.slug}
                    href={getMasters1000Href(
                      mastersTournament.slug,
                    )}
                    className="group flex min-h-[128px] items-center justify-between gap-4 bg-[#07101D] px-6 py-5 text-white/50 transition hover:bg-white/[0.025] hover:text-white"
                  >
                    {content}
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
      className={`group flex min-h-[180px] items-center gap-6 rounded-[2rem] border border-white/10 bg-[#07101D] p-7 transition hover:-translate-y-1 hover:border-[var(--tournament-primary)] sm:p-8 ${
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
            ? "Previous Masters"
            : "Next Masters"}
        </p>

        <h2 className="mt-4 text-2xl font-black uppercase tracking-[-0.035em]">
          {name}
        </h2>

        <span className="mt-4 inline-flex items-center gap-2 font-mono text-[7px] font-black uppercase tracking-[0.16em] text-white/24 transition group-hover:text-[var(--tournament-primary)]">
          {isPrevious ? (
            <>
              <ArrowLeft
                size={11}
                aria-hidden="true"
              />
              Previous archive
            </>
          ) : (
            <>
              Next archive
              <ArrowRight
                size={11}
                aria-hidden="true"
              />
            </>
          )}
        </span>
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
      href="/results/masters-1000"
      className="group flex min-h-[180px] items-center justify-between gap-6 rounded-[2rem] border border-white/10 bg-[#07101D] p-7 transition hover:-translate-y-1 hover:border-[var(--tournament-primary)] sm:p-8"
    >
      <div>
        <p className="font-mono text-[8px] font-black uppercase tracking-[0.18em] text-white/25">
          Masters 1000 index
        </p>

        <h2 className="mt-4 text-2xl font-black uppercase tracking-[-0.035em]">
          All tournaments
        </h2>

        <span className="mt-4 inline-flex items-center gap-2 font-mono text-[7px] font-black uppercase tracking-[0.16em] text-white/24 transition group-hover:text-[var(--tournament-primary)]">
          Open Masters hub
          <ArrowRight
            size={11}
            aria-hidden="true"
          />
        </span>
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