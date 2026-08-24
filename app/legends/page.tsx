import Image from "next/image";
import Link from "next/link";

import {
  ArrowRight,
  Crown,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";

import {
  getPublishedLegends,
} from "@/lib/repositories/legend.repository";

export const dynamic =
  "force-dynamic";

function branchLabel(
  gender: "MALE" | "FEMALE",
) {
  return gender === "MALE"
    ? "Men's Legends"
    : "Women's Legends";
}

export default async function LegendsPage() {
  const legends =
    await getPublishedLegends();

  const mensLegends =
    legends.filter(
      (legend) =>
        legend.gender === "MALE",
    );

  const womensLegends =
    legends.filter(
      (legend) =>
        legend.gender === "FEMALE",
    );

  const featured =
    legends.find(
      (legend) =>
        legend.featured,
    ) ??
    legends[0] ??
    null;

  return (
    <main className="min-h-screen bg-[#050B18] text-white">
      <section className="relative isolate min-h-[72svh] overflow-hidden border-b border-white/10">
        <div className="absolute inset-0">
          {featured?.heroImage ? (
            <Image
              src={featured.heroImage}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-center opacity-35"
            />
          ) : null}

          <div className="absolute inset-0 bg-gradient-to-r from-[#050B18] via-[#050B18]/92 to-[#050B18]/35" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050B18] via-transparent to-[#050B18]/55" />
        </div>

        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)",
            backgroundSize:
              "90px 90px",
          }}
        />

        <div className="relative mx-auto flex min-h-[72svh] w-full max-w-7xl items-center px-6 py-24 md:px-8">
          <div className="max-w-5xl">
            <div className="flex items-center gap-4">
              <span className="h-px w-12 bg-lime-300" />

              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-lime-300">
                AGE202 Tennis History
              </p>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
              <p className="text-sm font-black uppercase tracking-[0.38em] text-white">
                THE LEGENDS
              </p>

              <span className="h-1 w-1 rounded-full bg-lime-300" />

              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/45">
                Immortals of the game
              </p>
            </div>

            <h1 className="mt-8 max-w-5xl text-[clamp(3.35rem,8.8vw,8.7rem)] font-black leading-[0.86] tracking-[-0.07em]">
              <span className="block text-white">
                Greatness
              </span>

              <span className="block text-white/25">
                never retires.
              </span>
            </h1>

            <p className="mt-8 max-w-2xl text-base leading-8 text-gray-400 md:text-lg">
              A permanent hall devoted to the
              men and women who changed tennis
              forever — their careers, titles,
              rivalries, defining images and
              lasting impact on the sport.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href="#mens-legends"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-lime-300 px-5 text-sm font-black text-[#050B18] transition hover:bg-lime-200"
              >
                Men&apos;s Legends
                <ArrowRight className="size-4" />
              </a>

              <a
                href="#womens-legends"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-5 text-sm font-semibold text-white/70 transition hover:border-white/25 hover:bg-white/[0.07] hover:text-white"
              >
                Women&apos;s Legends
                <ArrowRight className="size-4" />
              </a>
            </div>

            <div className="mt-14 grid max-w-3xl grid-cols-2 border-y border-white/10 sm:grid-cols-4">
              <HeroStat
                value={legends.length}
                label="Legends"
              />

              <HeroStat
                value={mensLegends.length}
                label="Men"
              />

              <HeroStat
                value={womensLegends.length}
                label="Women"
              />

              <HeroStat
                value={legends.reduce(
                  (
                    total,
                    legend,
                  ) =>
                    total +
                    legend.grandSlams,
                  0,
                )}
                label="Grand Slams"
              />
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#050B18] to-transparent" />
      </section>

      <LegendBranch
        id="mens-legends"
        eyebrow="Men's branch"
        title="Men's Legends"
        description="Champions whose achievements, rivalries and playing identities defined generations of men's tennis."
        legends={mensLegends}
      />

      <LegendBranch
        id="womens-legends"
        eyebrow="Women's branch"
        title="Women's Legends"
        description="Icons whose careers reshaped women's tennis and left a permanent mark on the history of the sport."
        legends={womensLegends}
      />

      <section className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-8 md:py-28">
          <div className="relative overflow-hidden rounded-[2rem] border border-lime-300/15 bg-gradient-to-br from-lime-300/[0.08] via-white/[0.025] to-transparent p-7 sm:p-10">
            <div className="flex max-w-3xl items-center gap-3 text-lime-300">
              <Crown className="size-5" />

              <p className="text-[10px] font-black uppercase tracking-[0.3em]">
                The Hall keeps growing
              </p>
            </div>

            <h2 className="mt-5 max-w-4xl text-4xl font-black leading-[0.95] tracking-[-0.055em] sm:text-6xl">
              Tennis history has no final chapter.
            </h2>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/45 sm:text-base">
              New legends can be added from the
              AGE202 Museum CMS and appear here
              automatically once published.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

function LegendBranch({
  id,
  eyebrow,
  title,
  description,
  legends,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  legends: Awaited<
    ReturnType<
      typeof getPublishedLegends
    >
  >;
}) {
  return (
    <section
      id={id}
      className="border-b border-white/10"
    >
      <div className="mx-auto max-w-7xl px-6 py-20 md:px-8 md:py-28">
        <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3">
              <span className="h-px w-9 bg-lime-300" />

              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-lime-300">
                {eyebrow}
              </p>
            </div>

            <h2 className="mt-5 text-5xl font-black tracking-[-0.06em] sm:text-7xl">
              {title}
            </h2>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/40 sm:text-base">
              {description}
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-white/40">
            <Users className="size-4 text-lime-300/70" />
            {legends.length}{" "}
            {legends.length === 1
              ? "legend"
              : "legends"}
          </div>
        </div>

        {legends.length > 0 ? (
          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {legends.map(
              (legend) => (
                <LegendCard
                  key={legend.id}
                  legend={legend}
                />
              ),
            )}
          </div>
        ) : (
          <div className="mt-12 grid min-h-72 place-items-center rounded-[2rem] border border-dashed border-white/10 bg-white/[0.015] p-8 text-center">
            <div>
              <Crown className="mx-auto size-10 text-lime-300/25" />

              <h3 className="mt-5 text-xl font-semibold text-white">
                No published legends yet
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-white/35">
                Profiles will appear here
                automatically when they are
                published from the AGE202 Museum
                CMS.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function LegendCard({
  legend,
}: {
  legend: Awaited<
    ReturnType<
      typeof getPublishedLegends
    >
  >[number];
}) {
  const image =
    legend.portraitImage ??
    legend.heroImage ??
    legend.images[0]?.url ??
    null;

  return (
    <Link
      href={`/legends/${legend.slug}`}
      className="group overflow-hidden rounded-[2rem] border border-white/10 bg-[#07101D] transition duration-300 hover:-translate-y-1 hover:border-lime-300/25"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[#08111F]">
        {image ? (
          <Image
            src={image}
            alt={legend.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition duration-700 group-hover:scale-[1.035]"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center">
            <Crown className="size-12 text-lime-300/20" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#050B18] via-[#050B18]/10 to-transparent" />

        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          {legend.featured ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-lime-300/20 bg-lime-300/15 px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.16em] text-lime-200 backdrop-blur">
              <Sparkles className="size-3" />
              Featured
            </span>
          ) : null}

          {legend.era ? (
            <span className="rounded-full border border-white/10 bg-black/35 px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.16em] text-white/65 backdrop-blur">
              {legend.era}
            </span>
          ) : null}
        </div>

        <div className="absolute inset-x-5 bottom-5">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-lime-300/75">
            {legend.nationality ??
              branchLabel(
                legend.gender,
              )}
          </p>

          <h3 className="mt-2 text-3xl font-black tracking-[-0.045em] text-white">
            {legend.name}
          </h3>

          {legend.nickname ? (
            <p className="mt-1 text-sm text-white/45">
              “{legend.nickname}”
            </p>
          ) : null}
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <div className="grid grid-cols-3 border-y border-white/10 py-4 text-center">
          <CardStat
            value={legend.grandSlams}
            label="Slams"
          />

          <CardStat
            value={legend.careerTitles}
            label="Titles"
          />

          <CardStat
            value={
              legend.weeksAtNo1 > 0
                ? legend.weeksAtNo1
                : "—"
            }
            label="No.1 weeks"
          />
        </div>

        <div className="mt-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-white/35">
            <Trophy className="size-4 text-lime-300/60" />
            Explore the legacy
          </div>

          <ArrowRight className="size-4 text-white/30 transition group-hover:translate-x-1 group-hover:text-lime-300" />
        </div>
      </div>
    </Link>
  );
}

function HeroStat({
  value,
  label,
}: {
  value: string | number;
  label: string;
}) {
  return (
    <div className="border-white/10 px-3 py-6 odd:border-r sm:border-r sm:px-4 sm:odd:border-r sm:first:pl-0 sm:last:border-r-0 sm:last:pr-0">
      <p className="text-2xl font-black tracking-[-0.04em] text-white">
        {value}
      </p>

      <p className="mt-2 text-[8px] font-black uppercase tracking-[0.2em] text-gray-500">
        {label}
      </p>
    </div>
  );
}

function CardStat({
  value,
  label,
}: {
  value: string | number;
  label: string;
}) {
  return (
    <div className="border-r border-white/10 px-2 last:border-r-0">
      <p className="text-lg font-black text-white">
        {value}
      </p>

      <p className="mt-1 text-[7px] font-black uppercase tracking-[0.16em] text-white/30">
        {label}
      </p>
    </div>
  );
}