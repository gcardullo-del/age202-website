"use client";

import Image from "next/image";

import {
  Check,
  FolderKanban,
  Sparkles,
} from "lucide-react";

import type {
  MuseumCollectionListItem,
} from "@/lib/repositories/museum-collection.repository";

type CollectionCardProps = {
  collection: MuseumCollectionListItem;
  selected: boolean;
  onToggle: () => void;
};

function formatEnumLabel(
  value: string,
): string {
  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase(),
    );
}

export default function CollectionCard({
  collection,
  selected,
  onToggle,
}: CollectionCardProps) {
  const heroImage =
    collection.heroImageUrl;

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={selected}
      className={[
        "group relative w-full overflow-hidden rounded-[2rem] border text-left outline-none transition duration-300",
        "focus-visible:ring-2 focus-visible:ring-lime-300/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050B18]",
        selected
          ? "border-lime-300/55 bg-lime-300/[0.07] shadow-[0_0_0_1px_rgba(200,255,0,0.08),0_24px_70px_rgba(0,0,0,0.35)]"
          : "border-white/10 bg-[#08111F] hover:-translate-y-0.5 hover:border-white/20 hover:shadow-[0_22px_60px_rgba(0,0,0,0.3)]",
      ].join(" ")}
    >
      <div
        className="relative min-h-[290px] overflow-hidden sm:min-h-[320px]"
        style={{
          background:
            `linear-gradient(145deg, ${collection.secondaryColor}, #050B18)`,
        }}
      >
        {heroImage ? (
          <Image
            src={heroImage}
            alt={
              collection.title
            }
            fill
            sizes="(max-width: 768px) 100vw, 900px"
            className="object-cover transition duration-500 group-hover:scale-[1.035]"
          />
        ) : (
          <div className="absolute inset-0">
            <div
              className="absolute inset-0 opacity-30"
              style={{
                background:
                  `radial-gradient(circle at 72% 28%, ${collection.primaryColor}55, transparent 34%)`,
              }}
            />

            <div className="absolute inset-0 grid place-items-center">
              <span
                className="grid h-24 w-24 place-items-center rounded-[1.75rem] border"
                style={{
                  borderColor:
                    `${collection.primaryColor}35`,
                  backgroundColor:
                    `${collection.primaryColor}12`,
                }}
              >
                <FolderKanban
                  className="h-10 w-10"
                  style={{
                    color:
                      collection.primaryColor,
                  }}
                  aria-hidden="true"
                />
              </span>
            </div>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#050B18] via-[#050B18]/28 to-black/10" />

        <div className="absolute left-5 right-5 top-5 flex items-start justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <span
              className="rounded-full border px-3 py-1.5 font-mono text-[7px] font-black uppercase tracking-[0.14em] backdrop-blur"
              style={{
                borderColor:
                  `${collection.primaryColor}55`,
                backgroundColor:
                  `${collection.primaryColor}18`,
                color:
                  collection.primaryColor,
              }}
            >
              {formatEnumLabel(
                collection.type,
              )}
            </span>

            <span className="rounded-full border border-white/10 bg-black/35 px-3 py-1.5 font-mono text-[7px] font-black uppercase tracking-[0.14em] text-white/60 backdrop-blur">
              {formatEnumLabel(
                collection.status,
              )}
            </span>

            {collection.featured ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-lime-300/25 bg-lime-300/10 px-3 py-1.5 font-mono text-[7px] font-black uppercase tracking-[0.14em] text-lime-200 backdrop-blur">
                <Sparkles
                  className="h-3 w-3"
                  aria-hidden="true"
                />
                Featured
              </span>
            ) : null}
          </div>

          <span
            className={[
              "grid h-10 w-10 shrink-0 place-items-center rounded-full border backdrop-blur transition",
              selected
                ? "border-lime-200/45 bg-lime-300 text-[#050B18]"
                : "border-white/15 bg-black/40 text-white/30 group-hover:border-white/25 group-hover:text-white/70",
            ].join(" ")}
            aria-hidden="true"
          >
            <Check className="h-4 w-4" />
          </span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-7">
          <p
            className="text-[8px] font-black uppercase tracking-[0.2em]"
            style={{
              color:
                collection.primaryColor,
            }}
          >
            AGE202 Museum Exhibition
          </p>

          <h3 className="mt-3 max-w-3xl text-3xl font-black uppercase leading-[0.92] tracking-[-0.05em] text-white sm:text-4xl">
            {collection.title}
          </h3>

          {collection.subtitle ? (
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/50">
              {
                collection.subtitle
              }
            </p>
          ) : collection.description ? (
            <p className="mt-3 max-w-2xl line-clamp-2 text-sm leading-6 text-white/45">
              {
                collection.description
              }
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-2 border-t border-white/10 sm:grid-cols-4">
        <CollectionMetric
          label="Players"
          value={
            collection.playerCount
          }
        />

        <CollectionMetric
          label="Artifacts"
          value={
            collection.artifactCount
          }
        />

        <CollectionMetric
          label="Originals"
          value={
            collection.originalCount
          }
        />

        <CollectionMetric
          label="Media"
          value={
            collection.mediaCount
          }
        />
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-white/10 px-5 py-4">
        <div>
          <p className="font-mono text-[7px] font-black uppercase tracking-[0.14em] text-white/25">
            Collection slug
          </p>

          <p className="mt-1 text-xs text-white/45">
            {collection.slug}
          </p>
        </div>

        <span
          className={[
            "rounded-full border px-3 py-2 font-mono text-[7px] font-black uppercase tracking-[0.14em]",
            selected
              ? "border-lime-300/25 bg-lime-300/10 text-lime-200"
              : "border-white/10 bg-white/[0.025] text-white/35",
          ].join(" ")}
        >
          {selected
            ? "Included"
            : "Select collection"}
        </span>
      </div>
    </button>
  );
}

function CollectionMetric({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="border-b border-r border-white/10 p-4 text-center last:border-r-0 sm:border-b-0">
      <p className="text-xl font-semibold text-white">
        {value}
      </p>

      <p className="mt-1 font-mono text-[6px] font-black uppercase tracking-[0.12em] text-white/25">
        {label}
      </p>
    </div>
  );
}