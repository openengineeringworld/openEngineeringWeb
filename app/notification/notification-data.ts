import type { NotificationItem } from "./notification-types";

export const initialNotifications: NotificationItem[] = [
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

/* but for now the notification data is like this in this file */
