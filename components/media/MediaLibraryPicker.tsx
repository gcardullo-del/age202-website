"use client";

import {
  Check,
  FolderOpen,
  ImageIcon,
  Search,
  X,
} from "lucide-react";
import {
  useMemo,
  useState,
} from "react";

import type {
  MediaAssetWithFolder,
} from "@/lib/repositories/media.repository";

export type SelectedLibraryImage = {
  id: string;
  url: string;
  alt: string | null;
  title: string;
};

type MediaLibraryPickerProps = {
  open: boolean;
  assets: MediaAssetWithFolder[];
  onClose: () => void;
  onConfirm: (
    images: SelectedLibraryImage[],
  ) => void;
  maxSelection?: number;
  initialSelectedIds?: string[];
  title?: string;
  description?: string;
};

export default function MediaLibraryPicker({
  open,
  assets,
  onClose,
  onConfirm,
  maxSelection = 10,
  initialSelectedIds = [],
  title = "Choose from Media Library",
  description = "Select reusable AGE202 images without uploading duplicates.",
}: MediaLibraryPickerProps) {
  const [query, setQuery] =
    useState("");

  const [folderId, setFolderId] =
    useState("");

  const [
    selectedIds,
    setSelectedIds,
  ] = useState<string[]>(
    initialSelectedIds,
  );

  const folders = useMemo(() => {
    const folderMap =
      new Map<
        string,
        {
          id: string;
          name: string;
        }
      >();

    assets.forEach((asset) => {
      if (!asset.folder) {
        return;
      }

      folderMap.set(
        asset.folder.id,
        {
          id: asset.folder.id,
          name: asset.folder.name,
        },
      );
    });

    return Array.from(
      folderMap.values(),
    ).sort((first, second) =>
      first.name.localeCompare(
        second.name,
      ),
    );
  }, [assets]);

  const filteredAssets =
    useMemo(() => {
      const normalizedQuery =
        query
          .trim()
          .toLowerCase();

      return assets.filter(
        (asset) => {
          const matchesFolder =
            !folderId ||
            (folderId ===
            "unfiled"
              ? !asset.folderId
              : asset.folderId ===
                folderId);

          if (!matchesFolder) {
            return false;
          }

          if (!normalizedQuery) {
            return true;
          }

          const searchableText = [
            asset.title,
            asset.alt ?? "",
            asset.originalName,
            asset.extension,
            asset.folder?.name ??
              "",
            ...asset.tags,
          ]
            .join(" ")
            .toLowerCase();

          return searchableText.includes(
            normalizedQuery,
          );
        },
      );
    }, [
      assets,
      folderId,
      query,
    ]);

  if (!open) {
    return null;
  }

  function toggleSelection(
    assetId: string,
  ) {
    setSelectedIds(
      (current) => {
        if (
          current.includes(
            assetId,
          )
        ) {
          return current.filter(
            (id) =>
              id !== assetId,
          );
        }

        if (
          current.length >=
          maxSelection
        ) {
          window.alert(
            `You can select up to ${maxSelection} images.`,
          );

          return current;
        }

        return [
          ...current,
          assetId,
        ];
      },
    );
  }

  function confirmSelection() {
    const selectedImages =
      selectedIds
        .map((id) =>
          assets.find(
            (asset) =>
              asset.id === id,
          ),
        )
        .filter(
          (
            asset,
          ): asset is MediaAssetWithFolder =>
            Boolean(asset),
        )
        .map((asset) => ({
          id: asset.id,
          url: asset.url,
          alt: asset.alt,
          title: asset.title,
        }));

    onConfirm(selectedImages);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div className="flex max-h-[92vh] w-full max-w-7xl flex-col overflow-hidden rounded-[32px] border border-white/10 bg-[#07101D] shadow-2xl">
        <header className="flex flex-col gap-5 border-b border-white/10 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-200/70">
              AGE202 asset picker
            </p>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
              {title}
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/45">
              {description}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Media Library"
            className="self-start rounded-full border border-white/10 p-3 text-white/50 transition hover:bg-white/5 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="grid gap-3 border-b border-white/10 p-5 sm:p-6 md:grid-cols-[minmax(0,1fr)_220px]">
          <label className="relative">
            <span className="sr-only">
              Search Media Library
            </span>

            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />

            <input
              type="search"
              value={query}
              onChange={(event) =>
                setQuery(
                  event.target
                    .value,
                )
              }
              placeholder="Search title, filename, tags..."
              className="h-12 w-full rounded-2xl border border-white/10 bg-[#050B18] pl-11 pr-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-lime-300/35"
            />
          </label>

          <select
            value={folderId}
            onChange={(event) =>
              setFolderId(
                event.target
                  .value,
              )
            }
            className="h-12 rounded-2xl border border-white/10 bg-[#050B18] px-4 text-sm text-white/70 outline-none focus:border-lime-300/35"
          >
            <option value="">
              All folders
            </option>

            <option value="unfiled">
              Unfiled
            </option>

            {folders.map(
              (folder) => (
                <option
                  key={
                    folder.id
                  }
                  value={
                    folder.id
                  }
                >
                  {folder.name}
                </option>
              ),
            )}
          </select>
        </div>

        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          {filteredAssets.length >
          0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredAssets.map(
                (asset) => {
                  const selected =
                    selectedIds.includes(
                      asset.id,
                    );

                  return (
                    <button
                      key={
                        asset.id
                      }
                      type="button"
                      onClick={() =>
                        toggleSelection(
                          asset.id,
                        )
                      }
                      className={[
                        "group overflow-hidden rounded-3xl border text-left transition",
                        selected
                          ? "border-lime-300/50 bg-lime-300/[0.06]"
                          : "border-white/10 bg-[#08111F] hover:-translate-y-0.5 hover:border-white/20",
                      ].join(" ")}
                    >
                      <div className="relative aspect-square overflow-hidden bg-[#050B18]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={
                            asset.url
                          }
                          alt={
                            asset.alt ??
                            asset.title
                          }
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                        />

                        <span
                          className={[
                            "absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border backdrop-blur",
                            selected
                              ? "border-lime-200/50 bg-lime-300 text-[#050B18]"
                              : "border-white/15 bg-black/55 text-white/50",
                          ].join(
                            " ",
                          )}
                        >
                          {selected ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <ImageIcon className="h-4 w-4" />
                          )}
                        </span>

                        <span className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/55 px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.16em] text-white/65 backdrop-blur">
                          {
                            asset.extension
                          }
                        </span>
                      </div>

                      <div className="p-4">
                        <h3 className="truncate text-sm font-semibold text-white">
                          {
                            asset.title
                          }
                        </h3>

                        <p className="mt-1 truncate text-xs text-white/35">
                          {
                            asset.originalName
                          }
                        </p>

                        <div className="mt-4 flex min-w-0 items-center gap-2 border-t border-white/10 pt-4 text-xs text-white/35">
                          <FolderOpen className="h-3.5 w-3.5 shrink-0" />

                          <span className="truncate">
                            {asset
                              .folder
                              ?.name ??
                              "Unfiled"}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                },
              )}
            </div>
          ) : (
            <div className="grid min-h-80 place-items-center rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center">
              <div>
                <ImageIcon className="mx-auto h-9 w-9 text-white/20" />

                <h3 className="mt-4 text-lg font-semibold text-white">
                  No media found
                </h3>

                <p className="mt-2 text-sm text-white/40">
                  Adjust the search
                  or folder filter.
                </p>
              </div>
            </div>
          )}
        </div>

        <footer className="flex flex-col gap-4 border-t border-white/10 bg-[#050B18]/80 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <p className="text-sm text-white/45">
            <span className="font-semibold text-white">
              {
                selectedIds.length
              }
            </span>{" "}
            of {maxSelection}{" "}
            selected
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-11 items-center justify-center rounded-2xl border border-white/10 px-5 text-sm font-semibold text-white/60 transition hover:bg-white/5 hover:text-white"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={
                confirmSelection
              }
              disabled={
                selectedIds.length ===
                0
              }
              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-lime-300 px-5 text-sm font-semibold text-[#050B18] transition hover:bg-lime-200 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Check className="h-4 w-4" />

              Add selected images
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}