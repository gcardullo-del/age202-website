"use client";

import Image from "next/image";
import Link from "next/link";

import {
  ArrowDown,
  ArrowUp,
  Check,
  Search,
  UserRound,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";

type PlayerOption = {
  id: string;
  name: string;
  slug: string;
  nickname: string | null;
  country: string | null;
  heroImage: string | null;
  portraitImage: string | null;
  accent: string;
  collectionType: string;
  displayOrder: number | null;
};

type AdminPlayerPickerProps = {
  name: string;
  label: string;
  description?: string;
  players: PlayerOption[];
  defaultValue?: string[];
  maxSelected?: number;
};

export default function AdminPlayerPicker({
  name,
  label,
  description,
  players,
  defaultValue = [],
  maxSelected = 5,
}: AdminPlayerPickerProps) {
  const [query, setQuery] =
    useState("");

  const [
    selectedIds,
    setSelectedIds,
  ] =
    useState<string[]>(
      defaultValue,
    );

  const filteredPlayers =
    useMemo(() => {
      const normalized =
        query
          .trim()
          .toLowerCase();

      if (!normalized) {
        return players;
      }

      return players.filter(
        (player) =>
          [
            player.name,
            player.nickname ?? "",
            player.country ?? "",
            player.slug,
            player.collectionType,
          ]
            .join(" ")
            .toLowerCase()
            .includes(normalized),
      );
    }, [
      players,
      query,
    ]);

  const selectedPlayers =
    useMemo(
      () =>
        selectedIds
          .map(
            (id) =>
              players.find(
                (player) =>
                  player.id === id,
              ),
          )
          .filter(
            (
              player,
            ): player is PlayerOption =>
              Boolean(player),
          ),
      [
        players,
        selectedIds,
      ],
    );

  function togglePlayer(
    playerId: string,
  ) {
    setSelectedIds(
      (current) => {
        if (
          current.includes(
            playerId,
          )
        ) {
          return current.filter(
            (id) =>
              id !==
              playerId,
          );
        }

        if (
          current.length >=
          maxSelected
        ) {
          return current;
        }

        return [
          ...current,
          playerId,
        ];
      },
    );
  }

  function movePlayer(
    index: number,
    direction:
      | "up"
      | "down",
  ) {
    setSelectedIds(
      (current) => {
        const next =
          [...current];

        const targetIndex =
          direction === "up"
            ? index - 1
            : index + 1;

        if (
          targetIndex < 0 ||
          targetIndex >=
            next.length
        ) {
          return current;
        }

        const currentValue =
          next[index];

        next[index] =
          next[
            targetIndex
          ];

        next[targetIndex] =
          currentValue;

        return next;
      },
    );
  }

  return (
    <div className="space-y-6">
      <input
        type="hidden"
        name={name}
        value={JSON.stringify(
          selectedIds,
        )}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-white/80">
            {label}
          </p>

          {description ? (
            <p className="mt-1 max-w-2xl text-xs leading-5 text-white/35">
              {description}
            </p>
          ) : null}
        </div>

        <div className="shrink-0 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-[8px] font-black uppercase tracking-[0.15em] text-white/40">
          {selectedIds.length}
          {" / "}
          {maxSelected}
          {" selected"}
        </div>
      </div>

      {selectedPlayers.length >
      0 ? (
        <div className="space-y-3">
          <div>
            <p className="font-mono text-[8px] font-black uppercase tracking-[0.17em] text-lime-200/60">
              Homepage order
            </p>

            <p className="mt-2 text-xs text-white/30">
              Use the arrows to
              control the order
              shown on the homepage.
            </p>
          </div>

          {selectedPlayers.map(
            (
              player,
              index,
            ) => {
              const image =
                player.portraitImage ??
                player.heroImage;

              return (
                <div
                  key={
                    player.id
                  }
                  className="flex flex-col gap-4 rounded-3xl border border-lime-300/15 bg-lime-300/[0.035] p-4 sm:flex-row sm:items-center"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-4">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-lime-300/20 bg-lime-300/10 font-mono text-xs font-black text-lime-200">
                      {String(
                        index + 1,
                      ).padStart(
                        2,
                        "0",
                      )}
                    </div>

                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-[#050B18]">
                      {image ? (
                        <Image
                          src={
                            image
                          }
                          alt={
                            player.name
                          }
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 grid place-items-center">
                          <UserRound className="h-6 w-6 text-white/20" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">
                        {
                          player.name
                        }
                      </p>

                      <p className="mt-1 truncate text-xs text-white/35">
                        {player.nickname ??
                          player.country ??
                          "AGE202 Player"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <Link
                      href={`/admin/players/${player.id}`}
                      className="inline-flex h-10 items-center justify-center rounded-xl border border-white/10 px-3 text-xs font-semibold text-white/45 transition hover:bg-white/[0.05] hover:text-white"
                    >
                      Edit
                    </Link>

                    <button
                      type="button"
                      onClick={() =>
                        movePlayer(
                          index,
                          "up",
                        )
                      }
                      disabled={
                        index === 0
                      }
                      aria-label={`Move ${player.name} up`}
                      className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-white/45 transition hover:bg-white/[0.05] hover:text-white disabled:cursor-not-allowed disabled:opacity-20"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        movePlayer(
                          index,
                          "down",
                        )
                      }
                      disabled={
                        index ===
                        selectedPlayers.length -
                          1
                      }
                      aria-label={`Move ${player.name} down`}
                      className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-white/45 transition hover:bg-white/[0.05] hover:text-white disabled:cursor-not-allowed disabled:opacity-20"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            },
          )}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.015] p-6 text-sm text-white/35">
          No homepage players
          selected yet.
        </div>
      )}

      <div className="space-y-4">
        <label className="relative block">
          <span className="sr-only">
            Search players
          </span>

          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />

          <input
            type="search"
            value={query}
            onChange={(
              event,
            ) =>
              setQuery(
                event.target
                  .value,
              )
            }
            placeholder="Search player, country or classification..."
            className="h-12 w-full rounded-2xl border border-white/10 bg-[#08111F] pl-11 pr-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-lime-300/35"
          />
        </label>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredPlayers.map(
            (player) => {
              const selected =
                selectedIds.includes(
                  player.id,
                );

              const selectionDisabled =
                !selected &&
                selectedIds.length >=
                  maxSelected;

              const image =
                player.portraitImage ??
                player.heroImage;

              return (
                <button
                  type="button"
                  key={
                    player.id
                  }
                  disabled={
                    selectionDisabled
                  }
                  onClick={() =>
                    togglePlayer(
                      player.id,
                    )
                  }
                  className={[
                    "group overflow-hidden rounded-3xl border text-left transition duration-200",
                    selected
                      ? "border-lime-300/35 bg-lime-300/[0.06]"
                      : "border-white/10 bg-[#08111F] hover:border-white/20 hover:bg-white/[0.035]",
                    selectionDisabled
                      ? "cursor-not-allowed opacity-35"
                      : "",
                  ].join(
                    " ",
                  )}
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#050B18]">
                    {image ? (
                      <Image
                        src={
                          image
                        }
                        alt={
                          player.name
                        }
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition duration-500 group-hover:scale-[1.025]"
                      />
                    ) : (
                      <div className="absolute inset-0 grid place-items-center">
                        <UserRound className="h-10 w-10 text-white/15" />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-[#050B18] via-transparent to-transparent" />

                    <span
                      className={[
                        "absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border transition",
                        selected
                          ? "border-lime-200/50 bg-lime-300 text-[#050B18]"
                          : "border-white/15 bg-[#030812]/60 text-white/30 backdrop-blur",
                      ].join(
                        " ",
                      )}
                    >
                      {selected ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <span className="font-mono text-xs">
                          +
                        </span>
                      )}
                    </span>
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">
                          {
                            player.name
                          }
                        </p>

                        <p className="mt-1 truncate text-xs text-white/35">
                          {player.country ??
                            "Country unavailable"}
                        </p>
                      </div>

                      <span
                        className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{
                          backgroundColor:
                            player.accent,
                        }}
                      />
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[7px] font-black uppercase tracking-[0.13em] text-white/35">
                        {
                          player.collectionType
                        }
                      </span>

                      {selected ? (
                        <span className="rounded-full border border-lime-300/20 bg-lime-300/[0.07] px-2.5 py-1 font-mono text-[7px] font-black uppercase tracking-[0.13em] text-lime-200">
                          Homepage{" "}
                          {selectedIds.indexOf(
                            player.id,
                          ) +
                            1}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </button>
              );
            },
          )}
        </div>
      </div>
    </div>
  );
}