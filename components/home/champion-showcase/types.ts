import type { Champion } from "@/data";

export type ChampionShowcaseProps = {
  champions: Champion[];
  initialChampionId?: string;
  className?: string;
};

export type ChampionComponentProps = {
  champion: Champion;
  activeIndex: number;
};

export type ChampionNavigationProps = {
  champions: Champion[];
  activeIndex: number;
  onSelect: (index: number) => void;
};

export type ChampionDirection = 1 | -1;