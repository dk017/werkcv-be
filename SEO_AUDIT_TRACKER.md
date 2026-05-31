# SEO Audit Tracker

Last updated: 2026-04-15

This tracker reflects the actual state of the codebase, not just the raw audit output.

## Status legend

- `done`: implemented and verified in the codebase
- `in_progress`: currently being worked on
- `next`: high-value and worth building next
- `later`: useful, but not urgent
- `skip`: low ROI or based on a weak audit assumption

## Tracker

| Priority | Item | Status | Notes | Main files |
| --- | --- | --- | --- | --- |
| Critical | Global `WebSite` + `Organization` JSON-LD shell | `done` | Already rendered in the shared layout. | `app/layout.tsx`, `components/seo/JsonLd.tsx` |
| Critical | Complete global OG + Twitter shell | `done` | Shared shell now includes `twitter:site`, `og:site_name`, and route metadata can layer on top cleanly. | `app/layout.tsx`, key route metadata files |
| Critical | Hreflang for Dutch and English roots | `done` | Root and `/en` alternates already added. | `app/page.tsx`, `app/en/metadata.ts` |
| Critical | Dynamic sitemap `lastmod` | `done` | Static pages, tools, `cv-voorbeelden`, `cv-tips`, and `cv-gids` now resolve from real content dates and source file mtimes. | `app/sitemap.ts` |
| Critical | Breadcrumb schema on content pages | `done` | Shared breadcrumb JSON-LD stays in `Breadcrumbs`; duplicate route-level breadcrumb scripts were removed from key content routes. | `components/seo/Breadcrumbs.tsx`, `app/cv-tips/[slug]/page.tsx`, `app/cv-gids/[slug]/page.tsx` |
| Critical | FAQ schema on `cv-tips` articles | `done` | Already emitted from the shared article route. | `app/cv-tips/[slug]/page.tsx` |
| Critical | `Article` schema with `datePublished` / `dateModified` on `cv-tips` | `done` | Already implemented in the shared article route. | `app/cv-tips/[slug]/page.tsx` |
| Critical | `HowTo` on step-by-step guides | `later` | Already on homepage and `/cv-maken`. Add only where the page is truly procedural. | `app/page.tsx`, `app/cv-maken/page.tsx` |
| High | Consolidate / differentiate `cv maken` variants | `done` | The pillar, the primary sub-intent routes, the core synonym pages, and the longer-tail style/speed/template variants now separate narrow intent from the `/cv-maken` pillar through hero copy and cleaner follow-up links. Keep monitoring in Search Console instead of adding more near-duplicate variants. | `app/sitemap.ts`, multiple `app/*` route files |
| High | Unique meta descriptions across pages | `later` | Many key pages are already being fixed, but this is still a broad cleanup task. | route-level `page.tsx` files |
| High | Optimize tool result-page CTAs | `done` | Highest-intent tool result states now push users into `/editor` and `/templates`, and shared CTA tracking now counts `/templates` clicks as funnel actions too. | `components/AnalyticsProvider.tsx`, `app/tools/ats-cv-checker/AtsCheckerTool.tsx`, `app/tools/cv-vacature-match/CvVacatureMatchTool.tsx`, `app/tools/profieltekst-generator/ProfieltekstTool.tsx` |
| High | Remove homepage demo CV content from SSR | `done` | Sample CV preview content is client-only now. | `app/page.tsx`, `components/HomePageClient.tsx` |
| Quick win | Consistent `| WerkCV` title suffix | `done` | Shared metadata no longer double-appends the brand, dynamic families normalize centrally, and static route metadata titles/site names were swept from `WerkCV.nl` to `WerkCV`. Remaining `WerkCV.nl` mentions are normal copy, domain references, or content source text. | `app/layout.tsx`, `lib/seo-branding.ts`, route metadata files |
| Quick win | Replace decorative `✓` / `•` in SEO-facing headings | `later` | Some targeted cleanup already done. Remaining symbols are low impact unless they sit in headings or schema-relevant content. | multiple routes |
| Quick win | Add `theme-color` | `done` | Added in the shared viewport metadata. | `app/layout.tsx` |
| Quick win | Strengthen `/over-ons` trust signals | `done` | Added stronger content plus `Organization` / `AboutPage` schema. | `app/over-ons/page.tsx` |
| Long-term | Custom OG images for key pages | `done` | Global and dynamic OG image routes already exist. | `app/opengraph-image.tsx`, `app/cv-tips/[slug]/opengraph-image.tsx`, `app/cv-gids/[slug]/opengraph-image.tsx` |
| Long-term | Author bios on `cv-tips` | `later` | Only worth doing once there is a real, defensible author model. | `app/cv-tips/[slug]/page.tsx` |
| Long-term | Build links to the tools section | `next` | Worth doing selectively for the strongest rule-based calculators/checkers, not for the whole tool set. | `app/tools/page.tsx`, selected `app/tools/*/page.tsx` |

