import { NextResponse } from "next/server";
import { site } from "@/lib/site";

export const runtime = "nodejs";

/**
 * Delivery uses Resend's REST API, so no SDK is needed. Set these in .env.local
 * (and in the host's environment) to switch the form on:
 *   RESEND_API_KEY   — key from resend.com
 *   CONTACT_TO       — inbox that receives the enquiries
 *   CONTACT_FROM     — verified sender, e.g. "ASM <site@asm-architectes.ma>"
 * Until they are set, submissions are logged in development and refused in
 * production, so the form never silently drops an enquiry.
 */

type Payload = {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  company?: string;
  locale?: string;
};

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimited(ip: string) {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  let body: Payload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  // Spam trap filled in — accept quietly so the bot learns nothing.
  if (body.company) return NextResponse.json({ ok: true });

  const name = (body.name ?? "").trim().slice(0, 120);
  const email = (body.email ?? "").trim().slice(0, 160);
  const phone = (body.phone ?? "").trim().slice(0, 60);
  const subject = (body.subject ?? "").trim().slice(0, 120);
  const message = (body.message ?? "").trim().slice(0, 5000);

  if (name.length < 2 || message.length < 10 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return NextResponse.json({ error: "invalid_fields" }, { status: 422 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO;
  const from = process.env.CONTACT_FROM;

  if (!apiKey || !to || !from) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[contact] mail not configured — enquiry received:", {
        name,
        email,
        phone,
        subject,
        message,
      });
      return NextResponse.json({ ok: true, delivered: false });
    }
    console.error("[contact] RESEND_API_KEY / CONTACT_TO / CONTACT_FROM are not set");
    return NextResponse.json({ error: "not_configured" }, { status: 500 });
  }

  const lines = [
    `Nom / Name: ${name}`,
    `E-mail: ${email}`,
    phone ? `Téléphone / Phone: ${phone}` : null,
    subject ? `Projet / Subject: ${subject}` : null,
    `Langue / Language: ${body.locale ?? "fr"}`,
    "",
    message,
  ].filter(Boolean);

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: email,
      subject: `${site.name} — ${subject || "Nouveau message"} — ${name}`,
      text: lines.join("\n"),
    }),
  });

  if (!response.ok) {
    console.error("[contact] resend failed", response.status, await response.text());
    return NextResponse.json({ error: "send_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true, delivered: true });
}
