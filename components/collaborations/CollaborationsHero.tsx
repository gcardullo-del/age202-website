import Link from "next/link";

import {
  ArrowRight,
  Handshake,
  Mail,
  Network,
  Sparkles,
} from "lucide-react";


const contactEmail =
  "postmaster@age202.com";

const partnershipMailto =
  `mailto:${contactEmail}?subject=${encodeURIComponent(
    "AGE202 Partnership Enquiry",
  )}`;


export default function CollaborationsHero() {
  return (
    <section className="relative isolate min-h-[80vh] overflow-hidden border-b border-white/10">
      <div className="absolute inset-0 -z-30 bg-[linear-gradient(135deg,#050B18_0%,#0A1427_48%,#07101f_100%)]" />

      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_78%_20%,rgba(204,255,0,.16),transparent_28%),radial-gradient(circle_at_14%_82%,rgba(59,130,246,.10),transparent_32%)]" />

      <div className="absolute inset-0 -z-10 opacity-25 [background-image:linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] [background-size:72px_72px]" />

      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-[72%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#ccff00]/45 to-transparent" />


      <div className="mx-auto grid min-h-[80vh] max-w-7xl items-center gap-16 px-6 py-24 lg:grid-cols-[1.02fr_.98fr] lg:px-10">
        <div>
          <div className="flex items-center gap-3">
            <span className="h-px w-12 bg-[#ccff00]" />

            <p className="text-[10px] font-black uppercase tracking-[.3em] text-[#ccff00]">
              Partners in tennis culture
            </p>
          </div>

          <h1 className="mt-7 max-w-5xl text-5xl font-black uppercase leading-[.86] tracking-[-.06em] sm:text-7xl lg:text-[7rem]">
            Built through
            <span className="block text-[#ccff00]">
              collaboration.
            </span>
          </h1>

          <p className="mt-8 max-w-2xl text-base leading-8 text-white/60 sm:text-lg">
            AGE202 partners with brands, clubs, creators and collectors to
            preserve tennis history and transform it into meaningful new
            experiences.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href={partnershipMailto}
              className="group inline-flex items-center gap-3 rounded-full bg-[#ccff00] px-7 py-4 text-[10px] font-black uppercase tracking-[.18em] text-[#050B18] transition duration-300 hover:scale-[1.025]"
            >
              <Mail className="h-4 w-4" />

              Become a partner

              <ArrowRight className="h-4 w-4 transition duration-300 group-hover:translate-x-1" />
            </a>

            <Link
              href="/memorabilia"
              className="group inline-flex items-center gap-3 rounded-full border border-white/20 px-7 py-4 text-[10px] font-black uppercase tracking-[.18em] text-white transition duration-300 hover:border-[#ccff00]/40 hover:bg-white/[.04]"
            >
              Explore memorabilia

              <ArrowRight className="h-4 w-4 text-white/35 transition duration-300 group-hover:translate-x-1 group-hover:text-[#ccff00]" />
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/10 pt-5">
            <div className="flex items-center gap-2">
              <Sparkles
                size={13}
                className="text-[#ccff00]"
              />

              <span className="text-[8px] font-black uppercase tracking-[.22em] text-white/30">
                AGE202 Partnership Office
              </span>
            </div>

            <span className="hidden h-3 w-px bg-white/10 sm:block" />

            <a
              href={partnershipMailto}
              className="text-[8px] font-black uppercase tracking-[.22em] text-white/20 transition hover:text-[#ccff00]"
            >
              {contactEmail}
            </a>

            <span className="hidden h-3 w-px bg-white/10 sm:block" />

            <span className="text-[8px] font-black uppercase tracking-[.22em] text-white/20">
              Culture · Craft · Legacy
            </span>
          </div>
        </div>


        <div className="relative mx-auto w-full max-w-xl">
          <div className="absolute -inset-14 rounded-full bg-[#ccff00]/10 blur-3xl" />

          <div className="relative overflow-hidden rounded-[2.7rem] border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,.05),rgba(255,255,255,.015))] p-5 shadow-[0_30px_100px_rgba(0,0,0,.38)] backdrop-blur-xl">
            <div className="relative overflow-hidden rounded-[2.1rem] border border-white/10 bg-[#071020] p-8 sm:p-10">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_34%,rgba(204,255,0,.18),transparent_34%)]" />

              <div className="relative flex items-start justify-between gap-6">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[.28em] text-white/35">
                    AGE202 Partnership Office
                  </p>

                  <p className="mt-2 text-[10px] font-black uppercase tracking-[.22em] text-[#ccff00]">
                    Shared vision · lasting value
                  </p>
                </div>

                <div className="grid h-12 w-12 place-items-center rounded-full border border-[#ccff00]/25 bg-[#ccff00]/[.06]">
                  <Handshake
                    className="h-5 w-5 text-[#ccff00]"
                    strokeWidth={1.4}
                  />
                </div>
              </div>


              <div className="relative mt-10 flex min-h-[300px] items-center justify-center">
                <div className="absolute h-64 w-64 rounded-full border border-[#ccff00]/15" />
                <div className="absolute h-48 w-48 rounded-full border border-white/10" />
                <div className="absolute h-32 w-32 rounded-full border border-[#ccff00]/10" />
                <div className="absolute h-24 w-24 rounded-full bg-[#ccff00]/10 blur-2xl" />

                <Network
                  className="relative h-28 w-28 text-white/90 drop-shadow-[0_0_38px_rgba(204,255,0,.22)]"
                  strokeWidth={1.1}
                />

                <div className="absolute left-5 top-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-[#050B18]/75 px-3 py-2 backdrop-blur">
                  <span className="text-[8px] font-black uppercase tracking-[.18em] text-white/35">
                    Culture
                  </span>
                </div>

                <div className="absolute right-5 top-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-[#050B18]/75 px-3 py-2 backdrop-blur">
                  <span className="text-[8px] font-black uppercase tracking-[.18em] text-white/35">
                    Craft
                  </span>
                </div>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-[#ccff00]/20 bg-[#050B18]/80 px-3 py-2 backdrop-blur">
                  <span className="text-[8px] font-black uppercase tracking-[.18em] text-[#ccff00]">
                    Legacy
                  </span>
                </div>
              </div>


              <div className="relative mt-8 grid grid-cols-3 gap-3 border-t border-white/10 pt-5 text-center">
                <div>
                  <p className="text-base font-black uppercase tracking-[-.02em] text-white">
                    Culture
                  </p>

                  <p className="mt-1 text-[8px] font-black uppercase tracking-[.18em] text-white/25">
                    Purpose
                  </p>
                </div>

                <div className="border-x border-white/10">
                  <p className="text-base font-black uppercase tracking-[-.02em] text-white">
                    Craft
                  </p>

                  <p className="mt-1 text-[8px] font-black uppercase tracking-[.18em] text-white/25">
                    Quality
                  </p>
                </div>

                <div>
                  <p className="text-base font-black uppercase tracking-[-.02em] text-white">
                    Legacy
                  </p>

                  <p className="mt-1 text-[8px] font-black uppercase tracking-[.18em] text-white/25">
                    Impact
                  </p>
                </div>
              </div>


              <div className="relative mt-6 flex items-center justify-between border-t border-white/[.06] pt-5">
                <span className="text-[8px] font-black uppercase tracking-[.2em] text-white/20">
                  Partnership system
                </span>

                <span className="font-mono text-[9px] font-black tracking-[.18em] text-[#ccff00]/70">
                  AGE202 / 2026
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}