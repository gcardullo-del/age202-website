import AdminShell from "@/components/admin/AdminShell";
import { prisma } from "@/lib/prisma";

import MemorabiliaForm from "./components/MemorabiliaForm";

export const dynamic = "force-dynamic";

export default async function NewMemorabiliaPage() {
  const players =
    await prisma.player.findMany({
      orderBy: {
        name: "asc",
      },

      select: {
        id: true,
        name: true,
      },
    });

  return (
    <AdminShell
      title="New Memorabilia"
      description="Add a collectible tennis item to the AGE202 memorabilia archive."
    >
      <MemorabiliaForm
        players={players}
      />
    </AdminShell>
  );
}