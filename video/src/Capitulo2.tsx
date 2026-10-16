import React, { useMemo } from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { T } from "./std/theme";
import { Steve3D, SteveAction } from "./std/Steve3D";
import { Captions } from "./std/Captions";
import { ThreeCanvas } from "@remotion/three";
import storyboardData from "./capitulo2-storyboard.json";
import skinRotation from "./skin_rotation.json";

// Estilo de texto con trazo técnico
const Stroke: React.CSSProperties = {
  WebkitTextStroke: "5px #000",
  paintOrder: "stroke fill",
  fontFamily: T.fontBlack,
  fontWeight: 900,
};

// 16 Escenas del guión técnico extendido
export const SECTIONS = storyboardData.sections;

// Precalcular frames de inicio y fin para cada escena
let accumulatedFrames = 0;
export const SCENE_RANGES = SECTIONS.map((sec: any) => {
  const durationFrames = Math.round(sec.duration * 30);
  const start = accumulatedFrames;
  accumulatedFrames += durationFrames;
  return {
    ...sec,
    startFrame: start,
    durationFrames,
    endFrame: accumulatedFrames,
  };
});

export const TOTAL_CAPITULO2_FRAMES = accumulatedFrames + 90; // ~8,088 frames (~4.5 minutos en 720p)

// Slimefun Floating Background Items para 720p (1280x720)
const SF_ITEMS = [
  "ENERGY_REGULATOR", "ELECTRIC_SMELTERY", "CARGO_NODE", "NUCLEAR_REACTOR", 
  "RAINBOW_RUNE", "GPS_TRANSMITTER", "ANCIENT_ALTAR", "SOLAR_GENERATOR"
];

