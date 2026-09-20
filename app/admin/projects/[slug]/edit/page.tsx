import { notFound } from "next/navigation";
import { getProjectRaw } from "@/lib/db/projects";
import { ProjectForm } from "@/components/admin/project-form";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectRaw(slug);
  if (!project) notFound();

  return (
    <div>
      <h1 className="text-[1.5rem]">Modifier « {project.title} »</h1>
      <div className="mt-8">
        <ProjectForm initialProject={project} isNew={false} />
      </div>
    </div>
  );
}
