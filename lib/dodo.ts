import { createHmac, timingSafeEqual } from "crypto";
import { getEditorPathForLanguage, getSuccessPathForLanguage } from "@/lib/editor-path";
import type { ResumeLanguage } from "@/lib/resume-language";
import { CV_DOWNLOAD_PRODUCT } from "@/lib/polar";
import type { CheckoutAddon, CheckoutProduct } from "@/lib/polar";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const DODO_API_KEY = process.env.DODO_API_KEY || process.env.DODO_PAYMENTS_API_KEY;
const DODO_PRODUCT_ID = process.env.DODO_PRODUCT_ID;
const DODO_ENVIRONMENT =
  process.env.DODO_ENVIRONMENT || process.env.DODO_PAYMENTS_ENVIRONMENT || "live_mode";

const DODO_API_BASE =
  DODO_ENVIRONMENT === "test_mode" || DODO_ENVIRONMENT === "test"
    ? "https://test.dodopayments.com"
    : "https://live.dodopayments.com";

type DodoCheckoutResponse = {
  session_id?: string;
  checkout_url?: string;
};

export function isDodoEnabledForCheckout(
  checkoutProduct: CheckoutProduct,
  selectedAddons: CheckoutAddon[] = []
): boolean {
  return (
    process.env.PAYMENT_PROVIDER === "dodo" &&
    checkoutProduct === CV_DOWNLOAD_PRODUCT &&
    selectedAddons.length === 0
  );
}

export async function buildDodoCheckoutURL(
  cvId: string,
  email: string | undefined,
  resumeLanguage: ResumeLanguage = "nl"
): Promise<string> {
  if (!DODO_API_KEY) {
    throw new Error("DODO_API_KEY is not configured");
  }
  if (!DODO_PRODUCT_ID) {
    throw new Error("DODO_PRODUCT_ID is not configured");
  }

  const isDutchCheckout = resumeLanguage === "nl";
  const body: Record<string, unknown> = {
    product_cart: [{ product_id: DODO_PRODUCT_ID, quantity: 1 }],
    allowed_payment_method_types: isDutchCheckout
      ? ["ideal", "credit", "debit", "apple_pay", "google_pay"]
      : ["credit", "debit", "apple_pay", "google_pay"],
    billing_currency: "EUR",
    return_url: `${APP_URL}${getSuccessPathForLanguage(resumeLanguage, cvId)}`,
    cancel_url: `${APP_URL}${getEditorPathForLanguage(resumeLanguage, cvId)}`,
    metadata: {
      cv_id: cvId,
      product: CV_DOWNLOAD_PRODUCT,
      provider: "dodo",
    },
    customization: {
      show_order_details: true,
      theme: "light",
    },
    feature_flags: {
      allow_currency_selection: false,
      allow_discount_code: false,
      allow_phone_number_collection: false,
    },
    minimal_address: true,
  };

  if (isDutchCheckout) {
    body.billing_address = {
      country: "NL",
      zipcode: "1012JS",
    };
  }

  if (email) {
    body.customer = { email };
  }

  const res = await fetch(`${DODO_API_BASE}/checkouts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${DODO_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Dodo checkout failed (${res.status}): ${error}`);
  }

  const checkout = (await res.json()) as DodoCheckoutResponse;
  if (!checkout.checkout_url) {
    throw new Error("Dodo checkout URL is missing from response");
  }

  return checkout.checkout_url;
}

function decodeWebhookSecret(secret: string): Buffer {
  if (secret.startsWith("whsec_")) {
    return Buffer.from(secret.slice("whsec_".length), "base64");
  }

  return Buffer.from(secret, "utf8");
}

function extractSignatures(signatureHeader: string): string[] {
  return signatureHeader
    .split(" ")
    .flatMap((part) => part.split(","))
    .map((part) => part.trim())
    .filter((part) => part && part !== "v1");
}

export function verifyDodoWebhookSignature(input: {
  rawBody: string;
  webhookId: string | null;
  webhookTimestamp: string | null;
  webhookSignature: string | null;
  secret: string;
}): boolean {
  const { rawBody, webhookId, webhookTimestamp, webhookSignature, secret } = input;
  if (!webhookId || !webhookTimestamp || !webhookSignature || !secret) return false;

  const timestampSeconds = Number(webhookTimestamp);
  if (!Number.isFinite(timestampSeconds)) return false;

  const ageSeconds = Math.abs(Date.now() / 1000 - timestampSeconds);
  if (ageSeconds > 5 * 60) return false;

  const signedContent = `${webhookId}.${webhookTimestamp}.${rawBody}`;
  const expected = createHmac("sha256", decodeWebhookSecret(secret))
    .update(signedContent)
    .digest("base64");
  const expectedBuffer = Buffer.from(expected);

  return extractSignatures(webhookSignature).some((signature) => {
    const signatureBuffer = Buffer.from(signature);
    return (
      signatureBuffer.length === expectedBuffer.length &&
      timingSafeEqual(signatureBuffer, expectedBuffer)
    );
  });
}
