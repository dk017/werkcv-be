import "dotenv/config";
import { createSign } from "crypto";
import { readFileSync } from "fs";

type GoogleServiceAccount = {
  client_email: string;
  private_key: string;
};

type DateWindow = {
  startDate: string;
  endDate: string;
  label: string;
};

type GscRow = {
  keys?: string[];
  clicks?: number;
  impressions?: number;
  ctr?: number;
  position?: number;
};

type GaDimensionValue = {
  value?: string;
};

type GaMetricValue = {
  value?: string;
};

type GaRow = {
  dimensionValues?: GaDimensionValue[];
  metricValues?: GaMetricValue[];
};

type GaReport = {
  rows?: GaRow[];
  totals?: Array<{ metricValues?: GaMetricValue[] }>;
};

type InternalFunnelRow = {
  day: Date;
  signups: bigint;
  cvsCreated: bigint;
  completedCvs: bigint;
  checkoutModalViews: bigint;
  checkoutOptionClicks: bigint;
  checkoutStarts: bigint;
  paidEvents: bigint;
};

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_SCOPE = [
  "https://www.googleapis.com/auth/webmasters.readonly",
  "https://www.googleapis.com/auth/analytics.readonly",
].join(" ");

const KEY_EVENTS = [
  "landing",
  "landing_cta_click",
  "editor_started",
  "complete_cv",
  "checkout_modal_viewed",
  "checkout_option_clicked",
  "checkout_start",
  "checkout_started",
  "checkout_completed",
  "paid",
];

function parseArgs(): DateWindow {
  const args = new Map<string, string>();
  for (const arg of process.argv.slice(2)) {
    const [key, value] = arg.replace(/^--/, "").split("=");
    if (key && value) args.set(key, value);
  }

  const explicitStart = args.get("start");
  const explicitEnd = args.get("end");
  if (explicitStart && explicitEnd) {
    return { startDate: explicitStart, endDate: explicitEnd, label: `${explicitStart} to ${explicitEnd}` };
  }

  const daysRaw = Number(args.get("days") || process.argv[2] || 7);
  const days = Number.isFinite(daysRaw) && daysRaw > 0 ? Math.min(Math.floor(daysRaw), 90) : 7;
  const end = new Date();
  end.setUTCDate(end.getUTCDate() - 1);
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - days + 1);

  return {
    startDate: toDateOnly(start),
    endDate: toDateOnly(end),
    label: `last ${days} complete days`,
  };
}

function toDateOnly(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function base64Url(input: string | Buffer): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function readServiceAccount(): GoogleServiceAccount {
  const jsonBase64 = process.env.GOOGLE_SERVICE_ACCOUNT_JSON_BASE64;
  if (jsonBase64) {
    const parsed = JSON.parse(Buffer.from(jsonBase64, "base64").toString("utf8")) as GoogleServiceAccount;
    return normalizeServiceAccount(parsed);
  }

  const jsonRaw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (jsonRaw) {
    return normalizeServiceAccount(JSON.parse(jsonRaw) as GoogleServiceAccount);
  }

  const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (credentialsPath) {
    return normalizeServiceAccount(JSON.parse(readFileSync(credentialsPath, "utf8")) as GoogleServiceAccount);
  }

  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
  if (clientEmail && privateKey) {
    return normalizeServiceAccount({ client_email: clientEmail, private_key: privateKey });
  }

  throw new Error(
    "Missing Google service account credentials. Set GOOGLE_APPLICATION_CREDENTIALS, GOOGLE_SERVICE_ACCOUNT_JSON_BASE64, or GOOGLE_SERVICE_ACCOUNT_EMAIL + GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY."
  );
}

function normalizeServiceAccount(account: GoogleServiceAccount): GoogleServiceAccount {
  if (!account.client_email || !account.private_key) {
    throw new Error("Google service account credentials must include client_email and private_key.");
  }
  return {
    client_email: account.client_email,
    private_key: account.private_key.replace(/\\n/g, "\n"),
  };
}

async function getAccessToken(account: GoogleServiceAccount): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = base64Url(
    JSON.stringify({
      iss: account.client_email,
      scope: GOOGLE_SCOPE,
      aud: GOOGLE_TOKEN_URL,
      exp: now + 3600,
      iat: now,
    })
  );
  const unsignedJwt = `${header}.${claim}`;
  const signature = createSign("RSA-SHA256").update(unsignedJwt).sign(account.private_key);
  const assertion = `${unsignedJwt}.${base64Url(signature)}`;

  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });
  const body = (await response.json()) as { access_token?: string; error?: string; error_description?: string };
  if (!response.ok || !body.access_token) {
    throw new Error(`Google token request failed: ${body.error || response.status} ${body.error_description || ""}`.trim());
  }
  return body.access_token;
}

async function fetchJson<T>(url: string, token: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`${url} failed ${response.status}: ${text.slice(0, 600)}`);
  }
  return JSON.parse(text) as T;
}

function gscUrl(siteUrl: string): string {
  return `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`;
}

