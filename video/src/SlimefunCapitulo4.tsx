import React, { useMemo } from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { T } from "./std/theme";
import { Steve3D, SteveAction } from "./std/Steve3D";
import { Captions } from "./std/Captions";
import { ThreeCanvas } from "@remotion/three";
import storyboardData from "./sf-capitulo4-storyboard.json";
import skinRotation from "./skin_rotation.json";

export const SCENES_SF4 = storyboardData.scenes;

let accFramesSF4 = 0;
export const SCENE_RANGES_SF4 = SCENES_SF4.map((sec: any) => {
  const durationFrames = Math.round(sec.duration * 30);
  const start = accFramesSF4;
  accFramesSF4 += durationFrames;
  return {
    ...sec,
    startFrame: start,
    durationFrames,
    endFrame: accFramesSF4,
  };
});

export const TOTAL_SF_CAPITULO4_FRAMES = accFramesSF4 + 90; // ~5,380 frames (~3.0 min)

// Maquinaria 3D y Nodos de Transporte (Cargo Management)
const Cargo3D: React.FC<{ type: string; frame: number }> = ({ type, frame }) => {
  const rotY = frame * 0.02;

  return (
    <group rotation={[0.2, rotY, 0]}>
      {type === "cargo_manager" && (
        <group position={[0, -0.3, 0]}>
          {/* Base del Cargo Manager */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1.2, 0.5, 1.2]} />
            <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.9} />
          </mesh>
          {/* Núcleo de datos central holográfico */}
          <mesh position={[0, 0.7, 0]} rotation={[frame * 0.04, frame * 0.03, 0]}>
            <octahedronGeometry args={[0.45, 0]} />
            <meshStandardMaterial color="#06b6d4" emissive="#0284c7" emissiveIntensity={0.8} wireframe />
          </mesh>
          {/* Anillos de bus de datos orbitando */}
          <mesh position={[0, 0.7, 0]} rotation={[Math.PI / 4, frame * 0.05, 0]}>
            <torusGeometry args={[0.75, 0.03, 8, 32]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
        </group>
      )}

      {type === "input_output_nodes" && (
        <group position={[0, -0.3, 0]}>
          {/* Cofre origen */}
          <mesh position={[-0.8, 0, 0]}>
            <boxGeometry args={[0.7, 0.7, 0.7]} />
            <meshStandardMaterial color="#78350f" roughness={0.7} />
          </mesh>
          {/* Input Node (Cyan/Verde) */}
          <mesh position={[-0.35, 0, 0]}>
            <boxGeometry args={[0.2, 0.35, 0.35]} />
            <meshStandardMaterial color="#22c55e" emissive="#16a34a" emissiveIntensity={0.6} />
          </mesh>
          {/* Cable de red */}
          <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.06, 0.06, 0.6, 8]} />
            <meshStandardMaterial color="#334155" metalness={0.8} />
          </mesh>
          {/* Output Node (Naranja/Rojo) */}
          <mesh position={[0.35, 0, 0]}>
            <boxGeometry args={[0.2, 0.35, 0.35]} />
            <meshStandardMaterial color="#f97316" emissive="#ea580c" emissiveIntensity={0.6} />
          </mesh>
          {/* Cofre destino */}
          <mesh position={[0.8, 0, 0]}>
            <boxGeometry args={[0.7, 0.7, 0.7]} />
            <meshStandardMaterial color="#78350f" roughness={0.7} />
          </mesh>
        </group>
      )}

      {type === "frequency_channels" && (
        <group position={[0, -0.2, 0]}>
          {/* Panel de matriz de 16 frecuencias (4x4) */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1.5, 1.5, 0.15]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
          </mesh>
          {/* 16 LEDs de colores */}
          {[-0.45, -0.15, 0.15, 0.45].map((gx, ix) =>
            [-0.45, -0.15, 0.15, 0.45].map((gy, iy) => {
              const active = (ix + iy * 4) === (Math.floor(frame / 20) % 16);
              return (
                <mesh key={`${ix}-${iy}`} position={[gx, gy, 0.1]}>
                  <sphereGeometry args={[0.08, 12, 12]} />
                  <meshBasicMaterial color={active ? "#38bdf8" : "#475569"} />
                </mesh>
              );
            })
          )}
        </group>
      )}

      {type === "filters_roundrobin" && (
        <group position={[0, -0.2, 0]}>
          {/* Filtro inteligente central */}
          <mesh position={[0, 0.4, 0]}>
            <boxGeometry args={[0.6, 0.6, 0.6]} />
            <meshStandardMaterial color="#6366f1" metalness={0.6} />
          </mesh>
          {/* Tres vías de salida balanceadas */}
          {[-0.6, 0, 0.6].map((x, i) => (
            <group key={i} position={[x, -0.4, 0]}>
              <mesh position={[0, 0.2, 0]}>
                <cylinderGeometry args={[0.05, 0.05, 0.4, 8]} />
                <meshStandardMaterial color="#94a3b8" />
              </mesh>
              <mesh position={[0, -0.1, 0]}>
                <boxGeometry args={[0.4, 0.4, 0.4]} />
                <meshStandardMaterial color="#0f172a" />
              </mesh>
            </group>
          ))}
        </group>
      )}

      {(!["cargo_manager", "input_output_nodes", "frequency_channels", "filters_roundrobin"].includes(type)) && (
        <group position={[0, 0, 0]}>
          <mesh>
            <dodecahedronGeometry args={[0.8, 0]} />
            <meshStandardMaterial color="#38bdf8" wireframe />
          </mesh>
        </group>
      )}
    </group>
  );
};

