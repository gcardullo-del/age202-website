import Link from "next/link";

import {
  ArrowRight,
  Crown,
  Mars,
  Plus,
  Sparkles,
  Venus,
} from "lucide-react";

import {
  getLegends,
} from "@/lib/repositories/legend.repository";

function formatStatus(status: string) {
  return status
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase(),
    );
}

function LegendCard({
  legend,
}: {
  legend: Awaited<
    ReturnType<typeof getLegends>
  >[number];
}) {
  return (
    <Link
      href={`/admin/legends/${legend.id}`}
      className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.025] p-6 transition hover:border-lime-300/25 hover:bg-white/[0.04]"
    >
      <div
        aria-hidden="true"
        className="absolute -right-16 -top-16 size-40 rounded-full bg-lime-300/[0.04] blur-3xl transition group-hover:bg-lime-300/[0.08]"
      />

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-lime-300/65">
              {legend.era ??
                "Tennis history"}
            </p>

            <h3 className="mt-2 text-xl font-semibold tracking-[-0.025em] text-white">
              {legend.name}
            </h3>

            <p className="mt-2 text-sm text-white/40">
              {legend.nationality ??
                "Nationality not set"}
            </p>
          </div>

          <span
            className={[
              "rounded-full border px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.16em]",
              legend.status ===
              "PUBLISHED"
                ? "border-emerald-300/20 bg-emerald-300/[0.07] text-emerald-200"
                : legend.status ===
                    "ARCHIVED"
                  ? "border-white/10 bg-white/[0.04] text-white/35"
                  : "border-amber-300/20 bg-amber-300/[0.07] text-amber-200",
            ].join(" ")}
          >
            {formatStatus(
              legend.status,
            )}
          </span>
        </div>

        <div className="mt-7 grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-white/[0.07] bg-black/10 px-4 py-3">
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/25">
              Slams
            </p>
            <p className="mt-1 text-lg font-semibold text-white/80">
              {legend.grandSlams}
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-black/10 px-4 py-3">
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/25">
              Titles
            </p>
            <p className="mt-1 text-lg font-semibold text-white/80">
              {legend.careerTitles}
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-black/10 px-4 py-3">
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/25">
              No.1
            </p>
            <p className="mt-1 text-lg font-semibold text-white/80">
              {legend.weeksAtNo1}
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-white/[0.07] pt-5">
          <p className="text-xs text-white/30">
            {legend.milestones.length}{" "}
            milestone
            {legend.milestones.length ===
            1
              ? ""
              : "s"}
          </p>

          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-lime-300">
            Edit legend
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}

function EmptyBranch({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[28px] border border-dashed border-white/10 bg-white/[0.015] px-6 py-12 text-center">
      <Crown className="mx-auto size-8 text-white/15" />

      <h3 className="mt-4 text-lg font-semibold text-white/65">
        {title}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/30">
        {description}
      </p>
    </div>
  );
}

export default async function AdminLegendsPage() {
  const legends = await getLegends();

  const mensLegends = legends.filter(
    (legend) =>
      legend.gender === "MALE",
  );

  const womensLegends = legends.filter(
    (legend) =>
      legend.gender === "FEMALE",
  );

  const published = legends.filter(
    (legend) =>
      legend.status === "PUBLISHED",
  ).length;

  const featured = legends.filter(
    (legend) => legend.featured,
  ).length;

  return (
    <main className="min-h-screen bg-[#050b18] px-5 py-8 text-white sm:px-8 lg:px-12">
      <div className="mx-auto w-full max-w-[1500px]">
        <section className="relative overflow-hidden rounded-[34px] border border-lime-300/15 bg-gradient-to-br from-lime-300/[0.08] via-white/[0.025] to-transparent p-7 sm:p-9">
          <div
            aria-hidden="true"
            className="absolute -right-24 -top-28 size-80 rounded-full bg-lime-300/[0.08] blur-3xl"
          />

          <div className="relative flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-lime-300">
                <Sparkles className="size-4" />
                AGE202 Tennis History
              </div>

              <h1 className="mt-4 text-4xl font-semibold tracking-[-0.045em] sm:text-6xl">
                The Legends
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/45 sm:text-base">
                Build the AGE202 hall of
                tennis immortals. Men&apos;s
                and women&apos;s legends share
                one editorial system while
                remaining completely separate
                from the commercial artifact
                archive.
              </p>
            </div>

            <Link
              href="/admin/legends/new"
              className="inline-flex items-center justify-center gap-2 self-start rounded-full bg-lime-300 px-6 py-3.5 text-sm font-black text-[#050b18] transition hover:bg-lime-200 xl:self-auto"
            >
              <Plus className="size-4" />
              Create Legend
            </Link>
          </div>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[24px] border border-white/10 bg-white/[0.025] p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
              Total legends
            </p>
            <p className="mt-3 text-3xl font-semibold">
              {legends.length}
            </p>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/[0.025] p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
              Men&apos;s
            </p>
            <p className="mt-3 text-3xl font-semibold">
              {mensLegends.length}
            </p>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/[0.025] p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
              Women&apos;s
            </p>
            <p className="mt-3 text-3xl font-semibold">
              {womensLegends.length}
            </p>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/[0.025] p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
              Published / Featured
            </p>
            <p className="mt-3 text-3xl font-semibold">
              {published}
              <span className="text-white/25">
                {" "}/ {featured}
              </span>
            </p>
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-5 flex items-end justify-between gap-5">
            <div>
              <div className="flex items-center gap-2 text-lime-300/75">
                <Mars className="size-4" />
                <p className="text-[10px] font-black uppercase tracking-[0.24em]">
                  Men&apos;s branch
                </p>
              </div>

              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em]">
                Men&apos;s Legends
              </h2>
            </div>

            <span className="text-sm text-white/30">
              {mensLegends.length}{" "}
              legends
            </span>
          </div>

          {mensLegends.length > 0 ? (
            <div className="grid gap-5 lg:grid-cols-2 2xl:grid-cols-3">
              {mensLegends.map(
                (legend) => (
                  <LegendCard
                    key={legend.id}
                    legend={legend}
                  />
                ),
              )}
            </div>
          ) : (
            <EmptyBranch
              title="No men's legends yet"
              description="Rod Laver could be the first name in the AGE202 Men's Legends archive."
            />
          )}
        </section>

        <section className="mt-12 pb-10">
          <div className="mb-5 flex items-end justify-between gap-5">
            <div>
              <div className="flex items-center gap-2 text-lime-300/75">
                <Venus className="size-4" />
                <p className="text-[10px] font-black uppercase tracking-[0.24em]">
                  Women&apos;s branch
                </p>
              </div>

              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em]">
                Women&apos;s Legends
              </h2>
            </div>

            <span className="text-sm text-white/30">
              {womensLegends.length}{" "}
              legends
            </span>
          </div>

          {womensLegends.length > 0 ? (
            <div className="grid gap-5 lg:grid-cols-2 2xl:grid-cols-3">
              {womensLegends.map(
                (legend) => (
                  <LegendCard
                    key={legend.id}
                    legend={legend}
                  />
                ),
              )}
            </div>
          ) : (
            <EmptyBranch
              title="No women's legends yet"
              description="Steffi Graf could inaugurate the AGE202 Women's Legends archive."
            />
          )}
        </section>
      </div>
    </main>
  );
}