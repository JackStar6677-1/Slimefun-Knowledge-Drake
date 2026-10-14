// Estandar visual de los videos de DrakesCraft. Cambiar aqui cambia todos los videos nuevos.
// Reglas de formato y duracion: docs/VIDEO_STANDARD.md
export const T = {
  fps: 30,
  size: { horizontal: { w: 1920, h: 1080 }, vertical: { w: 1080, h: 1920 } },
  color: { bg: "#071712", gold: "#d8b65a", hot: "#ffd24a", cream: "#f4efdf", green: "#12352a", line: "#2a3d34", muted: "#9bb0a5" },
  font: '"Segoe UI", "Instrument Sans", Arial, sans-serif',
  fontBlack: '"Segoe UI Black", "Segoe UI", Arial, sans-serif',
  reel: { loopTop: 1230, captionTop: 960, maxSeconds: 60, hookSeconds: 3 },
  youtube: { maxSeconds: 240 },
} as const;
