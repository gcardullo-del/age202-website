import type {
   Metadata,
} from "next";

import Image from "next/image";
import Link from "next/link";

import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  ChevronDown,
  CircleDot,
  Crown,
  Landmark,
  Layers3,
  MapPin,
  Sparkles,
  Trophy,
} from "lucide-react";

import {
  getGrandSlamHref,
  grandSlamList,
  type GrandSlamData,
} from "@/lib/data/grand-slams";

const SITE_URL =
  "https://www.age202.com";

const PAGE_URL =
  `${SITE_URL}/results/grand-slams`;

const PAGE_TITLE =
  "Grand Slam Tennis: Tournaments, History & Champions";

const PAGE_DESCRIPTION =
  "Explore Grand Slam tennis through the Australian Open, Roland Garros, Wimbledon and the US Open, with tournament history, champions, editions, records and iconic moments.";

export const metadata: Metadata = {
  title:
    PAGE_TITLE,

  description:
    PAGE_DESCRIPTION,

  alternates: {
    canonical:
      "/results/grand-slams",
  },

  keywords: [
    "Grand Slam tennis",
    "Grand Slam tournaments",
    "Grand Slam history",
    "Grand Slam champions",
    "Grand Slam winners",
    "tennis Grand Slam",
    "Australian Open",
    "Roland Garros",
    "French Open",
    "Wimbledon",
    "US Open",
    "tennis majors",
    "tennis history",
    "tennis champions",
    "AGE202",
  ],

  openGraph: {
    type:
      "website",

    url:
      "/results/grand-slams",

    title:
      `${PAGE_TITLE} | AGE202`,

    description:
      PAGE_DESCRIPTION,

    siteName:
      "AGE202",

    locale:
      "en_US",
  },

  twitter: {
    card:
      "summary_large_image",

    title:
      `${PAGE_TITLE} | AGE202`,

    description:
      PAGE_DESCRIPTION,
  },

  robots: {
    index:
      true,

    follow:
      true,

    googleBot: {
      index:
        true,

      follow:
        true,

      "max-image-preview":
        "large",

      "max-snippet":
        -1,

      "max-video-preview":
        -1,
    },
  },

  category:
    "Grand Slam tennis",
};

function serializeJsonLd(
  value: unknown,
) {
  return JSON.stringify(
    value,
  ).replace(
    /</g,
    "\\u003c",
  );
}

function getAbsoluteUrl(
  href: string,
) {
  return new URL(
    href,
    SITE_URL,
  ).toString();
}

export default function GrandSlamsPage() {
  const structuredData = {
    "@context":
      "https://schema.org",

    "@graph": [
      {
        "@type":
          "CollectionPage",

        "@id":
          `${PAGE_URL}#collectionpage`,

        url:
          PAGE_URL,

        name:
          "Grand Slam Tennis Archive",

        headline:
          PAGE_TITLE,

        description:
          PAGE_DESCRIPTION,

        isPartOf: {
          "@type":
            "WebSite",

          "@id":
            `${SITE_URL}/#website`,

          url:
            SITE_URL,

          name:
            "AGE202",

          alternateName:
            "AGE202 Digital Tennis Museum",
        },

        mainEntity: {
          "@id":
            `${PAGE_URL}#grand-slams`,
        },

        breadcrumb: {
          "@id":
            `${PAGE_URL}#breadcrumb`,
        },
      },

      {
        "@type":
          "ItemList",

        "@id":
          `${PAGE_URL}#grand-slams`,

        name:
          "The Four Grand Slam Tennis Tournaments",

        numberOfItems:
          grandSlamList.length,

        itemListOrder:
          "https://schema.org/ItemListOrderAscending",

        itemListElement:
          grandSlamList.map(
            (
              tournament,
              index,
            ) => ({
              "@type":
                "ListItem",

              position:
                index + 1,

              name:
                tournament.name,

              url:
                getAbsoluteUrl(
                  getGrandSlamHref(
                    tournament.slug,
                  ),
                ),
            }),
          ),
      },

      {
        "@type":
          "BreadcrumbList",

        "@id":
          `${PAGE_URL}#breadcrumb`,

        itemListElement: [
          {
            "@type":
              "ListItem",

            position:
              1,

            name:
              "AGE202",

            item:
              SITE_URL,
          },

          {
            "@type":
              "ListItem",

            position:
              2,

            name:
              "Results",

            item:
              `${SITE_URL}/results`,
          },

          {
            "@type":
              "ListItem",

            position:
              3,

            name:
              "Grand Slams",

            item:
              PAGE_URL,
          },
        ],
      },
    ],
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#050B18] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            serializeJsonLd(
              structuredData,
            ),
        }}
      />

      <GrandSlamsHero />

      <GrandSlamSeason />

      <GrandSlamMuseum />

      <GrandSlamArchive />

      <BackToResults />
    </main>
  );
}

