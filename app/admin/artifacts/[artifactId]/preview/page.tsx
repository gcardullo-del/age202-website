import ArtifactGallery from "@/components/artifacts/ArtifactGallery";
import ArtifactHero from "@/components/artifacts/ArtifactHero";
import AdminShell from "@/components/admin/AdminShell";

import Link from "next/link";
import { notFound } from "next/navigation";

import {
  ArrowLeft,
  ExternalLink,
  Eye,
  ImageIcon,
} from "lucide-react";

import {
  getArtifactById,
} from "@/lib/repositories/artifact.repository";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    artifactId: string;
  }>;
};

export default async function AdminArtifactPreviewPage({
  params,
}: PageProps) {
  const { artifactId } = await params;

  const artifact =
    await getArtifactById(artifactId);

  if (!artifact) {
    notFound();
  }

  const isPublished =
    artifact.status === "PUBLISHED";

  return (
    <AdminShell
      title="Artifact Preview"
      description="Private AGE202 preview for reviewing an Artifact before publication."
    >
      <div className="space-y-6">
        <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.035] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-lime-300/20 bg-lime-300/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-lime-200">
                <Eye className="h-3.5 w-3.5" />
                Admin Preview
              </span>

              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-white/55">
                {artifact.status}
              </span>
            </div>

            <h2 className="mt-4 text-xl font-semibold text-white sm:text-2xl">
              {artifact.title}
            </h2>

            <p className="mt-2 text-sm leading-6 text-white/45">
              Questa anteprima può mostrare anche gli Artifact DRAFT senza
              renderli pubblicamente accessibili.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/artifacts"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-white/70 transition hover:border-white/20 hover:bg-white/[0.05] hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Artifacts
            </Link>

            <Link
              href={`/admin/artifacts/${artifact.id}`}
              className="inline-flex items-center gap-2 rounded-xl border border-lime-300/20 bg-lime-300/10 px-4 py-2.5 text-sm font-semibold text-lime-200 transition hover:bg-lime-300/20"
            >
              Edit
            </Link>

            {isPublished ? (
              <Link
                href={`/artifacts/${artifact.slug}`}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-white/70 transition hover:border-lime-300/30 hover:bg-lime-300/10 hover:text-lime-200"
              >
                Public page
                <ExternalLink className="h-4 w-4" />
              </Link>
            ) : null}
          </div>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#050b18]">
          <ArtifactHero artifact={artifact} />

          {artifact.images.length > 0 ? (
            <section className="border-t border-white/10 bg-[#070e1c]">
              <div className="mx-auto max-w-[1440px] px-6 py-16 sm:px-8 lg:px-12 lg:py-20">
                <div className="mb-8 flex items-end justify-between gap-6">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.3em] text-lime-300">
                      Admin image preview
                    </p>

                    <h3 className="mt-3 text-3xl font-black tracking-[-0.035em] text-white sm:text-4xl">
                      Galleria del reperto
                    </h3>

                    <p className="mt-4 max-w-2xl text-sm leading-7 text-white/45">
                      La griglia usa gallery.webp e l&apos;apertura usa
                      detail.webp quando le varianti sono disponibili.
                    </p>
                  </div>

                  <span className="font-mono text-3xl font-black text-white/30">
                    {String(artifact.images.length).padStart(2, "0")}
                  </span>
                </div>

                <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-black/20 p-3 sm:p-5">
                  <ArtifactGallery
                    artifactTitle={artifact.title}
                    images={artifact.images.map((image) => ({
                      id: image.id,
                      url: image.url,
                      galleryUrl: image.galleryUrl,
                      detailUrl: image.detailUrl,
                      alt: image.alt,
                    }))}
                  />
                </div>
              </div>
            </section>
          ) : (
            <section className="border-t border-white/10 bg-[#070e1c] px-6 py-16">
              <div className="mx-auto flex max-w-xl flex-col items-center text-center">
                <div className="grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] text-white/30">
                  <ImageIcon className="h-6 w-6" />
                </div>

                <h3 className="mt-5 text-lg font-semibold text-white">
                  Nessuna immagine
                </h3>

                <p className="mt-2 text-sm leading-6 text-white/40">
                  Questo Artifact non contiene ancora immagini da visualizzare.
                </p>
              </div>
            </section>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
