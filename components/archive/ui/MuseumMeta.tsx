type MuseumMetaProps = {
  label: string;
  value: string;
  accent?: string;
  className?: string;
  valueClassName?: string;
  compact?: boolean;
};

export default function MuseumMeta({
  label,
  value,
  accent,
  className = "",
  valueClassName = "",
  compact = false,
}: MuseumMetaProps) {
  return (
    <div
      className={[
        "min-w-0 rounded-full border border-white/10 bg-white/[0.025] backdrop-blur-xl",
        compact
          ? "px-4 py-2.5"
          : "px-5 py-3",
        className,
      ].join(" ")}
    >
      <p className="min-w-0 break-words py-1 font-mono text-[8px] uppercase leading-[1.7] tracking-[0.18em] text-white/25">
        {label}
      </p>

      <p
        className={[
          "mt-1 min-w-0 break-words py-1 text-[10px] font-black uppercase leading-[1.7] tracking-[0.12em] text-white/60",
          valueClassName,
        ].join(" ")}
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