const FallingSlimefunBackground720p: React.FC<{ frame: number }> = ({ frame }) => {
  const items = useMemo(() => {
    return Array.from({ length: 10 }).map((_, i) => ({
      id: i,
      x: (i * 130 + 30) % 1240,
      speed: 1.0 + (i % 3) * 0.5,
      rotSpeed: 0.02 + (i % 4) * 0.015,
      size: 34 + (i % 3) * 12,
      opacity: 0.14 + (i % 3) * 0.06,
      name: SF_ITEMS[i % SF_ITEMS.length]
    }));
  }, []);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 5 }}>
      {items.map((it) => {
        const y = ((frame * it.speed + it.id * 140) % 820) - 80;
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
              filter: "drop-shadow(0 0 8px rgba(6, 182, 212, 0.4))",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 6,
                backgroundColor: "rgba(15, 23, 42, 0.7)",
                border: "1px solid rgba(6, 182, 212, 0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#22d3ee",
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

// Distractor Gadget en la esquina superior derecha: Bouncing Neon Kinetic Balls (Escalado para 720p)
const SatisfyingCornerDistractor720p: React.FC<{ frame: number }> = ({ frame }) => {
  const boxW = 160;
  const boxH = 80;
  
  const b1x = Math.abs(((frame * 3.5) % (boxW * 2)) - boxW);
  const b1y = Math.abs(((frame * 2.8) % (boxH * 2)) - boxH);

  const b2x = Math.abs(((frame * 2.6 + 60) % (boxW * 2)) - boxW);
  const b2y = Math.abs(((frame * 3.8 + 30) % (boxH * 2)) - boxH);

  const b3x = Math.abs(((frame * 4.2 + 100) % (boxW * 2)) - boxW);
  const b3y = Math.abs(((frame * 2.2 + 70) % (boxH * 2)) - boxH);

  return (
    <div
      style={{
        position: "absolute",
        top: 20,
        right: 25,
        width: boxW,
        height: boxH,
        borderRadius: 8,
        backgroundColor: "rgba(10, 14, 26, 0.90)",
        border: "1px solid rgba(6, 182, 212, 0.4)",
        boxShadow: "0 6px 18px rgba(0,0,0,0.6)",
        overflow: "hidden",
        zIndex: 60,
      }}
    >
      <div style={{ position: "absolute", top: 4, left: 8, fontSize: 8, color: "#64748b", fontWeight: 800, letterSpacing: 1.2 }}>
        PHYSICS ENGINE · 60 FPS
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: b1x - 5,
          top: b1y - 5,
          width: 10,
          height: 10,
          borderRadius: "50%",
          backgroundColor: "#22d3ee",
          boxShadow: "0 0 8px #06b6d4",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: b2x - 6,
          top: b2y - 6,
          width: 12,
          height: 12,
          borderRadius: "50%",
          backgroundColor: "#f59e0b",
          boxShadow: "0 0 8px #d97706",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: b3x - 4,
          top: b3y - 4,
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: "#a855f7",
          boxShadow: "0 0 8px #9333ea",
        }}
      />
    </div>
  );
};

// 3D Jack Presenter con Rotación Dinámica de Skins NameMC y Sincronización de Habla
const JackPresenter720p: React.FC<{
  frame: number;
  sceneIndex: number;
  isSpeaking: boolean;
  action: SteveAction;
}> = ({ frame, sceneIndex, isSpeaking, action }) => {
  // Rotar entre las 11 skins disponibles de NameMC
  const skinFolder = useMemo(() => {
    const skins = skinRotation?.skins || [];
    if (skins.length === 0) return "jack_parts";
    const selected = skins[sceneIndex % skins.length];
    return selected.folder;
  }, [sceneIndex]);

  const { pos, rot } = useMemo(() => {
    // Sutil oscilación natural y cabeceo al hablar
    const headNod = isSpeaking ? Math.sin(frame * 0.4) * 0.04 : 0;
    return {
      pos: [-0.82, -0.48, 0.90] as [number, number, number],
      rot: [headNod, 0.24 + Math.sin(frame * 0.02) * 0.03, 0] as [number, number, number],
    };
  }, [frame, isSpeaking]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <ThreeCanvas
        width={1280}
        height={720}
        camera={{ position: [0, 0.45, 3.5], fov: 38 }}
        style={{ width: "100%", height: "100%" }}
      >
        <ambientLight intensity={1.3} />
        <directionalLight position={[3, 5, 4]} intensity={1.7} color="#ffffff" />
        <pointLight position={[-2, 2, 2]} color="#06b6d4" intensity={2.2} distance={7} />
        <pointLight position={[2, -1, 1]} color="#f59e0b" intensity={1.6} distance={6} />

        <group position={[0, -0.1, 0]}>
          <Steve3D
            position={pos}
            rotation={rot}
            scale={0.76}
            action={action}
            heldItemMaterial={sceneIndex === 6 ? "PUSHER" : undefined}
            skinFolder={skinFolder}
          />
        </group>
      </ThreeCanvas>

      {/* Indicador de transmisión y estado de Jack */}
      <div
        style={{
          position: "absolute",
          left: 60,
          bottom: 110,
          display: "flex",
          alignItems: "center",
          gap: 10,
          backgroundColor: "rgba(10, 15, 26, 0.88)",
          border: "1px solid rgba(6, 182, 212, 0.4)",
          borderRadius: 24,
          padding: "6px 14px",
          zIndex: 40,
        }}
      >
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            backgroundColor: isSpeaking ? "#22c55e" : "#64748b",
            boxShadow: isSpeaking ? "0 0 8px #22c55e" : "none",
          }}
        />
        <span style={{ fontSize: 12, fontWeight: 800, color: "#f8fafc", letterSpacing: 1.2 }}>
          JACK · {isSpeaking ? "TRANSMITIENDO EN VIVO" : "EN ESPERA"}
        </span>
      </div>
    </div>
  );
};

