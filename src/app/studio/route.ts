import { NextResponse } from "next/server";
import { getNastaveni } from "@/lib/db";

// aurorayoga.cz/studio → online studio na Uscreenu.
//
// Vlastní doména je u Uscreenu zamčená za tarifem Growth, takže studio běží
// na jejich poddoméně. Tahle adresa dává klientce vlastní doménu aspoň na
// vizitku, do bia na Instagramu nebo do tisku — návštěvnice si ji pamatuje
// a nemusí znát uscreen.io.
//
// Cíl se čte ze stejného zdroje jako odkazy ve zbytku webu: co je vyplněné
// v administraci, má přednost, jinak platí výchozí adresa z lib/config.ts.
// Přejmenování studia se tím propíše i sem.

// Cíl se může změnit (jiná poddoména, jednou snad vlastní doména), takže
// dočasné přesměrování — trvalé si prohlížeče pamatují a přepsat ho
// návštěvnici už nejde.
export const dynamic = "force-dynamic";

export async function GET() {
  const nastaveni = await getNastaveni();
  return NextResponse.redirect(nastaveni.uscreen_home, 307);
}
