"use client";

import {
  BookOpen,
  Quote,
  ScrollText,
  Sparkles,
} from "lucide-react";

type BiographySectionProps = {
  initialBiographyShort?: string | null;
  initialBiographyLong?: string | null;
  initialQuote?: string | null;
};

export default function BiographySection({
  initialBiographyShort = "",
  initialBiographyLong = "",
  initialQuote = "",
}: BiographySectionProps) {
  return (
    <section className="space-y-8">
      <div>
        <div className="flex items-center gap-2 text-lime-300/75">
          <BookOpen className="size-4" />

          <p className="text-[10px] font-black uppercase tracking-[0.22em]">
            Legend biography
          </p>
        </div>

        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-white">
          Story & historical profile
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-white/40">
          Shape the editorial voice of the Legend profile:
          a short introduction, a complete biography and an
          optional quote that captures the player&apos;s identity.
        </p>
      </div>

      <div className="space-y-6">
        <Field
          label="Short biography"
          description="A concise introduction used near the top of the public profile."
          icon={<ScrollText className="size-4" />}
        >
          <textarea
            name="biographyShort"
            defaultValue={initialBiographyShort ?? ""}
            rows={5}
            placeholder="A concise editorial introduction to the legend..."
            className={textareaClasses}
          />
        </Field>

        <Field
          label="Main biography"
          description="The complete historical story of the player and career."
          icon={<BookOpen className="size-4" />}
        >
          <textarea
            name="biographyLong"
            defaultValue={initialBiographyLong ?? ""}
            rows={14}
            placeholder="Tell the full story: origins, rise, defining seasons, rivalries and historical significance..."
            className={textareaClasses}
          />
        </Field>

        <Field
          label="Signature quote"
          description="Optional quote associated with the player or used as an editorial pull quote."
          icon={<Quote className="size-4" />}
        >
          <textarea
            name="quote"
            defaultValue={initialQuote ?? ""}
            rows={4}
            placeholder="A memorable quote or short editorial line..."
            className={textareaClasses}
          />
        </Field>
      </div>

      <div className="rounded-[24px] border border-white/10 bg-gradient-to-br from-white/[0.035] to-transparent p-5">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-0.5 size-5 shrink-0 text-lime-300" />

          <div>
            <p className="text-sm font-semibold text-white/80">
              AGE202 editorial direction
            </p>

            <p className="mt-1 text-xs leading-6 text-white/35">
              Keep the tone museum-like and historical. The goal is
              to explain why this player matters in tennis history,
              not simply list statistics.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

const textareaClasses =
  "w-full resize-y rounded-2xl border border-white/10 bg-[#050B18]/75 px-4 py-3.5 text-sm leading-7 text-white outline-none transition placeholder:text-white/20 focus:border-lime-300/35 focus:ring-2 focus:ring-lime-300/10";

function Field({
  label,
  description,
  icon,
  children,
}: {
  label: string;
  description?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="block rounded-[26px] border border-white/10 bg-white/[0.02] p-5 sm:p-6">
      <span className="flex items-center gap-2 text-xs font-semibold text-white/70">
        <span className="text-lime-300/70">
          {icon}
        </span>
        {label}
      </span>

      {description ? (
        <span className="mt-1 block text-[11px] leading-5 text-white/30">
          {description}
        </span>
      ) : null}

      <div className="mt-4">
        {children}
      </div>
    </label>
  );
}