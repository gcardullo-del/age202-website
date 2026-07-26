"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, CalendarDays, MapPin, Shirt, Trophy } from "lucide-react";

const facts = [
  { icon: CalendarDays, label: "Season", value: "2017" },
  { icon: Trophy, label: "Tournament", value: "Australian Open" },
  { icon: MapPin, label: "Player", value: "Roger Federer" },
  { icon: Shirt, label: "Brand", value: "Nike" },
];

export default function ArtifactPassport() {
  return (
    <section className="border-y border-white/10 bg-[#08101f]">
      <div className="mx-auto grid max-w-7xl lg:grid-cols-[1.08fr_.92fr]">
        <div className="relative min-h-[560px] overflow-hidden lg:min-h-[720px]">
          <Image src="/players/federernew.jpg" alt="Roger Federer tennis artifact" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#08101f] via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#08101f]/45" />
          <div className="absolute left-6 top-6 flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-4 py-2 text-[10px] font-bold uppercase tracking-[.2em] backdrop-blur">
            <BadgeCheck size={14} className="text-[#ccff00]" /> Museum verified
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .25 }} transition={{ duration: .7 }} className="flex flex-col justify-center px-6 py-16 sm:px-10 lg:px-14 xl:px-16">
          <p className="text-xs font-bold uppercase tracking-[.28em] text-[#ccff00]">Artifact passport · No. 202-001</p>
          <h2 className="mt-5 text-4xl font-black uppercase leading-[.94] tracking-[-.05em] sm:text-6xl">A garment with a documented identity.</h2>
          <p className="mt-7 text-base leading-8 text-slate-300 sm:text-lg">Every AGE202 artifact is presented through its sporting context: athlete, season, tournament, design and cultural relevance.</p>

          <div className="mt-9 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10">
            {facts.map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-[#08101f] p-5">
                <Icon size={18} className="text-[#ccff00]" />
                <p className="mt-4 text-[10px] font-bold uppercase tracking-[.2em] text-slate-500">{label}</p>
                <p className="mt-1 text-sm font-semibold text-white">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-between gap-5 rounded-2xl border border-[#ccff00]/25 bg-[#ccff00]/[.06] p-5">
            <div><p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#ccff00]">Museum status</p><p className="mt-1 font-semibold">Available in collection</p></div>
            <span className="h-3 w-3 rounded-full bg-[#ccff00] shadow-[0_0_18px_rgba(204,255,0,.8)]" />
          </div>

          <Link href="/product/federer-ao-2017" className="mt-9 inline-flex w-fit items-center gap-3 border-b border-[#ccff00] pb-2 text-sm font-bold uppercase tracking-[.16em] text-[#ccff00]">Open artifact record <ArrowRight size={16} /></Link>
        </motion.div>
      </div>
    </section>
  );
}
