"use client";

import {
  CheckCircle2,
  ShieldCheck,
  Trophy,
} from "lucide-react";


export type AdminTrophyWin = {
  id: string;
  tournamentKey: string;
  tournamentName: string;
  category:
    | "GRAND_SLAM"
    | "WTA_1000"
    | "WTA_FINALS"
    | "OLYMPICS"
    | "OTHER";
  year: number;
  sourceUrl: string | null;
  verified: boolean;
};


type TrophyCabinetSectionProps = {
  wins: AdminTrophyWin[];
  isWtaPlayer: boolean;
};


function groupByTournament(
  wins: AdminTrophyWin[],
) {
  const groups =
    new Map<
      string,
      {
        tournamentName: string;
        years: number[];
      }
    >();

  for (const win of wins) {
    const current =
      groups.get(
        win.tournamentKey,
      );

    if (current) {
      current.years.push(
        win.year,
      );

      continue;
    }

    groups.set(
      win.tournamentKey,
      {
        tournamentName:
          win.tournamentName,
        years: [
          win.year,
        ],
      },
    );
  }

  return Array.from(
    groups.values(),
  )
    .map(
      (group) => ({
        ...group,
        years:
          [...group.years].sort(
            (
              first,
              second,
            ) =>
              second -
              first,
          ),
      }),
    )
    .sort(
      (
        first,
        second,
      ) =>
        first.tournamentName.localeCompare(
          second.tournamentName,
        ),
    );
}


export default function TrophyCabinetSection({
  wins,
  isWtaPlayer,
}: TrophyCabinetSectionProps) {
  const relevantWins =
    wins.filter(
      (win) =>
        win.category ===
          "GRAND_SLAM" ||
        win.category ===
          "WTA_1000",
    );

  const grandSlams =
    relevantWins.filter(
      (win) =>
        win.category ===
        "GRAND_SLAM",
    );

  const wta1000 =
    relevantWins.filter(
      (win) =>
        win.category ===
        "WTA_1000",
    );

  const grandSlamGroups =
    groupByTournament(
      grandSlams,
    );

  const wta1000Groups =
    groupByTournament(
      wta1000,
    );

  const verifiedCount =
    relevantWins.filter(
      (win) =>
        win.verified,
    ).length;

  return (
    <section className="space-y-7">
      <input
        type="hidden"
        name="trophyWinCount"
        value={
          relevantWins.length
        }
      />

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-200/70">
          Trophy Cabinet
        </p>

        <h2 className="mt-2 text-2xl font-semibold text-white">
          Grand Slams & WTA 1000
        </h2>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-white/40">
          This cabinet is generated from the verified PlayerTrophyWin archive.
          New WTA Grand Slam and WTA 1000 victories are added by the automated sync.
        </p>
      </div>

      {!isWtaPlayer ? (
        <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6">
          <div className="flex items-start gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.04]">
              <Trophy className="h-5 w-5 text-white/35" />
            </div>

            <div>
              <h3 className="text-base font-semibold text-white">
                WTA Trophy Cabinet
              </h3>

              <p className="mt-2 text-sm leading-6 text-white/40">
                The automated Trophy Cabinet currently applies to WTA-linked profiles.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {isWtaPlayer ? (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <Metric
              label="Grand Slam titles"
              value={grandSlams.length}
            />

            <Metric
              label="WTA 1000 titles"
              value={wta1000.length}
            />

            <Metric
              label="Verified wins"
              value={`${verifiedCount}/${relevantWins.length}`}
            />
          </div>

          {relevantWins.length > 0 ? (
            <div className="grid gap-5 xl:grid-cols-2">
              <CabinetColumn
                title="Grand Slams"
                subtitle={`${grandSlams.length} titles`}
                groups={
                  grandSlamGroups
                }
              />

              <CabinetColumn
                title="WTA 1000"
                subtitle={`${wta1000.length} titles`}
                groups={
                  wta1000Groups
                }
              />
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.015] p-8 text-center">
              <Trophy className="mx-auto h-8 w-8 text-white/20" />

              <h3 className="mt-4 text-base font-semibold text-white">
                No qualifying trophies
              </h3>

              <p className="mt-2 text-sm text-white/35">
                No Grand Slam or WTA 1000 victory is stored for this player.
              </p>
            </div>
          )}

          <div className="flex items-start gap-3 rounded-2xl border border-lime-300/15 bg-lime-300/[0.04] p-4">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-lime-200" />

            <p className="text-xs leading-5 text-white/40">
              Trophy records are sync-managed. This CMS view is intentionally read-only
              so manual edits cannot overwrite or duplicate automated historical data.
            </p>
          </div>
        </>
      ) : null}
    </section>
  );
}


function Metric({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#08111F] p-5">
      <p className="font-mono text-[8px] font-black uppercase tracking-[0.15em] text-white/28">
        {label}
      </p>

      <p className="mt-3 text-3xl font-semibold text-white">
        {value}
      </p>
    </div>
  );
}


function CabinetColumn({
  title,
  subtitle,
  groups,
}: {
  title: string;
  subtitle: string;
  groups: Array<{
    tournamentName: string;
    years: number[];
  }>;
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#07101D]">
      <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4">
        <div>
          <p className="text-sm font-semibold text-white">
            {title}
          </p>

          <p className="mt-1 text-[9px] font-black uppercase tracking-[0.14em] text-lime-200/60">
            {subtitle}
          </p>
        </div>

        <div className="grid h-10 w-10 place-items-center rounded-xl border border-lime-300/15 bg-lime-300/[0.05]">
          <Trophy className="h-4 w-4 text-lime-200" />
        </div>
      </div>

      {groups.length > 0 ? (
        <div className="divide-y divide-white/10">
          {groups.map(
            (group) => (
              <div
                key={
                  group.tournamentName
                }
                className="px-5 py-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {group.tournamentName}
                    </p>

                    <p className="mt-2 text-xs leading-5 text-white/35">
                      {group.years.join(
                        " · ",
                      )}
                    </p>
                  </div>

                  <span className="inline-flex items-center gap-1.5 rounded-full border border-lime-300/15 bg-lime-300/[0.05] px-2.5 py-1 font-mono text-[8px] font-black text-lime-200">
                    <CheckCircle2 className="h-3 w-3" />
                    ×{group.years.length}
                  </span>
                </div>
              </div>
            ),
          )}
        </div>
      ) : (
        <div className="px-5 py-8 text-center text-sm text-white/30">
          No titles in this category.
        </div>
      )}
    </div>
  );
}
