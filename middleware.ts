import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import { defaultLocale, isLocale, locales } from "@/lib/i18n";

/** Every page lives under /fr or /en. Anything else is sent to a locale. */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // The admin area is a separate, unlocalised tool: it never gets a locale
  // prefix, and every page except the login form requires a valid session.
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") return NextResponse.next();
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    if (!(await verifySessionToken(token))) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return NextResponse.next();
  }

  const first = pathname.split("/")[1];
  if (isLocale(first)) return NextResponse.next();

  const preferred =
    locales.find((locale) =>
      request.headers.get("accept-language")?.toLowerCase().startsWith(locale),
    ) ?? defaultLocale;

  const url = request.nextUrl.clone();
  url.pathname = `/${preferred}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
