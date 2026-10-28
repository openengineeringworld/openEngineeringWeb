"use client";

import { MouseEvent } from "react";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Calendar, Check, FileText, Mail, type LucideIcon } from "lucide-react";
import Spotlight from "../components/ui/Spotlight";
import Typewriter from "../components/ui/Typewriter";

type Product = {
  name: string;
  status: string;
  tagline: string;
  description: string;
  features: { icon: LucideIcon; label: string }[];
  href: string;
  preview: { request: string; reply: string; actions: string[] };
};

// Add new products here and they appear on the page automatically.
// The text below is placeholder copy, so edit it to match the real app.
const products: Product[] = [
  {
    name: "Secretary",
    status: "Early access",
    tagline: "An AI assistant for the small tasks that fill your day",
    description:
      "Secretary handles your email, calendar, and notes. Tell it what you need in plain language, review what it plans to do, and approve it.",
    features: [
      { icon: Mail, label: "Sorts your inbox and drafts replies" },
      { icon: Calendar, label: "Finds times and books meetings" },
      { icon: FileText, label: "Turns messages into tasks and notes" },
    ],
    href: "/secretary",
    preview: {
      request: "Set up a 30 minute call with Priya next week.",
      reply: "Priya is free Tuesday at 11:00. Ready to send the invite?",
      actions: ["Approve", "Edit"],
    },
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

export default function Products() {
  const reduceMotion = useReducedMotion();

  // Moves the soft purple light inside a card to follow the cursor.
  function trackCursor(event: MouseEvent<HTMLElement>) {
    if (reduceMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--my", `${event.clientY - rect.top}px`);
  }

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-background px-6 py-24 font-mono text-foreground">
      {/* Cursor glow, same settings as the other pages */}
      {!reduceMotion && (
        <Spotlight
          config={{
            radius: 250,
            brightness: 0.2,
            color: "#ff8c00",
            smoothing: 0.12,
          }}
          className="z-0"
        />
      )}

      {/* Purple grid background */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 1.5 }}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
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

      {/* Ambient purple glow */}
      <motion.div
        aria-hidden="true"
        animate={
          reduceMotion
            ? undefined
            : {
                x: [-30, 30, -30],
                y: [-20, 20, -20],
                opacity: [0.15, 0.3, 0.2],
              }
        }
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/20 blur-[100px]"
      />

      <motion.div
        variants={container}
        initial={reduceMotion ? "show" : "hidden"}
        animate="show"
        className="relative z-10 mx-auto w-full max-w-5xl"
      >
        {/* Heading */}
        <motion.div variants={item} className="text-center">
          <span className="inline-block rounded-full border border-purple-400/30 bg-purple-500/10 px-4 py-2 text-sm font-medium tracking-widest text-purple-300">
            PRODUCTS
          </span>

          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Tools we’re building
          </h1>

          <Typewriter
            text="Making Technology accessible for all"
            delay={1200}
            className="mt-6 block w-full text-lg tracking-widest text-gray-300 md:text-xl"
          />
        </motion.div>

        {/* Product list */}
        <ul className="mt-16 space-y-8">
          {products.map((product) => (
            <motion.li key={product.name} variants={item}>
              <article
                aria-labelledby={`${product.name}-title`}
                onMouseMove={trackCursor}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.015] shadow-2xl shadow-black/30 backdrop-blur-md transition-colors duration-300 hover:border-purple-400/40"
              >
                {/* Top highlight line */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-purple-300/50 to-transparent"
                />

                {/* Light that follows the cursor */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:hidden"
                  style={{
                    background:
                      "radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), rgba(168,85,247,0.14), transparent 45%)",
                  }}
                />

                <div className="relative grid gap-10 p-7 sm:p-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
                  {/* Details */}
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2
                        id={`${product.name}-title`}
                        className="text-3xl font-semibold tracking-tight text-white sm:text-4xl"
                      >
                        {product.name}
                      </h2>

                      <span className="inline-flex items-center gap-2 rounded-full border border-purple-400/30 bg-purple-500/10 px-3 py-1 text-xs text-purple-300">
                        <span className="relative flex h-2 w-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-60 motion-reduce:animate-none" />
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-purple-400" />
                        </span>
                        {product.status}
                      </span>
                    </div>

                    <p className="mt-4 text-lg text-gray-200">
                      {product.tagline}
                    </p>

                    <p className="mt-3 leading-7 text-gray-400">
                      {product.description}
                    </p>

                    <ul className="mt-6 space-y-3">
                      {product.features.map(({ icon: Icon, label }) => (
                        <li
                          key={label}
                          className="flex items-center gap-3 text-gray-300"
                        >
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-purple-400/20 bg-purple-500/10 text-purple-300">
                            <Icon aria-hidden="true" size={18} />
                          </span>
                          {label}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-8 flex flex-wrap gap-4">
                      <Link
                        href={product.href}
                        className="rounded-lg bg-white px-6 py-3 font-medium text-black transition hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                      >
                        Learn more ↗
                      </Link>
                      <Link
                        href="/contact"
                        className="rounded-lg border border-white/20 px-6 py-3 font-medium text-white transition hover:border-purple-400/50 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
                      >
                        Get early access
                      </Link>
                    </div>
                  </div>

                  {/* Product preview */}
                  <div
                    aria-hidden="true"
                    className="overflow-hidden rounded-2xl border border-white/10 bg-black/60"
                  >
                    <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
                      <span className="h-2 w-2 rounded-full bg-purple-500" />
                      <span className="text-sm text-gray-400">
                        {product.name}
                      </span>
                    </div>

                    <div className="space-y-4 p-4 text-sm leading-relaxed">
                      <div className="ml-auto max-w-[85%] rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-gray-200">
                        {product.preview.request}
                      </div>

                      <div className="max-w-[90%] rounded-xl border border-purple-500/30 bg-purple-500/10 px-4 py-3 text-gray-200">
                        {product.preview.reply}
                      </div>

                      <div className="flex gap-3">
                        {product.preview.actions.map((action, index) => (
                          <span
                            key={action}
                            className={
                              index === 0
                                ? "inline-flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-sm font-medium text-black"
                                : "rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-white"
                            }
                          >
                            {index === 0 && <Check size={14} />}
                            {action}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </motion.li>
          ))}

          {/* More products on the way */}
          <motion.li variants={item}>
            <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-white/15 px-6 py-10 text-center sm:flex-row sm:justify-between sm:text-left">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  More products are on the way
                </h2>
                <p className="mt-2 text-gray-400">
                  Have a tool you wish existed? Tell us what you need.
                </p>
              </div>

              <Link
                href="/contact"
                className="shrink-0 rounded-lg border border-white/20 px-6 py-3 font-medium text-white transition hover:border-purple-400/50 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
              >
                Suggest a product
              </Link>
            </div>
          </motion.li>
        </ul>

        {/* Back to home */}
        <motion.div variants={item} className="mt-12 text-center">
          <Link
            href="/"
            className="text-sm text-gray-400 transition hover:text-purple-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          >
            ← Back to Home
          </Link>
        </motion.div>
      </motion.div>
    </main>
  );
}
