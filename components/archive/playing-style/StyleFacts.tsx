import {
  Activity,
  Award,
  Hand,
  Target,
} from "lucide-react";

import type {
  PlayerMuseumData,
} from "@/lib/types/player-museum";

import StyleFactCard from "./StyleFactCard";
import type {
  StyleFact,
} from "./types";

type StyleFactsProps = {
  player: PlayerMuseumData;
};

export default function StyleFacts({
  player,
}: StyleFactsProps) {
  const profile = player.profile;

  if (!profile) {
    return null;
  }

  const styleFacts: StyleFact[] = [
    {
      label: "Plays",
      value:
        profile.plays ??
        "Not documented",
      icon: Hand,
    },
    {
      label: "Backhand",
      value:
        profile.backhand ??
        "Not documented",
      icon: Activity,
    },
    {
      label: "Preferred surface",
      value:
        profile.favouriteSurface ??
        "Not documented",
      icon: Target,
    },
    {
      label: "Career high",
      value:
        profile.careerHigh
          ? `World No. ${profile.careerHigh}`
          : "Not documented",
      icon: Award,
    },
  ];

  return (
    <aside className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
      {styleFacts.map((fact) => (
        <StyleFactCard
          key={fact.label}
          fact={fact}
          accent={
            player.accent
          }
        />
      ))}
    </aside>
  );
}
