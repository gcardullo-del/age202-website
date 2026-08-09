import {
  ArrowDown,
} from "lucide-react";

export default function Masters1000BackToTop() {
  return (
    <div className="border-t border-white/10 px-5 py-8 text-center sm:px-8 lg:px-12">
      <a
        href="#"
        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.025] px-5 py-3 font-mono text-[8px] font-black uppercase tracking-[0.18em] text-white/42 transition hover:border-[var(--tournament-primary)] hover:text-[var(--tournament-primary)]"
      >
        Back to top

        <ArrowDown
          size={13}
          className="rotate-180"
          aria-hidden="true"
        />
      </a>
    </div>
  );
}