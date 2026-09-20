import { NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

/**
 * /api/admin/* routes are excluded from the middleware matcher (it skips
 * everything under /api), so each one checks the session cookie itself.
 * Returns a 401 response to short-circuit with, or null when authorized.
 */
export async function requireAdmin(request: Request): Promise<NextResponse | null> {
  const cookie = request.headers
    .get("cookie")
    ?.split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${SESSION_COOKIE}=`))
    ?.slice(SESSION_COOKIE.length + 1);

  if (!(await verifySessionToken(cookie))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  return null;
}
