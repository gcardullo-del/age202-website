import type {
  Metadata,
} from "next";

import Image from "next/image";
import Link from "next/link";
import {
  notFound,
} from "next/navigation";

import {
  ArrowDown,
  ArrowLeft,
  Crown,
  MapPin,
  Medal,
  Sparkles,
  Trophy,
} from "lucide-react";

import {
  getLegendBySlug,
} from "@/lib/repositories/legend.repository";

export const dynamic =
  "force-dynamic";

type LegendPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function absoluteUrl(
  value?: string | null,
) {
  if (!value) {
    return undefined;
  }

  if (
    value.startsWith("http://") ||
    value.startsWith("https://")
  ) {
    return value;
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://www.age202.com";

  return `${siteUrl}${value.startsWith("/") ? "" : "/"}${value}`;
}

function getLegendDescription(
  legend: Awaited<
    ReturnType<
      typeof getLegendBySlug
    >
  >,
) {
  if (!legend) {
    return "";
  }

  return (
    legend.metaDescription ??
    legend.biographyShort ??
    `Discover the career, achievements and legacy of ${legend.name} in THE LEGENDS, the AGE202 historical tennis archive.`
  );
}

function formatNumber(
  value: number | null,
) {
  return value === null
    ? "—"
    : value.toLocaleString("en-US");
}

export async function generateMetadata({
  params,
}: LegendPageProps): Promise<Metadata> {
  const {
    slug,
  } = await params;

  const legend =
    await getLegendBySlug(
      slug,
    );

  if (
    !legend ||
    legend.status !==
      "PUBLISHED"
  ) {
    return {
      title:
        "Legend not found | AGE202",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title =
    legend.metaTitle ??
    `${legend.name} | THE LEGENDS | AGE202`;

  const description =
    getLegendDescription(
      legend,
    );

  const canonical =
    legend.canonicalUrl ??
    `/legends/${legend.slug}`;

  const socialImage =
    absoluteUrl(
      legend.openGraphImage ??
        legend.heroImage ??
        legend.portraitImage,
    );

  return {
    title,
    description,

    alternates: {
      canonical,
    },

    robots: {
      index:
        legend.robotsIndex,
      follow:
        legend.robotsFollow,
    },

    openGraph: {
      title,
      description,
      type: "profile",
      url: canonical,
      images: socialImage
        ? [
            {
              url: socialImage,
            },
          ]
        : undefined,
    },

    twitter: {
      card:
        "summary_large_image",
      title,
      description,
      images: socialImage
        ? [socialImage]
        : undefined,
    },
  };
}

export default async function LegendPage({
  params,
}: LegendPageProps) {
  const {
    slug,
  } = await params;

  const legend =
    await getLegendBySlug(
      slug,
    );

  if (
    !legend ||
    legend.status !==
      "PUBLISHED"
  ) {
    notFound();
  }

  const heroImage =
    legend.heroImage ??
    legend.portraitImage ??
    legend.images[0]?.url ??
    null;

  const portraitImage =
    legend.portraitImage ??
    legend.heroImage ??
    legend.images[0]?.url ??
    null;

  const birthYear =
    legend.birthDate
      ? new Date(
          legend.birthDate,
        ).getFullYear()
      : null;

  const deathYear =
    legend.deathDate
      ? new Date(
          legend.deathDate,
        ).getFullYear()
      : null;

  const lifeYears =
    birthYear
      ? deathYear
        ? `${birthYear}–${deathYear}`
        : `${birthYear}–`
      : null;

  const branch =
    legend.gender === "FEMALE"
      ? "Women's Legends"
      : "Men's Legends";

  const jsonLd = {
    "@context":
      "https://schema.org",
    "@type": "Person",
    name: legend.name,
    alternateName:
      legend.nickname ??
      undefined,
    nationality:
      legend.nationality ??
      undefined,
    birthDate:
      legend.birthDate
        ? new Date(
            legend.birthDate,
          )
            .toISOString()
            .split("T")[0]
        : undefined,
    birthPlace:
      legend.birthPlace
        ? {
            "@type":
              "Place",
            name:
              legend.birthPlace,
          }
        : undefined,
    deathDate:
      legend.deathDate
        ? new Date(
            legend.deathDate,
          )
            .toISOString()
            .split("T")[0]
        : undefined,
    image:
      absoluteUrl(
        legend.portraitImage ??
          legend.heroImage,
      ),
    description:
      getLegendDescription(
        legend,
      ),
    url:
      absoluteUrl(
        `/legends/${legend.slug}`,
      ),
  };

  return (
    <main className="min-h-screen bg-[#050B18] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              jsonLd,
            ),
        }}
      />

      <section className="relative isolate min-h-[calc(100svh-80px)] overflow-hidden border-b border-white/10">
        <div className="absolute inset-0">
          {heroImage ? (
            <Image
              src={heroImage}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          ) : null}

          <div className="absolute inset-0 bg-[#050B18]/25" />

          <div className="absolute inset-0 bg-gradient-to-r from-[#050B18] via-[#050B18]/88 to-[#050B18]/20" />

          <div className="absolute inset-0 bg-gradient-to-t from-[#050B18] via-transparent to-[#050B18]/45" />
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)",
            backgroundSize:
              "90px 90px",
          }}
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-40 top-1/3 h-[500px] w-[500px] rounded-full bg-lime-300/[0.055] blur-[150px]"
        />

        <div className="relative z-10 mx-auto flex min-h-[calc(100svh-80px)] w-full max-w-7xl items-end px-6 pb-24 pt-32 md:px-8 md:pb-28 lg:items-center lg:py-28">
          <div className="w-full max-w-5xl">
            <Link
              href="/legends"
              className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.22em] text-white/40 transition hover:text-lime-300"
            >
              <ArrowLeft className="size-3.5" />

              The Legends
            </Link>

            <div className="mt-8 flex items-center gap-4">
              <span className="h-px w-12 bg-lime-300" />

              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-lime-300">
                AGE202 Tennis History
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-lime-300/20 bg-lime-300/[0.08] px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.18em] text-lime-300 backdrop-blur">
                <Crown className="size-3" />

                {branch}
              </span>

              {legend.era ? (
                <span className="rounded-full border border-white/10 bg-black/25 px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.18em] text-white/60 backdrop-blur">
                  {legend.era}
                </span>
              ) : null}

              {legend.featured ? (
                <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.18em] text-white/60 backdrop-blur">
                  Featured Legend
                </span>
              ) : null}
            </div>

            <h1 className="mt-7 max-w-5xl text-[clamp(4rem,10vw,9.5rem)] font-black leading-[0.82] tracking-[-0.075em] text-white">
              {legend.name}
            </h1>

            {legend.nickname ? (
              <p className="mt-5 text-xl font-semibold tracking-[-0.03em] text-white/35 md:text-2xl">
                “{legend.nickname}”
              </p>
            ) : null}

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/50">
              {legend.nationality ? (
                <span className="inline-flex items-center gap-2">
                  <MapPin className="size-4 text-lime-300/70" />

                  {
                    legend.nationality
                  }
                </span>
              ) : null}

              {lifeYears ? (
                <span className="font-mono text-xs tracking-[0.12em] text-white/45">
                  {lifeYears}
                </span>
              ) : null}

              {legend.grandSlams >
              0 ? (
                <span className="inline-flex items-center gap-2">
                  <Trophy className="size-4 text-lime-300/70" />

                  {
                    legend.grandSlams
                  }{" "}
                  Grand Slam
                  {legend.grandSlams ===
                  1
                    ? ""
                    : "s"}
                </span>
              ) : null}
            </div>

            {legend.quote ? (
              <blockquote className="mt-9 max-w-2xl border-l border-lime-300/70 pl-5 text-base italic leading-8 text-white/60 md:text-lg">
                “{legend.quote}”
              </blockquote>
            ) : legend.biographyShort ? (
              <p className="mt-9 max-w-2xl text-base leading-8 text-white/55 md:text-lg">
                {
                  legend.biographyShort
                }
              </p>
            ) : null}

            <div className="mt-12 grid max-w-3xl grid-cols-2 border-y border-white/10 sm:grid-cols-4">
              <HeroStat
                value={
                  legend.grandSlams
                }
                label="Grand Slams"
              />

              <HeroStat
                value={
                  legend.careerTitles
                }
                label="Career Titles"
              />

              <HeroStat
                value={
                  legend.weeksAtNo1 >
                  0
                    ? legend.weeksAtNo1
                    : "—"
                }
                label="Weeks No.1"
              />

              <HeroStat
                value={
                  legend.careerHigh ??
                  "—"
                }
                label="Career High"
                prefix={
                  legend.careerHigh
                    ? "#"
                    : undefined
                }
              />
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 right-8 z-10 hidden text-right md:block">
          <p className="text-[8px] font-black uppercase tracking-[0.3em] text-white/25">
            Historical Archive
          </p>

          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/50">
            AGE-LGD-
            {legend.slug}
          </p>
        </div>

        <a
          href="#legend-story"
          aria-label={`Discover ${legend.name}`}
          className="absolute bottom-7 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-3 sm:flex"
        >
          <span className="text-[8px] font-black uppercase tracking-[0.32em] text-white/35">
            Discover
          </span>

          <span className="relative h-10 w-px overflow-hidden bg-white/15">
            <span className="absolute left-0 top-0 h-4 w-px bg-lime-300" />
          </span>

          <ArrowDown className="size-3 text-lime-300/60" />
        </a>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#050B18] to-transparent" />
      </section>

      <nav
        aria-label="Legend profile sections"
        className="sticky top-0 z-40 border-b border-white/10 bg-[#050B18]/92 px-5 py-3 backdrop-blur-xl sm:px-8 lg:px-12"
      >
        <div className="mx-auto flex max-w-[1440px] items-center gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <ProfileIndexLink
            href="#legend-story"
            label="Biography"
          />

          <ProfileIndexLink
            href="#legend-career"
            label="Career"
          />

          <ProfileIndexLink
            href="#legend-slams"
            label="Grand Slams"
          />

          {legend.milestones.length > 0 ? (
            <ProfileIndexLink
              href="#legend-timeline"
              label="Timeline"
            />
          ) : null}

          {legend.images.length > 0 ? (
            <ProfileIndexLink
              href="#legend-gallery"
              label="Gallery"
            />
          ) : null}

          {legend.legacy ? (
            <ProfileIndexLink
              href="#legend-legacy"
              label="Legacy"
            />
          ) : null}

          <ProfileIndexLink
            href="#legend-passport"
            label="Passport"
          />
        </div>
      </nav>

      <section
        id="legend-story"
        className="border-b border-white/10"
      >
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-8 md:py-28">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-9 bg-lime-300" />

                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-lime-300">
                  01 · The Legend
                </p>
              </div>

              <h2 className="mt-6 text-5xl font-black tracking-[-0.06em] sm:text-7xl">
                A place in
                <span className="block text-white/25">
                  tennis history.
                </span>
              </h2>

              {portraitImage ? (
                <div className="relative mt-10 aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/10 bg-[#07101D]">
                  <Image
                    src={portraitImage}
                    alt={legend.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#050B18]/70 via-transparent to-transparent" />
                </div>
              ) : null}
            </div>

            <div className="max-w-2xl lg:pt-16">
              {legend.biographyShort ? (
                <p className="text-xl font-medium leading-9 text-white/75">
                  {
                    legend.biographyShort
                  }
                </p>
              ) : null}

              {legend.biographyLong ? (
                <div className="mt-8 whitespace-pre-line text-base leading-8 text-white/45">
                  {
                    legend.biographyLong
                  }
                </div>
              ) : !legend.biographyShort ? (
                <p className="text-lg leading-8 text-white/35">
                  Historical biography
                  coming soon.
                </p>
              ) : null}

              <div className="mt-10 flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.22em] text-white/30">
                <Crown className="size-4 text-lime-300/60" />

                AGE202 Historical
                Archive
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="legend-career"
        className="border-b border-white/10 bg-white/[0.01]"
      >
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-8 md:py-28">
          <div className="flex items-center gap-3">
            <span className="h-px w-9 bg-lime-300" />

            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-lime-300">
              02 · Career
            </p>
          </div>

          <div className="mt-6 grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div>
              <h2 className="text-5xl font-black tracking-[-0.06em] sm:text-7xl">
                Career
                <span className="block text-white/25">
                  at a glance.
                </span>
              </h2>

              <p className="mt-5 max-w-xl text-sm leading-7 text-white/40 sm:text-base">
                The numbers behind the
                legend: ranking peaks,
                titles, dominance and
                longevity across an era.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <CareerMetric
                label="Career high"
                value={
                  legend.careerHigh
                    ? `#${legend.careerHigh}`
                    : "—"
                }
                description="Highest recorded historical ranking"
              />

              <CareerMetric
                label="Career titles"
                value={
                  legend.careerTitles
                }
                description="Titles recorded in the AGE202 historical archive"
              />

              <CareerMetric
                label="Weeks at No.1"
                value={
                  legend.weeksAtNo1 >
                  0
                    ? legend.weeksAtNo1
                    : "—"
                }
                description="Weeks recognised at the top of the rankings"
              />

              <CareerMetric
                label="Year-end No.1"
                value={
                  legend.yearEndNo1 >
                  0
                    ? legend.yearEndNo1
                    : "—"
                }
                description="Seasons finished as the world's leading player"
              />

              <CareerMetric
                label="Olympic gold"
                value={
                  legend.olympicGold
                }
                description="Olympic singles gold medals"
              />

              <CareerMetric
                label="Era"
                value={
                  legend.era ??
                  "—"
                }
                description="Primary historical period represented"
              />
            </div>
          </div>
        </div>
      </section>

      <section
        id="legend-slams"
        className="border-b border-white/10"
      >
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-8 md:py-28">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3">
                <span className="h-px w-9 bg-lime-300" />

                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-lime-300">
                  03 · Grand Slam Legacy
                </p>
              </div>

              <h2 className="mt-6 text-5xl font-black tracking-[-0.06em] sm:text-7xl">
                Major
                <span className="block text-white/25">
                  championship record.
                </span>
              </h2>
            </div>

            <div className="inline-flex items-center gap-3 rounded-full border border-lime-300/20 bg-lime-300/[0.06] px-4 py-2 text-sm font-semibold text-lime-200">
              <Trophy className="size-4" />

              {legend.grandSlams} total
            </div>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <SlamCard
              label="Australian Open"
              value={
                legend.australianOpen
              }
              code="AO"
            />

            <SlamCard
              label="Roland Garros"
              value={
                legend.rolandGarros
              }
              code="RG"
            />

            <SlamCard
              label="Wimbledon"
              value={
                legend.wimbledon
              }
              code="W"
            />

            <SlamCard
              label="US Open"
              value={
                legend.usOpen
              }
              code="US"
            />
          </div>

          <div className="mt-6 rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.035] to-transparent p-6 sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center gap-2 text-lime-300/70">
                  <Medal className="size-4" />

                  <p className="text-[9px] font-black uppercase tracking-[0.2em]">
                    Major titles
                  </p>
                </div>

                <p className="mt-4 text-4xl font-black tracking-[-0.05em] text-white sm:text-5xl">
                  {
                    legend.grandSlams
                  }{" "}
                  Grand Slam
                  {legend.grandSlams ===
                  1
                    ? ""
                    : "s"}
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs text-white/35">
                <Sparkles className="size-4 text-lime-300/60" />

                AGE202 historical
                major record
              </div>
            </div>
          </div>
        </div>
      </section>


      {legend.milestones.length > 0 ? (
        <section
          id="legend-timeline"
          className="border-b border-white/10 bg-white/[0.01]"
        >
          <div className="mx-auto max-w-7xl px-6 py-20 md:px-8 md:py-28">
            <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <div className="flex items-center gap-3">
                  <span className="h-px w-9 bg-lime-300" />

                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-lime-300">
                    04 · Career Timeline
                  </p>
                </div>

                <h2 className="mt-6 text-5xl font-black tracking-[-0.06em] sm:text-7xl">
                  Moments that
                  <span className="block text-white/25">
                    shaped the legacy.
                  </span>
                </h2>

                <p className="mt-5 max-w-2xl text-sm leading-7 text-white/40 sm:text-base">
                  A chronological path through the defining seasons, breakthroughs
                  and milestones that built this legend&apos;s place in tennis history.
                </p>
              </div>

              <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-white/40">
                <Crown className="size-4 text-lime-300/70" />

                {legend.milestones.length}{" "}
                {legend.milestones.length === 1
                  ? "milestone"
                  : "milestones"}
              </div>
            </div>

            <div className="relative mt-14">
              <div className="absolute left-[20px] top-0 hidden h-full w-px bg-gradient-to-b from-lime-300/60 via-white/10 to-transparent md:block" />

              <div className="space-y-6">
                {legend.milestones.map(
                  (
                    milestone,
                    index,
                  ) => (
                    <article
                      key={milestone.id}
                      className="relative md:pl-16"
                    >
                      <div className="absolute left-[12px] top-7 hidden size-4 rounded-full border-4 border-[#050B18] bg-lime-300 shadow-[0_0_24px_rgba(190,242,100,0.35)] md:block" />

                      <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#07101D]/65">
                        <div className="grid gap-0 lg:grid-cols-[220px_minmax(0,1fr)]">
                          <div className="relative min-h-44 overflow-hidden border-b border-white/10 bg-[#08111F] lg:min-h-full lg:border-b-0 lg:border-r">
                            {milestone.imageUrl ? (
                              <Image
                                src={milestone.imageUrl}
                                alt={milestone.title}
                                fill
                                sizes="220px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="absolute inset-0 grid place-items-center">
                                <div className="text-center">
                                  <p className="text-5xl font-black tracking-[-0.05em] text-white/10">
                                    {milestone.year}
                                  </p>

                                  <p className="mt-2 text-[8px] font-black uppercase tracking-[0.18em] text-lime-300/45">
                                    Historical marker
                                  </p>
                                </div>
                              </div>
                            )}

                            <div className="absolute inset-0 bg-gradient-to-t from-[#050B18]/80 via-transparent to-transparent" />

                            <div className="absolute left-4 top-4 flex items-center gap-2">
                              <span className="rounded-full border border-lime-300/20 bg-lime-300/10 px-3 py-1.5 font-mono text-[9px] font-black tracking-[0.14em] text-lime-200 backdrop-blur">
                                {milestone.year}
                              </span>

                              {milestone.featured ? (
                                <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-[7px] font-black uppercase tracking-[0.16em] text-white/55 backdrop-blur">
                                  Featured
                                </span>
                              ) : null}
                            </div>
                          </div>

                          <div className="p-6 sm:p-7">
                            <div className="flex items-start justify-between gap-5">
                              <div>
                                <p className="font-mono text-[8px] font-black uppercase tracking-[0.18em] text-white/25">
                                  Milestone {String(index + 1).padStart(2, "0")}
                                </p>

                                <h3 className="mt-3 text-2xl font-black tracking-[-0.035em] text-white sm:text-3xl">
                                  {milestone.title}
                                </h3>

                                {milestone.subtitle ? (
                                  <p className="mt-2 text-sm font-semibold text-lime-300/65">
                                    {milestone.subtitle}
                                  </p>
                                ) : null}
                              </div>

                              <span className="grid size-10 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.03]">
                                <Trophy className="size-4 text-lime-300/55" />
                              </span>
                            </div>

                            {milestone.description ? (
                              <p className="mt-5 max-w-3xl whitespace-pre-line text-sm leading-7 text-white/40 sm:text-base">
                                {milestone.description}
                              </p>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </article>
                  ),
                )}
              </div>
            </div>
          </div>
        </section>
      ) : null}


      {legend.images.length > 0 ? (
        <section
          id="legend-gallery"
          className="border-b border-white/10"
        >
          <div className="mx-auto max-w-7xl px-6 py-20 md:px-8 md:py-28">
            <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <div className="flex items-center gap-3">
                  <span className="h-px w-9 bg-lime-300" />

                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-lime-300">
                    05 · Gallery
                  </p>
                </div>

                <h2 className="mt-6 text-5xl font-black tracking-[-0.06em] sm:text-7xl">
                  The images
                  <span className="block text-white/25">
                    that survived the era.
                  </span>
                </h2>

                <p className="mt-5 max-w-2xl text-sm leading-7 text-white/40 sm:text-base">
                  A visual archive of defining matches, trophies, rivalries and
                  moments that became part of tennis history.
                </p>
              </div>

              <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-white/40">
                <Sparkles className="size-4 text-lime-300/70" />
                {legend.images.length}{" "}
                {legend.images.length === 1
                  ? "image"
                  : "images"}
              </div>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {legend.images.map(
                (
                  image,
                  index,
                ) => (
                  <figure
                    key={image.id}
                    className={[
                      "group overflow-hidden rounded-[2rem] border border-white/10 bg-[#07101D]",
                      index === 0
                        ? "md:col-span-2 xl:col-span-2"
                        : "",
                    ].join(" ")}
                  >
                    <div
                      className={[
                        "relative overflow-hidden bg-[#08111F]",
                        index === 0
                          ? "aspect-[16/9]"
                          : "aspect-[4/5]",
                      ].join(" ")}
                    >
                      <Image
                        src={image.url}
                        alt={
                          image.alt ??
                          `${legend.name} historical archive image ${index + 1}`
                        }
                        fill
                        sizes={
                          index === 0
                            ? "(max-width: 1280px) 100vw, 66vw"
                            : "(max-width: 768px) 100vw, 33vw"
                        }
                        className="object-cover transition duration-700 group-hover:scale-[1.035]"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-[#050B18]/80 via-transparent to-transparent" />

                      <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/35 px-3 py-1.5 font-mono text-[8px] font-black uppercase tracking-[0.16em] text-white/55 backdrop-blur">
                        Archive {String(index + 1).padStart(2, "0")}
                      </div>
                    </div>

                    {(image.caption || image.alt) ? (
                      <figcaption className="p-5 sm:p-6">
                        {image.caption ? (
                          <p className="text-sm leading-7 text-white/55">
                            {image.caption}
                          </p>
                        ) : null}

                        {image.alt ? (
                          <p className="mt-2 text-[9px] font-black uppercase tracking-[0.16em] text-white/25">
                            {image.alt}
                          </p>
                        ) : null}
                      </figcaption>
                    ) : null}
                  </figure>
                ),
              )}
            </div>
          </div>
        </section>
      ) : null}


      {legend.legacy ? (
        <section
          id="legend-legacy"
          className="border-b border-white/10 bg-white/[0.01]"
        >
          <div className="mx-auto max-w-7xl px-6 py-20 md:px-8 md:py-28">
            <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
              <div>
                <div className="flex items-center gap-3">
                  <span className="h-px w-9 bg-lime-300" />

                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-lime-300">
                    06 · Legacy
                  </p>
                </div>

                <h2 className="mt-6 text-5xl font-black tracking-[-0.06em] sm:text-7xl">
                  What remains
                  <span className="block text-white/25">
                    after the victories.
                  </span>
                </h2>

                <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-lime-300/15 bg-lime-300/[0.05] px-4 py-2 text-xs text-lime-200/75">
                  <Crown className="size-4" />
                  Historical significance
                </div>
              </div>

              <div className="max-w-3xl lg:pt-14">
                <p className="whitespace-pre-line text-lg leading-9 text-white/60 sm:text-xl">
                  {legend.legacy}
                </p>

                {legend.quote ? (
                  <blockquote className="mt-10 border-l border-lime-300/60 pl-6 text-xl font-medium italic leading-9 text-white/70 sm:text-2xl">
                    “{legend.quote}”
                  </blockquote>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section
        id="legend-passport"
        className="border-b border-white/10"
      >
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-8 md:py-28">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3">
                <span className="h-px w-9 bg-lime-300" />

                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-lime-300">
                  07 · Historical Passport
                </p>
              </div>

              <h2 className="mt-6 text-5xl font-black tracking-[-0.06em] sm:text-7xl">
                The archive
                <span className="block text-white/25">
                  identity record.
                </span>
              </h2>
            </div>

            <div className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 font-mono text-[8px] font-black uppercase tracking-[0.16em] text-white/35">
              AGE-LGD-{legend.slug}
            </div>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <PassportItem
              label="Nationality"
              value={
                legend.nationality ??
                "—"
              }
            />

            <PassportItem
              label="Country code"
              value={
                legend.countryCode ??
                "—"
              }
            />

            <PassportItem
              label="Born"
              value={
                legend.birthDate
                  ? new Intl.DateTimeFormat(
                      "en-GB",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      },
                    ).format(
                      new Date(
                        legend.birthDate,
                      ),
                    )
                  : "—"
              }
            />

            <PassportItem
              label="Birthplace"
              value={
                legend.birthPlace ??
                "—"
              }
            />

            <PassportItem
              label="Era"
              value={
                legend.era ??
                "—"
              }
            />

            <PassportItem
              label="Turned pro"
              value={
                legend.turnedPro ??
                "—"
              }
            />

            <PassportItem
              label="Retired"
              value={
                legend.retiredYear ??
                "—"
              }
            />

            <PassportItem
              label="Plays"
              value={
                legend.plays ??
                "—"
              }
            />

            <PassportItem
              label="Backhand"
              value={
                legend.backhand ??
                "—"
              }
            />

            <PassportItem
              label="Grand Slams"
              value={
                legend.grandSlams
              }
            />

            <PassportItem
              label="Career titles"
              value={
                legend.careerTitles
              }
            />

            <PassportItem
              label="Archive branch"
              value={branch}
            />
          </div>

          <div className="mt-8 rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.035] to-transparent p-6 sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white/25">
                  AGE202 Historical Archive
                </p>

                <p className="mt-2 text-lg font-semibold text-white/75">
                  {legend.name}
                </p>
              </div>

              <div className="inline-flex items-center gap-2 text-xs text-white/35">
                <Medal className="size-4 text-lime-300/60" />
                Museum profile record
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="border-t border-white/10 px-5 py-8 text-center sm:px-8 lg:px-12">
        <a
          href="#top"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.025] px-5 py-3 font-mono text-[8px] font-black uppercase tracking-[0.18em] text-white/42 outline-none transition hover:border-lime-300/35 hover:text-lime-300"
        >
          Back to top

          <ArrowDown
            size={13}
            className="rotate-180"
            aria-hidden="true"
          />
        </a>
      </div>
    </main>
  );
}

function HeroStat({
  value,
  label,
  prefix,
}: {
  value: string | number;
  label: string;
  prefix?: string;
}) {
  return (
    <div className="border-white/10 px-3 py-6 odd:border-r sm:border-r sm:px-4 sm:odd:border-r sm:first:pl-0 sm:last:border-r-0 sm:last:pr-0">
      <p className="text-2xl font-black tracking-[-0.04em] text-white">
        {prefix}
        {value}
      </p>

      <p className="mt-2 text-[8px] font-black uppercase tracking-[0.2em] text-gray-500">
        {label}
      </p>
    </div>
  );
}

function CareerMetric({
  label,
  value,
  description,
}: {
  label: string;
  value: string | number;
  description: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-[#07101D]/65 p-5 sm:p-6">
      <p className="text-[9px] font-black uppercase tracking-[0.18em] text-white/30">
        {label}
      </p>

      <p className="mt-3 text-3xl font-black tracking-[-0.045em] text-white">
        {value}
      </p>

      <p className="mt-3 text-xs leading-6 text-white/30">
        {description}
      </p>
    </div>
  );
}

function SlamCard({
  label,
  value,
  code,
}: {
  label: string;
  value: number;
  code: string;
}) {
  return (
    <div className="group rounded-[1.75rem] border border-white/10 bg-[#07101D]/60 p-5 transition hover:border-lime-300/20 hover:bg-lime-300/[0.025] sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <span className="font-mono text-[9px] font-black uppercase tracking-[0.2em] text-lime-300/70">
          {code}
        </span>

        <Trophy className="size-4 text-white/20 transition group-hover:text-lime-300/65" />
      </div>

      <p className="mt-8 text-5xl font-black tracking-[-0.06em] text-white">
        {formatNumber(
          value,
        )}
      </p>

      <p className="mt-3 text-sm font-semibold text-white/65">
        {label}
      </p>

      <p className="mt-1 text-[9px] uppercase tracking-[0.16em] text-white/25">
        Singles titles
      </p>
    </div>
  );
}


function PassportItem({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-[#07101D]/60 p-5">
      <p className="text-[8px] font-black uppercase tracking-[0.18em] text-white/25">
        {label}
      </p>

      <p className="mt-3 text-lg font-semibold leading-7 text-white/75">
        {value}
      </p>
    </div>
  );
}

function ProfileIndexLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <a
      href={href}
      className="shrink-0 rounded-full border border-white/10 bg-white/[0.025] px-4 py-2 font-mono text-[7px] font-black uppercase tracking-[0.17em] text-white/42 outline-none transition hover:border-lime-300/35 hover:bg-lime-300/[0.06] hover:text-lime-300 focus-visible:border-lime-300/60 focus-visible:text-lime-300 focus-visible:ring-2 focus-visible:ring-lime-300/20 sm:text-[8px]"
    >
      {label}
    </a>
  );
}