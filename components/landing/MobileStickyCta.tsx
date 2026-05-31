import TrackedLandingLink from "@/components/analytics/TrackedLandingLink";
import type { NamedLandingCtaEvent } from "@/lib/analytics";

type MobileStickyCtaProps = {
  text: string;
  buttonLabel: string;
  href: string;
  trackingLocation: string;
  trackingLabel: string;
  ctaEventName: NamedLandingCtaEvent;
};

export default function MobileStickyCta({
  text,
  buttonLabel,
  href,
  trackingLocation,
  trackingLabel,
  ctaEventName,
}: MobileStickyCtaProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t-4 border-black bg-white/95 backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
        <p className="min-w-0 text-sm font-black leading-tight text-black">{text}</p>
        <TrackedLandingLink
          href={href}
          trackingLocation={trackingLocation}
          trackingLabel={trackingLabel}
          ctaEventName={ctaEventName}
          className="shrink-0 border-2 border-black bg-yellow-400 px-3 py-2 text-sm font-black text-black"
        >
          {buttonLabel}
        </TrackedLandingLink>
      </div>
    </div>
  );
}
