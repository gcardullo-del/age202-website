import type { Metadata } from "next";

import Image from "next/image";
import Link from "next/link";

import AboutContactForm from "@/components/about/AboutContactForm";
import Container from "@/components/ui/Container";
import SectionTitle from "@/components/ui/SectionTitle";


export const metadata: Metadata = {
  title: "About AGE202",
  description:
    "Discover AGE202, The Digital Tennis Museum dedicated to preserving, documenting and exploring the past, present and future of tennis.",
  alternates: {
    canonical: "/about",
  },
};


const eras = [
  {
    label: "Past",
    title: "Preserving the game",
    description:
      "Legends, historic tournaments, unforgettable matches and the stories that shaped tennis across generations.",
    href: "/tennis-history",
  },
  {
    label: "Present",
    title: "Following today's tennis",
    description:
      "Players, rankings, tournaments and the evolving stories of the ATP and WTA tours.",
    href: "/players",
  },
  {
    label: "Future",
    title: "Discovering what comes next",
    description:
      "The emerging players, new stories and next generation that will shape the future of the sport.",
    href: "/next-gen",
  },
] as const;


const museumAreas = [
  {
    eyebrow: "Players",
    title: "Champions & Careers",
    description:
      "Explore player profiles, careers, achievements and the stories behind the names that define the game.",
    href: "/players",
  },
  {
    eyebrow: "Tours",
    title: "ATP & WTA Archives",
    description:
      "A living archive of today's professional tours, rankings and players.",
    href: "/players/other-players",
  },
  {
    eyebrow: "History",
    title: "Tennis History",
    description:
      "Moments, anniversaries and stories that belong to the collective memory of tennis.",
    href: "/tennis-history",
  },
  {
    eyebrow: "Legacy",
    title: "Legends",
    description:
      "The champions whose achievements and influence changed the sport forever.",
    href: "/legends",
  },
  {
    eyebrow: "Future",
    title: "Next Gen",
    description:
      "Following the young players who may write the next chapters of tennis history.",
    href: "/next-gen",
  },
  {
    eyebrow: "Museum",
    title: "Artifacts & Memorabilia",
    description:
      "Physical objects, apparel and memorabilia preserved together with the stories that give them meaning.",
    href: "/memorabilia",
  },
] as const;


const values = [
  {
    number: "01",
    title: "Authenticity",
    description:
      "AGE202 values documented, verifiable information and authentic objects. History deserves to be preserved with care.",
  },
  {
    number: "02",
    title: "Context",
    description:
      "A trophy, garment, match or photograph becomes meaningful when its story and historical context are preserved with it.",
  },
  {
    number: "03",
    title: "Independence",
    description:
      "AGE202 is an independent digital museum built around curiosity, research and a genuine passion for tennis.",
  },
  {
    number: "04",
    title: "Preservation",
    description:
      "The goal is not simply to collect information, but to organize it so today's tennis can become tomorrow's history.",
  },
] as const;


