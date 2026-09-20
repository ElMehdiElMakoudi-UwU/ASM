import { Archivo, IBM_Plex_Mono } from "next/font/google";
import "../globals.css";
import { AdminNav } from "@/components/admin/admin-nav";

export const metadata = {
  title: "Backoffice — ASM",
  robots: { index: false, follow: false },
};

const sans = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

/**
 * A separate root layout: /admin is an internal tool, not part of the
 * bilingual public site, so it isn't nested under app/[locale]/layout.tsx.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${sans.variable} ${mono.variable}`}>
      <body className="min-h-dvh bg-paper text-ink antialiased">
        <AdminNav />
        <main className="mx-auto max-w-5xl px-5 py-10">{children}</main>
      </body>
    </html>
  );
}
