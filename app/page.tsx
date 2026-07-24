import type { Metadata } from "next";
import MuseumHome from "@/components/public/MuseumHome";

export const metadata: Metadata = {
  title: "AGE202 | Digital Tennis Museum",
  description:
    "Explore AGE202, the digital tennis museum preserving iconic apparel, champions and stories from tennis history.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return <MuseumHome />;
}
