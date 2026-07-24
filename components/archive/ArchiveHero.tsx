import Link from "next/link";

export default function ArchiveHero() {
  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-[#050B18]">
      {/* Background decoration */}

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-32 -top-40 h-[550px] w-[550px] rounded-full bg-[#C8FF00]/[0.04] blur-[140px]" />

        <div className="absolute bottom-0 left-1/2 h-px w-full -translate-x-1/2 bg-gradient-to-r from-transparent via-[#C8FF00]/30 to-transparent" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      <div className="relative mx-auto grid min-h-[540px] max-w-7xl items-end gap-12 px-6 pb-20 pt-32 md:px-8 lg:grid-cols-[1fr_auto] lg:pb-24">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.38em] text-[#C8FF00]">
            The Digital Archive
          </p>

          <h1 className="mt-7 text-6xl font-black leading-[0.85] tracking-[-0.06em] sm:text-7xl lg:text-[110px]">
            AGE202
            <br />

            <span className="text-gray-600">
              Archive
            </span>
          </h1>

          <p className="mt-9 max-w-2xl text-lg leading-8 text-gray-400 md:text-xl md:leading-9">
            Explore authenticated tennis apparel connected to
            iconic tournaments, defining victories and the
            greatest champions in tennis history.
          </p>
        </div>

        <div className="flex flex-col items-start gap-5 lg:items-end">
          <p className="max-w-xs text-sm leading-7 text-gray-500 lg:text-right">
            Every archive record preserves the story, historical
            context and identity of a collectible tennis piece.
          </p>

          <Link
            href="#archive-explorer"
            className="inline-flex items-center gap-3 rounded-full border border-white/10 px-6 py-4 text-[10px] font-black uppercase tracking-[0.22em] text-white transition hover:border-[#C8FF00]/40 hover:text-[#C8FF00]"
          >
            Explore collection

            <span aria-hidden="true">↓</span>
          </Link>
        </div>
      </div>
    </section>
  );
}