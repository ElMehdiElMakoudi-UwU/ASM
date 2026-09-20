"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin");
      router.refresh();
      return;
    }

    setSubmitting(false);
    setError(
      res.status === 429
        ? "Trop de tentatives. Réessayez dans une minute."
        : "Mot de passe incorrect.",
    );
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center px-5">
      <h1 className="text-[1.5rem]">Backoffice ASM</h1>
      <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4">
        <label className="flex flex-col gap-2">
          <span className="text-[0.85rem] text-graphite">Mot de passe</span>
          <input
            type="password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-rule bg-paper px-3 py-2 text-[0.95rem] outline-none focus:border-ink"
          />
        </label>
        {error && <p className="text-[0.85rem] text-alert">{error}</p>}
        <button
          type="submit"
          disabled={submitting || !password}
          className="btn btn-ink mt-2 justify-center disabled:opacity-50"
        >
          {submitting ? "Connexion…" : "Se connecter"}
        </button>
      </form>
    </div>
  );
}
