import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import iconIndex from "./icons-index.json";

const HAVE = new Set<string>(iconIndex as string[]);
const POOL = [
  "sf/IRON_DUST", "sf/GOLD_DUST", "sf/COPPER_DUST", "sf/TIN_DUST", "sf/ZINC_DUST", "sf/LEAD_DUST", "sf/SILVER_DUST", "sf/MAGNESIUM_DUST",
  "sf/SIFTED_ORE", "sf/ORE_WASHER", "sf/GOLD_PAN", "sf/ORE_CRUSHER", "mc/GRAVEL", "mc/COBBLESTONE", "mc/IRON_ORE", "sf/MACHINE_CORE",
].filter((k) => HAVE.has(k));

// pseudo-aleatorio determinista (el render debe ser repetible)
const rnd = (i: number, salt: number) => {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/** Fondo vivo: degradado que respira, rejilla que avanza e iconos reales de Slimefun que flotan hacia arriba. */
export const MovingBg: React.FC<{ vertical?: boolean; intensity?: number }> = ({ vertical = false, intensity = 1 }) => {
  const f = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const hue = interpolate(f, [0, durationInFrames], [0, 40]);
  const n = vertical ? 16 : 22;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(${150 + Math.sin(f / 90) * 25}deg, hsl(${165 + hue}, 55%, 7%), hsl(${200 + hue}, 50%, 11%) 55%, hsl(${160 + hue}, 55%, 6%))` }}>
      <AbsoluteFill style={{ opacity: 0.18 * intensity, backgroundImage: "linear-gradient(rgba(216,182,90,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(216,182,90,.5) 1px, transparent 1px)",
        backgroundSize: "96px 96px", backgroundPosition: `${(f * 0.6) % 96}px ${(f * 1.2) % 96}px` }} />
      <div style={{ position: "absolute", left: "50%", top: "40%", width: width * 0.9, height: width * 0.9, marginLeft: -width * 0.45, marginTop: -width * 0.45,
        borderRadius: "50%", background: "radial-gradient(circle, rgba(20,184,166,.28), rgba(20,184,166,0) 65%)", transform: `scale(${1 + Math.sin(f / 40) * 0.12})` }} />
      {POOL.length > 0 &&
        Array.from({ length: n }).map((_, i) => {
          const speed = 0.8 + rnd(i, 1) * 1.6;
          const size = (vertical ? 70 : 60) + rnd(i, 2) * 90;
          const x = rnd(i, 3) * (width - size);
          const y = height + size - ((f * speed * 1.4 + rnd(i, 4) * (height + 2 * size)) % (height + 2 * size));
          const rot = Math.sin(f / (30 + i * 3) + i) * 18;
          const k = POOL[i % POOL.length];
          return (
            <Img key={i} src={staticFile(`icons/${k}.png`)} style={{ position: "absolute", left: x, top: y, width: size, height: size, imageRendering: "pixelated",
              opacity: (0.1 + rnd(i, 5) * 0.14) * intensity, transform: `rotate(${rot}deg)`, filter: "blur(0.4px)" }} />
          );
        })}
    </AbsoluteFill>
  );
};
