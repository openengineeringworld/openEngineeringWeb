"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import {
  FaWhatsapp,
  FaInstagram,
  FaLinkedinIn,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";
import Spotlight from "../components/ui/Spotlight";
import Typewriter from "../components/ui/Typewriter";

const contacts = [
  {
    value: "openengineering9@gmail.com",
    href: "mailto:openengineering9@gmail.com",
    Icon: FaEnvelope,
  },
  {
    value: "+91 94016 69266",
    href: "tel:+919401669266",
    Icon: FaPhoneAlt,
  },
  {
    value: "Instagram",
    href: "https://www.instagram.com/openengineeringworld",
    Icon: FaInstagram,
  },
  {
    value: "LinkedIn",
    href: "https://www.linkedin.com/company/openengineeringworld",
    Icon: FaLinkedinIn,
  },
  {
    value: "WhatsApp channel",
    href: "https://whatsapp.com/channel/0029Vb5J1mP3QxRwDLNrsh02",
    Icon: FaWhatsapp,
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

// One orchestrated entrance: the page sections and the contact rows
// stagger in using these two variants.
const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

const inputClass =
  "w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20";

const labelClass = "mb-2 block font-mono text-sm text-gray-300";

const cardClass =
  "relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.015] p-7 shadow-2xl shadow-black/30 backdrop-blur-md sm:p-10";

type Status = "idle" | "sending" | "sent" | "error";

export default function Contact() {
  const reduceMotion = useReducedMotion();
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("sending");

    try {
      // Create app/api/contact/route.ts to receive this request
      // (send the email or save the message there).
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });

      if (!response.ok) throw new Error("Request failed");

      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-background px-6 py-24 text-foreground">
      {/* Purple grid, faded toward the edges (same as the home hero) */}
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

      {/* Drifting glow (disabled for reduced motion) */}
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
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/20 blur-[100px]"
      />

      {/* Cursor glow, same settings as the hero */}
      {!reduceMotion && (
        <Spotlight
          config={{
            radius: 200,
            brightness: 0.3,
            color: "#ff8c00",
            smoothing: 0.12,
          }}
          className="z-[1]"
        />
      )}

      <motion.div
        variants={container}
        initial={reduceMotion ? "show" : "hidden"}
        animate="show"
        className="relative z-10 mx-auto w-full max-w-5xl"
      >
        {/* Heading */}
        <motion.div variants={item} className="text-center">
          <h1 className="font-mono text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl">
            Let’s build something great
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-400 font-mono">
            Have an idea, a question, or a project in mind? We’d love to hear
            from you.
          </p>
        </motion.div>

        <div className="mt-14 grid items-stretch gap-8 md:grid-cols-2">
          {/* Contact information */}
          <motion.section
            variants={item}
            aria-labelledby="connect-heading"
            className={`${cardClass} flex flex-col`}
          >
            <TopHighlight />

            <h2
              id="connect-heading"
              className="font-mono text-2xl font-semibold tracking-tight text-white"
            >
              Connect with us
            </h2>

            <p className="mt-3 max-w-sm leading-7 text-gray-400 font-mono">
              Whether you want to collaborate, share feedback, or learn more
              about Open Engineering, reach out.
            </p>

            <motion.ul
              variants={container}
              className="mt-9 divide-y divide-white/10 border-y border-white/10"
            >
              {contacts.map(({ value, href, Icon }) => {
                const external = href.startsWith("http");

                return (
                  <motion.li key={href} variants={item}>
                    <a
                      href={href}
                      {...(external && {
                        target: "_blank",
                        rel: "noopener noreferrer",
                      })}
                      aria-label={`${value}${
                        external ? " (opens in a new tab)" : ""
                      }`}
                      className="group relative flex items-center gap-4 py-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                    >
                      {/* Purple line that draws in on hover */}
                      <span
                        aria-hidden="true"
                        className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-purple-400 transition-transform duration-500 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none"
                      />

                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-purple-400/20 bg-purple-500/10 text-lg text-purple-300 transition duration-300 group-hover:border-purple-400/50 group-hover:bg-purple-500/20 motion-reduce:transition-none">
                        <Icon aria-hidden="true" />
                      </span>

                      <span className="min-w-0 flex-1 break-all font-mono text-base text-gray-200 transition-colors group-hover:text-white">
                        {value}
                      </span>

                      <svg
                        viewBox="0 0 20 20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                        className="h-5 w-5 shrink-0 text-gray-600 transition duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 motion-reduce:group-hover:translate-y-0"
                      >
                        <path d="M6 14 14 6M7.5 6H14v6.5" />
                      </svg>
                    </a>
                  </motion.li>
                );
              })}
            </motion.ul>

            <p className="mt-auto pt-8 text-sm text-gray-500">
              Open Engineering. Making technology accessible for all.
            </p>
          </motion.section>

          {/* Contact form */}
          <motion.section
            variants={item}
            aria-labelledby="message-heading"
            className={cardClass}
          >
            <TopHighlight />

            <h2
              id="message-heading"
              className="font-mono text-2xl font-semibold tracking-tight text-white"
            >
              Send a message
            </h2>

            <AnimatePresence mode="wait" initial={false}>
              {status === "sent" ? (
                <motion.div
                  key="sent"
                  role="status"
                  initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease }}
                  className="flex min-h-[22rem] flex-col items-center justify-center text-center"
                >
                  <svg
                    viewBox="0 0 52 52"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className="h-16 w-16 text-purple-300"
                  >
                    <motion.circle
                      cx="26"
                      cy="26"
                      r="23"
                      initial={reduceMotion ? false : { pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                    <motion.path
                      d="M15 27l8 8 14-16"
                      initial={reduceMotion ? false : { pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.4, delay: 0.5, ease: "easeOut" }}
                    />
                  </svg>

                  <p className="mt-6 font-mono text-xl text-white">
                    Message sent
                  </p>
                  <p className="mt-2 max-w-xs text-gray-400">
                    Thanks for reaching out. We’ll reply by email.
                  </p>
                  <button
                    type="button"
                    onClick={() => setStatus("idle")}
                    className="mt-6 rounded-lg border border-white/20 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  initial={reduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="mt-3 leading-7 text-gray-400 font-mono">
                    Fill in the details below and tell us how we can help.
                  </p>

                  <div className="mt-9 space-y-5">
                    <div>
                      <label htmlFor="name" className={labelClass}>
                        Your name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        placeholder="Enter your name"
                        required
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className={labelClass}>
                        Email address
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        required
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label htmlFor="subject" className={labelClass}>
                        Subject
                      </label>
                      <input
                        id="subject"
                        name="subject"
                        type="text"
                        placeholder="What is this about?"
                        required
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className={labelClass}>
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        placeholder="Tell us about your idea..."
                        required
                        className={`${inputClass} resize-y`}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 font-medium text-black transition hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {status === "sending" && (
                        <span
                          aria-hidden="true"
                          className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black motion-reduce:animate-none"
                        />
                      )}
                      {status === "sending" ? "Sending" : "Send message"}
                    </button>

                    <AnimatePresence>
                      {status === "error" && (
                        <motion.p
                          role="alert"
                          initial={reduceMotion ? false : { opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="text-sm text-red-400"
                        >
                          The message didn’t send. Check your connection and try
                          again, or email us directly.
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.section>
        </div>

        {/* Back to home */}
        <motion.div variants={item} className="mt-12 text-center">
          <Link
            href="/"
            className="font-mono text-sm text-gray-400 transition hover:text-purple-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          >
            ← Back to Home
          </Link>
        </motion.div>
      </motion.div>
    </main>
  );
}

function TopHighlight() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-purple-300/50 to-transparent"
    />
  );
}
