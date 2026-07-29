import { masters1000List } from "@/lib/data/masters-1000";

import SeasonRouteEntry from "./SeasonRouteEntry";
import SectionHeading from "./SectionHeading";

export default function SeasonRoute() {
  return (
    <section className="border-t border-white/10 px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
      <div className="mx-auto max-w-[1440px]">
        <SectionHeading
          eyebrow="Season route"
          title="Nine stages of the Masters race"
          description="Every tournament represents a new environment, surface transition and competitive chapter."
        />

        <div className="mt-12 overflow-hidden rounded-[2rem] border border-white/10 bg-[#07101D]">
          {masters1000List.map((tournament, index) => (
            <SeasonRouteEntry
              key={tournament.slug}
              tournament={tournament}
              index={index}
              isLast={index === masters1000List.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
