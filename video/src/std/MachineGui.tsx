import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

export interface GuiSlot {
  id: string;
  name: string;
  amount?: number;
  icon?: string;
  lore?: string[];
  isTemplate?: boolean;
}

export type MachineGuiType = "networks_directional" | "cargo_node" | "mvn_filter" | "dispenser" | "crafting";

interface MachineGuiProps {
  type: MachineGuiType;
  title: string;
  subtitle?: string;
  nodeMode?: "pusher" | "grabber";
  selectedDirection?: "NORTH" | "SOUTH" | "EAST" | "WEST" | "UP" | "DOWN";
  activeChannel?: number; // Only for cargo_node!
  mvnMode?: "WHITELIST" | "BLACKLIST";
  slots?: Record<number, GuiSlot>;
  cursorAnimation?: {
    fromSlot: number;
    toSlot: number;
    startFrame: number;
    durationFrames: number;
    itemName: string;
  };
  style?: React.CSSProperties;
}

const slotBase: React.CSSProperties = {
  width: 52,
  height: 52,
  backgroundColor: "#8b8b8b",
  borderTop: "3px solid #373737",
  borderLeft: "3px solid #373737",
  borderRight: "3px solid #ffffff",
  borderBottom: "3px solid #ffffff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  boxSizing: "border-box",
  imageRendering: "pixelated",
};

