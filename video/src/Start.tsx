import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { MovingBg } from "./Bg";
import { T } from "./std/theme";
import { Captions } from "./std/Captions";
import { BottomLoop } from "./std/Loops";
import { Voxels3D } from "./std/Cube3D";
import { ChestGui, header, mainSlots } from "./Guide";
import yt from "./start-yt.json";
import reel from "./start-reel.json";
import mb from "./multiblocks.json";
import guide from "./guide.json";
import iconIndex from "./icons-index.json";

const FPS = T.fps;
const C = T.color;
const HAVE = new Set<string>(iconIndex as string[]);
const MB: any = mb;
const pop = (f: number, fps: number, d: number) => spring({ frame: f - d, fps, config: { damping: 13, mass: 0.6 } });
const total = (sb: any) => sb.scenes.reduce((a: number, s: any) => a + Math.round(s.seconds * FPS), 0);
export const startYtFrames = () => total(yt);
export const startReelFrames = () => total(reel);

const Fade: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 10, dur - 10, dur], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity: o, transform: `scale(${1 + (f / dur) * 0.03})`, transformOrigin: "50% 45%" }}>{children}</AbsoluteFill>;
};

// =========================== YOUTUBE (16:9) ===========================================================
const Chrome: React.FC<{ label?: string; head?: string; children: React.ReactNode }> = ({ label, head, children }) => (
  <AbsoluteFill style={{ fontFamily: T.font, color: C.cream }}>
    <MovingBg />
    <div style={{ height: 8, background: C.gold }} />
    {label && <div style={{ position: "absolute", top: 40, left: 80, color: C.gold, letterSpacing: 8, fontSize: 28, fontFamily: "Consolas, monospace" }}>{label}</div>}
    {head && <div style={{ position: "absolute", top: 90, left: 80, fontSize: 68, fontWeight: 800 }}>{head}</div>}
    <div style={{ position: "absolute", bottom: 36, right: 60, color: "#6f8a7e", fontSize: 24 }}>mc.drakescraft.cl</div>
    {children}
  </AbsoluteFill>
);

const Points: React.FC<{ points: string[]; left: number; top: number; size?: number }> = ({ points, left, top, size = 40 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ position: "absolute", left, top, right: 70 }}>
      {points.map((p, i) => (
        <div key={i} style={{ fontSize: size, marginBottom: 26, color: i === 0 ? C.hot : C.cream, opacity: pop(f, fps, 20 + i * 26), transform: `translateX(${(1 - pop(f, fps, 20 + i * 26)) * 50}px)` }}>
          {i > 0 ? `${i}. ` : ""}{p}
        </div>
      ))}
    </div>
  );
};

const TitleS: React.FC<{ s: any }> = ({ s }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const k = pop(f, fps, 4);
  return (
    <Chrome>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", textAlign: "center", padding: 120 }}>
        <div style={{ fontSize: 118, fontWeight: 900, lineHeight: 1.05, transform: `translateY(${(1 - k) * 40}px)`, opacity: k }}>{s.title}</div>
        <div style={{ fontSize: 42, color: C.muted, marginTop: 40, opacity: pop(f, fps, 22), maxWidth: 1500 }}>{s.sub}</div>
      </AbsoluteFill>
    </Chrome>
  );
};

const GuiS: React.FC<{ s: any }> = ({ s }) => {
  const g: any = guide;
  const slots = [...header(), ...mainSlots(g.main_pages[0])];
  return (
    <Chrome label={s.label} head={s.head}>
      <div style={{ position: "absolute", top: 210, left: 70 }}><ChestGui title="Slimefun Guide" rows={6} slots={slots} /></div>
      <Points points={s.points} left={1040} top={300} size={40} />
    </Chrome>
  );
};

