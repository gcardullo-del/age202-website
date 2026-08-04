export default function MediaLoading() {
  return (
    <div className="space-y-6">
      <div className="h-28 animate-pulse rounded-3xl bg-white/[0.035]" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="h-32 animate-pulse rounded-3xl bg-white/[0.035]" />
        ))}
      </div>
      <div className="h-[520px] animate-pulse rounded-3xl bg-white/[0.035]" />
    </div>
  );
}
