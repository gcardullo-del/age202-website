type TimelineItem = {
  year: string;
  title: string;
  description: string;
};

type Props = {
  items: TimelineItem[];
};

export default function Timeline({ items }: Props) {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-5xl px-8">

        <h2 className="text-4xl font-black text-white">
          Career Timeline
        </h2>

        <div className="mt-16 border-l border-white/10 pl-8">

          {items.map((item) => (
            <div
              key={item.year}
              className="relative mb-14"
            >
              <div className="absolute -left-[38px] top-1 h-4 w-4 rounded-full bg-[#C8FF00]" />

              <p className="text-sm font-bold tracking-[0.25em] text-[#C8FF00]">
                {item.year}
              </p>

              <h3 className="mt-2 text-3xl font-black text-white">
                {item.title}
              </h3>

              <p className="mt-4 text-lg leading-8 text-gray-400">
                {item.description}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}