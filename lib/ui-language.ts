export type UiLanguage = "nl" | "en";

export function getUiLanguage(value?: string | null): UiLanguage {
  return value === "en" ? "en" : "nl";
}

export function isEnglishUi(value?: string | null): boolean {
  return getUiLanguage(value) === "en";
}
