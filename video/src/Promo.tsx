import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { MovingBg } from "./Bg";
import { T } from "./std/theme";
import { Captions } from "./std/Captions";
import { BottomLoop } from "./std/Loops";
import { Voxels3D } from "./std/Cube3D";
import promo from "./promo-v2.json";
import mb from "./multiblocks.json";
import iconIndex from "./icons-index.json";

const C = T.color;
const FPS = T.fps;
const HAVE = new Set<string>(iconIndex as string[]);
const scenes: any[] = (promo as any).scenes;
export const promoFrames = () => scenes.reduce((a: number, s: any) => a + Math.round(s.seconds * FPS), 0);

const pop = (f: number, fps: number, d: number) => spring({ frame: f - d, fps, config: { damping: 11, mass: 0.5 } });
const Stroke: React.CSSProperties = { WebkitTextStroke: "9px #000", paintOrder: "stroke fill", fontFamily: T.fontBlack };
const Icon: React.FC<{ k: string; size: number; style?: React.CSSProperties }> = ({ k, size, style }) =>
  HAVE.has(k) ? <Img src={staticFile(`icons/${k}.png`)} style={{ width: size, height: size, imageRendering: "pixelated", ...style }} /> : null;

const Hook: React.FC<{ s: any }> = ({ s }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const k = pop(f, fps, 1);
  const n = Math.round(interpolate(f, [0, 36], [0, s.big], { extrapolateRight: "clamp" }));
  const shake = f < 36 ? Math.sin(f * 3) * 7 : 0;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 170, left: 0, right: 0, textAlign: "center", transform: `scale(${0.6 + 0.4 * k}) translateX(${shake}px)` }}>
        <div style={{ ...Stroke, fontSize: 230, color: C.hot, lineHeight: 1 }}>{n.toLocaleString("es-CL")}+</div>
        <div style={{ ...Stroke, fontSize: 78, color: "#fff", marginTop: 10 }}>{s.small}</div>
      </div>
      {["sf/IRON_DUST", "sf/GOLD_DUST", "sf/COPPER_DUST", "sf/SILVER_DUST"].map((k2, i) => (
        <Icon key={i} k={k2} size={150} style={{ position: "absolute", top: 620 + Math.sin(f / 9 + i * 2) * 28, left: 80 + i * 240, transform: `rotate(${Math.sin(f / 13 + i) * 16}deg) scale(${pop(f, fps, 10 + i * 4)})` }} />
      ))}
    </AbsoluteFill>
  );
};

const Modes: React.FC<{ s: any }> = ({ s }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      <div style={{ ...Stroke, position: "absolute", top: 150, left: 0, right: 0, textAlign: "center", fontSize: 140, color: C.hot, transform: `scale(${0.7 + 0.3 * pop(f, fps, 1)})` }}>5 MODALIDADES</div>
      <div style={{ position: "absolute", top: 380, left: 50, right: 50, display: "flex", flexWrap: "wrap", gap: 22, justifyContent: "center" }}>
        {s.modes.map((m: string, i: number) => (
          <div key={m} style={{ padding: "22px 44px", borderRadius: 24, background: C.green, border: `6px solid ${C.gold}`, fontSize: 64, fontWeight: 900, fontFamily: T.fontBlack, color: "#fff",
            transform: `scale(${pop(f, fps, 8 + i * 12)}) rotate(${(i % 2 ? 1 : -1) * 2}deg)` }}>
            {m}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const SlimefunS: React.FC<{ s: any }> = ({ s }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 60, top: 0 }}>
        <Voxels3D cells={(mb as any)[s.block].cells} width={600} height={620} distance={4.3} spin={0.025} />
      </div>
      <div style={{ ...Stroke, position: "absolute", left: 630, top: 170, width: 430, fontSize: 46, color: "#fff", lineHeight: 1.1, opacity: pop(f, fps, 10) }}>
        Máquinas<br />Energía<br />Automatización
      </div>
      <div style={{ position: "absolute", top: 640, left: 40, right: 40, display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
        {s.dusts.map((d: string, i: number) => (
          <div key={d} style={{ transform: `scale(${pop(f, fps, 30 + i * 6)})` }}>
            <Icon k={`sf/${d}_DUST`} size={104} />
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const WebS: React.FC<{ s: any }> = ({ s }) => {
  const f = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const shot = s.shots[Math.min(s.shots.length - 1, Math.floor((f / durationInFrames) * s.shots.length))];
  const pan = interpolate(f % Math.ceil(durationInFrames / s.shots.length), [0, Math.ceil(durationInFrames / s.shots.length)], [0, -520]);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 90, top: 60, width: 900, height: 700, borderRadius: 24, overflow: "hidden", border: `8px solid ${C.gold}`, background: "#000", transform: `scale(${pop(f, fps, 2)})`, boxShadow: "0 30px 80px rgba(0,0,0,.6)" }}>
        <div style={{ height: 46, background: "#1b2330", display: "flex", alignItems: "center", gap: 10, padding: "0 18px", color: C.muted, fontSize: 24, fontFamily: "Consolas, monospace" }}>
          <span style={{ color: "#ff5f57" }}>●</span><span style={{ color: "#febc2e" }}>●</span><span style={{ color: "#28c840" }}>●</span>
          <span style={{ marginLeft: 16 }}>web.drakescraft.cl</span>
        </div>
        <Img src={staticFile(`web/${shot}.png`)} style={{ width: 900, display: "block", transform: `translateY(${pan}px)` }} />
      </div>
      <div style={{ position: "absolute", top: 790, left: 40, right: 40, display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center" }}>
        {s.tags.map((t: string, i: number) => (
          <div key={t} style={{ ...Stroke, fontSize: 52, color: C.hot, WebkitTextStroke: "7px #000", transform: `scale(${pop(f, fps, 20 + i * 12)})` }}>{t}</div>
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
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 220 }}>
      <div style={{ ...Stroke, fontSize: 96, color: "#fff", transform: `scale(${pop(f, fps, 1) * pulse})` }}>ENTRA YA</div>
      <div style={{ marginTop: 30, padding: "30px 40px", background: C.green, border: `8px solid ${C.gold}`, borderRadius: 28, fontSize: 88, fontFamily: T.fontBlack, color: C.gold, transform: `scale(${pulse})` }}>{s.ip}</div>
      <div style={{ ...Stroke, fontSize: 70, color: "#fff", marginTop: 26 }}>{s.line}</div>
      <div style={{ ...Stroke, fontSize: 56, color: C.hot, marginTop: 30 }}>Link en la bio ⬆</div>
    </AbsoluteFill>
  );
};

const KINDS: Record<string, React.FC<{ s: any }>> = { hook: Hook, modes: Modes, slimefun: SlimefunS, web: WebS, cta: Cta };

export const PromoV2: React.FC = () => {
  let at = 0;
  return (
    <AbsoluteFill style={{ background: "#04100c" }}>
      <MovingBg vertical intensity={1.3} />
      {scenes.map((s: any) => {
        const dur = Math.round(s.seconds * FPS);
        const from = at;
        at += dur;
        const K = KINDS[s.kind];
        return (
          <Sequence key={s.id} from={from} durationInFrames={dur}>
            <K s={s} />
            <Captions words={s.words} />
            <Audio src={staticFile(s.audio)} />
          </Sequence>
        );
      })}
      <BottomLoop name="ring" seed="DrakesCraft presentacion" />
    </AbsoluteFill>
  );
};
