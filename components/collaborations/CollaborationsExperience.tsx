import CollaborationCTA from "@/components/collaborations/CollaborationCTA";
import CollaborationsHero from "@/components/collaborations/CollaborationsHero";
import PartnershipAreas from "@/components/collaborations/PartnershipAreas";
import PartnershipStandard from "@/components/collaborations/PartnershipStandard";
import ProjectFormats from "@/components/collaborations/ProjectFormats";
import SelectedCollaborations from "@/components/collaborations/SelectedCollaborations";


export default function CollaborationsExperience() {
  return (
    <main className="overflow-hidden bg-[#050B18] text-white">
      <CollaborationsHero />

      <PartnershipAreas />

      <SelectedCollaborations />

      <ProjectFormats />

      <PartnershipStandard />

      <CollaborationCTA />
    </main>
  );
}