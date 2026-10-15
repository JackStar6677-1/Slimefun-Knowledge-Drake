import React from "react";
import { AbsoluteFill, Audio, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { MovingBg } from "./Bg";
import { T } from "./std/theme";
import { BottomLoop } from "./std/Loops";
import { NetworksInteractive3D } from "./std/NetworksInteractive3D";
import { MachineGui } from "./std/MachineGui";
import { Captions } from "./std/Captions";

const FPS = 30;
const Stroke: React.CSSProperties = {
  WebkitTextStroke: "10px #000",
  paintOrder: "stroke fill",
  fontFamily: T.fontBlack,
  fontWeight: 900,
};

// Subtítulos sincronizados palabra por palabra para cada fase
const WORDS_PHASE_1 = [
  { w: "EN", t: 0.0, d: 0.4 },
  { w: "OCTUBRE", t: 0.4, d: 0.6 },
  { w: "OLVÍDATE", t: 1.0, d: 0.5 },
  { w: "DE", t: 1.5, d: 0.3 },
  { w: "LAS", t: 1.8, d: 0.3 },
  { w: "TUBERÍAS", t: 2.1, d: 0.8 },
  { w: "USA", t: 3.0, d: 0.4 },
  { w: "NETWORKS", t: 3.4, d: 0.6 },
  { w: "V6", t: 4.0, d: 0.5 },
  { w: "EN", t: 4.5, d: 0.3 },
  { w: "DRAKES", t: 4.8, d: 0.8 },
];

const WORDS_PHASE_2 = [
  { w: "PASO", t: 0.0, d: 0.4 },
  { w: "1", t: 0.4, d: 0.5 },
  { w: "COLOCA", t: 0.9, d: 0.5 },
  { w: "EL", t: 1.4, d: 0.3 },
  { w: "GRABBER", t: 1.7, d: 0.7 },
  { w: "EN", t: 2.4, d: 0.3 },
  { w: "TU", t: 2.7, d: 0.3 },
  { w: "COFRE", t: 3.0, d: 0.7 },
  { w: "PARA", t: 4.0, d: 0.4 },
  { w: "EXTRAER", t: 4.4, d: 0.8 },
  { w: "ÍTEMS", t: 5.2, d: 0.8 },
];

const WORDS_PHASE_3 = [
  { w: "PASO", t: 0.0, d: 0.4 },
  { w: "2", t: 0.4, d: 0.5 },
  { w: "COLOCA", t: 0.9, d: 0.5 },
  { w: "EL", t: 1.4, d: 0.3 },
  { w: "PUSHER", t: 1.7, d: 0.7 },
  { w: "EN", t: 2.4, d: 0.3 },
  { w: "LA", t: 2.7, d: 0.3 },
  { w: "MÁQUINA", t: 3.0, d: 0.7 },
  { w: "CON", t: 4.0, d: 0.3 },
  { w: "DIRECCIÓN", t: 4.3, d: 0.7 },
  { w: "EXACTA", t: 5.0, d: 0.8 },
];

const WORDS_PHASE_4 = [
  { w: "PASO", t: 0.0, d: 0.4 },
  { w: "3", t: 0.4, d: 0.5 },
  { w: "CONECTA", t: 0.9, d: 0.6 },
  { w: "CABLE", t: 1.5, d: 0.5 },
  { w: "Y", t: 2.0, d: 0.2 },
  { w: "BRIDGE", t: 2.2, d: 0.7 },
  { w: "FLUJO", t: 3.2, d: 0.5 },
  { w: "INSTANTÁNEO", t: 3.7, d: 0.9 },
  { w: "CERO", t: 4.8, d: 0.4 },
  { w: "LAG", t: 5.2, d: 0.8 },
];

export const NetworksReel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Fases del Reel
  const phase =
    frame < 180
      ? "intro"
      : frame < 420
      ? "grabber"
      : frame < 660
      ? "pusher"
      : "transfer";

  const guiPop = spring({
    frame: frame - 430,
    fps,
    config: { damping: 14, mass: 0.5 },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#06030c", fontFamily: T.font }}>
      {/* 1. Fondo vertical reactivo con gradiente Halloween */}
      <MovingBg vertical intensity={1.4} />

      {/* 2. Escena 3D Superior interactiva (y = 0 a 1150) */}
      <div style={{ position: "absolute", top: 110, left: 0, width: 1080, height: 1020, zIndex: 10 }}>
        <NetworksInteractive3D
          width={1080}
          height={1020}
          isHalloween={true}
          activeStep={
            phase === "intro"
              ? "connect_cable"
              : phase === "grabber"
              ? "place_grabber"
              : phase === "pusher"
              ? "place_pusher"
              : "transferring"
          }
        />
      </div>

      {/* 3. GUI Flotante de Minecraft durante la explicación de Pusher */}
      {frame >= 430 && frame < 640 && (
        <div
          style={{
            position: "absolute",
            top: 440,
            left: 240,
            transform: `scale(${Math.min(0.85, Math.max(0, guiPop))})`,
            transformOrigin: "center center",
            zIndex: 35,
            filter: "drop-shadow(0 25px 50px rgba(0,0,0,0.9))",
          }}
        >
          <MachineGui
            type="networks_directional"
            title="Network Pusher"
            subtitle="Dirección & Plantilla de Inserción"
            nodeMode="pusher"
            selectedDirection="NORTH"
            slots={{
              13: {
                id: "sf/REDSTONE_ALLOY",
                name: "Filtro de Inserción",
                amount: 1,
                isTemplate: true,
              },
            }}
          />
        </div>
      )}

      {/* 4. Barra Superior Header / Branding de Servidor */}
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
            🎃 ESPECIAL OCTUBRE
          </span>
          <span style={{ color: "#2ed573", fontSize: 24, fontWeight: 900, letterSpacing: 1.5 }}>
            DRAKES · SLIMEFUN
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

      {/* 5. Título Principal en la parte superior */}
      <div
        style={{
          position: "absolute",
          top: 130,
          left: 30,
          right: 30,
          textAlign: "center",
          zIndex: 40,
        }}
      >
        <div
          style={{
            ...Stroke,
            fontSize: 70,
            color: "#ffffff",
            lineHeight: 1.1,
          }}
        >
          {phase === "intro" && "LOGÍSTICA DIGITAL"}
          {phase === "grabber" && "1. NETWORK GRABBER"}
          {phase === "pusher" && "2. NETWORK PUSHER"}
          {phase === "transfer" && "3. PUENTE & CABLE"}
        </div>
        <div
          style={{
            ...Stroke,
            fontSize: 38,
            color: phase === "grabber" ? "#ff4757" : phase === "pusher" ? "#2ed573" : "#ffa801",
            marginTop: 8,
          }}
        >
          {phase === "intro" && "Domina Networks V6 sin tuberías"}
          {phase === "grabber" && "Extractor montado al cofre origen"}
          {phase === "pusher" && "Inserta en máquinas con dirección norte"}
          {phase === "transfer" && "Bus de datos con Bridge central de alto flujo"}
        </div>
      </div>

      {/* 6. Subtítulos Cinéticos Palabra por Palabra (Zona media: top=920) */}
      <div style={{ position: "absolute", top: 920, left: 0, right: 0, zIndex: 50 }}>
        {phase === "intro" && <Captions words={WORDS_PHASE_1} top={0} size={70} />}
        {phase === "grabber" && <Captions words={WORDS_PHASE_2} top={0} size={70} />}
        {phase === "pusher" && <Captions words={WORDS_PHASE_3} top={0} size={70} />}
        {phase === "transfer" && <Captions words={WORDS_PHASE_4} top={0} size={70} />}
      </div>

      {/* 7. Barra de Telemetría SRE / Modalidad (top=1100) */}
      <div
        style={{
          position: "absolute",
          top: 1100,
          left: 50,
          right: 50,
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
          <div style={{ fontSize: 18, color: "#a4b0be", fontWeight: 700 }}>MODALIDAD</div>
          <div style={{ fontSize: 26, fontWeight: 900, color: "#ff793f" }}>SURVIVAL V6</div>
        </div>
        <div style={{ width: 2, height: 36, backgroundColor: "rgba(255,255,255,0.2)" }} />
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 18, color: "#a4b0be", fontWeight: 700 }}>TICK RATE</div>
          <div style={{ fontSize: 26, fontWeight: 900, color: "#2ed573" }}>0.5s / TICK</div>
        </div>
        <div style={{ width: 2, height: 36, backgroundColor: "rgba(255,255,255,0.2)" }} />
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 18, color: "#a4b0be", fontWeight: 700 }}>NÚCLEO</div>
          <div style={{ fontSize: 26, fontWeight: 900, color: "#00d2d3" }}>STAR-RUST</div>
        </div>
      </div>

      {/* 8. Simulación RingLab interactiva en la mitad inferior (y = 1190 a 1920) */}
      <BottomLoop name="ring" top={1190} seed="halloween-networks" />

      {/* 9. Audio de los pasos del tutorial */}
      <Sequence from={0} durationInFrames={180}>
        <Audio src={staticFile("audio/step1_intro.mp3")} />
      </Sequence>
      <Sequence from={180} durationInFrames={240}>
        <Audio src={staticFile("audio/step2_grabber.mp3")} />
      </Sequence>
      <Sequence from={420} durationInFrames={240}>
        <Audio src={staticFile("audio/step4_pusher.mp3")} />
      </Sequence>
      <Sequence from={660} durationInFrames={240}>
        <Audio src={staticFile("audio/step5_transfer.mp3")} />
      </Sequence>

      {/* 10. CTA Final en los últimos 3 segundos (frames 810 a 900) */}
      {frame >= 810 && (
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
          <div style={{ ...Stroke, fontSize: 88, color: "#fff" }}>ÚNETE A LA RED</div>
          <div
            style={{
              marginTop: 30,
              padding: "24px 44px",
              background: "#ff793f",
              borderRadius: 20,
              fontSize: 64,
              fontWeight: 900,
              color: "#000",
              boxShadow: "0 0 50px rgba(255,121,63,0.8)",
            }}
          >
            mc.drakescraft.cl
          </div>
          <div style={{ ...Stroke, fontSize: 46, color: "#fff", marginTop: 30 }}>
            Survival Custom · Java & Bedrock
          </div>
          <div style={{ ...Stroke, fontSize: 36, color: "#ffa801", marginTop: 20 }}>
            Link en la bio ⬆
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
