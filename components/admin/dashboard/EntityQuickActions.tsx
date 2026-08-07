"use client";

import Link from "next/link";

import type {
  LucideIcon,
} from "lucide-react";

import {
  ArrowUpRight,
} from "lucide-react";

import type {
  ReactNode,
} from "react";

export type EntityQuickActionTone =
  | "neutral"
  | "museum"
  | "success"
  | "warning"
  | "danger"
  | "info";

export type EntityQuickActionItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  description?: string;
  tone?: EntityQuickActionTone;
  external?: boolean;
  badge?: ReactNode;
};

type EntityQuickActionsProps = {
  title?: string;
  description?: string;
  actions: EntityQuickActionItem[];
  columns?: 1 | 2 | 3;
  className?: string;
};

const toneClasses: Record<
  EntityQuickActionTone,
  {
    icon: string;
    hover: string;
  }
> = {
  neutral: {
    icon: "border-white/10 bg-white/[0.05] text-white/45",
    hover:
      "hover:border-white/20 hover:bg-white/[0.045]",
  },

  museum: {
    icon: "border-lime-300/20 bg-lime-300/10 text-lime-200",
    hover:
      "hover:border-lime-300/25 hover:bg-lime-300/[0.05]",
  },

  success: {
    icon: "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
    hover:
      "hover:border-emerald-400/25 hover:bg-emerald-400/[0.05]",
  },

  warning: {
    icon: "border-amber-400/20 bg-amber-400/10 text-amber-200",
    hover:
      "hover:border-amber-400/25 hover:bg-amber-400/[0.05]",
  },

  danger: {
    icon: "border-red-400/20 bg-red-400/10 text-red-200",
    hover:
      "hover:border-red-400/25 hover:bg-red-400/[0.05]",
  },

  info: {
    icon: "border-sky-400/20 bg-sky-400/10 text-sky-200",
    hover:
      "hover:border-sky-400/25 hover:bg-sky-400/[0.05]",
  },
};

const columnClasses: Record<
  NonNullable<
    EntityQuickActionsProps["columns"]
  >,
  string
> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3",
};

export default function EntityQuickActions({
  title = "Quick actions",
  description,
  actions,
  columns = 2,
  className = "",
}: EntityQuickActionsProps) {
  return (
    <section
      className={[
        "rounded-3xl border border-white/10 bg-white/[0.02] p-5 sm:p-6",
        className,
      ].join(" ")}
    >
      <div>
        <p className="text-[9px] font-black uppercase tracking-[0.18em] text-lime-200/70">
          Dashboard tools
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

      {actions.length > 0 ? (
        <div
          className={[
            "mt-5 grid gap-3",
            columnClasses[columns],
          ].join(" ")}
        >
          {actions.map(
            (action) => (
              <QuickActionLink
                key={`${action.href}-${action.label}`}
                action={action}
              />
            ),
          )}
        </div>
      ) : (
        <div className="mt-5 rounded-2xl border border-dashed border-white/10 bg-[#08111F] p-6 text-center">
          <p className="text-sm font-semibold text-white/55">
            No actions available
          </p>

          <p className="mt-2 text-xs leading-5 text-white/30">
            Add dashboard actions when this entity supports additional
            workflows.
          </p>
        </div>
      )}
    </section>
  );
}

function QuickActionLink({
  action,
}: {
  action: EntityQuickActionItem;
}) {
  const {
    label,
    href,
    icon: Icon,
    description,
    tone = "neutral",
    external = false,
    badge,
  } = action;

  const classes =
    toneClasses[tone];

  return (
    <Link
      href={href}
      target={
        external
          ? "_blank"
          : undefined
      }
      rel={
        external
          ? "noopener noreferrer"
          : undefined
      }
      className={[
        "group flex min-w-0 items-start gap-4 rounded-2xl border border-white/10 bg-[#08111F] p-4 outline-none transition duration-300",
        "focus-visible:ring-2 focus-visible:ring-lime-300/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050B18]",
        classes.hover,
      ].join(" ")}
    >
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

      <span className="min-w-0 flex-1">
        <span className="flex items-start justify-between gap-3">
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold text-white">
              {label}
            </span>

            {description ? (
              <span className="mt-1 block text-xs leading-5 text-white/35">
                {description}
              </span>
            ) : null}
          </span>

          <ArrowUpRight
            className="mt-0.5 h-4 w-4 shrink-0 text-white/20 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white/60"
            aria-hidden="true"
          />
        </span>

        {badge ? (
          <span className="mt-3 block">
            {badge}
          </span>
        ) : null}
      </span>
    </Link>
  );
}