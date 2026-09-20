import { ProjectForm } from "@/components/admin/project-form";

export default function NewProjectPage() {
  return (
    <div>
      <h1 className="text-[1.5rem]">Nouveau projet</h1>
      <div className="mt-8">
        <ProjectForm isNew />
      </div>
    </div>
  );
}
