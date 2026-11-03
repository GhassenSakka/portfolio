import { prisma } from "@/lib/db";
import { ProfileForm } from "@/components/admin/profile-form";

export const dynamic = "force-dynamic";

export default async function AdminProfilePage() {
  const profile = await prisma.profile.findFirst();

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-1 text-2xl font-bold text-slate-900">Profil / Hero / À propos</h1>
      <p className="mb-6 text-sm text-slate-500">
        Ces informations alimentent la section d&apos;en-tête et la section « À propos » du site public.
      </p>
      <ProfileForm profile={profile} />
    </div>
  );
}
