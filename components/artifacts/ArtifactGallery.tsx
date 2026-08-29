"use client";

import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Expand,
  X,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useState,
} from "react";

export type ArtifactGalleryImage = {
  id: string;
  url: string;
  galleryUrl: string | null;
  detailUrl: string | null;
  alt: string | null;
};
type ArtifactGalleryProps = {
  images: ArtifactGalleryImage[];
  artifactTitle: string;
};

export default function ArtifactGallery({
  images,
  artifactTitle,
}: ArtifactGalleryProps) {
  const [activeIndex, setActiveIndex] =
    useState<number | null>(null);

  const isOpen = activeIndex !== null;

  const closeLightbox = useCallback(() => {
    setActiveIndex(null);
  }, []);

  const showPrevious = useCallback(() => {
    setActiveIndex((currentIndex) => {
      if (currentIndex === null) {
        return null;
      }

      return currentIndex === 0
        ? images.length - 1
        : currentIndex - 1;
    });
  }, [images.length]);

  const showNext = useCallback(() => {
    setActiveIndex((currentIndex) => {
      if (currentIndex === null) {
        return null;
      }

      return currentIndex ===
        images.length - 1
        ? 0
        : currentIndex + 1;
    });
  }, [images.length]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (event.key === "Escape") {
        closeLightbox();
      }

      if (event.key === "ArrowLeft") {
        showPrevious();
      }

      if (event.key === "ArrowRight") {
        showNext();
      }
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [
    closeLightbox,
    isOpen,
    showNext,
    showPrevious,
  ]);

  if (images.length === 0) {
    return null;
  }

  const activeImage =
    activeIndex !== null
      ? images[activeIndex]
      : null;

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image, index) => (
          <button
            key={image.id}
            type="button"
            onClick={() =>
              setActiveIndex(index)
            }
            className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 text-left ${
              index === 0
                ? "sm:col-span-2 lg:col-span-2"
                : ""
            }`}
            aria-label={`Apri immagine ${index + 1} di ${images.length}`}
          >
            <div
              className={
                index === 0
                  ? "relative aspect-[16/10]"
                  : "relative aspect-[4/5]"
              }
            >
              <Image
                src={image.galleryUrl ??image.url}
                alt={
                  image.alt ??
                  `${artifactTitle} – immagine ${index + 1}`
                }
                fill
                sizes={
                  index === 0
                    ? "(max-width: 1024px) 100vw, 66vw"
                    : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                }
                className="object-cover transition duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60 transition group-hover:opacity-90" />

              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
                  Immagine {index + 1}
                </span>

                <span className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-black/40 text-white backdrop-blur transition group-hover:bg-lime-300 group-hover:text-[#050b18]">
                  <Expand className="h-4 w-4" />
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {isOpen && activeImage && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 px-4 py-6 backdrop-blur-md sm:px-8"
          role="dialog"
          aria-modal="true"
          aria-label={`Galleria fotografica di ${artifactTitle}`}
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute right-5 top-5 z-20 grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white hover:text-black"
            aria-label="Chiudi galleria"
          >
            <X className="h-5 w-5" />
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={showPrevious}
                className="absolute left-3 top-1/2 z-20 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-black/50 text-white transition hover:bg-lime-300 hover:text-[#050b18] sm:left-6"
                aria-label="Immagine precedente"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <button
                type="button"
                onClick={showNext}
                className="absolute right-3 top-1/2 z-20 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-black/50 text-white transition hover:bg-lime-300 hover:text-[#050b18] sm:right-6"
                aria-label="Immagine successiva"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          <div className="flex h-full w-full max-w-7xl flex-col">
            <div className="relative min-h-0 flex-1">
              <Image
                src={
  activeImage.detailUrl ??
  activeImage.galleryUrl ??
  activeImage.url
}
                alt={
                  activeImage.alt ??
                  `${artifactTitle} – immagine ${(activeIndex ?? 0) + 1}`
                }
                fill
                priority
                sizes="100vw"
                className="object-contain"
              />
            </div>

            <div className="flex shrink-0 items-center justify-between gap-6 pt-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-lime-300">
                  AGE202 Museum
                </p>

                <p className="mt-2 max-w-2xl truncate text-sm text-white/70">
                  {activeImage.alt ??
                    artifactTitle}
                </p>
              </div>

              <p className="shrink-0 font-mono text-sm text-white/50">
                {String(
                  (activeIndex ?? 0) + 1,
                ).padStart(2, "0")}
                {" / "}
                {String(
                  images.length,
                ).padStart(2, "0")}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}