# Keyword Gap Execution Plan

Last updated: 2026-04-04

This plan uses the current repo state, not just the raw keyword-gap notes.
The important question is not "which keywords exist?" but "which search intent is already covered, which is thin, and which needs a new page."

## 1. Reality Check Before Building

- There are already `42` editorial articles in `lib/cv-tips/articles`.
- LinkedIn is not empty:
  - `/cv-tips/linkedin-profiel-optimaliseren`
  - `/cv-tips/linkedin-profiel-maken`
  - `/cv-tips/linkedin-samenvatting-schrijven`
  - `/cv-tips/linkedin-kopregel-voorbeeld`
  - `/cv-tips/linkedin-naar-cv`
- Sollicitatiegesprek is not empty:
  - `/cv-tips/sollicitatiegesprek-voorbereiden`
  - `/cv-tips/sollicitatievragen`
  - `/cv-tips/meest-gestelde-sollicitatievragen`
  - `/cv-tips/sollicitatiegesprek-kleding`
  - `/cv-tips/vragen-stellen-sollicitatiegesprek`
  - `/tools/sollicitatiegesprek-quiz`
- Carrièreswitch is not empty:
  - `/cv-tips/carriereswitch-cv`
  - `/tools/career-change-advisor`
- Career-gap / gap-in-CV is not empty:
  - `/cv-tips/gat-in-cv-uitleggen`
  - `/cv-tips/cv-na-loopbaanonderbreking`
  - `/cv-tips/cv-na-ontslag`
- Salary is not empty:
  - `/cv-tips/salarisverwachting-bepalen`
  - `/cv-tips/salaris-bespreken-sollicitatie`
  - `/cv-tips/gewenst-salaris-invullen`
  - `/cv-tips/salarisverwachting-cv`
  - `/tools/salaris-onderhandeling`
  - multiple salary calculators under `/tools/*`
- Sollicitatiebrief / motivatiebrief is not empty:
  - `/motivatiebrief-schrijven`
  - `/sollicitatiebrief-voorbeeld`
  - `/cv-tips/sollicitatiebrief-tips`
  - `/open-sollicitatie-brief`
  - `/sollicitatiebrief-in-engels`
  - multiple role-specific letter pages
- English expat coverage is not empty:
  - `/en/guides` already has a seeded guide system
  - `lib/seo-wave/data.ts` already defines `10` English seed pages from `dutch-cv-for-expats` through `one-page-cv-netherlands`
- Freelancer / ZZP is not empty:
  - `/cv-tips/freelance-cv-maken`
- Uitzendbureau is not empty:
  - `/cv-tips/cv-voor-uitzendbureau`
- Some sector gaps from the audit are already present in the SEO wave data:
  - for example `cv-voorbeeld-schoonmaakmedewerker` exists in `lib/seo-wave/data.ts`

## 2. What This Means Strategically

The gap audit is directionally useful, but not accurate enough to execute blindly.

Three rules should guide the next content wave:

1. Refresh an existing page if the keyword is already owned and the modifier only changes the angle.
2. Add a new page only when the keyword wording implies a clearly different user job.
3. Do not create another near-duplicate pillar around a head term that already has a live owner.

Status labels for this plan:

- `refresh`: existing page should be updated and better positioned
- `expand`: existing page is fine, but needs support pages around it
- `new`: distinct missing intent worth building
- `skip for now`: covered enough already, or too overlapping to justify a new page

## 3. Canonical Ownership Map

This is the anti-cannibalization layer. Each broad theme needs one clear owner.

| Theme | Canonical owner now | Notes |
| --- | --- | --- |
| Sollicitatiegesprek voorbereiding | `/cv-tips/sollicitatiegesprek-voorbereiden` | Keep this as the main prep pillar, not a second broad page. |
| LinkedIn optimalisatie | `/cv-tips/linkedin-profiel-optimaliseren` | This should own tips / optimize intent. |
| Gat in CV / loopbaanonderbreking | New exact-match page needed | Existing pages are useful but do not lexically own `gat in cv`. |
| Motivatiebrief how-to | `/motivatiebrief-schrijven` | Practical workflow page. |
| Sollicitatiebrief examples | `/sollicitatiebrief-voorbeeld` | Example intent, not general writing theory. |
| Sollicitatiebrief editorial long-form | `/cv-tips/sollicitatiebrief-tips` | Strategy, ATS, mistakes, context. |
| Salary expectation / negotiation | `/cv-tips/salarisverwachting-bepalen` | Main salary advice pillar. |
| English Netherlands CV guides | `/en/guides/*` | Expand inside the existing English system, not outside it. |

