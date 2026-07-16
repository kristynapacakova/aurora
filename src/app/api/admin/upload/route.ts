import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { isAdminRequest } from "@/lib/adminAuth";

// Nahrání fotky do Vercel Blob úložiště. Vyžaduje připojený Blob store
// (Vercel doplní BLOB_READ_WRITE_TOKEN automaticky).
export async function POST(request: Request) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ error: "Nepřihlášeno." }, { status: 401 });
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Úložiště fotek není připojeno. Ve Vercelu: Storage → Create → Blob." },
      { status: 503 }
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Chybí soubor." }, { status: 400 });
  }
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "Fotka je příliš velká (max 10 MB)." }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Soubor musí být obrázek." }, { status: 400 });
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const blob = await put(`pobyty/${Date.now()}-${safeName}`, file, {
    access: "public",
  });

  return NextResponse.json({ ok: true, url: blob.url });
}
