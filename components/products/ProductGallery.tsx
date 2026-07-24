"use client";

import Image from "next/image";
import {
  AnimatePresence,
  motion,
} from "framer-motion";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

type ProductGalleryProps = {
  images: string[];
  title: string;
};

export default function ProductGallery({
  images,
  title,
}: ProductGalleryProps) {
  const safeImages = images.filter(Boolean);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [zoomed, setZoomed] = useState(false);

  const galleryTouchStartX = useRef<number | null>(null);
  const galleryTouchEndX = useRef<number | null>(null);

  const viewerTouchStartX = useRef<number | null>(null);
  const viewerTouchEndX = useRef<number | null>(null);

  const selectedImage = safeImages[selectedIndex];

  const previousImage = useCallback(() => {
    if (safeImages.length <= 1) {
      return;
    }

    setSelectedIndex((currentIndex) =>
      currentIndex === 0
        ? safeImages.length - 1
        : currentIndex - 1
    );

    setZoomed(false);
  }, [safeImages.length]);

  const nextImage = useCallback(() => {
    if (safeImages.length <= 1) {
      return;
    }

    setSelectedIndex((currentIndex) =>
      currentIndex === safeImages.length - 1
        ? 0
        : currentIndex + 1
    );

    setZoomed(false);
  }, [safeImages.length]);

  const selectImage = (index: number) => {
    setSelectedIndex(index);
    setZoomed(false);
  };

  const openViewer = () => {
    setViewerOpen(true);
    setZoomed(false);
  };

  const closeViewer = useCallback(() => {
    setViewerOpen(false);
    setZoomed(false);
  }, []);

  useEffect(() => {
    if (!viewerOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeViewer();
      }

      if (event.key === "ArrowLeft") {
        previousImage();
      }

      if (event.key === "ArrowRight") {
        nextImage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    viewerOpen,
    closeViewer,
    previousImage,
    nextImage,
  ]);

  useEffect(() => {
    if (!viewerOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [viewerOpen]);

  useEffect(() => {
    if (selectedIndex >= safeImages.length) {
      setSelectedIndex(0);
    }
  }, [safeImages.length, selectedIndex]);

  const handleGalleryTouchStart = (
    event: React.TouchEvent<HTMLDivElement>
  ) => {
    galleryTouchStartX.current =
      event.targetTouches[0].clientX;

    galleryTouchEndX.current = null;
  };

  const handleGalleryTouchMove = (
    event: React.TouchEvent<HTMLDivElement>
  ) => {
    galleryTouchEndX.current =
      event.targetTouches[0].clientX;
  };

  const handleGalleryTouchEnd = () => {
    handleSwipe(
      galleryTouchStartX,
      galleryTouchEndX
    );
  };

  const handleViewerTouchStart = (
    event: React.TouchEvent<HTMLDivElement>
  ) => {
    viewerTouchStartX.current =
      event.targetTouches[0].clientX;

    viewerTouchEndX.current = null;
  };

  const handleViewerTouchMove = (
    event: React.TouchEvent<HTMLDivElement>
  ) => {
    viewerTouchEndX.current =
      event.targetTouches[0].clientX;
  };

  const handleViewerTouchEnd = () => {
    handleSwipe(
      viewerTouchStartX,
      viewerTouchEndX
    );
  };

  const handleSwipe = (
    touchStartRef: React.MutableRefObject<number | null>,
    touchEndRef: React.MutableRefObject<number | null>
  ) => {
    if (
      touchStartRef.current === null ||
      touchEndRef.current === null
    ) {
      return;
    }

    const distance =
      touchStartRef.current - touchEndRef.current;

    if (distance > 60) {
      nextImage();
    }

    if (distance < -60) {
      previousImage();
    }

    touchStartRef.current = null;
    touchEndRef.current = null;
  };

  if (safeImages.length === 0 || !selectedImage) {
    return (
      <div className="flex min-h-[520px] items-center justify-center rounded-[36px] border border-white/10 bg-[#0B132B] px-6 text-center">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.35em] text-[#C8FF00]">
            AGE202 Archive
          </p>

          <p className="mt-4 text-lg font-bold text-gray-400">
            No images available for this archive piece.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-5">
        {/* MAIN IMAGE */}

        <motion.div
          key={selectedImage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35 }}
          onTouchStart={handleGalleryTouchStart}
          onTouchMove={handleGalleryTouchMove}
          onTouchEnd={handleGalleryTouchEnd}
          className="group relative min-h-[520px] touch-pan-y overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-b from-[#172238] to-[#0B132B] md:min-h-[720px]"
        >
          <button
            type="button"
            onClick={openViewer}
            aria-label={`Open fullscreen gallery for ${title}`}
            className="absolute inset-0 z-10 cursor-zoom-in"
          >
            <span className="sr-only">
              Open fullscreen image viewer
            </span>
          </button>

          <Image
            src={selectedImage}
            alt={`${title} image ${selectedIndex + 1}`}
            fill
            priority={selectedIndex === 0}
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="select-none object-contain p-6 transition-transform duration-700 group-hover:scale-[1.015] md:p-10"
            draggable={false}
          />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050B18]/45 via-transparent to-transparent" />

          {/* IMAGE COUNTER */}

          <div className="pointer-events-none absolute right-5 top-5 z-20 rounded-full border border-white/10 bg-[#050B18]/70 px-4 py-2 text-xs font-bold tracking-[0.2em] text-white backdrop-blur-md">
            {String(selectedIndex + 1).padStart(2, "0")} /{" "}
            {String(safeImages.length).padStart(2, "0")}
          </div>

          {/* FULLSCREEN INDICATOR */}

          <div className="pointer-events-none absolute bottom-5 left-5 z-20 flex items-center gap-3 rounded-full border border-white/10 bg-[#050B18]/70 px-5 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 opacity-100 backdrop-blur-md transition-all duration-300 md:opacity-0 md:group-hover:opacity-100">
            <FullscreenIcon />

            View details
          </div>

          {/* DESKTOP ARROWS */}

          {safeImages.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous image"
                onClick={(event) => {
                  event.stopPropagation();
                  previousImage();
                }}
                className="absolute left-5 top-1/2 z-30 hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-[#050B18]/75 text-2xl text-white backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-[#C8FF00] hover:bg-[#C8FF00] hover:text-black md:flex"
              >
                ←
              </button>

              <button
                type="button"
                aria-label="Next image"
                onClick={(event) => {
                  event.stopPropagation();
                  nextImage();
                }}
                className="absolute right-5 top-1/2 z-30 hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-[#050B18]/75 text-2xl text-white backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-[#C8FF00] hover:bg-[#C8FF00] hover:text-black md:flex"
              >
                →
              </button>
            </>
          )}
        </motion.div>

        {/* THUMBNAILS */}

        {safeImages.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {safeImages.map((image, index) => {
              const active = selectedIndex === index;

              return (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => selectImage(index)}
                  aria-label={`View image ${index + 1}`}
                  aria-pressed={active}
                  className={`relative aspect-square w-24 shrink-0 overflow-hidden rounded-2xl border bg-[#111B2E] transition-all duration-300 sm:w-28 ${
                    active
                      ? "scale-[1.02] border-[#C8FF00] opacity-100 shadow-[0_0_25px_rgba(200,255,0,.18)]"
                      : "border-white/10 opacity-55 hover:border-white/30 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${title} thumbnail ${index + 1}`}
                    fill
                    sizes="112px"
                    className="object-contain p-2"
                  />

                  {active && (
                    <span className="absolute inset-x-3 bottom-2 h-0.5 rounded-full bg-[#C8FF00]" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* FULLSCREEN VIEWER */}

      <AnimatePresence>
        {viewerOpen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${title} fullscreen gallery`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                closeViewer();
              }
            }}
            className="fixed inset-0 z-[100] flex flex-col bg-black/98"
          >
            {/* VIEWER HEADER */}

            <div className="relative z-30 flex h-20 shrink-0 items-center justify-between border-b border-white/10 px-4 sm:px-6 md:px-10">
              <div className="min-w-0">
                <p className="text-[9px] font-black uppercase tracking-[0.32em] text-[#C8FF00] sm:text-[10px]">
                  AGE202 Collection Viewer
                </p>

                <p className="mt-1 max-w-[180px] truncate text-sm font-bold text-white sm:max-w-sm md:max-w-xl">
                  {title}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setZoomed((current) => !current)}
                  aria-label={
                    zoomed
                      ? "Reduce image zoom"
                      : "Zoom image"
                  }
                  className={`flex h-11 items-center justify-center gap-2 rounded-full border px-4 text-[10px] font-black uppercase tracking-[0.16em] transition-all duration-300 ${
                    zoomed
                      ? "border-[#C8FF00] bg-[#C8FF00] text-black"
                      : "border-white/10 bg-white/[0.04] text-white hover:border-[#C8FF00]/50 hover:text-[#C8FF00]"
                  }`}
                >
                  <ZoomIcon zoomed={zoomed} />

                  <span className="hidden sm:inline">
                    {zoomed ? "Reset" : "Zoom"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={closeViewer}
                  aria-label="Close fullscreen gallery"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-xl text-white transition-all duration-300 hover:rotate-90 hover:border-[#C8FF00] hover:text-[#C8FF00]"
                >
                  ×
                </button>
              </div>
            </div>

            {/* VIEWER IMAGE */}

            <div
              onTouchStart={handleViewerTouchStart}
              onTouchMove={handleViewerTouchMove}
              onTouchEnd={handleViewerTouchEnd}
              className={`relative flex min-h-0 flex-1 items-center justify-center overflow-hidden ${
                zoomed
                  ? "cursor-zoom-out overflow-auto"
                  : "cursor-zoom-in touch-pan-y"
              }`}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${selectedImage}-${zoomed}`}
                  initial={{
                    opacity: 0,
                    scale: 0.985,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.985,
                  }}
                  transition={{ duration: 0.25 }}
                  onClick={() =>
                    setZoomed((current) => !current)
                  }
                  className={`relative ${
                    zoomed
                      ? "h-[140vh] w-[140vw] min-w-[1100px]"
                      : "h-full w-full"
                  }`}
                >
                  <Image
                    src={selectedImage}
                    alt={`${title} fullscreen image ${
                      selectedIndex + 1
                    }`}
                    fill
                    priority
                    sizes="100vw"
                    className={`select-none ${
                      zoomed
                        ? "object-contain p-2"
                        : "object-contain p-4 sm:p-8 md:p-12"
                    }`}
                    draggable={false}
                  />
                </motion.div>
              </AnimatePresence>

              {/* VIEWER COUNTER */}

              <div className="pointer-events-none absolute left-1/2 top-5 z-20 -translate-x-1/2 rounded-full border border-white/10 bg-black/55 px-5 py-2 text-[10px] font-black tracking-[0.25em] text-white backdrop-blur-xl">
                {String(selectedIndex + 1).padStart(2, "0")} /{" "}
                {String(safeImages.length).padStart(2, "0")}
              </div>

              {/* VIEWER ARROWS */}

              {safeImages.length > 1 && !zoomed && (
                <>
                  <button
                    type="button"
                    onClick={previousImage}
                    aria-label="Previous fullscreen image"
                    className="absolute left-3 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/60 text-xl text-white backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:border-[#C8FF00] hover:bg-[#C8FF00] hover:text-black sm:left-6 sm:h-14 sm:w-14 md:left-10"
                  >
                    ←
                  </button>

                  <button
                    type="button"
                    onClick={nextImage}
                    aria-label="Next fullscreen image"
                    className="absolute right-3 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/60 text-xl text-white backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:border-[#C8FF00] hover:bg-[#C8FF00] hover:text-black sm:right-6 sm:h-14 sm:w-14 md:right-10"
                  >
                    →
                  </button>
                </>
              )}
            </div>

            {/* VIEWER FOOTER */}

            <div className="relative z-30 shrink-0 border-t border-white/10 bg-black/80 px-4 py-4 backdrop-blur-2xl sm:px-6 md:px-10">
              <div className="mx-auto flex max-w-[1500px] flex-col gap-4">
                {safeImages.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {safeImages.map((image, index) => {
                      const active =
                        selectedIndex === index;

                      return (
                        <button
                          key={`viewer-${image}-${index}`}
                          type="button"
                          onClick={() => selectImage(index)}
                          aria-label={`Open fullscreen image ${
                            index + 1
                          }`}
                          aria-pressed={active}
                          className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border bg-[#0B132B] transition-all duration-300 sm:h-20 sm:w-20 ${
                            active
                              ? "border-[#C8FF00] opacity-100 shadow-[0_0_20px_rgba(200,255,0,.16)]"
                              : "border-white/10 opacity-45 hover:opacity-100"
                          }`}
                        >
                          <Image
                            src={image}
                            alt={`${title} fullscreen thumbnail ${
                              index + 1
                            }`}
                            fill
                            sizes="80px"
                            className="object-contain p-1.5"
                          />
                        </button>
                      );
                    })}
                  </div>
                )}

                <div className="flex items-center justify-between gap-5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-black text-white">
                      {title}
                    </p>

                    <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.22em] text-gray-500">
                      Archive image{" "}
                      {String(selectedIndex + 1).padStart(
                        2,
                        "0"
                      )}
                    </p>
                  </div>

                  <div className="hidden items-center gap-5 text-[9px] font-bold uppercase tracking-[0.2em] text-gray-600 md:flex">
                    <span>← → Navigate</span>
                    <span>ESC Close</span>
                    <span>Click to zoom</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function FullscreenIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
    >
      <path
        d="M8 3H3V8M16 3H21V8M8 21H3V16M16 21H21V16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ZoomIcon({
  zoomed,
}: {
  zoomed: boolean;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
    >
      <circle
        cx="10.5"
        cy="10.5"
        r="6.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="M15.5 15.5L21 21"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      {zoomed ? (
        <path
          d="M8 10.5H13"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      ) : (
        <>
          <path
            d="M8 10.5H13"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />

          <path
            d="M10.5 8V13"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </>
      )}
    </svg>
  );
}