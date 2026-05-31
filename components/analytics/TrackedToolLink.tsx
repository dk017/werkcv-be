"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { track } from "@/lib/analytics";

type ToolCtaEventName =
  | "tool_to_cv_cta_click"
  | "linkedin_to_cv_cta_editor_click"
  | "linkedin_to_cv_cta_templates_click";

type TrackedToolLinkProps = {
  href: string;
  className?: string;
  trackingLocation: string;
  trackingLabel: string;
  eventName: ToolCtaEventName;
  toolName?: string;
  ctaVariant?: "primary" | "secondary";
  ctaIntent?: "salary" | "legal" | "cv_content" | "cancellation" | "cover_letter" | "general";
  resultState?: string;
  children: ReactNode;
};

function normalizeInternalPath(href: string): string {
  if (!href) return "/";
  const hashIndex = href.indexOf("#");
  const noHash = hashIndex >= 0 ? href.slice(0, hashIndex) : href;
  const queryIndex = noHash.indexOf("?");
  return queryIndex >= 0 ? noHash.slice(0, queryIndex) : noHash;
}

export default function TrackedToolLink({
  href,
  className,
  trackingLocation,
  trackingLabel,
  eventName,
  toolName,
  ctaVariant = "primary",
  ctaIntent,
  resultState,
  children,
}: TrackedToolLinkProps) {
  const pathname = usePathname();
  const toPath = normalizeInternalPath(href);

  return (
    <Link
      href={href}
      className={className}
      data-track-cta="manual"
      onClick={() => {
        if (eventName === "tool_to_cv_cta_click") {
          track(eventName, {
            tool_name: toolName || pathname,
            page_path: pathname,
            cta_variant: ctaVariant,
            cta_text: trackingLabel,
            cta_location: trackingLocation,
            cta_intent: ctaIntent,
            cta_destination: toPath,
            result_state: resultState,
          });
        } else {
          track(eventName, {
            page_path: pathname,
            cta_location: trackingLocation,
            cta_text: trackingLabel,
          });
        }

        track("cta_clicked", {
          location: trackingLocation,
          label: trackingLabel,
        });
        track("landing_cta_click", {
          fromPath: pathname,
          toPath,
          label: `${trackingLocation}:${trackingLabel}`.slice(0, 120),
        });
      }}
    >
      {children}
    </Link>
  );
}
