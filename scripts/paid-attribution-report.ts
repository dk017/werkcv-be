import "dotenv/config";
import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { sanitizeAttribution } from "../lib/attribution";
import { getTemplateConfig } from "../lib/templates/registry";

type ChannelType = "ai" | "search" | "referral" | "direct";

type PaidOrderRow = {
  orderId: string;
  paidAt: Date;
  amountCents: number;
  currency: string;
  email: string;
  source: string;
  channelType: ChannelType;
  referrerHost: string;
  firstTouchPath: string;
  firstTouchCluster: string;
  lastTouchPath: string;
  templateId: string;
  templateName: string;
  colorThemeId: string;
  startSource: string;
  checkoutPath: string;
  minutesToPay: number | null;
};

function readPropertyString(properties: unknown, key: string): string {
  if (!properties || typeof properties !== "object") return "";
  const value = (properties as Record<string, unknown>)[key];
  return typeof value === "string" ? value : "";
}

function maskEmail(email: string): string {
  const [localPart, domain] = email.split("@");
  if (!localPart || !domain) return email;
  if (localPart.length <= 2) return `${localPart[0] || "*"}*@${domain}`;
  return `${localPart.slice(0, 2)}***@${domain}`;
}

function extractHostname(referrer: string): string {
  if (!referrer) return "";
  try {
    return new URL(referrer).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function resolveSource(hostname: string, utmSource: string): { source: string; channelType: ChannelType } {
  const raw = (utmSource || hostname || "").toLowerCase();

  if (!raw) return { source: "direct_or_unknown", channelType: "direct" };
  if (raw.includes("chatgpt") || raw.includes("openai")) return { source: "chatgpt", channelType: "ai" };
  if (raw.includes("perplexity")) return { source: "perplexity", channelType: "ai" };
  if (raw.includes("gemini")) return { source: "gemini", channelType: "ai" };
  if (raw.includes("claude")) return { source: "claude", channelType: "ai" };
  if (raw.includes("copilot")) return { source: "copilot", channelType: "ai" };
  if (raw.includes("google")) return { source: "google", channelType: "search" };
  if (raw.includes("bing")) return { source: "bing", channelType: "search" };
  if (raw.includes("duckduckgo")) return { source: "duckduckgo", channelType: "search" };
  return { source: raw, channelType: hostname ? "referral" : "direct" };
}

function formatCurrency(amountCents: number, currency: string): string {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: (currency || "EUR").toUpperCase(),
    minimumFractionDigits: 2,
  }).format(amountCents / 100);
}

function toMinutes(start: Date | null, end: Date | null): number | null {
  if (!start || !end) return null;
  const diff = end.getTime() - start.getTime();
  if (!Number.isFinite(diff) || diff < 0) return null;
  return Math.round(diff / 60000);
}

function isDatabaseUnavailable(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "ECONNREFUSED"
  );
}

