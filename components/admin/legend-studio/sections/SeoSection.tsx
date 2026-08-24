"use client";

import {
  CheckCircle2,
  Globe2,
  ImageIcon,
  Search,
  Share2,
} from "lucide-react";
import { useMemo, useState } from "react";

type SeoSectionProps = {
  initialMetaTitle?: string | null;
  initialMetaDescription?: string | null;
  initialCanonicalUrl?: string | null;
  initialOpenGraphImage?: string | null;
  initialRobotsIndex?: boolean | null;
  initialRobotsFollow?: boolean | null;
};

export default function SeoSection({
  initialMetaTitle = "",
  initialMetaDescription = "",
  initialCanonicalUrl = "",
  initialOpenGraphImage = "",
  initialRobotsIndex = true,
  initialRobotsFollow = true,
}: SeoSectionProps) {
  const [metaTitle, setMetaTitle] =
    useState(initialMetaTitle ?? "");
  const [metaDescription, setMetaDescription] =
    useState(initialMetaDescription ?? "");
  const [canonicalUrl, setCanonicalUrl] =
    useState(initialCanonicalUrl ?? "");
  const [openGraphImage, setOpenGraphImage] =
    useState(initialOpenGraphImage ?? "");
  const [robotsIndex, setRobotsIndex] =
    useState(initialRobotsIndex ?? true);
  const [robotsFollow, setRobotsFollow] =
    useState(initialRobotsFollow ?? true);

  const score = useMemo(() => {
    let value = 0;
    if (metaTitle.trim().length >= 30) value += 25;
    if (metaDescription.trim().length >= 80) value += 25;
    if (canonicalUrl.trim()) value += 20;
    if (openGraphImage.trim()) value += 20;
    if (robotsIndex && robotsFollow) value += 10;
    return value;
  }, [
    metaTitle,
    metaDescription,
    canonicalUrl,
    openGraphImage,
    robotsIndex,
    robotsFollow,
  ]);

  return (
    <section className="space-y-8">
      <div>
        <div className="flex items-center gap-2 text-lime-300/75">
          <Search className="size-4" />
          <p className="text-[10px] font-black uppercase tracking-[0.22em]">
            Search & discovery
          </p>
        </div>

        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-white">
          SEO & social metadata
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-white/40">
          Control how this Legend profile appears in search engines and when
          shared across social platforms.
        </p>
      </div>

      <div className="rounded-[24px] border border-white/10 bg-white/[0.02] p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/30">
              Metadata quality
            </p>
            <p className="mt-2 text-2xl font-semibold text-white">{score}%</p>
          </div>

          <div className="flex items-center gap-2 text-xs text-white/40">
            <CheckCircle2 className="size-4 text-lime-300/70" />
            AGE202 discovery layer
          </div>
        </div>

        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="h-full rounded-full bg-lime-300 transition-all duration-300"
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      <div className="rounded-[28px] border border-white/10 bg-[#07101D]/55 p-5 sm:p-7">
        <SectionTitle
          icon={Globe2}
          eyebrow="Search engines"
          title="Search result metadata"
        />

        <div className="mt-6 space-y-5">
          <Field label="Meta title">
            <input
              name="metaTitle"
              value={metaTitle}
              maxLength={70}
              placeholder="Rod Laver | Tennis Legend | AGE202"
              onChange={(event) => setMetaTitle(event.target.value)}
              className={inputClasses}
            />
            <Counter value={metaTitle.length} max={70} />
          </Field>

          <Field label="Meta description">
            <textarea
              name="metaDescription"
              rows={5}
              value={metaDescription}
              maxLength={180}
              placeholder="Discover the career, Grand Slam achievements and historical legacy of..."
              onChange={(event) => setMetaDescription(event.target.value)}
              className={textareaClasses}
            />
            <Counter value={metaDescription.length} max={180} />
          </Field>

          <Field label="Canonical URL">
            <input
              name="canonicalUrl"
              type="url"
              value={canonicalUrl}
              placeholder="https://www.age202.com/legends/rod-laver"
              onChange={(event) => setCanonicalUrl(event.target.value)}
              className={inputClasses}
            />
          </Field>
        </div>
      </div>

      <div className="rounded-[28px] border border-white/10 bg-[#07101D]/55 p-5 sm:p-7">
        <SectionTitle
          icon={Share2}
          eyebrow="Social sharing"
          title="Open Graph presentation"
        />

        <div className="mt-6">
          <Field label="Open Graph image">
            <input
              name="openGraphImage"
              type="url"
              value={openGraphImage}
              placeholder="https://..."
              onChange={(event) => setOpenGraphImage(event.target.value)}
              className={inputClasses}
            />
          </Field>

          <div className="mt-5 overflow-hidden rounded-[22px] border border-white/10 bg-[#050B18]">
            <div className="aspect-[1.91/1] overflow-hidden bg-white/[0.025]">
              {openGraphImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={openGraphImage}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="grid h-full place-items-center">
                  <ImageIcon className="size-8 text-white/15" />
                </div>
              )}
            </div>

            <div className="p-5">
              <p className="text-[9px] font-black uppercase tracking-[0.16em] text-lime-300/55">
                AGE202 · THE LEGENDS
              </p>
              <p className="mt-2 text-base font-semibold text-white/85">
                {metaTitle || "Legend profile title"}
              </p>
              <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/35">
                {metaDescription ||
                  "The social preview will appear here as metadata is completed."}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[28px] border border-white/10 bg-gradient-to-br from-white/[0.035] to-transparent p-5 sm:p-7">
        <SectionTitle
          icon={Search}
          eyebrow="Crawler policy"
          title="Search visibility"
        />

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Toggle
            name="robotsIndex"
            checked={robotsIndex}
            onChange={setRobotsIndex}
            title="Allow indexing"
            text="Permit search engines to include this Legend profile in results."
          />

          <Toggle
            name="robotsFollow"
            checked={robotsFollow}
            onChange={setRobotsFollow}
            title="Allow link following"
            text="Permit crawlers to follow links contained in this profile."
          />
        </div>
      </div>
    </section>
  );
}

