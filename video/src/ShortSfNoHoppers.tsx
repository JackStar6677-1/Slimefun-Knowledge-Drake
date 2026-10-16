import React, { useMemo } from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { MovingBg } from "./Bg";
import { T } from "./std/theme";
import { Steve3D, SteveAction } from "./std/Steve3D";
import { Captions } from "./std/Captions";
import { ThreeCanvas } from "@remotion/three";
import { SatisfyingPhysicsWidget } from "./std/SatisfyingPhysicsWidget";
import shortData from "./short-sf-no-hoppers.json";

export const SF_NO_HOPPERS_FRAMES = shortData.frames;

const CAPTION_WORDS = shortData.words.map((w: any) => ({
  w: w.word,
  t: w.start,
  d: w.duration,
}));

export const ShortSfNoHoppers: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const { pos, rot, action } = useMemo(() => {
    return {
      pos: [0, -0.42, 0.2] as [number, number, number],
      rot: [0, Math.sin(frame * 0.04) * 0.15, 0] as [number, number, number],
      action: (frame % 300 < 100 ? "explain" : frame % 300 < 200 ? "point" : "nod") as SteveAction,
    };
  }, [frame]);

  // Pasos de progresión (0 a 3)
  const currentStep = Math.min(3, Math.max(1, Math.floor((frame - 60) / 280) + 1));

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
              backgroundColor: "#ef4444",
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
          <span style={{ color: "#f87171", fontSize: 22, fontWeight: 900, letterSpacing: 1.5 }}>
            SRE PERFORMANCE
          </span>
        </div>

        <div
          style={{
            backgroundColor: "rgba(239, 68, 68, 0.2)",
            border: "1.5px solid #ef4444",
            borderRadius: 20,
            padding: "6px 16px",
            color: "#f87171",
            fontWeight: 900,
            fontSize: 20,
          }}
        >
          ANTI-LAG AUDIT
        </div>
      </div>

      {/* 4. Escena 3D Superior (Jack Presentador + Encuadre sin recortes) */}
      <div style={{ position: "absolute", top: 120, left: 0, width: 680, height: 820, zIndex: 10 }}>
        <ThreeCanvas
          width={680}
          height={820}
          camera={{ position: [0, 0.85, 4.2], fov: 36 }}
          style={{ background: "transparent" }}
        >
          <ambientLight intensity={1.3} />
          <directionalLight position={[4, 6, 4]} intensity={1.8} color="#ffffff" />
          <pointLight position={[-3, 2, 2]} color="#ef4444" intensity={2.4} distance={8} />
          <pointLight position={[3, -1, 1]} color="#38bdf8" intensity={1.6} distance={6} />

          {/* Pedestal tech flotante */}
          <mesh position={[0, -0.9, 0]}>
            <cylinderGeometry args={[1.3, 1.45, 0.15, 32]} />
            <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.8} />
          </mesh>
          <mesh position={[0, -0.81, 0]}>
            <cylinderGeometry args={[1.25, 1.25, 0.02, 32]} />
            <meshBasicMaterial color="#ef4444" />
          </mesh>

          <group position={[0, -0.15, 0]}>
            <Steve3D
              position={pos}
              rotation={rot}
              scale={0.62}
              action={action}
              skinFolder="skins_parts/skin_05_parts"
            />
          </group>
        </ThreeCanvas>
      </div>

      {/* Widget Viral de Entretenimiento y Física: Bola destruyendo círculos con telemetría */}
      <div style={{ position: "absolute", top: 130, right: 50, zIndex: 35 }}>
        <SatisfyingPhysicsWidget width={370} height={370} />
      </div>

      {/* 5. Tarjeta Central Holográfica: Comparativa Tolvas vs Cargo */}
      <div
        style={{
          position: "absolute",
          top: 980,
          left: 60,
          right: 60,
          backgroundColor: "rgba(10, 16, 32, 0.94)",
          border: "2px solid rgba(239, 68, 68, 0.5)",
          borderRadius: 24,
          padding: "36px 40px",
          zIndex: 30,
          boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
        }}
      >
        <div style={{ color: "#f87171", fontSize: 20, fontWeight: 900, letterSpacing: 2, marginBottom: 12 }}>
          AUDITORÍA DE SERVIDOR // ZERO LAG
        </div>
        <div style={{ fontSize: 36, fontWeight: 900, color: "#ffffff", marginBottom: 24 }}>
          ¿Por Qué NO Usar Tolvas en Slimefun?
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {[
            {
              step: "1",
              title: "Tolva Vanilla = Escaneo por Tick",
              desc: "Cada tolva busca entidades en el mundo cada 50ms (CPU Spike).",
              highlight: currentStep === 1,
              tag: "CRÍTICO",
              tagBg: "#ef4444",
            },
            {
              step: "2",
              title: "50 Tolvas = Desincronización",
              desc: "Produce drop de TPS y fallos de duplicación en inventarios.",
              highlight: currentStep === 2,
              tag: "RIESGO",
              tagBg: "#f59e0b",
            },
            {
              step: "3",
              title: "Solución: Slimefun Cargo Nodes",
              desc: "Transferencia directa en RAM con 16 canales y 20.0 TPS intactos.",
              highlight: currentStep === 3,
              tag: "ESTÁNDAR SRE",
              tagBg: "#22c55e",
            },
          ].map((item, idx) => {
            const isCurrent = item.highlight;
            return (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  backgroundColor: isCurrent ? "rgba(239, 68, 68, 0.15)" : "rgba(255, 255, 255, 0.03)",
                  border: isCurrent ? "1.5px solid #ef4444" : "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: 16,
                  padding: "16px 20px",
                  transition: "all 0.2s ease",
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    backgroundColor: isCurrent ? "#ef4444" : "rgba(255, 255, 255, 0.1)",
                    color: isCurrent ? "#ffffff" : "#94a3b8",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                    fontWeight: 900,
                  }}
                >
                  {item.step}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 22, fontWeight: 800, color: isCurrent ? "#ffffff" : "#cbd5e1" }}>
                      {item.title}
                    </span>
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 900,
                        backgroundColor: item.tagBg,
                        color: "#020617",
                        padding: "4px 10px",
                        borderRadius: 6,
                        letterSpacing: 1,
                      }}
                    >
                      {item.tag}
                    </span>
                  </div>
                  <div style={{ color: "#94a3b8", fontSize: 16, marginTop: 4 }}>
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

      {/* 7. Footer Inferior con IP & SRE Callout */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          left: 50,
          right: 50,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px solid rgba(239, 68, 68, 0.3)",
          paddingTop: 24,
          zIndex: 40,
        }}
      >
        <div>
          <div style={{ fontSize: 18, color: "#64748b", fontWeight: 800 }}>IP SERVIDOR OFICIAL</div>
          <div style={{ fontSize: 28, color: "#f87171", fontWeight: 900, letterSpacing: 1.5 }}>
            play.drakescraft.cl:25565
          </div>
        </div>

        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 18, color: "#64748b", fontWeight: 800 }}>ARQUITECTURA</div>
          <div style={{ fontSize: 24, color: "#ffffff", fontWeight: 900 }}>
            PURPUR 1.21.11 // 20.0 TPS
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
