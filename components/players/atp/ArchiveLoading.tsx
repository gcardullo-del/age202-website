function SkeletonBlock({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden bg-white/[0.06] ${className}`}
    >
      <div className="absolute inset-0 -translate-x-full animate-[archive-shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
    </div>
  );
}

function HeroStatisticSkeleton() {
  return (
    <div className="bg-[#07101D]/85 px-6 py-6">
      <SkeletonBlock className="h-4 w-4 rounded-full" />

      <SkeletonBlock className="mt-5 h-8 w-16 rounded-lg" />

      <SkeletonBlock className="mt-3 h-2.5 w-24 rounded-full" />
    </div>
  );
}

function InsightSkeleton() {
  return (
    <div className="bg-[#07101D] px-6 py-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <SkeletonBlock className="h-3 w-28 rounded-full" />

          <SkeletonBlock className="mt-5 h-10 w-20 rounded-xl" />
        </div>

        <SkeletonBlock className="h-10 w-10 rounded-full" />
      </div>
    </div>
  );
}

function PlayerCardSkeleton() {
  return (
    <article className="relative aspect-[4/5] min-h-[460px] overflow-hidden rounded-[1.8rem] border border-white/10 bg-[#09111f] md:min-h-[500px] xl:min-h-[480px] 2xl:min-h-[440px]">
      <SkeletonBlock className="absolute inset-0 rounded-none" />

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,7,17,.08)_0%,rgba(2,7,17,.18)_38%,rgba(2,7,17,.82)_76%,#020711_100%)]" />

      <div className="absolute left-5 top-5">
        <SkeletonBlock className="h-8 w-20 rounded-full" />
      </div>

      <div className="absolute right-5 top-5 flex gap-2">
        <SkeletonBlock className="h-8 w-20 rounded-full" />

        <SkeletonBlock className="h-8 w-16 rounded-full" />
      </div>

      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
        <div className="flex items-center justify-between gap-4">
          <SkeletonBlock className="h-2.5 w-20 rounded-full" />

          <SkeletonBlock className="h-2.5 w-24 rounded-full" />
        </div>

        <SkeletonBlock className="mt-5 h-10 w-4/5 rounded-xl" />

        <SkeletonBlock className="mt-3 h-10 w-3/5 rounded-xl" />

        <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
          <SkeletonBlock className="h-3 w-24 rounded-full" />

          <SkeletonBlock className="h-8 w-28 rounded-full" />
        </div>
      </div>
    </article>
  );
}

export default function ArchiveLoading() {
  return (
    <main
      aria-busy="true"
      aria-label="Loading ATP Archive"
      className="min-h-screen overflow-hidden bg-[#050B18] text-white"
    >
      <style>
        {`
          @keyframes archive-shimmer {
            100% {
              transform: translateX(100%);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            [class*="archive-shimmer"] {
              animation: none !important;
            }
          }
        `}
      </style>

      <section className="relative isolate min-h-[820px] overflow-hidden border-b border-white/10 bg-[#020611] md:min-h-[880px] lg:min-h-[920px]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,rgba(215,255,0,0.08),transparent_28%)]" />

        <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:72px_72px]" />

        <div className="relative mx-auto min-h-[820px] w-full max-w-[1480px] px-6 pb-32 pt-10 sm:px-10 sm:pt-12 md:min-h-[880px] lg:min-h-[920px] lg:px-14 lg:pb-36 lg:pt-14">
          <SkeletonBlock className="h-8 w-28 rounded-full" />

          <div className="mt-14 max-w-4xl">
            <SkeletonBlock className="h-3 w-40 rounded-full" />

            <SkeletonBlock className="mt-7 h-24 w-64 rounded-2xl sm:h-28 sm:w-80 lg:h-32 lg:w-[430px]" />

            <SkeletonBlock className="mt-4 h-24 w-72 rounded-2xl sm:h-28 sm:w-[430px] lg:h-32 lg:w-[580px]" />

            <SkeletonBlock className="mt-8 h-4 w-full max-w-xl rounded-full" />

            <SkeletonBlock className="mt-3 h-4 w-4/5 max-w-lg rounded-full" />

            <div className="mt-9 flex flex-wrap gap-3">
              <SkeletonBlock className="h-12 w-40 rounded-full" />

              <SkeletonBlock className="h-12 w-44 rounded-full" />
            </div>
          </div>

          <div className="absolute bottom-10 left-6 right-6 grid gap-px overflow-hidden rounded-[26px] border border-white/10 bg-white/10 shadow-[0_24px_70px_rgba(0,0,0,0.38)] sm:left-10 sm:right-auto sm:w-[620px] sm:grid-cols-3 lg:bottom-12 lg:left-14">
            <HeroStatisticSkeleton />
            <HeroStatisticSkeleton />
            <HeroStatisticSkeleton />
          </div>
        </div>
      </section>

      <section className="relative z-20 border-b border-white/10 px-5 pb-8 pt-8 sm:px-8 lg:px-12">
        <div className="mx-auto w-full max-w-[1920px]">
          <div className="overflow-hidden rounded-[30px] border border-white/10 bg-[#07101D]/92 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.34)] backdrop-blur-2xl sm:p-5 lg:p-6">
            <div className="mb-5 flex flex-col gap-3 border-b border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <SkeletonBlock className="h-3 w-40 rounded-full" />

                <SkeletonBlock className="mt-3 h-3 w-72 max-w-full rounded-full" />
              </div>

              <SkeletonBlock className="h-3 w-24 rounded-full" />
            </div>

            <div className="grid gap-4 xl:grid-cols-[minmax(300px,1fr)_auto_minmax(180px,210px)_minmax(190px,230px)]">
              <SkeletonBlock className="h-14 rounded-full" />

              <div className="flex gap-2 rounded-[22px] border border-white/10 bg-[#020711]/48 p-1.5">
                <SkeletonBlock className="h-11 w-16 rounded-full" />
                <SkeletonBlock className="h-11 w-20 rounded-full" />
                <SkeletonBlock className="h-11 w-20 rounded-full" />
                <SkeletonBlock className="h-11 w-20 rounded-full" />
              </div>

              <SkeletonBlock className="h-14 rounded-full" />

              <SkeletonBlock className="h-14 rounded-full" />
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-5">
              <SkeletonBlock className="h-3 w-28 rounded-full" />

              <SkeletonBlock className="h-3 w-24 rounded-full" />
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 px-5 py-8 sm:px-8 lg:px-12">
        <div className="mx-auto grid w-full max-w-[1920px] gap-px overflow-hidden rounded-[1.8rem] border border-white/10 bg-white/10 sm:grid-cols-2 xl:grid-cols-4">
          <InsightSkeleton />
          <InsightSkeleton />
          <InsightSkeleton />
          <InsightSkeleton />
        </div>
      </section>

      <section className="px-5 pb-20 pt-10 sm:px-8 lg:px-12 lg:pb-28 lg:pt-14">
        <div className="mx-auto w-full max-w-[1920px]">
          <div className="flex flex-col gap-4 border-b border-white/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <SkeletonBlock className="h-3 w-36 rounded-full" />

              <SkeletonBlock className="mt-4 h-10 w-64 max-w-full rounded-xl" />
            </div>

            <SkeletonBlock className="h-3 w-32 rounded-full" />
          </div>

          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {Array.from({ length: 10 }).map((_, index) => (
              <PlayerCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </section>

      <span className="sr-only">
        Loading ATP Archive players and statistics.
      </span>
    </main>
  );
}