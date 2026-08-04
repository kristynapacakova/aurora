"use client";

// Zmenší fotku v prohlížeči ještě před odesláním na server — telefonní
// fotky mají často 4–12 MB, což je většina reálného času "nahrávání".
// Po zmenšení na rozumnou šířku a přeuložení jako JPEG bývá soubor
// desetkrát až dvacetkrát menší, což nahrávání zásadně zrychlí.
//
// Když prohlížeč fotku nedokáže dekódovat (typicky HEIC z iPhonu bez
// automatické konverze), tiše se vrátí původní soubor — nahrávání pak
// prostě poběží beze změny, jen pomaleji.
export async function resizeImageFile(file: File, maxDimension = 1920, quality = 0.82): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/svg+xml") return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
    if (!blob || blob.size >= file.size) return file; // zmenšení nepomohlo, radši původní

    const newName = file.name.replace(/\.[^.]+$/, "") + ".jpg";
    return new File([blob], newName, { type: "image/jpeg" });
  } catch {
    return file;
  }
}
