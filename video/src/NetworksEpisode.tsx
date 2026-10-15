import React from "react";
import { AbsoluteFill, Audio, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { NetworksInteractive3D } from "./std/NetworksInteractive3D";
import { MachineGui } from "./std/MachineGui";
import { T } from "./std/theme";

export const NetworksEpisode: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const step =
    frame < 180
      ? "intro"
      : frame < 330
      ? "place_grabber"
      : frame < 550
      ? "gui_grabber"
      : frame < 720
      ? "place_pusher"
      : "transferring";

  const guiScale = spring({
    frame: frame - 330,
    fps,
    config: { damping: 14, mass: 0.5 },
  });

  const pusherGuiScale = spring({
    frame: frame - 550,
    fps,
    config: { damping: 14, mass: 0.5 },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#07120e", fontFamily: "'DejaVu Sans', 'Ubuntu Sans', sans-serif" }}>
      {/* Pistas de audio narrativo sincronizadas con edge-tts */}
      <Sequence from={0} durationInFrames={180}>
        <Audio src={staticFile("audio/step1_intro.mp3")} />
      </Sequence>
      <Sequence from={180} durationInFrames={150}>
        <Audio src={staticFile("audio/step2_grabber.mp3")} />
      </Sequence>
      <Sequence from={330} durationInFrames={220}>
        <Audio src={staticFile("audio/step3_gui_grabber.mp3")} />
      </Sequence>
      <Sequence from={550} durationInFrames={170}>
        <Audio src={staticFile("audio/step4_pusher.mp3")} />
      </Sequence>
      <Sequence from={720} durationInFrames={180}>
        <Audio src={staticFile("audio/step5_transfer.mp3")} />
      </Sequence>

      {/* Fondo ambiental Halloween oscuro y misterioso */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at 50% 30%, #201335 0%, #0d071a 50%, #05020a 100%)",
        }}
      />

      {/* Escena 3D central interactiva con JackStar y los bloques */}
      <div style={{ position: "absolute", inset: 0 }}>
        <NetworksInteractive3D
          width={width}
          height={height}
          isHalloween={true}
          activeStep={
            step === "place_grabber"
              ? "place_grabber"
              : step === "place_pusher"
              ? "place_pusher"
              : step === "gui_grabber"
              ? "connect_cable"
              : "transferring"
          }
        />
      </div>

      {/* Cabecera / Título */}
      <div
        style={{
          position: "absolute",
          top: 40,
          left: 60,
          right: 60,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 30,
        }}
      >
        <div>
          <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 8 }}>
            <span
              style={{
                backgroundColor: "#ff793f",
                color: "#000000",
                fontWeight: "900",
                fontSize: 18,
                padding: "6px 16px",
                borderRadius: 6,
                letterSpacing: 2,
                textTransform: "uppercase",
              }}
            >
              🎃 ESPECIAL OCTUBRE
            </span>
            <span style={{ color: "#2ed573", fontSize: 22, fontWeight: "900", letterSpacing: 1.5 }}>
              NETWORKS V6 · SLIMEFUN
            </span>
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: 54,
              fontWeight: "900",
              color: "#ffffff",
              textShadow: "0 4px 16px rgba(0,0,0,0.9)",
              letterSpacing: -0.5,
            }}
          >
            Cómo conectar Pusher & Grabber
          </h1>
        </div>
        <div
          style={{
            backgroundColor: "rgba(10,5,20,0.85)",
            border: "3px solid #ff793f",
            borderRadius: 10,
            padding: "12px 26px",
            color: "#ff793f",
            fontWeight: "900",
            fontSize: 26,
            letterSpacing: 1.5,
            boxShadow: "0 0 25px rgba(255,121,63,0.4)",
          }}
        >
          mc.drakescraft.cl
        </div>
      </div>

      {/* Overlay de la GUI de Minecraft flotante: Grabber */}
      {frame >= 330 && frame < 550 && (
        <div
          style={{
            position: "absolute",
            right: 50,
            top: 130,
            transform: `scale(${Math.min(1, Math.max(0, guiScale))})`,
            transformOrigin: "center center",
            zIndex: 50,
          }}
        >
          <MachineGui
            type="networks_directional"
            title="Network Grabber"
            subtitle="Extrayendo del Bloque Adyacente"
            nodeMode="grabber"
            selectedDirection="NORTH"
            cursorAnimation={{
              fromSlot: 0,
              toSlot: 11,
              startFrame: 350,
              durationFrames: 60,
              itemName: "Cara: NORTH",
            }}
          />
        </div>
      )}

      {/* Overlay de la GUI de Minecraft flotante: Pusher con Template Slot */}
      {frame >= 550 && frame < 720 && (
        <div
          style={{
            position: "absolute",
            left: 50,
            top: 130,
            transform: `scale(${Math.min(1, Math.max(0, pusherGuiScale))})`,
            transformOrigin: "center center",
            zIndex: 50,
          }}
        >
          <MachineGui
            type="networks_directional"
            title="Network Pusher"
            subtitle="Insertando según Plantilla (Template)"
            nodeMode="pusher"
            selectedDirection="EAST"
            slots={{
              25: { id: "IRON_ORE", name: "Iron Ore", amount: 1 },
            }}
            cursorAnimation={{
              fromSlot: 40,
              toSlot: 25,
              startFrame: 570,
              durationFrames: 50,
              itemName: "Template: Iron Ore",
            }}
          />
        </div>
      )}

      {/* Barra de paso / Explicación inferior */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          left: 60,
          right: 60,
          backgroundColor: "rgba(5, 15, 11, 0.94)",
          backdropFilter: "blur(16px)",
          border: "3px solid rgba(46, 213, 115, 0.5)",
          borderRadius: 16,
          padding: "20px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: 30,
          boxShadow: "0 12px 40px rgba(0,0,0,0.85)",
        }}
      >
        <div style={{ maxWidth: 1350 }}>
          <div style={{ color: "#2ed573", fontSize: 18, fontWeight: "900", textTransform: "uppercase", letterSpacing: 2 }}>
            {step === "intro" && "Paso 1 · El Concepto"}
            {step === "place_grabber" && "Paso 2 · Extracción (Network Grabber)"}
            {step === "gui_grabber" && "Paso 3 · Brújula Direccional (Sin Canales)"}
            {step === "place_pusher" && "Paso 4 · Inserción Filtrada (Network Pusher)"}
            {step === "transferring" && "Paso 5 · Red Digital Unificada 100% Sin Lag"}
          </div>
          <div style={{ color: "#ffffff", fontSize: 28, fontWeight: "700", marginTop: 6, lineHeight: 1.25 }}>
            {step === "intro" && "Olvídate de tolvas lentas: mueve miles de ítems por segundo con una red digital centralizada."}
            {step === "place_grabber" && "Coloca el Network Grabber pegado al cofre o máquina desde donde quieras SACAR ítems."}
            {step === "gui_grabber" && "Abre su menú: marca la cara adyacente (ej. NORTH). ¡Networks no usa canales, todo va directo a la red!"}
            {step === "place_pusher" && "En destino, coloca el Pusher, elige su dirección y configura los slots de plantilla (Template)."}
            {step === "transferring" && "¡Listo! Conecta cables al Network Controller y los ítems viajarán instantáneamente."}
          </div>
        </div>

        {/* Indicadores de pasos */}
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {["Paso 1", "Paso 2", "Paso 3", "Paso 4", "Paso 5"].map((p, idx) => {
            const activeIdx = ["intro", "place_grabber", "gui_grabber", "place_pusher", "transferring"].indexOf(step);
            return (
              <div
                key={p}
                style={{
                  width: idx === activeIdx ? 54 : 28,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: idx <= activeIdx ? "#2ed573" : "rgba(255,255,255,0.25)",
                  boxShadow: idx === activeIdx ? "0 0 14px #2ed573" : "none",
                  transition: "all 0.3s ease",
                }}
              />
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
