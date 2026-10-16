import React, { useMemo } from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { T } from "./std/theme";
import { Steve3D, SteveAction } from "./std/Steve3D";
import { Captions } from "./std/Captions";
import { ThreeCanvas } from "@remotion/three";
import storyboardData from "./capitulo4-storyboard.json";
import skinRotation from "./skin_rotation.json";

export const SCENES_C4 = storyboardData.scenes;

let accFramesC4 = 0;
export const SCENE_RANGES_C4 = SCENES_C4.map((sec: any) => {
  const durationFrames = Math.round(sec.duration * 30);
  const start = accFramesC4;
  accFramesC4 += durationFrames;
  return {
    ...sec,
    startFrame: start,
    durationFrames,
    endFrame: accFramesC4,
  };
});

export const TOTAL_CAPITULO4_FRAMES = accFramesC4 + 60; // ~4,150 frames (~2.3 min)

// Items de Slimefun flotantes de fondo
const SF_ITEMS = [
  "ENERGY_REGULATOR", "ELECTRIC_SMELTERY", "CARGO_NODE", "NUCLEAR_REACTOR", 
  "RAINBOW_RUNE", "GPS_TRANSMITTER", "ANCIENT_ALTAR", "SOLAR_GENERATOR"
];

const FallingBgItems: React.FC<{ frame: number }> = ({ frame }) => {
  const items = useMemo(() => {
    return Array.from({ length: 10 }).map((_, i) => ({
      id: i,
      x: (i * 130 + 30) % 1240,
      speed: 1.0 + (i % 3) * 0.5,
      rotSpeed: 0.02 + (i % 4) * 0.015,
      size: 34 + (i % 3) * 12,
      opacity: 0.14 + (i % 3) * 0.06,
      name: SF_ITEMS[i % SF_ITEMS.length]
    }));
  }, []);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 5 }}>
      {items.map((it) => {
        const y = ((frame * it.speed + it.id * 140) % 820) - 80;
        const rot = frame * it.rotSpeed * 50;
        return (
          <div
            key={it.id}
            style={{
              position: "absolute",
              left: it.x,
              top: y,
              width: it.size,
              height: it.size,
              opacity: it.opacity,
              transform: `rotate(${rot}deg)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(139, 92, 246, 0.08)",
              border: "1px dashed rgba(139, 92, 246, 0.3)",
              borderRadius: 8,
              color: "#c4b5fd",
              fontFamily: "monospace",
              fontSize: 10,
              fontWeight: 800,
              textAlign: "center",
              padding: 2,
            }}
          >
            {it.name.split("_")[0]}
          </div>
        );
      })}
    </div>
  );
};

export const Capitulo4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const currentScene = useMemo(() => {
    const found = SCENE_RANGES_C4.find(
      (s) => frame >= s.startFrame && frame < s.endFrame
    );
    return found || SCENE_RANGES_C4[SCENE_RANGES_C4.length - 1];
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
      pos: [0, -0.15, 1.3] as [number, number, number],
      rot: [0, Math.sin(frame * 0.03) * 0.2, 0] as [number, number, number],
      action: (currentScene?.action || "idle") as SteveAction,
    };
  }, [frame, currentScene]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#060913", fontFamily: T.font, color: "#ffffff", width: 1280, height: 720 }}>
      <FallingBgItems frame={frame} />

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
          borderBottom: "1.5px solid rgba(139, 92, 246, 0.25)",
          paddingBottom: 14,
          zIndex: 40,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span
            style={{
              backgroundColor: "#7c3aed",
              color: "#ffffff",
              fontWeight: 900,
              fontSize: 15,
              padding: "4px 14px",
              borderRadius: 6,
              letterSpacing: 2,
            }}
          >
            DOCU-SERIE DRAKESCRAFT
          </span>
          <span style={{ color: "#c4b5fd", fontSize: 16, fontWeight: 900, letterSpacing: 1.5 }}>
            CAPÍTULO 4 // CÓDIGO PROPIO & CERO ROLLBACKS
          </span>
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div
            style={{
              backgroundColor: "rgba(168, 85, 247, 0.15)",
              border: "1px solid #a855f7",
              borderRadius: 14,
              padding: "4px 12px",
              color: "#c084fc",
              fontWeight: 900,
              fontSize: 14,
            }}
          >
            MAVEN.DRAKESCRAFT.CL
          </div>
          <div
            style={{
              backgroundColor: "rgba(34, 197, 94, 0.15)",
              border: "1px solid #22c55e",
              borderRadius: 14,
              padding: "4px 12px",
              color: "#4ade80",
              fontWeight: 900,
              fontSize: 14,
            }}
          >
            ZERO DATA LOSS
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
        {/* Columna Izquierda: Tarjeta Técnica */}
        <div
          style={{
            backgroundColor: "rgba(15, 23, 42, 0.85)",
            border: "1.5px solid rgba(139, 92, 246, 0.35)",
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
            <div style={{ color: "#a855f7", fontSize: 13, fontWeight: 900, letterSpacing: 2, marginBottom: 8, fontFamily: "monospace" }}>
              {currentScene.badge}
            </div>
            <div style={{ color: "#ffffff", fontSize: 26, fontWeight: 900, lineHeight: 1.2, marginBottom: 6 }}>
              {currentScene.title}
            </div>
            <div style={{ color: "#94a3b8", fontSize: 16, fontWeight: 600, marginBottom: 20 }}>
              {currentScene.subtitle}
            </div>

            {/* Diagrama SVG Dinámico */}
            <div
              style={{
                width: "100%",
                height: 230,
                backgroundColor: "rgba(2, 6, 23, 0.75)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: 12,
                padding: 16,
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-around",
              }}
            >
              {currentScene.diagram === "maven_pipeline" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "monospace", fontSize: 12 }}>
                    <span style={{ color: "#c084fc" }}>Repo Maven:</span>
                    <span style={{ color: "#ffffff" }}>maven.drakescraft.cl</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "monospace", fontSize: 12 }}>
                    <span style={{ color: "#c084fc" }}>Toolchain:</span>
                    <span style={{ color: "#ffffff" }}>Java 21 LTS · Paper API 1.21.x</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "monospace", fontSize: 12 }}>
                    <span style={{ color: "#c084fc" }}>Auditoría CI/CD:</span>
                    <span style={{ color: "#4ade80" }}>Automated Build & Verify</span>
                  </div>
                </div>
              )}

              {currentScene.diagram === "atomic_buffer" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ color: "#facc15", fontWeight: 800, fontSize: 13 }}>NETWORKS V6: ATOMIC COMMIT LAYER</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12 }}>
                    <div style={{ padding: "6px 12px", backgroundColor: "rgba(239, 68, 68, 0.2)", borderRadius: 6, color: "#f87171" }}>Extracción</div>
                    <span style={{ color: "#94a3b8" }}>➔</span>
                    <div style={{ padding: "6px 12px", backgroundColor: "rgba(59, 130, 246, 0.2)", borderRadius: 6, color: "#60a5fa" }}>Buffer de Verificación</div>
                    <span style={{ color: "#94a3b8" }}>➔</span>
                    <div style={{ padding: "6px 12px", backgroundColor: "rgba(34, 197, 94, 0.2)", borderRadius: 6, color: "#4ade80" }}>Persistencia</div>
                  </div>
                  <div style={{ color: "#4ade80", fontSize: 11, fontFamily: "monospace" }}>
                    ZERO DUPE VERIFIED // RACE CONDITION SOLVED
                  </div>
                </div>
              )}

              {currentScene.diagram === "data_persistence" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "#4ade80", fontWeight: 800 }}>WRITE-AHEAD LOGGING:</span>
                    <span style={{ color: "#ffffff", fontFamily: "monospace" }}>ACTIVO</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "#38bdf8", fontWeight: 800 }}>SNAPSHOTS DE INVENTARIOS:</span>
                    <span style={{ color: "#ffffff", fontFamily: "monospace" }}>CONSISTENTES</span>
                  </div>
                  <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 6 }}>
                    Garantía absoluta para jugadores: cero pérdidas de fábricas, reactores o economía.
                  </div>
                </div>
              )}

              {!["maven_pipeline", "atomic_buffer", "data_persistence"].includes(currentScene.diagram) && (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ color: "#c084fc", fontWeight: 800, fontSize: 14 }}>FIN DE LA SERIE DE SISTEMAS</div>
                  <div style={{ color: "#94a3b8", fontSize: 12 }}>
                    Los cimientos están asegurados. Ahora comienza la maestría en Slimefun.
                  </div>
                  <div style={{ fontFamily: "monospace", color: "#4ade80", fontSize: 12 }}>
                    NEXT: SLIMEFUN MASTERCLASS // EPISODIO 1
                  </div>
                </div>
              )}
            </div>
          </div>

          <div style={{ color: "#94a3b8", fontSize: 14, fontStyle: "italic", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 12 }}>
            "Cuando la infraestructura es sólida como una roca, el jugador puede concentrarse en crear sin temor a perder nada."
          </div>
        </div>

        {/* Columna Derecha: Escena 3D */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(15, 23, 42, 0.4)",
            border: "1.5px solid rgba(139, 92, 246, 0.2)",
            borderRadius: 18,
            overflow: "hidden",
          }}
        >
          <ThreeCanvas
            width={520}
            height={460}
            camera={{ position: [0, 1.4, 4.2], fov: 38 }}
            style={{ background: "transparent" }}
          >
            <ambientLight intensity={1.3} />
            <directionalLight position={[4, 6, 4]} intensity={1.8} color="#ffffff" />
            <pointLight position={[-3, 2, 2]} color="#a855f7" intensity={2.5} distance={8} />
            <pointLight position={[3, -1, 1]} color="#38bdf8" intensity={1.6} distance={6} />

            <mesh position={[0, -0.9, 0]}>
              <cylinderGeometry args={[1.4, 1.6, 0.2, 32]} />
              <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.8} />
            </mesh>
            <mesh position={[0, -0.79, 0]}>
              <cylinderGeometry args={[1.35, 1.35, 0.02, 32]} />
              <meshBasicMaterial color="#a855f7" />
            </mesh>

            <group position={[0, -0.15, 0]}>
              <Steve3D
                position={pos}
                rotation={rot}
                action={action}
                scale={1.15}
                skinPartPath={currentSkinPart}
              />
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
      {SCENE_RANGES_C4.map((sec: any) => (
        <Sequence key={sec.id} from={sec.startFrame} durationInFrames={sec.durationFrames}>
          <Audio src={staticFile(`audio/${sec.audio_file}`)} volume={1.0} />
        </Sequence>
      ))}
      <Audio src={staticFile("audio/bg_tech_chill.wav")} volume={0.14} loop />
    </AbsoluteFill>
  );
};
