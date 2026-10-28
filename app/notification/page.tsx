"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import {
  Bell,
  BellOff,
  Check,
  CheckCheck,
  ChevronRight,
  ExternalLink,
  Info,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Trash2,
  Users,
  Zap,
} from "lucide-react";
import { FaWhatsapp, FaLinkedinIn } from "react-icons/fa";
import Spotlight from "../components/ui/Spotlight";

type NotificationCategory = "all" | "products" | "announcements" | "system";

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  category: "products" | "announcements" | "system";
  badge: string;
  badgeColor: string;
  time: string;
  read: boolean;
  action?: {
    label: string;
    href: string;
    external?: boolean;
  };
  icon: "sparkles" | "bell" | "shield" | "users" | "zap";
}

const initialNotifications: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Secretary AI v0.2 Early Access is Live",
    description:
      "Secretary early access invites are now rolling out for registered testers. Experience smart inbox triage, calendar coordination, and automated note-taking.",
    category: "products",
    badge: "Product Update",
    badgeColor: "border-purple-400/30 bg-purple-500/10 text-purple-300",
    time: "15m ago",
    read: false,
    action: {
      label: "Explore Secretary",
      href: "/secretary",
    },
    icon: "sparkles",
  },
  {
    id: "notif-2",
    title: "Community Milestone: 1,000+ Engineers",
    description:
      "Our Open Engineering developer ecosystem has officially grown to over 1,000 passionate builders across our channels. Thank you for shaping the mission with us!",
    category: "announcements",
    badge: "Community",
    badgeColor: "border-amber-400/30 bg-amber-500/10 text-amber-300",
    time: "2 hours ago",
    read: false,
    action: {
      label: "About Our Mission",
      href: "/about",
    },
    icon: "users",
  },
  {
    id: "notif-3",
    title: "Global Edge Infrastructure Deployed",
    description:
      "We've updated our edge nodes in South Asia and Southeast Asia, reducing asset delivery latency by over 35%. All platform services operating with 100% uptime.",
    category: "system",
    badge: "Infrastructure",
    badgeColor: "border-emerald-400/30 bg-emerald-500/10 text-emerald-300",
    time: "1 day ago",
    read: false,
    icon: "shield",
  },
  {
    id: "notif-4",
    title: "Interactive Open Engineering Roadmap Q2",
    description:
      "Take a look at what we're building next: modular developer utilities, new open-source libraries, and practical AI tools for everyday engineering challenges.",
    category: "products",
    badge: "Roadmap",
    badgeColor: "border-cyan-400/30 bg-cyan-500/10 text-cyan-300",
    time: "2 days ago",
    read: true,
    action: {
      label: "View Products",
      href: "/products",
    },
    icon: "zap",
  },
  {
    id: "notif-5",
    title: "Official WhatsApp Channel Announcement",
    description:
      "Stay in the loop with weekly engineering insights, early project previews, and direct community polls directly on our WhatsApp Channel.",
    category: "announcements",
    badge: "Announcement",
    badgeColor: "border-purple-400/30 bg-purple-500/10 text-purple-300",
    time: "4 days ago",
    read: true,
    action: {
      label: "Join WhatsApp Channel",
      href: "https://whatsapp.com/channel/0029Vb5J1mP3QxRwDLNrsh02",
      external: true,
    },
    icon: "bell",
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
  exit: { opacity: 0, scale: 0.96, transition: { duration: 0.25 } },
};

function renderIcon(icon: NotificationItem["icon"]) {
  switch (icon) {
    case "sparkles":
      return <Sparkles className="h-5 w-5 text-purple-400" />;
    case "users":
      return <Users className="h-5 w-5 text-amber-400" />;
    case "shield":
      return <ShieldCheck className="h-5 w-5 text-emerald-400" />;
    case "zap":
      return <Zap className="h-5 w-5 text-cyan-400" />;
    default:
      return <Bell className="h-5 w-5 text-purple-300" />;
  }
}

