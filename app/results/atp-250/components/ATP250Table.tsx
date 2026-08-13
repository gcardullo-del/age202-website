import {
  MapPin,
} from "lucide-react";

import type {
  ATP250PublicTournament,
} from "@/lib/mappers/atp-250-cms.mapper";

function surfaceClasses(
  surface: "HARD" | "CLAY" | "GRASS",
) {
  if (surface === "CLAY") {
    return {
      badge:
        "border-[#C96A3A]/35 bg-[#C96A3A]/10 text-[#E58A5B]",
      dot:
        "bg-[#E58A5B]",
    };
  }

  if (surface === "GRASS") {
    return {
      badge:
        "border-[#A8D94F]/35 bg-[#A8D94F]/10 text-[#B8FF4A]",
      dot:
        "bg-[#B8FF4A]",
    };
  }

  return {
    badge:
      "border-[#4FB4FF]/35 bg-[#4FB4FF]/10 text-[#6AC4FF]",
    dot:
      "bg-[#6AC4FF]",
  };
}

function formatLeaderNames(
  names: readonly string[],
): string {
  if (names.length <= 2) {
    return names.join(" · ");
  }

  return `${names.slice(0, 2).join(" · ")} +${names.length - 2} tied`;
}

type ATP250TableProps = {
  tournaments: readonly ATP250PublicTournament[];
};

export default function ATP250Table({
  tournaments,
}: ATP250TableProps) {
  return (
    <section className="px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
      <div className="mx-auto max-w-[1700px]">
        <div className="mb-8 border-b border-white/10 pb-6">
          <div className="text-[10px] font-black uppercase tracking-[0.24em] text-[#B8FF4A]">
            ATP 250 Tournament Index
          </div>

          <h2 className="mt-3 text-4xl font-black uppercase tracking-[-0.045em] sm:text-5xl">
            The complete ATP 250 table.
          </h2>

          <p className="mt-4 max-w-3xl text-sm leading-6 text-white/45">
            Essential tournament information, historical title leaders
            and the latest completed final in one compact AGE202 archive.
          </p>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-white/10 bg-[#08101F]">
          <table className="w-full min-w-[1650px] border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.025]">
                <Th>Tournament</Th>
                <Th>Country</Th>
                <Th>City</Th>
                <Th>Founded</Th>
                <Th>Surface</Th>
                <Th>Short history</Th>
                <Th>Leader</Th>
                <Th>Latest winner</Th>
              </tr>
            </thead>

            <tbody>
              {tournaments.map(
                (
                  tournament,
                  index,
                ) => {
                  const surface =
                    surfaceClasses(
                      tournament.surface,
                    );

                  return (
                    <tr
                      key={
                        tournament.slug
                      }
                      className="border-b border-white/[0.07] transition last:border-b-0 hover:bg-white/[0.025]"
                    >
                      <Td className="align-top">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 flex h-8 min-w-8 items-center justify-center rounded-lg border border-[#B8FF4A]/25 bg-[#B8FF4A]/[0.08] px-2 text-[10px] font-black text-[#B8FF4A]">
                            {String(
                              index + 1,
                            ).padStart(
                              2,
                              "0",
                            )}
                          </div>

                          <div>
                            <div className="text-[9px] font-black uppercase tracking-[0.16em] text-[#B8FF4A]/65">
                              ATP 250
                            </div>

                            <div className="mt-1 text-base font-black uppercase leading-[1.05] tracking-[-0.025em] text-white">
                              {
                                tournament.name
                              }
                            </div>
                          </div>
                        </div>
                      </Td>

                      <Td className="align-top">
                        <div className="flex items-center gap-2">
                          <span className="rounded-md border border-white/10 bg-white/[0.025] px-2 py-1 text-[9px] font-black tracking-[0.14em] text-white/55">
                            {
                              tournament.countryCode
                            }
                          </span>

                          <span className="text-sm text-white/60">
                            {
                              tournament.country
                            }
                          </span>
                        </div>
                      </Td>

                      <Td className="align-top">
                        <div className="flex items-center gap-2 text-sm text-white/60">
                          <MapPin
                            className="h-3.5 w-3.5 text-white/25"
                            aria-hidden="true"
                          />

                          {
                            tournament.city
                          }
                        </div>
                      </Td>

                      <Td className="align-top">
                        <div className="text-sm font-black text-white/68">
                          {
                            tournament.foundedYear
                          }
                        </div>
                      </Td>

                      <Td className="align-top">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[9px] font-black uppercase tracking-[0.14em] ${surface.badge}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${surface.dot}`}
                          />

                          {
                            tournament.surface
                          }
                        </span>
                      </Td>

                      <Td className="align-top">
                        <p className="max-w-[500px] text-sm leading-6 text-white/52">
                          {
                            tournament.shortHistory
                          }
                        </p>
                      </Td>

                      <Td className="align-top">
                        <div className="min-w-[180px] max-w-[240px]">
                          <div
                            className="text-sm font-black uppercase leading-5 tracking-[-0.015em] text-white"
                            title={
                              tournament.leader.names.join(
                                " · ",
                              )
                            }
                          >
                            {formatLeaderNames(
                              tournament.leader.names,
                            )}
                          </div>

                          <div className="mt-2 text-base font-black text-[#B8FF4A]">
                            {
                              tournament.leader.titles
                            }{" "}
                            🏆
                          </div>
                        </div>
                      </Td>

                      <Td className="align-top">
                        <div className="min-w-[240px]">
                          <div className="text-[9px] font-black uppercase tracking-[0.16em] text-white/28">
                            {
                              tournament
                                .latestFinal
                                .year
                            }
                            {" "}
                            final
                          </div>

                          <div className="mt-1.5 text-sm font-black uppercase tracking-[-0.015em] text-white">
                            {
                              tournament
                                .latestFinal
                                .champion
                            }
                          </div>

                          <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white/35">
                            d.{" "}
                            {
                              tournament
                                .latestFinal
                                .runnerUp
                            }
                          </div>

                          <div className="mt-2 inline-flex rounded-lg border border-white/10 bg-white/[0.025] px-2.5 py-1.5 text-[11px] font-black text-white/70">
                            {
                              tournament
                                .latestFinal
                                .score
                            }
                          </div>
                        </div>
                      </Td>
                    </tr>
                  );
                },
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-[9px] font-black uppercase tracking-[0.17em] text-white/28">
          <span>
            AGE202 · ATP 250 Archive
          </span>

          <span>
            Hard · Clay · Grass
          </span>
        </div>
      </div>
    </section>
  );
}

type ThProps = {
  children: React.ReactNode;
};

function Th({
  children,
}: ThProps) {
  return (
    <th className="px-5 py-4 text-left text-[9px] font-black uppercase tracking-[0.18em] text-white/32">
      {children}
    </th>
  );
}

type TdProps = {
  children: React.ReactNode;
  className?: string;
};

function Td({
  children,
  className = "",
}: TdProps) {
  return (
    <td
      className={`px-5 py-5 ${className}`}
    >
      {children}
    </td>
  );
}