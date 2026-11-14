

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { verifySession } from "@/app/lib/auth";
import webpush from "web-push";

const filePath = path.join(
  process.cwd(),
  "data",
  "notifications.json"
);

const MAX_BODY_SIZE = 16 * 1024;

type NotificationCategory =
  | "products"
  | "announcements"
  | "system";

type NotificationAction = {
  label: string;
  href: string;
  external: boolean;
};

type NotificationRecord = {
  id: string;
  [key: string]: unknown;
};

type NotificationStore = {
  notifications: NotificationRecord[];
  [key: string]: unknown;
};

type RequestBody = Record<string, unknown>;

// Authentication
async function isAdminAuthenticated(): Promise<boolean> {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;

    if (!adminEmail) return false;

    const cookieStore = await cookies();
    const token = cookieStore.get("admin_session")?.value;

    if (!token) return false;

    const session = await verifySession(token);

    return (
      !!session &&
      typeof session.email === "string" &&
      session.email === adminEmail
    );
  } catch {
    return false;
  }
}

// Check that browser write requests originate from this site
function isSameOrigin(request: Request): boolean {
  try {
    const origin = request.headers.get("origin");

    if (!origin) return false;

    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

// Safely read JSON request bodies
async function readRequestBody(
  request: Request
): Promise<RequestBody | null> {
  try {
    const contentType = request.headers.get("content-type") ?? "";

    if (!contentType.includes("application/json")) {
      return null;
    }

    const text = await request.text();

    if (new TextEncoder().encode(text).byteLength > MAX_BODY_SIZE) {
      return null;
    }

    const body: unknown = JSON.parse(text);

    if (
      typeof body !== "object" ||
      body === null ||
      Array.isArray(body)
    ) {
      return null;
    }

    return body as RequestBody;
  } catch {
    return null;
  }
}

// Read and validate notification storage
async function readNotifications(): Promise<NotificationStore> {
  const fileContents = await readFile(filePath, "utf-8");
  const data: unknown = JSON.parse(fileContents);

  if (
    typeof data !== "object" ||
    data === null ||
    Array.isArray(data) ||
    !Array.isArray((data as NotificationStore).notifications)
  ) {
    throw new Error("Invalid notification storage format.");
  }

  return data as NotificationStore;
}

// Save notification data
async function saveNotifications(
  data: NotificationStore
): Promise<void> {
  await writeFile(
    filePath,
    JSON.stringify(data, null, 2),
    "utf-8"
  );
}

// Validate notification fields
function validateNotification(
  body: RequestBody
): string | null {
  const { title, description, badge, category } = body;

  if (
    typeof title !== "string" ||
    !title.trim() ||
    title.length > 120 ||
    typeof description !== "string" ||
    !description.trim() ||
    description.length > 2000 ||
    typeof badge !== "string" ||
    !badge.trim() ||
    badge.length > 40 ||
    typeof category !== "string" ||
    !["products", "announcements", "system"].includes(category)
  ) {
    return "Invalid notification details";
  }

  const actionLabel = body.actionLabel ?? "";
  const actionHref = body.actionHref ?? "";

  if (
    typeof actionLabel !== "string" ||
    typeof actionHref !== "string" ||
    actionLabel.length > 50 ||
    actionHref.length > 2048
  ) {
    return "Invalid action button details";
  }

  if (
    Boolean(actionLabel.trim()) !==
    Boolean(actionHref.trim())
  ) {
    return "Action label and URL must both be provided";
  }

  if (actionHref.trim()) {
    const href = actionHref.trim();

    const isInternal =
      href.startsWith("/") &&
      !href.startsWith("//") &&
      !href.includes("\\");

    let isExternal = false;

    try {
      const url = new URL(href);
      isExternal =
        url.protocol === "https:" ||
        url.protocol === "http:";
    } catch {
      isExternal = false;
    }

    if (!isInternal && !isExternal) {
      return "Action URL must be an internal path or HTTP(S) URL";
    }
  }

  return null;
}

// Build action button data
function buildAction(
  body: RequestBody
): NotificationAction | undefined {
  const label =
    typeof body.actionLabel === "string"
      ? body.actionLabel.trim()
      : "";

  const href =
    typeof body.actionHref === "string"
      ? body.actionHref.trim()
      : "";

  if (!label || !href) return undefined;

  let external = false;

  try {
    const url = new URL(href);
    external =
      url.protocol === "https:" ||
      url.protocol === "http:";
  } catch {
    external = false;
  }

  return { label, href, external };
}

// GET: Fetch all notifications (admin only)
export async function GET() {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const data = await readNotifications();

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("ADMIN NOTIFICATIONS ERROR:", error);

    return NextResponse.json(
      { error: "Failed to load notifications" },
      { status: 500 }
    );
  }
}

// POST: Create notification and send browser push
export async function POST(request: Request) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!isSameOrigin(request)) {
      return NextResponse.json(
        { error: "Invalid request origin" },
        { status: 403 }
      );
    }

    const body = await readRequestBody(request);

    if (!body) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const validationError = validateNotification(body);

    if (validationError) {
      return NextResponse.json(
        { error: validationError },
        { status: 400 }
      );
    }

    const data = await readNotifications();
    const action = buildAction(body);

    const newNotification: NotificationRecord = {
      id: crypto.randomUUID(),
      title: (body.title as string).trim(),
      description: (body.description as string).trim(),
      category: body.category as NotificationCategory,
      badge: (body.badge as string).trim(),
      badgeColor:
        "border-purple-400/30 bg-purple-500/10 text-purple-300",
      time: "Just now",
      read: false,
      icon: "bell",
      ...(action ? { action } : {}),
    };

    data.notifications.unshift(newNotification);

    await saveNotifications(data);

    let pushSent = 0;
    let pushFailed = 0;
    let pushError: string | null = null;

    try {
      const vapidSubject = process.env.VAPID_SUBJECT;
      const vapidPublicKey =
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;

      if (!vapidSubject || !vapidPublicKey || !vapidPrivateKey) {
        throw new Error("Push service is not configured.");
      }

      webpush.setVapidDetails(
        vapidSubject,
        vapidPublicKey,
        vapidPrivateKey
      );

      const subscriptionsPath = path.join(
        process.cwd(),
        "data",
        "subscriptions.json"
      );

      const subscriptionsFile = await readFile(
        subscriptionsPath,
        "utf-8"
      );

      const subscriptionsData: unknown =
        JSON.parse(subscriptionsFile);

      if (
        typeof subscriptionsData !== "object" ||
        subscriptionsData === null ||
        !Array.isArray(
          (subscriptionsData as { subscriptions?: unknown[] })
            .subscriptions
        )
      ) {
        throw new Error("Invalid subscription storage format.");
      }

      const subscriptions = (
        subscriptionsData as { subscriptions: unknown[] }
      ).subscriptions;

      const payload = JSON.stringify({
        title: newNotification.title,
        body: newNotification.description,
        url: action?.href || "/notification",
      });

      const results = await Promise.allSettled(
        subscriptions.map((subscription) =>
          webpush.sendNotification(
            subscription as Parameters<
              typeof webpush.sendNotification
            >[0],
            payload
          )
        )
      );

      pushSent = results.filter(
        (result) => result.status === "fulfilled"
      ).length;

      pushFailed = results.filter(
        (result) => result.status === "rejected"
      ).length;
    } catch (error) {
      pushError = "Notification saved, but push delivery failed.";

      console.error("PUSH NOTIFICATION ERROR:", error);
    }

    return NextResponse.json(
      {
        success: true,
        notification: newNotification,
        pushSent,
        pushFailed,
        pushError,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE NOTIFICATION ERROR:", error);

    return NextResponse.json(
      { error: "Failed to create notification" },
      { status: 500 }
    );
  }
}

