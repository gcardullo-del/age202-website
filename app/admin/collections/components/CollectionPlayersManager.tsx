"use client";

import {
  Check,
  Crown,
  Search,
  UserRound,
  Users,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";

import {
  updateCollectionPlayers,
} from "../actions/updateCollectionPlayers";

export type CollectionPlayerOption = {
  id: string;
  name: string;
  firstName: string | null;
  lastName: string | null;
  nickname: string | null;
  country: string | null;
  portraitImage: string | null;
  heroImage: string | null;
  active: boolean;
};

type CollectionPlayersManagerProps = {
  collectionId: string;
  players: CollectionPlayerOption[];
  selectedPlayerIds: string[];
  featuredPlayerId: string | null;
};

export default function CollectionPlayersManager({
  collectionId,
  players,
  selectedPlayerIds,
  featuredPlayerId,
}: CollectionPlayersManagerProps) {
  const [query, setQuery] =
    useState("");

  const [
    selectedIds,
    setSelectedIds,
  ] = useState<string[]>(
    selectedPlayerIds,
  );

  const [
    featuredId,
    setFeaturedId,
  ] = useState<string | null>(
    featuredPlayerId,
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
            player.firstName ??
              "",
            player.lastName ??
              "",
            player.nickname ??
              "",
            player.country ??
              "",
          ]
            .join(" ")
            .toLowerCase()
            .includes(
              normalized,
            ),
      );
    }, [
      players,
      query,
    ]);

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
          const next =
            current.filter(
              (id) =>
                id !==
                playerId,
            );

          if (
            featuredId ===
            playerId
          ) {
            setFeaturedId(
              null,
            );
          }

          return next;
        }

        return [
          ...current,
          playerId,
        ];
      },
    );
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025]">
      <div className="flex flex-col gap-4 border-b border-white/10 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-lime-200/70">
            <Users className="h-4 w-4" />
            Collection content
          </div>

          <h2 className="mt-2 text-2xl font-semibold text-white">
            Players
          </h2>

          <p className="mt-2 text-sm leading-6 text-white/40">
            Connect one or more players to this museum collection and choose the primary champion.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#08111F] px-4 py-3 text-sm text-white/45">
          <span className="font-semibold text-white">
            {selectedIds.length}
          </span>{" "}
          selected
        </div>
      </div>

      <form
        action={
          updateCollectionPlayers
        }
      >
        <input
          type="hidden"
          name="collectionId"
          value={
            collectionId
          }
        />

        {selectedIds.map(
          (playerId) => (
            <input
              key={playerId}
              type="hidden"
              name="playerIds"
              value={playerId}
            />
          ),
        )}

        <input
          type="hidden"
          name="featuredPlayerId"
          value={
            featuredId ?? ""
          }
        />

        <div className="border-b border-white/10 p-5 sm:p-6">
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
              placeholder="Search by name, nickname or country..."
              className="h-12 w-full rounded-2xl border border-white/10 bg-[#08111F] pl-11 pr-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-lime-300/35"
            />
          </label>
        </div>

        <div className="p-5 sm:p-6">
          {filteredPlayers.length >
          0 ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredPlayers.map(
                (player) => {
                  const selected =
                    selectedIds.includes(
                      player.id,
                    );

                  const featured =
                    featuredId ===
                    player.id;

                  const image =
                    player.portraitImage ??
                    player.heroImage;

                  return (
                    <article
                      key={
                        player.id
                      }
                      className={[
                        "overflow-hidden rounded-3xl border transition",
                        selected
                          ? "border-lime-300/40 bg-lime-300/[0.05]"
                          : "border-white/10 bg-[#08111F]",
                      ].join(
                        " ",
                      )}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          togglePlayer(
                            player.id,
                          )
                        }
                        className="block w-full text-left"
                      >
                        <div className="relative aspect-[16/10] overflow-hidden bg-[#050B18]">
                          {image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={image}
                              alt={
                                player.name
                              }
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 grid place-items-center">
                              <UserRound className="h-10 w-10 text-white/20" />
                            </div>
                          )}

                          <div className="absolute inset-0 bg-gradient-to-t from-[#050B18] via-transparent to-transparent" />

                          <span
                            className={[
                              "absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border backdrop-blur",
                              selected
                                ? "border-lime-200/50 bg-lime-300 text-[#050B18]"
                                : "border-white/15 bg-black/55 text-white/45",
                            ].join(
                              " ",
                            )}
                          >
                            {selected ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <UserRound className="h-4 w-4" />
                            )}
                          </span>

                          {featured ? (
                            <span className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/15 px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.16em] text-amber-200 backdrop-blur">
                              <Crown className="h-3.5 w-3.5" />
                              Primary
                            </span>
                          ) : null}
                        </div>

                        <div className="p-4">
                          <h3 className="text-base font-semibold text-white">
                            {
                              player.name
                            }
                          </h3>

                          <p className="mt-1 text-xs text-white/35">
                            {player.nickname
                              ? `“${player.nickname}”`
                              : player.country ??
                                "Country not specified"}
                          </p>
                        </div>
                      </button>

                      <div className="border-t border-white/10 p-4">
                        <button
                          type="button"
                          disabled={
                            !selected
                          }
                          onClick={() =>
                            setFeaturedId(
                              featured
                                ? null
                                : player.id,
                            )
                          }
                          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 px-4 py-2.5 text-xs font-semibold text-white/55 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <Crown className="h-4 w-4" />

                          {featured
                            ? "Remove primary"
                            : "Set as primary"}
                        </button>
                      </div>
                    </article>
                  );
                },
              )}
            </div>
          ) : (
            <div className="grid min-h-56 place-items-center rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center">
              <div>
                <UserRound className="mx-auto h-9 w-9 text-white/20" />

                <h3 className="mt-4 text-lg font-semibold text-white">
                  No players found
                </h3>

                <p className="mt-2 text-sm text-white/40">
                  Adjust the search or create players in the Players CMS first.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 bg-[#050B18]/70 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <p className="text-sm text-white/35">
            The selected order is preserved when the collection is saved.
          </p>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-lime-300 px-5 py-3 text-sm font-semibold text-[#050B18] transition hover:bg-lime-200"
          >
            <Check className="h-4 w-4" />
            Save players
          </button>
        </div>
      </form>
    </section>
  );
}
