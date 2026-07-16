import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";

// Fotka se nahrává přímo z prohlížeče do Vercel Blob (rychlé, obchází
// server webu). Tato routa jen vydá krátkodobý token pro nahrání —
// a to teprve po ověření, že žádá přihlášený admin.
export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
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
