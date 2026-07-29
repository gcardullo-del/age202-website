import type { LucideIcon } from "lucide-react";

type HeroDetailProps = {
  label: string;
  value: string;
  icon: LucideIcon;
};

export default function HeroDetail({
  label,
  value,
  icon: Icon,
}: HeroDetailProps) {
  return (
    <div className="flex items-center justify-between gap-5 border-b border-white/10 py-4 last:border-b-0">
      <dt className="inline-flex items-center gap-3 font-mono text-[8px] uppercase tracking-[0.18em] text-white/34">
        <Icon
          size={13}
          className="text-[#55C9FF]"
          aria-hidden="true"
        />

        {label}
      </dt>

      <dd className="max-w-[220px] text-right text-[11px] font-black uppercase leading-5 tracking-[0.04em] text-white/66">
        {value}
      </dd>
    </div>
  );
}
