import React, { useMemo } from "react";
import { AbsoluteFill, Audio, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { MovingBg } from "./Bg";
import { T } from "./std/theme";
import { BottomLoop } from "./std/Loops";
import { Steve3D, SteveAction } from "./std/Steve3D";
import { Captions } from "./std/Captions";
import { ThreeCanvas } from "@remotion/three";
import * as THREE from "three";
import storyboardData from "./presentation-storyboard.json";

const Stroke: React.CSSProperties = {
  WebkitTextStroke: "10px #000",
  paintOrder: "stroke fill",
  fontFamily: T.fontBlack,
  fontWeight: 900,
};

// Mapeo de subtítulos de las 5 secciones desde el JSON generado
const P1_WORDS = storyboardData.sections[0].words.map((w) => ({ w: w.word, t: w.start, d: w.duration }));
const P2_WORDS = storyboardData.sections[1].words.map((w) => ({ w: w.word, t: w.start, d: w.duration }));
const P3_WORDS = storyboardData.sections[2].words.map((w) => ({ w: w.word, t: w.start, d: w.duration }));
const P4_WORDS = storyboardData.sections[3].words.map((w) => ({ w: w.word, t: w.start, d: w.duration }));
const P5_WORDS = storyboardData.sections[4].words.map((w) => ({ w: w.word, t: w.start, d: w.duration }));

// Escena 3D Superior con Jack hablando, interactuando y mostrando tecnología
const JackPresenter3D: React.FC<{ frame: number; phase: string }> = ({ frame, phase }) => {
  // Comportamiento dinámico de Jack según la fase
  const { pos, rot, action } = useMemo(() => {
    if (phase === "hook") {
      // Hablando al público de frente, gesticulando
      return {
        pos: [0, -0.15, 1.3] as [number, number, number],
        rot: [0, Math.sin(frame * 0.05) * 0.12, 0] as [number, number, number],
        action: "interact" as SteveAction,
      };
    }
    if (phase === "tech") {
      // Caminando hacia la izquierda para mostrar los bloques tecnológicos
      const t = (frame - 350) / 270;
      const x = -0.5 + Math.sin(t * Math.PI) * 0.4;
      return {
        pos: [x, -0.15, 1.2] as [number, number, number],
        rot: [0, 0.35, 0] as [number, number, number],
        action: "walk" as SteveAction,
      };
    }
    if (phase === "season2") {
      // Mirando hacia el horizonte con pose triunfal
      return {
        pos: [0.3, -0.15, 1.25] as [number, number, number],
        rot: [0, -0.25, 0] as [number, number, number],
        action: "idle" as SteveAction,
      };
    }
    if (phase === "tutorials") {
      // Sosteniendo herramienta y mostrando bloques
      return {
        pos: [-0.2, -0.15, 1.3] as [number, number, number],
        rot: [0, 0.15, 0] as [number, number, number],
        action: "place_block" as SteveAction,
      };
    }
    // CTA: Celebración enérgica
    return {
      pos: [0, -0.15, 1.25] as [number, number, number],
      rot: [0, Math.sin(frame * 0.08) * 0.18, 0] as [number, number, number],
      action: "interact" as SteveAction,
    };
  }, [frame, phase]);

  return (
    <ThreeCanvas
      width={1080}
      height={1000}
      camera={{ position: [0, 1.8, 4.3], fov: 42 }}
      gl={{ alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={1.1} color="#ffffff" />
      <directionalLight position={[4, 8, 4]} intensity={1.5} color="#ffd32a" />
      <directionalLight position={[-4, 4, -2]} intensity={0.7} color="#00d2d3" />

      {/* Partículas flotantes tecnológicas */}
      {Array.from({ length: 24 }).map((_, i) => {
        const seed = i * 149.2;
        const x = ((Math.sin(seed) * 1000) % 6) - 3.0;
        const y = (((Math.cos(seed) * 1000) % 3) + 3) % 2.5 + 0.4;
        const z = ((Math.sin(seed * 2) * 1000) % 4) - 2.0;
        const yOff = Math.sin(frame * 0.06 + i) * 0.15;
        return (
          <mesh key={i} position={[x, y + yOff, z]}>
            <boxGeometry args={[0.04, 0.04, 0.04]} />
            <meshBasicMaterial color={i % 2 === 0 ? "#ffd32a" : "#00d2d3"} />
          </mesh>
        );
      })}

      <group position={[0, -0.3, 0]}>
        {/* Suelo de piedra de cantería */}
        <group position={[0, -0.5, 0]}>
          {[-2, -1, 0, 1, 2].map((bx) =>
            [-1, 0, 1].map((bz) => (
              <mesh key={`${bx}_${bz}`} position={[bx * 0.98, 0, bz * 0.98]}>
                <boxGeometry args={[0.96, 0.96, 0.96]} />
                <meshLambertMaterial color="#2f3640" />
              </mesh>
            ))
          )}
        </group>

        {/* Tubos de cristal tecnológico Networks V6 de fondo */}
        <group position={[0, 0.5, -0.8]}>
          <mesh position={[-1.2, 0, 0]}>
            <boxGeometry args={[1.2, 0.35, 0.35]} />
            <meshLambertMaterial color="#00d2d3" transparent opacity={0.6} />
          </mesh>
          <mesh position={[-1.2, 0, 0]}>
            <boxGeometry args={[1.2, 0.12, 0.12]} />
            <meshBasicMaterial color="#00ffff" />
          </mesh>
          <mesh position={[1.2, 0, 0]}>
            <boxGeometry args={[1.2, 0.35, 0.35]} />
            <meshLambertMaterial color="#00d2d3" transparent opacity={0.6} />
          </mesh>
          <mesh position={[1.2, 0, 0]}>
            <boxGeometry args={[1.2, 0.12, 0.12]} />
            <meshBasicMaterial color="#00ffff" />
          </mesh>
          {/* Nodo central púrpura */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.48, 0.48, 0.48]} />
            <meshLambertMaterial color="#9b59b6" transparent opacity={0.7} />
          </mesh>
          <pointLight color="#00d2d3" intensity={1.4} distance={3.0} />
        </group>

        {/* JackStar 3D Avatar */}
        <Steve3D
          position={pos}
          rotation={rot}
          scale={0.96}
          action={action}
          heldItemMaterial={phase === "tutorials" ? "PUSHER" : undefined}
          skinFolder="jack_parts"
        />
      </group>
    </ThreeCanvas>
  );
};

export const PresentationShort: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 5 Fases exactas
  const phase =
    frame < 360
      ? "hook"
      : frame < 620
      ? "tech"
      : frame < 905
      ? "season2"
      : frame < 1100
      ? "tutorials"
      : "cta";

  return (
    <AbsoluteFill style={{ backgroundColor: "#06030c", fontFamily: T.font }}>
      {/* 1. Fondo vertical reactivo con gradiente */}
      <MovingBg vertical intensity={1.5} />

      {/* 2. Escena 3D Superior interactiva de Jack (y = 0 a 1120) */}
      <div style={{ position: "absolute", top: 120, left: 0, width: 1080, height: 1000, zIndex: 10 }}>
        <JackPresenter3D frame={frame} phase={phase} />
      </div>

      {/* 3. Header de Marca y Estado de Servidor */}
      <div
        style={{
          position: "absolute",
          top: 45,
          left: 40,
          right: 40,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 40,
        }}
      >
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span
            style={{
              backgroundColor: "#ff793f",
              color: "#000000",
              fontWeight: 900,
              fontSize: 22,
              padding: "8px 18px",
              borderRadius: 8,
              letterSpacing: 2,
            }}
          >
            👑 JACK · DUEÑO DE DRAKES
          </span>
          <span style={{ color: "#2ed573", fontSize: 24, fontWeight: 900, letterSpacing: 1.5 }}>
            DRAKES · 1.21.11
          </span>
        </div>
        <div
          style={{
            backgroundColor: "rgba(10,5,20,0.85)",
            border: "3px solid #ff793f",
            borderRadius: 8,
            padding: "8px 18px",
            color: "#ff793f",
            fontWeight: 900,
            fontSize: 22,
          }}
        >
          mc.drakescraft.cl
        </div>
      </div>

      {/* 4. Título Principal en la parte superior */}
      <div
        style={{
          position: "absolute",
          top: 135,
          left: 30,
          right: 30,
          textAlign: "center",
          zIndex: 40,
        }}
      >
        <div
          style={{
            ...Stroke,
            fontSize: 66,
            color: "#ffffff",
            lineHeight: 1.1,
          }}
        >
          {phase === "hook" && "¿SLIMEFUN ESTABA MUERTO?"}
          {phase === "tech" && "CLÚSTER SRE AUTOMATIZADO"}
          {phase === "season2" && "PRONTA TEMPORADA 2"}
          {phase === "tutorials" && "NUEVA SERIE DE TUTORIALES"}
          {phase === "cta" && "¡ÚNETE A DRAKES!"}
        </div>
        <div
          style={{
            ...Stroke,
            fontSize: 36,
            color:
              phase === "hook"
                ? "#2ed573"
                : phase === "tech"
                ? "#00d2d3"
                : phase === "season2"
                ? "#ffd32a"
                : phase === "tutorials"
                ? "#ff793f"
                : "#2ed573",
            marginTop: 8,
          }}
        >
          {phase === "hook" && "Revivido en la 1.21.11 con +80 Addons"}
          {phase === "tech" && "Cero Lag · Cero Pérdidas de Ítems"}
          {phase === "season2" && "Gran Lanzamiento a Mediados de 2027"}
          {phase === "tutorials" && "Aprende Automatización Extrema"}
          {phase === "cta" && "Java & Bedrock (Puerto 25565)"}
        </div>
      </div>

      {/* 5. Subtítulos Cinéticos Palabra por Palabra (y = 920) */}
      <div style={{ position: "absolute", top: 920, left: 0, right: 0, zIndex: 50 }}>
        {phase === "hook" && <Captions words={P1_WORDS} top={0} size={66} />}
        {phase === "tech" && <Captions words={P2_WORDS} top={0} size={66} />}
        {phase === "season2" && <Captions words={P3_WORDS} top={0} size={66} />}
        {phase === "tutorials" && <Captions words={P4_WORDS} top={0} size={66} />}
        {phase === "cta" && <Captions words={P5_WORDS} top={0} size={66} />}
      </div>

      {/* 6. Barra de Telemetría SRE / Servidor (y = 1110) */}
      <div
        style={{
          position: "absolute",
          top: 1110,
          left: 40,
          right: 40,
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          zIndex: 40,
          backgroundColor: "rgba(10,5,20,0.85)",
          border: "2px solid rgba(255,121,63,0.6)",
          borderRadius: 14,
          padding: "12px 20px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 16, color: "#a4b0be", fontWeight: 700 }}>INFRAESTRUCTURA</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: "#00d2d3" }}>SRE AUTO</div>
        </div>
        <div style={{ width: 2, height: 34, backgroundColor: "rgba(255,255,255,0.2)" }} />
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 16, color: "#a4b0be", fontWeight: 700 }}>EXPANSIONES</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: "#2ed573" }}>+80 ADDONS</div>
        </div>
        <div style={{ width: 2, height: 34, backgroundColor: "rgba(255,255,255,0.2)" }} />
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 16, color: "#a4b0be", fontWeight: 700 }}>BEDROCK PORT</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: "#ff793f" }}>25565</div>
        </div>
      </div>

      {/* 7. Simulación Destructiva Satisfactoria (y = 1195 a 1920) con 100% de bloques rotos al final */}
      <BottomLoop name="satisfying_breaker" top={1195} seed="drakescraft-presentation" />

      {/* 8. Música Lo-Fi Tecnológica de fondo suave */}
      <Sequence from={0} durationInFrames={1440}>
        <Audio src={staticFile("audio/bg_tech_chill.wav")} volume={0.15} />
      </Sequence>

      {/* 9. Pistas de Voz de Jack */}
      <Sequence from={0} durationInFrames={360}>
        <Audio src={staticFile("audio/pres_p1_hook.mp3")} />
      </Sequence>
      <Sequence from={360} durationInFrames={260}>
        <Audio src={staticFile("audio/pres_p2_tech.mp3")} />
      </Sequence>
      <Sequence from={620} durationInFrames={285}>
        <Audio src={staticFile("audio/pres_p3_season2.mp3")} />
      </Sequence>
      <Sequence from={905} durationInFrames={195}>
        <Audio src={staticFile("audio/pres_p4_tutorials.mp3")} />
      </Sequence>
      <Sequence from={1100} durationInFrames={340}>
        <Audio src={staticFile("audio/pres_p5_cta.mp3")} />
      </Sequence>

      {/* 10. CTA Final en los últimos 3.5 segundos (frames 1330 a 1440) */}
      {frame >= 1330 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(6,3,12,0.92)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 70,
          }}
        >
          <div style={{ ...Stroke, fontSize: 80, color: "#fff" }}>¡ENTRA AHORA!</div>
          <div
            style={{
              marginTop: 24,
              padding: "20px 40px",
              background: "#ff793f",
              borderRadius: 20,
              fontSize: 56,
              fontWeight: 900,
              color: "#000",
              boxShadow: "0 0 50px rgba(255,121,63,0.8)",
            }}
          >
            mc.drakescraft.cl
          </div>
          <div style={{ ...Stroke, fontSize: 38, color: "#fff", marginTop: 24 }}>
            Java & Bedrock · Puerto: 25565
          </div>
          <div style={{ ...Stroke, fontSize: 32, color: "#00d2d3", marginTop: 12 }}>
            Web & Comandos: drakescraft.cl
          </div>
          <div style={{ ...Stroke, fontSize: 28, color: "#ffd32a", marginTop: 24 }}>
            ¡Suscríbete para la serie de tutoriales!
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
