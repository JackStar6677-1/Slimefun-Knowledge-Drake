import React, { useMemo } from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { MovingBg } from "./Bg";
import { T } from "./std/theme";
import { Steve3D, SteveAction } from "./std/Steve3D";
import { Captions } from "./std/Captions";
import { ThreeCanvas } from "@remotion/three";
import archData from "./short-architecture.json";

export const ARCH_FRAMES = Math.round(archData.duration * 30) + 45; // ~1,100 frames

const CAPTION_WORDS = archData.words.map((w: any) => ({
  w: w.word,
  t: w.start,
  d: w.duration,
}));

export const ShortArchitecture: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animación del presentador Jack con dual-layer
  const { pos, rot, action } = useMemo(() => {
    return {
      pos: [0, -0.15, 1.3] as [number, number, number],
      rot: [0, Math.sin(frame * 0.04) * 0.15, 0] as [number, number, number],
      action: "idle" as SteveAction,
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
              backgroundColor: "#8b5cf6",
              color: "#ffffff",
              fontWeight: 900,
              fontSize: 24,
              padding: "8px 18px",
              borderRadius: 8,
              letterSpacing: 2,
            }}
          >
            DRAKESCRAFT
          </span>
          <span style={{ color: "#c4b5fd", fontSize: 22, fontWeight: 900, letterSpacing: 1.5 }}>
            SRE ARCHITECTURE
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
          20.0 TPS · ZGC
        </div>
      </div>

      {/* 3. Escena 3D Superior (Jack + Esquema de Nodos) */}
      <div style={{ position: "absolute", top: 120, left: 0, width: 1080, height: 860, zIndex: 10 }}>
        <ThreeCanvas
          width={1080}
          height={860}
          camera={{ position: [0, 1.6, 4.0], fov: 40 }}
          style={{ background: "transparent" }}
        >
          <ambientLight intensity={1.3} />
          <directionalLight position={[4, 6, 4]} intensity={1.8} color="#ffffff" />
          <pointLight position={[-3, 2, 2]} color="#8b5cf6" intensity={2.4} distance={8} />
          <pointLight position={[3, -1, 1]} color="#06b6d4" intensity={1.6} distance={6} />

          {/* Bloque 3D de Servidor Dallas (Tick Loop) */}
          <group position={[-0.75, 0.3, 0.8]} rotation={[0, frame * 0.02, 0]}>
            <mesh>
              <boxGeometry args={[0.5, 0.6, 0.5]} />
              <meshStandardMaterial color="#6366f1" roughness={0.3} metalness={0.8} />
            </mesh>
          </group>

          {/* Bloque 3D de Servidor Star (Orchestration) */}
          <group position={[0.75, 0.3, 0.8]} rotation={[0, -frame * 0.02, 0]}>
            <mesh>
              <boxGeometry args={[0.5, 0.6, 0.5]} />
              <meshStandardMaterial color="#06b6d4" roughness={0.3} metalness={0.8} />
            </mesh>
          </group>

          {/* Jack en 3D dual-layer */}
          <group position={[0, -0.1, 0]}>
            <Steve3D
              position={pos}
              rotation={rot}
              action={action}
              scale={1.3}
              skinPartPath="skins_parts/JackStar6677"
            />
          </group>
        </ThreeCanvas>
      </div>

      {/* 4. Panel Técnico Central (Fault Domain Decoupling) */}
      <div
        style={{
          position: "absolute",
          top: 980,
          left: 60,
          right: 60,
          backgroundColor: "rgba(15, 23, 42, 0.88)",
          border: "2px solid rgba(139, 92, 246, 0.4)",
          borderRadius: 24,
          padding: "26px 32px",
          backdropFilter: "blur(16px)",
          boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
          zIndex: 30,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div style={{ color: "#c4b5fd", fontSize: 20, fontWeight: 900, letterSpacing: 2 }}>
            FAULT DOMAIN ISOLATION
          </div>
          <span style={{ fontSize: 16, color: "#94a3b8", fontFamily: "monospace" }}>Dallas + Star SRE</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: "rgba(99, 102, 241, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#818cf8", fontWeight: 900, fontSize: 20 }}>D</div>
            <div>
              <div style={{ color: "#ffffff", fontWeight: 800, fontSize: 22 }}>Dallas Dedicated Node</div>
              <div style={{ color: "#94a3b8", fontSize: 18 }}>Pure Minecraft tick loop with Generational ZGC (sub-1ms pauses)</div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: "rgba(6, 182, 212, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#22d3ee", fontWeight: 900, fontSize: 20 }}>S</div>
            <div>
              <div style={{ color: "#ffffff", fontWeight: 800, fontSize: 22 }}>Star Linux Orchestrator</div>
              <div style={{ color: "#94a3b8", fontSize: 18 }}>PostgreSQL, Redis cache, SAORI sentinel and reverse proxy</div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: "rgba(34, 197, 94, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#4ade80", fontWeight: 900, fontSize: 20 }}>R</div>
            <div>
              <div style={{ color: "#ffffff", fontWeight: 800, fontSize: 22 }}>Zero Impact on Tick Loop</div>
              <div style={{ color: "#94a3b8", fontSize: 18 }}>Heavy analytics and web queries never stall player physics</div>
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
          backgroundColor: "rgba(88, 28, 135, 0.4)",
          border: "2px solid #8b5cf6",
          borderRadius: 20,
          padding: "18px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 40,
        }}
      >
        <div>
          <div style={{ color: "#d8b4fe", fontSize: 18, fontWeight: 900, letterSpacing: 1.5 }}>
            JOIN THE SRE LAB
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
      <Audio src={staticFile("audio/short_architecture_en.mp3")} volume={1.0} />
      <Audio src={staticFile("audio/bg_tech_chill.wav")} volume={0.15} loop />
    </AbsoluteFill>
  );
};
