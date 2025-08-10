// Centralized design tokens so components stay consistent and easy to tweak.

export const TOKENS = {
  colors: {
    bg: "#0f2027",
    heroA: "#18232f",
    heroB: "#1f2d3a",
    sectionA: "#18232f",
    sectionB: "#1f2d3a",
    panel: "#24303f",
    textPrimary: "#f8fafc",
    textMuted: "#cbd5e1",
    accent: "#2ecc71",
    accentHover: "#27ae60",
    borderWeak: "rgba(255,255,255,0.06)",
    border: "rgba(255,255,255,0.10)",
  },
  shadows: {
    md: "0 10px 30px rgba(0,0,0,0.25)",
    lg: "0 16px 44px rgba(0,0,0,0.30)",
  },
  easing: {
    // Framer Motion-friendly bezier (typesafe)
    easeOut: [0.16, 0.84, 0.44, 1] as [number, number, number, number],
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
  },
  spacing: (n: number) => `${n * 8}px`,
};
