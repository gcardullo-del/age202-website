import {
  getAtpPlayerByRank,
  getAtpPlayerBySlug,
  getAtpRanking,
  getLinkedAtpPlayers,
} from "@/lib/repositories/atp-player.repository";

export async function getRanking(limit = 150) {
  return getAtpRanking(limit);
}

export async function getTop10() {
  return getAtpRanking(10);
}

export async function getTop20() {
  return getAtpRanking(20);
}

export async function getPlayer(slug: string) {
  return getAtpPlayerBySlug(slug);
}

export async function getPlayerByRank(rank: number) {
  return getAtpPlayerByRank(rank);
}

export async function getAge202Players() {
  return getLinkedAtpPlayers();
}