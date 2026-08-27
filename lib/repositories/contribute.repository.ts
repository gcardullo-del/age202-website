import { prisma } from "@/lib/prisma";


export type ContributeSettingsData = {
  id: string;
  active: boolean;
  published: boolean;

  eyebrow: string;
  title: string;
  intro: string | null;
  contactEmail: string;

  videoGreetingTitle: string;
  videoGreetingDescription: string | null;
  videoGreetingEnabled: boolean;

  dedicationTitle: string;
  dedicationDescription: string | null;
  dedicationEnabled: boolean;

  memorabiliaTitle: string;
  memorabiliaDescription: string | null;
  memorabiliaEnabled: boolean;

  provenanceTitle: string;
  provenanceText: string | null;
  closingText: string | null;

  metaTitle: string | null;
  metaDescription: string | null;

  createdAt: Date;
  updatedAt: Date;
};


export type PublicContributeSettings = {
  active: boolean;
  published: boolean;

  eyebrow: string;
  title: string;
  intro: string;
  contactEmail: string;

  videoGreeting: {
    title: string;
    description: string;
    enabled: boolean;
  };

  dedication: {
    title: string;
    description: string;
    enabled: boolean;
  };

  memorabilia: {
    title: string;
    description: string;
    enabled: boolean;
  };

  provenanceTitle: string;
  provenanceText: string;
  closingText: string;

  metaTitle: string;
  metaDescription: string;
};


export type UpdateContributeSettingsInput = {
  active: boolean;
  published: boolean;

  eyebrow: string;
  title: string;
  intro: string | null;
  contactEmail: string;

  videoGreetingTitle: string;
  videoGreetingDescription: string | null;
  videoGreetingEnabled: boolean;

  dedicationTitle: string;
  dedicationDescription: string | null;
  dedicationEnabled: boolean;

  memorabiliaTitle: string;
  memorabiliaDescription: string | null;
  memorabiliaEnabled: boolean;

  provenanceTitle: string;
  provenanceText: string | null;
  closingText: string | null;

  metaTitle: string | null;
  metaDescription: string | null;
};


const CONTRIBUTE_SETTINGS_ID =
  "main";


const defaultContributeSettings = {
  active: true,
  published: true,

  eyebrow:
    "AGE202 · The Digital Tennis Museum",

  title:
    "Contribute to the museum.",

  intro:
    "Tennis history is made of more than trophies and results. It lives through voices, memories, objects and personal stories. AGE202 invites players and former players to preserve a direct testimony of their journey.",

  contactEmail:
    "postmaster@age202.com",

  videoGreetingTitle:
    "Video Greeting",

  videoGreetingDescription:
    "A short video message for AGE202 can become a direct testimony preserved inside the museum's digital archive.",

  videoGreetingEnabled:
    true,

  dedicationTitle:
    "Dedication",

  dedicationDescription:
    "A signed photograph, personal message or digital dedication can preserve a unique connection between the player and tennis history.",

  dedicationEnabled:
    true,

  memorabiliaTitle:
    "Memorabilia",

  memorabiliaDescription:
    "A signed item, match-related object or personal piece can be documented, catalogued and preserved together with its story.",

  memorabiliaEnabled:
    true,

  provenanceTitle:
    "Provenance matters",

  provenanceText:
    "Every contribution is documented with its story, source and context so that the AGE202 archive can preserve both the object and its history.",

  closingText:
    "Every contribution helps AGE202 preserve another piece of tennis history.",

  metaTitle:
    "Contribute to the Museum | AGE202",

  metaDescription:
    "Contribute to AGE202 — The Digital Tennis Museum with a video greeting, digital dedication or tennis memorabilia and help preserve the history of the game.",
} as const;


function normalizeNullableText(
  value: string | null | undefined,
): string | null {
  if (
    value === null ||
    value === undefined
  ) {
    return null;
  }

  const normalized =
    value.trim();

  return normalized
    ? normalized
    : null;
}


function normalizeRequiredText(
  value: string | null | undefined,
  fallback: string,
): string {
  const normalized =
    normalizeNullableText(
      value,
    );

  return normalized ??
    fallback;
}


export async function getAdminContributeSettings():
  Promise<ContributeSettingsData> {
  const settings =
    await prisma.contributeSettings.upsert({
      where: {
        id:
          CONTRIBUTE_SETTINGS_ID,
      },

      update: {},

      create: {
        id:
          CONTRIBUTE_SETTINGS_ID,

        ...defaultContributeSettings,
      },
    });

  return settings;
}


