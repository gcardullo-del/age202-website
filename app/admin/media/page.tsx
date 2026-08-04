import {
  FileImage,
  HardDrive,
  ImagePlus,
  Images,
  PackageCheck,
  PackageX,
} from "lucide-react";

import AdminShell from "@/components/admin/AdminShell";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import AdminStatsGrid from "@/components/admin/ui/AdminStatsGrid";
import MediaLibrary from "@/components/admin/media/MediaLibrary";
import {
  getAllMedia,
  getMediaFolders,
  getMediaStatistics,
} from "@/lib/repositories/media.repository";

export const dynamic = "force-dynamic";

type MediaPageProps = {
  searchParams: Promise<{
    q?: string;
    folder?: string;
    usage?: string;
    type?: string;
  }>;
};

function normalize(value: string | undefined): string {
  return value?.trim() ?? "";
}

function formatBytes(bytes: number): string {
  if (bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );
  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

export default async function MediaPage({ searchParams }: MediaPageProps) {
  const params = await searchParams;
  const query = normalize(params.q);
  const folder = normalize(params.folder);
  const usage = normalize(params.usage);
  const type = normalize(params.type);

  const [assets, folders, statistics] = await Promise.all([
    getAllMedia({
      query: query || undefined,
      folderId: folder === "unfiled" ? null : folder || undefined,
      isUsed:
        usage === "used" ? true : usage === "unused" ? false : undefined,
      mimeType: type === "images" ? "image/" : undefined,
      extension: ["jpg", "jpeg", "png", "webp", "avif"].includes(type)
        ? type
        : undefined,
    }),
    getMediaFolders(),
    getMediaStatistics(),
  ]);

  const hasActiveFilters = Boolean(query || folder || usage || type);

  return (
    <AdminShell
      title="Media Library"
      description="Manage every reusable visual asset inside AGE202."
    >
      <div className="space-y-7">
        <AdminPageHeader
          eyebrow="Digital asset management"
          title="Media Library"
          description="Upload, organize, search and reuse the images that power the AGE202 museum, shop and Originals catalog."
          icon={Images}
          actionLabel="Upload images"
          actionHref="#upload-media"
          actionIcon={ImagePlus}
        />

        <AdminStatsGrid
          columns={5}
          items={[
            { label: "Total assets", value: statistics.total, icon: FileImage },
            { label: "Images", value: statistics.images, icon: Images, tone: "info" },
            { label: "Used", value: statistics.used, icon: PackageCheck, tone: "success" },
            { label: "Unused", value: statistics.unused, icon: PackageX, tone: "warning" },
            {
              label: "Storage",
              value: formatBytes(statistics.totalSize),
              icon: HardDrive,
              tone: "museum",
              helper: `${statistics.folders} folders`,
            },
          ]}
        />

        <MediaLibrary
          assets={assets}
          folders={folders}
          query={query}
          folder={folder}
          usage={usage}
          type={type}
          hasActiveFilters={hasActiveFilters}
        />
      </div>
    </AdminShell>
  );
}
