"use client";

import {
  Check,
  ImageIcon,
  Search,
  X,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";


export type MediaPickerAsset = {
  id: string;
  title: string;
  url: string;
  alt: string | null;
  originalName: string;
  mimeType: string;
};


type MediaPickerProps = {
  assets: MediaPickerAsset[];
  selectedId?: string | null;
  onSelect: (
    asset: MediaPickerAsset,
  ) => void;
  onClear?: () => void;
  triggerLabel?: string;
};


export default function MediaPicker({
  assets,
  selectedId,
  onSelect,
  onClear,
  triggerLabel =
    "Choose from Media Library",
}: MediaPickerProps) {
  const [
    open,
    setOpen,
  ] =
    useState(false);

  const [
    query,
    setQuery,
  ] =
    useState("");


  const selectedAsset =
    useMemo(
      () =>
        assets.find(
          (asset) =>
            asset.id ===
            selectedId,
        ) ??
        null,
      [
        assets,
        selectedId,
      ],
    );


  const filteredAssets =
    useMemo(
      () => {
        const normalized =
          query
            .trim()
            .toLowerCase();

        if (
          !normalized
        ) {
          return assets;
        }

        return assets.filter(
          (asset) =>
            [
              asset.title,
              asset.originalName,
              asset.mimeType,
            ]
              .join(" ")
              .toLowerCase()
              .includes(
                normalized,
              ),
        );
      },
      [
        assets,
        query,
      ],
    );


  return (
    <>
      <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-[8px] font-black uppercase tracking-[0.16em] text-white/30">
              Media Library
            </p>

            <p className="mt-2 text-sm font-semibold text-white/70">
              {selectedAsset
                ? selectedAsset.title
                : "No Media Library asset selected"}
            </p>

            {selectedAsset ? (
              <p className="mt-1 truncate text-xs text-white/30">
                {selectedAsset.originalName}
              </p>
            ) : null}
          </div>


          <div className="flex flex-wrap gap-2">
            {selectedAsset &&
            onClear ? (
              <button
                type="button"
                onClick={
                  onClear
                }
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 text-xs font-semibold text-white/50 transition hover:border-red-300/20 hover:text-red-100"
              >
                <X className="h-3.5 w-3.5" />

                Clear
              </button>
            ) : null}


            <button
              type="button"
              onClick={
                () =>
                  setOpen(
                    true,
                  )
              }
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-lime-300 px-4 text-xs font-black text-[#050B18] transition hover:bg-lime-200"
            >
              <ImageIcon className="h-4 w-4" />

              {triggerLabel}
            </button>
          </div>
        </div>
      </div>


      {open ? (
        <div
          className="fixed inset-0 z-[140] bg-black/80 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Choose Media Library asset"
          onMouseDown={
            (
              event,
            ) => {
              if (
                event.target ===
                event.currentTarget
              ) {
                setOpen(
                  false,
                );
              }
            }
          }
        >
          <div className="mx-auto flex h-full max-h-[880px] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#08111F] shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-white/10 p-5 sm:p-6">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-lime-300/70">
                  AGE202 Media Library
                </p>

                <h2 className="mt-2 text-2xl font-semibold text-white">
                  Choose image
                </h2>

                <p className="mt-2 text-sm text-white/35">
                  Select one reusable image from the existing Media Library.
                </p>
              </div>


              <button
                type="button"
                aria-label="Close Media Library picker"
                onClick={
                  () =>
                    setOpen(
                      false,
                    )
                }
                className="rounded-full border border-white/10 p-2 text-white/50 transition hover:bg-white/5 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>


            <div className="border-b border-white/10 p-5 sm:p-6">
              <label className="relative block">
                <span className="sr-only">
                  Search media
                </span>

                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />

                <input
                  type="search"
                  value={
                    query
                  }
                  onChange={
                    (
                      event,
                    ) =>
                      setQuery(
                        event.target.value,
                      )
                  }
                  placeholder="Search by title or filename..."
                  className="h-12 w-full rounded-2xl border border-white/10 bg-[#050B18] pl-11 pr-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-lime-300/35"
                />
              </label>
            </div>


            <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">
              {filteredAssets.length >
              0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredAssets.map(
                    (
                      asset,
                    ) => {
                      const selected =
                        asset.id ===
                        selectedId;

                      return (
                        <button
                          key={
                            asset.id
                          }
                          type="button"
                          onClick={
                            () => {
                              onSelect(
                                asset,
                              );

                              setOpen(
                                false,
                              );
                            }
                          }
                          className={[
                            "group overflow-hidden rounded-2xl border text-left transition",
                            selected
                              ? "border-lime-300/50 bg-lime-300/[0.06]"
                              : "border-white/10 bg-white/[0.025] hover:border-white/20",
                          ].join(
                            " ",
                          )}
                        >
                          <div className="relative aspect-[4/3] overflow-hidden bg-[#050B18]">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={
                                asset.url
                              }
                              alt={
                                asset.alt ??
                                asset.title
                              }
                              className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                            />

                            {selected ? (
                              <span className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-lime-300 text-[#050B18]">
                                <Check className="h-4 w-4" />
                              </span>
                            ) : null}
                          </div>


                          <div className="p-4">
                            <p className="truncate text-sm font-semibold text-white/80">
                              {asset.title}
                            </p>

                            <p className="mt-1 truncate text-xs text-white/30">
                              {asset.originalName}
                            </p>
                          </div>
                        </button>
                      );
                    },
                  )}
                </div>
              ) : (
                <div className="grid min-h-64 place-items-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center">
                  <div>
                    <ImageIcon className="mx-auto h-8 w-8 text-white/20" />

                    <p className="mt-4 text-sm font-semibold text-white/50">
                      No matching media
                    </p>

                    <p className="mt-1 text-xs text-white/25">
                      Try a different search.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}