import { getProfile } from "@/lib/content";
import { HeaderClient } from "@/components/header-client";

export async function SiteHeader() {
  const profile = await getProfile();

  return (
    <HeaderClient
      fullName={profile?.fullName ?? "Ghassen SAKKA"}
      cvUrl={profile?.cvUrl ?? null}
      linkedinUrl={profile?.linkedinUrl ?? null}
    />
  );
}
