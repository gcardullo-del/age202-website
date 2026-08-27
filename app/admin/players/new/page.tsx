
import AdminShell from "@/components/admin/AdminShell";
import AtpSection from "@/components/admin/player-studio/sections/AtpSection";
import BiographySection from "@/components/admin/player-studio/sections/BiographySection";
import CareerSection from "@/components/admin/player-studio/sections/CareerSection";
import CollectionsSection from "@/components/admin/player-studio/sections/CollectionsSection";
import IdentitySection from "@/components/admin/player-studio/sections/IdentitySection";
import MediaSection from "@/components/admin/player-studio/sections/MediaSection";
import PublishingSection from "@/components/admin/player-studio/sections/PublishingSection";
import SeoSection from "@/components/admin/player-studio/sections/SeoSection";
import PlayerStudioForm from "@/components/admin/player-studio/PlayerStudioForm";

import { createPlayer } from "../actions/createPlayer";

import {
  getAvailableAtpPlayers,
  getAvailableWtaPlayers,
} from "@/lib/repositories/admin/admin-player.repository";

import {
  getAllMedia,
} from "@/lib/repositories/media.repository";

import {
  getAllMuseumCollections,
} from "@/lib/repositories/museum-collection.repository";


export const dynamic =
  "force-dynamic";


export default async function NewPlayerPage() {
  const [
    availableAtpPlayers,
    availableWtaPlayers,
    mediaAssets,
    museumCollections,
  ] = await Promise.all([
    getAvailableAtpPlayers(),

    getAvailableWtaPlayers(),

    getAllMedia({
      mimeType: "image/",
    }),

    getAllMuseumCollections(),
  ]);

  return (
    <AdminShell
      title="New Player"
      description="Create a new AGE202 player profile and connect it to the ATP or WTA archive."
    >
      <PlayerStudioForm
        mode="create"
        formAction={createPlayer}
        initialSection="identity"
        initialPreview={{
          name: "",
          nickname: null,
          country: null,
          heroImage: null,
          portraitImage: null,
          accent: "#C8FF00",
          collectionType: "ARCHIVE",
          ranking: null,
          points: null,
          artifactCount: 0,
          collectionCount: 0,
          atpTitles: 0,
          grandSlams: 0,
          active: true,
        }}
        sections={{
          identity: (
            <IdentitySection />
          ),

          atp: (
            <AtpSection
              availableAtpPlayers={
                availableAtpPlayers
              }
              availableWtaPlayers={
                availableWtaPlayers
              }
            />
          ),

          media: (
            <MediaSection
              libraryAssets={
                mediaAssets
              }
            />
          ),

          biography: (
            <BiographySection />
          ),

          career: (
            <CareerSection />
          ),

          collections: (
            <CollectionsSection
              collections={
                museumCollections
              }
            />
          ),

          seo: (
            <SeoSection />
          ),

          publishing: (
            <PublishingSection />
          ),
        }}
      />
    </AdminShell>
  );
}
