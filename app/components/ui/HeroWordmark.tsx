"use client";

import * as React from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Procedural "Open Engineering" title.
 *
 * Adapted from the Kiln footer wordmark: the letters are not a font. Each one
 * is drawn from numbers (superellipse bowls clipped into shapes), so stroke
 * weight is a value. Letters rise out of the baseline on load, swell under the
 * pointer, and press flat when clicked.
 *
 * Only the letters needed for "Open Engineering" are included. Any text that
 * uses other characters falls back to plain text, so nothing ever breaks.
 */

type Pt = [number, number];

const XH = 100; // x-height
const ASC = 36; // ascender / capital overshoot above the x-height
const DESC = 36; // descender
const SQUARE = 2.4; // bowl squareness: 2 = ellipse, higher = squarer
const TAU = Math.PI * 2;
const TOP = -60; // viewBox top (room for the i-dot when letters swell)
const BOTTOM = XH + DESC;
const TRACKING = 10;

const clamp = (v: number, lo: number, hi: number) =>
  v < lo ? lo : v > hi ? hi : v;

const signedArea = (p: Pt[]) => {
  let a = 0;
  for (let i = 0; i < p.length; i++) {
    const j = (i + 1) % p.length;
    a += p[i][0] * p[j][1] - p[j][0] * p[i][1];
  }
  return a / 2;
};

// Fills run clockwise, holes anticlockwise, so one nonzero path holds a glyph.
const orient = (p: Pt[], sign: 1 | -1): Pt[] =>
  signedArea(p) * sign >= 0 ? p : p.slice().reverse();

const sePt = (cx: number, cy: number, rx: number, ry: number, t: number): Pt => {
  const c = Math.cos(t);
  const s = Math.sin(t);
  return [
    cx + rx * Math.sign(c) * Math.pow(Math.abs(c), 2 / SQUARE),
    cy + ry * Math.sign(s) * Math.pow(Math.abs(s), 2 / SQUARE),
  ];
};

// A superellipse bowl: its outline and its counter.
const ring = (
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  V: number,
  h: number
): Pt[][] => {
  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2;
  const rx = (x1 - x0) / 2;
  const ry = (y1 - y0) / 2;
  const irx = Math.max(1, rx - V);
  const iry = Math.max(1, ry - h);
  const outer: Pt[] = [];
  const inner: Pt[] = [];
  for (let i = 0; i < 96; i++) {
    const t = (i / 96) * TAU;
    outer.push(sePt(cx, cy, rx, ry, t));
    inner.push(sePt(cx, cy, irx, iry, t));
  }
  return [orient(outer, 1), orient(inner, -1)];
};

type Half = [axis: 0 | 1, at: number, side: 1 | -1];

// Sutherland–Hodgman clip against one half-plane.
const clipHalf = (poly: Pt[], [axis, at, side]: Half): Pt[] => {
  const out: Pt[] = [];
  const inside = (p: Pt) => (p[axis] - at) * side <= 0;
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i];
    const b = poly[(i + 1) % poly.length];
    const ia = inside(a);
    const ib = inside(b);
    if (ia) out.push(a);
    if (ia !== ib) {
      const u = (at - a[axis]) / (b[axis] - a[axis]);
      out.push([a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u]);
    }
  }
  return out;
};

const keep = (shape: Pt[][], ...halves: Half[]): Pt[][] =>
  shape
    .map((poly) => halves.reduce(clipHalf, poly))
    .filter((poly) => poly.length >= 3 && Math.abs(signedArea(poly)) > 1e-6);

const rect = (x0: number, y0: number, x1: number, y1: number): Pt[] =>
  orient([[x0, y0], [x1, y0], [x1, y1], [x0, y1]], 1);

type GlyphFn = (V: number, h: number) => Pt[][];

const B = 112; // shared bowl width

