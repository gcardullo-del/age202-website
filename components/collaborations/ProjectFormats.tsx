import {
  ArrowUpRight,
  Building2,
  Megaphone,
  Palette,
  Sparkles,
} from "lucide-react";


const projectFormats = [
  {
    number: "01",
    title: "Archive Stories",
    eyebrow: "Editorial heritage",
    text: "Editorial features built around a garment, athlete, tournament or design era.",
    icon: Building2,
  },
  {
    number: "02",
    title: "Limited Capsules",
    eyebrow: "Design collaboration",
    text: "Small, purposeful releases that connect contemporary design with tennis heritage.",
    icon: Palette,
  },
  {
    number: "03",
    title: "Exhibitions & Pop-ups",
    eyebrow: "Physical experience",
    text: "Physical or digital displays designed for clubs, events and cultural spaces.",
    icon: Sparkles,
  },
  {
    number: "04",
    title: "Campaign Content",
    eyebrow: "Visual storytelling",
    text: "Photography, short films and social narratives with a strong archival point of view.",
    icon: Megaphone,
  },
];


export default function ProjectFormats() {
  return (
    <section className="relative overflow-hidden border-y border-white/10 bg-white/[0.025]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_84%_20%,rgba(204,255,0,.07),transparent_28%)]" />

      <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-[#ccff00]" />

              <p className="text-[10px] font-black uppercase tracking-[.3em] text-[#ccff00]">
                Project formats
              </p>
            </div>

            <h2 className="mt-6 max-w-xl text-4xl font-black uppercase leading-[.9] tracking-[-.05em] sm:text-6xl">
              Ideas made
              <span className="block text-[#ccff00]">
                tangible.
              </span>
            </h2>
          </div>

          <div className="lg:pb-1">
            <p className="max-w-2xl text-base leading-8 text-white/55">
              Every collaboration can take a different shape, but each one
              should add genuine value to the story and future of tennis.
            </p>

            <p className="mt-5 text-[8px] font-black uppercase tracking-[.22em] text-white/25">
              AGE202 · Collaboration formats archive
            </p>
          </div>
        </div>


        <div className="mt-16 grid gap-4 lg:grid-cols-2">
          {projectFormats.map(
            (
              format,
            ) => {
              const Icon =
                format.icon;

              return (
                <article
                  key={format.number}
                  className="group relative overflow-hidden rounded-[1.8rem] border border-white/10 bg-[#08101f] p-6 transition duration-500 hover:-translate-y-1 hover:border-[#ccff00]/35 sm:p-8"
                >
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(204,255,0,.055),transparent_48%)] opacity-0 transition duration-500 group-hover:opacity-100" />

                  <div className="relative flex items-start justify-between gap-6">
                    <div className="grid h-14 w-14 place-items-center rounded-2xl border border-[#ccff00]/20 bg-[#ccff00]/[.06]">
                      <Icon
                        className="h-6 w-6 text-[#ccff00]"
                        strokeWidth={1.5}
                      />
                    </div>

                    <span className="font-mono text-[10px] font-black tracking-[.22em] text-[#ccff00]/70">
                      {format.number}
                    </span>
                  </div>


                  <div className="relative mt-10">
                    <p className="text-[8px] font-black uppercase tracking-[.24em] text-[#ccff00]">
                      {format.eyebrow}
                    </p>

                    <h3 className="mt-4 text-2xl font-black uppercase leading-[.92] tracking-[-.035em] sm:text-3xl">
                      {format.title}
                    </h3>

                    <p className="mt-5 max-w-xl text-sm leading-7 text-white/48">
                      {format.text}
                    </p>
                  </div>


                  <div className="relative mt-10 flex items-center justify-between border-t border-white/10 pt-5">
                    <span className="text-[8px] font-black uppercase tracking-[.2em] text-white/22">
                      Collaboration format
                    </span>

                    <div className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-white/25 transition duration-300 group-hover:border-[#ccff00]/35 group-hover:bg-[#ccff00] group-hover:text-[#050B18]">
                      <ArrowUpRight
                        size={16}
                      />
                    </div>
                  </div>
                </article>
              );
            },
          )}
        </div>


        <div className="mt-10 flex flex-wrap items-center justify-between gap-5">
          <p className="text-[8px] font-black uppercase tracking-[.22em] text-white/25">
            Four formats · One partnership language
          </p>

          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-[#ccff00]/40" />

            <span className="text-[8px] font-black uppercase tracking-[.22em] text-[#ccff00]">
              Culture · Craft · Legacy
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}