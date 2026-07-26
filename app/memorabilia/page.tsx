import type { Metadata } from "next";

import MemorabiliaExperience from "@/components/memorabilia/MemorabiliaExperience";

export const metadata: Metadata = {
  title: "Memorabilia",
  description:
    "Discover the AGE202 archive of tennis memorabilia, signed objects, historic equipment and collectible pieces.",
};

export default function MemorabiliaPage() {
  return <MemorabiliaExperience />;
}
