"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Project } from "@/content/projects";

export function AdminProjectList({ initialProjects }: { initialProjects: Project[] }) {
  const router = useRouter();
  const [projects, setProjects] = useState(initialProjects);
  const [busy, setBusy] = useState<string | null>(null);

  async function reorder(next: Project[]) {
    setProjects(next);
    setBusy("reorder");
    await fetch("/api/admin/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reorder: next.map((p) => p.slug) }),
    });
    setBusy(null);
    router.refresh();
  }

  function move(slug: string, direction: -1 | 1) {
    const index = projects.findIndex((p) => p.slug === slug);
    const target = index + direction;
    if (target < 0 || target >= projects.length) return;
    const next = [...projects];
    [next[index], next[target]] = [next[target], next[index]];
    reorder(next);
  }

  async function remove(slug: string, title: string) {
    if (!confirm(`Supprimer « ${title} » ? Cette action est définitive.`)) return;
    setBusy(slug);
    const res = await fetch(`/api/admin/projects/${slug}`, { method: "DELETE" });
    if (res.ok) {
      setProjects((prev) => prev.filter((p) => p.slug !== slug));
      router.refresh();
    }
    setBusy(null);
  }

  if (projects.length === 0) {
    return <p className="text-[0.9rem] text-graphite">Aucun projet pour le moment.</p>;
  }

  return (
    <table className="w-full border-collapse text-[0.9rem]">
      <thead>
        <tr className="border-b border-rule text-left text-[0.8rem] text-graphite">
          <th className="w-16 py-2"></th>
          <th className="py-2">Titre</th>
          <th className="py-2">Catégorie</th>
          <th className="py-2">Mis en avant</th>
          <th className="py-2"></th>
        </tr>
      </thead>
      <tbody>
        {projects.map((project, i) => (
          <tr key={project.slug} className="border-b border-rule">
            <td className="py-3">
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => move(project.slug, -1)}
                  disabled={i === 0 || busy !== null}
                  className="disabled:opacity-30"
                  aria-label="Monter"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => move(project.slug, 1)}
                  disabled={i === projects.length - 1 || busy !== null}
                  className="disabled:opacity-30"
                  aria-label="Descendre"
                >
                  ↓
                </button>
              </div>
            </td>
            <td className="py-3">
              <Link href={`/admin/projects/${project.slug}/edit`} className="hover:underline">
                {project.title}
              </Link>
            </td>
            <td className="py-3 text-graphite">{project.category}</td>
            <td className="py-3 text-graphite">{project.featured ? "Oui" : "—"}</td>
            <td className="py-3 text-right">
              <button
                type="button"
                onClick={() => remove(project.slug, project.title)}
                disabled={busy !== null}
                className="text-alert hover:underline disabled:opacity-50"
              >
                Supprimer
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
