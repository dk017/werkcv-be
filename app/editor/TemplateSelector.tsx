"use client";
/* eslint-disable react-hooks/static-components */

import { useState } from "react";
import { templateList, getThemeById } from "@/lib/templates/registry";
import { TemplateConfig } from "@/lib/templates";
import { getTemplateComponent } from "@/app/editor/templates";
import { sampleCV } from "@/lib/cv";
import { LinkTextProvider } from "@/app/editor/templates/link-utils";
import { UiLanguage } from "@/lib/ui-language";

interface TemplateSelectorProps {
  currentTemplateId: string;
  onSelectTemplate: (templateId: string, defaultThemeId: string) => void;
  uiLanguage?: UiLanguage;
}

export default function TemplateSelector({
  currentTemplateId,
  onSelectTemplate,
  uiLanguage = "nl",
}: TemplateSelectorProps) {
  const isEnglish = uiLanguage === "en";
  const [isOpen, setIsOpen] = useState(false);

  const currentTemplate = templateList.find((template) => template.id === currentTemplateId);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700 transition hover:bg-gray-200"
      >
        <svg className="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
          />
        </svg>
        <span className="hidden sm:inline">
          {isEnglish
            ? currentTemplate?.name || "Template"
            : currentTemplate?.nameDutch || "Template"}
        </span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsOpen(false)} />

          <div className="relative flex max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 className="text-xl font-bold text-gray-900">
                {isEnglish ? "Choose a template" : "Kies een template"}
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-2 transition hover:bg-gray-100"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {templateList.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    uiLanguage={uiLanguage}
                    isSelected={template.id === currentTemplateId}
                    onSelect={() => {
                      onSelectTemplate(template.id, template.defaultThemeId);
                      setIsOpen(false);
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function TemplateCard({
  template,
  uiLanguage,
  isSelected,
  onSelect,
}: {
  template: TemplateConfig;
  uiLanguage: UiLanguage;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const TemplateComponent = getTemplateComponent(template.id);
  const theme = getThemeById(template.defaultThemeId);

  return (
    <button
      onClick={onSelect}
      className={`rounded-xl border-2 p-3 text-left transition-all hover:shadow-md ${
        isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
      }`}
    >
      <div className="mb-2 flex h-[200px] items-start justify-center overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
        <div style={{ zoom: 0.22, pointerEvents: "none", flexShrink: 0 }}>
          <LinkTextProvider disableAnchors>
            <TemplateComponent data={sampleCV} theme={theme} nameTag="div" />
          </LinkTextProvider>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-900">
          {uiLanguage === "en" ? template.name : template.nameDutch}
        </span>
        {isSelected && (
          <svg className="h-4 w-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>
    </button>
  );
}
