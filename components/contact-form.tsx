"use client";

import { useState } from "react";
import { dict } from "@/content/dictionary";
import type { Locale } from "@/lib/i18n";

type Status = "idle" | "sending" | "sent" | "error";
type Errors = Partial<Record<"name" | "email" | "message", string>>;

export function ContactForm({ locale }: { locale: Locale }) {
  const c = dict.contact;
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const payload = {
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      phone: String(data.get("phone") ?? "").trim(),
      subject: String(data.get("subject") ?? "").trim(),
      message: String(data.get("message") ?? "").trim(),
      // Spam trap: real people leave this empty.
      company: String(data.get("company") ?? ""),
      locale,
    };

    const next: Errors = {};
    if (payload.name.length < 2) next.name = c.errorName[locale];
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(payload.email)) next.email = c.errorEmail[locale];
    if (payload.message.length < 10) next.message = c.errorMessage[locale];
    setErrors(next);
    if (Object.keys(next).length > 0) {
      form.querySelector<HTMLElement>(`[name="${Object.keys(next)[0]}"]`)?.focus();
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="border-t border-ink pt-8" role="status">
        <p className="display display-md">{c.success[locale]}</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="label link-underline mt-8 label-ink"
        >
          {c.formTitle[locale]}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-8">
      <div className="grid gap-8 sm:grid-cols-2">
        <Field
          name="name"
          label={c.name[locale]}
          autoComplete="name"
          required
          error={errors.name}
        />
        <Field
          name="email"
          type="email"
          label={c.email[locale]}
          autoComplete="email"
          required
          error={errors.email}
        />
        <Field
          name="phone"
          type="tel"
          label={`${c.phone[locale]} (${c.phoneOptional[locale]})`}
          autoComplete="tel"
        />
        <label className="block">
          <span className="label">{c.subject[locale]}</span>
          <select
            name="subject"
            defaultValue={c.subjectOptions[locale][0]}
            className="mt-3 w-full appearance-none border-b border-rule bg-transparent pb-3 text-[1rem] focus:border-ink"
          >
            {c.subjectOptions[locale].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block">
        <span className="label">{c.message[locale]}</span>
        <textarea
          name="message"
          rows={5}
          required
          placeholder={c.messagePlaceholder[locale]}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "err-message" : undefined}
          className="mt-3 w-full resize-y border-b border-rule bg-transparent pb-3 text-[1rem] placeholder:text-graphite-light focus:border-ink"
        />
        {errors.message && (
          <span id="err-message" className="label mt-2 block text-alert">
            {errors.message}
          </span>
        )}
      </label>

      {/* Not shown to people; catches automated submissions. */}
      <div className="absolute h-px w-px overflow-hidden opacity-0" aria-hidden="true">
        <label>
          Company
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-6 pt-2">
        <button type="submit" className="btn btn-solid" disabled={status === "sending"}>
          {status === "sending" ? c.sending[locale] : c.send[locale]}
        </button>
        {status === "error" && (
          <p className="label max-w-xs text-alert" role="alert">
            {c.errorGeneric[locale]}
          </p>
        )}
      </div>
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  required = false,
  autoComplete,
  error,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      <input
        type={type}
        name={name}
        required={required}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `err-${name}` : undefined}
        className="mt-3 w-full border-b border-rule bg-transparent pb-3 text-[1rem] focus:border-ink"
      />
      {error && (
        <span id={`err-${name}`} className="label mt-2 block text-alert">
          {error}
        </span>
      )}
    </label>
  );
}
