import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { getSettingsRaw, updateSettingsRaw, type SettingsInput } from "@/lib/db/settings";
import { requireAdmin } from "@/lib/require-admin";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;
  return NextResponse.json({ settings: getSettingsRaw() });
}

function i18n(value: unknown, field: string): { fr: string; en: string } {
  const v = value as { fr?: unknown; en?: unknown } | undefined;
  if (!v || typeof v.fr !== "string" || typeof v.en !== "string") {
    throw `${field} needs both French and English text`;
  }
  return { fr: v.fr, en: v.en };
}

export async function PUT(request: Request) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  const b = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!b) return NextResponse.json({ error: "invalid_json" }, { status: 400 });

  try {
    const bio = b.bio as { fr?: unknown; en?: unknown } | undefined;
    if (!bio || !Array.isArray(bio.fr) || !Array.isArray(bio.en)) {
      throw "Bio needs both French and English paragraphs";
    }
    const social = (b.social as { instagram?: unknown; linkedin?: unknown }) ?? {};

    const current = getSettingsRaw();
    const input: SettingsInput = {
      ...current,
      fullName: String(b.fullName ?? current.fullName),
      founder: String(b.founder ?? current.founder),
      city: String(b.city ?? current.city),
      street: i18n(b.street, "Street"),
      postalCity: i18n(b.postalCity, "Postal city"),
      phoneDisplay: String(b.phoneDisplay ?? current.phoneDisplay),
      phoneHref: String(b.phoneHref ?? current.phoneHref),
      whatsappDisplay: String(b.whatsappDisplay ?? current.whatsappDisplay),
      whatsappNumber: String(b.whatsappNumber ?? current.whatsappNumber),
      email: String(b.email ?? current.email),
      coordinates: String(b.coordinates ?? current.coordinates),
      mapQuery: String(b.mapQuery ?? current.mapQuery),
      social: {
        instagram: typeof social.instagram === "string" ? social.instagram : current.social.instagram,
        linkedin: typeof social.linkedin === "string" ? social.linkedin : current.social.linkedin,
      },
      ordreNumber: String(b.ordreNumber ?? current.ordreNumber),
      bio: {
        fr: bio.fr.filter((x): x is string => typeof x === "string" && x.trim() !== ""),
        en: bio.en.filter((x): x is string => typeof x === "string" && x.trim() !== ""),
      },
      portrait: typeof b.portrait === "string" && b.portrait ? b.portrait : null,
    };

    updateSettingsRaw(input);
    revalidateTag("settings");
    return NextResponse.json({ ok: true });
  } catch (message) {
    return NextResponse.json({ error: String(message) }, { status: 422 });
  }
}