async function main() {
  const daysArg = Number(process.argv[2]);
  const days = Number.isFinite(daysArg) && daysArg > 0 ? Math.floor(daysArg) : 30;
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const orders = await prisma.order.findMany({
    where: {
      paidAt: { gte: since },
    },
    select: {
      id: true,
      email: true,
      cvId: true,
      amountCents: true,
      currency: true,
      paidAt: true,
      attribution: true,
      sourceCluster: true,
    },
    orderBy: { paidAt: "desc" },
  });

  if (orders.length === 0) {
    console.log(`Paid attribution report (last ${days} days)`);
    console.log(`Window start: ${since.toISOString()}`);
    console.log("");
    console.log("No paid orders found in the selected window.");
    return;
  }

  const cvOrders = orders.filter((order): order is typeof order & { cvId: string } => Boolean(order.cvId));
  const cvIds = [...new Set(cvOrders.map((order) => order.cvId))];

  const documents = await prisma.cVDocument.findMany({
    where: {
      id: { in: cvIds },
    },
    select: {
      id: true,
      templateId: true,
      colorThemeId: true,
      startSource: true,
      createdAt: true,
    },
  });

  const checkoutEvents = await prisma.analyticsEvent.findMany({
    where: {
      cvId: { in: cvIds },
      event: { in: ["checkout_start", "checkout_started"] },
    },
    select: {
      cvId: true,
      event: true,
      path: true,
      createdAt: true,
    },
    orderBy: { createdAt: "asc" },
  });

  const templateStartEvents = await prisma.analyticsEvent.findMany({
    where: {
      createdAt: { gte: since },
      event: "start_cv",
    },
    select: {
      properties: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const documentsById = new Map(documents.map((doc) => [doc.id, doc]));
  const checkoutPathByCvId = new Map<string, string>();

  for (const event of checkoutEvents) {
    if (!event.cvId || checkoutPathByCvId.has(event.cvId)) continue;
    checkoutPathByCvId.set(event.cvId, event.path || "");
  }

  const rows: PaidOrderRow[] = cvOrders
    .filter((order): order is typeof order & { paidAt: Date } => !!order.paidAt)
    .map((order) => {
      const safeAttribution = sanitizeAttribution(order.attribution);
      const referrerHost = extractHostname(safeAttribution?.firstTouchReferrer || "");
      const sourceInfo = resolveSource(referrerHost, safeAttribution?.utmSource || "");
      const document = documentsById.get(order.cvId);
      const templateId = document?.templateId || "";
      const templateName = templateId ? getTemplateConfig(templateId).nameDutch : "";

      return {
        orderId: order.id,
        paidAt: order.paidAt,
        amountCents: order.amountCents ?? 0,
        currency: order.currency || "EUR",
        email: order.email,
        source: sourceInfo.source,
        channelType: sourceInfo.channelType,
        referrerHost,
        firstTouchPath: safeAttribution?.firstTouchPath || "",
        firstTouchCluster: safeAttribution?.firstTouchCluster || order.sourceCluster || "",
        lastTouchPath: safeAttribution?.lastTouchPath || "",
        templateId,
        templateName,
        colorThemeId: document?.colorThemeId || "",
        startSource: document?.startSource || "",
        checkoutPath: checkoutPathByCvId.get(order.cvId) || "",
        minutesToPay: toMinutes(document?.createdAt || null, order.paidAt),
      };
    });

  const totalRevenueCents = rows.reduce((sum, row) => sum + row.amountCents, 0);
  const aiOrders = rows.filter((row) => row.channelType === "ai");
  const aiRevenueCents = aiOrders.reduce((sum, row) => sum + row.amountCents, 0);

  console.log(`Paid attribution report (last ${days} days)`);
  console.log(`Window start: ${since.toISOString()}`);
  console.log("");

  console.table([
    {
      paid_orders: rows.length,
      total_revenue: formatCurrency(totalRevenueCents, rows[0]?.currency || "EUR"),
      ai_orders: aiOrders.length,
      ai_revenue: formatCurrency(aiRevenueCents, rows[0]?.currency || "EUR"),
    },
  ]);

  const bySource = new Map<string, { orders: number; revenueCents: number }>();
  for (const row of rows) {
    const current = bySource.get(row.source) || { orders: 0, revenueCents: 0 };
    current.orders += 1;
    current.revenueCents += row.amountCents;
    bySource.set(row.source, current);
  }

  console.log("Paid orders by source");
  console.table(
    [...bySource.entries()]
      .map(([source, value]) => ({
        source,
        orders: value.orders,
        revenue: formatCurrency(value.revenueCents, rows[0]?.currency || "EUR"),
      }))
      .sort((a, b) => b.orders - a.orders || a.source.localeCompare(b.source))
  );

  const byLanding = new Map<string, { source: string; orders: number; revenueCents: number }>();
  for (const row of rows) {
    const key = `${row.firstTouchPath || "(unknown)"}__${row.source}`;
    const current = byLanding.get(key) || {
      source: row.source,
      orders: 0,
      revenueCents: 0,
    };
    current.orders += 1;
    current.revenueCents += row.amountCents;
    byLanding.set(key, current);
  }

  console.log("Paid orders by first-touch page");
  console.table(
    [...byLanding.entries()]
      .map(([key, value]) => {
        const [landing] = key.split("__");
        return {
          landing_page: landing,
          source: value.source,
          orders: value.orders,
          revenue: formatCurrency(value.revenueCents, rows[0]?.currency || "EUR"),
        };
      })
      .sort((a, b) => b.orders - a.orders || a.landing_page.localeCompare(b.landing_page))
  );

  const startsByTemplate = new Map<string, { starts: number; quickStarts: number }>();
  for (const event of templateStartEvents) {
    const templateId = readPropertyString(event.properties, "templateId");
    if (!templateId) continue;
    const entryPoint = readPropertyString(event.properties, "entryPoint");
    const current = startsByTemplate.get(templateId) || { starts: 0, quickStarts: 0 };
    current.starts += 1;
    if (entryPoint === "template_quick_pick") current.quickStarts += 1;
    startsByTemplate.set(templateId, current);
  }

  const paidByTemplate = new Map<string, number>();
  for (const row of rows) {
    const key = row.templateId || "";
    if (!key) continue;
    paidByTemplate.set(key, (paidByTemplate.get(key) || 0) + 1);
  }

  console.log("Template starts vs paid orders");
  console.table(
    [...new Set([...startsByTemplate.keys(), ...paidByTemplate.keys()])]
      .map((templateId) => {
        const startData = startsByTemplate.get(templateId) || { starts: 0, quickStarts: 0 };
        const paidOrders = paidByTemplate.get(templateId) || 0;
        const templateName = getTemplateConfig(templateId).nameDutch;
        return {
          template: templateName,
          template_id: templateId,
          starts: startData.starts,
          quick_pick_starts: startData.quickStarts,
          paid_orders: paidOrders,
          paid_per_10_starts:
            startData.starts > 0 ? Number(((paidOrders / startData.starts) * 10).toFixed(2)) : 0,
        };
      })
      .sort((a, b) => b.starts - a.starts || b.paid_orders - a.paid_orders || a.template.localeCompare(b.template))
  );

  console.log("Latest paid orders");
  console.table(
    rows.map((row) => ({
      paid_at: row.paidAt.toISOString(),
      email: maskEmail(row.email),
      source: row.source,
      channel: row.channelType,
      first_touch: row.firstTouchPath || "",
      last_touch: row.lastTouchPath || "",
      checkout_path: row.checkoutPath || "",
      template: row.templateName || row.templateId || "",
      theme: row.colorThemeId || "",
      start_source: row.startSource || "",
      minutes_to_pay: row.minutesToPay ?? "",
      amount: formatCurrency(row.amountCents, row.currency),
    }))
  );
}

main()
  .catch((error) => {
    if (isDatabaseUnavailable(error)) {
      console.error("paid_attribution_report_failed: database unavailable. Check DATABASE_URL or start PostgreSQL.");
      process.exitCode = 1;
      return;
    }
    console.error("paid_attribution_report_failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
