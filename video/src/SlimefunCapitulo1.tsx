import React, { useMemo } from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { T } from "./std/theme";
import { Steve3D, SteveAction } from "./std/Steve3D";
import { Captions } from "./std/Captions";
import { ThreeCanvas } from "@remotion/three";
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

// Multibloques 3D de Slimefun
const MultiblockViewer3D: React.FC<{ type: string; frame: number }> = ({ type, frame }) => {
  const rotY = frame * 0.02;

  return (
    <group rotation={[0.2, rotY, 0]}>
      {type === "enhanced_crafting_table" && (
        <group position={[0, -0.4, 0]}>
          {/* Dispensador inferior */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#64748b" roughness={0.7} />
          </mesh>
          {/* Orificio del dispensador */}
          <mesh position={[0, 0, 0.51]}>
            <circleGeometry args={[0.22, 16]} />
            <meshBasicMaterial color="#0f172a" />
          </mesh>
          {/* Mesa de crafteo superior */}
          <mesh position={[0, 1.05, 0]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#b45309" roughness={0.6} />
          </mesh>
        </group>
      )}

      {type === "grind_stone" && (
        <group position={[0, -0.4, 0]}>
          {/* Dispensador inferior */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#64748b" roughness={0.7} />
          </mesh>
          {/* Valla de roble superior */}
          <mesh position={[0, 0.9, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 0.8, 12]} />
            <meshStandardMaterial color="#d97706" roughness={0.7} />
          </mesh>
        </group>
      )}

      {type === "armor_forge" && (
        <group position={[0, -0.4, 0]}>
          {/* Dispensador inferior */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#64748b" roughness={0.7} />
          </mesh>
          {/* Yunque superior */}
          <mesh position={[0, 0.85, 0]}>
            <boxGeometry args={[0.8, 0.7, 0.5]} />
            <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
          </mesh>
        </group>
      )}

      {type === "ore_crusher" && (
        <group position={[0, -0.4, 0]}>
          {/* Dispensador inferior */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#64748b" roughness={0.7} />
          </mesh>
          {/* Valla del Nether central */}
          <mesh position={[0, 0.9, 0]}>
            <cylinderGeometry args={[0.18, 0.18, 0.8, 12]} />
            <meshStandardMaterial color="#450a0a" roughness={0.6} />
          </mesh>
          {/* 2 Barrotes laterales de hierro */}
          <mesh position={[-0.55, 0.9, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.8, 8]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.9} />
          </mesh>
          <mesh position={[0.55, 0.9, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.8, 8]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.9} />
          </mesh>
        </group>
      )}

      {type === "smeltery" && (
        <group position={[0, -0.6, 0]}>
          {/* Fuego base */}
          <mesh position={[0, -0.45, 0]}>
            <coneGeometry args={[0.4, 0.5, 12]} />
            <meshBasicMaterial color="#f97316" />
          </mesh>
          {/* Caldero sobre fuego */}
          <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.55, 0.5, 0.8, 16]} />
            <meshStandardMaterial color="#1e293b" metalness={0.7} />
          </mesh>
          {/* Valla del Nether intermedia */}
          <mesh position={[0, 1.05, 0]}>
            <cylinderGeometry args={[0.16, 0.16, 0.7, 12]} />
            <meshStandardMaterial color="#450a0a" />
          </mesh>
          {/* Dispensador superior mirando abajo */}
          <mesh position={[0, 1.85, 0]}>
            <boxGeometry args={[0.9, 0.9, 0.9]} />
            <meshStandardMaterial color="#64748b" roughness={0.7} />
          </mesh>
        </group>
      )}

      {!["enhanced_crafting_table", "grind_stone", "armor_forge", "ore_crusher", "smeltery"].includes(type) && (
        <group position={[0, 0, 0]}>
          {/* Bloque genérico de máquina tecnológica */}
          <mesh>
            <boxGeometry args={[1.2, 1.2, 1.2]} />
            <meshStandardMaterial color="#10b981" metalness={0.6} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0, 0.62]}>
            <boxGeometry args={[0.8, 0.8, 0.04]} />
            <meshBasicMaterial color="#34d399" />
          </mesh>
        </group>
      )}
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

  const { pos, rot, action } = useMemo(() => {
    return {
      pos: [-0.4, -0.15, 1.3] as [number, number, number],
      rot: [0, 0.2 + Math.sin(frame * 0.03) * 0.15, 0] as [number, number, number],
      action: (currentScene?.action || "idle") as SteveAction,
    };
  }, [frame, currentScene]);

  // Determinar si la escena muestra un multibloque 3D específico
  const multiblockType = useMemo(() => {
    if (currentScene.diagram === "enhanced_crafting_table") return "enhanced_crafting_table";
    if (currentScene.diagram === "grind_stone") return "grind_stone";
    if (currentScene.diagram === "armor_forge") return "armor_forge";
    if (currentScene.diagram === "ore_crusher") return "ore_crusher";
    if (currentScene.diagram === "smeltery") return "smeltery";
    return "generic";
  }, [currentScene]);

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
            backgroundColor: "rgba(15, 23, 42, 0.88)",
            border: "1.5px solid rgba(16, 185, 129, 0.35)",
            borderRadius: 18,
            padding: "24px 28px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxShadow: "0 15px 40px rgba(0,0,0,0.6)",
            backdropFilter: "blur(14px)",
          }}
        >
          <div>
            <div style={{ color: "#10b981", fontSize: 13, fontWeight: 900, letterSpacing: 2, marginBottom: 8, fontFamily: "monospace" }}>
              {currentScene.badge}
            </div>
            <div style={{ color: "#ffffff", fontSize: 26, fontWeight: 900, lineHeight: 1.2, marginBottom: 6 }}>
              {currentScene.title}
            </div>
            <div style={{ color: "#94a3b8", fontSize: 16, fontWeight: 600, marginBottom: 18 }}>
              {currentScene.subtitle}
            </div>

            {/* Simulación Gráfica de la Interfaz GUI de Minecraft */}
            {currentScene.diagram === "guide_categories" && (
              <div
                style={{
                  backgroundColor: "#c6c6c6",
                  border: "3px solid #373737",
                  borderRadius: 8,
                  padding: 12,
                  display: "grid",
                  gridTemplateColumns: "repeat(5, 1fr)",
                  gap: 8,
                  color: "#222222",
                  fontFamily: "monospace",
                }}
              >
                {["Utilidades", "Armas", "Máquinas", "Energía", "Logística"].map((cat, idx) => (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: "#8b8b8b",
                      border: "2px solid #373737",
                      borderRadius: 4,
                      padding: "8px 4px",
                      textAlign: "center",
                      fontWeight: 800,
                      fontSize: 11,
                      boxShadow: "inset 2px 2px #ffffff, inset -2px -2px #555555",
                      color: "#ffffff",
                    }}
                  >
                    📖 {cat}
                  </div>
                ))}
              </div>
            )}

            {currentScene.diagram === "recipe_gui" && (
              <div
                style={{
                  backgroundColor: "#c6c6c6",
                  border: "3px solid #373737",
                  borderRadius: 8,
                  padding: 14,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  color: "#111111",
                }}
              >
                {/* Matriz 3x3 */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 36px)", gap: 4 }}>
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div
                      key={i}
                      style={{
                        width: 36,
                        height: 36,
                        backgroundColor: "#8b8b8b",
                        boxShadow: "inset 2px 2px #373737, inset -2px -2px #ffffff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                      }}
                    >
                      {i === 4 ? "⚙️" : ""}
                    </div>
                  ))}
                </div>

                <div style={{ fontSize: 24, fontWeight: 900, color: "#373737" }}>➔</div>

                {/* Resultado y Máquina */}
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      width: 50,
                      height: 50,
                      backgroundColor: "#8b8b8b",
                      boxShadow: "inset 2px 2px #373737, inset -2px -2px #ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 22,
                      margin: "0 auto",
                    }}
                  >
                    ⚡
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 900, marginTop: 4, color: "#065f46" }}>
                    Enhanced Table
                  </div>
                </div>
              </div>
            )}

            {currentScene.diagram === "commands_hud" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10, backgroundColor: "rgba(0,0,0,0.5)", padding: 12, borderRadius: 8 }}>
                <div style={{ fontFamily: "monospace", fontSize: 13, color: "#34d399" }}>
                  <span style={{ color: "#facc15" }}>/rtp</span> ➔ Teletransporte aleatorio seguro al mundo salvaje
                </div>
                <div style={{ fontFamily: "monospace", fontSize: 13, color: "#38bdf8" }}>
                  <span style={{ color: "#facc15" }}>/sethome &lt;nombre&gt;</span> ➔ Guarda el punto exacto de tu base
                </div>
                <div style={{ fontFamily: "monospace", fontSize: 13, color: "#c084fc" }}>
                  <span style={{ color: "#facc15" }}>/home</span> ➔ Regresa de inmediato a tu base sin riesgo
                </div>
              </div>
            )}

            {currentScene.diagram === "protection_zone" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8, backgroundColor: "rgba(0,0,0,0.5)", padding: 12, borderRadius: 8 }}>
                <div style={{ color: "#4ade80", fontWeight: 800, fontSize: 14 }}>PROTECTION STONES (/PS)</div>
                <div style={{ color: "#94a3b8", fontSize: 12 }}>
                  Coloca el bloque de protección en el centro de tu base.
                </div>
                <div style={{ fontFamily: "monospace", color: "#38bdf8", fontSize: 12 }}>
                  /ps add &lt;jugador&gt; · /ps view · /ps unhide
                </div>
              </div>
            )}

            {currentScene.diagram === "pwarp_menu" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8, backgroundColor: "rgba(0,0,0,0.5)", padding: 12, borderRadius: 8 }}>
                <div style={{ color: "#facc15", fontWeight: 800, fontSize: 14 }}>WARPS COMUNITARIOS (/PWARP)</div>
                <div style={{ color: "#cbd5e1", fontSize: 12 }}>
                  Usa /pwarp para acceder a granjas de XP automáticas y subir a nivel 30 de forma instantánea.
                </div>
              </div>
            )}

            {!["guide_categories", "recipe_gui", "commands_hud", "protection_zone", "pwarp_menu"].includes(currentScene.diagram) && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ color: "#34d399", fontWeight: 800, fontSize: 15 }}>INSTRUCCIÓN DE FABRICACIÓN</div>
                <div style={{ color: "#cbd5e1", fontSize: 13, lineHeight: 1.5 }}>
                  {currentScene.text}
                </div>
                <div style={{ color: "#38bdf8", fontFamily: "monospace", fontSize: 12, marginTop: 4 }}>
                  CONSTRUCCIÓN EN EL MUNDO REAL // CLIC DERECHO PARA INTERACTUAR
                </div>
              </div>
            )}
          </div>

          <div style={{ color: "#6ee7b7", fontSize: 14, fontWeight: 700, borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 12 }}>
            "Todo gran imperio industrial en Slimefun comienza con un dispensador y una mesa de trabajo."
          </div>
        </div>

        {/* Columna Derecha: Escena 3D con Jack y el Multibloque en rotación */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(15, 23, 42, 0.4)",
            border: "1.5px solid rgba(16, 185, 129, 0.25)",
            borderRadius: 18,
            overflow: "hidden",
          }}
        >
          <ThreeCanvas
            width={520}
            height={460}
            camera={{ position: [0, 1.3, 4.0], fov: 40 }}
            style={{ background: "transparent" }}
          >
            <ambientLight intensity={1.4} />
            <directionalLight position={[4, 6, 4]} intensity={1.8} color="#ffffff" />
            <pointLight position={[-3, 2, 2]} color="#10b981" intensity={2.5} distance={8} />
            <pointLight position={[3, -1, 1]} color="#f59e0b" intensity={1.6} distance={6} />

            {/* Pedestal tech */}
            <mesh position={[0, -0.9, 0]}>
              <cylinderGeometry args={[1.5, 1.7, 0.2, 32]} />
              <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.8} />
            </mesh>
            <mesh position={[0, -0.79, 0]}>
              <cylinderGeometry args={[1.45, 1.45, 0.02, 32]} />
              <meshBasicMaterial color="#10b981" />
            </mesh>

            {/* Jack 3D a la izquierda */}
            <group position={[-0.45, -0.15, 0]}>
              <Steve3D
                position={pos}
                rotation={rot}
                action={action}
                scale={1.1}
                skinPartPath={currentSkinPart}
              />
            </group>

            {/* Multibloque 3D a la derecha */}
            <group position={[0.7, 0.2, 0.4]}>
              <MultiblockViewer3D type={multiblockType} frame={frame} />
            </group>
          </ThreeCanvas>
        </div>
      </div>

      {/* Subtítulos Inferiores */}
      <div
        style={{
          position: "absolute",
          bottom: 24,
          left: 40,
          right: 40,
          minHeight: 80,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 40,
        }}
      >
        <Captions words={captionWords} maxWordsPerLine={8} />
      </div>

      {/* Pistas de Audio */}
      {SCENE_RANGES_SF1.map((sec: any) => (
        <Sequence key={sec.id} from={sec.startFrame} durationInFrames={sec.durationFrames}>
          <Audio src={staticFile(`audio/${sec.audio_file}`)} volume={1.0} />
        </Sequence>
      ))}
      <Audio src={staticFile("audio/bg_tech_chill.wav")} volume={0.14} loop />
    </AbsoluteFill>
  );
};
