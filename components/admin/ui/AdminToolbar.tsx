import Link from "next/link";
import type {
  ReactNode,
} from "react";
import {
  Filter,
  Search,
  X,
} from "lucide-react";

import AdminPanel from "./AdminPanel";

type AdminToolbarProps = {
  title: string;
  description: string;
  searchName?: string;
  searchValue?: string;
  searchPlaceholder?: string;
  hasActiveFilters?: boolean;
  clearHref?: string;
  children?: ReactNode;
  submitLabel?: string;
};

export default function AdminToolbar({
  title,
  description,
  searchName = "q",
  searchValue = "",
  searchPlaceholder = "Search...",
  hasActiveFilters = false,
  clearHref,
  children,
  submitLabel = "Apply filters",
}: AdminToolbarProps) {
  return (
    <AdminPanel className="p-5 sm:p-6">
      <form
        method="get"
        className="space-y-4"
      >
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/35">
              <Filter
                className="h-4 w-4"
                aria-hidden="true"
              />
              {title}
            </div>

            <p className="mt-2 text-sm text-white/45">
              {description}
            </p>
          </div>

          {hasActiveFilters &&
          clearHref ? (
            <Link
              href={clearHref}
              className="inline-flex items-center gap-2 text-sm font-semibold text-white/55 transition hover:text-white"
            >
              <X
                className="h-4 w-4"
                aria-hidden="true"
              />
              Clear filters
            </Link>
          ) : null}
        </div>

        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
          <label className="relative">
            <span className="sr-only">
              Search
            </span>

            <Search
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30"
              aria-hidden="true"
            />

            <input
              type="search"
              name={searchName}
              defaultValue={searchValue}
              placeholder={
                searchPlaceholder
              }
              className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.035] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-lime-300/35 focus:bg-white/[0.05]"
            />
          </label>

          <button
            type="submit"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-white px-5 text-sm font-semibold text-[#050B18] transition hover:bg-lime-200"
          >
            <Search
              className="h-4 w-4"
              aria-hidden="true"
            />
            {submitLabel}
          </button>
        </div>

        {children ? (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {children}
          </div>
        ) : null}
      </form>
    </AdminPanel>
  );
}
