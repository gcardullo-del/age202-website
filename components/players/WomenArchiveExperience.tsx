import Link from "next/link";

import {
  ArrowLeft,
  ArrowRight,
  Globe2,
  LibraryBig,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";


export type WomenArchiveEntry = {
  id: string;

  rank: number;
  previousRank: number | null;

  name: string;
  slug: string;

  country: string;
  countryCode: string;

  points: number | null;
  age: number | null;

  imageUrl: string | null;

  hasProfile: boolean;
  href: string | null;
};


type WomenArchiveExperienceProps = {
  players: WomenArchiveEntry[];
};


function formatPoints(
  value: number | null,
): string {
  return value === null
    ? "—"
    : value.toLocaleString(
        "en-US",
      );
}


function movementValue(
  player: WomenArchiveEntry,
): number | null {
  if (
    player.previousRank === null
  ) {
    return null;
  }

  return (
    player.previousRank -
    player.rank
  );
}


function MovementBadge({
  player,
}: {
  player: WomenArchiveEntry;
}) {
  const movement =
    movementValue(
      player,
    );


  if (
    movement === null
  ) {
    return (
      <span className="text-[9px] font-black uppercase tracking-[0.16em] text-white/24">
        New snapshot
      </span>
    );
  }


  if (
    movement > 0
  ) {
    return (
      <span className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.16em] text-[#C8FF00]">
        <TrendingUp className="h-3.5 w-3.5" />
        +{movement}
      </span>
    );
  }


  if (
    movement < 0
  ) {
    return (
      <span className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.16em] text-white/40">
        <TrendingDown className="h-3.5 w-3.5" />
        {movement}
      </span>
    );
  }


  return (
    <span className="text-[9px] font-black uppercase tracking-[0.16em] text-white/24">
      Stable
    </span>
  );
}


