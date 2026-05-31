"use client";

import { FormEvent, useState } from "react";
import { getStoredAttribution, track } from "@/lib/analytics";
import { siteConfig } from "@/config/site";
import { contactSubjectOptions, type ContactSubjectValue } from "@/lib/contact";

type FormState = {
  name: string;
  email: string;
  subject: ContactSubjectValue | "";
  message: string;
  website: string;
};

type FieldErrors = Partial<Record<keyof FormState | "form", string[]>>;

const initialState: FormState = {
  name: "",
  email: "",
  subject: "",
  message: "",
  website: "",
};

function getErrorMessage(fieldErrors: FieldErrors, field: keyof FormState | "form") {
  return fieldErrors[field]?.[0] || "";
}

export default function ContactForm() {
  const [formState, setFormState] = useState<FormState>(initialState);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasTrackedStart, setHasTrackedStart] = useState(false);

  const handleFieldFocus = () => {
    if (hasTrackedStart) return;
    track("contact_form_started", { path: "/contact" });
    setHasTrackedStart(true);
  };

  const handleChange = (field: keyof FormState, value: string) => {
    setFormState((current) => ({ ...current, [field]: value as FormState[keyof FormState] }));

    if (fieldErrors[field]) {
      setFieldErrors((current) => ({ ...current, [field]: undefined }));
    }
    if (fieldErrors.form) {
      setFieldErrors((current) => ({ ...current, form: undefined }));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setIsSuccess(false);
    setFieldErrors({});

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formState,
          pagePath: "/contact",
          attribution: getStoredAttribution(),
        }),
      });

      const result = (await response.json().catch(() => ({}))) as {
        error?: string;
        fieldErrors?: FieldErrors;
      };

      if (!response.ok) {
        const reason = result.error || "Verzenden mislukt.";
        setFieldErrors(result.fieldErrors || { form: [reason] });
        track("contact_form_failed", { path: "/contact", reason });
        return;
      }

      setFormState(initialState);
      setFieldErrors({});
      setIsSuccess(true);
      track("contact_form_submitted", { path: "/contact", subject: formState.subject || "other" });
    } catch {
      const reason = "Netwerkfout. Probeer het opnieuw.";
      setFieldErrors({ form: [reason] });
      track("contact_form_failed", { path: "/contact", reason });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border-4 border-black p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
      <div className="mb-6">
        <h2 className="text-2xl font-black mb-2">Stuur een bericht</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          Gebruik het formulier hieronder voor support, feedback of samenwerkingen. Liever direct
          mailen? Dat kan ook via <a href={`mailto:${siteConfig.contactEmail}`} className="font-bold underline underline-offset-2">{siteConfig.contactEmail}</a>.
        </p>
      </div>

      {isSuccess ? (
        <div className="mb-4 border-2 border-black bg-emerald-200 p-4 text-sm font-bold text-black">
          Bericht ontvangen. We reageren doorgaans binnen 1 tot 2 werkdagen.
        </div>
      ) : null}

      {getErrorMessage(fieldErrors, "form") ? (
        <div className="mb-4 border-2 border-black bg-rose-200 p-4 text-sm font-bold text-black">
          {getErrorMessage(fieldErrors, "form")}
        </div>
      ) : null}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          type="text"
          name="website"
          value={formState.website}
          onChange={(event) => handleChange("website", event.target.value)}
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden="true"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-black text-black">Naam</span>
            <input
              type="text"
              required
              value={formState.name}
              onFocus={handleFieldFocus}
              onChange={(event) => handleChange("name", event.target.value)}
              className="w-full border-2 border-black bg-[#FFFEF0] px-4 py-3 text-sm font-medium text-black outline-none transition-colors focus:bg-white"
              placeholder="Jouw naam"
            />
            {getErrorMessage(fieldErrors, "name") ? (
              <span className="mt-2 block text-xs font-bold text-red-700">
                {getErrorMessage(fieldErrors, "name")}
              </span>
            ) : null}
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-black text-black">E-mail</span>
            <input
              type="email"
              required
              value={formState.email}
              onFocus={handleFieldFocus}
              onChange={(event) => handleChange("email", event.target.value)}
              className="w-full border-2 border-black bg-[#FFFEF0] px-4 py-3 text-sm font-medium text-black outline-none transition-colors focus:bg-white"
              placeholder="naam@voorbeeld.nl"
            />
            {getErrorMessage(fieldErrors, "email") ? (
              <span className="mt-2 block text-xs font-bold text-red-700">
                {getErrorMessage(fieldErrors, "email")}
              </span>
            ) : null}
          </label>
        </div>

        <label className="block">
          <span className="mb-2 block text-sm font-black text-black">Onderwerp</span>
          <select
            required
            value={formState.subject}
            onFocus={handleFieldFocus}
            onChange={(event) => handleChange("subject", event.target.value)}
            className="w-full border-2 border-black bg-[#FFFEF0] px-4 py-3 text-sm font-medium text-black outline-none transition-colors focus:bg-white"
          >
            <option value="">Kies een onderwerp</option>
            {contactSubjectOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {getErrorMessage(fieldErrors, "subject") ? (
            <span className="mt-2 block text-xs font-bold text-red-700">
              {getErrorMessage(fieldErrors, "subject")}
            </span>
          ) : null}
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-black text-black">Bericht</span>
          <textarea
            required
            rows={7}
            value={formState.message}
            onFocus={handleFieldFocus}
            onChange={(event) => handleChange("message", event.target.value)}
            className="w-full border-2 border-black bg-[#FFFEF0] px-4 py-3 text-sm font-medium text-black outline-none transition-colors focus:bg-white"
            placeholder="Beschrijf je vraag, feedback of probleem zo concreet mogelijk."
          />
          {getErrorMessage(fieldErrors, "message") ? (
            <span className="mt-2 block text-xs font-bold text-red-700">
              {getErrorMessage(fieldErrors, "message")}
            </span>
          ) : null}
        </label>

        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-medium leading-relaxed text-gray-600">
            Geen nieuwsbriefinschrijving of automatische salesreeks. Alleen een normaal antwoord op
            je bericht.
          </p>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center border-4 border-black bg-[#4ECDC4] px-6 py-3 text-base font-black text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
          >
            {isSubmitting ? "Bezig..." : "Verstuur bericht"}
          </button>
        </div>
      </form>
    </div>
  );
}
