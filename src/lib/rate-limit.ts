import "server-only";
import { prisma } from "@/lib/db";

const RATE_LIMIT_WINDOW_MINUTES = 10;
const RATE_LIMIT_MAX_REQUESTS = 3;

/**
 * Limitation de débit simple basée sur la base de données : au plus
 * RATE_LIMIT_MAX_REQUESTS messages par adresse IP sur une fenêtre de
 * RATE_LIMIT_WINDOW_MINUTES minutes. Pas de dépendance externe (Redis, etc.)
 * pour rester "zéro service externe obligatoire".
 */
export async function isRateLimited(ipAddress: string | null): Promise<boolean> {
  if (!ipAddress) return false; // on ne bloque pas si l'IP est inconnue (dev local)

  const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60 * 1000);
  const recentCount = await prisma.contactMessage.count({
    where: {
      ipAddress,
      createdAt: { gte: windowStart },
    },
  });

  return recentCount >= RATE_LIMIT_MAX_REQUESTS;
}