export const SlimefunCapitulo4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const currentSec = useMemo(() => {
    for (const s of SCENE_RANGES_SF4) {
      if (frame >= s.startFrame && frame < s.endFrame) {
        return s;
      }
    }
    return SCENE_RANGES_SF4[SCENE_RANGES_SF4.length - 1];
  }, [frame]);

  const sceneProgress = Math.min(
    1,
    Math.max(0, (frame - currentSec.startFrame) / Math.max(1, currentSec.durationFrames))
  );

  const activeSkin = skinRotation.capitulo4 || "Jack_Tech_Glow";

  return (
    <AbsoluteFill style={{ backgroundColor: "#060913", fontFamily: T.fontMono, color: "#fff", overflow: "hidden" }}>
      {/* Pistas de Audio Secuenciales */}
      {SCENE_RANGES_SF4.map((sec: any) => (
        <Sequence key={sec.id} from={sec.startFrame} durationInFrames={sec.durationFrames}>
          <Audio src={staticFile(`audio/${sec.audio_file}`)} />
        </Sequence>
      ))}

      {/* Fondo Holográfico de Redes de Transporte */}
      <AbsoluteFill style={{ opacity: 0.15, pointerEvents: "none" }}>
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundImage: "radial-gradient(#38bdf8 1px, transparent 1px), radial-gradient(#6366f1 1px, #060913 1px)",
            backgroundSize: "32px 32px",
            backgroundPosition: "0 0, 16px 16px",
          }}
        />
      </AbsoluteFill>

      {/* Header Corporativo SRE / DrakesCraft */}
      <div
        style={{
          position: "absolute",
          top: 24,
          left: 40,
          right: 40,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(56, 189, 248, 0.25)",
          paddingBottom: 12,
          zIndex: 40,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              background: "linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)",
              color: "#000",
              fontWeight: 900,
              fontSize: 13,
              padding: "4px 10px",
              borderRadius: 4,
              letterSpacing: "0.1em",
            }}
          >
            DRAKES-SF4
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#e0f2fe", letterSpacing: "0.05em" }}>
              SLIMEFUN MASTERCLASS — CAPÍTULO 4
            </div>
            <div style={{ fontSize: 11, color: "#9ca3af" }}>
              Logística Inteligente, Cargo Management & Optimización Anti-Lag
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "#38bdf8", fontWeight: 700 }}>
              ZERO ENTITY OVERHEAD
            </div>
            <div style={{ fontSize: 10, color: "#6b7280" }}>
              16 CHANNELS // MEMORY TRANSFERS
            </div>
          </div>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: "#38bdf8",
              boxShadow: "0 0 10px #38bdf8",
            }}
          />
        </div>
      </div>

      {/* Área Principal de Contenido Dividida */}
      <div
        style={{
          position: "absolute",
          top: 86,
          bottom: 120,
          left: 40,
          right: 40,
          display: "flex",
          gap: 28,
          zIndex: 30,
        }}
      >
        {/* Panel Izquierdo: 3D ThreeCanvas con Jack & Modelos de Cargo */}
        <div
          style={{
            flex: "1 1 50%",
            position: "relative",
            background: "radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.08) 0%, rgba(6, 9, 19, 0.8) 100%)",
            borderRadius: 16,
            border: "1px solid rgba(56, 189, 248, 0.3)",
            overflow: "hidden",
          }}
        >
          {/* Badge de la escena */}
          <div
            style={{
              position: "absolute",
              top: 14,
              left: 16,
              background: "rgba(15, 23, 42, 0.85)",
              border: "1px solid rgba(56, 189, 248, 0.4)",
              borderRadius: 6,
              padding: "4px 10px",
              fontSize: 11,
              color: "#38bdf8",
              fontWeight: 700,
              zIndex: 10,
            }}
          >
            {currentSec.badge}
          </div>

          <ThreeCanvas
            width={580}
            height={480}
            camera={{ fov: 40, position: [0, 0.9, 4.3] }}
            style={{ width: "100%", height: "100%" }}
          >
            <ambientLight intensity={0.7} />
            <pointLight position={[5, 6, 5]} intensity={1.8} color="#e0f2fe" />
            <pointLight position={[-4, 3, -3]} intensity={1.2} color="#0284c7" />

            {/* Pedestal tecnológico metálico con anillo azul neon */}
            <mesh position={[0, -1.2, 0]}>
              <cylinderGeometry args={[1.5, 1.7, 0.25, 32]} />
              <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh position={[0, -1.06, 0]}>
              <ringGeometry args={[1.2, 1.45, 32]} />
              <meshBasicMaterial color="#38bdf8" />
            </mesh>

            {/* Jack Avatar con skin rotativa */}
            <group position={[-0.85, -1.05, 0]}>
              <Steve3D
                skinUrl={`skins/${activeSkin}.png`}
                action={currentSec.action as SteveAction}
                scale={0.92}
              />
            </group>

            {/* Modelo 3D de Cargo */}
            <group position={[0.85, -0.4, 0]}>
              <Cargo3D type={currentSec.diagram || "cargo_manager"} frame={frame} />
            </group>
          </ThreeCanvas>
        </div>

        {/* Panel Derecho: Telemetría de Logística, Canales y Reglas SRE */}
        <div
          style={{
            flex: "1 1 50%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(12px)",
            borderRadius: 16,
            border: "1px solid rgba(56, 189, 248, 0.2)",
            padding: "24px 28px",
          }}
        >
          <div>
            <div style={{ fontSize: 24, fontWeight: 900, color: "#e0f2fe", letterSpacing: "-0.02em", marginBottom: 6 }}>
              {currentSec.title}
            </div>
            <div style={{ fontSize: 13, color: "#38bdf8", fontWeight: 600, marginBottom: 18 }}>
              {currentSec.subtitle}
            </div>

            {/* Tarjeta de Especificaciones Técnicas */}
            <div
              style={{
                background: "rgba(30, 41, 59, 0.7)",
                borderRadius: 10,
                border: "1px solid rgba(56, 189, 248, 0.25)",
                padding: "14px 16px",
                marginBottom: 16,
              }}
            >
              <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 700, marginBottom: 8, textTransform: "uppercase" }}>
                // PROTOCOLO DE TRANSPORTE
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 14px", fontSize: 12 }}>
                <div>
                  <span style={{ color: "#64748b" }}>TRANSFERENCIA: </span>
                  <span style={{ color: "#38bdf8", fontWeight: 700 }}>Memoria directa (Sin ítems tirados)</span>
                </div>
                <div>
                  <span style={{ color: "#64748b" }}>CANALES: </span>
                  <span style={{ color: "#4ade80", fontWeight: 700 }}>16 Frecuencias Segregadas</span>
                </div>
                <div>
                  <span style={{ color: "#64748b" }}>BALANCEO: </span>
                  <span style={{ color: "#facc15", fontWeight: 700 }}>Round-Robin Equitativo</span>
                </div>
                <div>
                  <span style={{ color: "#64748b" }}>PREVENCIÓN SRE: </span>
                  <span style={{ color: "#f87171", fontWeight: 700 }}>Prohibido bucles cerrados A↔B</span>
                </div>
              </div>
            </div>

            {/* Explicación Operativa */}
            <div
              style={{
                fontSize: 14,
                lineHeight: "1.65",
                color: "#e2e8f0",
                background: "rgba(10, 15, 29, 0.5)",
                borderRadius: 10,
                padding: "16px 18px",
                borderLeft: "4px solid #38bdf8",
              }}
            >
              {currentSec.text}
            </div>
          </div>

          {/* Barra de Progreso de la Escena Actual */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#64748b", marginBottom: 6 }}>
              <span>PROGRESO DE FASE [{currentSec.id}]</span>
              <span>{Math.round(sceneProgress * 100)}%</span>
            </div>
            <div style={{ width: "100%", height: 6, backgroundColor: "rgba(30, 41, 59, 0.8)", borderRadius: 3, overflow: "hidden" }}>
              <div
                style={{
                  width: `${sceneProgress * 100}%`,
                  height: "100%",
                  background: "linear-gradient(90deg, #38bdf8, #0284c7)",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Subtítulos Sincronizados y Footer SRE */}
      <div
        style={{
          position: "absolute",
          bottom: 24,
          left: 40,
          right: 40,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 40,
        }}
      >
        <div style={{ flex: 1, maxWidth: "70%" }}>
          <Captions
            text={currentSec.text}
            frame={frame - currentSec.startFrame}
            words={currentSec.words}
          />
        </div>
        <div
          style={{
            background: "rgba(15, 23, 42, 0.9)",
            border: "1px solid rgba(56, 189, 248, 0.3)",
            borderRadius: 8,
            padding: "8px 16px",
            textAlign: "right",
          }}
        >
          <div style={{ fontSize: 11, color: "#38bdf8", fontWeight: 700 }}>
            SERVIDOR JAVA & BEDROCK
          </div>
          <div style={{ fontSize: 12, color: "#f8fafc", fontWeight: 800 }}>
            play.drakescraft.cl:25565
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
