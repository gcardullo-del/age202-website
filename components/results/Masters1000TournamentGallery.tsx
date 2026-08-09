"use client";

import Image from "next/image";
import {
  useEffect,
  useState,
} from "react";

import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Expand,
  ImageIcon,
  X,
} from "lucide-react";

import {
  getTournamentGallery,
} from "@/lib/tournament-engine";

import type {
  Masters1000GalleryImage,
} from "@/lib/data/masters-1000-gallery";

import type {
  Masters1000Slug,
} from "@/lib/data/masters-1000";

type Masters1000TournamentGalleryProps = {
  slug: Masters1000Slug;
  cmsImages?: Masters1000GalleryImage[];
};

export default function Masters1000TournamentGallery({
  slug,
  cmsImages = [],
}: Masters1000TournamentGalleryProps) {
  const staticGallery =
    getTournamentGallery(
      slug,
    );

  /*
   * STEP 2 — CMS → PUBLIC GALLERY
   *
   * The gallery's design, layout, lightbox and static section copy stay
   * exactly as they were.
   *
   * If Tournament Studio contains at least one gallery image, those records
   * become the image source. If the CMS gallery is empty, the original
   * tournament-engine gallery remains the fallback.
   */
  const gallery = {
    ...staticGallery,

    images:
      cmsImages.length > 0
        ? cmsImages
        : staticGallery.images,
  };

  const [
    activeIndex,
    setActiveIndex,
  ] = useState<number | null>(
    null,
  );

  useEffect(() => {
    if (
      activeIndex === null
    ) {
      document.body.style.overflow =
        "";

      return;
    }

    document.body.style.overflow =
      "hidden";

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (
        event.key ===
        "Escape"
      ) {
        setActiveIndex(
          null,
        );
      }

      if (
        event.key ===
        "ArrowRight"
      ) {
        setActiveIndex(
          (current) =>
            current === null
              ? null
              : (current + 1) %
                gallery.images
                  .length,
        );
      }

      if (
        event.key ===
        "ArrowLeft"
      ) {
        setActiveIndex(
          (current) =>
            current === null
              ? null
              : (
                  current -
                  1 +
                  gallery.images
                    .length
                ) %
                gallery.images
                  .length,
        );
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.body.style.overflow =
        "";

      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [
    activeIndex,
    gallery.images.length,
  ]);

  if (
    gallery.images.length ===
    0
  ) {
    return null;
  }

  const activeImage =
    activeIndex === null
      ? null
      : gallery.images[
          activeIndex
        ];

  const showPrevious =
    () => {
      setActiveIndex(
        (current) =>
          current === null
            ? null
            : (
                current -
                1 +
                gallery.images
                  .length
              ) %
              gallery.images
                .length,
      );
    };

  const showNext = () => {
    setActiveIndex(
      (current) =>
        current === null
          ? null
          : (current + 1) %
            gallery.images
              .length,
    );
  };

  return (
    <>
      <section
        id="gallery"
        className="relative scroll-mt-16 overflow-hidden border-b border-white/10 px-5 py-14 sm:px-8 lg:px-12 lg:py-20"
      >
        <div className="pointer-events-none absolute -left-56 top-24 h-[34rem] w-[34rem] rounded-full bg-[var(--tournament-glow)] opacity-30 blur-3xl" />

        <div className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:56px_56px]" />

        <div className="relative mx-auto max-w-[1440px]">
          <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_440px] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-[var(--tournament-primary)]">
                  <Camera
                    size={17}
                    strokeWidth={
                      1.5
                    }
                    aria-hidden="true"
                  />
                </span>

                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[var(--tournament-primary)]">
                  {
                    gallery.eyebrow
                  }
                </p>
              </div>

              <h2 className="mt-6 max-w-5xl text-4xl font-black uppercase leading-[0.9] tracking-[-0.055em] sm:text-5xl lg:text-6xl">
                {gallery.title}
              </h2>
            </div>

            <p className="text-sm leading-7 text-white/43 lg:text-right">
              {
                gallery.description
              }
            </p>
          </div>

          <div className="mt-12 grid auto-rows-[240px] gap-4 sm:auto-rows-[280px] md:grid-cols-2 xl:grid-cols-4 xl:auto-rows-[270px]">
            {gallery.images.map(
              (
                image,
                index,
              ) => (
                <GalleryCard
                  key={`${image.src}-${index}`}
                  image={
                    image
                  }
                  index={
                    index
                  }
                  featured={
                    index === 0
                  }
                  wide={
                    index === 3
                  }
                  priority={
                    index === 0
                  }
                  onOpen={() =>
                    setActiveIndex(
                      index,
                    )
                  }
                />
              ),
            )}
          </div>
        </div>
      </section>

      {activeImage &&
      activeIndex !==
        null ? (
        <GalleryLightbox
          key={
            activeImage.src
          }
          image={
            activeImage
          }
          current={
            activeIndex + 1
          }
          total={
            gallery.images
              .length
          }
          onClose={() =>
            setActiveIndex(
              null,
            )
          }
          onPrevious={
            showPrevious
          }
          onNext={
            showNext
          }
        />
      ) : null}
    </>
  );
}

