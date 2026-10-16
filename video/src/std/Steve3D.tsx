import React, { useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { continueRender, delayRender, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

export type SteveAction = "idle" | "walk" | "interact" | "hold" | "place_block" | "desk";

interface SteveProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  action?: SteveAction;
  heldItemMaterial?: string;
  interactProgress?: number;
  skinFolder?: string;
}

// 1. Capa base + 2. Capa overlay (hat, jacket, sleeves, pants)
const STEVE_PARTS = [
  // Base Layer
  "head_right", "head_left", "head_top", "head_bottom", "head_front", "head_back",
  "torso_right", "torso_left", "torso_top", "torso_bottom", "torso_front", "torso_back",
  "arm_right", "arm_left", "arm_top", "arm_bottom", "arm_front", "arm_back",
  "larm_right", "larm_left", "larm_top", "larm_bottom", "larm_front", "larm_back",
  "leg_right", "leg_left", "leg_top", "leg_bottom", "leg_front", "leg_back",
  "lleg_right", "lleg_left", "lleg_top", "lleg_bottom", "lleg_front", "lleg_back",
  // Outer Overlay Layer
  "hat_right", "hat_left", "hat_top", "hat_bottom", "hat_front", "hat_back",
  "jacket_right", "jacket_left", "jacket_top", "jacket_bottom", "jacket_front", "jacket_back",
  "rsleeve_right", "rsleeve_left", "rsleeve_top", "rsleeve_bottom", "rsleeve_front", "rsleeve_back",
  "lsleeve_right", "lsleeve_left", "lsleeve_top", "lsleeve_bottom", "lsleeve_front", "lsleeve_back",
  "rpant_right", "rpant_left", "rpant_top", "rpant_bottom", "rpant_front", "rpant_back",
  "lpant_right", "lpant_left", "lpant_top", "lpant_bottom", "lpant_front", "lpant_back",
];

const useSteveTextures = (folder: string = "jack_parts") => {
  const [textures, setTextures] = useState<Record<string, THREE.Texture>>({});

  useEffect(() => {
    const handle = delayRender(`steve textures ${folder}`);
    const loader = new THREE.TextureLoader();
    const loaded: Record<string, THREE.Texture> = {};

    Promise.all(
      STEVE_PARTS.map(
        (part) =>
          new Promise<void>((resolve) => {
            loader.load(
              staticFile(`${folder}/${part}.png`),
              (tex) => {
                tex.magFilter = THREE.NearestFilter;
                tex.minFilter = THREE.NearestFilter;
                tex.colorSpace = THREE.SRGBColorSpace;
                loaded[part] = tex;
                resolve();
              },
              undefined,
              () => resolve() // No falla si alguna textura opcional no existe
            );
          })
      )
    ).then(() => {
      setTextures(loaded);
      continueRender(handle);
    });
  }, [folder]);

  return textures;
};

// Materiales para la capa base
function createPartMaterials(tex: Record<string, THREE.Texture>, prefix: string, fallbackColor: string) {
  const getMat = (side: string) => {
    const t = tex[`${prefix}_${side}`];
    return new THREE.MeshLambertMaterial({
      map: t || undefined,
      color: t ? "#ffffff" : fallbackColor,
    });
  };

  return [
    getMat("right"),  // +X
    getMat("left"),   // -X
    getMat("top"),    // +Y
    getMat("bottom"), // -Y
    getMat("front"),  // +Z
    getMat("back"),   // -Z
  ];
}

// Materiales para la segunda capa (outer layer overlay) con canal alfa y transparencia
function createOverlayMaterials(tex: Record<string, THREE.Texture>, prefix: string) {
  const getMat = (side: string) => {
    const t = tex[`${prefix}_${side}`];
    return new THREE.MeshLambertMaterial({
      map: t || undefined,
      transparent: true,
      alphaTest: 0.1,
      side: THREE.DoubleSide,
      color: "#ffffff",
    });
  };

  return [
    getMat("right"),  // +X
    getMat("left"),   // -X
    getMat("top"),    // +Y
    getMat("bottom"), // -Y
    getMat("front"),  // +Z
    getMat("back"),   // -Z
  ];
}

export const Steve3D: React.FC<SteveProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  action = "idle",
  heldItemMaterial,
  interactProgress,
  skinFolder = "jack_parts",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tex = useSteveTextures(skinFolder);

  // Animaciones según acción
  const walkCycle = Math.sin((frame / fps) * Math.PI * 4);
  const breathCycle = Math.sin((frame / fps) * Math.PI * 1.5) * 0.02;

  const punchAnim = spring({
    frame: frame % 30,
    fps,
    config: { damping: 12, mass: 0.5 },
  });

  const rightArmRotation = useMemo(() => {
    if (action === "interact" || action === "place_block") {
      const p = interactProgress !== undefined ? interactProgress : punchAnim;
      const pitch = -Math.PI / 3 - Math.sin(p * Math.PI) * 0.8;
      const yaw = -0.15;
      return [pitch, yaw, 0.1] as [number, number, number];
    }
    if (action === "hold") {
      return [-Math.PI / 4, -0.1, 0.1] as [number, number, number];
    }
    if (action === "desk") {
      return [-Math.PI / 3.2, -0.2, 0.1] as [number, number, number];
    }
    if (action === "walk") {
      return [walkCycle * 0.6, 0, 0.05] as [number, number, number];
    }
    return [breathCycle, 0, 0.05] as [number, number, number];
  }, [action, interactProgress, punchAnim, walkCycle, breathCycle]);

  const leftArmRotation = useMemo(() => {
    if (action === "desk") {
      return [-Math.PI / 3.2, 0.2, -0.1] as [number, number, number];
    }
    if (action === "walk") {
      return [-walkCycle * 0.6, 0, -0.05] as [number, number, number];
    }
    return [-breathCycle, 0, -0.05] as [number, number, number];
  }, [action, walkCycle, breathCycle]);

  const rightLegRotation = useMemo(() => {
    if (action === "walk") {
      return [-walkCycle * 0.55, 0, 0] as [number, number, number];
    }
    return [0, 0, 0] as [number, number, number];
  }, [action, walkCycle]);

  const leftLegRotation = useMemo(() => {
    if (action === "walk") {
      return [walkCycle * 0.55, 0, 0] as [number, number, number];
    }
    return [0, 0, 0] as [number, number, number];
  }, [action, walkCycle]);

  const headRotation = useMemo(() => {
    if (action === "interact" || action === "place_block") {
      return [0.15, -0.15, 0] as [number, number, number];
    }
    return [Math.sin(frame * 0.04) * 0.05, Math.sin(frame * 0.03) * 0.1, 0] as [number, number, number];
  }, [action, frame]);

  // Capa Base
  const headMats = useMemo(() => createPartMaterials(tex, "head", "#c68c6d"), [tex]);
  const torsoMats = useMemo(() => createPartMaterials(tex, "torso", "#00a3a3"), [tex]);
  const rarmMats = useMemo(() => createPartMaterials(tex, "arm", "#00a3a3"), [tex]);
  const larmMats = useMemo(() => createPartMaterials(tex, "larm", "#00a3a3"), [tex]);
  const rlegMats = useMemo(() => createPartMaterials(tex, "leg", "#2e3b8a"), [tex]);
  const llegMats = useMemo(() => createPartMaterials(tex, "lleg", "#2e3b8a"), [tex]);

  // Capa Overlay (Outer Layer)
  const hatMats = useMemo(() => createOverlayMaterials(tex, "hat"), [tex]);
  const jacketMats = useMemo(() => createOverlayMaterials(tex, "jacket"), [tex]);
  const rsleeveMats = useMemo(() => createOverlayMaterials(tex, "rsleeve"), [tex]);
  const lsleeveMats = useMemo(() => createOverlayMaterials(tex, "lsleeve"), [tex]);
  const rpantMats = useMemo(() => createOverlayMaterials(tex, "rpant"), [tex]);
  const lpantMats = useMemo(() => createOverlayMaterials(tex, "lpant"), [tex]);

  return (
    <group position={position} rotation={rotation} scale={[scale, scale, scale]}>
      {/* CABEZA (Pivot en el cuello: y = 1.45) */}
      <group position={[0, 1.45, 0]} rotation={headRotation}>
        {/* Capa Base Cabeza */}
        <mesh position={[0, 0.25, 0]} material={headMats}>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
        </mesh>
        {/* Capa Exterior Cabeza (Sombrero / Capucha / Cabello 3D) */}
        <mesh position={[0, 0.25, 0]} material={hatMats}>
          <boxGeometry args={[0.54, 0.54, 0.54]} />
        </mesh>
      </group>

      {/* TORSO */}
      <mesh position={[0, 1.07, 0]} material={torsoMats}>
        <boxGeometry args={[0.5, 0.75, 0.25]} />
      </mesh>
      {/* Capa Exterior Torso (Chaqueta 3D) */}
      <mesh position={[0, 1.07, 0]} material={jacketMats}>
        <boxGeometry args={[0.53, 0.77, 0.28]} />
      </mesh>

      {/* BRAZO DERECHO */}
      <group position={[-0.375, 1.4, 0]} rotation={rightArmRotation}>
        {/* Capa Base Brazo Derecho */}
        <mesh position={[0, -0.35, 0]} material={rarmMats}>
          <boxGeometry args={[0.22, 0.72, 0.22]} />
        </mesh>
        {/* Capa Exterior Manga Derecha 3D */}
        <mesh position={[0, -0.35, 0]} material={rsleeveMats}>
          <boxGeometry args={[0.245, 0.74, 0.245]} />
        </mesh>
        {heldItemMaterial && (
          <group position={[0, -0.68, 0.16]} rotation={[Math.PI / 4, 0, 0]} scale={[0.25, 0.25, 0.25]}>
            <mesh>
              <boxGeometry args={[1, 1, 1]} />
              <meshLambertMaterial color="#27ae60" emissive="#004400" emissiveIntensity={0.4} />
            </mesh>
          </group>
        )}
      </group>

      {/* BRAZO IZQUIERDO */}
      <group position={[0.375, 1.4, 0]} rotation={leftArmRotation}>
        {/* Capa Base Brazo Izquierdo */}
        <mesh position={[0, -0.35, 0]} material={larmMats}>
          <boxGeometry args={[0.22, 0.72, 0.22]} />
        </mesh>
        {/* Capa Exterior Manga Izquierda 3D */}
        <mesh position={[0, -0.35, 0]} material={lsleeveMats}>
          <boxGeometry args={[0.245, 0.74, 0.245]} />
        </mesh>
      </group>

      {/* PIERNA DERECHA */}
      <group position={[-0.13, 0.7, 0]} rotation={rightLegRotation}>
        {/* Capa Base Pierna Derecha */}
        <mesh position={[0, -0.35, 0]} material={rlegMats}>
          <boxGeometry args={[0.23, 0.7, 0.23]} />
        </mesh>
        {/* Capa Exterior Pantalón Derecho 3D */}
        <mesh position={[0, -0.35, 0]} material={rpantMats}>
          <boxGeometry args={[0.255, 0.72, 0.255]} />
        </mesh>
      </group>

      {/* PIERNA IZQUIERDA */}
      <group position={[0.13, 0.7, 0]} rotation={leftLegRotation}>
        {/* Capa Base Pierna Izquierda */}
        <mesh position={[0, -0.35, 0]} material={llegMats}>
          <boxGeometry args={[0.23, 0.7, 0.23]} />
        </mesh>
        {/* Capa Exterior Pantalón Izquierdo 3D */}
        <mesh position={[0, -0.35, 0]} material={lpantMats}>
          <boxGeometry args={[0.255, 0.72, 0.255]} />
        </mesh>
      </group>
    </group>
  );
};
