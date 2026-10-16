import React, { useEffect, useMemo, useState } from "react";
import { continueRender, delayRender, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import * as THREE from "three";
import blockIndex from "../blocks-index.json";

export type VoxelCell = { x: number; y: number; z?: number; material: string };
type FaceMap = Record<string, string>;
const INDEX = blockIndex as Record<string, { shape: string; faces: FaceMap }>;

/** Carga todas las texturas necesarias (con delayRender para que el render espere) y las deja en filtro "nearest" (pixel art). */
const useTextures = (paths: string[]) => {
  const [tex, setTex] = useState<Record<string, THREE.Texture>>({});
  const key = paths.join("|");
  useEffect(() => {
    const handle = delayRender("cube3d textures");
    const loader = new THREE.TextureLoader();
    const out: Record<string, THREE.Texture> = {};
    Promise.all(
      paths.map(
        (p) =>
          new Promise<void>((res) => {
            loader.load(
              staticFile(p),
              (t) => {
                t.magFilter = THREE.NearestFilter;
                t.minFilter = THREE.NearestFilter;
                t.colorSpace = THREE.SRGBColorSpace;
                out[p] = t;
                res();
              },
              undefined,
              () => res(),
            );
          }),
      ),
    ).then(() => {
      setTex(out);
      continueRender(handle);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return tex;
};

const mat = (t: THREE.Texture | undefined, color = "#8a8a8a", extra: Partial<THREE.MeshLambertMaterialParameters> = {}) =>
  new THREE.MeshLambertMaterial({ map: t, color: t ? "#ffffff" : color, ...extra });

const Block: React.FC<{ cell: VoxelCell; tex: Record<string, THREE.Texture>; scale: number }> = ({ cell, tex, scale }) => {
  const info = INDEX[cell.material];
  const faces = info?.faces ?? {};
  const one = Object.keys(faces).length === 1 ? tex[Object.values(faces)[0]] : undefined;
  const t = (f: string, fallback: string[] = []) => tex[faces[f]] ?? one ?? fallback.map((k) => tex[faces[k]]).find(Boolean);
  const materials = useMemo(() => {
    const glass = info?.shape === "glass";
    const extra = glass ? { transparent: true, alphaTest: 0.2 } : info?.shape === "bars" ? { transparent: true, alphaTest: 0.5 } : {};
    const front = t("north", ["south", "east", "up"]);
    const back = t("south", ["north", "east", "up"]);
    return [t("east", ["north"]), t("west", ["east", "north"]), t("up", ["north"]), t("down", ["up"]), front, back].map((m) => mat(m, cell.material === "FLINT_AND_STEEL" ? "#ff8a1f" : "#5a5a5a", extra));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tex, cell.material]);
  const shape = cell.material === "FLINT_AND_STEEL" ? "fire" : info?.shape ?? "cube";
  const pos: [number, number, number] = [cell.x, cell.y, cell.z ?? 0];
  const s = Math.max(0.001, scale);
  return (
    <group position={pos} scale={[s, s, s]}>
      {shape === "fence" ? (
        <>
          <mesh material={materials} position={[0, 0, 0]}><boxGeometry args={[0.26, 1, 0.26]} /></mesh>
          <mesh material={materials} position={[0, 0.25, 0]}><boxGeometry args={[1, 0.12, 0.1]} /></mesh>
          <mesh material={materials} position={[0, -0.1, 0]}><boxGeometry args={[1, 0.12, 0.1]} /></mesh>
        </>
      ) : shape === "bars" ? (
        <mesh material={materials}><boxGeometry args={[1, 1, 0.12]} /></mesh>
      ) : shape === "slab" ? (
        <mesh material={materials} position={[0, -0.25, 0]}><boxGeometry args={[1, 0.5, 1]} /></mesh>
      ) : shape === "anvil" ? (
        <>
          <mesh material={mat(undefined, "#3d3d3d")} position={[0, -0.38, 0]}><boxGeometry args={[0.7, 0.24, 0.7]} /></mesh>
          <mesh material={mat(undefined, "#4a4a4a")} position={[0, -0.05, 0]}><boxGeometry args={[0.36, 0.45, 0.5]} /></mesh>
          <mesh material={materials} position={[0, 0.3, 0]}><boxGeometry args={[0.9, 0.34, 0.6]} /></mesh>
        </>
      ) : shape === "fire" ? (
        <mesh material={mat(undefined, "#ff8a1f", { emissive: new THREE.Color("#ff5a00"), emissiveIntensity: 0.8 })}><boxGeometry args={[0.7, 0.8, 0.7]} /></mesh>
      ) : shape === "chest" ? (
        <mesh material={materials} position={[0, -0.0625, 0]}><boxGeometry args={[0.875, 0.875, 0.875]} /></mesh>
      ) : (
        <mesh material={materials}><boxGeometry args={[shape === "cauldron" ? 0.96 : 1, 1, shape === "cauldron" ? 0.96 : 1]} /></mesh>
      )}
    </group>
  );
};

/** Modelo 3D de una construccion de bloques (p. ej. un multibloque). Los bloques aparecen de abajo hacia arriba y el conjunto gira. */
export const Voxels3D: React.FC<{ cells: VoxelCell[]; width: number; height: number; startFrame?: number; spin?: number; distance?: number }> = ({
  cells,
  width,
  height,
  startFrame = 8,
  spin = 0.012,
  distance = 6,
}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const paths = useMemo(() => {
    const set = new Set<string>();
    cells.forEach((c) => Object.values(INDEX[c.material]?.faces ?? {}).forEach((p) => set.add(p)));
    return [...set];
  }, [cells]);
  const tex = useTextures(paths);
  const ordered = useMemo(() => [...cells].sort((a, b) => a.y - b.y || a.x - b.x), [cells]);
  const cx = cells.reduce((a, c) => a + c.x, 0) / cells.length;
  const cy = cells.reduce((a, c) => a + c.y, 0) / cells.length;
  return (
    <ThreeCanvas width={width} height={height} camera={{ position: [0, 2.4, distance], fov: 38 }} gl={{ alpha: true }} style={{ background: "transparent" }}>
      <ambientLight intensity={1.05} />
      <directionalLight position={[3, 6, 4]} intensity={1.4} />
      <directionalLight position={[-4, 2, -3]} intensity={0.45} />
      <group rotation={[0, 0.55 + f * spin, 0]} position={[-cx, -cy, 0]}>
        {ordered.map((c, i) => (
          <Block key={`${c.x}-${c.y}-${c.z ?? 0}`} cell={c} tex={tex} scale={spring({ frame: f - startFrame - i * 7, fps, config: { damping: 11, mass: 0.6 } })} />
        ))}
        <gridHelper args={[8, 8, "#2a6d5e", "#1d3b34"]} position={[cx, Math.min(...cells.map((c) => c.y)) - 0.5, 0]} />
      </group>
    </ThreeCanvas>
  );
};
