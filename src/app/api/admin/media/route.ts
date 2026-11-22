import { mkdir, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { NextResponse } from "next/server";
import { assertAdminApi } from "@/lib/session";

const extensions: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif" };

export async function POST(request: Request) {
  try {
    await assertAdminApi();
    const form = await request.formData();
    const files = form.getAll("files").filter((item): item is File => item instanceof File);
    if (!files.length) return NextResponse.json({ error: "No images selected" }, { status: 400 });
    const directory = path.join(process.cwd(), ".data", "uploads");
    await mkdir(directory, { recursive: true });
    const urls: string[] = [];
    for (const file of files) {
      const extension = extensions[file.type];
      if (!extension || file.size > 8 * 1024 * 1024) throw new Error("Use JPG, PNG, WebP, or AVIF images up to 8 MB each.");
      const filename = `${randomUUID()}.${extension}`;
      await writeFile(path.join(directory, filename), Buffer.from(await file.arrayBuffer()));
      urls.push(`/api/media/${filename}`);
    }
    return NextResponse.json({ urls }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: message === "UNAUTHORIZED" ? 401 : 400 });
  }
}
