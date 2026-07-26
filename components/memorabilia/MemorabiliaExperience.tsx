import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CircleDot,
  Crown,
  Gem,
  Medal,
  ShieldCheck,
  Sparkles,
  Trophy,
} from "lucide-react";

const collections = [
  {
    number: "01",
    title: "Signed Icons",
    eyebrow: "Autographs",
    description:
      "Signed caps, shirts, photographs and match objects connected to the defining players of each era.",
    icon: BadgeCheck,
    accent: "from-[#ccff00]/25 to-transparent",
  },
  {
    number: "02",
    title: "Historic Equipment",
    eyebrow: "Court objects",
    description:
      "Rackets, bags, balls and accessories whose materials and design tell the evolution of professional tennis.",
    icon: Trophy,
    accent: "from-sky-400/20 to-transparent",
  },
  {
    number: "03",
    title: "Collector Editions",
    eyebrow: "Limited releases",
    description:
      "Cards, commemorative objects and numbered editions selected for their cultural and archival value.",
    icon: Gem,
    accent: "from-violet-400/20 to-transparent",
  },
];

const featuredObjects = [
  {
    archive: "MEM-001",
    title: "Championship Match Ball",
    period: "Grand Slam era",
    category: "Match object",
    status: "Archive preview",
    icon: CircleDot,
  },
  {
    archive: "MEM-002",
    title: "Signed Tournament Cap",
    period: "Modern champions",
    category: "Signed apparel",
    status: "Archive preview",
    icon: Crown,
  },
  {
    archive: "MEM-003",
    title: "Commemorative Medal",
    period: "Historic edition",
    category: "Collector object",
    status: "Archive preview",
    icon: Medal,
  },
];

const principles = [
  {
    title: "Provenance first",
    text: "Every future entry will prioritise origin, ownership history and supporting documentation.",
    icon: ShieldCheck,
  },
  {
    title: "Museum context",
    text: "Objects are presented through the match, player, tournament and era that made them meaningful.",
    icon: Sparkles,
  },
  {
    title: "Curated rarity",
    text: "Selection is based on historical relevance, scarcity and storytelling—not quantity alone.",
    icon: Gem,
  },
];

