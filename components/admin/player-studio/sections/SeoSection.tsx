"use client";

import {
  CheckCircle2,
  Globe2,
  ImageIcon,
  Search,
  Share2,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";

import PlayerStudioSection from "../PlayerStudioSection";

import {
  usePlayerStudio,
} from "../PlayerStudioForm";

type SeoSectionProps = {
  initialMetaTitle?: string | null;
  initialMetaDescription?: string | null;
  initialCanonicalUrl?: string | null;
  initialOpenGraphImage?: string | null;
  initialRobotsIndex?: boolean;
  initialRobotsFollow?: boolean;
};

const TITLE_LIMIT = 60;
const DESCRIPTION_LIMIT = 160;

const inputClassName =
  "h-12 w-full rounded-2xl border border-white/10 bg-[#08111F] px-4 text-sm text-white outline-none transition placeholder:text-white/22 focus:border-lime-300/35";

const textareaClassName =
  "w-full resize-y rounded-2xl border border-white/10 bg-[#08111F] px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-white/22 focus:border-lime-300/35";

function getCharacterTone(
  length: number,
  limit: number,
): string {
  if (length > limit) {
    return "text-red-200";
  }

  if (
    length >=
    Math.round(limit * 0.85)
  ) {
    return "text-amber-200";
  }

  return "text-white/25";
}

export default function SeoSection({
  initialMetaTitle = "",
  initialMetaDescription = "",
  initialCanonicalUrl = "",
  initialOpenGraphImage = "",
  initialRobotsIndex = true,
  initialRobotsFollow = true,
}: SeoSectionProps) {
  const {
    preview,
  } = usePlayerStudio();

  const [metaTitle, setMetaTitle] =
    useState(
      initialMetaTitle ?? "",
    );

  const [
    metaDescription,
    setMetaDescription,
  ] = useState(
    initialMetaDescription ?? "",
  );

  const [
    canonicalUrl,
    setCanonicalUrl,
  ] = useState(
    initialCanonicalUrl ?? "",
  );

  const [
    openGraphImage,
    setOpenGraphImage,
  ] = useState(
    initialOpenGraphImage ?? "",
  );

  const [
    robotsIndex,
    setRobotsIndex,
  ] = useState(
    initialRobotsIndex,
  );

  const [
    robotsFollow,
    setRobotsFollow,
  ] = useState(
    initialRobotsFollow,
  );

  const suggestedTitle =
    useMemo(() => {
      const name =
        preview.name.trim() ||
        "New Player";

      return `${name} | AGE202 Tennis Archive`;
    }, [preview.name]);

  const suggestedDescription =
    useMemo(() => {
      const name =
        preview.name.trim() ||
        "this player";

      const country =
        preview.country?.trim();

      return country
        ? `Explore ${name}'s career, archive profile, collections and tennis legacy from ${country} on AGE202.`
        : `Explore ${name}'s career, archive profile, collections and tennis legacy on AGE202.`;
    }, [
      preview.name,
      preview.country,
    ]);

  const resolvedPreviewTitle =
    metaTitle.trim() ||
    suggestedTitle;

  const resolvedPreviewDescription =
    metaDescription.trim() ||
    suggestedDescription;

  const seoScore =
    useMemo(() => {
      let score = 0;

      if (
        metaTitle.trim().length >=
          20 &&
        metaTitle.trim().length <=
          TITLE_LIMIT
      ) {
        score += 30;
      }

      if (
        metaDescription.trim()
          .length >= 70 &&
        metaDescription.trim()
          .length <=
          DESCRIPTION_LIMIT
      ) {
        score += 30;
      }

      if (
        canonicalUrl.trim()
      ) {
        score += 15;
      }

      if (
        openGraphImage.trim() ||
        preview.heroImage ||
        preview.portraitImage
      ) {
        score += 15;
      }

      if (
        robotsIndex &&
        robotsFollow
      ) {
        score += 10;
      }

      return score;
    }, [
      metaTitle,
      metaDescription,
      canonicalUrl,
      openGraphImage,
      preview.heroImage,
      preview.portraitImage,
      robotsIndex,
      robotsFollow,
    ]);

  function applySuggestedMetadata() {
    setMetaTitle(
      suggestedTitle,
    );

    setMetaDescription(
      suggestedDescription,
    );
  }

  return (
    <PlayerStudioSection
      eyebrow="Search visibility"
      title="SEO and social preview"
      description="Define how this player profile appears in search engines and when shared across social platforms."
      icon={Search}
      actions={
        <SeoScoreBadge
          score={seoScore}
        />
      }
      summary={
        <button
          type="button"
          onClick={
            applySuggestedMetadata
          }
          className="inline-flex h-11 items-center gap-2 rounded-2xl border border-white/10 px-4 text-sm font-semibold text-white/55 transition hover:border-lime-300/25 hover:bg-lime-300/[0.05] hover:text-lime-200"
        >
          <CheckCircle2
            className="h-4 w-4"
            aria-hidden="true"
          />
          Use suggested metadata
        </button>
      }
    >
      <div className="space-y-6">
        <div className="rounded-3xl border border-white/10 bg-white/[0.015] p-5 sm:p-6">
          <div className="grid gap-5">
            <label>
              <FieldLabel>
                Meta title
              </FieldLabel>

              <input
                name="metaTitle"
                value={metaTitle}
                onChange={(event) =>
                  setMetaTitle(
                    event.target.value,
                  )
                }
                className={inputClassName}
                placeholder={
                  suggestedTitle
                }
              />

              <CharacterCounter
                value={
                  metaTitle.length
                }
                limit={
                  TITLE_LIMIT
                }
              />
            </label>

            <label>
              <FieldLabel>
                Meta description
              </FieldLabel>

              <textarea
                name="metaDescription"
                value={
                  metaDescription
                }
                onChange={(event) =>
                  setMetaDescription(
                    event.target.value,
                  )
                }
                rows={5}
                className={
                  textareaClassName
                }
                placeholder={
                  suggestedDescription
                }
              />

              <CharacterCounter
                value={
                  metaDescription.length
                }
                limit={
                  DESCRIPTION_LIMIT
                }
              />
            </label>

            <label>
              <FieldLabel>
                Canonical URL
              </FieldLabel>

              <div className="relative">
                <Globe2 className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />

                <input
                  name="canonicalUrl"
                  value={
                    canonicalUrl
                  }
                  onChange={(event) =>
                    setCanonicalUrl(
                      event.target.value,
                    )
                  }
                  className={`${inputClassName} pl-11`}
                  placeholder="https://www.age202.com/players/roger-federer"
                />
              </div>
            </label>

            <label>
              <FieldLabel>
                Open Graph image
              </FieldLabel>

              <div className="relative">
                <ImageIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />

                <input
                  name="openGraphImage"
                  value={
                    openGraphImage
                  }
                  onChange={(event) =>
                    setOpenGraphImage(
                      event.target.value,
                    )
                  }
                  className={`${inputClassName} pl-11`}
                  placeholder="/players/example/social-card.jpg"
                />
              </div>
            </label>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/[0.015] p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <Search className="h-5 w-5 text-lime-200" />

              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.16em] text-lime-200/70">
                  Google preview
                </p>

                <h3 className="mt-1 text-sm font-semibold text-white">
                  Search result
                </h3>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-[#08111F] p-4">
              <p className="truncate text-xs text-emerald-300/70">
                {canonicalUrl.trim() ||
                  "https://www.age202.com/players/example"}
              </p>

              <p className="mt-2 text-lg font-medium text-sky-300">
                {
                  resolvedPreviewTitle
                }
              </p>

              <p className="mt-2 text-sm leading-6 text-white/45">
                {
                  resolvedPreviewDescription
                }
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.015] p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <Share2 className="h-5 w-5 text-lime-200" />

              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.16em] text-lime-200/70">
                  Social preview
                </p>

                <h3 className="mt-1 text-sm font-semibold text-white">
                  Shared player card
                </h3>
              </div>
            </div>

            <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-[#08111F]">
              <div
                className="aspect-[16/9] bg-cover bg-center"
                style={{
                  backgroundImage: `linear-gradient(to top, rgba(5,11,24,.85), rgba(5,11,24,.1)), url("${
                    openGraphImage.trim() ||
                    preview.heroImage ||
                    preview.portraitImage ||
                    ""
                  }")`,
                }}
              />

              <div className="p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-white/25">
                  age202.com
                </p>

                <p className="mt-2 text-lg font-semibold text-white">
                  {
                    resolvedPreviewTitle
                  }
                </p>

                <p className="mt-2 line-clamp-3 text-sm leading-6 text-white/40">
                  {
                    resolvedPreviewDescription
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.015] p-5 sm:p-6">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.16em] text-lime-200/70">
              Robots
            </p>

            <h3 className="mt-2 text-lg font-semibold text-white">
              Search engine directives
            </h3>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <ToggleField
              name="robotsIndex"
              label="Allow indexing"
              description="Permit search engines to include this profile in results."
              checked={
                robotsIndex
              }
              onChange={
                setRobotsIndex
              }
            />

            <ToggleField
              name="robotsFollow"
              label="Follow links"
              description="Permit crawlers to follow links from the player page."
              checked={
                robotsFollow
              }
              onChange={
                setRobotsFollow
              }
            />
          </div>
        </div>
      </div>
    </PlayerStudioSection>
  );
}

