import React, { useMemo } from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { T } from "./std/theme";
import { Steve3D, SteveAction } from "./std/Steve3D";
import { Captions } from "./std/Captions";
import { ThreeCanvas } from "@remotion/three";
import storyboardData from "./sf-capitulo7-storyboard.json";
import skinRotation from "./skin_rotation.json";

export const SCENES_SF7 = storyboardData.scenes;

let accFramesSF7 = 0;
export const SCENE_RANGES_SF7 = SCENES_SF7.map((sec: any) => {
  const durationFrames = Math.round(sec.duration * 30);
  const start = accFramesSF7;
  accFramesSF7 += durationFrames;
  return {
    ...sec,
    startFrame: start,
    durationFrames,
    endFrame: accFramesSF7,
  };
});

export const TOTAL_SF_CAPITULO7_FRAMES = accFramesSF7 + 90; // ~6,142 frames (~3.4 min)

// Maquinaria 3D y Componentes de Addons (Infinity Expansion, Fluffy Machines, Redes v6)
const Addons3D: React.FC<{ type: string; frame: number }> = ({ type, frame }) => {
  const rotY = frame * 0.02;

  return (
    <group rotation={[0.2, rotY, 0]}>
      {type === "infinity_intro" && (
        <group position={[0, -0.2, 0]}>
          {/* Núcleo de Singularidad de Infinity Expansion */}
          <mesh position={[0, 0.4, 0]} rotation={[frame * 0.04, frame * 0.03, 0]}>
            <dodecahedronGeometry args={[0.55, 0]} />
            <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.8} wireframe />
          </mesh>
          <mesh position={[0, 0.4, 0]} rotation={[-frame * 0.02, 0, frame * 0.04]}>
            <sphereGeometry args={[0.35, 16, 16]} />
            <meshStandardMaterial color="#f43f5e" emissive="#e11d48" emissiveIntensity={0.7} />
          </mesh>
          {/* Anillos de compresión gravitacional */}
          <mesh position={[0, 0.4, 0]} rotation={[Math.PI / 4, frame * 0.06, 0]}>
            <torusGeometry args={[0.85, 0.03, 8, 32]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
          {/* Base industrial de compresión */}
          <mesh position={[0, -0.6, 0]}>
            <cylinderGeometry args={[1.1, 1.25, 0.35, 16]} />
            <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.9} />
          </mesh>
        </group>
      )}

      {type === "simulation_chamber" && (
        <group position={[0, -0.2, 0]}>
          {/* Base de la Cámara de Simulación de Mobs */}
          <mesh position={[0, -0.6, 0]}>
            <boxGeometry args={[1.3, 0.3, 1.3]} />
            <meshStandardMaterial color="#1e293b" roughness={0.4} metalness={0.8} />
          </mesh>
          {/* Columnas de contención magnética */}
          {[-0.5, 0.5].map((px, ix) =>
            [-0.5, 0.5].map((pz, iz) => (
              <mesh key={`${ix}-${iz}`} position={[px, 0.2, pz]}>
                <boxGeometry args={[0.15, 1.3, 0.15]} />
                <meshStandardMaterial color="#0284c7" metalness={0.9} />
              </mesh>
            ))
          )}
          {/* Matriz Holográfica de Simulación (Estrella de Nether / Data Matrix) */}
          <mesh position={[0, 0.3, 0]} rotation={[0, frame * 0.05, frame * 0.02]}>
            <octahedronGeometry args={[0.42, 0]} />
            <meshStandardMaterial color="#fbbf24" emissive="#d97706" emissiveIntensity={0.8} wireframe />
          </mesh>
          {/* Cubo de contención de vidrio de vacío */}
          <mesh position={[0, 0.2, 0]}>
            <boxGeometry args={[0.95, 1.1, 0.95]} />
            <meshStandardMaterial color="#38bdf8" transparent opacity={0.25} roughness={0.1} />
          </mesh>
        </group>
      )}

      {type === "autocrafter" && (
        <group position={[0, -0.2, 0]}>
          {/* Auto-Crafter Eléctrico de Fluffy Machines */}
          <mesh position={[0, -0.3, 0]}>
            <boxGeometry args={[1.2, 0.7, 1.2]} />
            <meshStandardMaterial color="#334155" roughness={0.3} metalness={0.7} />
          </mesh>
          {/* Cabezal de ensamblado mecánico móvil */}
          <mesh position={[0, 0.3 + Math.sin(frame * 0.15) * 0.12, 0]}>
            <cylinderGeometry args={[0.25, 0.35, 0.45, 12]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Mesa de crafteo holográfica 3x3 */}
          <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.85, 0.85]} />
            <meshStandardMaterial color="#10b981" emissive="#059669" emissiveIntensity={0.6} wireframe />
          </mesh>
          {/* Brazos hidráulicos laterales */}
          <mesh position={[-0.65, 0.1, 0]}>
            <boxGeometry args={[0.12, 0.6, 0.2]} />
            <meshStandardMaterial color="#64748b" metalness={0.8} />
          </mesh>
          <mesh position={[0.65, 0.1, 0]}>
            <boxGeometry args={[0.12, 0.6, 0.2]} />
            <meshStandardMaterial color="#64748b" metalness={0.8} />
          </mesh>
        </group>
      )}

      {type === "networks_core" && (
        <group position={[0, -0.2, 0]}>
          {/* Controlador Central de Redes v6 */}
          <mesh position={[0, 0.3, 0]}>
            <boxGeometry args={[0.8, 0.9, 0.8]} />
            <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.9} />
          </mesh>
          {/* Pantalla digital de inventario masivo */}
          <mesh position={[0, 0.3, 0.42]}>
            <planeGeometry args={[0.6, 0.6]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
          {/* Líneas de fibra de red cuántica (azul y cian) */}
          {[-0.6, 0.6].map((offset, i) => (
            <mesh key={i} position={[offset, -0.3, 0]}>
              <cylinderGeometry args={[0.08, 0.08, 0.8, 8]} />
              <meshBasicMaterial color="#06b6d4" />
            </mesh>
          ))}
          {/* Barril de Almacenamiento Blindado */}
          <mesh position={[0, -0.6, 0]}>
            <cylinderGeometry args={[0.9, 0.9, 0.45, 16]} />
            <meshStandardMaterial color="#475569" roughness={0.4} metalness={0.6} />
          </mesh>
        </group>
      )}

      {type === "lag_architecture" && (
        <group position={[0, -0.2, 0]}>
          {/* Arquitectura SRE: Comparativa Tolvas vs Punteros de Red */}
          <mesh position={[-0.6, 0.2, 0]}>
            {/* Tolva de Vanilla (Gris con aura de advertencia) */}
            <cylinderGeometry args={[0.4, 0.2, 0.6, 8]} />
            <meshStandardMaterial color="#ef4444" wireframe />
          </mesh>
          <mesh position={[0.6, 0.2, 0]}>
            {/* Nodo de Red Slimefun (Verde de 20.0 TPS) */}
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshStandardMaterial color="#10b981" emissive="#059669" emissiveIntensity={0.8} />
          </mesh>
          {/* Conexión de bus en memoria ultra rápida */}
          <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 1.2, 8]} rotation={[0, 0, Math.PI / 2]} />
            <meshBasicMaterial color="#22c55e" />
          </mesh>
          {/* Indicador de 20.0 TPS */}
          <mesh position={[0, -0.5, 0]}>
            <boxGeometry args={[1.5, 0.2, 0.8]} />
            <meshStandardMaterial color="#022c22" roughness={0.3} metalness={0.8} />
          </mesh>
        </group>
      )}

      {type === "community_drakes" && (
        <group position={[0, -0.2, 0]}>
          {/* Escudo Tecnológico DrakesCraft */}
          <mesh position={[0, 0.3, 0]} rotation={[0, frame * 0.03, 0]}>
            <cylinderGeometry args={[0.6, 0.75, 0.15, 6]} />
            <meshStandardMaterial color="#3b82f6" emissive="#1d4ed8" emissiveIntensity={0.6} metalness={0.9} />
          </mesh>
          {/* Orbe Flotante de SAORI */}
          <mesh position={[0, 0.3, 0]}>
            <sphereGeometry args={[0.25, 16, 16]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
          {/* Portal de inicio /pwarp xp */}
          <mesh position={[0, -0.5, 0]}>
            <cylinderGeometry args={[1.1, 1.2, 0.25, 16]} />
            <meshStandardMaterial color="#1e1b4b" roughness={0.2} metalness={0.9} />
          </mesh>
        </group>
      )}
    </group>
  );
};

