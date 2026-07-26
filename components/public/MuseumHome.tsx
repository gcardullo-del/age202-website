"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Landmark,
  Recycle,
  ShoppingBag,
  Sparkles,
  Trophy,
} from "lucide-react";
import ArtifactPassport from "@/components/public/ArtifactPassport";
import MuseumTimeline from "@/components/public/MuseumTimeline";

const collections = [
  {
    name: "Roger Federer",
    era: "The art of elegance",
    period: "1998 — 2022",
    badge: "The Maestro",
    href: "/archives/federer",
    image: "/players/federer/gallery.jpg",
    position: "object-center",
  },
  {
    name: "Rafael Nadal",
    era: "The king of clay",
    period: "2001 — 2024",
    badge: "Clay legend",
    href: "/archives/nadal",
    image: "/players/nadal/gallery.jpg",
    position: "object-center",
  },
  {
    name: "Novak Djokovic",
    era: "The pursuit of greatness",
    period: "2003 — Present",
    badge: "Record breaker",
    href: "/archives/djokovic",
    image: "/players/djokovic/gallery.jpg",
    position: "object-center",
  },
  {
    name: "Jannik Sinner",
    era: "A new Italian era",
    period: "2018 — Present",
    badge: "Italian icon",
    href: "/archives/sinner",
    image: "/players/sinner/gallery.jpg",
    position: "object-center",
  },
  {
    name: "Carlos Alcaraz",
    era: "The future in motion",
    period: "2018 — Present",
    badge: "New generation",
    href: "/archives/alcaraz",
    image: "/players/alcaraz/gallery.jpg",
    position: "object-center",
  },
];

const reveal = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

