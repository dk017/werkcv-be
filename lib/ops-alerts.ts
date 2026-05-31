import nodemailer from "nodemailer";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type UiLocale = "nl" | "en";

export type OpsIncidentEvent =
  | "ops_checkout_create_failed"
  | "ops_pdf_generation_failed"
  | "ops_payment_webhook_failed";

type ReportOpsIncidentInput = {
  event: OpsIncidentEvent;
  route: string;
  stage: string;
  error: unknown;
  cvId?: string | null;
  orderId?: string | null;
  userId?: string | null;
  userEmail?: string | null;
  cluster?: string | null;
  startSource?: string | null;
  locale?: UiLocale;
  notifyUser?: boolean;
  context?: Record<string, unknown>;
};

type ReportOpsIncidentResult = {
  supportNotified: boolean;
  userNotified: boolean;
};

const OPS_EMAIL_DEDUPE_WINDOW_MINUTES = 20;

function getEmailTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

function getOpsRecipient(): string {
  return process.env.OPS_ALERTS_TO || process.env.CONTACT_TO_EMAIL || process.env.B2B_LEADS_TO || "contact@werkcv.nl";
}

function getFromEmail(): string {
  return process.env.AUTH_FROM_EMAIL || process.env.SMTP_USER || "noreply@werkcv.nl";
}

