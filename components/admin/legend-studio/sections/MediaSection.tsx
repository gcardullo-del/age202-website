"use client";

import {
  ImageIcon,
  ImagePlus,
  Images,
  MonitorSmartphone,
  Sparkles,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";

import {
  useLegendStudio,
} from "@/components/admin/legend-studio/LegendStudioForm";

type MediaSectionProps = {
  initialHeroImage?: string | null;
  initialPortraitImage?: string | null;
};

export default function MediaSection({
  initialHeroImage = null,
  initialPortraitImage = null,
}: MediaSectionProps) {
  const {
    preview,
    updatePreview,
  } = useLegendStudio();

  return (
    <section className="space-y-8">
      <div>
        <div className="flex items-center gap-2 text-lime-300/75">
          <Images className="size-4" />

          <p className="text-[10px] font-black uppercase tracking-[0.22em]">
            Legend media
          </p>
        </div>

        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-white">
          Hero & portrait imagery
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-white/40">
          Define the two core images used by THE LEGENDS:
          a cinematic Hero image and a portrait dedicated
          to cards, archive previews and profile identity.
          Upload directly from your computer or keep a manual
          public URL as fallback.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <MediaCard
          eyebrow="Hero image"
          title="Cinematic archive hero"
          description="Wide image used at the top of the public Legend profile."
          value={
            preview.heroImage ??
            initialHeroImage
          }
          name="heroImage"
          fileName="heroFile"
          uploadLabel="Choose hero image"
          placeholder="https://..."
          aspectClass="aspect-[16/9]"
          onChange={(value) =>
            updatePreview({
              heroImage:
                value || null,
            })
          }
        />

        <MediaCard
          eyebrow="Portrait image"
          title="Legend portrait"
          description="Vertical portrait used in THE LEGENDS cards and Studio preview."
          value={
            preview.portraitImage ??
            initialPortraitImage
          }
          name="portraitImage"
          fileName="portraitFile"
          uploadLabel="Choose portrait image"
          placeholder="https://..."
          aspectClass="aspect-[4/5]"
          onChange={(value) =>
            updatePreview({
              portraitImage:
                value || null,
            })
          }
        />
      </div>

      <div className="rounded-[26px] border border-white/10 bg-white/[0.02] p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="grid size-11 shrink-0 place-items-center rounded-2xl border border-lime-300/15 bg-lime-300/[0.06]">
            <MonitorSmartphone className="size-5 text-lime-300" />
          </div>

          <div>
            <p className="text-sm font-semibold text-white">
              Public profile media
            </p>

            <p className="mt-2 max-w-3xl text-xs leading-6 text-white/40">
              Uploads from your PC are saved through the existing
              AGE202 storage pipeline and registered automatically
              in the Media Library. If a file is selected, its uploaded
              URL takes priority over the manual URL when you save.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-[24px] border border-white/10 bg-gradient-to-br from-white/[0.035] to-transparent p-5">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-0.5 size-5 shrink-0 text-lime-300" />

          <div>
            <p className="text-sm font-semibold text-white/80">
              Recommended image direction
            </p>

            <p className="mt-1 text-xs leading-6 text-white/35">
              Use editorial or historical tennis imagery with a
              clean focal subject. The public Legend page will use
              darker AGE202 overlays so text remains legible without
              altering the original photograph.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function MediaCard({
  eyebrow,
  title,
  description,
  value,
  name,
  fileName,
  uploadLabel,
  placeholder,
  aspectClass,
  onChange,
}: {
  eyebrow: string;
  title: string;
  description: string;
  value: string | null;
  name: string;
  fileName: string;
  uploadLabel: string;
  placeholder: string;
  aspectClass: string;
  onChange: (
    value: string,
  ) => void;
}) {
  const [
    localPreview,
    setLocalPreview,
  ] = useState<string | null>(
    null,
  );

  useEffect(() => {
    return () => {
      if (localPreview) {
        URL.revokeObjectURL(
          localPreview,
        );
      }
    };
  }, [localPreview]);

  const previewUrl =
    localPreview ??
    value;

  function handleFileChange(
    file: File | null,
  ) {
    if (localPreview) {
      URL.revokeObjectURL(
        localPreview,
      );
    }

    setLocalPreview(
      file
        ? URL.createObjectURL(
            file,
          )
        : null,
    );
  }

  return (
    <article className="overflow-hidden rounded-[28px] border border-white/10 bg-[#07101D]/55">
      <div
        className={[
          "relative overflow-hidden border-b border-white/10 bg-[#050B18]",
          aspectClass,
        ].join(" ")}
      >
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="grid h-full place-items-center">
            <div className="text-center">
              <div className="mx-auto grid size-14 place-items-center rounded-2xl border border-white/10 bg-white/[0.03]">
                <ImageIcon className="size-6 text-white/20" />
              </div>

              <p className="mt-3 text-xs font-semibold text-white/30">
                No image selected
              </p>
            </div>
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050B18]/65 via-transparent to-transparent" />
      </div>

      <div className="space-y-5 p-5 sm:p-6">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-lime-300/70">
            {eyebrow}
          </p>

          <h3 className="mt-2 text-xl font-semibold tracking-[-0.025em] text-white">
            {title}
          </h3>

          <p className="mt-2 text-xs leading-6 text-white/35">
            {description}
          </p>
        </div>

        <label className="block">
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/35">
            Upload from PC
          </span>

          <div className="mt-2.5 flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-lime-300/25 bg-lime-300/[0.035] px-5 py-5 text-center transition hover:border-lime-300/40 hover:bg-lime-300/[0.055]">
            <span className="grid size-10 place-items-center rounded-2xl border border-lime-300/20 bg-lime-300/10 text-lime-200">
              <ImagePlus className="size-4.5" />
            </span>

            <span className="mt-3 text-sm font-semibold text-white">
              {uploadLabel}
            </span>

            <span className="mt-1.5 text-xs leading-5 text-white/35">
              The uploaded file will also be registered in the AGE202 Media Library.
            </span>

            <input
              type="file"
              name={fileName}
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={(event) =>
                handleFileChange(
                  event.target.files?.[0] ??
                    null,
                )
              }
              className="mt-4 block w-full cursor-pointer rounded-2xl border border-white/10 bg-[#050B18] px-3 py-3 text-xs text-white/55 file:mr-3 file:rounded-xl file:border-0 file:bg-lime-300 file:px-3 file:py-2 file:text-xs file:font-black file:text-[#050B18] hover:file:bg-lime-200"
            />
          </div>
        </label>

        <label className="block">
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/35">
            Manual image URL
          </span>

          <input
            name={name}
            type="url"
            value={value ?? ""}
            placeholder={placeholder}
            onChange={(event) =>
              onChange(
                event.target.value,
              )
            }
            className="mt-2.5 w-full rounded-2xl border border-white/10 bg-[#050B18]/75 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-lime-300/35 focus:ring-2 focus:ring-lime-300/10"
          />
        </label>

        {localPreview ? (
          <p className="text-xs leading-6 text-lime-200/55">
            Local preview selected. Save changes to upload and register the image.
          </p>
        ) : null}

        {value ? (
          <button
            type="button"
            onClick={() =>
              onChange("")
            }
            className="text-xs font-semibold text-white/35 transition hover:text-red-300"
          >
            Remove stored image
          </button>
        ) : null}
      </div>
    </article>
  );
}