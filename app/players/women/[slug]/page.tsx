import Link from "next/link";
import {
  notFound,
} from "next/navigation";

import {
  cache,
} from "react";

import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  CircleGauge,
  Flag,
  Globe2,
  LibraryBig,
  Medal,
  ShieldCheck,
  Sparkles,
  Trophy,
  UserRound,
} from "lucide-react";

import {
  getAdjacentWomenArchivePlayers,
  getPlayerBySlug,
} from "@/lib/repositories/player.repository";


const getCachedPlayerBySlug =
  cache(
    (
      slug: string,
    ) =>
      getPlayerBySlug(
        slug,
      ),
  );


type WomenPlayerPageProps = {
  params: Promise<{
    slug: string;
  }>;
};


function formatPoints(
  value: number | null | undefined,
): string {
  return value == null
    ? "—"
    : value.toLocaleString(
        "en-US",
      );
}


function movementLabel(
  currentRank: number,
  previousRank: number | null,
): string {
  if (
    previousRank === null
  ) {
    return "New snapshot";
  }

  const movement =
    previousRank -
    currentRank;

  if (
    movement > 0
  ) {
    return `Up ${movement}`;
  }

  if (
    movement < 0
  ) {
    return `Down ${Math.abs(
      movement,
    )}`;
  }

  return "Stable";
}


function countryCodeToIso2(
  countryCode: string | null | undefined,
): string | null {
  if (!countryCode) {
    return null;
  }

  const map:
    Record<
      string,
      string
    > = {
      ARG: "ar",
      AUS: "au",
      AUT: "at",
      BEL: "be",
      BLR: "by",
      BRA: "br",
      BUL: "bg",
      CAN: "ca",
      CHI: "cl",
      CHN: "cn",
      COL: "co",
      CRO: "hr",
      CZE: "cz",
      DEN: "dk",
      EGY: "eg",
      ESP: "es",
      EST: "ee",
      FIN: "fi",
      FRA: "fr",
      GBR: "gb",
      GEO: "ge",
      GER: "de",
      GRE: "gr",
      HUN: "hu",
      IND: "in",
      IRL: "ie",
      ISR: "il",
      ITA: "it",
      JPN: "jp",
      KAZ: "kz",
      KOR: "kr",
      LAT: "lv",
      LTU: "lt",
      LUX: "lu",
      MAR: "ma",
      MEX: "mx",
      NED: "nl",
      NOR: "no",
      NZL: "nz",
      PER: "pe",
      PHI: "ph",
      POL: "pl",
      POR: "pt",
      ROU: "ro",
      RSA: "za",
      RUS: "ru",
      SLO: "si",
      SRB: "rs",
      SUI: "ch",
      SVK: "sk",
      SWE: "se",
      THA: "th",
      TPE: "tw",
      TUN: "tn",
      TUR: "tr",
      UAE: "ae",
      UKR: "ua",
      URU: "uy",
      USA: "us",
      UZB: "uz",
    };

  const normalized =
    countryCode
      .trim()
      .toUpperCase();

  if (
    /^[A-Z]{2}$/.test(
      normalized,
    )
  ) {
    return normalized.toLowerCase();
  }

  return (
    map[normalized] ??
    null
  );
}


function formatDate(
  date:
    | Date
    | null
    | undefined,
): string {
  if (!date) {
    return "—";
  }

  return new Intl.DateTimeFormat(
    "en",
    {
      day:
        "2-digit",

      month:
        "short",

      year:
        "numeric",
    },
  ).format(
    date,
  );
}


export async function generateMetadata({
  params,
}: WomenPlayerPageProps) {
  const {
    slug,
  } =
    await params;

  const player =
    await getCachedPlayerBySlug(
      slug,
    );

  if (
    !player ||
    !player.wtaPlayer
  ) {
    return {
      title:
        "WTA Player not found | AGE202",
    };
  }

  const description =
    player.playerProfile
      ?.biographyShort ??
    player.biography ??
    `Explore the AGE202 WTA Archive dossier dedicated to ${player.name}.`;

  return {
    title:
      `${player.name} | WTA Archive | AGE202`,

    description,

    alternates: {
      canonical:
        `/players/women/${player.slug}`,
    },

    openGraph: {
      title:
        `${player.name} | WTA Archive | AGE202`,

      description,

      type:
        "profile",
    },

    robots: {
      index:
        true,

      follow:
        true,
    },
  };
}


