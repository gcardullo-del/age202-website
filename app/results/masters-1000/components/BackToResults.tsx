import Link from "next/link";

import { ArrowRight } from "lucide-react";

export default function BackToResults() {
  return (
    <section className="border-t border-white/10 px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
      <div className="mx-auto max-w-[1440px]">
        <Link
          href="/results"
          className="group flex min-h-[180px] items-center justify-between gap-6 rounded-[2rem] border border-white/10 bg-[#07101D] p-7 transition hover:-translate-y-1 hover:border-[#55C9FF] sm:p-8"
        >
          <div>
            <p className="font-mono text-[8px] font-black uppercase tracking-[0.18em] text-[#55C9FF]">
              AGE202 results
            </p>
            <h2 className="mt-4 text-2xl font-black uppercase tracking-[-0.035em]">
              Return to the results archive
            </h2>
          </div>

          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-white/30 transition group-hover:text-[#55C9FF]">
            <ArrowRight size={19} aria-hidden="true" />
          </span>
        </Link>
      </div>
    </section>
  );
}
