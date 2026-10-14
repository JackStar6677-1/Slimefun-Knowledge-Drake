import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import sb from "./guide-storyboard.json";
import data from "./guide.json";
import iconIndex from "./icons-index.json";

export const FPS = 30;
const BG = "#071712";
const GOLD = "#d8b65a";
const CREAM = "#f4efdf";
const FONT = '"Segoe UI", Arial, sans-serif';
const scenes: any[] = (sb as any).scenes;
const G: any = data;
export const guideFrames = () => scenes.reduce((a, s) => a + Math.round(s.seconds * FPS), 0);

const pop = (f: number, fps: number, d: number) => spring({ frame: f - d, fps, config: { damping: 15, mass: 0.6 } });
const fade = (f: number, dur: number) => interpolate(f, [0, 12, dur - 12, dur], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

// ---- GUI de cofre estilo Minecraft -------------------------------------------------------------
type SlotData = { slot: number; key?: string; sf?: boolean; label?: string; n?: number; dim?: boolean; barrier?: boolean; pane?: boolean; glow?: boolean };
const SLOT = 92;

const HAVE = new Set<string>(iconIndex as string[]);
const Icon: React.FC<{ k?: string; sf?: boolean; size: number; label?: string }> = ({ k, sf, size, label }) => {
  if (!k) return null;
  return HAVE.has(`${sf ? "sf" : "mc"}/${k}`) ? (
    <Img src={staticFile(`icons/${sf ? "sf" : "mc"}/${k}.png`)} style={{ width: size, height: size, imageRendering: "pixelated" }} />
  ) : (
    <div style={{ fontSize: 15, textAlign: "center", color: "#222", fontWeight: 700, lineHeight: 1.1 }}>{label ?? k}</div>
  );
};

const ChestGui: React.FC<{ title: string; rows: number; slots: SlotData[]; showFrom?: number }> = ({ title, rows, slots, showFrom = 0 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bySlot = new Map(slots.map((s) => [s.slot, s]));
  const w = 9 * SLOT + 36;
  return (
    <div style={{ width: w, background: "#c6c6c6", border: "6px solid", borderColor: "#fff #555 #555 #fff", borderRadius: 6, padding: 12, boxSizing: "border-box", fontFamily: FONT }}>
      <div style={{ color: "#3f3f3f", fontSize: 30, fontWeight: 700, padding: "4px 6px 10px" }}>{title}</div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(9, ${SLOT}px)`, gridAutoRows: SLOT }}>
        {Array.from({ length: rows * 9 }).map((_, i) => {
          const s = bySlot.get(i);
          const appear = pop(f, fps, showFrom + (i % 9) * 1 + Math.floor(i / 9) * 2);
          return (
            <div key={i} style={{ width: SLOT, height: SLOT, boxSizing: "border-box", background: s?.pane ? "#3b3b3b" : "#8b8b8b", border: "3px solid", borderColor: "#373737 #fff #fff #373737",
              display: "flex", alignItems: "center", justifyContent: "center", position: "relative", opacity: Math.min(1, appear + 0.001),
              outline: s?.glow ? `5px solid ${GOLD}` : "none", outlineOffset: -5 }}>
              {s && !s.pane && (
                <div style={{ opacity: s.dim ? 0.35 : 1, transform: `scale(${0.6 + 0.4 * appear})` }}>
                  {s.barrier ? <Icon k="BARRIER" sf={false} size={SLOT - 30} label="locked" /> : <Icon k={s.key} sf={s.sf} size={SLOT - 30} label={s.label} />}
                </div>
              )}
              {s?.n && s.n > 1 ? <span style={{ position: "absolute", right: 5, bottom: 2, color: "#fff", fontWeight: 800, fontSize: 22, textShadow: "2px 2px #333" }}>{s.n}</span> : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const panes = (rows: number): SlotData[] => {
  const out: SlotData[] = [];
  for (let i = 0; i < 9; i++) out.push({ slot: i, pane: true });
  for (let i = (rows - 1) * 9; i < rows * 9; i++) out.push({ slot: i, pane: true });
  return out;
};
const header = (): SlotData[] => [
  ...panes(6).filter((s) => ![1, 5, 7, 46, 52].includes(s.slot)),
  { slot: 1, key: "ENCHANTING_TABLE", sf: false, label: "Settings" },
  { slot: 5, key: "NETHER_STAR", sf: false, label: "Favorites" },
  { slot: 7, key: "COMPASS", sf: false, label: "Search" },
  { slot: 46, key: "ARROW", sf: false, label: "Prev", pane: false },
  { slot: 52, key: "ARROW", sf: false, label: "Next", pane: false },
];

const Side: React.FC<{ title: string; lines: string[]; f: number }> = ({ title, lines, f }) => {
  const { fps } = useVideoConfig();
  return (
    <div style={{ position: "absolute", top: 220, left: 1060, right: 70, color: CREAM, fontFamily: FONT }}>
      <div style={{ fontSize: 56, fontWeight: 800, marginBottom: 30, opacity: pop(f, fps, 6) }}>{title}</div>
      {lines.map((l, i) => (
        <div key={i} style={{ fontSize: 36, marginBottom: 22, color: i === 0 ? GOLD : CREAM, opacity: pop(f, fps, 18 + i * 22), transform: `translateX(${(1 - pop(f, fps, 18 + i * 22)) * 40}px)` }}>
          {l}
        </div>
      ))}
    </div>
  );
};

const Frame: React.FC<{ step: string; children: React.ReactNode }> = ({ step, children }) => (
  <AbsoluteFill style={{ background: BG, fontFamily: FONT, color: CREAM }}>
    <div style={{ height: 8, background: GOLD }} />
    <div style={{ position: "absolute", top: 40, left: 80, color: GOLD, letterSpacing: 8, fontSize: 28, fontFamily: "Consolas, monospace" }}>{step}</div>
    <div style={{ position: "absolute", bottom: 36, right: 60, color: "#6f8a7e", fontSize: 24 }}>mc.drakescraft.cl</div>
    {children}
  </AbsoluteFill>
);

const mainSlots = (page: any, lockedSet?: Set<string>): SlotData[] =>
  page.slots.map((s: any) => ({ slot: s.slot, key: s.key, sf: s.sf, label: s.name, barrier: lockedSet?.has(s.name) ? true : false }));

// ---- escenas ---------------------------------------------------------------------------------
const Title: React.FC<{ s: any }> = ({ s }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const k = pop(f, fps, 4);
  return (
    <Frame step="SLIMEFUN · DRAKESCRAFT">
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", textAlign: "center", padding: 120 }}>
        <div style={{ fontSize: 110, fontWeight: 900, lineHeight: 1.05, opacity: k, transform: `translateY(${(1 - k) * 40}px)` }}>{s.title}</div>
        <div style={{ fontSize: 40, color: "#9bb0a5", marginTop: 40, opacity: pop(f, fps, 24), maxWidth: 1500 }}>{s.subtitle}</div>
      </AbsoluteFill>
    </Frame>
  );
};

const Menu: React.FC<{ s: any }> = ({ s }) => {
  const f = useCurrentFrame();
  const page = G.main_pages[0];
  const hl = [1, 5, 7][Math.min(2, Math.floor(f / 150))];
  const slots = [...header(), ...mainSlots(page)].map((x) => ({ ...x, glow: x.slot === hl && f > 60 }));
  return (
    <Frame step="THE MAIN MENU">
      <div style={{ position: "absolute", top: 150, left: 70 }}><ChestGui title="Slimefun Guide" rows={6} slots={slots} /></div>
      <Side f={f} title={`${G.stats.top_level} categories`} lines={["36 categories per page", `${G.stats.main_pages} pages in total`, "Top row: settings · favorites · search", "Click an icon to open it"]} />
    </Frame>
  );
};

const Pages: React.FC<{ s: any }> = ({ s }) => {
  const f = useCurrentFrame();
  const n = G.main_pages.length;
  const idx = Math.min(n - 1, Math.floor(f / 55));
  const page = G.main_pages[idx];
  const slots = [...header(), ...mainSlots(page)].map((x) => ({ ...x, glow: x.slot === 52 && f % 55 < 18 }));
  return (
    <Frame step="PAGES">
      <div style={{ position: "absolute", top: 150, left: 70 }}><ChestGui title={`Slimefun Guide · page ${idx + 1}/${n}`} rows={6} slots={slots} showFrom={0} /></div>
      <Side f={f} title={`Page ${idx + 1} of ${n}`} lines={["Arrows at the bottom row", "Addons fill most pages"]} />
    </Frame>
  );
};

const Locked: React.FC<{ s: any }> = ({ s }) => {
  const f = useCurrentFrame();
  const set = new Set<string>(G.stats.locked);
  const pageIdx = Math.max(0, G.main_pages.findIndex((p: any) => p.slots.some((x: any) => set.has(x.name))));
  const page = G.main_pages[pageIdx];
  const slots = [...header(), ...mainSlots(page, set)];
  return (
    <Frame step="LOCKED CATEGORIES">
      <div style={{ position: "absolute", top: 150, left: 70 }}><ChestGui title={`Slimefun Guide · page ${pageIdx + 1}/${G.main_pages.length}`} rows={6} slots={slots} /></div>
      <Side f={f} title="Red barrier = locked" lines={["Finish Basic Machines to open:", "Energy and Electricity", "GPS-based Machines · Programmable Androids · Cargo Management", "Talismans Tier II needs Tier I"]} />
    </Frame>
  );
};

const Category: React.FC<{ s: any }> = ({ s }) => {
  const f = useCurrentFrame();
  const c = G.category;
  const slots: SlotData[] = [...panes(6), ...c.slots.map((x: any, i: number) => ({ slot: x.slot, key: x.key, sf: true, label: x.name, dim: f > 90 && i % 3 === 0 && !!x.research }))];
  const sample = c.slots.find((x: any) => x.research) || c.slots[0];
  return (
    <Frame step="A CATEGORY">
      <div style={{ position: "absolute", top: 150, left: 70 }}><ChestGui title={c.name} rows={6} slots={slots} /></div>
      <Side f={f} title={c.name} lines={[`${c.n_items} items`, "Dimmed = not researched yet", `Example: ${sample.name} · research ${sample.research} levels`, "You pay levels once, it is yours forever"]} />
    </Frame>
  );
};

const Recipe: React.FC<{ s: any }> = ({ s }) => {
  const f = useCurrentFrame();
  const r = G.recipe;
  const slots: SlotData[] = [
    ...r.cells.map((c: any) => ({ slot: c.slot, key: c.key, sf: c.sf, label: c.name, n: c.n })),
    { slot: 10, key: r.type_icon.key, sf: r.type_icon.sf, label: r.type },
    { slot: 16, key: r.key, sf: true, label: r.name, glow: f > 100 },
  ];
  return (
    <Frame step="A RECIPE">
      <div style={{ position: "absolute", top: 260, left: 70 }}><ChestGui title={r.name} rows={3} slots={slots} showFrom={4} /></div>
      <Side f={f} title={r.name} lines={[`Craft it in: ${r.type}`, "3×3 grid = the pattern", `Research cost: ${r.research} levels`]} />
    </Frame>
  );
};

const KINDS: Record<string, React.FC<{ s: any }>> = { title: Title, gui_menu: Menu, gui_pages: Pages, gui_locked: Locked, gui_category: Category, gui_recipe: Recipe };

export const GuideBook: React.FC = () => {
  let at = 0;
  return (
    <AbsoluteFill style={{ background: BG }}>
      {scenes.map((s) => {
        const dur = Math.round(s.seconds * FPS);
        const from = at;
        at += dur;
        const C = KINDS[s.kind];
        return (
          <Sequence key={s.id} from={from} durationInFrames={dur}>
            <FadeWrap dur={dur}><C s={s} /></FadeWrap>
            <Audio src={staticFile(s.audio)} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

const FadeWrap: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ opacity: fade(f, dur) }}>{children}</AbsoluteFill>;
};
