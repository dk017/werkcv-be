"use client";

import { useEffect } from "react";

type PurchaseTrackerProps = {
  orderId?: string;
  cvId?: string;
  product?: string;
  amountCents?: number;
  currency?: string;
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export default function PurchaseTracker({
  orderId,
  cvId,
  product,
  amountCents,
  currency = "EUR",
}: PurchaseTrackerProps) {
  useEffect(() => {
    if (!orderId || !amountCents || typeof window.gtag !== "function") return;

    const storageKey = `werkcv_purchase_tracked_${orderId}`;
    if (window.sessionStorage.getItem(storageKey)) return;

    const value = amountCents / 100;
    const itemId = product || "cv-download";

    window.gtag("event", "purchase", {
      transaction_id: orderId,
      value,
      currency,
      items: [
        {
          item_id: itemId,
          item_name: itemId,
          price: value,
          quantity: 1,
          cv_id: cvId,
        },
      ],
    });

    window.gtag("event", "checkout_completed", {
      order_id: orderId,
      cv_id: cvId,
      product: itemId,
      amount_cents: amountCents,
      value,
      currency,
    });

    window.sessionStorage.setItem(storageKey, "1");
  }, [amountCents, currency, cvId, orderId, product]);

  return null;
}
