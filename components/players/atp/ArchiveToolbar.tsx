"use client";

import {
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import {
  RankingFilter,
  SortOption,
} from "./types";

import {
  rankingFilters,
  sortOptions,
} from "./utils";

type ArchiveToolbarProps = {
  query: string;
  setQuery: (value: string) => void;

  rankingFilter: RankingFilter;
  setRankingFilter: (
    value: RankingFilter,
  ) => void;

  countryFilter: string;
  setCountryFilter: (
    value: string,
  ) => void;

  sortOption: SortOption;
  setSortOption: (
    value: SortOption,
  ) => void;

  countries: string[];

  filteredPlayers: number;
  totalPlayers: number;

  onReset: () => void;
};

export default function ArchiveToolbar({
  query,
  setQuery,
  rankingFilter,
  setRankingFilter,
  countryFilter,
  setCountryFilter,
  sortOption,
  setSortOption,
  countries,
  filteredPlayers,
  totalPlayers,
  onReset,
}: ArchiveToolbarProps) {
  return (
    <section
      id="archive-toolbar"
      className="relative z-20 -mt-1 border-b border-white/10 px-5 pb-8 pt-8 sm:px-8 lg:px-12"
    >
      <div className="mx-auto w-full max-w-[1920px]">

        <div className="overflow-hidden rounded-[30px] border border-white/10 bg-[#07101D]/92 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.34)] backdrop-blur-2xl sm:p-5 lg:p-6">

          <div className="mb-5 flex flex-col gap-2 border-b border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <div className="text-[9px] font-black uppercase tracking-[0.28em] text-[#D7FF00]">
                ATP Archive Explorer
              </div>

              <p className="mt-2 text-sm text-white/42">
                Search, filter and browse the current ATP Top 50.
              </p>

            </div>

            <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/35">
              {filteredPlayers} of {totalPlayers} players
            </div>

          </div>

          <div className="grid gap-4 xl:grid-cols-[minmax(300px,1fr)_auto_minmax(180px,210px)_minmax(190px,230px)]">

            <label className="relative block">

              <Search
                size={18}
                className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-[#D7FF00]"
              />

              <input
                type="search"
                value={query}
                onChange={(e) =>
                  setQuery(e.target.value)
                }
                placeholder="Search player or country..."
                className="h-14 w-full rounded-full border border-white/10 bg-[#020711]/78 pl-13 pr-12 text-sm text-white outline-none transition placeholder:text-white/28 hover:border-white/20 focus:border-[#D7FF00]/60"
              />

              {query && (
                <button
                  onClick={() => setQuery("")}
                  type="button"
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-white/35 hover:text-[#D7FF00]"
                >
                  <X size={16} />
                </button>
              )}

            </label>

            <div className="flex flex-wrap gap-2 rounded-[22px] border border-white/10 bg-[#020711]/48 p-1.5">

              {rankingFilters.map((filter) => (

                <button
                  key={filter.value}
                  type="button"
                  onClick={() =>
                    setRankingFilter(filter.value)
                  }
                  className={
                    rankingFilter === filter.value
                      ? "h-11 rounded-full border border-[#D7FF00] bg-[#D7FF00] px-4 text-[9px] font-black uppercase tracking-[0.16em] text-[#050B18]"
                      : "h-11 rounded-full border border-transparent px-4 text-[9px] font-black uppercase tracking-[0.16em] text-white/42 hover:border-white/10 hover:bg-white/[0.05]"
                  }
                >
                  {filter.label}
                </button>

              ))}

            </div>

            <select
              value={countryFilter}
              onChange={(e) =>
                setCountryFilter(e.target.value)
              }
              className="h-14 rounded-full border border-white/10 bg-[#020711]/78 px-5 text-[9px] font-black uppercase tracking-[0.16em] text-white/68"
            >
              <option value="ALL">
                All countries
              </option>

              {countries.map((country) => (
                <option
                  key={country}
                  value={country}
                >
                  {country}
                </option>
              ))}

            </select>

            <label className="relative">

              <SlidersHorizontal
                size={15}
                className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-[#D7FF00]"
              />

              <select
                value={sortOption}
                onChange={(e) =>
                  setSortOption(
                    e.target.value as SortOption,
                  )
                }
                className="h-14 w-full appearance-none rounded-full border border-white/10 bg-[#020711]/78 pl-12 pr-5 text-[9px] font-black uppercase tracking-[0.16em] text-white/68"
              >
                {sortOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>

            </label>

          </div>

          <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-5">

            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/35">
              {filteredPlayers} players found
            </p>

            <button
              onClick={onReset}
              className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.18em] text-[#D7FF00] hover:text-white"
            >
              <X size={13} />
              Reset filters
            </button>

          </div>

        </div>

      </div>
    </section>
  );
}