// [advance width, shapes]. Advance widths never change with weight, so a
// letter can swell without the word re-flowing.
const GLYPHS: Record<string, [number, GlyphFn]> = {
  // Capitals
  O: [128, (V, h) => ring(0, -ASC, 128, XH, V, h)],
  E: [
    100,
    (V, h) => {
      const mid = (XH - ASC) / 2;
      return [
        rect(0, -ASC, V, XH),
        rect(0, -ASC, 98, -ASC + h),
        rect(0, mid - h / 2, 86, mid + h / 2),
        rect(0, XH - h, 98, XH),
      ];
    },
  ],
  // Lowercase
  e: [
    B,
    (V, h) => {
      const o = ring(0, 0, B, XH, V, h);
      return [
        ...keep(o, [1, XH / 2, 1]),
        ...keep(o, [1, XH / 2, -1], [0, 82, 1]),
        rect(V * 0.5, XH / 2 - h / 2, B, XH / 2 + h / 2),
      ];
    },
  ],
  g: [
    B,
    (V, h) => [
      ...ring(0, 0, B, XH, V, h),
      rect(B - V, 0, B, 92),
      ...keep(ring(0, 48, B, XH + DESC, V, h), [1, 92, -1], [0, 14, -1]),
    ],
  ],
  i: [
    30,
    (V) => {
      const d = V * 0.95;
      return [
        rect(15 - V / 2, 0, 15 + V / 2, XH),
        rect(15 - d / 2, -(d + 14), 15 + d / 2, -14), // the dot
      ];
    },
  ],
  n: [
    B,
    (V, h) => [
      rect(0, 0, V, XH),
      ...keep(ring(0, 0, B, XH, V, h), [1, XH / 2, 1]),
      rect(B - V, XH / 2, B, XH),
    ],
  ],
  p: [B, (V, h) => [rect(0, 0, V, XH + DESC), ...ring(0, 0, B, XH, V, h)]],
  r: [
    84,
    (V, h) => [
      rect(0, 0, V, XH),
      ...keep(ring(0, 0, 108, XH + 10, V, h), [1, (XH + 10) / 2, 1], [0, 84, 1]),
    ],
  ],
  " ": [46, () => []],
};

// Weight factor k -> stroke thicknesses. Verticals move more than horizontals.
const strokes = (k: number) => {
  const w = clamp(Number.isFinite(k) ? k : 1, 0.4, 1.6);
  return { V: 30 * w, h: 19 * (0.55 + 0.45 * w) };
};

const n1 = (v: number) => String(Math.round(v * 10) / 10);

const glyphPath = (ch: string, k: number, dx: number) => {
  const g = GLYPHS[ch];
  if (!g) return "";
  const { V, h } = strokes(k);
  return g[1](V, h)
    .map((poly) => "M" + poly.map((p) => n1(p[0] + dx) + " " + n1(p[1])).join("L") + "Z")
    .join("");
};

const layoutWord = (word: string) => {
  const letters: { ch: string; x: number; w: number }[] = [];
  let x = 0;
  for (const ch of word) {
    const g = GLYPHS[ch];
    if (!g) continue;
    letters.push({ ch, x, w: g[0] });
    x += g[0] + TRACKING;
  }
  return { letters, width: letters.length ? x - TRACKING : 0 };
};

// Each letter's target weight for a pointer at px (null = pointer away).
const lensWeights = (
  centres: number[],
  px: number | null,
  base: number,
  boost: number,
  radius: number
) =>
  centres.map((c) => {
    if (px === null || !Number.isFinite(px)) return base;
    const d = (c - px) / radius;
    return base + boost * Math.exp(-d * d);
  });

// Frame-rate independent ease: k is the fraction closed per 1/60 s.
const approach = (from: number, to: number, k: number, dt: number) =>
  to + (from - to) * Math.pow(1 - clamp(k, 0, 1), clamp(dt, 0, 0.1) * 60);

const CSS = `
.oe-word { display: block; width: 100%; height: auto; overflow: hidden; touch-action: pan-y; }
.oe-l {
  transform: translateY(170%);
  transform-box: fill-box;
  transition: transform 1s cubic-bezier(.16,.9,.18,1);
  transition-delay: var(--oe-d, 0ms);
}
.oe-l path { transform-box: fill-box; transform-origin: 50% 100%; cursor: pointer; }
.oe-shown .oe-l { transform: none; }
@media (prefers-reduced-motion: reduce) {
  .oe-l { transform: none; transition: none; }
}
`;

interface HeroWordmarkProps {
  text?: string;
  className?: string;
  /** Resting stroke weight. 1 is the reference, lower is lighter. */
  weight?: number;
  /** How much letters swell near the pointer. */
  boost?: number;
  /** Let the letters swell under the pointer. */
  lens?: boolean;
}

