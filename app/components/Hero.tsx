"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import Typewriter from "./ui/Typewriter";
import Spotlight from "./ui/Spotlight";
import HeroWordmark from "./ui/HeroWordmark";

export default function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative isolate flex min-h-[85vh] items-center justify-center overflow-hidden bg-background px-6 py-20 text-foreground">
      {/* Animated grid background (sits BELOW the spotlight so the glow lights
          the lines instead of being tinted/darkened by them) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.55 }}
        transition={{ duration: 1.5 }}
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(168,85,247,0.4) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(168,85,247,0.4) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
          maskImage:
            "radial-gradient(ellipse at center, black 20%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 20%, transparent 75%)",
        }}
      />

      {/* Moving glow */}
      <motion.div
        animate={{
          x: [-30, 30, -30],
          y: [-20, 20, -20],
          opacity: [0.15, 0.3, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/20 blur-[100px]"
      />

      {/* Cursor glow: smaller and subtle, layered above the grid */}
      <Spotlight
        config={{
          radius: 200,
          brightness: 0.3,
          color: "#ff8c00",
          smoothing: 0.12,
        }}
        className="z-[1]"
      />

      {/* Hero content */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center text-center"
      >
        <h1 className="w-full">
          <HeroWordmark className="mx-auto max-w-4xl" />
          <Typewriter
            text="Making Technology accessible for all"
            delay={2200}
            className="mt-8 block text-gray-400 text-xl tracking-widest font-mono w-full"
          />
        </h1>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mt-20 flex flex-wrap justify-center gap-4"
        >
          <Link
            href="/about"
            className="rounded-lg bg-white px-6 py-3 font-mono font-medium text-black transition hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            About Us
          </Link>

          <Link
            href="/contact"
            className="rounded-lg border border-white/20 px-6 py-3 font-mono font-medium text-white transition hover:border-purple-400/50 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
          >
            Contact Us
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
