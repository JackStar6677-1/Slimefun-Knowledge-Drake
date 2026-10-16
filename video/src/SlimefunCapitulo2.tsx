import React, { useMemo } from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { T } from "./std/theme";
import { Steve3D, SteveAction } from "./std/Steve3D";
import { Captions } from "./std/Captions";
import { ThreeCanvas } from "@remotion/three";
import storyboardData from "./sf-capitulo2-storyboard.json";
import skinRotation from "./skin_rotation.json";
import { StandardMasterclassBackground } from "./std/MasterclassLayout";
import { SatisfyingPhysicsWidget } from "./std/SatisfyingPhysicsWidget";

export const SCENES_SF2 = storyboardData.scenes;

let accFramesSF2 = 0;
export const SCENE_RANGES_SF2 = SCENES_SF2.map((sec: any) => {
  const durationFrames = Math.round(sec.duration * 30);
  const start = accFramesSF2;
  accFramesSF2 += durationFrames;
  return {
    ...sec,
    startFrame: start,
    durationFrames,
    endFrame: accFramesSF2,
  };
});

export const TOTAL_SF_CAPITULO2_FRAMES = accFramesSF2 + 90; // ~6,400 frames (~3.5 min)

// Máquinas 3D de Energía
const EnergyMachine3D: React.FC<{ type: string; frame: number }> = ({ type, frame }) => {
  const rotY = frame * 0.02;

  return (
    <group rotation={[0.2, rotY, 0]}>
      {type === "energy_regulator" && (
        <group position={[0, -0.4, 0]}>
          {/* Base del regulador */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1, 0.4, 1]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Antena central */}
          <mesh position={[0, 0.8, 0]}>
            <cylinderGeometry args={[0.08, 0.12, 1.2, 16]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.9} />
          </mesh>
          {/* Esfera de energía de la antena */}
          <mesh position={[0, 1.45, 0]}>
            <sphereGeometry args={[0.25, 16, 16]} />
            <meshBasicMaterial color="#06b6d4" />
          </mesh>
          {/* Anillos de pulsación */}
          <mesh position={[0, 1.45, 0]} rotation={[frame * 0.04, 0, frame * 0.04]}>
            <torusGeometry args={[0.45, 0.03, 8, 24]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
        </group>
      )}

      {type === "solar_generator" && (
        <group position={[0, -0.3, 0]}>
          {/* Poste de soporte */}
          <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.15, 0.2, 0.8, 12]} />
            <meshStandardMaterial color="#475569" />
          </mesh>
          {/* Panel solar inclinado */}
          <group position={[0, 0.7, 0]} rotation={[-0.4, 0, 0]}>
            <mesh>
              <boxGeometry args={[1.5, 0.08, 1.1]} />
              <meshStandardMaterial color="#1e1b4b" metalness={0.9} roughness={0.1} />
            </mesh>
            {/* Celdas fotovoltaicas */}
            <mesh position={[0, 0.05, 0]}>
              <boxGeometry args={[1.4, 0.02, 1.0]} />
              <meshBasicMaterial color="#38bdf8" />
            </mesh>
          </group>
        </group>
      )}

      {type === "capacitor_banks" && (
        <group position={[0, -0.4, 0]}>
          {/* Bloque de capacitor */}
          <mesh position={[0, 0.3, 0]}>
            <boxGeometry args={[1.1, 1.1, 1.1]} />
            <meshStandardMaterial color="#3b82f6" roughness={0.4} metalness={0.6} />
          </mesh>
          {/* Barra de carga frontal LED */}
          <mesh position={[0, 0.3, 0.56]}>
            <boxGeometry args={[0.8, 0.2, 0.02]} />
            <meshBasicMaterial color="#22c55e" />
          </mesh>
        </group>
      )}

      {type === "thermal_generators" && (
        <group position={[0, -0.4, 0]}>
          {/* Horno generador térmico */}
          <mesh position={[0, 0.3, 0]}>
            <boxGeometry args={[1.1, 1.1, 1.1]} />
            <meshStandardMaterial color="#451a03" roughness={0.6} />
          </mesh>
          {/* Boca de combustión con fuego interno */}
          <mesh position={[0, 0.1, 0.56]}>
            <boxGeometry args={[0.5, 0.5, 0.02]} />
            <meshBasicMaterial color="#ea580c" />
          </mesh>
        </group>
      )}

      {!["energy_regulator", "solar_generator", "capacitor_banks", "thermal_generators"].includes(type) && (
        <group position={[0, 0, 0]}>
          <mesh>
            <boxGeometry args={[1.1, 1.1, 1.1]} />
            <meshStandardMaterial color="#0284c7" roughness={0.3} metalness={0.7} />
          </mesh>
          <mesh position={[0, 0, 0.56]}>
            <boxGeometry args={[0.7, 0.7, 0.02]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
        </group>
      )}
    </group>
  );
};

