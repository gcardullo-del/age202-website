import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#030711] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <p className="text-3xl font-black tracking-[-.06em]">AGE<span className="text-[#ccff00]">202</span></p>
            <p className="mt-5 max-w-md text-sm leading-7 text-slate-400">The digital tennis museum preserving authentic apparel, iconic careers and the culture of the game.</p>
            <p className="mt-7 text-xs font-bold uppercase tracking-[.24em] text-[#ccff00]">Second Hand. First Set.</p>
          </div>
          <div><p className="text-xs font-bold uppercase tracking-[.2em] text-slate-500">Museum</p><div className="mt-5 space-y-3 text-sm text-slate-300"><Link className="block hover:text-[#ccff00]" href="/archive">Archive</Link><Link className="block hover:text-[#ccff00]" href="/hall-of-fame">Hall of Fame</Link><Link className="block hover:text-[#ccff00]" href="/brands">Brands</Link><Link className="block hover:text-[#ccff00]" href="/vault">Vault</Link></div></div>
          <div><p className="text-xs font-bold uppercase tracking-[.2em] text-slate-500">AGE202</p><div className="mt-5 space-y-3 text-sm text-slate-300"><Link className="block hover:text-[#ccff00]" href="/about">About</Link><Link className="block hover:text-[#ccff00]" href="/saved">Saved artifacts</Link><a className="block hover:text-[#ccff00]" href="mailto:info@age202.com">Contact</a></div></div>
        </div>
        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-7 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between"><p>© {new Date().getFullYear()} AGE202. All rights reserved.</p><p>Preserving tennis history, one artifact at a time.</p></div>
      </div>
    </footer>
  );
}
