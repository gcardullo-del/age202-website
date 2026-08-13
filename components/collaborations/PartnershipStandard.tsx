import {
  CircleCheck,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
} from "lucide-react";


const principles = [
  {
    number: "01",
    title: "Tennis connection",
    text: "A genuine connection to tennis culture",
  },
  {
    number: "02",
    title: "Provenance",
    text: "Clear provenance and honest storytelling",
  },
  {
    number: "03",
    title: "Editorial craft",
    text: "Premium visual and editorial standards",
  },
  {
    number: "04",
    title: "Long-term value",
    text: "Projects with long-term cultural value",
  },
];


export default function PartnershipStandard() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(204,255,0,.07),transparent_30%)]" />

      <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <div className="overflow-hidden rounded-[2.6rem] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,.045),rgba(255,255,255,.015))] shadow-[0_28px_90px_rgba(0,0,0,.28)]">
          <div className="grid lg:grid-cols-[.92fr_1.08fr]">
            <div className="relative border-b border-white/10 p-8 sm:p-12 lg:border-b-0 lg:border-r lg:p-14">
              <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-[#ccff00]/8 blur-3xl" />

              <div className="relative">
                <div className="flex items-center gap-3">
                  <HeartHandshake className="h-5 w-5 text-[#ccff00]" />

                  <p className="text-[10px] font-black uppercase tracking-[.28em] text-[#ccff00]">
                    Our partnership standard
                  </p>
                </div>

                <h2 className="mt-7 max-w-xl text-4xl font-black uppercase leading-[.9] tracking-[-.05em] sm:text-6xl">
                  Alignment
                  <span className="block text-[#ccff00]">
                    before visibility.
                  </span>
                </h2>

                <p className="mt-7 max-w-xl text-base leading-8 text-white/55">
                  AGE202 is selective by design. The strongest partnerships are
                  built around shared values, credible stories and respect for
                  the culture of the sport.
                </p>

                <div className="mt-10 flex items-center gap-3 rounded-2xl border border-[#ccff00]/15 bg-[#ccff00]/[.04] px-4 py-4">
                  <ShieldCheck className="h-5 w-5 shrink-0 text-[#ccff00]" />

                  <p className="text-[9px] font-black uppercase tracking-[.18em] text-white/45">
                    Quality of alignment comes before scale of exposure.
                  </p>
                </div>
              </div>
            </div>


            <div className="relative p-8 sm:p-12 lg:p-14">
              <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-5">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[.24em] text-white/28">
                    Partnership criteria
                  </p>

                  <p className="mt-2 text-sm font-semibold text-white/60">
                    Four principles guide every AGE202 collaboration.
                  </p>
                </div>

                <Sparkles className="h-5 w-5 text-[#ccff00]/70" />
              </div>

              <div className="mt-4">
                {principles.map(
                  (
                    principle,
                  ) => (
                    <article
                      key={principle.number}
                      className="group grid gap-4 border-b border-white/10 py-6 sm:grid-cols-[64px_1fr_auto] sm:items-center"
                    >
                      <span className="font-mono text-[10px] font-black tracking-[.2em] text-[#ccff00]/70">
                        {principle.number}
                      </span>

                      <div>
                        <p className="text-[8px] font-black uppercase tracking-[.22em] text-[#ccff00]">
                          {principle.title}
                        </p>

                        <p className="mt-2 text-sm font-semibold leading-6 text-white/72">
                          {principle.text}
                        </p>
                      </div>

                      <div className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-white/25 transition duration-300 group-hover:border-[#ccff00]/35 group-hover:bg-[#ccff00]/8 group-hover:text-[#ccff00]">
                        <CircleCheck
                          size={16}
                        />
                      </div>
                    </article>
                  ),
                )}
              </div>

              <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
                <p className="text-[8px] font-black uppercase tracking-[.2em] text-white/22">
                  AGE202 · Partnership Office
                </p>

                <div className="flex items-center gap-3">
                  <span className="h-px w-10 bg-[#ccff00]/40" />

                  <span className="text-[8px] font-black uppercase tracking-[.2em] text-[#ccff00]">
                    Culture · Craft · Legacy
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}