const BarsS: React.FC<{ s: any }> = ({ s }) => {
  const f = useCurrentFrame();
  const rows = [{ name: "Enhanced Crafting Table", cost: 0 }, ...s.rows];
  const max = Math.max(...rows.map((r: any) => r.cost), 1);
  return (
    <Chrome label={s.label} head={s.head}>
      <div style={{ position: "absolute", top: 240, left: 80, right: 80 }}>
        {rows.map((r: any, i: number) => {
          const w = interpolate(f, [18 + i * 14, 60 + i * 14], [0, Math.max(0.03, r.cost / max) * 1000], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
              <div style={{ width: 520, fontSize: 38 }}>{r.name}</div>
              <div style={{ height: 46, width: w, background: r.cost === 0 ? "#22c55e" : C.gold, borderRadius: 6 }} />
              <div style={{ marginLeft: 20, fontSize: 40, fontWeight: 800, fontFamily: "Consolas, monospace" }}>{r.cost === 0 ? "GRATIS" : `${r.cost} niv.`}</div>
            </div>
          );
        })}
      </div>
    </Chrome>
  );
};

const Model1S: React.FC<{ s: any }> = ({ s }) => (
  <Chrome label={s.label} head={s.head}>
    <div style={{ position: "absolute", left: 40, top: 150 }}><Voxels3D cells={MB[s.block].cells} width={1000} height={900} distance={4.6} /></div>
    <Points points={s.points} left={1080} top={330} size={42} />
  </Chrome>
);

const Model3S: React.FC<{ s: any }> = ({ s }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <Chrome label={s.label} head={s.head}>
      {s.blocks.map((b: any, i: number) => (
        <div key={b.id} style={{ position: "absolute", left: 40 + i * 620, top: 190, width: 600 }}>
          <Voxels3D cells={MB[b.id].cells} width={600} height={620} distance={4.9} startFrame={20 + i * 25} />
          <div style={{ textAlign: "center", marginTop: -20, opacity: pop(f, fps, 40 + i * 25) }}>
            <div style={{ fontSize: 44, fontWeight: 800 }}>{b.name}</div>
            <div style={{ fontSize: 30, color: C.hot }}>{b.cost} niveles</div>
            <div style={{ fontSize: 28, color: C.muted }}>{b.note}</div>
          </div>
        </div>
      ))}
    </Chrome>
  );
};

const NextS: React.FC<{ s: any }> = ({ s }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <Chrome label={s.label} head={s.head}>
      <div style={{ position: "absolute", top: 260, left: 80, right: 80, display: "flex", alignItems: "center", gap: 36 }}>
        <div style={{ padding: "26px 34px", borderRadius: 14, background: C.green, border: `4px solid ${C.gold}`, fontSize: 44, fontWeight: 800, opacity: pop(f, fps, 6) }}>Basic Machines<div style={{ fontSize: 26, color: C.muted }}>terminar sus ítems</div></div>
        <div style={{ fontSize: 80, color: C.gold }}>➜</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {s.locked.map((n: string, i: number) => (
            <div key={n} style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 40, opacity: pop(f, fps, 30 + i * 18) }}>
              {HAVE.has("mc/BARRIER") && <Img src={staticFile("icons/mc/BARRIER.png")} style={{ width: 54, height: 54, imageRendering: "pixelated" }} />}
              <span>{n}</span>
            </div>
          ))}
        </div>
      </div>
    </Chrome>
  );
};

const YT_KINDS: Record<string, React.FC<{ s: any }>> = { title: TitleS, gui: GuiS, bars: BarsS, model1: Model1S, model3: Model3S, next: NextS };

