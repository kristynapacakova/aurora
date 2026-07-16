import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { isAdminRequest } from "@/lib/adminAuth";

// Nahrání fotky do Vercel Blob úložiště. Token hledáme toleratně —
// standardně BLOB_READ_WRITE_TOKEN, ale při připojení store s vlastním
// prefixem může mít jiný začátek (…_READ_WRITE_TOKEN).
function blobToken(): string | undefined {
  if (process.env.BLOB_READ_WRITE_TOKEN) return process.env.BLOB_READ_WRITE_TOKEN;
  const key = Object.keys(process.env).find((k) => k.endsWith("_READ_WRITE_TOKEN"));
  return key ? process.env[key] : undefined;
}

export async function POST(request: Request) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ error: "Nepřihlášeno." }, { status: 401 });
  }
  const token = blobToken();
  if (!token) {
    return NextResponse.json(
      {
        error:
          "Úložiště fotek není propojené s projektem. Ve Vercelu: Storage → blob store → Connect to Project → aurora.",
      },
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
    token,
  });

  return NextResponse.json({ ok: true, url: blob.url });
}
