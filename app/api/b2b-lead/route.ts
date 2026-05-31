import nodemailer from "nodemailer";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { siteConfig } from "@/config/site";
import { getPathCluster, sanitizeAttribution } from "@/lib/attribution";
import { b2bLeadPayloadSchema, getB2BLeadPageLabel } from "@/lib/b2b-leads";
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

function getLeadRecipient(): string {
  return process.env.B2B_LEADS_TO || process.env.CONTACT_TO_EMAIL || siteConfig.contactEmail;
}

function getLeadEmailDomain(email: string): string {
  return email.split("@")[1] || "";
}

function isDatabaseUnavailable(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError && error.code === "ECONNREFUSED"
  );
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

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const parsed = b2bLeadPayloadSchema.safeParse(body);
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
    console.error("b2b_lead_email_unavailable");
    return NextResponse.json(
      { error: "Lead e-mail is niet geconfigureerd." },
      { status: 500 }
    );
  }

  const attribution = sanitizeAttribution(parsed.data.attribution);
  const cluster = attribution?.firstTouchCluster || getPathCluster(parsed.data.pagePath);
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const userAgent = request.headers.get("user-agent") || "unknown";
  const from = process.env.AUTH_FROM_EMAIL || process.env.SMTP_USER || `noreply@${siteConfig.domain}`;
  const pageLabel = getB2BLeadPageLabel(parsed.data.pageType);
  const subject = `[WerkCV B2B] ${pageLabel} - ${parsed.data.organization}`;

  const messageLines = [
    `Pagina: ${pageLabel}`,
    `Path: ${parsed.data.pagePath}`,
    `Naam: ${parsed.data.name}`,
    `Werk e-mail: ${parsed.data.workEmail}`,
    `Organisatie: ${parsed.data.organization}`,
    `Rol: ${parsed.data.role}`,
    `Type doelgroep / organisatie: ${parsed.data.audienceType}`,
    `Volume of bereik: ${parsed.data.monthlyVolume}`,
    `Timing: ${parsed.data.timeline}`,
    "",
    "Doel / use case:",
    parsed.data.goal,
    "",
    "Extra context:",
    parsed.data.notes || "-",
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
      to: getLeadRecipient(),
      replyTo: parsed.data.workEmail,
      subject,
      text: messageLines.join("\n"),
      html: `
        <h2>${pageLabel}</h2>
        <p><strong>Path:</strong> ${parsed.data.pagePath}</p>
        <p><strong>Naam:</strong> ${parsed.data.name}</p>
        <p><strong>Werk e-mail:</strong> ${parsed.data.workEmail}</p>
        <p><strong>Organisatie:</strong> ${parsed.data.organization}</p>
        <p><strong>Rol:</strong> ${parsed.data.role}</p>
        <p><strong>Type doelgroep / organisatie:</strong> ${parsed.data.audienceType}</p>
        <p><strong>Volume of bereik:</strong> ${parsed.data.monthlyVolume}</p>
        <p><strong>Timing:</strong> ${parsed.data.timeline}</p>
        <p><strong>Doel / use case:</strong><br />${parsed.data.goal.replace(/\n/g, "<br />")}</p>
        <p><strong>Extra context:</strong><br />${(parsed.data.notes || "-").replace(/\n/g, "<br />")}</p>
        <hr />
        <p><strong>IP:</strong> ${ip}</p>
        <p><strong>User-Agent:</strong> ${userAgent}</p>
        <pre>${formatAttributionForEmail(attribution)}</pre>
      `,
    });
  } catch (error) {
    console.error("b2b_lead_email_failed", error);
    return NextResponse.json(
      { error: "Verzenden mislukt. Probeer het opnieuw." },
      { status: 500 }
    );
  }

  try {
    await prisma.analyticsEvent.create({
      data: {
        event: "b2b_lead_submitted",
        path: parsed.data.pagePath,
        cluster,
        properties: {
          pageType: parsed.data.pageType,
          organization: parsed.data.organization,
          role: parsed.data.role,
          audienceType: parsed.data.audienceType,
          monthlyVolume: parsed.data.monthlyVolume,
          timeline: parsed.data.timeline,
          workEmailDomain: getLeadEmailDomain(parsed.data.workEmail),
          hasNotes: Boolean(parsed.data.notes),
        } as Prisma.InputJsonValue,
        attribution: (attribution || undefined) as Prisma.InputJsonValue | undefined,
      },
    });
  } catch (error) {
    if (isDatabaseUnavailable(error)) {
      console.warn("b2b_lead_persist_skipped: database unavailable");
    } else {
      console.error("b2b_lead_persist_failed", error);
    }
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
