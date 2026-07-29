import {
  CalendarDays,
  Crown,
  Landmark,
  Layers3,
  Route,
  Sparkles,
} from "lucide-react";

const archiveFeatures = [
  {
    icon: Crown,
    title: "Hall of Champions",
    description:
      "Tournament winners and championship records across the Masters era.",
  },
  {
    icon: CalendarDays,
    title: "Tournament Editions",
    description:
      "Season-by-season finals, dates, champions and historical context.",
  },
  {
    icon: Sparkles,
    title: "Iconic Moments",
    description:
      "Matches, rivalries and milestones that shaped every tournament.",
  },
  {
    icon: Route,
    title: "World Tour Journey",
    description:
      "A complete season route connecting all nine Masters destinations.",
  },
  {
    icon: Landmark,
    title: "Tournament History",
    description:
      "Origins, venue transformations and defining historical chapters.",
  },
  {
    icon: Layers3,
    title: "AGE202 Archive",
    description:
      "Apparel and memorabilia linked to tournaments and their champions.",
  },
];

export default function MastersArchivePreview() {
  return (
    <section className="border-t border-white/10 px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
      <div className="mx-auto max-w-[1440px]">
        <div className="relative overflow-hidden rounded-[2.2rem] border border-white/10 bg-[#07101D] p-7 sm:p-10 lg:p-14">
          <div className="pointer-events-none absolute -right-32 -top-32 h-[26rem] w-[26rem] rounded-full bg-[rgba(70,190,255,0.18)] blur-3xl" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:48px_48px]" />

          <div className="relative">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_430px] lg:items-end">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#55C9FF]">
                  Masters 1000 archive
                </p>
                <h2 className="mt-5 max-w-4xl text-4xl font-black uppercase leading-[0.9] tracking-[-0.055em] sm:text-5xl lg:text-6xl">
                  Nine tournaments. One global collection.
                </h2>
              </div>

              <p className="text-sm leading-7 text-white/42 lg:text-right">
                Every tournament shares the same archive architecture, creating
                a consistent journey through history, champions, records,
                editions and iconic moments.
              </p>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {archiveFeatures.map((feature) => {
                const Icon = feature.icon;

                return (
                  <article
                    key={feature.title}
                    className="flex items-start gap-5 rounded-[1.5rem] border border-white/10 bg-black/15 p-6"
                  >
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-[#55C9FF]">
                      <Icon size={18} strokeWidth={1.4} aria-hidden="true" />
                    </span>

                    <div>
                      <h3 className="text-base font-black uppercase tracking-[-0.02em]">
                        {feature.title}
                      </h3>
                      <p className="mt-3 text-xs leading-6 text-white/35">
                        {feature.description}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
