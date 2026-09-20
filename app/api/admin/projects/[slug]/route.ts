import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import {
  deleteProjectRaw,
  getProjectRaw,
  updateProjectRaw,
} from "@/lib/db/projects";
import { requireAdmin } from "@/lib/require-admin";
import { parseProjectInput } from "@/lib/validate-project";

export const runtime = "nodejs";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;
  const { slug } = await params;
  const project = getProjectRaw(slug);
  if (!project) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ project });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;
  const { slug } = await params;

  if (!getProjectRaw(slug)) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  let input;
  try {
    input = parseProjectInput(await request.json());
  } catch (message) {
    return NextResponse.json({ error: String(message) }, { status: 422 });
  }

  if (input.slug !== slug && getProjectRaw(input.slug)) {
    return NextResponse.json({ error: "A project with this slug already exists" }, { status: 409 });
  }

  updateProjectRaw(slug, input);
  revalidateTag("projects");
  return NextResponse.json({ ok: true, slug: input.slug });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;
  const { slug } = await params;
  deleteProjectRaw(slug);
  revalidateTag("projects");
  return NextResponse.json({ ok: true });
}
