import type {
  ComponentType,
  ReactNode,
} from "react";

type StatsCardTone =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "premium";

export type StatsCardProps = {
  title: string;
  value: number | string;

  description?: string;
  icon?: ComponentType<{
    className?: string;
    "aria-hidden"?: boolean;
  }>;

  footer?: ReactNode;
  trend?: {
    label: string;
    value: number;
  };

  tone?: StatsCardTone;
  className?: string;
};

const toneClasses: Record<
  StatsCardTone,
  {
    container: string;
    icon: string;
    accent: string;
  }
> = {
  default: {
    container:
      "border-white/10 bg-white/[0.04]",
    icon:
      "border-white/10 bg-white/[0.06] text-white",
    accent:
      "bg-white/40",
  },

  success: {
    container:
      "border-emerald-400/20 bg-emerald-400/[0.06]",
    icon:
      "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
    accent:
      "bg-emerald-400",
  },

  warning: {
    container:
      "border-amber-400/20 bg-amber-400/[0.06]",
    icon:
      "border-amber-400/20 bg-amber-400/10 text-amber-300",
    accent:
      "bg-amber-400",
  },

  danger: {
    container:
      "border-rose-400/20 bg-rose-400/[0.06]",
    icon:
      "border-rose-400/20 bg-rose-400/10 text-rose-300",
    accent:
      "bg-rose-400",
  },

  info: {
    container:
      "border-sky-400/20 bg-sky-400/[0.06]",
    icon:
      "border-sky-400/20 bg-sky-400/10 text-sky-300",
    accent:
      "bg-sky-400",
  },

  premium: {
    container:
      "border-yellow-300/20 bg-yellow-300/[0.06]",
    icon:
      "border-yellow-300/20 bg-yellow-300/10 text-yellow-200",
    accent:
      "bg-yellow-300",
  },
};

function formatTrendValue(
  value: number,
): string {
  const absoluteValue = Math.abs(value);
  const prefix = value > 0
    ? "+"
    : value < 0
      ? "-"
      : "";

  return `${prefix}${absoluteValue}%`;
}

export function StatsCard({
  title,
  value,

  description,
  icon: Icon,

  footer,
  trend,

  tone = "default",
  className = "",
}: StatsCardProps) {
  const selectedTone = toneClasses[tone];

  const trendIsPositive =
    trend && trend.value > 0;

  const trendIsNegative =
    trend && trend.value < 0;

  return (
    <article
      className={[
        "group relative overflow-hidden rounded-3xl border p-5 shadow-2xl shadow-black/10 backdrop-blur-xl transition duration-300",
        "hover:-translate-y-1 hover:border-white/20 hover:shadow-black/20",
        selectedTone.container,
        className,
      ].join(" ")}
    >
      <div
        aria-hidden="true"
        className={[
          "absolute inset-x-0 top-0 h-px opacity-80",
          selectedTone.accent,
        ].join(" ")}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/[0.04] blur-3xl transition duration-500 group-hover:bg-white/[0.07]"
      />

      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
            {title}
          </p>

          <p className="mt-3 break-words text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {value}
          </p>

          {description ? (
            <p className="mt-2 text-sm leading-6 text-white/55">
              {description}
            </p>
          ) : null}
        </div>

        {Icon ? (
          <div
            className={[
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border shadow-inner shadow-white/5",
              selectedTone.icon,
            ].join(" ")}
          >
            <Icon
              aria-hidden
              className="h-5 w-5"
            />
          </div>
        ) : null}
      </div>

      {trend ? (
        <div className="relative mt-5 flex items-center gap-2 border-t border-white/10 pt-4">
          <span
            className={[
              "rounded-full px-2.5 py-1 text-xs font-semibold",
              trendIsPositive
                ? "bg-emerald-400/10 text-emerald-300"
                : trendIsNegative
                  ? "bg-rose-400/10 text-rose-300"
                  : "bg-white/[0.06] text-white/60",
            ].join(" ")}
          >
            {formatTrendValue(
              trend.value,
            )}
          </span>

          <span className="text-xs text-white/45">
            {trend.label}
          </span>
        </div>
      ) : null}

      {footer ? (
        <div className="relative mt-5 border-t border-white/10 pt-4 text-sm text-white/55">
          {footer}
        </div>
      ) : null}
    </article>
  );
}

export default StatsCard;