function SeoScoreBadge({
  score,
}: {
  score: number;
}) {
  const label =
    score >= 90
      ? "Excellent"
      : score >= 70
        ? "Good"
        : score >= 40
          ? "Developing"
          : "Needs work";

  return (
    <div className="rounded-2xl border border-lime-300/20 bg-lime-300/[0.06] px-4 py-3">
      <p className="text-[8px] font-black uppercase tracking-[0.16em] text-lime-200/70">
        SEO score
      </p>

      <p className="mt-1 text-lg font-semibold text-white">
        {score}/100
      </p>

      <p className="mt-1 text-[10px] text-white/35">
        {label}
      </p>
    </div>
  );
}

function CharacterCounter({
  value,
  limit,
}: {
  value: number;
  limit: number;
}) {
  return (
    <span
      className={[
        "mt-2 block text-right font-mono text-[8px] font-black uppercase tracking-[0.13em]",
        getCharacterTone(
          value,
          limit,
        ),
      ].join(" ")}
    >
      {value} / {limit}
    </span>
  );
}

type ToggleFieldProps = {
  name: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (
    value: boolean,
  ) => void;
};

function ToggleField({
  name,
  label,
  description,
  checked,
  onChange,
}: ToggleFieldProps) {
  return (
    <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-[#08111F] p-4">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={(event) =>
          onChange(
            event.target.checked,
          )
        }
        className="mt-0.5 h-4 w-4 accent-lime-300"
      />

      <span>
        <span className="block text-sm font-semibold text-white">
          {label}
        </span>

        <span className="mt-1 block text-xs leading-5 text-white/35">
          {description}
        </span>
      </span>
    </label>
  );
}

function FieldLabel({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-white/38">
      {children}
    </span>
  );
}