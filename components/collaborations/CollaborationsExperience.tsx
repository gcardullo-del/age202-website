import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Camera,
  CircleCheck,
  Handshake,
  HeartHandshake,
  Landmark,
  Megaphone,
  Network,
  Palette,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";

const partnershipAreas = [
  {
    number: "01",
    title: "Tennis Brands",
    eyebrow: "Product & heritage",
    description:
      "Editorial projects with brands whose archives, design language and sporting history deserve a museum-quality presentation.",
    icon: Trophy,
  },
  {
    number: "02",
    title: "Clubs & Events",
    eyebrow: "Community & court",
    description:
      "Collaborations with tennis clubs, academies and tournaments to document local stories and create memorable cultural activations.",
    icon: Landmark,
  },
  {
    number: "03",
    title: "Creative Studios",
    eyebrow: "Image & storytelling",
    description:
      "Partnerships with photographers, filmmakers, designers and writers who can reinterpret the visual culture of tennis.",
    icon: Camera,
  },
  {
    number: "04",
    title: "Collectors",
    eyebrow: "Objects & provenance",
    description:
      "Curated projects with collectors who want to preserve, contextualise and share significant apparel or memorabilia.",
    icon: Users,
  },
];

const projectFormats = [
  {
    title: "Archive Stories",
    text: "Editorial features built around a garment, athlete, tournament or design era.",
    icon: Building2,
  },
  {
    title: "Limited Capsules",
    text: "Small, purposeful releases that connect contemporary design with tennis heritage.",
    icon: Palette,
  },
  {
    title: "Exhibitions & Pop-ups",
    text: "Physical or digital displays designed for clubs, events and cultural spaces.",
    icon: Sparkles,
  },
  {
    title: "Campaign Content",
    text: "Photography, short films and social narratives with a strong archival point of view.",
    icon: Megaphone,
  },
];

const principles = [
  "A genuine connection to tennis culture",
  "Clear provenance and honest storytelling",
  "Premium visual and editorial standards",
  "Projects with long-term cultural value",
];

