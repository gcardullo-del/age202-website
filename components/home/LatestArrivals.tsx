"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useState,
} from "react";

import {
  ArrowRight,
  BadgeCheck,
  PackageSearch,
} from "lucide-react";

import Reveal from "@/components/ui/Reveal";
import SectionTitle from "@/components/ui/SectionTitle";


type LatestArtifact = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  archiveNumber: string;
  currency: string;
  price: string | null;

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
      style: "currency",
      currency,
    },
  ).format(
    amount,
  );
}


export default function LatestArrivals() {
  const [
    artifacts,
    setArtifacts,
  ] =
    useState<LatestArtifact[]>(
      [],
    );

  const [
    isLoading,
    setIsLoading,
  ] =
    useState(true);

  const [
    hasError,
    setHasError,
  ] =
    useState(false);


  useEffect(() => {
    let active =
      true;


    async function loadArtifacts() {
      try {
        const response =
          await fetch(
            "/api/artifacts/latest",
            {
              cache:
                "no-store",
            },
          );


        if (
          !response.ok
        ) {
          throw new Error(
            "Unable to load latest artifacts.",
          );
        }


        const data =
          (await response.json()) as LatestArtifact[];


        if (
          active
        ) {
          setArtifacts(
            data,
          );

          setHasError(
            false,
          );
        }
      } catch {
        if (
          active
        ) {
          setHasError(
            true,
          );
        }
      } finally {
        if (
          active
        ) {
          setIsLoading(
            false,
          );
        }
      }
    }


    void loadArtifacts();


    return () => {
      active =
        false;
    };
  }, []);


  return (
    <section
      id="latest-arrivals"
      className="
        relative
        overflow-hidden
        border-b
        border-white/10
        bg-[#08101F]
        px-4
        py-16
        sm:px-8
        sm:py-20
        lg:px-12
        lg:py-28
      "
    >
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          bg-[radial-gradient(circle_at_50%_0%,rgba(200,255,0,0.055),transparent_38%)]
        "
      />


      <div className="relative mx-auto max-w-[1500px]">
        <Reveal>
          <SectionTitle
            eyebrow="New in the Museum"
            title="Latest Museum Pieces"
            description="The newest published additions to the AGE202 collection, preserved as part of the living tennis archive."
            align="left"
          />
        </Reveal>


        {isLoading ? (
          <>
            <div className="grid gap-3 md:hidden">
              {Array.from({
                length:
                  3,
              }).map(
                (
                  _,
                  index,
                ) => (
                  <Reveal
                    key={
                      index
                    }
                    delay={
                      index *
                      0.06
                    }
                  >
                    <div className="h-[170px] animate-pulse rounded-[1.4rem] border border-white/10 bg-white/[0.025]" />
                  </Reveal>
                ),
              )}
            </div>

            <div className="hidden gap-5 md:grid md:grid-cols-2 xl:grid-cols-3">
              {Array.from({
                length:
                  6,
              }).map(
                (
                  _,
                  index,
                ) => (
                  <Reveal
                    key={
                      index
                    }
                    delay={
                      index *
                      0.06
                    }
                  >
                    <div className="min-h-[520px] animate-pulse rounded-[2rem] border border-white/10 bg-white/[0.025]" />
                  </Reveal>
                ),
              )}
            </div>
          </>
        ) : hasError ? (
          <Reveal>
            <div className="rounded-[2rem] border border-dashed border-white/10 bg-white/[0.02] px-6 py-16 text-center">
              <PackageSearch
                size={
                  34
                }
                className="mx-auto text-[#C8FF00]/55"
                aria-hidden="true"
              />

              <h3 className="mt-6 text-2xl font-black uppercase text-white">
                Archive temporarily unavailable
              </h3>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/40">
                The latest museum pieces could not be loaded right now.
              </p>
            </div>
          </Reveal>
        ) : artifacts.length >
          0 ? (
          <>
            {/* MOBILE */}

            <div className="overflow-hidden rounded-[1.6rem] border border-white/10 bg-[#09111f] shadow-[0_20px_60px_rgba(0,0,0,.22)] md:hidden">
              {artifacts.map(
                (
                  artifact,
                  index,
                ) => {
                  const cover =
                    artifact.images.find(
                      (
                        image,
                      ) =>
                        image.isCover,
                    ) ??
                    artifact.images[0] ??
                    null;

                  const price =
                    formatPrice(
                      artifact.price,
                      artifact.currency,
                    );


                  return (
                    <Reveal
                      key={
                        artifact.id
                      }
                      delay={
                        index *
                        0.05
                      }
                    >
                      <article
                        className={[
                          "group relative",
                          index !==
                          artifacts.length -
                            1
                            ? "border-b border-white/10"
                            : "",
                        ].join(
                          " ",
                        )}
                      >
                        <Link
                          href={`/artifacts/${artifact.slug}`}
                          className="
                            grid
                            grid-cols-[108px_minmax(0,1fr)]
                            gap-0
                          "
                        >
                          <div className="relative min-h-[150px] overflow-hidden bg-[#050b18]">
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
                                sizes="108px"
                                className="object-cover transition duration-700 group-hover:scale-[1.05]"
                              />
                            ) : (
                              <div className="absolute inset-0 grid place-items-center">
                                <PackageSearch
                                  size={
                                    34
                                  }
                                  className="text-white/10"
                                  aria-hidden="true"
                                />
                              </div>
                            )}

                            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#09111f]/20" />

                            <span className="absolute bottom-3 left-3 grid h-7 w-7 place-items-center rounded-full border border-white/15 bg-black/55 font-mono text-[7px] font-black text-white/70 backdrop-blur-md">
                              {String(
                                index +
                                  1,
                              ).padStart(
                                2,
                                "0",
                              )}
                            </span>
                          </div>


                          <div className="flex min-w-0 flex-col justify-between px-4 py-4">
                            <div>
                              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                <p className="font-mono text-[7px] font-black uppercase tracking-[0.16em] text-[#C8FF00]">
                                  {
                                    artifact
                                      .player
                                      .name
                                  }
                                </p>

                                <p className="font-mono text-[7px] uppercase tracking-[0.14em] text-white/30">
                                  {
                                    artifact
                                      .brand
                                      .name
                                  }
                                </p>
                              </div>


                              <h3 className="mt-2 line-clamp-2 text-[1.08rem] font-black uppercase leading-[1.02] tracking-[-0.035em] text-white">
                                {
                                  artifact.title
                                }
                              </h3>


                              {artifact.subtitle ? (
                                <p className="mt-2 line-clamp-2 text-[11px] leading-5 text-white/40">
                                  {
                                    artifact.subtitle
                                  }
                                </p>
                              ) : null}
                            </div>


                            <div className="mt-3 flex items-end justify-between gap-3 border-t border-white/10 pt-3">
                              <div className="min-w-0">
                                <p className="text-sm font-black text-white">
                                  {price ??
                                    "Museum record"}
                                </p>

                                <p className="mt-1 truncate font-mono text-[6px] uppercase tracking-[0.12em] text-white/28">
                                  {
                                    artifact.archiveNumber
                                  }
                                </p>
                              </div>

                              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#C8FF00]/45 text-[#C8FF00]">
                                <ArrowRight
                                  size={
                                    14
                                  }
                                  aria-hidden="true"
                                />
                              </span>
                            </div>
                          </div>
                        </Link>
                      </article>
                    </Reveal>
                  );
                },
              )}
            </div>


            {/* TABLET + DESKTOP */}

            <div className="hidden gap-5 md:grid md:grid-cols-2 xl:grid-cols-3">
              {artifacts.map(
                (
                  artifact,
                  index,
                ) => {
                  const cover =
                    artifact.images.find(
                      (
                        image,
                      ) =>
                        image.isCover,
                    ) ??
                    artifact.images[0] ??
                    null;

                  const price =
                    formatPrice(
                      artifact.price,
                      artifact.currency,
                    );


                  return (
                    <Reveal
                      key={
                        artifact.id
                      }
                      delay={
                        index *
                        0.06
                      }
                    >
                      <article className="group overflow-hidden rounded-[2rem] border border-white/10 bg-[#09111f] transition duration-500 hover:-translate-y-1 hover:border-[#C8FF00]/35">
                        <Link
                          href={`/artifacts/${artifact.slug}`}
                          className="block"
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
                                  size={
                                    48
                                  }
                                  className="text-white/10"
                                  aria-hidden="true"
                                />
                              </div>
                            )}

                            <div className="absolute inset-0 bg-gradient-to-t from-[#050b18]/55 via-transparent to-black/10" />

                            <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-5">
                              <span className="rounded-full border border-white/15 bg-black/45 px-3 py-2 font-mono text-[7px] uppercase tracking-[0.16em] text-white/70 backdrop-blur-xl">
                                {
                                  artifact.archiveNumber
                                }
                              </span>

                              <span className="rounded-full border border-[#C8FF00]/30 bg-[#C8FF00]/10 px-3 py-2 font-mono text-[7px] uppercase tracking-[0.16em] text-[#C8FF00] backdrop-blur-xl">
                                New
                              </span>
                            </div>
                          </div>
                        </Link>


                        <div className="p-6 sm:p-7">
                          <div className="flex items-center justify-between gap-4">
                            <p className="font-mono text-[8px] font-black uppercase tracking-[0.2em] text-[#C8FF00]">
                              {
                                artifact
                                  .player
                                  .name
                              }
                            </p>

                            <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-white/30">
                              {
                                artifact
                                  .brand
                                  .name
                              }
                            </p>
                          </div>


                          <Link
                            href={`/artifacts/${artifact.slug}`}
                            className="block"
                          >
                            <h3 className="mt-4 text-2xl font-black uppercase leading-tight tracking-[-0.03em] text-white">
                              {
                                artifact.title
                              }
                            </h3>
                          </Link>


                          {artifact.subtitle ? (
                            <p className="mt-3 text-sm leading-7 text-white/45">
                              {
                                artifact.subtitle
                              }
                            </p>
                          ) : null}


                          <div className="mt-6 flex items-end justify-between gap-5 border-t border-white/10 pt-5">
                            <div>
                              <p className="text-sm font-black text-white">
                                {price ??
                                  "Museum record"}
                              </p>

                              <p className="mt-2 inline-flex items-center gap-1.5 font-mono text-[7px] uppercase tracking-[0.14em] text-white/30">
                                <BadgeCheck
                                  size={
                                    11
                                  }
                                  className="text-[#C8FF00]"
                                  aria-hidden="true"
                                />

                                AGE202 archive
                              </p>
                            </div>


                            <Link
                              href={`/artifacts/${artifact.slug}`}
                              aria-label={`Explore ${artifact.title}`}
                              className="grid h-11 w-11 place-items-center rounded-full border border-[#C8FF00]/45 text-[#C8FF00] transition duration-300 hover:bg-[#C8FF00] hover:text-[#050b18]"
                            >
                              <ArrowRight
                                size={
                                  16
                                }
                                aria-hidden="true"
                              />
                            </Link>
                          </div>
                        </div>
                      </article>
                    </Reveal>
                  );
                },
              )}
            </div>


            <Reveal delay={0.18}>
              <div className="mt-8 flex justify-end border-t border-white/10 pt-5 sm:mt-10 sm:pt-6">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.22em] text-white/60 transition hover:text-[#C8FF00]"
                >
                  Explore the full collection

                  <ArrowRight
                    size={
                      14
                    }
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </Reveal>
          </>
        ) : (
          <Reveal>
            <div className="rounded-[2rem] border border-dashed border-white/10 bg-white/[0.02] px-6 py-16 text-center">
              <PackageSearch
                size={
                  34
                }
                className="mx-auto text-[#C8FF00]/55"
                aria-hidden="true"
              />

              <h3 className="mt-6 text-2xl font-black uppercase text-white">
                New pieces are being catalogued
              </h3>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/40">
                Published artifacts from the CMS will automatically appear here as they enter the AGE202 collection.
              </p>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}