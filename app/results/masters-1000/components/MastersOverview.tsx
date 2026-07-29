import { CalendarDays, CircleDot, Globe2, Trophy } from "lucide-react";

import OverviewCard from "./OverviewCard";
import SectionHeading from "./SectionHeading";

export default function MastersOverview() {
  return (
    <section className="relative px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
      <div className="pointer-events-none absolute -left-48 top-20 h-[32rem] w-[32rem] rounded-full bg-[rgba(70,190,255,0.12)] blur-3xl" />

      <div className="relative mx-auto max-w-[1440px]">
        <SectionHeading
          eyebrow="The elite circuit"
          title="A season across the world"
          description="The Masters 1000 circuit connects different continents, climates, court surfaces and tournament identities."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
          <OverviewCard
            icon={Globe2}
            label="Geography"
            value="North America, Europe and Asia"
            description="The tour travels through three major tennis regions during the season."
          />
          <OverviewCard
            icon={CircleDot}
            label="Surfaces"
            value="Hard, clay and indoor hard"
            description="Every stage presents different tactical, physical and technical demands."
          />
          <OverviewCard
            icon={CalendarDays}
            label="Calendar"
            value="March to November"
            description="The series follows the season from Indian Wells to the final Masters in Paris."
          />
          <OverviewCard
            icon={Trophy}
            label="Prestige"
            value="1,000 ranking points"
            description="Each title represents one of the most valuable achievements outside the Grand Slams."
          />
        </div>
      </div>
    </section>
  );
}
