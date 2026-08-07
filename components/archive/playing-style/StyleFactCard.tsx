import type {
  StyleFactCardProps,
} from "./types";

export default function StyleFactCard({
  fact,
  accent,
}: StyleFactCardProps) {
  const Icon = fact.icon;

  return (
    <article className="relative min-w-0 rounded-[1.6rem] border border-white/10 bg-white/[0.025] px-6 py-6">
      <div className="flex min-w-0 items-start gap-4">
        <span
          className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border"
          style={{
            borderColor:
              `${accent}35`,
            backgroundColor:
              `${accent}0d`,
            color: accent,
          }}
        >
          <Icon
            className="h-[18px] w-[18px]"
            aria-hidden="true"
          />
        </span>

        <div className="min-w-0">
          <p className="break-words py-1 font-mono text-[8px] uppercase leading-[1.7] tracking-[0.18em] text-white/25">
            {fact.label}
          </p>

          <p className="mt-1 break-words text-base font-black leading-6 text-white/75">
            {fact.value}
          </p>
        </div>
      </div>
    </article>
  );
}
