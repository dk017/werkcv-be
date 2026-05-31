import { CVData } from "@/lib/cv";
import { getResumeLanguage, ResumeLanguage } from "@/lib/resume-language";

export function getEditorBasePath(_language: ResumeLanguage): string {
  return "/editor";
}

export function getTemplatesPathForLanguage(_language: ResumeLanguage): string {
  return "/templates";
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