export default function MuseumHome() {
  return (
    <main className="overflow-hidden bg-[#050b18] text-white">
      <section className="relative min-h-[100svh] overflow-hidden border-b border-white/10 pt-[86px]">
        <Image src="/hero/museum-hero.jpg" alt="Roger Federer reaching for the ball on a grass tennis court" fill priority sizes="100vw" className="object-cover object-[62%_center] sm:object-[58%_center] lg:object-center" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,8,18,.98)_0%,rgba(3,8,18,.94)_22%,rgba(3,8,18,.62)_47%,rgba(3,8,18,.12)_76%,rgba(3,8,18,.35)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,8,18,.22)_0%,transparent_45%,rgba(3,8,18,.72)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_32%,rgba(215,255,0,.11),transparent_31%)]" />

        <div className="relative mx-auto flex min-h-[calc(100svh-86px)] max-w-[1500px] items-center px-5 py-14 sm:px-8 lg:px-12">
          <motion.div initial="hidden" animate="visible" variants={reveal} transition={{ duration: .85, ease: [0.22, 1, 0.36, 1] }} className="w-full max-w-[690px] pt-8 lg:pt-0">
            <div className="mb-5 flex items-center gap-3 text-[10px] font-black uppercase tracking-[.32em] text-[#d7ff00] sm:text-xs">
              <span className="h-px w-10 bg-[#d7ff00]" /> The Digital Tennis Museum
            </div>
            <h1 className="text-[clamp(4rem,8.4vw,8.4rem)] font-black uppercase leading-[.78] tracking-[-.07em] text-white">
              Second<br />Hand.<br /><span className="text-[#d7ff00]">First Set.</span>
            </h1>
            <div className="mt-7 h-px w-14 bg-[#d7ff00]" />
            <p className="mt-6 max-w-lg text-sm leading-7 text-white/72 sm:text-base sm:leading-8">
              Preserving tennis history through authentic apparel, unforgettable champions and the stories behind every artifact.
            </p>
            <Link href="#collections" className="group mt-8 inline-flex min-w-[220px] items-center justify-between gap-8 rounded-lg border border-[#d7ff00] bg-black/15 px-6 py-4 text-[11px] font-black uppercase tracking-[.2em] text-white backdrop-blur transition hover:bg-[#d7ff00] hover:text-[#030812]">
              Explore museum <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        <div className="absolute bottom-5 right-6 hidden items-center gap-5 lg:flex">
          <span className="text-[9px] font-semibold uppercase tracking-[.22em] text-white/70">Every shirt holds a chapter.</span>
          <span className="h-px w-10 bg-[#d7ff00]" />
        </div>
        <div className="absolute right-6 top-1/2 hidden -translate-y-1/2 flex-col gap-3 2xl:flex">
          {[0, 1, 2, 3].map((dot) => <span key={dot} className={`h-2 w-2 rounded-full ${dot === 0 ? "bg-[#d7ff00]" : "bg-white/40"}`} />)}
        </div>
      </section>

      <section id="collections" className="border-b border-white/10 bg-[#050b18] px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[1600px]">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: .25 }}
            variants={reveal}
            transition={{ duration: .65 }}
            className="mb-14 flex flex-col justify-between gap-6 border-t border-white/10 pt-7 md:flex-row md:items-end lg:mb-16"
          >
            <div>
              <div className="mb-4 h-0.5 w-8 bg-[#d7ff00]" />
              <p className="text-[10px] font-black uppercase tracking-[.3em] text-[#d7ff00]">Featured galleries</p>
              <h2 className="mt-3 text-3xl font-black uppercase tracking-[-.045em] sm:text-5xl">Champion collections</h2>
            </div>
            <Link href="/archives" className="group inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[.22em] text-white/70 transition hover:text-[#d7ff00]">
              View all players <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

          <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-5 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-5 lg:gap-4 lg:overflow-visible lg:px-0 lg:pb-0">
            {collections.map((item, index) => (
              <motion.div
                key={item.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: .18 }}
                variants={reveal}
                transition={{ duration: .55, delay: index * .06 }}
                className="w-[88vw] shrink-0 snap-center sm:w-[58vw] md:w-[45vw] lg:w-auto"
              >
                <Link
                  href={item.href}
                  className="group relative block min-h-[600px] overflow-hidden rounded-[1.8rem] border border-white/10 bg-[#071021] shadow-[0_32px_90px_rgba(0,0,0,.45)] transition duration-500 hover:-translate-y-2 hover:border-[#d7ff00]/60 hover:shadow-[0_42px_120px_rgba(0,0,0,.62)] sm:min-h-[630px] lg:min-h-[600px] xl:min-h-[640px]"
                >
                  <div className="absolute inset-x-0 top-0 h-[74%] overflow-hidden">
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      aria-hidden="true"
                      sizes="(max-width: 640px) 88vw, (max-width: 1024px) 45vw, 20vw"
                      className="scale-110 object-cover opacity-28 blur-2xl saturate-90 transition duration-700 group-hover:scale-[1.2] group-hover:opacity-40"
                    />

                    <div className="absolute inset-0 bg-[#071021]/20" />

                    <Image
                      src={item.image}
                      alt={`${item.name} champion collection`}
                      fill
                      sizes="(max-width: 640px) 88vw, (max-width: 1024px) 45vw, 20vw"
                      className={`object-cover transition duration-1000 ease-out group-hover:scale-[1.07] ${item.position}`}
                    />

                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,8,18,.10)_0%,transparent_46%,rgba(3,8,18,.32)_100%)]" />
                  </div>

                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_42%,rgba(5,11,24,.24)_62%,rgba(5,11,24,.98)_78%,#050b18_100%)]" />

                  <div className="absolute inset-x-0 top-0 z-10 flex items-start justify-between p-6 sm:p-7">
                    <span className="rounded-full border border-white/20 bg-[#030812]/60 px-3 py-2 text-[8px] font-black uppercase tracking-[.2em] text-white/80 backdrop-blur-xl">
                      {item.badge}
                    </span>

                    <span className="rounded-full border border-white/10 bg-[#030812]/35 px-3 py-2 text-[8px] font-black uppercase tracking-[.2em] text-white/60 backdrop-blur-xl">
                      Gallery {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 z-10 p-6 sm:p-7">
                    <div className="mb-5 flex items-center justify-between border-b border-white/12 pb-4">
                      <p className="text-[9px] font-black uppercase tracking-[.22em] text-[#d7ff00]">
                        {item.era}
                      </p>

                      <p className="text-[8px] font-bold uppercase tracking-[.16em] text-white/45">
                        {item.period}
                      </p>
                    </div>

                    <h3 className="text-[clamp(1.65rem,2vw,2.35rem)] font-black uppercase leading-[.88] tracking-[-.055em] text-white">
                      {item.name}
                    </h3>

                    <div className="mt-7 flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-[.22em] text-white/75 transition group-hover:text-white">
                        Enter gallery
                      </span>

                      <span className="grid h-12 w-12 place-items-center rounded-full border border-[#d7ff00]/75 text-[#d7ff00] transition duration-300 group-hover:rotate-[-8deg] group-hover:border-[#d7ff00] group-hover:bg-[#d7ff00] group-hover:text-[#030812] group-hover:shadow-[0_0_28px_rgba(215,255,0,.3)]">
                        <ArrowRight size={17} />
                      </span>
                    </div>
                  </div>

                  <div className="pointer-events-none absolute inset-[1px] rounded-[1.72rem] border border-white/[.04]" />
                  <div className="absolute left-0 top-0 h-1 w-0 bg-[#d7ff00] transition-all duration-700 group-hover:w-full" />
                  <div className="pointer-events-none absolute -bottom-24 left-1/2 h-44 w-44 -translate-x-1/2 rounded-full bg-[#d7ff00]/0 blur-[80px] transition duration-700 group-hover:bg-[#d7ff00]/10" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ArtifactPassport />

      <MuseumTimeline />
      <section className="border-b border-white/10 bg-[#071021] px-6 py-24 sm:px-8 lg:px-12 lg:py-32">
  <div className="mx-auto max-w-7xl">
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      variants={reveal}
      transition={{ duration: 0.65 }}
      className="grid items-center gap-12 lg:grid-cols-[1.05fr_.95fr] lg:gap-20"
    >
      <div>
        <div className="mb-5 flex items-center gap-3">
          <span className="h-px w-10 bg-[#d7ff00]" />
          <p className="text-[10px] font-black uppercase tracking-[.3em] text-[#d7ff00]">
            Why AGE202?
          </p>
        </div>
{/* MUSEUM BY THE NUMBERS */}
<section className="relative overflow-hidden border-b border-white/10 bg-[#050b18] px-6 py-20 sm:px-8 lg:px-12 lg:py-24">
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(215,255,0,.06),transparent_55%)]" />

  <div className="relative mx-auto max-w-7xl">
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      variants={reveal}
      transition={{ duration: 0.65 }}
      className="mb-12 flex flex-col justify-between gap-6 border-t border-white/10 pt-6 md:flex-row md:items-end"
    >
      <div>
        <div className="mb-4 h-0.5 w-8 bg-[#d7ff00]" />

        <p className="text-[10px] font-black uppercase tracking-[.3em] text-[#d7ff00]">
          Museum by the numbers
        </p>

        <h2 className="mt-3 text-3xl font-black uppercase tracking-[-.045em] sm:text-5xl">
          The archive at a glance
        </h2>
      </div>

      <p className="max-w-md text-sm leading-7 text-slate-400">
        A growing digital archive built to preserve the champions, objects and
        stories that shaped tennis culture.
      </p>
    </motion.div>

    <div className="grid grid-cols-2 border-l border-t border-white/10 lg:grid-cols-4">
      {[
        {
          value: "05",
          label: "Champion galleries",
          description: "Dedicated archives for five defining tennis icons.",
        },
        {
          value: "04",
          label: "Museum pillars",
          description: "Champions, history, memorabilia and tennis culture.",
        },
        {
          value: "01",
          label: "Digital archive",
          description: "One evolving home for every preserved tennis story.",
        },
        {
          value: "100%",
          label: "Tennis culture",
          description: "Every gallery is created around the history of the game.",
        },
      ].map((stat, index) => (
        <motion.article
          key={stat.label}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={reveal}
          transition={{ duration: 0.5, delay: index * 0.08 }}
          className="group relative min-h-[250px] border-b border-r border-white/10 p-6 transition duration-500 hover:bg-white/[.035] sm:p-8 lg:min-h-[290px]"
        >
          <span className="text-[10px] font-black uppercase tracking-[.22em] text-white/35">
            {String(index + 1).padStart(2, "0")}
          </span>

          <div className="mt-8">
            <p className="text-5xl font-black tracking-[-.07em] text-[#d7ff00] sm:text-6xl lg:text-7xl">
              {stat.value}
            </p>

            <h3 className="mt-5 text-sm font-black uppercase tracking-[.16em] text-white">
              {stat.label}
            </h3>

            <p className="mt-4 max-w-[250px] text-sm leading-7 text-slate-400">
              {stat.description}
            </p>
          </div>

          <div className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-[#d7ff00] transition-transform duration-500 group-hover:scale-x-100" />
        </motion.article>
      ))}
    </div>
  </div>
</section>
        <h2 className="max-w-3xl text-4xl font-black uppercase leading-[.95] tracking-[-.05em] sm:text-5xl lg:text-6xl">
          Tennis history deserves a second life.
        </h2>

        <p className="mt-7 max-w-2xl text-base leading-8 text-slate-400">
          AGE202 selects authentic second-hand tennis apparel and preserves
          the stories connected to champions, tournaments and unforgettable
          eras of the sport.
        </p>

        <p className="mt-5 max-w-2xl text-base leading-8 text-slate-400">
          Every piece is presented as part of tennis history, while purchases
          remain simple and secure through Vinted.
        </p>

        <Link
          href="#collections"
          className="group mt-9 inline-flex items-center gap-4 rounded-full border border-[#d7ff00] px-7 py-4 text-[11px] font-black uppercase tracking-[.18em] text-white transition hover:bg-[#d7ff00] hover:text-[#030812]"
        >
          Explore the collections
          <ArrowRight
            size={17}
            className="transition-transform group-hover:translate-x-1"
          />
        </Link>
      </div>

      <div className="grid gap-4">
        <article className="rounded-[1.5rem] border border-white/10 bg-white/[.035] p-7 transition hover:border-[#d7ff00]/45">
          <BadgeCheck className="text-[#d7ff00]" size={27} />

          <h3 className="mt-6 text-xl font-black uppercase tracking-[-.025em]">
            Authentic pieces
          </h3>

          <p className="mt-3 text-sm leading-7 text-slate-400">
            Carefully selected tennis apparel connected to iconic players,
            brands and memorable moments.
          </p>
        </article>

        <article className="rounded-[1.5rem] border border-white/10 bg-white/[.035] p-7 transition hover:border-[#d7ff00]/45">
          <Recycle className="text-[#d7ff00]" size={27} />

          <h3 className="mt-6 text-xl font-black uppercase tracking-[-.025em]">
            A second life
          </h3>

          <p className="mt-3 text-sm leading-7 text-slate-400">
            Second-hand clothing becomes part of a curated archive instead of
            being forgotten.
          </p>
        </article>

        <article className="rounded-[1.5rem] border border-white/10 bg-white/[.035] p-7 transition hover:border-[#d7ff00]/45">
          <ShoppingBag className="text-[#d7ff00]" size={27} />

          <h3 className="mt-6 text-xl font-black uppercase tracking-[-.025em]">
            Available on Vinted
          </h3>

          <p className="mt-3 text-sm leading-7 text-slate-400">
            AGE202 tells the story of every piece and directs visitors to
            Vinted for the final purchase.
          </p>
        </article>
      </div>
    </motion.div>
  </div>
</section>

      <section className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-12 lg:py-32">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {[
            [Landmark, "Museum", "Curated galleries dedicated to champions, brands and defining eras."],
            [Trophy, "Hall of Fame", "Profiles, records and artifacts connected to tennis legends."],
            [BookOpen, "History", "Open Era stories, rivalries and the evolution of tennis style."],
            [Sparkles, "Memorabilia", "Exceptional objects, signatures and collectible tennis culture."],
          ].map(([Icon, title, text], index) => {
            const IconComponent = Icon as typeof Landmark;
            return <motion.article key={String(title)} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={reveal} transition={{ duration: .5, delay: index * .08 }} className="rounded-[1.5rem] border border-white/10 bg-white/[.035] p-7 transition hover:-translate-y-1 hover:border-[#ccff00]/50">
              <IconComponent className="text-[#ccff00]" size={25} />
              <h3 className="mt-8 text-xl font-black uppercase tracking-[-.025em]">{String(title)}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-400">{String(text)}</p>
            </motion.article>;
          })}
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-white/10 px-6 py-28 text-center sm:px-8 lg:py-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(204,255,0,.10),transparent_45%)]" />
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: .4 }} variants={reveal} transition={{ duration: .7 }} className="relative mx-auto max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[.3em] text-[#ccff00]">The AGE202 manifesto</p>
          <h2 className="mt-7 text-balance text-4xl font-black uppercase leading-[.95] tracking-[-.05em] sm:text-6xl lg:text-7xl">Every shirt tells a story. Every artifact preserves a moment.</h2>
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-slate-400">We preserve memories, document achievements and connect generations of tennis enthusiasts.</p>
          <Link href="/about" className="mt-10 inline-flex items-center gap-3 rounded-full border border-white/20 px-7 py-4 text-sm font-bold uppercase tracking-[.15em] transition hover:border-[#ccff00] hover:text-[#ccff00]">Discover why AGE202 <ArrowRight size={16} /></Link>
        </motion.div>
      </section>
    </main>
  );
}