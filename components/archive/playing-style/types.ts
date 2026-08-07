import type {
  LucideIcon,
} from "lucide-react";

export type StyleFact = {
  label: string;
  value: string;
  icon: LucideIcon;
};

export type StyleFactCardProps = {
  fact: StyleFact;
  accent: string;
};

export type StyleBadgeProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  accent: string;
};
