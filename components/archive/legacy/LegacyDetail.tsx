import type {
  LegacyDetailProps,
} from "./types";

export default function LegacyDetail({
  label,
  value,
  accent,
}: LegacyDetailProps) {
  return (
    <div>
      <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/25">
        {label}
      </p>

      <p
        className="mt-2 break-words text-[10px] font-black uppercase leading-5 tracking-[0.12em] text-white/65"
        style={
          accent
            ? {
                color: accent,
              }
            : undefined
        }
      >
        {value}
      </p>
    </div>
  );
}