export default function AboutPage() {
  return (
    <main className="overflow-hidden bg-[#050B18] text-white">
      {/* HERO */}

      <section className="relative min-h-[78vh] overflow-hidden">
        <Image
          src="/about/about-hero.jpg"
          alt="AGE202 — The Digital Tennis Museum"
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#050B18] via-[#050B18]/80 to-[#050B18]/10" />

        <div className="absolute inset-0 bg-gradient-to-t from-[#050B18] via-transparent to-black/20" />

        <Container className="relative flex min-h-[78vh] items-center py-16 sm:py-20 lg:py-24">
          <div className="max-w-4xl -translate-y-2 sm:-translate-y-3 lg:-translate-y-4">
            <span className="text-[11px] font-black uppercase tracking-[0.35em] text-[#C8FF00] sm:text-sm">
              The Digital Tennis Museum
            </span>

            <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[0.94] tracking-[-0.05em] sm:text-6xl lg:text-7xl xl:text-8xl">
              Preserving Tennis.
              <span className="block text-white">
                One Story at a Time.
              </span>
            </h1>

            <p className="mt-8 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg sm:leading-9">
              AGE202 is an independent digital museum dedicated to preserving,
              documenting and exploring the history, culture and evolution of
              tennis.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-[10px] font-black uppercase tracking-[0.24em] text-white/45">
              <span>Past</span>

              <span className="h-1 w-1 rounded-full bg-[#C8FF00]" />

              <span className="text-[#C8FF00]">
                Present
              </span>

              <span className="h-1 w-1 rounded-full bg-[#C8FF00]" />

              <span>Future</span>
            </div>
          </div>
        </Container>
      </section>


      {/* MISSION */}

      <section className="py-24 sm:py-28 lg:py-32">
        <Container>
  <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#C8FF00]">
                Our Mission
              </p>

              <h2 className="mt-5 text-4xl font-black leading-tight tracking-[-0.04em] sm:text-5xl lg:text-6xl">
                More than
                <span className="block text-white/40">
                  an archive.
                </span>
              </h2>
            </div>

            <div className="max-w-3xl space-y-7 text-base leading-8 text-slate-300 sm:text-lg sm:leading-9">
              <p>
                Tennis history is much more than a list of winners and
                rankings. It lives in the players, tournaments, rivalries,
                objects, photographs and moments that people remember.
              </p>

              <p>
                AGE202 was created to bring those elements together in one
                digital museum — connecting the history of the sport with the
                tennis being played today and the generation that will shape
                tomorrow.
              </p>

              <p>
                From legendary champions to emerging players, from historic
                tournaments to authentic memorabilia, every part of AGE202 is
                designed around the same idea:
                <strong className="font-bold text-white">
                  {" "}
                  every piece of tennis has a story worth preserving.
                </strong>
              </p>
            </div>
          </div>
        </Container>
      </section>


      {/* PAST PRESENT FUTURE */}

      <section className="border-y border-white/10 bg-[#07101F] py-24 sm:py-28 lg:py-32">
        <Container>
          <SectionTitle
            badge="The Museum"
            title="Past. Present. Future."
            description="AGE202 connects the history of tennis with the game being played today and the stories still waiting to be written."
          />

          <div className="mt-14 grid gap-5 lg:grid-cols-3">
            {eras.map((era, index) => (
              <Link
                key={era.label}
                href={era.href}
                className="group relative min-h-[340px] overflow-hidden rounded-[28px] border border-white/10 bg-[#050B18] p-8 transition duration-300 hover:-translate-y-1 hover:border-[#C8FF00]/40 sm:p-10"
              >
                <div className="absolute right-7 top-4 text-[88px] font-black tracking-[-0.08em] text-white/[0.025]">
                  0{index + 1}
                </div>

                <div className="relative flex h-full flex-col">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#C8FF00]">
                    {era.label}
                  </p>

                  <h3 className="mt-8 text-3xl font-black tracking-[-0.04em]">
                    {era.title}
                  </h3>

                  <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">
                    {era.description}
                  </p>

                  <div className="mt-auto pt-10 text-[10px] font-black uppercase tracking-[0.22em] text-white/45 transition group-hover:text-[#C8FF00]">
                    Explore →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>


      {/* VALUES */}

      <section className="py-24 sm:py-28 lg:py-32">
        <Container>
          <SectionTitle
            badge="Our Principles"
            title="What defines AGE202"
            description="A digital museum built around the responsibility of documenting tennis with context, independence and respect for its history."
          />

          <div className="mt-14 grid border-l border-t border-white/10 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div
                key={value.title}
                className="border-b border-r border-white/10 p-8 sm:p-10"
              >
                <p className="text-xs font-black tracking-[0.2em] text-[#C8FF00]">
                  {value.number}
                </p>

                <h3 className="mt-12 text-2xl font-black tracking-[-0.03em]">
                  {value.title}
                </h3>

                <p className="mt-5 text-sm leading-7 text-slate-400">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>


      {/* INSIDE THE MUSEUM */}

      <section className="bg-[#07101F] py-24 sm:py-28 lg:py-32">
        <Container>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <SectionTitle
              badge="Explore"
              title="Inside the Museum"
              description="Different doors into the same story: the world of tennis."
            />

            <Link
              href="/#explore-the-museum"
              className="mb-2 inline-flex w-fit items-center text-[10px] font-black uppercase tracking-[0.22em] text-[#C8FF00] transition hover:text-white"
            >
              Explore all AGE202 →
            </Link>
          </div>

          <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {museumAreas.map((area) => (
              <Link
                key={area.title}
                href={area.href}
                className="group rounded-[24px] border border-white/10 bg-[#050B18] p-7 transition duration-300 hover:border-[#C8FF00]/40 sm:p-8"
              >
                <p className="text-[9px] font-black uppercase tracking-[0.28em] text-[#C8FF00]">
                  {area.eyebrow}
                </p>

                <div className="mt-8 flex items-end justify-between gap-6">
                  <h3 className="text-2xl font-black tracking-[-0.03em]">
                    {area.title}
                  </h3>

                  <span className="shrink-0 text-lg text-white/30 transition group-hover:translate-x-1 group-hover:text-[#C8FF00]">
                    →
                  </span>
                </div>

                <p className="mt-5 text-sm leading-7 text-slate-400">
                  {area.description}
                </p>
              </Link>
            ))}
          </div>
        </Container>
      </section>


      {/* STATEMENT */}

      <section className="py-24 sm:py-28 lg:py-36">
        <Container>
          <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#08101F] px-7 py-16 sm:px-12 sm:py-20 lg:px-20 lg:py-24">
            <div className="absolute -right-20 -top-32 h-80 w-80 rounded-full bg-[#C8FF00]/[0.05] blur-3xl" />

            <div className="relative max-w-5xl">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#C8FF00]">
                Why AGE202
              </p>

              <blockquote className="mt-8 text-3xl font-black leading-tight tracking-[-0.04em] text-white sm:text-4xl lg:text-6xl">
                “Today&apos;s tennis is
                <span className="text-white/40">
                  {" "}
                  tomorrow&apos;s history.
                </span>
                ”
              </blockquote>

              <p className="mt-8 max-w-2xl text-base leading-8 text-slate-400">
                AGE202 documents yesterday, follows today and preserves the
                stories that future generations may want to rediscover.
              </p>
            </div>
          </div>
        </Container>
      </section>


      {/* CONTACT */}

      <section className="border-y border-white/10 bg-[#07101F] py-24 sm:py-28 lg:py-32">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#C8FF00]">
                Get in Touch
              </p>

              <h2 className="mt-5 text-4xl font-black leading-tight tracking-[-0.04em] sm:text-5xl lg:text-6xl">
                Be part of
                <span className="block text-white/40">
                  the museum.
                </span>
              </h2>

              <p className="mt-7 max-w-lg text-base leading-8 text-slate-400">
                AGE202 grows through stories, objects, memories and
                contributions from the tennis community.
              </p>

              <div className="mt-10 border-t border-white/10 pt-8">
                <p className="text-[9px] font-black uppercase tracking-[0.24em] text-white/35">
                  Direct Contact
                </p>

                <a
                  href="mailto:curator@age202.com"
                  className="mt-3 inline-block text-lg font-bold text-white transition hover:text-[#C8FF00]"
                >
                  curator@age202.com
                </a>
              </div>

              <div className="mt-8 border-t border-white/10 pt-8">
                <p className="text-sm leading-7 text-white/40">
                  Players, representatives, collectors, clubs, media and
                  tennis organizations are welcome to contact the museum.
                </p>
              </div>
            </div>


            <div className="rounded-[28px] border border-white/10 bg-[#050B18] p-6 sm:p-8 lg:p-10">
              <div className="mb-8">
                <p className="text-[9px] font-black uppercase tracking-[0.24em] text-[#C8FF00]">
                  Contact AGE202
                </p>

                <h3 className="mt-3 text-2xl font-black tracking-[-0.03em] sm:text-3xl">
                  Tell us your story.
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-400">
                  Choose the reason for your message and get in touch with the
                  museum.
                </p>
              </div>

              <AboutContactForm />
            </div>
          </div>
        </Container>
      </section>


      {/* CTA */}

      <section className="py-24 sm:py-28 lg:py-32">
        <Container>
          <div className="border-t border-white/10 pt-20 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#C8FF00]">
              Continue Exploring
            </p>

            <h2 className="mx-auto mt-6 max-w-4xl text-4xl font-black leading-tight tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              Tennis history is still
              <span className="block text-white/40">
                being written.
              </span>
            </h2>

            <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-slate-400">
              Explore the players, tournaments, stories and objects preserved
              inside The Digital Tennis Museum.
            </p>

            <Link
              href="/#explore-the-museum"
              className="mt-10 inline-flex items-center justify-center rounded-full bg-[#C8FF00] px-8 py-4 text-xs font-black uppercase tracking-[0.2em] text-[#050B18] transition hover:scale-[1.02] hover:bg-white"
            >
              Explore the Museum →
            </Link>
          </div>
        </Container>
      </section>
    </main>
  );
}