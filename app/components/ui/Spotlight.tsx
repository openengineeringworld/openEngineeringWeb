"use client";

import { useEffect, useRef } from "react";

interface SpotlightConfig {
  radius?: number;
  brightness?: number;
  color?: string;
  smoothing?: number; // cursor follow speed (0-1, per 60fps frame)
  fadeIn?: number; // fade-in speed (0-1, per 60fps frame)
  fadeOut?: number; // fade-out speed (0-1, lower = slower, softer exit)
}

interface SpotlightProps {
  config?: SpotlightConfig;
  className?: string;
}

export default function Spotlight({
  config = {},
  className = "",
}: SpotlightProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const {
    radius = 20,
    brightness = 0.0,
    color = "#ff8c00",
    smoothing = 0.14,
    fadeIn = 0.1,
    fadeOut = 0.045,
  } = config;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;

    let animationFrame = 0;
    let lastTime = 0;
    let width = 0;
    let height = 0;
    let opacity = 0;

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    let isMouseInside = false;

    // Reused pixel buffer (re-created only when the glow size changes).
    let image: ImageData | null = null;

    // Convert the hex color to RGB.
    const hex = color.replace("#", "");
    const normalized =
      hex.length === 3
        ? hex.split("").map((char) => char + char).join("")
        : hex;

    const colorValue = Number.parseInt(normalized, 16);
    const red = (colorValue >> 16) & 255;
    const green = (colorValue >> 8) & 255;
    const blue = colorValue & 255;

    // Gaussian-style falloff that reaches exactly 0 at the edge.
    // It depends only on d^2, so it is precomputed once as a lookup table.
    const K = 3.4;
    const tail = Math.exp(-K);
    const LUT_SIZE = 1024;
    const lut = new Float32Array(LUT_SIZE);
    for (let i = 0; i < LUT_SIZE; i++) {
      const d2 = i / (LUT_SIZE - 1);
      lut[i] = (Math.exp(-K * d2) - tail) / (1 - tail);
    }

    // Frame-rate independent smoothing factor.
    const factor = (speed: number, dt: number) =>
      1 - Math.pow(1 - speed, dt / 16.667);

    const smoothstep = (x: number) => x * x * (3 - 2 * x);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();

      width = rect.width;
      height = rect.height;

      // 1 canvas pixel = 1 CSS pixel. The glow is soft, so this is plenty,
      // and it keeps the per-frame pixel work small.
      canvas.width = Math.max(1, Math.round(width));
      canvas.height = Math.max(1, Math.round(height));
      image = null;
    };

    // Paints the glow as OPAQUE colour (black = no light) with per-pixel
    // dithering. The canvas is composited with mix-blend-mode: screen, so black
    // adds nothing and the glow can only brighten what is behind it.
    //
    // Why not a canvas gradient with alpha? 8-bit premultiplied alpha at very
    // low values snaps to coarse steps, which show up as thin light/dark
    // contour lines around the glow. Dithering breaks those steps up.
    const paintGlow = (cx: number, cy: number, r: number, amount: number) => {
      const sx = Math.max(0, Math.floor(cx - r));
      const sy = Math.max(0, Math.floor(cy - r));
      const ex = Math.min(canvas.width, Math.ceil(cx + r));
      const ey = Math.min(canvas.height, Math.ceil(cy + r));
      const w = ex - sx;
      const h = ey - sy;

      if (w <= 0 || h <= 0) return;

      if (!image || image.width !== w || image.height !== h) {
        image = ctx.createImageData(w, h);
      }

      const data = image.data;
      const invR2 = 1 / (r * r);
      const maxIndex = LUT_SIZE - 1;

      const rAmp = red * amount;
      const gAmp = green * amount;
      const bAmp = blue * amount;

      let i = 0;
      for (let y = sy; y < ey; y++) {
        const dy = y + 0.5 - cy;
        const dy2 = dy * dy;

        for (let x = sx; x < ex; x++) {
          const dx = x + 0.5 - cx;
          const d2 = (dx * dx + dy2) * invR2;

          if (d2 >= 1) {
            data[i] = 0;
            data[i + 1] = 0;
            data[i + 2] = 0;
          } else {
            const v = lut[(d2 * maxIndex) | 0];
            const noise = Math.random(); // dither in [0, 1)
            data[i] = (rAmp * v + noise) | 0;
            data[i + 1] = (gAmp * v + noise) | 0;
            data[i + 2] = (bAmp * v + noise) | 0;
          }

          data[i + 3] = 255;
          i += 4;
        }
      }

      ctx.putImageData(image, sx, sy);
    };

    const draw = (time: number) => {
      const dt = Math.min(time - lastTime || 16.667, 50);
      lastTime = time;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Ease opacity toward target. Fade-out is slower than fade-in.
      const target = isMouseInside ? 1 : 0;
      opacity +=
        (target - opacity) * factor(isMouseInside ? fadeIn : fadeOut, dt);

      // Smoothly follow the cursor.
      if (isMouseInside) {
        const k = factor(smoothing, dt);
        currentX += (mouseX - currentX) * k;
        currentY += (mouseY - currentY) * k;
      }

      // Smoothstep makes the fade start and end gently.
      const eased = smoothstep(Math.min(Math.max(opacity, 0), 1));

      if (eased > 0.001) {
        // The glow shrinks very slightly as it fades for a soft exit.
        const r = radius * (0.88 + 0.12 * eased);
        paintGlow(currentX, currentY, r, brightness * eased);
      }

      // Stop the loop once fully faded out (saves CPU/battery).
      if (!isMouseInside && opacity < 0.002) {
        opacity = 0;
        animationFrame = 0;
        return;
      }

      animationFrame = requestAnimationFrame(draw);
    };

    const start = () => {
      if (animationFrame) return;
      lastTime = performance.now();
      animationFrame = requestAnimationFrame(draw);
    };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();

      mouseX = event.clientX - rect.left;
      mouseY = event.clientY - rect.top;

      const inside =
        mouseX >= 0 &&
        mouseY >= 0 &&
        mouseX <= width &&
        mouseY <= height;

      // Snap to the cursor when entering from a (nearly) faded state.
      if (inside && opacity < 0.02) {
        currentX = mouseX;
        currentY = mouseY;
      }

      isMouseInside = inside;

      if (inside) start();
    };

    // The canvas has pointer-events-none, so listen on the document instead.
    const handleMouseLeave = () => {
      isMouseInside = false;
    };

    resize();

    // Keep the bitmap in sync with the element size (layout shifts, font
    // loading, etc.), not just window resizes.
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = 0;
      resizeObserver.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.documentElement.removeEventListener(
        "mouseleave",
        handleMouseLeave
      );
    };
  }, [radius, brightness, color, smoothing, fadeIn, fadeOut]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      // mix-blend-screen: black adds nothing, glow only ever adds light.
      className={`pointer-events-none absolute inset-0 h-full w-full mix-blend-screen ${className}`}
    />
  );
}
