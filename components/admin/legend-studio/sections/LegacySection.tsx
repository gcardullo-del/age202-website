"use client";

import {
  Award,
  Crown,
  Landmark,
  Quote,
  Sparkles,
  Trophy,
} from "lucide-react";
import {
  useMemo,
  useState,
} from "react";

const MAX_LEGACY_LENGTH = 5000;

type LegacySectionProps = {
  initialLegacy?: string | null;
  initialLegacyHeadline?: string | null;
  initialSignatureQuote?: string | null;
};

export default function LegacySection({
  initialLegacy = "",
  initialLegacyHeadline = "",
  initialSignatureQuote = "",
}: LegacySectionProps) {
  const [legacy, setLegacy] =
    useState(
      initialLegacy ?? "",
    );
  const [signatureQuote, setSignatureQuote] =
    useState(
      initialSignatureQuote ?? "",
    );
  const [legacyHeadline, setLegacyHeadline] =
    useState(
      initialLegacyHeadline ?? "",
    );

  const legacyLength =
    legacy.length;

  const progress =
    useMemo(
      () =>
        Math.min(
          100,
          Math.round(
            (legacyLength / 500) *
              100,
          ),
        ),
      [legacyLength],
    );

  return (
    <section className="space-y-8">
      <div>
        <div className="flex items-center gap-2 text-lime-300/75">
          <Crown className="size-4" />

          <p className="text-[10px] font-black uppercase tracking-[0.22em]">
            Legend legacy
          </p>
        </div>

        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-white">
          The mark left on tennis
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-white/40">
          Tell why this player belongs in
          THE LEGENDS. Focus on influence,
          records, historical importance and
          the way the player changed the sport.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <InfoCard
          icon={Trophy}
          eyebrow="Achievement"
          title="What was conquered"
          text="Records, titles and milestones that define the career."
        />

        <InfoCard
          icon={Landmark}
          eyebrow="History"
          title="Why it matters"
          text="Place the player inside the wider history of tennis."
        />

        <InfoCard
          icon={Sparkles}
          eyebrow="Influence"
          title="What remained"
          text="Style, cultural impact and influence on later generations."
        />
      </div>

      <div className="rounded-[28px] border border-white/10 bg-[#07101D]/55 p-5 sm:p-7">
        <div className="flex items-start gap-3">
          <div className="grid size-10 shrink-0 place-items-center rounded-2xl border border-lime-300/15 bg-lime-300/[0.06]">
            <Award className="size-4 text-lime-300" />
          </div>

          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-lime-300/70">
              Museum headline
            </p>

            <h3 className="mt-1 text-lg font-semibold text-white">
              Define the legend in one line
            </h3>
          </div>
        </div>

        <label className="mt-6 block">
          <span className={labelClasses}>
            Legacy headline
          </span>

          <input
            name="legacyHeadline"
            value={legacyHeadline}
            maxLength={160}
            placeholder="Example: The champion who completed two calendar Grand Slams."
            onChange={(event) =>
              setLegacyHeadline(
                event.target.value,
              )
            }
            className={inputClasses}
          />

          <div className="mt-2 flex justify-end">
            <span className="text-[10px] font-semibold tabular-nums text-white/20">
              {legacyHeadline.length}/160
            </span>
          </div>
        </label>
      </div>

      <div className="rounded-[28px] border border-white/10 bg-[#07101D]/55 p-5 sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/30">
              Historical legacy
            </p>

            <h3 className="mt-2 text-xl font-semibold text-white">
              Why this player is a Legend
            </h3>

            <p className="mt-2 max-w-xl text-xs leading-6 text-white/35">
              This is the main editorial text
              for the legacy section of the
              public profile.
            </p>
          </div>

          <div className="min-w-[130px] rounded-2xl border border-white/10 bg-[#050B18]/60 px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[9px] font-black uppercase tracking-[0.14em] text-white/25">
                Depth
              </span>

              <span className="text-xs font-semibold text-white/60">
                {progress}%
              </span>
            </div>

            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className="h-full rounded-full bg-lime-300 transition-all duration-300"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>
          </div>
        </div>

        <label className="mt-6 block">
          <span className={labelClasses}>
            Legacy story
          </span>

          <textarea
            name="legacy"
            rows={14}
            value={legacy}
            maxLength={MAX_LEGACY_LENGTH}
            placeholder="Explain the player's historical importance, defining records, influence, playing identity and lasting contribution to tennis..."
            onChange={(event) =>
              setLegacy(
                event.target.value,
              )
            }
            className={textareaClasses}
          />

          <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-[10px] leading-5 text-white/25">
              Around 500+ characters gives the
              public archive enough depth.
            </span>

            <span className="text-[10px] font-semibold tabular-nums text-white/25">
              {legacyLength}/{MAX_LEGACY_LENGTH}
            </span>
          </div>
        </label>
      </div>

      <div className="rounded-[28px] border border-white/10 bg-gradient-to-br from-white/[0.035] to-transparent p-5 sm:p-7">
        <div className="flex items-start gap-3">
          <div className="grid size-10 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.03]">
            <Quote className="size-4 text-white/45" />
          </div>

          <div className="flex-1">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/30">
              Closing voice
            </p>

            <h3 className="mt-1 text-lg font-semibold text-white">
              A quote that survives the era
            </h3>
          </div>
        </div>

        <label className="mt-6 block">
          <span className={labelClasses}>
            Signature quote
          </span>

          <textarea
            name="signatureQuote"
            rows={4}
            value={signatureQuote}
            maxLength={500}
            placeholder="An optional quote by or about the player..."
            onChange={(event) =>
              setSignatureQuote(
                event.target.value,
              )
            }
            className={textareaClasses}
          />

          <div className="mt-2 flex justify-end">
            <span className="text-[10px] font-semibold tabular-nums text-white/20">
              {signatureQuote.length}/500
            </span>
          </div>
        </label>
      </div>

      <div className="rounded-[24px] border border-emerald-300/10 bg-emerald-300/[0.035] p-5">
        <div className="flex gap-3">
          <Sparkles className="mt-0.5 size-4 shrink-0 text-emerald-200/70" />

          <div>
            <p className="text-sm font-semibold text-white/80">
              Museum editorial principle
            </p>

            <p className="mt-1 text-xs leading-6 text-white/35">
              Legacy should explain significance,
              not simply repeat the biography or
              career statistics. The strongest
              profiles connect achievements to
              their historical meaning.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

const labelClasses =
  "mb-2.5 block text-[10px] font-bold uppercase tracking-[0.16em] text-white/35";

const inputClasses =
  "w-full rounded-2xl border border-white/10 bg-[#050B18]/75 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-lime-300/35 focus:ring-2 focus:ring-lime-300/10";

const textareaClasses =
  "w-full resize-y rounded-2xl border border-white/10 bg-[#050B18]/75 px-4 py-3.5 text-sm leading-7 text-white outline-none transition placeholder:text-white/20 focus:border-lime-300/35 focus:ring-2 focus:ring-lime-300/10";

function InfoCard({
  icon: Icon,
  eyebrow,
  title,
  text,
}: {
  icon: React.ComponentType<{
    className?: string;
  }>;
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-white/[0.02] p-5">
      <Icon className="size-4 text-lime-300/65" />

      <p className="mt-4 text-[9px] font-black uppercase tracking-[0.18em] text-white/25">
        {eyebrow}
      </p>

      <p className="mt-1 text-sm font-semibold text-white/75">
        {title}
      </p>

      <p className="mt-2 text-xs leading-5 text-white/30">
        {text}
      </p>
    </div>
  );
}