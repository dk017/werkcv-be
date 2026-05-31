# WerkCV Attribution Report

Date: March 16, 2026  
Source: production Postgres (`AnalyticsEvent`, `Order`, `User`)  
Window: last `30` days, plus all-time checks where relevant

---

## Headline

WerkCV currently has **usage, but no paid revenue yet**.

- Total paid orders in production: `0`
- Total paid revenue in production: `€0`
- Paid orders in last `30` days: `0`
- Revenue in last `30` days: `€0`

This means the first attribution report is not yet a revenue-ranking report. It is a **funnel-baseline report** showing where activity starts and where it dies before payment.

---

## Signup source snapshot

- `[unknown]`: `6` signups
- `/` (`home`): `1` signup

Interpretation:

- attribution on older users is still mostly missing or legacy
- homepage is the only clearly tracked signup source so far

---

## Top landing pages by tracked funnel activity

### 30-day / all-time pages with the strongest downstream behavior

| Landing page | Sessions | To editor | Editor started | Checkout started | Paid orders |
|---|---:|---:|---:|---:|---:|
| `/` | `149` | `0` | `9` | `4` | `0` |
| `/gratis-cv-template` | `3` | `0` | `25` | `0` | `0` |
| `/templates` | `5` | `2` | `0` | `0` | `0` |
| `/en/dutch-cv-template` | `2` | `0` | `1` | `0` | `0` |

### Content pages with traffic but no downstream funnel movement

| Landing page | Sessions | Editor started | Paid orders |
|---|---:|---:|---:|
| `/cv-tips/cv-maken-in-het-engels` | `12` | `0` | `0` |
| `/cv-tips/cv-schrijven-tips` | `10` | `0` | `0` |
| `/cv-tips/linkedin-naar-cv` | `9` | `0` | `0` |
| `/prijzen` | `7` | `0` | `0` |
| `/cv-voorbeelden` | `6` | `0` | `0` |
| `/cv-tips/linkedin-profiel-optimaliseren` | `6` | `0` | `0` |

### Tool and jobs observations

- `/tools/netto-bruto-calculator`: `3` sessions, `0` editor starts
- jobs pages are not yet showing meaningful funnel movement in tracked conversion events

---

## What the data says

### 1. The homepage is the only real commercial entry point right now

It has by far the most sessions and it is the only page currently showing meaningful checkout intent (`4` checkout starts).

### 2. `/gratis-cv-template` has the strongest editor-start signal, but the data is noisy

It shows only `3` tracked sessions but `25` editor starts. That likely means one of these:

- repeat visitors are returning directly into the editor while keeping `/gratis-cv-template` as first-touch attribution
- there is instrumentation mismatch between landing sessions and editor attribution
- some testing traffic is mixed into the data

This page matters, but we should not trust its raw ratio yet without auditing the event flow.

### 3. Content is getting some visits, but it is not yet moving users into the product

The top CV tips pages and the `/cv-voorbeelden` hub currently show traffic without downstream product movement.

### 4. The pricing page is not acting like a conversion page yet

`/prijzen` has sessions but no tracked editor starts or checkout starts. That suggests either:

- weak CTA placement
- pricing page visitors are still in research mode
- trust proof is still too thin

### 5. Jobs are not yet a measurable acquisition channel

The jobs layer is live, but it is not yet visible as a conversion contributor in the tracked funnel.

---

## Immediate implications for the 12-week plan

### Priority 1: fix the pre-payment funnel

Because there are `0` paid orders, the next bottleneck is not more top-of-funnel content. It is:

- stronger trust
- clearer CTA routing
- cleaner event tracking
- checkout completion

### Priority 2: treat B2B as mandatory, not optional

Since B2C revenue is still at `€0`, the B2B pilot track is the fastest credible path toward the first `€1k/month` target.

### Priority 3: focus page upgrades on these pages first

1. `/`
2. `/gratis-cv-template`
3. `/templates`
4. `/prijzen`
5. `/en/dutch-cv-template`

---

## Recommended next actions from this report

1. Audit event instrumentation for `/gratis-cv-template`, `/templates`, and homepage CTA flows.
2. Add trust proof and stronger direct-product CTAs on `/` and `/gratis-cv-template`.
3. Review the checkout path from the homepage because it is the only page currently generating checkout starts.
4. Start review collection immediately to unblock trust.
5. Start manual B2B outreach immediately because the current B2C path has not yet proven paid conversion.

---

## Bottom line

WerkCV is **not yet in revenue optimization mode**.  
It is still in **first-paid-conversion mode**.

That changes the sequence:

- trust + funnel cleanup first
- B2B pilots in parallel
- selective content/jobs expansion after that
