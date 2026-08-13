import Link from "next/link";

import {
  ArrowRight,
  Handshake,
  Mail,
  Sparkles,
} from "lucide-react";


const contactEmail =
  "postmaster@age202.com";

const partnershipMailto =
  `mailto:${contactEmail}?subject=${encodeURIComponent(
    "AGE202 Partnership Enquiry",
  )}`;


export default function CollaborationCTA() {
  return (
    <section
      id="partner"
      className="relative overflow-hidden border-t border-white/10 bg-[#071020]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(204,255,0,.11),transparent_32%),radial-gradient(circle_at_10%_90%,rgba(59,130,246,.07),transparent_30%)]" />

      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-[72%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#ccff00]/45 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <div className="relative overflow-hidden rounded-[2.8rem] border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,.045),rgba(255,255,255,.012))] px-6 py-14 text-center shadow-[0_30px_100px_rgba(0,0,0,.32)] sm:px-10 sm:py-18 lg:px-16 lg:py-20">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#ccff00]/[.07]" />

          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[.05]" />

          <div className="relative">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-[#ccff00]/25 bg-[#ccff00]/[.06] shadow-[0_0_40px_rgba(204,255,0,.08)]">
              <Handshake
                className="h-7 w-7 text-[#ccff00]"
                strokeWidth={1.4}
              />
            </div>

            <div className="mt-7 flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-[#ccff00]" />

              <p className="text-[10px] font-black uppercase tracking-[.3em] text-[#ccff00]">
                Start a conversation
              </p>

              <span className="h-px w-8 bg-[#ccff00]" />
            </div>

            <h2 className="mx-auto mt-7 max-w-5xl text-[clamp(2.7rem,7vw,6.8rem)] font-black uppercase leading-[.86] tracking-[-.06em]">
              Let&apos;s create
              <span className="block">
                something tennis
              </span>
              <span className="block text-[#ccff00]">
                will remember.
              </span>
            </h2>

            <p className="mx-auto mt-8 max-w-2xl text-sm leading-7 text-white/52 sm:text-base sm:leading-8">
              AGE202 collaborations are built around authentic stories,
              meaningful objects and a shared respect for tennis culture.
              Every project begins with a conversation.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <a
                href={partnershipMailto}
                className="group inline-flex items-center gap-3 rounded-full bg-[#ccff00] px-7 py-4 text-[10px] font-black uppercase tracking-[.18em] text-[#050B18] transition duration-300 hover:scale-[1.025]"
              >
                <Mail className="h-4 w-4" />

                Contact AGE202

                <ArrowRight className="h-4 w-4 transition duration-300 group-hover:translate-x-1" />
              </a>

              <Link
                href="/shop"
                className="group inline-flex items-center gap-3 rounded-full border border-white/20 px-7 py-4 text-[10px] font-black uppercase tracking-[.18em] text-white transition duration-300 hover:border-[#ccff00]/45 hover:bg-white/[.04]"
              >
                Visit the archive shop

                <ArrowRight className="h-4 w-4 text-white/40 transition duration-300 group-hover:translate-x-1 group-hover:text-[#ccff00]" />
              </Link>
            </div>

            <a
              href={partnershipMailto}
              className="mt-5 inline-flex items-center gap-2 text-[9px] font-bold tracking-[.08em] text-white/35 transition hover:text-[#ccff00]"
            >
              <Mail className="h-3.5 w-3.5" />

              {contactEmail}
            </a>

            <div className="mx-auto mt-12 flex max-w-xl items-center gap-4">
              <span className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />

              <div className="flex items-center gap-2">
                <Sparkles
                  size={13}
                  className="text-[#ccff00]"
                />

                <span className="text-[8px] font-black uppercase tracking-[.22em] text-white/25">
                  AGE202 Partnership Office
                </span>
              </div>

              <span className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}