"use client";

import type {
  LucideIcon,
} from "lucide-react";

import type {
  ReactNode,
} from "react";

export type EntityStatCardTone =
  | "neutral"
  | "museum"
  | "success"
  | "warning"
  | "danger"
  | "info";

type EntityStatCardProps = {
  icon: LucideIcon;
  value: ReactNode;
  label: string;
  description?: string;
  tone?: EntityStatCardTone;
  trend?: ReactNode;
  footer?: ReactNode;
  className?: string;
};

const toneClasses: Record<
  EntityStatCardTone,
  {
    icon: string;
    border: string;
    background: string;
  }
> = {
  neutral: {
    icon: "border-white/10 bg-white/[0.05] text-white/45",
    border: "border-white/10",
    background: "bg-white/[0.025]",
  },

  museum: {
    icon: "border-lime-300/20 bg-lime-300/10 text-lime-200",
    border: "border-lime-300/15",
    background: "bg-lime-300/[0.035]",
  },

  success: {
    icon: "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
    border: "border-emerald-400/15",
    background: "bg-emerald-400/[0.035]",
  },

  warning: {
    icon: "border-amber-400/20 bg-amber-400/10 text-amber-200",
    border: "border-amber-400/15",
    background: "bg-amber-400/[0.035]",
  },

  danger: {
    icon: "border-red-400/20 bg-red-400/10 text-red-200",
    border: "border-red-400/15",
    background: "bg-red-400/[0.035]",
  },

  info: {
    icon: "border-sky-400/20 bg-sky-400/10 text-sky-200",
    border: "border-sky-400/15",
    background: "bg-sky-400/[0.035]",
  },
};

export default function EntityStatCard({
  icon: Icon,
  value,
  label,
  description,
  tone = "neutral",
  trend,
  footer,
  className = "",
}: EntityStatCardProps) {
  const classes =
    toneClasses[tone];

  return (
    <article
      className={[
        "group rounded-3xl border p-5 transition duration-300",
        "hover:-translate-y-0.5 hover:shadow-[0_20px_50px_rgba(0,0,0,0.22)]",
        classes.border,
        classes.background,
        className,
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <span
          className={[
            "grid h-11 w-11 shrink-0 place-items-center rounded-2xl border transition duration-300 group-hover:scale-[1.03]",
            classes.icon,
          ].join(" ")}
        >
          <Icon
            className="h-5 w-5"
            aria-hidden="true"
          />
        </span>

        {trend ? (
          <div className="shrink-0">
            {trend}
          </div>
        ) : null}
      </div>

      <div className="mt-6">
        <p className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
          {value}
        </p>

        <p className="mt-2 text-xs font-black uppercase tracking-[0.16em] text-white/35">
          {label}
        </p>

        {description ? (
          <p className="mt-3 text-xs leading-5 text-white/30">
            {description}
          </p>
        ) : null}
      </div>

      {footer ? (
        <div className="mt-5 border-t border-white/10 pt-4">
          {footer}
        </div>
      ) : null}
    </article>
  );
}