export default function HeroWordmark({
  text = "Open Engineering",
  className = "",
  weight = 0.82,
  boost = 0.4,
  lens = true,
}: HeroWordmarkProps) {
  const reduceMotion = useReducedMotion();
  const drawn = [...text].every((c) => c in GLYPHS);
  const lay = React.useMemo(() => layoutWord(drawn ? text : ""), [text, drawn]);
  const centres = React.useMemo(
    () => lay.letters.map((l) => l.x + l.w / 2),
    [lay]
  );
  const base = clamp(weight, 0.5, 1.4);

  const [shown, setShown] = React.useState(false);
  const pathRefs = React.useRef<(SVGPathElement | null)[]>([]);

  // Animation state lives in a ref and is written straight to the DOM, so a
  // pointer sweep never re-renders React.
  const anim = React.useRef({
    k: [] as number[],
    kT: [] as number[],
    raf: 0,
    last: 0,
    reduced: false,
  });

  if (anim.current.k.length !== lay.letters.length) {
    anim.current.k = lay.letters.map(() => base);
    anim.current.kT = lay.letters.map(() => base);
  }

  anim.current.reduced = !!reduceMotion;

  const paint = React.useCallback(() => {
    const a = anim.current;
    lay.letters.forEach((l, i) => {
      const p = pathRefs.current[i];
      if (p) p.setAttribute("d", glyphPath(l.ch, a.k[i], l.x));
    });
  }, [lay]);

  const kick = React.useCallback(() => {
    const a = anim.current;
    if (a.raf) return;
    a.last = 0;
    const step = (now: number) => {
      const dt = a.last ? (now - a.last) / 1000 : 1 / 60;
      a.last = now;
      let busy = false;
      for (let i = 0; i < a.k.length; i++) {
        const next = a.reduced ? a.kT[i] : approach(a.k[i], a.kT[i], 0.16, dt);
        a.k[i] = Math.abs(next - a.kT[i]) < 1e-3 ? a.kT[i] : next;
        if (a.k[i] !== a.kT[i]) busy = true;
      }
      paint();
      a.raf = busy ? requestAnimationFrame(step) : 0;
    };
    a.raf = requestAnimationFrame(step);
  }, [paint]);

  // Rise-in once mounted.
  React.useEffect(() => {
    const t = setTimeout(() => setShown(true), 80);
    return () => {
      clearTimeout(t);
      cancelAnimationFrame(anim.current.raf);
      anim.current.raf = 0;
    };
  }, []);

  // A new weight prop moves every resting letter.
  React.useEffect(() => {
    anim.current.kT = anim.current.kT.map(() => base);
    kick();
  }, [base, kick]);

  if (!drawn) return <span className={`block ${className}`}>{text}</span>;

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!lens || reduceMotion || e.pointerType === "touch") return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * lay.width;
    anim.current.kT = lensWeights(centres, x, base, boost, 150);
    kick();
  };

  const onLeave = () => {
    anim.current.kT = lensWeights(centres, null, base, boost, 150);
    kick();
  };

  // Click a letter: it swells, then springs back.
  const stamp = (i: number) => {
    const a = anim.current;
    a.k[i] = Math.min(1.6, a.k[i] + 0.55);
    kick();
    const p = pathRefs.current[i];
    if (p && !a.reduced && typeof p.animate === "function") {
      p.animate(
        [
          { transform: "none" },
          { transform: "scale(1.05, 0.8)", offset: 0.25 },
          { transform: "scale(0.98, 1.05)", offset: 0.6 },
          { transform: "none" },
        ],
        { duration: 620, easing: "cubic-bezier(.3,.7,.3,1)" }
      );
    }
  };

  return (
    <span className={`block ${className}`}>
      <style>{CSS}</style>

      {/* Real text for screen readers and search engines */}
      <span className="sr-only">{text}</span>

      <svg
        className={`oe-word ${shown || reduceMotion ? "oe-shown" : ""}`}
        viewBox={`0 ${TOP} ${lay.width} ${BOTTOM - TOP}`}
        fill="currentColor"
        aria-hidden="true"
        onPointerMove={onMove}
        onPointerLeave={onLeave}
      >
        {lay.letters.map((l, i) => (
          <g
            key={i + l.ch}
            className="oe-l"
            style={{ "--oe-d": `${i * 70}ms` } as React.CSSProperties}
          >
            <path
              ref={(el) => {
                pathRefs.current[i] = el;
              }}
              d={glyphPath(l.ch, anim.current.k[i] ?? base, l.x)}
              onClick={() => stamp(i)}
            />
          </g>
        ))}
      </svg>
    </span>
  );
}
