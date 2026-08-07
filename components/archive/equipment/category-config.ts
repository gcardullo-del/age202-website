import {
  Backpack,
  Gem,
  Layers3,
  PackageOpen,
  Shirt,
  Sparkles,
  Target,
} from "lucide-react";

import type {
  PlayerMuseumEquipmentCategory,
} from "@/lib/types/player-museum";

import type {
  EquipmentCategoryConfig,
} from "./types";

export const categoryConfig: Record<
  PlayerMuseumEquipmentCategory,
  EquipmentCategoryConfig
> = {
  RACQUET: {
    label: "Racquets",
    description:
      "Frames that shaped the champion's technical identity across different eras.",
    icon: Target,
  },

  STRINGS: {
    label: "Strings",
    description:
      "String setups selected to balance control, feel, durability and response.",
    icon: Layers3,
  },

  SHOES: {
    label: "Shoes",
    description:
      "Performance footwear created for movement, stability and court-specific demands.",
    icon: Gem,
  },

  APPAREL: {
    label: "Apparel",
    description:
      "On-court collections that connected performance technology with visual identity.",
    icon: Shirt,
  },

  BAG: {
    label: "Bags",
    description:
      "Tournament bags and travel equipment associated with the professional career.",
    icon: Backpack,
  },

  ACCESSORY: {
    label: "Accessories",
    description:
      "Supporting equipment and details that completed the champion's on-court setup.",
    icon: Sparkles,
  },

  OTHER: {
    label: "Other Equipment",
    description:
      "Additional technical objects documented by the AGE202 museum archive.",
    icon: PackageOpen,
  },
};

export const categoryOrder: PlayerMuseumEquipmentCategory[] = [
  "RACQUET",
  "STRINGS",
  "SHOES",
  "APPAREL",
  "BAG",
  "ACCESSORY",
  "OTHER",
];
