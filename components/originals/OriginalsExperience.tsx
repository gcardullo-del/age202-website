"use client";

import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CircleDot,
  Droplets,
  KeyRound,
  Layers3,
  PackageCheck,
  ShieldCheck,
  Shirt,
  Sparkles,
  Star,
} from "lucide-react";

const collections = [
  {
    number: "01",
    title: "Court Essentials",
    subtitle: "Performance-inspired everyday pieces",
    description:
      "Clean silhouettes, premium fabrics and subtle tennis references designed for life on and beyond the court.",
    items: ["Signature T-shirt", "Museum Hoodie", "Court Cap"],
    icon: Shirt,
  },
  {
    number: "02",
    title: "Museum Objects",
    subtitle: "Functional pieces with collector character",
    description:
      "Objects created as extensions of the AGE202 archive: useful, recognisable and made to belong in a tennis collection.",
    items: ["Archive Bottle", "Numbered Keychain", "Collector Tote"],
    icon: Layers3,
  },
  {
    number: "03",
    title: "Limited Editions",
    subtitle: "Small runs, numbered releases",
    description:
      "Special drops inspired by iconic tennis eras, surfaces and tournaments, produced in deliberately limited quantities.",
    items: ["Seasonal capsule", "Numbered packaging", "Certificate card"],
    icon: Sparkles,
  },
];

const principles = [
  {
    title: "Museum-led design",
    description: "Every release begins with tennis history, archive culture and the AGE202 visual identity.",
    icon: Star,
  },
  {
    title: "Considered production",
    description: "Focused collections and measured quantities instead of constant, disposable releases.",
    icon: PackageCheck,
  },
  {
    title: "Recognisable details",
    description: "Archive numbers, court lines and the AGE202 lime accent become signatures across the range.",
    icon: CircleDot,
  },
  {
    title: "Collector integrity",
    description: "Limited products can include numbered presentation and provenance details where appropriate.",
    icon: ShieldCheck,
  },
];

const previewProducts = [
  {
    label: "CORE 001",
    name: "The Archive Tee",
    category: "Premium T-shirt",
    status: "Coming soon",
    icon: Shirt,
  },
  {
    label: "COURT 002",
    name: "Centre Court Cap",
    category: "Embroidered cap",
    status: "In development",
    icon: BadgeCheck,
  },
  {
    label: "OBJECT 003",
    name: "Baseline Bottle",
    category: "Reusable bottle",
    status: "Coming soon",
    icon: Droplets,
  },
  {
    label: "ARCHIVE 004",
    name: "Museum Key",
    category: "Numbered keychain",
    status: "Concept edition",
    icon: KeyRound,
  },
];

