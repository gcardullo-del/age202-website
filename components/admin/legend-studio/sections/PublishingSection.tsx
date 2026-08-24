"use client";

import {
  Archive,
  CheckCircle2,
  Eye,
  EyeOff,
  Flag,
  Star,
} from "lucide-react";

import {
  useLegendStudio,
} from "@/components/admin/legend-studio/LegendStudioForm";

type PublishingSectionProps = {
  initialDisplayOrder?: number | null;
};

export default function PublishingSection({
  initialDisplayOrder = 0,
}: PublishingSectionProps) {
  const {
    preview,
    updatePreview,
  } = useLegendStudio();

  return (
    <section className="space-y-8">
      <div>
        <div className="flex items-center gap-2 text-lime-300/75">
          <Flag className="size-4" />

          <p className="text-[10px] font-black uppercase tracking-[0.22em]">
            Publishing
          </p>
        </div>

        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-white">
          Visibility & archive state
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-white/40">
          Decide when this Legend profile becomes public, whether it should
          be featured in THE LEGENDS and where it appears in the archive.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <StatusCard
          active={preview.status === "DRAFT"}
          icon={Archive}
          title="Draft"
          text="Keep the profile inside the CMS while editorial work continues."
          onClick={() =>
            updatePreview({
              status: "DRAFT",
            })
          }
        />

        <StatusCard
          active={preview.status === "PUBLISHED"}
          icon={Eye}
          title="Published"
          text="Make the Legend profile publicly available on the AGE202 website."
          onClick={() =>
            updatePreview({
              status: "PUBLISHED",
            })
          }
        />

        <StatusCard
          active={preview.status === "ARCHIVED"}
          icon={EyeOff}
          title="Archived"
          text="Keep the record in the CMS but remove it from the public archive."
          onClick={() =>
            updatePreview({
              status: "ARCHIVED",
            })
          }
        />
      </div>

      <input
        type="hidden"
        name="status"
        value={preview.status}
        readOnly
      />

      <div className="rounded-[28px] border border-white/10 bg-[#07101D]/55 p-5 sm:p-7">
        <div className="flex items-start gap-3">
          <div className="grid size-11 shrink-0 place-items-center rounded-2xl border border-lime-300/15 bg-lime-300/[0.06]">
            <Star className="size-5 text-lime-300" />
          </div>

          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-lime-300/70">
              Featured legend
            </p>

            <h3 className="mt-1 text-lg font-semibold text-white">
              Highlight this profile
            </h3>

            <p className="mt-2 max-w-2xl text-xs leading-6 text-white/35">
              Featured Legends can later be surfaced more prominently on the
              main THE LEGENDS landing page.
            </p>
          </div>
        </div>

        <label className="mt-6 flex cursor-pointer items-start gap-4 rounded-[22px] border border-white/10 bg-[#050B18]/55 p-5">
          <input
            name="featured"
            type="checkbox"
            checked={preview.featured}
            onChange={(event) =>
              updatePreview({
                featured:
                  event.target.checked,
              })
            }
            className="mt-1 size-4 accent-lime-300"
          />

          <span>
            <span className="block text-sm font-semibold text-white/80">
              Feature this Legend
            </span>

            <span className="mt-1 block text-xs leading-5 text-white/30">
              Use this sparingly for iconic profiles or editorial highlights.
            </span>
          </span>
        </label>
      </div>

      <div className="rounded-[28px] border border-white/10 bg-white/[0.02] p-5 sm:p-7">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/30">
          Archive order
        </p>

        <h3 className="mt-2 text-lg font-semibold text-white">
          Display priority
        </h3>

        <p className="mt-2 max-w-2xl text-xs leading-6 text-white/35">
          Lower numbers appear first inside the corresponding Men&apos;s or
          Women&apos;s Legends branch.
        </p>

        <input
          name="displayOrder"
          type="number"
          min={0}
          defaultValue={
            initialDisplayOrder ?? 0
          }
          className="mt-5 w-full max-w-xs rounded-2xl border border-white/10 bg-[#050B18]/75 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-lime-300/35 focus:ring-2 focus:ring-lime-300/10"
        />
      </div>

      <div
        className={[
          "rounded-[24px] border p-5",
          preview.status === "PUBLISHED"
            ? "border-emerald-300/15 bg-emerald-300/[0.04]"
            : "border-amber-300/15 bg-amber-300/[0.04]",
        ].join(" ")}
      >
        <div className="flex items-start gap-3">
          <CheckCircle2
            className={[
              "mt-0.5 size-5 shrink-0",
              preview.status === "PUBLISHED"
                ? "text-emerald-300"
                : "text-amber-300",
            ].join(" ")}
          />

          <div>
            <p
              className={[
                "text-sm font-semibold",
                preview.status === "PUBLISHED"
                  ? "text-emerald-100"
                  : "text-amber-100",
              ].join(" ")}
            >
              {preview.status === "PUBLISHED"
                ? "Public profile enabled"
                : preview.status === "ARCHIVED"
                  ? "Profile archived"
                  : "Profile still in draft"}
            </p>

            <p className="mt-1 text-xs leading-6 text-white/35">
              {preview.status === "PUBLISHED"
                ? "Saving this Legend will mark it as published and assign a publication timestamp."
                : "This Legend remains unavailable to the public until its status is changed to Published."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatusCard({
  active,
  icon: Icon,
  title,
  text,
  onClick,
}: {
  active: boolean;
  icon: React.ComponentType<{
    className?: string;
  }>;
  title: string;
  text: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-[24px] border p-5 text-left transition",
        active
          ? "border-lime-300/30 bg-lime-300/[0.08]"
          : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.035]",
      ].join(" ")}
    >
      <Icon
        className={[
          "size-5",
          active
            ? "text-lime-300"
            : "text-white/30",
        ].join(" ")}
      />

      <p className="mt-4 text-sm font-semibold text-white">
        {title}
      </p>

      <p className="mt-2 text-xs leading-6 text-white/35">
        {text}
      </p>
    </button>
  );
}