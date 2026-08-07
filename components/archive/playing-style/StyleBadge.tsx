import type {
  StyleBadgeProps,
} from "./types";

export default function StyleBadge({
  icon: Icon,
  label,
  value,
  accent,
}: StyleBadgeProps) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-full border border-white/10 bg-white/[0.025] px-4 py-3">
      <Icon
        className="h-4 w-4 shrink-0"
        style={{
          color: accent,
        }}
        aria-hidden="true"
      />

      <div className="min-w-0">
        <p className="break-words font-mono text-[7px] uppercase leading-[1.6] tracking-[0.16em] text-white/25">
          {label}
        </p>

        <p className="mt-0.5 break-words text-[10px] font-black uppercase leading-5 tracking-[0.08em] text-white/65">
          {value}
        </p>
      </div>
    </div>
  );
}
