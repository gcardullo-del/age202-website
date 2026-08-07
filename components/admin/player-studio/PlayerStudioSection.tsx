"use client";

import type {
  LucideIcon,
} from "lucide-react";

import type {
  ReactNode,
} from "react";

type PlayerStudioSectionProps = {
  eyebrow: string;
  title: string;
  description?: string;
  icon?: LucideIcon;
  actions?: ReactNode;
  summary?: ReactNode;
  children: ReactNode;
  className?: string;
};

export default function PlayerStudioSection({
  eyebrow,
  title,
  description,
  icon: Icon,
  actions,
  summary,
  children,
  className = "",
}: PlayerStudioSectionProps) {
  return (
    <section
      className={[
        "space-y-7",
        className,
      ].join(" ")}
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-start gap-4">
            {Icon ? (
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-lime-300/20 bg-lime-300/10 text-lime-200">
                <Icon
                  className="h-5 w-5"
                  aria-hidden="true"
                />
              </span>
            ) : null}

            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-200/70">
                {eyebrow}
              </p>

              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.02em] text-white">
                {title}
              </h2>

              {description ? (
                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/40">
                  {description}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        {actions ? (
          <div className="flex shrink-0 flex-wrap items-center gap-3">
            {actions}
          </div>
        ) : null}
      </div>

      {summary ? (
        <div className="rounded-3xl border border-white/10 bg-white/[0.015] p-5">
          {summary}
        </div>
      ) : null}

      <div>
        {children}
      </div>
    </section>
  );
}