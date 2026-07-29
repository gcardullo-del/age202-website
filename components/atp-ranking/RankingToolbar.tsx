"use client";

import { Search, RotateCcw } from "lucide-react";

import type {
  RankingFiltersState,
  RankingSort,
} from "./types";

type RankingToolbarProps = {
  filters: RankingFiltersState;
  countries: string[];
  onQueryChange: (value: string) => void;
  onCountryChange: (value: string) => void;
  onSortChange: (value: RankingSort) => void;
  onReset: () => void;
};

export default function RankingToolbar({
  filters,
  countries,
  onQueryChange,
  onCountryChange,
  onSortChange,
  onReset,
}: RankingToolbarProps) {
  return (
    <section className="rounded-[1.8rem] border border-white/10 bg-[#050B18]/80 p-5 backdrop-blur-xl">
      <div className="grid gap-5 xl:grid-cols-[1.4fr_220px_220px_auto]">
        <div className="relative">
          <Search
            size={18}
            className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-white/30"
          />

          <input
            value={filters.query}
            onChange={(event) =>
              onQueryChange(event.target.value)
            }
            placeholder="Search player..."
            className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.04] pl-14 pr-5 text-sm text-white outline-none transition focus:border-[#D7FF00]/40"
          />
        </div>

        <select
          value={filters.country}
          onChange={(event) =>
            onCountryChange(event.target.value)
          }
          className="h-14 rounded-2xl border border-white/10 bg-white/[0.04] px-5 text-sm text-white outline-none transition focus:border-[#D7FF00]/40"
        >
          <option value="all">
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

        <select
          value={filters.sort}
          onChange={(event) =>
            onSortChange(
              event.target.value as RankingSort,
            )
          }
          className="h-14 rounded-2xl border border-white/10 bg-white/[0.04] px-5 text-sm text-white outline-none transition focus:border-[#D7FF00]/40"
        >
          <option value="ranking">
            ATP Ranking
          </option>

          <option value="points-desc">
            Points ↓
          </option>

          <option value="points-asc">
            Points ↑
          </option>

          <option value="name-asc">
            Name A-Z
          </option>

          <option value="name-desc">
            Name Z-A
          </option>
        </select>

        <button
          type="button"
          onClick={onReset}
          className="inline-flex h-14 items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-6 text-[11px] font-black uppercase tracking-[0.16em] text-white/65 transition hover:border-[#D7FF00]/30 hover:text-[#D7FF00]"
        >
          <RotateCcw size={16} />

          Reset
        </button>
      </div>
    </section>
  );
}