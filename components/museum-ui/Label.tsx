import type { ReactNode } from "react";

type LabelProps = {
  children: ReactNode;
  color?: string;
  dot?: boolean;
  className?: string;
};

export default function Label({
  children,
  color,
  dot = false,
  className = "",
}: LabelProps) {
  return (
    <div
      className={[
        "inline-flex items-center gap-3",
        className,
      ].join(" ")}
    >
      {dot && (
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 shrink-0 rounded-full bg-white/40"
          style={
            color
              ? {
                  backgroundColor: color,
                  boxShadow: `0 0 14px ${color}`,
                }
              : undefined
          }
        />
      )}

      <span
        className="text-[8px] font-black uppercase tracking-[0.28em] text-white/40 sm:text-[9px]"
        style={
          color
            ? {
                color,
              }
            : undefined
        }
      >
        {children}
      </span>
    </div>
  );
}