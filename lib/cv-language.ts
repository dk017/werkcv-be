export type ResumeLanguage = "nl" | "en";

const DUTCH_MARKERS = [" de ", " het ", " een ", " en ", " van ", " voor ", " met ", " op ", " ik ", " je "];
const ENGLISH_MARKERS = [" the ", " and ", " a ", " an ", " of ", " for ", " with ", " to ", " in ", " you "];

function countMarkers(source: string, markers: string[]): number {
  return markers.reduce((acc, marker) => acc + (source.split(marker).length - 1), 0);
}

export function detectLanguageFromText(text: string): ResumeLanguage | "unknown" {
  const normalized = ` ${text.toLowerCase()} `;
  const dutchScore = countMarkers(normalized, DUTCH_MARKERS);
  const englishScore = countMarkers(normalized, ENGLISH_MARKERS);

  if (dutchScore === 0 && englishScore === 0) return "unknown";
  return dutchScore >= englishScore ? "nl" : "en";
}

export function detectResumeLanguage(text: string, fallback: ResumeLanguage = "nl"): ResumeLanguage {
  const detected = detectLanguageFromText(text);
  return detected === "unknown" ? fallback : detected;
}
