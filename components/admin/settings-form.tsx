"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { SiteSettings } from "@/lib/db/settings";
import { ImageUploadField } from "@/components/admin/image-upload-field";

export function SettingsForm({ initialSettings }: { initialSettings: SiteSettings }) {
  const router = useRouter();
  const [settings, setSettings] = useState(initialSettings);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function set<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setSettings((s) => ({ ...s, [key]: value }));
    setSaved(false);
  }

  function setI18n(key: "street" | "postalCity", lang: "fr" | "en", value: string) {
    set(key, { ...settings[key], [lang]: value });
  }

  function setBio(lang: "fr" | "en", index: number, value: string) {
    const next = [...settings.bio[lang]];
    next[index] = value;
    set("bio", { ...settings.bio, [lang]: next });
  }

  function addBioParagraph(lang: "fr" | "en") {
    set("bio", { ...settings.bio, [lang]: [...settings.bio[lang], ""] });
  }

  function removeBioParagraph(lang: "fr" | "en", index: number) {
    set("bio", { ...settings.bio, [lang]: settings.bio[lang].filter((_, i) => i !== index) });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      ...settings,
      bio: {
        fr: settings.bio.fr.filter((s) => s.trim() !== ""),
        en: settings.bio.en.filter((s) => s.trim() !== ""),
      },
    };

    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    setSaving(false);
    if (!res.ok) {
      setError(data.error ?? "Échec de l'enregistrement");
      return;
    }
    setSaved(true);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-10 pb-20">
      <Section title="Identité">
        <Field label="Nom complet de l'atelier">
          <input value={settings.fullName} onChange={(e) => set("fullName", e.target.value)} className="input" />
        </Field>
        <Field label="Nom de l'architecte fondateur">
          <input value={settings.founder} onChange={(e) => set("founder", e.target.value)} className="input" />
        </Field>
        <ImageUploadField label="Portrait" value={settings.portrait} onChange={(v) => set("portrait", v)} />
      </Section>

      <Section title="Coordonnées">
        <Field label="Ville">
          <input value={settings.city} onChange={(e) => set("city", e.target.value)} className="input" />
        </Field>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Adresse (français) — laisser vide pour la masquer">
            <input value={settings.street.fr} onChange={(e) => setI18n("street", "fr", e.target.value)} className="input" />
          </Field>
          <Field label="Adresse (anglais)">
            <input value={settings.street.en} onChange={(e) => setI18n("street", "en", e.target.value)} className="input" />
          </Field>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Ville affichée (français)">
            <input value={settings.postalCity.fr} onChange={(e) => setI18n("postalCity", "fr", e.target.value)} className="input" />
          </Field>
          <Field label="Ville affichée (anglais)">
            <input value={settings.postalCity.en} onChange={(e) => setI18n("postalCity", "en", e.target.value)} className="input" />
          </Field>
        </div>
        <Field label="Téléphone affiché">
          <input value={settings.phoneDisplay} onChange={(e) => set("phoneDisplay", e.target.value)} className="input" />
        </Field>
        <Field label="Téléphone (lien tel:, sans espaces)">
          <input value={settings.phoneHref} onChange={(e) => set("phoneHref", e.target.value)} className="input" />
        </Field>
        <Field label="WhatsApp affiché">
          <input value={settings.whatsappDisplay} onChange={(e) => set("whatsappDisplay", e.target.value)} className="input" />
        </Field>
        <Field label="WhatsApp (numéro, avec indicatif, sans +)">
          <input value={settings.whatsappNumber} onChange={(e) => set("whatsappNumber", e.target.value)} className="input" />
        </Field>
        <Field label="E-mail">
          <input type="email" value={settings.email} onChange={(e) => set("email", e.target.value)} className="input" />
        </Field>
        <Field label="Coordonnées géographiques affichées">
          <input value={settings.coordinates} onChange={(e) => set("coordinates", e.target.value)} className="input" />
        </Field>
        <Field label="Requête Google Maps">
          <input value={settings.mapQuery} onChange={(e) => set("mapQuery", e.target.value)} className="input" />
        </Field>
      </Section>

      <Section title="Réseaux et registre professionnel">
        <Field label="Instagram (URL complète)">
          <input
            value={settings.social.instagram}
            onChange={(e) => set("social", { ...settings.social, instagram: e.target.value })}
            className="input"
          />
        </Field>
        <Field label="LinkedIn (URL complète)">
          <input
            value={settings.social.linkedin}
            onChange={(e) => set("social", { ...settings.social, linkedin: e.target.value })}
            className="input"
          />
        </Field>
        <Field label="Numéro à l'Ordre National des Architectes">
          <input value={settings.ordreNumber} onChange={(e) => set("ordreNumber", e.target.value)} className="input" />
        </Field>
      </Section>

      <Section title="Biographie (page « L'atelier »)">
        <div className="grid gap-8 md:grid-cols-2">
          {(["fr", "en"] as const).map((lang) => (
            <div key={lang} className="flex flex-col gap-3">
              <span className="text-[0.8rem] uppercase text-graphite">{lang === "fr" ? "Français" : "English"}</span>
              {settings.bio[lang].map((paragraph, i) => (
                <div key={i} className="flex gap-2">
                  <textarea
                    value={paragraph}
                    onChange={(e) => setBio(lang, i, e.target.value)}
                    className="input min-h-24 flex-1"
                  />
                  <button type="button" onClick={() => removeBioParagraph(lang, i)} className="text-graphite hover:text-alert">
                    ✕
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => addBioParagraph(lang)} className="self-start text-[0.85rem] text-graphite hover:text-ink">
                + Ajouter un paragraphe
              </button>
            </div>
          ))}
        </div>
      </Section>

      {error && <p className="text-[0.9rem] text-alert">{error}</p>}
      {saved && <p className="text-[0.9rem] text-graphite">Enregistré.</p>}

      <div className="flex gap-4">
        <button type="submit" disabled={saving} className="btn btn-ink disabled:opacity-50">
          {saving ? "Enregistrement…" : "Enregistrer"}
        </button>
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="flex flex-col gap-5 border-t border-rule pt-6">
      <legend className="mb-1 text-[0.8rem] uppercase tracking-[0.14em] text-graphite">{title}</legend>
      {children}
    </fieldset>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[0.85rem] text-graphite">{label}</span>
      {children}
    </label>
  );
}
