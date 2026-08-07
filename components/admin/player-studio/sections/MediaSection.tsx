"use client";

import Image from "next/image";

import {
  Check,
  ImageIcon,
  Search,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";

import type {
  MediaAssetWithFolder,
} from "@/lib/repositories/media.repository";

import {
  usePlayerStudio,
} from "../PlayerStudioForm";

type MediaSectionProps = {
  libraryAssets: MediaAssetWithFolder[];
};

type MediaTarget =
  | "hero"
  | "portrait";

const inputClassName =
  "h-12 w-full rounded-2xl border border-white/10 bg-[#08111F] px-4 text-sm text-white outline-none transition placeholder:text-white/22 focus:border-lime-300/35";

export default function MediaSection({
  libraryAssets,
}: MediaSectionProps) {
  const {
    preview,
    updatePreview,
  } = usePlayerStudio();

  const [query, setQuery] =
    useState("");

  const [target, setTarget] =
    useState<MediaTarget>("hero");

  const filteredAssets =
    useMemo(() => {
      const normalized =
        query
          .trim()
          .toLowerCase();

      if (!normalized) {
        return libraryAssets;
      }

      return libraryAssets.filter(
        (asset) =>
          [
            asset.title,
            asset.alt ?? "",
            asset.originalName,
            asset.extension,
            asset.folder?.name ?? "",
            ...(asset.tags ?? []),
          ]
            .join(" ")
            .toLowerCase()
            .includes(normalized),
      );
    }, [
      libraryAssets,
      query,
    ]);

  function selectAsset(
    url: string,
  ) {
    if (target === "hero") {
      updatePreview({
        heroImage: url,
      });

      return;
    }

    updatePreview({
      portraitImage: url,
    });
  }

  function clearTarget(
    mediaTarget: MediaTarget,
  ) {
    if (mediaTarget === "hero") {
      updatePreview({
        heroImage: null,
      });

      return;
    }

    updatePreview({
      portraitImage: null,
    });
  }

  const selectedUrl =
    target === "hero"
      ? preview.heroImage
      : preview.portraitImage;

  return (
    <section className="space-y-7">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-200/70">
          Player media
        </p>

        <h2 className="mt-2 text-2xl font-semibold text-white">
          Hero and portrait
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/40">
          Choose reusable images from the AGE202 Media Library or enter a
          public path manually. Changes are reflected immediately in the live
          preview.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <MediaSlot
          label="Hero image"
          description="Wide visual used across the public player profile."
          value={
            preview.heroImage ??
            ""
          }
          active={target === "hero"}
          onActivate={() =>
            setTarget("hero")
          }
          onChange={(value) =>
            updatePreview({
              heroImage:
                value || null,
            })
          }
          onClear={() =>
            clearTarget("hero")
          }
          icon={Sparkles}
          name="heroImage"
        />

        <MediaSlot
          label="Portrait image"
          description="Alternative vertical image and profile fallback."
          value={
            preview.portraitImage ??
            ""
          }
          active={
            target === "portrait"
          }
          onActivate={() =>
            setTarget("portrait")
          }
          onChange={(value) =>
            updatePreview({
              portraitImage:
                value || null,
            })
          }
          onClear={() =>
            clearTarget(
              "portrait",
            )
          }
          icon={UserRound}
          name="portraitImage"
        />
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/[0.015] p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.18em] text-lime-200/70">
              Media Library
            </p>

            <h3 className="mt-2 text-lg font-semibold text-white">
              Choose {target === "hero" ? "Hero" : "Portrait"}
            </h3>
          </div>

          <div className="inline-flex rounded-2xl border border-white/10 bg-[#08111F] p-1">
            <TargetButton
              active={
                target === "hero"
              }
              label="Hero"
              onClick={() =>
                setTarget("hero")
              }
            />

            <TargetButton
              active={
                target ===
                "portrait"
              }
              label="Portrait"
              onClick={() =>
                setTarget(
                  "portrait",
                )
              }
            />
          </div>
        </div>

        <label className="relative mt-5 block">
          <span className="sr-only">
            Search Media Library
          </span>

          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />

          <input
            type="search"
            value={query}
            onChange={(event) =>
              setQuery(
                event.target.value,
              )
            }
            placeholder="Search title, filename, folder or tags..."
            className={`${inputClassName} pl-11`}
          />
        </label>

        {filteredAssets.length > 0 ? (
          <div className="mt-5 grid max-h-[560px] grid-cols-2 gap-3 overflow-y-auto pr-1 sm:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3">
            {filteredAssets.map(
              (asset) => {
                const selected =
                  selectedUrl ===
                  asset.url;

                return (
                  <button
                    key={asset.id}
                    type="button"
                    onClick={() =>
                      selectAsset(
                        asset.url,
                      )
                    }
                    className={[
                      "group overflow-hidden rounded-2xl border text-left transition",
                      selected
                        ? "border-lime-300/45 bg-lime-300/[0.06]"
                        : "border-white/10 bg-[#08111F] hover:border-white/20",
                    ].join(" ")}
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
                        sizes="240px"
                        className="object-cover transition duration-300 group-hover:scale-[1.025]"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

                      {selected ? (
                        <span className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-lime-300 text-[#050B18]">
                          <Check className="h-4 w-4" />
                        </span>
                      ) : null}
                    </div>

                    <div className="p-3">
                      <p className="truncate text-xs font-semibold text-white">
                        {asset.title}
                      </p>

                      <p className="mt-1 truncate text-[10px] text-white/30">
                        {asset.folder?.name ??
                          "Unfiled"}{" "}
                        ·{" "}
                        {asset.extension.toUpperCase()}
                      </p>
                    </div>
                  </button>
                );
              },
            )}
          </div>
        ) : (
          <div className="mt-5 grid min-h-48 place-items-center rounded-3xl border border-dashed border-white/10 bg-[#08111F] p-8 text-center">
            <div>
              <ImageIcon className="mx-auto h-8 w-8 text-white/20" />

              <h3 className="mt-4 text-base font-semibold text-white">
                No media found
              </h3>

              <p className="mt-2 text-sm text-white/35">
                Try another search or upload images from the Media Library.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

type MediaSlotProps = {
  label: string;
  description: string;
  value: string;
  active: boolean;
  onActivate: () => void;
  onChange: (
    value: string,
  ) => void;
  onClear: () => void;
  icon: typeof Sparkles;
  name: string;
};

function MediaSlot({
  label,
  description,
  value,
  active,
  onActivate,
  onChange,
  onClear,
  icon: Icon,
  name,
}: MediaSlotProps) {
  return (
    <div
      className={[
        "rounded-3xl border p-4 transition",
        active
          ? "border-lime-300/35 bg-lime-300/[0.05]"
          : "border-white/10 bg-[#08111F]",
      ].join(" ")}
    >
      <button
        type="button"
        onClick={onActivate}
        className="flex w-full items-start gap-3 text-left"
      >
        <span
          className={[
            "grid h-10 w-10 shrink-0 place-items-center rounded-xl",
            active
              ? "bg-lime-300 text-[#050B18]"
              : "bg-white/[0.05] text-white/35",
          ].join(" ")}
        >
          <Icon className="h-4 w-4" />
        </span>

        <span>
          <span className="block text-sm font-semibold text-white">
            {label}
          </span>

          <span className="mt-1 block text-xs leading-5 text-white/35">
            {description}
          </span>
        </span>
      </button>

      <div className="relative mt-4 aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 bg-[#050B18]">
        {value ? (
          <Image
            src={value}
            alt={label}
            fill
            sizes="480px"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center">
            <ImageIcon className="h-8 w-8 text-white/18" />
          </div>
        )}

        {value ? (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-black/55 text-white/60 backdrop-blur transition hover:text-white"
            aria-label={`Clear ${label}`}
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      <label className="mt-4 block">
        <span className="mb-2 block text-[9px] font-black uppercase tracking-[0.15em] text-white/30">
          Public path or URL
        </span>

        <input
          name={name}
          value={value}
          onChange={(event) =>
            onChange(
              event.target.value,
            )
          }
          className={inputClassName}
          placeholder="/players/example/hero.jpg"
        />
      </label>
    </div>
  );
}

type TargetButtonProps = {
  active: boolean;
  label: string;
  onClick: () => void;
};

function TargetButton({
  active,
  label,
  onClick,
}: TargetButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-xl px-4 py-2 text-xs font-semibold transition",
        active
          ? "bg-lime-300 text-[#050B18]"
          : "text-white/40 hover:text-white",
      ].join(" ")}
    >
      {label}
    </button>
  );
}