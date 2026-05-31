# Jobs Layer Strategy (NL + English-Speaking Jobs MVP)

Reference date: March 14, 2026

## Goal

Use a narrow jobs layer to attract qualified visitors who are likely to need:

- a Dutch CV
- an English CV adapted for the Netherlands
- ATS optimization
- job-specific CV tailoring

This is not a plan to build a generic job board.

## Core Decision

Do not build broad pages like:

- `remote jobs`
- `work from home jobs`
- `startup jobs amsterdam`

Those keywords are too broad, too global, and weakly aligned with WerkCV's real conversion path.

Build around Netherlands-specific English-speaker intent instead.

## Keyword Thesis

The strongest Dutch signals found so far are:

- `engelstalige vacatures` -> `500`
- `vacatures voor engelstaligen` -> `500`
- `vacatures engelstalig` -> `500`

Promising secondary signals:

- `vacatures zonder nederlandse taal` -> `50`
- `banen zonder nederlandse taal` -> `50`
- `uitzendbureau voor engelstaligen` -> `50`
- `uitzendbureau engelstalig` -> `50`
- `engelstalige vacatures rotterdam` -> `50`

English signals worth validating again with Netherlands-only targeting:

- `english speaking jobs netherlands`
- `dutch jobs for english speakers`
- `jobs in netherlands without dutch`
- `english speaking jobs amsterdam`
- `english speaking jobs rotterdam`

## MVP Route Plan

### P0 listings

- `/vacatures/engelstalige-vacatures-nederland`
- `/vacatures/vacatures-voor-engelstaligen`
- `/vacatures/banen-zonder-nederlandse-taal`

### P1 English listings

- `/jobs/english-speaking-jobs-netherlands`
- `/jobs/jobs-in-netherlands-without-dutch`

### P1 supporting guides

- `/gids/uitzendbureau-voor-engelstaligen`
- `/gids/werken-in-nederland-zonder-nederlands`
- `/gids/cv-voor-engelstalige-vacatures`

### P2 city expansions

- `/vacatures/engelstalige-vacatures-rotterdam`
- `/vacatures/engelstalige-vacatures-amsterdam`
- `/vacatures/engelstalige-vacatures-den-haag`
- `/jobs/english-speaking-jobs-the-hague`

## Category Strategy

Do not treat the jobs layer as "tech only".

Current source mix is tech-heavy because ATS-friendly international employers are the fastest feeds to verify. That is a sourcing shortcut, not the target market.

The public jobs product should be organized on four axes:

- `role family`: sales, marketing, finance/accounting, customer support, operations, product/design, data, engineering
- `seniority`: internship, graduate, junior, mid, senior, manager, director
- `access`: english-friendly, without dutch, visa-possible
- `location`: Netherlands first, then major cities only when density is real

Current publish rule:

- role page only if it has at least `15` live jobs
- and at least `5` different companies

Current measured status from the first role-density pass:

- publish now: `starter jobs`, `sales jobs`
- later after more sources: `marketing`, `finance/accounting`, `customer support`, `operations`
- do not prioritize publicly even if it qualifies: `engineering`
  because it is not the strongest conversion audience for WerkCV today

## Product Rules

Each job page must do more than list a vacancy.

Each job detail page should include:

- source company / ATS source
- original apply URL
- city / remote / hybrid
- language fit label (`Engels mogelijk`, `Nederlands vereist`, `Internationaal team`)
- optional visa or expat hint if clearly present
- key CV keywords extracted from the role
- CTA to a relevant WerkCV asset

Primary CTA targets:

- `/en/dutch-cv-template`
- `/engels-cv-template`
- `/tools/ats-cv-checker`
- `/tools/cv-keywords`
- `/editor`

## Data Source Strategy

### Start with public ATS feeds

Use these first because they are low-cost and structurally predictable:

- Greenhouse Job Board API
- Lever Postings API
- Ashby Job Postings API
- Workable published jobs / careers endpoints

### Use later only if needed

- Jooble for wider market coverage
- Adzuna for experiments or market/salary pages

### Do not start with

- generic scraping of large job boards
- Indeed-first ingestion
- giant remote-work aggregators

## Company Acquisition Strategy

Build a seed list of `50-100` companies that:

- hire in the Netherlands
- use Greenhouse, Lever, Ashby, or Workable
- are likely to post English-friendly roles

Priority company buckets:

- tech / SaaS companies in Amsterdam, Rotterdam, Eindhoven, Utrecht
- international operations / support hubs
- logistics and customer-support employers with English-speaking teams
- scale-ups and multinationals hiring in the Randstad

