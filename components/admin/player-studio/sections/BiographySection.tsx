"use client";

import {
  BookOpen,
  Feather,
  Quote,
  Sparkles,
} from "lucide-react";

import {
  useMemo,
  useState,
  type ReactNode,
} from "react";

type BiographySectionProps = {
  initialBiography?: string | null;
  initialBiographyShort?: string | null;
  initialBiographyLong?: string | null;
  initialQuote?: string | null;
  initialPlayingStyle?: string | null;
};

const limits = {
  quote: 180,
  biographyShort: 500,
  biography: 1800,
  biographyLong: 5000,
  playingStyle: 1200,
} as const;

const inputClassName =
  "h-12 w-full rounded-2xl border border-white/10 bg-[#08111F] px-4 text-sm text-white outline-none transition placeholder:text-white/22 focus:border-lime-300/35";

const textareaClassName =
  "w-full resize-y rounded-2xl border border-white/10 bg-[#08111F] px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-white/22 focus:border-lime-300/35";

export default function BiographySection({
  initialBiography = "",
  initialBiographyShort = "",
  initialBiographyLong = "",
  initialQuote = "",
  initialPlayingStyle = "",
}: BiographySectionProps) {
  const [
    quote,
    setQuote,
  ] = useState(
    initialQuote ?? "",
  );

  const [
    biographyShort,
    setBiographyShort,
  ] = useState(
    initialBiographyShort ?? "",
  );

  const [
    biography,
    setBiography,
  ] = useState(
    initialBiography ?? "",
  );

  const [
    biographyLong,
    setBiographyLong,
  ] = useState(
    initialBiographyLong ?? "",
  );

  const [
    playingStyle,
    setPlayingStyle,
  ] = useState(
    initialPlayingStyle ?? "",
  );

  const completedBlocks =
    useMemo(
      () =>
        [
          quote,
          biographyShort,
          biography,
          biographyLong,
          playingStyle,
        ].filter(
          (value) =>
            value.trim().length > 0,
        ).length,
      [
        quote,
        biographyShort,
        biography,
        biographyLong,
        playingStyle,
      ],
    );

  return (
    <section className="space-y-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-200/70">
            Editorial profile
          </p>

          <h2 className="mt-2 text-2xl font-semibold text-white">
            Biography and voice
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/40">
            Build the public story, signature quote and playing identity of
            the player.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#08111F] px-4 py-3 text-sm text-white/40">
          <span className="font-semibold text-white">
            {completedBlocks}/5
          </span>{" "}
          editorial blocks completed
        </div>
      </div>

      <EditorialPanel
        eyebrow="Signature voice"
        title="Player quote"
        description="A short sentence associated with the player or used as the editorial headline."
        icon={Quote}
      >
        <CharacterField
          name="quote"
          value={quote}
          onChange={setQuote}
          limit={limits.quote}
          rows={3}
          placeholder="The more difficult the victory, the greater the happiness in winning."
        />
      </EditorialPanel>

      <EditorialPanel
        eyebrow="Archive introduction"
        title="Short biography"
        description="A compact summary used in cards, metadata and introductory sections."
        icon={Feather}
      >
        <CharacterField
          name="biographyShort"
          value={biographyShort}
          onChange={setBiographyShort}
          limit={limits.biographyShort}
          rows={5}
          placeholder="Write a concise introduction to the player's career, identity and importance."
        />
      </EditorialPanel>

      <EditorialPanel
        eyebrow="Core narrative"
        title="Public biography"
        description="The main biography stored directly on the Player record."
        icon={BookOpen}
      >
        <CharacterField
          name="biography"
          value={biography}
          onChange={setBiography}
          limit={limits.biography}
          rows={9}
          placeholder="Describe the player's career, defining moments and place in tennis history."
        />
      </EditorialPanel>

      <EditorialPanel
        eyebrow="Museum essay"
        title="Long-form biography"
        description="An extended editorial story for premium archive pages and future Hall of Fame experiences."
        icon={Sparkles}
      >
        <CharacterField
          name="biographyLong"
          value={biographyLong}
          onChange={setBiographyLong}
          limit={limits.biographyLong}
          rows={14}
          placeholder="Develop the complete story: beginnings, evolution, rivalries, records, influence and legacy."
        />
      </EditorialPanel>

      <EditorialPanel
        eyebrow="Technical identity"
        title="Playing style"
        description="Explain technique, tactics, preferred patterns and the qualities that define the player's tennis."
        icon={Sparkles}
      >
        <CharacterField
          name="playingStyle"
          value={playingStyle}
          onChange={setPlayingStyle}
          limit={limits.playingStyle}
          rows={8}
          placeholder="Describe serve, movement, forehand, backhand, tactical approach and preferred conditions."
        />
      </EditorialPanel>
    </section>
  );
}

type EditorialPanelProps = {
  eyebrow: string;
  title: string;
  description: string;
  icon: typeof BookOpen;
  children: ReactNode;
};

function EditorialPanel({
  eyebrow,
  title,
  description,
  icon: Icon,
  children,
}: EditorialPanelProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.015] p-5 sm:p-6">
      <div className="flex items-start gap-4">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-lime-300/20 bg-lime-300/10 text-lime-200">
          <Icon
            className="h-5 w-5"
            aria-hidden="true"
          />
        </span>

        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.18em] text-lime-200/70">
            {eyebrow}
          </p>

          <h3 className="mt-2 text-lg font-semibold text-white">
            {title}
          </h3>

          <p className="mt-1 text-xs leading-5 text-white/35">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-5">
        {children}
      </div>
    </div>
  );
}

type CharacterFieldProps = {
  name: string;
  value: string;
  onChange: (
    value: string,
  ) => void;
  limit: number;
  rows: number;
  placeholder: string;
};

function CharacterField({
  name,
  value,
  onChange,
  limit,
  rows,
  placeholder,
}: CharacterFieldProps) {
  const remaining =
    limit - value.length;

  const nearLimit =
    remaining <=
    Math.max(
      Math.round(limit * 0.1),
      20,
    );

  return (
    <label className="block">
      <span className="sr-only">
        {name}
      </span>

      {rows === 1 ? (
        <input
          name={name}
          value={value}
          maxLength={limit}
          onChange={(event) =>
            onChange(
              event.target.value,
            )
          }
          className={inputClassName}
          placeholder={placeholder}
        />
      ) : (
        <textarea
          name={name}
          value={value}
          maxLength={limit}
          rows={rows}
          onChange={(event) =>
            onChange(
              event.target.value,
            )
          }
          className={textareaClassName}
          placeholder={placeholder}
        />
      )}

      <span
        className={[
          "mt-2 block text-right font-mono text-[8px] font-black uppercase tracking-[0.13em]",
          nearLimit
            ? "text-amber-200"
            : "text-white/25",
        ].join(" ")}
      >
        {value.length} / {limit}
      </span>
    </label>
  );
}