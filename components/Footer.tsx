import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#030711] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12 lg:py-20">
        <div className="grid gap-12 border-b border-white/10 pb-14 md:grid-cols-2 lg:grid-cols-[1.4fr_.6fr_.6fr]">
          {/* Brand */}

          <div>
            <Link
              href="/"
              className="inline-flex items-baseline text-3xl font-black uppercase tracking-[-0.06em]"
            >
              AGE
              <span className="text-[#d7ff00]">202</span>
            </Link>

            <p className="mt-5 max-w-md text-sm leading-7 text-slate-400">
              The Digital Tennis Museum preserving authentic apparel,
              legendary champions, historic tournaments and the stories
              behind every artifact.
            </p>

            <p className="mt-7 text-[10px] font-black uppercase tracking-[0.25em] text-[#d7ff00]">
              Second Hand. First Set.
            </p>
          </div>

          {/* Museum */}

          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/40">
              Museum
            </p>

            <nav className="mt-5 flex flex-col items-start gap-4">
              <Link
                href="/archives"
                className="text-sm font-semibold text-white/70 transition hover:text-[#d7ff00]"
              >
                Hall of Champions
              </Link>

              <Link
                href="/atp-ranking"
                className="text-sm font-semibold text-white/70 transition hover:text-[#d7ff00]"
              >
                ATP Archive
              </Link>

              <Link
                href="/tennis-history"
                className="text-sm font-semibold text-white/70 transition hover:text-[#d7ff00]"
              >
                Tennis History
              </Link>

              <Link
                href="/results"
                className="text-sm font-semibold text-white/70 transition hover:text-[#d7ff00]"
              >
                Results
              </Link>
            </nav>
          </div>

          {/* AGE202 */}

          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/40">
              AGE202
            </p>

            <nav className="mt-5 flex flex-col items-start gap-4">
              <Link
                href="/about"
                className="text-sm font-semibold text-white/70 transition hover:text-[#d7ff00]"
              >
                About
              </Link>

              <Link
                href="/players/other-players"
                className="text-sm font-semibold text-white/70 transition hover:text-[#d7ff00]"
              >
                Other Players
              </Link>

              <a
                href="mailto:postmaster@age202.com"
                className="text-sm font-semibold text-white/70 transition hover:text-[#d7ff00]"
              >
                Contact
              </a>
            </nav>

            <Link
              href="/archives"
              className="group mt-7 inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#d7ff00]"
            >
              Enter the Museum

              <ArrowRight
                size={15}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#d7ff00]">
              The Digital Tennis Museum
            </p>

            <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35">
              © {new Date().getFullYear()} AGE202. All rights reserved.
            </p>
          </div>

          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35">
            Preserving tennis history, one artifact at a time.
          </p>
        </div>
      </div>
    </footer>
  );
}