import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import {
  createProjectRaw,
  getProjectRaw,
  listProjectsRaw,
  reorderProjectsRaw,
} from "@/lib/db/projects";
import { requireAdmin } from "@/lib/require-admin";
import { parseProjectInput } from "@/lib/validate-project";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;
  return NextResponse.json({ projects: listProjectsRaw() });
}

export async function POST(request: Request) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  const body = await request.json().catch(() => null);

  // A reorder request: { reorder: string[] of slugs in the new order }.
  if (body && Array.isArray(body.reorder)) {
    reorderProjectsRaw(body.reorder);
    revalidateTag("projects");
    return NextResponse.json({ ok: true });
  }

  let input;
  try {
    input = parseProjectInput(body);
  } catch (message) {
    return NextResponse.json({ error: String(message) }, { status: 422 });
  }

  if (getProjectRaw(input.slug)) {
    return NextResponse.json({ error: "A project with this slug already exists" }, { status: 409 });
  }

  createProjectRaw(input);
  revalidateTag("projects");
  return NextResponse.json({ ok: true, slug: input.slug });
}
