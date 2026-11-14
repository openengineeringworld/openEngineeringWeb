"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import {
  BellRing,
  X,
  Package,
  Megaphone,
  Zap,
} from "lucide-react";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);

  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);

  return Uint8Array.from(
    Array.from(rawData).map((char) => char.charCodeAt(0))
  );
}

async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    throw new Error("Service workers are not supported.");
  }

  return navigator.serviceWorker.register("/sw.js");
}

export default function NotificationPermission() {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
  const visits = Number(localStorage.getItem("oe_visits") || "0");
  const choice = localStorage.getItem("oe_notification_choice");

  const updatedVisits = visits + 1;
  localStorage.setItem("oe_visits", String(updatedVisits));

  registerServiceWorker()
    .then((registration) => {
      console.log("Service Worker registered:", registration);
    })
    .catch((error) => {
      console.error("Service Worker registration failed:", error);
    });

  if (
    updatedVisits >= 3 &&
    !choice &&
    "Notification" in window 
  ) {
    setShowPrompt(true);
  }
}, []);

async function enableNotifications() {
  try {
    if (!("Notification" in window)) {
      throw new Error("Notifications are not supported.");
    }

    const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

    if (!publicKey) {
      throw new Error("VAPID public key is missing.");
    }

    // Request browser permission
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      localStorage.setItem("oe_notification_choice", permission);
      setShowPrompt(false);
      return;
    }

    // Get registered service worker
    const registration = await navigator.serviceWorker.ready;

    // Check for an existing subscription
    let subscription = await registration.pushManager.getSubscription();

    // Create subscription if one doesn't exist
    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });
    }

    // Save subscription through our API
    const response = await fetch("/api/push/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(subscription),
    });

    if (!response.ok) {
      throw new Error("Failed to save push subscription.");
    }

    localStorage.setItem("oe_notification_choice", "granted");
    setShowPrompt(false);

    console.log("Push subscription successful:", subscription);

  } catch (error) {
    console.error("Notification setup failed:", error);
    alert("Could not enable notifications. Please try again.");
  }
}

function dismissPrompt() {
  localStorage.setItem("oe_notification_choice", "later");
  setShowPrompt(false);
}

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 35, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 25, scale: 0.96 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-purple-500/40 bg-[#191719] p-6 text-white shadow-[0_0_60px_rgba(147,51,234,0.12)] sm:p-7"
          >
            {/* Ambient glow */}
            <div className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-purple-600/10 blur-[80px]" />

            <div className="relative">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-purple-500/40 bg-purple-500/10 text-purple-400">
                    <BellRing size={21} />
                  </div>

                  <span className="text-xs font-semibold tracking-[0.18em] text-purple-300">
                    OPEN ENGINEERING
                  </span>
                </div>

                <button
                  onClick={dismissPrompt}
                  aria-label="Close notification prompt"
                  className="text-zinc-500 transition hover:text-white"
                >
                  <X size={19} />
                </button>
              </div>

              {/* Content */}
              <h2 className="mt-7 text-3xl font-semibold tracking-tight">
                Stay in the loop.
              </h2>

              <p className="mt-3 text-sm leading-6 text-zinc-400">
                Don't miss what's happening at Open Engineering.
                Get updates about new products, announcements
                and important releases.
              </p>

              {/* Features */}
              <div className="mt-6 space-y-4 rounded-xl border border-purple-500/20 bg-[#211c22] p-4">
                <Feature
                  icon={<Package size={17} />}
                  text="New product launches"
                />
                <Feature
                  icon={<Megaphone size={17} />}
                  text="Company announcements"
                />
                <Feature
                  icon={<Zap size={17} />}
                  text="Important updates"
                />
              </div>

              {/* Actions */}
              <button
                onClick={enableNotifications}
                className="mt-6 w-full rounded-xl border border-purple-400/40 bg-purple-600/20 px-5 py-3.5 text-sm font-semibold text-purple-200 transition hover:bg-purple-600/35 hover:border-purple-400/70"
              >
                Enable notifications
              </button>

              <button
                onClick={dismissPrompt}
                className="mt-3 w-full py-2 text-sm text-zinc-500 transition hover:text-white"
              >
                Maybe later
              </button>

              <p className="mt-3 text-center text-xs text-zinc-600">
                You can change your preference anytime.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Feature({
  icon,
  text,
}: {
  icon: ReactNode;
  text: string;
}) {
  return (
    <div className="flex items-center gap-3 text-sm text-zinc-300">
      <span className="text-purple-400">{icon}</span>
      {text}
    </div>
  );
}
