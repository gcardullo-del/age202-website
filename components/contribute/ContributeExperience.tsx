import Link from "next/link";

import {
  Archive,
  ArrowRight,
  Camera,
  CircleCheck,
  Gift,
  HeartHandshake,
  Mail,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  Star,
  UserRound,
} from "lucide-react";


const contactEmail =
  "postmaster@age202.com";

const contributionMailto =
  `mailto:${contactEmail}?subject=${encodeURIComponent(
    "AGE202 Museum Contribution",
  )}`;


const contributionTypes = [
  {
    number: "01",
    eyebrow: "Direct voice",
    title: "Video Greeting",
    description:
      "A short video message for AGE202 can become a direct testimony preserved inside the museum's digital archive.",
    icon: Camera,
  },
  {
    number: "02",
    eyebrow: "Personal message",
    title: "Dedication",
    description:
      "A signed photograph, personal message or digital dedication can preserve a unique connection between the player and tennis history.",
    icon: MessageSquareText,
  },
  {
    number: "03",
    eyebrow: "Physical history",
    title: "Memorabilia",
    description:
      "A signed item, match-related object or personal piece can be documented, catalogued and preserved together with its story.",
    icon: Archive,
  },
];


export default function ContributeExperience() {
  return (
    <main className="overflow-hidden bg-[#050B18] text-white">
      <section className="relative isolate min-h-[80vh] overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 -z-30 bg-[linear-gradient(135deg,#050B18_0%,#0A1427_48%,#07101f_100%)]" />

        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_78%_20%,rgba(204,255,0,.16),transparent_28%),radial-gradient(circle_at_14%_82%,rgba(59,130,246,.10),transparent_32%)]" />

        <div className="absolute inset-0 -z-10 opacity-25 [background-image:linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] [background-size:72px_72px]" />

        <div className="pointer-events-none absolute left-1/2 top-0 h-px w-[72%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#ccff00]/45 to-transparent" />


        <div className="mx-auto grid min-h-[80vh] max-w-7xl items-center gap-16 px-6 py-24 lg:grid-cols-[1.02fr_.98fr] lg:px-10">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-12 bg-[#ccff00]" />

              <p className="text-[10px] font-black uppercase tracking-[.3em] text-[#ccff00]">
                AGE202 · The Digital Tennis Museum
              </p>
            </div>

            <h1 className="mt-7 max-w-5xl text-5xl font-black uppercase leading-[.86] tracking-[-.06em] sm:text-7xl lg:text-[7rem]">
              Contribute to
              <span className="block text-[#ccff00]">
                the museum.
              </span>
            </h1>

            <p className="mt-8 max-w-2xl text-base leading-8 text-white/60 sm:text-lg">
              Tennis history is made of more than trophies and results.
              It lives through voices, memories, objects and personal stories.
              AGE202 invites players and former players to preserve a direct
              testimony of their journey.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#contribute"
                className="group inline-flex items-center gap-3 rounded-full bg-[#ccff00] px-7 py-4 text-[10px] font-black uppercase tracking-[.18em] text-[#050B18] transition duration-300 hover:scale-[1.025]"
              >
                Discover how to contribute

                <ArrowRight className="h-4 w-4 transition duration-300 group-hover:translate-x-1" />
              </a>

              <a
                href="#provenance"
                className="group inline-flex items-center gap-3 rounded-full border border-white/20 px-7 py-4 text-[10px] font-black uppercase tracking-[.18em] text-white transition duration-300 hover:border-[#ccff00]/40 hover:bg-white/[.04]"
              >
                Museum provenance

                <ArrowRight className="h-4 w-4 text-white/35 transition duration-300 group-hover:translate-x-1 group-hover:text-[#ccff00]" />
              </a>
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/10 pt-5">
              <div className="flex items-center gap-2">
                <Sparkles
                  size={13}
                  className="text-[#ccff00]"
                />

                <span className="text-[8px] font-black uppercase tracking-[.22em] text-white/30">
                  Players · Legends · Teams
                </span>
              </div>

              <span className="hidden h-3 w-px bg-white/10 sm:block" />

              <span className="text-[8px] font-black uppercase tracking-[.22em] text-white/20">
                Voice · Story · Provenance
              </span>
            </div>
          </div>


          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -inset-14 rounded-full bg-[#ccff00]/10 blur-3xl" />

            <div className="relative overflow-hidden rounded-[2.7rem] border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,.05),rgba(255,255,255,.015))] p-5 shadow-[0_30px_100px_rgba(0,0,0,.38)] backdrop-blur-xl">
              <div className="relative overflow-hidden rounded-[2.1rem] border border-white/10 bg-[#071020] p-8 sm:p-10">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_34%,rgba(204,255,0,.18),transparent_34%)]" />

                <div className="relative flex items-start justify-between gap-6">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[.28em] text-white/35">
                      AGE202 Contribution Programme
                    </p>

                    <p className="mt-2 text-[10px] font-black uppercase tracking-[.22em] text-[#ccff00]">
                      Direct from the player
                    </p>
                  </div>

                  <div className="grid h-12 w-12 place-items-center rounded-full border border-[#ccff00]/25 bg-[#ccff00]/[.06]">
                    <UserRound
                      className="h-5 w-5 text-[#ccff00]"
                      strokeWidth={1.4}
                    />
                  </div>
                </div>


                <div className="relative mt-10 flex min-h-[300px] items-center justify-center">
                  <div className="absolute h-64 w-64 rounded-full border border-[#ccff00]/15" />
                  <div className="absolute h-48 w-48 rounded-full border border-white/10" />
                  <div className="absolute h-32 w-32 rounded-full border border-[#ccff00]/10" />
                  <div className="absolute h-24 w-24 rounded-full bg-[#ccff00]/10 blur-2xl" />

                  <Gift
                    className="relative h-28 w-28 text-white/90 drop-shadow-[0_0_38px_rgba(204,255,0,.22)]"
                    strokeWidth={1.1}
                  />

                  <div className="absolute left-5 top-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-[#050B18]/75 px-3 py-2 backdrop-blur">
                    <span className="text-[8px] font-black uppercase tracking-[.18em] text-white/35">
                      Voice
                    </span>
                  </div>

                  <div className="absolute right-5 top-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-[#050B18]/75 px-3 py-2 backdrop-blur">
                    <span className="text-[8px] font-black uppercase tracking-[.18em] text-white/35">
                      Objects
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-[#ccff00]/20 bg-[#050B18]/80 px-3 py-2 backdrop-blur">
                    <span className="text-[8px] font-black uppercase tracking-[.18em] text-[#ccff00]">
                      Legacy
                    </span>
                  </div>
                </div>


                <div className="relative mt-8 grid grid-cols-3 gap-3 border-t border-white/10 pt-5 text-center">
                  <div>
                    <p className="text-base font-black uppercase tracking-[-.02em] text-white">
                      Video
                    </p>

                    <p className="mt-1 text-[8px] font-black uppercase tracking-[.18em] text-white/25">
                      Voice
                    </p>
                  </div>

                  <div className="border-x border-white/10">
                    <p className="text-base font-black uppercase tracking-[-.02em] text-white">
                      Dedication
                    </p>

                    <p className="mt-1 text-[8px] font-black uppercase tracking-[.18em] text-white/25">
                      Message
                    </p>
                  </div>

                  <div>
                    <p className="text-base font-black uppercase tracking-[-.02em] text-white">
                      Object
                    </p>

                    <p className="mt-1 text-[8px] font-black uppercase tracking-[.18em] text-white/25">
                      History
                    </p>
                  </div>
                </div>


                <div className="relative mt-6 flex items-center justify-between border-t border-white/[.06] pt-5">
                  <span className="text-[8px] font-black uppercase tracking-[.2em] text-white/20">
                    Museum contribution
                  </span>

                  <span className="font-mono text-[9px] font-black tracking-[.18em] text-[#ccff00]/70">
                    AGE202 / 2026
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      <section
        id="contribute"
        className="relative overflow-hidden border-b border-white/10"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_14%,rgba(59,130,246,.055),transparent_30%),radial-gradient(circle_at_88%_18%,rgba(204,255,0,.065),transparent_28%)]" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-[.72fr_1.28fr] lg:items-end">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-[#ccff00]" />

                <p className="text-[10px] font-black uppercase tracking-[.3em] text-[#ccff00]">
                  Three ways to contribute
                </p>
              </div>

              <h2 className="mt-6 max-w-xl text-4xl font-black uppercase leading-[.9] tracking-[-.05em] sm:text-6xl">
                Every contribution
                <span className="block text-[#ccff00]">
                  tells a story.
                </span>
              </h2>
            </div>

            <div className="lg:pb-1">
              <p className="max-w-2xl text-base leading-8 text-white/55">
                A contribution does not need to be a valuable object.
                A few words, a signature or a short memory can preserve
                something that would otherwise disappear.
              </p>

              <div className="mt-6 flex items-center gap-3 text-[8px] font-black uppercase tracking-[.22em] text-white/25">
                <Sparkles
                  size={13}
                  className="text-[#ccff00]"
                />

                Three formats · One museum archive
              </div>
            </div>
          </div>


          <div className="mt-16 grid gap-4 lg:grid-cols-3">
            {contributionTypes.map(
              (
                contribution,
              ) => {
                const Icon =
                  contribution.icon;

                return (
                  <article
                    key={
                      contribution.number
                    }
                    className="group relative min-h-[360px] overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,.035),rgba(255,255,255,.015))] p-7 transition duration-500 hover:-translate-y-1 hover:border-[#ccff00]/35 sm:p-8"
                  >
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(204,255,0,.085),transparent_32%)] opacity-70 transition duration-500 group-hover:opacity-100" />

                    <div className="relative flex h-full flex-col">
                      <div className="flex items-start justify-between gap-5">
                        <div>
                          <p className="text-[8px] font-black uppercase tracking-[.24em] text-[#ccff00]">
                            {contribution.eyebrow}
                          </p>

                          <p className="mt-2 text-[8px] font-bold uppercase tracking-[.18em] text-white/25">
                            AGE202 Contribution
                          </p>
                        </div>

                        <span className="font-mono text-[10px] font-black tracking-[.22em] text-[#ccff00]/75">
                          {contribution.number}
                        </span>
                      </div>

                      <div className="mt-10 grid h-14 w-14 place-items-center rounded-2xl border border-[#ccff00]/20 bg-[#ccff00]/[.06]">
                        <Icon
                          className="h-6 w-6 text-[#ccff00]"
                          strokeWidth={1.5}
                        />
                      </div>

                      <h3 className="mt-8 text-2xl font-black uppercase leading-[.95] tracking-[-.035em] sm:text-3xl">
                        {contribution.title}
                      </h3>

                      <p className="mt-4 text-sm leading-7 text-white/48">
                        {contribution.description}
                      </p>

                      <div className="mt-auto pt-8">
                        <div className="h-px w-full bg-gradient-to-r from-white/10 via-white/[.06] to-transparent" />
                      </div>
                    </div>
                  </article>
                );
              },
            )}
          </div>
        </div>
      </section>


      <section
        id="provenance"
        className="relative overflow-hidden border-b border-white/10"
      >
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#050B18_0%,#07101F_100%)]" />

        <div className="relative mx-auto grid max-w-7xl gap-16 px-6 py-24 lg:grid-cols-[.8fr_1.2fr] lg:items-center lg:px-10 lg:py-32">
          <div>
            <div className="grid h-14 w-14 place-items-center rounded-2xl border border-[#ccff00]/20 bg-[#ccff00]/[.06]">
              <ShieldCheck
                className="h-6 w-6 text-[#ccff00]"
                strokeWidth={1.5}
              />
            </div>

            <div className="mt-8 flex items-center gap-3">
              <span className="h-px w-10 bg-[#ccff00]" />

              <p className="text-[10px] font-black uppercase tracking-[.3em] text-[#ccff00]">
                Direct provenance
              </p>
            </div>

            <h2 className="mt-6 max-w-xl text-4xl font-black uppercase leading-[.9] tracking-[-.05em] sm:text-6xl">
              The story begins
              <span className="block text-[#ccff00]">
                with the player.
              </span>
            </h2>

            <p className="mt-7 max-w-xl text-base leading-8 text-white/55">
              When an item reaches AGE202 directly from a player,
              its origin becomes part of the historical record.
            </p>
          </div>


          <div className="relative overflow-hidden rounded-[2.4rem] border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,.045),rgba(255,255,255,.015))] p-6 sm:p-8">
            <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-[#ccff00]/10 blur-3xl" />

            <div className="relative rounded-[1.8rem] border border-white/10 bg-[#071020]/85 p-7 sm:p-10">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[.25em] text-white/30">
                    AGE202 Provenance Record
                  </p>

                  <p className="mt-3 text-[10px] font-black uppercase tracking-[.22em] text-[#ccff00]">
                    Direct source
                  </p>
                </div>

                <CircleCheck
                  className="h-7 w-7 text-[#ccff00]"
                  strokeWidth={1.4}
                />
              </div>

              <div className="mt-10 border-y border-white/10 py-10">
                <p className="text-3xl font-black uppercase leading-[.95] tracking-[-.04em] text-white sm:text-4xl">
                  Donated directly
                  <span className="block text-[#ccff00]">
                    by the Player
                  </span>
                </p>
              </div>

              <p className="mt-8 text-sm leading-7 text-white/50">
                The contribution can be documented together with its story,
                context and available provenance information, creating a
                permanent record inside the AGE202 archive.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/[.025] p-4">
                  <p className="text-[8px] font-black uppercase tracking-[.2em] text-white/25">
                    Source
                  </p>

                  <p className="mt-2 text-xs font-black uppercase text-white">
                    Player
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[.025] p-4">
                  <p className="text-[8px] font-black uppercase tracking-[.2em] text-white/25">
                    Status
                  </p>

                  <p className="mt-2 text-xs font-black uppercase text-white">
                    Documented
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[.025] p-4">
                  <p className="text-[8px] font-black uppercase tracking-[.2em] text-white/25">
                    Archive
                  </p>

                  <p className="mt-2 text-xs font-black uppercase text-white">
                    AGE202
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(204,255,0,.08),transparent_42%)]" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
          <div className="relative overflow-hidden rounded-[2.7rem] border border-[#ccff00]/20 bg-[linear-gradient(145deg,rgba(204,255,0,.07),rgba(255,255,255,.018))] px-7 py-16 text-center sm:px-12 lg:px-20 lg:py-24">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(204,255,0,.13),transparent_30%)]" />

            <div className="relative mx-auto max-w-4xl">
              <Star
                className="mx-auto h-7 w-7 text-[#ccff00]"
                strokeWidth={1.4}
              />

              <p className="mt-6 text-[10px] font-black uppercase tracking-[.3em] text-[#ccff00]">
                Preserve your story
              </p>

              <h2 className="mt-6 text-4xl font-black uppercase leading-[.9] tracking-[-.05em] sm:text-6xl lg:text-7xl">
                Leave a piece of your
                <span className="block text-[#ccff00]">
                  tennis journey.
                </span>
              </h2>

              <p className="mx-auto mt-8 max-w-2xl text-base leading-8 text-white/55">
                Whether it is a few seconds on video, a personal dedication
                or an object connected to your career, every contribution
                helps preserve the human story of tennis.
              </p>

              <a
                href={contributionMailto}
                className="group mt-10 inline-flex items-center gap-3 rounded-full bg-[#ccff00] px-8 py-4 text-[10px] font-black uppercase tracking-[.18em] text-[#050B18] transition duration-300 hover:scale-[1.025]"
              >
                <Mail className="h-4 w-4" />

                Contact the Museum

                <ArrowRight className="h-4 w-4 transition duration-300 group-hover:translate-x-1" />
              </a>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
                <span className="text-[8px] font-black uppercase tracking-[.2em] text-white/25">
                  Players
                </span>

                <span className="text-[#ccff00]/45">
                  ·
                </span>

                <span className="text-[8px] font-black uppercase tracking-[.2em] text-white/25">
                  Former Players
                </span>

                <span className="text-[#ccff00]/45">
                  ·
                </span>

                <span className="text-[8px] font-black uppercase tracking-[.2em] text-white/25">
                  Teams
                </span>

                <span className="text-[#ccff00]/45">
                  ·
                </span>

                <span className="text-[8px] font-black uppercase tracking-[.2em] text-white/25">
                  Management
                </span>
              </div>
            </div>
          </div>


          <div className="mt-8 flex flex-wrap items-center justify-between gap-5">
            <div className="flex items-center gap-2">
              <HeartHandshake
                size={13}
                className="text-[#ccff00]"
              />

              <span className="text-[8px] font-black uppercase tracking-[.22em] text-white/25">
                AGE202 Museum Contribution Programme
              </span>
            </div>

            <Link
              href="/collaborations"
              className="group flex items-center gap-3 text-[8px] font-black uppercase tracking-[.22em] text-white/25 transition hover:text-[#ccff00]"
            >
              Explore collaborations

              <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}