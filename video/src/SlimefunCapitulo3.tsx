import React, { useMemo } from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { T } from "./std/theme";
import { Steve3D, SteveAction } from "./std/Steve3D";
import { Captions } from "./std/Captions";
import { ThreeCanvas } from "@remotion/three";
import storyboardData from "./sf-capitulo3-storyboard.json";
import skinRotation from "./skin_rotation.json";

export const SCENES_SF3 = storyboardData.scenes;

let accFramesSF3 = 0;
export const SCENE_RANGES_SF3 = SCENES_SF3.map((sec: any) => {
  const durationFrames = Math.round(sec.duration * 30);
  const start = accFramesSF3;
  accFramesSF3 += durationFrames;
  return {
    ...sec,
    startFrame: start,
    durationFrames,
    endFrame: accFramesSF3,
  };
});

export const TOTAL_SF_CAPITULO3_FRAMES = accFramesSF3 + 90; // ~5,350 frames (~3.0 min)

// Maquinaria 3D y Aleaciones
const Metallurgy3D: React.FC<{ type: string; frame: number }> = ({ type, frame }) => {
  const rotY = frame * 0.02;

  return (
    <group rotation={[0.2, rotY, 0]}>
      {type === "smeltery" && (
        <group position={[0, -0.4, 0]}>
          {/* Base de Netherrack con fuego */}
          <mesh position={[0, -0.5, 0]}>
            <boxGeometry args={[1.2, 0.4, 1.2]} />
            <meshStandardMaterial color="#450a0a" roughness={0.9} />
          </mesh>
          {/* Fuego inferior estilizado */}
          <mesh position={[0, -0.2, 0]}>
            <coneGeometry args={[0.45, 0.4, 8]} />
            <meshBasicMaterial color="#f97316" />
          </mesh>
          {/* Vallas del Nether refractarias (4 esquinas) */}
          {[[-0.45, -0.45], [0.45, -0.45], [-0.45, 0.45], [0.45, 0.45]].map(([x, z], i) => (
            <mesh key={i} position={[x, 0.2, z]}>
              <cylinderGeometry args={[0.07, 0.07, 0.8, 8]} />
              <meshStandardMaterial color="#2d0a0a" roughness={0.7} />
            </mesh>
          ))}
          {/* Dispensador central superior */}
          <mesh position={[0, 0.7, 0]}>
            <boxGeometry args={[1.0, 0.8, 1.0]} />
            <meshStandardMaterial color="#64748b" roughness={0.4} />
          </mesh>
          {/* Orificio del dispensador con brillo de lava */}
          <mesh position={[0, 0.7, 0.51]}>
            <circleGeometry args={[0.22, 16]} />
            <meshBasicMaterial color="#ef4444" />
          </mesh>
        </group>
      )}

      {type === "armor_forge" && (
        <group position={[0, -0.4, 0]}>
          {/* Dispensador inferior */}
          <mesh position={[0, -0.3, 0]}>
            <boxGeometry args={[1.1, 0.8, 1.1]} />
            <meshStandardMaterial color="#475569" roughness={0.5} />
          </mesh>
          {/* Yunque superior */}
          <group position={[0, 0.45, 0]}>
            {/* Base yunque */}
            <mesh position={[0, -0.25, 0]}>
              <boxGeometry args={[0.7, 0.15, 0.7]} />
              <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.3} />
            </mesh>
            {/* Cuello yunque */}
            <mesh position={[0, -0.05, 0]}>
              <boxGeometry args={[0.3, 0.25, 0.3]} />
              <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.3} />
            </mesh>
            {/* Cara superior del yunque con cuerno */}
            <mesh position={[0, 0.15, 0]}>
              <boxGeometry args={[1.1, 0.25, 0.5]} />
              <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} />
            </mesh>
          </group>
        </group>
      )}

      {type === "basic_alloys" && (
        <group position={[0, -0.2, 0]}>
          {/* Lingote de Bronce */}
          <mesh position={[-0.5, 0, 0]}>
            <boxGeometry args={[0.8, 0.3, 0.4]} />
            <meshStandardMaterial color="#d97706" metalness={0.85} roughness={0.25} />
          </mesh>
          {/* Lingote de Duraluminio */}
          <mesh position={[0.5, 0, 0]}>
            <boxGeometry args={[0.8, 0.3, 0.4]} />
            <meshStandardMaterial color="#38bdf8" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Lingote de Latón arriba */}
          <mesh position={[0, 0.35, 0]} rotation={[0, Math.PI / 4, 0]}>
            <boxGeometry args={[0.8, 0.3, 0.4]} />
            <meshStandardMaterial color="#eab308" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      )}

      {type === "steel_damascus" && (
        <group position={[0, -0.2, 0]}>
          {/* Lingote de Acero de Damasco ondulado */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1.2, 0.4, 0.6]} />
            <meshStandardMaterial color="#475569" metalness={0.95} roughness={0.15} />
          </mesh>
          {/* Espada / Placa de blindaje táctica */}
          <mesh position={[0, 0.6, 0]} rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[0.1, 1.4, 0.25]} />
            <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>
      )}

      {type === "high_tech_alloys" && (
        <group position={[0, -0.2, 0]}>
          {/* Lingote de Redstone Alloy pulsante */}
          <mesh position={[-0.6, 0, 0]}>
            <boxGeometry args={[0.9, 0.35, 0.45]} />
            <meshStandardMaterial color="#dc2626" emissive="#991b1b" emissiveIntensity={0.5 + Math.sin(frame * 0.1) * 0.4} metalness={0.7} />
          </mesh>
          {/* Aleación Reforzada de Grado Nuclear */}
          <mesh position={[0.6, 0, 0]}>
            <boxGeometry args={[0.9, 0.35, 0.45]} />
            <meshStandardMaterial color="#1e293b" metalness={0.95} roughness={0.1} />
          </mesh>
          {/* Núcleo de energía flotante */}
          <mesh position={[0, 0.6, 0]} rotation={[frame * 0.05, frame * 0.05, 0]}>
            <octahedronGeometry args={[0.35, 0]} />
            <meshBasicMaterial color="#a855f7" wireframe />
          </mesh>
        </group>
      )}

      {type === "efficiency_pipeline" && (
        <group position={[0, -0.3, 0]}>
          {/* Triturador de minerales */}
          <mesh position={[-0.7, 0, 0]}>
            <boxGeometry args={[0.8, 0.9, 0.8]} />
            <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
          </mesh>
          {/* Flecha transportadora */}
          <mesh position={[0, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
            <coneGeometry args={[0.2, 0.5, 12]} />
            <meshBasicMaterial color="#22c55e" />
          </mesh>
          {/* Fundidor conectado */}
          <mesh position={[0.7, 0, 0]}>
            <boxGeometry args={[0.8, 0.9, 0.8]} />
            <meshStandardMaterial color="#ef4444" roughness={0.5} />
          </mesh>
        </group>
      )}

      {(!["smeltery", "armor_forge", "basic_alloys", "steel_damascus", "high_tech_alloys", "efficiency_pipeline"].includes(type)) && (
        <group position={[0, 0, 0]}>
          <mesh>
            <octahedronGeometry args={[0.9, 0]} />
            <meshStandardMaterial color="#06b6d4" wireframe />
          </mesh>
        </group>
      )}
    </group>
  );
};

