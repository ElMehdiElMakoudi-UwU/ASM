import Link from "next/link";
import { listProjectsRaw } from "@/lib/db/projects";
import { AdminProjectList } from "@/components/admin/admin-project-list";

export default async function AdminDashboardPage() {
  const projects = listProjectsRaw();

  return (
    <div>
      <div className="flex items-center justify-between gap-6">
        <h1 className="text-[1.5rem]">Projets</h1>
        <Link href="/admin/projects/new" className="btn btn-ink">
          Nouveau projet
        </Link>
      </div>

      <p className="mt-2 text-[0.85rem] text-graphite">
        Glissez les flèches pour changer l'ordre d'affichage. Les changements
        apparaissent sur le site immédiatement.
      </p>

      <div className="mt-8">
        <AdminProjectList initialProjects={projects} />
      </div>
    </div>
  );
}
