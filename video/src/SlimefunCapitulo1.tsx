import React, { useMemo } from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { T } from "./std/theme";
import { Steve3D, SteveAction } from "./std/Steve3D";
import { Captions } from "./std/Captions";
import { ThreeCanvas } from "@remotion/three";
import { Block, INDEX, useTextures, VoxelCell } from "./std/Cube3D";
import { ChestGui, Icon, SlotData } from "./Guide";
import storyboardData from "./sf-capitulo1-storyboard.json";
import skinRotation from "./skin_rotation.json";

export const SCENES_SF1 = storyboardData.scenes;

let accFramesSF1 = 0;
export const SCENE_RANGES_SF1 = SCENES_SF1.map((sec: any) => {
  const durationFrames = Math.round(sec.duration * 30);
  const start = accFramesSF1;
  accFramesSF1 += durationFrames;
  return {
    ...sec,
    startFrame: start,
    durationFrames,
    endFrame: accFramesSF1,
  };
});

export const TOTAL_SF_CAPITULO1_FRAMES = accFramesSF1 + 90; // ~9,700 frames (~5.4 min)

// Multibloques 3D de Slimefun con celdas y materiales oficiales
const MULTIBLOCK_CELLS: Record<string, VoxelCell[]> = {
  enhanced_crafting_table: [
    { x: 0, y: 0, material: "DISPENSER" },
    { x: 0, y: 1, material: "CRAFTING_TABLE" },
  ],
  grind_stone: [
    { x: 0, y: 0, material: "DISPENSER" },
    { x: 0, y: 1, material: "OAK_FENCE" },
  ],
  armor_forge: [
    { x: 0, y: 0, material: "DISPENSER" },
    { x: 0, y: 1, material: "ANVIL" },
  ],
  ore_crusher: [
    { x: 0, y: 0, material: "DISPENSER" },
    { x: 0, y: 1, material: "NETHER_BRICK_FENCE" },
    { x: -1, y: 0, material: "IRON_BARS" },
    { x: 1, y: 0, material: "IRON_BARS" },
  ],
  smeltery: [
    { x: 0, y: -1, material: "FLINT_AND_STEEL" },
    { x: 0, y: 0, material: "CAULDRON" },
    { x: 0, y: 1, material: "NETHER_BRICK_FENCE" },
    { x: 0, y: 2, material: "DISPENSER" },
  ],
  pressure_chamber: [
    { x: 0, y: -1, material: "DISPENSER" },
    { x: 0, y: 0, material: "CAULDRON" },
    { x: 0, y: 1, material: "GLASS" },
    { x: 0, y: 2, material: "PISTON" },
  ],
  magic_workbench: [
    { x: 0, y: -1, material: "DISPENSER" },
    { x: 0, y: 0, material: "CRAFTING_TABLE" },
    { x: 0, y: 1, material: "BOOKSHELF" },
  ],
};

// Rutas de todas las texturas de bloques necesarias para precarga
const ALL_MB_PATHS = Array.from(
  new Set(
    Object.values(MULTIBLOCK_CELLS)
      .flat()
      .flatMap((c) => Object.values(INDEX[c.material]?.faces ?? {}))
  )
);

// Visor de Multibloques 3D con texturas pixel art reales de Minecraft
const TexturedMultiblock3D: React.FC<{ type: string; frame: number }> = ({ type, frame }) => {
  const tex = useTextures(ALL_MB_PATHS);
  const cells = MULTIBLOCK_CELLS[type] || MULTIBLOCK_CELLS["enhanced_crafting_table"];
  const minY = Math.min(...cells.map((c) => c.y));
  const maxY = Math.max(...cells.map((c) => c.y));
  const cy = (minY + maxY) / 2;
  const heightSpan = maxY - minY + 1;
  const mbScale = heightSpan >= 4 ? 0.46 : heightSpan >= 3 ? 0.58 : 0.68;

  return (
    <group
      rotation={[0.15, 0.4 + frame * 0.016, 0]}
      position={[0, -cy * mbScale - 0.05, 0]}
      scale={[mbScale, mbScale, mbScale]}
    >
      {cells.map((cell, idx) => (
        <Block
          key={`${cell.material}-${cell.x}-${cell.y}-${idx}`}
          cell={cell}
          tex={tex}
          scale={1}
        />
      ))}
    </group>
  );
};

