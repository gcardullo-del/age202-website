"use client";

import Image from "next/image";

import {
  Check,
  ImageIcon,
  Images,
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

type AdminMediaPickerProps = {
  name: string;
  label: string;

  assets: MediaAssetWithFolder[];

  defaultValue?: string | null;

  description?: string;

  required?: boolean;

  className?: string;
};

export default function AdminMediaPicker({
  name,
  label,
  assets,
  defaultValue = "",
  description,
  required = false,
  className = "",
}: AdminMediaPickerProps) {
  const [
    selectedUrl,
    setSelectedUrl,
  ] = useState(
    defaultValue ?? "",
  );

  const [
    pickerOpen,
    setPickerOpen,
  ] = useState(false);

  const [
    query,
    setQuery,
  ] = useState("");

  const imageAssets =
    useMemo(
      () =>
        assets.filter(
          (asset) =>
            asset.mimeType.startsWith(
              "image/",
            ),
        ),
      [assets],
    );

  const filteredAssets =
    useMemo(() => {
      const normalized =
        query
          .trim()
          .toLowerCase();

      if (!normalized) {
        return imageAssets;
      }

      return imageAssets.filter(
        (asset) =>
          [
            asset.title,
            asset.originalName,
            asset.extension,
            ...(asset.tags ?? []),
          ]
            .join(" ")
            .toLowerCase()
            .includes(normalized),
      );
    }, [
      imageAssets,
      query,
    ]);

  const selectedAsset =
    useMemo(
      () =>
        imageAssets.find(
          (asset) =>
            asset.url ===
            selectedUrl,
        ) ?? null,
      [
        imageAssets,
        selectedUrl,
      ],
    );

  function chooseAsset(
    url: string,
  ) {
    setSelectedUrl(url);
    setPickerOpen(false);
    setQuery("");
  }

  function clearSelection() {
    setSelectedUrl("");
  }

  return (
    <>
      <div
        className={[
          "space-y-3",
          className,
        ].join(" ")}
      >
        <input
          type="hidden"
          name={name}
          value={selectedUrl}
        />

        <div className="flex items-start justify-between gap-4">
          <div>
            <label className="text-sm font-semibold text-white/80">
              {label}
            </label>

            {description ? (
              <p className="mt-1 text-xs leading-5 text-white/35">
                {description}
              </p>
            ) : null}
          </div>

          {required ? (
            <span className="shrink-0 rounded-full border border-lime-300/20 bg-lime-300/[0.06] px-2.5 py-1 font-mono text-[7px] font-black uppercase tracking-[0.14em] text-lime-200/70">
              Required
            </span>
          ) : null}
        </div>

        {selectedUrl ? (
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#08111F]">
            <div className="grid gap-5 p-4 sm:grid-cols-[180px_minmax(0,1fr)] sm:p-5">
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 bg-[#050B18] sm:aspect-square">
                <Image
                  src={selectedUrl}
                  alt={
                    selectedAsset?.alt ??
                    selectedAsset?.title ??
                    label
                  }
                  fill
                  sizes="180px"
                  className="object-cover"
                />
              </div>

              <div className="flex min-w-0 flex-col justify-between gap-5">
                <div>
                  <p className="font-mono text-[8px] font-black uppercase tracking-[0.15em] text-lime-200/65">
                    Selected media
                  </p>

                  <h3 className="mt-2 truncate text-lg font-semibold text-white">
                    {selectedAsset?.title ??
                      "External / legacy image"}
                  </h3>

                  <p className="mt-2 break-all text-xs leading-5 text-white/35">
                    {selectedUrl}
                  </p>

                  {selectedAsset ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 font-mono text-[7px] font-black uppercase tracking-[0.13em] text-white/35">
                        {
                          selectedAsset.extension
                        }
                      </span>

                      {selectedAsset.width &&
                      selectedAsset.height ? (
                        <span className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 font-mono text-[7px] font-black uppercase tracking-[0.13em] text-white/35">
                          {
                            selectedAsset.width
                          }
                          ×
                          {
                            selectedAsset.height
                          }
                        </span>
                      ) : null}
                    </div>
                  ) : null}
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setPickerOpen(
                        true,
                      )
                    }
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-lime-300/20 bg-lime-300/[0.06] px-4 text-sm font-semibold text-lime-200 transition hover:bg-lime-300/10"
                  >
                    <Images className="h-4 w-4" />

                    Change image
                  </button>

                  <button
                    type="button"
                    onClick={
                      clearSelection
                    }
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-white/10 px-4 text-sm font-semibold text-white/45 transition hover:border-red-300/20 hover:bg-red-300/[0.05] hover:text-red-200"
                  >
                    <X className="h-4 w-4" />

                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() =>
              setPickerOpen(true)
            }
            className="group flex min-h-[180px] w-full flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-[#08111F]/60 p-8 text-center transition hover:border-lime-300/25 hover:bg-lime-300/[0.025]"
          >
            <span className="grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-white/[0.035] text-white/25 transition group-hover:border-lime-300/20 group-hover:text-lime-200">
              <ImageIcon className="h-6 w-6" />
            </span>

            <span className="mt-4 text-sm font-semibold text-white/65 group-hover:text-white">
              Choose from Media Library
            </span>

            <span className="mt-2 text-xs text-white/30">
              Select an existing AGE202 image.
            </span>
          </button>
        )}
      </div>

      {pickerOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Choose ${label}`}
          className="fixed inset-0 z-[160] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
          onMouseDown={(
            event,
          ) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setPickerOpen(false);
            }
          }}
        >
          <div className="flex max-h-[90svh] w-full max-w-6xl flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[#07101F] shadow-2xl shadow-black/60">
            <div className="flex items-start justify-between gap-5 border-b border-white/10 p-5 sm:p-6">
              <div>
                <p className="font-mono text-[8px] font-black uppercase tracking-[0.18em] text-lime-200/65">
                  AGE202 Media Library
                </p>

                <h2 className="mt-2 text-2xl font-semibold text-white">
                  Choose image
                </h2>

                <p className="mt-2 text-sm text-white/40">
                  Select one reusable image from the museum library.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setPickerOpen(false)
                }
                aria-label="Close media picker"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/10 text-white/45 transition hover:bg-white/[0.05] hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="border-b border-white/10 p-4 sm:p-5">
              <label className="relative block">
                <span className="sr-only">
                  Search Media Library
                </span>

                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />

                <input
                  type="search"
                  value={query}
                  onChange={(
                    event,
                  ) =>
                    setQuery(
                      event.target
                        .value,
                    )
                  }
                  placeholder="Search title, filename, format or tag..."
                  autoFocus
                  className="h-12 w-full rounded-2xl border border-white/10 bg-[#050B18] pl-11 pr-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-lime-300/35"
                />
              </label>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
              {filteredAssets.length >
              0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredAssets.map(
                    (asset) => {
                      const selected =
                        asset.url ===
                        selectedUrl;

                      return (
                        <button
                          type="button"
                          key={asset.id}
                          onClick={() =>
                            chooseAsset(
                              asset.url,
                            )
                          }
                          className={[
                            "group overflow-hidden rounded-3xl border text-left transition",
                            selected
                              ? "border-lime-300/40 bg-lime-300/[0.06]"
                              : "border-white/10 bg-[#08111F] hover:border-white/20",
                          ].join(
                            " ",
                          )}
                        >
                          <div className="relative aspect-[4/3] overflow-hidden bg-[#050B18]">
                            <Image
                              src={
                                asset.url
                              }
                              alt={
                                asset.alt ??
                                asset.title
                              }
                              fill
                              sizes="(max-width: 640px) 100vw, 25vw"
                              className="object-cover transition duration-500 group-hover:scale-[1.035]"
                            />

                            {selected ? (
                              <span className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-lime-300 text-[#050B18] shadow-lg">
                                <Check className="h-4 w-4" />
                              </span>
                            ) : null}
                          </div>

                          <div className="p-4">
                            <p className="truncate text-sm font-semibold text-white">
                              {
                                asset.title
                              }
                            </p>

                            <p className="mt-2 truncate text-xs text-white/30">
                              {
                                asset.originalName
                              }
                            </p>

                            <div className="mt-3 flex items-center justify-between gap-3">
                              <span className="font-mono text-[7px] font-black uppercase tracking-[0.13em] text-white/30">
                                {
                                  asset.extension
                                }
                              </span>

                              {asset.width &&
                              asset.height ? (
                                <span className="font-mono text-[7px] uppercase tracking-[0.12em] text-white/20">
                                  {
                                    asset.width
                                  }
                                  ×
                                  {
                                    asset.height
                                  }
                                </span>
                              ) : null}
                            </div>
                          </div>
                        </button>
                      );
                    },
                  )}
                </div>
              ) : (
                <div className="grid min-h-[320px] place-items-center rounded-3xl border border-dashed border-white/10 bg-white/[0.015] p-8 text-center">
                  <div>
                    <Search className="mx-auto h-8 w-8 text-white/20" />

                    <h3 className="mt-4 text-lg font-semibold text-white">
                      No images found
                    </h3>

                    <p className="mt-2 text-sm text-white/35">
                      Try another search or upload the image from the Media Library.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-white/10 px-5 py-4">
              <p className="text-xs text-white/30">
                {filteredAssets.length}{" "}
                {filteredAssets.length ===
                1
                  ? "image"
                  : "images"}
              </p>

              <button
                type="button"
                onClick={() =>
                  setPickerOpen(false)
                }
                className="inline-flex h-10 items-center justify-center rounded-xl border border-white/10 px-4 text-sm font-semibold text-white/55 transition hover:bg-white/[0.05] hover:text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}