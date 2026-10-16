import React, { useMemo } from "react";
import { AbsoluteFill, Audio, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig, Img } from "remotion";
import { T } from "./std/theme";
import { Steve3D, SteveAction } from "./std/Steve3D";
import { Captions } from "./std/Captions";
import { ThreeCanvas } from "@remotion/three";
import * as THREE from "three";
import storyboardData from "./capitulo1-storyboard.json";

// Estilo de texto con trazo técnico
const Stroke: React.CSSProperties = {
  WebkitTextStroke: "6px #000",
  paintOrder: "stroke fill",
  fontFamily: T.fontBlack,
  fontWeight: 900,
};

// 5 Bloques del Storyboard
const S1 = storyboardData.sections[0]; // Bloque 1: Mito (37.46s -> 1124 frames)
const S2 = storyboardData.sections[1]; // Bloque 2: Operador (34.97s -> 1049 frames)
const S3 = storyboardData.sections[2]; // Bloque 3: Slimefun (37.42s -> 1123 frames)
const S4 = storyboardData.sections[3]; // Bloque 4: Arquitectura (30.58s -> 917 frames)
const S5 = storyboardData.sections[4]; // Bloque 5: Conclusión (26.40s -> 792 frames)

const F1 = Math.round(S1.duration * 30);
const F2 = Math.round(S2.duration * 30);
const F3 = Math.round(S3.duration * 30);
const F4 = Math.round(S4.duration * 30);
const F5 = Math.round(S5.duration * 30);

const T1 = 0;
const T2 = T1 + F1;
const T3 = T2 + F2;
const T4 = T3 + F3;
const T5 = T4 + F4;
export const TOTAL_CAPITULO1_FRAMES = T5 + F5 + 90; // ~5100 frames (~170 segundos)

const P1_WORDS = S1.words.map((w: any) => ({ w: w.word, t: w.start, d: w.duration }));
const P2_WORDS = S2.words.map((w: any) => ({ w: w.word, t: w.start, d: w.duration }));
const P3_WORDS = S3.words.map((w: any) => ({ w: w.word, t: w.start, d: w.duration }));
const P4_WORDS = S4.words.map((w: any) => ({ w: w.word, t: w.start, d: w.duration }));
const P5_WORDS = S5.words.map((w: any) => ({ w: w.word, t: w.start, d: w.duration }));

// Slimefun Floating Background Items
const SF_ITEMS = [
  "ENERGY_REGULATOR", "ELECTRIC_SMELTERY", "CARGO_NODE", "NUCLEAR_REACTOR", 
  "RAINBOW_RUNE", "GPS_TRANSMITTER", "ANCIENT_ALTAR", "SOLAR_GENERATOR"
];

