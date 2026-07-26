import type { Metadata } from "next";
import CollaborationsExperience from "@/components/collaborations/CollaborationsExperience";

export const metadata: Metadata = {
  title: "Collaborations | AGE202",
  description:
    "Discover AGE202 partnerships across tennis, design, photography, collecting and culture.",
};

export default function CollaborationsPage() {
  return <CollaborationsExperience />;
}
