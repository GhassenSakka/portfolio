import "server-only";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE,
  createSessionToken,
  verifySessionToken,
  type SessionPayload,
} from "@/lib/session";

const BCRYPT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/** Authentifie l'admin et pose le cookie de session. À appeler depuis une Server Action. */
export async function login(
  email: string,
  password: string
): Promise<{ success: true } | { success: false; error: string }> {
  const user = await prisma.adminUser.findUnique({ where: { email } });
  if (!user) {
    return { success: false, error: "Identifiants invalides." };
  }
  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return { success: false, error: "Identifiants invalides." };
  }

  const token = await createSessionToken({ sub: user.id, email: user.email });
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  return { success: true };
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/** Lit et vérifie la session courante (Server Components / Actions). */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

/** Jette une erreur si aucun admin n'est connecté. À utiliser dans les Server Actions admin. */
export async function requireAdminSession(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}

export async function changePassword(
  adminUserId: string,
  currentPassword: string,
  newPassword: string
): Promise<{ success: true } | { success: false; error: string }> {
  const user = await prisma.adminUser.findUnique({ where: { id: adminUserId } });
  if (!user) return { success: false, error: "Utilisateur introuvable." };

  const valid = await verifyPassword(currentPassword, user.passwordHash);
  if (!valid) return { success: false, error: "Mot de passe actuel incorrect." };

  if (newPassword.length < 8) {
    return {
      success: false,
      error: "Le nouveau mot de passe doit contenir au moins 8 caractères.",
    };
  }

  const passwordHash = await hashPassword(newPassword);
  await prisma.adminUser.update({ where: { id: user.id }, data: { passwordHash } });
  return { success: true };
}
