import type {
  PlayerMuseumEquipmentCategory,
} from "@/lib/types/player-museum";

import {
  categoryConfig,
} from "./category-config";
import EquipmentCard from "./EquipmentCard";

type EquipmentCategoryProps = {
  category: PlayerMuseumEquipmentCategory;
  items: import("@/lib/types/player-museum").PlayerMuseumEquipment[];
  accent: string;
};

export default function EquipmentCategory({
  category,
  items,
  accent,
}: EquipmentCategoryProps) {
  const config =
    categoryConfig[category];

  const Icon =
    config.icon;

  return (
    <section className="min-w-0">
      <div className="flex flex-col gap-6 border-b border-white/10 pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <span
              className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border"
              style={{
                borderColor:
                  `${accent}35`,
                backgroundColor:
                  `${accent}0d`,
                color: accent,
              }}
            >
              <Icon
                className="h-[18px] w-[18px]"
                aria-hidden="true"
              />
            </span>

            <div className="min-w-0">
              <p
                className="break-words py-1 font-mono text-[8px] font-black uppercase leading-[1.7] tracking-[0.2em]"
                style={{
                  color: accent,
                }}
              >
                Equipment category
              </p>

              <h3 className="mt-1 break-words text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl">
                {config.label}
              </h3>
            </div>
          </div>
        </div>

        <p className="max-w-xl text-sm leading-7 text-white/38 sm:text-right">
          {config.description}
        </p>
      </div>

      <div className="mt-7 grid items-stretch gap-5 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <EquipmentCard
            key={item.id}
            item={item}
            accent={accent}
          />
        ))}
      </div>
    </section>
  );
}
