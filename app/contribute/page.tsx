import type { Metadata } from "next";

import ContributeExperience from "@/components/contribute/ContributeExperience";


export const dynamic =
  "force-dynamic";


export const metadata: Metadata = {
  title: "Contribute to the Museum | AGE202",
  description:
    "Contribute to AGE202 — The Digital Tennis Museum with a video greeting, digital dedication or tennis memorabilia and help preserve the history of the game.",
};


export default function ContributePage() {
  return (
    <ContributeExperience />
  );
}