## 2026-04-08 audit findings

This pass was based on the live repo state plus current Google Search Central guidance.
The goal was to separate real implementation work from weak or risky SEO assumptions.

### Immediate decisions

| Priority | Item | Status | Notes | Main files |
| --- | --- | --- | --- | --- |
| Critical | Homepage FAQ content + FAQ schema | `done` | Added visible homepage FAQ blocks and homepage FAQ JSON-LD from a shared source so content and schema stay aligned. | `app/page.tsx`, `components/HomePageClient.tsx`, `lib/site-content.ts` |
| Critical | AggregateRating on homepage and `/faq` | `in_progress` | Still blocked on a real, visible rating source. Added a single shared config hook in code so `AggregateRating` can be enabled safely once real review data exists. | `app/page.tsx`, `app/faq/page.tsx`, `lib/site-content.ts` |
| Critical | Hreflang only for true Dutch-English pairs | `done` | Removed the broad `cv-tips` and `cv-gids` cross-language mappings and made English alternates optional so only audited page pairs keep hreflang. | `app/en/metadata.ts`, `app/cv-gids/*`, `app/cv-tips/*`, `app/templates/page.tsx`, `app/page.tsx`, `app/engelstalige-bedrijven-in-nederland/page.tsx` |
| High | `/over-ons` price inconsistency | `done` | `/over-ons` now renders the shared price constant, and the current live search result check did not show a conflicting `€5` source for this route. Any stale SERP cache would now be a recrawl issue, not a page-source mismatch. | `app/over-ons/page.tsx`, `lib/site-content.ts` |
| High | `/sollicitatiebrief-maken` hub | `done` | Added a real cluster-owner page with route selection, a visible writing workflow, FAQ + HowTo schema, sitemap inclusion, and internal links from the main brief pages and generator route. | `app/sollicitatiebrief-maken/page.tsx`, `app/sitemap.ts`, core brief cluster routes |
| High | Cannibalization: `/gratis-cv-maken` vs `/cv-aanmaken` | `done` | The split is now explicit in H1, meta, intro copy, FAQ copy, and key internal links. `/gratis-cv-maken` owns free-start / payment-timing intent, while `/cv-aanmaken` owns from-scratch / first-version intent. | `app/gratis-cv-maken/page.tsx`, `app/cv-aanmaken/page.tsx`, `app/cv-maken/page.tsx`, key internal linking surfaces |
| High | Jobs strategy: remove from index entirely | `in_progress` | Public jobs route files have now been removed, so old jobs URLs fall through to site-wide `404` handling. The repo cleanup is also done for scripts, datasets, components, and app-layer jobs helpers. Remaining work is external: confirm live responses and use Search Console removals if stale jobs URLs still appear. | removed `app/jobs*`, removed `app/vacatures*`, `package.json`, removed jobs code/data directories |

### Safe hreflang pairs

- `/` and `/en`
- `/templates` and `/en/templates`
- `/engelstalige-bedrijven-in-nederland` and `/en/english-speaking-companies-netherlands`

### Hreflang mappings to remove or review

- `/cv-tips` to `/en/guides`
- `/cv-tips/[slug]` to `/en/guides`
- `/cv-gids` to `/en/guides`
- `/cv-gids/[slug]` to `/en/guides/[slug]` hub fallback
- English guide pages that currently point to broad Dutch pages instead of true translated equivalents

### Jobs-layer reality check

