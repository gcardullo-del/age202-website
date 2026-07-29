"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";

type SearchItem = {
  label: string;
  category: "Player" | "Collection" | "History" | "Museum";
  href: string;
  keywords: string;
};

const items: SearchItem[] = [
  {
    label: "Roger Federer",
    category: "Player",
    href: "/archives/federer",
    keywords: "switzerland wimbledon nike elegance",
  },
  {
    label: "Rafael Nadal",
    category: "Player",
    href: "/archives/nadal",
    keywords: "spain roland garros nike clay",
  },
  {
    label: "Novak Djokovic",
    category: "Player",
    href: "/archives/djokovic",
    keywords: "serbia grand slam lacoste",
  },
  {
    label: "Jannik Sinner",
    category: "Player",
    href: "/archives/sinner",
    keywords: "italy nike new era",
  },
  {
    label: "Carlos Alcaraz",
    category: "Player",
    href: "/archives/alcaraz",
    keywords: "spain nike future",
  },
  {
    label: "Champion Collections",
    category: "Collection",
    href: "/archive",
    keywords: "shirts apparel artifacts archive",
  },
  {
    label: "Hall of Fame",
    category: "Museum",
    href: "/hall-of-fame",
    keywords: "legends players records biographies",
  },
  {
    label: "Grand Slam History",
    category: "History",
    href: "/results/grand-slams",
    keywords:
      "grand slam results champions australian open roland garros wimbledon us open",
  },
  {
    label: "Brands",
    category: "Museum",
    href: "/brands",
    keywords: "nike adidas uniqlo lacoste on running",
  },
  {
    label: "The Vault",
    category: "Museum",
    href: "/vault",
    keywords: "rare memorabilia collectible archive",
  },
];

type GlobalMuseumSearchProps = {
  open: boolean;
  onClose: () => void;
};

export default function GlobalMuseumSearch({
  open,
  onClose,
}: GlobalMuseumSearchProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return items;
    }

    return items.filter((item) => {
      const searchableContent =
        `${item.label} ${item.category} ${item.keywords}`.toLowerCase();

      return searchableContent.includes(normalizedQuery);
    });
  }, [query]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] bg-[#030711]/95 px-5 py-6 backdrop-blur-2xl sm:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.28em] text-[#ccff00]">
              Museum search
            </p>

            <p className="mt-2 text-sm text-slate-400">
              Players, galleries, stories and collections.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="grid h-12 w-12 place-items-center rounded-full border border-white/15 text-white transition hover:border-[#ccff00] hover:text-[#ccff00]"
          >
            <X size={20} />
          </button>
        </div>

        <label className="mt-10 flex items-center gap-4 rounded-2xl border border-white/15 bg-white/[.04] px-5 py-4 focus-within:border-[#ccff00]/70">
          <Search
            className="shrink-0 text-[#ccff00]"
            size={22}
            aria-hidden="true"
          />

          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search the museum..."
            className="w-full bg-transparent text-xl text-white outline-none placeholder:text-slate-600 sm:text-2xl"
          />
        </label>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {results.map((item) => (
            <Link
              key={`${item.category}-${item.label}`}
              href={item.href}
              onClick={onClose}
              className="group rounded-2xl border border-white/10 bg-white/[.035] p-5 transition hover:-translate-y-0.5 hover:border-[#ccff00]/50 hover:bg-white/[.06]"
            >
              <p className="text-[10px] font-bold uppercase tracking-[.24em] text-[#ccff00]">
                {item.category}
              </p>

              <p className="mt-3 text-lg font-black uppercase tracking-[-.025em] text-white group-hover:text-[#ccff00]">
                {item.label}
              </p>
            </Link>
          ))}
        </div>

        {results.length === 0 ? (
          <p className="mt-12 text-center text-slate-400">
            No museum entry found for “{query}”.
          </p>
        ) : null}
      </div>
    </div>
  );
}