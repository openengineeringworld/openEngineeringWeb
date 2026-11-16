"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { MessageLoading } from "./MessageLoading";

/** The loader never disappears faster than this, so it doesn't flash. */
const MIN_DISPLAY_MS = 800;
/** Safety net: reveal the site even if something never finishes loading. */
const MAX_WAIT_MS = 8000;

export default function PageLoader() {
  const [visible, setVisible] = useState(true);
  const reduceMotion = useReducedMotion();

  // Wait for: the full page load event (HTML, CSS, JS, images) AND web fonts.
  useEffect(() => {
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      // performance.now() counts from the start of navigation.
      const remaining = Math.max(0, MIN_DISPLAY_MS - performance.now());
      window.setTimeout(() => setVisible(false), remaining);
    };

    const pageLoaded = new Promise<void>((resolve) => {
      if (document.readyState === "complete") {
        resolve();
      } else {
        window.addEventListener("load", () => resolve(), { once: true });
      }
    });

    const fontsReady: Promise<unknown> = document.fonts?.ready ?? Promise.resolve();

    Promise.all([pageLoaded, fontsReady]).then(finish);
    const safety = window.setTimeout(finish, MAX_WAIT_MS);

    return () => window.clearTimeout(safety);
  }, []);

  // Lock scrolling while the loader is on screen.
  useEffect(() => {
    if (!visible) return;
    const html = document.documentElement;
    const previous = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = previous;
    };
  }, [visible]);

  return (
    <>
      {/* If JavaScript is disabled the loader could never close, so hide it. */}
      <noscript>
        <style>{"#page-loader{display:none!important}"}</style>
      </noscript>

      <AnimatePresence>
        {visible && (
          <motion.div
            key="page-loader"
            id="page-loader"
            role="status"
            aria-live="polite"
            aria-label="Loading"
            exit={{
              opacity: 0,
              transition: { duration: reduceMotion ? 0 : 0.5, ease: "easeOut" },
            }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-background"
          >
            <MessageLoading />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
