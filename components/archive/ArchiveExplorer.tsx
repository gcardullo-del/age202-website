"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import type { Product } from "@/data/product.types";
import { runArchiveEngine } from "@/lib/archive/archiveEngine";
import {
  getArchiveFilterOptions,
  initialArchiveFilters,
} from "@/lib/archive/filters";
import type {
  ArchiveFilters,
  ArchiveSort,
} from "@/lib/archive/types";

import ArchiveGrid from "./ArchiveGrid";

type ArchiveExplorerProps = {
  products: Product[];
};

type ActiveFilter = {
  key: keyof ArchiveFilters;
  label: string;
  value: string;
};

export default function ArchiveExplorer({
  products,
}: ArchiveExplorerProps) {
  const searchParams = useSearchParams();

  const [query, setQuery] = useState("");
  const [filters, setFilters] =
    useState<ArchiveFilters>(initialArchiveFilters);
  const [sort, setSort] =
    useState<ArchiveSort>("newest");

  const filterOptions = useMemo(
    () => getArchiveFilterOptions(products),
    [products]
  );

  useEffect(() => {
    const requestedPlayer = searchParams
      .get("player")
      ?.toLowerCase()
      .trim();

    if (!requestedPlayer) {
      return;
    }

    const normalizedRequestedPlayer = requestedPlayer.replaceAll(
      "-",
      " "
    );

    const matchingPlayer = filterOptions.players.find((player) => {
      const normalizedPlayer = player
        .toLowerCase()
        .replaceAll("-", " ")
        .trim();

      return (
        normalizedPlayer === normalizedRequestedPlayer ||
        normalizedPlayer.includes(normalizedRequestedPlayer)
      );
    });

    if (!matchingPlayer) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      setFilters((currentFilters) => {
        if (currentFilters.player === matchingPlayer) {
          return currentFilters;
        }

        return {
          ...currentFilters,
          player: matchingPlayer,
        };
      });

      document
        .getElementById("archive-explorer")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [searchParams, filterOptions.players]);

  const archiveResult = useMemo(
    () =>
      runArchiveEngine({
        products,
        query,
        filters,
        sort,
      }),
    [products, query, filters, sort]
  );

  const activeFilters = useMemo<ActiveFilter[]>(() => {
    const labels: Record<keyof ArchiveFilters, string> = {
      player: "Player",
      tournament: "Tournament",
      year: "Year",
      brand: "Brand",
      collection: "Collection",
      category: "Category",
      rarity: "Rarity",
      status: "Status",
    };

    const filterEntries = Object.entries(filters) as Array<
      [keyof ArchiveFilters, string]
    >;

    return filterEntries
      .filter(([, value]) => value.trim() !== "")
      .map(([key, value]) => ({
        key,
        label: labels[key],
        value,
      }));
  }, [filters]);

  const hasActiveSearch =
    query.trim().length > 0 ||
    activeFilters.length > 0 ||
    sort !== "newest";

  function updateFilter(
    key: keyof ArchiveFilters,
    value: string
  ) {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [key]: value,
    }));
  }

  function removeFilter(key: keyof ArchiveFilters) {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [key]: "",
    }));
  }

  function resetArchive() {
    setQuery("");
    setFilters(initialArchiveFilters);
    setSort("newest");
  }

  return (
    <section
      id="archive-explorer"
      className="scroll-mt-20 bg-[#050B18]"
    >
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-8 lg:py-24">
        <div className="rounded-[34px] border border-white/10 bg-[#08101F] p-6 md:p-8 lg:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="w-full lg:max-w-2xl">
              <label
                htmlFor="archive-search"
                className="text-[10px] font-black uppercase tracking-[0.32em] text-[#C8FF00]"
              >
                Search the archive
              </label>

              <div className="relative mt-4">
                <input
                  id="archive-search"
                  type="search"
                  value={query}
                  onChange={(event) =>
                    setQuery(event.target.value)
                  }
                  placeholder="Try: Federer Nike 2017"
                  autoComplete="off"
                  className="h-16 w-full rounded-2xl border border-white/10 bg-[#050B18] px-6 pr-16 text-base text-white outline-none transition placeholder:text-gray-600 focus:border-[#C8FF00]/60"
                />

                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 text-xl text-gray-500"
                >
                  ⌕
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-6 lg:justify-end">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.26em] text-gray-600">
                  Results
                </p>

                <p
                  aria-live="polite"
                  className="mt-1 text-4xl font-black text-white"
                >
                  {archiveResult.total}
                </p>
              </div>

              {hasActiveSearch && (
                <button
                  type="button"
                  onClick={resetArchive}
                  className="rounded-full border border-white/10 px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 transition hover:border-[#C8FF00]/40 hover:text-[#C8FF00]"
                >
                  Reset all
                </button>
              )}
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.025] p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.28em] text-[#C8FF00]">
                  Curated discovery paths
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  Enter the archive through one of its most meaningful museum routes.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <DiscoveryButton
                  label="Legendary pieces"
                  active={filters.rarity === "legendary"}
                  onClick={() => updateFilter("rarity", "legendary")}
                />
                <DiscoveryButton
                  label="Authenticated"
                  active={query === "authentic"}
                  onClick={() => setQuery("authentic")}
                />
                <DiscoveryButton
                  label="Available now"
                  active={filters.status === "available"}
                  onClick={() => updateFilter("status", "available")}
                />
                <DiscoveryButton
                  label="Vintage archive"
                  active={query === "vintage"}
                  onClick={() => setQuery("vintage")}
                />
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
            <FilterSelect
              label="Player"
              value={filters.player}
              options={filterOptions.players}
              onChange={(value) =>
                updateFilter("player", value)
              }
            />

            <FilterSelect
              label="Tournament"
              value={filters.tournament}
              options={filterOptions.tournaments}
              onChange={(value) =>
                updateFilter("tournament", value)
              }
            />

            <FilterSelect
              label="Year"
              value={filters.year}
              options={filterOptions.years.map(String)}
              onChange={(value) =>
                updateFilter("year", value)
              }
            />

            <FilterSelect
              label="Brand"
              value={filters.brand}
              options={filterOptions.brands}
              onChange={(value) =>
                updateFilter("brand", value)
              }
            />

            <FilterSelect
              label="Collection"
              value={filters.collection}
              options={filterOptions.collections}
              onChange={(value) =>
                updateFilter("collection", value)
              }
            />

            <FilterSelect
              label="Category"
              value={filters.category}
              options={filterOptions.categories}
              onChange={(value) =>
                updateFilter("category", value)
              }
            />

            <FilterSelect
              label="Rarity"
              value={filters.rarity}
              options={filterOptions.rarities}
              onChange={(value) =>
                updateFilter("rarity", value)
              }
            />

            <FilterSelect
              label="Status"
              value={filters.status}
              options={filterOptions.statuses}
              onChange={(value) =>
                updateFilter("status", value)
              }
            />
          </div>

          <div className="mt-7 flex flex-col gap-6 border-t border-white/10 pt-7 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-h-12 flex-1">
              {(query.trim() || activeFilters.length > 0) && (
                <>
                  <p className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-600">
                    Active filters
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {query.trim() && (
                      <button
                        type="button"
                        onClick={() => setQuery("")}
                        className="inline-flex items-center gap-3 rounded-full border border-[#C8FF00]/25 bg-[#C8FF00]/[0.06] px-4 py-2 text-[10px] font-bold text-[#C8FF00] transition hover:border-[#C8FF00]/50"
                      >
                        Search: {query.trim()}

                        <span aria-hidden="true">×</span>
                      </button>
                    )}

                    {activeFilters.map((filter) => (
                      <button
                        key={filter.key}
                        type="button"
                        onClick={() =>
                          removeFilter(filter.key)
                        }
                        className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-[10px] font-bold text-gray-300 transition hover:border-[#C8FF00]/40 hover:text-[#C8FF00]"
                      >
                        <span className="text-gray-600">
                          {filter.label}:
                        </span>

                        {formatOption(filter.value)}

                        <span aria-hidden="true">×</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="w-full sm:max-w-xs">
              <label
                htmlFor="archive-sort"
                className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-600"
              >
                Sort by
              </label>

              <select
                id="archive-sort"
                value={sort}
                onChange={(event) =>
                  setSort(
                    event.target.value as ArchiveSort
                  )
                }
                className="mt-3 h-12 w-full rounded-xl border border-white/10 bg-[#050B18] px-4 text-sm text-white outline-none transition focus:border-[#C8FF00]/50"
              >
                <option value="newest">
                  Newest first
                </option>

                <option value="oldest">
                  Oldest first
                </option>

                <option value="player-az">
                  Player A–Z
                </option>

                <option value="player-za">
                  Player Z–A
                </option>

                <option value="title-az">
                  Title A–Z
                </option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-b border-white/10 pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#C8FF00]">
              Museum collection
            </p>

            <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">
              Archive pieces
            </h2>
          </div>

          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-bold text-white">
              {archiveResult.total}
            </span>{" "}
            of{" "}
            <span className="font-bold text-white">
              {products.length}
            </span>{" "}
            records
          </p>
        </div>

        <div className="mt-10">
          <ArchiveGrid products={archiveResult.products} />
        </div>
      </div>
    </section>
  );
}

type DiscoveryButtonProps = {
  label: string;
  active: boolean;
  onClick: () => void;
};

function DiscoveryButton({
  label,
  active,
  onClick,
}: DiscoveryButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-[9px] font-black uppercase tracking-[0.18em] transition ${
        active
          ? "border-[#C8FF00]/60 bg-[#C8FF00]/10 text-[#C8FF00]"
          : "border-white/10 bg-[#050B18] text-gray-400 hover:border-[#C8FF00]/35 hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}

type FilterSelectProps = {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
};

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: FilterSelectProps) {
  const inputId = `archive-filter-${label
    .toLowerCase()
    .replace(/\s+/g, "-")}`;

  return (
    <div>
      <label
        htmlFor={inputId}
        className="text-[9px] font-black uppercase tracking-[0.24em] text-gray-600"
      >
        {label}
      </label>

      <select
        id={inputId}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="mt-3 h-12 w-full rounded-xl border border-white/10 bg-[#050B18] px-4 text-sm capitalize text-white outline-none transition focus:border-[#C8FF00]/50"
      >
        <option value="">All</option>

        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {formatOption(option)}
          </option>
        ))}
      </select>
    </div>
  );
}

function formatOption(value: string): string {
  return value
    .replaceAll("-", " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}