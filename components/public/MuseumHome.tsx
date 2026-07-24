"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Landmark, Sparkles, Trophy } from "lucide-react";

const collections = [
  { name: "Roger Federer", era: "The art of elegance", href: "/archives/federer", image: "/hero/federer-hero.png" },
  { name: "Rafael Nadal", era: "The king of clay", href: "/archives/nadal", image: "/hero/nadal-hero.jpg" },
  { name: "Novak Djokovic", era: "The pursuit of greatness", href: "/archives/djokovic", image: "/hero/djokovic-hero.jpg" },
  { name: "Jannik Sinner", era: "A new Italian era", href: "/archives/sinner", image: "/hero/sinner-hero.jpg" },
  { name: "Carlos Alcaraz", era: "The future in motion", href: "/archives/alcaraz", image: "/hero/alcaraz-hero.jpg" },
];

const reveal = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

export default function MuseumHome() {
  return (
    <main className="overflow-hidden bg-[#050b18] text-white">
      <section className="relative min-h-[calc(100svh-6rem)] border-b border-white/10">
        <Image src="/players/hero-federer-wimbledon.png" alt="Historic tennis atmosphere" fill priority className="object-cover object-center" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,11,24,.96)_0%,rgba(5,11,24,.72)_48%,rgba(5,11,24,.25)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_35%,rgba(204,255,0,.12),transparent_35%)]" />
        <div className="relative mx-auto flex min-h-[calc(100svh-6rem)] max-w-7xl items-end px-6 pb-16 pt-24 sm:px-8 lg:px-12 lg:pb-24">
          <motion.div initial="hidden" animate="visible" variants={reveal} transition={{ duration: .8 }} className="max-w-4xl">
            <div className="mb-7 flex items-center gap-3 text-xs font-semibold uppercase tracking-[.28em] text-[#ccff00]">
              <span className="h-px w-10 bg-[#ccff00]" /> The Digital Tennis Museum
            </div>
            <h1 className="text-balance text-6xl font-black uppercase leading-[.84] tracking-[-.065em] sm:text-7xl lg:text-[7.5rem]">
              Second Hand.<br /><span className="text-[#ccff00]">First Set.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-200 sm:text-xl">
              Preserving tennis history through authentic apparel, unforgettable champions and the stories behind every artifact.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link href="#collections" className="inline-flex items-center justify-center gap-3 rounded-full bg-[#ccff00] px-7 py-4 text-sm font-bold uppercase tracking-[.14em] text-[#050b18] transition hover:scale-[1.02]">
                Explore the museum <ArrowRight size={17} />
              </Link>
              <Link href="/about" className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/5 px-7 py-4 text-sm font-semibold uppercase tracking-[.14em] backdrop-blur transition hover:border-white/50 hover:bg-white/10">
                Our story
              </Link>
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-0 right-0 hidden border-l border-t border-white/10 bg-[#050b18]/70 px-10 py-6 backdrop-blur-xl lg:block">
          <p className="text-[10px] uppercase tracking-[.3em] text-slate-400">Archive philosophy</p>
          <p className="mt-2 font-semibold">Every shirt holds a chapter.</p>
        </div>
      </section>

      <section id="collections" className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-12 lg:py-32">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: .25 }} variants={reveal} transition={{ duration: .65 }} className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.26em] text-[#ccff00]">Featured galleries</p>
            <h2 className="mt-4 text-4xl font-black uppercase tracking-[-.04em] sm:text-6xl">Champion collections</h2>
          </div>
          <p className="max-w-md text-base leading-7 text-slate-400">Five careers. Five visual languages. One archive dedicated to the garments that defined modern tennis.</p>
        </motion.div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-12">
          {collections.map((item, index) => (
            <motion.div key={item.name} initial="hidden" whileInView="visible" viewport={{ once: true, amount: .18 }} variants={reveal} transition={{ duration: .55, delay: index * .07 }} className={index < 2 ? "lg:col-span-6" : "lg:col-span-4"}>
              <Link href={item.href} className="group relative block min-h-[430px] overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0b132b]">
                <Image src={item.image} alt={item.name} fill className="object-cover transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050b18] via-[#050b18]/35 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-7 sm:p-9">
                  <p className="text-xs uppercase tracking-[.22em] text-[#ccff00]">{item.era}</p>
                  <div className="mt-3 flex items-end justify-between gap-4">
                    <h3 className="text-3xl font-black uppercase tracking-[-.04em] sm:text-4xl">{item.name}</h3>
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/25 bg-black/20 transition group-hover:border-[#ccff00] group-hover:bg-[#ccff00] group-hover:text-black"><ArrowRight size={18} /></span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#08101f]">
        <div className="mx-auto grid max-w-7xl lg:grid-cols-2">
          <div className="relative min-h-[520px] overflow-hidden">
            <Image src="/players/federernew.jpg" alt="Artifact of the week" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#08101f]/35" />
            <div className="absolute left-6 top-6 rounded-full border border-white/20 bg-black/35 px-4 py-2 text-[10px] font-bold uppercase tracking-[.2em] backdrop-blur">Artifact of the week</div>
          </div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: .3 }} variants={reveal} transition={{ duration: .7 }} className="flex flex-col justify-center px-6 py-16 sm:px-10 lg:px-16">
            <p className="text-xs font-bold uppercase tracking-[.26em] text-[#ccff00]">A story, not a product</p>
            <h2 className="mt-5 text-4xl font-black uppercase leading-none tracking-[-.045em] sm:text-6xl">The garment becomes evidence.</h2>
            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-300">Tournament, season, athlete and design converge in a single object. AGE202 documents the context before presenting availability.</p>
            <Link href="/archive" className="mt-9 inline-flex w-fit items-center gap-3 border-b border-[#ccff00] pb-2 text-sm font-bold uppercase tracking-[.16em] text-[#ccff00]">Enter the archive <ArrowRight size={16} /></Link>
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
