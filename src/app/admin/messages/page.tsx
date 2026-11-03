import { prisma } from "@/lib/db";
import { MessageRowActions } from "@/components/admin/message-row-actions";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-1 text-2xl font-bold text-slate-900">Messages de contact</h1>
      <p className="mb-6 text-sm text-slate-500">
        {messages.length} message(s) reçu(s) via le formulaire de contact du site.
      </p>

      {messages.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-400">
          Aucun message pour le moment.
        </p>
      ) : (
        <div className="space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`rounded-xl border p-4 ${
                message.isRead ? "border-slate-200 bg-white" : "border-azure-200 bg-azure-50/50"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900">
                    {message.name}{" "}
                    <span className="font-normal text-slate-400">
                      &lt;{message.email}&gt;
                    </span>
                  </p>
                  {message.subject ? (
                    <p className="mt-0.5 text-sm font-medium text-slate-700">{message.subject}</p>
                  ) : null}
                  <p className="mt-2 whitespace-pre-line text-sm text-slate-600">{message.message}</p>
                  <p className="mt-2 text-xs text-slate-400">
                    {new Date(message.createdAt).toLocaleString("fr-FR")}
                    {message.ipAddress ? ` · IP ${message.ipAddress}` : ""}
                  </p>
                </div>
                <MessageRowActions id={message.id} isRead={message.isRead} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
