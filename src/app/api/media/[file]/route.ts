import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

const contentTypes: Record<string, string> = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp", avif: "image/avif" };

export async function GET(_: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  if (!/^[a-f0-9-]+\.(jpg|jpeg|png|webp|avif)$/i.test(file)) return new NextResponse("Not found", { status: 404 });
  try {
    const bytes = await readFile(path.join(process.cwd(), ".data", "uploads", file));
    const extension = file.split(".").pop()!.toLowerCase();
    return new NextResponse(bytes, { headers: { "Content-Type": contentTypes[extension], "Cache-Control": "public, max-age=31536000, immutable", "X-Content-Type-Options": "nosniff" } });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
