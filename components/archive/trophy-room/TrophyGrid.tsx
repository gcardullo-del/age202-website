import TrophyCard from "./TrophyCard";
import type {
  TrophyItem,
} from "./types";

type TrophyGridProps = {
  items: TrophyItem[];
  accent: string;
  shouldReduceMotion: boolean | null;
};

export default function TrophyGrid({
  items,
  accent,
  shouldReduceMotion,
}: TrophyGridProps) {
  return (
    <div className="mt-8 grid w-full min-w-0 items-stretch gap-5 md:grid-cols-2 xl:grid-cols-4">
      {items.map(
        (item, index) => (
          <TrophyCard
            key={item.label}
            item={item}
            index={index}
            accent={accent}
            shouldReduceMotion={
              shouldReduceMotion
            }
          />
        ),
      )}
    </div>
  );
}
