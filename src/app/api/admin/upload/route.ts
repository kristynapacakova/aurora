import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";

// Token pro Blob store — standardně BLOB_READ_WRITE_TOKEN, ale při
// vlastním prefixu proměnných (např. AURORA_READ_WRITE_TOKEN) ho
// najdeme i tak.
function blobToken(): string | undefined {
  if (process.env.BLOB_READ_WRITE_TOKEN) return process.env.BLOB_READ_WRITE_TOKEN;
  const key = Object.keys(process.env).find((k) => k.endsWith("_READ_WRITE_TOKEN"));
  return key ? process.env[key] : undefined;
}

// Fotka se nahrává přímo z prohlížeče do Vercel Blob (rychlé, obchází
// server webu). Tato routa jen vydá krátkodobý token pro nahrání —
// a to teprve po ověření, že žádá přihlášený admin.
export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;
  const token = blobToken();

  if (!token) {
    return NextResponse.json(
      {
        error:
          "Úložiště fotek nemá read-write token. Ve Vercelu při připojení Blob úložiště zaškrtni „Add a read-write token env var“.",
      },
      { status: 503 }
    );
  }

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      token,
      onBeforeGenerateToken: async () => {
        if (!(await isAdminRequest(request))) {
          throw new Error("Nepřihlášeno.");
        }
        return {
          allowedContentTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
          maximumSizeInBytes: 10 * 1024 * 1024,
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => {
        // Nic dalšího řešit netřeba — URL fotky se uloží při uložení pobytu.
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message ?? "Nahrání se nepovedlo." },
      { status: 400 }
    );
  }
}
