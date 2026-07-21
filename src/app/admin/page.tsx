import { getPobyty, getClanky, getPoptavky, getNewsletterSignups, getNastaveni, dbConfigured } from "@/lib/db";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const configured = dbConfigured();
  const [pobyty, clanky, poptavky, newsletter] = configured
    ? await Promise.all([getPobyty(false), getClanky(false), getPoptavky(), getNewsletterSignups()])
    : [[], [], [], []];
  const nastaveni = await getNastaveni();

  return (
    <AdminDashboard
      configured={configured}
      pobyty={pobyty}
      clanky={clanky}
      poptavky={poptavky}
      newsletter={newsletter}
      nastaveni={nastaveni}
    />
  );
}
