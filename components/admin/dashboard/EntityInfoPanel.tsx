"use client";

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export type EntityInfoPanelTone =
  | "neutral"
  | "museum"
  | "success"
  | "warning"
  | "danger"
  | "info";

export type EntityInfoPanelItem = {
  icon: LucideIcon;
  label: string;
  value: ReactNode;
  description?: string;
  tone?: EntityInfoPanelTone;
};

type EntityInfoPanelProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  icon?: LucideIcon;
  items: EntityInfoPanelItem[];
  footer?: ReactNode;
  className?: string;
};

const toneClasses: Record<EntityInfoPanelTone, string> = {
  neutral:
    "border-white/10 bg-white/[0.04] text-white/35",
  museum:
    "border-lime-300/20 bg-lime-300/10 text-lime-200",
  success:
    "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
  warning:
    "border-amber-400/20 bg-amber-400/10 text-amber-200",
  danger:
    "border-red-400/20 bg-red-400/10 text-red-200",
  info:
    "border-sky-400/20 bg-sky-400/10 text-sky-200",
};

export default function EntityInfoPanel({
  eyebrow = "Entity information",
  title,
  description,
  icon: HeaderIcon,
  items,
  footer,
  className = "",
}: EntityInfoPanelProps) {
  return (
    <section
      className={[
        "rounded-3xl border border-white/10 bg-white/[0.02] p-5 sm:p-6",
        className,
      ].join(" ")}
    >
      <div className="flex items-start gap-4">
        {HeaderIcon ? (
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-lime-300/20 bg-lime-300/10 text-lime-200">
            <HeaderIcon
              className="h-5 w-5"
              aria-hidden="true"
            />
          </span>
        ) : null}

        <div className="min-w-0">
          <p className="text-[9px] font-black uppercase tracking-[0.18em] text-lime-200/70">
            {eyebrow}
          </p>

          <h2 className="mt-2 text-xl font-semibold text-white">
            {title}
          </h2>

          {description ? (
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/35">
              {description}
            </p>
          ) : null}
        </div>
      </div>

      {items.length > 0 ? (
        <div className="mt-6 space-y-3">
          {items.map((item, index) => (
            <EntityInfoRow
              key={`${item.label}-${index}`}
              item={item}
            />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-white/10 bg-[#08111F] p-6 text-center">
          <p className="text-sm font-semibold text-white/55">
            No information available
          </p>

          <p className="mt-2 text-xs leading-5 text-white/30">
            Add entity details to populate this information panel.
          </p>
        </div>
      )}

      {footer ? (
        <div className="mt-6 border-t border-white/10 pt-5">
          {footer}
        </div>
      ) : null}
    </section>
  );
}

function EntityInfoRow({
  item,
}: {
  item: EntityInfoPanelItem;
}) {
  const {
    icon: Icon,
    label,
    value,
    description,
    tone = "neutral",
  } = item;

  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-[#08111F] p-4">
      <div className="flex min-w-0 items-start gap-3">
        <span
          className={[
            "grid h-9 w-9 shrink-0 place-items-center rounded-xl border",
            toneClasses[tone],
          ].join(" ")}
        >
          <Icon
            className="h-4 w-4"
            aria-hidden="true"
          />
        </span>

        <div className="min-w-0">
          <p className="text-xs font-medium text-white/40">
            {label}
          </p>

          {description ? (
            <p className="mt-1 text-[11px] leading-5 text-white/25">
              {description}
            </p>
          ) : null}
        </div>
      </div>

      <div className="max-w-[55%] shrink-0 text-right text-sm font-semibold text-white">
        {value}
      </div>
    </div>
  );
}