## Relevance Rules

Only publish jobs that match at least one of these:

- located in the Netherlands
- remote but explicitly open to NL-based candidates
- English job description
- description states English is the working language
- no Dutch required
- international / expat-friendly wording

Skip jobs that are:

- stale / likely closed
- not clearly tied to NL hiring
- too thin to produce a useful page
- duplicate across sources

## Normalized Job Schema

Suggested normalized fields:

```ts
type NormalizedJob = {
  provider: "greenhouse" | "lever" | "ashby" | "workable";
  externalId: string;
  companySlug: string;
  companyName: string;
  title: string;
  locationRaw: string;
  city?: string;
  countryCode?: string;
  remoteMode?: "remote" | "hybrid" | "onsite";
  employmentType?: string;
  languageHint?: "english" | "dutch" | "mixed" | "unknown";
  dutchRequired?: boolean | null;
  visaHint?: boolean | null;
  roleFamily?: "engineering" | "data" | "product_design" | "sales" | "marketing" | "customer_support" | "customer_success" | "operations" | "finance_accounting" | "hr_people" | "legal_compliance" | "admin_office" | "logistics_supply_chain" | "general_business" | "unknown";
  seniority?: "internship" | "graduate" | "junior" | "mid" | "senior" | "lead" | "manager" | "director" | "executive" | "unknown";
  descriptionText: string;
  applyUrl: string;
  postedAt?: string;
  sourceUrl: string;
  keywords: string[];
  clusterTags: string[];
};
```

Shared schema implementation now exists in:

- `scripts/jobs/schema.py` for ingestion
- `lib/jobs/types.ts` for the Next.js app layer

## Ingestion Plan

### Phase 1: fetch

Fetch raw JSON from each provider and save snapshots.

Suggested files:

- `scripts/jobs/fetch_greenhouse.py`
- `scripts/jobs/fetch_lever.py`
- `scripts/jobs/fetch_ashby.py`
- `scripts/jobs/fetch_workable.py`

Suggested output:

- `data/jobs/raw/greenhouse/*.json`
- `data/jobs/raw/lever/*.json`
- `data/jobs/raw/ashby/*.json`
- `data/jobs/raw/workable/*.json`

### Phase 2: normalize

Convert each provider format into one shared schema.

Suggested file:

- `scripts/jobs/normalize_jobs.py`

Output:

- `data/jobs/normalized/jobs.json`

### Phase 3: classify

Apply rules to create job clusters:

- `english_speaking_nl`
- `without_dutch`
- `visa_possible`
- `city_amsterdam`
- `city_rotterdam`
- `city_the_hague`

Suggested file:

- `scripts/jobs/classify_jobs.py`

Output:

- `data/jobs/derived/english-speaking-jobs-netherlands.json`
- `data/jobs/derived/jobs-in-netherlands-without-dutch.json`
- `data/jobs/derived/engelstalige-vacatures-nederland.json`

### Phase 4: page export

Export page-ready payloads or JSON snapshots for the Next.js app.

Suggested file:

- `scripts/jobs/export_page_payloads.py`

## Why Python First

Python is acceptable for the first ingestion pass because:

- requests / parsing are quick to prototype
- classification logic is easy to iterate
- we can save snapshots and inspect them manually

But for production maintenance, TypeScript may be better later because:

- the app is already in Next.js / TypeScript
- shared types become easier
- deployment and local tooling stay in one stack

Recommended compromise:

- prototype ingestion in Python
- keep outputs as versioned JSON
- migrate critical logic to TypeScript only if the jobs layer proves useful

## SEO / Product Guardrails

- Do not publish empty search-result pages
- Do not publish near-duplicate city pages with the same jobs
- Add `JobPosting` structured data only on valid single job pages
- Keep listing pages focused on curation and filters, not thin pagination spam
- Expire or remove stale jobs regularly

## Success Criteria

This experiment is worth continuing only if it produces one of these:

- indexed job pages that drive visitors into `/editor`
- job-page visitors using `ATS checker` or `CV keywords`
- assisted signups from the jobs layer

Stop or narrow the experiment if:

- it becomes a freshness burden
- pages are too thin
- traffic is broad but low-intent
- job pages do not produce editor starts

## Immediate Next Steps

1. Re-run the English cluster with Netherlands-only targeting in Keyword Planner.
2. Lock the first `3` listing routes and `3` support-guide routes.
3. Build the first `50` company source list across Greenhouse, Lever, Ashby, and Workable.
4. Prototype the raw fetch stage in Python and save provider snapshots locally.
5. Review `20-30` fetched jobs manually before any pages are created.



