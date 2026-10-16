import React, { useMemo } from "react";
import { useCurrentFrame } from "remotion";

interface Props {
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}

export const SatisfyingPhysicsWidget: React.FC<Props> = ({
  width = 380,
  height = 380,
  style,
}) => {
  const frame = useCurrentFrame();

  // Simulación determinista de física basada en frame
  const { ball, rings, stats, particles } = useMemo(() => {
    // Parámetros de la simulación
    const cx = 190;
    const cy = 190;
    const ringRadii = [150, 115, 80, 45];
    const ringSegments = [12, 10, 8, 6];

    // Trayectoria orbital caótica/rebotante determinista
    const t = frame * 0.12;
    const speed = 14 + Math.sin(frame * 0.05) * 4;
    const angle = t * 1.7 + Math.sin(t * 0.8) * 2.2;
    const r = Math.abs(Math.sin(t * 0.95)) * 140;

    const bx = cx + Math.cos(angle) * r;
    const by = cy + Math.sin(angle) * r;

    // Cálculo de velocidad y física
    const vx = -Math.sin(angle) * speed + Math.cos(angle) * 3;
    const vy = Math.cos(angle) * speed + Math.sin(angle) * 3;
    const vMag = Math.sqrt(vx * vx + vy * vy);
    const energy = 0.5 * 1.2 * vMag * vMag;
    const thetaDeg = Math.round(((Math.atan2(vy, vx) * 180) / Math.PI + 360) % 360);

    // Segmentos destruidos a lo largo del tiempo
    const totalHits = Math.floor(frame / 6);
    const ringsData = ringRadii.map((radius, rIdx) => {
      const segCount = ringSegments[rIdx];
      const segments = [];
      const arcLen = (2 * Math.PI) / segCount;
      for (let s = 0; s < segCount; s++) {
        const segAngle = s * arcLen;
        const hitThreshold = (rIdx * 10 + s * 4);
        const isBroken = totalHits > hitThreshold;
        segments.push({
          angle: segAngle,
          arcLen,
          isBroken,
          id: `${rIdx}-${s}`,
        });
      }
      return { radius, segments };
    });

    // Partículas de impacto
    const pList = [];
    for (let i = 0; i < 8; i++) {
      const pAngle = (i / 8) * Math.PI * 2 + frame * 0.2;
      const pDist = ((frame * 3 + i * 5) % 30);
      pList.push({
        x: bx + Math.cos(pAngle) * pDist,
        y: by + Math.sin(pAngle) * pDist,
        opacity: Math.max(0, 1 - pDist / 30),
      });
    }

    return {
      ball: { x: bx, y: by, vx, vy, vMag },
      rings: ringsData,
      stats: {
        vx: vx.toFixed(2),
        vy: vy.toFixed(2),
        vMag: vMag.toFixed(2),
        theta: thetaDeg,
        energy: energy.toFixed(1),
        hits: totalHits,
      },
      particles: pList,
    };
  }, [frame]);

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: "rgba(10, 15, 30, 0.92)",
        border: "2px solid rgba(56, 189, 248, 0.4)",
        borderRadius: 20,
        padding: 12,
        boxSizing: "border-box",
        boxShadow: "0 10px 30px rgba(0,0,0,0.7), inset 0 0 20px rgba(56,189,248,0.1)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backdropFilter: "blur(12px)",
        ...style,
      }}
    >
      {/* Header del Widget */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#ef4444", animation: "pulse 1s infinite" }} />
          <span style={{ color: "#38bdf8", fontSize: 13, fontWeight: 900, letterSpacing: 1.5, fontFamily: "monospace" }}>
            PHYSICS DYNAMICS
          </span>
        </div>
        <span style={{ color: "#4ade80", fontSize: 12, fontWeight: 800, fontFamily: "monospace" }}>
          HITS: {stats.hits}
        </span>
      </div>

      {/* SVG del Arena de Círculos Destructibles */}
      <div style={{ position: "relative", width: "100%", height: 260, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <svg width="340" height="260" viewBox="0 0 380 380">
          {/* Anillos concéntricos y arcos destruibles */}
          {rings.map((ring, rIdx) => {
            const colors = ["#ef4444", "#f59e0b", "#3b82f6", "#10b981"];
            const strokeColor = colors[rIdx % colors.length];
            return ring.segments.map((seg) => {
              if (seg.isBroken) return null;
              const startX = 190 + Math.cos(seg.angle) * ring.radius;
              const startY = 190 + Math.sin(seg.angle) * ring.radius;
              const endX = 190 + Math.cos(seg.angle + seg.arcLen * 0.85) * ring.radius;
              const endY = 190 + Math.sin(seg.angle + seg.arcLen * 0.85) * ring.radius;
              return (
                <path
                  key={seg.id}
                  d={`M ${startX} ${startY} A ${ring.radius} ${ring.radius} 0 0 1 ${endX} ${endY}`}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth="5"
                  strokeLinecap="round"
                  opacity={0.85}
                />
              );
            });
          })}

          {/* Partículas de impacto */}
          {particles.map((p, idx) => (
            <circle
              key={idx}
              cx={p.x}
              cy={p.y}
              r="2.5"
              fill="#38bdf8"
              opacity={p.opacity}
            />
          ))}

          {/* Trayectoria vectorial de la bola */}
          <line
            x1={ball.x}
            y1={ball.y}
            x2={ball.x + ball.vx * 3}
            y2={ball.y + ball.vy * 3}
            stroke="#f43f5e"
            strokeWidth="2"
            strokeDasharray="3,3"
          />

          {/* Bola destructora con aura brillante */}
          <circle cx={ball.x} cy={ball.y} r="9" fill="#ffffff" filter="drop-shadow(0 0 6px #38bdf8)" />
          <circle cx={ball.x} cy={ball.y} r="14" fill="none" stroke="#38bdf8" strokeWidth="2" opacity={0.6} />
        </svg>
      </div>

      {/* Panel Inferior de Cálculos Matemáticos en Vivo */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 6,
          backgroundColor: "rgba(15, 23, 42, 0.75)",
          borderRadius: 10,
          padding: "6px 10px",
          border: "1px solid rgba(255,255,255,0.06)",
          fontFamily: "monospace",
          fontSize: 11,
        }}
      >
        <div style={{ color: "#94a3b8" }}>
          v: <span style={{ color: "#38bdf8", fontWeight: 700 }}>{stats.vMag} m/s</span>
        </div>
        <div style={{ color: "#94a3b8" }}>
          θ: <span style={{ color: "#facc15", fontWeight: 700 }}>{stats.theta}°</span>
        </div>
        <div style={{ color: "#94a3b8" }}>
          Ek: <span style={{ color: "#4ade80", fontWeight: 700 }}>{stats.energy} J</span>
        </div>
        <div style={{ color: "#94a3b8" }}>
          Δv: <span style={{ color: "#f43f5e", fontWeight: 700 }}>({stats.vx}, {stats.vy})</span>
        </div>
      </div>
    </div>
  );
};
