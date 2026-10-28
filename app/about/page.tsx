"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Spotlight from "../components/ui/Spotlight";

type Member = {
  name: string;
  role: string;
  /** Optional photo, e.g. "/team/aarav.jpg". Initials are shown when omitted. */
  image?: string;
  /** Optional LinkedIn profile URL. */
  linkedin?: string;
};

// Replace these placeholders with the real Open Engineering team.
const team: Member[] = [
  { name: "Rubul Hoque Choudhory", role: "Founder" },
  { name: "Prachurjya Kakati", role: "Engineering" },
];

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

export default function About() {
  const reduceMotion = useReducedMotion();

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-background px-6 py-24 font-mono text-foreground">
      {/* Orange spotlight */}
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
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/20 blur-[100px]"
      />

      {/* About content */}
      <motion.section
        initial={reduceMotion ? false : { opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center text-center"
      >
        {/* Section label */}
        <motion.span
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-6 rounded-full border border-purple-400/30 bg-purple-500/10 px-4 py-2 font-mono text-sm font-medium tracking-widest text-purple-300"
        >
          ABOUT US
        </motion.span>

        {/* Main heading */}
        <h1 className="font-mono text-4xl font-bold tracking-tight sm:text-5xl md:text-7xl">
          Engineering a{" "}
          <span className="bg-gradient-to-r from-purple-400 via-purple-300 to-purple-200 bg-clip-text text-transparent">
            Better Future
          </span>
        </h1>

        {/* Introduction */}
        <motion.p
          initial={reduceMotion ? false : { opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="mt-8 max-w-3xl text-lg leading-8 text-gray-400 md:text-xl"
        >
          Open Engineering is built around a simple idea: making technology
          accessible to everyone. We believe engineering should empower people,
          encourage creativity, and create opportunities to solve real-world
          problems.
        </motion.p>

        {/* Mission and vision */}
        <div className="mt-16 grid w-full gap-6 text-left md:grid-cols-2">
          <motion.article
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-sm transition duration-300 hover:border-purple-400/40 hover:bg-white/[0.05]"
          >
            <div
              aria-hidden="true"
              className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-purple-400/20 bg-purple-500/10 text-2xl text-purple-300"
            >
              ✦
            </div>

            <h2 className="font-mono text-2xl font-semibold tracking-tight">
              Our Mission
            </h2>

            <p className="mt-4 leading-7 text-gray-400">
              To make engineering knowledge, tools, and innovative ideas more
              accessible, helping people learn, build, and turn their ideas
              into meaningful solutions.
            </p>
          </motion.article>

          <motion.article
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.6 }}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-sm transition duration-300 hover:border-purple-400/40 hover:bg-white/[0.05]"
          >
            <div
              aria-hidden="true"
              className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-purple-400/20 bg-purple-500/10 text-2xl text-purple-300"
            >
              ◈
            </div>

            <h2 className="font-mono text-2xl font-semibold tracking-tight">
              Our Vision
            </h2>

            <p className="mt-4 leading-7 text-gray-400">
              A future where curiosity has no barriers, collaboration drives
              progress, and everyone has the opportunity to participate in
              shaping technology.
            </p>
          </motion.article>
        </div>

        {/* Team */}
        <section aria-labelledby="team-heading" className="mt-24 w-full">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
          >
            <h2
              id="team-heading"
              className="font-mono text-3xl font-semibold tracking-tight sm:text-4xl"
            >
              Meet the Team
            </h2>
            <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-400">
              The people behind Open Engineering, working to make technology
              accessible for all.
            </p>
          </motion.div>

          <ul className="mt-12 flex flex-wrap justify-center gap-6">
            {team.map((member, index) => (
              <motion.li
                key={member.name}
                initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="group w-full max-w-xs rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm transition duration-300 hover:border-purple-400/40 hover:bg-white/[0.05] sm:w-64"
              >
                <div className="mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-purple-400/20 bg-purple-500/10 font-mono text-2xl text-purple-300 transition duration-300 group-hover:border-purple-400/50">
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt={`Photo of ${member.name}`}
                      width={96}
                      height={96}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span aria-hidden="true">{initials(member.name)}</span>
                  )}
                </div>

                <h3 className="mt-5 font-mono text-lg font-semibold text-white">
                  {member.name}
                </h3>
                <p className="mt-1 text-sm text-gray-400">{member.role}</p>

                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${member.name} on LinkedIn (opens in a new tab)`}
                    className="mt-4 inline-block font-mono text-sm text-purple-300 transition hover:text-purple-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                  >
                    LinkedIn ↗
                  </a>
                )}
              </motion.li>
            ))}
          </ul>
        </section>

        {/* Call to action */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mt-20 flex flex-wrap justify-center gap-4"
        >
          <Link
            href="/contact"
            className="rounded-lg bg-white px-6 py-3 font-mono font-medium text-black transition hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            Get in Touch ↗
          </Link>

          <Link
            href="/"
            className="rounded-lg border border-white/20 px-6 py-3 font-mono font-medium text-white transition hover:border-purple-400/50 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
          >
            Back to Home
          </Link>
        </motion.div>
      </motion.section>
    </main>
  );
}
