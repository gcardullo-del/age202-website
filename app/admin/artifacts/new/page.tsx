import { prisma } from "@/lib/prisma";

import AdminShell from "@/components/admin/AdminShell";

import ArtifactForm from "./components/ArtifactForm";

export default async function NewArtifactPage() {
  const [players, brands, tournaments] =
    await Promise.all([
      prisma.player.findMany({
        orderBy: {
          name: "asc",
        },
      }),

      prisma.brand.findMany({
        orderBy: {
          name: "asc",
        },
      }),

      prisma.tournament.findMany({
        where: {
          active: true,
        },

        orderBy: [
          {
            category: "asc",
          },
          {
            name: "asc",
          },
        ],
      }),
    ]);

  return (
    <AdminShell
      title="New Artifact"
      description="Add a new piece to the AGE202 Museum."
    >
      <ArtifactForm
        players={players}
        brands={brands}
        tournaments={tournaments}
      />
    </AdminShell>
  );
}