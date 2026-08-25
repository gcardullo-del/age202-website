"use client";

import Image from "next/image";
import Link from "next/link";

import {
  ArrowRight,
  Archive,
  CheckCircle2,
  Landmark,
} from "lucide-react";

import Reveal from "@/components/ui/Reveal";

export type RecentlyAcquiredArtifact = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  archiveNumber: string;
  currency: string;
  price: string | null;
  tournament: string | null;
  year: number | null;

  player: {
    name: string;
  };

  brand: {
    name: string;
  };

  images: Array<{
    url: string;
    alt: string | null;
    isCover: boolean;
  }>;
};

type RecentlyAcquiredProps = {
  artifacts: RecentlyAcquiredArtifact[];
};

export default function RecentlyAcquired({
  artifacts,
}: RecentlyAcquiredProps) {
  if (artifacts.length === 0) {
    return null;
  }

  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-[#07101d] px-5 py-14 sm:px-8 lg:px-12 lg:py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(255,255,255,0.025),transparent_28%),radial-gradient(circle_at_90%_80%,rgba(200,255,0,0.045),transparent_28%)]"
      />

      <div className="relative mx-auto max-w-[1500px]">
        <Reveal>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:items-start">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-9 bg-[#C8FF00]" />

                <p className="font-mono text-[8px] font-black uppercase tracking-[0.24em] text-[#C8FF00] sm:text-[9px]">
                  Recently Acquired
                </p>
              </div>

              <h2 className="mt-5 max-w-xl text-4xl font-black uppercase leading-[0.92] tracking-[-0.05em] sm:text-5xl">
                From the Museum
                <br />
                to a Private Collection.
              </h2>

              <p className="mt-6 max-w-xl text-sm leading-7 text-white/42 sm:text-base">
                Recently collected Artifacts
                remain preserved in the AGE202
                digital archive even after they
                leave public availability.
              </p>

              <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.025] px-4 py-2 font-mono text-[7px] uppercase tracking-[0.15em] text-white/35">
                <Landmark
                  size={11}
                  className="text-[#C8FF00]"
                  aria-hidden="true"
                />

                Archive preserved
              </div>
            </div>

            <div className="overflow-hidden rounded-[1.8rem] border border-white/10 bg-[#08101f]">
              {artifacts.map(
                (
                  artifact,
                  index,
                ) => {
                  const cover =
                    artifact.images.find(
                      (image) =>
                        image.isCover,
                    ) ??
                    artifact.images[0] ??
                    null;

                  const context = [
                    artifact.tournament,
                    artifact.year
                      ? String(
                          artifact.year,
                        )
                      : null,
                  ]
                    .filter(Boolean)
                    .join(" · ");

                  return (
                    <Reveal
                      key={artifact.id}
                      delay={index * 0.05}
                    >
                      <article
                        className={[
                          "group grid gap-0 transition duration-300 hover:bg-white/[0.02]",
                          "sm:grid-cols-[92px_minmax(0,1fr)_150px]",
                          index !==
                          artifacts.length - 1
                            ? "border-b border-white/10"
                            : "",
                        ].join(" ")}
                      >
                        <Link
                          href={`/artifacts/${artifact.slug}`}
                          className="relative block min-h-[120px] overflow-hidden bg-black/20 sm:min-h-[108px]"
                          aria-label={`View archive record for ${artifact.title}`}
                        >
                          {cover ? (
                            <Image
                              src={cover.url}
                              alt={
                                cover.alt ??
                                artifact.title
                              }
                              fill
                              sizes="92px"
                              className="object-cover grayscale-[20%] transition duration-500 group-hover:scale-[1.05] group-hover:grayscale-0"
                            />
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent" />
                          )}

                          <div className="absolute inset-0 bg-black/15" />

                          <span className="absolute bottom-2 left-2 grid h-7 w-7 place-items-center rounded-full border border-white/15 bg-black/45 font-mono text-[7px] font-black text-white/60 backdrop-blur-md">
                            {String(
                              index + 1,
                            ).padStart(
                              2,
                              "0",
                            )}
                          </span>
                        </Link>

                        <div className="flex min-w-0 flex-col justify-center px-5 py-5 sm:px-6">
                          <div className="flex flex-wrap items-center gap-3">
                            <p className="font-mono text-[7px] font-black uppercase tracking-[0.17em] text-[#C8FF00]">
                              {
                                artifact.player.name
                              }
                            </p>

                            <p className="font-mono text-[7px] uppercase tracking-[0.14em] text-white/25">
                              {
                                artifact.brand.name
                              }
                            </p>
                          </div>

                          <Link
                            href={`/artifacts/${artifact.slug}`}
                            className="mt-2 block min-w-0"
                          >
                            <h3 className="truncate text-lg font-black uppercase tracking-[-0.03em] text-white transition group-hover:text-[#C8FF00] sm:text-xl">
                              {
                                artifact.title
                              }
                            </h3>
                          </Link>

                          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
                            {context ? (
                              <p className="font-mono text-[7px] uppercase tracking-[0.13em] text-white/26">
                                {context}
                              </p>
                            ) : null}

                            <span className="font-mono text-[7px] uppercase tracking-[0.13em] text-white/22">
                              {
                                artifact.archiveNumber
                              }
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-4 border-t border-white/10 px-5 py-4 sm:border-l sm:border-t-0">
                          <div>
                            <span className="inline-flex items-center gap-2 font-mono text-[7px] font-black uppercase tracking-[0.15em] text-white/35">
                              <CheckCircle2
                                size={11}
                                className="text-[#C8FF00]"
                                aria-hidden="true"
                              />

                              Private Collection
                            </span>

                            <p className="mt-2 font-mono text-[7px] uppercase tracking-[0.13em] text-white/20">
                              Acquired
                            </p>
                          </div>

                          <Link
                            href={`/artifacts/${artifact.slug}`}
                            aria-label={`Open archive record for ${artifact.title}`}
                            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/10 text-white/45 transition hover:border-[#C8FF00]/45 hover:text-[#C8FF00]"
                          >
                            <ArrowRight
                              size={13}
                              aria-hidden="true"
                            />
                          </Link>
                        </div>
                      </article>
                    </Reveal>
                  );
                },
              )}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-7 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xl text-sm leading-7 text-white/30">
              Acquisition changes availability,
              not museum identity.
            </p>

            <Link
              href="/shop"
              className="group inline-flex w-fit items-center gap-3 font-mono text-[8px] font-black uppercase tracking-[0.18em] text-white/45 transition hover:text-[#C8FF00]"
            >
              Explore the museum collection

              <Archive
                size={13}
                className="transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}