import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getDodoSiteHost, verifyDodoWebhookSignature } from "@/lib/dodo";
import { reportOpsIncident } from "@/lib/ops-alerts";
import { CV_DOWNLOAD_PRODUCT } from "@/lib/polar";

export const runtime = "nodejs";

const WEBHOOK_SECRET = process.env.DODO_WEBHOOK_SECRET || process.env.DODO_PAYMENTS_WEBHOOK_KEY;

type DodoWebhookEvent = {
  business_id?: string;
  type?: string;
  timestamp?: string;
  data?: DodoPaymentPayload;
};

type DodoPaymentPayload = {
  payload_type?: string;
  payment_id?: string;
  id?: string;
  checkout_session_id?: string | null;
  customer?: {
    email?: string | null;
    name?: string | null;
  } | null;
  metadata?: Record<string, unknown> | null;
  total_amount?: number | null;
  amount?: number | null;
  currency?: string | null;
  settlement_currency?: string | null;
  status?: string | null;
  payment_method?: string | null;
  payment_method_type?: string | null;
};

type PrismaWithAttributionExtensions = typeof prisma & {
  cVDocument: {
    findUnique: (args: { where: { id: string }; select: Record<string, boolean> }) => Promise<{
      attribution?: unknown;
      sourceCluster?: string | null;
    } | null>;
  };
  paymentCheckout: {
    findUnique: (args: { where: { externalCheckoutId: string } }) => Promise<{
      cvId?: string | null;
      siteHost?: string | null;
    } | null>;
    updateMany: (args: {
      where: { externalCheckoutId: string };
      data: { completedAt: Date };
    }) => Promise<unknown>;
  };
  order: {
    create: (args: { data: Record<string, unknown> }) => Promise<{ id: string }>;
  };
  analyticsEvent?: {
    create: (args: { data: Record<string, unknown> }) => Promise<unknown>;
  };
};

function metadataString(metadata: Record<string, unknown> | null | undefined, key: string): string | null {
  const raw = metadata?.[key];
  if (typeof raw === "string") return raw;
  if (typeof raw === "number") return String(raw);
  if (typeof raw === "boolean") return String(raw);
  return null;
}

function readAmountCents(data: DodoPaymentPayload): number | null {
  if (typeof data.total_amount === "number") return data.total_amount;
  if (typeof data.amount === "number") return data.amount;
  return null;
}

function readCurrency(data: DodoPaymentPayload): string {
  return (data.currency || data.settlement_currency || "EUR").toUpperCase();
}