function isValidEmail(value: string | null | undefined): value is string {
  return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getErrorName(error: unknown): string {
  if (error instanceof Error && error.name) return error.name;
  if (typeof error === "object" && error !== null) return "object";
  return typeof error;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message.slice(0, 1000);

  try {
    return JSON.stringify(error).slice(0, 1000);
  } catch {
    return String(error).slice(0, 1000);
  }
}

function getErrorStack(error: unknown): string | null {
  if (error instanceof Error && error.stack) {
    return error.stack.slice(0, 4000);
  }
  return null;
}

function formatJson(value: unknown): string {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

function getUserEmailSubject(event: OpsIncidentEvent, locale: UiLocale): string {
  if (event === "ops_pdf_generation_failed") {
    return locale === "en"
      ? "We noticed a technical issue while preparing your PDF"
      : "We zagen een technisch probleem bij het maken van je PDF";
  }

  return locale === "en"
    ? "We noticed a technical issue while starting your checkout"
    : "We zagen een technisch probleem bij het starten van je betaling";
}

function getUserEmailText(event: OpsIncidentEvent, locale: UiLocale): string {
  const issueLine =
    event === "ops_pdf_generation_failed"
      ? locale === "en"
        ? "We ran into a technical issue on our side while preparing your CV PDF."
        : "We liepen tegen een technisch probleem aan onze kant aan tijdens het maken van je CV-PDF."
      : locale === "en"
        ? "We ran into a technical issue on our side while starting your checkout."
        : "We liepen tegen een technisch probleem aan onze kant aan tijdens het starten van je betaling.";

  const reviewLine =
    locale === "en"
      ? "Our team has been notified automatically and will review this as soon as possible."
      : "Ons team is automatisch op de hoogte gebracht en bekijkt dit zo snel mogelijk.";

  const contactLine =
    locale === "en"
      ? "If needed, we will contact you at this email address. You can also reply to this message if the issue is urgent."
      : "Als het nodig is, nemen we contact op via dit e-mailadres. Je kunt ook op deze mail reageren als het dringend is.";

  return [issueLine, "", reviewLine, "", contactLine, "", "WerkCV"].join("\n");
}

export function getSupportNotifiedMessage(locale: UiLocale = "nl"): string {
  return locale === "en"
    ? "We hit a technical issue on our side. Our team has been notified and will review it shortly. If needed, we will contact you at your email address."
    : "We hebben een technisch probleem aan onze kant gedetecteerd. Ons team is op de hoogte en bekijkt dit zo snel mogelijk. Als het nodig is, nemen we contact op via je e-mailadres.";
}

async function hasRecentOpsEmail(
  event: OpsIncidentEvent,
  cvId: string | null | undefined,
  route: string,
  stage: string
) {
  const since = new Date(Date.now() - OPS_EMAIL_DEDUPE_WINDOW_MINUTES * 60 * 1000);
  const where: Prisma.AnalyticsEventWhereInput = {
    event,
    createdAt: { gte: since },
  };

  if (cvId) {
    where.cvId = cvId;
  } else {
    where.path = route;
  }

  const existing = await prisma.analyticsEvent.findMany({
    where,
    select: { properties: true },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return existing.some((item) => {
    if (!item.properties || typeof item.properties !== "object" || Array.isArray(item.properties)) {
      return false;
    }

    const recordStage = "stage" in item.properties ? item.properties.stage : null;
    return recordStage === stage;
  });
}

async function formatRecentCvEvents(cvId: string | null | undefined): Promise<string> {
  if (!cvId) {
    return "No cvId available.";
  }

  const events = await prisma.analyticsEvent.findMany({
    where: { cvId },
    orderBy: { createdAt: "desc" },
    take: 8,
    select: {
      event: true,
      path: true,
      properties: true,
      createdAt: true,
    },
  });

  if (events.length === 0) {
    return "No recent analytics events found for this cvId.";
  }

  return events
    .reverse()
    .map((event) => {
      const parts = [
        event.createdAt.toISOString(),
        event.event,
        event.path ? `path=${event.path}` : null,
        event.properties ? `properties=${formatJson(event.properties)}` : null,
      ].filter(Boolean);

      return parts.join(" | ");
    })
    .join("\n");
}

function buildOpsEmailText(input: ReportOpsIncidentInput, recentEvents: string): string {
  const context = input.context ? formatJson(input.context) : "{}";
  const stack = getErrorStack(input.error) || "-";

  return [
    "WerkCV blocker alert",
    "",
    `Event: ${input.event}`,
    `Route: ${input.route}`,
    `Stage: ${input.stage}`,
    `Time: ${new Date().toISOString()}`,
    `Environment: ${process.env.NODE_ENV || "unknown"}`,
    `cvId: ${input.cvId || "-"}`,
    `orderId: ${input.orderId || "-"}`,
    `userId: ${input.userId || "-"}`,
    `userEmail: ${input.userEmail || "-"}`,
    `cluster: ${input.cluster || "-"}`,
    `startSource: ${input.startSource || "-"}`,
    `errorName: ${getErrorName(input.error)}`,
    `errorMessage: ${getErrorMessage(input.error)}`,
    "",
    "Context:",
    context,
    "",
    "Recent funnel events:",
    recentEvents,
    "",
    "Stack:",
    stack,
  ].join("\n");
}

export async function reportOpsIncident(input: ReportOpsIncidentInput): Promise<ReportOpsIncidentResult> {
  const locale = input.locale || "nl";
  let shouldSendEmail = true;

  try {
    shouldSendEmail = !(await hasRecentOpsEmail(input.event, input.cvId, input.route, input.stage));
  } catch (error) {
    console.error(`${input.event}_dedupe_check_failed`, error);
  }

  const safeProperties = {
    route: input.route,
    stage: input.stage,
    cvId: input.cvId || null,
    orderId: input.orderId || null,
    userId: input.userId || null,
    userEmail: input.userEmail || null,
    cluster: input.cluster || null,
    startSource: input.startSource || null,
    errorName: getErrorName(input.error),
    errorMessage: getErrorMessage(input.error),
    errorStack: getErrorStack(input.error),
    context: input.context || {},
  };

  try {
    await prisma.analyticsEvent.create({
      data: {
        event: input.event,
        cvId: input.cvId || null,
        orderId: input.orderId || null,
        path: input.route,
        cluster: input.cluster || null,
        properties: safeProperties as Prisma.InputJsonValue,
      },
    });
  } catch (persistError) {
    console.error(`${input.event}_persist_failed`, persistError);
  }

  const transporter = getEmailTransporter();
  if (!transporter) {
    console.error(`${input.event}_email_unavailable`);
    return { supportNotified: false, userNotified: false };
  }

  let supportNotified = false;
  let userNotified = false;

  try {
    if (!shouldSendEmail) {
      return { supportNotified: true, userNotified: false };
    }

    const recentEvents = await formatRecentCvEvents(input.cvId);
    const subjectTarget = input.userEmail || input.cvId || input.route;

    await transporter.sendMail({
      from: getFromEmail(),
      to: getOpsRecipient(),
      replyTo: isValidEmail(input.userEmail) ? input.userEmail : undefined,
      subject: `[WerkCV blocker] ${input.event} - ${subjectTarget}`,
      text: buildOpsEmailText(input, recentEvents),
      html: `
        <h2>WerkCV blocker alert</h2>
        <p><strong>Event:</strong> ${escapeHtml(input.event)}</p>
        <p><strong>Route:</strong> ${escapeHtml(input.route)}</p>
        <p><strong>Stage:</strong> ${escapeHtml(input.stage)}</p>
        <p><strong>Time:</strong> ${escapeHtml(new Date().toISOString())}</p>
        <p><strong>Environment:</strong> ${escapeHtml(process.env.NODE_ENV || "unknown")}</p>
        <p><strong>cvId:</strong> ${escapeHtml(input.cvId || "-")}</p>
        <p><strong>orderId:</strong> ${escapeHtml(input.orderId || "-")}</p>
        <p><strong>userId:</strong> ${escapeHtml(input.userId || "-")}</p>
        <p><strong>userEmail:</strong> ${escapeHtml(input.userEmail || "-")}</p>
        <p><strong>cluster:</strong> ${escapeHtml(input.cluster || "-")}</p>
        <p><strong>startSource:</strong> ${escapeHtml(input.startSource || "-")}</p>
        <p><strong>errorName:</strong> ${escapeHtml(getErrorName(input.error))}</p>
        <p><strong>errorMessage:</strong> ${escapeHtml(getErrorMessage(input.error))}</p>
        <h3>Context</h3>
        <pre>${escapeHtml(formatJson(input.context || {}))}</pre>
        <h3>Recent funnel events</h3>
        <pre>${escapeHtml(recentEvents)}</pre>
        <h3>Stack</h3>
        <pre>${escapeHtml(getErrorStack(input.error) || "-")}</pre>
      `,
    });
    supportNotified = true;
  } catch (emailError) {
    console.error(`${input.event}_email_failed`, emailError);
    return { supportNotified: false, userNotified: false };
  }

  if (!input.notifyUser || !isValidEmail(input.userEmail)) {
    return { supportNotified, userNotified };
  }

  try {
    await transporter.sendMail({
      from: getFromEmail(),
      to: input.userEmail,
      replyTo: getOpsRecipient(),
      subject: getUserEmailSubject(input.event, locale),
      text: getUserEmailText(input.event, locale),
      html: getUserEmailText(input.event, locale)
        .split("\n\n")
        .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
        .join(""),
    });
    userNotified = true;
  } catch (emailError) {
    console.error(`${input.event}_user_email_failed`, emailError);
  }

  return { supportNotified, userNotified };
}
