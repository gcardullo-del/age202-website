import { prisma } from "@/lib/prisma";

import AdminShell from "@/components/admin/AdminShell";

import ArtifactForm from "./components/ArtifactForm";

export default async function NewArtifactPage() {
  const [players, brands] = await Promise.all([
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
  ]);

  return (
    <AdminShell
      title="New Artifact"
      description="Add a new piece to the AGE202 Museum."
    >
      <ArtifactForm
        players={players}
        brands={brands}
      />
    </AdminShell>
  );
}