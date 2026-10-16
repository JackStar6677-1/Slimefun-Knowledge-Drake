import React, { useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { ThreeCanvas } from "@remotion/three";
import { continueRender, delayRender, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Steve3D, SteveAction } from "./Steve3D";

interface NetworksInteractiveProps {
  width: number;
  height: number;
  activeStep?: "place_grabber" | "connect_cable" | "place_pusher" | "transferring";
  isHalloween?: boolean;
}

const BLOCK_TEXTURES = [
  "blocks/CHEST/north.png",
  "blocks/CHEST/east.png",
  "blocks/CHEST/up.png",
  "blocks/DISPENSER/north.png",
  "blocks/DISPENSER/east.png",
  "blocks/DISPENSER/up.png",
  "blocks/JACK_O_LANTERN/north.png",
  "blocks/JACK_O_LANTERN/east.png",
  "blocks/JACK_O_LANTERN/up.png",
  "blocks/STONE_BRICKS/north.png",
  "blocks/STONE_BRICKS/east.png",
  "blocks/STONE_BRICKS/up.png",
];

const useBlockTextures = () => {
  const [textures, setTextures] = useState<Record<string, THREE.Texture>>({});

  useEffect(() => {
    const handle = delayRender("network block textures");
    const loader = new THREE.TextureLoader();
    const loaded: Record<string, THREE.Texture> = {};

    Promise.all(
      BLOCK_TEXTURES.map(
        (path) =>
          new Promise<void>((resolve) => {
            loader.load(
              staticFile(path),
              (tex) => {
                tex.magFilter = THREE.NearestFilter;
                tex.minFilter = THREE.NearestFilter;
                tex.colorSpace = THREE.SRGBColorSpace;
                loaded[path] = tex;
                resolve();
              },
              undefined,
              () => resolve()
            );
          })
      )
    ).then(() => {
      setTextures(loaded);
      continueRender(handle);
    });
  }, []);

  return textures;
};

export const NetworksInteractive3D: React.FC<NetworksInteractiveProps> = ({
  width,
  height,
  activeStep = "transferring",
  isHalloween = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const textures = useBlockTextures();

  // Animación del flujo del ítem digital
  const flowProgress = (frame % (fps * 2)) / (fps * 2);
  const itemX = interpolate(flowProgress, [0, 1], [-1.0, 1.0]);

  // Creación de materiales de bloques con filtro pixel art
  const createCubeMat = (folder: string, fallbackColor: string, frontFace = "north.png") => {
    const m = (path: string) => {
      const t = textures[path];
      return new THREE.MeshLambertMaterial({ map: t || undefined, color: t ? "#ffffff" : fallbackColor });
    };
    const side = m(`blocks/${folder}/east.png`);
    const top = m(`blocks/${folder}/up.png`);
    const front = m(`blocks/${folder}/${frontFace}`);
    const bottom = m(`blocks/${folder}/down.png`);
    const back = m(`blocks/${folder}/south.png`);
    return [side, side, top, bottom, front, back];
  };

  const chestMats = useMemo(() => createCubeMat("CHEST", "#8b5a2b"), [textures]);
  const dispenserMats = useMemo(() => createCubeMat("DISPENSER", "#717171"), [textures]);
  const pumpkinMats = useMemo(() => createCubeMat("JACK_O_LANTERN", "#d35400"), [textures]);
  const stoneBrickMats = useMemo(() => createCubeMat("STONE_BRICKS", "#57606f"), [textures]);

  // JackStar comportamiento dinámico
  const steveMovement = useMemo(() => {
    if (activeStep === "place_grabber") {
      const t = interpolate(frame % 90, [0, 30, 90], [0, 1, 1], { extrapolateRight: "clamp" });
      const x = interpolate(t, [0, 1], [-0.5, -1.3]);
      const z = interpolate(t, [0, 1], [1.8, 1.1]);
      return {
        pos: [x, 0, z] as [number, number, number],
        rot: [0, 0.45, 0] as [number, number, number],
        action: (t < 0.6 ? "walk" : "interact") as SteveAction,
      };
    }
    if (activeStep === "connect_cable") {
      return {
        pos: [-0.2, 0, 1.25] as [number, number, number],
        rot: [0, 0.1, 0] as [number, number, number],
        action: "interact" as SteveAction,
      };
    }
    if (activeStep === "place_pusher") {
      const t = interpolate(frame % 90, [0, 30, 90], [0, 1, 1], { extrapolateRight: "clamp" });
      const x = interpolate(t, [0, 1], [0.0, 0.85]);
      const z = interpolate(t, [0, 1], [1.7, 1.15]);
      return {
        pos: [x, 0, z] as [number, number, number],
        rot: [0, -0.45, 0] as [number, number, number],
        action: (t < 0.6 ? "walk" : "place_block") as SteveAction,
      };
    }
    return {
      pos: [0, 0, 1.55] as [number, number, number],
      rot: [0, Math.sin(frame * 0.03) * 0.1, 0] as [number, number, number],
      action: "idle" as SteveAction,
    };
  }, [activeStep, frame]);

  // Partículas flotantes místicas de Halloween
  const particles = useMemo(() => {
    const pts: [number, number, number][] = [];
    for (let i = 0; i < 28; i++) {
      const seed = i * 137.5;
      const x = ((Math.sin(seed) * 1000) % 7) - 3.5;
      const y = (((Math.cos(seed) * 1000) % 3) + 3) % 2.8 + 0.3;
      const z = ((Math.sin(seed * 2) * 1000) % 5) - 2.5;
      pts.push([x, y, z]);
    }
    return pts;
  }, []);

  return (
    <ThreeCanvas
      width={width}
      height={height}
      camera={{ position: [0, 2.2, 4.6], fov: 42 }}
      gl={{ alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={isHalloween ? 0.75 : 1.1} color={isHalloween ? "#8c7ae6" : "#ffffff"} />
      <directionalLight position={[3, 7, 4]} intensity={isHalloween ? 1.0 : 1.4} color="#f5cd79" />
      <directionalLight position={[-4, 3, -2]} intensity={0.5} color="#54a0ff" />

      {/* Luces puntuales de las Jack-o'-Lanterns */}
      <pointLight position={[-2.9, 0.8, -0.6]} color="#ff793f" intensity={1.8} distance={3.5} />
      <pointLight position={[2.9, 0.8, -0.6]} color="#ff793f" intensity={1.8} distance={3.5} />
      <pointLight position={[0, 1.2, -1.8]} color="#00d2d3" intensity={1.4} distance={4.0} />

      <group position={[0, -0.35, 0]}>
        {/* --- 0. SUELO DE MAZMORRA / STONE BRICKS --- */}
        <group position={[0, -0.5, 0]}>
          {[-3, -2, -1, 0, 1, 2, 3].map((bx) =>
            [-2, -1, 0, 1, 2].map((bz) => (
              <mesh key={`${bx}_${bz}`} position={[bx * 0.98, 0, bz * 0.98]} material={stoneBrickMats}>
                <boxGeometry args={[0.96, 0.96, 0.96]} />
              </mesh>
            ))
          )}
        </group>

        {/* --- DETALLES DE HALLOWEEN --- */}
        {isHalloween && (
          <>
            <mesh position={[-2.8, 0.5, -0.6]} rotation={[0, 0.4, 0]} material={pumpkinMats}>
              <boxGeometry args={[0.9, 0.9, 0.9]} />
            </mesh>
            <mesh position={[2.8, 0.5, -0.6]} rotation={[0, -0.4, 0]} material={pumpkinMats}>
              <boxGeometry args={[0.9, 0.9, 0.9]} />
            </mesh>
            <group position={[0, 0.9, -1.8]}>
              <mesh>
                <boxGeometry args={[0.4, 0.65, 0.4]} />
                <meshLambertMaterial color="#2f3542" />
              </mesh>
              <mesh position={[0, 0, 0]}>
                <boxGeometry args={[0.26, 0.45, 0.26]} />
                <meshBasicMaterial color="#00d2d3" />
              </mesh>
            </group>
          </>
        )}

        {/* --- PARTÍCULAS FLOTANTES MÍSTICAS --- */}
        {particles.map(([px, py, pz], idx) => {
          const yOff = Math.sin(frame * 0.05 + idx) * 0.15;
          return (
            <mesh key={idx} position={[px, py + yOff, pz]}>
              <boxGeometry args={[0.04, 0.04, 0.04]} />
              <meshBasicMaterial color={idx % 2 === 0 ? "#ff9f43" : "#00d2d3"} />
            </mesh>
          );
        })}

        {/* --- 1. COFRE ORIGEN (x = -1.95) --- */}
        <group position={[-1.95, 0.44, 0]}>
          <mesh material={chestMats}>
            <boxGeometry args={[0.875, 0.875, 0.875]} />
          </mesh>
        </group>

        {/* --- 2. NETWORK GRABBER (x = -1.25, Extractor) --- */}
        <group position={[-1.25, 0.5, 0]}>
          <mesh>
            <boxGeometry args={[0.34, 0.36, 0.36]} />
            <meshLambertMaterial color="#2f3542" />
          </mesh>
          <mesh position={[0.18, 0, 0]}>
            <boxGeometry args={[0.04, 0.22, 0.22]} />
            <meshBasicMaterial color="#ff4757" />
          </mesh>
          <pointLight color="#ff4757" intensity={1.0} distance={1.8} />
        </group>

        {/* --- 3. INFRAESTRUCTURA DE CABLE / NETWORK CABLE & BRIDGE CANÓNICO (x = -1.0 a +1.0) --- */}
        <group position={[0, 0.5, 0]}>
          {/* Tubo de cristal translúcido izquierdo */}
          <mesh position={[-0.6, 0, 0]}>
            <boxGeometry args={[0.85, 0.3, 0.3]} />
            <meshLambertMaterial color="#00d2d3" transparent={true} opacity={0.55} />
          </mesh>
          {/* Núcleo de fibra óptica brillante interior */}
          <mesh position={[-0.6, 0, 0]}>
            <boxGeometry args={[0.85, 0.1, 0.1]} />
            <meshBasicMaterial color="#00ffff" />
          </mesh>

          {/* NODO CENTRAL: NETWORK BRIDGE / CONTROLLER EN BLOQUE DE CRISTAL PURPURA */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.46, 0.46, 0.46]} />
            <meshLambertMaterial color="#a55eea" transparent={true} opacity={0.65} />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.26, 0.26, 0.26]} />
            <meshBasicMaterial color={activeStep === "transferring" ? "#00ffff" : "#ffa801"} />
          </mesh>
          <pointLight
            position={[0, 0, 0]}
            color={activeStep === "transferring" ? "#00ffff" : "#ffa801"}
            intensity={1.4}
            distance={2.8}
          />

          {/* Tubo de cristal translúcido derecho */}
          <mesh position={[0.6, 0, 0]}>
            <boxGeometry args={[0.85, 0.3, 0.3]} />
            <meshLambertMaterial color="#00d2d3" transparent={true} opacity={0.55} />
          </mesh>
          {/* Núcleo de fibra óptica brillante derecho */}
          <mesh position={[0.6, 0, 0]}>
            <boxGeometry args={[0.85, 0.1, 0.1]} />
            <meshBasicMaterial color="#00ffff" />
          </mesh>
        </group>

        {/* --- 4. ÍTEM TRANSPORTADO --- */}
        {activeStep === "transferring" && (
          <group position={[itemX, 0.5, 0]} rotation={[frame * 0.08, frame * 0.1, 0]} scale={[0.18, 0.18, 0.18]}>
            <mesh>
              <boxGeometry args={[1, 1, 1]} />
              <meshLambertMaterial color="#ffd32a" emissive="#ffa801" emissiveIntensity={0.9} />
            </mesh>
            <pointLight color="#ffd32a" intensity={0.9} distance={1.2} />
          </group>
        )}

        {/* --- 5. NETWORK PUSHER (x = +1.25, Insertador) --- */}
        <group position={[1.25, 0.5, 0]}>
          <mesh>
            <boxGeometry args={[0.34, 0.36, 0.36]} />
            <meshLambertMaterial color="#2f3542" />
          </mesh>
          <mesh position={[-0.18, 0, 0]}>
            <boxGeometry args={[0.04, 0.22, 0.22]} />
            <meshBasicMaterial color="#2ed573" />
          </mesh>
          <pointLight color="#2ed573" intensity={1.0} distance={1.8} />
        </group>

        {/* --- 6. MÁQUINA DESTINO (DISPENSER, x = +1.95) --- */}
        <group position={[1.95, 0.5, 0]}>
          <mesh material={dispenserMats}>
            <boxGeometry args={[0.96, 0.96, 0.96]} />
          </mesh>
        </group>

        {/* --- 7. MALLA ISOMÉTRICA DE GUIADO EN EL SUELO --- */}
        <gridHelper args={[8, 8, "#ff9f43", "#2f3542"]} position={[0, -0.01, 0]} />

        {/* --- 8. JACKSTAR 3D SOBERANO CON ANIMACIÓN REAL --- */}
        <Steve3D
          position={steveMovement.pos}
          rotation={steveMovement.rot}
          scale={0.92}
          action={steveMovement.action}
          heldItemMaterial={activeStep === "place_pusher" ? "PUSHER" : undefined}
          skinFolder="jack_parts"
        />
      </group>
    </ThreeCanvas>
  );
};
