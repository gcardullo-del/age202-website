import type {
  EquipmentMetaProps,
} from "./types";

export default function EquipmentMeta({
  label,
  value,
  accent,
}: EquipmentMetaProps) {
  return (
    <div className="min-w-0 rounded-full border border-white/10 bg-white/[0.025] px-5 py-3 backdrop-blur-xl">
      <p className="break-words py-1 font-mono text-[8px] uppercase leading-[1.7] tracking-[0.17em] text-white/25">
        {label}
      </p>

      <p
        className="mt-1 break-words py-1 text-[10px] font-black uppercase leading-[1.7] tracking-[0.11em] text-white/60"
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
