import {
  Gift,
  Mail,
  MessageSquareText,
  ShieldCheck,
  Video,
} from "lucide-react";

import AdminShell from "@/components/admin/AdminShell";

import AdminSection from "@/components/admin/form/AdminSection";
import AdminSubmitButton from "@/components/admin/form/AdminSubmitButton";
import AdminTextField from "@/components/admin/form/AdminTextField";
import AdminTextarea from "@/components/admin/form/AdminTextarea";

import {
  getAdminContributeSettings,
} from "@/lib/repositories/contribute.repository";

import {
  updateContribute,
} from "./actions/updateContribute";


export const dynamic =
  "force-dynamic";


function ToggleField({
  name,
  label,
  description,
  defaultChecked,
}: {
  name: string;
  label: string;
  description: string;
  defaultChecked: boolean;
}) {
  return (
    <label className="flex items-start gap-4 rounded-2xl border border-white/10 bg-[#08111F] p-4">
      <input
        type="checkbox"
        name={name}
        defaultChecked={
          defaultChecked
        }
        className="mt-1 h-4 w-4 rounded border-white/20 bg-[#050B18] accent-lime-300"
      />

      <span>
        <span className="block text-sm font-semibold text-white">
          {label}
        </span>

        <span className="mt-1 block text-xs leading-5 text-white/35">
          {description}
        </span>
      </span>
    </label>
  );
}


