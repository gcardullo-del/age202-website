import type { ReactNode } from "react";

type AdminBadgeTone =
  | "neutral"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "museum";

type AdminBadgeProps = {
  children: ReactNode;
  tone?: AdminBadgeTone;
  dot?: boolean;
};

const toneClasses: Record<AdminBadgeTone, string> = {
  neutral: "border-white/10 bg-white/[0.05] text-white/55",
  success:
    "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
  warning:
    "border-amber-400/20 bg-amber-400/10 text-amber-300",
  danger: "border-rose-400/20 bg-rose-400/10 text-rose-300",
  info: "border-sky-400/20 bg-sky-400/10 text-sky-300",
  museum:
    "border-yellow-200/20 bg-yellow-200/10 text-yellow-100",
};

const dotClasses: Record<AdminBadgeTone, string> = {
  neutral: "bg-white/35",
  success: "bg-emerald-300",
  warning: "bg-amber-300",
  danger: "bg-rose-300",
  info: "bg-sky-300",
  museum: "bg-yellow-100",
};

export default function AdminBadge({
  children,
  tone = "neutral",
  dot = false,
}: AdminBadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em]",
        toneClasses[tone],
      ].join(" ")}
    >
      {dot ? (
        <span
          aria-hidden="true"
          className={["h-1.5 w-1.5 rounded-full", dotClasses[tone]].join(
            " ",
          )}
        />
      ) : null}
      {children}
    </span>
  );
}
