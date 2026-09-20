"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  if (pathname === "/admin/login") return null;

  async function logout() {
    setLoggingOut(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const links = [
    { href: "/admin", label: "Projets" },
    { href: "/admin/settings", label: "Informations" },
  ];

  return (
    <header className="border-b border-rule bg-paper">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-6 px-5 py-4">
        <nav className="flex items-center gap-6">
          <span className="text-[0.8rem] uppercase tracking-[0.18em] text-graphite">
            Backoffice ASM
          </span>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-[0.9rem] ${
                pathname === link.href ? "font-medium text-ink" : "text-graphite hover:text-ink"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          onClick={logout}
          disabled={loggingOut}
          className="text-[0.85rem] text-graphite hover:text-ink disabled:opacity-50"
        >
          Se déconnecter
        </button>
      </div>
    </header>
  );
}