export default async function WomenPlayerPage({
  params,
}: WomenPlayerPageProps) {
  const {
    slug,
  } =
    await params;

  const player =
    await getCachedPlayerBySlug(
      slug,
    );

  if (
    !player ||
    !player.wtaPlayer
  ) {
    notFound();
  }

  const ranking =
    player.wtaPlayer;

  const profile =
    player.playerProfile;

  const adjacent =
    await getAdjacentWomenArchivePlayers(
      ranking.rank,
      player.id,
    );

  const heroImage =
    player.heroImage ??
    player.portraitImage ??
    ranking.imageUrl ??
    null;

  const countryLabel =
    ranking.country ??
    player.country ??
    "International";

  const iso2 =
    countryCodeToIso2(
      ranking.countryCode,
    );

  const profileFacts = [
    {
      label:
        "Current WTA rank",

      value:
        `#${ranking.rank}`,

      icon:
        CircleGauge,
    },

    {
      label:
        "WTA points",

      value:
        formatPoints(
          ranking.points,
        ),

      icon:
        Trophy,
    },

    {
      label:
        "Age",

      value:
        ranking.age?.toString() ??
        "—",

      icon:
        UserRound,
    },

    {
      label:
        "Movement",

      value:
        movementLabel(
          ranking.rank,
          ranking.previousRank,
        ),

      icon:
        Sparkles,
    },

    {
      label:
        "Turned pro",

      value:
        profile?.turnedPro?.toString() ??
        "—",

      icon:
        CalendarDays,
    },

    {
      label:
        "Career high",

      value:
        profile?.careerHigh
          ? `#${profile.careerHigh}`
          : "—",

      icon:
        Medal,
    },
  ];

  const structuredData = {
    "@context":
      "https://schema.org",

    "@type":
      "Person",

    name:
      player.name,

    description:
      profile?.biographyShort ??
      player.biography ??
      `AGE202 WTA Archive dossier dedicated to ${player.name}.`,

    nationality:
      countryLabel,

    image:
      heroImage ??
      undefined,

    birthDate:
      profile?.birthDate
        ? profile.birthDate
            .toISOString()
            .slice(
              0,
              10,
            )
        : undefined,

    knowsAbout: [
      "Tennis",
      "WTA Tour",
      "Women's tennis",
      "Tennis history",
    ],
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#050B18] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              structuredData,
            ).replace(
              /</g,
              "\\u003c",
            ),
        }}
      />


      <section className="relative isolate overflow-hidden border-b border-white/10 bg-[#020611]">
        {heroImage ? (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-35"
            style={{
              backgroundImage:
                `url("${heroImage}")`,
            }}
          />
        ) : null}

        <div className="absolute inset-0 bg-[linear-gradient(90deg,#020611_0%,rgba(2,6,17,.98)_36%,rgba(2,6,17,.74)_64%,#020611_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_24%,rgba(200,255,0,.14),transparent_30%)]" />
        <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(255,255,255,.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.07)_1px,transparent_1px)] [background-size:72px_72px]" />


        <div className="relative mx-auto grid min-h-[720px] w-full max-w-[1560px] items-end gap-12 px-6 pb-16 pt-32 sm:px-10 lg:grid-cols-[1.25fr_.75fr] lg:px-14 lg:pb-20 lg:pt-36">
          <div>
            <Link
              href="/players/women/archive"
              className="mb-8 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-white/45 transition hover:text-[#C8FF00]"
            >
              <ArrowLeft className="h-4 w-4" />

              WTA Archive
            </Link>


            <div className="mb-5 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.24em] text-[#C8FF00]">
              <span className="h-px w-10 bg-[#C8FF00]" />

              Women · Player dossier
            </div>


            <h1 className="max-w-5xl text-[clamp(4rem,9vw,8rem)] font-black uppercase leading-[0.82] tracking-[-0.075em]">
              {
                player.name
              }
            </h1>


            <div className="mt-8 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-[#C8FF00]/30 bg-[#C8FF00]/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-[#C8FF00]">
                WTA #
                {
                  ranking.rank
                }
              </span>

              <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-white/58">
                {iso2 ? (
                  <img
                    src={`https://flagcdn.com/w40/${iso2}.png`}
                    srcSet={`https://flagcdn.com/w80/${iso2}.png 2x`}
                    width="24"
                    height="16"
                    alt={`${countryLabel} flag`}
                    className="h-4 w-6 rounded-[2px] object-cover"
                  />
                ) : (
                  <Flag className="h-3.5 w-3.5" />
                )}

                {
                  countryLabel
                }
              </span>

              <span className="rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-white/45">
                {
                  formatPoints(
                    ranking.points,
                  )
                }{" "}
                pts
              </span>
            </div>


            <p className="mt-8 max-w-2xl text-base leading-8 text-white/62 sm:text-lg">
              {
                profile?.biographyShort ??
                player.biography ??
                `${player.name} is part of the living AGE202 WTA Archive, documenting the players shaping women's professional tennis today.`
              }
            </p>
          </div>


          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {profileFacts
              .slice(
                0,
                4,
              )
              .map(
                (
                  fact,
                ) => {
                  const Icon =
                    fact.icon;

                  return (
                    <div
                      key={
                        fact.label
                      }
                      className="rounded-[22px] border border-white/10 bg-[#07101D]/78 p-5 backdrop-blur-xl"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-[9px] font-black uppercase tracking-[0.16em] text-white/30">
                          {
                            fact.label
                          }
                        </span>

                        <Icon className="h-4 w-4 text-[#C8FF00]" />
                      </div>

                      <div className="mt-3 text-2xl font-black tracking-[-0.04em]">
                        {
                          fact.value
                        }
                      </div>
                    </div>
                  );
                },
              )}
          </div>
        </div>
      </section>


      <nav className="sticky top-0 z-40 border-b border-white/10 bg-[#050B18]/92 px-6 py-3 backdrop-blur-xl sm:px-10 lg:px-14">
        <div className="mx-auto flex max-w-[1560px] items-center gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {[
            [
              "#wta-overview",
              "Overview",
            ],
            [
              "#wta-dossier",
              "Dossier",
            ],
            [
              "#wta-data",
              "WTA data",
            ],
            [
              "#archive-status",
              "Archive",
            ],
          ].map(
            (
              [
                href,
                label,
              ],
            ) => (
              <a
                key={
                  href
                }
                href={
                  href
                }
                className="shrink-0 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-[9px] font-black uppercase tracking-[0.15em] text-white/45 transition hover:border-[#C8FF00]/35 hover:text-[#C8FF00]"
              >
                {
                  label
                }
              </a>
            ),
          )}
        </div>
      </nav>


      <section
        id="wta-overview"
        className="mx-auto w-full max-w-[1560px] px-6 py-20 sm:px-10 lg:px-14 lg:py-28"
      >
        <div className="grid gap-8 lg:grid-cols-[1.1fr_.9fr]">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.22em] text-[#C8FF00]">
              01 · Overview
            </div>

            <h2 className="mt-4 text-4xl font-black uppercase leading-[0.9] tracking-[-0.055em] sm:text-6xl">
              Current
              <span className="block text-[#C8FF00]">
                WTA snapshot.
              </span>
            </h2>

            <p className="mt-6 max-w-2xl text-sm leading-7 text-white/58 sm:text-base">
              AGE202 connects live ranking data with an evolving museum dossier,
              preserving a dated snapshot of the player&apos;s place in the
              contemporary women&apos;s game.
            </p>
          </div>


          <div className="grid gap-3 sm:grid-cols-2">
            {profileFacts.map(
              (
                fact,
              ) => {
                const Icon =
                  fact.icon;

                return (
                  <div
                    key={
                      fact.label
                    }
                    className="rounded-[22px] border border-white/10 bg-[#07101D] p-5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black uppercase tracking-[0.15em] text-white/28">
                        {
                          fact.label
                        }
                      </span>

                      <Icon className="h-4 w-4 text-[#C8FF00]" />
                    </div>

                    <div className="mt-3 text-xl font-black">
                      {
                        fact.value
                      }
                    </div>
                  </div>
                );
              },
            )}
          </div>
        </div>
      </section>


      <section
        id="wta-dossier"
        className="border-y border-white/10 bg-[#030711]"
      >
        <div className="mx-auto grid w-full max-w-[1560px] gap-6 px-6 py-20 sm:px-10 lg:grid-cols-3 lg:px-14 lg:py-28">
          <div className="rounded-[28px] border border-white/10 bg-[#07101D] p-7">
            <BadgeCheck className="h-6 w-6 text-[#C8FF00]" />

            <div className="mt-7 text-[9px] font-black uppercase tracking-[0.18em] text-white/28">
              Identity
            </div>

            <h3 className="mt-2 text-2xl font-black uppercase">
              Player profile
            </h3>

            <dl className="mt-7 space-y-4 text-sm">
              <div className="flex items-center justify-between gap-5 border-b border-white/8 pb-3">
                <dt className="text-white/35">
                  Born
                </dt>

                <dd className="font-semibold text-white/72">
                  {
                    formatDate(
                      profile?.birthDate,
                    )
                  }
                </dd>
              </div>

              <div className="flex items-center justify-between gap-5 border-b border-white/8 pb-3">
                <dt className="text-white/35">
                  Birth place
                </dt>

                <dd className="text-right font-semibold text-white/72">
                  {
                    profile?.birthPlace ??
                    "—"
                  }
                </dd>
              </div>

              <div className="flex items-center justify-between gap-5 border-b border-white/8 pb-3">
                <dt className="text-white/35">
                  Height
                </dt>

                <dd className="font-semibold text-white/72">
                  {
                    profile?.height
                      ? `${profile.height} cm`
                      : "—"
                  }
                </dd>
              </div>

              <div className="flex items-center justify-between gap-5">
                <dt className="text-white/35">
                  Plays
                </dt>

                <dd className="font-semibold text-white/72">
                  {
                    profile?.plays ??
                    "—"
                  }
                </dd>
              </div>
            </dl>
          </div>


          <div className="rounded-[28px] border border-white/10 bg-[#07101D] p-7">
            <ShieldCheck className="h-6 w-6 text-[#C8FF00]" />

            <div className="mt-7 text-[9px] font-black uppercase tracking-[0.18em] text-white/28">
              Career
            </div>

            <h3 className="mt-2 text-2xl font-black uppercase">
              Professional record
            </h3>

            <dl className="mt-7 space-y-4 text-sm">
              <div className="flex items-center justify-between gap-5 border-b border-white/8 pb-3">
                <dt className="text-white/35">
                  Turned pro
                </dt>

                <dd className="font-semibold text-white/72">
                  {
                    profile?.turnedPro ??
                    "—"
                  }
                </dd>
              </div>

              <div className="flex items-center justify-between gap-5 border-b border-white/8 pb-3">
                <dt className="text-white/35">
                  Career high
                </dt>

                <dd className="font-semibold text-white/72">
                  {
                    profile?.careerHigh
                      ? `#${profile.careerHigh}`
                      : "—"
                  }
                </dd>
              </div>

              <div className="flex items-center justify-between gap-5 border-b border-white/8 pb-3">
                <dt className="text-white/35">
                  Grand Slams
                </dt>

                <dd className="font-semibold text-white/72">
                  {
                    profile?.grandSlams ??
                    0
                  }
                </dd>
              </div>

              <div className="flex items-center justify-between gap-5">
                <dt className="text-white/35">
                  Coach
                </dt>

                <dd className="text-right font-semibold text-white/72">
                  {
                    profile?.coach ??
                    "—"
                  }
                </dd>
              </div>
            </dl>
          </div>


          <div className="rounded-[28px] border border-[#C8FF00]/20 bg-[radial-gradient(circle_at_80%_20%,rgba(200,255,0,.12),transparent_32%),#07101D] p-7">
            <LibraryBig className="h-6 w-6 text-[#C8FF00]" />

            <div className="mt-7 text-[9px] font-black uppercase tracking-[0.18em] text-[#C8FF00]">
              AGE202 Archive
            </div>

            <h3 className="mt-2 text-2xl font-black uppercase">
              Museum status
            </h3>

            <p className="mt-6 text-sm leading-7 text-white/55">
              This dossier is connected to the living WTA ranking and can grow
              over time with photographs, stories, results and authenticated
              memorabilia.
            </p>

            <div className="mt-7 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-black/15 p-4">
                <div className="text-2xl font-black">
                  {
                    player._count.artifacts
                  }
                </div>

                <div className="mt-1 text-[9px] font-black uppercase tracking-[0.15em] text-white/25">
                  Artifacts
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/15 p-4">
                <div className="text-2xl font-black text-[#C8FF00]">
                  Active
                </div>

                <div className="mt-1 text-[9px] font-black uppercase tracking-[0.15em] text-white/25">
                  WTA index
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      <section
        id="wta-data"
        className="mx-auto w-full max-w-[1560px] px-6 py-20 sm:px-10 lg:px-14 lg:py-28"
      >
        <div className="rounded-[32px] border border-white/10 bg-[#07101D] p-7 sm:p-9">
          <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C8FF00]">
                03 · WTA data
              </div>

              <h2 className="mt-3 text-4xl font-black uppercase tracking-[-0.05em] sm:text-5xl">
                Live ranking record
              </h2>
            </div>

            <div className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.16em] text-white/28">
              <Globe2 className="h-4 w-4 text-[#C8FF00]" />

              AGE202 WTA snapshot
            </div>
          </div>


          <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-white/8 bg-black/10 p-5">
              <div className="text-[9px] font-black uppercase tracking-[0.15em] text-white/25">
                Current rank
              </div>

              <div className="mt-2 text-3xl font-black text-[#C8FF00]">
                #
                {
                  ranking.rank
                }
              </div>
            </div>

            <div className="rounded-2xl border border-white/8 bg-black/10 p-5">
              <div className="text-[9px] font-black uppercase tracking-[0.15em] text-white/25">
                Previous rank
              </div>

              <div className="mt-2 text-3xl font-black">
                {
                  ranking.previousRank
                    ? `#${ranking.previousRank}`
                    : "—"
                }
              </div>
            </div>

            <div className="rounded-2xl border border-white/8 bg-black/10 p-5">
              <div className="text-[9px] font-black uppercase tracking-[0.15em] text-white/25">
                Points
              </div>

              <div className="mt-2 text-3xl font-black">
                {
                  formatPoints(
                    ranking.points,
                  )
                }
              </div>
            </div>

            <div className="rounded-2xl border border-white/8 bg-black/10 p-5">
              <div className="text-[9px] font-black uppercase tracking-[0.15em] text-white/25">
                Country
              </div>

              <div className="mt-2 text-xl font-black uppercase">
                {
                  ranking.countryCode
                }
              </div>
            </div>
          </div>
        </div>
      </section>


      <section
        id="archive-status"
        className="border-t border-white/10 bg-[#030711]"
      >
        <div className="mx-auto flex w-full max-w-[1560px] flex-col gap-8 px-6 py-16 sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-14">
          <div>
            <div className="text-[9px] font-black uppercase tracking-[0.18em] text-[#C8FF00]">
              Continue exploring
            </div>

            <h2 className="mt-3 text-3xl font-black uppercase tracking-[-0.04em]">
              WTA Archive connections
            </h2>
          </div>


          <div className="flex flex-wrap gap-3">
            {adjacent.previousPlayer ? (
              <Link
                href={`/players/women/${adjacent.previousPlayer.slug}`}
                className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-5 text-[10px] font-black uppercase tracking-[0.14em] text-white/55 transition hover:border-[#C8FF00]/35 hover:text-[#C8FF00]"
              >
                <ArrowLeft className="h-4 w-4" />

                {
                  adjacent.previousPlayer.name
                }
              </Link>
            ) : null}


            <Link
              href="/players/women/archive"
              className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#C8FF00] px-5 text-[10px] font-black uppercase tracking-[0.14em] text-[#050B18] transition hover:bg-white"
            >
              WTA Top 100

              <LibraryBig className="h-4 w-4" />
            </Link>


            {adjacent.nextPlayer ? (
              <Link
                href={`/players/women/${adjacent.nextPlayer.slug}`}
                className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-5 text-[10px] font-black uppercase tracking-[0.14em] text-white/55 transition hover:border-[#C8FF00]/35 hover:text-[#C8FF00]"
              >
                {
                  adjacent.nextPlayer.name
                }

                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}