/* =========================================================
   HERO
========================================================= */

function GrandSlamsHero() {
  return (
    <section className="relative isolate min-h-[760px] overflow-hidden border-b border-white/[0.07] bg-[#030812] lg:min-h-[820px]">
      {/* Full-bleed hero image */}

      <div className="absolute inset-0">
        <Image
          src="/images/grand-slams/grand-slams-hero.png"
          alt="The four Grand Slam tennis trophies representing the Australian Open, Roland Garros, Wimbledon and US Open"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center lg:object-[58%_center]"
        />
      </div>

      {/* Dark overlay for text readability */}

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,17,0.98)_0%,rgba(2,6,17,0.92)_20%,rgba(2,6,17,0.66)_36%,rgba(2,6,17,0.22)_53%,rgba(2,6,17,0.08)_72%,rgba(2,6,17,0.20)_100%)]" />

      {/* Top / bottom cinematic shading */}

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,17,0.58)_0%,rgba(2,6,17,0.04)_25%,rgba(2,6,17,0.02)_62%,rgba(2,6,17,0.90)_100%)]" />

      {/* Blue museum atmosphere */}

      <div className="pointer-events-none absolute -left-40 top-1/3 h-[600px] w-[600px] rounded-full bg-[#2B9BFF]/[0.07] blur-[160px]" />

      {/* Fine museum grid */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.025] [background-image:linear-gradient(rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.10)_1px,transparent_1px)] [background-size:84px_84px]"
      />

      <div className="relative z-10 mx-auto flex min-h-[760px] max-w-[1500px] flex-col px-6 pb-10 pt-8 sm:px-9 lg:min-h-[820px] lg:px-12 lg:pb-12 lg:pt-10">
        {/* Top */}

        <div className="flex flex-wrap items-center justify-between gap-5">
          <Link
            href="/results"
            className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-black/30 px-4 py-2.5 font-mono text-[8px] font-black uppercase tracking-[0.2em] text-white/48 backdrop-blur-xl transition hover:border-[#4EB3FF]/50 hover:text-[#4EB3FF]"
          >
            <ArrowLeft
              size={13}
              aria-hidden="true"
            />

            Results Archive
          </Link>

          <div className="inline-flex items-center gap-3 rounded-full border border-white/[0.07] bg-black/20 px-4 py-2 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-[#4EB3FF] shadow-[0_0_16px_#4EB3FF]" />

            <span className="font-mono text-[8px] font-black uppercase tracking-[0.24em] text-white/40">
              AGE202 · Grand Slam Museum
            </span>
          </div>
        </div>

        {/* Hero copy */}

        <div className="my-auto max-w-[720px] py-16 sm:py-20 lg:py-24">
          <div className="flex items-center gap-4">
            <span className="h-px w-12 bg-[#4EB3FF] shadow-[0_0_14px_rgba(78,179,255,0.55)]" />

            <p className="font-mono text-[8px] font-black uppercase tracking-[0.3em] text-[#4EB3FF] sm:text-[9px]">
              The four majors
            </p>
          </div>

          <h1 className="mt-8 text-[clamp(4.5rem,9vw,9.5rem)] font-black uppercase leading-[0.73] tracking-[-0.09em] text-white">
            Grand

            <span className="block text-white/62">
              Slams
            </span>
          </h1>

          <p className="mt-9 max-w-2xl text-xl font-black uppercase leading-[1.02] tracking-[-0.035em] text-white/42 sm:text-2xl lg:text-[2rem]">
            Four tournaments.
            <br />
            One history of greatness.
          </p>

          <p className="mt-7 max-w-xl text-sm leading-7 text-white/58 sm:text-base sm:leading-8">
            From Melbourne to Paris, London and New York,
            explore the four championships that have defined
            the highest level of tennis across generations.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#grand-slam-museum"
              className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#4EB3FF] px-6 py-3 text-[9px] font-black uppercase tracking-[0.2em] text-[#04101E] shadow-[0_16px_45px_rgba(43,155,255,0.22)] transition hover:-translate-y-0.5"
            >
              Enter the museum

              <ArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </a>

            <a
              href="#grand-slam-season"
              className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full border border-white/15 bg-black/25 px-6 py-3 text-[9px] font-black uppercase tracking-[0.2em] text-white/62 backdrop-blur-md transition hover:border-white/30 hover:text-white"
            >
              Follow the season

              <ChevronDown
                size={14}
                aria-hidden="true"
              />
            </a>
          </div>
        </div>

        {/* Grand Slam navigation strip */}

        <div className="grid gap-px overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/10 shadow-[0_20px_70px_rgba(0,0,0,0.30)] backdrop-blur-xl sm:grid-cols-2 lg:grid-cols-4">
          <HeroStripItem
            number="01"
            label="Australian Open"
            value="Melbourne"
          />

          <HeroStripItem
            number="02"
            label="Roland Garros"
            value="Paris"
          />

          <HeroStripItem
            number="03"
            label="Wimbledon"
            value="London"
          />

          <HeroStripItem
            number="04"
            label="US Open"
            value="New York"
          />
        </div>
      </div>

      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,transparent,#4EB3FF,transparent)] shadow-[0_0_22px_rgba(78,179,255,0.55)]"
      />
    </section>
  );
}
type HeroStripItemProps = {
  number: string;
  label: string;
  value: string;
};
function HeroStripItem({
  number,
  label,
  value,
}: HeroStripItemProps) {
  return (
    <div className="flex min-h-[88px] items-center gap-4 bg-[#050C18]/94 px-5 py-4 sm:px-6">
      <span className="font-mono text-[8px] font-black text-[#4EB3FF]">
        {number}
      </span>

      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.08em] text-white/66">
          {label}
        </p>

        <p className="mt-1 font-mono text-[7px] uppercase tracking-[0.16em] text-white/24">
          {value}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   SEASON TIMELINE
========================================================= */

function GrandSlamSeason() {
  return (
    <section
      id="grand-slam-season"
      className="relative scroll-mt-24 overflow-hidden border-b border-white/[0.07] bg-[#050B18] px-5 py-24 sm:px-8 lg:px-12 lg:py-32"
    >
      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[900px] -translate-x-1/2 rounded-full bg-[#4EB3FF]/[0.05] blur-[150px]" />

      <div className="relative mx-auto max-w-[1480px]">
        <SectionIntro
          eyebrow="The Grand Slam season"
          title="Four chapters. One calendar."
          description="The majors create four distinct peaks across the tennis season, each shaped by its city, surface and tradition."
        />

        <div className="relative mt-16">
          <div
            aria-hidden="true"
            className="absolute left-[8%] right-[8%] top-[31px] hidden h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent)] lg:block"
          />

          <div className="grid gap-5 lg:grid-cols-4">
            {grandSlamList.map(
              (
                tournament,
                index,
              ) => (
                <SeasonCard
                  key={
                    tournament.slug
                  }
                  tournament={
                    tournament
                  }
                  index={
                    index
                  }
                />
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

type SeasonCardProps = {
  tournament:
    GrandSlamData;

  index:
    number;
};

function SeasonCard({
  tournament,
  index,
}: SeasonCardProps) {
  return (
    <Link
      href={getGrandSlamHref(
        tournament.slug,
      )}
      className="group relative"
    >
      <div className="relative z-10 mb-6 flex items-center gap-4 lg:block">
        <span
          className="grid h-16 w-16 shrink-0 place-items-center rounded-full border-4 border-[#050B18] text-[10px] font-black shadow-[0_0_0_1px_rgba(255,255,255,0.08)]"
          style={{
            color:
              tournament.colors.primary,

            backgroundColor:
              tournament.colors.secondary,
          }}
        >
          0{index + 1}
        </span>

        <div className="lg:mt-5">
          <p className="font-mono text-[7px] font-black uppercase tracking-[0.2em] text-white/25">
            {tournament.calendar}
          </p>
        </div>
      </div>

      <article className="relative min-h-[300px] overflow-hidden rounded-[1.8rem] border border-white/[0.08] bg-[#07101D] p-6 transition duration-300 group-hover:-translate-y-1 group-hover:border-white/20">
        <div
          aria-hidden="true"
          className="absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-25 blur-3xl"
          style={{
            backgroundColor:
              tournament.colors.glow,
          }}
        />

        <span className="pointer-events-none absolute -bottom-4 -right-2 select-none text-[7rem] font-black uppercase leading-none tracking-[-0.1em] text-white/[0.025]">
          {tournament.visualCode}
        </span>

        <div className="relative">
          <p
            className="font-mono text-[7px] font-black uppercase tracking-[0.2em]"
            style={{
              color:
                tournament.colors.primary,
            }}
          >
            {tournament.city} · {tournament.country}
          </p>

          <h3 className="mt-6 text-2xl font-black uppercase leading-[0.9] tracking-[-0.045em] text-white">
            {tournament.name}
          </h3>

          <p className="mt-4 text-xs leading-6 text-white/35">
            {tournament.headline}
          </p>

          <div className="mt-8 flex items-center gap-2 border-t border-white/[0.07] pt-5">
            <CircleDot
              size={12}
              style={{
                color:
                  tournament.colors.primary,
              }}
              aria-hidden="true"
            />

            <span className="font-mono text-[7px] uppercase tracking-[0.18em] text-white/30">
              {tournament.surface}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

/* =========================================================
   GRAND SLAM MUSEUM
========================================================= */

function GrandSlamMuseum() {
  return (
    <section
      id="grand-slam-museum"
      className="scroll-mt-24 bg-[#030812] px-5 py-24 sm:px-8 lg:px-12 lg:py-32"
    >
      <div className="mx-auto max-w-[1480px]">
        <SectionIntro
          eyebrow="Tournament galleries"
          title="Enter the four Grand Slams"
          description="Each tournament becomes its own museum gallery, combining history, champions, editions, records and the identity of the event."
        />

        <div className="mt-16 space-y-7 lg:mt-20">
          {grandSlamList.map(
            (
              tournament,
              index,
            ) => (
              <MuseumTournamentPanel
                key={
                  tournament.slug
                }
                tournament={
                  tournament
                }
                index={
                  index
                }
              />
            ),
          )}
        </div>
      </div>
    </section>
  );
}

type MuseumTournamentPanelProps = {
  tournament:
    GrandSlamData;

  index:
    number;
};

function getTournamentCityImage(
  tournament: GrandSlamData,
) {
  const imageBySlug: Record<string, string> = {
    "australian-open":
      "/images/grand-slams/melbourne.jpg",

    "roland-garros":
      "/images/grand-slams/paris.jpg",

    wimbledon:
      "/images/grand-slams/london.jpg",

    "us-open":
      "/images/grand-slams/new-york.jpg",
  };

  return (
    imageBySlug[tournament.slug] ??
    "/images/grand-slams/grand-slams-hero.png"
  );
}

function MuseumTournamentPanel({
  tournament,
  index,
}: MuseumTournamentPanelProps) {
  const reverse =
    index % 2 === 1;

  const cityImage =
    getTournamentCityImage(
      tournament,
    );

  return (
    <Link
      href={getGrandSlamHref(
        tournament.slug,
      )}
      className="group block"
    >
      <article className="relative min-h-[520px] overflow-hidden rounded-[2.4rem] border border-white/[0.08] bg-[#07101D] transition duration-500 group-hover:-translate-y-1 group-hover:border-white/20">
        <Image
          src={cityImage}
          alt={`${tournament.city} cityscape for the ${tournament.name}`}
          fill
          sizes="(max-width: 1024px) 100vw, 1480px"
          className="object-cover object-center transition duration-[1400ms] ease-out group-hover:scale-[1.035]"
        />

        <div
          aria-hidden="true"
          className={[
            "pointer-events-none absolute inset-0",
            reverse
              ? "bg-[linear-gradient(90deg,rgba(3,8,18,0.28)_0%,rgba(3,8,18,0.48)_32%,rgba(3,8,18,0.88)_68%,rgba(3,8,18,0.98)_100%)]"
              : "bg-[linear-gradient(90deg,rgba(3,8,18,0.98)_0%,rgba(3,8,18,0.88)_32%,rgba(3,8,18,0.48)_68%,rgba(3,8,18,0.28)_100%)]",
          ].join(" ")}
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(3,8,18,0.20)_0%,rgba(3,8,18,0.04)_42%,rgba(3,8,18,0.70)_100%)]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background: `linear-gradient(
              135deg,
              ${tournament.colors.primary}14 0%,
              transparent 32%,
              transparent 72%,
              ${tournament.colors.primary}10 100%
            )`,
          }}
        />

        <div
          aria-hidden="true"
          className={[
            "pointer-events-none absolute top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full opacity-20 blur-[130px]",
            reverse
              ? "-left-36"
              : "-right-36",
          ].join(" ")}
          style={{
            backgroundColor:
              tournament.colors.glow,
          }}
        />

        <span
          aria-hidden="true"
          className={[
            "pointer-events-none absolute bottom-[-0.08em] select-none text-[14rem] font-black uppercase leading-none tracking-[-0.11em] text-white/[0.03] sm:text-[18rem] lg:text-[22rem]",
            reverse
              ? "-left-8"
              : "-right-8",
          ].join(" ")}
        >
          {tournament.visualCode}
        </span>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.02] [background-image:linear-gradient(rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.10)_1px,transparent_1px)] [background-size:56px_56px]"
        />

        <div
          className={[
            "relative grid min-h-[520px] gap-10 p-7 sm:p-10 lg:grid-cols-2 lg:items-center lg:p-14 xl:p-16",
            reverse
              ? "lg:[&>*:first-child]:order-2"
              : "",
          ].join(" ")}
        >
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span
                className="rounded-full border px-3 py-2 font-mono text-[7px] font-black uppercase tracking-[0.2em] backdrop-blur-md"
                style={{
                  borderColor:
                    `${tournament.colors.primary}45`,

                  color:
                    tournament.colors.primary,

                  backgroundColor:
                    "rgba(3,8,18,0.42)",
                }}
              >
                Grand Slam 0{index + 1}
              </span>

              <span className="rounded-full border border-white/[0.08] bg-black/25 px-3 py-2 font-mono text-[7px] uppercase tracking-[0.18em] text-white/42 backdrop-blur-md">
                {tournament.city} · {tournament.country}
              </span>
            </div>

            <h2 className="mt-8 max-w-3xl text-[clamp(3rem,5.8vw,6.2rem)] font-black uppercase leading-[0.79] tracking-[-0.075em] text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.45)]">
              {tournament.name}
            </h2>

            <p className="mt-7 max-w-2xl text-lg font-black uppercase leading-[1.08] tracking-[-0.03em] text-white/52 drop-shadow-[0_8px_24px_rgba(0,0,0,0.45)] sm:text-xl">
              {tournament.headline}
            </p>

            <p className="mt-6 max-w-2xl text-sm leading-7 text-white/62 drop-shadow-[0_6px_20px_rgba(0,0,0,0.40)]">
              {tournament.introduction}
            </p>

            <div className="mt-9 inline-flex items-center gap-3 text-[8px] font-black uppercase tracking-[0.2em] text-white/66">
              Enter tournament archive

              <span
                className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-black/30 backdrop-blur-md transition duration-300 group-hover:translate-x-2"
                style={{
                  color:
                    tournament.colors.primary,
                }}
              >
                <ArrowRight
                  size={15}
                  aria-hidden="true"
                />
              </span>
            </div>
          </div>

          <div
            className={[
              "flex",
              reverse
                ? "lg:justify-start"
                : "lg:justify-end",
            ].join(" ")}
          >
            <div className="w-full max-w-[470px] overflow-hidden rounded-[2rem] border border-white/12 bg-[#030812]/70 shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-xl">
              <div className="flex items-start justify-between gap-5 border-b border-white/[0.08] p-6 sm:p-7">
                <div>
                  <p
                    className="font-mono text-[7px] font-black uppercase tracking-[0.22em]"
                    style={{
                      color:
                        tournament.colors.primary,
                    }}
                  >
                    Museum dossier
                  </p>

                  <p className="mt-3 text-lg font-black uppercase tracking-[-0.03em] text-white/82">
                    {tournament.code}
                  </p>
                </div>

                <span
                  className="grid h-11 w-11 place-items-center rounded-2xl border"
                  style={{
                    borderColor:
                      `${tournament.colors.primary}40`,

                    color:
                      tournament.colors.primary,

                    backgroundColor:
                      `${tournament.colors.primary}12`,
                  }}
                >
                  <Trophy
                    size={18}
                    strokeWidth={1.4}
                    aria-hidden="true"
                  />
                </span>
              </div>

              <dl className="p-6 sm:p-7">
                <DossierRow
                  icon={
                    CircleDot
                  }
                  label="Surface"
                  value={
                    tournament.surface
                  }
                  accent={
                    tournament.colors.primary
                  }
                />

                <DossierRow
                  icon={
                    Landmark
                  }
                  label="Founded"
                  value={
                    tournament.founded
                  }
                  accent={
                    tournament.colors.primary
                  }
                />

                <DossierRow
                  icon={
                    MapPin
                  }
                  label="Location"
                  value={`${tournament.city}, ${tournament.country}`}
                  accent={
                    tournament.colors.primary
                  }
                />

                <DossierRow
                  icon={
                    CalendarDays
                  }
                  label="Calendar"
                  value={
                    tournament.calendar
                  }
                  accent={
                    tournament.colors.primary
                  }
                />
              </dl>

              <div className="grid grid-cols-3 gap-px border-t border-white/[0.08] bg-white/[0.07]">
                <ArchiveMiniFeature
                  icon={
                    Crown
                  }
                  label="Champions"
                />

                <ArchiveMiniFeature
                  icon={
                    CalendarDays
                  }
                  label="Editions"
                />

                <ArchiveMiniFeature
                  icon={
                    Sparkles
                  }
                  label="History"
                />
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

type DossierRowProps = {
  icon:
    typeof Trophy;

  label:
    string;

  value:
    string;

  accent:
    string;
};

function DossierRow({
  icon: Icon,
  label,
  value,
  accent,
}: DossierRowProps) {
  return (
    <div className="flex items-center justify-between gap-5 border-b border-white/[0.07] py-4 first:pt-0 last:border-b-0 last:pb-0">
      <dt className="inline-flex items-center gap-3 font-mono text-[7px] uppercase tracking-[0.18em] text-white/26">
        <Icon
          size={12}
          style={{
            color:
              accent,
          }}
          aria-hidden="true"
        />

        {label}
      </dt>

      <dd className="max-w-[230px] text-right text-[10px] font-black uppercase leading-5 tracking-[0.03em] text-white/58">
        {value}
      </dd>
    </div>
  );
}

type ArchiveMiniFeatureProps = {
  icon:
    typeof Trophy;

  label:
    string;
};

function ArchiveMiniFeature({
  icon: Icon,
  label,
}: ArchiveMiniFeatureProps) {
  return (
    <div className="bg-black/25 px-3 py-5 text-center">
      <Icon
        size={13}
        className="mx-auto text-white/28"
        strokeWidth={1.4}
        aria-hidden="true"
      />

      <span className="mt-2 block font-mono text-[6px] font-black uppercase tracking-[0.16em] text-white/24">
        {label}
      </span>
    </div>
  );
}

/* =========================================================
   ARCHIVE EXPERIENCE
========================================================= */

function GrandSlamArchive() {
  const features = [
    {
      number:
        "01",

      icon:
        Crown,

      title:
        "Champions Archive",

      description:
        "Explore tournament winners and championship records across the history of each major.",
    },

    {
      number:
        "02",

      icon:
        CalendarDays,

      title:
        "Tournament Editions",

      description:
        "Follow the majors season by season through finals, champions and historical context.",
    },

    {
      number:
        "03",

      icon:
        Sparkles,

      title:
        "Iconic Moments",

      description:
        "Revisit matches, rivalries and milestones that became part of the history of tennis.",
    },

    {
      number:
        "04",

      icon:
        Layers3,

      title:
        "Museum Connections",

      description:
        "Discover AGE202 artifacts, apparel and memorabilia connected to tournaments and champions.",
    },
  ];

  return (
    <section className="relative overflow-hidden border-y border-white/[0.07] bg-[#07101D] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
      <div className="pointer-events-none absolute -right-40 top-0 h-[600px] w-[600px] rounded-full bg-[#4EB3FF]/[0.07] blur-[160px]" />

      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-16 -left-10 hidden select-none text-[19rem] font-black uppercase leading-none tracking-[-0.11em] text-white/[0.018] lg:block"
      >
        4
      </span>

      <div className="relative mx-auto max-w-[1480px]">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:items-end">
          <div>
            <div className="flex items-center gap-4">
              <span className="h-px w-10 bg-[#4EB3FF]" />

              <p className="font-mono text-[8px] font-black uppercase tracking-[0.28em] text-[#4EB3FF]">
                The archive
              </p>
            </div>

            <h2 className="mt-7 max-w-3xl text-[clamp(3.5rem,7vw,7rem)] font-black uppercase leading-[0.78] tracking-[-0.075em]">
              More than

              <span className="block text-white/28">
                results.
              </span>
            </h2>
          </div>

          <div className="lg:pb-2">
            <p className="max-w-2xl text-base leading-8 text-white/42 lg:ml-auto">
              Every Grand Slam gallery is designed as a historical
              journey through the tournament, its champions, its
              defining editions and the objects that connect tennis
              history to the AGE202 museum.
            </p>
          </div>
        </div>

        <div className="mt-16 grid gap-4 md:grid-cols-2">
          {features.map(
            (
              feature,
            ) => {
              const Icon =
                feature.icon;

              return (
                <article
                  key={
                    feature.title
                  }
                  className="group relative overflow-hidden rounded-[1.8rem] border border-white/[0.08] bg-black/15 p-6 transition duration-300 hover:border-[#4EB3FF]/30 sm:p-7"
                >
                  <span className="pointer-events-none absolute -right-2 -top-5 text-[6rem] font-black tracking-[-0.08em] text-white/[0.025]">
                    {feature.number}
                  </span>

                  <div className="relative flex items-start gap-5">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.025] text-[#4EB3FF]">
                      <Icon
                        size={18}
                        strokeWidth={1.4}
                        aria-hidden="true"
                      />
                    </span>

                    <div>
                      <p className="font-mono text-[7px] font-black uppercase tracking-[0.2em] text-white/22">
                        Archive {feature.number}
                      </p>

                      <h3 className="mt-3 text-lg font-black uppercase tracking-[-0.025em] text-white/78">
                        {feature.title}
                      </h3>

                      <p className="mt-4 max-w-xl text-xs leading-6 text-white/34">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </article>
              );
            },
          )}
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   BACK TO RESULTS
========================================================= */

function BackToResults() {
  return (
    <section className="bg-[#030812] px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
      <div className="mx-auto max-w-[1480px]">
        <Link
          href="/results"
          className="group relative flex min-h-[220px] items-center justify-between gap-8 overflow-hidden rounded-[2.2rem] border border-white/[0.08] bg-[#07101D] p-7 transition duration-300 hover:border-[#4EB3FF]/35 sm:p-9 lg:p-12"
        >
          <div className="absolute -right-32 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-[#4EB3FF]/[0.08] blur-[120px]" />

          <div className="relative">
            <p className="font-mono text-[8px] font-black uppercase tracking-[0.22em] text-[#4EB3FF]">
              AGE202 Results Archive
            </p>

            <h2 className="mt-5 max-w-3xl text-3xl font-black uppercase leading-[0.9] tracking-[-0.055em] sm:text-4xl lg:text-5xl">
              Continue through

              <span className="block text-white/30">
                the tournament museum.
              </span>
            </h2>
          </div>

          <span className="relative grid h-14 w-14 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.025] text-[#4EB3FF] transition duration-300 group-hover:translate-x-2">
            <ArrowRight
              size={20}
              aria-hidden="true"
            />
          </span>
        </Link>
      </div>
    </section>
  );
}

/* =========================================================
   SHARED SECTION HEADER
========================================================= */

type SectionIntroProps = {
  eyebrow:
    string;

  title:
    string;

  description:
    string;
};

function SectionIntro({
  eyebrow,
  title,
  description,
}: SectionIntroProps) {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_470px] lg:items-end">
      <div>
        <div className="flex items-center gap-4">
          <span className="h-px w-10 bg-[#4EB3FF]" />

          <p className="font-mono text-[8px] font-black uppercase tracking-[0.28em] text-[#4EB3FF]">
            {eyebrow}
          </p>
        </div>

        <h2 className="mt-7 max-w-5xl text-[clamp(3rem,6vw,6rem)] font-black uppercase leading-[0.82] tracking-[-0.07em]">
          {title}
        </h2>
      </div>

      <p className="text-sm leading-7 text-white/38 lg:text-right">
        {description}
      </p>
    </div>
  );
}