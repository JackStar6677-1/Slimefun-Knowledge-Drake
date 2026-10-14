import React from "react";
import { AbsoluteFill } from "remotion";
import { MovingBg } from "./Bg";
import { BottomLoop } from "./std/Loops";

export const TestRing: React.FC = () => (
  <AbsoluteFill>
    <MovingBg vertical />
    <BottomLoop name="ring" seed="Slimefun 7.700 items" />
  </AbsoluteFill>
);