export async function getPublicContributeSettings():
  Promise<PublicContributeSettings> {
  const settings =
    await prisma.contributeSettings.findUnique({
      where: {
        id:
          CONTRIBUTE_SETTINGS_ID,
      },
    });

  const source =
    settings ?? {
      id:
        CONTRIBUTE_SETTINGS_ID,

      ...defaultContributeSettings,

      createdAt:
        new Date(0),

      updatedAt:
        new Date(0),
    };

  return {
    active:
      source.active,

    published:
      source.published,

    eyebrow:
      normalizeRequiredText(
        source.eyebrow,
        defaultContributeSettings
          .eyebrow,
      ),

    title:
      normalizeRequiredText(
        source.title,
        defaultContributeSettings
          .title,
      ),

    intro:
      normalizeRequiredText(
        source.intro,
        defaultContributeSettings
          .intro,
      ),

    contactEmail:
      normalizeRequiredText(
        source.contactEmail,
        defaultContributeSettings
          .contactEmail,
      ),

    videoGreeting: {
      title:
        normalizeRequiredText(
          source.videoGreetingTitle,
          defaultContributeSettings
            .videoGreetingTitle,
        ),

      description:
        normalizeRequiredText(
          source.videoGreetingDescription,
          defaultContributeSettings
            .videoGreetingDescription,
        ),

      enabled:
        source.videoGreetingEnabled,
    },

    dedication: {
      title:
        normalizeRequiredText(
          source.dedicationTitle,
          defaultContributeSettings
            .dedicationTitle,
        ),

      description:
        normalizeRequiredText(
          source.dedicationDescription,
          defaultContributeSettings
            .dedicationDescription,
        ),

      enabled:
        source.dedicationEnabled,
    },

    memorabilia: {
      title:
        normalizeRequiredText(
          source.memorabiliaTitle,
          defaultContributeSettings
            .memorabiliaTitle,
        ),

      description:
        normalizeRequiredText(
          source.memorabiliaDescription,
          defaultContributeSettings
            .memorabiliaDescription,
        ),

      enabled:
        source.memorabiliaEnabled,
    },

    provenanceTitle:
      normalizeRequiredText(
        source.provenanceTitle,
        defaultContributeSettings
          .provenanceTitle,
      ),

    provenanceText:
      normalizeRequiredText(
        source.provenanceText,
        defaultContributeSettings
          .provenanceText,
      ),

    closingText:
      normalizeRequiredText(
        source.closingText,
        defaultContributeSettings
          .closingText,
      ),

    metaTitle:
      normalizeRequiredText(
        source.metaTitle,
        defaultContributeSettings
          .metaTitle,
      ),

    metaDescription:
      normalizeRequiredText(
        source.metaDescription,
        defaultContributeSettings
          .metaDescription,
      ),
  };
}


export async function updateContributeSettings(
  input: UpdateContributeSettingsInput,
): Promise<ContributeSettingsData> {
  return prisma.contributeSettings.upsert({
    where: {
      id:
        CONTRIBUTE_SETTINGS_ID,
    },

    update: {
      active:
        input.active,

      published:
        input.published,

      eyebrow:
        input.eyebrow.trim(),

      title:
        input.title.trim(),

      intro:
        normalizeNullableText(
          input.intro,
        ),

      contactEmail:
        input.contactEmail.trim(),

      videoGreetingTitle:
        input.videoGreetingTitle.trim(),

      videoGreetingDescription:
        normalizeNullableText(
          input.videoGreetingDescription,
        ),

      videoGreetingEnabled:
        input.videoGreetingEnabled,

      dedicationTitle:
        input.dedicationTitle.trim(),

      dedicationDescription:
        normalizeNullableText(
          input.dedicationDescription,
        ),

      dedicationEnabled:
        input.dedicationEnabled,

      memorabiliaTitle:
        input.memorabiliaTitle.trim(),

      memorabiliaDescription:
        normalizeNullableText(
          input.memorabiliaDescription,
        ),

      memorabiliaEnabled:
        input.memorabiliaEnabled,

      provenanceTitle:
        input.provenanceTitle.trim(),

      provenanceText:
        normalizeNullableText(
          input.provenanceText,
        ),

      closingText:
        normalizeNullableText(
          input.closingText,
        ),

      metaTitle:
        normalizeNullableText(
          input.metaTitle,
        ),

      metaDescription:
        normalizeNullableText(
          input.metaDescription,
        ),
    },

    create: {
      id:
        CONTRIBUTE_SETTINGS_ID,

      active:
        input.active,

      published:
        input.published,

      eyebrow:
        input.eyebrow.trim(),

      title:
        input.title.trim(),

      intro:
        normalizeNullableText(
          input.intro,
        ),

      contactEmail:
        input.contactEmail.trim(),

      videoGreetingTitle:
        input.videoGreetingTitle.trim(),

      videoGreetingDescription:
        normalizeNullableText(
          input.videoGreetingDescription,
        ),

      videoGreetingEnabled:
        input.videoGreetingEnabled,

      dedicationTitle:
        input.dedicationTitle.trim(),

      dedicationDescription:
        normalizeNullableText(
          input.dedicationDescription,
        ),

      dedicationEnabled:
        input.dedicationEnabled,

      memorabiliaTitle:
        input.memorabiliaTitle.trim(),

      memorabiliaDescription:
        normalizeNullableText(
          input.memorabiliaDescription,
        ),

      memorabiliaEnabled:
        input.memorabiliaEnabled,

      provenanceTitle:
        input.provenanceTitle.trim(),

      provenanceText:
        normalizeNullableText(
          input.provenanceText,
        ),

      closingText:
        normalizeNullableText(
          input.closingText,
        ),

      metaTitle:
        normalizeNullableText(
          input.metaTitle,
        ),

      metaDescription:
        normalizeNullableText(
          input.metaDescription,
        ),
    },
  });
}