type GalleryCardProps = {
  image: Masters1000GalleryImage;
  index: number;
  featured: boolean;
  wide: boolean;
  onOpen: () => void;
  priority: boolean;
};

function GalleryCard({
  image,
  index,
  featured,
  wide,
  onOpen,
  priority,
}: GalleryCardProps) {
  const [
    failed,
    setFailed,
  ] = useState(false);

  const layoutClass =
    featured
      ? "md:col-span-2 md:row-span-2 xl:col-span-2"
      : wide
        ? "md:col-span-2 xl:col-span-2"
        : "";

  return (
    <button
      type="button"
      onClick={onOpen}
      className={`group relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#07101D] text-left shadow-[0_18px_52px_rgba(0,0,0,0.18)] transition duration-500 hover:-translate-y-1 hover:border-[var(--tournament-primary)]/70 hover:shadow-[0_24px_70px_rgba(0,0,0,0.32)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tournament-primary)] ${layoutClass}`}
      aria-label={`Open gallery image: ${image.title}`}
    >
      {!failed ? (
        <Image
          src={image.src}
          alt={image.title}
          fill
          sizes={
            featured
              ? "(max-width: 768px) 100vw, (max-width: 1280px) 100vw, 50vw"
              : "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
          }
          priority={
            priority
          }
          className="object-cover opacity-80 transition duration-1000 group-hover:scale-[1.06] group-hover:opacity-100"
          style={{
            objectPosition:
              image.position ??
              "center",
          }}
          onError={() =>
            setFailed(
              true,
            )
          }
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center bg-[linear-gradient(145deg,var(--tournament-secondary),#020611)]">
          <div className="text-center">
            <ImageIcon
              size={32}
              strokeWidth={
                1.2
              }
              className="mx-auto text-[var(--tournament-primary)]/55"
              aria-hidden="true"
            />

            <p className="mt-4 font-mono text-[8px] font-black uppercase tracking-[0.18em] text-white/35">
              Add gallery image
            </p>
          </div>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-[#030812]/95 via-[#030812]/10 to-black/5 transition duration-500 group-hover:from-[#030812]/88" />

      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
        <div className="flex items-end justify-between gap-5">
          <div>
            <p className="font-mono text-[7px] font-black uppercase tracking-[0.2em] text-[var(--tournament-primary)]">
              {image.label}
            </p>

            <h3 className="mt-3 text-2xl font-black uppercase leading-none tracking-[-0.04em] sm:text-3xl">
              {image.title}
            </h3>

            <p className="mt-3 max-w-xl text-xs leading-5 text-white/45 opacity-100 transition duration-300 md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
              {
                image.description
              }
            </p>
          </div>

          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/12 bg-[#050B18]/72 text-white/50 backdrop-blur-xl transition group-hover:border-[var(--tournament-primary)] group-hover:text-[var(--tournament-primary)]">
            <Expand
              size={17}
              strokeWidth={
                1.5
              }
              aria-hidden="true"
            />
          </span>
        </div>
      </div>

      <span className="absolute left-5 top-5 rounded-full border border-white/12 bg-[#050B18]/72 px-3 py-2 font-mono text-[7px] font-black tracking-[0.18em] text-white/45 backdrop-blur-xl">
        0{index + 1}
      </span>
    </button>
  );
}

type GalleryLightboxProps = {
  image: Masters1000GalleryImage;
  current: number;
  total: number;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
};

function GalleryLightbox({
  image,
  current,
  total,
  onClose,
  onPrevious,
  onNext,
}: GalleryLightboxProps) {
  const [
    failed,
    setFailed,
  ] = useState(false);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020611]/94 p-4 backdrop-blur-2xl sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={
        image.title
      }
      onMouseDown={(
        event,
      ) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-5 top-5 z-20 grid h-12 w-12 place-items-center rounded-2xl border border-white/12 bg-white/[0.04] text-white/60 transition hover:border-[var(--tournament-primary)] hover:text-[var(--tournament-primary)] sm:right-8 sm:top-8"
        aria-label="Close gallery"
      >
        <X
          size={20}
          aria-hidden="true"
        />
      </button>

      <button
        type="button"
        onClick={
          onPrevious
        }
        className="absolute left-4 top-1/2 z-20 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-2xl border border-white/12 bg-[#050B18]/75 text-white/60 backdrop-blur-xl transition hover:border-[var(--tournament-primary)] hover:text-[var(--tournament-primary)] sm:left-8"
        aria-label="Previous image"
      >
        <ArrowLeft
          size={20}
          aria-hidden="true"
        />
      </button>

      <button
        type="button"
        onClick={onNext}
        className="absolute right-4 top-1/2 z-20 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-2xl border border-white/12 bg-[#050B18]/75 text-white/60 backdrop-blur-xl transition hover:border-[var(--tournament-primary)] hover:text-[var(--tournament-primary)] sm:right-8"
        aria-label="Next image"
      >
        <ArrowRight
          size={20}
          aria-hidden="true"
        />
      </button>

      <div className="relative flex h-[82vh] w-full max-w-[1500px] flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[#07101D] shadow-[0_40px_140px_rgba(0,0,0,0.65)]">
        <div className="relative flex-1 overflow-hidden">
          {!failed ? (
            <Image
              src={image.src}
              alt={
                image.title
              }
              fill
              sizes="100vw"
              priority
              className="object-contain"
              style={{
                objectPosition:
                  image.position ??
                  "center",
              }}
              onError={() =>
                setFailed(
                  true,
                )
              }
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center bg-[linear-gradient(145deg,var(--tournament-secondary),#020611)]">
              <div className="text-center">
                <ImageIcon
                  size={48}
                  strokeWidth={
                    1.1
                  }
                  className="mx-auto text-[var(--tournament-primary)]/55"
                  aria-hidden="true"
                />

                <p className="mt-5 font-mono text-[9px] font-black uppercase tracking-[0.2em] text-white/38">
                  Image not inserted yet
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="grid gap-5 border-t border-white/10 bg-[#050B18]/92 p-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end sm:p-8">
          <div>
            <p className="font-mono text-[8px] font-black uppercase tracking-[0.2em] text-[var(--tournament-primary)]">
              {image.label}
            </p>

            <h3 className="mt-3 text-3xl font-black uppercase leading-none tracking-[-0.045em] sm:text-4xl">
              {image.title}
            </h3>

            <p className="mt-4 max-w-3xl text-sm leading-6 text-white/42">
              {
                image.description
              }
            </p>
          </div>

          <span className="font-mono text-[9px] font-black uppercase tracking-[0.2em] text-white/35">
            {String(
              current,
            ).padStart(
              2,
              "0",
            )}{" "}
            /{" "}
            {String(
              total,
            ).padStart(
              2,
              "0",
            )}
          </span>
        </div>
      </div>
    </div>
  );
}