import { getSettingsRaw } from "@/lib/db/settings";
import { SettingsForm } from "@/components/admin/settings-form";

export default function AdminSettingsPage() {
  const settings = getSettingsRaw();

  return (
    <div>
      <h1 className="text-[1.5rem]">Informations de l'atelier</h1>
      <div className="mt-8">
        <SettingsForm initialSettings={settings} />
      </div>
    </div>
  );
}
