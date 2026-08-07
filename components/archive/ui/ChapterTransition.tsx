import {
  ArrowDown,
} from "lucide-react";

type ChapterTransitionProps = {
  chapterLabel: string;
  title: string;
  description: string;
  href: string;
  buttonLabel: string;
  accent: string;
};

export default function ChapterTransition({
  chapterLabel,
  title,
  description,
  href,
  buttonLabel,
  accent,
}: ChapterTransitionProps) {
  return (
    <div className="mt-20 border-t border-white/10 pt-8 lg:mt-28">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <p
            className="break-words py-1 font-mono text-[8px] font-black uppercase leading-[1.7] tracking-[0.22em]"
            style={{
              color: accent,
            }}
          >
            {chapterLabel}
          </p>

          <h3 className="mt-3 break-words text-3xl font-black leading-tight tracking-[-0.04em] text-white sm:text-4xl">
            {title}
          </h3>

          <p className="mt-4 max-w-xl break-words text-sm leading-7 text-white/35">
            {description}
          </p>
        </div>

        <a
          href={href}
          className="group inline-flex min-h-12 w-fit shrink-0 items-center justify-center gap-3 rounded-full border px-6 py-3 text-center text-[9px] font-black uppercase leading-5 tracking-[0.18em] transition duration-300 hover:-translate-y-0.5"
          style={{
            borderColor:
              `${accent}45`,
            backgroundColor:
              `${accent}0d`,
            color: accent,
          }}
        >
          {buttonLabel}

          <ArrowDown
            className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-y-1"
            aria-hidden="true"
          />
        </a>
      </div>
    </div>
  );
}