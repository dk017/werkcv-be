import fs from "fs";
import path from "path";
import "dotenv/config";
import { parse as parseCsv } from "csv-parse/sync";
import { prisma } from "../lib/prisma";

type FollowupType =
  | "paid_customer_testimonial"
  | "created_cv_no_purchase"
  | "checkout_no_purchase"
  | "agency_outreach_no_reply";

type Candidate = {
  email: string;
  type: FollowupType;
  reason: string;
  draftSubject: string;
  draftBody: string;
  dueAt: Date;
  relatedUserId?: string | null;
  relatedCvId?: string | null;
  relatedOrderId?: string | null;
  source?: string | null;
};

type ScanResult = {
  candidate: Candidate;
  action: "created" | "updated" | "already_sent" | "skipped" | "dry_run";
  note?: string;
};

const DAY_MS = 24 * 60 * 60 * 1000;
const DEFAULT_DAYS = 14;
const TESTIMONIAL_DELAY_DAYS = 2;
const CREATED_CV_DELAY_HOURS = 36;
const CHECKOUT_DELAY_HOURS = 18;
const AGENCY_FOLLOWUP_DELAY_DAYS = 3;

type AgencyTrackerRow = {
  account_name: string;
  segment?: string;
  city?: string;
  website?: string;
  linkedin_company?: string;
  contact_name?: string;
  contact_role?: string;
  contact_linkedin?: string;
  contact_email?: string;
  source?: string;
  status?: string;
  pain_signal?: string;
  first_outreach_date?: string;
  last_touch_date?: string;
  next_step?: string;
  next_step_date?: string;
  demo_date?: string;
  pilot_interest?: string;
  estimated_monthly_volume?: string;
  notes?: string;
};

function parseArgs() {
  const args = new Set(process.argv.slice(2));
  const daysArg = process.argv.find((arg) => arg.startsWith("--days="));
  const daysValue = daysArg ? Number(daysArg.replace("--days=", "")) : DEFAULT_DAYS;
  const days = Number.isFinite(daysValue) && daysValue > 0 ? Math.floor(daysValue) : DEFAULT_DAYS;

  return {
    dryRun: args.has("--dry-run"),
    days,
  };
}

function normalizeEmail(email: string | null | undefined): string {
  return (email || "").trim().toLowerCase();
}

function isInternalOrTestEmail(email: string): boolean {
  const normalized = normalizeEmail(email);
  return (
    !normalized ||
    normalized.endsWith("@werkcv.nl") ||
    normalized.includes("+test") ||
    normalized.includes("test@") ||
    normalized === "dhineshkumar.stoic@gmail.com"
  );
}

function hoursAgo(hours: number): Date {
  return new Date(Date.now() - hours * 60 * 60 * 1000);
}

function daysAgo(days: number): Date {
  return new Date(Date.now() - days * DAY_MS);
}

function isEnglishContext(path?: string | null, locale?: string | null): boolean {
  return Boolean(path?.startsWith("/en") || locale === "en" || path?.startsWith("en-"));
}

