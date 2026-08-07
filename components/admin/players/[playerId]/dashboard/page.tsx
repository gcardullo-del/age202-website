import { notFound } from "next/navigation";

import AdminShell from "@/components/admin/AdminShell";

import PlayerDashboard from "@/components/admin/dashboard/PlayerDashboard";

import {
  mapPlayerToDashboardData,
} from "@/lib/mappers/player-dashboard.mapper";

import {
  getAdminPlayer,
} from "@/lib/repositories/admin/admin-player.repository";

export const dynamic =
  "force-dynamic";

type PlayerDashboardPageProps = {
  params: Promise<{
    playerId: string;
  }>;
};

export default async function PlayerDashboardPage({
  params,
}: PlayerDashboardPageProps) {
  const {
    playerId,
  } = await params;

  const player =
    await getAdminPlayer(
      playerId,
    );

  if (!player) {
    notFound();
  }

  const dashboardPlayer =
    mapPlayerToDashboardData(
      player,
    );

  return (
    <AdminShell
      title={`${player.name} Dashboard`}
      description="Review the complete AGE202 archive overview, museum relationships and player activity."
    >
      <PlayerDashboard
        player={
          dashboardPlayer
        }
      />
    </AdminShell>
  );
}