export default function MemorabiliaExperience() {
  return (
    <main className="overflow-hidden bg-[#050B18] text-white">
      <section className="relative isolate min-h-[78vh] border-b border-white/10">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_75%_25%,rgba(204,255,0,0.16),transparent_32%),radial-gradient(circle_at_20%_75%,rgba(56,189,248,0.12),transparent_30%),linear-gradient(135deg,#050B18_0%,#0B132B_55%,#07101f_100%)]" />
        <div className="absolute inset-0 -z-10 opacity-35 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:64px_64px]" />

        <div className="mx-auto grid min-h-[78vh] max-w-7xl items-center gap-14 px-6 py-24 lg:grid-cols-[1.1fr_0.9fr] lg:px-10">
          <div>
            <div className="mb-7 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.32em] text-[#ccff00]">
              <span className="h-px w-12 bg-[#ccff00]" />
              Collectors Archive
            </div>

            <h1 className="max-w-4xl text-5xl font-black uppercase leading-[0.9] tracking-[-0.055em] sm:text-7xl lg:text-[7.2rem]">
              Tennis
              <span className="block text-[#ccff00]">Memorabilia</span>
            </h1>

            <p className="mt-8 max-w-2xl text-base leading-8 text-white/65 sm:text-lg">
              A curated museum of signed objects, historic equipment and rare
              collectibles that preserve the atmosphere of tennis beyond the
              clothing archive.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#collections"
                className="group inline-flex items-center gap-3 rounded-full bg-[#ccff00] px-7 py-4 text-sm font-black uppercase tracking-[0.16em] text-[#050B18] transition hover:scale-[1.02]"
              >
                Enter the archive
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </a>
              <Link
                href="/shop"
                className="inline-flex items-center rounded-full border border-white/20 px-7 py-4 text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:border-white/50 hover:bg-white/5"
              >
                Visit the shop
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -inset-10 rounded-full bg-[#ccff00]/10 blur-3xl" />
            <div className="relative aspect-square overflow-hidden rounded-[2.5rem] border border-white/15 bg-white/[0.035] p-5 shadow-2xl shadow-black/50 backdrop-blur-xl">
              <div className="flex h-full flex-col justify-between rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_50%_35%,rgba(204,255,0,0.18),transparent_35%),linear-gradient(145deg,rgba(255,255,255,0.06),rgba(255,255,255,0.015))] p-8">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/45">
                      AGE202 Museum Department
                    </p>
                    <p className="mt-2 text-sm uppercase tracking-[0.18em] text-[#ccff00]">
                      Object Registry
                    </p>
                  </div>
                  <Gem className="h-9 w-9 text-[#ccff00]" />
                </div>

                <div className="relative flex flex-1 items-center justify-center">
                  <div className="absolute h-52 w-52 rounded-full border border-[#ccff00]/25" />
                  <div className="absolute h-36 w-36 rounded-full border border-white/15" />
                  <Trophy className="h-28 w-28 text-white/90 drop-shadow-[0_0_30px_rgba(204,255,0,0.25)]" strokeWidth={1.2} />
                </div>

                <div className="grid grid-cols-3 gap-3 border-t border-white/10 pt-5 text-center">
                  <div>
                    <p className="text-xl font-black">AUTH</p>
                    <p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-white/40">Provenance</p>
                  </div>
                  <div className="border-x border-white/10">
                    <p className="text-xl font-black">RARE</p>
                    <p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-white/40">Selection</p>
                  </div>
                  <div>
                    <p className="text-xl font-black">STORY</p>
                    <p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-white/40">Context</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="collections" className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#ccff00]">Archive departments</p>
          <h2 className="mt-5 text-4xl font-black uppercase tracking-[-0.04em] sm:text-6xl">
            Three ways to preserve tennis history.
          </h2>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {collections.map((collection) => {
            const Icon = collection.icon;
            return (
              <article
                key={collection.number}
                className="group relative min-h-[390px] overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] p-8 transition duration-500 hover:-translate-y-2 hover:border-[#ccff00]/45"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${collection.accent} opacity-60`} />
                <div className="relative flex h-full flex-col">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-[0.26em] text-white/40">
                      {collection.eyebrow}
                    </span>
                    <span className="text-sm font-black text-[#ccff00]">{collection.number}</span>
                  </div>
                  <div className="mt-16 flex h-20 w-20 items-center justify-center rounded-2xl border border-white/15 bg-black/15">
                    <Icon className="h-9 w-9 text-[#ccff00]" strokeWidth={1.5} />
                  </div>
                  <h3 className="mt-10 text-3xl font-black uppercase tracking-[-0.035em]">
                    {collection.title}
                  </h3>
                  <p className="mt-4 leading-7 text-white/58">{collection.description}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.025]">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#ccff00]">Featured registry</p>
              <h2 className="mt-5 text-4xl font-black uppercase tracking-[-0.04em] sm:text-6xl">
                Objects waiting for their story.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-7 text-white/50">
              These cards are editorial previews. They do not indicate objects currently for sale or verified ownership.
            </p>
          </div>

          <div className="mt-14 grid gap-5">
            {featuredObjects.map((object) => {
              const Icon = object.icon;
              return (
                <article
                  key={object.archive}
                  className="group grid gap-6 rounded-[1.75rem] border border-white/10 bg-[#08101f] p-6 transition hover:border-[#ccff00]/40 md:grid-cols-[110px_1fr_auto] md:items-center md:p-8"
                >
                  <div className="flex aspect-square items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
                    <Icon className="h-10 w-10 text-[#ccff00]" strokeWidth={1.4} />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold uppercase tracking-[0.24em] text-white/40">
                      <span className="text-[#ccff00]">{object.archive}</span>
                      <span>•</span>
                      <span>{object.category}</span>
                    </div>
                    <h3 className="mt-3 text-2xl font-black uppercase tracking-[-0.025em] sm:text-3xl">
                      {object.title}
                    </h3>
                    <p className="mt-2 text-sm text-white/50">{object.period}</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-white/50">
                    <span className="h-2 w-2 rounded-full bg-[#ccff00] shadow-[0_0_14px_rgba(204,255,0,0.7)]" />
                    {object.status}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#ccff00]">Curatorial standard</p>
            <h2 className="mt-5 text-4xl font-black uppercase tracking-[-0.04em] sm:text-6xl">
              More than an object.
            </h2>
            <p className="mt-7 max-w-lg text-base leading-8 text-white/58">
              AGE202 will treat memorabilia as historical evidence: every piece should explain a player, a tournament, a design era or a moment remembered by the sport.
            </p>
          </div>

          <div className="grid gap-4">
            {principles.map((principle) => {
              const Icon = principle.icon;
              return (
                <div
                  key={principle.title}
                  className="grid gap-5 rounded-[1.5rem] border border-white/10 bg-white/[0.025] p-6 sm:grid-cols-[56px_1fr] sm:items-start sm:p-8"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ccff00]/10">
                    <Icon className="h-6 w-6 text-[#ccff00]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-[-0.02em]">{principle.title}</h3>
                    <p className="mt-3 leading-7 text-white/55">{principle.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-6 pb-24 lg:px-10 lg:pb-32">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] border border-[#ccff00]/30 bg-[#ccff00] p-8 text-[#050B18] sm:p-12 lg:p-16">
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] opacity-60">The archive is growing</p>
              <h2 className="mt-5 max-w-4xl text-4xl font-black uppercase leading-[0.95] tracking-[-0.05em] sm:text-6xl">
                Every great tennis object deserves a permanent record.
              </h2>
            </div>
            <Link
              href="/collaborations"
              className="group inline-flex w-fit items-center gap-3 rounded-full bg-[#050B18] px-7 py-4 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:scale-[1.02]"
            >
              Collaborate with AGE202
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