// Componente de Telemetría Dinámica de Escena (Panel Derecho 720p)
const TechnicalCard720p: React.FC<{ scene: any; frame: number }> = ({ scene, frame }) => {
  const diag = scene.diagram;

  return (
    <div
      style={{
        position: "absolute",
        top: 85,
        right: 25,
        width: 580,
        bottom: 110,
        backgroundColor: "rgba(15, 23, 42, 0.94)",
        border: "1.5px solid rgba(6, 182, 212, 0.5)",
        borderRadius: 14,
        padding: "22px 26px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        zIndex: 30,
        boxShadow: "0 18px 45px rgba(0,0,0,0.8)",
      }}
    >
      <div>
        {/* Cabecera de la tarjeta */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <span
            style={{
              backgroundColor: "rgba(6, 182, 212, 0.15)",
              color: "#22d3ee",
              border: "1px solid #06b6d4",
              borderRadius: 6,
              padding: "3px 10px",
              fontSize: 11,
              fontWeight: 900,
              letterSpacing: 1.2,
            }}
          >
            {scene.badge}
          </span>
          <span style={{ color: "#64748b", fontSize: 11, fontWeight: 700, fontFamily: "monospace" }}>
            TELEMETRY // LIVE
          </span>
        </div>

        {/* Título de la escena */}
        <h2 style={{ fontSize: 24, fontWeight: 900, color: "#f8fafc", margin: "4px 0", letterSpacing: 0.8 }}>
          {scene.title}
        </h2>
        <div style={{ fontSize: 13, color: "#38bdf8", fontWeight: 700, marginBottom: 14 }}>
          {scene.subtitle}
        </div>

        {/* Gráfico / Telemetría dinámica según el diagrama */}
        <div
          style={{
            backgroundColor: "rgba(3, 7, 18, 0.85)",
            border: "1px solid rgba(6, 182, 212, 0.25)",
            borderRadius: 8,
            padding: "14px 18px",
            minHeight: 180,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {diag === "jvm_stack" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#94a3b8" }}>
                <span>RUNTIME ENGINE</span>
                <span style={{ color: "#22c55e", fontWeight: 800 }}>OpenJDK 21.0.4 (Temurin 64-Bit)</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#94a3b8" }}>
                <span>GARBAGE COLLECTOR</span>
                <span style={{ color: "#38bdf8", fontWeight: 800 }}>Generational ZGC (Latency &lt; 1ms)</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#94a3b8" }}>
                <span>CONCURRENT THREADS</span>
                <span style={{ color: "#f59e0b", fontWeight: 800 }}>16 vCPUs Dedicated (Dallas Compute)</span>
              </div>
              <div style={{ marginTop: 6, height: 6, backgroundColor: "#1e293b", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ width: "98%", height: "100%", backgroundColor: "#22c55e" }} />
              </div>
            </div>
          )}

          {diag === "tick_budget" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#e2e8f0" }}>
                <span>PRESUPUESTO POR TICK (50.00 MS)</span>
                <span style={{ color: "#22c55e", fontWeight: 900 }}>7.42 MS USADO (14.8%)</span>
              </div>
              <div style={{ height: 18, backgroundColor: "#0f172a", borderRadius: 6, border: "1px solid #334155", overflow: "hidden", display: "flex" }}>
                <div style={{ width: "15%", backgroundColor: "#06b6d4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 900 }}>
                  7.4ms
                </div>
                <div style={{ width: "85%", backgroundColor: "rgba(34, 197, 94, 0.2)", display: "flex", alignItems: "center", paddingLeft: 8, fontSize: 10, color: "#86efac" }}>
                  42.6ms MARGEN LIBRE
                </div>
              </div>
              <div style={{ fontSize: 11, color: "#94a3b8" }}>
                * Spark Profiler: Bucle síncrono sostenido a 20.00 TPS sin degradación.
              </div>
            </div>
          )}

          {diag === "spark_histogram" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#e2e8f0" }}>
                <span>PERCENTILES DE LATENCIA (SPARK)</span>
                <span style={{ color: "#38bdf8", fontWeight: 800 }}>TICK DRIFT: 0.00 MS</span>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "flex-end", height: 80, padding: "6px 0", borderBottom: "1px solid #334155" }}>
                {[35, 42, 38, 40, 48, 44, 39, 41, 52, 43, 38, 46].map((h, i) => (
                  <div key={i} style={{ flex: 1, height: `${h}%`, backgroundColor: i === 8 ? "#f59e0b" : "#06b6d4", borderRadius: 2 }} />
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#94a3b8" }}>
                <span>P50: 5.1ms</span>
                <span>P95: 7.8ms</span>
                <span>P99: 11.2ms</span>
                <span style={{ color: "#22c55e", fontWeight: 800 }}>ESTADO: ÓPTIMO</span>
              </div>
            </div>
          )}

          {diag === "network_topology" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 12 }}>
              <div style={{ color: "#f8fafc", fontWeight: 800 }}>INFRAESTRUCTURA INSTITUCIONAL // DIURNA</div>
              <div style={{ color: "#94a3b8" }}>• Switches Gestionables Layer 3 · VLANs Segregadas</div>
              <div style={{ color: "#94a3b8" }}>• Enlaces Troncales 10G SFP+ · Topología Redundante</div>
              <div style={{ color: "#94a3b8" }}>• Alta Disponibilidad DHCP / DNS / Active Directory</div>
              <div style={{ color: "#22c55e", fontWeight: 700, marginTop: 4 }}>✓ CERO TOLERANCIA A PÉRDIDA DE DATOS EN PRODUCCIÓN</div>
            </div>
          )}

          {diag === "maven_pipeline" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12 }}>
              <div style={{ color: "#f59e0b", fontWeight: 800 }}>REPOSITORIO MAVEN: maven.drakescraft.cl</div>
              <div style={{ fontFamily: "monospace", fontSize: 11, color: "#38bdf8", backgroundColor: "#020617", padding: "6px 8px", borderRadius: 4 }}>
                &gt; mvn clean compile package -P production<br/>
                [INFO] BUILD SUCCESS [4.12s]<br/>
                [INFO] Artifact deployed to repo.drakescraft.cl
              </div>
              <div style={{ color: "#94a3b8", fontSize: 11 }}>Compilación nativa en Java 21 para cada plugin y addon.</div>
            </div>
          )}

          {diag === "docker_stacks" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12 }}>
              <div style={{ color: "#38bdf8", fontWeight: 800 }}>STACKS EN CONTENEDORES DOCKER (STAR LINUX)</div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#94a3b8" }}>
                <span>• drakescraft-web</span>
                <span style={{ color: "#22c55e" }}>HEALTHY (8081)</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#94a3b8" }}>
                <span>• saori-sentinel</span>
                <span style={{ color: "#22c55e" }}>RUNNING (SRE AUTO)</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#94a3b8" }}>
                <span>• vault-postgres (WAL)</span>
                <span style={{ color: "#22c55e" }}>HEALTHY (5432)</span>
              </div>
            </div>
          )}

          {diag === "slimefun_energy" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 12 }}>
              <div style={{ color: "#f59e0b", fontWeight: 800 }}>REDES INDUSTRIALES SLIMEFUN 4</div>
              <div style={{ color: "#94a3b8" }}>• Energy Regulator: 250,000 J/t de transferencia activa</div>
              <div style={{ color: "#94a3b8" }}>• Reactores de Fusión y Generadores Infinitos server-side</div>
              <div style={{ color: "#94a3b8" }}>• Lógica de máquinas procesada en hilos asíncronos concurrentes</div>
              <div style={{ color: "#22c55e", fontWeight: 700 }}>✓ Cero mods requeridos en el cliente</div>
            </div>
          )}

          {diag === "gc_pause_graph" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#e2e8f0" }}>
                <span>COMPARATIVA PAUSA GC EN 1.21</span>
                <span style={{ color: "#22c55e", fontWeight: 800 }}>ZGC GANADOR (-98%)</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 11 }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#ef4444" }}>
                    <span>G1GC Tradicional:</span>
                    <span>42.0 ms (Peligro de Lag)</span>
                  </div>
                  <div style={{ width: "84%", height: 8, backgroundColor: "#ef4444", borderRadius: 4 }} />
                </div>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#22c55e" }}>
                    <span>Generational ZGC:</span>
                    <span>0.8 ms (Transparente)</span>
                  </div>
                  <div style={{ width: "3%", height: 8, backgroundColor: "#22c55e", borderRadius: 4 }} />
                </div>
              </div>
            </div>
          )}

          {diag === "addon_matrix" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 11 }}>
              <div style={{ color: "#f8fafc", fontWeight: 800, fontSize: 12 }}>MATRIZ DE 84 ADDONS CONCURRENTES</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 8px", color: "#94a3b8" }}>
                <div>✓ InfinityExpansion-Drake</div>
                <div>✓ Networks-Drake-1.21</div>
                <div>✓ FluffyMachines-Drake</div>
                <div>✓ SlimefunOreChunks</div>
                <div>✓ DynaTech-Drake</div>
                <div>✓ Galactifun Space Mod</div>
              </div>
              <div style={{ color: "#38bdf8", fontWeight: 700, marginTop: 4 }}>+78 expansiones compiladas e integradas</div>
            </div>
          )}

          {diag === "zgc_telemetry" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 11, fontFamily: "monospace" }}>
              <div style={{ color: "#38bdf8", fontWeight: 800 }}>JVM STARTUP TUNING FLAGS:</div>
              <div style={{ backgroundColor: "#020617", padding: "8px 10px", borderRadius: 6, color: "#a5b4fc" }}>
                -XX:+UseZGC -XX:+ZGenerational<br/>
                -XX:AllocatePrefetchStyle=3<br/>
                -XX:+AlwaysPreTouch -Xms12G -Xmx12G
              </div>
              <div style={{ color: "#22c55e", fontWeight: 700 }}>PAUSAS STW: &lt; 0.5 MS CON 84 ADDONS ACTIVOS</div>
            </div>
          )}

          {diag === "distributed_arch" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 12 }}>
              <div style={{ color: "#f8fafc", fontWeight: 800 }}>ARQUITECTURA DE CLÚSTER DISTRIBUIDO</div>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <div style={{ flex: 1, backgroundColor: "#1e293b", padding: 8, borderRadius: 6, textAlign: "center" }}>
                  <div style={{ color: "#38bdf8", fontWeight: 800 }}>NODO DALLAS</div>
                  <div style={{ color: "#94a3b8", fontSize: 10 }}>Tick Loop Puro · 16 vCPU</div>
                </div>
                <span style={{ color: "#f59e0b", fontWeight: 900 }}>&lt;---&gt;</span>
                <div style={{ flex: 1, backgroundColor: "#1e293b", padding: 8, borderRadius: 6, textAlign: "center" }}>
                  <div style={{ color: "#22c55e", fontWeight: 800 }}>STAR CENTRAL</div>
                  <div style={{ color: "#94a3b8", fontSize: 10 }}>Postgres WAL · Sentinel</div>
                </div>
              </div>
            </div>
          )}

          {diag === "sentinel_flow" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12 }}>
              <div style={{ color: "#22c55e", fontWeight: 800 }}>AGENTE SRE CENTINELA (SAORI)</div>
              <div style={{ color: "#94a3b8" }}>1. Auditoría de sockets de red y TCP ping cada 10s.</div>
              <div style={{ color: "#94a3b8" }}>2. Validación de consistencia de memoria off-heap.</div>
              <div style={{ color: "#94a3b8" }}>3. Mitigación forense autónoma sin llamadas nocturnas.</div>
              <div style={{ color: "#38bdf8", fontWeight: 700, marginTop: 4 }}>ESTADO: CENTINELA ACTIVO 24/7/365</div>
            </div>
          )}

          {diag === "wal_storage" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12 }}>
              <div style={{ color: "#f59e0b", fontWeight: 800 }}>WRITE-AHEAD LOGGING (WAL) & ATOMICIDAD</div>
              <div style={{ color: "#94a3b8" }}>• Snapshots consistentes cada 15 minutos en disco SSD NVMe.</div>
              <div style={{ color: "#94a3b8" }}>• Sincronización rsync cifrada hacia almacenamiento secundario.</div>
              <div style={{ color: "#22c55e", fontWeight: 800 }}>POLÍTICA: CERO PÉRDIDA DE ÍNTEMS / CERO ROLLBACKS</div>
            </div>
          )}

          {diag === "crossplay_protocol" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12 }}>
              <div style={{ color: "#38bdf8", fontWeight: 800 }}>INTEROPERABILIDAD TRANSPARENTE EN TIEMPO REAL</div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#94a3b8" }}>
                <span>• Java Edition (PC/Mac/Linux):</span>
                <span style={{ color: "#22c55e" }}>NATIVO 1.21.x</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#94a3b8" }}>
                <span>• Bedrock (Consolas/Móviles):</span>
                <span style={{ color: "#22c55e" }}>PUERTO UNIFICADO 25565</span>
              </div>
              <div style={{ color: "#f59e0b", fontSize: 11, marginTop: 4 }}>Traducción binaria de paquetes al vuelo con Geyser/Floodgate.</div>
            </div>
          )}

          {diag === "roadmap_timeline" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12 }}>
              <div style={{ color: "#f59e0b", fontWeight: 800 }}>HOJA DE RUTA DRAKESCRAFT LABS</div>
              <div style={{ color: "#38bdf8" }}>• 2026: Calibración empírica y profiling de 84 addons.</div>
              <div style={{ color: "#22c55e" }}>• Mediados 2027: Lanzamiento Temporada 2 de alta escala.</div>
              <div style={{ color: "#94a3b8", fontSize: 11 }}>Banco de pruebas documentado en código abierto.</div>
            </div>
          )}

          {diag === "final_card" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, textAlign: "center" }}>
              <div style={{ color: "#22d3ee", fontWeight: 900, fontSize: 16 }}>play.drakescraft.cl</div>
              <div style={{ color: "#f59e0b", fontWeight: 800, fontSize: 13 }}>PUERTO ESTÁNDAR UNIFICADO: 25565</div>
              <div style={{ color: "#94a3b8", fontSize: 11 }}>Compatible con Java y Bedrock Edition sin descargas externas.</div>
            </div>
          )}
        </div>
      </div>

      {/* Resumen inferior del bloque */}
      <div
        style={{
          borderTop: "1px solid rgba(6, 182, 212, 0.3)",
          paddingTop: 10,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 11,
          color: "#94a3b8",
        }}
      >
        <span>DRAKESCRAFT LABS · DOCU-SERIE</span>
        <span style={{ color: "#22c55e", fontWeight: 800 }}>20.0 TPS CONSTANTE</span>
      </div>
    </div>
  );
};

