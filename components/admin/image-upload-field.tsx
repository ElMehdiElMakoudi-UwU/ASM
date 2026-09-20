"use client";

import { useRef, useState } from "react";

export function ImageUploadField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string | null;
  onChange: (path: string | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);

    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: form });
    const data = await res.json();

    setUploading(false);
    if (!res.ok) {
      setError(data.error ?? "Échec de l'envoi");
      return;
    }
    onChange(data.path);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-[0.85rem] text-graphite">{label}</span>
      {value && (
        <div className="relative h-32 w-32 overflow-hidden border border-rule bg-paper-dim">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className="h-full w-full object-cover" />
        </div>
      )}
      <div className="flex items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={onFileChange}
          disabled={uploading}
          className="text-[0.85rem]"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-[0.8rem] text-graphite hover:text-ink"
          >
            Retirer
          </button>
        )}
      </div>
      {uploading && <span className="text-[0.8rem] text-graphite">Envoi…</span>}
      {error && <span className="text-[0.8rem] text-alert">{error}</span>}
    </div>
  );
}