## 4. Keyword-by-Keyword Analysis

The notes below treat keywords "word by word": the head term tells us the topic, and the modifier tells us the user job.

### 4.1 LinkedIn Cluster

Pillar owner: `/cv-tips/linkedin-profiel-optimaliseren`

| Keyword | Word-by-word read | Current state | Decision | Best target |
| --- | --- | --- | --- | --- |
| `linkedin profiel maken` | `linkedin profiel` + `maken` = beginner setup intent | Not directly owned | `new` | `/cv-tips/linkedin-profiel-maken` |
| `linkedin profiel optimaliseren` | `optimaliseren` = improve existing profile | Already owned | `refresh` | existing pillar |
| `linkedin samenvatting schrijven` | `samenvatting` = one component, copy-led intent | Only partially covered inside pillar | `new` | `/cv-tips/linkedin-samenvatting-schrijven` |
| `linkedin kopregel voorbeeld` | `kopregel voorbeeld` = examples/snippet intent | Not directly owned | `new` | `/cv-tips/linkedin-kopregel-voorbeeld` |
| `linkedin profiel tips` | `tips` = broad list angle, very close to optimize | Already close to pillar | `skip for now` | fold into pillar metadata/H2s |

LinkedIn conclusion:

- Do not create a second broad LinkedIn pillar.
- Keep `linkedin-profiel-optimaliseren` as the main page.
- Add `maken`, `samenvatting`, and `kopregel` as support pages.
- Use `/cv-tips/linkedin-naar-cv` as a bridge page between LinkedIn and CV conversion.

### 4.2 Sollicitatiegesprek Cluster

Pillar owner: `/cv-tips/sollicitatiegesprek-voorbereiden`
Tool anchor: `/tools/sollicitatiegesprek-quiz`

| Keyword | Word-by-word read | Current state | Decision | Best target |
| --- | --- | --- | --- | --- |
| `sollicitatiegesprek` | broad head term, very high difficulty, hub-like | No exact head-term hub | `skip for now` | let prep pillar grow first |
| `sollicitatiegesprek voorbereiding` | prep intent | Already owned | `refresh` | existing pillar |
| `sollicitatievragen` | question bank intent | Not directly owned | `new` | `/cv-tips/sollicitatievragen` |
| `sollicitatiegesprek tips` | broad advice list, close to prep | Already near pillar | `refresh` | existing pillar can absorb |
| `meest gestelde sollicitatievragen` | snippet/list intent | Not directly owned | `new` | `/cv-tips/meest-gestelde-sollicitatievragen` |
| `sollicitatiegesprek kleding` | narrow practical sub-intent | Not directly owned | `new` | `/cv-tips/sollicitatiegesprek-kleding` |
| `sollicitatiegesprek vragen stellen` | reverse-question intent | Not directly owned | `new` | `/cv-tips/vragen-stellen-sollicitatiegesprek` |

Sollicitatiegesprek conclusion:

- This is still the strongest real expansion opportunity.
- The correct move is not a blind new hub first.
- The correct move is one strong pillar refresh plus four distinct support pages and strong tool linking.

### 4.3 Career Gap / Gat in CV Cluster

Current coverage:

- `/cv-tips/cv-na-loopbaanonderbreking`
- `/cv-tips/cv-na-ontslag`

| Keyword | Word-by-word read | Current state | Decision | Best target |
| --- | --- | --- | --- | --- |
| `gat in cv` | explicit pain keyword in plain Dutch | Not lexically owned | `new` | `/cv-tips/gat-in-cv-uitleggen` or `/cv-tips/gat-in-cv` |
| `gat in cv uitleggen` | explanation intent | Not directly owned | `new` | same new pillar |
| `loopbaanonderbreking cv` | formal scenario wording | Already covered | `refresh` | existing `cv-na-loopbaanonderbreking` |
| `cv gap opvullen` | repair/reframe angle | Partially covered | `refresh` | new pillar + current article |
| `cv na ziekte` | specific scenario | Covered as a subsection, not page | `skip for now` | strengthen current article section |
| `cv na zwangerschapsverlof` | specific scenario | Covered as a subsection, not page | `skip for now` | strengthen current article section |
| `cv na burnout` | specific scenario | Covered as a subsection, not page | `skip for now` | strengthen current article section |