async function queryGsc(token: string, window: DateWindow, dimensions: string[], rowLimit: number): Promise<GscRow[]> {
  const siteUrl = process.env.GSC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || "https://werkcv.nl/";
  const report = await fetchJson<{ rows?: GscRow[] }>(gscUrl(siteUrl), token, {
    startDate: window.startDate,
    endDate: window.endDate,
    dimensions,
    rowLimit,
    searchType: "web",
  });
  return report.rows || [];
}

async function queryGa(token: string, window: DateWindow, input: {
  dimensions: string[];
  metrics: string[];
  limit?: number;
  orderBys?: unknown[];
  dimensionFilter?: unknown;
}): Promise<GaReport> {
  const propertyId = process.env.GA4_PROPERTY_ID;
  if (!propertyId) {
    throw new Error("Missing GA4_PROPERTY_ID.");
  }
  return fetchJson<GaReport>(`https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`, token, {
    dateRanges: [{ startDate: window.startDate, endDate: window.endDate }],
    dimensions: input.dimensions.map((name) => ({ name })),
    metrics: input.metrics.map((name) => ({ name })),
    limit: input.limit || 10,
    orderBys: input.orderBys,
    dimensionFilter: input.dimensionFilter,
  });
}

function metric(row: GaRow, index: number): number {
  return Number(row.metricValues?.[index]?.value || 0);
}

function dimension(row: GaRow, index: number): string {
  return row.dimensionValues?.[index]?.value || "";
}

function percent(part: number, whole: number): string {
  if (!whole) return "0.0%";
  return `${((part / whole) * 100).toFixed(1)}%`;
}

function formatCtr(value: number | undefined): string {
  return `${((value || 0) * 100).toFixed(1)}%`;
}

function formatPosition(value: number | undefined): string {
  return (value || 0).toFixed(1);
}

async function printGscReport(token: string, window: DateWindow): Promise<void> {
  const daily = await queryGsc(token, window, ["date"], 100);
  const queries = await queryGsc(token, window, ["query"], 15);
  const pages = await queryGsc(token, window, ["page"], 15);

  const totals = daily.reduce<{ clicks: number; impressions: number }>(
    (acc, row) => ({
      clicks: acc.clicks + (row.clicks || 0),
      impressions: acc.impressions + (row.impressions || 0),
    }),
    { clicks: 0, impressions: 0 }
  );

  console.log("\nGSC search performance");
  console.log(`Clicks: ${totals.clicks} | Impressions: ${totals.impressions} | CTR: ${percent(totals.clicks, totals.impressions)}`);
  console.table(
    daily.map((row) => ({
      date: row.keys?.[0],
      clicks: row.clicks || 0,
      impressions: row.impressions || 0,
      ctr: formatCtr(row.ctr),
      position: formatPosition(row.position),
    }))
  );

  console.log("\nTop GSC queries");
  console.table(
    queries.map((row) => ({
      query: row.keys?.[0],
      clicks: row.clicks || 0,
      impressions: row.impressions || 0,
      ctr: formatCtr(row.ctr),
      position: formatPosition(row.position),
    }))
  );

  console.log("\nTop GSC pages");
  console.table(
    pages.map((row) => ({
      page: row.keys?.[0],
      clicks: row.clicks || 0,
      impressions: row.impressions || 0,
      ctr: formatCtr(row.ctr),
      position: formatPosition(row.position),
    }))
  );
}

async function printGaReport(token: string, window: DateWindow): Promise<void> {
  const daily = await queryGa(token, window, {
    dimensions: ["date"],
    metrics: ["sessions", "totalUsers", "screenPageViews", "eventCount", "totalRevenue"],
    limit: 100,
    orderBys: [{ dimension: { dimensionName: "date" } }],
  });
  const pages = await queryGa(token, window, {
    dimensions: ["pagePath"],
    metrics: ["sessions", "totalUsers", "screenPageViews"],
    limit: 15,
    orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
  });
  const events = await queryGa(token, window, {
    dimensions: ["eventName"],
    metrics: ["eventCount"],
    limit: 50,
    orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
    dimensionFilter: {
      filter: {
        fieldName: "eventName",
        inListFilter: { values: KEY_EVENTS },
      },
    },
  });

  const totalRow = daily.totals?.[0]?.metricValues;
  console.log("\nGA4 traffic");
  if (totalRow) {
    console.log(
      `Sessions: ${Number(totalRow[0]?.value || 0)} | Users: ${Number(totalRow[1]?.value || 0)} | Views: ${Number(totalRow[2]?.value || 0)} | Events: ${Number(totalRow[3]?.value || 0)} | Revenue: ${Number(totalRow[4]?.value || 0).toFixed(2)}`
    );
  }
  console.table(
    (daily.rows || []).map((row) => ({
      date: dimension(row, 0),
      sessions: metric(row, 0),
      users: metric(row, 1),
      views: metric(row, 2),
      events: metric(row, 3),
      revenue: metric(row, 4).toFixed(2),
    }))
  );

  console.log("\nTop GA4 pages");
  console.table(
    (pages.rows || []).map((row) => ({
      path: dimension(row, 0),
      sessions: metric(row, 0),
      users: metric(row, 1),
      views: metric(row, 2),
    }))
  );

  console.log("\nTracked GA4 funnel events");
  console.table(
    (events.rows || []).map((row) => ({
      event: dimension(row, 0),
      count: metric(row, 0),
    }))
  );
}

