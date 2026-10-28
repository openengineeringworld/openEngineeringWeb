import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, FileText, Mail, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Secretary | Open Engineering",
  description:
    "Secretary is an AI assistant that handles your email, calendar, and notes so you can focus on the work that matters.",
};

const capabilities = [
  {
    icon: Mail,
    title: "Email",
    body: "Sorts your inbox, drafts replies in your voice, and flags what needs an answer today.",
  },
  {
    icon: Calendar,
    title: "Calendar",
    body: "Finds a time that works for everyone, books it, and moves it when plans change.",
  },
  {
    icon: FileText,
    title: "Notes and tasks",
    body: "Turns meetings and messages into action items and keeps track of what is still open.",
  },
  {
    icon: ShieldCheck,
    title: "Your data stays yours",
    body: "Secretary asks before it sends, books, or deletes anything. You can review and undo every action.",
  },
];

const steps = [
  {
    title: "Connect your tools",
    body: "Link your email, calendar, and notes. Secretary only reads what you allow.",
  },
  {
    title: "Tell it what you need",
    body: "Type or speak a request in plain language, the way you would to a person.",
  },
  {
    title: "Review and approve",
    body: "Secretary shows you what it plans to do. You confirm, edit, or cancel.",
  },
];

export default function Secretary() {
  return (
    <main className="bg-background text-foreground">
      {/* Intro */}
      <section className="relative isolate overflow-hidden px-6 py-24 sm:py-32">
        {/* Grid background, faded toward the edges (same treatment as the home hero) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 opacity-50"
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
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/20 blur-[100px]"
        />

        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <h1 className="font-mono text-4xl font-semibold tracking-tight text-white sm:text-6xl">
            Secretary
          </h1>
          <p className="mt-6 max-w-2xl font-mono text-lg tracking-wide text-gray-300 sm:text-xl">
            An AI assistant that handles the small tasks that fill your day, so
            you can get back to the work that matters.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="rounded-lg bg-white px-6 py-3 font-medium text-black transition hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              Get early access
            </Link>
            <Link
              href="/about"
              className="rounded-lg border border-white/20 px-6 py-3 font-medium text-white transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              About us
            </Link>
          </div>
        </div>
      </section>

      {/* Product preview */}
      <section className="px-6 pb-24">
        <div className="relative mx-auto max-w-3xl">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-10 -top-6 bottom-0 -z-10 rounded-full bg-purple-500/15 blur-[90px]"
          />
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/60 backdrop-blur-md">
            <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3">
              <span className="h-2 w-2 rounded-full bg-purple-500" />
              <span className="font-mono text-sm text-gray-400">Secretary</span>
            </div>

            <div className="space-y-5 px-5 py-6 font-mono text-sm leading-relaxed sm:px-8 sm:text-base">
              <div className="ml-auto max-w-[85%] rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-gray-200">
                Set up a 30 minute call with Priya next week and send her the
                project notes.
              </div>

              <div className="max-w-[90%] space-y-3 text-gray-300">
                <p>
                  Priya is free Tuesday at 11:00 and Thursday at 15:30. Both
                  fit your calendar.
                </p>
                <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 px-4 py-3">
                  <p className="text-white">Ready to send</p>
                  <ul className="mt-2 space-y-1 text-gray-300">
                    <li>Invite for Tuesday at 11:00</li>
                    <li>Email to Priya with project-notes.pdf attached</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="rounded-lg bg-white px-4 py-2 font-sans text-sm font-medium text-black">
                  Approve
                </span>
                <span className="rounded-lg border border-white/20 px-4 py-2 font-sans text-sm font-medium text-white">
                  Edit
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-mono text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            What Secretary does
          </h2>
          <p className="mt-3 max-w-xl text-gray-400">
            It works inside the tools you already use. Nothing new to learn.
          </p>

          <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2">
            {capabilities.map(({ icon: Icon, title, body }) => (
              <div key={title} className="bg-background p-7">
                <Icon aria-hidden="true" size={22} className="text-purple-400" />
                <h3 className="mt-4 font-mono text-lg text-white">{title}</h3>
                <p className="mt-2 text-gray-400">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-mono text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            How it works
          </h2>

          <ol className="mt-10 divide-y divide-white/10 border-y border-white/10">
            {steps.map((step, index) => (
              <li
                key={step.title}
                className="grid gap-2 py-6 sm:grid-cols-[4rem_1fr_2fr] sm:items-baseline sm:gap-6"
              >
                <span className="font-mono text-gray-500">{index + 1}</span>
                <h3 className="font-mono text-lg text-white">{step.title}</h3>
                <p className="text-gray-400">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Closing call to action */}
      <section className="relative isolate overflow-hidden px-6 py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/15 blur-[100px]"
        />
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-mono text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Give your to-do list to Secretary
          </h2>
          <p className="mt-4 text-gray-300">
            We are letting people in a few at a time. Tell us how you would use
            it and we will get in touch.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-block rounded-lg bg-white px-6 py-3 font-medium text-black transition hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            Get early access
          </Link>
        </div>
      </section>
    </main>
  );
}
