import React, { useMemo } from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { MovingBg } from "./Bg";
import { T } from "./std/theme";
import { Steve3D, SteveAction } from "./std/Steve3D";
import { Captions } from "./std/Captions";
import { ThreeCanvas } from "@remotion/three";
import { SatisfyingPhysicsWidget } from "./std/SatisfyingPhysicsWidget";
import shortData from "./short-sf-cargo-rules.json";

export const SF_CARGO_RULES_FRAMES = shortData.frames;

const CAPTION_WORDS = shortData.words.map((w: any) => ({
  w: w.word,
  t: w.start,
  d: w.duration,
}));

export const ShortSfCargoRules: React.FC = () => {
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
  const currentStep = Math.min(3, Math.max(1, Math.floor((frame - 60) / 380) + 1));

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
              backgroundColor: "#38bdf8",
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
            SRE ARCHITECTURE
          </span>
        </div>

        <div
          style={{
            backgroundColor: "rgba(56, 189, 248, 0.2)",
            border: "1.5px solid #38bdf8",
            borderRadius: 20,
            padding: "6px 16px",
            color: "#38bdf8",
            fontWeight: 900,
            fontSize: 20,
          }}
        >
          CARGO SRE
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
          <pointLight position={[-3, 2, 2]} color="#38bdf8" intensity={2.4} distance={8} />
          <pointLight position={[3, -1, 1]} color="#818cf8" intensity={1.6} distance={6} />

          {/* Pedestal tech flotante */}
          <mesh position={[0, -0.9, 0]}>
            <cylinderGeometry args={[1.3, 1.45, 0.15, 32]} />
            <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.8} />
          </mesh>
          <mesh position={[0, -0.81, 0]}>
            <cylinderGeometry args={[1.25, 1.25, 0.02, 32]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>

          <group position={[0, -0.15, 0]}>
            <Steve3D
              position={pos}
              rotation={rot}
              scale={0.62}
              action={action}
              skinFolder="skins_parts/skin_06_parts"
            />
          </group>
        </ThreeCanvas>
      </div>

      {/* Widget Viral de Entretenimiento y Física: Bola destruyendo círculos con telemetría */}
      <div style={{ position: "absolute", top: 130, right: 50, zIndex: 35 }}>
        <SatisfyingPhysicsWidget width={370} height={370} />
      </div>

      {/* 5. Tarjeta Central Holográfica: 3 Reglas SRE de Carga */}
      <div
        style={{
          position: "absolute",
          top: 980,
          left: 60,
          right: 60,
          backgroundColor: "rgba(10, 16, 32, 0.94)",
          border: "2px solid rgba(56, 189, 248, 0.5)",
          borderRadius: 24,
          padding: "36px 40px",
          zIndex: 30,
          boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
        }}
      >
        <div style={{ color: "#38bdf8", fontSize: 20, fontWeight: 900, letterSpacing: 2, marginBottom: 12 }}>
          INDUSTRIAL PIPELINE // ZERO LAG
        </div>
        <div style={{ fontSize: 36, fontWeight: 900, color: "#ffffff", marginBottom: 24 }}>
          SRE Rules for Slimefun Cargo
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {[
            {
              step: "1",
              title: "Zero Feedback Loops",
              desc: "Never loop cables back into sources. Stops recursive BFS tree walking.",
              highlight: currentStep === 1,
              tag: "RULE #1",
              tagBg: "#38bdf8",
            },
            {
              step: "2",
              title: "16-Channel Segregation",
              desc: "Ch 0: Raw Ores | Ch 1: Dusts | Ch 2: Ingots. Total frequency isolation.",
              highlight: currentStep === 2,
              tag: "RULE #2",
              tagBg: "#818cf8",
            },
            {
              step: "3",
              title: "Round-Robin Crafter Output",
              desc: "Evenly balances load across multi-block autocrafters without buffer lock.",
              highlight: currentStep === 3,
              tag: "RULE #3",
              tagBg: "#4ade80",
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
                  backgroundColor: isCurrent ? "rgba(56, 189, 248, 0.15)" : "rgba(255, 255, 255, 0.03)",
                  border: isCurrent ? "1.5px solid #38bdf8" : "1px solid rgba(255, 255, 255, 0.08)",
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
                    backgroundColor: isCurrent ? "#38bdf8" : "rgba(255, 255, 255, 0.1)",
                    color: isCurrent ? "#020617" : "#94a3b8",
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
          borderTop: "1px solid rgba(56, 189, 248, 0.3)",
          paddingTop: 24,
          zIndex: 40,
        }}
      >
        <div>
          <div style={{ fontSize: 18, color: "#64748b", fontWeight: 800 }}>OFFICIAL SERVER IP</div>
          <div style={{ fontSize: 28, color: "#38bdf8", fontWeight: 900, letterSpacing: 1.5 }}>
            play.drakescraft.cl:25565
          </div>
        </div>

        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 18, color: "#64748b", fontWeight: 800 }}>INFRASTRUCTURE</div>
          <div style={{ fontSize: 24, color: "#ffffff", fontWeight: 900 }}>
            PURPUR 1.21.11 // 20.0 TPS
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
