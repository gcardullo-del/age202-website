import { Trophy } from "lucide-react";

type TrophyCabinetProps = {
  profileCompletionLabel: string;
};

export default function TrophyCabinet({
  profileCompletionLabel,
}: TrophyCabinetProps) {
  return (
    <section
      id="trophy-cabinet"
      className="scroll-mt-16 border-t border-white/10 px-5 py-20 sm:px-8 lg:px-12 lg:py-28"
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#D7FF00]">
              Career honours
            </p>

            <h2 className="mt-5 text-4xl font-black uppercase leading-[0.92] tracking-[-0.05em] sm:text-5xl lg:text-6xl">
              Trophy cabinet
            </h2>
          </div>

          <p className="text-sm leading-7 text-white/45 lg:text-right">
            This section is structurally ready for verified career-title data.
            Until those records are connected, unavailable values remain
            intentionally marked with an em dash.
          </p>
        </div>

        <div className="mt-10 grid gap-px overflow-hidden rounded-[1.9rem] border border-white/10 bg-white/10 sm:grid-cols-2 xl:grid-cols-3">
          <TrophyFact label="Australian Open" value="—" />
          <TrophyFact label="Roland Garros" value="—" />
          <TrophyFact label="Wimbledon" value="—" />
          <TrophyFact label="US Open" value="—" />
          <TrophyFact label="ATP Finals" value="—" />
          <TrophyFact label="Masters 1000" value="—" />
        </div>

        <div className="mt-6 flex items-center justify-between gap-5 rounded-[1.5rem] border border-white/10 bg-white/[0.025] px-5 py-4">
          <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/35">
            Profile completeness
          </span>

          <span className="font-mono text-[9px] font-black uppercase tracking-[0.18em] text-[#D7FF00]">
            {profileCompletionLabel}
          </span>
        </div>
      </div>
    </section>
  );
}

type TrophyFactProps = {
  label: string;
  value: string;
};

function TrophyFact({
  label,
  value,
}: TrophyFactProps) {
  return (
    <div className="group flex min-h-[150px] items-center justify-between bg-[#07101D] px-6 py-7 transition hover:bg-[#091421]">
      <div>
        <span className="block text-3xl font-black tracking-[-0.05em] text-white/88">
          {value}
        </span>

        <span className="mt-4 block font-mono text-[8px] uppercase tracking-[0.18em] text-white/35">
          {label}
        </span>
      </div>

      <span className="grid h-12 w-12 place-items-center rounded-2xl border border-[#D7FF00]/18 bg-[#D7FF00]/[0.05] text-[#D7FF00] transition group-hover:border-[#D7FF00]/35">
        <Trophy size={18} strokeWidth={1.4} aria-hidden="true" />
      </span>
    </div>
  );
}