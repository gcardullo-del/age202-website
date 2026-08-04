import type {
  LucideIcon,
} from "lucide-react";

import AdminPanel from "./AdminPanel";

type StatTone =
  | "neutral"
  | "success"
  | "warning"
  | "danger"
  | "museum"
  | "info";

export type AdminStatItem = {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: StatTone;
  helper?: string;
};

type AdminStatsGridProps = {
  items: AdminStatItem[];
  columns?: 2 | 3 | 4 | 5;
};

const toneClasses: Record<
  StatTone,
  string
> = {
  neutral:
    "border-white/10 bg-white/[0.05] text-white/50",
  success:
    "border-emerald-400/15 bg-emerald-400/10 text-emerald-300",
  warning:
    "border-amber-400/15 bg-amber-400/10 text-amber-300",
  danger:
    "border-red-400/15 bg-red-400/10 text-red-300",
  museum:
    "border-lime-300/15 bg-lime-300/10 text-lime-200",
  info:
    "border-sky-400/15 bg-sky-400/10 text-sky-300",
};

const columnClasses = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 xl:grid-cols-3",
  4: "sm:grid-cols-2 xl:grid-cols-4",
  5: "sm:grid-cols-2 xl:grid-cols-5",
} as const;

export default function AdminStatsGrid({
  items,
  columns = 4,
}: AdminStatsGridProps) {
  return (
    <div
      className={[
        "grid gap-4",
        columnClasses[columns],
      ].join(" ")}
    >
      {items.map((item) => {
        const Icon = item.icon;
        const tone =
          item.tone ??
          "neutral";

        return (
          <AdminPanel
            key={item.label}
            className="p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/35">
                  {item.label}
                </p>

                <p className="mt-3 truncate text-3xl font-semibold text-white">
                  {item.value}
                </p>

                {item.helper ? (
                  <p className="mt-2 text-xs leading-5 text-white/30">
                    {item.helper}
                  </p>
                ) : null}
              </div>

              <div
                className={[
                  "shrink-0 rounded-2xl border p-3",
                  toneClasses[tone],
                ].join(" ")}
              >
                <Icon
                  className="h-5 w-5"
                  aria-hidden="true"
                />
              </div>
            </div>
          </AdminPanel>
        );
      })}
    </div>
  );
}
