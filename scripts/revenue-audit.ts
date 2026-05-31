import { execFileSync } from "child_process";

type AuditJson = {
  dbContext: {
    timezone: string;
    nowUtc: string;
    currentDate: string;
    windowStart: string;
    days: number;
  };
  summary: {
    signups: number;
    cvDocuments: number;
    completedCvs: number;
    checkoutModalViews: number;
    bundleOptionViews: number;
    bundleOptionClicks: number;
    cvOnlyOptionViews: number;
    cvOnlyOptionClicks: number;
    checkoutStarts: number;
    checkoutStarted: number;
    checkoutFailed: number;
    paidOrders: number;
    revenueCents: number;
    profilePhotoViews: number;
    profilePhotoSubmits: number;
    profilePhotoGenerated: number;
    profilePhotoCheckoutClicks: number;
    profilePhotoCheckoutStarted: number;
    profilePhotoPaid: number;
  };
  eventCounts: Array<{ event: string; count: number; firstSeen: string; lastSeen: string }>;
  productFunnel: Array<{ product: string; event: string; count: number; lastSeen: string }>;
  signups: Array<{
    email: string;
    createdAt: string;
    sourcePath: string;
    sourceCluster: string;
    sourceLocale: string;
    firstTouchPath: string;
    lastTouchPath: string;
    firstTouchReferrer: string;
    documentCount: number;
  }>;
  orders: Array<{
    email: string;
    product: string;
    amountCents: number;
    currency: string;
    paidAt: string;
    cvId: string;
    firstTouchPath: string;
    firstTouchReferrer: string;
  }>;
  cvCheckoutDropoffs: Array<{
    email: string;
    cvId: string;
    title: string;
    path: string;
    firstTouchPath: string;
    firstTouchReferrer: string;
    lastEventAt: string;
    closeReason: string;
    viewedProducts: string[];
    clickedProducts: string[];
  }>;
  profilePhotoProjects: Array<{
    email: string;
    projectId: string;
    status: string;
    style: string;
    sourceImageCount: number;
    generationCount: number;
    refinementCount: number;
    createdAt: string;
    updatedAt: string;
  }>;
};

function parseDays(): number {
  const rawArg = process.argv.find((arg) => arg.startsWith("--days=")) || process.argv[2] || "";
  const rawValue = rawArg.startsWith("--days=") ? rawArg.slice("--days=".length) : rawArg;
  const parsed = Number(rawValue);
  if (!Number.isFinite(parsed) || parsed <= 0) return 1;
  return Math.min(Math.floor(parsed), 90);
}

function formatCurrency(amountCents: number, currency = "EUR"): string {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
  }).format(amountCents / 100);
}

function percent(part: number, whole: number): string {
  if (whole <= 0) return "0.0%";
  return `${((part / whole) * 100).toFixed(1)}%`;
}

function maskEmail(email: string): string {
  const [localPart, domain] = email.split("@");
  if (!localPart || !domain) return email;
  if (localPart.length <= 2) return `${localPart[0] || "*"}*@${domain}`;
  return `${localPart.slice(0, 2)}***@${domain}`;
}

