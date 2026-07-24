"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Search, X } from "lucide-react";

const links = [
  ["Explore", "/archive"], ["Players", "/hall-of-fame"], ["Brands", "/brands"], ["History", "/slams"], ["About", "/about"],
];

export default function MuseumNavbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#050b18]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-12">
        <Link href="/" className="group">
          <span className="block text-2xl font-black tracking-[-.06em]">AGE<span className="text-[#ccff00]">202</span></span>
          <span className="mt-1 block text-[8px] font-bold uppercase tracking-[.28em] text-slate-400">Digital Tennis Museum</span>
        </Link>
        <nav className="hidden items-center gap-7 lg:flex">
          {links.map(([label, href]) => <Link key={label} href={href} className="text-xs font-semibold uppercase tracking-[.16em] text-slate-300 transition hover:text-[#ccff00]">{label}</Link>)}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/archive" aria-label="Search archive" className="grid h-11 w-11 place-items-center rounded-full border border-white/10 transition hover:border-[#ccff00] hover:text-[#ccff00]"><Search size={18} /></Link>
          <button type="button" onClick={() => setOpen(!open)} aria-label="Open menu" className="grid h-11 w-11 place-items-center rounded-full border border-white/10 lg:hidden">{open ? <X size={20}/> : <Menu size={20}/>}</button>
        </div>
      </div>
      {open && <nav className="border-t border-white/10 bg-[#050b18] px-6 py-7 lg:hidden">{links.map(([label, href]) => <Link key={label} href={href} onClick={() => setOpen(false)} className="block border-b border-white/10 py-4 text-lg font-bold uppercase tracking-[-.02em]">{label}</Link>)}</nav>}
    </header>
  );
}
