import React, { useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { continueRender, delayRender, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

export type SteveAction =
  | "idle"
  | "walk"
  | "interact"
  | "hold"
  | "place_block"
  | "desk"
  | "explain"
  | "point"
  | "craft"
  | "nod"
  | "look_machine";

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
    if (action === "point") {
      // Brazo derecho señalando horizontalmente hacia la derecha / pantalla
      return [-Math.PI / 2.3, -0.45, 0.35] as [number, number, number];
    }
    if (action === "explain") {
      // Gesticulación oratoria natural y viva con la mano derecha
      const pitch = -Math.PI / 4.2 + Math.sin(frame * 0.12) * 0.28;
      const yaw = -0.22 + Math.cos(frame * 0.09) * 0.15;
      const roll = 0.2 + Math.sin(frame * 0.1) * 0.12;
      return [pitch, yaw, roll] as [number, number, number];
    }
    if (action === "craft") {
      // Movimiento rítmico de ensamblado en mesa de trabajo
      const pitch = -Math.PI / 2.8 + Math.sin(frame * 0.22) * 0.35;
      return [pitch, -0.2, 0.15] as [number, number, number];
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
  }, [action, interactProgress, punchAnim, walkCycle, breathCycle, frame]);

  const leftArmRotation = useMemo(() => {
    if (action === "point") {
      return [breathCycle, 0.1, -0.1] as [number, number, number];
    }
    if (action === "explain") {
      // Gesticulación oratoria de la mano izquierda en contrapunto
      const pitch = -Math.PI / 4.8 + Math.sin(frame * 0.11 + 1.2) * 0.24;
      const yaw = 0.18 + Math.cos(frame * 0.08 + 1.0) * 0.14;
      const roll = -0.18 - Math.sin(frame * 0.1 + 0.8) * 0.1;
      return [pitch, yaw, roll] as [number, number, number];
    }
    if (action === "craft") {
      // Mano izquierda trabajando de forma alternada
      const pitch = -Math.PI / 2.8 + Math.sin(frame * 0.22 + Math.PI) * 0.35;
      return [pitch, 0.2, -0.15] as [number, number, number];
    }
    if (action === "desk") {
      return [-Math.PI / 3.2, 0.2, -0.1] as [number, number, number];
    }
    if (action === "walk") {
      return [-walkCycle * 0.6, 0, -0.05] as [number, number, number];
    }
    return [-breathCycle, 0, -0.05] as [number, number, number];
  }, [action, walkCycle, breathCycle, frame]);

  const rightLegRotation = useMemo(() => {
    if (action === "walk") {
      return [-walkCycle * 0.55, 0, 0] as [number, number, number];
    }
    // Suave cambio de peso corporal al estar de pie
    return [Math.sin(frame * 0.03) * 0.03, 0, 0] as [number, number, number];
  }, [action, walkCycle, frame]);

  const leftLegRotation = useMemo(() => {
    if (action === "walk") {
      return [walkCycle * 0.55, 0, 0] as [number, number, number];
    }
    return [-Math.sin(frame * 0.03) * 0.03, 0, 0] as [number, number, number];
  }, [action, walkCycle, frame]);

  const headRotation = useMemo(() => {
    if (action === "interact" || action === "place_block") {
      return [0.15, -0.15, 0] as [number, number, number];
    }
    if (action === "point") {
      // Mirar hacia la dirección señalada
      return [0.08, -0.38, 0] as [number, number, number];
    }
    if (action === "look_machine") {
      // Mirar con curiosidad hacia el multibloque 3D
      return [0.06, 0.42, 0.04] as [number, number, number];
    }
    if (action === "craft") {
      // Mirar hacia abajo hacia el objeto que construye
      return [0.38, 0, 0] as [number, number, number];
    }
    if (action === "nod") {
      // Asentir con la cabeza rítmicamente
      return [Math.sin(frame * 0.2) * 0.22, 0, 0] as [number, number, number];
    }
    if (action === "explain") {
      // Movimiento oratorio de cabeza fluido
      return [
        Math.sin(frame * 0.09) * 0.09,
        Math.sin(frame * 0.06) * 0.16,
        Math.sin(frame * 0.04) * 0.05,
      ] as [number, number, number];
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