const inputClasses =
  "w-full rounded-2xl border border-white/10 bg-[#050B18]/75 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-lime-300/35 focus:ring-2 focus:ring-lime-300/10";

const textareaClasses =
  "w-full resize-y rounded-2xl border border-white/10 bg-[#050B18]/75 px-4 py-3.5 text-sm leading-7 text-white outline-none transition placeholder:text-white/20 focus:border-lime-300/35 focus:ring-2 focus:ring-lime-300/10";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2.5 block text-[10px] font-bold uppercase tracking-[0.16em] text-white/35">
        {label}
      </span>
      {children}
    </label>
  );
}

function Counter({
  value,
  max,
}: {
  value: number;
  max: number;
}) {
  return (
    <div className="mt-2 flex justify-end">
      <span className="text-[10px] font-semibold tabular-nums text-white/20">
        {value}/{max}
      </span>
    </div>
  );
}

function SectionTitle({
  icon: Icon,
  eyebrow,
  title,
}: {
  icon: React.ComponentType<{ className?: string }>;
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="grid size-10 shrink-0 place-items-center rounded-2xl border border-lime-300/15 bg-lime-300/[0.06]">
        <Icon className="size-4 text-lime-300" />
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-lime-300/70">
          {eyebrow}
        </p>
        <h3 className="mt-1 text-lg font-semibold text-white">{title}</h3>
      </div>
    </div>
  );
}

function Toggle({
  name,
  checked,
  onChange,
  title,
  text,
}: {
  name: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  title: string;
  text: string;
}) {
  return (
    <label className="flex cursor-pointer gap-4 rounded-[20px] border border-white/10 bg-[#050B18]/55 p-4">
      <input
        name={name}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 size-4 accent-lime-300"
      />

      <span>
        <span className="block text-sm font-semibold text-white/75">
          {title}
        </span>
        <span className="mt-1 block text-xs leading-5 text-white/30">
          {text}
        </span>
      </span>
    </label>
  );
}