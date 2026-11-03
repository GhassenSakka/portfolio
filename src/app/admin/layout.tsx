import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getSession } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import "./admin.css";

export const metadata: Metadata = {
  title: "Back-office — Ghassen SAKKA",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getSession();

  return (
    <html lang="fr" className="h-full">
      <body className="flex h-full min-h-screen flex-col bg-slate-50 text-slate-900 antialiased lg:flex-row">
        {session ? (
          <>
            <AdminSidebar email={session.email} />
            <main className="flex-1 overflow-y-auto p-5 lg:p-10">{children}</main>
          </>
        ) : (
          <main className="flex min-h-screen flex-1 items-center justify-center p-6">{children}</main>
        )}
      </body>
    </html>
  );
}