export default async function ContributeAdminPage() {
  const settings =
    await getAdminContributeSettings();

  return (
    <AdminShell
      title="Contribute"
      description="Manage the public Contribute to the Museum experience."
    >
      <form
        action={updateContribute}
        className="space-y-8"
      >
        <section className="rounded-[32px] border border-lime-300/15 bg-gradient-to-br from-lime-300/[0.08] via-white/[0.03] to-transparent p-8">
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-lime-300 text-[#050B18]">
              <Gift size={30} />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-lime-300">
                Museum CMS
              </p>

              <h1 className="mt-2 text-4xl font-bold text-white">
                Contribution Manager
              </h1>

              <p className="mt-3 max-w-3xl text-white/45">
                Manage how players, legends and contributors are invited
                to send video greetings, dedications and memorabilia to AGE202.
              </p>
            </div>
          </div>
        </section>

        <AdminSection
          title="Publishing"
          description="Control whether the contribution programme is active and publicly available."
        >
          <div className="grid gap-4 lg:grid-cols-2">
            <ToggleField
              name="active"
              label="Programme active"
              description="Marks the AGE202 contribution programme as currently active."
              defaultChecked={
                settings.active
              }
            />

            <ToggleField
              name="published"
              label="Published"
              description="Allows the public Contribute page to be shown as published content."
              defaultChecked={
                settings.published
              }
            />
          </div>
        </AdminSection>

        <AdminSection
          title="Hero"
          description="Primary copy displayed at the top of the public contribution page."
        >
          <AdminTextField
            name="eyebrow"
            label="Eyebrow"
            defaultValue={
              settings.eyebrow
            }
            description="Small museum label above the main headline."
            required
          />

          <AdminTextField
            name="title"
            label="Title"
            defaultValue={
              settings.title
            }
            description="Main contribution page headline."
            required
          />

          <AdminTextarea
            name="intro"
            label="Introduction"
            defaultValue={
              settings.intro ?? ""
            }
            description="Opening message explaining why direct contributions matter."
            rows={6}
          />

          <div className="relative">
            <div className="pointer-events-none absolute right-4 top-4 text-white/20">
              <Mail size={18} />
            </div>

            <AdminTextField
              name="contactEmail"
              label="Contact Email"
              defaultValue={
                settings.contactEmail
              }
              description="Email used by the public contribution call-to-action."
              required
            />
          </div>
        </AdminSection>

        <AdminSection
          title="Video Greeting"
          description="Manage the direct video contribution option."
        >
          <div className="grid gap-6 lg:grid-cols-[1fr_220px]">
            <div className="space-y-6">
              <AdminTextField
                name="videoGreetingTitle"
                label="Title"
                defaultValue={
                  settings.videoGreetingTitle
                }
                required
              />

              <AdminTextarea
                name="videoGreetingDescription"
                label="Description"
                defaultValue={
                  settings.videoGreetingDescription ??
                  ""
                }
                rows={5}
              />
            </div>

            <div className="space-y-4">
              <div className="grid h-14 w-14 place-items-center rounded-2xl border border-lime-300/15 bg-lime-300/[0.05]">
                <Video className="h-6 w-6 text-lime-200" />
              </div>

              <ToggleField
                name="videoGreetingEnabled"
                label="Enabled"
                description="Show Video Greeting as an available contribution type."
                defaultChecked={
                  settings.videoGreetingEnabled
                }
              />
            </div>
          </div>
        </AdminSection>

        <AdminSection
          title="Dedication"
          description="Manage signed messages, photographs and digital dedications."
        >
          <div className="grid gap-6 lg:grid-cols-[1fr_220px]">
            <div className="space-y-6">
              <AdminTextField
                name="dedicationTitle"
                label="Title"
                defaultValue={
                  settings.dedicationTitle
                }
                required
              />

              <AdminTextarea
                name="dedicationDescription"
                label="Description"
                defaultValue={
                  settings.dedicationDescription ??
                  ""
                }
                rows={5}
              />
            </div>

            <div className="space-y-4">
              <div className="grid h-14 w-14 place-items-center rounded-2xl border border-lime-300/15 bg-lime-300/[0.05]">
                <MessageSquareText className="h-6 w-6 text-lime-200" />
              </div>

              <ToggleField
                name="dedicationEnabled"
                label="Enabled"
                description="Show Dedication as an available contribution type."
                defaultChecked={
                  settings.dedicationEnabled
                }
              />
            </div>
          </div>
        </AdminSection>

        <AdminSection
          title="Memorabilia"
          description="Manage the physical-history contribution option."
        >
          <div className="grid gap-6 lg:grid-cols-[1fr_220px]">
            <div className="space-y-6">
              <AdminTextField
                name="memorabiliaTitle"
                label="Title"
                defaultValue={
                  settings.memorabiliaTitle
                }
                required
              />

              <AdminTextarea
                name="memorabiliaDescription"
                label="Description"
                defaultValue={
                  settings.memorabiliaDescription ??
                  ""
                }
                rows={5}
              />
            </div>

            <div className="space-y-4">
              <div className="grid h-14 w-14 place-items-center rounded-2xl border border-lime-300/15 bg-lime-300/[0.05]">
                <Gift className="h-6 w-6 text-lime-200" />
              </div>

              <ToggleField
                name="memorabiliaEnabled"
                label="Enabled"
                description="Show Memorabilia as an available contribution type."
                defaultChecked={
                  settings.memorabiliaEnabled
                }
              />
            </div>
          </div>
        </AdminSection>

        <AdminSection
          title="Provenance & Closing"
          description="Editorial copy explaining how AGE202 preserves source, history and context."
        >
          <div className="flex items-center gap-3 text-lime-200/70">
            <ShieldCheck size={18} />

            <span className="text-[10px] font-black uppercase tracking-[0.18em]">
              Museum provenance
            </span>
          </div>

          <AdminTextField
            name="provenanceTitle"
            label="Provenance Title"
            defaultValue={
              settings.provenanceTitle
            }
            required
          />

          <AdminTextarea
            name="provenanceText"
            label="Provenance Text"
            defaultValue={
              settings.provenanceText ??
              ""
            }
            rows={6}
          />

          <AdminTextarea
            name="closingText"
            label="Closing Text"
            defaultValue={
              settings.closingText ??
              ""
            }
            rows={4}
          />
        </AdminSection>

        <AdminSection
          title="SEO"
          description="Search and social metadata for the public contribution page."
        >
          <AdminTextField
            name="metaTitle"
            label="Meta Title"
            defaultValue={
              settings.metaTitle ??
              ""
            }
          />

          <AdminTextarea
            name="metaDescription"
            label="Meta Description"
            defaultValue={
              settings.metaDescription ??
              ""
            }
            rows={4}
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