Career-gap conclusion:

- The real gap is lexical and canonical, not topical.
- Build one exact-match page for `gat in cv`.
- Use the existing scenario pages as supporting detail, not separate competing pillars.

### 4.4 Sollicitatiebrief / Motivatiebrief Cluster

Current coverage is already broad:

- `/motivatiebrief-schrijven`
- `/sollicitatiebrief-voorbeeld`
- `/cv-tips/sollicitatiebrief-tips`
- `/open-sollicitatie-brief`
- `/sollicitatiebrief-in-engels`
- multiple role-based example pages

| Keyword | Word-by-word read | Current state | Decision | Best target |
| --- | --- | --- | --- | --- |
| `sollicitatiebrief schrijven` | direct how-to | Already close to existing pages | `refresh` | strengthen existing cluster ownership |
| `sollicitatiebrief tips` | advice list | Already owned by article | `refresh` | existing article |
| `sollicitatiebrief beginnen` | opening-specific sub-intent | Not directly owned | `new` | `/sollicitatiebrief-beginnen` |
| `motivatiebrief zonder werkervaring` | beginner / starter scenario | Not directly owned | `new` | `/motivatiebrief-zonder-werkervaring` |
| `sollicitatiebrief lang of kort` | formatting decision | Can live inside pillar | `skip for now` | add section/FAQ to existing root page |
| `open sollicitatie schrijven` | open application how-to | Already close to `/open-sollicitatie-brief` | `refresh` | retarget existing page, no new URL first |

Sollicitatiebrief conclusion:

- This cluster is not missing; it is structurally messy.
- First clarify ownership between `motivatiebrief-schrijven`, `sollicitatiebrief-voorbeeld`, and `cv-tips/sollicitatiebrief-tips`.
- Then add only the missing sub-intents that imply a genuinely different user job.

### 4.5 Carrièreswitch Cluster

Current coverage:

- `/cv-tips/carriereswitch-cv`
- `/tools/career-change-advisor`

| Keyword | Word-by-word read | Current state | Decision | Best target |
| --- | --- | --- | --- | --- |
| `carrièreswitch maken` | broad switch intent | Already close | `refresh` | existing article |
| `van baan wisselen cv` | switch framed through CV | Already close | `refresh` | existing article |
| `cv bij carrièreswitch` | exact page-topic match | Already owned | `refresh` | existing article |
| `omscholing cv` | reskilling angle | Already covered inside article | `skip for now` | expand section if needed |
| `transfer skills cv` | transferable skills angle | Covered conceptually | `later` | possible support page if impressions justify |

Carrièreswitch conclusion:

- This is not a net-new cluster.
- Refresh the pillar and strengthen the tool CTA.
- Only build a second page if Search Console shows a distinct transferable-skills query pattern.

### 4.6 Salary / Negotiation Cluster

Current coverage:

- `/cv-tips/salarisverwachting-bepalen`
- `/cv-tips/salarisverwachting-cv`
- `/tools/salaris-onderhandeling`
- relevant calculators under `/tools/*`

| Keyword | Word-by-word read | Current state | Decision | Best target |
| --- | --- | --- | --- | --- |
| `salaris onderhandelen tips` | negotiation advice | Already close to pillar | `refresh` | existing salary pillar |
| `wat is een goed salaris nederland` | broad market-salary intent | Broader than current CV focus | `later` | only if salary content becomes a bigger vertical |
| `salaris bespreken sollicitatie` | interview-stage advice | Not directly owned | `new` | `/cv-tips/salaris-bespreken-sollicitatie` |
| `gewenst salaris invullen` | form-field / application-form intent | Not directly owned | `new` | `/cv-tips/gewenst-salaris-invullen` |

