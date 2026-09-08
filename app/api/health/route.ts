import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Health check for the host. Coolify's default probe hits "/", which redirects
 * to a locale with a 307 and can read as unhealthy — point it here instead.
 */
export function GET() {
  return NextResponse.json({ status: "ok", time: new Date().toISOString() });
}
