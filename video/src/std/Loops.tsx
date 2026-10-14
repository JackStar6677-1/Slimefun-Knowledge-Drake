import React from "react";
import { AbsoluteFill, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const rnd = (i: number, s: number) => {
  const x = Math.sin(i * 91.7 + s * 17.3) * 43758.5453;
  return x - Math.floor(x);
};

// ---- 1. pila de polvo de metal ------------------------------------------------------------------------------------
const COLS = 27;
const CYCLE = 330;
const DUST = ["#cfd2d6", "#f2c94c", "#d98c5f", "#b8c4cf", "#9fb0b0", "#7f8cb0", "#e9edf2", "#c9d6df", "#e8dff5"];
const dust = (() => {
  const heights = new Array(COLS).fill(0);
  return Array.from({ length: 150 }).map((_, i) => {
    const col = Math.min(COLS - 1, Math.max(0, Math.round(COLS / 2 + (rnd(i, 1) + rnd(i, 2) + rnd(i, 3) - 1.5) * COLS * 0.55)));
    return { col, start: i * 2, level: heights[col]++, color: DUST[Math.floor(rnd(i, 4) * DUST.length)] };
  });
})();

export const DustPile: React.FC<{ w: number; h: number }> = ({ w, h }) => {
  const f = useCurrentFrame() % CYCLE;
  const size = Math.round(w / 27);
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      {dust.map((p, i) => {
        const t = f - p.start;
        if (t < 0) return null;
        const land = h - (p.level + 1) * size * 0.8;
        const fall = Math.min(1, t / 26);
        const y = interpolate(fall * fall, [0, 1], [-60, land]) + (fall >= 1 ? Math.max(0, Math.sin((t - 26) / 3) * Math.exp(-(t - 26) / 6) * -10) : 0);
        const fade = f > CYCLE - 20 ? (CYCLE - f) / 20 : 1;
        return (
          <div key={i} style={{ position: "absolute", left: 20 + p.col * ((w - 40) / COLS), top: y, width: size, height: size, borderRadius: 8, background: p.color, opacity: fade,
            boxShadow: "inset -4px -4px 0 rgba(0,0,0,.25), inset 4px 4px 0 rgba(255,255,255,.35)" }} />
        );
      })}
    </div>
  );
};

// ---- 2. pelotas dentro de un circulo que se va consumiendo ----------------------------------------------------------
const SEGS = 72;
const RING_FRAMES = 900;
type Ball = { x: number; y: number; r: number; hue: number; out: boolean };
const ring: { balls: Ball[][]; segGone: number[] } = (() => {
  const N = 7;
  const R = 1;
  const segGone = new Array(SEGS).fill(Infinity);
  const st = Array.from({ length: N }).map((_, i) => ({
    x: (rnd(i, 7) - 0.5) * 0.9, y: (rnd(i, 8) - 0.5) * 0.9, vx: (rnd(i, 9) - 0.5) * 0.02, vy: (rnd(i, 10) - 0.5) * 0.02, r: 0.1 + rnd(i, 11) * 0.06, hue: Math.floor(rnd(i, 12) * 360), out: false,
  }));
  const frames: Ball[][] = [];
  for (let f = 0; f < RING_FRAMES; f++) {
    for (const b of st) {
      b.vy += 0.00045;
      b.x += b.vx;
      b.y += b.vy;
      const d = Math.hypot(b.x, b.y);
      if (!b.out && d + b.r > R) {
        const a = Math.atan2(b.y, b.x);
        const seg = Math.floor(((a + Math.PI) / (2 * Math.PI)) * SEGS) % SEGS;
        if (segGone[seg] > f) {
          const nx = b.x / d;
          const ny = b.y / d;
          const dot = b.vx * nx + b.vy * ny;
          b.vx -= 2 * dot * nx;
          b.vy -= 2 * dot * ny;
          b.vx *= 1.02;
          b.vy *= 1.02;
          b.x = nx * (R - b.r - 0.001);
          b.y = ny * (R - b.r - 0.001);
          b.hue = (b.hue + 40) % 360;
          segGone[seg] = f; // el golpe se come el segmento
          segGone[(seg + 1) % SEGS] = Math.min(segGone[(seg + 1) % SEGS], f + 4);
          if (b.r > 0.045) b.r *= 0.97;
        } else {
          b.out = true; // pasa por el hueco
        }
      }
    }
    frames.push(st.map((b) => ({ x: b.x, y: b.y, r: b.r, hue: b.hue, out: b.out })));
  }
  return { balls: frames, segGone };
})();

export const RingBounce: React.FC<{ w: number; h: number }> = ({ w, h }) => {
  const f = useCurrentFrame() % RING_FRAMES;
  const S = Math.min(w, h) * 0.42;
  const cx = w / 2;
  const cy = h / 2;
  return (
    <svg width={w} height={h} style={{ position: "absolute", inset: 0 }}>
      {Array.from({ length: SEGS }).map((_, s) => {
        const a0 = (s / SEGS) * Math.PI * 2 - Math.PI;
        const a1 = ((s + 1) / SEGS) * Math.PI * 2 - Math.PI;
        const t = ring.segGone[s] <= f ? Math.min(1, (f - ring.segGone[s]) / 10) : 0;
        if (t >= 1) return null;
        const r = S * (1 + t * 0.12);
        const p = (a: number) => `${cx + Math.cos(a) * r},${cy + Math.sin(a) * r}`;
        return <path key={s} d={`M${p(a0)} L${p(a1)}`} stroke={`hsl(${(s * 5 + f) % 360},90%,62%)`} strokeWidth={14} strokeLinecap="round" opacity={1 - t} />;
      })}
      {ring.balls[f].map((b, i) => (
        <circle key={i} cx={cx + b.x * S} cy={cy + b.y * S} r={b.r * S} fill={`hsl(${b.hue},95%,60%)`} opacity={b.out && cy + b.y * S > h + 80 ? 0 : 1} />
      ))}
    </svg>
  );
};

// ---- 3. video externo local (carpeta public/bg/, ver docs/VIDEO_STANDARD.md) --------------------------------------------
export const BottomVideo: React.FC<{ file: string }> = ({ file }) => (
  <AbsoluteFill>
    <OffthreadVideo src={staticFile(`bg/${file}`)} muted loop style={{ width: "100%", height: "100%", objectFit: "cover" }} />
  </AbsoluteFill>
);

export type LoopName = "dust" | "ring" | `video:${string}`;
export const BottomLoop: React.FC<{ name: LoopName; top?: number }> = ({ name, top = 1230 }) => {
  const { width, height } = useVideoConfig();
  const h = height - top;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top, height: h, overflow: "hidden", borderTop: "4px solid rgba(255,210,74,.5)", background: "linear-gradient(#0a1c16, #06110d)" }}>
      {name === "dust" && <DustPile w={width} h={h} />}
      {name === "ring" && <RingBounce w={width} h={h} />}
      {name.startsWith("video:") && <BottomVideo file={name.slice(6)} />}
    </div>
  );
};
