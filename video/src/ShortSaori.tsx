import React, { useMemo } from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { MovingBg } from "./Bg";
import { T } from "./std/theme";
import { Steve3D, SteveAction } from "./std/Steve3D";
import { Captions } from "./std/Captions";
import { ThreeCanvas } from "@remotion/three";
import saoriData from "./short-saori.json";

export const SAORI_FRAMES = Math.round(saoriData.duration * 30) + 45; // ~1,130 frames

const CAPTION_WORDS = saoriData.words.map((w: any) => ({
  w: w.word,
  t: w.start,
  d: w.duration,
}));

export const ShortSaori: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animación del presentador 3D de Jack con dual-layer
  const { pos, rot, action } = useMemo(() => {
    return {
      pos: [0, -0.15, 1.3] as [number, number, number],
      rot: [0, Math.sin(frame * 0.04) * 0.15, 0] as [number, number, number],
      action: (frame % 120 < 60 ? "interact" : "idle") as SteveAction,
    };
  }, [frame]);

  // Progreso de revelación del acrónimo SAORI (frames 120 a 450)
  const revealStep = Math.min(5, Math.max(0, Math.floor((frame - 90) / 45)));

  return (
    <AbsoluteFill style={{ backgroundColor: "#050813", fontFamily: T.font, color: "#ffffff", width: 1080, height: 1920 }}>
      {/* 1. Fondo vertical con movimiento */}
      <MovingBg vertical intensity={1.3} />

      {/* 2. Header Superior de Marca y Servidor */}
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
              backgroundColor: "#06b6d4",
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
          <span style={{ color: "#38bdf8", fontSize: 22, fontWeight: 900, letterSpacing: 1.5 }}>
            SRE CENTINELA
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

      {/* 3. Escena 3D Superior (Jack Presentador + Partículas) */}
      <div style={{ position: "absolute", top: 120, left: 0, width: 1080, height: 860, zIndex: 10 }}>
        <ThreeCanvas
          width={1080}
          height={860}
          camera={{ position: [0, 1.6, 4.0], fov: 40 }}
          style={{ background: "transparent" }}
        >
          <ambientLight intensity={1.3} />
          <directionalLight position={[4, 6, 4]} intensity={1.8} color="#ffffff" />
          <pointLight position={[-3, 2, 2]} color="#06b6d4" intensity={2.4} distance={8} />
          <pointLight position={[3, -1, 1]} color="#f59e0b" intensity={1.6} distance={6} />

          <group position={[0, -0.1, 0]}>
            <Steve3D
              position={pos}
              rotation={rot}
              scale={1.05}
              action={action}
              skinFolder="skins_parts/skin_01_parts"
            />
          </group>
        </ThreeCanvas>
      </div>

      {/* 4. Tarjeta Central Holográfica: Desglose del Acrónimo SAORI */}
      <div
        style={{
          position: "absolute",
          top: 990,
          left: 60,
          right: 60,
          backgroundColor: "rgba(10, 16, 32, 0.94)",
          border: "2px solid rgba(6, 182, 212, 0.5)",
          borderRadius: 24,
          padding: "36px 40px",
          zIndex: 30,
          boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ color: "#38bdf8", fontSize: 20, fontWeight: 800, letterSpacing: 2 }}>
            ARQUITECTURA DE ENJAMBRE
          </span>
          <span style={{ color: "#22c55e", fontSize: 18, fontWeight: 700, fontFamily: "monospace" }}>
            AUTONOMOUS // 24/7
          </span>
        </div>

        <h1 style={{ fontSize: 44, fontWeight: 900, color: "#f8fafc", margin: "0 0 20px 0", letterSpacing: 1 }}>
          ¿QUÉ ES <span style={{ color: "#06b6d4" }}>S.A.O.R.I.</span>?
        </h1>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { letter: "S", word: "Server", desc: "Monitoreo continuo de sockets y red" },
            { letter: "A", word: "Autonomous", desc: "Mitigación sin intervención humana" },
            { letter: "O", word: "Orchestrator", desc: "Balanceo entre Dallas y Star VPS" },
            { letter: "R", word: "Resilient", desc: "Cero tolerancia a rollbacks y pérdidas" },
            { letter: "I", word: "Infrastructure", desc: "Bases de datos WAL y transacciones" },
          ].map((item, idx) => {
            const active = idx < revealStep;
            return (
              <div
                key={item.letter}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "8px 14px",
                  borderRadius: 10,
                  backgroundColor: active ? "rgba(6, 182, 212, 0.12)" : "rgba(15, 23, 42, 0.5)",
                  border: active ? "1px solid #06b6d4" : "1px solid rgba(255,255,255,0.06)",
                  transition: "all 0.3s ease",
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 8,
                    backgroundColor: active ? "#06b6d4" : "#1e293b",
                    color: active ? "#020617" : "#64748b",
                    fontWeight: 900,
                    fontSize: 22,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {item.letter}
                </div>
                <div>
                  <span style={{ fontSize: 22, fontWeight: 900, color: active ? "#f8fafc" : "#94a3b8" }}>
                    {item.word}
                  </span>
                  <span style={{ fontSize: 16, color: "#64748b", marginLeft: 12 }}>
                    — {item.desc}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Subtítulos Karaoke Dinámicos */}
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
          border: "1.5px solid #f59e0b",
          borderRadius: 18,
          padding: "16px 28px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 40,
        }}
      >
        <div>
          <div style={{ color: "#94a3b8", fontSize: 16, fontWeight: 700 }}>IP MINECRAFT (JAVA & BEDROCK)</div>
          <div style={{ color: "#22d3ee", fontSize: 26, fontWeight: 900 }}>play.drakescraft.cl:25565</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ color: "#94a3b8", fontSize: 16, fontWeight: 700 }}>DISCORD OFICIAL</div>
          <div style={{ color: "#fbbf24", fontSize: 24, fontWeight: 900 }}>discord.gg/drakescraft</div>
        </div>
      </div>

      {/* 7. Pista de Locución & Música de Fondo */}
      <Audio src={staticFile("audio/short_saori_es.mp3")} volume={1.0} />
      <Audio src={staticFile("audio/bg_tech_chill.wav")} volume={0.14} loop />
    </AbsoluteFill>
  );
};
