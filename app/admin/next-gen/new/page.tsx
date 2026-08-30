import AdminShell from "@/components/admin/AdminShell";

import NextGenPlayerForm from "@/components/admin/next-gen/NextGenPlayerForm";

import {
  getAllMedia,
} from "@/lib/repositories/media.repository";

import {
  createNextGenPlayer,
} from "../actions/createNextGenPlayer";

export const dynamic =
  "force-dynamic";

export default async function NewNextGenPlayerPage() {
  const mediaAssets =
    await getAllMedia({
      mimeType:
        "image/",
    });

  return (
    <AdminShell
      title="New NEXT GEN Player"
      description="Create a new AGE202 NEXT GEN archive dossier and connect it to the automatic ATP profile ranking system."
    >
      <div className="w-full">
        <NextGenPlayerForm
          action={
            createNextGenPlayer
          }
          libraryAssets={
            mediaAssets
          }
          mode="create"
        />
      </div>
    </AdminShell>
  );
}
