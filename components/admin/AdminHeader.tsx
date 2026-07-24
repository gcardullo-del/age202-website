"use client";

import Link from "next/link";
import { Bell, ExternalLink, Menu, Plus, Search } from "lucide-react";

type AdminHeaderProps = Readonly<{
  title: string;
  description?: string;
  onOpenSidebar?: () => void;
}>;

export default function AdminHeader({
  title,
  description,
  onOpenSidebar,
}: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#050B18]/85 backdrop-blur-2xl">
      <div className="flex min-h-20 items-center gap-4 px-5 sm:px-8">
        <button
          type="button"
          onClick={onOpenSidebar}
          aria-label="Apri menu amministrazione"
          className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white/65 transition-colors hover:bg-white/[0.08] hover:text-white lg:hidden"
        >
          <Menu size={20} strokeWidth={1.8} />
        </button>

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-xl font-semibold tracking-[-0.03em] text-white sm:text-2xl">
            {title}
          </h1>

          {description ? (
            <p className="mt-1 hidden truncate text-sm text-white/40 sm:block">
              {description}
            </p>
          ) : null}
        </div>

        <div className="hidden min-w-64 max-w-sm flex-1 lg:block">
          <label className="relative block">
            <span className="sr-only">Cerca nel CMS</span>

            <Search
              size={17}
              strokeWidth={1.8}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/35"
            />

            <input
              type="search"
              placeholder="Search the archive..."
              className="h-11 w-full rounded-2xl border border-white/10 bg-white/[0.035] pl-11 pr-4 text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-lime-300/40 focus:bg-white/[0.055]"
            />
          </label>
        </div>

        <Link
          href="/"
          target="_blank"
          rel="noreferrer"
          className="hidden h-11 items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.035] px-4 text-sm font-medium text-white/60 transition-colors hover:bg-white/[0.07] hover:text-white md:flex"
        >
          <ExternalLink size={16} strokeWidth={1.8} />
          View museum
        </Link>

        <button
          type="button"
          aria-label="Notifiche"
          className="relative flex size-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.035] text-white/55 transition-colors hover:bg-white/[0.07] hover:text-white"
        >
          <Bell size={18} strokeWidth={1.8} />

          <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-lime-300 ring-2 ring-[#050B18]" />
        </button>

        <Link
          href="/admin/artifacts/new"
          className="flex h-11 shrink-0 items-center gap-2 rounded-2xl bg-lime-300 px-4 text-sm font-bold text-[#050B18] transition-transform hover:-translate-y-0.5 hover:bg-lime-200 active:translate-y-0"
        >
          <Plus size={17} strokeWidth={2.2} />
          <span className="hidden sm:inline">New Artifact</span>
        </Link>

        <button
          type="button"
          aria-label="Profilo amministratore"
          className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/[0.03] text-sm font-bold text-white transition-colors hover:border-lime-300/30"
        >
          GC
        </button>
      </div>
    </header>
  );
}