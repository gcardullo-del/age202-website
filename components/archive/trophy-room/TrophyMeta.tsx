import type {
  TrophyMetaProps,
} from "./types";

export default function TrophyMeta({
  label,
  value,
  accent,
}: TrophyMetaProps) {
  return (
    <div className="rounded-full border border-white/10 bg-white/[0.025] px-5 py-3 backdrop-blur-xl">
      <p className="break-words py-1 font-mono text-[8px] uppercase leading-[1.7] tracking-[0.18em] text-white/25">
        {label}
      </p>

      <p
        className="mt-1 break-words py-1 text-[10px] font-black uppercase leading-[1.7] tracking-[0.12em] text-white/60"
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
