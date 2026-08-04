"use client";

import {
  Check,
  Gem,
  Search,
  Shirt,
  Star,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";

import {
  updateCollectionArtifacts,
} from "../actions/updateCollectionArtifacts";

export type CollectionArtifactOption = {
  id: string;
  title: string;
  subtitle: string | null;
  archiveNumber: string;
  year: number | null;
  category: string | null;
  rarity: string;
  status: string;
  playerName: string;
  brandName: string;
  imageUrl: string | null;
};

type CollectionArtifactsManagerProps = {
  collectionId: string;
  artifacts: CollectionArtifactOption[];
  selectedArtifactIds: string[];
  featuredArtifactIds: string[];
};

export default function CollectionArtifactsManager({
  collectionId,
  artifacts,
  selectedArtifactIds,
  featuredArtifactIds,
}: CollectionArtifactsManagerProps) {
  const [query, setQuery] =
    useState("");

  const [
    selectedIds,
    setSelectedIds,
  ] = useState<string[]>(
    selectedArtifactIds,
  );

  const [
    featuredIds,
    setFeaturedIds,
  ] = useState<string[]>(
    featuredArtifactIds,
  );

  const filteredArtifacts =
    useMemo(() => {
      const normalized =
        query
          .trim()
          .toLowerCase();

      if (!normalized) {
        return artifacts;
      }

      return artifacts.filter(
        (artifact) =>
          [
            artifact.title,
            artifact.subtitle ??
              "",
            artifact.archiveNumber,
            artifact.playerName,
            artifact.brandName,
            artifact.category ??
              "",
            artifact.rarity,
            artifact.year?.toString() ??
              "",
          ]
            .join(" ")
            .toLowerCase()
            .includes(
              normalized,
            ),
      );
    }, [
      artifacts,
      query,
    ]);

  function toggleArtifact(
    artifactId: string,
  ) {
    setSelectedIds(
      (current) => {
        if (
          current.includes(
            artifactId,
          )
        ) {
          setFeaturedIds(
            (featured) =>
              featured.filter(
                (id) =>
                  id !==
                  artifactId,
              ),
          );

          return current.filter(
            (id) =>
              id !==
              artifactId,
          );
        }

        return [
          ...current,
          artifactId,
        ];
      },
    );
  }

  function toggleFeatured(
    artifactId: string,
  ) {
    if (
      !selectedIds.includes(
        artifactId,
      )
    ) {
      return;
    }

    setFeaturedIds(
      (current) =>
        current.includes(
          artifactId,
        )
          ? current.filter(
              (id) =>
                id !==
                artifactId,
            )
          : [
              ...current,
              artifactId,
            ],
    );
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025]">
      <div className="flex flex-col gap-4 border-b border-white/10 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-lime-200/70">
            <Gem className="h-4 w-4" />
            Collection content
          </div>

          <h2 className="mt-2 text-2xl font-semibold text-white">
            Artifacts
          </h2>

          <p className="mt-2 text-sm leading-6 text-white/40">
            Add historic garments and collectible objects to this museum collection.
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
          updateCollectionArtifacts
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
          (artifactId) => (
            <input
              key={artifactId}
              type="hidden"
              name="artifactIds"
              value={artifactId}
            />
          ),
        )}

        {featuredIds.map(
          (artifactId) => (
            <input
              key={artifactId}
              type="hidden"
              name="featuredArtifactIds"
              value={artifactId}
            />
          ),
        )}

        <div className="border-b border-white/10 p-5 sm:p-6">
          <label className="relative block">
            <span className="sr-only">
              Search artifacts
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
              placeholder="Search title, archive number, player, brand or year..."
              className="h-12 w-full rounded-2xl border border-white/10 bg-[#08111F] pl-11 pr-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-lime-300/35"
            />
          </label>
        </div>

        <div className="p-5 sm:p-6">
          {filteredArtifacts.length >
          0 ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredArtifacts.map(
                (artifact) => {
                  const selected =
                    selectedIds.includes(
                      artifact.id,
                    );

                  const featured =
                    featuredIds.includes(
                      artifact.id,
                    );

                  return (
                    <article
                      key={
                        artifact.id
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
                          toggleArtifact(
                            artifact.id,
                          )
                        }
                        className="block w-full text-left"
                      >
                        <div className="relative aspect-[16/10] overflow-hidden bg-[#050B18]">
                          {artifact.imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={
                                artifact.imageUrl
                              }
                              alt={
                                artifact.title
                              }
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 grid place-items-center">
                              <Shirt className="h-10 w-10 text-white/20" />
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
                              <Gem className="h-4 w-4" />
                            )}
                          </span>

                          {featured ? (
                            <span className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/15 px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.16em] text-amber-200 backdrop-blur">
                              <Star className="h-3.5 w-3.5 fill-current" />
                              Featured
                            </span>
                          ) : null}
                        </div>

                        <div className="p-4">
                          <p className="text-[8px] font-black uppercase tracking-[0.16em] text-lime-300/70">
                            {
                              artifact.archiveNumber
                            }
                          </p>

                          <h3 className="mt-2 line-clamp-2 text-base font-semibold text-white">
                            {
                              artifact.title
                            }
                          </h3>

                          <p className="mt-2 text-xs text-white/35">
                            {artifact.playerName} ·{" "}
                            {artifact.brandName}
                            {artifact.year
                              ? ` · ${artifact.year}`
                              : ""}
                          </p>

                          <p className="mt-2 text-[9px] font-semibold uppercase tracking-[0.14em] text-white/25">
                            {artifact.category ??
                              "Uncategorized"}{" "}
                            · {artifact.rarity}
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
                            toggleFeatured(
                              artifact.id,
                            )
                          }
                          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 px-4 py-2.5 text-xs font-semibold text-white/55 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <Star className="h-4 w-4" />

                          {featured
                            ? "Remove featured"
                            : "Mark as featured"}
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
                <Gem className="mx-auto h-9 w-9 text-white/20" />

                <h3 className="mt-4 text-lg font-semibold text-white">
                  No artifacts found
                </h3>

                <p className="mt-2 text-sm text-white/40">
                  Adjust the search or create artifacts in the Artifacts CMS first.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 bg-[#050B18]/70 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <p className="text-sm text-white/35">
            Artifact order follows the current selection order.
          </p>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-lime-300 px-5 py-3 text-sm font-semibold text-[#050B18] transition hover:bg-lime-200"
          >
            <Check className="h-4 w-4" />
            Save artifacts
          </button>
        </div>
      </form>
    </section>
  );
}
