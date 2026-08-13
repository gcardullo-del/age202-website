import {
  Camera,
  Landmark,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";


const partnershipAreas = [
  {
    number: "01",
    title: "Tennis Brands",
    eyebrow: "Product & heritage",
    description:
      "Editorial projects with brands whose archives, design language and sporting history deserve a museum-quality presentation.",
    icon: Trophy,
  },
  {
    number: "02",
    title: "Clubs & Events",
    eyebrow: "Community & court",
    description:
      "Collaborations with tennis clubs, academies and tournaments to document local stories and create memorable cultural activations.",
    icon: Landmark,
  },
  {
    number: "03",
    title: "Creative Studios",
    eyebrow: "Image & storytelling",
    description:
      "Partnerships with photographers, filmmakers, designers and writers who can reinterpret the visual culture of tennis.",
    icon: Camera,
  },
  {
    number: "04",
    title: "Collectors",
    eyebrow: "Objects & provenance",
    description:
      "Curated projects with collectors who want to preserve, contextualise and share significant apparel or memorabilia.",
    icon: Users,
  },
];


export default function PartnershipAreas() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_14%,rgba(59,130,246,.055),transparent_30%),radial-gradient(circle_at_88%_18%,rgba(204,255,0,.065),transparent_28%)]" />

      <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-[#ccff00]" />

              <p className="text-[10px] font-black uppercase tracking-[.3em] text-[#ccff00]">
                Partnership areas
              </p>
            </div>

            <h2 className="mt-6 max-w-xl text-4xl font-black uppercase leading-[.9] tracking-[-.05em] sm:text-6xl">
              Different expertise.
              <span className="block text-[#ccff00]">
                One shared court.
              </span>
            </h2>
          </div>

          <div className="lg:pb-1">
            <p className="max-w-2xl text-base leading-8 text-white/55">
              AGE202 collaborates with people and organisations that can add
              real cultural value to the archive through expertise, access,
              creativity and provenance.
            </p>

            <div className="mt-6 flex items-center gap-3 text-[8px] font-black uppercase tracking-[.22em] text-white/25">
              <Sparkles
                size={13}
                className="text-[#ccff00]"
              />
              Four areas · One partnership language
            </div>
          </div>
        </div>


        <div className="mt-16 grid gap-4 md:grid-cols-2">
          {partnershipAreas.map(
            (
              area,
            ) => {
              const Icon =
                area.icon;

              return (
                <article
                  key={area.number}
                  className="group relative min-h-[330px] overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,.035),rgba(255,255,255,.015))] p-7 transition duration-500 hover:-translate-y-1 hover:border-[#ccff00]/35 sm:p-8"
                >
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(204,255,0,.085),transparent_32%)] opacity-70 transition duration-500 group-hover:opacity-100" />

                  <div className="relative flex h-full flex-col">
                    <div className="flex items-start justify-between gap-5">
                      <div>
                        <p className="text-[8px] font-black uppercase tracking-[.24em] text-[#ccff00]">
                          {area.eyebrow}
                        </p>

                        <p className="mt-2 text-[8px] font-bold uppercase tracking-[.18em] text-white/25">
                          AGE202 Partnership Area
                        </p>
                      </div>

                      <span className="font-mono text-[10px] font-black tracking-[.22em] text-[#ccff00]/75">
                        {area.number}
                      </span>
                    </div>

                    <div className="mt-10 grid h-14 w-14 place-items-center rounded-2xl border border-[#ccff00]/20 bg-[#ccff00]/[.06]">
                      <Icon
                        className="h-6 w-6 text-[#ccff00]"
                        strokeWidth={1.5}
                      />
                    </div>

                    <h3 className="mt-8 text-2xl font-black uppercase leading-[.95] tracking-[-.035em] sm:text-3xl">
                      {area.title}
                    </h3>

                    <p className="mt-4 max-w-xl text-sm leading-7 text-white/48">
                      {area.description}
                    </p>

                    <div className="mt-auto pt-8">
                      <div className="h-px w-full bg-gradient-to-r from-white/10 via-white/[.06] to-transparent" />
                    </div>
                  </div>
                </article>
              );
            },
          )}
        </div>


        <div className="mt-10 flex flex-wrap items-center justify-between gap-5">
          <p className="text-[8px] font-black uppercase tracking-[.22em] text-white/25">
            Brands · Clubs · Creators · Collectors
          </p>

          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-[#ccff00]/40" />

            <span className="text-[8px] font-black uppercase tracking-[.22em] text-[#ccff00]">
              Culture · Access · Craft · Provenance
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}