- The dedicated route files for `/jobs`, `/jobs/[...slug]`, `/jobs-preview`, `/vacatures`, and `/vacatures/[slug]` have now been removed from the repo.
- The dormant jobs pipeline has also been removed at the script, data, component, and app-helper layer.
- The remaining risk is old indexed URLs, internal code/data residue, and any historical discovery already in Google.
- Follow-up sequence:
- Keep removed URLs returning `404` or `410`.
- Do not block them in `robots.txt` before Google sees the removal response.
- Use Search Console removals for stale indexed job URLs after the live responses are verified.
- Remove leftover jobs code, page payload generation, and raw/derived jobs datasets once the product decision is final.

### Content quality rule for future pages

- No new page unless the user job is genuinely different.
- Prefer pages with first-hand product knowledge, official-source support, or practical workflow value over synonym pages.
- Use official and current sources when the topic is temporal or trust-sensitive.
- Treat generic head-term coverage without unique value as a cannibalization risk, not a content win.

## Best next implementation order

1. Build outreach targets only for the strongest tool pages.
2. Add author-level trust signals only if there is a real, defensible author model.
3. Expand unique meta description cleanup across the remaining long-tail routes.

## Best tool pages for backlink outreach

- `/tools/netto-bruto-calculator`
- `/tools/minimumloon-checker`
- `/tools/ww-recht-checker`
- `/tools/ww-dagloon-checker`
- `/tools/transitievergoeding-berekenen`
- `/tools/vakantiegeld-berekenen`
- `/tools/30-procent-regeling-checker`
- `/tools/kennismigrant-salary-checker`

## Weak tool pages for backlink outreach

These can still rank, but they are less likely to earn editorial links on their own:

- `/tools/ats-cv-checker`
- `/tools/profieltekst-generator`
- `/tools/job-title-translator`
- `/tools/sollicitatiebrief-generator`
- `/tools/cv-samenvatting-generator`

## 2026-04-15 focused tool pass

- `done`: `/tools/aow-leeftijd-checker` now targets broader `pensioenleeftijd berekenen` intent instead of behaving like a thin AOW-only shell. The page now explains the AOW vs pensioen distinction, shows a current AOW range table, cites official sources, and links to adjacent money/work tools.
- `done`: The AOW calculator logic in `lib/tools/employment-tools.ts` was corrected from birth-year based buckets to birth-date ranges. This fixes the visible mismatch with current SVB/Belastingdienst schedules, especially for 1956+ and expected post-1964 ages.
- `done`: `/tools/vakantiegeld-berekenen` now aligns more directly with `vakantiegeld bruto netto` intent. The page title/H1 are tighter, hero CV CTAs were removed, the calculator now shows a rough netto-indicatie, and the page includes worked salary-band examples plus clearer explanation of bijzondere beloningen.
- `done`: Internal support links were added from high-fit salary and 50+ articles into the vakantiegeld and AOW tool pages to reinforce relevance from existing informational content.
- `skip for now`: No new competitor `opzeggen` pages were added in this pass. Existing opzeggen pages already prove acquisition potential; the higher-ROI move is improving conversion from current acquisition pages and strengthening tool-page satisfaction before expanding that cluster further.

## 2026-04-15 opzeggen measurement pass

- `done`: Added explicit funnel tracking support for `/cv-maken-zonder-abonnement` clicks in the shared analytics layer. Before this change, opzeggen pages already tracked clicks into `/templates` and `/prijzen`, but the primary no-subscription CTA path was invisible in `landing_cta_click` events.
- `done`: Added `opzeggen` as its own attribution cluster for the three live competitor-cancel pages, so future signups and orders from this cluster are easier to isolate.
- `done`: Added a dedicated report script for this acquisition slice: `npm run analytics:opzeggen -- 90`.
- `done`: Reworked the three live opzeggen pages to use a clearer primary route hierarchy: one primary path to `/cv-maken-zonder-abonnement`, comparison as secondary, pricing as tertiary. Added explicit tracked CTA components so header, hero, mid-page, and footer clicks can be separated by label.
- `important caveat`: Historical click data from opzeggen pages to `/cv-maken-zonder-abonnement` is incomplete before this deployment because that target was not being persisted as a funnel CTA yet.
