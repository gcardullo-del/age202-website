import type {
  PlayerMuseumData,
} from "@/lib/types/player-museum";

import ChapterTransition from "../ui/ChapterTransition";
import {
  categoryOrder,
} from "./category-config";
import EquipmentCategory from "./EquipmentCategory";
import EquipmentMeta from "./EquipmentMeta";
import FeaturedEquipment from "./FeaturedEquipment";

type EquipmentSectionProps = {
  player: PlayerMuseumData;
};

export default function EquipmentSection({
  player,
}: EquipmentSectionProps) {
  const equipment =
    player.equipment ?? [];

  if (equipment.length === 0) {
    return null;
  }

  const featuredItem =
    equipment.find(
      (item) => item.featured,
    ) ?? equipment[0];

  const groupedEquipment =
    categoryOrder
      .map((category) => ({
        category,
        items: equipment.filter(
          (item) =>
            item.category === category,
        ),
      }))
      .filter(
        (group) =>
          group.items.length > 0,
      );

  return (
    <section
      id="equipment-section"
      className="relative scroll-mt-20 overflow-hidden border-y border-white/[0.07] bg-[#07101e] px-6 py-24 sm:px-8 sm:py-28 lg:px-12 lg:py-36"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.022]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.65) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.65) 1px, transparent 1px)",
          backgroundSize:
            "88px 88px",
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-44 top-24 h-[440px] w-[440px] rounded-full opacity-[0.08] blur-[155px]"
        style={{
          backgroundColor:
            player.accent,
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-52 bottom-[-120px] h-[560px] w-[560px] rounded-full opacity-[0.06] blur-[180px]"
        style={{
          backgroundColor:
            player.accent,
        }}
      />

      <div className="relative mx-auto w-full max-w-[1440px]">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end lg:gap-16">
          <div>
            <div className="flex items-center gap-4">
              <span
                aria-hidden="true"
                className="h-px w-10 sm:w-14"
                style={{
                  backgroundColor:
                    player.accent,
                  boxShadow:
                    `0 0 14px ${player.accent}`,
                }}
              />

              <p
                className="py-1 text-[10px] font-black uppercase leading-[1.7] tracking-[0.28em]"
                style={{
                  color:
                    player.accent,
                }}
              >
                Chapter IV · Equipment
              </p>
            </div>

            <h2 className="mt-6 max-w-5xl text-5xl font-black leading-[0.92] tracking-[-0.055em] text-white sm:text-6xl lg:text-8xl">
              The tools behind

              <span className="block text-white/25">
                the legend.
              </span>
            </h2>
          </div>

          <div className="lg:pb-2">
            <p className="max-w-xl text-base leading-8 text-white/45 sm:text-lg sm:leading-9">
              Racquets, apparel and
              technical objects document
              how{" "}
              <span className="font-semibold text-white/75">
                {player.name}
              </span>{" "}
              translated style and
              performance into a complete
              on-court identity.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <EquipmentMeta
                label="Documented objects"
                value={String(
                  equipment.length,
                )}
              />

              <EquipmentMeta
                label="Categories"
                value={String(
                  groupedEquipment.length,
                )}
              />

              <EquipmentMeta
                label="Archive status"
                value="Curated"
                accent={
                  player.accent
                }
              />
            </div>
          </div>
        </div>

        <div className="mt-16 lg:mt-20">
          <FeaturedEquipment
            item={featuredItem}
            playerName={
              player.name
            }
            accent={
              player.accent
            }
          />
        </div>

        <div className="mt-20 space-y-16 lg:mt-24 lg:space-y-20">
          {groupedEquipment.map(
            (group) => (
              <EquipmentCategory
                key={group.category}
                category={
                  group.category
                }
                items={
                  group.items
                }
                accent={
                  player.accent
                }
              />
            ),
          )}
        </div>

        <ChapterTransition
          chapterLabel="End of Chapter IV"
          title="Equipment becomes achievement."
          description="Continue into the Trophy Room to discover the titles, records and milestones that transformed these tools into one of tennis history's greatest careers."
          href="#trophy-room"
          buttonLabel="Enter the Trophy Room"
          accent={player.accent}
        />
      </div>
    </section>
  );
}
