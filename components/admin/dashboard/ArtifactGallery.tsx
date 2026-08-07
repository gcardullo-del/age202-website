"use client";

import Image from "next/image";

import {
  ExternalLink,
  ImageIcon,
  Images,
  Star,
} from "lucide-react";

import type {
  ArtifactDashboardImage,
} from "@/lib/types/artifact-dashboard";

type ArtifactGalleryProps = {
  images: ArtifactDashboardImage[];
  title?: string;
  description?: string;
  className?: string;
};

export default function ArtifactGallery({
  images,
  title = "Artifact gallery",
  description = "Review the complete photographic documentation connected to this museum artifact.",
  className = "",
}: ArtifactGalleryProps) {
  const orderedImages = [
    ...images,
  ].sort(
    (first, second) => {
      if (
        first.isCover !==
        second.isCover
      ) {
        return first.isCover
          ? -1
          : 1;
      }

      return (
        first.sortOrder -
        second.sortOrder
      );
    },
  );

  const coverImage =
    orderedImages.find(
      (image) =>
        image.isCover,
    ) ??
    orderedImages[0] ??
    null;

  const secondaryImages =
    coverImage
      ? orderedImages.filter(
          (image) =>
            image.id !==
            coverImage.id,
        )
      : [];

  return (
    <section
      className={[
        "rounded-3xl border border-white/10 bg-white/[0.02] p-5 sm:p-6",
        className,
      ].join(" ")}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.18em] text-lime-200/70">
            Museum media
          </p>

          <h2 className="mt-2 text-xl font-semibold text-white">
            {title}
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/35">
            {description}
          </p>
        </div>

        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-3 py-2 font-mono text-[8px] font-black uppercase tracking-[0.14em] text-white/35">
          <Images
            className="h-3.5 w-3.5"
            aria-hidden="true"
          />

          {orderedImages.length}{" "}
          {orderedImages.length === 1
            ? "image"
            : "images"}
        </div>
      </div>

      {coverImage ? (
        <div className="mt-6 space-y-5">
          <GalleryCover
            image={coverImage}
          />

          {secondaryImages.length >
          0 ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {secondaryImages.map(
                (image) => (
                  <GalleryTile
                    key={image.id}
                    image={image}
                  />
                ),
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/10 bg-[#08111F] p-6 text-center">
              <p className="text-sm font-semibold text-white/55">
                Only the cover image is available
              </p>

              <p className="mt-2 text-xs leading-5 text-white/30">
                Additional photographic documentation can be added from the
                Artifact Studio.
              </p>
            </div>
          )}
        </div>
      ) : (
        <GalleryEmptyState />
      )}
    </section>
  );
}

function GalleryCover({
  image,
}: {
  image: ArtifactDashboardImage;
}) {
  return (
    <article className="overflow-hidden rounded-3xl border border-lime-300/20 bg-[#08111F]">
      <a
        href={image.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group block outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-lime-300/40"
        aria-label="Open cover image"
      >
        <div className="relative aspect-[16/9] overflow-hidden bg-[#050B18]">
          <Image
            src={image.url}
            alt={
              image.alt ??
              "Artifact cover image"
            }
            fill
            sizes="(max-width: 1280px) 100vw, 1100px"
            className="object-cover transition duration-500 group-hover:scale-[1.02]"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />

          <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-lime-300/25 bg-lime-300/15 px-3 py-2 font-mono text-[8px] font-black uppercase tracking-[0.14em] text-lime-200 backdrop-blur">
            <Star
              className="h-3.5 w-3.5 fill-current"
              aria-hidden="true"
            />
            Cover
          </span>

          <span className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-black/40 text-white/55 backdrop-blur transition group-hover:text-white">
            <ExternalLink
              className="h-4 w-4"
              aria-hidden="true"
            />
          </span>

          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
            <p className="font-mono text-[8px] font-black uppercase tracking-[0.15em] text-white/35">
              Sort order #{image.sortOrder}
            </p>

            <p className="mt-2 max-w-3xl text-sm font-medium text-white">
              {image.alt ??
                "Primary museum image"}
            </p>
          </div>
        </div>
      </a>
    </article>
  );
}

function GalleryTile({
  image,
}: {
  image: ArtifactDashboardImage;
}) {
  return (
    <article className="overflow-hidden rounded-2xl border border-white/10 bg-[#08111F]">
      <a
        href={image.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group block outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-lime-300/40"
        aria-label={
          image.alt
            ? `Open ${image.alt}`
            : "Open artifact image"
        }
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-[#050B18]">
          <Image
            src={image.url}
            alt={
              image.alt ??
              "Artifact image"
            }
            fill
            sizes="(max-width: 640px) 100vw, 320px"
            className="object-cover transition duration-300 group-hover:scale-[1.035]"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />

          <span className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-black/40 text-white/45 backdrop-blur transition group-hover:text-white">
            <ExternalLink
              className="h-4 w-4"
              aria-hidden="true"
            />
          </span>

          <div className="absolute inset-x-0 bottom-0 p-4">
            <p className="font-mono text-[7px] font-black uppercase tracking-[0.14em] text-white/30">
              Sort #{image.sortOrder}
            </p>

            <p className="mt-1 truncate text-xs font-medium text-white">
              {image.alt ??
                "Museum image"}
            </p>
          </div>
        </div>
      </a>
    </article>
  );
}

function GalleryEmptyState() {
  return (
    <div className="mt-6 grid min-h-72 place-items-center rounded-3xl border border-dashed border-white/10 bg-[#08111F] p-8 text-center">
      <div>
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] text-white/25">
          <ImageIcon
            className="h-6 w-6"
            aria-hidden="true"
          />
        </span>

        <h3 className="mt-5 text-lg font-semibold text-white">
          No artifact images yet
        </h3>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/35">
          Add the first image from the Artifact Studio to begin building the
          photographic museum record.
        </p>
      </div>
    </div>
  );
}