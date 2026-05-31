"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { track, type CareerTransitionCtaEvent } from "@/lib/analytics";

type TrackedCareerLinkProps = {
  href: string;
  className?: string;
  eventName: CareerTransitionCtaEvent;
  ctaLocation: string;
  ctaText: string;
  children: ReactNode;
};

function normalizeInternalPath(href: string): string {
  if (!href) return "/";
  const hashIndex = href.indexOf("#");
  const noHash = hashIndex >= 0 ? href.slice(0, hashIndex) : href;
  const queryIndex = noHash.indexOf("?");
  return queryIndex >= 0 ? noHash.slice(0, queryIndex) : noHash;
}

export default function TrackedCareerLink({
  href,
  className,
  eventName,
  ctaLocation,
  ctaText,
  children,
}: TrackedCareerLinkProps) {
  const pathname = usePathname();
  const toPath = normalizeInternalPath(href);

  return (
    <Link
      href={href}
      className={className}
      data-track-cta="manual"
      onClick={() => {
        track(eventName, {
          page_path: pathname,
          cta_location: ctaLocation,
          cta_text: ctaText,
        });
        track("cta_clicked", {
          location: ctaLocation,
          label: ctaText,
        });
        track("landing_cta_click", {
          fromPath: pathname,
          toPath,
          label: `${ctaLocation}:${ctaText}`.slice(0, 120),
        });
      }}
    >
      {children}
    </Link>
  );
}
