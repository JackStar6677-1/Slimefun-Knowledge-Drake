import React, { useMemo } from "react";
import { useCurrentFrame } from "remotion";

interface Props {
  width?: number;
  height?: number;
  compact?: boolean;
  style?: React.CSSProperties;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number; // 0 to 1
  color: string;
}

interface TrailPoint {
  x: number;
  y: number;
  opacity: number;
}

export const SatisfyingPhysicsWidget: React.FC<Props> = ({
  width = 380,
  height = 380,
  compact = false,
  style,
}) => {
  const frame = useCurrentFrame();

  const simulation = useMemo(() => {
    const cx = 190;
    const cy = 190;
    const R0 = 152; // Anillo exterior indestructible
    const rBall = 8.5;

    // Configuración de anillos interiores destructibles
    const ringConfig = [
      { r: 114, segs: 10, color: "#38bdf8", respawnCooldown: 70 },
      { r: 76, segs: 7, color: "#f43f5e", respawnCooldown: 85 },
      { r: 42, segs: 5, color: "#facc15", respawnCooldown: 100 },
    ];

    // Estados de segmentos: frame en el que respawnea (0 = vivo)
    const segStates = ringConfig.map((r) => Array(r.segs).fill(0));

    let x = 190;
    let y = 110;
    let vx = 5.8;
    let vy = 3.6;
    let totalHits = 0;
    let combo = 0;

    const trailHistory: { x: number; y: number }[] = [];
    const recentSparks: Particle[] = [];

    // Simular loop continuo de 900 frames (30s) para que nunca se congele en videos largos
    const maxF = frame % 900;
    for (let f = 0; f <= maxF; f++) {
      // Gravedad sutil constante hacia abajo
      vy += 0.17;
      x += vx;
      y += vy;

      // Respawneo continuo de arcos rotos
      ringConfig.forEach((ring, rIdx) => {
        for (let s = 0; s < ring.segs; s++) {
          if (segStates[rIdx][s] > 0 && f >= segStates[rIdx][s]) {
            segStates[rIdx][s] = 0; // Se regenera
          }
        }
      });

      // Distancia euclídea al centro
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // 1. Colisión elástica contra el perímetro exterior indestructible
      if (dist >= R0 - rBall) {
        const nx = dx / dist;
        const ny = dy / dist;
        const dot = vx * nx + vy * ny;
        if (dot > 0) {
          vx -= 2 * dot * nx;
          vy -= 2 * dot * ny;

          // Inyección de energía cinética para mantener el ritmo hipnótico
          const sp = Math.hypot(vx, vy);
          if (sp < 7.5) {
            vx *= 1.05;
            vy *= 1.05;
          } else if (sp > 14) {
            vx *= 0.95;
            vy *= 0.95;
          }

          // Chispas si estamos cerca del frame actual
          if (f >= maxF - 12) {
            for (let k = 0; k < 4; k++) {
              const spAngle = Math.atan2(ny, nx) + Math.PI + (Math.random() - 0.5) * 1.2;
              const spVel = 2 + Math.random() * 4;
              recentSparks.push({
                x: cx + nx * (R0 - rBall),
                y: cy + ny * (R0 - rBall),
                vx: Math.cos(spAngle) * spVel,
                vy: Math.sin(spAngle) * spVel,
                life: 1.0 - (maxF - f) * 0.08,
                color: "#38bdf8",
              });
            }
          }
        }
        x = cx + nx * (R0 - rBall);
        y = cy + ny * (R0 - rBall);
      }

      // 2. Colisión destructible con anillos interiores concéntricos
      ringConfig.forEach((ring, rIdx) => {
        if (Math.abs(dist - ring.r) < rBall + 3) {
          let angle = Math.atan2(dy, dx);
          if (angle < 0) angle += Math.PI * 2;
          const segIdx = Math.floor((angle / (Math.PI * 2)) * ring.segs);

          if (segStates[rIdx][segIdx] === 0) {
            // Impacto y destrucción del segmento
            segStates[rIdx][segIdx] = f + ring.respawnCooldown;
            totalHits++;
            combo++;

            // Rebote físico real según la normal
            const nx = dx / dist;
            const ny = dy / dist;
            const dot = vx * nx + vy * ny;
            vx -= 1.95 * dot * nx;
            vy -= 1.95 * dot * ny;

            // Chispas de fragmentación del anillo
            if (f >= maxF - 12) {
              for (let k = 0; k < 6; k++) {
                const spAngle = angle + (Math.random() - 0.5) * 1.5;
                const spVel = 2.5 + Math.random() * 5;
                recentSparks.push({
                  x: cx + Math.cos(angle) * ring.r,
                  y: cy + Math.sin(angle) * ring.r,
                  vx: Math.cos(spAngle) * spVel,
                  vy: Math.sin(spAngle) * spVel,
                  life: 1.0 - (maxF - f) * 0.08,
                  color: ring.color,
                });
              }
            }
          }
        }
      });

      // Registrar estela en los últimos 12 frames
      if (f >= maxF - 12) {
        trailHistory.push({ x, y });
      }
    }

    // Preparar estela con opacidad decreciente
    const trail: TrailPoint[] = trailHistory.map((p, idx) => ({
      x: p.x,
      y: p.y,
      opacity: (idx + 1) / trailHistory.length * 0.65,
    }));

    // Métricas en vivo del vector físico
    const vMag = Math.hypot(vx, vy);
    const thetaDeg = Math.round(((Math.atan2(vy, vx) * 180) / Math.PI + 360) % 360);
    const energy = 0.5 * 1.5 * vMag * vMag;

    return {
      ball: { x, y, vx, vy, vMag },
      trail,
      sparks: recentSparks,
      rings: ringConfig.map((ring, rIdx) => {
        const arcLen = (2 * Math.PI) / ring.segs;
        const segments = [];
        for (let s = 0; s < ring.segs; s++) {
          const isAlive = segStates[rIdx][s] === 0;
          const segAngle = s * arcLen;
          segments.push({
            id: `${rIdx}-${s}`,
            angle: segAngle,
            arcLen,
            isAlive,
            color: ring.color,
          });
        }
        return { radius: ring.r, segments };
      }),
      stats: {
        vMag: vMag.toFixed(1),
        vx: vx.toFixed(1),
        vy: vy.toFixed(1),
        theta: thetaDeg,
        energy: energy.toFixed(0),
        hits: totalHits,
      },
    };
  }, [frame]);

  const { ball, trail, sparks, rings, stats } = simulation;

  const isCompact = compact || (height !== undefined && height < 250);

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: "rgba(10, 15, 30, 0.94)",
        border: isCompact ? "1.5px solid rgba(56, 189, 248, 0.4)" : "2px solid rgba(56, 189, 248, 0.5)",
        borderRadius: isCompact ? 14 : 22,
        padding: isCompact ? 8 : 12,
        boxSizing: "border-box",
        boxShadow: "0 10px 30px rgba(0,0,0,0.8), inset 0 0 20px rgba(56,189,248,0.12)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backdropFilter: "blur(14px)",
        overflow: "hidden",
        ...style,
      }}
    >
      {/* Header del Widget */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          paddingBottom: isCompact ? 4 : 6,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: isCompact ? 5 : 7 }}>
          <div
            style={{
              width: isCompact ? 6 : 9,
              height: isCompact ? 6 : 9,
              borderRadius: "50%",
              backgroundColor: "#10b981",
              boxShadow: "0 0 8px #10b981",
            }}
          />
          <span
            style={{
              color: "#38bdf8",
              fontSize: isCompact ? 9 : 12,
              fontWeight: 900,
              letterSpacing: isCompact ? 1 : 1.5,
              fontFamily: "monospace",
            }}
          >
            PHYSICS LOOP · 60 FPS
          </span>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span
            style={{
              color: "#facc15",
              fontSize: isCompact ? 9 : 11,
              fontWeight: 900,
              fontFamily: "monospace",
              backgroundColor: "rgba(250, 204, 21, 0.15)",
              padding: isCompact ? "1px 4px" : "2px 6px",
              borderRadius: 4,
            }}
          >
            HITS: {stats.hits}
          </span>
        </div>
      </div>

      {/* SVG del Arena con Física Real Continua */}
      <div
        style={{
          position: "relative",
          width: "100%",
          flex: 1,
          minHeight: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 380 380"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <radialGradient id="arenaGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.15" />
              <stop offset="70%" stopColor="#0f172a" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
            </radialGradient>
            <filter id="ballGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#38bdf8" />
            </filter>
          </defs>

          {/* Fondo del domo circular */}
          <circle cx="190" cy="190" r="152" fill="url(#arenaGlow)" />

          {/* Anillo exterior perimetral INDESTRUCTIBLE con rebote elástico */}
          <circle
            cx="190"
            cy="190"
            r="152"
            fill="none"
            stroke="#0284c7"
            strokeWidth="3.5"
            strokeDasharray="6,4"
            opacity={0.85}
          />
          <circle
            cx="190"
            cy="190"
            r="154"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="1.5"
            opacity={0.4}
          />

          {/* Anillos interiores concéntricos destructibles con autoregeneración continua */}
          {rings.map((ring) =>
            ring.segments.map((seg) => {
              if (!seg.isAlive) return null;
              const startX = 190 + Math.cos(seg.angle) * ring.radius;
              const startY = 190 + Math.sin(seg.angle) * ring.radius;
              const endX = 190 + Math.cos(seg.angle + seg.arcLen * 0.84) * ring.radius;
              const endY = 190 + Math.sin(seg.angle + seg.arcLen * 0.84) * ring.radius;
              return (
                <path
                  key={seg.id}
                  d={`M ${startX} ${startY} A ${ring.radius} ${ring.radius} 0 0 1 ${endX} ${endY}`}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth="5.5"
                  strokeLinecap="round"
                  opacity={0.9}
                />
              );
            })
          )}

          {/* Núcleo central pulsante */}
          <circle cx="190" cy="190" r="8" fill="#10b981" opacity={0.4} />
          <circle cx="190" cy="190" r="4" fill="#6ee7b7" />

          {/* Chispas de impacto dinámicas */}
          {sparks.map((sp, idx) => (
            <circle
              key={idx}
              cx={sp.x}
              cy={sp.y}
              r={1.8 * sp.life}
              fill={sp.color}
              opacity={sp.life}
            />
          ))}

          {/* Estela luminosa de movimiento */}
          {trail.map((p, idx) => (
            <circle
              key={idx}
              cx={p.x}
              cy={p.y}
              r={7 * p.opacity}
              fill="#38bdf8"
              opacity={p.opacity * 0.5}
            />
          ))}

          {/* Vector de velocidad instantáneo */}
          <line
            x1={ball.x}
            y1={ball.y}
            x2={ball.x + ball.vx * 2.8}
            y2={ball.y + ball.vy * 2.8}
            stroke="#f43f5e"
            strokeWidth="2"
            strokeDasharray="2,2"
            opacity={0.8}
          />

          {/* Bola destructora con aura luminosa y física elástica */}
          <circle
            cx={ball.x}
            cy={ball.y}
            r="8.5"
            fill="#ffffff"
            filter="url(#ballGlow)"
          />
          <circle
            cx={ball.x}
            cy={ball.y}
            r="13"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="1.8"
            opacity={0.7}
          />
        </svg>
      </div>

      {/* Panel Inferior de Telemetría Dinámica en Tiempo Real */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: isCompact ? 4 : 6,
          backgroundColor: "rgba(15, 23, 42, 0.85)",
          borderRadius: isCompact ? 6 : 10,
          padding: isCompact ? "3px 6px" : "6px 8px",
          border: "1px solid rgba(255,255,255,0.08)",
          fontFamily: "monospace",
          fontSize: isCompact ? 9 : 11,
          textAlign: "center",
        }}
      >
        <div>
          <span style={{ color: "#64748b" }}>VEL: </span>
          <span style={{ color: "#38bdf8", fontWeight: 800 }}>{stats.vMag}</span>
        </div>
        <div>
          <span style={{ color: "#64748b" }}>DIR: </span>
          <span style={{ color: "#facc15", fontWeight: 800 }}>{stats.theta}°</span>
        </div>
        <div>
          <span style={{ color: "#64748b" }}>EK: </span>
          <span style={{ color: "#4ade80", fontWeight: 800 }}>{stats.energy}J</span>
        </div>
      </div>
    </div>
  );
};