function shellQuote(value: string): string {
  return `'${value.replace(/'/g, `'\\''`)}'`;
}

function buildSql(days: number): string {
  return `
WITH params AS (
  SELECT
    now() AS now_ts,
    current_date AS current_date,
    now() - interval '${days} days' AS since_ts,
    '${days}'::int AS days
),
events AS (
  SELECT *
  FROM "AnalyticsEvent"
  WHERE "createdAt" >= (SELECT since_ts FROM params)
),
users_window AS (
  SELECT u.*
  FROM "User" u
  WHERE u."createdAt" >= (SELECT since_ts FROM params)
),
docs_window AS (
  SELECT d.*
  FROM "CVDocument" d
  WHERE d."createdAt" >= (SELECT since_ts FROM params)
),
orders_window AS (
  SELECT o.*
  FROM "Order" o
  WHERE o."createdAt" >= (SELECT since_ts FROM params)
     OR o."paidAt" >= (SELECT since_ts FROM params)
),
cv_dropoff AS (
  SELECT
    e."cvId",
    max(e."createdAt") AS last_event_at,
    bool_or(e.event = 'checkout_modal_viewed') AS saw_modal,
    bool_or(e.event = 'checkout_option_clicked') AS clicked_option,
    bool_or(e.event IN ('checkout_start', 'checkout_started')) AS started_checkout,
    bool_or(e.event IN ('paid', 'checkout_completed')) AS paid_or_completed,
    (array_agg(e.properties->>'reason' ORDER BY e."createdAt" DESC) FILTER (WHERE e.event = 'checkout_modal_closed'))[1] AS close_reason,
    array_remove(array_agg(DISTINCT e.properties->>'product') FILTER (WHERE e.event = 'checkout_option_viewed'), NULL) AS viewed_products,
    array_remove(array_agg(DISTINCT e.properties->>'product') FILTER (WHERE e.event = 'checkout_option_clicked'), NULL) AS clicked_products
  FROM events e
  WHERE e."cvId" IS NOT NULL
    AND e.event IN (
      'checkout_modal_viewed',
      'checkout_option_viewed',
      'checkout_option_clicked',
      'checkout_modal_closed',
      'checkout_start',
      'checkout_started',
      'checkout_completed',
      'paid'
    )
  GROUP BY e."cvId"
)
SELECT jsonb_build_object(
  'dbContext', (
    SELECT jsonb_build_object(
      'timezone', current_setting('TIMEZONE'),
      'nowUtc', now_ts,
      'currentDate', current_date,
      'windowStart', since_ts,
      'days', days
    )
    FROM params
  ),
  'summary', (
    SELECT jsonb_build_object(
      'signups', (SELECT count(*) FROM users_window),
      'cvDocuments', (SELECT count(*) FROM docs_window),
      'completedCvs', (SELECT count(DISTINCT "cvId") FROM events WHERE event = 'complete_cv'),
      'checkoutModalViews', (SELECT count(*) FROM events WHERE event = 'checkout_modal_viewed'),
      'bundleOptionViews', (SELECT count(*) FROM events WHERE event = 'checkout_option_viewed' AND properties->>'product' = 'cv-profile-photo-bundle'),
      'bundleOptionClicks', (SELECT count(*) FROM events WHERE event = 'checkout_option_clicked' AND properties->>'product' = 'cv-profile-photo-bundle'),
      'cvOnlyOptionViews', (SELECT count(*) FROM events WHERE event = 'checkout_option_viewed' AND properties->>'product' = 'cv-download'),
      'cvOnlyOptionClicks', (SELECT count(*) FROM events WHERE event = 'checkout_option_clicked' AND properties->>'product' = 'cv-download'),
      'checkoutStarts', (SELECT count(*) FROM events WHERE event = 'checkout_start'),
      'checkoutStarted', (SELECT count(*) FROM events WHERE event = 'checkout_started'),
      'checkoutFailed', (SELECT count(*) FROM events WHERE event = 'checkout_failed'),
      'paidOrders', (SELECT count(*) FROM orders_window WHERE "paidAt" IS NOT NULL),
      'revenueCents', (SELECT coalesce(sum(coalesce("amountCents", 0)), 0) FROM orders_window WHERE "paidAt" IS NOT NULL),
      'profilePhotoViews', (SELECT count(*) FROM events WHERE event = 'profile_photo_tool_view'),
      'profilePhotoSubmits', (SELECT count(*) FROM events WHERE event = 'profile_photo_submit'),
      'profilePhotoGenerated', (SELECT count(*) FROM events WHERE event = 'profile_photo_generated'),
      'profilePhotoCheckoutClicks', (SELECT count(*) FROM events WHERE event = 'profile_photo_checkout_click'),
      'profilePhotoCheckoutStarted', (SELECT count(*) FROM events WHERE event = 'profile_photo_checkout_started'),
      'profilePhotoPaid', (SELECT count(*) FROM events WHERE event = 'profile_photo_paid')
    )
  ),
  'eventCounts', (
    SELECT coalesce(jsonb_agg(to_jsonb(row_data) ORDER BY row_data."lastSeen" DESC), '[]'::jsonb)
    FROM (
      SELECT event, count(*)::int AS count, min("createdAt") AS "firstSeen", max("createdAt") AS "lastSeen"
      FROM events
      WHERE event IN (
        'landing',
        'start_cv',
        'editor_started',
        'complete_cv',
        'checkout_modal_viewed',
        'checkout_option_viewed',
        'checkout_option_clicked',
        'checkout_modal_closed',
        'checkout_start',
        'checkout_started',
        'checkout_failed',
        'checkout_completed',
        'paid',
        'profile_photo_tool_view',
        'profile_photo_submit',
        'profile_photo_generated',
        'profile_photo_variant_selected',
        'profile_photo_checkout_click',
        'profile_photo_checkout_started',
        'profile_photo_paid'
      )
      GROUP BY event
    ) row_data
  ),
  'productFunnel', (
    SELECT coalesce(jsonb_agg(to_jsonb(row_data) ORDER BY row_data."lastSeen" DESC), '[]'::jsonb)
    FROM (
      SELECT
        coalesce(properties->>'product', '(none)') AS product,
        event,
        count(*)::int AS count,
        max("createdAt") AS "lastSeen"
      FROM events
      WHERE event IN (
        'checkout_option_viewed',
        'checkout_option_clicked',
        'checkout_start',
        'checkout_started',
        'checkout_failed',
        'checkout_completed',
        'paid',
        'profile_photo_checkout_started',
        'profile_photo_paid'
      )
      GROUP BY coalesce(properties->>'product', '(none)'), event
    ) row_data
  ),
  'signups', (
    SELECT coalesce(jsonb_agg(jsonb_build_object(
      'email', u.email,
      'createdAt', u."createdAt",
      'sourcePath', coalesce(u."sourcePath", ''),
      'sourceCluster', coalesce(u."sourceCluster", ''),
      'sourceLocale', coalesce(u."sourceLocale", ''),
      'firstTouchPath', coalesce(u.attribution->>'firstTouchPath', ''),
      'lastTouchPath', coalesce(u.attribution->>'lastTouchPath', ''),
      'firstTouchReferrer', coalesce(u.attribution->>'firstTouchReferrer', ''),
      'documentCount', (SELECT count(*) FROM "CVDocument" d WHERE d."userId" = u.id)
    ) ORDER BY u."createdAt" DESC), '[]'::jsonb)
    FROM users_window u
  ),
  'orders', (
    SELECT coalesce(jsonb_agg(jsonb_build_object(
      'email', o.email,
      'product', o.product,
      'amountCents', coalesce(o."amountCents", 0),
      'currency', coalesce(o.currency, 'EUR'),
      'paidAt', o."paidAt",
      'cvId', coalesce(o."cvId", ''),
      'firstTouchPath', coalesce(o.attribution->>'firstTouchPath', ''),
      'firstTouchReferrer', coalesce(o.attribution->>'firstTouchReferrer', '')
    ) ORDER BY o."paidAt" DESC NULLS LAST, o."createdAt" DESC), '[]'::jsonb)
    FROM orders_window o
    WHERE o."paidAt" IS NOT NULL
  ),
  'cvCheckoutDropoffs', (
    SELECT coalesce(jsonb_agg(jsonb_build_object(
      'email', coalesce(u.email, ''),
      'cvId', d.id,
      'title', d.title,
      'path', coalesce((SELECT e2.path FROM events e2 WHERE e2."cvId" = f."cvId" ORDER BY e2."createdAt" DESC LIMIT 1), ''),
      'firstTouchPath', coalesce(d.attribution->>'firstTouchPath', ''),
      'firstTouchReferrer', coalesce(d.attribution->>'firstTouchReferrer', ''),
      'lastEventAt', f.last_event_at,
      'closeReason', coalesce(f.close_reason, ''),
      'viewedProducts', coalesce(to_jsonb(f.viewed_products), '[]'::jsonb),
      'clickedProducts', coalesce(to_jsonb(f.clicked_products), '[]'::jsonb)
    ) ORDER BY f.last_event_at DESC), '[]'::jsonb)
    FROM cv_dropoff f
    JOIN "CVDocument" d ON d.id = f."cvId"
    LEFT JOIN "User" u ON u.id = d."userId"
    WHERE f.saw_modal = true
      AND f.started_checkout = false
      AND f.paid_or_completed = false
  ),
  'profilePhotoProjects', (
    SELECT coalesce(jsonb_agg(jsonb_build_object(
      'email', u.email,
      'projectId', p.id,
      'status', p.status,
      'style', coalesce(p.style, ''),
      'sourceImageCount', p."sourceImageCount",
      'generationCount', p."generationCount",
      'refinementCount', p."refinementCount",
      'createdAt', p."createdAt",
      'updatedAt', p."updatedAt"
    ) ORDER BY greatest(p."createdAt", p."updatedAt") DESC), '[]'::jsonb)
    FROM "ProfilePhotoProject" p
    JOIN "User" u ON u.id = p."userId"
    WHERE p."createdAt" >= (SELECT since_ts FROM params)
       OR p."updatedAt" >= (SELECT since_ts FROM params)
  )
)::text AS audit_json;
`;
}

function runProductionSql(sql: string): AuditJson {
  const encoded = Buffer.from(sql, "utf8").toString("base64");
  const remoteCommand = `echo ${shellQuote(encoded)} | base64 -d | docker exec -i werkcv-db-1 psql -U postgres -d werkcv -t -A`;
  const output = execFileSync("ssh", ["root@65.108.243.208", remoteCommand], {
    encoding: "utf8",
    maxBuffer: 1024 * 1024 * 10,
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();

  const jsonLine = output
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find((line) => line.startsWith("{") && line.endsWith("}"));

  if (!jsonLine) {
    throw new Error(`No JSON payload returned by production audit query. Raw output:\n${output}`);
  }

  return JSON.parse(jsonLine) as AuditJson;
}

function printTable<T extends Record<string, unknown>>(title: string, rows: T[]) {
  console.log("");
  console.log(title);
  if (rows.length === 0) {
    console.log("  none");
    return;
  }
  console.table(rows);
}

function main() {
  const days = parseDays();
  const audit = runProductionSql(buildSql(days));
  const currency = audit.orders[0]?.currency || "EUR";

  console.log(`Revenue audit: last ${audit.dbContext.days} day(s)`);
  console.log(`Production DB timezone: ${audit.dbContext.timezone}`);
  console.log(`DB now: ${audit.dbContext.nowUtc}`);
  console.log(`Window start: ${audit.dbContext.windowStart}`);

  printTable("Topline", [
    {
      signups: audit.summary.signups,
      cv_docs: audit.summary.cvDocuments,
      completed_cvs: audit.summary.completedCvs,
      checkout_modals: audit.summary.checkoutModalViews,
      checkout_starts: audit.summary.checkoutStarts,
      paid_orders: audit.summary.paidOrders,
      revenue: formatCurrency(audit.summary.revenueCents, currency),
    },
  ]);

  printTable("CV checkout funnel", [
    {
      modal_views: audit.summary.checkoutModalViews,
      cv_only_views: audit.summary.cvOnlyOptionViews,
      cv_only_clicks: audit.summary.cvOnlyOptionClicks,
      cv_only_view_to_click: percent(audit.summary.cvOnlyOptionClicks, audit.summary.cvOnlyOptionViews),
      bundle_views: audit.summary.bundleOptionViews,
      bundle_clicks: audit.summary.bundleOptionClicks,
      bundle_view_to_click: percent(audit.summary.bundleOptionClicks, audit.summary.bundleOptionViews),
      checkout_started: audit.summary.checkoutStarted,
      checkout_failed: audit.summary.checkoutFailed,
      paid_orders: audit.summary.paidOrders,
    },
  ]);

  printTable("Profile photo funnel", [
    {
      page_views: audit.summary.profilePhotoViews,
      submits: audit.summary.profilePhotoSubmits,
      generated: audit.summary.profilePhotoGenerated,
      checkout_clicks: audit.summary.profilePhotoCheckoutClicks,
      checkout_started: audit.summary.profilePhotoCheckoutStarted,
      paid: audit.summary.profilePhotoPaid,
    },
  ]);

  printTable(
    "Event counts",
    audit.eventCounts.map((row) => ({
      event: row.event,
      count: row.count,
      first_seen: row.firstSeen,
      last_seen: row.lastSeen,
    }))
  );

  printTable(
    "Product funnel",
    audit.productFunnel.map((row) => ({
      product: row.product,
      event: row.event,
      count: row.count,
      last_seen: row.lastSeen,
    }))
  );

  printTable(
    "New signups",
    audit.signups.map((row) => ({
      created_at: row.createdAt,
      email: row.email,
      source_path: row.sourcePath,
      source_cluster: row.sourceCluster,
      locale: row.sourceLocale,
      first_touch: row.firstTouchPath,
      last_touch: row.lastTouchPath,
      referrer: row.firstTouchReferrer,
      docs: row.documentCount,
    }))
  );

  printTable(
    "Paid orders",
    audit.orders.map((row) => ({
      paid_at: row.paidAt,
      email: maskEmail(row.email),
      product: row.product,
      amount: formatCurrency(row.amountCents, row.currency),
      cv_id: row.cvId,
      first_touch: row.firstTouchPath,
      referrer: row.firstTouchReferrer,
    }))
  );

  printTable(
    "Checkout drop-offs",
    audit.cvCheckoutDropoffs.map((row) => ({
      last_event_at: row.lastEventAt,
      email: row.email,
      cv_id: row.cvId,
      title: row.title,
      close_reason: row.closeReason || "(none)",
      viewed: row.viewedProducts.join(", "),
      clicked: row.clickedProducts.join(", "),
      first_touch: row.firstTouchPath,
      referrer: row.firstTouchReferrer,
    }))
  );

  printTable(
    "Profile photo projects",
    audit.profilePhotoProjects.map((row) => ({
      updated_at: row.updatedAt,
      email: maskEmail(row.email),
      project_id: row.projectId,
      status: row.status,
      style: row.style,
      source_images: row.sourceImageCount,
      generations: row.generationCount,
      refinements: row.refinementCount,
    }))
  );
}

try {
  main();
} catch (error) {
  console.error("revenue_audit_failed", error);
  process.exitCode = 1;
}
