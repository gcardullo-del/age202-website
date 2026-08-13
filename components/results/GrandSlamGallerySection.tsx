import {
  Camera,
  ImageIcon,
  Sparkles,
} from "lucide-react";

import type {
  GrandSlamSlug,
} from "@/lib/data/grand-slams";

import {
  getMuseumTournamentBySlug,
} from "@/lib/services/museum/tournament.service";

type GrandSlamGallerySectionProps = {
  slug: GrandSlamSlug;
  cmsSlug?: string;
};

function safeBackgroundImage(
  imageUrl: string,
): string {
  const safeUrl =
    imageUrl.replaceAll('"', '\\\"');

  return `linear-gradient(180deg, rgba(2,6,17,0.04) 0%, rgba(2,6,17,0.16) 42%, rgba(2,6,17,0.94) 100%), url("${safeUrl}")`;
}

function getGalleryLayoutClass(
  secondaryCount: number,
): string {
  if (secondaryCount === 0) {
    return "grid-cols-1";
  }

  if (secondaryCount === 1) {
    return "xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.65fr)]";
  }

  return "xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.65fr)]";
}

function getSecondaryGridClass(
  secondaryCount: number,
): string {
  if (secondaryCount <= 1) {
    return "grid-cols-1";
  }

  if (secondaryCount === 2) {
    return "sm:grid-cols-2 xl:grid-cols-1";
  }

  return "sm:grid-cols-2 xl:grid-cols-2";
}

function getSecondaryCardClass(
  secondaryCount: number,
  index: number,
): string {
  if (secondaryCount === 1) {
    return "min-h-[620px]";
  }

  if (secondaryCount === 2) {
    return "min-h-[300px]";
  }

  if (secondaryCount === 3) {
    return index === 0
      ? "min-h-[300px] sm:col-span-2 xl:col-span-2"
      : "min-h-[250px]";
  }

  return "min-h-[250px]";
}

function getAdditionalGridClass(
  additionalCount: number,
): string {
  if (additionalCount === 1) {
    return "grid-cols-1";
  }

  if (additionalCount === 2) {
    return "md:grid-cols-2";
  }

  if (additionalCount === 3) {
    return "md:grid-cols-3";
  }

  return "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
}

function getAdditionalCardClass(
  additionalCount: number,
): string {
  if (additionalCount === 1) {
    return "min-h-[420px] sm:min-h-[500px]";
  }

  if (additionalCount === 2) {
    return "min-h-[360px]";
  }

  if (additionalCount === 3) {
    return "min-h-[340px]";
  }

  return "min-h-[300px]";
}

