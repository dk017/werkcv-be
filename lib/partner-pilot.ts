import { AttributionSnapshot } from "@/lib/attribution";

export interface ResolvedPartnerPilot {
  source: string;
  durationDays: number;
  notes: string;
}

function parseDateEnv(value?: string): Date | null {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function isSourceMatch(attribution: AttributionSnapshot | null, source: string): boolean {
  return (attribution?.utmSource || "").trim().toLowerCase() === source;
}

function isWindowActive(now: Date, startAt: Date | null, endAt: Date | null): boolean {
  if (startAt && now < startAt) return false;
  if (endAt && now > endAt) return false;
  return true;
}

function resolveLamatuPilot(now: Date): ResolvedPartnerPilot | null {
  if (process.env.LAMATU_PILOT_ENABLED === "false") return null;

  const startAt = parseDateEnv(process.env.LAMATU_PILOT_START_AT);
  const endAt = parseDateEnv(process.env.LAMATU_PILOT_END_AT);
  if (!isWindowActive(now, startAt, endAt)) return null;

  const configuredDays = Number(process.env.LAMATU_PILOT_DAYS || "30");
  const durationDays = Number.isFinite(configuredDays) && configuredDays > 0 ? Math.floor(configuredDays) : 30;

  return {
    source: "lamatu",
    durationDays,
    notes: `LaMatu pilot (${durationDays}d)`,
  };
}

export function resolvePartnerPilotForSignup(
  attribution: AttributionSnapshot | null,
  now: Date = new Date()
): ResolvedPartnerPilot | null {
  const lamatuPilot = resolveLamatuPilot(now);
  if (lamatuPilot && isSourceMatch(attribution, lamatuPilot.source)) {
    return lamatuPilot;
  }

  return null;
}

