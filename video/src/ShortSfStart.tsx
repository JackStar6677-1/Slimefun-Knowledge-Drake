import React, { useMemo } from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { MovingBg } from "./Bg";
import { T } from "./std/theme";
import { Steve3D, SteveAction } from "./std/Steve3D";
import { Captions } from "./std/Captions";
import { ThreeCanvas } from "@remotion/three";
import { SatisfyingPhysicsWidget } from "./std/SatisfyingPhysicsWidget";
import shortData from "./short-sf-start.json";

export const SF_START_FRAMES = shortData.frames;

const CAPTION_WORDS = shortData.words.map((w: any) => ({
  w: w.word,
  t: w.start,
  d: w.duration,
}));

export const ShortSfStart: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const { pos, rot, action } = useMemo(() => {
    const currentAction: SteveAction =
      frame % 300 < 100 ? "explain" : frame % 300 < 200 ? "point" : "nod";
    return {
      pos: [0, -0.42, 0.2] as [number, number, number],
      rot: [0, Math.sin(frame * 0.03) * 0.18, 0] as [number, number, number],
      action: currentAction,
    };
  }, [frame]);

  // Pasos de progresión (0 a 3)
  const currentStep = Math.min(3, Math.max(1, Math.floor((frame - 60) / 300) + 1));

  return (
    <AbsoluteFill style={{ backgroundColor: "#050813", fontFamily: T.font, color: "#ffffff", width: 1080, height: 1920 }}>
      {/* 1. Audio de locución */}
      <Audio src={staticFile(`audio/${shortData.audio_file}`)} />

      {/* 2. Fondo vertical con movimiento */}
      <MovingBg vertical intensity={1.3} />

      {/* 3. Header Superior de Marca y Servidor */}
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
              backgroundColor: "#22c55e",
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
          <span style={{ color: "#4ade80", fontSize: 22, fontWeight: 900, letterSpacing: 1.5 }}>
            SLIMEFUN GUIDE
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
          100% VANILLA
        </div>
      </div>

      {/* 4. Escena 3D Superior (Jack Presentador con escala 0.62 y encuadre amplio sin recortes) */}
      <div style={{ position: "absolute", top: 120, left: 0, width: 680, height: 820, zIndex: 10 }}>
        <ThreeCanvas
          width={680}
          height={820}
          camera={{ position: [0, 0.85, 4.2], fov: 36 }}
          style={{ background: "transparent" }}
        >
          <ambientLight intensity={1.3} />
          <directionalLight position={[4, 6, 4]} intensity={1.8} color="#ffffff" />
          <pointLight position={[-3, 2, 2]} color="#22c55e" intensity={2.4} distance={8} />
          <pointLight position={[3, -1, 1]} color="#38bdf8" intensity={1.6} distance={6} />

          {/* Pedestal tech flotante */}
          <mesh position={[0, -0.9, 0]}>
            <cylinderGeometry args={[1.3, 1.45, 0.15, 32]} />
            <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.8} />
          </mesh>
          <mesh position={[0, -0.81, 0]}>
            <cylinderGeometry args={[1.25, 1.25, 0.02, 32]} />
            <meshBasicMaterial color="#22c55e" />
          </mesh>

          <group position={[0, -0.15, 0]}>
            <Steve3D
              position={pos}
              rotation={rot}
              scale={0.62}
              action={action}
              skinFolder="skins_parts/skin_01_parts"
            />
          </group>
        </ThreeCanvas>
      </div>

      {/* Widget Viral de Entretenimiento y Física: Bola destruyendo círculos con telemetría */}
      <div style={{ position: "absolute", top: 130, right: 50, zIndex: 35 }}>
        <SatisfyingPhysicsWidget width={370} height={370} />
      </div>

      {/* 5. Tarjeta Central Holográfica: 3 Pasos para Empezar Slimefun */}
      <div
        style={{
          position: "absolute",
          top: 980,
          left: 60,
          right: 60,
          backgroundColor: "rgba(10, 16, 32, 0.94)",
          border: "2px solid rgba(34, 197, 94, 0.5)",
          borderRadius: 24,
          padding: "36px 40px",
          zIndex: 30,
          boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
        }}
      >
        <div style={{ color: "#4ade80", fontSize: 20, fontWeight: 900, letterSpacing: 2, marginBottom: 12 }}>
          INICIO RÁPIDO // 3 PASOS
        </div>
        <div style={{ fontSize: 36, fontWeight: 900, color: "#ffffff", marginBottom: 24 }}>
          ¿Cómo Iniciar en Slimefun?
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            { step: "01", cmd: "/sf guide", title: "Libro Digital Interactivo", desc: "Navega categorías, recetas y componentes con 1 clic." },
            { step: "02", cmd: "/rtp & /ps get", title: "Explora y Protege", desc: "Teletransporte survival y bloques de protección automática." },
            { step: "03", cmd: "Mesa Mejorada", title: "Primer Multibloque", desc: "Mesa de crafteo sobre Dispensador apuntando arriba." },
          ].map((item, idx) => {
            const active = currentStep >= idx + 1;
            return (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  backgroundColor: active ? "rgba(34, 197, 94, 0.12)" : "rgba(255,255,255,0.02)",
                  border: `1.5px solid ${active ? "#22c55e" : "rgba(255,255,255,0.08)"}`,
                  borderRadius: 16,
                  padding: "16px 22px",
                  transition: "all 0.3s ease",
                }}
              >
                <div
                  style={{
                    backgroundColor: active ? "#22c55e" : "#334155",
                    color: active ? "#020617" : "#94a3b8",
                    fontSize: 18,
                    fontWeight: 900,
                    width: 42,
                    height: 42,
                    borderRadius: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {item.step}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ color: active ? "#4ade80" : "#cbd5e1", fontSize: 20, fontWeight: 900 }}>
                      {item.cmd}
                    </span>
                    <span style={{ color: "#94a3b8", fontSize: 16 }}>— {item.title}</span>
                  </div>
                  <div style={{ color: "#64748b", fontSize: 15, marginTop: 4 }}>
                    {item.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Subtítulos Dinámicos */}
      <div style={{ position: "absolute", top: 1530, left: 60, right: 60, zIndex: 40, minHeight: 120 }}>
        <Captions
          text={shortData.spoken_text}
          frame={frame}
          words={CAPTION_WORDS}
        />
      </div>

      {/* 7. Footer Inferior con IP & Bedrock Callout */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          left: 50,
          right: 50,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px solid rgba(34, 197, 94, 0.3)",
          paddingTop: 24,
          zIndex: 40,
        }}
      >
        <div>
          <div style={{ fontSize: 18, color: "#64748b", fontWeight: 800 }}>IP SERVIDOR OFICIAL</div>
          <div style={{ fontSize: 28, color: "#4ade80", fontWeight: 900, letterSpacing: 1.5 }}>
            play.drakescraft.cl:25565
          </div>
        </div>

        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 16, color: "#94a3b8" }}>Java & Bedrock Compatible</div>
          <div style={{ fontSize: 16, color: "#22c55e", fontWeight: 800 }}>Cero Mods // Sin Lag</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
