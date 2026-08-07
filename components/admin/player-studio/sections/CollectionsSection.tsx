"use client";

import {
  FolderKanban,
  Search,
  Sparkles,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";

import type {
  MuseumCollectionListItem,
} from "@/lib/repositories/museum-collection.repository";

import PlayerStudioSection from "../PlayerStudioSection";

import {
  usePlayerStudio,
} from "../PlayerStudioForm";

import CollectionCard from "./CollectionCard";

type CollectionsSectionProps = {
  collections: MuseumCollectionListItem[];
  initialSelectedCollectionIds?: string[];
};

const inputClassName =
  "h-12 w-full rounded-2xl border border-white/10 bg-[#08111F] px-4 text-sm text-white outline-none transition placeholder:text-white/22 focus:border-lime-300/35";

export default function CollectionsSection({
  collections,
  initialSelectedCollectionIds = [],
}: CollectionsSectionProps) {
  const {
    updatePreview,
  } = usePlayerStudio();

  const [query, setQuery] =
    useState("");

  const [
    selectedCollectionIds,
    setSelectedCollectionIds,
  ] = useState<string[]>(
    initialSelectedCollectionIds,
  );

  const filteredCollections =
    useMemo(() => {
      const normalized =
        query
          .trim()
          .toLowerCase();

      if (!normalized) {
        return collections;
      }

      return collections.filter(
        (collection) =>
          [
            collection.name,
            collection.title,
            collection.subtitle ?? "",
            collection.description ?? "",
            collection.slug,
            collection.type,
            collection.status,
          ]
            .join(" ")
            .toLowerCase()
            .includes(normalized),
      );
    }, [
      collections,
      query,
    ]);

  const serializedCollectionIds =
    useMemo(
      () =>
        JSON.stringify(
          selectedCollectionIds,
        ),
      [selectedCollectionIds],
    );

  function toggleCollection(
    collectionId: string,
  ) {
    setSelectedCollectionIds(
      (current) => {
        const selected =
          current.includes(
            collectionId,
          );

        const next = selected
          ? current.filter(
              (id) =>
                id !==
                collectionId,
            )
          : [
              ...current,
              collectionId,
            ];

        updatePreview({
          collectionCount:
            next.length,
        });

        return next;
      },
    );
  }

  function clearSelection() {
    setSelectedCollectionIds(
      [],
    );

    updatePreview({
      collectionCount: 0,
    });
  }

  return (
    <PlayerStudioSection
      eyebrow="Museum relationships"
      title="Player collections"
      description="Connect this player to one or more AGE202 Museum Collections. Selected relationships will power public exhibitions, archive navigation and future Hall of Fame experiences."
      icon={FolderKanban}
      actions={
        <SelectedCollectionsSummary
          count={
            selectedCollectionIds.length
          }
        />
      }
      summary={
        <CollectionSearchBar
          query={query}
          onQueryChange={
            setQuery
          }
          selectedCount={
            selectedCollectionIds.length
          }
          onClearSelection={
            clearSelection
          }
        />
      }
    >
      <input
        type="hidden"
        name="museumCollectionIds"
        value={
          serializedCollectionIds
        }
      />

      {collections.length === 0 ? (
        <CollectionsEmptyState />
      ) : filteredCollections.length >
        0 ? (
        <div className="grid gap-5 2xl:grid-cols-2">
          {filteredCollections.map(
            (collection) => (
              <CollectionCard
                key={collection.id}
                collection={
                  collection
                }
                selected={selectedCollectionIds.includes(
                  collection.id,
                )}
                onToggle={() =>
                  toggleCollection(
                    collection.id,
                  )
                }
              />
            ),
          )}
        </div>
      ) : (
        <CollectionsNoResults />
      )}

      {selectedCollectionIds.length >
      0 ? (
        <div className="mt-7 rounded-3xl border border-lime-300/20 bg-lime-300/[0.05] p-5">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-lime-300/20 bg-lime-300/10 text-lime-200">
              <Sparkles
                className="h-4 w-4"
                aria-hidden="true"
              />
            </span>

            <div>
              <p className="text-sm font-semibold text-white">
                Museum relationships ready
              </p>

              <p className="mt-1 text-xs leading-5 text-white/35">
                The selected collection IDs are serialized in the hidden{" "}
                <code>
                  museumCollectionIds
                </code>{" "}
                field, ready for the Server Action integration.
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </PlayerStudioSection>
  );
}

function SelectedCollectionsSummary({
  count,
}: {
  count: number;
}) {
  return (
    <div className="rounded-2xl border border-lime-300/20 bg-lime-300/[0.06] px-4 py-3">
      <p className="text-[8px] font-black uppercase tracking-[0.16em] text-lime-200/70">
        Selected
      </p>

      <p className="mt-1 text-lg font-semibold text-white">
        {count}
      </p>
    </div>
  );
}

type CollectionSearchBarProps = {
  query: string;
  onQueryChange: (
    value: string,
  ) => void;
  selectedCount: number;
  onClearSelection: () => void;
};

function CollectionSearchBar({
  query,
  onQueryChange,
  selectedCount,
  onClearSelection,
}: CollectionSearchBarProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <label className="relative block flex-1">
        <span className="sr-only">
          Search collections
        </span>

        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />

        <input
          type="search"
          value={query}
          onChange={(event) =>
            onQueryChange(
              event.target.value,
            )
          }
          placeholder="Search collection, type or status..."
          className={`${inputClassName} pl-11`}
        />
      </label>

      {selectedCount > 0 ? (
        <button
          type="button"
          onClick={
            onClearSelection
          }
          className="inline-flex h-11 items-center justify-center rounded-2xl border border-white/10 px-4 text-sm font-semibold text-white/45 transition hover:border-white/20 hover:text-white"
        >
          Clear selection
        </button>
      ) : null}
    </div>
  );
}

function CollectionsNoResults() {
  return (
    <div className="grid min-h-64 place-items-center rounded-3xl border border-dashed border-white/10 bg-white/[0.015] p-8 text-center">
      <div>
        <Search className="mx-auto h-8 w-8 text-white/20" />

        <h3 className="mt-4 text-lg font-semibold text-white">
          No collections found
        </h3>

        <p className="mt-2 text-sm text-white/35">
          Try a different title, type or status.
        </p>
      </div>
    </div>
  );
}

function CollectionsEmptyState() {
  return (
    <div className="grid min-h-[360px] place-items-center rounded-3xl border border-dashed border-white/10 bg-white/[0.015] p-8 text-center">
      <div>
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-lime-300/20 bg-lime-300/10 text-lime-200">
          <FolderKanban
            className="h-6 w-6"
            aria-hidden="true"
          />
        </span>

        <h3 className="mt-5 text-xl font-semibold text-white">
          No Museum Collections yet
        </h3>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/35">
          Create the first collection from the Collections Studio, then return
          here to connect it to this player.
        </p>
      </div>
    </div>
  );
}