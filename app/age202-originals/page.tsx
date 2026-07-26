import type { Metadata } from "next";
import OriginalsExperience from "@/components/originals/OriginalsExperience";

export const metadata: Metadata = {
  title: "AGE202 Originals | Official Collection",
  description:
    "Discover AGE202 Originals: apparel and accessories created around the identity of the digital tennis museum.",
};

export default function Age202OriginalsPage() {
  return <OriginalsExperience />;
}
