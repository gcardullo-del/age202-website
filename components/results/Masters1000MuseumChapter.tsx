type Masters1000MuseumChapterProps = {
  eyebrow: string;
  title: string;
  statement: string;
  code: string;
};

export default function Masters1000MuseumChapter({
  eyebrow,
  title,
  statement,
  code,
}: Masters1000MuseumChapterProps) {
  return (
    <section className="relative isolate overflow-hidden border-y border-white/10 bg-[#020611] px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,var(--tournament-glow),transparent_38%)] opacity-30" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:64px_64px]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[clamp(7rem,20vw,19rem)] font-black uppercase leading-none tracking-[-0.1em] text-white/[0.022]">
        {code}
      </div>

      <div className="relative mx-auto max-w-[1180px] text-center">
        <p className="font-mono text-[9px] font-black uppercase tracking-[0.3em] text-[var(--tournament-primary)]">
          {eyebrow}
        </p>
        <h2 className="mx-auto mt-8 max-w-6xl text-[clamp(3.5rem,8vw,8rem)] font-black uppercase leading-[0.78] tracking-[-0.08em]">
          {title}
        </h2>
        <p className="mx-auto mt-9 max-w-3xl text-base leading-8 text-white/46 sm:text-lg">
          {statement}
        </p>
      </div>
    </section>
  );
}
