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

// ---- 2. RingLab: una bola desarma varios circulos concentricos, con la fisica y las predicciones a la vista ----------------
type Ev = { f: number; x: number; y: number; nx: number; ny: number; vx: number; vy: number; ring: number; pass: boolean };
type Sim = { x: number[]; y: number[]; vx: number[]; vy: number[]; region: number[]; hits: number[]; events: Ev[]; gone: number[][]; radii: number[]; len: number; r: number };
const hashSeed = (s: string) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return Math.abs(h >>> 0);
};

const simulate = (seed: number): Sim => {
  const nRings = 4 + (seed % 3);
  const radii = Array.from({ length: nRings }).map((_, k) => 0.3 + (0.7 * k) / (nRings - 1));
  const segs = radii.map((_, k) => 40 + 8 * k);
  const gone = segs.map((n) => new Array(n).fill(Infinity));
  const r = 0.03;
  const speed = 0.02 + rnd(seed, 3) * 0.008;
  const a0 = rnd(seed, 4) * Math.PI * 2;
  let x = (rnd(seed, 5) - 0.5) * 0.3;
  let y = (rnd(seed, 6) - 0.5) * 0.3;
  let vx = Math.cos(a0) * speed;
  let vy = Math.sin(a0) * speed;
  let region = 0;
  let hits = 0;
  const out: Sim = { x: [], y: [], vx: [], vy: [], region: [], hits: [], events: [], gone, radii, len: 0, r };
  const segAt = (k: number) => Math.floor(((Math.atan2(y, x) + Math.PI) / (2 * Math.PI)) * segs[k]) % segs[k];
  let f = 0;
  for (; f < 1500; f++) {
    for (let s = 0; s < 4; s++) {
      x += vx / 4;
      y += vy / 4;
      const d = Math.hypot(x, y) || 1e-9;
      const outer = radii[region];
      const inner = region > 0 ? radii[region - 1] : -1;
      const tryWall = (k: number, sign: number) => {
        const seg = segAt(k);
        const alive = gone[k][seg] > f;
        const nx = (x / d) * sign;
        const ny = (y / d) * sign;
        out.events.push({ f, x, y, nx, ny, vx, vy, ring: k, pass: !alive });
        if (alive) {
          const dot = vx * nx + vy * ny;
          vx -= 2 * dot * nx;
          vy -= 2 * dot * ny;
          const rr = sign > 0 ? radii[k] - r - 0.002 : radii[k] + r + 0.002;
          x = (x / d) * rr;
          y = (y / d) * rr;
          gone[k][seg] = f;
          if (rnd(seed + f, 9) > 0.45) gone[k][(seg + 1) % segs[k]] = Math.min(gone[k][(seg + 1) % segs[k]], f + 3);
          const sp2 = Math.min(0.04, Math.hypot(vx, vy) * 1.012);
          const sc = sp2 / (Math.hypot(vx, vy) || 1);
          vx *= sc;
          vy *= sc;
          hits++;
        }
        return alive;
      };
      if (d + r > outer) {
        if (!tryWall(region, 1)) region++;
      } else if (inner > 0 && d - r < inner) {
        if (!tryWall(region - 1, -1)) region--;
      }
      if (region >= nRings) break;
    }
    out.x.push(x);
    out.y.push(y);
    out.vx.push(vx);
    out.vy.push(vy);
    out.region.push(Math.min(region, nRings - 1));
    out.hits.push(hits);
    if (region >= nRings) {
      f++;
      break;
    }
  }
  out.len = f;
  return out;
};

const simCache = new Map<number, Sim>();
const getSim = (seed: number): Sim => {
  if (!simCache.has(seed)) {
    let best: Sim | null = null;
    for (let i = 0; i < 80; i++) {
      // se busca una semilla cuya bola sobreviva (>= 800 cuadros) para que el loop nunca quede vacio
      const s = simulate(seed + i * 7919);
      if (!best || s.len > best.len) best = s;
      if (s.len >= 800) {
        best = s;
        break;
      }
    }
    simCache.set(seed, best as Sim);
  }
  return simCache.get(seed) as Sim;
};