export const SlimefunCapitulo7: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Encuentra la escena activa según el frame
  const { currentScene: scene, sceneLocalFrame } = useMemo(() => {
    let found = SCENE_RANGES_SF7[0];
    for (const r of SCENE_RANGES_SF7) {
      if (frame >= r.startFrame && frame < r.endFrame) {
        found = r;
        break;
      }
    }
    return {
      currentScene: found,
      sceneLocalFrame: frame - found.startFrame,
    };
  }, [frame]);

  // Selección de cámara según la escena
  const cameraPos = useMemo<[number, number, number]>(() => {
    switch (scene.camera) {
      case "close":
        return [0, 0.6, 2.5];
      case "wide":
        return [0, 1.0, 3.8];
      case "mid":
      default:
        return [0, 0.8, 3.1];
    }
  }, [scene.camera]);

  // Acción del personaje Steve3D
  const steveAction = useMemo<SteveAction>(() => {
    switch (scene.action) {
      case "point":
        return "point";
      case "interact":
        return "walk";
      case "cheer":
      case "wave":
        return "wave";
      case "idle":
      default:
        return "idle";
    }
  }, [scene.action]);

  // Rotación de skins namemc
  const currentSceneIndex = useMemo(() => {
    let acc = 0;
    for (let i = 0; i < SCENE_RANGES_SF7.length; i++) {
      const dur = SCENE_RANGES_SF7[i].durationFrames;
      if (frame >= acc && frame < acc + dur) return i;
      acc += dur;
      }
    return SCENE_RANGES_SF7.length - 1;
  }, [frame]);

  const skinFolder = useMemo(() => {
    return (skinRotation as string[])[(currentSceneIndex + 5) % (skinRotation as string[]).length] || "skins_parts/skin_08_parts";
  }, [currentSceneIndex]);

  // Captions y palabras sincronizadas
  const captionWords = useMemo(() => {
    if (!scene.words) return [];
    return scene.words.map((w: any) => ({
      w: w.word,
      t: w.start,
      d: w.duration,
    }));
  }, [scene]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#060814", color: "#f8fafc", fontFamily: "sans-serif" }}>
      {/* Pistas de Audio Secuenciadas */}
      {SCENE_RANGES_SF7.map((s: any) => (
        <Sequence key={s.id} from={s.startFrame} durationInFrames={s.durationFrames}>
          <Audio src={staticFile(`audio/${s.audio_file}`)} volume={1.0} />
        </Sequence>
      ))}

      {/* Fondo con Cuadrícula Cyberpunk y Resplandor de Gradiente */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(circle at 75% 40%, rgba(56, 189, 248, 0.12) 0%, transparent 60%),
            radial-gradient(circle at 25% 70%, rgba(16, 185, 129, 0.10) 0%, transparent 55%),
            linear-gradient(180deg, #060814 0%, #090d1f 100%)
          `,
          zIndex: 0,
        }}
      />

      {/* Header Superior Técnico con Telemetría */}
      <div
        style={{
          position: "absolute",
          top: 24,
          left: 40,
          right: 40,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          paddingBottom: 12,
          zIndex: 30,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span
            style={{
              background: "#38bdf8",
              color: "#020617",
              fontWeight: 900,
              fontSize: 13,
              padding: "4px 10px",
              borderRadius: 4,
              letterSpacing: "0.08em",
            }}
          >
            DRAKES-SRE
          </span>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#e2e8f0" }}>
            SLIMEFUN MASTERCLASS // CAPÍTULO 7: ADDONS AVANZADOS & REDES
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 13, color: "#94a3b8" }}>
          <span>CORE: PURPUR 1.21.11</span>
          <span style={{ color: "#38bdf8", fontWeight: 700 }}>TPS: 20.0 (NETWORKS v6 SRE)</span>
          <span>AUTONOMOUS AGENT: SAORI 24/7</span>
        </div>
      </div>

      {/* Panel Izquierdo: Título, Badge y Texto Técnico Explicativo */}
      <div
        style={{
          position: "absolute",
          top: 95,
          left: 40,
          width: 530,
          zIndex: 30,
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <div
          style={{
            display: "inline-block",
            fontSize: 12,
            fontWeight: 800,
            color: "#38bdf8",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            borderLeft: "3px solid #38bdf8",
            paddingLeft: 10,
          }}
        >
          {scene.badge}
        </div>

        <h1
          style={{
            fontSize: 32,
            fontWeight: 900,
            lineHeight: 1.15,
            color: "#f8fafc",
            margin: 0,
            textShadow: "0 4px 18px rgba(0, 0, 0, 0.6)",
          }}
        >
          {scene.title}
        </h1>

        <p
          style={{
            fontSize: 17,
            fontWeight: 600,
            color: "#38bdf8",
            margin: 0,
          }}
        >
          {scene.subtitle}
        </p>

        {/* Caja de Información de Ingeniería */}
        <div
          style={{
            background: "rgba(15, 23, 42, 0.75)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(56, 189, 248, 0.25)",
            borderRadius: 10,
            padding: "16px 20px",
            marginTop: 6,
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4)",
          }}
        >
          <p
            style={{
              fontSize: 15,
              lineHeight: 1.55,
              color: "#cbd5e1",
              margin: 0,
            }}
          >
            {scene.text}
          </p>
        </div>

        {/* Indicador de escena / progreso */}
        <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
          {SCENE_RANGES_SF7.map((sc: any, idx: number) => {
            const isActive = sc.id === scene.id;
            return (
              <div
                key={sc.id}
                style={{
                  height: 4,
                  flex: 1,
                  borderRadius: 2,
                  background: isActive ? "#38bdf8" : "rgba(255, 255, 255, 0.15)",
                  transition: "background 0.3s ease",
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Escenario 3D Central/Derecho con ThreeCanvas */}
      <div
        style={{
          position: "absolute",
          top: 75,
          right: 30,
          width: 630,
          height: 520,
          zIndex: 20,
        }}
      >
        <ThreeCanvas
          width={630}
          height={520}
          camera={{ position: cameraPos, fov: 42 }}
          style={{ background: "transparent" }}
        >
          <ambientLight intensity={1.2} />
          <directionalLight position={[5, 8, 5]} intensity={1.8} color="#ffffff" />
          <pointLight position={[-3, 2, 2]} color="#38bdf8" intensity={2.5} distance={8} />
          <pointLight position={[3, -1, 1]} color="#10b981" intensity={1.8} distance={6} />

          {/* Pedestal tech de soporte */}
          <mesh position={[0, -0.95, 0]}>
            <cylinderGeometry args={[2.2, 2.4, 0.2, 32]} />
            <meshStandardMaterial color="#0c0a1a" roughness={0.3} metalness={0.9} />
          </mesh>
          <mesh position={[0, -0.84, 0]}>
            <cylinderGeometry args={[2.1, 2.1, 0.02, 32]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>

          {/* Presentador Jack (Steve3D) a la izquierda del pedestal */}
          <group position={[-0.8, -0.15, 0.3]}>
            <Steve3D
              position={[0, -0.1, 0]}
              rotation={[0, 0.35 + Math.sin(frame * 0.03) * 0.1, 0]}
              scale={0.95}
              action={steveAction}
              skinFolder={skinFolder}
            />
          </group>

          {/* Maquinaria de Addons 3D a la derecha del pedestal */}
          <group position={[0.75, 0.05, 0]}>
            <Addons3D type={scene.diagram} frame={frame} />
          </group>
        </ThreeCanvas>
      </div>

      {/* Subtítulos Dinámicos Inferiores */}
      <div
        style={{
          position: "absolute",
          bottom: 45,
          left: 40,
          right: 40,
          zIndex: 40,
          minHeight: 55,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Captions
          text={scene.spoken_text}
          frame={sceneLocalFrame}
          words={captionWords}
        />
      </div>

      {/* Footer de Marca e IP */}
      <div
        style={{
          position: "absolute",
          bottom: 12,
          left: 40,
          right: 40,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          paddingTop: 8,
          fontSize: 13,
          color: "#64748b",
          zIndex: 40,
        }}
      >
        <span>CONÉCTATE: play.drakescraft.cl:25565 (Java & Bedrock)</span>
        <span>DISCORD: https://discord.gg/drakescraft</span>
        <span>SRE INFRASTRUCTURE // ZERO LAG</span>
      </div>
    </AbsoluteFill>
  );
};
