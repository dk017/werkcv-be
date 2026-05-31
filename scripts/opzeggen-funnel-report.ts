import "dotenv/config";
import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { sanitizeAttribution } from "../lib/attribution";

const OPZEGGEN_PAGES = ["/cvster-opzeggen", "/cv-nl-opzeggen", "/cvmaker-opzeggen"] as const;
const PRIMARY_TARGETS = [
  "/cv-maken-zonder-abonnement",
  "/templates",
  "/prijzen",
] as const;

type OpzeggenPage = (typeof OPZEGGEN_PAGES)[number];

type PageMetrics = {
  landingSessions: number;
  ctaClicks: number;
  clicksToNoSubscription: number;
  clicksToTemplates: number;
  clicksToPricing: number;
  signups: number;
  signupsWithDocs: number;
  documents: number;
  paidOrders: number;
  revenueCents: number;
};

function emptyMetrics(): PageMetrics {
  return {
    landingSessions: 0,
    ctaClicks: 0,
    clicksToNoSubscription: 0,
    clicksToTemplates: 0,
    clicksToPricing: 0,
    signups: 0,
    signupsWithDocs: 0,
    documents: 0,
    paidOrders: 0,
    revenueCents: 0,
  };
}

function readPropertyString(properties: unknown, key: string): string {
  if (!properties || typeof properties !== "object") return "";
  const value = (properties as Record<string, unknown>)[key];
  return typeof value === "string" ? value : "";
}

function formatCurrency(amountCents: number, currency = "EUR"): string {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
  }).format(amountCents / 100);
}

function percent(part: number, whole: number): string {
  if (whole <= 0) return "0.00%";
  return `${((part / whole) * 100).toFixed(2)}%`;
}

function isDatabaseUnavailable(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "ECONNREFUSED"
  );
}