Salary conclusion:

- The right expansion is not another general salary article.
- The right expansion is interview-stage and application-form intent around the existing salary pillar and tool.

### 4.7 English Expat Cluster

Current coverage is stronger than the audit assumed.

Existing seed slugs include:

- `dutch-cv-for-expats`
- `netherlands-cv-photo-rules`
- `cv-format-netherlands-english`
- `netherlands-cv-without-dutch-language`
- `translate-resume-to-dutch-format`
- `netherlands-cover-letter-basics`
- `cv-for-international-students-netherlands`
- `netherlands-cv-keywords-ats`
- `linkedin-to-cv-netherlands`
- `one-page-cv-netherlands`

English conclusion:

- Do not treat English as a missing cluster.
- First improve interlinking, CTA depth, and internal distribution across the existing 10 pages.
- Only then consider extra guides like foreigner-application logistics if those fit the product.

### 4.8 Sector / Role Gaps

This part of the audit is also partly stale.

Already present or partially present:

- freelancer / ZZP: `/cv-tips/freelance-cv-maken`
- uitzendbureau: `/cv-tips/cv-voor-uitzendbureau`
- care examples: many already live in `lib/cv-voorbeelden/examples/zorg-en-welzijn/*`
- SEO wave already includes roles like `cv-voorbeeld-schoonmaakmedewerker`

Sector conclusion:

- Do not start a new sector wave until current editorial gaps are handled.
- Use Search Console to see which missing role pages are actually demanded, instead of guessing from market size alone.

## 5. What We Should Build First

Priority order, based on true gap size plus existing infrastructure:

1. Sollicitatiegesprek support cluster around the existing pillar and quiz tool.
2. LinkedIn support cluster around the existing optimization pillar.
3. Exact-match `gat in cv` pillar page.
4. Sollicitatiebrief sub-intents that are genuinely missing.
5. Salary support pages for interview/application-stage intent.
6. English refinement on the existing 10-guide system.

## 6. Proposed Build List

### Wave 1: Highest ROI

Status: `done` on `2026-04-04`

- Refresh `/cv-tips/sollicitatiegesprek-voorbereiden`
- New `/cv-tips/sollicitatievragen`
- New `/cv-tips/meest-gestelde-sollicitatievragen`
- New `/cv-tips/sollicitatiegesprek-kleding`
- New `/cv-tips/vragen-stellen-sollicitatiegesprek`
- Add stronger internal links from all of those to `/tools/sollicitatiegesprek-quiz`

### Wave 2: Fast-follow Expansion

Status: `done` on `2026-04-04`

- Refresh `/cv-tips/linkedin-profiel-optimaliseren`
- New `/cv-tips/linkedin-profiel-maken`
- New `/cv-tips/linkedin-samenvatting-schrijven`
- New `/cv-tips/linkedin-kopregel-voorbeeld`
- Link all of them to `/cv-tips/linkedin-naar-cv`, `/tools/job-title-translator`, and the CV editor

### Wave 3: Explicit Pain-Point Capture

Status: `done` on `2026-04-04`

- New `/cv-tips/gat-in-cv-uitleggen`
- Refresh `/cv-tips/cv-na-loopbaanonderbreking`
- Strengthen internal links from `cv-na-ontslag`, `carriereswitch-cv`, and profile-text pages into the new `gat in cv` pillar

### Wave 4: Cluster Cleanup

Status: `done` on `2026-04-04`

- New `/sollicitatiebrief-beginnen`
- New `/motivatiebrief-zonder-werkervaring`
- Refresh `/open-sollicitatie-brief` to absorb `open sollicitatie schrijven`
- Refresh `/motivatiebrief-schrijven`, `/sollicitatiebrief-voorbeeld`, `/cv-tips/sollicitatiebrief-tips` so each page owns one cleaner intent

### Wave 5: Salary Intent Completion

Status: `done` on `2026-04-04`

- Refresh `/cv-tips/salarisverwachting-bepalen`
- New `/cv-tips/salaris-bespreken-sollicitatie`
- New `/cv-tips/gewenst-salaris-invullen`
- Link those pages into `/tools/salaris-onderhandeling` and the salary calculators

### Wave 6: English Refinement

