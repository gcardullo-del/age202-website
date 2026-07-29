import type { LucideIcon } from "lucide-react";

type OverviewCardProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  description: string;
};

export default function OverviewCard({
  icon: Icon,
  label,
  value,
  description,
}: OverviewCardProps) {
  return (
    <article className="group rounded-[1.7rem] border border-white/10 bg-[#07101D] p-6 transition hover:-translate-y-1 hover:border-[#55C9FF]">
      <span className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-[#55C9FF]">
        <Icon size={18} strokeWidth={1.4} aria-hidden="true" />
      </span>

      <p className="mt-7 font-mono text-[8px] font-black uppercase tracking-[0.18em] text-white/28">
        {label}
      </p>

      <h3 className="mt-3 text-xl font-black uppercase leading-tight tracking-[-0.03em]">
        {value}
      </h3>

      <p className="mt-4 text-xs leading-6 text-white/35">{description}</p>
    </article>
  );
}