export default function NotificationPage() {
  const reduceMotion = useReducedMotion();
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(initialNotifications);
  const [filter, setFilter] = useState<NotificationCategory | "unread">("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((item) => {
    if (filter === "unread") return !item.read;
    if (filter === "all") return true;
    return item.category === filter;
  });

  const toggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const resetAllNotifications = () => {
    setNotifications(initialNotifications);
  };

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-background px-4 py-16 font-mono text-foreground sm:px-6 sm:py-24">
      {/* Orange spotlight effect matching About & Products pages */}
      {!reduceMotion && (
        <Spotlight
          config={{
            radius: 260,
            brightness: 0.2,
            color: "#ff8c00",
            smoothing: 0.12,
          }}
          className="z-0"
        />
      )}

      {/* Subtle purple grid background */}
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
        className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/20 blur-[100px]"
      />

      <div className="relative z-10 mx-auto w-full max-w-4xl">
        {/* Header Section */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-purple-400/30 bg-purple-500/10 px-4 py-1.5 text-xs font-semibold tracking-widest text-purple-300">
            <Bell size={13} className="text-purple-400" />
            NOTIFICATION CENTER
          </span>

          <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-5xl">
            Notifications & Updates
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-base text-gray-400 sm:text-lg">
            Stay up to date with the latest product releases, engineering
            announcements, and system status from Open Engineering.
          </p>
        </motion.div>

        {/* Stats & Actions Toolbar */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="mt-10 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between sm:p-5"
        >
          {/* Quick Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                filter === "all"
                  ? "bg-purple-500/20 text-purple-200 ring-1 ring-purple-400/40"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              All ({notifications.length})
            </button>

            <button
              type="button"
              onClick={() => setFilter("unread")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                filter === "unread"
                  ? "bg-purple-500/20 text-purple-200 ring-1 ring-purple-400/40"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span>Unread</span>
              {unreadCount > 0 && (
                <span className="rounded-full bg-red-500/90 px-1.5 py-0.2 text-[10px] text-white">
                  {unreadCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setFilter("products")}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                filter === "products"
                  ? "bg-purple-500/20 text-purple-200 ring-1 ring-purple-400/40"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              Products
            </button>

            <button
              type="button"
              onClick={() => setFilter("announcements")}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                filter === "announcements"
                  ? "bg-purple-500/20 text-purple-200 ring-1 ring-purple-400/40"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              Announcements
            </button>

            <button
              type="button"
              onClick={() => setFilter("system")}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                filter === "system"
                  ? "bg-purple-500/20 text-purple-200 ring-1 ring-purple-400/40"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              System
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 border-t border-white/5 pt-3 sm:border-t-0 sm:pt-0">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="inline-flex items-center gap-1.5 rounded-lg border border-purple-400/30 bg-purple-500/10 px-3 py-1.5 text-xs text-purple-300 transition hover:bg-purple-500/20 hover:text-white"
              >
                <CheckCheck size={14} />
                <span>Mark all as read</span>
              </button>
            )}

            {notifications.length < initialNotifications.length && (
              <button
                type="button"
                onClick={resetAllNotifications}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-gray-400 transition hover:border-white/20 hover:text-white"
                title="Restore default notifications"
              >
                <RefreshCw size={13} />
                <span>Reset</span>
              </button>
            )}
          </div>
        </motion.div>

        {/* Notifications List */}
        <motion.div
          variants={containerVariants}
          initial={reduceMotion ? "show" : "hidden"}
          animate="show"
          className="mt-6 space-y-3.5"
        >
          <AnimatePresence mode="popLayout">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((item) => (
                <motion.article
                  key={item.id}
                  variants={itemVariants}
                  layout
                  exit="exit"
                  className={`group relative overflow-hidden rounded-2xl border p-5 backdrop-blur-md transition-all duration-300 ${
                    !item.read
                      ? "border-purple-400/40 bg-purple-950/15 shadow-[0_0_20px_-5px_rgba(168,85,247,0.15)]"
                      : "border-white/10 bg-white/[0.025] hover:border-white/20 hover:bg-white/[0.04]"
                  }`}
                >
                  {/* Unread indicator top edge highlight */}
                  {!item.read && (
                    <div
                      aria-hidden="true"
                      className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-purple-400 to-transparent"
                    />
                  )}

                  <div className="flex items-start gap-4">
                    {/* Notification Icon */}
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
                        !item.read
                          ? "border-purple-400/30 bg-purple-500/15"
                          : "border-white/10 bg-white/5 text-gray-400"
                      }`}
                    >
                      {renderIcon(item.icon)}
                    </div>

                    {/* Content area */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-wide ${item.badgeColor}`}
                        >
                          {item.badge}
                        </span>

                        <span className="text-xs text-gray-500">
                          {item.time}
                        </span>

                        {!item.read && (
                          <span className="flex items-center gap-1 text-[11px] font-semibold text-purple-400">
                            <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500" />
                            New
                          </span>
                        )}
                      </div>

                      <h2
                        className={`mt-2 text-base font-semibold sm:text-lg ${
                          !item.read ? "text-white" : "text-gray-300"
                        }`}
                      >
                        {item.title}
                      </h2>

                      <p className="mt-1.5 text-sm leading-relaxed text-gray-400">
                        {item.description}
                      </p>

                      {/* Action buttons on notification */}
                      <div className="mt-4 flex flex-wrap items-center gap-3 pt-1">
                        {item.action && (
                          item.action.external ? (
                            <a
                              href={item.action.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-lg border border-purple-400/30 bg-purple-500/10 px-3.5 py-1.5 text-xs font-semibold text-purple-300 transition hover:bg-purple-500/20 hover:text-white"
                            >
                              <span>{item.action.label}</span>
                              <ExternalLink size={12} />
                            </a>
                          ) : (
                            <Link
                              href={item.action.href}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-purple-400/30 bg-purple-500/10 px-3.5 py-1.5 text-xs font-semibold text-purple-300 transition hover:bg-purple-500/20 hover:text-white"
                            >
                              <span>{item.action.label}</span>
                              <ChevronRight size={13} />
                            </Link>
                          )
                        )}

                        <button
                          type="button"
                          onClick={() => toggleRead(item.id)}
                          className="inline-flex items-center gap-1 text-xs text-gray-400 transition hover:text-white"
                        >
                          <Check size={13} />
                          <span>
                            {item.read ? "Mark unread" : "Mark as read"}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteNotification(item.id)}
                          aria-label={`Dismiss ${item.title}`}
                          className="ml-auto inline-flex items-center gap-1 text-xs text-gray-500 transition hover:text-red-400"
                        >
                          <Trash2 size={13} />
                          <span className="hidden sm:inline">Dismiss</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))
            ) : (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/[0.02] px-6 py-16 text-center backdrop-blur-md"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-purple-400/20 bg-purple-500/10 text-purple-300">
                  <BellOff size={28} />
                </div>

                <h3 className="mt-5 text-xl font-semibold text-white">
                  {filter === "unread"
                    ? "All caught up!"
                    : "No notifications found"}
                </h3>

                <p className="mt-2 max-w-sm text-sm text-gray-400">
                  {filter === "unread"
                    ? "You've read all your notifications. We'll alert you right here when new updates land."
                    : "There are no notifications matching your current filter."}
                </p>

                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setFilter("all")}
                    className="rounded-lg border border-purple-400/40 bg-purple-500/10 px-4 py-2 text-xs font-semibold text-purple-300 transition hover:bg-purple-500/20 hover:text-white"
                  >
                    View All Notifications
                  </button>

                  {notifications.length < initialNotifications.length && (
                    <button
                      type="button"
                      onClick={resetAllNotifications}
                      className="rounded-lg border border-white/15 px-4 py-2 text-xs text-gray-300 transition hover:bg-white/10 hover:text-white"
                    >
                      Reset Default Alerts
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Community & Direct Channels Footer Banner */}
        <motion.aside
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-12 rounded-2xl border border-white/10 bg-gradient-to-r from-purple-950/20 via-white/[0.03] to-purple-950/10 p-6 backdrop-blur-sm"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Info size={16} className="text-purple-400" />
                <h3 className="text-sm font-semibold text-white">
                  Want instant real-time updates?
                </h3>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-gray-400">
                Join our official WhatsApp channel and follow us on LinkedIn
                for priority feature drops and community polls.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <a
                href="https://whatsapp.com/channel/0029Vb5J1mP3QxRwDLNrsh02"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2 text-xs font-medium text-emerald-300 transition hover:bg-emerald-500/20 hover:text-white"
              >
                <FaWhatsapp size={14} />
                <span>WhatsApp</span>
              </a>

              <a
                href="https://www.linkedin.com/company/openengineeringworld"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-blue-500/30 bg-blue-500/10 px-3.5 py-2 text-xs font-medium text-blue-300 transition hover:bg-blue-500/20 hover:text-white"
              >
                <FaLinkedinIn size={14} />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </motion.aside>

        {/* Navigation back */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-10 text-center"
        >
          <Link
            href="/"
            className="text-xs text-gray-400 transition hover:text-purple-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          >
            ← Back to Home
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
