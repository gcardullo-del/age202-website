export type TrophyItem = {
  label: string;
  value: number;
  description: string;
};

export type TrophyMetaProps = {
  label: string;
  value: string;
  accent?: string;
};

export type TrophyIconProps = {
  accent: string;
};

export type TrophyCardProps = {
  item: TrophyItem;
  index: number;
  accent: string;
  shouldReduceMotion: boolean | null;
};

export type FeaturedTrophyProps = {
  value: number;
  accent: string;
  shouldReduceMotion: boolean | null;
};