export const MachineGui: React.FC<MachineGuiProps> = ({
  type,
  title,
  subtitle,
  nodeMode = "grabber",
  selectedDirection = "NORTH",
  activeChannel = 0,
  mvnMode = "WHITELIST",
  slots = {},
  cursorAnimation,
  style,
}) => {
  const frame = useCurrentFrame();

  const cursorProgress = cursorAnimation
    ? interpolate(
        frame,
        [cursorAnimation.startFrame, cursorAnimation.startFrame + cursorAnimation.durationFrames],
        [0, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      )
    : 0;

  const isHoldingItem = cursorProgress > 0.15 && cursorProgress < 0.85;

  return (
    <div
      style={{
        backgroundColor: "#c6c6c6",
        borderTop: "6px solid #ffffff",
        borderLeft: "6px solid #ffffff",
        borderRight: "6px solid #555555",
        borderBottom: "6px solid #555555",
        padding: "20px 24px",
        borderRadius: 6,
        boxShadow: "0 25px 70px rgba(0,0,0,0.85)",
        fontFamily: "'Segoe UI', 'DejaVu Sans', sans-serif",
        color: "#3f3f3f",
        position: "relative",
        userSelect: "none",
        width: 530,
        ...style,
      }}
    >
      {/* Encabezado */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 24, fontWeight: "900", color: "#222222", textShadow: "1px 1px #ffffff" }}>
            {title}
          </div>
          {subtitle && <div style={{ fontSize: 14, color: "#555555", fontWeight: "600" }}>{subtitle}</div>}
        </div>

        {/* Badge de tipo de sistema */}
        {type === "networks_directional" && (
          <div
            style={{
              backgroundColor: nodeMode === "grabber" ? "#c0392b" : "#27ae60",
              color: "#ffffff",
              padding: "5px 12px",
              borderRadius: 4,
              fontSize: 13,
              fontWeight: "900",
              letterSpacing: 1,
              textTransform: "uppercase",
              boxShadow: "inset 0 2px 4px rgba(0,0,0,0.4)",
            }}
          >
            NETWORKS · {nodeMode === "grabber" ? "GRABBER" : "PUSHER"}
          </div>
        )}

        {type === "cargo_node" && (
          <div
            style={{
              backgroundColor: "#2980b9",
              color: "#ffffff",
              padding: "5px 12px",
              borderRadius: 4,
              fontSize: 13,
              fontWeight: "900",
              letterSpacing: 1,
              textTransform: "uppercase",
              boxShadow: "inset 0 2px 4px rgba(0,0,0,0.4)",
            }}
          >
            SF CARGO · CANALES
          </div>
        )}

        {type === "mvn_filter" && (
          <div
            style={{
              backgroundColor: "#8e44ad",
              color: "#ffffff",
              padding: "5px 12px",
              borderRadius: 4,
              fontSize: 13,
              fontWeight: "900",
              letterSpacing: 1,
              textTransform: "uppercase",
              boxShadow: "inset 0 2px 4px rgba(0,0,0,0.4)",
            }}
          >
            MULTIVERSENETS · CHAGUI
          </div>
        )}
      </div>

      {/* --- CASO 1: NETWORKS V6 (DIRECCIONAL + TEMPLATE) --- */}
      {type === "networks_directional" && (
        <div>
          <div
            style={{
              backgroundColor: "#b0b0b0",
              border: "2px solid #555",
              borderRadius: 4,
              padding: "8px 12px",
              marginBottom: 12,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 14,
              fontWeight: "700",
            }}
          >
            <span>🧭 Cara Adyacente Seleccionada:</span>
            <span
              style={{
                backgroundColor: "#222",
                color: "#2ecc71",
                padding: "3px 10px",
                borderRadius: 4,
                fontFamily: "monospace",
                fontWeight: "900",
                fontSize: 16,
              }}
            >
              {selectedDirection}
            </span>
          </div>

          {/* Grid de 9x5 para Networks Directional */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(9, 52px)",
              gap: 4,
              justifyContent: "center",
              backgroundColor: "#8b8b8b",
              padding: 8,
              borderTop: "3px solid #373737",
              borderLeft: "3px solid #373737",
              borderRight: "3px solid #ffffff",
              borderBottom: "3px solid #ffffff",
            }}
          >
            {Array.from({ length: 45 }).map((_, idx) => {
              // Slots de direcciones NetworksDirectional
              const isNorth = idx === 11 || idx === 12;
              const isSouth = idx === 29 || idx === 30;
              const isWest = idx === 19 || idx === 20;
              const isEast = idx === 21 || idx === 22;
              const isUp = idx === 14 || idx === 15;
              const isDown = idx === 32 || idx === 33;

              // Template slots en Pusher
              const isTemplateSlot = nodeMode === "pusher" && (idx === 25 || idx === 34);
              const isTemplateLabel = nodeMode === "pusher" && idx === 16;

              let content: React.ReactNode = null;
              let bg = "#8b8b8b";
              let borderActive = false;

              if (idx === 11) {
                content = <span style={{ fontSize: 13, fontWeight: "900", color: selectedDirection === "NORTH" ? "#2ecc71" : "#fff" }}>N</span>;
                borderActive = selectedDirection === "NORTH";
              } else if (idx === 29) {
                content = <span style={{ fontSize: 13, fontWeight: "900", color: selectedDirection === "SOUTH" ? "#2ecc71" : "#fff" }}>S</span>;
                borderActive = selectedDirection === "SOUTH";
              } else if (idx === 19) {
                content = <span style={{ fontSize: 13, fontWeight: "900", color: selectedDirection === "WEST" ? "#2ecc71" : "#fff" }}>W</span>;
                borderActive = selectedDirection === "WEST";
              } else if (idx === 21) {
                content = <span style={{ fontSize: 13, fontWeight: "900", color: selectedDirection === "EAST" ? "#2ecc71" : "#fff" }}>E</span>;
                borderActive = selectedDirection === "EAST";
              } else if (idx === 14) {
                content = <span style={{ fontSize: 13, fontWeight: "900", color: selectedDirection === "UP" ? "#2ecc71" : "#fff" }}>UP</span>;
                borderActive = selectedDirection === "UP";
              } else if (idx === 32) {
                content = <span style={{ fontSize: 13, fontWeight: "900", color: selectedDirection === "DOWN" ? "#2ecc71" : "#fff" }}>DN</span>;
                borderActive = selectedDirection === "DOWN";
              } else if (isTemplateLabel) {
                content = <span style={{ fontSize: 11, fontWeight: "900", color: "#3498db" }}>TPL</span>;
              } else if (isTemplateSlot) {
                bg = "#2980b9";
                if (slots[idx]) {
                  content = (
                    <div style={{ textAlign: "center" }}>
                      <span style={{ fontSize: 24 }}>⛏️</span>
                    </div>
                  );
                }
              }

              return (
                <div
                  key={idx}
                  style={{
                    ...slotBase,
                    backgroundColor: borderActive ? "#1b4332" : bg,
                    border: borderActive ? "3px solid #2ecc71" : slotBase.borderTop,
                    boxShadow: borderActive ? "0 0 10px #2ecc71" : "none",
                  }}
                >
                  {content}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* --- CASO 2: SLIMEFUN CARGO (SELECTOR DE CANALES NUMÉRICOS 0-15) --- */}
      {type === "cargo_node" && (
        <div>
          <div
            style={{
              backgroundColor: "#2c3e50",
              border: "3px solid #1a252f",
              borderRadius: 6,
              padding: "10px 16px",
              marginBottom: 14,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ color: "#ecf0f1", fontWeight: "700", fontSize: 15 }}>
              CANAL DE TRANSPORTE:
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  backgroundColor: "#34495e",
                  color: "#00d2d3",
                  padding: "4px 12px",
                  borderRadius: 4,
                  fontSize: 16,
                  fontWeight: "900",
                  border: "2px solid #00d2d3",
                }}
              >
                ◀ Prev
              </div>
              <div
                style={{
                  backgroundColor: "#000",
                  color: "#00d2d3",
                  padding: "6px 16px",
                  borderRadius: 4,
                  fontSize: 20,
                  fontWeight: "900",
                  fontFamily: "monospace",
                  border: "2px solid #00d2d3",
                }}
              >
                Canal {activeChannel}
              </div>
              <div
                style={{
                  backgroundColor: "#34495e",
                  color: "#00d2d3",
                  padding: "4px 12px",
                  borderRadius: 4,
                  fontSize: 16,
                  fontWeight: "900",
                  border: "2px solid #00d2d3",
                }}
              >
                Next ▶
              </div>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(9, 52px)",
              gap: 4,
              justifyContent: "center",
              backgroundColor: "#8b8b8b",
              padding: 8,
              borderTop: "3px solid #373737",
              borderLeft: "3px solid #373737",
              borderRight: "3px solid #ffffff",
              borderBottom: "3px solid #ffffff",
            }}
          >
            {Array.from({ length: 18 }).map((_, idx) => (
              <div key={idx} style={slotBase}>
                {slots[idx] && <span style={{ fontSize: 24 }}>📦</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- CASO 3: MULTIVERSENETS (CHAGUI68 FILTER MENU 27 SLOTS) --- */}
      {type === "mvn_filter" && (
        <div>
          <div
            style={{
              backgroundColor: "#3d1e6d",
              border: "2px solid #230e42",
              borderRadius: 6,
              padding: "8px 14px",
              marginBottom: 12,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              color: "#fff",
            }}
          >
            <span style={{ fontSize: 14, fontWeight: "700" }}>Multiverse Filter (27 Slots):</span>
            <span
              style={{
                backgroundColor: mvnMode === "WHITELIST" ? "#27ae60" : "#c0392b",
                padding: "3px 12px",
                borderRadius: 4,
                fontSize: 13,
                fontWeight: "900",
              }}
            >
              MODO: {mvnMode}
            </span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(9, 52px)",
              gap: 4,
              justifyContent: "center",
              backgroundColor: "#8b8b8b",
              padding: 8,
              borderTop: "3px solid #373737",
              borderLeft: "3px solid #373737",
              borderRight: "3px solid #ffffff",
              borderBottom: "3px solid #ffffff",
            }}
          >
            {Array.from({ length: 27 }).map((_, idx) => {
              let label: React.ReactNode = null;
              let bg = "#8b8b8b";

              if (idx < 17) {
                // Slots 0-16: Ghost filter
                if (slots[idx]) label = <span style={{ fontSize: 22 }}>🧱</span>;
              } else if (idx === 17) {
                // Mode Toggle
                label = <span style={{ fontSize: 11, fontWeight: "900", color: mvnMode === "WHITELIST" ? "#2ecc71" : "#e74c3c" }}>MODE</span>;
                bg = mvnMode === "WHITELIST" ? "#1e4d2b" : "#5c1d1d";
              } else if (idx >= 18 && idx <= 23) {
                // Caras direccionales
                const faces = ["DN", "UP", "N", "S", "W", "E"];
                label = <span style={{ fontSize: 11, fontWeight: "900", color: "#f1c40f" }}>{faces[idx - 18]}</span>;
              } else if (idx === 24) {
                label = <span style={{ fontSize: 10, fontWeight: "900", color: "#3498db" }}>ALL</span>;
              } else if (idx === 25) {
                label = <span style={{ fontSize: 10, fontWeight: "900", color: "#e74c3c" }}>CLR</span>;
              } else if (idx === 26) {
                label = <span style={{ fontSize: 11, fontWeight: "900", color: "#9b59b6" }}>HELP</span>;
              }

              return (
                <div key={idx} style={{ ...slotBase, backgroundColor: bg }}>
                  {label}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Cursor interactivo */}
      {cursorAnimation && (
        <div
          style={{
            position: "absolute",
            left: `${interpolate(cursorProgress, [0, 1], [30, 75])}%`,
            top: `${interpolate(cursorProgress, [0, 1], [40, 70])}%`,
            pointerEvents: "none",
            transform: "translate(-8px, -8px)",
            zIndex: 100,
          }}
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 3L10.5 21L13.5 13.5L21 10.5L3 3Z"
              fill="#ffffff"
              stroke="#000000"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
          </svg>
          {isHoldingItem && (
            <div
              style={{
                position: "absolute",
                left: 20,
                top: 20,
                backgroundColor: "rgba(0,0,0,0.9)",
                color: "#2ecc71",
                padding: "4px 10px",
                borderRadius: 4,
                fontSize: 15,
                fontWeight: "bold",
                whiteSpace: "nowrap",
                border: "1px solid #2ecc71",
                boxShadow: "0 4px 12px rgba(0,0,0,0.6)",
              }}
            >
              {cursorAnimation.itemName}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

