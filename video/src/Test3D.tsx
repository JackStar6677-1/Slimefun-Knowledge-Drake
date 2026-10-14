import React from "react";
import { AbsoluteFill } from "remotion";
import { MovingBg } from "./Bg";
import { Voxels3D } from "./std/Cube3D";
import mb from "./multiblocks.json";

export const Test3D: React.FC = () => (
  <AbsoluteFill>
    <MovingBg />
    <div style={{ position: "absolute", left: 0, top: 0 }}>
      <Voxels3D cells={(mb as any).ORE_WASHER.cells} width={900} height={1000} />
    </div>
    <div style={{ position: "absolute", left: 960, top: 0 }}>
      <Voxels3D cells={(mb as any).ORE_CRUSHER.cells} width={900} height={1000} />
    </div>
  </AbsoluteFill>
);
