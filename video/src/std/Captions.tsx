import React from "react";
import { useCurrentFrame } from "remotion";
import { T } from "./theme";

/** Subtitulos palabra por palabra (3 por tarjeta, la activa en dorado). words = [{w, t, d}] en segundos desde el inicio de la escena. */
export const Captions: React.FC<{ words: { w: string; t: number; d: number }[]; top?: number; height?: number; size?: number }> = ({
  words,
  top = T.reel.captionTop,
  height = 250,
  size = 74,
}) => {
  const f = useCurrentFrame();
  const t = f / T.fps;
  let idx = words.findIndex((w) => t < w.t + w.d);
  if (idx < 0) idx = words.length - 1;
  const start = Math.floor(idx / 3) * 3;
  return (
    <div style={{ position: "absolute", left: 30, right: 30, top, height, display: "flex", flexWrap: "wrap", gap: "6px 26px", alignItems: "center", justifyContent: "center", alignContent: "center", fontFamily: T.fontBlack }}>
      {words.slice(start, start + 3).map((w, i) => {
        const active = start + i === idx;
        return (
          <span key={start + i} style={{ fontSize: size, fontWeight: 900, textTransform: "uppercase", color: active ? T.color.hot : "#fff", WebkitTextStroke: "9px #000", paintOrder: "stroke fill", lineHeight: 1.05,
            transform: `scale(${active ? 1.1 : 1})`, textShadow: "0 8px 0 rgba(0,0,0,.6)" }}>
            {w.w}
          </span>
        );
      })}
    </div>
  );
};
