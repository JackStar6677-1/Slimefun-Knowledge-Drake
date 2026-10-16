import React, { useMemo } from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { T } from "./std/theme";
import { Steve3D, SteveAction } from "./std/Steve3D";
import { Captions } from "./std/Captions";
import { ThreeCanvas } from "@remotion/three";
import storyboardData from "./capitulo3-storyboard.json";
import skinRotation from "./skin_rotation.json";

export const SCENES_C3 = storyboardData.scenes;

let accFrames = 0;
export const SCENE_RANGES_C3 = SCENES_C3.map((sec: any) => {
  const durationFrames = Math.round(sec.duration * 30);
  const start = accFrames;
  accFrames += durationFrames;
  return {
    ...sec,
    startFrame: start,
    durationFrames,
    endFrame: accFrames,
  };
});

export const TOTAL_CAPITULO3_FRAMES = accFrames + 60; // ~4,400 frames (~2.5 min)

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
              backgroundColor: "rgba(56, 189, 248, 0.08)",
              border: "1px dashed rgba(56, 189, 248, 0.3)",
              borderRadius: 8,
              color: "#38bdf8",
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

export const Capitulo3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Encontrar la escena actual activa
  const currentScene = useMemo(() => {
    const found = SCENE_RANGES_C3.find(
      (s) => frame >= s.startFrame && frame < s.endFrame
    );
    return found || SCENE_RANGES_C3[SCENE_RANGES_C3.length - 1];
  }, [frame]);

  // Rotación de skin cada 45 segundos
  const skinList = skinRotation.skins || ["JackStar6677"];
  const currentSkinIndex = Math.floor(frame / (45 * 30)) % skinList.length;
  const currentSkinPart = `skins_parts/${skinList[currentSkinIndex]}`;

  // Palabras para subtítulos
  const captionWords = useMemo(() => {
    if (!currentScene || !currentScene.words) return [];
    return currentScene.words.map((w: any) => ({
      w: w.word,
      t: currentScene.startFrame / 30 + w.start,
      d: w.duration,
    }));
  }, [currentScene]);

  // Posición y rotación de Jack 3D
  const { pos, rot, action } = useMemo(() => {
    return {
      pos: [0, -0.15, 1.3] as [number, number, number],
      rot: [0, Math.sin(frame * 0.03) * 0.2, 0] as [number, number, number],
      action: (currentScene?.action || "idle") as SteveAction,
    };
  }, [frame, currentScene]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#060913", fontFamily: T.font, color: "#ffffff", width: 1280, height: 720 }}>
      {/* Fondo técnico de partículas */}
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
          borderBottom: "1.5px solid rgba(56, 189, 248, 0.25)",
          paddingBottom: 14,
          zIndex: 40,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span
            style={{
              backgroundColor: "#0284c7",
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
          <span style={{ color: "#38bdf8", fontSize: 16, fontWeight: 900, letterSpacing: 1.5 }}>
            CAPÍTULO 3 // ENJAMBRE CENTINELA SAORI
          </span>
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
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
            20.0 TPS · NOMINAL
          </div>
          <div
            style={{
              backgroundColor: "rgba(14, 165, 233, 0.15)",
              border: "1px solid #0ea5e9",
              borderRadius: 14,
              padding: "4px 12px",
              color: "#38bdf8",
              fontWeight: 900,
              fontSize: 14,
            }}
          >
            PORT 25565
          </div>
        </div>
      </div>

      {/* Contenido Principal: Columna Izquierda (Diagramas y Textos) + Columna Derecha (Avatar 3D) */}
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
            border: "1.5px solid rgba(56, 189, 248, 0.35)",
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
            <div style={{ color: "#0ea5e9", fontSize: 13, fontWeight: 900, letterSpacing: 2, marginBottom: 8, fontFamily: "monospace" }}>
              {currentScene.badge}
            </div>
            <div style={{ color: "#ffffff", fontSize: 26, fontWeight: 900, lineHeight: 1.2, marginBottom: 6 }}>
              {currentScene.title}
            </div>
            <div style={{ color: "#94a3b8", fontSize: 16, fontWeight: 600, marginBottom: 20 }}>
              {currentScene.subtitle}
            </div>

            {/* Diagrama SVG Dinámico de la Escena */}
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
              {currentScene.diagram === "sentinel_loop" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "#f87171", fontWeight: 800 }}>MÉTODO COMÚN:</span>
                    <span style={{ color: "#ef4444", fontFamily: "monospace" }}>Reinicio Ciego (Destructivo)</span>
                  </div>
                  <div style={{ height: 2, backgroundColor: "rgba(255,255,255,0.1)" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "#4ade80", fontWeight: 800 }}>MÉTODO SRE DRAKES:</span>
                    <span style={{ color: "#22c55e", fontFamily: "monospace" }}>Thread Dump + Mitigación Caliente</span>
                  </div>
                  <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 8 }}>
                    Telemetría continua de sockets sin degradar el bucle principal de 50 ms.
                  </div>
                </div>
              )}

              {currentScene.diagram === "saori_architecture" && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div style={{ padding: 10, backgroundColor: "rgba(14, 165, 233, 0.15)", borderRadius: 8, border: "1px solid #0284c7" }}>
                    <div style={{ color: "#38bdf8", fontWeight: 800, fontSize: 13 }}>S.A.O.R.I. CORE</div>
                    <div style={{ color: "#cbd5e1", fontSize: 11, marginTop: 4 }}>Server Autonomous Orchestrator</div>
                  </div>
                  <div style={{ padding: 10, backgroundColor: "rgba(34, 197, 94, 0.15)", borderRadius: 8, border: "1px solid #16a34a" }}>
                    <div style={{ color: "#4ade80", fontWeight: 800, fontSize: 13 }}>RESILIENT INFRA</div>
                    <div style={{ color: "#cbd5e1", fontSize: 11, marginTop: 4 }}>Docker Stack + 15 Contenedores</div>
                  </div>
                </div>
              )}

              {currentScene.diagram === "network_socket" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "monospace", fontSize: 13 }}>
                    <span style={{ color: "#94a3b8" }}>Dallas (Game Loop):</span>
                    <span style={{ color: "#38bdf8" }}>play.drakescraft.cl:25565</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "monospace", fontSize: 13 }}>
                    <span style={{ color: "#94a3b8" }}>Socket Heartbeat:</span>
                    <span style={{ color: "#4ade80" }}>1000ms / Tick (sub-3ms RTT)</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "monospace", fontSize: 13 }}>
                    <span style={{ color: "#94a3b8" }}>Jitter Contained:</span>
                    <span style={{ color: "#facc15" }}>{"< 0.45 ms"}</span>
                  </div>
                </div>
              )}

              {currentScene.diagram === "geyser_bridge" && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around" }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ color: "#38bdf8", fontWeight: 900, fontSize: 16 }}>JAVA</div>
                    <div style={{ color: "#94a3b8", fontSize: 11 }}>PC Desktop</div>
                  </div>
                  <div style={{ color: "#f59e0b", fontSize: 22, fontWeight: 900 }}>⇆ [25565] ⇆</div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ color: "#4ade80", fontWeight: 900, fontSize: 16 }}>BEDROCK</div>
                    <div style={{ color: "#94a3b8", fontSize: 11 }}>Mobile & Consoles</div>
                  </div>
                </div>
              )}

              {!["sentinel_loop", "saori_architecture", "network_socket", "geyser_bridge"].includes(currentScene.diagram) && (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ color: "#38bdf8", fontWeight: 800, fontSize: 14 }}>ESTADO DEL ENJAMBRE EN TIEMPO REAL</div>
                  <div style={{ color: "#94a3b8", fontSize: 12 }}>
                    Spark Profiler activo · Monitoreo ZGC Generacional · Sincronización Discord nominal.
                  </div>
                  <div style={{ fontFamily: "monospace", color: "#4ade80", fontSize: 12 }}>
                    STATUS: ALL SERVICES HEALTHY (100% DISPONIBILIDAD)
                  </div>
                </div>
              )}
            </div>
          </div>

          <div style={{ color: "#94a3b8", fontSize: 14, fontStyle: "italic", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 12 }}>
            "La resiliencia no es la ausencia de fallos, sino la capacidad del sistema de mitigarlos antes de que el usuario lo note."
          </div>
        </div>

        {/* Columna Derecha: Escena 3D con JackStar y Entorno de Servidor */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(15, 23, 42, 0.4)",
            border: "1.5px solid rgba(56, 189, 248, 0.2)",
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
            <pointLight position={[-3, 2, 2]} color="#0ea5e9" intensity={2.5} distance={8} />
            <pointLight position={[3, -1, 1]} color="#22c55e" intensity={1.6} distance={6} />

            {/* Pedestal tech flotante */}
            <mesh position={[0, -0.9, 0]}>
              <cylinderGeometry args={[1.4, 1.6, 0.2, 32]} />
              <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.8} />
            </mesh>
            <mesh position={[0, -0.79, 0]}>
              <cylinderGeometry args={[1.35, 1.35, 0.02, 32]} />
              <meshBasicMaterial color="#0ea5e9" />
            </mesh>

            {/* Jack 3D con doble capa */}
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
      {SCENE_RANGES_C3.map((sec: any) => (
        <Sequence key={sec.id} from={sec.startFrame} durationInFrames={sec.durationFrames}>
          <Audio src={staticFile(`audio/${sec.audio_file}`)} volume={1.0} />
        </Sequence>
      ))}
      <Audio src={staticFile("audio/bg_tech_chill.wav")} volume={0.14} loop />
    </AbsoluteFill>
  );
};
