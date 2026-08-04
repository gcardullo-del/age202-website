import AdminShell from "@/components/admin/AdminShell";

import {
  getAllMedia,
} from "@/lib/repositories/media.repository";

import CollectionForm from "../components/CollectionForm";

export const dynamic =
  "force-dynamic";

export default async function NewCollectionPage() {
  const mediaAssets =
    await getAllMedia({
      mimeType: "image/",
    });

  return (
    <AdminShell
      title="New Collection"
      description="Create a new curated AGE202 museum collection."
    >
      <CollectionForm
        mediaAssets={
          mediaAssets
        }
      />
    </AdminShell>
  );
}