export default function CollaborationsExperience() {
  return (
    <main className="overflow-hidden bg-[#050B18] text-white">
      <section className="relative isolate min-h-[80vh] border-b border-white/10">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_78%_22%,rgba(204,255,0,0.17),transparent_30%),radial-gradient(circle_at_18%_82%,rgba(59,130,246,0.13),transparent_34%),linear-gradient(135deg,#050B18_0%,#0B132B_54%,#07101f_100%)]" />
        <div className="absolute inset-0 -z-10 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] [background-size:68px_68px]" />

        <div className="mx-auto grid min-h-[80vh] max-w-7xl items-center gap-16 px-6 py-24 lg:grid-cols-[1.04fr_0.96fr] lg:px-10">
          <div>
            <div className="mb-7 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.32em] text-[#ccff00]">
              <span className="h-px w-12 bg-[#ccff00]" />
              Partners in tennis culture
            </div>

            <h1 className="max-w-5xl text-5xl font-black uppercase leading-[0.88] tracking-[-0.055em] sm:text-7xl lg:text-[7rem]">
              Built through
              <span className="block text-[#ccff00]">Collaboration</span>
            </h1>

            <p className="mt-8 max-w-2xl text-base leading-8 text-white/65 sm:text-lg">
              AGE202 partners with brands, clubs, creators and collectors to
              preserve tennis history and transform it into meaningful new
              experiences.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#partner"
                className="group inline-flex items-center gap-3 rounded-full bg-[#ccff00] px-7 py-4 text-sm font-black uppercase tracking-[0.16em] text-[#050B18] transition hover:scale-[1.02]"
              >
                Become a partner
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </a>
              <Link
                href="/memorabilia"
                className="inline-flex items-center rounded-full border border-white/20 px-7 py-4 text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:border-white/50 hover:bg-white/5"
              >
                Explore memorabilia
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -inset-12 rounded-full bg-[#ccff00]/10 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2.5rem] border border-white/15 bg-white/[0.035] p-5 shadow-2xl shadow-black/50 backdrop-blur-xl">
              <div className="rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_50%_32%,rgba(204,255,0,0.2),transparent_36%),linear-gradient(145deg,rgba(255,255,255,0.07),rgba(255,255,255,0.015))] p-8 sm:p-10">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/45">
                      AGE202 Partnership Office
                    </p>
                    <p className="mt-2 text-sm uppercase tracking-[0.18em] text-[#ccff00]">
                      Shared vision · lasting value
                    </p>
                  </div>
                  <Handshake className="h-9 w-9 text-[#ccff00]" />
                </div>

                <div className="relative flex min-h-[330px] items-center justify-center">
                  <div className="absolute h-60 w-60 rounded-full border border-[#ccff00]/20" />
                  <div className="absolute h-44 w-44 rounded-full border border-white/15" />
                  <div className="absolute h-28 w-28 rounded-full bg-[#ccff00]/10 blur-xl" />
                  <Network
                    className="relative h-32 w-32 text-white/90 drop-shadow-[0_0_34px_rgba(204,255,0,0.25)]"
                    strokeWidth={1.15}
                  />
                </div>

                <div className="grid grid-cols-3 gap-3 border-t border-white/10 pt-5 text-center">
                  <div>
                    <p className="text-lg font-black">CULTURE</p>
                    <p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-white/40">Purpose</p>
                  </div>
                  <div className="border-x border-white/10">
                    <p className="text-lg font-black">CRAFT</p>
                    <p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-white/40">Quality</p>
                  </div>
                  <div>
                    <p className="text-lg font-black">LEGACY</p>
                    <p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-white/40">Impact</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#ccff00]">
            Partnership areas
          </p>
          <h2 className="mt-5 text-4xl font-black uppercase tracking-[-0.04em] sm:text-6xl">
            Different expertise. One shared court.
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {partnershipAreas.map((area) => {
            const Icon = area.icon;
            return (
              <article
                key={area.number}
                className="group relative min-h-[360px] overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 transition duration-500 hover:-translate-y-2 hover:border-[#ccff00]/45 sm:p-10"
              >
                <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-[#ccff00]/8 blur-3xl transition group-hover:bg-[#ccff00]/15" />
                <div className="relative flex h-full flex-col">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-[0.26em] text-white/40">
                      {area.eyebrow}
                    </span>
                    <span className="text-sm font-black text-[#ccff00]">{area.number}</span>
                  </div>
                  <div className="mt-14 flex h-20 w-20 items-center justify-center rounded-2xl border border-white/15 bg-black/15">
                    <Icon className="h-9 w-9 text-[#ccff00]" strokeWidth={1.5} />
                  </div>
                  <h3 className="mt-9 text-3xl font-black uppercase tracking-[-0.035em] sm:text-4xl">
                    {area.title}
                  </h3>
                  <p className="mt-4 max-w-xl leading-7 text-white/58">{area.description}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.025]">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
          <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#ccff00]">
                Project formats
              </p>
              <h2 className="mt-5 text-4xl font-black uppercase tracking-[-0.04em] sm:text-6xl">
                Ideas made tangible.
              </h2>
              <p className="mt-7 max-w-lg text-base leading-8 text-white/58">
                Every collaboration can take a different shape, but each one
                should add genuine value to the story and future of tennis.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {projectFormats.map((format) => {
                const Icon = format.icon;
                return (
                  <article
                    key={format.title}
                    className="rounded-[1.6rem] border border-white/10 bg-[#08101f] p-7 transition hover:border-[#ccff00]/35"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ccff00]/10">
                      <Icon className="h-6 w-6 text-[#ccff00]" />
                    </div>
                    <h3 className="mt-7 text-xl font-black uppercase tracking-[-0.02em]">
                      {format.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-white/52">{format.text}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <div className="grid gap-12 rounded-[2.5rem] border border-white/10 bg-[radial-gradient(circle_at_85%_20%,rgba(204,255,0,0.12),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.055),rgba(255,255,255,0.018))] p-8 sm:p-12 lg:grid-cols-[1fr_0.9fr] lg:p-16">
          <div>
            <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-[#ccff00]">
              <HeartHandshake className="h-5 w-5" />
              Our partnership standard
            </div>
            <h2 className="mt-6 text-4xl font-black uppercase tracking-[-0.04em] sm:text-6xl">
              Alignment before visibility.
            </h2>
            <p className="mt-6 max-w-2xl leading-8 text-white/58">
              AGE202 is selective by design. The strongest partnerships are
              built around shared values, credible stories and respect for the
              culture of the sport.
            </p>
          </div>

          <div className="grid gap-4">
            {principles.map((principle) => (
              <div
                key={principle}
                className="flex items-center gap-4 rounded-2xl border border-white/10 bg-black/15 px-5 py-4"
              >
                <CircleCheck className="h-5 w-5 shrink-0 text-[#ccff00]" />
                <span className="text-sm font-semibold text-white/75">{principle}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="partner" className="border-t border-white/10 bg-[#08101f]">
        <div className="mx-auto max-w-7xl px-6 py-24 text-center lg:px-10 lg:py-32">
          <Handshake className="mx-auto h-12 w-12 text-[#ccff00]" strokeWidth={1.3} />
          <p className="mt-7 text-xs font-bold uppercase tracking-[0.3em] text-[#ccff00]">
            Start a conversation
          </p>
          <h2 className="mx-auto mt-5 max-w-4xl text-4xl font-black uppercase tracking-[-0.04em] sm:text-6xl">
            Let&apos;s create something tennis will remember.
          </h2>
          <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-white/58">
            The contact workflow will be connected in a future sprint. For now,
            this page defines the official AGE202 partnership vision and the
            kinds of projects the brand is ready to explore.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/about"
              className="group inline-flex items-center gap-3 rounded-full bg-[#ccff00] px-7 py-4 text-sm font-black uppercase tracking-[0.16em] text-[#050B18] transition hover:scale-[1.02]"
            >
              Discover AGE202
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center rounded-full border border-white/20 px-7 py-4 text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:border-white/50 hover:bg-white/5"
            >
              Visit the archive shop
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