export const SlimefunCapitulo1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const currentScene = useMemo(() => {
    const found = SCENE_RANGES_SF1.find(
      (s) => frame >= s.startFrame && frame < s.endFrame
    );
    return found || SCENE_RANGES_SF1[SCENE_RANGES_SF1.length - 1];
  }, [frame]);

  const sceneIndex = useMemo(() => {
    return SCENE_RANGES_SF1.findIndex((s) => s.id === currentScene.id);
  }, [currentScene]);

  const skinList = skinRotation.skins || ["JackStar6677"];
  const currentSkinIndex = Math.floor(frame / (45 * 30)) % skinList.length;
  const currentSkinPart = `skins_parts/${skinList[currentSkinIndex]}`;

  const captionWords = useMemo(() => {
    if (!currentScene || !currentScene.words) return [];
    return currentScene.words.map((w: any) => ({
      w: w.word,
      t: currentScene.startFrame / 30 + w.start,
      d: w.duration,
    }));
  }, [currentScene]);

  // Selección de acción expresiva y dinámica según el contexto de la escena
  const dynamicAction: SteveAction = useMemo(() => {
    const diag = currentScene.diagram;
    if (diag === "welcome_screen") return "explain";
    if (diag === "commands_hud") return "point";
    if (diag === "protection_zone") return "nod";
    if (diag === "pwarp_menu") return "explain";
    if (diag === "guide_categories") return "point";
    if (diag === "research_tree") return "explain";
    if (diag === "recipe_gui") return "craft";
    if (diag === "multiblock_concept") return "look_machine";
    if (diag === "enhanced_crafting_table") return "point";
    if (diag === "grind_stone") return "craft";
    if (diag === "armor_forge") return "interact";
    if (diag === "ore_crusher") return "look_machine";
    if (diag === "smeltery") return "explain";
    if (diag === "magic_and_pressure") return "craft";
    if (diag === "roadmap_final") return "nod";
    return (currentScene?.action || "explain") as SteveAction;
  }, [currentScene]);

  // Posición de Steve: escalado a 0.58 y posicionado bajo para margen superior del 50%+
  const { pos, rot, action } = useMemo(() => {
    return {
      pos: [-0.62, -0.48, 0.2] as [number, number, number],
      rot: [0, 0.25 + Math.sin(frame * 0.025) * 0.12, 0] as [number, number, number],
      action: dynamicAction,
    };
  }, [frame, dynamicAction]);

  // Tipo de multibloque a renderizar en la escena 3D derecha
  const multiblockType = useMemo(() => {
    if (currentScene.diagram === "enhanced_crafting_table") return "enhanced_crafting_table";
    if (currentScene.diagram === "grind_stone") return "grind_stone";
    if (currentScene.diagram === "armor_forge") return "armor_forge";
    if (currentScene.diagram === "ore_crusher") return "ore_crusher";
    if (currentScene.diagram === "smeltery") return "smeltery";
    if (currentScene.diagram === "magic_and_pressure") {
      return (Math.floor(frame / 150) % 2 === 0) ? "pressure_chamber" : "magic_workbench";
    }
    return "enhanced_crafting_table";
  }, [currentScene, frame]);

  // Ranuras para la GUI real del selector de modalidades (/modalidades)
  const modalidadesGuiSlots: SlotData[] = useMemo(() => {
    const slots: SlotData[] = [];
    for (let i = 0; i < 27; i++) slots.push({ slot: i, pane: true });

    // Modalidad 1: Slimefun Survival (CON SLIMEFUN)
    slots[10] = {
      slot: 10,
      key: "ENHANCED_CRAFTING_TABLE",
      sf: true,
      label: "Slimefun",
      glow: true,
    };

    // Modalidad 2: OneBlock (CON SLIMEFUN)
    slots[12] = {
      slot: 12,
      key: "BLOCK_PLACER",
      sf: true,
      label: "OneBlock",
      glow: true,
    };

    // Modalidad 3: SkyBlock (CON SLIMEFUN)
    slots[14] = {
      slot: 14,
      key: "ACACIA_SAPLING",
      sf: false,
      label: "SkyBlock",
      glow: true,
    };

    // Modalidad 4: Clásico (SIN SLIMEFUN - Vanilla Puro)
    slots[16] = {
      slot: 16,
      key: "IRON_SWORD",
      sf: false,
      label: "Clásico (Vanilla)",
    };

    return slots;
  }, []);

  // Ranuras para la GUI real de categorías de Slimefun (Scene 4: guide_categories)
  const categoryGuiSlots: SlotData[] = useMemo(() => {
    const slots: SlotData[] = [];
    // Paneles decorativos perimetrales
    for (let i = 0; i < 9; i++) if (![1, 5, 7].includes(i)) slots.push({ slot: i, pane: true });
    for (let i = 45; i < 54; i++) if (![46, 49, 52].includes(i)) slots.push({ slot: i, pane: true });

    // Cabecera utilitaria
    slots.push({ slot: 1, key: "ENCHANTING_TABLE", sf: false, label: "Ajustes" });
    slots.push({ slot: 5, key: "NETHER_STAR", sf: false, label: "Favoritos" });
    slots.push({ slot: 7, key: "COMPASS", sf: false, label: "Buscar" });

    // Categorías de Slimefun oficiales con íconos pixelados
    const cats = [
      { slot: 10, key: "sf/ARMOR_FORGE", sf: true, label: "Armaduras" },
      { slot: 11, key: "sf/ENHANCED_CRAFTING_TABLE", sf: true, label: "Máquinas Básicas", glow: true },
      { slot: 12, key: "sf/ORE_CRUSHER", sf: true, label: "Procesamiento" },
      { slot: 13, key: "sf/SMELTERY", sf: true, label: "Fundición" },
      { slot: 14, key: "sf/MAGIC_WORKBENCH", sf: true, label: "Mágicos" },
      { slot: 15, key: "sf/PRESSURE_CHAMBER", sf: true, label: "Presión" },
      { slot: 16, key: "sf/CARGO_MANAGER", sf: true, label: "Logística" },
      { slot: 19, key: "sf/BIG_CAPACITOR", sf: true, label: "Electricidad" },
      { slot: 20, key: "sf/GPS_TRANSMITTER", sf: true, label: "GPS Cuántico" },
      { slot: 21, key: "sf/NUCLEAR_REACTOR", sf: true, label: "Reactores" },
      { slot: 22, key: "sf/DAMASCUS_STEEL_CHESTPLATE", sf: true, label: "Acero Damasco" },
      { slot: 23, key: "sf/MAGNESIUM_INGOT", sf: true, label: "Aleaciones" },
      { slot: 24, key: "sf/PROGRAMMABLE_ANDROID", sf: true, label: "Androides" },
      { slot: 25, key: "sf/BLADE_OF_VAMPIRES", sf: true, label: "Armas Slime" },
      { slot: 28, key: "sf/CHEST_TERMINAL", sf: true, label: "Redes Digitales" },
      { slot: 29, key: "sf/AUTOMATED_PANNING_MACHINE", sf: true, label: "Minería Auto" },
      { slot: 30, key: "sf/INFUSED_ELYTRA", sf: true, label: "Tecnología Élite" },
      { slot: 31, key: "sf/STEEL_JETPACK", sf: true, label: "Jetpacks" },
      { slot: 32, key: "sf/SOUL_JAR", sf: true, label: "Almas & Runas" },
      { slot: 33, key: "sf/HEATING_COIL", sf: true, label: "Componentes" },
      { slot: 34, key: "sf/COMMON_TALISMAN", sf: true, label: "Talismanes" },
    ];
    cats.forEach((c) => slots.push({ slot: c.slot, key: c.key.replace("sf/", ""), sf: true, label: c.label, glow: c.glow }));

    // Pie de página de navegación
    slots.push({ slot: 46, key: "ARROW", sf: false, label: "Anterior" });
    slots.push({ slot: 49, key: "PLAYER_HEAD", sf: false, label: "Perfil" });
    slots.push({ slot: 52, key: "ARROW", sf: false, label: "Siguiente" });

    return slots;
  }, []);

  // Ranuras para la GUI real de investigación con barreras rojas y costos XP (Scene 5: research_tree)
  const researchGuiSlots: SlotData[] = useMemo(() => {
    const slots: SlotData[] = [];
    for (let i = 0; i < 9; i++) slots.push({ slot: i, pane: true });
    for (let i = 45; i < 54; i++) slots.push({ slot: i, pane: true });

    // Ítems desbloqueados
    slots.push({ slot: 10, key: "ENHANCED_CRAFTING_TABLE", sf: true, label: "Desbloqueado" });
    slots.push({ slot: 11, key: "GRIND_STONE", sf: true, label: "Desbloqueado" });
    slots.push({ slot: 12, key: "ARMOR_FORGE", sf: true, label: "Desbloqueado" });

    // Ítems bloqueados con BARRERA ROJA de Minecraft y costo de XP
    slots.push({ slot: 14, barrier: true, label: "Bloqueado · 12 Niveles XP" });
    slots.push({ slot: 15, barrier: true, label: "Bloqueado · 18 Niveles XP" });
    slots.push({ slot: 16, barrier: true, label: "Bloqueado · 24 Niveles XP" });

    slots.push({ slot: 20, key: "SMELTERS_PICKAXE", sf: true, label: "Desbloqueado" });
    slots.push({ slot: 22, barrier: true, label: "Bloqueado · 15 Niveles XP" });
    slots.push({ slot: 24, barrier: true, label: "Bloqueado · 30 Niveles XP" });

    slots.push({ slot: 49, key: "ARROW", sf: false, label: "Volver a Guía" });
    return slots;
  }, []);

  // Ranuras para la GUI de receta 3x3 auténtica (Scene 6: recipe_gui)
  const recipeGuiSlots: SlotData[] = useMemo(() => {
    const slots: SlotData[] = [];
    // Relleno de paneles de cristal
    for (let i = 0; i < 27; i++) slots.push({ slot: i, pane: true });

    // Matriz 3x3 de fabricación en slots [1, 2, 3, 10, 11, 12, 19, 20, 21]
    slots[1] = { slot: 1, key: "COBBLESTONE", sf: false, label: "Adoquín" };
    slots[2] = { slot: 2, key: "IRON_INGOT", sf: false, label: "Lingote Hierro" };
    slots[3] = { slot: 3, key: "COBBLESTONE", sf: false, label: "Adoquín" };
    slots[10] = { slot: 10, key: "REDSTONE", sf: false, label: "Redstone" };
    slots[11] = { slot: 11, key: "CRAFTING_TABLE", sf: false, label: "Mesa Crafteo" };
    slots[12] = { slot: 12, key: "REDSTONE", sf: false, label: "Redstone" };
    slots[19] = { slot: 19, key: "COBBLESTONE", sf: false, label: "Adoquín" };
    slots[20] = { slot: 20, key: "DISPENSER", sf: false, label: "Dispensador" };
    slots[21] = { slot: 21, key: "COBBLESTONE", sf: false, label: "Adoquín" };

    // Flecha indicadora de crafteo en slot 14
    slots[14] = { slot: 14, key: "ARROW", sf: false, label: "Ensamblar" };

    // Resultado obtenido en slot 16 con brillo dorado
    slots[16] = { slot: 16, key: "ENHANCED_CRAFTING_TABLE", sf: true, label: "Mesa Mejorada", glow: true };

    // Indicador de máquina en slot 25
    slots[25] = { slot: 25, key: "ENHANCED_CRAFTING_TABLE", sf: true, label: "Multibloque en Mundo" };

    return slots;
  }, []);

  return (
    <AbsoluteFill style={{ backgroundColor: "#040d1a", fontFamily: T.font, color: "#ffffff", width: 1280, height: 720 }}>
      {/* Header Superior Técnico */}
      <div
        style={{
          position: "absolute",
          top: 24,
          left: 40,
          right: 40,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1.5px solid rgba(16, 185, 129, 0.3)",
          paddingBottom: 14,
          zIndex: 40,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span
            style={{
              backgroundColor: "#059669",
              color: "#ffffff",
              fontWeight: 900,
              fontSize: 15,
              padding: "4px 14px",
              borderRadius: 6,
              letterSpacing: 2,
            }}
          >
            SLIMEFUN GUÍA MAESTRA
          </span>
          <span style={{ color: "#34d399", fontSize: 16, fontWeight: 900, letterSpacing: 1.5 }}>
            CAPÍTULO 1 // GUÍA, MULTIBLOQUES & COMANDOS
          </span>
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div
            style={{
              backgroundColor: "rgba(16, 185, 129, 0.15)",
              border: "1px solid #10b981",
              borderRadius: 14,
              padding: "4px 12px",
              color: "#34d399",
              fontWeight: 900,
              fontSize: 14,
            }}
          >
            MC 1.21.x · VANILLA
          </div>
          <div
            style={{
              backgroundColor: "rgba(56, 189, 248, 0.15)",
              border: "1px solid #38bdf8",
              borderRadius: 14,
              padding: "4px 12px",
              color: "#38bdf8",
              fontWeight: 900,
              fontSize: 14,
            }}
          >
            PLAY.DRAKESCRAFT.CL
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div
        style={{
          position: "absolute",
          top: 90,
          left: 40,
          right: 40,
          bottom: 120,
          display: "grid",
          gridTemplateColumns: "1.25fr 1fr",
          gap: 30,
          zIndex: 30,
        }}
      >
        {/* Columna Izquierda: Panel Explicativo con GUI de Minecraft o Instrucciones */}
        <div
          style={{
            backgroundColor: "rgba(15, 23, 42, 0.92)",
            border: "1.5px solid rgba(16, 185, 129, 0.35)",
            borderRadius: 18,
            padding: "20px 24px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxShadow: "0 15px 40px rgba(0,0,0,0.6)",
            backdropFilter: "blur(14px)",
            overflow: "hidden",
          }}
        >
          <div>
            <div style={{ color: "#10b981", fontSize: 13, fontWeight: 900, letterSpacing: 2, marginBottom: 6, fontFamily: "monospace" }}>
              {currentScene.badge}
            </div>
            <div style={{ color: "#ffffff", fontSize: 24, fontWeight: 900, lineHeight: 1.2, marginBottom: 4 }}>
              {currentScene.title}
            </div>
            <div style={{ color: "#94a3b8", fontSize: 15, fontWeight: 600, marginBottom: 14 }}>
              {currentScene.subtitle}
            </div>

            {/* GUI REAL DE MODALIDADES (/MODALIDADES): SELECTOR DE SERVIDORES */}
            {currentScene.diagram === "modalidades_menu" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <ChestGui
                  title="Selector de Servidores (/modalidades)"
                  rows={3}
                  slots={modalidadesGuiSlots}
                  slotSize={50}
                />
                <div
                  style={{
                    backgroundColor: "rgba(10, 15, 28, 0.88)",
                    border: "1px solid rgba(16, 185, 129, 0.4)",
                    borderRadius: 10,
                    padding: "8px 14px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                    fontSize: 12,
                    fontFamily: "monospace",
                  }}
                >
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ backgroundColor: "#059669", color: "#fff", fontWeight: 900, padding: "2px 7px", borderRadius: 4, fontSize: 11 }}>
                      CON SLIMEFUN
                    </span>
                    <span style={{ color: "#34d399", fontWeight: 800 }}>
                      Slimefun Survival · OneBlock · SkyBlock
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ backgroundColor: "#dc2626", color: "#fff", fontWeight: 900, padding: "2px 7px", borderRadius: 4, fontSize: 11 }}>
                      SIN SLIMEFUN
                    </span>
                    <span style={{ color: "#f87171", fontWeight: 800 }}>
                      Clásico (Supervivencia Vanilla Tradicional)
                    </span>
                  </div>
                  <div style={{ color: "#94a3b8", fontSize: 11, marginTop: 1 }}>
                    📌 Empiezas en el Lobby. Usa <span style={{ color: "#38bdf8" }}>/modalidades</span> para elegir tu servidor o <span style={{ color: "#facc15" }}>/lobby</span> para volver.
                  </div>
                </div>
              </div>
            )}

            {/* GUI REAL DE MINECRAFT 54 SLOTS: Catálogo de Categorías Slimefun */}
            {currentScene.diagram === "guide_categories" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <ChestGui
                  title="Slimefun Guide (v1.21)"
                  rows={6}
                  slots={categoryGuiSlots}
                  slotSize={44}
                />
                <div
                  style={{
                    backgroundColor: "rgba(10, 15, 28, 0.8)",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                    borderRadius: 8,
                    padding: "6px 12px",
                    fontFamily: "monospace",
                    fontSize: 12,
                    color: "#a7f3d0",
                  }}
                >
                  ⚡ Haz clic izquierdo en cualquier categoría para explorar sus recetas y costos de investigación.
                </div>
              </div>
            )}

            {/* GUI REAL DE INVESTIGACIONES CON BARRERAS ROJAS Y COSTO DE XP */}
            {currentScene.diagram === "research_tree" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <ChestGui
                  title="Investigaciones · Máquinas Básicas"
                  rows={6}
                  slots={researchGuiSlots}
                  slotSize={44}
                />
                {/* Barra de Experiencia de Minecraft */}
                <div
                  style={{
                    backgroundColor: "rgba(0,0,0,0.7)",
                    borderRadius: 8,
                    padding: "8px 14px",
                    border: "1px solid #10b981",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: "#55ff55", fontWeight: 900, fontSize: 18, fontFamily: "monospace", textShadow: "1px 1px #000" }}>
                      XP 30
                    </span>
                    <span style={{ color: "#94a3b8", fontSize: 12 }}>Nivel del Jugador</span>
                  </div>
                  <div style={{ color: "#facc15", fontWeight: 800, fontSize: 12, fontFamily: "monospace" }}>
                    Costo: 15 Niveles (Pago Único y Permanente)
                  </div>
                </div>
              </div>
            )}

            {/* GUI REAL DE RECETA 3x3 EN MESA MEJORADA */}
            {currentScene.diagram === "recipe_gui" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <ChestGui
                  title="Receta: Enhanced Crafting Table"
                  rows={3}
                  slots={recipeGuiSlots}
                  slotSize={48}
                />
                <div
                  style={{
                    backgroundColor: "rgba(10, 15, 28, 0.8)",
                    border: "1px solid rgba(56, 189, 248, 0.3)",
                    borderRadius: 8,
                    padding: "8px 12px",
                    fontFamily: "monospace",
                    fontSize: 12,
                    color: "#93c5fd",
                  }}
                >
                  🛠️ Coloca los materiales en el dispensador inferior y haz clic derecho sobre la mesa de trabajo superior.
                </div>
              </div>
            )}

            {/* HUD de Comandos Iniciales de Supervivencia */}
            {currentScene.diagram === "commands_hud" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10, backgroundColor: "rgba(0,0,0,0.65)", padding: 14, borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)" }}>
                <div style={{ fontFamily: "monospace", fontSize: 13, color: "#34d399", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: 6 }}>
                  <span style={{ color: "#facc15", fontWeight: 800 }}>/rtp</span> ➔ Teletransporte seguro a coordenadas aleatorias del mundo salvaje
                </div>
                <div style={{ fontFamily: "monospace", fontSize: 13, color: "#38bdf8", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: 6 }}>
                  <span style={{ color: "#facc15", fontWeight: 800 }}>/sethome &lt;nombre&gt;</span> ➔ Fija el punto exacto de tu base permanente
                </div>
                <div style={{ fontFamily: "monospace", fontSize: 13, color: "#c084fc", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: 6 }}>
                  <span style={{ color: "#facc15", fontWeight: 800 }}>/home &lt;nombre&gt;</span> ➔ Regresa de inmediato a tu base sin riesgo
                </div>
                <div style={{ fontFamily: "monospace", fontSize: 13, color: "#4ade80" }}>
                  <span style={{ color: "#facc15", fontWeight: 800 }}>/sf guide</span> ➔ Abre la guía interactiva directamente en tu inventario
                </div>
              </div>
            )}

            {/* HUD de ProtectionStones (/ps) */}
            {currentScene.diagram === "protection_zone" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10, backgroundColor: "rgba(0,0,0,0.65)", padding: 14, borderRadius: 10, border: "1px solid rgba(56, 189, 248, 0.3)" }}>
                <div style={{ color: "#38bdf8", fontWeight: 900, fontSize: 15, letterSpacing: 1 }}>
                  PROTECTION STONES (/PS) · BLINDAJE DE BASE
                </div>
                <div style={{ color: "#e2e8f0", fontSize: 13, lineHeight: 1.5 }}>
                  Coloca tu bloque de protección en el suelo para reclamar un cubo de 32x32 bloques. Nadie podrá abrir tus cofres, romper máquinas ni robar energía.
                </div>
                <div style={{ fontFamily: "monospace", color: "#facc15", fontSize: 12, backgroundColor: "rgba(255,255,255,0.05)", padding: "6px 10px", borderRadius: 6 }}>
                  /ps add &lt;amigo&gt; · /ps view (ver límites) · /ps unhide
                </div>
              </div>
            )}

            {/* HUD de Warps Comunitarios y Granjas XP (/pwarp xp) */}
            {currentScene.diagram === "pwarp_menu" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10, backgroundColor: "rgba(0,0,0,0.65)", padding: 14, borderRadius: 10, border: "1px solid rgba(250, 204, 21, 0.3)" }}>
                <div style={{ color: "#facc15", fontWeight: 900, fontSize: 15, letterSpacing: 1 }}>
                  WARPS COMUNITARIOS (/PWARP XP)
                </div>
                <div style={{ color: "#e2e8f0", fontSize: 13, lineHeight: 1.5 }}>
                  ¿Necesitas experiencia para desbloquear máquinas? Usa <span style={{ color: "#facc15", fontWeight: 800 }}>/pwarp xp</span> para teletransportarte a granjas públicas optimizadas y subir a nivel 30 en 2 minutos sin coste.
                </div>
                <div style={{ fontFamily: "monospace", color: "#34d399", fontSize: 12, backgroundColor: "rgba(255,255,255,0.05)", padding: "6px 10px", borderRadius: 6 }}>
                  /pwarp xp · /pwarp tienda · /pwarp granja
                </div>
              </div>
            )}

            {/* Escenas de Multibloques e Instrucciones de Construcción */}
            {!["modalidades_menu", "guide_categories", "research_tree", "recipe_gui", "commands_hud", "protection_zone", "pwarp_menu"].includes(currentScene.diagram) && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ color: "#34d399", fontWeight: 800, fontSize: 15, letterSpacing: 1 }}>
                  INSTRUCCIÓN DE CONSTRUCCIÓN EN EL MUNDO REAL
                </div>
                <div style={{ color: "#cbd5e1", fontSize: 13.5, lineHeight: 1.6 }}>
                  {currentScene.text}
                </div>
                <div
                  style={{
                    backgroundColor: "rgba(16, 185, 129, 0.12)",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                    borderRadius: 8,
                    padding: "8px 12px",
                    color: "#34d399",
                    fontFamily: "monospace",
                    fontSize: 12,
                    fontWeight: 800,
                  }}
                >
                  💡 REGLA DE ORO: Coloca los ingredientes dentro del dispensador y haz clic derecho en el bloque principal.
                </div>
              </div>
            )}
          </div>

          <div style={{ color: "#6ee7b7", fontSize: 13, fontWeight: 700, borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 10 }}>
            "En DrakesCraft, el verdadero progreso industrial se construye bloque a bloque."
          </div>
        </div>

        {/* Columna Derecha: Escena 3D con Steve a escala reducida (0.58) y Multibloque con Texturas Reales */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(15, 23, 42, 0.45)",
            border: "1.5px solid rgba(16, 185, 129, 0.25)",
            borderRadius: 18,
            overflow: "hidden",
          }}
        >
          <ThreeCanvas
            width={520}
            height={460}
            camera={{ position: [0, 0.72, 4.2], fov: 36 }}
            style={{ background: "transparent" }}
          >
            <ambientLight intensity={1.35} />
            <directionalLight position={[4, 6, 4]} intensity={1.8} color="#ffffff" />
            <pointLight position={[-3, 2, 2]} color="#10b981" intensity={2.4} distance={8} />
            <pointLight position={[3, -1, 1]} color="#f59e0b" intensity={1.6} distance={6} />

            {/* Pedestal tech circular flotante */}
            <mesh position={[0, -0.92, 0]}>
              <cylinderGeometry args={[1.5, 1.7, 0.18, 32]} />
              <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.8} />
            </mesh>
            <mesh position={[0, -0.82, 0]}>
              <cylinderGeometry args={[1.45, 1.45, 0.02, 32]} />
              <meshBasicMaterial color="#10b981" />
            </mesh>

            {/* Steve3D a la izquierda con escala 0.58: cabeza segura con >50% de margen superior */}
            <group position={[-0.45, -0.15, 0]}>
              <Steve3D
                position={pos}
                rotation={rot}
                action={action}
                scale={0.58}
                skinFolder="skins_parts/skin_01_parts"
              />
            </group>

            {/* Multibloque 3D a la derecha con TEXTURAS REALES de Minecraft */}
            <group position={[0.62, 0.0, 0.2]}>
              <TexturedMultiblock3D type={multiblockType} frame={frame} />
            </group>
          </ThreeCanvas>
        </div>
      </div>

      {/* Subtítulos Dinámicos e Indicador de Progreso */}
      <div
        style={{
          position: "absolute",
          bottom: 24,
          left: 40,
          right: 40,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 50,
        }}
      >
        <div style={{ maxWidth: 860 }}>
          <Captions words={captionWords} currentTime={frame / 30} />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              backgroundColor: "rgba(15, 23, 42, 0.9)",
              border: "1.5px solid #10b981",
              borderRadius: 20,
              padding: "6px 16px",
              color: "#34d399",
              fontWeight: 900,
              fontSize: 13,
              fontFamily: "monospace",
            }}
          >
            PARTE {sceneIndex + 1} / {SCENES_SF1.length}
          </div>
        </div>
      </div>

      {/* Pistas de Audio sincronizadas por escena */}
      {SCENE_RANGES_SF1.map((sc: any) => (
        <Sequence
          key={sc.id}
          from={sc.startFrame}
          durationInFrames={sc.durationFrames}
        >
          <Audio src={staticFile(`audio/${sc.audio_file}`)} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
