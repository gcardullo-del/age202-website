"use client";

import type { MediaFolder } from "@/generated/prisma/client";
import type { MediaAssetWithFolder } from "@/lib/repositories/media.repository";
import MediaCard from "./MediaCard";

type FolderWithCount = MediaFolder & { _count: { assets: number } };

export default function MediaGrid({
  assets,
  folders,
}: {
  assets: MediaAssetWithFolder[];
  folders: FolderWithCount[];
}) {
  return (
    <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-3 2xl:grid-cols-4">
      {assets.map((asset) => (
        <MediaCard key={asset.id} asset={asset} folders={folders} />
      ))}
    </div>
  );
}