function parseDate(value?: string | null): Date | null {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function displayNameFromAgency(row: AgencyTrackerRow): string {
  const name = row.contact_name?.trim() || row.account_name?.trim() || "there";
  const first = name.split(/\s+/)[0] || "there";
  return first.charAt(0).toUpperCase() + first.slice(1);
}

function agencyFollowupDraft(row: AgencyTrackerRow): Pick<Candidate, "draftSubject" | "draftBody"> {
  const name = displayNameFromAgency(row);
  const company = row.account_name?.trim() || "jullie";

  return {
    draftSubject: "Korte follow-up",
    draftBody: `Hoi ${name},

Ik wilde mijn eerdere bericht nog even kort onder de aandacht brengen.

Ik denk dat WerkCV vooral relevant kan zijn als het bij ${company} tijd scheelt in het netjes aanleveren van kandidaten.
Als het nu geen prioriteit is, is dat helemaal prima.

Als je wilt, stuur ik graag een korte voorbeeld-opzet of licht ik het in 2 zinnen toe.

Groet,
Dinesh
WerkCV`,
  };
}

function readAgencyTrackerRows(): AgencyTrackerRow[] {
  const csvPath = path.join(process.cwd(), "AGENCY_OUTREACH_TRACKER_APRIL_2026.csv");
  const content = fs.readFileSync(csvPath, "utf8");
  return parseCsv(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as AgencyTrackerRow[];
}

function firstNameFromEmail(email: string): string {
  const local = email.split("@")[0] || "";
  const firstToken = local.split(/[._+-]/)[0] || "";
  if (!firstToken || firstToken.length < 2) return "there";
  return firstToken.charAt(0).toUpperCase() + firstToken.slice(1);
}

function paidCustomerDraft(email: string, english: boolean): Pick<Candidate, "draftSubject" | "draftBody"> {
  const name = firstNameFromEmail(email);

  if (english) {
    return {
      draftSubject: "Quick question about your CV",
      draftBody: `Hi ${name},

I noticed you used WerkCV recently. I am improving the product and wanted to ask one simple thing:

Was the CV/download experience useful for you, or was there anything that felt confusing?

If it helped, a short sentence about your experience would also be really valuable. No pressure at all.

Thanks,
Dinesh`,
    };
  }

  return {
    draftSubject: "Korte vraag over je CV",
    draftBody: `Hoi ${name},

Ik zag dat je WerkCV recent hebt gebruikt. Ik ben het product aan het verbeteren en wilde je een simpele vraag stellen:

Was het maken en downloaden van je CV duidelijk genoeg, of was er iets dat verwarrend voelde?

Als WerkCV je geholpen heeft, is een korte zin over je ervaring ook heel waardevol. Geen verplichting natuurlijk.

Groet,
Dinesh`,
  };
}

function createdCvNoPurchaseDraft(email: string, english: boolean): Pick<Candidate, "draftSubject" | "draftBody"> {
  const name = firstNameFromEmail(email);

  if (english) {
    return {
      draftSubject: "Quick question about your CV",
      draftBody: `Hi ${name},

I saw you started creating a CV on WerkCV, but it looks like you did not finish the download.

I am not trying to push you to buy anything. I am trying to understand what stopped you:

- Was the editor unclear?
- Did the CV not feel good enough yet?
- Was the price or checkout not clear?
- Or did you simply not need it anymore?

A one-line reply would really help me improve the product.

Thanks,
Dinesh`,
    };
  }

  return {
    draftSubject: "Korte vraag over je CV",
    draftBody: `Hoi ${name},

Ik zag dat je een CV bent gaan maken op WerkCV, maar volgens mij heb je de PDF-download niet afgerond.

Ik probeer je niks te verkopen. Ik wil vooral begrijpen wat je tegenhield:

- Was de editor onduidelijk?
- Voelde het CV nog niet goed genoeg?
- Was de prijs of checkout niet duidelijk?
- Of had je het simpelweg niet meer nodig?

Een korte reply van een zin zou al enorm helpen om WerkCV beter te maken.

Groet,
Dinesh`,
  };
}

function checkoutNoPurchaseDraft(email: string, english: boolean): Pick<Candidate, "draftSubject" | "draftBody"> {
  const name = firstNameFromEmail(email);

  if (english) {
    return {
      draftSubject: "Did checkout work for you?",
      draftBody: `Hi ${name},

I noticed you reached the WerkCV checkout but did not complete the download.

Just checking: did something break or feel unclear? If it was simply not the right moment, no problem.

A short reply would help me spot issues faster.

Thanks,
Dinesh`,
    };
  }

  return {
    draftSubject: "Werkte de checkout goed?",
    draftBody: `Hoi ${name},

Ik zag dat je bij de WerkCV-checkout bent geweest, maar de download niet hebt afgerond.

Korte check: ging er iets mis of was iets onduidelijk? Als het gewoon niet het juiste moment was, is dat natuurlijk ook prima.

Een korte reply helpt mij om problemen sneller te vinden.

Groet,
Dinesh`,
  };
}

async function hasInboundReplyAfter(email: string, after: Date): Promise<boolean> {
  const message = await prisma.emailMessage.findFirst({
    where: {
      email,
      direction: "inbound",
      OR: [{ receivedAt: { gte: after } }, { createdAt: { gte: after } }],
    },
    select: { id: true },
  });

  return Boolean(message);
}

async function findLatestOutboundTouch(email: string) {
  return prisma.emailMessage.findFirst({
    where: {
      email,
      direction: "outbound",
    },
    orderBy: [{ sentAt: "desc" }, { createdAt: "desc" }],
    select: {
      sentAt: true,
      createdAt: true,
    },
  });
}

async function ensureContact(candidate: Candidate, dryRun: boolean) {
  if (dryRun) return;

  await prisma.followupContact.upsert({
    where: { email: candidate.email },
    create: {
      email: candidate.email,
      userId: candidate.relatedUserId || undefined,
      source: candidate.source || candidate.type,
    },
    update: {
      userId: candidate.relatedUserId || undefined,
      source: candidate.source || undefined,
    },
  });
}

async function getContactStatus(email: string): Promise<string> {
  const contact = await prisma.followupContact.findUnique({
    where: { email },
    select: { status: true },
  });

  return contact?.status || "active";
}

async function upsertTask(candidate: Candidate, dryRun: boolean): Promise<ScanResult> {
  const email = normalizeEmail(candidate.email);
  if (isInternalOrTestEmail(email)) {
    return { candidate, action: "skipped", note: "internal_or_test_email" };
  }

  const contactStatus = await getContactStatus(email);
  if (contactStatus === "paused" || contactStatus === "do_not_contact") {
    return { candidate, action: "skipped", note: `contact_${contactStatus}` };
  }

  if (await hasInboundReplyAfter(email, daysAgo(30))) {
    return { candidate, action: "skipped", note: "recent_inbound_reply" };
  }

  if (dryRun) return { candidate, action: "dry_run" };

  await ensureContact(candidate, dryRun);

  const existing = await prisma.followupTask.findFirst({
    where: {
      email,
      type: candidate.type,
      relatedCvId: candidate.relatedCvId || null,
      relatedOrderId: candidate.relatedOrderId || null,
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (existing?.status === "sent") {
    return { candidate, action: "already_sent" };
  }

  if (existing?.status === "skipped" || existing?.status === "paused") {
    return { candidate, action: "skipped", note: `task_${existing.status}` };
  }

  const data = {
    email,
    type: candidate.type,
    status:
      candidate.type === "agency_outreach_no_reply"
        ? "approved"
        : existing?.status === "approved"
          ? "approved"
          : "draft",
    reason: candidate.reason,
    draftSubject: candidate.draftSubject,
    draftBody: candidate.draftBody,
    dueAt: candidate.dueAt,
    relatedUserId: candidate.relatedUserId || null,
    relatedCvId: candidate.relatedCvId || null,
    relatedOrderId: candidate.relatedOrderId || null,
  };

  if (existing) {
    await prisma.followupTask.update({
      where: { id: existing.id },
      data,
    });
    return { candidate, action: "updated" };
  }

  await prisma.followupTask.create({ data });
  return { candidate, action: "created" };
}

async function findPaidCustomerCandidates(days: number): Promise<Candidate[]> {
  const lowerBound = daysAgo(days);
  const testimonialCutoff = daysAgo(TESTIMONIAL_DELAY_DAYS);
  const orders = await prisma.order.findMany({
    where: {
      paidAt: {
        gte: lowerBound,
        lte: testimonialCutoff,
      },
    },
    select: {
      id: true,
      email: true,
      cvId: true,
      paidAt: true,
      product: true,
      sourceCluster: true,
    },
    orderBy: { paidAt: "desc" },
  });

  return orders
    .filter((order) => order.paidAt && !isInternalOrTestEmail(order.email))
    .map((order) => {
      const english = isEnglishContext(order.sourceCluster, null);
      const draft = paidCustomerDraft(order.email, english);
      const paidAt = order.paidAt || new Date();
      return {
        email: normalizeEmail(order.email),
        type: "paid_customer_testimonial",
        reason: `Paid ${order.product} order completed ${paidAt.toISOString()}; ask for product experience/testimonial after ${TESTIMONIAL_DELAY_DAYS} days.`,
        dueAt: new Date(paidAt.getTime() + TESTIMONIAL_DELAY_DAYS * DAY_MS),
        relatedCvId: order.cvId,
        relatedOrderId: order.id,
        source: order.sourceCluster || "paid_order",
        ...draft,
      };
    });
}

async function findCreatedCvNoPurchaseCandidates(days: number): Promise<Candidate[]> {
  const lowerBound = daysAgo(days);
  const cutoff = hoursAgo(CREATED_CV_DELAY_HOURS);

  const documents = await prisma.cVDocument.findMany({
    where: {
      createdAt: {
        gte: lowerBound,
        lte: cutoff,
      },
      userId: { not: null },
    },
    select: {
      id: true,
      title: true,
      createdAt: true,
      updatedAt: true,
      sourceCluster: true,
      sourceLocale: true,
      startSource: true,
      userId: true,
      user: {
        select: {
          email: true,
          sourcePath: true,
          sourceCluster: true,
          sourceLocale: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const candidates: Candidate[] = [];

  for (const document of documents) {
    const email = normalizeEmail(document.user?.email);
    if (isInternalOrTestEmail(email)) continue;

    const paidOrder = await prisma.order.findFirst({
      where: {
        OR: [
          { cvId: document.id, paidAt: { not: null } },
          {
            email,
            paidAt: { not: null },
            createdAt: { gte: document.createdAt },
          },
        ],
      },
      select: { id: true },
    });
    if (paidOrder) continue;

    const checkoutStarted = await prisma.analyticsEvent.findFirst({
      where: {
        cvId: document.id,
        event: { in: ["checkout_start", "checkout_started", "checkout_option_clicked"] },
      },
      select: { id: true },
    });
    if (checkoutStarted) continue;

    const path = document.user?.sourcePath || document.startSource;
    const locale = document.sourceLocale || document.user?.sourceLocale;
    const english = isEnglishContext(path, locale);
    const draft = createdCvNoPurchaseDraft(email, english);

    candidates.push({
      email,
      type: "created_cv_no_purchase",
      reason: `CV created ${document.createdAt.toISOString()} and no paid order after ${CREATED_CV_DELAY_HOURS} hours.`,
      dueAt: new Date(document.createdAt.getTime() + CREATED_CV_DELAY_HOURS * 60 * 60 * 1000),
      relatedUserId: document.userId,
      relatedCvId: document.id,
      source: document.sourceCluster || document.user?.sourceCluster || "cv_document",
      ...draft,
    });
  }

  return candidates;
}

async function findCheckoutNoPurchaseCandidates(days: number): Promise<Candidate[]> {
  const lowerBound = daysAgo(days);
  const cutoff = hoursAgo(CHECKOUT_DELAY_HOURS);

  const checkoutEvents = await prisma.analyticsEvent.findMany({
    where: {
      event: { in: ["checkout_start", "checkout_started", "checkout_option_clicked"] },
      cvId: { not: null },
      createdAt: {
        gte: lowerBound,
        lte: cutoff,
      },
    },
    select: {
      cvId: true,
      createdAt: true,
      path: true,
      cluster: true,
    },
    distinct: ["cvId"],
    orderBy: { createdAt: "desc" },
  });

  const candidates: Candidate[] = [];

  for (const event of checkoutEvents) {
    if (!event.cvId) continue;

    const document = await prisma.cVDocument.findUnique({
      where: { id: event.cvId },
      select: {
        id: true,
        userId: true,
        sourceLocale: true,
        user: {
          select: {
            email: true,
            sourcePath: true,
            sourceLocale: true,
            sourceCluster: true,
          },
        },
      },
    });
    const email = normalizeEmail(document?.user?.email);
    if (!document || isInternalOrTestEmail(email)) continue;

    const paidOrder = await prisma.order.findFirst({
      where: {
        OR: [
          { cvId: event.cvId, paidAt: { not: null } },
          { email, paidAt: { not: null }, createdAt: { gte: event.createdAt } },
        ],
      },
      select: { id: true },
    });
    if (paidOrder) continue;

    const english = isEnglishContext(event.path || document.user?.sourcePath, document.sourceLocale || document.user?.sourceLocale);
    const draft = checkoutNoPurchaseDraft(email, english);

    candidates.push({
      email,
      type: "checkout_no_purchase",
      reason: `Checkout intent recorded ${event.createdAt.toISOString()} but no paid order after ${CHECKOUT_DELAY_HOURS} hours.`,
      dueAt: new Date(event.createdAt.getTime() + CHECKOUT_DELAY_HOURS * 60 * 60 * 1000),
      relatedUserId: document.userId,
      relatedCvId: event.cvId,
      source: event.cluster || document.user?.sourceCluster || "checkout_event",
      ...draft,
    });
  }

  return candidates;
}

async function findAgencyOutreachCandidates(days: number): Promise<Candidate[]> {
  const lowerBound = daysAgo(days);
  const rows = readAgencyTrackerRows().filter((row) => (row.status || "").toLowerCase() === "ready_to_send");
  const candidates: Candidate[] = [];

  for (const row of rows) {
    const email = normalizeEmail(row.contact_email);
    if (isInternalOrTestEmail(email)) continue;

    const latestOutbound = await findLatestOutboundTouch(email);
    const trackerAnchor =
      parseDate(row.last_touch_date) || parseDate(row.first_outreach_date) || parseDate(row.next_step_date);
    const outboundAt = latestOutbound?.sentAt || latestOutbound?.createdAt || trackerAnchor;
    if (!outboundAt) continue;

    if (outboundAt > lowerBound) continue;

    if (await hasInboundReplyAfter(email, outboundAt)) continue;

    const dueAt = new Date(outboundAt.getTime() + AGENCY_FOLLOWUP_DELAY_DAYS * DAY_MS);
    const draft = agencyFollowupDraft(row);
    candidates.push({
      email,
      type: "agency_outreach_no_reply",
      reason: `Agency outreach was last touched on ${outboundAt.toISOString()} and no inbound reply has been recorded after ${AGENCY_FOLLOWUP_DELAY_DAYS} days.`,
      dueAt,
      source: "agency_tracker",
      ...draft,
    });
  }

  return candidates;
}

function printResults(results: ScanResult[], dryRun: boolean) {
  const due = results.filter((result) => result.candidate.dueAt <= new Date());
  const byAction = results.reduce<Record<string, number>>((acc, result) => {
    acc[result.action] = (acc[result.action] || 0) + 1;
    return acc;
  }, {});

  console.log(`Followup scan ${dryRun ? "(dry run)" : ""}`);
  console.log(`Candidates: ${results.length}`);
  console.table(byAction);
  console.log("");

  if (due.length === 0) {
    console.log("No due followups found.");
    return;
  }

  console.log("Due followups");
  console.table(
    due.map((result) => ({
      action: result.action,
      type: result.candidate.type,
      email: result.candidate.email,
      due_at: result.candidate.dueAt.toISOString(),
      subject: result.candidate.draftSubject,
      note: result.note || "",
    }))
  );

  for (const result of due) {
    console.log("");
    console.log("------------------------------------------------------------");
    console.log(`${result.candidate.type} -> ${result.candidate.email}`);
    console.log(`Reason: ${result.candidate.reason}`);
    console.log(`Subject: ${result.candidate.draftSubject}`);
    console.log(result.candidate.draftBody);
  }
}

async function main() {
  const { dryRun, days } = parseArgs();

  const candidates = [
    ...(await findPaidCustomerCandidates(days)),
    ...(await findCreatedCvNoPurchaseCandidates(days)),
    ...(await findCheckoutNoPurchaseCandidates(days)),
    ...(await findAgencyOutreachCandidates(days)),
  ];

  const uniqueCandidates = new Map<string, Candidate>();
  for (const candidate of candidates) {
    const key = `${candidate.email}:${candidate.type}:${candidate.relatedCvId || ""}:${candidate.relatedOrderId || ""}`;
    if (!uniqueCandidates.has(key)) uniqueCandidates.set(key, candidate);
  }

  const results: ScanResult[] = [];
  for (const candidate of uniqueCandidates.values()) {
    results.push(await upsertTask(candidate, dryRun));
  }

  printResults(results, dryRun);
}

main()
  .catch((error) => {
    console.error("followups_scan_failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
