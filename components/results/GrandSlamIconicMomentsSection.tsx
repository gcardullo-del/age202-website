import {
  CalendarDays,
  Camera,
  Medal,
  Sparkles,
} from "lucide-react";

import type {
  GrandSlamSlug,
} from "@/lib/data/grand-slams";

import {
  getMuseumTournamentBySlug,
} from "@/lib/services/museum/tournament.service";

type GrandSlamIconicMomentsSectionProps = {
  slug: GrandSlamSlug;
  cmsSlug?: string;
};

function safeBackgroundImage(
  imageUrl: string,
): string {
  const safeUrl =
    imageUrl.replaceAll('"', '\\"');

  return `linear-gradient(180deg, rgba(2,6,17,0.06) 0%, rgba(2,6,17,0.28) 44%, rgba(2,6,17,0.96) 100%), url("${safeUrl}")`;
}

function formatMomentYear(
  year: number | null,
  momentDate: Date | null,
): string {
  if (year !== null) {
    return String(year);
  }

  if (momentDate) {
    return String(
      momentDate.getUTCFullYear(),
    );
  }

  return "—";
}

export default async function GrandSlamIconicMomentsSection({
  slug,
  cmsSlug,
}: GrandSlamIconicMomentsSectionProps) {
  const tournament =
    await getMuseumTournamentBySlug(
      cmsSlug ?? slug,
    );

  if (
    !tournament ||
    tournament.iconicMoments.length === 0
  ) {
    return null;
  }

  const tournamentName =
    tournament.shortName?.trim() ||
    tournament.name;

  const moments =
    [...tournament.iconicMoments].sort(
      (a, b) => {
        if (
          a.featured !==
          b.featured
        ) {
          return a.featured
            ? -1
            : 1;
        }

        if (
          a.sortOrder !==
          b.sortOrder
        ) {
          return (
            a.sortOrder -
            b.sortOrder
          );
        }

        return (
          (a.year ?? 9999) -
          (b.year ?? 9999)
        );
      },
    );

  const featuredMoment =
    moments.find(
      (moment) =>
        moment.featured,
    ) ??
    moments[0];

  const secondaryMoments =
    moments.filter(
      (moment) =>
        moment.id !==
        featuredMoment.id,
    );

  const featuredYear =
    formatMomentYear(
      featuredMoment.year,
      featuredMoment.momentDate,
    );

  const hasSecondaryMoments =
    secondaryMoments.length > 0;

  const primarySecondaryMoments =
    secondaryMoments.slice(
      0,
      3,
    );

  const additionalMoments =
    secondaryMoments.slice(3);

  return (
    <section
      id="moments"
      className="relative scroll-mt-24 overflow-hidden border-t border-white/10 px-5 py-20 sm:px-8 lg:px-12 lg:py-28"
    >
      <div className="pointer-events-none absolute -left-48 top-24 h-[34rem] w-[34rem] rounded-full bg-[var(--tournament-glow)] opacity-25 blur-3xl" />

      <div className="pointer-events-none absolute -right-8 top-12 hidden select-none font-mono text-[16rem] font-black leading-none tracking-[-0.1em] text-white/[0.018] xl:block">
        MOMENTS
      </div>

      <div className="relative mx-auto w-full max-w-[1440px]">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_430px] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-3">
              <span className="h-px w-10 bg-[var(--tournament-primary)]" />

              <p className="font-mono text-[9px] font-black uppercase tracking-[0.24em] text-[var(--tournament-primary)]">
                Iconic moments
              </p>
            </div>

            <h2 className="mt-6 max-w-5xl text-4xl font-black uppercase leading-[0.88] tracking-[-0.06em] sm:text-5xl lg:text-7xl">
              Moments that became part of {tournamentName}.
            </h2>
          </div>

          <p className="text-sm leading-7 text-white/42 lg:text-right">
            Landmark matches, turning points and unforgettable scenes preserved
            in the AGE202 Grand Slam archive.
          </p>
        </div>

        <div
          className={`mt-12 grid gap-5 ${
            hasSecondaryMoments
              ? "xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.65fr)]"
              : "grid-cols-1"
          }`}
        >
          <article
            className={`group relative overflow-hidden rounded-[2.35rem] border border-white/10 bg-[#07101D] ${
              featuredMoment.imageUrl
                ? hasSecondaryMoments
                  ? "min-h-[650px]"
                  : "min-h-[680px]"
                : hasSecondaryMoments
                  ? "min-h-[520px]"
                  : "min-h-[600px]"
            }`}
          >
            {featuredMoment.imageUrl ? (
              <>
                <div
                  className="absolute inset-0 bg-cover bg-center transition duration-1000 group-hover:scale-[1.025]"
                  style={{
                    backgroundImage:
                      safeBackgroundImage(
                        featuredMoment.imageUrl,
                      ),
                  }}
                  role="img"
                  aria-label={
                    featuredMoment.title
                  }
                />

                <div
                  className={`absolute inset-0 ${
                    hasSecondaryMoments
                      ? "bg-[linear-gradient(100deg,rgba(2,6,17,0.94)_0%,rgba(2,6,17,0.54)_50%,rgba(2,6,17,0.16)_100%)]"
                      : "bg-[linear-gradient(90deg,rgba(2,6,17,0.96)_0%,rgba(2,6,17,0.62)_42%,rgba(2,6,17,0.18)_76%,rgba(2,6,17,0.1)_100%)]"
                  }`}
                />
              </>
            ) : (
              <>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_24%,var(--tournament-glow),transparent_36%)] opacity-35" />

                <div
                  className={`pointer-events-none absolute -bottom-16 select-none font-black leading-none tracking-[-0.09em] text-white/[0.025] ${
                    hasSecondaryMoments
                      ? "-right-8 text-[16rem] sm:text-[22rem]"
                      : "right-4 text-[18rem] sm:text-[26rem] lg:text-[34rem]"
                  }`}
                >
                  {featuredYear}
                </div>
              </>
            )}

            <div
              className={`relative flex flex-col justify-between p-7 sm:p-10 lg:p-14 ${
                featuredMoment.imageUrl
                  ? hasSecondaryMoments
                    ? "min-h-[650px]"
                    : "min-h-[680px]"
                  : hasSecondaryMoments
                    ? "min-h-[520px]"
                    : "min-h-[600px]"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-5">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#050B18]/58 px-4 py-2 font-mono text-[7px] font-black uppercase tracking-[0.18em] text-white/66 backdrop-blur-xl">
                  <Sparkles
                    size={12}
                    className="text-[var(--tournament-primary)]"
                    aria-hidden="true"
                  />

                  Featured moment
                </span>

                <span className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-[#050B18]/58 text-[var(--tournament-primary)] backdrop-blur-xl">
                  <Medal
                    size={19}
                    strokeWidth={1.4}
                    aria-hidden="true"
                  />
                </span>
              </div>

              <div
                className={
                  hasSecondaryMoments
                    ? "max-w-4xl"
                    : "max-w-5xl"
                }
              >
                <div className="flex flex-wrap items-center gap-4">
                  <span
                    className={`font-black leading-none tracking-[-0.07em] text-[var(--tournament-primary)] ${
                      hasSecondaryMoments
                        ? "text-6xl sm:text-7xl"
                        : "text-7xl sm:text-8xl lg:text-9xl"
                    }`}
                  >
                    {featuredYear}
                  </span>

                  {featuredMoment.subtitle ? (
                    <span className="max-w-xl border-l border-white/12 pl-4 text-sm font-semibold uppercase leading-6 tracking-[-0.01em] text-white/55">
                      {featuredMoment.subtitle}
                    </span>
                  ) : null}
                </div>

                <h3
                  className={`mt-6 font-black uppercase leading-[0.88] tracking-[-0.06em] ${
                    hasSecondaryMoments
                      ? "text-4xl sm:text-6xl lg:text-7xl"
                      : "max-w-5xl text-4xl sm:text-6xl lg:text-8xl"
                  }`}
                >
                  {featuredMoment.title}
                </h3>

                {featuredMoment.description ? (
                  <p
                    className={`mt-6 text-sm leading-7 text-white/52 sm:text-base sm:leading-8 ${
                      hasSecondaryMoments
                        ? "max-w-3xl"
                        : "max-w-4xl"
                    }`}
                  >
                    {featuredMoment.description}
                  </p>
                ) : null}
              </div>
            </div>
          </article>

          {hasSecondaryMoments ? (
            <div
              className={`grid gap-5 ${
                primarySecondaryMoments.length === 1
                  ? "grid-rows-1"
                  : primarySecondaryMoments.length === 2
                    ? "grid-rows-2"
                    : "grid-rows-3"
              }`}
            >
              {primarySecondaryMoments.map(
                (
                  moment,
                  index,
                ) => {
                  const year =
                    formatMomentYear(
                      moment.year,
                      moment.momentDate,
                    );

                  return (
                    <article
                      key={moment.id}
                      className="group relative min-h-[205px] overflow-hidden rounded-[1.8rem] border border-white/10 bg-[#07101D]"
                    >
                      {moment.imageUrl ? (
                        <>
                          <div
                            className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-[1.035]"
                            style={{
                              backgroundImage:
                                safeBackgroundImage(
                                  moment.imageUrl,
                                ),
                            }}
                            role="img"
                            aria-label={
                              moment.title
                            }
                          />

                          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,17,0.96)_0%,rgba(2,6,17,0.72)_54%,rgba(2,6,17,0.22)_100%)]" />
                        </>
                      ) : (
                        <>
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_28%,var(--tournament-glow),transparent_38%)] opacity-22" />

                          <div className="pointer-events-none absolute -bottom-8 -right-4 select-none text-[8rem] font-black leading-none tracking-[-0.08em] text-white/[0.025]">
                            {year}
                          </div>
                        </>
                      )}

                      <div className="relative flex h-full min-h-[205px] items-end justify-between gap-6 p-6">
                        <div className="max-w-[78%]">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-[7px] font-black uppercase tracking-[0.18em] text-white/28">
                              Moment{" "}
                              {String(
                                index + 2,
                              ).padStart(
                                2,
                                "0",
                              )}
                            </span>

                            <span className="h-px w-6 bg-[var(--tournament-primary)]/45" />
                          </div>

                          <p className="mt-4 text-3xl font-black leading-none tracking-[-0.05em] text-[var(--tournament-primary)]">
                            {year}
                          </p>

                          <h3 className="mt-3 text-xl font-black uppercase leading-[0.95] tracking-[-0.035em]">
                            {moment.title}
                          </h3>

                          {moment.subtitle ? (
                            <p className="mt-3 line-clamp-1 text-xs font-semibold leading-5 text-white/45">
                              {moment.subtitle}
                            </p>
                          ) : null}
                        </div>

                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-[#050B18]/55 text-[var(--tournament-primary)] backdrop-blur-lg">
                          {moment.imageUrl ? (
                            <Camera
                              size={15}
                              strokeWidth={1.4}
                              aria-hidden="true"
                            />
                          ) : (
                            <CalendarDays
                              size={15}
                              strokeWidth={1.4}
                              aria-hidden="true"
                            />
                          )}
                        </span>
                      </div>
                    </article>
                  );
                },
              )}
            </div>
          ) : null}
        </div>

        {additionalMoments.length > 0 ? (
          <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {additionalMoments.map(
              (
                moment,
                index,
              ) => {
                const year =
                  formatMomentYear(
                    moment.year,
                    moment.momentDate,
                  );

                return (
                  <article
                    key={moment.id}
                    className="group relative min-h-[320px] overflow-hidden rounded-[1.8rem] border border-white/10 bg-[#07101D] p-7 transition hover:-translate-y-1 hover:border-[var(--tournament-primary)]"
                  >
                    {moment.imageUrl ? (
                      <>
                        <div
                          className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-[1.035]"
                          style={{
                            backgroundImage:
                              safeBackgroundImage(
                                moment.imageUrl,
                              ),
                          }}
                          role="img"
                          aria-label={
                            moment.title
                          }
                        />

                        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,17,0.28)_0%,rgba(2,6,17,0.7)_52%,rgba(2,6,17,0.98)_100%)]" />
                      </>
                    ) : (
                      <>
                        <div className="pointer-events-none absolute -right-4 -top-8 text-[8rem] font-black leading-none tracking-[-0.08em] text-white/[0.025]">
                          {String(
                            index + 5,
                          ).padStart(
                            2,
                            "0",
                          )}
                        </div>

                        <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-[var(--tournament-glow)] opacity-20 blur-3xl" />
                      </>
                    )}

                    <div className="relative flex h-full min-h-[264px] flex-col">
                      <div className="flex items-start justify-between gap-4">
                        <span className="text-4xl font-black tracking-[-0.055em] text-[var(--tournament-primary)]">
                          {year}
                        </span>

                        <span className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-[#050B18]/55 text-[var(--tournament-primary)] backdrop-blur-lg">
                          {moment.imageUrl ? (
                            <Camera
                              size={15}
                              strokeWidth={1.4}
                              aria-hidden="true"
                            />
                          ) : (
                            <Medal
                              size={15}
                              strokeWidth={1.4}
                              aria-hidden="true"
                            />
                          )}
                        </span>
                      </div>

                      <h3 className="mt-7 text-2xl font-black uppercase leading-[0.95] tracking-[-0.04em]">
                        {moment.title}
                      </h3>

                      {moment.subtitle ? (
                        <p className="mt-4 text-xs font-semibold leading-6 text-white/48">
                          {moment.subtitle}
                        </p>
                      ) : null}

                      {moment.description ? (
                        <p className="mt-auto pt-7 text-xs leading-6 text-white/36">
                          {moment.description}
                        </p>
                      ) : null}
                    </div>
                  </article>
                );
              },
            )}
          </div>
        ) : null}

        <div className="mt-6 flex flex-col gap-4 rounded-[1.6rem] border border-white/10 bg-white/[0.02] p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-[var(--tournament-primary)]">
              <Sparkles
                size={15}
                strokeWidth={1.4}
                aria-hidden="true"
              />
            </span>

            <div>
              <h3 className="text-sm font-black uppercase tracking-[-0.015em]">
                Tournament moments
              </h3>

              <p className="mt-2 text-xs leading-6 text-white/34">
                Iconic moments are curated directly through Tournament Studio.
              </p>
            </div>
          </div>

          <span className="shrink-0 rounded-full border border-white/10 bg-white/[0.025] px-4 py-2 font-mono text-[7px] font-black uppercase tracking-[0.17em] text-[var(--tournament-primary)]">
            Tournament Studio
          </span>
        </div>
      </div>
    </section>
  );
}