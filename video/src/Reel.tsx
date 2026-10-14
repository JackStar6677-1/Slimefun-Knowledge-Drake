import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { MovingBg } from "./Bg";
import reel from "./reel-promo.json";
import iconIndex from "./icons-index.json";

export const FPS = 30;
const GOLD = "#ffd24a";
const GREEN = "#12352a";
const FONT = '"Segoe UI Black", "Segoe UI", Arial, sans-serif';
const HAVE = new Set<string>(iconIndex as string[]);
const scenes: any[] = (reel as any).scenes;
export const reelFrames = () => scenes.reduce((a: number, s: any) => a + Math.round(s.seconds * FPS), 0);

const pop = (f: number, fps: number, d: number) => spring({ frame: f - d, fps, config: { damping: 11, mass: 0.5 } });
const Icon: React.FC<{ k: string; size: number; style?: React.CSSProperties }> = ({ k, size, style }) =>
  HAVE.has(k) ? <Img src={staticFile(`icons/${k}.png`)} style={{ width: size, height: size, imageRendering: "pixelated", ...style }} /> : null;

// ---- loop "satisfactorio": polvo de metal cayendo y formando una pila, se reinicia solo -------------------------
const COLS = 27;
const CYCLE = 330;
const DUST = ["#cfd2d6", "#f2c94c", "#d98c5f", "#b8c4cf", "#9fb0b0", "#7f8cb0", "#e9edf2", "#c9d6df", "#e8dff5"];
const rnd = (i: number, s: number) => {
  const x = Math.sin(i * 91.7 + s * 17.3) * 43758.5453;
  return x - Math.floor(x);
};
const particles = (() => {
  const heights = new Array(COLS).fill(0);
  const out: { col: number; start: number; level: number; color: string }[] = [];
  for (let i = 0; i < 150; i++) {
    const col = Math.min(COLS - 1, Math.max(0, Math.round(COLS / 2 + (rnd(i, 1) + rnd(i, 2) + rnd(i, 3) - 1.5) * COLS * 0.55)));
    out.push({ col, start: i * 2, level: heights[col]++, color: DUST[Math.floor(rnd(i, 4) * DUST.length)] });
  }
  return out;
})();

const SatisfyingLoop: React.FC = () => {
  const f = useCurrentFrame() % CYCLE;
  const top = 1230;
  const floor = 1900;
  const size = 40;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top, height: floor - top, overflow: "hidden", borderTop: "4px solid rgba(255,210,74,.5)", background: "linear-gradient(#0a1c16, #06110d)" }}>
      {particles.map((p, i) => {
        const t = f - p.start;
        if (t < 0) return null;
        const landY = floor - top - (p.level + 1) * size * 0.8;
        const fall = Math.min(1, t / 26);
        const y = interpolate(fall * fall, [0, 1], [-60, landY]) + (fall >= 1 ? Math.max(0, Math.sin((t - 26) / 3) * Math.exp(-(t - 26) / 6) * -10) : 0);
        const fade = f > CYCLE - 20 ? (CYCLE - f) / 20 : 1;
        return <div key={i} style={{ position: "absolute", left: 20 + p.col * ((1080 - 40) / COLS), top: y, width: size, height: size, borderRadius: 8, background: p.color, opacity: fade,
          boxShadow: "inset -4px -4px 0 rgba(0,0,0,.25), inset 4px 4px 0 rgba(255,255,255,.35)" }} />;
      })}
    </div>
  );
};

// ---- subtitulos palabra por palabra -----------------------------------------------------------------------------
const Captions: React.FC<{ words: { w: string; t: number; d: number }[] }> = ({ words }) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  let idx = words.findIndex((w) => t < w.t + w.d);
  if (idx < 0) idx = words.length - 1;
  const start = Math.floor(idx / 3) * 3;
  const chunk = words.slice(start, start + 3);
  return (
    <div style={{ position: "absolute", left: 30, right: 30, top: 960, height: 250, display: "flex", flexWrap: "wrap", gap: "6px 26px", alignItems: "center", justifyContent: "center", alignContent: "center", fontFamily: FONT }}>
      {chunk.map((w, i) => {
        const active = start + i === idx;
        return (
          <span key={start + i} style={{ fontSize: 74, fontWeight: 900, textTransform: "uppercase", color: active ? GOLD : "#fff", WebkitTextStroke: "9px #000", lineHeight: 1.05, paintOrder: "stroke fill",
            transform: `scale(${active ? 1.1 : 1})`, textShadow: "0 8px 0 rgba(0,0,0,.6)" }}>
            {w.w}
          </span>
        );
      })}
    </div>
  );
};

