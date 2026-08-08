"use client";

import {
  CheckCircle2,
  Circle,
} from "lucide-react";

type StudioSidebarItem = {
  id: string;
  label: string;
  description?: string;
  completed?: boolean;
};

type StudioSidebarProps = {
  items: StudioSidebarItem[];
  active: string;
  onChange: (
    id: string,
  ) => void;
};

export default function StudioSidebar({
  items,
  active,
  onChange,
}: StudioSidebarProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-white/10 p-6">
        <p className="text-[10px] font-black uppercase tracking-[0.28em] text-lime-300">
          Studio
        </p>

        <h2 className="mt-2 text-xl font-bold text-white">
          Navigation
        </h2>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {items.map((item) => {
            const selected =
              item.id === active;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  onChange(item.id)
                }
                className={[
                  "flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition-all",
                  selected
                    ? "border-lime-300/30 bg-lime-300/10"
                    : "border-transparent hover:border-white/10 hover:bg-white/[0.03]",
                ].join(" ")}
              >
                <span className="mt-0.5">
                  {item.completed ? (
                    <CheckCircle2
                      size={18}
                      className="text-lime-300"
                    />
                  ) : (
                    <Circle
                      size={18}
                      className="text-white/25"
                    />
                  )}
                </span>

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white">
                    {item.label}
                  </p>

                  {item.description ? (
                    <p className="mt-1 text-xs leading-5 text-white/35">
                      {item.description}
                    </p>
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}