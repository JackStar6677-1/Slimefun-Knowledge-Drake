import React from "react";
import { MovingBg } from "./Bg";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import sb from "./storyboard.json";

export const FPS = 30;
const BG = "#071712";
const GOLD = "#d8b65a";
const CREAM = "#f4efdf";
const LINE = "#2a3d34";
const GREEN = "#12352a";
const FONT = '"Segoe UI", "Instrument Sans", Arial, sans-serif';

type Scene = any;
const scenes: Scene[] = (sb as any).scenes;
export const totalFrames = () => scenes.reduce((a: number, s: Scene) => a + Math.round(s.seconds * FPS), 0);

// ---- helpers -------------------------------------------------------------------------------
const useFade = (frame: number, dur: number) =>
  interpolate(frame, [0, 12, dur - 12, dur], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const pop = (frame: number, fps: number, delay: number) => spring({ frame: frame - delay, fps, config: { damping: 14, mass: 0.6 } });
const count = (frame: number, delay: number, to: number) =>
  Math.round(interpolate(frame, [delay, delay + 45], [0, to], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));

const Frame: React.FC<{ children: React.ReactNode; title?: string; step?: string }> = ({ children, title, step }) => (
  <AbsoluteFill style={{ background: BG, fontFamily: FONT, color: CREAM }}>
    <MovingBg />
    <div style={{ height: 8, background: GOLD }} />
    {step && (
      <div style={{ position: "absolute", top: 40, left: 80, color: GOLD, letterSpacing: 8, fontSize: 28, fontFamily: "Consolas, monospace" }}>
        {step}
      </div>
    )}
    {title && <div style={{ position: "absolute", top: 90, left: 80, fontSize: 64, fontWeight: 800 }}>{title}</div>}
    <div style={{ position: "absolute", bottom: 36, right: 60, color: "#6f8a7e", fontSize: 24 }}>mc.drakescraft.cl</div>
    {children}
  </AbsoluteFill>
);

const Tile: React.FC<{ label: string; kind: "sf" | "vanilla" | "empty"; n?: number; size?: number; scale?: number; iconKey?: string }> = ({ label, kind, n, size = 190, scale = 1, iconKey }) => {
  const fill = kind === "sf" ? GREEN : kind === "vanilla" ? "#1b2330" : "#0b1c16";
  const stroke = kind === "sf" ? GOLD : kind === "vanilla" ? "#6b7a8c" : LINE;
  const src = iconKey && kind !== "empty" ? staticFile(`icons/${kind === "sf" ? "sf" : "mc"}/${iconKey}.png`) : null;
  const [ok, setOk] = React.useState(true);
  return (
    <div style={{ width: size, height: size, borderRadius: 10, background: fill, border: `3px solid ${stroke}`, display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", textAlign: "center", fontSize: Math.max(16, size * 0.115), fontWeight: 600, padding: 8, boxSizing: "border-box", position: "relative",
      transform: `scale(${scale})`, opacity: scale }}>
      {kind !== "empty" && src && ok ? (
        <>
          <Img src={src} onError={() => setOk(false)} style={{ width: size * 0.5, height: size * 0.5, imageRendering: "pixelated" }} />
          <div style={{ marginTop: 6, lineHeight: 1.1 }}>{label}</div>
        </>
      ) : (
        kind !== "empty" && label
      )}
      {n && n > 1 ? <span style={{ position: "absolute", right: 10, bottom: 6, color: GOLD, fontFamily: "Consolas, monospace" }}>x{n}</span> : null}
    </div>
  );
};

// ---- escenas -------------------------------------------------------------------------------
const TitleScene: React.FC<{ s: Scene }> = ({ s }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const k = pop(f, fps, 4);
  return (
    <Frame>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", textAlign: "center", padding: 120 }}>
        <div style={{ color: GOLD, letterSpacing: 10, fontSize: 34, fontFamily: "Consolas, monospace", opacity: k }}>SLIMEFUN · DRAKESCRAFT</div>
        <div style={{ fontSize: 120, fontWeight: 900, lineHeight: 1.05, marginTop: 30, transform: `translateY(${(1 - k) * 40}px)`, opacity: k }}>{s.title}</div>
        <div style={{ fontSize: 42, color: "#9bb0a5", marginTop: 40, opacity: interpolate(f, [25, 50], [0, 1], { extrapolateRight: "clamp" }) }}>{s.subtitle}</div>
      </AbsoluteFill>
    </Frame>
  );
};

const GuideScene: React.FC<{ s: Scene }> = ({ s }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <Frame step="STEP 1 · THE GUIDE" title="Everything starts locked">
      <div style={{ position: "absolute", top: 260, left: 80, width: 760, height: 640, borderRadius: 16, background: "#0e241c", border: `3px solid ${LINE}`, padding: 36, boxSizing: "border-box" }}>
        <div style={{ fontSize: 40, fontWeight: 700, color: GOLD }}>📖 Slimefun Guide</div>
        {s.samples.map((r: any, i: number) => {
          const unlocked = f > 70 + i * 22;
          return (
            <div key={i} style={{ marginTop: 22, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 22px", borderRadius: 10,
              background: unlocked ? GREEN : "#0b1c16", border: `2px solid ${unlocked ? GOLD : LINE}`, fontSize: 32, opacity: pop(f, fps, 20 + i * 8) }}>
              <span>{unlocked ? "🔓" : "🔒"} {r.name}</span>
              <span style={{ color: GOLD, fontFamily: "Consolas, monospace" }}>{r.cost} XP</span>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", top: 260, left: 960, right: 80, display: "flex", flexDirection: "column", gap: 34 }}>
        {s.stats.map((st: any, i: number) => (
          <div key={i} style={{ opacity: pop(f, fps, 30 + i * 18), transform: `translateX(${(1 - pop(f, fps, 30 + i * 18)) * 60}px)` }}>
            <span style={{ fontSize: 130, fontWeight: 900, color: GOLD, fontFamily: "Consolas, monospace" }}>{count(f, 30 + i * 18, st.value)}</span>
            <span style={{ fontSize: 44, marginLeft: 24, color: CREAM }}>{st.label}</span>
          </div>
        ))}
      </div>
    </Frame>
  );
};

const BarsScene: React.FC<{ s: Scene }> = ({ s }) => {
  const f = useCurrentFrame();
  const max = Math.max(...s.bars.map((b: any) => b.value), 1);
  return (
    <Frame step="STEP 2 · METALS FIRST" title="Where the items come from">
      <div style={{ position: "absolute", top: 280, left: 80, right: 80 }}>
        {s.bars.map((b: any, i: number) => {
          const w = interpolate(f, [10 + i * 10, 60 + i * 10], [0, (b.value / max) * 1100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", marginBottom: 34 }}>
              <div style={{ width: 460, fontSize: 36 }}>{b.label}</div>
              <div style={{ height: 52, width: w, background: GOLD, borderRadius: 6 }} />
              <div style={{ marginLeft: 20, fontSize: 40, fontWeight: 800, fontFamily: "Consolas, monospace" }}>{b.value}</div>
            </div>
          );
        })}
      </div>
    </Frame>
  );
};

const PowerScene: React.FC<{ s: Scene }> = ({ s }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <Frame step="STEP 3 · POWER" title="Power is the real cost">
      <div style={{ position: "absolute", top: 270, left: 80, display: "flex", gap: 40 }}>
        {s.machines.map((m: any, i: number) => (
          <div key={i} style={{ width: 520, padding: 30, borderRadius: 14, background: "#0e241c", border: `3px solid ${GOLD}`, opacity: pop(f, fps, 10 + i * 12) }}>
            <div style={{ fontSize: 38, fontWeight: 800 }}>{m.name}</div>
            <div style={{ color: "#9bb0a5", fontSize: 26 }}>{m.addon}</div>
            <div style={{ fontSize: 72, color: GOLD, fontWeight: 900, fontFamily: "Consolas, monospace", marginTop: 10 }}>{m.use} J/s</div>
          </div>
        ))}
        <div style={{ fontSize: 100, alignSelf: "center", color: GOLD }}>=</div>
        <div style={{ alignSelf: "center", opacity: pop(f, fps, 40) }}>
          <div style={{ fontSize: 110, color: GOLD, fontWeight: 900, fontFamily: "Consolas, monospace" }}>{s.total}</div>
          <div style={{ fontSize: 32 }}>joules per second</div>
        </div>
      </div>
      <div style={{ position: "absolute", top: 640, left: 80, right: 80, display: "flex", gap: 30 }}>
        {s.generators.map((g: any, i: number) => (
          <div key={i} style={{ flex: 1, padding: 26, borderRadius: 14, background: GREEN, border: `2px solid ${LINE}`, opacity: pop(f, fps, 70 + i * 14) }}>
            <div style={{ fontSize: 32, fontWeight: 700 }}>{g.name}</div>
            <div style={{ color: "#9bb0a5", fontSize: 26 }}>{g.gives} J/s each</div>
            <div style={{ fontSize: 80, fontWeight: 900, color: GOLD, fontFamily: "Consolas, monospace" }}>×{g.need}</div>
          </div>
        ))}
      </div>
    </Frame>
  );
};

const RecipeScene: React.FC<{ s: Scene }> = ({ s }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const size = 160;
  return (
    <Frame step="ENHANCED CRAFTING TABLE" title={s.label}>
      <div style={{ position: "absolute", top: 250, left: 120, display: "grid", gridTemplateColumns: `repeat(3, ${size}px)`, gap: 12 }}>
        {s.grid.map((c: any, i: number) => (
          <Tile key={i} label={c ? c.name : ""} iconKey={c?.key} kind={c ? (c.sf ? "sf" : "vanilla") : "empty"} n={c?.n} size={size} scale={pop(f, fps, 8 + i * 5)} />
        ))}
      </div>
      <div style={{ position: "absolute", top: 380, left: 760, fontSize: 150, color: GOLD, opacity: pop(f, fps, 60) }}>➜</div>
      <div style={{ position: "absolute", top: 290, left: 1010 }}>
        <Tile label={s.label} iconKey={s.item} kind="sf" size={300} scale={pop(f, fps, 70)} />
      </div>
      {s.research ? (
        <div style={{ position: "absolute", top: 820, left: 120, fontSize: 40, color: GOLD, opacity: pop(f, fps, 80) }}>🔓 Research cost: {s.research} XP levels</div>
      ) : null}
      {s.dusts ? (
        <div style={{ position: "absolute", top: 820, left: 120, right: 120, display: "flex", gap: 14, flexWrap: "wrap" }}>
          {s.dusts.map((d: any, i: number) => (
            <div key={i} style={{ padding: "8px 22px 8px 12px", borderRadius: 30, background: GREEN, border: `2px solid ${GOLD}`, fontSize: 30, display: "flex", alignItems: "center", gap: 10, opacity: pop(f, fps, 150 + i * 10) }}>
              <Img src={staticFile(`icons/sf/${d.key}.png`)} style={{ width: 44, height: 44, imageRendering: "pixelated" }} />
              {d.name} Dust
            </div>
          ))}
        </div>
      ) : null}
    </Frame>
  );
};

const CargoScene: React.FC<{ s: Scene }> = ({ s }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const nodes = ["Dust Extractor", "Input Node", "Cargo Manager", "Output Node", "Chest"];
  return (
    <Frame step="STEP 4 · AUTOMATE THE STORAGE" title="A cargo network carries the dust">
      <div style={{ position: "absolute", top: 300, left: 60, right: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {nodes.map((n, i) => (
          <React.Fragment key={i}>
            <div style={{ width: 280, height: 170, borderRadius: 14, background: i % 4 === 0 ? "#1b2330" : GREEN, border: `3px solid ${i % 4 === 0 ? "#6b7a8c" : GOLD}`, display: "flex",
              alignItems: "center", justifyContent: "center", fontSize: 34, fontWeight: 700, textAlign: "center", opacity: pop(f, fps, 10 + i * 14) }}>{n}</div>
            {i < nodes.length - 1 && <div style={{ fontSize: 60, color: GOLD, opacity: pop(f, fps, 20 + i * 14) }}>→</div>}
          </React.Fragment>
        ))}
      </div>
      <div style={{ position: "absolute", top: 560, left: 80, right: 80, display: "flex", gap: 24 }}>
        {s.items.map((it: any, i: number) => (
          <div key={i} style={{ flex: 1, padding: 24, borderRadius: 12, background: "#0e241c", border: `2px solid ${LINE}`, opacity: pop(f, fps, 90 + i * 12) }}>
            <div style={{ fontSize: 30, fontWeight: 700 }}>{it.name}</div>
            <div style={{ color: GOLD, fontSize: 28, marginTop: 8 }}>🔓 {it.research} XP</div>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", top: 800, left: 80, fontSize: 36, color: "#9bb0a5", opacity: pop(f, fps, 150) }}>
        Give both nodes the same channel (0–15) · input nodes pull items out of the machine
      </div>
    </Frame>
  );
};

const LayoutScene: React.FC<{ s: Scene }> = ({ s }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <Frame step="THE WHOLE LINE" title="Cobblestone in, dust out">
      <div style={{ position: "absolute", top: 380, left: 60, right: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {s.chain.map((n: string, i: number) => (
          <React.Fragment key={i}>
            <div style={{ width: 260, height: 190, borderRadius: 14, background: GREEN, border: `3px solid ${GOLD}`, display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 32, fontWeight: 700, textAlign: "center", padding: 12, boxSizing: "border-box", opacity: pop(f, fps, 12 + i * 22) }}>{n}</div>
            {i < s.chain.length - 1 && <div style={{ fontSize: 56, color: GOLD, opacity: pop(f, fps, 24 + i * 22) }}>➜</div>}
          </React.Fragment>
        ))}
      </div>
    </Frame>
  );
};

const OutroScene: React.FC<{ s: Scene }> = ({ s }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const k = pop(f, fps, 4);
  return (
    <Frame>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", textAlign: "center", padding: 120 }}>
        <div style={{ fontSize: 96, fontWeight: 900, opacity: k }}>{s.title}</div>
        <div style={{ fontSize: 40, color: "#9bb0a5", marginTop: 36, maxWidth: 1400, opacity: k }}>{s.subtitle}</div>
        <div style={{ fontSize: 54, color: GOLD, marginTop: 60, fontFamily: "Consolas, monospace", opacity: pop(f, fps, 40) }}>mc.drakescraft.cl</div>
      </AbsoluteFill>
    </Frame>
  );
};

const RoutesScene: React.FC<{ s: Scene }> = ({ s }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <Frame step="STEP 3 · WHERE DOES DUST COME FROM?" title="Four routes to dust">
      <div style={{ position: "absolute", top: 230, left: 60, right: 60, display: "flex", flexDirection: "column", gap: 22 }}>
        {s.routes.map((r: any, ri: number) => (
          <div key={ri} style={{ display: "flex", alignItems: "center", gap: 20, padding: "12px 20px", borderRadius: 12, background: "#0e241c", border: `2px solid ${LINE}`, opacity: pop(f, fps, r.at * 30) }}>
            <div style={{ width: 330 }}>
              <div style={{ fontSize: 34, fontWeight: 800 }}>{r.title}</div>
              <div style={{ fontSize: 22, color: "#9bb0a5" }}>{r.note}</div>
            </div>
            {r.steps.map((st: any, si: number) => (
              <React.Fragment key={si}>
                <div style={{ textAlign: "center" }}>
                  <Tile label={st.label} iconKey={st.key} kind={st.sf ? "sf" : "vanilla"} size={150} scale={pop(f, fps, r.at * 30 + 8 + si * 14)} />
                  {st.tag ? <div style={{ fontSize: 20, color: GOLD, marginTop: 4 }}>{st.tag}</div> : null}
                </div>
                {si < r.steps.length - 1 && <div style={{ fontSize: 44, color: GOLD }}>➜</div>}
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>
    </Frame>
  );
};

const KINDS: Record<string, React.FC<{ s: Scene }>> = {
  title: TitleScene, guide: GuideScene, bars: BarsScene, routes: RoutesScene, power: PowerScene, recipe: RecipeScene, cargo: CargoScene, layout: LayoutScene, outro: OutroScene,
};

const FadeWrap: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ opacity: useFade(f, dur), transform: `scale(${1 + f / dur * 0.035})`, transformOrigin: "50% 45%" }}>{children}</AbsoluteFill>;
};

export const Video: React.FC = () => {
  let at = 0;
  return (
    <AbsoluteFill style={{ background: BG }}>
      {scenes.map((s: Scene) => {
        const dur = Math.round(s.seconds * FPS);
        const from = at;
        at += dur;
        const C = KINDS[s.kind];
        return (
          <Sequence key={s.id} from={from} durationInFrames={dur}>
            <FadeWrap dur={dur}>
              <C s={s} />
            </FadeWrap>
            <Audio src={staticFile(s.audio)} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
