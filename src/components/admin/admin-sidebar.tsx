"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  User,
  Briefcase,
  FolderKanban,
  Award,
  GraduationCap,
  Users,
  Image as ImageIcon,
  Trophy,
  Handshake,
  Heart,
  Link2,
  Mail,
  Database,
  KeyRound,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import { ENTITY_REGISTRY } from "@/lib/admin/entity-config";
import { logoutAction } from "@/app/admin/actions/auth-actions";

const ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  experiences: Briefcase,
  projects: FolderKanban,
  certifications: Award,
  education: GraduationCap,
  "associative-roles": Users,
  "associative-actions": ImageIcon,
  awards: Trophy,
  sponsors: Handshake,
  interests: Heart,
  "social-links": Link2,
};

export function AdminSidebar({ email }: { email: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const navItemClass = (href: string) => {
    const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
    return `flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
      active
        ? "bg-azure-600 text-white"
        : "text-slate-600 hover:bg-azure-50 hover:text-azure-700"
    }`;
  };

  const links = (
    <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
      <Link href="/admin" className={navItemClass("/admin")} onClick={() => setOpen(false)}>
        <LayoutDashboard size={16} /> Tableau de bord
      </Link>
      <Link href="/admin/profile" className={navItemClass("/admin/profile")} onClick={() => setOpen(false)}>
        <User size={16} /> Profil / Hero / À propos
      </Link>

      <p className="mt-4 px-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
        Contenu du site
      </p>
      {ENTITY_REGISTRY.map((entity) => {
        const Icon = ICONS[entity.slug] ?? FolderKanban;
        const href = `/admin/${entity.slug}`;
        return (
          <Link key={entity.slug} href={href} className={navItemClass(href)} onClick={() => setOpen(false)}>
            <Icon size={16} /> {entity.label}
          </Link>
        );
      })}

      <p className="mt-4 px-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
        Gestion
      </p>
      <Link href="/admin/messages" className={navItemClass("/admin/messages")} onClick={() => setOpen(false)}>
        <Mail size={16} /> Messages de contact
      </Link>
      <Link href="/admin/data" className={navItemClass("/admin/data")} onClick={() => setOpen(false)}>
        <Database size={16} /> Export / Import
      </Link>
      <Link href="/admin/account" className={navItemClass("/admin/account")} onClick={() => setOpen(false)}>
        <KeyRound size={16} /> Mon compte
      </Link>

      <a
        href="/fr"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-azure-50 hover:text-azure-700"
      >
        <ExternalLink size={16} /> Voir le site public
      </a>
    </nav>
  );

  return (
    <>
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
        <span className="text-sm font-semibold text-slate-700">Back-office</span>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200"
          aria-label="Menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <aside
        className={`${
          open ? "flex" : "hidden"
        } w-full flex-col border-r border-slate-200 bg-white lg:flex lg:w-64 lg:shrink-0`}
      >
        <div className="hidden border-b border-slate-200 px-5 py-5 lg:block">
          <p className="text-sm font-bold text-azure-700">Ghassen SAKKA</p>
          <p className="text-xs text-slate-400">Back-office portfolio</p>
        </div>
        {links}
        <div className="border-t border-slate-200 p-4">
          <p className="truncate text-xs text-slate-400" title={email}>
            {email}
          </p>
          <form action={logoutAction}>
            <button
              type="submit"
              className="mt-2 flex w-full items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              <LogOut size={15} /> Déconnexion
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
