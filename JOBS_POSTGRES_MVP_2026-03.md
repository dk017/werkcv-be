# Jobs Postgres MVP (Schema + Routes)

Reference date: March 14, 2026

## Why Postgres, not SQLite

SQLite could work for a local-only jobs prototype, but WerkCV already runs on Postgres for:

- users
- sessions
- orders
- analytics events

For the jobs MVP, Postgres is the better fit because:

- we already operate it in production
- jobs need multi-field filtering for SEO listings
- import runs will update many rows in batches
- future analytics joins become straightforward

Conclusion:

- preview stage can stay file-based
- public jobs MVP should move to Postgres, not SQLite

## Canonical URL Model

Do not use slugs as the filtering system.

Use two layers:

### 1. Canonical single job pages

One job = one canonical page.

Route shape:

- `/jobs/[companySlug]/[providerJobId]-[jobSlug]`

Example:

- `/jobs/databricks/8189900002-ai-engineer-fde-forward-deployed-engineer`

Why this shape:

- `providerJobId` keeps the URL stable and unique
- `jobSlug` keeps it readable
- `companySlug` creates a predictable hierarchy

### 2. Curated filtered listing pages

These are SEO pages for clusters, not open-ended search result pages.

Initial route set:

- `/vacatures/engelstalige-vacatures-nederland`
- `/vacatures/vacatures-voor-engelstaligen`
- `/vacatures/banen-zonder-nederlandse-taal`
- `/jobs/english-speaking-jobs-netherlands`
- `/jobs/jobs-in-netherlands-without-dutch`
- `/jobs/visa-sponsorship-jobs-netherlands`

These pages should only exist if the dataset passes threshold rules.

## Page Generation Rules

Publish a filtered listing page only if:

- it has at least `10-15` live jobs
- from at least `5` distinct companies
- with a real unique promise

Do not generate:

- thin city pages
- keyword permutations with the same jobs
- title pages like `/jobs/customer-service-jobs-netherlands` before there is enough density

## Data Model

### `JobSource`

Stores the upstream source, usually one company ATS board.

Purpose:

- fetch scheduling
- source health
- provider-specific metadata

Important fields:

- `provider`
- `sourceKey`
- `apiUrl`
- `careersUrl`
- `status`
- `priority`
- `lastFetchedAt`
- `lastSuccessfulFetchAt`

### `Job`

Stores the normalized job that can be rendered into:

- canonical job pages
- filtered listing pages
- later analytics and freshness workflows

Important fields:

- `provider`
- `externalId`
- `companySlug`
- `titleSlug`
- `canonicalSlug`
- `routePath`
- `countryCode`
- `citySlug`
- `languageHint`
- `dutchRequired`
- `visaHint`
- `isNlRelevant`
- `isEnglishFriendly`
- `isWithoutDutch`
- `keywords`
- `clusterTags`

### `JobListingPage`

Stores curated filtered pages.

Purpose:

- one row per SEO listing page
- explicit filters
- explicit thresholds
- editable metadata and CTA

Important fields:

- `path`
- `locale`
- `kind`
- `filters`
- `minJobCount`
- `minCompanyCount`
- `metaTitle`
- `metaDesc`
- `primaryCtaHref`

## Slug Policy

### Single job page slug

Build from:

- `providerJobId`
- normalized title slug

Example logic:

```ts
jobPath = `/jobs/${companySlug}/${externalId}-${titleSlug}`;
```

This should be stored on the job row so route generation is deterministic.

### Listing page slug

Do not derive these from raw query params.

They should come from a curated config or seeded `JobListingPage` rows.

That avoids:

- duplicate pages
- unstable URLs
- accidental SEO spam

## First MVP Queries

### English-speaking Netherlands jobs

Filter:

- `countryCode = "NL"`
- `isNlRelevant = true`
- `isEnglishFriendly = true`

### Jobs in the Netherlands without Dutch

Filter:

- `countryCode = "NL"`
- `isNlRelevant = true`
- `isWithoutDutch = true`

### Visa sponsorship jobs Netherlands

Filter:

- `countryCode = "NL"`
- `isNlRelevant = true`
- `visaHint = true`

## What should stay out of scope for now

- title-specific listing pages
- city + title long-tail pages
- generic remote/work-from-home clusters
- free-text job search index pages

## Immediate build sequence

1. Add Prisma models and generate the client.
2. Seed the first curated listing pages into `JobListingPage`.
3. Add an importer that upserts `JobSource` and `Job`.
4. Read listing pages from Postgres, not JSON files.
5. Keep `/jobs-preview` as a QA route until the public jobs layer is strong enough to launch.
