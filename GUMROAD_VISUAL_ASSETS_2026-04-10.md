# Gumroad Visual Assets

Last updated: 2026-04-10

## Short answer

Yes: the best Gumroad preview pages for these products should be real exports from the PDF, not invented mock pages.

Use:

- a custom thumbnail for the main product image
- 3 real PDF page exports as product previews

That gives the buyer proof that the product is real and useful.

## Exported preview files

## Generated thumbnail files

### Dutch thumbnail

- [nederlandse-cv-checklist-2026-thumbnail.png](D:/DKPlayground/werkcv/public/gumroad-thumbnails/nl/nederlandse-cv-checklist-2026-thumbnail.png)

### English thumbnail

- [english-cv-checklist-netherlands-2026-thumbnail.png](D:/DKPlayground/werkcv/public/gumroad-thumbnails/en/english-cv-checklist-netherlands-2026-thumbnail.png)

### Dutch product

- [nederlandse-cv-checklist-2026-preview-1-cover.png](D:/DKPlayground/werkcv/public/gumroad-previews/nl/nederlandse-cv-checklist-2026-preview-1-cover.png)
- [nederlandse-cv-checklist-2026-preview-2-ats-structure.png](D:/DKPlayground/werkcv/public/gumroad-previews/nl/nederlandse-cv-checklist-2026-preview-2-ats-structure.png)
- [nederlandse-cv-checklist-2026-preview-3-final-review.png](D:/DKPlayground/werkcv/public/gumroad-previews/nl/nederlandse-cv-checklist-2026-preview-3-final-review.png)

### English product

- [english-cv-checklist-netherlands-2026-preview-1-cover.png](D:/DKPlayground/werkcv/public/gumroad-previews/en/english-cv-checklist-netherlands-2026-preview-1-cover.png)
- [english-cv-checklist-netherlands-2026-preview-2-ats-structure.png](D:/DKPlayground/werkcv/public/gumroad-previews/en/english-cv-checklist-netherlands-2026-preview-2-ats-structure.png)
- [english-cv-checklist-netherlands-2026-preview-3-final-review.png](D:/DKPlayground/werkcv/public/gumroad-previews/en/english-cv-checklist-netherlands-2026-preview-3-final-review.png)

## What each preview should do

### Preview 1: Cover page

Purpose:

- show the product title clearly
- establish the product as a real PDF
- communicate that this is a structured checklist, not a vague ebook

Use as:

- first product preview image

### Preview 2: ATS / structure page

Purpose:

- prove the checklist has practical value
- show that the product includes concrete checks, not generic motivation
- connect directly to WerkCV's ATS-friendly positioning

Use as:

- second product preview image

### Preview 3: Final review page

Purpose:

- show the product ends in an actionable pre-send checklist
- make the checklist feel complete and practical
- reinforce that this is built for real applications

Use as:

- third product preview image

## Thumbnail recommendation

Do not use a raw page export as the main thumbnail.

Use a cleaner custom marketplace thumbnail with:

- one A4 page mockup in the center
- off-white background
- black text
- mustard-yellow accent
- no fake people
- no fake laptop
- no fake dashboard
- no clutter

## Exact thumbnail text layout

### Dutch thumbnail

Text:

- top kicker: `Gratis PDF checklist`
- main title line 1: `Nederlandse CV`
- main title line 2: `Checklist 2026`
- support line: `Voor vacatures in Nederland`

Layout:

- top kicker in a small pill or narrow strip near the top-left
- main title large and left-aligned in the middle-left
- support line smaller below the title
- optional tiny bottom line: `WerkCV`

### English thumbnail

Text:

- top kicker: `Free PDF checklist`
- main title line 1: `English CV Checklist`
- main title line 2: `for Jobs in the Netherlands`
- support line: `For expats and international candidates`

Layout:

- same structure as Dutch for visual consistency
- keep line 2 slightly smaller than line 1 if needed

## Optional overlay layout for preview images

The raw preview exports are already usable. If you want a light overlay treatment, keep it minimal.

### Dutch preview overlays

Preview 1 overlay:

- small top-left label: `Voorbeeld uit de PDF`

Preview 2 overlay:

- small top-left label: `ATS en structuur`

Preview 3 overlay:

- small top-left label: `Laatste controle`

### English preview overlays

Preview 1 overlay:

- small top-left label: `Inside the PDF`

Preview 2 overlay:

- small top-left label: `ATS and structure`

Preview 3 overlay:

- small top-left label: `Final review`

Overlay rules:

- use only one small label
- keep it outside the page body if possible
- do not cover the checklist text
- do not add multiple banners or sales stickers

## Prompt for thumbnail generation

Use this with your image tool. Add the Dutch or English title manually afterwards if the generated typography is not reliable.

```text
Create a clean, premium marketplace thumbnail for a downloadable PDF checklist.
Style: editorial, minimal, practical, modern, trustworthy, not flashy, not salesy.
Show a single A4 PDF cover floating slightly above an off-white background with subtle paper texture and soft shadow.
Use black, warm off-white, and a strong mustard-yellow accent.
Add a clear title area with strong hierarchy and generous whitespace.
Include 2 to 3 tiny checklist or paper-tab details for depth, but keep the composition quiet and professional.
No fake people, no laptop mockups, no fake dashboards, no stock-office scene, no clutter.
The result should feel like a premium career worksheet for job seekers in the Netherlands.
Aspect ratio: square.
High resolution.
```

## Prompt for framed preview mockups

If you want to turn the raw page export into a more styled preview, use the real exported PNG as the source image and keep the page unchanged.

```text
Use the attached exported PDF page as the exact central asset.
Do not rewrite, redraw, or hallucinate the page text.
Create a polished product preview image with the real A4 page centered on a calm off-white editorial background.
Add subtle paper texture, soft shadow, and one restrained mustard-yellow accent block.
Keep the page fully legible and clearly the focus.
No fake UI, no fake people, no desk clutter, no exaggerated 3D effects.
The result should feel like a premium Gumroad preview for a practical career checklist.
Aspect ratio: portrait 4:5.
High resolution.
```

## Re-export command

If the PDF changes later, re-export the previews with:

```powershell
python scripts\export_gumroad_preview_images.py
```

Regenerate the local thumbnails with:

```powershell
python scripts\generate_gumroad_thumbnails.py
```
