export type LegacyCardProps = {
  index: string;
  title: string;
  description: string;
  accent: string;
  delay: number;
  shouldReduceMotion: boolean | null;
};

export type LegacyDetailProps = {
  label: string;
  value: string;
  accent?: string;
};

export type LegacyMarkProps = {
  accent: string;
};
