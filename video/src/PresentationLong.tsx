import React, { useMemo } from "react";
import { AbsoluteFill, Audio, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { T } from "./std/theme";
import { Steve3D, SteveAction } from "./std/Steve3D";
import { Captions } from "./std/Captions";
import { ThreeCanvas } from "@remotion/three";
import * as THREE from "three";
import storyboardData from "./long-presentation-storyboard.json";

// Estilo de texto con trazo
const Stroke: React.CSSProperties = {
  WebkitTextStroke: "6px #000",
  paintOrder: "stroke fill",
  fontFamily: T.fontBlack,
  fontWeight: 900,
};

// Secciones del storyboard largo
const S1 = storyboardData.sections[0]; // intro (18.00s -> ~540 frames)
const S2 = storyboardData.sections[1]; // slimefun (25.51s -> ~765 frames)
const S3 = storyboardData.sections[2]; // sre (17.83s -> ~535 frames)
const S4 = storyboardData.sections[3]; // season2 (15.24s -> ~457 frames)
const S5 = storyboardData.sections[4]; // tutorials_cta (17.09s -> ~513 frames)

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
export const TOTAL_LONG_FRAMES = T5 + F5 + 90; // +3s outro

const P1_WORDS = S1.words.map((w: any) => ({ w: w.word, t: w.start, d: w.duration }));
const P2_WORDS = S2.words.map((w: any) => ({ w: w.word, t: w.start, d: w.duration }));
const P3_WORDS = S3.words.map((w: any) => ({ w: w.word, t: w.start, d: w.duration }));
const P4_WORDS = S4.words.map((w: any) => ({ w: w.word, t: w.start, d: w.duration }));
const P5_WORDS = S5.words.map((w: any) => ({ w: w.word, t: w.start, d: w.duration }));

// Avatar 3D de Jack en formato 16:9
const JackPresenterHorizontal3D: React.FC<{ frame: number; phase: string }> = ({ frame, phase }) => {
  const { pos, rot, action } = useMemo(() => {
    if (phase === "intro") {
      return {
        pos: [-0.65, -0.2, 1.3] as [number, number, number],
        rot: [0, 0.28 + Math.sin(frame * 0.04) * 0.08, 0] as [number, number, number],
        action: "interact" as SteveAction,
      };
    }
    if (phase === "slimefun") {
      return {
        pos: [-0.75, -0.2, 1.25] as [number, number, number],
        rot: [0, 0.35, 0] as [number, number, number],
        action: "walk" as SteveAction,
      };
    }
    if (phase === "sre") {
      return {
        pos: [-0.6, -0.2, 1.35] as [number, number, number],
        rot: [0, 0.2, 0] as [number, number, number],
        action: "interact" as SteveAction,
      };
    }
    if (phase === "season2") {
      return {
        pos: [-0.65, -0.2, 1.3] as [number, number, number],
        rot: [0, 0.25, 0] as [number, number, number],
        action: "idle" as SteveAction,
      };
    }
    return {
      pos: [-0.65, -0.2, 1.3] as [number, number, number],
      rot: [0, 0.15, 0] as [number, number, number],
      action: "interact" as SteveAction,
    };
  }, [frame, phase]);

  return (
    <ThreeCanvas
      width={1920}
      height={1080}
      camera={{ position: [0, 0.8, 3.2], fov: 36 }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={1.1} />
      <directionalLight position={[3, 5, 4]} intensity={1.5} color="#ffffff" />
      <pointLight position={[-2, 2, 2]} color="#ff793f" intensity={1.8} distance={6} />
      <pointLight position={[2, -1, 1]} color="#00d2d3" intensity={1.5} distance={5} />

      <group position={[0, -0.2, 0]}>
        <Steve3D
          position={pos}
          rotation={rot}
          scale={0.95}
          action={action}
          heldItemMaterial={phase === "slimefun" ? "PUSHER" : undefined}
          skinFolder="jack_parts"
        />
      </group>
    </ThreeCanvas>
  );
};

export const PresentationLong: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const phase =
    frame < T2
      ? "intro"
      : frame < T3
      ? "slimefun"
      : frame < T4
      ? "sre"
      : frame < T5
      ? "season2"
      : "tutorials_cta";

  const currentSection =
    phase === "intro"
      ? S1
      : phase === "slimefun"
      ? S2
      : phase === "sre"
      ? S3
      : phase === "season2"
      ? S4
      : S5;

  return (
    <AbsoluteFill style={{ backgroundColor: "#06030c", fontFamily: T.font, color: "#ffffff" }}>
      {/* Fondo degradado horizontal deep tech */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 70% 40%, #150d2a 0%, #080412 60%, #030107 100%)",
        }}
      />

      {/* Grid sutil de fondo */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255, 121, 63, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 121, 63, 0.05) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          opacity: 0.6,
        }}
      />

      {/* Escena 3D de Jack en la mitad izquierda */}
      <div style={{ position: "absolute", inset: 0, zIndex: 10 }}>
        <JackPresenterHorizontal3D frame={frame} phase={phase} />
      </div>

      {/* Panel Superior: Marca, Versión y Red */}
      <div
        style={{
          position: "absolute",
          top: 40,
          left: 50,
          right: 50,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 40,
        }}
      >
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <span
            style={{
              backgroundColor: "#ff793f",
              color: "#000000",
              fontWeight: 900,
              fontSize: 20,
              padding: "6px 16px",
              borderRadius: 6,
              letterSpacing: 2,
            }}
          >
            👑 JACK · DUEÑO DE DRAKES
          </span>
          <span style={{ color: "#2ed573", fontSize: 22, fontWeight: 900, letterSpacing: 1.5 }}>
            DRAKES · 1.21.11
          </span>
        </div>

        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <div
            style={{
              backgroundColor: "rgba(10,5,20,0.85)",
              border: "2px solid #00d2d3",
              borderRadius: 8,
              padding: "6px 16px",
              color: "#00d2d3",
              fontWeight: 900,
              fontSize: 18,
            }}
          >
            PUERTO BEDROCK: 25565
          </div>
          <div
            style={{
              backgroundColor: "rgba(10,5,20,0.85)",
              border: "2px solid #ff793f",
              borderRadius: 8,
              padding: "6px 16px",
              color: "#ff793f",
              fontWeight: 900,
              fontSize: 18,
            }}
          >
            mc.drakescraft.cl
          </div>
        </div>
      </div>

      {/* Panel Lateral Derecho: Tarjeta Técnica Detallada (Widescreen 16:9) */}
      <div
        style={{
          position: "absolute",
          top: 140,
          right: 60,
          width: 780,
          bottom: 180,
          backgroundColor: "rgba(12, 6, 24, 0.88)",
          border: "2px solid rgba(255, 121, 63, 0.4)",
          borderRadius: 16,
          padding: "36px 40px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          zIndex: 30,
          boxShadow: "0 20px 50px rgba(0,0,0,0.7)",
        }}
      >
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <span style={{ fontSize: 16, color: "#ff793f", fontWeight: 900, letterSpacing: 3 }}>
              DOCUMENTO TÉCNICO · DRAKES
            </span>
            <span style={{ fontSize: 14, color: "#2ed573", fontWeight: 700, backgroundColor: "rgba(46,213,115,0.15)", padding: "4px 10px", borderRadius: 4 }}>
              ESTADO: OPERACIONAL
            </span>
          </div>

          <h1 style={{ ...Stroke, fontSize: 44, color: "#ffffff", lineHeight: 1.15, margin: "0 0 20px 0" }}>
            {currentSection.title}
          </h1>

          <p style={{ fontSize: 24, color: "#dcdde1", lineHeight: 1.5, fontWeight: 500, margin: 0 }}>
            {(currentSection as any).text}
          </p>
        </div>

        {/* Métricas dinámicas en la tarjeta */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 16,
            paddingTop: 24,
            borderTop: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div style={{ backgroundColor: "rgba(255,255,255,0.03)", padding: "14px 16px", borderRadius: 8 }}>
            <div style={{ fontSize: 13, color: "#a4b0be", fontWeight: 700 }}>MOTOR CORE</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#00d2d3", marginTop: 4 }}>Purpur 1.21.11</div>
          </div>
          <div style={{ backgroundColor: "rgba(255,255,255,0.03)", padding: "14px 16px", borderRadius: 8 }}>
            <div style={{ fontSize: 13, color: "#a4b0be", fontWeight: 700 }}>ECOSISTEMA SLIMEFUN</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#2ed573", marginTop: 4 }}>+80 Addons</div>
          </div>
          <div style={{ backgroundColor: "rgba(255,255,255,0.03)", padding: "14px 16px", borderRadius: 8 }}>
            <div style={{ fontSize: 13, color: "#a4b0be", fontWeight: 700 }}>PRÓXIMA META</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#ffd32a", marginTop: 4 }}>Temporada 2 (2027)</div>
          </div>
        </div>
      </div>

      {/* Subtítulos Cinéticos en la franja inferior (y = 930) */}
      <div style={{ position: "absolute", bottom: 40, left: 60, right: 60, zIndex: 50, textAlign: "center" }}>
        {phase === "intro" && <Captions words={P1_WORDS} top={0} size={42} />}
        {phase === "slimefun" && <Captions words={P2_WORDS} top={0} size={42} />}
        {phase === "sre" && <Captions words={P3_WORDS} top={0} size={42} />}
        {phase === "season2" && <Captions words={P4_WORDS} top={0} size={42} />}
        {phase === "tutorials_cta" && <Captions words={P5_WORDS} top={0} size={42} />}
      </div>

      {/* Música Lo-Fi de fondo */}
      <Sequence from={0} durationInFrames={TOTAL_LONG_FRAMES}>
        <Audio src={staticFile("audio/bg_tech_chill.wav")} volume={0.12} />
      </Sequence>

      {/* Pistas de Voz de Jack */}
      <Sequence from={T1} durationInFrames={F1}>
        <Audio src={staticFile("audio/long_p1_intro.mp3")} />
      </Sequence>
      <Sequence from={T2} durationInFrames={F2}>
        <Audio src={staticFile("audio/long_p2_slimefun.mp3")} />
      </Sequence>
      <Sequence from={T3} durationInFrames={F3}>
        <Audio src={staticFile("audio/long_p3_sre.mp3")} />
      </Sequence>
      <Sequence from={T4} durationInFrames={F4}>
        <Audio src={staticFile("audio/long_p4_season2.mp3")} />
      </Sequence>
      <Sequence from={T5} durationInFrames={F5}>
        <Audio src={staticFile("audio/long_p5_cta.mp3")} />
      </Sequence>
    </AbsoluteFill>
  );
};
