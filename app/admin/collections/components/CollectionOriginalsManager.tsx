"use client";

import { Check, Search, Shirt, Sparkles, Star } from "lucide-react";
import { useMemo, useState } from "react";

import { updateCollectionOriginals } from "../actions/updateCollectionOriginals";

export type CollectionOriginalOption = {
  id: string;
  title: string;
  subtitle: string | null;
  slug: string;
  collection: string | null;
  edition: string | null;
  category: string;
  availability: string;
  status: string;
  imageUrl: string | null;
};

type CollectionOriginalsManagerProps = {
  collectionId: string;
  originals: CollectionOriginalOption[];
  selectedOriginalIds: string[];
  featuredOriginalIds: string[];
};

export default function CollectionOriginalsManager({
  collectionId,
  originals,
  selectedOriginalIds,
  featuredOriginalIds,
}: CollectionOriginalsManagerProps) {
  const [query, setQuery] = useState("");
  const [selectedIds, setSelectedIds] =
    useState<string[]>(selectedOriginalIds);
  const [featuredIds, setFeaturedIds] =
    useState<string[]>(featuredOriginalIds);

  const filteredOriginals = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return originals;
    }

    return originals.filter((original) =>
      [
        original.title,
        original.subtitle ?? "",
        original.collection ?? "",
        original.edition ?? "",
        original.category,
        original.availability,
        original.status,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalized),
    );
  }, [originals, query]);

  function toggleOriginal(originalId: string) {
    setSelectedIds((current) => {
      if (current.includes(originalId)) {
        setFeaturedIds((featured) =>
          featured.filter((id) => id !== originalId),
        );

        return current.filter((id) => id !== originalId);
      }

      return [...current, originalId];
    });
  }

  function toggleFeatured(originalId: string) {
    if (!selectedIds.includes(originalId)) {
      return;
    }

    setFeaturedIds((current) =>
      current.includes(originalId)
        ? current.filter((id) => id !== originalId)
        : [...current, originalId],
    );
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025]">
      <div className="flex flex-col gap-4 border-b border-white/10 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-lime-200/70">
            <Sparkles className="h-4 w-4" />
            Collection content
          </div>

          <h2 className="mt-2 text-2xl font-semibold text-white">
            AGE202 Originals
          </h2>

          <p className="mt-2 text-sm leading-6 text-white/40">
            Connect official AGE202 products inspired by this museum collection.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#08111F] px-4 py-3 text-sm text-white/45">
          <span className="font-semibold text-white">{selectedIds.length}</span>{" "}
          selected
        </div>
      </div>

      <form action={updateCollectionOriginals}>
        <input type="hidden" name="collectionId" value={collectionId} />

        {selectedIds.map((originalId) => (
          <input
            key={originalId}
            type="hidden"
            name="originalProductIds"
            value={originalId}
          />
        ))}

        {featuredIds.map((originalId) => (
          <input
            key={originalId}
            type="hidden"
            name="featuredOriginalIds"
            value={originalId}
          />
        ))}

        <div className="border-b border-white/10 p-5 sm:p-6">
          <label className="relative block">
            <span className="sr-only">Search AGE202 Originals</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search title, collection, edition or category..."
              className="h-12 w-full rounded-2xl border border-white/10 bg-[#08111F] pl-11 pr-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-lime-300/35"
            />
          </label>
        </div>

        <div className="p-5 sm:p-6">
          {filteredOriginals.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredOriginals.map((original) => {
                const selected = selectedIds.includes(original.id);
                const featured = featuredIds.includes(original.id);

                return (
                  <article
                    key={original.id}
                    className={[
                      "overflow-hidden rounded-3xl border transition",
                      selected
                        ? "border-lime-300/40 bg-lime-300/[0.05]"
                        : "border-white/10 bg-[#08111F]",
                    ].join(" ")}
                  >
                    <button
                      type="button"
                      onClick={() => toggleOriginal(original.id)}
                      className="block w-full text-left"
                    >
                      <div className="relative aspect-square overflow-hidden bg-[#050B18]">
                        {original.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={original.imageUrl}
                            alt={original.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 grid place-items-center">
                            <Shirt className="h-11 w-11 text-white/20" />
                          </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-[#050B18] via-transparent to-transparent" />

                        <span
                          className={[
                            "absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border backdrop-blur",
                            selected
                              ? "border-lime-200/50 bg-lime-300 text-[#050B18]"
                              : "border-white/15 bg-black/55 text-white/45",
                          ].join(" ")}
                        >
                          {selected ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Shirt className="h-4 w-4" />
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
                          {original.category}
                        </p>

                        <h3 className="mt-2 line-clamp-2 text-base font-semibold text-white">
                          {original.title}
                        </h3>

                        <p className="mt-2 text-xs text-white/35">
                          {original.collection ?? "AGE202 Originals"}
                          {original.edition ? ` · ${original.edition}` : ""}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="rounded-full border border-white/10 px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.12em] text-white/35">
                            {original.status}
                          </span>
                          <span className="rounded-full border border-white/10 px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.12em] text-white/35">
                            {original.availability}
                          </span>
                        </div>
                      </div>
                    </button>

                    <div className="border-t border-white/10 p-4">
                      <button
                        type="button"
                        disabled={!selected}
                        onClick={() => toggleFeatured(original.id)}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 px-4 py-2.5 text-xs font-semibold text-white/55 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <Star className="h-4 w-4" />
                        {featured ? "Remove featured" : "Mark as featured"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="grid min-h-56 place-items-center rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center">
              <div>
                <Shirt className="mx-auto h-9 w-9 text-white/20" />
                <h3 className="mt-4 text-lg font-semibold text-white">
                  No Originals found
                </h3>
                <p className="mt-2 text-sm text-white/40">
                  Adjust the search or create products in the Originals CMS first.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 bg-[#050B18]/70 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <p className="text-sm text-white/35">
            Original order follows the current selection order.
          </p>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-lime-300 px-5 py-3 text-sm font-semibold text-[#050B18] transition hover:bg-lime-200"
          >
            <Check className="h-4 w-4" />
            Save Originals
          </button>
        </div>
      </form>
    </section>
  );
}
