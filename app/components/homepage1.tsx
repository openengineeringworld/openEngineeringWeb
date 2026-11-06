"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  MotionConfig,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import Spotlight from "./ui/Spotlight";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ------------------------------------------------------------------ */
/* CONTENT: edit these arrays to add, remove or reorder things.        */
/* ------------------------------------------------------------------ */

type ContentBlock = {
  id: string; // used for the #anchor link
  label: string; // vertical text in the left rail
  ghost: string; // big faint text drifting behind the block
  text: string; // main statement, revealed word by word on scroll
  badge?: string; // optional small pill above the text
  size?: "md" | "lg"; // text size (default "md")
  showLine?: boolean; // optional line that draws in under the text
};

const BLOCKS: ContentBlock[] = [
  {
    id: "about",
    label: "About",
    ghost: "OE",
    badge: "Open Engineering",
    text: "We are a company driven by innovation, building products that solve real-world problems.",
  },
  {
    id: "vision",
    label: "Vision",
    ghost: ">",
    size: "lg",
    showLine: true,
    text: "Our vision is to make technology accessible to all.",
  },
  // Add more blocks here, e.g.
  // { id: "mission", label: "Mission", ghost: "//", text: "..." },
];

/** Words repeated in the faint scrolling marquee. */
const TICKER_ITEMS: string[] = ["Open Engineering"];

/** Buttons in the bottom section. */
const CONTACT_LINKS: {
  href: string;
  label: string;
  variant: "primary" | "secondary";
}[] = [
  { href: "/about", label: "About Us", variant: "primary" },
  { href: "/contact", label: "Contact Us", variant: "secondary" },
];

const BUTTON_STYLES = {
  primary:
    "rounded-lg bg-white px-6 py-3 font-mono font-medium text-black transition hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
  secondary:
    "rounded-lg border border-white/20 px-6 py-3 font-mono font-medium text-white transition hover:border-purple-400/50 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400",
} as const;

/* ------------------------------------------------------------------ */
/* Shared pieces                                                       */
/* ------------------------------------------------------------------ */

function GridBackground({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-0 opacity-55 ${className}`}
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
  );
}

/** One word that lights up as scroll progress passes its slice of the range. */
function ScrollWord({
  word,
  progress,
  range,
}: {
  word: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  const y = useTransform(progress, range, [8, 0]);
  return (
    <motion.span
      aria-hidden="true"
      style={{ opacity, y }}
      className="mr-[0.3em] inline-block"
    >
      {word}
    </motion.span>
  );
}

/** Scroll-linked word-by-word reveal (the same idea as the testimonial quote). */
function ScrollText({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.45"],
  });
  const words = text.split(" ");

  return (
    <p ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      {words.map((word, i) => (
        <ScrollWord
          key={i}
          word={word}
          progress={scrollYProgress}
          range={[i / words.length, (i + 1) / words.length]}
        />
      ))}
    </p>
  );
}

/**
 * Editorial section: ghost text that drifts with scroll, a left rail with a
 * vertical label and a progress line, and content on the right.
 */
function Section({
  id,
  label,
  ghost,
  children,
}: {
  id: string;
  label: string;
  ghost: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const ghostX = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const railScale = useTransform(scrollYProgress, [0.15, 0.85], [0, 1]);

  return (
    <section
      id={id}
      ref={ref}
      aria-label={label}
      className="relative isolate flex min-h-screen items-center overflow-hidden bg-background px-6 py-24 text-foreground"
    >
      {/* Ghost text: wrapper handles centering, motion.div handles parallax,
          so Tailwind and Framer transforms never fight. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 flex items-center"
      >
        <motion.div
          style={reduceMotion ? undefined : { x: ghostX }}
          className="select-none whitespace-nowrap text-[14rem] font-bold leading-none tracking-tighter text-foreground/[0.03] md:text-[28rem]"
        >
          {ghost}
        </motion.div>
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-5xl">
        {/* Left rail (hidden on small screens) */}
        <div className="hidden flex-col items-center justify-center border-r border-border pr-16 md:flex">
          <span
            className="font-mono text-xs uppercase tracking-widest text-muted-foreground"
            style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
          >
            {label}
          </span>
          <div className="relative mt-8 h-32 w-px bg-border">
            <motion.div
              style={reduceMotion ? { scaleY: 1 } : { scaleY: railScale }}
              className="absolute left-0 top-0 h-full w-full origin-top bg-foreground"
            />
          </div>
        </div>

        <div className="flex-1 md:pl-16">{children}</div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Sections                                                            */
/* ------------------------------------------------------------------ */

function ContentSection({ block }: { block: ContentBlock }) {
  const { id, label, ghost, text, badge, size = "md", showLine } = block;
  const textSize =
    size === "lg" ? "text-4xl md:text-6xl" : "text-4xl md:text-5xl";

  return (
    <Section id={id} label={label} ghost={ghost}>
      {badge && (
        <div className="mb-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 font-mono text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            {badge}
          </span>
        </div>
      )}
      <ScrollText
        text={text}
        className={`${textSize} font-light leading-[1.15] tracking-tight text-foreground`}
      />
      {showLine && (
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 0.8, ease: EASE }}
          style={{ originX: 0 }}
          className="mt-12 h-px w-24 bg-foreground"
        />
      )}
    </Section>
  );
}

function Ticker() {
  const reduceMotion = useReducedMotion();
  const group = (
    <div className="flex shrink-0">
      {[...Array(6)].flatMap(() => TICKER_ITEMS).map((item, i) => (
        <span key={i} className="mx-8">
          {item} •
        </span>
      ))}
    </div>
  );

  return (
    <div
      aria-hidden="true"
      className="relative overflow-hidden border-y border-border bg-background py-8 text-foreground/[0.08]"
    >
      <motion.div
        className="flex w-max whitespace-nowrap text-6xl font-bold tracking-tight"
        animate={reduceMotion ? undefined : { x: ["0%", "-50%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        {group}
        {group}
      </motion.div>
    </div>
  );
}

function ContactSection() {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [0, 1]);

  return (
    <section
      id="contact"
      ref={ref}
      className="relative isolate flex min-h-[60vh] items-center justify-center overflow-hidden bg-background px-6 py-24 text-foreground"
    >
      <GridBackground />
      <Spotlight
        config={{
          radius: 200,
          brightness: 0.3,
          color: "#ff8c00",
          smoothing: 0.12,
        }}
        className="z-[1]"
      />

      <motion.div
        style={reduceMotion ? undefined : { scale, opacity }}
        className="relative z-10 mx-auto flex w-full max-w-3xl flex-wrap justify-center gap-4 text-center"
      >
        {CONTACT_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={BUTTON_STYLES[link.variant]}
          >
            {link.label}
          </Link>
        ))}
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function Homepage1() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <MotionConfig reducedMotion="user">
      <main className="bg-background text-foreground">
        {/* Page scroll progress */}
        <motion.div
          aria-hidden="true"
          style={{ scaleX: progress }}
          className="fixed left-0 right-0 top-0 z-50 h-0.5 origin-left bg-purple-400"
        />

        {BLOCKS.map((block) => (
          <ContentSection key={block.id} block={block} />
        ))}
        
        
      </main>
    </MotionConfig>
  );
}
