import { CVData } from "@/lib/cv";
import { getResumeLanguage, ResumeLanguage } from "@/lib/resume-language";

export function getEditorBasePath(language: ResumeLanguage): string {
  return language === "en" ? "/en/editor" : "/editor";
}

export function getTemplatesPathForLanguage(language: ResumeLanguage): string {
  return language === "en" ? "/en/templates" : "/templates";
}

export function getEditorPathForLanguage(language: ResumeLanguage, cvId?: string): string {
  const basePath = getEditorBasePath(language);
  return cvId ? `${basePath}?id=${encodeURIComponent(cvId)}` : basePath;
}

export function getEditorPathForCv(dataOrLanguage?: CVData | ResumeLanguage | null, cvId?: string): string {
  return getEditorPathForLanguage(getResumeLanguage(dataOrLanguage), cvId);
}

export function getSuccessPathForLanguage(language: ResumeLanguage, cvId?: string): string {
  const params = new URLSearchParams();
  params.set("lang", language);
  if (cvId) {
    params.set("cvId", cvId);
  }
  return `/success?${params.toString()}`;
}