async function main() {
  const daysArg = Number(process.argv[2]);
  const days = Number.isFinite(daysArg) && daysArg > 0 ? Math.floor(daysArg) : 90;
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const [events, users, orders] = await Promise.all([
    prisma.analyticsEvent.findMany({
      where: {
        createdAt: { gte: since },
        event: { in: ["landing", "landing_cta_click"] },
        path: { in: [...OPZEGGEN_PAGES] },
      },
      select: {
        event: true,
        path: true,
        properties: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.findMany({
      where: {
        createdAt: { gte: since },
        sourcePath: { in: [...OPZEGGEN_PAGES] },
      },
      select: {
        sourcePath: true,
        createdAt: true,
        _count: {
          select: {
            documents: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.order.findMany({
      where: {
        paidAt: { gte: since },
      },
      select: {
        id: true,
        paidAt: true,
        amountCents: true,
        currency: true,
        attribution: true,
      },
      orderBy: { paidAt: "desc" },
    }),
  ]);

  const metricsByPage = new Map<OpzeggenPage, PageMetrics>(
    OPZEGGEN_PAGES.map((page) => [page, emptyMetrics()])
  );

  const ctaBreakdown = new Map<string, number>();
  const ctaLabelBreakdown = new Map<string, number>();

  for (const event of events) {
    const page = event.path as OpzeggenPage;
    const metrics = metricsByPage.get(page);
    if (!metrics) continue;

    if (event.event === "landing") {
      metrics.landingSessions += 1;
      continue;
    }

    if (event.event === "landing_cta_click") {
      metrics.ctaClicks += 1;
      const toPath = readPropertyString(event.properties, "toPath");
      const label = readPropertyString(event.properties, "label");
      if (toPath.startsWith("/cv-maken-zonder-abonnement")) {
        metrics.clicksToNoSubscription += 1;
      }
      if (toPath.startsWith("/templates")) {
        metrics.clicksToTemplates += 1;
      }
      if (toPath.startsWith("/prijzen")) {
        metrics.clicksToPricing += 1;
      }
      const breakdownKey = `${page} -> ${toPath || "(unknown)"}`;
      ctaBreakdown.set(breakdownKey, (ctaBreakdown.get(breakdownKey) || 0) + 1);
      const labelKey = `${page} :: ${label || "(no label)"}`;
      ctaLabelBreakdown.set(labelKey, (ctaLabelBreakdown.get(labelKey) || 0) + 1);
    }
  }

  for (const user of users) {
    const page = user.sourcePath as OpzeggenPage;
    const metrics = metricsByPage.get(page);
    if (!metrics) continue;
    metrics.signups += 1;
    metrics.documents += user._count.documents;
    if (user._count.documents > 0) {
      metrics.signupsWithDocs += 1;
    }
  }

  for (const order of orders) {
    const safeAttribution = sanitizeAttribution(order.attribution);
    const firstTouchPath = safeAttribution?.firstTouchPath;
    if (!firstTouchPath || !OPZEGGEN_PAGES.includes(firstTouchPath as OpzeggenPage)) {
      continue;
    }

    const page = firstTouchPath as OpzeggenPage;
    const metrics = metricsByPage.get(page);
    if (!metrics) continue;
    metrics.paidOrders += 1;
    metrics.revenueCents += order.amountCents ?? 0;
  }

  const totals = [...metricsByPage.values()].reduce(
    (aggregate, row) => ({
      landingSessions: aggregate.landingSessions + row.landingSessions,
      ctaClicks: aggregate.ctaClicks + row.ctaClicks,
      clicksToNoSubscription: aggregate.clicksToNoSubscription + row.clicksToNoSubscription,
      clicksToTemplates: aggregate.clicksToTemplates + row.clicksToTemplates,
      clicksToPricing: aggregate.clicksToPricing + row.clicksToPricing,
      signups: aggregate.signups + row.signups,
      signupsWithDocs: aggregate.signupsWithDocs + row.signupsWithDocs,
      documents: aggregate.documents + row.documents,
      paidOrders: aggregate.paidOrders + row.paidOrders,
      revenueCents: aggregate.revenueCents + row.revenueCents,
    }),
    emptyMetrics()
  );

  console.log(`Opzeggen funnel report (last ${days} days)`);
  console.log(`Window start: ${since.toISOString()}`);
  console.log("");

  console.table([
    {
      landings: totals.landingSessions,
      cta_clicks: totals.ctaClicks,
      cta_ctr: percent(totals.ctaClicks, totals.landingSessions),
      signups: totals.signups,
      signup_rate: percent(totals.signups, totals.landingSessions),
      signups_with_docs: totals.signupsWithDocs,
      doc_rate: percent(totals.signupsWithDocs, totals.signups),
      paid_orders: totals.paidOrders,
      paid_cvr: percent(totals.paidOrders, totals.landingSessions),
      revenue: formatCurrency(totals.revenueCents),
    },
  ]);

  console.log("By opzeggen page");
  console.table(
    OPZEGGEN_PAGES.map((page) => {
      const row = metricsByPage.get(page) || emptyMetrics();
      return {
        page,
        landings: row.landingSessions,
        cta_clicks: row.ctaClicks,
        cta_ctr: percent(row.ctaClicks, row.landingSessions),
        no_subscription_clicks: row.clicksToNoSubscription,
        templates_clicks: row.clicksToTemplates,
        pricing_clicks: row.clicksToPricing,
        signups: row.signups,
        signup_rate: percent(row.signups, row.landingSessions),
        signups_with_docs: row.signupsWithDocs,
        documents: row.documents,
        paid_orders: row.paidOrders,
        paid_cvr: percent(row.paidOrders, row.landingSessions),
        revenue: formatCurrency(row.revenueCents),
      };
    }).sort((a, b) => b.landings - a.landings || a.page.localeCompare(b.page))
  );

  console.log("CTA destination breakdown");
  console.table(
    [...ctaBreakdown.entries()]
      .map(([route, clicks]) => ({ route, clicks }))
      .sort((a, b) => b.clicks - a.clicks || a.route.localeCompare(b.route))
  );

  console.log("CTA label breakdown");
  console.table(
    [...ctaLabelBreakdown.entries()]
      .map(([label, clicks]) => ({ label, clicks }))
      .sort((a, b) => b.clicks - a.clicks || a.label.localeCompare(b.label))
  );

  console.log("Primary destination totals");
  console.table(
    PRIMARY_TARGETS.map((target) => ({
      destination: target,
      clicks:
        target === "/cv-maken-zonder-abonnement"
          ? totals.clicksToNoSubscription
          : target === "/templates"
            ? totals.clicksToTemplates
            : totals.clicksToPricing,
    }))
  );
}

main()
  .catch((error) => {
    if (isDatabaseUnavailable(error)) {
      console.error(
        "opzeggen_funnel_report_failed: database unavailable. Point DATABASE_URL to the analytics database or start PostgreSQL."
      );
      process.exitCode = 1;
      return;
    }

    console.error("opzeggen_funnel_report_failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