const COUNTRY_CODE_TO_ISO2: Record<string, string> = {
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
  ECU: "ec",
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


function getIso2CountryCode(
  countryCode: string,
): string | null {
  const normalized =
    countryCode
      .trim()
      .toUpperCase();

  if (/^[A-Z]{2}$/.test(normalized)) {
    return normalized.toLowerCase();
  }

  return (
    COUNTRY_CODE_TO_ISO2[normalized] ??
    null
  );
}


function CountryCell({
  country,
  countryCode,
}: {
  country: string;
  countryCode: string;
}) {
  const iso2 =
    getIso2CountryCode(
      countryCode,
    );

  return (
    <div className="flex min-w-0 items-center gap-3">
      {iso2 ? (
        <img
          src={`https://flagcdn.com/w40/${iso2}.png`}
          srcSet={`https://flagcdn.com/w80/${iso2}.png 2x`}
          width="28"
          height="20"
          loading="lazy"
          alt={`${country} flag`}
          className="h-[18px] w-7 shrink-0 rounded-[2px] object-cover shadow-[0_0_0_1px_rgba(255,255,255,0.12)]"
        />
      ) : (
        <span
          aria-hidden="true"
          className="grid h-[18px] w-7 shrink-0 place-items-center rounded-[2px] border border-white/10 bg-white/[0.04] text-[8px] font-black uppercase text-white/30"
        >
          {countryCode.slice(0, 2)}
        </span>
      )}

      <div className="min-w-0">
        <div className="truncate text-sm font-semibold text-white/72">
          {country}
        </div>

        <div className="mt-1 text-[9px] font-black uppercase tracking-[0.16em] text-white/25">
          {countryCode}
        </div>
      </div>
    </div>
  );
}


export default function WomenArchiveExperience({
  players,
}: WomenArchiveExperienceProps) {
  const top50 =
    players.filter(
      (
        player,
      ) =>
        player.rank <=
        50,
    );


  const directory =
    players.filter(
      (
        player,
      ) =>
        player.rank >
        50,
    );


  const countries =
    new Set(
      players.map(
        (
          player,
        ) =>
          player.countryCode,
      ),
    ).size;


  const profiles =
    players.filter(
      (
        player,
      ) =>
        player.hasProfile,
    ).length;


  return (
    <main className="w-[100vw] max-w-none overflow-hidden bg-[#050B18] text-white">
      <section className="relative isolate overflow-hidden border-b border-white/10 bg-[#020611]">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#020611_0%,#07101D_58%,#020611_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_20%,rgba(200,255,0,0.14),transparent_28%)]" />
        <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:72px_72px]" />


        <div className="relative w-full max-w-none px-6 pb-20 pt-36 sm:px-10 sm:pt-40 lg:px-12 lg:pb-28 lg:pt-44 xl:px-16">
          <div className="max-w-5xl">
            <div className="mt-4 mb-5 flex items-center gap-7 text-[12px] font-semibold uppercase tracking-[0.3em] text-[#C8FF00]">
              <span className="h-px w-10 bg-[#C8FF00]" />

              Women · Live ranking archive
            </div>


            <h1 className="text-[clamp(4rem,9vw,8rem)] font-black uppercase leading-[0.82] tracking-[-0.075em]">
              WTA
              <span className="block text-[#C8FF00]">
                Archive.
              </span>
            </h1>


            <p className="mt-7 max-w-2xl text-base leading-8 text-white/65 sm:text-lg">
              A living directory of the current WTA Top 100, connecting the
              leading women&apos;s players to AGE202 profiles as the archive grows.
            </p>


            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/players/women"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/[0.05] px-5 text-xs font-black uppercase tracking-[0.12em] text-white transition hover:border-[#C8FF00]/50 hover:text-[#C8FF00]"
              >
                <ArrowLeft className="h-4 w-4" />

                Women
              </Link>


              <Link
                href="/contribute"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#C8FF00] px-5 text-xs font-black uppercase tracking-[0.12em] text-[#050B18] transition hover:bg-white"
              >
                Contribute

                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>


          <div className="mt-14 grid gap-3 sm:grid-cols-3">
            {[
              {
                label:
                  "Players indexed",

                value:
                  players.length,

                icon:
                  Users,
              },

              {
                label:
                  "Countries",

                value:
                  countries,

                icon:
                  Globe2,
              },

              {
                label:
                  "AGE202 profiles",

                value:
                  profiles,

                icon:
                  LibraryBig,
              },
            ].map(
              (
                stat,
              ) => {
                const Icon =
                  stat.icon;

                return (
                  <div
                    key={
                      stat.label
                    }
                    className="rounded-2xl border border-white/10 bg-[#07101D]/75 px-5 py-5 backdrop-blur-xl"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/38">
                        {
                          stat.label
                        }
                      </span>

                      <Icon className="h-4 w-4 text-[#C8FF00]" />
                    </div>

                    <div className="mt-3 text-3xl font-black tracking-[-0.05em]">
                      {
                        stat.value
                      }
                    </div>
                  </div>
                );
              },
            )}
          </div>
        </div>
      </section>


      <section className="w-full max-w-none px-6 py-20 sm:px-10 lg:px-12 xl:px-16 lg:py-28">
        <div className="mb-12 flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-[#C8FF00]">
              01 · Premium profiles
            </div>

            <h2 className="text-4xl font-black uppercase leading-[0.9] tracking-[-0.055em] sm:text-6xl">
              WTA Top 50
            </h2>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/55 sm:text-base">
              The first fifty positions form the premium AGE202 women&apos;s
              archive and connect directly to player profiles when available.
            </p>
          </div>

        </div>


        <div className="w-full overflow-hidden rounded-[30px] border border-white/10 bg-[#07101D] shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
          <div className="hidden grid-cols-[92px_minmax(260px,1.25fr)_minmax(220px,0.95fr)_130px_150px_132px] gap-5 border-b border-white/10 bg-white/[0.015] px-7 py-4 pr-12 text-[9px] font-black uppercase tracking-[0.18em] text-white/30 lg:grid xl:pr-16">
            <span>Rank</span>
            <span>Player</span>
            <span>Nation</span>
            <span>Points</span>
            <span>Movement</span>
            <span className="text-right">
              Profile
            </span>
          </div>


          <div className="divide-y divide-white/[0.07]">
            {top50.map(
              (
                player,
              ) => (
                <div
                  key={
                    player.id
                  }
                  className="grid gap-5 px-5 py-5 transition duration-300 hover:bg-white/[0.025] sm:px-6 lg:grid-cols-[92px_minmax(260px,1.25fr)_minmax(220px,0.95fr)_130px_150px_132px] lg:items-center lg:px-8 lg:pr-12 xl:py-6 xl:pr-16"
                >
                  <div className="flex items-center justify-between lg:block">
                    <span className="text-[9px] font-black uppercase tracking-[0.16em] text-white/25 lg:hidden">
                      Rank
                    </span>

                    <span className="text-3xl font-black tracking-[-0.055em] text-[#C8FF00]">
                      #
                      {
                        player.rank
                      }
                    </span>
                  </div>


                  <div className="min-w-0">
                    <div className="truncate text-lg font-black uppercase tracking-[-0.025em]">
                      {
                        player.name
                      }
                    </div>

                    <div className="mt-1 text-[9px] font-black uppercase tracking-[0.15em] text-white/24">
                      Age{" "}
                      {
                        player.age ??
                        "—"
                      }
                    </div>
                  </div>


                  <div className="flex items-center justify-between lg:block">
                    <span className="text-[9px] font-black uppercase tracking-[0.16em] text-white/25 lg:hidden">
                      Nation
                    </span>

                    <CountryCell
                      country={
                        player.country
                      }
                      countryCode={
                        player.countryCode
                      }
                    />
                  </div>


                  <div className="flex items-center justify-between lg:block">
                    <span className="text-[9px] font-black uppercase tracking-[0.16em] text-white/25 lg:hidden">
                      Points
                    </span>

                    <span className="font-mono text-sm font-semibold text-white/72">
                      {
                        formatPoints(
                          player.points,
                        )
                      }
                    </span>
                  </div>


                  <div className="flex items-center justify-between lg:block">
                    <span className="text-[9px] font-black uppercase tracking-[0.16em] text-white/25 lg:hidden">
                      Move
                    </span>

                    <MovementBadge
                      player={
                        player
                      }
                    />
                  </div>


                  <div className="flex justify-end">
                    {player.href ? (
                      <Link
                        href={
                          player.href
                        }
                        className="group inline-flex min-h-10 min-w-[96px] items-center justify-center gap-2 rounded-full border border-[#C8FF00]/30 bg-[#C8FF00]/[0.08] px-4 text-[9px] font-black uppercase tracking-[0.14em] text-[#C8FF00] transition duration-300 hover:border-[#C8FF00] hover:bg-[#C8FF00] hover:text-[#050B18]"
                      >
                        Open

                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                      </Link>
                    ) : (
                      <span className="rounded-full border border-white/10 px-4 py-2 text-[9px] font-black uppercase tracking-[0.12em] text-white/24">
                        Indexed
                      </span>
                    )}
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>


      <section className="border-y border-white/10 bg-[#030711]">
        <div className="w-full max-w-none px-6 py-20 sm:px-10 lg:px-12 xl:px-16 lg:py-28">
          <div className="mb-10 flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <div className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-[#C8FF00]">
                02 · Ranking directory
              </div>

              <h2 className="text-4xl font-black uppercase leading-[0.9] tracking-[-0.055em] sm:text-6xl">
                Positions 51–100
              </h2>
            </div>

            <p className="max-w-xl text-sm leading-7 text-white/48">
              The wider WTA directory stays lighter and more compact, keeping the
              full Top 100 visible without competing with the premium profile area.
            </p>
          </div>


          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {directory.map(
              (
                player,
              ) => (
                <article
                  key={
                    player.id
                  }
                  className="group relative overflow-hidden rounded-[24px] border border-white/10 bg-[#07101D] p-5 transition duration-300 hover:-translate-y-0.5 hover:border-[#C8FF00]/25"
                >
                  <div className="pointer-events-none absolute right-3 top-1 text-6xl font-black tracking-[-0.08em] text-white/[0.025]">
                    {
                      player.rank
                    }
                  </div>


                  <div className="relative">
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-xs font-black text-[#C8FF00]">
                        #
                        {
                          player.rank
                        }
                      </span>

                      <MovementBadge
                        player={
                          player
                        }
                      />
                    </div>


                    <h3 className="mt-4 truncate text-lg font-black uppercase tracking-[-0.025em]">
                      {
                        player.name
                      }
                    </h3>


                    <div className="mt-3">
                      <CountryCell
                        country={
                          player.country
                        }
                        countryCode={
                          player.countryCode
                        }
                      />
                    </div>


                    <div className="mt-6 flex items-end justify-between gap-5 border-t border-white/[0.07] pt-4">
                      <div>
                        <div className="font-mono text-sm font-semibold text-white/72">
                          {
                            formatPoints(
                              player.points,
                            )
                          }
                        </div>

                        <div className="mt-1 text-[9px] uppercase tracking-[0.14em] text-white/25">
                          WTA points
                        </div>
                      </div>


                      {player.href ? (
                        <Link
                          href={
                            player.href
                          }
                          className="group/link inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.14em] text-[#C8FF00]"
                        >
                          Profile

                          <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover/link:translate-x-0.5" />
                        </Link>
                      ) : (
                        <span className="text-[9px] font-black uppercase tracking-[0.14em] text-white/22">
                          Directory
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              ),
            )}
          </div>
        </div>
      </section>
    </main>
  );
}


