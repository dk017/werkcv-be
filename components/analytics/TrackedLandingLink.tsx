"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { track, type NamedLandingCtaEvent } from "@/lib/analytics";

type TrackedLandingLinkProps = {
  href: string;
  className?: string;
  trackingLocation: string;
  trackingLabel: string;
  ctaEventName?: NamedLandingCtaEvent;
  children: ReactNode;
};

function normalizeInternalPath(href: string): string {
  if (!href) return "/";
  const hashIndex = href.indexOf("#");
  const noHash = hashIndex >= 0 ? href.slice(0, hashIndex) : href;
  const queryIndex = noHash.indexOf("?");
  return queryIndex >= 0 ? noHash.slice(0, queryIndex) : noHash;
}

export default function TrackedLandingLink({
  href,
  className,
  trackingLocation,
  trackingLabel,
  ctaEventName,
  children,
}: TrackedLandingLinkProps) {
  const pathname = usePathname();

  const toPath = normalizeInternalPath(href);

  return (
    <Link
      href={href}
      className={className}
      data-track-cta="manual"
      onClick={() => {
        if (ctaEventName) {
          track(ctaEventName, {});
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
