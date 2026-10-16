import React, { useMemo } from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { T } from "./std/theme";
import { Steve3D, SteveAction } from "./std/Steve3D";
import { Captions } from "./std/Captions";
import { ThreeCanvas } from "@remotion/three";
import storyboardData from "./sf-capitulo5-storyboard.json";
import skinRotation from "./skin_rotation.json";

export const SCENES_SF5 = storyboardData.scenes;

let accFramesSF5 = 0;
export const SCENE_RANGES_SF5 = SCENES_SF5.map((sec: any) => {
  const durationFrames = Math.round(sec.duration * 30);
  const start = accFramesSF5;
  accFramesSF5 += durationFrames;
  return {
    ...sec,
    startFrame: start,
    durationFrames,
    endFrame: accFramesSF5,
  };
});

export const TOTAL_SF_CAPITULO5_FRAMES = accFramesSF5 + 90; // ~5,160 frames (~2:52 min)

// Maquinaria 3D y Componentes Nucleares
const Nuclear3D: React.FC<{ type: string; frame: number }> = ({ type, frame }) => {
  const rotY = frame * 0.02;

  return (
    <group rotation={[0.2, rotY, 0]}>
      {type === "nuclear_intro" && (
        <group position={[0, -0.2, 0]}>
          {/* Núcleo de uranio brillante */}
          <mesh position={[0, 0.4, 0]}>
            <sphereGeometry args={[0.5, 24, 24]} />
            <meshStandardMaterial color="#22c55e" emissive="#16a34a" emissiveIntensity={0.9} roughness={0.2} />
          </mesh>
          {/* Anillos orbitales de electrones */}
          <mesh position={[0, 0.4, 0]} rotation={[frame * 0.03, frame * 0.02, 0]}>
            <torusGeometry args={[0.85, 0.03, 8, 32]} />
            <meshBasicMaterial color="#4ade80" />
          </mesh>
          <mesh position={[0, 0.4, 0]} rotation={[-frame * 0.025, 0, frame * 0.035]}>
            <torusGeometry args={[1.0, 0.025, 8, 32]} />
            <meshBasicMaterial color="#86efac" />
          </mesh>
          {/* Base blindada de plomo */}
          <mesh position={[0, -0.6, 0]}>
            <cylinderGeometry args={[1.1, 1.25, 0.4, 16]} />
            <meshStandardMaterial color="#1e293b" roughness={0.4} metalness={0.8} />
          </mesh>
        </group>
      )}

      {type === "hazmat_suit" && (
        <group position={[0, -0.2, 0]}>
          {/* Casco Hazmat Blindado */}
          <mesh position={[0, 0.5, 0]}>
            <boxGeometry args={[0.9, 0.9, 0.9]} />
            <meshStandardMaterial color="#facc15" roughness={0.3} metalness={0.2} />
          </mesh>
          {/* Visor de vidrio reforzado tintado */}
          <mesh position={[0, 0.5, 0.46]}>
            <boxGeometry args={[0.7, 0.35, 0.05]} />
            <meshStandardMaterial color="#0284c7" roughness={0.1} metalness={0.9} />
          </mesh>
          {/* Filtros laterales de respiración química */}
          <mesh position={[-0.52, 0.4, 0.1]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.18, 0.18, 0.2, 16]} />
            <meshStandardMaterial color="#334155" metalness={0.9} />
          </mesh>
          <mesh position={[0.52, 0.4, 0.1]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.18, 0.18, 0.2, 16]} />
            <meshStandardMaterial color="#334155" metalness={0.9} />
          </mesh>
          {/* Pechera de plomo */}
          <mesh position={[0, -0.3, 0]}>
            <boxGeometry args={[1.1, 0.7, 0.6]} />
            <meshStandardMaterial color="#eab308" roughness={0.4} />
          </mesh>
        </group>
      )}

      {type === "uranium_cycle" && (
        <group position={[0, -0.3, 0]}>
          {/* Centrífuga Nuclear rotatoria */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.8, 0.95, 1.2, 24]} />
            <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Cámara de centrifugación transparente */}
          <mesh position={[0, 0.2, 0]} rotation={[0, frame * 0.1, 0]}>
            <cylinderGeometry args={[0.65, 0.65, 0.5, 12]} />
            <meshStandardMaterial color="#22c55e" emissive="#15803d" emissiveIntensity={0.7} wireframe />
          </mesh>
          {/* Tuberías de inyección de gas de uranio */}
          <mesh position={[0.85, 0.3, 0]} rotation={[0, 0, Math.PI / 4]}>
            <cylinderGeometry args={[0.08, 0.08, 0.6, 12]} />
            <meshStandardMaterial color="#64748b" metalness={0.8} />
          </mesh>
          <mesh position={[-0.85, 0.3, 0]} rotation={[0, 0, -Math.PI / 4]}>
            <cylinderGeometry args={[0.08, 0.08, 0.6, 12]} />
            <meshStandardMaterial color="#64748b" metalness={0.8} />
          </mesh>
        </group>
      )}

      {type === "nuclear_reactor" && (
        <group position={[0, -0.2, 0]}>
          {/* Contenedor del Reactor Nuclear */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[1.2, 1.35, 1.4, 8]} />
            <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.9} />
          </mesh>
          {/* Ventanas de observación del núcleo (Brillo verde radiactivo) */}
          <mesh position={[0, 0.1, 0]}>
            <cylinderGeometry args={[1.05, 1.05, 0.4, 8]} />
            <meshStandardMaterial color="#22c55e" emissive="#16a34a" emissiveIntensity={1.2} />
          </mesh>
          {/* Varillas de control en la parte superior */}
          {[-0.4, 0, 0.4].map((px, ix) => (
            <mesh key={ix} position={[px, 0.9 + Math.sin(frame * 0.05 + ix) * 0.1, 0]}>
              <cylinderGeometry args={[0.07, 0.07, 0.6, 12]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.95} />
            </mesh>
          ))}
          {/* Indicador de 1200 J/s */}
          <mesh position={[0, 0.1, 1.25]} rotation={[0, 0, 0]}>
            <planeGeometry args={[0.8, 0.25]} />
            <meshBasicMaterial color="#4ade80" />
          </mesh>
        </group>
      )}

      {type === "coolant_system" && (
        <group position={[0, -0.2, 0]}>
          {/* Celda Criogénica de Refrigeración */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1.3, 1.3, 1.3]} />
            <meshStandardMaterial color="#0284c7" emissive="#0369a1" emissiveIntensity={0.5} roughness={0.1} metalness={0.8} />
          </mesh>
          {/* Varillas criogénicas congeladas (Cyan) */}
          {[-0.35, 0.35].map((cx, i) => (
            <mesh key={i} position={[cx, 0.2, 0.7]}>
              <cylinderGeometry args={[0.12, 0.12, 0.9, 16]} />
              <meshStandardMaterial color="#38bdf8" emissive="#0ea5e9" emissiveIntensity={0.8} />
            </mesh>
          ))}
          {/* Tuberías de transporte criogénico */}
          <mesh position={[0, -0.7, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 1.6, 16]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
          </mesh>
        </group>
      )}

      {type === "nuclear_waste" && (
        <group position={[0, -0.3, 0]}>
          {/* Barril de Residuos Radiactivos */}
          <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.75, 0.75, 1.3, 24]} />
            <meshStandardMaterial color="#eab308" roughness={0.4} metalness={0.5} />
          </mesh>
          {/* Franjas negras de advertencia biológica */}
          <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.77, 0.77, 0.3, 24]} />
            <meshStandardMaterial color="#0f172a" roughness={0.8} />
          </mesh>
          {/* Tapa blindada de plomo con cierre hermético */}
          <mesh position={[0, 0.88, 0]}>
            <cylinderGeometry args={[0.82, 0.82, 0.1, 24]} />
            <meshStandardMaterial color="#334155" metalness={0.9} />
          </mesh>
        </group>
      )}

      {type === "summary_network" && (
        <group position={[0, -0.3, 0]}>
          {/* Complejo Nuclear Integrado */}
          <mesh position={[-0.9, 0, 0]}>
            <cylinderGeometry args={[0.65, 0.75, 1.1, 16]} />
            <meshStandardMaterial color="#0f172a" metalness={0.9} />
          </mesh>
          <mesh position={[-0.9, 0.1, 0]}>
            <cylinderGeometry args={[0.55, 0.55, 0.3, 16]} />
            <meshStandardMaterial color="#22c55e" emissive="#16a34a" emissiveIntensity={1.0} />
          </mesh>
          {/* Conducto criogénico */}
          <mesh position={[0, 0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.08, 0.08, 1.2, 12]} />
            <meshStandardMaterial color="#38bdf8" emissive="#0ea5e9" emissiveIntensity={0.6} />
          </mesh>
          {/* Unidad Criogénica */}
          <mesh position={[0.9, 0, 0]}>
            <boxGeometry args={[0.9, 0.9, 0.9]} />
            <meshStandardMaterial color="#0369a1" metalness={0.8} />
          </mesh>
        </group>
      )}
    </group>
  );
};

