import React, { useMemo } from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { T } from "./theme";
import { Captions } from "./Captions";
import { SatisfyingPhysicsWidget } from "./SatisfyingPhysicsWidget";

interface Word {
  w: string;
  t: number;
  d: number;
}

interface MasterclassLayoutProps {
  frame: number;
  chapterNumber: number;
  seriesTitle: string;
  chapterTitle: string;
  badge?: string;
  serverIp?: string;
  sceneIndex: number;
  totalScenes: number;
  quote?: string;
  captionWords?: Word[];
  audioSrc?: string;
  bgMusicVolume?: number;
  leftContent: React.ReactNode;
  right3DContent: React.ReactNode;
}

const SF_BG_ITEMS = [
  "ENERGY_REGULATOR", "ELECTRIC_SMELTERY", "CARGO_NODE", "NUCLEAR_REACTOR",
  "RAINBOW_RUNE", "GPS_TRANSMITTER", "ANCIENT_ALTAR", "SOLAR_GENERATOR"
];

export const StandardMasterclassBackground: React.FC<{ frame: number }> = ({ frame }) => {
  const items = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      x: (i * 115 + 25) % 1260,
      speed: 0.9 + (i % 3) * 0.45,
      rotSpeed: 0.02 + (i % 4) * 0.012,
      size: 32 + (i % 3) * 12,
      opacity: 0.12 + (i % 3) * 0.05,
      name: SF_BG_ITEMS[i % SF_BG_ITEMS.length]
    }));
  }, []);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 2 }}>
      {/* 1. Fondo degradado técnico espacial */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 75% 30%, #0d2232 0%, #06111b 55%, #02060a 100%)",
        }}
      />

      {/* 2. Grid de terminal en perspectiva animado */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(16, 185, 129, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.06) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          backgroundPosition: `${(frame * 0.4) % 48}px ${(frame * 0.8) % 48}px`,
          opacity: 0.75,
        }}
      />

      {/* 3. Resplandor ambiental de profundidad */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          right: "15%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, rgba(0,0,0,0) 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          left: "10%",
          width: 450,
          height: 450,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(56, 189, 248, 0.06) 0%, rgba(0,0,0,0) 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* 4. Ítems flotantes de Slimefun */}
      {items.map((it) => {
        const y = ((frame * it.speed + it.id * 130) % 800) - 70;
        const rot = frame * it.rotSpeed * 45;
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
              filter: "drop-shadow(0 0 8px rgba(16, 185, 129, 0.35))",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 6,
                backgroundColor: "rgba(15, 23, 42, 0.75)",
                border: "1px solid rgba(16, 185, 129, 0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#34d399",
                fontSize: 9,
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

export const MasterclassLayout: React.FC<MasterclassLayoutProps> = ({
  frame,
  chapterNumber,
  seriesTitle,
  chapterTitle,
  badge = "MC 1.21.x · VANILLA",
  serverIp = "PLAY.DRAKESCRAFT.CL:25565",
  sceneIndex,
  totalScenes,
  quote = "En DrakesCraft, el verdadero progreso industrial se construye bloque a bloque.",
  captionWords = [],
  audioSrc,
  bgMusicVolume = 0.12,
  leftContent,
  right3DContent,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#02060a", fontFamily: T.font, color: "#ffffff", width: 1280, height: 720 }}>
      {/* 1. Fondo Animado Estandarizado (Cyber Grid + Slimefun Floating Items + Nebula Glow) */}
      <StandardMasterclassBackground frame={frame} />

      {/* 2. Header Superior Estandarizado */}
      <div
        style={{
          position: "absolute",
          top: 18,
          left: 40,
          right: 250,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1.5px solid rgba(16, 185, 129, 0.3)",
          paddingBottom: 10,
          zIndex: 40,
        }}
      >
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div
            style={{
              backgroundColor: "rgba(16, 185, 129, 0.2)",
              border: "1px solid #10b981",
              borderRadius: 6,
              padding: "4px 12px",
              color: "#34d399",
              fontWeight: 900,
              fontSize: 13,
              letterSpacing: 1.5,
            }}
          >
            {seriesTitle.toUpperCase()}
          </div>
          <div style={{ color: "#ffffff", fontSize: 14, fontWeight: 900, letterSpacing: 1 }}>
            CAPÍTULO {chapterNumber} // {chapterTitle.toUpperCase()}
          </div>
          <div
            style={{
              backgroundColor: "rgba(34, 197, 94, 0.15)",
              border: "1px solid #22c55e",
              borderRadius: 4,
              padding: "3px 8px",
              color: "#4ade80",
              fontWeight: 800,
              fontSize: 11,
            }}
          >
            20.0 TPS · ZERO LAG
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div
            style={{
              backgroundColor: "rgba(15, 23, 42, 0.8)",
              border: "1px solid rgba(16, 185, 129, 0.4)",
              borderRadius: 6,
              padding: "3px 10px",
              color: "#34d399",
              fontWeight: 800,
              fontSize: 11,
            }}
          >
            {badge}
          </div>
          <div
            style={{
              backgroundColor: "rgba(15, 23, 42, 0.9)",
              border: "1px solid #38bdf8",
              borderRadius: 6,
              padding: "3px 10px",
              color: "#38bdf8",
              fontWeight: 900,
              fontSize: 12,
              fontFamily: "monospace",
              boxShadow: "0 0 10px rgba(56, 189, 248, 0.2)",
            }}
          >
            {serverIp}
          </div>
        </div>
      </div>

      {/* 3. Widget de Física Real con Círculos y Bolas (Esquina Superior Derecha) */}
      <div style={{ position: "absolute", top: 14, right: 35, zIndex: 50 }}>
        <SatisfyingPhysicsWidget width={195} height={100} compact={true} />
      </div>

      {/* 4. Contenedor Principal en Dos Columnas */}
      <div
        style={{
          position: "absolute",
          top: 82,
          left: 40,
          right: 40,
          bottom: 115,
          display: "grid",
          gridTemplateColumns: "1.22fr 1fr",
          gap: 24,
          zIndex: 30,
        }}
      >
        {/* Columna Izquierda: Panel Explicativo / GUIs / Comandos */}
        <div
          style={{
            backgroundColor: "rgba(10, 18, 30, 0.88)",
            border: "1.5px solid rgba(16, 185, 129, 0.35)",
            borderRadius: 18,
            padding: "20px 24px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxShadow: "0 15px 40px rgba(0,0,0,0.7)",
            backdropFilter: "blur(14px)",
            overflow: "hidden",
          }}
        >
          {leftContent}

          {quote && (
            <div style={{ color: "#6ee7b7", fontSize: 13, fontWeight: 700, borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 10 }}>
              "{quote}"
            </div>
          )}
        </div>

        {/* Columna Derecha: Escena 3D Holográfica con Steve y Máquinas */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(10, 18, 30, 0.65)",
            border: "1.5px solid rgba(16, 185, 129, 0.25)",
            borderRadius: 18,
            boxShadow: "0 15px 40px rgba(0,0,0,0.7), inset 0 0 25px rgba(16, 185, 129, 0.08)",
            backdropFilter: "blur(14px)",
            overflow: "hidden",
          }}
        >
          {right3DContent}
        </div>
      </div>

      {/* 5. Subtítulos Cinéticos Inferiores Sincronizados */}
      <div
        style={{
          position: "absolute",
          bottom: 22,
          left: 40,
          right: 170,
          minHeight: 75,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 45,
        }}
      >
        {captionWords.length > 0 && <Captions words={captionWords} top={0} size={28} />}
      </div>

      {/* 6. Indicador de Parte / Progreso */}
      <div
        style={{
          position: "absolute",
          bottom: 32,
          right: 40,
          backgroundColor: "rgba(10, 18, 30, 0.9)",
          border: "1px solid rgba(16, 185, 129, 0.4)",
          borderRadius: 8,
          padding: "5px 12px",
          color: "#34d399",
          fontWeight: 900,
          fontSize: 13,
          fontFamily: "monospace",
          zIndex: 45,
        }}
      >
        PARTE {sceneIndex + 1} / {totalScenes}
      </div>

      {/* 7. Audio de Fondo Lo-Fi Continuo */}
      <Audio src={staticFile("audio/bg_tech_chill.wav")} volume={bgMusicVolume} loop />

      {/* 8. Pista de Voz Oficial */}
      {audioSrc && <Audio src={staticFile(audioSrc)} />}
    </AbsoluteFill>
  );
};
