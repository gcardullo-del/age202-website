import { masters1000List } from "@/lib/data/masters-1000";

import MastersCard from "./MastersCard";
import SectionHeading from "./SectionHeading";

export default function MastersGrid() {
  return (
    <section
      id="tournaments"
      className="scroll-mt-16 border-t border-white/10 px-5 py-20 sm:px-8 lg:px-12 lg:py-28"
    >
      <div className="mx-auto max-w-[1440px]">
        <SectionHeading
          eyebrow="Tournament destinations"
          title="Explore every Masters 1000"
          description="Enter each dedicated archive to discover the tournament identity, history, records and iconic moments."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {masters1000List.map((tournament, index) => (
            <MastersCard
              key={tournament.slug}
              tournament={tournament}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
