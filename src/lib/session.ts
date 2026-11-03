import { SignJWT, jwtVerify } from "jose";

/**
 * Gestion de session admin — compatible Edge Runtime (middleware) et Node.
 * Ne pas importer Prisma ou bcrypt ici : ce fichier doit rester utilisable
 * depuis le middleware (Edge Runtime).
 */

export const SESSION_COOKIE_NAME = "portfolio_admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7; // 7 jours

export interface SessionPayload {
  sub: string; // id de l'AdminUser
  email: string;
}

function getSecretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "SESSION_SECRET manquant ou trop court. Lancez `npm run setup` pour en générer un."
    );
  }
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ email: payload.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSecretKey());
}

export async function verifySessionToken(
  token: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (typeof payload.sub !== "string" || typeof payload.email !== "string") {
      return null;
    }
    return { sub: payload.sub, email: payload.email };
  } catch {
    return null;
  }
}

export const SESSION_MAX_AGE = SESSION_DURATION_SECONDS;