export default function OriginalsExperience() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#071022] text-white">
      <section className="relative isolate border-b border-white/10 px-5 pb-20 pt-28 sm:px-8 lg:px-12 lg:pb-28 lg:pt-36">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_70%_28%,rgba(204,255,0,0.13),transparent_24%),radial-gradient(circle_at_18%_80%,rgba(36,99,235,0.14),transparent_28%),linear-gradient(135deg,#071022_0%,#0b1630_48%,#060b17_100%)]" />
        <div className="absolute inset-0 -z-10 opacity-[0.12] [background-image:linear-gradient(rgba(255,255,255,.25)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.25)_1px,transparent_1px)] [background-size:64px_64px]" />

        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
          <div>
            <div className="mb-7 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.32em] text-[#ccff00]">
              <span className="h-px w-10 bg-[#ccff00]" />
              Official AGE202 collection
            </div>
            <h1 className="max-w-4xl text-5xl font-black uppercase leading-[0.9] tracking-[-0.055em] sm:text-7xl lg:text-[7.2rem]">
              Originals
              <span className="block text-[#ccff00]">Made for the archive.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-base leading-8 text-white/65 sm:text-lg">
              Apparel and objects created around the identity of the AGE202 digital tennis museum. Contemporary design, tennis memory and collector culture in one official line.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#collection-preview"
                className="inline-flex items-center gap-3 rounded-full bg-[#ccff00] px-7 py-4 text-sm font-black uppercase tracking-[0.16em] text-[#071022] transition hover:scale-[1.02] hover:bg-white"
              >
                Preview the collection <ArrowRight size={17} />
              </a>
              <Link
                href="/shop"
                className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/[0.04] px-7 py-4 text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:border-[#ccff00]/60 hover:bg-white/[0.08]"
              >
                Visit the shop
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -inset-10 rounded-full bg-[#ccff00]/10 blur-3xl" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2.2rem] border border-white/15 bg-white/[0.04] shadow-2xl shadow-black/40">
              <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,.10),transparent_36%),radial-gradient(circle_at_60%_35%,rgba(204,255,0,.20),transparent_24%),linear-gradient(160deg,#17243d,#071022_72%)]" />
              <div className="absolute inset-x-8 top-8 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.26em] text-white/45">
                <span>Official collection</span>
                <span>Est. 2026</span>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative flex h-64 w-64 items-center justify-center rounded-full border border-[#ccff00]/35 bg-black/20 shadow-[0_0_80px_rgba(204,255,0,.12)] sm:h-72 sm:w-72">
                  <div className="absolute inset-5 rounded-full border border-dashed border-white/20" />
                  <div className="text-center">
                    <div className="text-6xl font-black tracking-[-0.08em] sm:text-7xl">AGE</div>
                    <div className="-mt-2 text-7xl font-black tracking-[-0.08em] text-[#ccff00] sm:text-8xl">202</div>
                    <div className="mt-3 text-[9px] font-bold uppercase tracking-[0.38em] text-white/55">Originals</div>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-8 left-8 right-8 grid grid-cols-3 gap-2">
                {["Design", "Tennis", "Culture"].map((item) => (
                  <div key={item} className="rounded-full border border-white/10 bg-black/20 px-3 py-2 text-center text-[9px] font-bold uppercase tracking-[0.18em] text-white/55 backdrop-blur">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#ccff00]">The collection system</p>
            <h2 className="mt-4 text-4xl font-black uppercase tracking-[-0.04em] sm:text-6xl">Three worlds. One identity.</h2>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {collections.map((collection) => {
              const Icon = collection.icon;
              return (
                <article key={collection.title} className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] p-7 transition duration-300 hover:-translate-y-1 hover:border-[#ccff00]/40 sm:p-9">
                  <div className="absolute right-5 top-2 text-8xl font-black tracking-[-0.08em] text-white/[0.035]">{collection.number}</div>
                  <div className="relative">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ccff00] text-[#071022]">
                      <Icon size={22} strokeWidth={2.3} />
                    </div>
                    <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.25em] text-[#ccff00]">{collection.subtitle}</p>
                    <h3 className="mt-3 text-3xl font-black uppercase tracking-[-0.035em]">{collection.title}</h3>
                    <p className="mt-5 leading-7 text-white/58">{collection.description}</p>
                    <div className="mt-8 space-y-3 border-t border-white/10 pt-6">
                      {collection.items.map((item) => (
                        <div key={item} className="flex items-center gap-3 text-sm text-white/72">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#ccff00]" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="collection-preview" className="border-y border-white/10 bg-white/[0.025] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#ccff00]">First release preview</p>
              <h2 className="mt-4 text-4xl font-black uppercase tracking-[-0.04em] sm:text-6xl">The opening set</h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-white/55">
              A concept preview of the first AGE202 Originals product families. Product names and release details may evolve before launch.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {previewProducts.map((product, index) => {
              const Icon = product.icon;
              return (
                <article key={product.name} className="group overflow-hidden rounded-[1.7rem] border border-white/10 bg-[#09142a]">
                  <div className="relative aspect-square overflow-hidden bg-[radial-gradient(circle_at_50%_40%,rgba(204,255,0,.16),transparent_30%),linear-gradient(145deg,#14213b,#071022)]">
                    <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.16)_1px,transparent_1px)] [background-size:32px_32px]" />
                    <div className="absolute left-5 top-5 rounded-full border border-white/10 bg-black/20 px-3 py-2 text-[9px] font-black tracking-[0.2em] text-[#ccff00] backdrop-blur">
                      {product.label}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex h-32 w-32 items-center justify-center rounded-full border border-[#ccff00]/30 bg-black/20 transition duration-500 group-hover:scale-110 group-hover:border-[#ccff00]/70">
                        <Icon size={54} strokeWidth={1.25} className="text-white/82" />
                      </div>
                    </div>
                    <div className="absolute bottom-5 right-5 text-7xl font-black tracking-[-0.08em] text-white/[0.045]">0{index + 1}</div>
                  </div>
                  <div className="p-6">
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/40">{product.category}</p>
                    <h3 className="mt-2 text-xl font-black uppercase tracking-[-0.025em]">{product.name}</h3>
                    <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                      <span className="text-xs font-semibold text-[#ccff00]">{product.status}</span>
                      <ArrowRight size={16} className="text-white/35 transition group-hover:translate-x-1 group-hover:text-[#ccff00]" />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[.78fr_1.22fr] lg:items-start">
            <div className="lg:sticky lg:top-28">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#ccff00]">Our design code</p>
              <h2 className="mt-4 text-4xl font-black uppercase tracking-[-0.04em] sm:text-6xl">Not merchandise. Museum extensions.</h2>
              <p className="mt-6 max-w-xl leading-8 text-white/58">
                AGE202 Originals is conceived as a coherent design programme. Each object should feel connected to the archive, carry its own story and remain relevant beyond one season.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {principles.map((principle) => {
                const Icon = principle.icon;
                return (
                  <div key={principle.title} className="rounded-[1.6rem] border border-white/10 bg-white/[0.035] p-7">
                    <Icon size={24} className="text-[#ccff00]" />
                    <h3 className="mt-6 text-xl font-black uppercase tracking-[-0.02em]">{principle.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-white/55">{principle.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 pb-24 sm:px-8 lg:px-12 lg:pb-32">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2.2rem] border border-[#ccff00]/25 bg-[radial-gradient(circle_at_80%_20%,rgba(204,255,0,.14),transparent_28%),linear-gradient(135deg,#101d36,#071022)] p-8 sm:p-12 lg:p-16">
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#ccff00]">Release programme</p>
              <h2 className="mt-4 max-w-4xl text-4xl font-black uppercase tracking-[-0.045em] sm:text-6xl">The first AGE202 Originals drop is being curated.</h2>
              <p className="mt-6 max-w-2xl leading-8 text-white/58">
                This page is now ready to become the official launch destination when products, photography, pricing and availability are finalised.
              </p>
            </div>
            <Link
              href="/shop"
              className="inline-flex w-fit items-center gap-3 rounded-full bg-[#ccff00] px-7 py-4 text-sm font-black uppercase tracking-[0.16em] text-[#071022] transition hover:bg-white"
            >
              Explore AGE202 <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
