import {
  getPobyty,
  getClanky,
  getLekce,
  getPoptavky,
  getNewsletterSignups,
  getCekaciListina,
  getDarkovePoukazy,
  getPoukazyCerpani,
  getPoukazyNabidka,
  getEmailSablony,
  getNastaveni,
  getObsazenostPobytu,
  dbConfigured,
} from "@/lib/db";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { stavOdesilani } from "@/lib/email";
import { SITE_URL } from "@/lib/config";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const configured = dbConfigured();
  const [pobyty, clanky, lekce, poptavky, newsletter, cekaciListina, darkovePoukazy, poukazyCerpani, poukazyNabidka, emailSablony] = configured
    ? await Promise.all([
        getPobyty(false),
        getClanky(false),
        getLekce(false),
        getPoptavky(),
        getNewsletterSignups(),
        getCekaciListina(),
        getDarkovePoukazy(),
        getPoukazyCerpani(),
        getPoukazyNabidka(false),
        getEmailSablony(),
      ])
    : [[], [], [], [], [], [], [], [], [], []];
  const nastaveni = await getNastaveni();
  // Kolik objednávek přišlo na který pobyt — z toho se počítá obsazenost.
  const obsazenost = configured ? await getObsazenostPobytu() : {};
  // Doména bez protokolu a bez www — proti ní se porovnává adresa odesílatele.
  const domena = SITE_URL.replace(/^https?:\/\//, "").replace(/^www\./, "");
  const email = stavOdesilani(domena);

  return (
    <AdminDashboard
      configured={configured}
      pobyty={pobyty}
      clanky={clanky}
      lekce={lekce}
      poptavky={poptavky}
      newsletter={newsletter}
      cekaciListina={cekaciListina}
      darkovePoukazy={darkovePoukazy}
      poukazyCerpani={poukazyCerpani}
      poukazyNabidka={poukazyNabidka}
      emailSablony={emailSablony}
      nastaveni={nastaveni}
      email={email}
      obsazenost={obsazenost}
    />
  );
}
