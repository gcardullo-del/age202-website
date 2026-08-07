import type {
  LucideIcon,
} from "lucide-react";

import type {
  PlayerMuseumEquipment,
  PlayerMuseumEquipmentCategory,
} from "@/lib/types/player-museum";

export type EquipmentCategoryConfig = {
  label: string;
  description: string;
  icon: LucideIcon;
};

export type EquipmentGroup = {
  category: PlayerMuseumEquipmentCategory;
  items: PlayerMuseumEquipment[];
};

export type FeaturedEquipmentProps = {
  item: PlayerMuseumEquipment;
  playerName: string;
  accent: string;
};

export type EquipmentCardProps = {
  item: PlayerMuseumEquipment;
  accent: string;
};

export type EquipmentMetaProps = {
  label: string;
  value: string;
  accent?: string;
};
