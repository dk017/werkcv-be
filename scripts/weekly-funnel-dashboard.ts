import "dotenv/config";
import { prisma } from "../lib/prisma";
import { sanitizeAttribution } from "../lib/attribution";

type FunnelRow = {
  landingPath: string;
  sessions: number;
  ctaClicks: number;
  toEditor: number;
  editorStarts: number;
  checkoutModalViews: number;
  checkoutModalClosed: number;
  checkoutClicks: number;
  checkoutStarted: number;
  checkoutFailed: number;
  checkoutCompleted: number;
  paidOrders: number;
};

const TRACKED_EVENTS = [
  "landing",
  "landing_cta_click",
  "landing_to_editor",
  "editor_started",
  "checkout_modal_viewed",
  "checkout_modal_closed",
  "checkout_start",
  "checkout_started",
  "checkout_failed",
  "checkout_completed",
  "paid",
] as const;

type TrackedEvent = typeof TRACKED_EVENTS[number];

function normalizeLandingPath(path: string | null | undefined): string | null {
  if (!path) return null;
  const trimmed = path.trim();
  if (!trimmed) return null;
  const normalized = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  if (normalized.startsWith("/editor") || normalized.startsWith("/api/")) return null;
  return normalized;
}

function readPropertyString(properties: unknown, key: string): string | null {
  if (!properties || typeof properties !== "object") return null;
  const value = (properties as Record<string, unknown>)[key];
  return typeof value === "string" ? value : null;
}

function resolveLandingPath(event: {
  event: string;
  path: string | null;
  properties: unknown;
  attribution: unknown;
}): string | null {
  const safeAttribution = sanitizeAttribution(event.attribution);
  const firstTouchPath = safeAttribution?.firstTouchPath || null;

  switch (event.event as TrackedEvent) {
    case "landing":
    case "landing_cta_click":
      return normalizeLandingPath(event.path);
    case "landing_to_editor":
      return (
        normalizeLandingPath(readPropertyString(event.properties, "fromPath")) ||
        normalizeLandingPath(firstTouchPath)
      );
    case "editor_started":
      return (
        normalizeLandingPath(readPropertyString(event.properties, "fromPath")) ||
        normalizeLandingPath(firstTouchPath)
      );
    case "checkout_modal_viewed":
    case "checkout_modal_closed":
    case "checkout_start":
    case "checkout_started":
    case "checkout_failed":
    case "checkout_completed":
    case "paid":
      return normalizeLandingPath(firstTouchPath);
    default:
      return null;
  }
}

function percent(part: number, whole: number): string {
  if (whole <= 0) return "0.00%";
  return `${((part / whole) * 100).toFixed(2)}%`;
}

async function main() {
  const daysArg = Number(process.argv[2]);
  const days = Number.isFinite(daysArg) && daysArg > 0 ? Math.floor(daysArg) : 7;
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const events = await prisma.analyticsEvent.findMany({
    where: {
      createdAt: { gte: since },
      event: { in: [...TRACKED_EVENTS] },
    },
    select: {
      event: true,
      path: true,
      cvId: true,
      orderId: true,
      properties: true,
      attribution: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const rows = new Map<string, FunnelRow>();
  const paidDedupe = new Set<string>();
  const completedDedupe = new Set<string>();

  for (const event of events) {
    const landingPath = resolveLandingPath(event);
    if (!landingPath) continue;

    const current = rows.get(landingPath) || {
      landingPath,
      sessions: 0,
      ctaClicks: 0,
      toEditor: 0,
      editorStarts: 0,
      checkoutModalViews: 0,
      checkoutModalClosed: 0,
      checkoutClicks: 0,
      checkoutStarted: 0,
      checkoutFailed: 0,
      checkoutCompleted: 0,
      paidOrders: 0,
    };

    switch (event.event as TrackedEvent) {
      case "landing":
        current.sessions += 1;
        break;
      case "landing_cta_click":
        current.ctaClicks += 1;
        break;
      case "landing_to_editor":
        current.toEditor += 1;
        break;
      case "editor_started":
        current.editorStarts += 1;
        break;
      case "checkout_modal_viewed":
        current.checkoutModalViews += 1;
        break;
      case "checkout_modal_closed":
        current.checkoutModalClosed += 1;
        break;
      case "checkout_start":
        current.checkoutClicks += 1;
        break;
      case "checkout_started":
        current.checkoutStarted += 1;
        break;
      case "checkout_failed":
        current.checkoutFailed += 1;
        break;
      case "checkout_completed": {
        const dedupeKey = event.orderId || `cv:${event.cvId || "unknown"}`;
        if (!completedDedupe.has(`${landingPath}:${dedupeKey}`)) {
          current.checkoutCompleted += 1;
          completedDedupe.add(`${landingPath}:${dedupeKey}`);
        }
        break;
      }
      case "paid": {
        const dedupeKey = event.orderId || `cv:${event.cvId || "unknown"}`;
        if (!paidDedupe.has(`${landingPath}:${dedupeKey}`)) {
          current.paidOrders += 1;
          paidDedupe.add(`${landingPath}:${dedupeKey}`);
        }
        break;
      }
      default:
        break;
    }

    rows.set(landingPath, current);
  }

  const sorted = [...rows.values()].sort((a, b) => b.sessions - a.sessions);

  console.log(`Weekly funnel baseline (last ${days} days)`);
  console.log(`Window start: ${since.toISOString()}`);
  console.log(`Tracked events read: ${events.length}`);
  console.log("");

  if (sorted.length === 0) {
    console.log("No funnel events found yet.");
    return;
  }

  const view = sorted.map((row) => ({
    landing: row.landingPath,
    sessions: row.sessions,
    cta_clicks: row.ctaClicks,
    cta_ctr: percent(row.ctaClicks, row.sessions),
    to_editor: row.toEditor,
    to_editor_rate: percent(row.toEditor, row.sessions),
    editor_started: row.editorStarts,
    editor_start_rate: percent(row.editorStarts, row.sessions),
    checkout_modal_views: row.checkoutModalViews,
    checkout_modal_closed: row.checkoutModalClosed,
    checkout_clicks: row.checkoutClicks,
    checkout_started: row.checkoutStarted,
    checkout_failed: row.checkoutFailed,
    checkout_completed: row.checkoutCompleted,
    paid_orders: row.paidOrders,
    paid_cvr: percent(row.paidOrders, row.sessions),
  }));

  console.table(view);
}

main()
  .catch((error) => {
    console.error("weekly_funnel_dashboard_failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