const FallingSlimefunBackground: React.FC<{ frame: number }> = ({ frame }) => {
  const items = useMemo(() => {
    return Array.from({ length: 14 }).map((_, i) => ({
      id: i,
      x: (i * 140 + 40) % 1840,
      speed: 1.2 + (i % 3) * 0.6,
      rotSpeed: 0.02 + (i % 4) * 0.015,
      size: 44 + (i % 3) * 16,
      opacity: 0.15 + (i % 3) * 0.08,
      name: SF_ITEMS[i % SF_ITEMS.length]
    }));
  }, []);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 5 }}>
      {items.map((it) => {
        const y = ((frame * it.speed + it.id * 180) % 1200) - 100;
        const rot = frame * it.rotSpeed * 50;
        return (
          <div
            key={it.id}
            style={{
              position: "absolute",
              left: it.x,
              top: y,
              width: it.size,
              height: it.size,
              opacity: it.opacity,
              transform: `rotate(${rot}deg)`,
              filter: "drop-shadow(0 0 10px rgba(6, 182, 212, 0.4))",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 8,
                backgroundColor: "rgba(15, 23, 42, 0.6)",
                border: "1px solid rgba(6, 182, 212, 0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#22d3ee",
                fontSize: 10,
                fontWeight: 900,
                textAlign: "center",
                padding: 2,
              }}
            >
              SF
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Distractor Gadget en la esquina superior derecha: Bouncing Neon Kinetic Balls
const SatisfyingCornerDistractor: React.FC<{ frame: number }> = ({ frame }) => {
  const boxW = 220;
  const boxH = 120;
  
  // 3 Bolas rebotando en loop matemático continuo
  const b1x = Math.abs(((frame * 4.2) % (boxW * 2)) - boxW);
  const b1y = Math.abs(((frame * 3.4) % (boxH * 2)) - boxH);

  const b2x = Math.abs(((frame * 3.1 + 80) % (boxW * 2)) - boxW);
  const b2y = Math.abs(((frame * 4.5 + 40) % (boxH * 2)) - boxH);

  const b3x = Math.abs(((frame * 5.0 + 140) % (boxW * 2)) - boxW);
  const b3y = Math.abs(((frame * 2.8 + 90) % (boxH * 2)) - boxH);

  return (
    <div
      style={{
        position: "absolute",
        top: 35,
        right: 48,
        width: boxW,
        height: boxH,
        borderRadius: 12,
        backgroundColor: "rgba(10, 14, 26, 0.88)",
        border: "1px solid rgba(6, 182, 212, 0.4)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
        overflow: "hidden",
        zIndex: 60,
      }}
    >
      <div style={{ position: "absolute", top: 6, left: 10, fontSize: 10, color: "#64748b", fontWeight: 800, letterSpacing: 1.5 }}>
        PHYSICS ENGINE · 60 FPS
      </div>
      {/* Grid interno */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />
      {/* Bolas rebotando con glow */}
      <div
        style={{
          position: "absolute",
          left: b1x - 7,
          top: b1y - 7,
          width: 14,
          height: 14,
          borderRadius: "50%",
          backgroundColor: "#22d3ee",
          boxShadow: "0 0 12px #06b6d4",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: b2x - 8,
          top: b2y - 8,
          width: 16,
          height: 16,
          borderRadius: "50%",
          backgroundColor: "#f59e0b",
          boxShadow: "0 0 12px #d97706",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: b3x - 6,
          top: b3y - 6,
          width: 12,
          height: 12,
          borderRadius: "50%",
          backgroundColor: "#a855f7",
          boxShadow: "0 0 10px #9333ea",
        }}
      />
    </div>
  );
};

// Avatar 3D de Jack con sincronización de habla (Lip-Sync visual)
const JackPresenterWithLipSync: React.FC<{ frame: number; phase: string; isSpeaking: boolean }> = ({
  frame,
  phase,
  isSpeaking,
}) => {
  const { pos, rot, action } = useMemo(() => {
    if (phase === "bloque1_mito") {
      return {
        pos: [-0.95, -0.65, 0.8] as [number, number, number],
        rot: [0, 0.28 + Math.sin(frame * 0.03) * 0.06, 0] as [number, number, number],
        action: "interact" as SteveAction,
      };
    }
    if (phase === "bloque2_operador") {
      return {
        pos: [-0.90, -0.65, 0.8] as [number, number, number],
        rot: [0, 0.22, 0] as [number, number, number],
        action: "idle" as SteveAction,
      };
    }
    if (phase === "bloque3_slimefun") {
      return {
        pos: [-1.05, -0.65, 0.8] as [number, number, number],
        rot: [0, 0.32, 0] as [number, number, number],
        action: "walk" as SteveAction,
      };
    }
    if (phase === "bloque4_arquitectura") {
      return {
        pos: [-0.92, -0.65, 0.8] as [number, number, number],
        rot: [0, 0.25, 0] as [number, number, number],
        action: "interact" as SteveAction,
      };
    }
    return {
      pos: [-0.92, -0.65, 0.8] as [number, number, number],
      rot: [0, 0.18, 0] as [number, number, number],
      action: "interact" as SteveAction,
    };
  }, [frame, phase]);

  // Modulación de boca abierta cuando habla
  const mouthOpen = isSpeaking && Math.sin(frame * 0.9) > 0.1;

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <ThreeCanvas
        width={1920}
        height={1080}
        camera={{ position: [0, 0.45, 3.5], fov: 38 }}
        style={{ width: "100%", height: "100%" }}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[3, 5, 4]} intensity={1.7} color="#ffffff" />
        <pointLight position={[-2, 2, 2]} color="#06b6d4" intensity={2.2} distance={7} />
        <pointLight position={[2, -1, 1]} color="#f59e0b" intensity={1.6} distance={6} />

        <group position={[0, -0.1, 0]}>
          <Steve3D
            position={pos}
            rotation={rot}
            scale={0.76}
            action={action}
            heldItemMaterial={phase === "bloque3_slimefun" ? "PUSHER" : undefined}
            skinFolder="jack_parts"
          />
        </group>
      </ThreeCanvas>

      {/* Indicador de transmisión y habla de Jack */}
      <div
        style={{
          position: "absolute",
          left: 140,
          bottom: 150,
          display: "flex",
          alignItems: "center",
          gap: 12,
          backgroundColor: "rgba(10, 15, 26, 0.85)",
          border: "1px solid rgba(6, 182, 212, 0.4)",
          borderRadius: 30,
          padding: "8px 18px",
          zIndex: 40,
        }}
      >
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            backgroundColor: isSpeaking ? "#22c55e" : "#64748b",
            boxShadow: isSpeaking ? "0 0 10px #22c55e" : "none",
          }}
        />
        <span style={{ fontSize: 15, fontWeight: 800, color: "#f8fafc", letterSpacing: 1.5 }}>
          JACK · {isSpeaking ? "TRANSMITIENDO EN VIVO" : "EN ESPERA"}
        </span>
      </div>
    </div>
  );
};

export const Capitulo1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const phase =
    frame < T2
      ? "bloque1_mito"
      : frame < T3
      ? "bloque2_operador"
      : frame < T4
      ? "bloque3_slimefun"
      : frame < T5
      ? "bloque4_arquitectura"
      : "bloque5_conclusion";

  const currentSection =
    phase === "bloque1_mito"
      ? S1
      : phase === "bloque2_operador"
      ? S2
      : phase === "bloque3_slimefun"
      ? S3
      : phase === "bloque4_arquitectura"
      ? S4
      : S5;

  // Determinar si Jack está hablando en el frame actual
  const sectionStartFrame =
    phase === "bloque1_mito" ? T1 : phase === "bloque2_operador" ? T2 : phase === "bloque3_slimefun" ? T3 : phase === "bloque4_arquitectura" ? T4 : T5;
  const currentSecTime = (frame - sectionStartFrame) / fps;
  const isSpeaking = useMemo(() => {
    return currentSection.words.some(
      (w: any) => currentSecTime >= w.start && currentSecTime <= w.start + w.duration
    );
  }, [currentSecTime, currentSection]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#060911", fontFamily: T.font, color: "#ffffff" }}>
      {/* 1. Fondo degradado técnico espacial */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 75% 35%, #0d1829 0%, #070d17 60%, #030509 100%)",
        }}
      />

      {/* 2. Grid de terminal en perspectiva */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(6, 182, 212, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.05) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          opacity: 0.8,
        }}
      />

      {/* 3. Ítems flotantes de Slimefun en profundidad */}
      <FallingSlimefunBackground frame={frame} />

      {/* 4. Escena 3D de Jack a la izquierda */}
      <div style={{ position: "absolute", inset: 0, zIndex: 10 }}>
        <JackPresenterWithLipSync frame={frame} phase={phase} isSpeaking={isSpeaking} />
      </div>

      {/* 5. Header Superior: Identidad, Temporada y Enlace */}
      <div
        style={{
          position: "absolute",
          top: 35,
          left: 50,
          right: 300,
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
              fontSize: 18,
              padding: "6px 16px",
              borderRadius: 6,
              letterSpacing: 2,
            }}
          >
            DRAKESCRAFT LABS
          </span>
          <span style={{ color: "#f59e0b", fontSize: 20, fontWeight: 900, letterSpacing: 1.5 }}>
            CAPÍTULO 01 · DOCU-SERIE
          </span>
          <span style={{ color: "#22c55e", fontSize: 18, fontWeight: 800, backgroundColor: "rgba(34, 197, 94, 0.15)", padding: "4px 10px", borderRadius: 4 }}>
            20.0 TPS REAL
          </span>
        </div>

        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div
            style={{
              backgroundColor: "rgba(15, 23, 42, 0.9)",
              border: "1px solid #06b6d4",
              borderRadius: 8,
              padding: "6px 14px",
              color: "#38bdf8",
              fontWeight: 800,
              fontSize: 16,
            }}
          >
            PUERTO UNIFICADO: 25565
          </div>
          <div
            style={{
              backgroundColor: "rgba(15, 23, 42, 0.9)",
              border: "1px solid #f59e0b",
              borderRadius: 8,
              padding: "6px 14px",
              color: "#fbbf24",
              fontWeight: 800,
              fontSize: 16,
            }}
          >
            play.drakescraft.cl
          </div>
        </div>
      </div>

      {/* 6. Distractor cinético en la esquina superior derecha */}
      <SatisfyingCornerDistractor frame={frame} />

      {/* 7. Tarjeta Técnica Central / Derecha (16:9 Document View) */}
      <div
        style={{
          position: "absolute",
          top: 135,
          right: 50,
          width: 820,
          bottom: 180,
          backgroundColor: "rgba(15, 23, 42, 0.92)",
          border: "2px solid rgba(6, 182, 212, 0.45)",
          borderRadius: 20,
          padding: "36px 42px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          zIndex: 30,
          boxShadow: "0 25px 60px rgba(0,0,0,0.75)",
        }}
      >
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <span style={{ fontSize: 15, color: "#22d3ee", fontWeight: 900, letterSpacing: 3 }}>
              {currentSection.badge}
            </span>
            <span style={{ fontSize: 13, color: "#22c55e", fontWeight: 800, backgroundColor: "rgba(34, 197, 94, 0.15)", padding: "4px 10px", borderRadius: 4 }}>
              ESTABILIDAD: ÓPTIMA
            </span>
          </div>

          <h1 style={{ ...Stroke, fontSize: 44, color: "#ffffff", lineHeight: 1.15, margin: "0 0 10px 0" }}>
            {currentSection.title}
          </h1>

          <div style={{ fontSize: 20, color: "#94a3b8", fontWeight: 700, marginBottom: 18 }}>
            {currentSection.subtitle}
          </div>

          <p style={{ fontSize: 22, color: "#e2e8f0", lineHeight: 1.5, fontWeight: 500, margin: 0 }}>
            {currentSection.text}
          </p>
        </div>

        {/* Telemetría Spark JVM en la tarjeta */}
        <div
          style={{
            backgroundColor: "rgba(2, 6, 23, 0.8)",
            border: "1px solid rgba(51, 65, 85, 0.8)",
            borderRadius: 12,
            padding: "16px 20px",
            marginTop: 18,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#64748b", fontWeight: 800, marginBottom: 8 }}>
            <span>TELEMETRÍA EN VIVO · SPARK PROFILER</span>
            <span style={{ color: "#22c55e" }}>PRESUPUESTO 50.0ms // 18.4ms P99</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
            <div>
              <div style={{ fontSize: 11, color: "#94a3b8" }}>CONCURRENCIA</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: "#38bdf8" }}>84+ Addons</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#94a3b8" }}>RECOLECCIÓN</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: "#22c55e" }}>ZGC Generacional</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#94a3b8" }}>PERSISTENCIA</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: "#fbbf24" }}>Cero Rollbacks</div>
            </div>
          </div>
        </div>
      </div>

      {/* 8. Subtítulos Cinéticos en la franja inferior */}
      <div style={{ position: "absolute", bottom: 40, left: 60, right: 60, zIndex: 50, textAlign: "center" }}>
        {phase === "bloque1_mito" && <Captions words={P1_WORDS} top={0} size={42} />}
        {phase === "bloque2_operador" && <Captions words={P2_WORDS} top={0} size={42} />}
        {phase === "bloque3_slimefun" && <Captions words={P3_WORDS} top={0} size={42} />}
        {phase === "bloque4_arquitectura" && <Captions words={P4_WORDS} top={0} size={42} />}
        {phase === "bloque5_conclusion" && <Captions words={P5_WORDS} top={0} size={42} />}
      </div>

      {/* 9. Música Lo-Fi de fondo */}
      <Sequence from={0} durationInFrames={TOTAL_CAPITULO1_FRAMES}>
        <Audio src={staticFile("audio/bg_tech_chill.wav")} volume={0.11} loop />
      </Sequence>

      {/* 10. Pistas de Voz del Capítulo 1 */}
      <Sequence from={T1} durationInFrames={F1}>
        <Audio src={staticFile("audio/cap1_b1_mito.mp3")} />
      </Sequence>
      <Sequence from={T2} durationInFrames={F2}>
        <Audio src={staticFile("audio/cap1_b2_operador.mp3")} />
      </Sequence>
      <Sequence from={T3} durationInFrames={F3}>
        <Audio src={staticFile("audio/cap1_b3_slimefun.mp3")} />
      </Sequence>
      <Sequence from={T4} durationInFrames={F4}>
        <Audio src={staticFile("audio/cap1_b4_arquitectura.mp3")} />
      </Sequence>
      <Sequence from={T5} durationInFrames={F5}>
        <Audio src={staticFile("audio/cap1_b5_conclusion.mp3")} />
      </Sequence>
    </AbsoluteFill>
  );
};