// ---- escenas ----------------------------------------------------------------------------------------------------
const Hook: React.FC<{ s: any }> = ({ s }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const k = pop(f, fps, 2);
  const n = interpolate(f, [0, 40], [0, parseInt(String(s.big).replace(/\D/g, ""), 10)], { extrapolateRight: "clamp" });
  const shake = f < 40 ? Math.sin(f * 3) * 6 : 0;
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <div style={{ position: "absolute", top: 180, left: 0, right: 0, textAlign: "center", transform: `scale(${0.6 + 0.4 * k}) translateX(${shake}px)` }}>
        <div style={{ fontSize: 230, fontWeight: 900, color: GOLD, WebkitTextStroke: "10px #000", paintOrder: "stroke fill", lineHeight: 1 }}>
          {Math.round(n).toLocaleString("es-CL")}+
        </div>
        <div style={{ fontSize: 80, color: "#fff", WebkitTextStroke: "7px #000", paintOrder: "stroke fill", marginTop: 10 }}>{s.small}</div>
      </div>
      {["sf/IRON_DUST", "sf/GOLD_DUST", "sf/COPPER_DUST", "sf/SILVER_DUST"].map((k2, i) => (
        <Icon key={i} k={k2} size={150} style={{ position: "absolute", top: 600 + Math.sin(f / 10 + i * 2) * 25, left: 90 + i * 240, transform: `rotate(${Math.sin(f / 14 + i) * 14}deg) scale(${pop(f, fps, 14 + i * 4)})` }} />
      ))}
    </AbsoluteFill>
  );
};

const Modes: React.FC<{ s: any }> = ({ s }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <div style={{ position: "absolute", top: 140, left: 0, right: 0, textAlign: "center", fontSize: 150, fontWeight: 900, color: GOLD, WebkitTextStroke: "9px #000", paintOrder: "stroke fill",
        transform: `scale(${0.7 + 0.3 * pop(f, fps, 2)})` }}>{s.addons} ADDONS</div>
      <div style={{ position: "absolute", top: 380, left: 60, right: 60, display: "flex", flexWrap: "wrap", gap: 22, justifyContent: "center" }}>
        {s.modes.map((m: string, i: number) => (
          <div key={m} style={{ padding: "22px 44px", borderRadius: 24, background: GREEN, border: "6px solid " + GOLD, fontSize: 64, fontWeight: 900, color: "#fff",
            transform: `scale(${pop(f, fps, 10 + i * 14)}) rotate(${(i % 2 ? 1 : -1) * 2}deg)` }}>{m}</div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const Dust: React.FC<{ s: any }> = ({ s }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <div style={{ position: "absolute", top: 150, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 28 }}>
        <div style={{ transform: `scale(${pop(f, fps, 2)})`, textAlign: "center" }}>
          <Icon k="mc/COBBLESTONE" size={190} />
          <div style={{ color: "#fff", fontSize: 44, WebkitTextStroke: "5px #000", paintOrder: "stroke fill" }}>cobblestone</div>
        </div>
        <div style={{ fontSize: 120, color: GOLD, transform: `translateX(${Math.sin(f / 5) * 14}px)` }}>➜</div>
        <div style={{ transform: `scale(${pop(f, fps, 18)})`, textAlign: "center" }}>
          <Icon k="mc/FURNACE" size={190} />
          <div style={{ color: "#fff", fontSize: 44, WebkitTextStroke: "5px #000", paintOrder: "stroke fill" }}>Dust Extractor</div>
        </div>
      </div>
      <div style={{ position: "absolute", top: 560, left: 60, right: 60, display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center" }}>
        {s.dusts.map((d: string, i: number) => (
          <div key={d} style={{ transform: `scale(${pop(f, fps, 40 + i * 6)})` }}>
            <Icon k={`sf/${d}_DUST`} size={130} />
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const Cta: React.FC<{ s: any }> = ({ s }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulse = 1 + Math.sin(f / 6) * 0.04;
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <div style={{ position: "absolute", top: 200, left: 40, right: 40, textAlign: "center", transform: `scale(${pop(f, fps, 2) * pulse})` }}>
        <div style={{ fontSize: 96, color: "#fff", WebkitTextStroke: "8px #000", paintOrder: "stroke fill" }}>ENTRA YA</div>
        <div style={{ marginTop: 30, padding: "30px 40px", background: GREEN, border: "8px solid " + GOLD, borderRadius: 28, fontSize: 88, fontWeight: 900, color: GOLD }}>{s.ip}</div>
        <div style={{ marginTop: 26, fontSize: 70, color: "#fff", WebkitTextStroke: "6px #000", paintOrder: "stroke fill" }}>{s.line}</div>
        <div style={{ marginTop: 34, fontSize: 56, color: GOLD, WebkitTextStroke: "5px #000", paintOrder: "stroke fill" }}>Link en la bio ⬆</div>
      </div>
    </AbsoluteFill>
  );
};

const KINDS: Record<string, React.FC<{ s: any }>> = { hook: Hook, modes: Modes, dust: Dust, cta: Cta };

export const PromoReel: React.FC = () => {
  let at = 0;
  return (
    <AbsoluteFill style={{ background: "#04100c" }}>
      <MovingBg vertical intensity={1.3} />
      {scenes.map((s) => {
        const dur = Math.round(s.seconds * FPS);
        const from = at;
        at += dur;
        const C = KINDS[s.kind];
        return (
          <Sequence key={s.id} from={from} durationInFrames={dur}>
            <C s={s} />
            <Captions words={s.words} />
            <Audio src={staticFile(s.audio)} />
          </Sequence>
        );
      })}
      <SatisfyingLoop />
    </AbsoluteFill>
  );
};
