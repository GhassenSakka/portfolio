import Link from "next/link";
import { prisma } from "@/lib/db";
import { ENTITY_REGISTRY } from "@/lib/admin/entity-config";
import { Mail, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const counts = await Promise.all(
    ENTITY_REGISTRY.map(async (entity) => {
      const db = (prisma as unknown as Record<string, { count: () => Promise<number> }>)[entity.model];
      const count = await db.count();
      return { entity, count };
    })
  );

  const [recentMessages, unreadCount, profile] = await Promise.all([
    prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.contactMessage.count({ where: { isRead: false } }),
    prisma.profile.findFirst(),
  ]);

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-bold text-slate-900">Tableau de bord</h1>
      <p className="mt-1 text-sm text-slate-500">
        Bienvenue{profile ? `, ${profile.fullName}` : ""}. Voici un aperçu du contenu du site.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {counts.map(({ entity, count }) => (
          <Link
            key={entity.slug}
            href={`/admin/${entity.slug}`}
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-azure-300"
          >
            <div>
              <p className="text-2xl font-bold text-slate-900">{count}</p>
              <p className="text-sm text-slate-500">{entity.label}</p>
            </div>
            <ArrowRight size={16} className="text-slate-300" />
          </Link>
        ))}

        <Link
          href="/admin/messages"
          className="flex items-center justify-between rounded-xl border border-azure-200 bg-azure-50 p-5 shadow-sm transition-colors hover:border-azure-400"
        >
          <div>
            <p className="text-2xl font-bold text-azure-800">{unreadCount}</p>
            <p className="text-sm text-azure-700">Messages non lus</p>
          </div>
          <Mail size={16} className="text-azure-400" />
        </Link>
      </div>

      <div className="mt-10">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Derniers messages reçus</h2>
          <Link href="/admin/messages" className="text-sm font-semibold text-azure-700 hover:underline">
            Voir tout
          </Link>
        </div>
        {recentMessages.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-400">
            Aucun message reçu pour le moment.
          </p>
        ) : (
          <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
            {recentMessages.map((message) => (
              <div key={message.id} className="flex items-center justify-between gap-4 p-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-900">
                    {message.name} <span className="text-slate-400">— {message.email}</span>
                  </p>
                  <p className="truncate text-sm text-slate-500">
                    {message.subject || message.message}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {!message.isRead ? (
                    <span className="rounded-full bg-azure-100 px-2 py-0.5 text-xs font-semibold text-azure-700">
                      Nouveau
                    </span>
                  ) : null}
                  <span className="text-xs text-slate-400">
                    {new Date(message.createdAt).toLocaleDateString("fr-FR")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
