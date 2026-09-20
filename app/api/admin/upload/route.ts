import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import sharp from "sharp";
import { requireAdmin } from "@/lib/require-admin";

export const runtime = "nodejs";

const MAX_BYTES = 15 * 1024 * 1024;
const MAX_EDGE = 3000;
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export async function POST(request: Request) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File is larger than 15MB" }, { status: 413 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());

  // Re-encode through sharp: validates it's a real image, strips metadata,
  // and caps the size — it also refuses to decode anything that isn't one
  // of these formats, which is the actual security boundary here (never the
  // client-supplied MIME type).
  let image = sharp(bytes, { failOn: "error" });
  const metadata = await image.metadata().catch(() => null);
  if (!metadata?.format || !["jpeg", "png", "webp"].includes(metadata.format)) {
    return NextResponse.json(
      { error: "Only JPEG, PNG and WebP images are accepted" },
      { status: 415 },
    );
  }

  if ((metadata.width ?? 0) > MAX_EDGE || (metadata.height ?? 0) > MAX_EDGE) {
    image = image.resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true });
  }

  const ext = metadata.format === "jpeg" ? "jpg" : metadata.format;
  const output =
    metadata.format === "jpeg"
      ? await image.jpeg({ quality: 88, mozjpeg: true }).toBuffer()
      : metadata.format === "png"
        ? await image.png({ quality: 88 }).toBuffer()
        : await image.webp({ quality: 88 }).toBuffer();

  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  const filename = `${randomUUID()}.${ext}`;
  await fs.writeFile(path.join(UPLOAD_DIR, filename), output);

  return NextResponse.json({ ok: true, path: `/uploads/${filename}` });
}
