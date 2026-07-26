export const age202Theme = {
  colors: {
    background: {
      primary: "#050B18",
      deep: "#030711",
      elevated: "#07101D",
    },
    surface: {
      primary: "rgba(255,255,255,0.025)",
      secondary: "rgba(255,255,255,0.04)",
      elevated: "#0A1425",
    },
    brand: {
      lime: "#C8FF00",
      limeSoft: "rgba(200,255,0,0.12)",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "rgba(255,255,255,0.72)",
      muted: "rgba(255,255,255,0.48)",
      subtle: "rgba(255,255,255,0.30)",
    },
    border: {
      subtle: "rgba(255,255,255,0.08)",
      default: "rgba(255,255,255,0.10)",
      strong: "rgba(255,255,255,0.16)",
    },
  },
  layout: {
    contentMaxWidth: "1700px",
    navigationMaxWidth: "1480px",
    readingMaxWidth: "850px",
  },
  radius: {
    small: "16px",
    medium: "24px",
    large: "32px",
    pill: "9999px",
  },
  shadows: {
    card: "0 24px 80px rgba(0,0,0,0.28)",
    floating: "0 34px 110px rgba(0,0,0,0.42)",
    lime: "0 0 45px rgba(200,255,0,0.16)",
  },
  motion: {
    ease: [0.22, 1, 0.36, 1] as const,
    duration: {
      fast: 0.25,
      normal: 0.45,
      reveal: 0.8,
    },
  },
} as const;

export type Age202Theme = typeof age202Theme;
