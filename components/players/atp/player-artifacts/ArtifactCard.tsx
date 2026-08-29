import Image from "next/image";
import Link from "next/link";

import {
  ArrowUpRight,
  BadgeCheck,
  PackageSearch,
} from "lucide-react";

import MuseumCard from "@/components/archive/ui/MuseumCard";

import type {
  ArtifactCardProps,
} from "./types";

import {
  formatPrice,
  getAvailabilityBadgeClass,
} from "./utils";

export default function ArtifactCard({
  artifact,
  accent,
}: ArtifactCardProps) {
  const cover =
    artifact.images.find(
      (image) =>
        image.isCover,
    ) ??
    artifact.images[0] ??
    null;

  const price =
    formatPrice(
      artifact.price,
      artifact.currency,
    );

  const artifactHref =
    `/artifacts/${artifact.slug}`;

  const isAvailable =
    artifact.availability ===
    "AVAILABLE";

  const ctaLabel =
    isAvailable
      ? "Explore & Collect"
      : "Explore Artifact";

  return (
    <MuseumCard
      as="article"
      accent={accent}
      className="overflow-hidden rounded-[1.8rem] bg-[#09111f] hover:-translate-y-1.5"
      contentClassName="h-full"
      radiusClassName="rounded-[1.8rem]"
      glow={false}
    >
      <Link
        href={artifactHref}
        aria-label={`Explore ${artifact.title}`}
        className="block outline-none focus-visible:ring-2 focus-visible:ring-inset"
        style={{
          outlineColor:
            accent,
        }}
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-[#050b18]">
          {cover ? (
            <Image
              fill
              src={
  cover.cardUrl ??
  cover.url
}
              alt={
                cover.alt ??
                artifact.title
              }
              className="object-cover transition duration-700 group-hover:scale-[1.04]"
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center">
              <PackageSearch
                className="text-white/10"
                size={52}
                aria-hidden="true"
              />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-[#050b18]/45 via-transparent to-black/10" />

          <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-5">
            <span className="rounded-full border border-white/10 bg-black/45 px-3 py-2 font-mono text-[7px] uppercase tracking-[0.14em] text-white/65 backdrop-blur-md">
              {
                artifact.archiveNumber
              }
            </span>

            <span
              className={[
                "rounded-full border px-3 py-2 font-mono text-[7px] uppercase tracking-[0.14em] backdrop-blur-md",
                getAvailabilityBadgeClass(
                  artifact.availability,
                ),
              ].join(" ")}
            >
              {artifact.availability.replaceAll(
                "_",
                " ",
              )}
            </span>
          </div>

          <span
            className="absolute bottom-5 right-5 grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-black/45 text-white/70 backdrop-blur-md transition duration-300 group-hover:text-[#050b18]"
            style={{
              borderColor:
                `${accent}55`,
            }}
          >
            <ArrowUpRight
              size={17}
              aria-hidden="true"
            />
          </span>
        </div>
      </Link>

      <div className="p-6">
        <p
          className="font-mono text-[8px] font-black uppercase tracking-[0.2em]"
          style={{
            color: accent,
          }}
        >
          {artifact.brand.name}
        </p>

        <Link
          href={artifactHref}
          className="outline-none transition"
        >
          <h3 className="mt-4 text-2xl font-black uppercase leading-tight tracking-[-0.025em]">
            {artifact.title}
          </h3>
        </Link>

        {artifact.subtitle ? (
          <p className="mt-3 text-sm leading-6 text-white/45">
            {artifact.subtitle}
          </p>
        ) : null}

        <div className="mt-6 border-t border-white/10 pt-5">
          <div className="flex items-start justify-between gap-5">
            <div>
              <span className="block text-sm font-black text-white">
                {price ??
                  "Museum record"}
              </span>

              <span className="mt-2 inline-flex items-center gap-1.5 font-mono text-[7px] uppercase tracking-[0.12em] text-white/30">
                <BadgeCheck
                  size={11}
                  style={{
                    color: accent,
                  }}
                  aria-hidden="true"
                />

                AGE202 archive record
              </span>
            </div>
          </div>

          <div className="mt-5">
            <Link
              href={artifactHref}
              className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full px-5 py-3.5 text-center text-[8px] font-black uppercase tracking-[0.18em] text-[#050b18] transition duration-300 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2"
              style={{
                backgroundColor:
                  accent,
              }}
              aria-label={`${ctaLabel}: ${artifact.title}`}
            >
              {ctaLabel}

              <ArrowUpRight
                size={13}
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>

            {isAvailable ? (
              <p className="mt-3 text-center font-mono text-[7px] uppercase tracking-[0.14em] text-white/25">
                Available to collect
              </p>
            ) : (
              <p className="mt-3 text-center font-mono text-[7px] uppercase tracking-[0.14em] text-white/25">
                AGE202 museum archive
              </p>
            )}
          </div>
        </div>
      </div>
    </MuseumCard>
  );
}