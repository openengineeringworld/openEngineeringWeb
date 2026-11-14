
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";

const secret = process.env.SESSION_SECRET;

if (!secret) {
  throw new Error("SESSION_SECRET is not configured.");
}

const encoder = new TextEncoder();
const secretKey = encoder.encode(secret);

if (secretKey.byteLength < 32) {
  throw new Error(
    "SESSION_SECRET must contain at least 32 bytes."
  );
}

const SESSION_ISSUER = "open-engineering";
const SESSION_AUDIENCE = "open-engineering-admin";
const SESSION_ALGORITHM = "HS256";

export async function verifyPassword(
  password: string,
  storedPassword: string
): Promise<boolean> {
  if (
    typeof password !== "string" ||
    typeof storedPassword !== "string" ||
    !password ||
    !storedPassword
  ) {
    return false;
  }

  try {
    return await bcrypt.compare(password, storedPassword);
  } catch {
    return false;
  }
}

export async function createSession(
  email: string
): Promise<string> {
  if (typeof email !== "string" || !email.trim()) {
    throw new Error("A valid email is required to create a session.");
  }

  return new SignJWT({ email: email.trim() })
    .setProtectedHeader({ alg: SESSION_ALGORITHM })
    .setIssuer(SESSION_ISSUER)
    .setAudience(SESSION_AUDIENCE)
    .setSubject(email.trim())
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey);
}

export async function verifySession(token: string) {
  if (typeof token !== "string" || !token.trim()) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: [SESSION_ALGORITHM],
      issuer: SESSION_ISSUER,
      audience: SESSION_AUDIENCE,
      clockTolerance: 5,
    });

    if (
      typeof payload.email !== "string" ||
      !payload.email.trim() ||
      payload.sub !== payload.email
    ) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
