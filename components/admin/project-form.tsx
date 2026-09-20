"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { categories, type Category, type GalleryItem, type Project } from "@/content/projects";
import { ImageUploadField } from "@/components/admin/image-upload-field";

const emptyProject: Project = {
  slug: "",
  ref: "",
  title: "",
  category: "equipment",
  programme: { fr: "", en: "" },
  location: { fr: "", en: "" },
  year: "",
  frame: { fr: "", en: "" },
  role: { fr: "", en: "" },
  summary: { fr: "", en: "" },
  body: { fr: [""], en: [""] },
  cover: null,
  gallery: [],
  featured: false,
};

const categoryLabelsFr: Record<Category, string> = {
  equipment: "Équipement public",
  lodging: "Hébergement",
  urban: "Urbain et infrastructure",
  reuse: "Réhabilitation",
};

export function ProjectForm({
  initialProject,
  isNew,
}: {
  initialProject?: Project;
  isNew: boolean;
}) {
  const router = useRouter();
  const [project, setProject] = useState<Project>(initialProject ?? emptyProject);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof Project>(key: K, value: Project[K]) {
    setProject((p) => ({ ...p, [key]: value }));
  }

  function setI18n(key: "programme" | "location" | "frame" | "role" | "summary", lang: "fr" | "en", value: string) {
    setProject((p) => ({ ...p, [key]: { ...p[key], [lang]: value } }));
  }

  function setBodyParagraph(lang: "fr" | "en", index: number, value: string) {
    setProject((p) => {
      const next = [...p.body[lang]];
      next[index] = value;
      return { ...p, body: { ...p.body, [lang]: next } };
    });
  }

  function addBodyParagraph(lang: "fr" | "en") {
    setProject((p) => ({ ...p, body: { ...p.body, [lang]: [...p.body[lang], ""] } }));
  }

  function removeBodyParagraph(lang: "fr" | "en", index: number) {
    setProject((p) => ({
      ...p,
      body: { ...p.body, [lang]: p.body[lang].filter((_, i) => i !== index) },
    }));
  }

  function updateGalleryItem(index: number, patch: Partial<GalleryItem>) {
    setProject((p) => {
      const next = [...p.gallery];
      next[index] = { ...next[index], ...patch };
      return { ...p, gallery: next };
    });
  }

  function addGalleryItem() {
    setProject((p) => ({
      ...p,
      gallery: [...p.gallery, { src: null, shape: "wide", caption: { fr: "", en: "" } }],
    }));
  }

  function removeGalleryItem(index: number) {
    setProject((p) => ({ ...p, gallery: p.gallery.filter((_, i) => i !== index) }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      ...project,
      body: {
        fr: project.body.fr.filter((s) => s.trim() !== ""),
        en: project.body.en.filter((s) => s.trim() !== ""),
      },
    };

    const res = await fetch(
      isNew ? "/api/admin/projects" : `/api/admin/projects/${initialProject!.slug}`,
      {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
    const data = await res.json();

    setSaving(false);
    if (!res.ok) {
      setError(data.error ?? "Échec de l'enregistrement");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-10 pb-20">
      <Section title="Identité">
        <Field label="Identifiant (slug — utilisé dans l'URL)">
          <input
            required
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            value={project.slug}
            onChange={(e) => set("slug", e.target.value)}
            className="input"
            placeholder="le-stade"
          />
        </Field>
        <Field label="Référence (numéro d'ordre)">
          <input
            required
            value={project.ref}
            onChange={(e) => set("ref", e.target.value)}
            className="input"
            placeholder="01"
          />
        </Field>
        <Field label="Titre">
          <input
            required
            value={project.title}
            onChange={(e) => set("title", e.target.value)}
            className="input"
          />
        </Field>
        <Field label="Catégorie">
          <select
            value={project.category}
            onChange={(e) => set("category", e.target.value as Category)}
            className="input"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {categoryLabelsFr[c]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Année">
          <input
            required
            value={project.year}
            onChange={(e) => set("year", e.target.value)}
            className="input"
          />
        </Field>
        <label className="flex items-center gap-2 text-[0.9rem]">
          <input
            type="checkbox"
            checked={project.featured}
            onChange={(e) => set("featured", e.target.checked)}
          />
          Mettre en avant sur la page d'accueil
        </label>
      </Section>

      <Section title="Fiche (bilingue)">
        <BilingualField label="Programme" value={project.programme} onChange={(l, v) => setI18n("programme", l, v)} />
        <BilingualField label="Localisation" value={project.location} onChange={(l, v) => setI18n("location", l, v)} />
        <BilingualField label="Cadre (thèse, atelier, stage…)" value={project.frame} onChange={(l, v) => setI18n("frame", l, v)} />
        <BilingualField label="Rôle" value={project.role} onChange={(l, v) => setI18n("role", l, v)} />
      </Section>

      <Section title="Résumé (bilingue)">
        <BilingualField label="Résumé" value={project.summary} onChange={(l, v) => setI18n("summary", l, v)} textarea />
      </Section>

      <Section title="Texte du projet (bilingue)">
        <div className="grid gap-8 md:grid-cols-2">
          {(["fr", "en"] as const).map((lang) => (
            <div key={lang} className="flex flex-col gap-3">
              <span className="text-[0.8rem] uppercase text-graphite">{lang === "fr" ? "Français" : "English"}</span>
              {project.body[lang].map((paragraph, i) => (
                <div key={i} className="flex gap-2">
                  <textarea
                    value={paragraph}
                    onChange={(e) => setBodyParagraph(lang, i, e.target.value)}
                    className="input min-h-24 flex-1"
                  />
                  <button type="button" onClick={() => removeBodyParagraph(lang, i)} className="text-graphite hover:text-alert">
                    ✕
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => addBodyParagraph(lang)} className="self-start text-[0.85rem] text-graphite hover:text-ink">
                + Ajouter un paragraphe
              </button>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Photographie">
        <ImageUploadField label="Image de couverture" value={project.cover} onChange={(v) => set("cover", v)} />

        <div className="flex flex-col gap-6">
          <span className="text-[0.85rem] text-graphite">Galerie</span>
          {project.gallery.map((item, i) => (
            <div key={i} className="flex flex-col gap-3 border border-rule p-4">
              <ImageUploadField
                label={`Image ${i + 1}`}
                value={item.src}
                onChange={(v) => updateGalleryItem(i, { src: v })}
              />
              <Field label="Format">
                <select
                  value={item.shape}
                  onChange={(e) => updateGalleryItem(i, { shape: e.target.value as "wide" | "tall" })}
                  className="input"
                >
                  <option value="wide">Pleine largeur</option>
                  <option value="tall">Demi-colonne</option>
                </select>
              </Field>
              <BilingualField
                label="Légende"
                value={item.caption}
                onChange={(l, v) => updateGalleryItem(i, { caption: { ...item.caption, [l]: v } })}
              />
              <button type="button" onClick={() => removeGalleryItem(i)} className="self-start text-[0.85rem] text-alert hover:underline">
                Retirer cette image
              </button>
            </div>
          ))}
          <button type="button" onClick={addGalleryItem} className="self-start text-[0.85rem] text-graphite hover:text-ink">
            + Ajouter une image à la galerie
          </button>
        </div>
      </Section>

      {error && <p className="text-[0.9rem] text-alert">{error}</p>}

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

function BilingualField({
  label,
  value,
  onChange,
  textarea = false,
}: {
  label: string;
  value: { fr: string; en: string };
  onChange: (lang: "fr" | "en", value: string) => void;
  textarea?: boolean;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {(["fr", "en"] as const).map((lang) => (
        <Field key={lang} label={`${label} (${lang === "fr" ? "français" : "anglais"})`}>
          {textarea ? (
            <textarea
              value={value[lang]}
              onChange={(e) => onChange(lang, e.target.value)}
              className="input min-h-20"
            />
          ) : (
            <input value={value[lang]} onChange={(e) => onChange(lang, e.target.value)} className="input" />
          )}
        </Field>
      ))}
    </div>
  );
}
