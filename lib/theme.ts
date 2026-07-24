export const age202Theme = {
  colors: {
    background: {
      primary: "#050B18",
      deep: "#030711",
      hero: "#030812",
    },

    surface: {
      primary: "#07101D",
      secondary: "#07101F",
      elevated: "#0A1425",
      interactive: "#0A1628",
    },

    brand: {
      lime: "#C8FF00",
    },

    text: {
      primary: "#FFFFFF",
      secondary: "rgba(255,255,255,0.72)",
      muted: "rgba(255,255,255,0.48)",
      subtle: "rgba(255,255,255,0.30)",
      faint: "rgba(255,255,255,0.18)",
    },

    border: {
      subtle: "rgba(255,255,255,0.08)",
      default: "rgba(255,255,255,0.10)",
      strong: "rgba(255,255,255,0.15)",
    },

    overlay: {
      subtle: "rgba(255,255,255,0.025)",
      default: "rgba(255,255,255,0.035)",
      elevated: "rgba(255,255,255,0.045)",
      strong: "rgba(255,255,255,0.08)",
    },
  },

  layout: {
    contentMaxWidth: "1700px",
    readingMaxWidth: "850px",
    navigationMaxWidth: "1480px",
  },

  radius: {
    small: "16px",
    medium: "24px",
    large: "28px",
    extraLarge: "34px",
    pill: "9999px",
  },

  shadows: {
    floating:
      "0 24px 80px rgba(0,0,0,0.48)",
    card:
      "0 20px 70px rgba(0,0,0,0.20)",
  },

  typography: {
    tracking: {
      label: "0.30em",
      eyebrow: "0.38em",
      museum: "0.42em",
    },
  },

  motion: {
    ease: [0.22, 1, 0.36, 1] as const,

    duration: {
      fast: 0.3,
      normal: 0.5,
      reveal: 0.8,
      cinematic: 1.2,
    },
  },

  sections: {
    paddingY: {
      mobile: "6rem",
      tablet: "8rem",
      desktop: "10rem",
    },

    scrollMarginTop: "7rem",
  },
} as const;

export const themeColors = age202Theme.colors;
export const themeLayout = age202Theme.layout;
export const themeRadius = age202Theme.radius;
export const themeShadows = age202Theme.shadows;
export const themeTypography = age202Theme.typography;
export const themeMotion = age202Theme.motion;
export const themeSections = age202Theme.sections;

export type Age202Theme = typeof age202Theme;