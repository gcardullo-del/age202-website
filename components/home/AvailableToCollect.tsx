"use client";

import Image from "next/image";
import Link from "next/link";

import {
  ArrowRight,
  BadgeCheck,
  CircleCheck,
  Fingerprint,
  Sparkles,
} from "lucide-react";

import Reveal from "@/components/ui/Reveal";

export type AvailableArtifact = {
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

type AvailableToCollectProps = {
  artifacts: AvailableArtifact[];
};

function formatPrice(
  value: string | null,
  currency: string,
) {
  if (!value) {
    return null;
  }

  const amount = Number(value);

  if (Number.isNaN(amount)) {
    return null;
  }

  return new Intl.NumberFormat(
    "it-IT",
    {
      style: "currency",
      currency:
        currency || "EUR",
    },
  ).format(amount);
}

export default function AvailableToCollect({
  artifacts,
}: AvailableToCollectProps) {
  if (artifacts.length === 0) {
    return null;
  }

  return (
    <section
      id="available-to-collect"
      className="relative overflow-hidden border-b border-white/10 bg-[#050b18] px-5 py-16 sm:px-8 lg:px-12 lg:py-20"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_15%,rgba(200,255,0,0.065),transparent_30%),radial-gradient(circle_at_8%_90%,rgba(255,255,255,0.025),transparent_28%)]"
      />

      <div className="relative mx-auto max-w-[1500px]">
        <Reveal>
          <div className="grid gap-8 border-b border-white/10 pb-9 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-end">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-9 bg-[#C8FF00]" />

                <p className="font-mono text-[8px] font-black uppercase tracking-[0.24em] text-[#C8FF00] sm:text-[9px]">
                  Available to Collect
                </p>
              </div>

              <h2 className="mt-5 max-w-4xl text-4xl font-black uppercase leading-[0.9] tracking-[-0.055em] sm:text-5xl lg:text-6xl">
                One Artifact.
                <br />
                One Collector.
              </h2>
            </div>

            <div className="lg:text-right">
              <p className="max-w-xl text-sm leading-7 text-white/42 sm:text-base lg:ml-auto">
                Selected pieces from the AGE202
                archive are currently available
                to enter a private collection.
                Each entry represents one
                catalogued physical Artifact.
              </p>

              <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#C8FF00]/20 bg-[#C8FF00]/[0.055] px-4 py-2 font-mono text-[7px] font-black uppercase tracking-[0.17em] text-[#C8FF00]">
                <CircleCheck
                  size={11}
                  aria-hidden="true"
                />

                {artifacts.length} currently available
              </div>
            </div>
          </div>
        </Reveal>

        <div className="mt-8 overflow-hidden rounded-[2rem] border border-white/10 bg-[#08101f] shadow-[0_25px_80px_rgba(0,0,0,0.22)]">
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

              const price =
                formatPrice(
                  artifact.price,
                  artifact.currency,
                );

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
                      "group relative grid gap-0 transition duration-300 hover:bg-white/[0.025]",
                      "md:grid-cols-[120px_minmax(0,1fr)_180px_165px]",
                      index !==
                      artifacts.length - 1
                        ? "border-b border-white/10"
                        : "",
                    ].join(" ")}
                  >
                    <Link
                      href={`/artifacts/${artifact.slug}`}
                      aria-label={`Explore ${artifact.title}`}
                      className="relative block min-h-[150px] overflow-hidden bg-[#050b18] md:min-h-[126px]"
                    >
                      {cover ? (
                        <Image
                          src={cover.url}
                          alt={
                            cover.alt ??
                            artifact.title
                          }
                          fill
                          sizes="120px"
                          className="object-cover transition duration-700 group-hover:scale-[1.06]"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent" />
                      )}

                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#08101f]/20" />

                      <div className="absolute bottom-3 left-3">
                        <span className="grid h-8 w-8 place-items-center rounded-full border border-white/15 bg-black/50 font-mono text-[8px] font-black text-white/70 backdrop-blur-md">
                          {String(
                            index + 1,
                          ).padStart(
                            2,
                            "0",
                          )}
                        </span>
                      </div>
                    </Link>

                    <div className="flex min-w-0 flex-col justify-center px-5 py-5 sm:px-6 md:py-4">
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                        <p className="font-mono text-[7px] font-black uppercase tracking-[0.18em] text-[#C8FF00]">
                          {
                            artifact.player.name
                          }
                        </p>

                        <p className="font-mono text-[7px] uppercase tracking-[0.15em] text-white/28">
                          {
                            artifact.brand.name
                          }
                        </p>
                      </div>

                      <Link
                        href={`/artifacts/${artifact.slug}`}
                        className="mt-2 block min-w-0"
                      >
                        <h3 className="truncate text-xl font-black uppercase tracking-[-0.035em] text-white transition group-hover:text-[#C8FF00] sm:text-2xl">
                          {
                            artifact.title
                          }
                        </h3>
                      </Link>

                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
                        {context ? (
                          <p className="font-mono text-[7px] font-bold uppercase tracking-[0.14em] text-white/30">
                            {context}
                          </p>
                        ) : null}

                        <span className="inline-flex items-center gap-1.5 font-mono text-[7px] uppercase tracking-[0.14em] text-white/28">
                          <Fingerprint
                            size={10}
                            className="text-[#C8FF00]"
                            aria-hidden="true"
                          />

                          {
                            artifact.archiveNumber
                          }
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-5 border-t border-white/10 px-5 py-5 md:border-l md:border-t-0 md:px-6 md:py-4">
                      <div>
                        <p className="font-mono text-[7px] font-black uppercase tracking-[0.16em] text-white/28">
                          Collection value
                        </p>

                        <p className="mt-2 text-xl font-black tracking-[-0.04em] text-white">
                          {price ??
                            "Museum record"}
                        </p>
                      </div>

                      <BadgeCheck
                        size={16}
                        className="shrink-0 text-[#C8FF00]"
                        aria-hidden="true"
                      />
                    </div>

                    <div className="flex items-center border-t border-white/10 p-4 md:border-l md:border-t-0">
                      <Link
                        href={`/artifacts/${artifact.slug}`}
                        className="group/cta inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-[#C8FF00]/45 px-4 py-3 text-center font-mono text-[7px] font-black uppercase tracking-[0.16em] text-[#C8FF00] transition duration-300 hover:border-[#C8FF00] hover:bg-[#C8FF00] hover:text-[#050b18]"
                      >
                        Explore & Collect

                        <ArrowRight
                          size={12}
                          className="transition-transform group-hover/cta:translate-x-1"
                          aria-hidden="true"
                        />
                      </Link>
                    </div>

                    <span className="pointer-events-none absolute right-3 top-3 hidden items-center gap-1.5 rounded-full border border-[#C8FF00]/20 bg-[#C8FF00]/[0.05] px-2.5 py-1 font-mono text-[6px] font-black uppercase tracking-[0.14em] text-[#C8FF00] xl:inline-flex">
                      <Sparkles
                        size={8}
                        aria-hidden="true"
                      />

                      1 specimen
                    </span>
                  </article>
                </Reveal>
              );
            },
          )}
        </div>

        <Reveal delay={0.15}>
          <div className="mt-7 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xl text-sm leading-7 text-white/32">
              Availability reflects the current
              status of the physical Artifact
              preserved in the AGE202 archive.
            </p>

            <Link
              href="/shop"
              className="group inline-flex w-fit items-center gap-3 font-mono text-[8px] font-black uppercase tracking-[0.2em] text-white/50 transition hover:text-[#C8FF00]"
            >
              View all collectible artifacts

              <ArrowRight
                size={13}
                className="transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}