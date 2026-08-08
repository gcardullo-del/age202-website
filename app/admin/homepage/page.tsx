import { Home } from "lucide-react";

import AdminShell from "@/components/admin/AdminShell";

import AdminMediaPicker from "@/components/admin/form/AdminMediaPicker";
import AdminSection from "@/components/admin/form/AdminSection";
import AdminSubmitButton from "@/components/admin/form/AdminSubmitButton";
import AdminTextField from "@/components/admin/form/AdminTextField";
import AdminTextarea from "@/components/admin/form/AdminTextarea";

import AdminPlayerPicker from "@/components/admin/pickers/AdminPlayerPicker";

import {
  getAdminHomepageSettings,
} from "@/lib/repositories/admin/admin-homepage.repository";

import {
  getHomepagePlayerOptions,
} from "@/lib/repositories/admin/admin-homepage-players.repository";

import {
  getAllMedia,
} from "@/lib/repositories/media.repository";

import {
  updateHomepage,
} from "./actions/updateHomepage";

export const dynamic =
  "force-dynamic";

export default async function HomepageAdminPage() {
  const [
    settings,
    assets,
    players,
  ] = await Promise.all([
    getAdminHomepageSettings(),

    getAllMedia({
      mimeType: "image/",
    }),

    getHomepagePlayerOptions(),
  ]);

  return (
    <AdminShell
      title="Homepage"
      description="Manage the AGE202 homepage."
    >
      <form
        action={updateHomepage}
        className="space-y-8"
      >
        <section className="rounded-[32px] border border-lime-300/15 bg-gradient-to-br from-lime-300/[0.08] via-white/[0.03] to-transparent p-8">
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-lime-300 text-[#050B18]">
              <Home size={30} />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-lime-300">
                Museum CMS
              </p>

              <h1 className="mt-2 text-4xl font-bold text-white">
                Homepage Manager
              </h1>

              <p className="mt-3 max-w-3xl text-white/45">
                Manage the main AGE202 homepage content, imagery,
                featured players and museum identity from one
                central workspace.
              </p>
            </div>
          </div>
        </section>

        <AdminSection
          title="Hero"
          description="Manage the primary AGE202 homepage experience."
        >
          <AdminTextField
            name="heroEyebrow"
            label="Hero Eyebrow"
            defaultValue={settings.heroEyebrow}
            description="Small museum label displayed above the main headline."
            required
          />

          <div className="grid gap-6 lg:grid-cols-2">
            <AdminTextField
              name="heroTitle"
              label="Hero Title"
              defaultValue={settings.heroTitle}
              description="Primary hero headline. Short titles work best visually."
              required
            />

            <AdminTextField
              name="heroSubtitle"
              label="Hero Subtitle"
              defaultValue={settings.heroSubtitle}
              description="Highlighted lime-green second part of the headline."
              required
            />
          </div>

          <AdminTextarea
            name="heroDescription"
            label="Hero Description"
            defaultValue={settings.heroDescription}
            description="Introductory museum message displayed below the headline."
            required
          />

          <div className="grid gap-6 lg:grid-cols-2">
            <AdminTextField
              name="heroCtaLabel"
              label="CTA Label"
              defaultValue={settings.heroCtaLabel}
              description="Text displayed inside the main hero button."
              required
            />

            <AdminTextField
              name="heroCtaHref"
              label="CTA Link"
              defaultValue={settings.heroCtaHref}
              description="Internal route, anchor or external destination."
              required
            />
          </div>

          <AdminMediaPicker
            name="heroImage"
            label="Hero Image"
            assets={assets}
            defaultValue={settings.heroImage}
            description="Choose the main homepage background directly from the AGE202 Media Library."
            required
          />
        </AdminSection>

        <AdminSection
          title="Featured Players"
          description="Choose up to five players to appear in the Champion Collections section and control their homepage order."
        >
          <AdminPlayerPicker
            name="featuredPlayers"
            label="Homepage Featured Players"
            description="Select the players that define the main Champion Collections experience. Their profile data and images continue to come from Player Studio."
            players={players}
            defaultValue={settings.featuredPlayers}
            maxSelected={5}
          />
        </AdminSection>

        <AdminSection
          title="Museum Identity"
          description="General AGE202 messaging used throughout the homepage."
        >
          <AdminTextField
            name="museumTagline"
            label="Museum Tagline"
            defaultValue={settings.museumTagline}
            description="Short statement displayed in the hero interface."
          />

          <AdminTextarea
            name="museumIntroduction"
            label="Museum Introduction"
            defaultValue={settings.museumIntroduction}
            description="Longer editorial introduction describing the AGE202 museum."
            rows={6}
          />
        </AdminSection>

        <div className="sticky bottom-5 z-20 flex justify-end">
          <div className="rounded-2xl border border-white/10 bg-[#07101F]/90 p-2 shadow-2xl backdrop-blur-xl">
            <AdminSubmitButton />
          </div>
        </div>
      </form>
    </AdminShell>
  );
}