export const SlimefunCapitulo3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const currentSec = useMemo(() => {
    for (const s of SCENE_RANGES_SF3) {
      if (frame >= s.startFrame && frame < s.endFrame) {
        return s;
      }
    }
    return SCENE_RANGES_SF3[SCENE_RANGES_SF3.length - 1];
  }, [frame]);

  const sceneProgress = Math.min(
    1,
    Math.max(0, (frame - currentSec.startFrame) / Math.max(1, currentSec.durationFrames))
  );

  const activeSkin = skinRotation.capitulo3 || "Jack_Tech_Glow";

  return (
    <AbsoluteFill style={{ backgroundColor: "#060913", fontFamily: T.fontMono, color: "#fff", overflow: "hidden" }}>
      {/* Pistas de Audio Secuenciales */}
      {SCENE_RANGES_SF3.map((sec: any) => (
        <Sequence key={sec.id} from={sec.startFrame} durationInFrames={sec.durationFrames}>
          <Audio src={staticFile(`audio/${sec.audio_file}`)} />
        </Sequence>
      ))}

      {/* Fondo Holográfico de Laboratorio Metalúrgico */}
      <AbsoluteFill style={{ opacity: 0.15, pointerEvents: "none" }}>
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundImage: "radial-gradient(#f97316 1px, transparent 1px), radial-gradient(#ef4444 1px, #060913 1px)",
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
          borderBottom: "1px solid rgba(249, 115, 22, 0.25)",
          paddingBottom: 12,
          zIndex: 40,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
              color: "#000",
              fontWeight: 900,
              fontSize: 13,
              padding: "4px 10px",
              borderRadius: 4,
              letterSpacing: "0.1em",
            }}
          >
            DRAKES-SF3
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fed7aa", letterSpacing: "0.05em" }}>
              SLIMEFUN MASTERCLASS — CAPÍTULO 3
            </div>
            <div style={{ fontSize: 11, color: "#9ca3af" }}>
              Metalurgia Avanzada, Aleaciones Industriales & Forja de Blindajes
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "#f97316", fontWeight: 700 }}>
              PYROMETALLURGY ACTIVE
            </div>
            <div style={{ fontSize: 10, color: "#6b7280" }}>
              SMELTERY // ARMOR FORGE // METALS
            </div>
          </div>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: "#f97316",
              boxShadow: "0 0 10px #f97316",
            }}
          />
        </div>
      </div>

      {/* Área Principal de Contenido Dividida: 3D Studio & Panel de Ingeniería */}
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
        {/* Panel Izquierdo: 3D ThreeCanvas con Jack Steve & Modelos de Metalurgia */}
        <div
          style={{
            flex: "1 1 50%",
            position: "relative",
            background: "radial-gradient(circle at 50% 50%, rgba(249, 115, 22, 0.08) 0%, rgba(6, 9, 19, 0.8) 100%)",
            borderRadius: 16,
            border: "1px solid rgba(249, 115, 22, 0.3)",
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
              border: "1px solid rgba(249, 115, 22, 0.4)",
              borderRadius: 6,
              padding: "4px 10px",
              fontSize: 11,
              color: "#fb923c",
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
            <pointLight position={[5, 6, 5]} intensity={1.8} color="#fed7aa" />
            <pointLight position={[-4, 3, -3]} intensity={1.2} color="#f97316" />

            {/* Pedestal tecnológico metálico con brillo de fundición */}
            <mesh position={[0, -1.2, 0]}>
              <cylinderGeometry args={[1.5, 1.7, 0.25, 32]} />
              <meshStandardMaterial color="#1c1917" metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh position={[0, -1.06, 0]}>
              <ringGeometry args={[1.2, 1.45, 32]} />
              <meshBasicMaterial color="#f97316" />
            </mesh>

            {/* Jack Avatar con skin rotativa */}
            <group position={[-0.85, -1.05, 0]}>
              <Steve3D
                skinUrl={`skins/${activeSkin}.png`}
                action={currentSec.action as SteveAction}
                scale={0.92}
              />
            </group>

            {/* Modelo 3D de Metalurgia / Smeltery / Aleaciones */}
            <group position={[0.85, -0.4, 0]}>
              <Metallurgy3D type={currentSec.diagram || "smeltery"} frame={frame} />
            </group>
          </ThreeCanvas>
        </div>

        {/* Panel Derecho: Telemetría de Ingeniería, Crafteos y Buenas Prácticas */}
        <div
          style={{
            flex: "1 1 50%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(12px)",
            borderRadius: 16,
            border: "1px solid rgba(249, 115, 22, 0.2)",
            padding: "24px 28px",
          }}
        >
          <div>
            <div style={{ fontSize: 24, fontWeight: 900, color: "#fed7aa", letterSpacing: "-0.02em", marginBottom: 6 }}>
              {currentSec.title}
            </div>
            <div style={{ fontSize: 13, color: "#fb923c", fontWeight: 600, marginBottom: 18 }}>
              {currentSec.subtitle}
            </div>

            {/* Tarjeta de Especificaciones Técnicas */}
            <div
              style={{
                background: "rgba(30, 41, 59, 0.7)",
                borderRadius: 10,
                border: "1px solid rgba(249, 115, 22, 0.25)",
                padding: "14px 16px",
                marginBottom: 16,
              }}
            >
              <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 700, marginBottom: 8, textTransform: "uppercase" }}>
                // ESPECIFICACIONES DE METALURGIA
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 14px", fontSize: 12 }}>
                <div>
                  <span style={{ color: "#64748b" }}>MÁQUINA: </span>
                  <span style={{ color: "#fb923c", fontWeight: 700 }}>
                    {currentSec.diagram === "smeltery" ? "Smeltery (Multibloque)" :
                     currentSec.diagram === "armor_forge" ? "Armor Forge" :
                     currentSec.diagram === "basic_alloys" ? "Fundidor Combinado" :
                     currentSec.diagram === "steel_damascus" ? "Refinado de Damasco" :
                     currentSec.diagram === "high_tech_alloys" ? "Sintetizador Nuclear" : "Circuito de Molienda"}
                  </span>
                </div>
                <div>
                  <span style={{ color: "#64748b" }}>CALOR REQUERIDO: </span>
                  <span style={{ color: "#f87171", fontWeight: 700 }}>Lava / Netherrack</span>
                </div>
                <div>
                  <span style={{ color: "#64748b" }}>POLVOS REQUERIDOS: </span>
                  <span style={{ color: "#fde047", fontWeight: 700 }}>Cobre, Estaño, Aluminio, Zinc</span>
                </div>
                <div>
                  <span style={{ color: "#64748b" }}>DUPLICACIÓN SRE: </span>
                  <span style={{ color: "#4ade80", fontWeight: 700 }}>2x Polvo con Ore Crusher</span>
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
                borderLeft: "4px solid #f97316",
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
                  background: "linear-gradient(90deg, #f97316, #ea580c)",
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
            border: "1px solid rgba(249, 115, 22, 0.3)",
            borderRadius: 8,
            padding: "8px 16px",
            textAlign: "right",
          }}
        >
          <div style={{ fontSize: 11, color: "#fb923c", fontWeight: 700 }}>
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