export const SlimefunCapitulo2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const currentScene = useMemo(() => {
    const found = SCENE_RANGES_SF2.find(
      (s) => frame >= s.startFrame && frame < s.endFrame
    );
    return found || SCENE_RANGES_SF2[SCENE_RANGES_SF2.length - 1];
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

  const machineType = useMemo(() => {
    if (currentScene.diagram === "energy_regulator") return "energy_regulator";
    if (currentScene.diagram === "solar_generator") return "solar_generator";
    if (currentScene.diagram === "capacitor_banks") return "capacitor_banks";
    if (currentScene.diagram === "thermal_generators") return "thermal_generators";
    return "generic";
  }, [currentScene]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#02060a", fontFamily: T.font, color: "#ffffff", width: 1280, height: 720 }}>
      {/* 1. Fondo Animado Estandarizado (Cyber Grid + Slimefun Floating Items + Nebula Glow) */}
      <StandardMasterclassBackground frame={frame} />

      {/* 2. Audio Lo-Fi Continuo de Fondo */}
      <Audio src={staticFile("audio/bg_tech_chill.wav")} volume={0.12} loop />

      {/* 3. Widget de Física Real con Círculos y Bolas (Esquina Superior Derecha) */}
      <div style={{ position: "absolute", top: 12, right: 35, zIndex: 50 }}>
        <SatisfyingPhysicsWidget width={195} height={100} compact={true} />
      </div>

      {/* 4. Header Superior Técnico */}
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 40,
          right: 245,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1.5px solid rgba(245, 158, 11, 0.3)",
          paddingBottom: 12,
          zIndex: 40,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span
            style={{
              backgroundColor: "#d97706",
              color: "#ffffff",
              fontWeight: 900,
              fontSize: 14,
              padding: "4px 12px",
              borderRadius: 6,
              letterSpacing: 1.5,
            }}
          >
            SLIMEFUN GUÍA MAESTRA
          </span>
          <span style={{ color: "#fbbf24", fontSize: 15, fontWeight: 900, letterSpacing: 1 }}>
            CAPÍTULO 2 // REDES ELÉCTRICAS & ENERGÍA
          </span>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div
            style={{
              backgroundColor: "rgba(245, 158, 11, 0.15)",
              border: "1px solid #f59e0b",
              borderRadius: 14,
              padding: "3px 10px",
              color: "#fbbf24",
              fontWeight: 900,
              fontSize: 12,
            }}
          >
            ENERGYNET JOULES
          </div>
          <div
            style={{
              backgroundColor: "rgba(34, 197, 94, 0.15)",
              border: "1px solid #22c55e",
              borderRadius: 14,
              padding: "3px 10px",
              color: "#4ade80",
              fontWeight: 900,
              fontSize: 12,
            }}
          >
            20.0 TPS · ZERO LAG
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
        {/* Columna Izquierda: Panel Explicativo */}
        <div
          style={{
            backgroundColor: "rgba(15, 23, 42, 0.88)",
            border: "1.5px solid rgba(245, 158, 11, 0.35)",
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
            <div style={{ color: "#f59e0b", fontSize: 13, fontWeight: 900, letterSpacing: 2, marginBottom: 8, fontFamily: "monospace" }}>
              {currentScene.badge}
            </div>
            <div style={{ color: "#ffffff", fontSize: 26, fontWeight: 900, lineHeight: 1.2, marginBottom: 6 }}>
              {currentScene.title}
            </div>
            <div style={{ color: "#94a3b8", fontSize: 16, fontWeight: 600, marginBottom: 18 }}>
              {currentScene.subtitle}
            </div>

            {/* Esquema de Red y Métricas de Energía */}
            {currentScene.diagram === "energy_regulator" && (
              <div style={{ backgroundColor: "rgba(0,0,0,0.5)", padding: 14, borderRadius: 10, display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "monospace", fontSize: 13 }}>
                  <span style={{ color: "#38bdf8" }}>Función:</span>
                  <span style={{ color: "#ffffff" }}>Cerebro y Balanceador de Carga</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "monospace", fontSize: 13 }}>
                  <span style={{ color: "#facc15" }}>Radio de Detección:</span>
                  <span style={{ color: "#4ade80" }}>Red contigua en tiempo real</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "monospace", fontSize: 13 }}>
                  <span style={{ color: "#f87171" }}>Regla SRE:</span>
                  <span style={{ color: "#fb7185" }}>1 Regulador por Red (Sin bucles)</span>
                </div>
              </div>
            )}

            {currentScene.diagram === "solar_generator" && (
              <div style={{ backgroundColor: "rgba(0,0,0,0.5)", padding: 14, borderRadius: 10, display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "monospace", fontSize: 13 }}>
                  <span style={{ color: "#38bdf8" }}>Producción Diurna:</span>
                  <span style={{ color: "#4ade80", fontWeight: 800 }}>4 J/s (Continuo)</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "monospace", fontSize: 13 }}>
                  <span style={{ color: "#94a3b8" }}>Producción Nocturna:</span>
                  <span style={{ color: "#f87171" }}>0 J/s (Requiere Baterías)</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "monospace", fontSize: 13 }}>
                  <span style={{ color: "#facc15" }}>Combustible Requerido:</span>
                  <span style={{ color: "#34d399" }}>Gratis (Luz Solar Directa)</span>
                </div>
              </div>
            )}

            {currentScene.diagram === "thermal_generators" && (
              <div style={{ backgroundColor: "rgba(0,0,0,0.5)", padding: 14, borderRadius: 10, display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "monospace", fontSize: 13 }}>
                  <span style={{ color: "#f97316" }}>Generador de Carbón:</span>
                  <span style={{ color: "#4ade80" }}>16 J/s (Carbón / Charcoal)</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "monospace", fontSize: 13 }}>
                  <span style={{ color: "#ef4444" }}>Generador de Lava:</span>
                  <span style={{ color: "#4ade80" }}>24 J/s (Cubos de Lava)</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "monospace", fontSize: 13 }}>
                  <span style={{ color: "#38bdf8" }}>Disponibilidad:</span>
                  <span style={{ color: "#ffffff" }}>24 Horas / Día Continuo</span>
                </div>
              </div>
            )}

            {!["energy_regulator", "solar_generator", "thermal_generators"].includes(currentScene.diagram) && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ color: "#fbbf24", fontWeight: 800, fontSize: 15 }}>ESPECIFICACIÓN ELÉCTRICA</div>
                <div style={{ color: "#cbd5e1", fontSize: 13, lineHeight: 1.5 }}>
                  {currentScene.text}
                </div>
              </div>
            )}
          </div>

          <div style={{ color: "#fcd34d", fontSize: 14, fontWeight: 700, borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 12 }}>
            "La energía no solo acelera tu producción, desbloquea la verdadera automatización industrial."
          </div>
        </div>

        {/* Columna Derecha: Escena 3D */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(15, 23, 42, 0.4)",
            border: "1.5px solid rgba(245, 158, 11, 0.25)",
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
            <pointLight position={[-3, 2, 2]} color="#f59e0b" intensity={2.5} distance={8} />
            <pointLight position={[3, -1, 1]} color="#06b6d4" intensity={1.6} distance={6} />

            {/* Pedestal tech estilizado de Minecraft */}
            <mesh position={[0, -0.92, 0]}>
              <cylinderGeometry args={[1.5, 1.7, 0.2, 32]} />
              <meshStandardMaterial color="#0b131e" roughness={0.3} metalness={0.8} />
            </mesh>
            <mesh position={[0, -0.815, 0]}>
              <cylinderGeometry args={[1.45, 1.45, 0.01, 32]} />
              <meshStandardMaterial color="#111c2a" roughness={0.4} metalness={0.6} />
            </mesh>
            {/* Anillos de neón integrados en el suelo */}
            <mesh position={[0, -0.805, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[1.30, 1.36, 32]} />
              <meshBasicMaterial color="#f59e0b" />
            </mesh>
            <mesh position={[0, -0.805, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.92, 0.96, 32]} />
              <meshBasicMaterial color="#06b6d4" />
            </mesh>

            {/* Jack 3D a la izquierda con escala 0.58: cabeza segura con >50% margen superior */}
            <group position={[-0.45, -0.15, 0]}>
              <Steve3D
                position={pos}
                rotation={rot}
                action={action}
                scale={0.58}
                skinFolder="skins_parts/skin_01_parts"
              />
            </group>

            {/* Máquina 3D a la derecha con base apoyada en Y = -0.81 */}
            <group position={[0.62, -0.41, 0.2]}>
              <EnergyMachine3D type={machineType} frame={frame} />
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
      {SCENE_RANGES_SF2.map((sec: any) => (
        <Sequence key={sec.id} from={sec.startFrame} durationInFrames={sec.durationFrames}>
          <Audio src={staticFile(`audio/${sec.audio_file}`)} volume={1.0} />
        </Sequence>
      ))}
      <Audio src={staticFile("audio/bg_tech_chill.wav")} volume={0.14} loop />
    </AbsoluteFill>
  );
};