export const RingLab: React.FC<{ w: number; h: number; seed: string }> = ({ w, h, seed }) => {
  const sim = getSim(hashSeed(seed));
  const cycle = sim.len + 45;
  const f0 = useCurrentFrame() % cycle;
  const f = Math.min(f0, sim.len - 1);
  const resetting = f0 >= sim.len;
  const S = Math.min(w * 0.5, h) * 0.45;
  const cx = w * 0.66;
  const cy = h * 0.52;
  const nR = sim.radii.length;
  const next = sim.events.filter((e) => e.f > f);
  const e1 = next[0];
  const e2 = next[1];
  const sp = Math.hypot(sim.vx[f], sim.vy[f]);
  const total = sim.gone.reduce((a, g) => a + g.length, 0);
  const alive = sim.gone.reduce((a, g) => a + g.filter((v) => v > f).length, 0);
  const P = (x: number, y: number) => [cx + x * S, cy + y * S] as const;
  const fmt = (n: number, d = 3) => (n >= 0 ? "+" : "") + n.toFixed(d);
  const dotNext = e1 ? e1.vx * e1.nx + e1.vy * e1.ny : 0;
  const theta = e1 ? (Math.acos(Math.min(1, Math.abs(dotNext) / (Math.hypot(e1.vx, e1.vy) || 1))) * 180) / Math.PI : 0;
  const rvx = e1 ? e1.vx - 2 * dotNext * e1.nx : 0;
  const rvy = e1 ? e1.vy - 2 * dotNext * e1.ny : 0;
  const trail = Array.from({ length: 22 }).map((_, i) => Math.max(0, f - i * 2));
  const bx = P(sim.x[f], sim.y[f])[0];
  const by = P(sim.x[f], sim.y[f])[1];
  return (
    <svg width={w} height={h} style={{ position: "absolute", inset: 0, fontFamily: "Consolas, monospace" }}>
      {sim.radii.map((R, k) =>
        sim.gone[k].map((g, s) => {
          const n = sim.gone[k].length;
          const t = g <= f ? Math.min(1, (f - g) / 12) : 0;
          if (t >= 1 || resetting) return null;
          const a0 = (s / n) * Math.PI * 2 - Math.PI;
          const a1 = ((s + 1) / n) * Math.PI * 2 - Math.PI;
          const rr = R * (1 + t * 0.1);
          const [x0, y0] = P(Math.cos(a0) * rr, Math.sin(a0) * rr);
          const [x1, y1] = P(Math.cos(a1) * rr, Math.sin(a1) * rr);
          return <path key={`${k}-${s}`} d={`M${x0},${y0} L${x1},${y1}`} stroke={`hsl(${(k * 55 + 160 + f * 0.5) % 360},85%,${58 - t * 20}%)`} strokeWidth={9} strokeLinecap="round" opacity={1 - t} />;
        }),
      )}
      {!resetting && e1 && <line x1={bx} y1={by} x2={P(e1.x, e1.y)[0]} y2={P(e1.x, e1.y)[1]} stroke="#fff" strokeWidth={3} strokeDasharray="10 8" opacity={0.85} />}
      {!resetting && e1 && e2 && <line x1={P(e1.x, e1.y)[0]} y1={P(e1.x, e1.y)[1]} x2={P(e2.x, e2.y)[0]} y2={P(e2.x, e2.y)[1]} stroke="#5eead4" strokeWidth={2} strokeDasharray="4 8" opacity={0.55} />}
      {!resetting && e1 && (
        <g>
          <circle cx={P(e1.x, e1.y)[0]} cy={P(e1.x, e1.y)[1]} r={16 * (1 + Math.sin(f / 3) * 0.25)} fill="none" stroke={e1.pass ? "#5eead4" : "#ff5a5a"} strokeWidth={3} />
          <line x1={P(e1.x, e1.y)[0]} y1={P(e1.x, e1.y)[1]} x2={P(e1.x, e1.y)[0] + e1.nx * 46} y2={P(e1.x, e1.y)[1] + e1.ny * 46} stroke="#ffd24a" strokeWidth={3} />
          <text x={P(e1.x, e1.y)[0] + 14} y={P(e1.x, e1.y)[1] - 14} fill="#fff" fontSize={22} fontWeight={800}>
            t−{e1.f - f}f
          </text>
        </g>
      )}
      {!resetting &&
        trail.map((tf, i) => <circle key={i} cx={P(sim.x[tf], sim.y[tf])[0]} cy={P(sim.x[tf], sim.y[tf])[1]} r={sim.r * S * (1 - i / 26)} fill="#ffd24a" opacity={0.5 - i * 0.02} />)}
      {!resetting && <circle cx={bx} cy={by} r={sim.r * S} fill="#fff" stroke="#ffd24a" strokeWidth={4} />}
      <g transform="translate(20,24)" fontSize={23} fill="#bff7ee" fontFamily='"Ubuntu Mono", "DejaVu Sans Mono", monospace'>
        <rect x={-8} y={-8} width={430} height={h - 56} rx={12} fill="rgba(3,12,9,.85)" stroke="rgba(255,210,74,.6)" />
        <text x={10} y={26} fill="#ffd24a" fontWeight={800}>
          SIMULACIÓN · semilla {hashSeed(seed) % 9973}
        </text>
        <text x={10} y={64}>
          anillo   {sim.region[f] + 1}/{nR}
        </text>
        <text x={10} y={96}>golpes   {sim.hits[f]}</text>
        <text x={10} y={128}>
          segm.    {alive}/{total}
        </text>
        <text x={10} y={160}>|v|      {sp.toFixed(4)} u/f</text>
        <text x={10} y={192}>E=½mv²  {(0.5 * sp * sp * 1000).toExponential(2)}</text>
        {e1 && (
          <>
            <text x={10} y={236} fill="#ffd24a" fontWeight={800}>
              PRÓXIMO IMPACTO t−{e1.f - f}f
            </text>
            <text x={10} y={268}>ángulo   {theta.toFixed(1)}°</text>
            <text x={10} y={300}>v·n      {fmt(dotNext, 4)}</text>
            <text x={10} y={338} fill="#ffd24a">
              v′ = v − 2(v·n)n
            </text>
            <text x={10} y={370}>
              v  =({fmt(e1.vx, 3)},{fmt(e1.vy, 3)})
            </text>
            <text x={10} y={400}>
              n  =({fmt(e1.nx, 2)},{fmt(e1.ny, 2)})
            </text>
            <text x={10} y={430}>
              v′ =({fmt(rvx, 3)},{fmt(rvy, 3)})
            </text>
          </>
        )}
        {resetting && (
          <text x={10} y={236} fill="#ff8a8a" fontWeight={800}>
            TODOS LOS ANILLOS ROTOS → reinicio
          </text>
        )}
      </g>
    </svg>
  );
};