export const StartYT: React.FC = () => {
  let at = 0;
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      {(yt as any).scenes.map((s: any) => {
        const dur = Math.round(s.seconds * FPS);
        const from = at;
        at += dur;
        const K = YT_KINDS[s.kind];
        return (
          <Sequence key={s.id} from={from} durationInFrames={dur}>
            <Fade dur={dur}><K s={s} /></Fade>
            <Audio src={staticFile(s.audio)} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

// =========================== REEL (9:16) ==============================================================
const Stroke: React.CSSProperties = { WebkitTextStroke: "9px #000", paintOrder: "stroke fill", fontFamily: T.fontBlack };

const RBig: React.FC<{ s: any }> = ({ s }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const k = pop(f, fps, 2);
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 260 }}>
      <div style={{ ...Stroke, fontSize: s.big.length > 8 ? 150 : 210, color: C.hot, textAlign: "center", lineHeight: 1, transform: `scale(${0.6 + 0.4 * k}) rotate(${(1 - k) * -4}deg)` }}>{s.big}</div>
      <div style={{ ...Stroke, fontSize: 62, color: "#fff", textAlign: "center", marginTop: 30, padding: "0 60px", opacity: pop(f, fps, 14) }}>{s.small}</div>
    </AbsoluteFill>
  );
};

const RCmd: React.FC<{ s: any }> = ({ s }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const shown = Math.min(s.cmd.length, Math.floor(f / 2));
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 300 }}>
      <div style={{ background: "#0b1c16", border: `8px solid ${C.gold}`, borderRadius: 24, padding: "30px 50px", fontFamily: "Consolas, monospace", fontSize: 130, color: "#5eead4", fontWeight: 800, transform: `scale(${pop(f, fps, 2)})` }}>
        {s.cmd.slice(0, shown)}
        <span style={{ opacity: f % 16 < 8 ? 1 : 0 }}>▌</span>
      </div>
      <div style={{ ...Stroke, fontSize: 70, color: "#fff", marginTop: 40, opacity: pop(f, fps, 20) }}>{s.small}</div>
    </AbsoluteFill>
  );
};

const RModel: React.FC<{ s: any }> = ({ s }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 90, top: 40 }}><Voxels3D cells={MB[s.block].cells} width={900} height={760} distance={4.3} spin={0.02} /></div>
      <div style={{ ...Stroke, position: "absolute", top: 810, left: 0, right: 0, textAlign: "center", fontSize: 60, color: C.hot, opacity: pop(f, fps, 30) }}>{s.small}</div>
    </AbsoluteFill>
  );
};

const RLocked: React.FC<{ s: any }> = ({ s }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 150, fontFamily: T.fontBlack }}>
      {s.items.map((n: string, i: number) => (
        <div key={n} style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 22, transform: `scale(${pop(f, fps, 6 + i * 12)})` }}>
          {HAVE.has("mc/BARRIER") && <Img src={staticFile("icons/mc/BARRIER.png")} style={{ width: 90, height: 90, imageRendering: "pixelated" }} />}
          <span style={{ ...Stroke, fontSize: 58, color: "#fff" }}>{n}</span>
        </div>
      ))}
      <div style={{ ...Stroke, fontSize: 52, color: C.hot, marginTop: 16, opacity: pop(f, fps, 60) }}>{s.small}</div>
    </AbsoluteFill>
  );
};

const RCta: React.FC<{ s: any }> = ({ s }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulse = 1 + Math.sin(f / 6) * 0.04;
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 240, fontFamily: T.fontBlack }}>
      <div style={{ ...Stroke, fontSize: 96, color: "#fff", transform: `scale(${pop(f, fps, 2) * pulse})` }}>ENTRA YA</div>
      <div style={{ marginTop: 30, padding: "30px 40px", background: C.green, border: `8px solid ${C.gold}`, borderRadius: 28, fontSize: 88, color: C.gold, transform: `scale(${pulse})` }}>{s.ip}</div>
      <div style={{ ...Stroke, fontSize: 70, color: "#fff", marginTop: 26 }}>{s.line}</div>
      <div style={{ ...Stroke, fontSize: 56, color: C.hot, marginTop: 30 }}>Link en la bio ⬆</div>
    </AbsoluteFill>
  );
};

const R_KINDS: Record<string, React.FC<{ s: any }>> = { big: RBig, cmd: RCmd, model: RModel, locked: RLocked, cta: RCta };

export const StartReel: React.FC = () => {
  let at = 0;
  return (
    <AbsoluteFill style={{ background: "#04100c" }}>
      <MovingBg vertical intensity={1.3} />
      {(reel as any).scenes.map((s: any) => {
        const dur = Math.round(s.seconds * FPS);
        const from = at;
        at += dur;
        const K = R_KINDS[s.kind];
        return (
          <Sequence key={s.id} from={from} durationInFrames={dur}>
            <K s={s} />
            <Captions words={s.words} />
            <Audio src={staticFile(s.audio)} />
          </Sequence>
        );
      })}
      <BottomLoop name="ring" />
    </AbsoluteFill>
  );
};