export default async function GrandSlamGallerySection({
  slug,
  cmsSlug,
}: GrandSlamGallerySectionProps) {
  const tournament =
    await getMuseumTournamentBySlug(
      cmsSlug ?? slug,
    );

  if (
    !tournament ||
    tournament.galleryItems.length === 0
  ) {
    return null;
  }

  const galleryItems =
    tournament.galleryItems;

  const featuredItem =
    galleryItems.find(
      (item) =>
        item.featured,
    ) ??
    galleryItems[0];

  const secondaryItems =
    galleryItems.filter(
      (item) =>
        item.id !==
        featuredItem.id,
    );

  const visibleSecondaryItems =
    secondaryItems.slice(0, 4);

  const additionalItems =
    secondaryItems.slice(4);

  const secondaryCount =
    visibleSecondaryItems.length;

  const hasOnlyFeatured =
    secondaryCount === 0;

  return (
    <section
      id="gallery"
      className="relative scroll-mt-16 overflow-hidden border-t border-white/10 px-5 py-20 sm:px-8 lg:px-12 lg:py-28"
    >
      <div className="pointer-events-none absolute -left-56 top-16 h-[34rem] w-[34rem] rounded-full bg-[var(--tournament-glow)] opacity-30 blur-3xl" />

      <div className="relative mx-auto w-full max-w-[1440px]">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_430px] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-3">
              <span className="h-px w-10 bg-[var(--tournament-primary)]" />

              <p className="font-mono text-[9px] font-black uppercase tracking-[0.24em] text-[var(--tournament-primary)]">
                Tournament gallery
              </p>
            </div>

            <h2 className="mt-6 max-w-5xl text-4xl font-black uppercase leading-[0.9] tracking-[-0.06em] sm:text-5xl lg:text-7xl">
              Inside {tournament.shortName?.trim() || tournament.name}.
            </h2>
          </div>

          <p className="text-sm leading-7 text-white/42 lg:text-right">
            A visual archive of the courts, atmosphere and defining spaces that
            shape this Grand Slam.
          </p>
        </div>

        <div
          className={`mt-12 grid gap-5 ${getGalleryLayoutClass(
            secondaryCount,
          )}`}
        >
          <article
            className={`group relative overflow-hidden rounded-[2.25rem] border border-white/10 bg-[#07101D] ${
              hasOnlyFeatured
                ? "min-h-[720px]"
                : "min-h-[620px]"
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-[1.025]"
              style={{
                backgroundImage:
                  safeBackgroundImage(
                    featuredItem.imageUrl,
                  ),
              }}
              role="img"
              aria-label={
                featuredItem.alt ??
                featuredItem.title ??
                `${tournament.name} tournament gallery`
              }
            />

            <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(2,6,17,0.56)_0%,transparent_48%,rgba(2,6,17,0.24)_100%)]" />

            <div
              className={`relative flex flex-col justify-between p-7 sm:p-9 lg:p-11 ${
                hasOnlyFeatured
                  ? "min-h-[720px]"
                  : "min-h-[620px]"
              }`}
            >
              <div className="flex items-start justify-between gap-5">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-[#050B18]/58 px-4 py-2 font-mono text-[7px] font-black uppercase tracking-[0.18em] text-white/70 backdrop-blur-xl">
                  <Sparkles
                    size={12}
                    className="text-[var(--tournament-primary)]"
                    aria-hidden="true"
                  />
                  Featured view
                </span>

                <span className="grid h-12 w-12 place-items-center rounded-2xl border border-white/12 bg-[#050B18]/58 text-[var(--tournament-primary)] backdrop-blur-xl">
                  <Camera
                    size={19}
                    strokeWidth={1.4}
                    aria-hidden="true"
                  />
                </span>
              </div>

              <div
                className={
                  hasOnlyFeatured
                    ? "max-w-4xl"
                    : "max-w-3xl"
                }
              >
                {featuredItem.eyebrow ? (
                  <p className="font-mono text-[8px] font-black uppercase tracking-[0.2em] text-[var(--tournament-primary)]">
                    {featuredItem.eyebrow}
                  </p>
                ) : null}

                <h3
                  className={`mt-4 font-black uppercase leading-[0.92] tracking-[-0.055em] ${
                    hasOnlyFeatured
                      ? "text-5xl sm:text-6xl lg:text-7xl"
                      : "text-4xl sm:text-5xl"
                  }`}
                >
                  {featuredItem.title ??
                    tournament.name}
                </h3>

                {featuredItem.caption ? (
                  <p
                    className={`mt-5 leading-7 text-white/58 ${
                      hasOnlyFeatured
                        ? "max-w-3xl text-base sm:text-lg"
                        : "max-w-2xl text-sm sm:text-base"
                    }`}
                  >
                    {featuredItem.caption}
                  </p>
                ) : null}
              </div>
            </div>
          </article>

          {secondaryCount > 0 ? (
            <div
              className={`grid gap-5 ${getSecondaryGridClass(
                secondaryCount,
              )}`}
            >
              {visibleSecondaryItems.map(
                (
                  item,
                  index,
                ) => (
                  <article
                    key={item.id}
                    className={`group relative overflow-hidden rounded-[1.8rem] border border-white/10 bg-[#07101D] ${getSecondaryCardClass(
                      secondaryCount,
                      index,
                    )}`}
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-[1.04]"
                      style={{
                        backgroundImage:
                          safeBackgroundImage(
                            item.imageUrl,
                          ),
                      }}
                      role="img"
                      aria-label={
                        item.alt ??
                        item.title ??
                        `${tournament.name} gallery image ${index + 2}`
                      }
                    />

                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,17,0.02)_0%,rgba(2,6,17,0.18)_42%,rgba(2,6,17,0.9)_100%)]" />

                    <div
                      className={`relative flex h-full flex-col justify-between p-6 ${
                        secondaryCount === 1
                          ? "min-h-[620px] sm:p-8"
                          : secondaryCount === 2
                            ? "min-h-[300px]"
                            : getSecondaryCardClass(
                                secondaryCount,
                                index,
                              )
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <span className="font-mono text-[7px] font-black uppercase tracking-[0.18em] text-white/52">
                          Frame{" "}
                          {String(
                            index + 2,
                          ).padStart(
                            2,
                            "0",
                          )}
                        </span>

                        <span className="grid h-9 w-9 place-items-center rounded-xl border border-white/12 bg-[#050B18]/52 text-[var(--tournament-primary)] backdrop-blur-lg">
                          <ImageIcon
                            size={14}
                            strokeWidth={1.4}
                            aria-hidden="true"
                          />
                        </span>
                      </div>

                      <div>
                        {item.eyebrow ? (
                          <p className="font-mono text-[7px] font-black uppercase tracking-[0.18em] text-[var(--tournament-primary)]">
                            {item.eyebrow}
                          </p>
                        ) : null}

                        <h3
                          className={`mt-3 font-black uppercase leading-[0.95] tracking-[-0.04em] ${
                            secondaryCount === 1
                              ? "text-3xl sm:text-4xl"
                              : "text-2xl"
                          }`}
                        >
                          {item.title ??
                            tournament.name}
                        </h3>

                        {item.caption ? (
                          <p
                            className={`mt-3 leading-6 text-white/45 ${
                              secondaryCount === 1
                                ? "max-w-xl text-sm"
                                : "line-clamp-2 text-xs"
                            }`}
                          >
                            {item.caption}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </article>
                ),
              )}
            </div>
          ) : null}
        </div>

        {additionalItems.length > 0 ? (
          <div
            className={`mt-5 grid gap-5 ${getAdditionalGridClass(
              additionalItems.length,
            )}`}
          >
            {additionalItems.map(
              (
                item,
                index,
              ) => (
                <article
                  key={item.id}
                  className={`group relative overflow-hidden rounded-[1.8rem] border border-white/10 bg-[#07101D] ${getAdditionalCardClass(
                    additionalItems.length,
                  )}`}
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-[1.04]"
                    style={{
                      backgroundImage:
                        safeBackgroundImage(
                          item.imageUrl,
                        ),
                    }}
                    role="img"
                    aria-label={
                      item.alt ??
                      item.title ??
                      `${tournament.name} gallery image ${index + 6}`
                    }
                  />

                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,17,0.02)_0%,rgba(2,6,17,0.16)_42%,rgba(2,6,17,0.92)_100%)]" />

                  <div
                    className={`relative flex flex-col justify-between p-6 ${
                      additionalItems.length === 1
                        ? "min-h-[420px] sm:min-h-[500px] sm:p-9"
                        : additionalItems.length === 2
                          ? "min-h-[360px] sm:p-8"
                          : additionalItems.length === 3
                            ? "min-h-[340px]"
                            : "min-h-[300px]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <span className="font-mono text-[7px] font-black uppercase tracking-[0.18em] text-white/52">
                        Frame{" "}
                        {String(
                          index + 6,
                        ).padStart(
                          2,
                          "0",
                        )}
                      </span>

                      <span className="grid h-9 w-9 place-items-center rounded-xl border border-white/12 bg-[#050B18]/52 text-[var(--tournament-primary)] backdrop-blur-lg">
                        <ImageIcon
                          size={14}
                          strokeWidth={1.4}
                          aria-hidden="true"
                        />
                      </span>
                    </div>

                    <div>
                      {item.eyebrow ? (
                        <p className="font-mono text-[7px] font-black uppercase tracking-[0.18em] text-[var(--tournament-primary)]">
                          {item.eyebrow}
                        </p>
                      ) : null}

                      <h3
                        className={`mt-3 font-black uppercase leading-[0.95] tracking-[-0.04em] ${
                          additionalItems.length === 1
                            ? "text-3xl sm:text-5xl"
                            : additionalItems.length === 2
                              ? "text-3xl"
                              : "text-2xl"
                        }`}
                      >
                        {item.title ??
                          tournament.name}
                      </h3>

                      {item.caption ? (
                        <p
                          className={`mt-3 leading-6 text-white/45 ${
                            additionalItems.length === 1
                              ? "max-w-3xl text-sm sm:text-base"
                              : "line-clamp-2 text-xs"
                          }`}
                        >
                          {item.caption}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </article>
              ),
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
}