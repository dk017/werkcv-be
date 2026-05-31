import nodemailer from "nodemailer";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { siteConfig } from "@/config/site";
import { getPathCluster, sanitizeAttribution } from "@/lib/attribution";
import { contactPayloadSchema, getContactSubjectLabel } from "@/lib/contact";
import { prisma } from "@/lib/prisma";

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

function getContactRecipient(): string {
  return process.env.CONTACT_TO_EMAIL || process.env.B2B_LEADS_TO || siteConfig.contactEmail;
}

function getEmailDomain(email: string): string {
  return email.split("@")[1] || "";
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatAttributionForEmail(attribution: ReturnType<typeof sanitizeAttribution>) {
  if (!attribution) {
    return "Geen client-side attribution meegestuurd.";
  }

  return [
    `first_touch_path: ${attribution.firstTouchPath}`,
    `first_touch_cluster: ${attribution.firstTouchCluster}`,
    `first_touch_referrer: ${attribution.firstTouchReferrer || "-"}`,
    `utm_source: ${attribution.utmSource || "-"}`,
    `utm_medium: ${attribution.utmMedium || "-"}`,
    `utm_campaign: ${attribution.utmCampaign || "-"}`,
    `gclid: ${attribution.gclid || "-"}`,
    `fbclid: ${attribution.fbclid || "-"}`,
    `msclkid: ${attribution.msclkid || "-"}`,
  ].join("\n");
}

function isDatabaseUnavailable(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError && error.code === "ECONNREFUSED"
  );
}

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const parsed = contactPayloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Controleer de ingevulde velden.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  if (parsed.data.website) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const transporter = getEmailTransporter();
  if (!transporter) {
    console.error("contact_email_unavailable");
    return NextResponse.json(
      { error: "Contact e-mail is niet geconfigureerd." },
      { status: 500 }
    );
  }

  const attribution = sanitizeAttribution(parsed.data.attribution);
  const cluster = attribution?.firstTouchCluster || getPathCluster(parsed.data.pagePath);
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const userAgent = request.headers.get("user-agent") || "unknown";
  const from = process.env.AUTH_FROM_EMAIL || process.env.SMTP_USER || `noreply@${siteConfig.domain}`;
  const subjectLabel = getContactSubjectLabel(parsed.data.subject);
  const emailSubject = `[WerkCV Contact] ${subjectLabel} - ${parsed.data.name}`;
  const safeMessageHtml = escapeHtml(parsed.data.message).replace(/\n/g, "<br />");

  const messageLines = [
    `Pagina: ${parsed.data.pagePath}`,
    `Naam: ${parsed.data.name}`,
    `E-mail: ${parsed.data.email}`,
    `Onderwerp: ${subjectLabel}`,
    "",
    "Bericht:",
    parsed.data.message,
    "",
    `IP: ${ip}`,
    `User-Agent: ${userAgent}`,
    "",
    "Attribution:",
    formatAttributionForEmail(attribution),
  ];

  try {
    await transporter.sendMail({
      from,
      to: getContactRecipient(),
      replyTo: parsed.data.email,
      subject: emailSubject,
      text: messageLines.join("\n"),
      html: `
        <h2>Nieuw contactbericht via WerkCV</h2>
        <p><strong>Pagina:</strong> ${escapeHtml(parsed.data.pagePath)}</p>
        <p><strong>Naam:</strong> ${escapeHtml(parsed.data.name)}</p>
        <p><strong>E-mail:</strong> ${escapeHtml(parsed.data.email)}</p>
        <p><strong>Onderwerp:</strong> ${escapeHtml(subjectLabel)}</p>
        <p><strong>Bericht:</strong><br />${safeMessageHtml}</p>
        <hr />
        <p><strong>IP:</strong> ${escapeHtml(ip)}</p>
        <p><strong>User-Agent:</strong> ${escapeHtml(userAgent)}</p>
        <pre>${escapeHtml(formatAttributionForEmail(attribution))}</pre>
      `,
    });
  } catch (error) {
    console.error("contact_email_failed", error);
    return NextResponse.json(
      { error: "Verzenden mislukt. Probeer het opnieuw." },
      { status: 500 }
    );
  }

  try {
    await prisma.analyticsEvent.create({
      data: {
        event: "contact_message_received",
        path: parsed.data.pagePath,
        cluster,
        properties: {
          subject: parsed.data.subject,
          subjectLabel,
          emailDomain: getEmailDomain(parsed.data.email),
          hasMessage: Boolean(parsed.data.message),
        } as Prisma.InputJsonValue,
        attribution: (attribution || undefined) as Prisma.InputJsonValue | undefined,
      },
    });
  } catch (error) {
    if (isDatabaseUnavailable(error)) {
      console.warn("contact_message_persist_skipped: database unavailable");
    } else {
      console.error("contact_message_persist_failed", error);
    }
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