export const SlimefunCapitulo5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Escena activa
  const currentSceneIndex = useMemo(() => {
    let acc = 0;
    for (let i = 0; i < SCENE_RANGES_SF5.length; i++) {
      const dur = SCENE_RANGES_SF5[i].durationFrames;
      if (frame >= acc && frame < acc + dur) return i;
      acc += dur;
    }
    return SCENE_RANGES_SF5.length - 1;
  }, [frame]);

  const scene = SCENE_RANGES_SF5[currentSceneIndex] || SCENE_RANGES_SF5[0];
  const sceneLocalFrame = frame - scene.startFrame;

  // Rotación de skins namemc
  const skinFolder = useMemo(() => {
    return skinRotation[currentSceneIndex % skinRotation.length] || "skins_parts/skin_07_parts";
  }, [currentSceneIndex]);

  // Captions
  const captionWords = useMemo(() => {
    if (!scene.words) return [];
    return scene.words.map((w: any) => ({
      w: w.word,
      t: w.start,
      d: w.duration,
    }));
  }, [scene]);

  // Movimiento de cámara 3D
  const cameraPos = useMemo(() => {
    if (scene.camera === "close") return [0, 1.4, 2.7] as [number, number, number];
    if (scene.camera === "mid") return [0, 1.25, 3.8] as [number, number, number];
    return [0, 1.15, 4.8] as [number, number, number];
  }, [scene.camera]);

  const steveAction = (scene.action || "idle") as SteveAction;

  return (
    <AbsoluteFill style={{ backgroundColor: "#04080c", fontFamily: T.font, color: "#ffffff", width: 1280, height: 720 }}>
      {/* Pistas de Audio Secuenciales */}
      {SCENE_RANGES_SF5.map((sc: any) => (
        <Sequence key={sc.id} from={sc.startFrame} durationInFrames={sc.durationFrames}>
          <Audio src={staticFile(`audio/${sc.audio_file}`)} />
        </Sequence>
      ))}

      {/* Grid de Fondo Verde Nuclear */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(to right, rgba(34, 197, 94, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(34, 197, 94, 0.05) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          opacity: 0.8,
        }}
      />

      {/* Header Superior Tecnológico */}
      <div
        style={{
          position: "absolute",
          top: 24,
          left: 40,
          right: 40,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(34, 197, 94, 0.25)",
          paddingBottom: 14,
          zIndex: 40,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span
            style={{
              backgroundColor: "#22c55e",
              color: "#020617",
              fontWeight: 900,
              fontSize: 16,
              padding: "4px 12px",
              borderRadius: 6,
              letterSpacing: 1.5,
            }}
          >
            DRAKESCRAFT
          </span>
          <span style={{ color: "#4ade80", fontSize: 16, fontWeight: 800, letterSpacing: 1 }}>
            SLIMEFUN GUIDE // EP. 05
          </span>
        </div>

        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: "#22c55e",
                boxShadow: "0 0 10px #22c55e",
              }}
            />
            <span style={{ fontSize: 14, color: "#86efac", fontWeight: 700 }}>NUCLEAR GRID: NOMINAL</span>
          </div>
          <span
            style={{
              backgroundColor: "rgba(34, 197, 94, 0.15)",
              border: "1px solid #22c55e",
              borderRadius: 6,
              padding: "4px 10px",
              color: "#4ade80",
              fontWeight: 800,
              fontSize: 13,
            }}
          >
            TPS: 20.0
          </span>
        </div>
      </div>

      {/* Lado Izquierdo: Contenido Informativo y Storyboard */}
      <div
        style={{
          position: "absolute",
          top: 90,
          left: 40,
          width: 580,
          zIndex: 30,
        }}
      >
        {/* Badge de sección */}
        <div
          style={{
            display: "inline-block",
            color: "#4ade80",
            fontSize: 14,
            fontWeight: 800,
            letterSpacing: 2,
            marginBottom: 8,
            backgroundColor: "rgba(34, 197, 94, 0.12)",
            padding: "4px 12px",
            borderRadius: 6,
            border: "1px solid rgba(34, 197, 94, 0.3)",
          }}
        >
          {scene.badge}
        </div>

        {/* Título Principal */}
        <h1
          style={{
            fontSize: 34,
            fontWeight: 900,
            color: "#ffffff",
            margin: "0 0 8px 0",
            lineHeight: 1.15,
            letterSpacing: 0.5,
          }}
        >
          {scene.title}
        </h1>

        {/* Subtítulo */}
        <p
          style={{
            fontSize: 16,
            color: "#86efac",
            margin: "0 0 20px 0",
            lineHeight: 1.4,
            fontWeight: 600,
          }}
        >
          {scene.subtitle}
        </p>

        {/* Tarjeta de Especificaciones Técnicas */}
        <div
          style={{
            backgroundColor: "rgba(10, 24, 16, 0.85)",
            border: "1.5px solid rgba(34, 197, 94, 0.4)",
            borderRadius: 16,
            padding: "18px 22px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {scene.text.split(". ").map((bullet: string, bIdx: number) => {
              if (!bullet.trim()) return null;
              return (
                <div key={bIdx} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span style={{ color: "#22c55e", fontSize: 16, fontWeight: 900, marginTop: 1 }}>▶</span>
                  <span style={{ color: "#e2e8f0", fontSize: 15, lineHeight: 1.4, fontWeight: 500 }}>
                    {bullet.trim()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Barra de Progreso de la Masterclass */}
        <div style={{ marginTop: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#64748b", marginBottom: 6 }}>
            <span>PROGRESIÓN CAPÍTULO 5</span>
            <span>
              ESCENA {currentSceneIndex + 1} DE {SCENE_RANGES_SF5.length}
            </span>
          </div>
          <div
            style={{
              width: "100%",
              height: 6,
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${((currentSceneIndex + 1) / SCENE_RANGES_SF5.length) * 100}%`,
                height: "100%",
                backgroundColor: "#22c55e",
                borderRadius: 3,
                transition: "width 0.3s ease",
              }}
            />
          </div>
        </div>
      </div>

      {/* Lado Derecho: Escenario 3D con Jack Presentador + Maquinaria Nuclear */}
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
          <pointLight position={[-3, 2, 2]} color="#22c55e" intensity={2.5} distance={8} />
          <pointLight position={[3, -1, 1]} color="#38bdf8" intensity={1.8} distance={6} />

          {/* Pedestal tech de soporte */}
          <mesh position={[0, -0.95, 0]}>
            <cylinderGeometry args={[2.2, 2.4, 0.2, 32]} />
            <meshStandardMaterial color="#091410" roughness={0.3} metalness={0.9} />
          </mesh>
          <mesh position={[0, -0.84, 0]}>
            <cylinderGeometry args={[2.1, 2.1, 0.02, 32]} />
            <meshBasicMaterial color="#22c55e" />
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

          {/* Maquinaria Nuclear 3D a la derecha del pedestal */}
          <group position={[0.75, 0.05, 0]}>
            <Nuclear3D type={scene.diagram} frame={frame} />
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