async function printInternalFunnel(window: DateWindow): Promise<void> {
  if (!process.env.DATABASE_URL) {
    console.log("\nInternal funnel skipped: DATABASE_URL is not set.");
    return;
  }

  try {
    const { prisma } = await import("../lib/prisma");
    const rows = await prisma.$queryRaw<InternalFunnelRow[]>`
      WITH days AS (
        SELECT generate_series(${window.startDate}::date, ${window.endDate}::date, interval '1 day')::date AS day
      ),
      users AS (
        SELECT date_trunc('day', "createdAt")::date AS day, count(*) AS signups
        FROM "User"
        WHERE "createdAt" >= ${window.startDate}::date
          AND "createdAt" < (${window.endDate}::date + interval '1 day')
          AND email NOT ILIKE '%@werkcv.nl'
          AND email <> 'dhineshkumar.stoic@gmail.com'
        GROUP BY 1
      ),
      cvs AS (
        SELECT date_trunc('day', c."createdAt")::date AS day, count(*) AS "cvsCreated"
        FROM "CVDocument" c
        LEFT JOIN "User" u ON u.id = c."userId"
        WHERE c."createdAt" >= ${window.startDate}::date
          AND c."createdAt" < (${window.endDate}::date + interval '1 day')
          AND (u.email IS NULL OR (u.email NOT ILIKE '%@werkcv.nl' AND u.email <> 'dhineshkumar.stoic@gmail.com'))
        GROUP BY 1
      ),
      events AS (
        SELECT date_trunc('day', e."createdAt")::date AS day,
          count(DISTINCT e."cvId") FILTER (WHERE e.event = 'complete_cv') AS "completedCvs",
          count(*) FILTER (WHERE e.event = 'checkout_modal_viewed') AS "checkoutModalViews",
          count(*) FILTER (WHERE e.event = 'checkout_option_clicked') AS "checkoutOptionClicks",
          count(*) FILTER (WHERE e.event = 'checkout_start') AS "checkoutStarts",
          count(*) FILTER (WHERE e.event = 'paid') AS "paidEvents"
        FROM "AnalyticsEvent" e
        LEFT JOIN "CVDocument" c ON c.id = e."cvId"
        LEFT JOIN "User" u ON u.id = c."userId"
        WHERE e."createdAt" >= ${window.startDate}::date
          AND e."createdAt" < (${window.endDate}::date + interval '1 day')
          AND (u.email IS NULL OR (u.email NOT ILIKE '%@werkcv.nl' AND u.email <> 'dhineshkumar.stoic@gmail.com'))
        GROUP BY 1
      )
      SELECT d.day,
        coalesce(u.signups, 0) AS signups,
        coalesce(c."cvsCreated", 0) AS "cvsCreated",
        coalesce(e."completedCvs", 0) AS "completedCvs",
        coalesce(e."checkoutModalViews", 0) AS "checkoutModalViews",
        coalesce(e."checkoutOptionClicks", 0) AS "checkoutOptionClicks",
        coalesce(e."checkoutStarts", 0) AS "checkoutStarts",
        coalesce(e."paidEvents", 0) AS "paidEvents"
      FROM days d
      LEFT JOIN users u ON u.day = d.day
      LEFT JOIN cvs c ON c.day = d.day
      LEFT JOIN events e ON e.day = d.day
      ORDER BY d.day;
    `;

    console.log("\nInternal production funnel");
    console.table(
      rows.map((row) => ({
        date: toDateOnly(row.day),
        signups: Number(row.signups),
        cvs_created: Number(row.cvsCreated),
        completed_cvs: Number(row.completedCvs),
        modal_views: Number(row.checkoutModalViews),
        option_clicks: Number(row.checkoutOptionClicks),
        checkout_starts: Number(row.checkoutStarts),
        paid_events: Number(row.paidEvents),
      }))
    );
    await prisma.$disconnect();
  } catch (error) {
    console.log("\nInternal funnel skipped due to DB error.");
    console.error(error);
  }
}

async function main(): Promise<void> {
  const window = parseArgs();
  const account = readServiceAccount();
  const token = await getAccessToken(account);

  console.log(`Google insights report: ${window.label}`);
  console.log(`Window: ${window.startDate} to ${window.endDate}`);
  console.log(`GSC site: ${process.env.GSC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || "https://werkcv.nl/"}`);
  console.log(`GA4 property: ${process.env.GA4_PROPERTY_ID || "(missing)"}`);

  await printGscReport(token, window);
  await printGaReport(token, window);
  await printInternalFunnel(window);
}

main().catch((error) => {
  console.error("google_insights_report_failed", error);
  process.exitCode = 1;
});
