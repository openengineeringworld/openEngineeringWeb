
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SESSION_ISSUER = "open-engineering";
const SESSION_AUDIENCE = "open-engineering-admin";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("admin_session")?.value;
  const secret = process.env.SESSION_SECRET;

  if (!token || !secret || new TextEncoder().encode(secret).length < 32) {
    return NextResponse.redirect(
      new URL("/admin/login", request.url)
    );
  }

  try {
    const secretKey = new TextEncoder().encode(secret);

    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: ["HS256"],
      issuer: SESSION_ISSUER,
      audience: SESSION_AUDIENCE,
      clockTolerance: 5,
    });

    if (
      typeof payload.email !== "string" ||
      !payload.email.trim() ||
      payload.sub !== payload.email
    ) {
      throw new Error("Invalid admin session.");
    }

    return NextResponse.next();
  } catch {
    const response = NextResponse.redirect(
      new URL("/admin/login", request.url)
    );

    response.cookies.delete("admin_session");

    return response;
  }
}

export const config = {
  matcher: ["/admin/notifications/:path*"],
};