Status: `done` on `2026-04-04`

- Keep English guide CTAs and section links inside the English route family (`/en/templates`, `/en/editor`, `/en/guides/*`)
- Improve internal distribution across the existing 10 English guides with more contextual related links
- Strengthen `/en` and `/en/guides` as situation-based entry hubs instead of flat card lists
- Refresh the core English landing pages so they hand off into the English guide/template/editor flow before dropping users into Dutch pages

### Wave 7: Freelancer / ZZP Expansion

Status: `done` on `2026-04-04`

- Add a dedicated example-intent page for `cv voorbeeld zzp'er` through the existing `/cv-gids` generation system
- Refresh `/cv-tips/freelance-cv-maken` so it owns structure and strategy instead of overlapping with broad example intent
- Add stronger links between the freelancer article, the new example page, `/tools/profieltekst-generator`, `/tools/werkervaring-bullets`, and `/templates`

## 7. Route Strategy by Content Type

Use the existing systems instead of creating new ones.

### Use `lib/cv-tips/articles/*` when:

- the query is informational/editorial
- the page belongs in `/cv-tips/[slug]`
- the page benefits from the shared `Article`, `FAQPage`, breadcrumbs, related articles, and article hub

Examples:

- interview support pages
- LinkedIn support pages
- `gat in cv`
- salary support pages

### Use `app/<slug>/page.tsx` when:

- the page belongs to an existing root commercial cluster
- the query behaves like a landing page, not a blog article

Examples:

- `motivatiebrief-zonder-werkervaring`
- `sollicitatiebrief-beginnen`

### Use `lib/seo-wave/data.ts` when:

- the page belongs inside the English guide system
- the page should live under `/en/guides/[slug]`

## 8. Execution Checklist Per New Page

For every new article or landing page:

1. Assign one primary keyword and one user job.
2. Decide whether it is `cv-tips`, root landing, or English guide.
3. Make sure it does not overlap too closely with an existing canonical owner.
4. Draft the page with a strong intro, answer-first sections, FAQs, and one clear CTA.
5. Add explicit tool links where relevant.
6. Add related links to the cluster pillar and adjacent pages.
7. Run `eslint`.
8. Run `npm run build`.
9. Add to internal navigation blocks where appropriate.
10. After deploy, inspect Search Console impressions and query mix before creating more pages.

## 9. Internal Linking Rules

- Every cluster needs one pillar and 2-4 support pages.
- Every support page links upward to the pillar.
- Every pillar links to the relevant tool.
- Every tool links back to the relevant pillar.
- Content should link to the editor only where the next step is truly "build or improve your CV now".

Recommended tool anchors:

- Interview cluster -> `/tools/sollicitatiegesprek-quiz`
- LinkedIn cluster -> `/tools/job-title-translator`, `/editor`
- Career-gap cluster -> `/editor`, optionally `/tools/career-change-advisor`
- Salary cluster -> `/tools/salaris-onderhandeling`, `/tools/netto-bruto-calculator`
- Letter cluster -> `/tools/sollicitatiebrief-generator`

## 10. What Not to Do

- Do not create a second broad page that duplicates `/cv-tips/sollicitatiegesprek-voorbereiden`.
- Do not create separate pages for `cv na burnout`, `cv na ziekte`, and `cv na zwangerschapsverlof` before the new `gat in cv` pillar proves demand.
- Do not treat the English cluster as missing when 10 seed pages already exist.
- Do not start a new sector wave before validating the current role/example inventory in Search Console.
- Do not create new generic salary pages when the real missing modifiers are interview-stage and form-field queries.

## 11. Success Metrics

Measure success at the cluster level, not only page by page.

- impressions and clicks per new cluster in Search Console
- unique ranking queries per new page
- whether the pillar page gains broader query coverage after support pages go live
- tool click-through rate from content pages
- editor starts from content pages
- paid conversion assisted by content sessions

## 12. Final Recommendation

If we want the cleanest next move, the best sequence is:

1. ship the interview cluster first
2. ship the LinkedIn support pages next
3. add the explicit `gat in cv` pillar
4. only then expand letters and salary support pages

That sequence uses the assets already in the repo, expands the strongest true gaps, and avoids creating another round of cannibalization.