// PUT: Update an existing notification
export async function PUT(request: Request) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!isSameOrigin(request)) {
      return NextResponse.json(
        { error: "Invalid request origin" },
        { status: 403 }
      );
    }

    const body = await readRequestBody(request);

    if (!body) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    if (typeof body.id !== "string" || !body.id.trim()) {
      return NextResponse.json(
        { error: "Notification ID is required" },
        { status: 400 }
      );
    }

    const validationError = validateNotification(body);

    if (validationError) {
      return NextResponse.json(
        { error: validationError },
        { status: 400 }
      );
    }

    const data = await readNotifications();

    const index = data.notifications.findIndex(
      (notification) => notification.id === body.id
    );

    if (index === -1) {
      return NextResponse.json(
        { error: "Notification not found" },
        { status: 404 }
      );
    }

    const existingNotification = data.notifications[index];
    const action = buildAction(body);

    const updatedNotification: NotificationRecord = {
      ...existingNotification,
      title: (body.title as string).trim(),
      description: (body.description as string).trim(),
      category: body.category as NotificationCategory,
      badge: (body.badge as string).trim(),
      badgeColor:
        "border-purple-400/30 bg-purple-500/10 text-purple-300",
      action,
    };

    data.notifications[index] = updatedNotification;

    await saveNotifications(data);

    return NextResponse.json({
      success: true,
      notification: updatedNotification,
    });
  } catch (error) {
    console.error("UPDATE NOTIFICATION ERROR:", error);

    return NextResponse.json(
      { error: "Failed to update notification" },
      { status: 500 }
    );
  }
}

// DELETE: Remove an existing notification
export async function DELETE(request: Request) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!isSameOrigin(request)) {
      return NextResponse.json(
        { error: "Invalid request origin" },
        { status: 403 }
      );
    }

    const body = await readRequestBody(request);

    if (!body) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    if (typeof body.id !== "string" || !body.id.trim()) {
      return NextResponse.json(
        { error: "Notification ID is required" },
        { status: 400 }
      );
    }

    const data = await readNotifications();

    const index = data.notifications.findIndex(
      (notification) => notification.id === body.id
    );

    if (index === -1) {
      return NextResponse.json(
        { error: "Notification not found" },
        { status: 404 }
      );
    }

    data.notifications.splice(index, 1);

    await saveNotifications(data);

    return NextResponse.json({
      success: true,
      message: "Notification deleted successfully",
      id: body.id,
    });
  } catch (error) {
    console.error("DELETE NOTIFICATION ERROR:", error);

    return NextResponse.json(
      { error: "Failed to delete notification" },
      { status: 500 }
    );
  }
}
