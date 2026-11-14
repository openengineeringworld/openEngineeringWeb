

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  createSession,
} from "@/app/lib/auth";

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000;
const WINDOW_MS = 15 * 60 * 1000;
const MAX_BODY_SIZE = 4 * 1024;

type LoginAttempt = {
  count: number;
  windowStart: number;
  blockedUntil: number;
};

// In-memory rate limiter: applies per Node.js process.
const loginAttempts = new Map<string, LoginAttempt>();

function getClientIp(request: Request): string {
  const realIp = request.headers.get("x-real-ip");

  if (realIp) return realIp.trim().slice(0, 64);

  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim().slice(0, 64);
  }

  return "unknown";
}

function rateLimitResponse(blockedUntil: number) {
  const retryAfter = Math.max(
    1,
    Math.ceil((blockedUntil - Date.now()) / 1000)
  );

  return NextResponse.json(
    { error: "Too many failed attempts. Try again later." },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfter),
        "Cache-Control": "no-store",
      },
    }
  );
}

function recordFailedAttempt(ip: string): number {
  const now = Date.now();

  const existing = loginAttempts.get(ip);

  let record: LoginAttempt;

  if (!existing || now - existing.windowStart >= WINDOW_MS) {
    record = {
      count: 1,
      windowStart: now,
      blockedUntil: 0,
    };
  } else {
    record = {
      ...existing,
      count: existing.count + 1,
    };
  }

  if (record.count >= MAX_ATTEMPTS) {
    record.blockedUntil = now + LOCKOUT_MS;
  }

  loginAttempts.set(ip, record);

  // Remove expired records to limit memory growth.
  for (const [key, value] of loginAttempts) {
    if (
      now - value.windowStart >= WINDOW_MS &&
      value.blockedUntil <= now
    ) {
      loginAttempts.delete(key);
    }
  }

  return record.blockedUntil;
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const now = Date.now();

    const existing = loginAttempts.get(ip);

    if (existing && existing.blockedUntil > now) {
      return rateLimitResponse(existing.blockedUntil);
    }

    const contentLength = Number(
      request.headers.get("content-length") || 0
    );

    if (contentLength > MAX_BODY_SIZE) {
      return NextResponse.json(
        { error: "Request body too large." },
        { status: 413 }
      );
    }

    const contentType = request.headers.get("content-type") || "";

    if (!contentType.toLowerCase().includes("application/json")) {
      return NextResponse.json(
        { error: "Content-Type must be application/json." },
        { status: 415 }
      );
    }

    const rawBody = await request.text();

    if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_SIZE) {
      return NextResponse.json(
        { error: "Request body too large." },
        { status: 413 }
      );
    }

    let body: unknown;

    try {
      body = JSON.parse(rawBody);
    } catch {
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400 }
      );
    }

    if (typeof body !== "object" || body === null) {
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400 }
      );
    }

    const { email, password } = body as {
      email?: unknown;
      password?: unknown;
    };

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      email.length > 254 ||
      password.length > 1024 ||
      !email.trim() ||
      !password
    ) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.error("Admin credentials are not configured.");

      return NextResponse.json(
        { error: "Login is temporarily unavailable." },
        { status: 500 }
      );
    }

    const isValidPassword = password === adminPassword;

    const isValidEmail =
      email.trim().toLowerCase() ===
      adminEmail.trim().toLowerCase();

    if (!isValidEmail || !isValidPassword) {
      const blockedUntil = recordFailedAttempt(ip);

      if (blockedUntil > Date.now()) {
        return rateLimitResponse(blockedUntil);
      }

      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    loginAttempts.delete(ip);

    const session = await createSession(adminEmail);
    const cookieStore = await cookies();

    cookieStore.set("admin_session", session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json(
      { success: true },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("Admin login failed:", error);

    return NextResponse.json(
      { error: "Login failed." },
      { status: 500 }
    );
  }
}
