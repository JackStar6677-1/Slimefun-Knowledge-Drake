import React, { useMemo } from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { MovingBg } from "./Bg";
import { T } from "./std/theme";
import { Steve3D, SteveAction } from "./std/Steve3D";
import { Captions } from "./std/Captions";
import { ThreeCanvas } from "@remotion/three";
import { SatisfyingPhysicsWidget } from "./std/SatisfyingPhysicsWidget";
import customGuiData from "./short-customgui.json";

export const CUSTOMGUI_FRAMES = Math.round(customGuiData.duration * 30) + 45; // ~970 frames

const CAPTION_WORDS = customGuiData.words.map((w: any) => ({
  w: w.word,
  t: w.start,
  d: w.duration,
}));

export const ShortCustomGui: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animación del presentador Jack con dual-layer
  const { pos, rot, action } = useMemo(() => {
    return {
      pos: [-0.35, -0.15, 1.3] as [number, number, number],
      rot: [0, 0.2 + Math.sin(frame * 0.04) * 0.12, 0] as [number, number, number],
      action: "interact" as SteveAction,
    };
  }, [frame]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#050813", fontFamily: T.font, color: "#ffffff", width: 1080, height: 1920 }}>
      {/* 1. Fondo reactivo vertical */}
      <MovingBg vertical intensity={1.3} />

      {/* 2. Header Superior de Servidor */}
      <div
        style={{
          position: "absolute",
          top: 65,
          left: 50,
          right: 50,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 40,
        }}
      >
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <span
            style={{
              backgroundColor: "#10b981",
              color: "#020617",
              fontWeight: 900,
              fontSize: 24,
              padding: "8px 18px",
              borderRadius: 8,
              letterSpacing: 2,
            }}
          >
            DRAKESCRAFT
          </span>
          <span style={{ color: "#34d399", fontSize: 22, fontWeight: 900, letterSpacing: 1.5 }}>
            CUSTOM MODEL DATA
          </span>
        </div>

        <div
          style={{
            backgroundColor: "rgba(34, 197, 94, 0.2)",
            border: "1.5px solid #22c55e",
            borderRadius: 20,
            padding: "6px 16px",
            color: "#4ade80",
            fontWeight: 900,
            fontSize: 20,
          }}
        >
          VANILLA 1.21.x
        </div>
      </div>

      {/* 3. Escena 3D Superior (Jack + Reactor Nuclear 3D + Pedestal tech) */}
      <div style={{ position: "absolute", top: 120, left: 0, width: 680, height: 820, zIndex: 10 }}>
        <ThreeCanvas
          width={680}
          height={820}
          camera={{ position: [0, 0.85, 4.2], fov: 36 }}
          style={{ background: "transparent" }}
        >
          <ambientLight intensity={1.3} />
          <directionalLight position={[4, 6, 4]} intensity={1.8} color="#ffffff" />
          <pointLight position={[-3, 2, 2]} color="#10b981" intensity={2.4} distance={8} />
          <pointLight position={[3, -1, 1]} color="#38bdf8" intensity={1.6} distance={6} />

          {/* Pedestal tech flotante */}
          <mesh position={[0, -0.9, 0]}>
            <cylinderGeometry args={[1.3, 1.45, 0.15, 32]} />
            <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.8} />
          </mesh>
          <mesh position={[0, -0.81, 0]}>
            <cylinderGeometry args={[1.25, 1.25, 0.02, 32]} />
            <meshBasicMaterial color="#10b981" />
          </mesh>

          {/* Bloque 3D de Reactor Nuclear a la derecha */}
          <group position={[0.65, 0.25, 0.8]} rotation={[frame * 0.015, frame * 0.02, 0]}>
            <mesh>
              <boxGeometry args={[0.6, 0.6, 0.6]} />
              <meshStandardMaterial color="#059669" roughness={0.3} metalness={0.7} />
            </mesh>
            {/* Núcleo de energía interno brillante */}
            <mesh scale={0.4}>
              <boxGeometry args={[0.6, 0.6, 0.6]} />
              <meshBasicMaterial color="#34d399" />
            </mesh>
          </group>

          {/* Jack en 3D dual-layer */}
          <group position={[0, -0.15, 0]}>
            <Steve3D
              position={pos}
              rotation={rot}
              action={action}
              scale={0.62}
              skinPartPath="skins_parts/JackStar6677"
            />
          </group>
        </ThreeCanvas>
      </div>

      {/* Widget Viral de Entretenimiento y Física */}
      <div style={{ position: "absolute", top: 130, right: 50, zIndex: 35 }}>
        <SatisfyingPhysicsWidget width={370} height={370} />
      </div>

      {/* 4. Panel Técnico Central (Explicación NBT / Resource Pack) */}
      <div
        style={{
          position: "absolute",
          top: 980,
          left: 60,
          right: 60,
          backgroundColor: "rgba(15, 23, 42, 0.88)",
          border: "2px solid rgba(16, 185, 129, 0.4)",
          borderRadius: 24,
          padding: "26px 32px",
          backdropFilter: "blur(16px)",
          boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
          zIndex: 30,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div style={{ color: "#34d399", fontSize: 20, fontWeight: 900, letterSpacing: 2 }}>
            PIPELINE DE RENDER SERVER-SIDE
          </div>
          <span style={{ fontSize: 16, color: "#94a3b8", fontFamily: "monospace" }}>NBT · CMD · JSON</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: "rgba(16, 185, 129, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#34d399", fontWeight: 900, fontSize: 20 }}>1</div>
            <div>
              <div style={{ color: "#ffffff", fontWeight: 800, fontSize: 22 }}>Sin Mods en el Cliente</div>
              <div style={{ color: "#94a3b8", fontSize: 18 }}>Conexión directa con Launcher oficial de Minecraft 1.21.x</div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: "rgba(14, 165, 233, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#38bdf8", fontWeight: 900, fontSize: 20 }}>2</div>
            <div>
              <div style={{ color: "#ffffff", fontWeight: 800, fontSize: 22 }}>CustomModelData Mapeado</div>
              <div style={{ color: "#94a3b8", fontSize: 18 }}>Inyección de texturas y geometrías 3D vía Resource Pack</div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: "rgba(245, 158, 11, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fbbf24", fontWeight: 900, fontSize: 20 }}>3</div>
            <div>
              <div style={{ color: "#ffffff", fontWeight: 800, fontSize: 22 }}>GUIs Dinámicas con Slimefun</div>
              <div style={{ color: "#94a3b8", fontSize: 18 }}>Transacciones de energía, red y logística por inventario</div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Subtítulos Dinámicos */}
      <div
        style={{
          position: "absolute",
          bottom: 230,
          left: 50,
          right: 50,
          minHeight: 140,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 40,
        }}
      >
        <Captions words={CAPTION_WORDS} maxWordsPerLine={4} />
      </div>

      {/* 6. Footer Call-to-Action */}
      <div
        style={{
          position: "absolute",
          bottom: 50,
          left: 50,
          right: 50,
          backgroundColor: "rgba(6, 78, 59, 0.4)",
          border: "2px solid #10b981",
          borderRadius: 20,
          padding: "18px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 40,
        }}
      >
        <div>
          <div style={{ color: "#6ee7b7", fontSize: 18, fontWeight: 900, letterSpacing: 1.5 }}>
            ENTRA AL LABORATORIO
          </div>
          <div style={{ color: "#ffffff", fontSize: 28, fontWeight: 900, fontFamily: "monospace" }}>
            play.drakescraft.cl
          </div>
        </div>

        <div
          style={{
            backgroundColor: "#5865F2",
            color: "#ffffff",
            fontWeight: 900,
            fontSize: 22,
            padding: "12px 24px",
            borderRadius: 14,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span>DISCORD</span>
          <span style={{ fontSize: 18 }}>➜</span>
        </div>
      </div>

      {/* 7. Pista de Audio con TTS y Melodía de Fondo */}
      <Audio src={staticFile("audio/short_customgui_es.mp3")} volume={1.0} />
      <Audio src={staticFile("audio/bg_tech_chill.wav")} volume={0.15} loop />
    </AbsoluteFill>
  );
};