export async function POST(request: NextRequest) {
  const prismaWithAttributionExtensions = prisma as unknown as PrismaWithAttributionExtensions;

  if (!WEBHOOK_SECRET) {
    console.error("DODO_WEBHOOK_SECRET is not configured");
    await reportOpsIncident({
      event: "ops_payment_webhook_failed",
      route: "/api/webhooks/dodo",
      stage: "missing_webhook_secret",
      error: new Error("DODO_WEBHOOK_SECRET is not configured"),
      notifyUser: false,
    });
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const rawBody = await request.text();
  const signatureValid = verifyDodoWebhookSignature({
    rawBody,
    webhookId: request.headers.get("webhook-id"),
    webhookTimestamp: request.headers.get("webhook-timestamp"),
    webhookSignature: request.headers.get("webhook-signature"),
    secret: WEBHOOK_SECRET,
  });

  if (!signatureValid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: DodoWebhookEvent;
  try {
    event = JSON.parse(rawBody) as DodoWebhookEvent;
  } catch (error) {
    console.error("Failed to parse Dodo webhook event", error);
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  if (event.type !== "payment.succeeded") {
    return NextResponse.json({ status: "ignored" });
  }

  const data = event.data;
  if (!data) {
    return NextResponse.json({ error: "Missing payment payload" }, { status: 400 });
  }

  const metadata = data.metadata || {};
  const cvId = metadataString(metadata, "cv_id") || metadataString(metadata, "cvId");
  const product = metadataString(metadata, "product") || CV_DOWNLOAD_PRODUCT;
  const email = data.customer?.email || metadataString(metadata, "email") || "";
  const eventSiteHost = metadataString(metadata, "site_host")?.toLowerCase() || null;
  const expectedSiteHost = getDodoSiteHost();
  const externalPaymentId = data.payment_id || data.id || data.checkout_session_id;
  const checkoutSessionId = data.checkout_session_id || null;
  const amountCents = readAmountCents(data);
  const currency = readCurrency(data);
  const localCheckout = checkoutSessionId
    ? await prismaWithAttributionExtensions.paymentCheckout.findUnique({
        where: { externalCheckoutId: checkoutSessionId },
      })
    : null;

  if (expectedSiteHost && eventSiteHost && eventSiteHost !== expectedSiteHost) {
    return NextResponse.json({ status: "ignored", reason: "site_host_mismatch" });
  }

  if (expectedSiteHost && localCheckout?.siteHost && localCheckout.siteHost !== expectedSiteHost) {
    return NextResponse.json({ status: "ignored", reason: "checkout_site_host_mismatch" });
  }

  if (!externalPaymentId) {
    await reportOpsIncident({
      event: "ops_payment_webhook_failed",
      route: "/api/webhooks/dodo",
      stage: "missing_payment_id",
      error: new Error("Missing Dodo payment_id"),
      cvId,
      userEmail: email,
      notifyUser: false,
      context: {
        eventType: event.type,
        metadata,
      },
    });
    return NextResponse.json({ error: "Missing payment_id" }, { status: 400 });
  }

  const existingOrder = await prisma.order.findUnique({
    where: { lemonId: externalPaymentId },
  });

  if (existingOrder) {
    return NextResponse.json({ status: "already_processed" });
  }

  if (!cvId) {
    await reportOpsIncident({
      event: "ops_payment_webhook_failed",
      route: "/api/webhooks/dodo",
      stage: "missing_cv_id_metadata",
      error: new Error("Missing cv_id metadata"),
      userEmail: email,
      notifyUser: false,
      context: {
        dodoPaymentId: externalPaymentId,
        metadata,
      },
    });
    return NextResponse.json({ error: "Missing cv_id metadata" }, { status: 400 });
  }

  const cvDocument = await prismaWithAttributionExtensions.cVDocument.findUnique({
    where: { id: cvId },
    select: {
      id: true,
      attribution: true,
      sourceCluster: true,
    },
  });

  if (!cvDocument) {
    if (checkoutSessionId && !localCheckout && !eventSiteHost) {
      console.warn(
        JSON.stringify({
          type: "payment_webhook_ignored",
          provider: "dodo",
          reason: "checkout_session_not_owned",
          expectedSiteHost,
          dodoPaymentId: externalPaymentId,
          checkoutSessionId,
          cvId,
        })
      );
      return NextResponse.json({ status: "ignored", reason: "checkout_session_not_owned" });
    }

    await reportOpsIncident({
      event: "ops_payment_webhook_failed",
      route: "/api/webhooks/dodo",
      stage: "cv_not_found_for_payment",
      error: new Error("CV not found for payment webhook"),
      cvId,
      userEmail: email,
      notifyUser: false,
      context: {
        dodoPaymentId: externalPaymentId,
        checkoutSessionId,
        metadata,
        eventSiteHost,
        expectedSiteHost,
        localCheckoutSiteHost: localCheckout?.siteHost || null,
      },
    });
    return NextResponse.json({ status: "ignored", reason: "cv_not_found" });
  }

  let order;
  try {
    order = await prismaWithAttributionExtensions.order.create({
      data: {
        email,
        cvId,
        product: product === CV_DOWNLOAD_PRODUCT ? CV_DOWNLOAD_PRODUCT : product,
        amountCents,
        currency,
        attribution: (cvDocument?.attribution || undefined) as unknown as Prisma.InputJsonValue | undefined,
        sourceCluster: cvDocument?.sourceCluster || null,
        lemonId: externalPaymentId,
        paidAt: new Date(),
      },
    });
  } catch (error) {
    await reportOpsIncident({
      event: "ops_payment_webhook_failed",
      route: "/api/webhooks/dodo",
      stage: "order_create_fallback",
      error,
      cvId,
      userEmail: email,
      cluster: cvDocument?.sourceCluster || null,
      notifyUser: false,
      context: {
        dodoPaymentId: externalPaymentId,
        amountCents,
        currency,
        product,
      },
    });

    order = await prisma.order.create({
      data: {
        email,
        cvId,
        product,
        lemonId: externalPaymentId,
        paidAt: new Date(),
      },
    });
  }

  const paidProperties = {
    cvId,
    orderId: order.id,
    amountCents,
    currency,
    product,
    dodoPaymentId: externalPaymentId,
    dodoCheckoutSessionId: data.checkout_session_id || null,
    paymentMethod: data.payment_method || null,
    paymentMethodType: data.payment_method_type || null,
  };

  if (checkoutSessionId) {
    try {
      await prismaWithAttributionExtensions.paymentCheckout.updateMany({
        where: { externalCheckoutId: checkoutSessionId },
        data: { completedAt: new Date() },
      });
    } catch (error) {
      console.error("dodo_checkout_session_complete_failed", error);
    }
  }

  try {
    await prismaWithAttributionExtensions.analyticsEvent?.create({
      data: {
        event: "paid",
        cvId,
        orderId: order.id,
        cluster: cvDocument?.sourceCluster || null,
        properties: paidProperties as unknown as Prisma.InputJsonValue,
        attribution: (cvDocument?.attribution || undefined) as unknown as Prisma.InputJsonValue | undefined,
      },
    });
  } catch (error) {
    console.error("dodo_paid_event_persist_failed", error);
  }

  try {
    await prismaWithAttributionExtensions.analyticsEvent?.create({
      data: {
        event: "checkout_completed",
        cvId,
        orderId: order.id,
        cluster: cvDocument?.sourceCluster || null,
        properties: paidProperties as unknown as Prisma.InputJsonValue,
        attribution: (cvDocument?.attribution || undefined) as unknown as Prisma.InputJsonValue | undefined,
      },
    });
  } catch (error) {
    console.error("dodo_checkout_completed_event_persist_failed", error);
  }

  console.log(
    JSON.stringify({
      type: "analytics",
      event: "paid",
      properties: paidProperties,
      cluster: cvDocument?.sourceCluster || null,
    })
  );

  return NextResponse.json({ status: "ok" });
}
