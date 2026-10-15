import React, { useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { continueRender, delayRender, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

export type SteveAction = "idle" | "walk" | "interact" | "hold" | "place_block";

interface SteveProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  action?: SteveAction;
  heldItemMaterial?: string;
  interactProgress?: number;
  skinFolder?: string;
}

const STEVE_PARTS = [
  "head_right", "head_left", "head_top", "head_bottom", "head_front", "head_back",
  "torso_right", "torso_left", "torso_top", "torso_bottom", "torso_front", "torso_back",
  "arm_right", "arm_left", "arm_top", "arm_bottom", "arm_front", "arm_back",
  "leg_right", "leg_left", "leg_top", "leg_bottom", "leg_front", "leg_back",
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
              () => resolve()
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
    if (action === "walk") {
      return [walkCycle * 0.6, 0, 0.05] as [number, number, number];
    }
    return [breathCycle, 0, 0.05] as [number, number, number];
  }, [action, interactProgress, punchAnim, walkCycle, breathCycle]);

  const leftArmRotation = useMemo(() => {
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

  const headMats = useMemo(() => createPartMaterials(tex, "head", "#c68c6d"), [tex]);
  const torsoMats = useMemo(() => createPartMaterials(tex, "torso", "#00a3a3"), [tex]);
  const armMats = useMemo(() => createPartMaterials(tex, "arm", "#00a3a3"), [tex]);
  const legMats = useMemo(() => createPartMaterials(tex, "leg", "#2e3b8a"), [tex]);

  return (
    <group position={position} rotation={rotation} scale={[scale, scale, scale]}>
      {/* CABEZA (Pivot en el cuello: y = 1.45) */}
      <group position={[0, 1.45, 0]} rotation={headRotation}>
        <mesh position={[0, 0.25, 0]} material={headMats}>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
        </mesh>
      </group>

      {/* TORSO */}
      <mesh position={[0, 1.07, 0]} material={torsoMats}>
        <boxGeometry args={[0.5, 0.75, 0.25]} />
      </mesh>

      {/* BRAZO DERECHO */}
      <group position={[-0.375, 1.4, 0]} rotation={rightArmRotation}>
        <mesh position={[0, -0.35, 0]} material={armMats}>
          <boxGeometry args={[0.22, 0.72, 0.22]} />
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
        <mesh position={[0, -0.35, 0]} material={armMats}>
          <boxGeometry args={[0.22, 0.72, 0.22]} />
        </mesh>
      </group>

      {/* PIERNA DERECHA */}
      <group position={[-0.13, 0.7, 0]} rotation={rightLegRotation}>
        <mesh position={[0, -0.35, 0]} material={legMats}>
          <boxGeometry args={[0.23, 0.7, 0.23]} />
        </mesh>
      </group>

      {/* PIERNA IZQUIERDA */}
      <group position={[0.13, 0.7, 0]} rotation={leftLegRotation}>
        <mesh position={[0, -0.35, 0]} material={legMats}>
          <boxGeometry args={[0.23, 0.7, 0.23]} />
        </mesh>
      </group>
    </group>
  );
};
