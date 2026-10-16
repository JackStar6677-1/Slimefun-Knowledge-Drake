import React, { useMemo } from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { MovingBg } from "./Bg";
import { T } from "./std/theme";
import { Steve3D, SteveAction } from "./std/Steve3D";
import { Captions } from "./std/Captions";
import { ThreeCanvas } from "@remotion/three";
import { SatisfyingPhysicsWidget } from "./std/SatisfyingPhysicsWidget";
import networksData from "./short-networks.json";

export const NETWORKS_FRAMES = Math.round(networksData.duration * 30) + 45; // ~1,060 frames

const CAPTION_WORDS = networksData.words.map((w: any) => ({
  w: w.word,
  t: w.start,
  d: w.duration,
}));

export const ShortNetworksDupe: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animación del presentador 3D de Jack con dual-layer sosteniendo pusher
  const { pos, rot, action } = useMemo(() => {
    return {
      pos: [-0.4, -0.15, 1.3] as [number, number, number],
      rot: [0, 0.25 + Math.sin(frame * 0.04) * 0.1, 0] as [number, number, number],
      action: "interact" as SteveAction,
    };
  }, [frame]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#050813", fontFamily: T.font, color: "#ffffff", width: 1080, height: 1920 }}>
      {/* 1. Fondo vertical reactivo */}
      <MovingBg vertical intensity={1.3} />

      {/* 2. Header Superior */}
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
              backgroundColor: "#f59e0b",
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
          <span style={{ color: "#22d3ee", fontSize: 22, fontWeight: 900, letterSpacing: 1.5 }}>
            SLIMEFUN 1.21.x
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
          20.0 TPS
        </div>
      </div>

      {/* 3. Escena 3D Superior (Jack + Bloques de Networks con pedestal tech) */}
      <div style={{ position: "absolute", top: 120, left: 0, width: 680, height: 820, zIndex: 10 }}>
        <ThreeCanvas
          width={680}
          height={820}
          camera={{ position: [0, 1.25, 4.3], fov: 38 }}
          style={{ background: "transparent" }}
        >
          <ambientLight intensity={1.3} />
          <directionalLight position={[4, 6, 4]} intensity={1.8} color="#ffffff" />
          <pointLight position={[-3, 2, 2]} color="#06b6d4" intensity={2.4} distance={8} />
          <pointLight position={[3, -1, 1]} color="#f59e0b" intensity={1.6} distance={6} />

          {/* Pedestal tech flotante */}
          <mesh position={[0, -0.9, 0]}>
            <cylinderGeometry args={[1.3, 1.45, 0.15, 32]} />
            <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.8} />
          </mesh>
          <mesh position={[0, -0.81, 0]}>
            <cylinderGeometry args={[1.25, 1.25, 0.02, 32]} />
            <meshBasicMaterial color="#f59e0b" />
          </mesh>

          {/* Bloque 3D de Fluffy Barrel a la derecha */}
          <group position={[0.65, 0.2, 0.8]} rotation={[0, frame * 0.02, 0]}>
            <mesh>
              <boxGeometry args={[0.55, 0.7, 0.55]} />
              <meshLambertMaterial color="#78350f" />
            </mesh>
            {/* Cable de datos de Networks */}
            <mesh position={[-0.32, 0, 0]}>
              <boxGeometry args={[0.15, 0.15, 0.15]} />
              <meshLambertMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.5} />
            </mesh>
          </group>

          <group position={[0, -0.1, 0]}>
            <Steve3D
              position={pos}
              rotation={rot}
              scale={1.05}
              action={action}
              heldItemMaterial="PUSHER"
              skinFolder="skins_parts/skin_01_parts"
            />
          </group>
        </ThreeCanvas>
      </div>

      {/* Widget Viral de Entretenimiento y Física */}
      <div style={{ position: "absolute", top: 130, right: 50, zIndex: 35 }}>
        <SatisfyingPhysicsWidget width={370} height={370} />
      </div>

      {/* 4. Tarjeta Técnica: Parche de Dupe en Networks v6 */}
      <div
        style={{
          position: "absolute",
          top: 990,
          left: 60,
          right: 60,
          backgroundColor: "rgba(10, 16, 32, 0.94)",
          border: "2px solid rgba(245, 158, 11, 0.5)",
          borderRadius: 24,
          padding: "36px 40px",
          zIndex: 30,
          boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ color: "#22c55e", fontSize: 20, fontWeight: 800, letterSpacing: 2 }}>
            FIXED // ZERO DUPE GUARANTEE
          </span>
          <span
            style={{
              backgroundColor: "rgba(34, 197, 94, 0.15)",
              color: "#4ade80",
              border: "1px solid #22c55e",
              borderRadius: 6,
              padding: "4px 10px",
              fontSize: 16,
              fontWeight: 900,
            }}
          >
            NETWORKS v6 PATCHED
          </span>
        </div>

        <h1 style={{ fontSize: 40, fontWeight: 900, color: "#f8fafc", margin: "0 0 16px 0", letterSpacing: 0.8 }}>
          THE INFINITY DUPE FIX
        </h1>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ backgroundColor: "#020617", padding: "12px 16px", borderRadius: 10, border: "1px solid #334155", fontFamily: "monospace", fontSize: 16, color: "#93c5fd" }}>
            <span style={{ color: "#ef4444" }}>- // Vulnerable: Async tick race condition</span><br/>
            <span style={{ color: "#22c55e" }}>+ // DrakesCraft: Atomic lock & write-verify buffer</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ backgroundColor: "rgba(15, 23, 42, 0.6)", padding: "12px 16px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ color: "#94a3b8", fontSize: 15, fontWeight: 700 }}>INFINITY EXPANSION</div>
              <div style={{ color: "#22d3ee", fontSize: 20, fontWeight: 900 }}>100% SECURE</div>
            </div>
            <div style={{ backgroundColor: "rgba(15, 23, 42, 0.6)", padding: "12px 16px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ color: "#94a3b8", fontSize: 15, fontWeight: 700 }}>FLUFFY BARRELS</div>
              <div style={{ color: "#f59e0b", fontSize: 20, fontWeight: 900 }}>ATOMIC SYNC</div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Subtítulos Karaoke Dinámicos en Inglés */}
      <div style={{ position: "absolute", top: 1540, left: 40, right: 40, height: 180, zIndex: 50 }}>
        <Captions words={CAPTION_WORDS} top={10} height={160} size={50} />
      </div>

      {/* 6. Footer de Conexión y Discord */}
      <div
        style={{
          position: "absolute",
          bottom: 50,
          left: 50,
          right: 50,
          backgroundColor: "rgba(10, 15, 26, 0.95)",
          border: "1.5px solid #06b6d4",
          borderRadius: 18,
          padding: "16px 28px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 40,
        }}
      >
        <div>
          <div style={{ color: "#94a3b8", fontSize: 16, fontWeight: 700 }}>SERVER IP (JAVA & BEDROCK)</div>
          <div style={{ color: "#22d3ee", fontSize: 26, fontWeight: 900 }}>play.drakescraft.cl:25565</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ color: "#94a3b8", fontSize: 16, fontWeight: 700 }}>OFFICIAL DISCORD</div>
          <div style={{ color: "#fbbf24", fontSize: 24, fontWeight: 900 }}>discord.gg/drakescraft</div>
        </div>
      </div>

      {/* 7. Audio */}
      <Audio src={staticFile("audio/short_networks_en.mp3")} volume={1.0} />
      <Audio src={staticFile("audio/bg_tech_chill.wav")} volume={0.14} loop />
    </AbsoluteFill>
  );
};