// ---- 3. video externo local (carpeta public/bg/, ver docs/VIDEO_STANDARD.md) --------------------------------------------
export const BottomVideo: React.FC<{ file: string }> = ({ file }) => (
  <AbsoluteFill>
    <OffthreadVideo src={staticFile(`bg/${file}`)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
  </AbsoluteFill>
);

import { SatisfyingBallBreaker } from "./SatisfyingBallBreaker";

export type LoopName = "dust" | "ring" | "satisfying_breaker" | `video:${string}`;
export const BottomLoop: React.FC<{ name: LoopName; top?: number; seed?: string }> = ({ name = "satisfying_breaker", top = 1230, seed = "drakescraft" }) => {
  const { width, height, durationInFrames } = useVideoConfig();
  const h = height - top;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top, height: h, overflow: "hidden", borderTop: "4px solid rgba(255,210,74,.5)", background: "linear-gradient(#0a1c16, #06110d)" }}>
      {name === "dust" && <DustPile w={width} h={h} />}
      {name === "ring" && <RingLab w={width} h={h} seed={seed} />}
      {name === "satisfying_breaker" && <SatisfyingBallBreaker w={width} h={h} seed={seed} totalDuration={durationInFrames} />}
      {name.startsWith("video:") && <BottomVideo file={name.slice(6)} />}
    </div>
  );
};
