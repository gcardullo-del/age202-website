import {
  Archive,
  PackageOpen,
  ShieldCheck,
  Sparkles,
  Trophy,
} from "lucide-react";

import type {
  GrandSlamData,
} from "@/lib/data/grand-slams";

type ArchivePreviewProps = {
  tournament: GrandSlamData;
};

export default function GrandSlamArchivePreviewSection({
  tournament,
}: ArchivePreviewProps) {
  const archiveItems = [
    {
      icon: Trophy,
      title: "AGE202 Collection",
      eyebrow: "Next archive layer",
      description:
        "Memorabilia and apparel connected to the tournament and its champions.",
      status: "Planned",
    },
  ];

  return (
    <section
      id="archive"
      className="relative isolate scroll-mt-24 overflow-hidden border-t border-white/10 px-5 py-20 sm:px-8 lg:px-12 lg:py-28"
    >
      <div
        className="pointer-events-none absolute -right-40 top-12 h-[32rem] w-[32rem] rounded-full opacity-20 blur-3xl"
        style={{
          backgroundColor:
            tournament.colors.glow,
        }}
      />

      <div
        className="pointer-events-none absolute -left-48 bottom-0 h-[28rem] w-[28rem] rounded-full opacity-10 blur-3xl"
        style={{
          backgroundColor:
            tournament.colors.glow,
        }}
      />

      <div className="pointer-events-none absolute inset-0 opacity-[0.025] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:72px_72px]" />

      <div className="relative mx-auto max-w-[1440px]">
        <div className="relative overflow-hidden rounded-[2.4rem] border border-white/10 bg-[linear-gradient(135deg,#081423_0%,#07101D_58%,#050B18_100%)] p-7 shadow-[0_30px_100px_rgba(0,0,0,0.24)] sm:p-10 lg:p-14">
          <div className="pointer-events-none absolute -right-8 -top-12 select-none text-[10rem] font-black uppercase leading-none tracking-[-0.09em] text-white/[0.02] sm:text-[15rem] lg:text-[20rem]">
            {tournament.code}
          </div>

          <div className="relative">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_430px] lg:items-end">
              <div>
                <div className="inline-flex items-center gap-3">
                  <span className="h-px w-10 bg-[var(--tournament-primary)]" />

                  <p className="font-mono text-[9px] font-black uppercase tracking-[0.24em] text-[var(--tournament-primary)]">
                    AGE202 tournament archive
                  </p>
                </div>

                <h2 className="mt-6 max-w-5xl text-4xl font-black uppercase leading-[0.88] tracking-[-0.06em] sm:text-5xl lg:text-7xl">
                  The next layers of {tournament.name}.
                </h2>
              </div>

              <div className="lg:text-right">
                <p className="text-sm leading-7 text-white/43">
                  The live tournament archive is already preserving champions,
                  editions, finals, history and defining moments. The next layer
                  connects {tournament.name} with the AGE202 Collection.
                </p>

                <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.025] px-4 py-2 font-mono text-[7px] font-black uppercase tracking-[0.17em] text-white/30">
                  <ShieldCheck
                    size={11}
                    className="text-[var(--tournament-primary)]"
                    aria-hidden="true"
                  />
                  Archive bridge
                </span>
              </div>
            </div>

            <div className="mt-12 grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
              {archiveItems.map((item) => {
                const Icon = item.icon;

                return (
                  <article
                    key={item.title}
                    className="group relative min-h-[360px] overflow-hidden rounded-[2rem] border border-white/10 bg-black/15 p-7 transition duration-300 hover:-translate-y-1 hover:border-[var(--tournament-primary)]/40 hover:bg-white/[0.025] sm:p-9"
                  >
                    <div className="pointer-events-none absolute -bottom-16 -right-4 text-[10rem] font-black uppercase leading-none tracking-[-0.08em] text-white/[0.025]">
                      01
                    </div>

                    <div
                      className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full blur-3xl"
                      style={{
                        backgroundColor:
                          tournament.colors.glow,
                        opacity: 0.18,
                      }}
                    />

                    <div className="relative flex h-full flex-col">
                      <div className="flex items-start justify-between gap-5">
                        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-[var(--tournament-primary)]">
                          <Icon
                            size={19}
                            strokeWidth={1.4}
                            aria-hidden="true"
                          />
                        </span>

                        <span className="rounded-full border border-white/10 bg-white/[0.025] px-3.5 py-1.5 font-mono text-[6px] font-black uppercase tracking-[0.16em] text-white/28">
                          {item.status}
                        </span>
                      </div>

                      <div className="mt-12 max-w-3xl">
                        <p className="font-mono text-[8px] font-black uppercase tracking-[0.19em] text-[var(--tournament-primary)]">
                          {item.eyebrow}
                        </p>

                        <h3 className="mt-4 text-3xl font-black uppercase leading-[0.95] tracking-[-0.045em] sm:text-4xl">
                          {item.title}
                        </h3>

                        <p className="mt-5 max-w-2xl text-sm leading-7 text-white/42 sm:text-base">
                          {item.description}
                        </p>
                      </div>

                      <div className="mt-auto flex items-center justify-between gap-5 border-t border-white/10 pt-6">
                        <span className="font-mono text-[7px] font-black uppercase tracking-[0.17em] text-[var(--tournament-primary)]/60">
                          Archive expansion
                        </span>

                        <PackageOpen
                          size={16}
                          className="text-white/24 transition group-hover:text-[var(--tournament-primary)]"
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                  </article>
                );
              })}

              <aside className="relative min-h-[360px] overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.02] p-7 sm:p-9">
                <div className="pointer-events-none absolute -right-10 -top-12 text-[9rem] font-black uppercase leading-none tracking-[-0.08em] text-white/[0.025]">
                  02
                </div>

                <div className="relative flex h-full flex-col">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-[var(--tournament-primary)]">
                    <Archive
                      size={19}
                      strokeWidth={1.4}
                      aria-hidden="true"
                    />
                  </span>

                  <div className="mt-12">
                    <p className="font-mono text-[8px] font-black uppercase tracking-[0.19em] text-[var(--tournament-primary)]">
                      Future connection
                    </p>

                    <h3 className="mt-4 text-2xl font-black uppercase leading-[0.95] tracking-[-0.04em] sm:text-3xl">
                      From history to collectible culture.
                    </h3>

                    <p className="mt-5 text-sm leading-7 text-white/40">
                      Future AGE202 layers can connect tournament history with
                      apparel, memorabilia and authenticated artifacts without
                      changing the Grand Slam archive structure.
                    </p>
                  </div>

                  <div className="mt-auto border-t border-white/10 pt-6">
                    <div className="inline-flex items-center gap-3">
                      <Sparkles
                        size={13}
                        className="text-[var(--tournament-primary)]"
                        aria-hidden="true"
                      />

                      <span className="font-mono text-[7px] font-black uppercase tracking-[0.17em] text-white/28">
                        Architecture ready
                      </span>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}