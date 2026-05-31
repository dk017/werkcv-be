# Feature Build Tracker

Last updated: 2026-04-07

This tracker is for non-SEO product features so we can keep scope, status, and follow-up work in one place.

## Status legend

- `planned`: scoped but not started
- `in_progress`: actively being built
- `done`: implemented and verified locally
- `deployed`: live in production
- `later`: intentionally deferred

## Active features

| Feature | Route | Status | Scope summary | Main files |
| --- | --- | --- | --- | --- |
| Nederlandse CV Kwaliteitsscore | `/tools/cv-score` | `done` | Free tool that scores a CV against Dutch hiring conventions across 6 dimensions, returns structured feedback, and pushes users into WerkCV conversion paths. | `app/tools/cv-score/*`, `app/api/tools/cv-score/route.ts`, `lib/tools/cv-score.ts`, `lib/analytics.ts`, `app/tools/page.tsx`, `app/sitemap.ts` |
| WerkCV CV Quality Standard v1 | `/tools/cv-score/methodologie` | `done` | Public methodology page that explains how the score is calculated, what is rule-based vs AI-assisted, and what the score does and does not claim. | `app/tools/cv-score/methodologie/page.tsx`, `app/tools/cv-score/page.tsx`, `app/sitemap.ts` |
| English resume translator handoff | `/en/guides/translate-resume-to-dutch-format` | `done` | Keeps translated-resume users inside the English experience by routing post-translation CTAs to `/en/editor` and `/en/templates`. | `components/translate/ResumeTranslator.tsx`, `app/api/translate-resume/route.ts` |
| CV maken eenmalig betalen landing-page lift | `/cv-maken-zonder-abonnement` | `done` | Rebuilt the route as a bespoke commercial page around the exact `cv maken eenmalig betalen` intent, added a comparison table, stronger FAQ schema, and exact-anchor internal links from key pages. | `app/cv-maken-zonder-abonnement/page.tsx`, `app/cv-maken/page.tsx`, `app/gratis-cv-maken/page.tsx`, `app/templates/page.tsx`, `components/HomePageClient.tsx` |
| Kilometervergoeding berekenen | `/tools/kilometervergoeding-berekenen` | `done` | Salary/benefits calculator for woon-werkverkeer with 2026 tax-free km rules, monthly/yearly outputs, and conversion CTA into the CV funnel. | `app/tools/kilometervergoeding-berekenen/*`, `lib/tools/moat-calculators.ts`, `app/tools/page.tsx`, `app/sitemap.ts` |
| Ziekengeld berekenen | `/tools/ziekengeld-berekenen` | `done` | NL sickness-pay calculator for year 1 vs year 2 loondoorbetaling with 70% legal minimum framing and next-step CTA into CV + employment tools. | `app/tools/ziekengeld-berekenen/*`, `lib/tools/moat-calculators.ts`, `app/tools/page.tsx`, `app/sitemap.ts` |
| Thuiswerkvergoeding berekenen | `/tools/thuiswerkvergoeding-berekenen` | `done` | Home-office allowance calculator for the 2026 tax-free day rate with monthly/yearly output and taxable-excess comparison. | `app/tools/thuiswerkvergoeding-berekenen/*`, `lib/tools/moat-calculators.ts`, `app/tools/page.tsx`, `app/sitemap.ts` |
| Salaris vergelijker | `/tools/salaris-vergelijker` | `done` | Side-by-side offer comparison that converts salary, bonus, travel, home office, and vacation days into a single monthly net-equivalent decision number. | `app/tools/salaris-vergelijker/*`, `lib/tools/moat-calculators.ts`, `lib/tools/netto-bruto.ts`, `app/tools/page.tsx`, `app/sitemap.ts` |
| Overuren berekenen | `/tools/overuren-berekenen` | `done` | Overtime calculator that values extra hours with or without contract/Cao surcharge and pushes users into salary/CV next steps. | `app/tools/overuren-berekenen/*`, `lib/tools/moat-calculators.ts`, `app/tools/page.tsx`, `app/sitemap.ts` |
| Salaris kompas refresh | `/tools/salaris-calculator` | `done` | Reworked the salary checker into a guided 3-step salary-kompas flow using CBS occupational data plus explicit experience, education, and region heuristics with a stronger visual result state. | `app/tools/salaris-calculator/*`, `lib/tools/salary-benchmark.ts` |

## Locked decisions

- V1 uses a hybrid scorer:
  - deterministic local checks for structure, contact info, completeness, and basic pattern detection
  - one constrained OpenAI JSON pass for nuanced judgement on profile quality, buzzword weakness, bullet strength, and language consistency
- Public tool only:
  - no login
  - no DB storage
  - no editor-side realtime scoring
- Abuse guardrails:
  - IP rate limiting
  - 5MB upload cap
  - reject too-short or partial CV input before model scoring
  - send only the relevant extracted CV snippets to OpenAI

## Implementation checklist

- [x] Add `cv-score` route and page metadata
- [x] Add backend scoring engine in `lib/tools/cv-score.ts`
- [x] Add public API route `POST /api/tools/cv-score`
- [x] Add upload and text input UX
- [x] Add loading state with rotating Dutch messages
- [x] Add score hero with animated ring
- [x] Add 6 expandable dimension cards
- [x] Add detailed issues list with severity sorting
- [x] Add conversion CTA block
- [x] Add analytics events
- [x] Add tool discovery link on `/tools`
- [x] Add sitemap entry
- [x] Run `eslint`
- [x] Run `npm run build`

## Follow-up ideas

- Job-description URL input for `cv-vacature-match` after the upload flow stabilizes
- Shared reusable score-card component for other diagnostic tools
- Optional editor prefill or “apply fixes” handoff from score results
