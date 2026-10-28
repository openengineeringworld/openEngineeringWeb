"use client";

import type { CSSProperties } from "react";
import { motion, useReducedMotion } from "framer-motion";

const CELL = 50;

const lines = (rgb: string, alpha: number) => `
  linear-gradient(to right, rgba(${rgb},${alpha}) 1px, transparent 1px),
  linear-gradient(to bottom, rgba(${rgb},${alpha}) 1px, transparent 1px)
`;

// Soft fade toward the edges (same as your original).
const edgeFade = "radial-gradient(ellipse at center, black 20%, transparent 75%)";

// The glow is a soft spot used as a mask over a brighter copy of the grid.
const spot =
  "radial-gradient(closest-side, black 0%, rgba(0,0,0,0.55) 40%, transparent 100%)";

// The drift and the wandering glow run as plain CSS animations. Framer Motion's
// types do not accept vendor-prefixed mask properties, and CSS keyframes are
// lighter anyway.
//
// The glow's X and Y positions are animated by two separate keyframes with
// different durations, so the spot traces a smooth, wandering path that takes a
// long time to repeat instead of bouncing along a fixed line.
const css = `
@keyframes oe-grid-drift {
  from { background-position: 0px 0px; }
  to   { background-position: ${CELL}px ${CELL}px; }
}
@keyframes oe-glow-x {
  from { -webkit-mask-position-x: 0%;   mask-position-x: 0%; }
  to   { -webkit-mask-position-x: 100%; mask-position-x: 100%; }
}
@keyframes oe-glow-y {
  from { -webkit-mask-position-y: 0%;   mask-position-y: 0%; }
  to   { -webkit-mask-position-y: 100%; mask-position-y: 100%; }
}
.oe-grid-drift { animation: oe-grid-drift 40s linear infinite; }
.oe-glow-a {
  animation:
    oe-glow-x 19s ease-in-out infinite alternate,
    oe-glow-y 13s ease-in-out infinite alternate;
}
.oe-glow-b {
  animation:
    oe-glow-x 23s ease-in-out -9s infinite alternate-reverse,
    oe-glow-y 17s ease-in-out -5s infinite alternate;
}
@media (prefers-reduced-motion: reduce) {
  .oe-grid-drift, .oe-glow-a, .oe-glow-b { animation: none; }
}
`;

const baseStyle: CSSProperties = {
  backgroundImage: lines("168,85,247", 0.4),
  backgroundSize: `${CELL}px ${CELL}px`,
};

// A glow = brighter grid lines + a faint tint, both visible only inside a
// moving soft spot.
const glowStyle = (
  rgb: string,
  lineAlpha: number,
  tintAlpha: number,
  size: string
): CSSProperties => ({
  backgroundImage: `${lines(rgb, lineAlpha)}, linear-gradient(rgba(${rgb},${tintAlpha}), rgba(${rgb},${tintAlpha}))`,
  backgroundSize: `${CELL}px ${CELL}px, ${CELL}px ${CELL}px, 100% 100%`,
  maskImage: spot,
  WebkitMaskImage: spot,
  maskSize: size,
  WebkitMaskSize: size,
  maskRepeat: "no-repeat",
  WebkitMaskRepeat: "no-repeat",
  maskPosition: "0% 0%",
  WebkitMaskPosition: "0% 0%",
});

const primary = glowStyle("192,132,252", 0.95, 0.1, "42% 58%"); // purple
const secondary = glowStyle("251,146,60", 0.8, 0.06, "30% 42%"); // orange

export default function GridBackground() {
  const reduceMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0"
      style={{ maskImage: edgeFade, WebkitMaskImage: edgeFade }}
    >
      <style>{css}</style>

      {/* 1. Base grid: fades in, then drifts very slowly. The drift is exactly
             one cell long, so the loop is seamless. */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.55 }}
        transition={{ duration: 1.5 }}
      >
        <div
          className={`absolute inset-0 ${reduceMotion ? "" : "oe-grid-drift"}`}
          style={baseStyle}
        />
      </motion.div>

      {/* 2. Continuous moving glows that light up the grid as they travel. */}
      {!reduceMotion && (
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1.5 }}
        >
          <div className="oe-glow-a absolute inset-0" style={primary} />
          <div className="oe-glow-b absolute inset-0" style={secondary} />
        </motion.div>
      )}
    </div>
  );
}
