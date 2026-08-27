"use client";

import {
  Check,
  Link2,
  Search,
  Trophy,
  Unlink,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";

import {
  usePlayerStudio,
} from "../PlayerStudioForm";


export type AvailableTourPlayer = {
  id: string;
  rank: number;
  previousRank: number | null;
  name: string;
  firstName: string | null;
  lastName: string | null;
  slug: string;
  country: string;
  countryCode: string;
  points: number | null;
  age: number | null;
  imageUrl: string | null;
};


type TourKey =
  | "ATP"
  | "WTA";


type AtpSectionProps = {
  availableAtpPlayers: AvailableTourPlayer[];
  availableWtaPlayers: AvailableTourPlayer[];
  initialAtpPlayerId?: string | null;
  initialWtaPlayerId?: string | null;
};


const inputClassName =
  "h-12 w-full rounded-2xl border border-white/10 bg-[#08111F] px-4 text-sm text-white outline-none transition placeholder:text-white/22 focus:border-lime-300/35";


function getMovementLabel(
  rank: number,
  previousRank: number | null,
): string {
  if (
    previousRank === null ||
    previousRank === rank
  ) {
    return "No change";
  }

  const difference =
    previousRank - rank;

  return difference > 0
    ? `Up ${difference}`
    : `Down ${Math.abs(difference)}`;
}


export default function AtpSection({
  availableAtpPlayers,
  availableWtaPlayers,
  initialAtpPlayerId = null,
  initialWtaPlayerId = null,
}: AtpSectionProps) {
  const {
    updatePreview,
  } = usePlayerStudio();

  const initialTour: TourKey =
    initialWtaPlayerId
      ? "WTA"
      : "ATP";

  const [
    activeTour,
    setActiveTour,
  ] =
    useState<TourKey>(
      initialTour,
    );

  const [query, setQuery] =
    useState("");

  const [
    selectedAtpPlayerId,
    setSelectedAtpPlayerId,
  ] =
    useState<string>(
      initialAtpPlayerId ?? "",
    );

  const [
    selectedWtaPlayerId,
    setSelectedWtaPlayerId,
  ] =
    useState<string>(
      initialWtaPlayerId ?? "",
    );

  const activePlayers =
    activeTour === "ATP"
      ? availableAtpPlayers
      : availableWtaPlayers;

  const activeSelectedId =
    activeTour === "ATP"
      ? selectedAtpPlayerId
      : selectedWtaPlayerId;

  const filteredPlayers =
    useMemo(() => {
      const normalized =
        query
          .trim()
          .toLowerCase();

      if (!normalized) {
        return activePlayers;
      }

      return activePlayers.filter(
        (player) =>
          [
            player.name,
            player.firstName ?? "",
            player.lastName ?? "",
            player.country,
            player.countryCode,
            String(player.rank),
          ]
            .join(" ")
            .toLowerCase()
            .includes(normalized),
      );
    }, [
      activePlayers,
      query,
    ]);

  const selectedPlayer =
    useMemo(
      () =>
        activePlayers.find(
          (player) =>
            player.id ===
            activeSelectedId,
        ) ?? null,
      [
        activePlayers,
        activeSelectedId,
      ],
    );

  function selectPlayer(
    player: AvailableTourPlayer,
  ) {
    if (
      activeTour ===
      "ATP"
    ) {
      setSelectedAtpPlayerId(
        player.id,
      );

      setSelectedWtaPlayerId(
        "",
      );
    } else {
      setSelectedWtaPlayerId(
        player.id,
      );

      setSelectedAtpPlayerId(
        "",
      );
    }

    updatePreview({
      ranking:
        player.rank,

      points:
        player.points,

      country:
        player.country,
    });
  }

  function clearSelection() {
    if (
      activeTour ===
      "ATP"
    ) {
      setSelectedAtpPlayerId(
        "",
      );
    } else {
      setSelectedWtaPlayerId(
        "",
      );
    }

    updatePreview({
      ranking:
        null,

      points:
        null,
    });
  }

  function switchTour(
    tour: TourKey,
  ) {
    setActiveTour(
      tour,
    );

    setQuery(
      "",
    );

    const targetPlayers =
      tour === "ATP"
        ? availableAtpPlayers
        : availableWtaPlayers;

    const targetId =
      tour === "ATP"
        ? selectedAtpPlayerId
        : selectedWtaPlayerId;

    const targetPlayer =
      targetPlayers.find(
        (player) =>
          player.id ===
          targetId,
      );

    updatePreview({
      ranking:
        targetPlayer?.rank ??
        null,

      points:
        targetPlayer?.points ??
        null,

      country:
        targetPlayer?.country ??
        null,
    });
  }

  return (
    <section className="space-y-7">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-200/70">
          Tour connection
        </p>

        <h2 className="mt-2 text-2xl font-semibold text-white">
          Link ranking data
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/40">
          Connect this AGE202 profile to one ATP or WTA ranking record.
          Ranking, points and country will be reflected in the live preview.
        </p>
      </div>

      <input
        type="hidden"
        name="atpPlayerId"
        value={
          selectedAtpPlayerId
        }
      />

      <input
        type="hidden"
        name="wtaPlayerId"
        value={
          selectedWtaPlayerId
        }
      />

      <div className="inline-flex rounded-2xl border border-white/10 bg-[#08111F] p-1">
        {(
          [
            "ATP",
            "WTA",
          ] as const
        ).map(
          (tour) => (
            <button
              key={tour}
              type="button"
              onClick={() =>
                switchTour(
                  tour,
                )
              }
              className={[
                "rounded-xl px-5 py-2.5 text-xs font-black uppercase tracking-[0.16em] transition",
                activeTour ===
                tour
                  ? "bg-lime-300 text-[#050B18]"
                  : "text-white/45 hover:text-white",
              ].join(" ")}
            >
              {tour}
            </button>
          ),
        )}
      </div>

      {selectedPlayer ? (
        <div className="rounded-3xl border border-lime-300/25 bg-lime-300/[0.05] p-5">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="grid h-14 w-14 place-items-center rounded-2xl border border-lime-300/20 bg-lime-300/10 text-lime-200">
                <Trophy
                  className="h-6 w-6"
                  aria-hidden="true"
                />
              </div>

              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-lime-200/70">
                  Linked {activeTour} player
                </p>

                <h3 className="mt-1 text-xl font-semibold text-white">
                  {selectedPlayer.name}
                </h3>

                <p className="mt-1 text-sm text-white/40">
                  {selectedPlayer.country} · {activeTour} #{selectedPlayer.rank}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={
                clearSelection
              }
              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-white/10 px-4 text-sm font-semibold text-white/55 transition hover:border-red-300/25 hover:bg-red-300/5 hover:text-red-200"
            >
              <Unlink
                className="h-4 w-4"
                aria-hidden="true"
              />

              Remove link
            </button>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-4">
            <TourMetric
              label="Rank"
              value={`#${selectedPlayer.rank}`}
            />

            <TourMetric
              label="Points"
              value={
                selectedPlayer.points?.toLocaleString(
                  "en-US",
                ) ??
                "—"
              }
            />

            <TourMetric
              label="Age"
              value={
                selectedPlayer.age ??
                "—"
              }
            />

            <TourMetric
              label="Movement"
              value={getMovementLabel(
                selectedPlayer.rank,
                selectedPlayer.previousRank,
              )}
            />
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.015] p-5">
          <div className="flex items-center gap-3">
            <Link2
              className="h-5 w-5 text-white/25"
              aria-hidden="true"
            />

            <div>
              <h3 className="text-sm font-semibold text-white">
                No {activeTour} record linked
              </h3>

              <p className="mt-1 text-xs leading-5 text-white/35">
                Search the available {activeTour} records below and select one player.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <label className="relative block">
          <span className="sr-only">
            Search {activeTour} players
          </span>

          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />

          <input
            type="search"
            value={
              query
            }
            onChange={(event) =>
              setQuery(
                event.target.value,
              )
            }
            placeholder={`Search ${activeTour} name, country or ranking...`}
            className={`${inputClassName} pl-11`}
          />
        </label>

        <div className="max-h-[520px] space-y-3 overflow-y-auto pr-1">
          {filteredPlayers.length > 0 ? (
            filteredPlayers.map(
              (player) => {
                const selected =
                  player.id ===
                  activeSelectedId;

                return (
                  <button
                    key={
                      player.id
                    }
                    type="button"
                    onClick={() =>
                      selectPlayer(
                        player,
                      )
                    }
                    className={[
                      "flex w-full items-center justify-between gap-4 rounded-2xl border p-4 text-left transition",
                      selected
                        ? "border-lime-300/35 bg-lime-300/[0.07]"
                        : "border-white/10 bg-[#08111F] hover:border-white/20 hover:bg-white/[0.04]",
                    ].join(" ")}
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold text-white">
                          {player.name}
                        </span>

                        <span className="rounded-full border border-white/10 px-2 py-1 font-mono text-[7px] font-black uppercase tracking-[0.13em] text-white/35">
                          {activeTour} #{player.rank}
                        </span>
                      </div>

                      <p className="mt-2 text-xs text-white/35">
                        {player.country} ({player.countryCode})
                        {player.points !== null
                          ? ` · ${player.points.toLocaleString("en-US")} points`
                          : ""}
                      </p>
                    </div>

                    <span
                      className={[
                        "grid h-9 w-9 shrink-0 place-items-center rounded-full border",
                        selected
                          ? "border-lime-200/40 bg-lime-300 text-[#050B18]"
                          : "border-white/10 bg-white/[0.04] text-white/30",
                      ].join(" ")}
                    >
                      {selected ? (
                        <Check
                          className="h-4 w-4"
                          aria-hidden="true"
                        />
                      ) : (
                        <Link2
                          className="h-4 w-4"
                          aria-hidden="true"
                        />
                      )}
                    </span>
                  </button>
                );
              },
            )
          ) : (
            <div className="grid min-h-48 place-items-center rounded-3xl border border-dashed border-white/10 bg-white/[0.015] p-8 text-center">
              <div>
                <Search className="mx-auto h-7 w-7 text-white/20" />

                <h3 className="mt-4 text-base font-semibold text-white">
                  No {activeTour} players found
                </h3>

                <p className="mt-2 text-sm text-white/35">
                  Try a different name, country or ranking.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}


type TourMetricProps = {
  label: string;
  value: string | number;
};


function TourMetric({
  label,
  value,
}: TourMetricProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#08111F] p-4">
      <p className="font-mono text-[7px] font-black uppercase tracking-[0.14em] text-white/25">
        {label}
      </p>

      <p className="mt-2 text-lg font-semibold text-white">
        {value}
      </p>
    </div>
  );
}
