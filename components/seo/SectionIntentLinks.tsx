import Link from "next/link";

type IntentLink = {
  href: string;
  label: string;
  description?: string;
};

type SectionIntentLinksProps = {
  links?: IntentLink[];
  locale?: "nl" | "en";
};

export default function SectionIntentLinks({
  links,
  locale = "nl",
}: SectionIntentLinksProps) {
  if (!links || links.length === 0) {
    return null;
  }

  const eyebrow =
    locale === "nl" ? "Direct relevante vervolgstappen" : "Most useful next steps";

  return (
    <div className="mt-5 border-l-4 border-black bg-[#FFF4D6] px-4 py-4">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-gray-600">
        {eyebrow}
      </p>
      <ul className="mt-3 space-y-2">
        {links.map((link) => (
          <li key={link.href} className="text-base leading-relaxed text-gray-700">
            <Link
              href={link.href}
              className="font-black text-gray-900 underline decoration-2 underline-offset-2 hover:text-[#FF6B6B] transition-colors"
            >
              {link.label}
            </Link>
            {link.description ? <span>{` — ${link.description}`}</span> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
