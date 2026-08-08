"use client";

import {
  Eye,
  Star,
} from "lucide-react";

import type {
  ArtifactStatus,
} from "@/generated/prisma/client";

import FormSection from "@/components/admin/FormSection";

import {
  useArtifactStudio,
} from "./ArtifactStudioContext";

export type PublicationInitialValues = {
  status?: ArtifactStatus | null;
  slug?: string | null;
  featured?: boolean | null;
};

type PublicationCardProps = {
  initialValues?: PublicationInitialValues;
};

const inputClass =
  "w-full rounded-2xl border border-white/10 bg-[#0A1222] px-4 py-3 text-white outline-none transition placeholder:text-white/25 focus:border-lime-300/40";

const labelClass =
  "mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-white/45";

export default function PublicationCard({
  initialValues,
}: PublicationCardProps) {
  const {
    updatePreview,
  } = useArtifactStudio();

  return (
    <FormSection
      title="Publication"
      description="Control how this artifact appears in the AGE202 digital museum."
      icon={<Eye size={20} />}
    >
      <div className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="status"
              className={labelClass}
            >
              Publication Status
            </label>

            <select
              id="status"
              name="status"
              className={inputClass}
              defaultValue={
                initialValues?.status ?? "DRAFT"
              }
              onChange={(event) =>
                updatePreview({
                  status:
                    event.target.value,
                })
              }
            >
              <option value="DRAFT">
                Draft
              </option>

              <option value="PUBLISHED">
                Published
              </option>

              <option value="ARCHIVED">
                Archived
              </option>
            </select>

            <p className="mt-3 text-sm leading-6 text-white/35">
              Draft artifacts remain private.
              Published artifacts can appear
              in the public museum.
            </p>
          </div>

          <div>
            <label
              htmlFor="slug"
              className={labelClass}
            >
              Custom Slug
            </label>

            <input
              id="slug"
              name="slug"
              type="text"
              autoComplete="off"
              className={inputClass}
              placeholder="nike-federer-wimbledon-polo-2017"
              defaultValue={
                initialValues?.slug ?? ""
              }
            />

            <p className="mt-3 text-sm leading-6 text-white/35">
              Leave empty to generate the URL
              automatically from the title.
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#08111F] p-6">
          <label
            htmlFor="featured"
            className="flex cursor-pointer items-start gap-4"
          >
            <input
              id="featured"
              name="featured"
              type="checkbox"
              value="true"
              className="mt-1 h-5 w-5 rounded border-white/20 bg-[#0A1222] text-lime-300 accent-lime-300"
              defaultChecked={
                initialValues?.featured ?? false
              }
              onChange={(event) =>
                updatePreview({
                  featured:
                    event.target.checked,
                })
              }
            />

            <span className="flex-1">
              <span className="flex items-center gap-2 text-base font-semibold text-white">
                <Star
                  size={18}
                  className="text-lime-300"
                />

                Featured Artifact
              </span>

              <span className="mt-2 block text-sm leading-6 text-white/40">
                Highlight this artifact in
                prominent museum sections such as
                the homepage, curated exhibitions
                or featured collections.
              </span>
            </span>
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
              Draft
            </div>

            <p className="mt-3 text-sm leading-6 text-white/55">
              Saved in the CMS but not visible
              in the public archive.
            </p>
          </div>

          <div className="rounded-2xl border border-lime-300/20 bg-lime-300/[0.04] p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-300">
              Published
            </div>

            <p className="mt-3 text-sm leading-6 text-white/55">
              Available for display in the
              public AGE202 museum.
            </p>
          </div>

          <div className="rounded-2xl border border-amber-300/20 bg-amber-300/[0.04] p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
              Archived
            </div>

            <p className="mt-3 text-sm leading-6 text-white/55">
              Preserved in the database but
              removed from active exhibitions.
            </p>
          </div>
        </div>
      </div>
    </FormSection>
  );
}