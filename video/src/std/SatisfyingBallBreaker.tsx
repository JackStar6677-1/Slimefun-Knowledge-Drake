import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

interface Props {
  w: number;
  h: number;
  seed?: string;
  totalDuration?: number;
}

interface BlockSeg {
  id: number;
  ring: number;
  angle0: number;
  angle1: number;
  radius: number;
  breakFrame: number;
  color: string;
}

export const SatisfyingBallBreaker: React.FC<Props> = ({ w, h, seed = "drakes", totalDuration }) => {
  const frame = useCurrentFrame();
  const config = useVideoConfig();
  const duration = totalDuration || config.durationInFrames || 900;

  const cx = w * 0.65;
  const cy = h * 0.50;
  const maxR = Math.min(w * 0.45, h * 0.44);

  // Generar 5 anillos concéntricos con destrucción 100% sincronizada al fin del video
  const { blocks, totalBlocks } = React.useMemo(() => {
    const ringCounts = [14, 22, 30, 38, 46];
    const ringRadii = [0.28, 0.46, 0.64, 0.82, 1.0].map((r) => r * maxR);
    const colors = ["#ff4757", "#ffa502", "#2ed573", "#1e90ff", "#9b59b6"];

    const all: BlockSeg[] = [];
    let id = 0;

    // Distribuir el quiebre exacto de todos los bloques desde frame 15 hasta duration - 35
    const startBreak = 15;
    const endBreak = duration - 35;
    const totalCount = ringCounts.reduce((a, b) => a + b, 0);

    ringCounts.forEach((count, rIdx) => {
      const radius = ringRadii[rIdx];
      const color = colors[rIdx];
      const step = (Math.PI * 2) / count;

      for (let i = 0; i < count; i++) {
        // Orden de quiebre desde el anillo interior hacia el exterior con algo de dispersión
        const progressInTotal = (all.length / totalCount);
        const breakF = Math.round(interpolate(progressInTotal, [0, 1], [startBreak, endBreak]));

        all.push({
          id: id++,
          ring: rIdx,
          angle0: i * step,
          angle1: (i + 1) * step - 0.04, // pequeño gap entre bloques
          radius,
          breakFrame: breakF,
          color,
        });
      }
    });

    return { blocks: all, totalBlocks: all.length };
  }, [duration, maxR]);

  // Contar bloques destruidos vs vivos en el frame actual
  const brokenCount = blocks.filter((b) => frame >= b.breakFrame).length;
  const aliveCount = totalBlocks - brokenCount;
  const pct = Math.min(100, Math.round((brokenCount / totalBlocks) * 100));

  // 3 bolas dinámicas rebotando
  const balls = React.useMemo(() => {
    return [
      { color: "#ffd32a", size: 14, speedMult: 1.0, offset: 0 },
      { color: "#00d2d3", size: 12, speedMult: 1.35, offset: Math.PI * 0.66 },
      { color: "#ff3838", size: 11, speedMult: 1.6, offset: Math.PI * 1.33 },
    ];
  }, []);

  // Calcular posiciones cinéticas de las bolas
  const ballPositions = balls.map((b) => {
    // La bola oscila y orbita expandiéndose a medida que los anillos ceden
    const activeRadius = interpolate(pct, [0, 100], [maxR * 0.25, maxR * 0.95]);
    const ang = (frame * 0.08 * b.speedMult + b.offset) % (Math.PI * 2);
    const bounce = Math.abs(Math.sin(frame * 0.15 * b.speedMult)) * activeRadius;
    const bx = cx + Math.cos(ang) * bounce;
    const by = cy + Math.sin(ang) * bounce;
    return { ...b, x: bx, y: by };
  });

  return (
    <div style={{ position: "relative", width: w, height: h, overflow: "hidden", background: "radial-gradient(circle at 65% 50%, #0d131f 0%, #06090e 100%)" }}>
      <svg width={w} height={h} style={{ position: "absolute", inset: 0 }}>
        {/* Anillos y bloques */}
        {blocks.map((b) => {
          const isBroken = frame >= b.breakFrame;
          const dt = frame - b.breakFrame;

          // Si ya se destruyó hace más de 12 frames, desaparece
          if (isBroken && dt > 12) return null;

          const expand = isBroken ? 1 + (dt / 12) * 0.25 : 1;
          const r = b.radius * expand;
          const opacity = isBroken ? Math.max(0, 1 - dt / 12) : 1;

          const x1 = cx + Math.cos(b.angle0) * r;
          const y1 = cy + Math.sin(b.angle0) * r;
          const x2 = cx + Math.cos(b.angle1) * r;
          const y2 = cy + Math.sin(b.angle1) * r;

          return (
            <path
              key={b.id}
              d={`M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`}
              fill="none"
              stroke={b.color}
              strokeWidth={isBroken ? 14 : 9}
              strokeLinecap="round"
              opacity={opacity}
              style={{
                filter: isBroken ? `drop-shadow(0 0 12px ${b.color})` : "none",
              }}
            />
          );
        })}

        {/* Bolas rebotantes con estela */}
        {ballPositions.map((b, i) => (
          <g key={i}>
            {/* Resplandor */}
            <circle cx={b.x} cy={b.y} r={b.size * 2} fill={b.color} opacity={0.25} />
            {/* Núcleo de la bola */}
            <circle cx={b.x} cy={b.y} r={b.size} fill="#ffffff" stroke={b.color} strokeWidth={4} />
          </g>
        ))}

        {/* Celebración de 100% destruido al final */}
        {pct === 100 && (
          <g transform={`translate(${cx}, ${cy})`}>
            <circle r={maxR * 0.7} fill="none" stroke="#ffd32a" strokeWidth={6} strokeDasharray="16 12" opacity={0.8} />
            <text
              textAnchor="middle"
              y={10}
              fill="#ffd32a"
              fontSize={32}
              fontWeight={900}
              fontFamily="Consolas, monospace"
              style={{ filter: "drop-shadow(0 0 16px rgba(255,211,42,0.9))" }}
            >
              ★ 100% COMPLETADO ★
            </text>
          </g>
        )}
      </svg>

      {/* Panel HUD de Telemetría a la izquierda (x = 20) */}
      <div
        style={{
          position: "absolute",
          left: 20,
          top: 20,
          bottom: 20,
          width: 320,
          backgroundColor: "rgba(6, 12, 18, 0.88)",
          border: "2px solid rgba(0, 210, 211, 0.5)",
          borderRadius: 14,
          padding: "16px 20px",
          fontFamily: "Consolas, monospace",
          color: "#e0f2fe",
          boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div style={{ color: "#ffd32a", fontSize: 18, fontWeight: 900, marginBottom: 8, letterSpacing: 1 }}>
            DESTRUCTOR PROGRESIVO
          </div>
          <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 16 }}>
            Bolas: 3 Colisiones Activas
          </div>

          <div style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 700 }}>
              <span>PROGRESO</span>
              <span style={{ color: pct === 100 ? "#2ed573" : "#00d2d3" }}>{pct}%</span>
            </div>
            {/* Barra de progreso */}
            <div style={{ height: 12, backgroundColor: "#1e293b", borderRadius: 6, overflow: "hidden", marginTop: 6 }}>
              <div
                style={{
                  height: "100%",
                  width: `${pct}%`,
                  backgroundColor: pct === 100 ? "#2ed573" : "#00d2d3",
                  transition: "width 0.1s linear",
                  boxShadow: pct === 100 ? "0 0 12px #2ed573" : "0 0 8px #00d2d3",
                }}
              />
            </div>
          </div>

          <div style={{ fontSize: 13, display: "flex", justifyContent: "space-between", margin: "6px 0" }}>
            <span style={{ color: "#94a3b8" }}>Bloques Rotos:</span>
            <span style={{ fontWeight: 700, color: "#fff" }}>{brokenCount} / {totalBlocks}</span>
          </div>

          <div style={{ fontSize: 13, display: "flex", justifyContent: "space-between", margin: "6px 0" }}>
            <span style={{ color: "#94a3b8" }}>Restantes:</span>
            <span style={{ fontWeight: 700, color: aliveCount === 0 ? "#2ed573" : "#ff4757" }}>
              {aliveCount}
            </span>
          </div>

          <div style={{ fontSize: 13, display: "flex", justifyContent: "space-between", margin: "6px 0" }}>
            <span style={{ color: "#94a3b8" }}>Frecuencia de Choque:</span>
            <span style={{ fontWeight: 700, color: "#ffa502" }}>{(24 + pct * 0.8).toFixed(1)} Hz</span>
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: 10, fontSize: 12 }}>
          <div style={{ color: pct === 100 ? "#2ed573" : "#38bdf8", fontWeight: 700 }}>
            {pct === 100 ? "✓ DESTRUCCIÓN TOTAL FINALIZADA" : "● DEMOLICIÓN EN CURSO..."}
          </div>
          <div style={{ color: "#64748b", marginTop: 4 }}>Frame: {frame} / {duration}</div>
        </div>
      </div>
    </div>
  );
};
