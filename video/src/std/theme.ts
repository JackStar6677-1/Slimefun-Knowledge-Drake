export type SeasonTheme = "standard" | "halloween" | "christmas";

export const THEMES: Record<SeasonTheme, {
  name: string;
  color: { bg: string; gold: string; hot: string; cream: string; green: string; line: string; muted: string; accent: string };
  gridColor: string;
  glowColor: string;
}> = {
  standard: {
    name: "Estándar",
    color: { bg: "#071712", gold: "#d8b65a", hot: "#ffd24a", cream: "#f4efdf", green: "#12352a", line: "#2a3d34", muted: "#9bb0a5", accent: "#14b8a6" },
    gridColor: "rgba(216,182,90,.5)",
    glowColor: "rgba(20,184,166,.28)",
  },
  halloween: {
    name: "Halloween (Octubre)",
    color: { bg: "#0a0612", gold: "#ea580c", hot: "#fb923c", cream: "#f5f3ff", green: "#2e1065", line: "#4c1d95", muted: "#a78bfa", accent: "#9333ea" },
    gridColor: "rgba(234,88,12,.4)",
    glowColor: "rgba(147,51,234,.32)",
  },
  christmas: {
    name: "Navidad (Diciembre)",
    color: { bg: "#05140d", gold: "#eab308", hot: "#facc15", cream: "#ffffff", green: "#14532d", line: "#166534", muted: "#86efac", accent: "#dc2626" },
    gridColor: "rgba(234,179,8,.4)",
    glowColor: "rgba(220,38,38,.25)",
  },
};

export const CURRENT_SEASON: SeasonTheme = "halloween"; // Activa automáticamente la temática de Octubre

export const T = {
  fps: 30,
  season: CURRENT_SEASON,
  size: { horizontal: { w: 1920, h: 1080 }, vertical: { w: 1080, h: 1920 } },
  color: THEMES[CURRENT_SEASON].color,
  themeConfig: THEMES[CURRENT_SEASON],
  font: '"Ubuntu", "Ubuntu Sans", "DejaVu Sans", sans-serif',
  fontBlack: '"Ubuntu", "Ubuntu Sans", "DejaVu Sans", sans-serif',
  reel: { loopTop: 1230, captionTop: 960, maxSeconds: 60, hookSeconds: 3 },
  youtube: { maxSeconds: 240 },
} as const;

