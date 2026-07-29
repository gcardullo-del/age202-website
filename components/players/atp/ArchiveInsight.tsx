import { Trophy } from "lucide-react";

type ArchiveInsightProps = {
  icon: typeof Trophy;
  value: number;
  label: string;
};

export default function ArchiveInsight({
  icon: Icon,
  value,
  label,
}: ArchiveInsightProps) {
  return (
    <article className="group relative overflow-hidden bg-[#07101D] px-6 py-6 transition-all duration-500 hover:bg-[#091624] hover:shadow-[0_18px_50px_rgba(0,0,0,0.35)] sm:px-7">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D7FF00]/70 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="flex items-center justify-between">
        <div>
          <span className="block text-3xl font-black tracking-[-0.055em] transition-colors duration-300 group-hover:text-[#D7FF00]">
            {String(value).padStart(2, "0")}
          </span>

          <span className="mt-3 block font-mono text-[7px] uppercase tracking-[0.18em] text-white/35">
            {label}
          </span>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#D7FF00]/20 bg-[#D7FF00]/[0.08] text-[#D7FF00] transition-all duration-500 group-hover:scale-110 group-hover:border-[#D7FF00]/50 group-hover:bg-[#D7FF00]/15">
          <Icon
            size={18}
            strokeWidth={1.4}
            aria-hidden="true"
          />
        </div>
      </div>
    </article>
  );
}