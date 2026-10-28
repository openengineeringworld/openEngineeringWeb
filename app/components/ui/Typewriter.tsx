"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

interface TypewriterProps {
  text: string;
  className?: string;
  /** Prompt shown before the text, like a shell. Pass "" to hide it. */
  prompt?: string;
  /** Average milliseconds per typed character */
  speed?: number;
  /** Milliseconds per character while backspacing */
  eraseSpeed?: number;
  /** Milliseconds to wait before the very first character */
  delay?: number;
  /** Milliseconds the finished text stays on screen */
  pause?: number;
  /** Milliseconds the line stays empty before typing again */
  interval?: number;
}

const css = `
@keyframes oe-caret-blink {
  0%, 49%   { opacity: 1; }
  50%, 100% { opacity: 0; }
}
.oe-caret-idle { animation: oe-caret-blink 1.06s steps(1, end) infinite; }
@media (prefers-reduced-motion: reduce) {
  .oe-caret-idle { animation: none; }
}
`;

export default function Typewriter({
  text,
  className = "",
  prompt = "",
  speed = 70,
  eraseSpeed = 28,
  delay = 800,
  pause = 2600,
  interval = 800,
}: TypewriterProps) {
  const reduceMotion = useReducedMotion();
  const [count, setCount] = useState(0);
  // True while characters are being typed or deleted: the caret stays solid,
  // like a terminal. When idle it blinks.
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (reduceMotion) return;

    let timer: ReturnType<typeof setTimeout>;
    let i = 0;

    const type = () => {
      i += 1;
      setCount(i);
      setBusy(true);

      if (i < text.length) {
        // Uneven rhythm, like a real keyboard; a touch slower after spaces.
        const jitter = speed * (0.45 + Math.random() * 1.1);
        const extra = text[i - 1] === " " ? speed * 0.5 : 0;
        timer = setTimeout(type, jitter + extra);
      } else {
        setBusy(false);
        timer = setTimeout(erase, pause);
      }
    };

    const erase = () => {
      i -= 1;
      setCount(i);
      setBusy(true);

      if (i > 0) {
        timer = setTimeout(erase, eraseSpeed);
      } else {
        setBusy(false);
        timer = setTimeout(type, interval);
      }
    };

    timer = setTimeout(type, delay);
    return () => clearTimeout(timer);
  }, [text, speed, eraseSpeed, delay, pause, interval, reduceMotion]);

  const typed = reduceMotion ? text : text.slice(0, count);
  const promptText = prompt ? `${prompt} ` : "";

  return (
    <span className={`text-center ${className}`}>
      <style>{css}</style>

      {/* Real text for screen readers */}
      <span className="sr-only">{text}</span>

      {/* The inline-block is as wide as the full line and centred by the parent;
          the visible text is centred inside it, so it stays centred while it
          types and deletes. */}
      <span className="relative inline-block text-center" aria-hidden="true">
        {/* Invisible full line reserves the final size, so nothing jumps */}
        <span className="invisible block text-center">
          {promptText}
          {text}
        </span>

        {/* Visible line */}
        <span className="absolute inset-0 block text-center">
          {prompt && <span className="text-purple-400">{promptText}</span>}
          {typed}
          {!reduceMotion && (
            <span
              className={`ml-[0.15em] inline-block h-[0.1em] min-h-[2px] w-[0.6em] translate-y-[0.12em] bg-purple-400 ${
                busy ? "" : "oe-caret-idle"
              }`}
            />
          )}
        </span>
      </span>
    </span>
  );
}
