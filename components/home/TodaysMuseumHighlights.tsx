"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ArrowRight,
  CalendarDays,
  PackageSearch,
  Sparkles,
} from "lucide-react";

import Card from "@/components/ui/Card";
import Reveal from "@/components/ui/Reveal";
import SectionTitle from "@/components/ui/SectionTitle";
import {
  getTodayInTennisHistory,
} from "@/data/todayInHistory";

type HighlightArtifact = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  archiveNumber: string;
  year: number | null;
  player: {
    name: string;
  };
  brand: {
    name: string;
  };
  cover: {
    url: string;
    alt: string | null;
  } | null;
};

type HighlightResponse = {
  latest: HighlightArtifact | null;
  featured: HighlightArtifact | null;
};

function ArtifactPreview({
  artifact,
}: {
  artifact: HighlightArtifact;
}) {
  return (
    <div className="mt-7 overflow-hidden rounded-[1.4rem] border border-white/10 bg-[#050b18]">
      <div className="relative aspect-[16/9] overflow-hidden">
        {artifact.cover ? (
          <Image
            src={artifact.cover.url}
            alt={
              artifact.cover.alt ??
              artifact.title
            }
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition duration-700 group-hover:scale-[1.035]"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center">
            <PackageSearch
              size={40}
              className="text-white/10"
              aria-hidden="true"
            />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#050b18]/75 via-transparent to-transparent" />

        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5">
          <div>
            <p className="font-mono text-[7px] font-bold uppercase tracking-[0.18em] text-[#C8FF00]">
              {artifact.player.name}
            </p>

            <p className="mt-2 text-sm font-black uppercase text-white">
              {artifact.brand.name}
              {artifact.year
                ? ` · ${artifact.year}`
                : ""}
            </p>
          </div>

          <span className="font-mono text-[7px] uppercase tracking-[0.15em] text-white/40">
            {artifact.archiveNumber}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function TodaysMuseumHighlights() {
  const [
    highlights,
    setHighlights,
  ] = useState<HighlightResponse>({
    latest: null,
    featured: null,
  });

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const historyEntry =
    useMemo(
      () =>
        getTodayInTennisHistory(
          new Date(),
        ),
      [],
    );

  useEffect(() => {
    let active = true;

    async function loadHighlights() {
      try {
        const response =
          await fetch(
            "/api/artifacts/highlights",
            {
              cache: "no-store",
            },
          );

        if (!response.ok) {
          return;
        }

        const data =
          (await response.json()) as HighlightResponse;

        if (active) {
          setHighlights(data);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void loadHighlights();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section
      id="todays-museum-highlights"
      className="relative overflow-hidden border-b border-white/10 bg-[#050b18] px-5 py-20 sm:px-8 lg:px-12 lg:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(200,255,0,0.045),transparent_42%)]"
      />

      <div className="relative mx-auto max-w-[1500px]">
        <Reveal>
          <SectionTitle
            eyebrow="Today at AGE202"
            title="Museum Highlights"
            description="A daily view of what has entered the collection, what happened in tennis history and what the museum is currently spotlighting."
            align="left"
          />
        </Reveal>

        <div className="grid gap-5 xl:grid-cols-12">
          <div className="xl:col-span-5">
            <Reveal delay={0.06}>
              <Card
                title={
                  highlights.latest?.title ??
                  "New artifact"
                }
                description={
                  highlights.latest?.subtitle ??
                  "The latest published museum acquisition will appear here automatically."
                }
                href={
                  highlights.latest
                    ? `/artifacts/${highlights.latest.slug}`
                    : undefined
                }
                badge="New Artifact"
                status={
                  highlights.latest
                    ? "open"
                    : "coming-soon"
                }
                accent="#C8FF00"
                icon={
                  <PackageSearch
                    size={24}
                    aria-hidden="true"
                  />
                }
                className="h-full min-h-[520px]"
              >
                {isLoading ? (
                  <div className="mt-7 aspect-[16/9] animate-pulse rounded-[1.4rem] border border-white/10 bg-white/[0.025]" />
                ) : highlights.latest ? (
                  <ArtifactPreview
                    artifact={
                      highlights.latest
                    }
                  />
                ) : null}
              </Card>
            </Reveal>
          </div>

          <div className="xl:col-span-3">
            <Reveal delay={0.12}>
              <Card
                title={
                  historyEntry?.title ??
                  "Archive entry in preparation"
                }
                description={
                  historyEntry?.description ??
                  "This date has not yet been catalogued in the AGE202 daily tennis history archive."
                }
                badge="Today in Tennis History"
                status="open"
                accent="#D4AF37"
                icon={
                  <CalendarDays
                    size={24}
                    aria-hidden="true"
                  />
                }
                className="h-full min-h-[520px]"
              >
                <div className="mt-8 border-t border-white/10 pt-6">
                  <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/35">
                    {new Intl.DateTimeFormat(
                      "en-GB",
                      {
                        day: "2-digit",
                        month: "long",
                      },
                    ).format(
                      new Date(),
                    )}
                  </p>

                  {historyEntry ? (
                    <p className="mt-4 text-6xl font-black tracking-[-0.07em] text-[#D4AF37]">
                      {historyEntry.year}
                    </p>
                  ) : null}
                </div>
              </Card>
            </Reveal>
          </div>

          <div className="xl:col-span-4">
            <Reveal delay={0.18}>
              <Card
                title={
                  highlights.featured?.title ??
                  "Curator's pick"
                }
                description={
                  highlights.featured?.subtitle ??
                  "A featured artifact selected by the museum curator will appear here."
                }
                href={
                  highlights.featured
                    ? `/artifacts/${highlights.featured.slug}`
                    : undefined
                }
                badge="Curator's Pick"
                status={
                  highlights.featured
                    ? "open"
                    : "coming-soon"
                }
                accent="#FFFFFF"
                icon={
                  <Sparkles
                    size={24}
                    aria-hidden="true"
                  />
                }
                className="h-full min-h-[520px]"
              >
                {isLoading ? (
                  <div className="mt-7 aspect-[16/9] animate-pulse rounded-[1.4rem] border border-white/10 bg-white/[0.025]" />
                ) : highlights.featured ? (
                  <ArtifactPreview
                    artifact={
                      highlights.featured
                    }
                  />
                ) : null}
              </Card>
            </Reveal>
          </div>
        </div>

        <Reveal delay={0.22}>
          <div className="mt-10 flex justify-end border-t border-white/10 pt-6">
            <Link
              href="/shop"
              className="inline-flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.22em] text-white/55 transition hover:text-[#C8FF00]"
            >
              Explore the museum collection

              <ArrowRight
                size={14}
                aria-hidden="true"
              />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}