export const Capitulo2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Determinar la escena actual según el frame
  const currentSceneIndex = useMemo(() => {
    const idx = SCENE_RANGES.findIndex(
      (s: any) => frame >= s.startFrame && frame < s.endFrame
    );
    return idx >= 0 ? idx : SCENE_RANGES.length - 1;
  }, [frame]);

  const activeScene = SCENE_RANGES[currentSceneIndex];

  // Calcular si Jack está hablando en este fotograma específico
  const sceneFrame = frame - activeScene.startFrame;
  const sceneTime = sceneFrame / fps;
  const isSpeaking = useMemo(() => {
    if (!activeScene.words) return false;
    return activeScene.words.some(
      (w: any) => sceneTime >= w.start && sceneTime <= w.start + w.duration
    );
  }, [sceneTime, activeScene]);

  // Palabras para subtítulos sincronizados
  const captionWords = useMemo(() => {
    if (!activeScene.words) return [];
    return activeScene.words.map((w: any) => ({ w: w.word, t: w.start, d: w.duration }));
  }, [activeScene]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#060911", fontFamily: T.font, color: "#ffffff", width: 1280, height: 720 }}>
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
          backgroundSize: "40px 40px",
          opacity: 0.8,
        }}
      />

      {/* 3. Ítems flotantes de Slimefun en profundidad */}
      <FallingSlimefunBackground720p frame={frame} />

      {/* 4. Escena 3D de Jack con rotación de Skins */}
      <div style={{ position: "absolute", inset: 0, zIndex: 10 }}>
        <JackPresenter720p
          frame={frame}
          sceneIndex={currentSceneIndex}
          isSpeaking={isSpeaking}
          action={activeScene.action as SteveAction}
        />
      </div>

      {/* 5. Header Superior: Identidad, Temporada y Enlace (720p) */}
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 30,
          right: 210,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 40,
        }}
      >
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span
            style={{
              backgroundColor: "#06b6d4",
              color: "#020617",
              fontWeight: 900,
              fontSize: 13,
              padding: "4px 10px",
              borderRadius: 4,
              letterSpacing: 1.5,
            }}
          >
            DRAKESCRAFT LABS
          </span>
          <span style={{ color: "#f59e0b", fontSize: 14, fontWeight: 900, letterSpacing: 1.2 }}>
            CAPÍTULO 02 · VERSIÓN EXTENDIDA
          </span>
          <span style={{ color: "#22c55e", fontSize: 12, fontWeight: 800, backgroundColor: "rgba(34, 197, 94, 0.15)", padding: "3px 8px", borderRadius: 4 }}>
            20.0 TPS
          </span>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div
            style={{
              backgroundColor: "rgba(15, 23, 42, 0.9)",
              border: "1px solid #06b6d4",
              borderRadius: 6,
              padding: "4px 10px",
              color: "#38bdf8",
              fontWeight: 800,
              fontSize: 12,
            }}
          >
            PUERTO: 25565
          </div>
          <div
            style={{
              backgroundColor: "rgba(15, 23, 42, 0.9)",
              border: "1px solid #f59e0b",
              borderRadius: 6,
              padding: "4px 10px",
              color: "#fbbf24",
              fontWeight: 800,
              fontSize: 12,
            }}
          >
            play.drakescraft.cl
          </div>
        </div>
      </div>

      {/* 6. Distractor cinético en la esquina superior derecha */}
      <SatisfyingCornerDistractor720p frame={frame} />

      {/* 7. Tarjeta Técnica Central / Derecha */}
      <TechnicalCard720p scene={activeScene} frame={frame} />

      {/* 8. Subtítulos palabra por palabra en la parte inferior */}
      {captionWords.length > 0 && (
        <div
          style={{
            position: "absolute",
            bottom: 22,
            left: "50%",
            transform: "translateX(-50%)",
            width: 860,
            height: 60,
            backgroundColor: "rgba(10, 15, 26, 0.85)",
            border: "1px solid rgba(6, 182, 212, 0.4)",
            borderRadius: 30,
            padding: "0 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
            boxShadow: "0 10px 25px rgba(0,0,0,0.7)",
          }}
        >
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <Captions words={captionWords} top={5} height={50} size={24} />
          </div>
        </div>
      )}

      {/* 9. Audio de Fondo: Ambient Tech Track a bajo volumen */}
      <Audio src={staticFile("audio/bg_tech_chill.wav")} volume={0.16} loop />

      {/* 10. Pistas de audio de locución secuenciadas */}
      {SCENE_RANGES.map((sec: any) => (
        <Sequence key={sec.id} from={sec.startFrame} durationInFrames={sec.durationFrames}>
          <Audio src={staticFile(`audio/${sec.file}`)} volume={1.0} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
