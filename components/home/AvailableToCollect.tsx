"use client";

import Image from "next/image";
import Link from "next/link";

import {
  ArrowRight,
  BadgeCheck,
  CircleCheck,
  Fingerprint,
  PackageSearch,
  Sparkles,
} from "lucide-react";

import Reveal from "@/components/ui/Reveal";
import SectionTitle from "@/components/ui/SectionTitle";

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

  const amount =
    Number(value);

  if (
    Number.isNaN(
      amount,
    )
  ) {
    return null;
  }

  return new Intl.NumberFormat(
    "it-IT",
    {
      style:
        "currency",

      currency:
        currency || "EUR",
    },
  ).format(
    amount,
  );
}

export default function AvailableToCollect({
  artifacts,
}: AvailableToCollectProps) {
  if (
    artifacts.length === 0
  ) {
    return null;
  }

  return (
    <section
      id="available-to-collect"
      className="relative overflow-hidden border-b border-white/10 bg-[#050b18] px-5 py-20 sm:px-8 lg:px-12 lg:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_15%,rgba(200,255,0,0.08),transparent_32%),radial-gradient(circle_at_12%_90%,rgba(255,255,255,0.025),transparent_30%)]"
      />

      <div className="relative mx-auto max-w-[1500px]">
        <Reveal>
          <div className="grid gap-8 border-b border-white/10 pb-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end">
            <SectionTitle
              eyebrow="Available to Collect"
              title="One Artifact. One Collector."
              description="Selected museum pieces currently available to enter a private collection. Each listing represents one physical Artifact preserved in the AGE202 archive."
              align="left"
            />

            <div className="lg:text-right">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#C8FF00]/20 bg-[#C8FF00]/[0.055] px-4 py-2 font-mono text-[8px] font-black uppercase tracking-[0.18em] text-[#C8FF00]">
                <CircleCheck
                  size={12}
                  aria-hidden="true"
                />

                Limited museum availability
              </div>

              <p className="mt-5 max-w-md text-sm leading-7 text-white/35 lg:ml-auto">
                These are not warehouse quantities.
                Each card represents a single
                catalogued physical piece.
              </p>
            </div>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
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

              const context =
                [
                  artifact.tournament,
                  artifact.year
                    ? String(
                        artifact.year,
                      )
                    : null,
                ]
                  .filter(
                    Boolean,
                  )
                  .join(
                    " · ",
                  );

              return (
                <Reveal
                  key={
                    artifact.id
                  }
                  delay={
                    index *
                    0.07
                  }
                >
                  <article className="group relative h-full overflow-hidden rounded-[2rem] border border-white/10 bg-[#09111f] shadow-[0_25px_80px_rgba(0,0,0,0.22)] transition duration-500 hover:-translate-y-1.5 hover:border-[#C8FF00]/35 hover:shadow-[0_30px_100px_rgba(0,0,0,0.32)]">
                    <Link
                      href={`/artifacts/${artifact.slug}`}
                      className="block outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#C8FF00]"
                      aria-label={`Explore and collect ${artifact.title}`}
                    >
                      <div className="relative aspect-[4/5] overflow-hidden bg-[#050b18]">
                        {cover ? (
                          <Image
                            src={
                              cover.url
                            }
                            alt={
                              cover.alt ??
                              artifact.title
                            }
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                            className="object-cover transition duration-700 group-hover:scale-[1.04]"
                          />
                        ) : (
                          <div className="absolute inset-0 grid place-items-center">
                            <PackageSearch
                              size={52}
                              className="text-white/10"
                              aria-hidden="true"
                            />
                          </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-[#050b18]/75 via-transparent to-black/15" />

                        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-5">
                          <span className="max-w-[65%] truncate rounded-full border border-white/15 bg-black/50 px-3 py-2 font-mono text-[7px] uppercase tracking-[0.14em] text-white/65 backdrop-blur-xl">
                            {
                              artifact.archiveNumber
                            }
                          </span>

                          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#C8FF00]/30 bg-[#C8FF00]/10 px-3 py-2 font-mono text-[7px] font-black uppercase tracking-[0.14em] text-[#C8FF00] backdrop-blur-xl">
                            <CircleCheck
                              size={9}
                              aria-hidden="true"
                            />

                            Available
                          </span>
                        </div>

                        <div className="absolute bottom-5 left-5 right-5">
                          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/50 px-3 py-2 font-mono text-[7px] font-black uppercase tracking-[0.14em] text-white/70 backdrop-blur-xl">
                            <Sparkles
                              size={10}
                              className="text-[#C8FF00]"
                              aria-hidden="true"
                            />

                            1 specimen available
                          </div>
                        </div>
                      </div>
                    </Link>

                    <div className="flex h-full flex-col p-6 sm:p-7">
                      <div className="flex items-center justify-between gap-4">
                        <p className="font-mono text-[8px] font-black uppercase tracking-[0.2em] text-[#C8FF00]">
                          {
                            artifact.player.name
                          }
                        </p>

                        <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-white/30">
                          {
                            artifact.brand.name
                          }
                        </p>
                      </div>

                      <Link
                        href={`/artifacts/${artifact.slug}`}
                        className="block outline-none"
                      >
                        <h3 className="mt-4 text-2xl font-black uppercase leading-[1.03] tracking-[-0.035em] text-white transition group-hover:text-[#C8FF00]">
                          {
                            artifact.title
                          }
                        </h3>
                      </Link>

                      {artifact.subtitle ? (
                        <p className="mt-3 text-sm leading-7 text-white/42">
                          {
                            artifact.subtitle
                          }
                        </p>
                      ) : null}

                      {context ? (
                        <p className="mt-4 font-mono text-[8px] font-bold uppercase tracking-[0.16em] text-white/30">
                          {
                            context
                          }
                        </p>
                      ) : null}

                      <div className="mt-6 border-t border-white/10 pt-5">
                        <div className="flex items-end justify-between gap-5">
                          <div>
                            <p className="font-mono text-[7px] font-black uppercase tracking-[0.18em] text-white/30">
                              Collection value
                            </p>

                            <p className="mt-2 text-2xl font-black tracking-[-0.04em] text-white">
                              {price ??
                                "Museum record"}
                            </p>
                          </div>

                          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#C8FF00]/20 bg-[#C8FF00]/[0.055] text-[#C8FF00]">
                            <Fingerprint
                              size={16}
                              aria-hidden="true"
                            />
                          </div>
                        </div>

                        <div className="mt-5 grid gap-2">
                          <div className="flex items-center gap-2 text-[0.68rem] leading-5 text-white/40">
                            <BadgeCheck
                              size={13}
                              className="shrink-0 text-[#C8FF00]"
                              aria-hidden="true"
                            />

                            AGE202 archive record
                          </div>

                          <div className="flex items-center gap-2 text-[0.68rem] leading-5 text-white/40">
                            <CircleCheck
                              size={13}
                              className="shrink-0 text-[#C8FF00]"
                              aria-hidden="true"
                            />

                            One physical specimen
                          </div>
                        </div>

                        <Link
                          href={`/artifacts/${artifact.slug}`}
                          className="group/cta mt-6 inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-2xl border border-[#C8FF00] bg-[#C8FF00] px-5 py-4 text-center text-[9px] font-black uppercase tracking-[0.18em] text-[#050b18] transition duration-300 hover:bg-[#dcff5a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8FF00]"
                        >
                          Explore & Collect

                          <ArrowRight
                            size={14}
                            className="transition-transform duration-300 group-hover/cta:translate-x-1"
                            aria-hidden="true"
                          />
                        </Link>

                        <p className="mt-3 text-center font-mono text-[7px] uppercase tracking-[0.14em] text-white/22">
                          One Artifact · One Collector
                        </p>
                      </div>
                    </div>
                  </article>
                </Reveal>
              );
            },
          )}
        </div>

        <Reveal delay={0.18}>
          <div className="mt-10 flex flex-col gap-5 border-t border-white/10 pt-7 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xl text-sm leading-7 text-white/35">
              Availability reflects the current
              status of each physical Artifact in
              the AGE202 museum archive.
            </p>

            <Link
              href="/shop"
              className="group inline-flex w-fit items-center gap-3 font-mono text-[9px] font-black uppercase tracking-[0.2em] text-white/55 transition hover:text-[#C8FF00]"
            >
              View all collectible artifacts

              <ArrowRight
                size={14}
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