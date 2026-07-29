import { getArchiveLink, registerArchiveLink } from "@/lib/archive-links";

export type PlayerArchiveLink = {
  name: string;
  slug: string;
  href: string;
};

export const PLAYER_ARCHIVES = [
  { name: "Roger Federer", slug: "federer", href: "/archives/federer" },
  { name: "Rafael Nadal", slug: "nadal", href: "/archives/nadal" },
  { name: "Novak Djokovic", slug: "djokovic", href: "/archives/djokovic" },
  { name: "Jannik Sinner", slug: "sinner", href: "/archives/sinner" },
  { name: "Carlos Alcaraz", slug: "alcaraz", href: "/archives/alcaraz" },
] as const satisfies readonly PlayerArchiveLink[];

for (const player of PLAYER_ARCHIVES) {
  registerArchiveLink({
    type: "player",
    label: player.name,
    href: player.href,
  });
}

export function getPlayerArchiveHref(playerName: string) {
  return getArchiveLink("player", playerName)?.href ?? null;
}

export function hasPlayerArchive(playerName: string) {
  return getPlayerArchiveHref(playerName) !== null;
}
