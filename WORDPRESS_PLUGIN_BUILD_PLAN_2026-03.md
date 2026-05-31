# WerkCV WordPress Plugin Build Plan

## Approval Answer

Yes. WordPress.org does require review and approval before the plugin is published.

Current official flow:

1. Create a WordPress.org account
2. Submit the plugin zip for review
3. WordPress manually reviews it
4. It is either approved or sent back with required corrections
5. After approval, WordPress gives you an SVN repository
6. You upload the plugin there and it goes live

This is not instant self-publishing.

## Build Goal

Ship the smallest plugin that:

- passes WordPress review
- gives WerkCV a legitimate WordPress.org presence
- embeds useful Dutch salary tools
- sends qualified traffic to WerkCV without violating plugin rules

## Scope Lock

### In v1

- one plugin
- three tools
- Gutenberg block support
- shortcode support
- settings page
- hosted embed model

### Not in v1

- user accounts
- AI features
- payment
- analytics without explicit consent
- CV builder inside WordPress
- more than 3 calculators

## Deliverables

1. Plugin codebase
2. Plugin `readme.txt`
3. Plugin icons and banners
4. WerkCV landing page
5. WerkCV installation page
6. WerkCV privacy page
7. Submission zip
8. Local test environment

## Repository Recommendation

Build this in a separate repository, not inside the Next.js app repo.

Suggested repo name:

- `werkcv-salaris-tools-plugin`

Reason:

- WordPress packaging is separate from Next.js
- clearer release flow
- easier SVN deployment later

## Plugin Structure

```text
werkcv-salaris-tools/
  werkcv-salaris-tools.php
  readme.txt
  uninstall.php
  package.json
  composer.json
  assets/
  blocks/
    src/
      index.js
      block-netto-bruto.json
      block-vakantiegeld.json
      block-minimumloon.json
      edit.js
    build/
  includes/
    class-werkcv-plugin.php
    class-werkcv-settings.php
    class-werkcv-shortcodes.php
    class-werkcv-blocks.php
    class-werkcv-renderer.php
    class-werkcv-admin-page.php
  templates/
    embed-wrapper.php
  languages/
  screenshots/
```

## Runtime Model

The plugin should render a lightweight wrapper and load a hosted WerkCV calculator.

Preferred model:

- frontend wrapper is local in the plugin
- actual calculator UI comes from WerkCV-hosted embed routes
- no hidden tracking
- no forced backlink

## Hosted Embed Contract

Create three hosted routes later on WerkCV:

- `/embed/netto-bruto-calculator`
- `/embed/vakantiegeld-berekenen`
- `/embed/minimumloon-checker`

Expected query params:

- `source=wordpress`
- `tool=netto-bruto|vakantiegeld|minimumloon`
- `theme=light`
- `cta=on|off`
- `footer=on|off`
- `lang=nl`

Expected behavior:

- loads only the selected tool
- no full-site navigation
- responsive at narrow widths
- optional CTA block
- optional WerkCV footer attribution

## Plugin Bootstrap

### `werkcv-salaris-tools.php`

Responsibilities:

- plugin header
- define constants
- require include files
- instantiate main plugin class

Suggested constants:

- `WERKCV_SALARIS_TOOLS_VERSION`
- `WERKCV_SALARIS_TOOLS_FILE`
- `WERKCV_SALARIS_TOOLS_DIR`
- `WERKCV_SALARIS_TOOLS_URL`

## Main Classes

### `class-werkcv-plugin.php`

Responsibilities:

- register hooks
- initialize settings
- initialize shortcodes
- initialize blocks
- enqueue frontend assets if needed

### `class-werkcv-settings.php`

Settings:

- `werkcv_tools_default_theme`
- `werkcv_tools_enable_cta`
- `werkcv_tools_enable_footer_credit`
- `werkcv_tools_open_links_new_tab`

Default values:

- light
- on
- off
- on

### `class-werkcv-shortcodes.php`

Supported shortcodes:

- `[werkcv_netto_bruto]`
- `[werkcv_vakantiegeld]`
- `[werkcv_minimumloon]`
- `[werkcv_salaris_tool type="netto-bruto"]`

### `class-werkcv-blocks.php`

Register 3 blocks:

- `werkcv/netto-bruto`
- `werkcv/vakantiegeld`
- `werkcv/minimumloon`

Each block should expose:

- title
- description
- optional CTA toggle
- optional footer credit toggle

### `class-werkcv-renderer.php`

Responsibilities:

- validate tool type
- render the wrapper markup
- build safe embed URL
- escape all HTML attributes

## Frontend Render Contract

Rendered HTML should be simple:

```html
<div class="werkcv-tool" data-tool="netto-bruto">
  <iframe src="https://werkcv.nl/embed/netto-bruto-calculator?source=wordpress&tool=netto-bruto&theme=light&cta=on&footer=off&lang=nl"></iframe>
</div>
```

Requirements:

- lazy load iframe if possible
- set a reasonable title attribute
- allow responsive height behavior
- no admin scripts on frontend

## Admin UX

Add a small settings screen under:

- `Settings -> WerkCV Salaris Tools`

Sections:

- Default appearance
- CTA behavior
- Footer attribution
- Usage examples

Usage examples shown on screen:

- shortcode snippets
- supported blocks
- link to support docs

## Consent and Policy Guardrails

These are critical for review:

- no tracking without clear consent
- no silent external calls beyond the disclosed hosted service behavior
- no forced credits or backlinks
- no spammy upsells
- no keyword stuffing in readme
- plugin must be complete at submission time

## WerkCV Pages To Build

### 1. Landing page

Slug:

- `/wordpress/salaris-tools-plugin`

Purpose:

- Plugin URI target
- plugin overview
- screenshots
- use cases
- internal links to money pages

### 2. Installation page

Slug:

- `/wordpress/salaris-tools-plugin/installatie`

Purpose:

- support users
- reduce support load
- help review confidence

### 3. Privacy page

Slug:

- `/wordpress/salaris-tools-plugin/privacy`

Purpose:

- explain hosted embed behavior
- explain optional CTA/footer behavior
- explain whether any data is stored

## Internal Linking on WerkCV

The landing page should link to:

- `/tools`
- `/tools/netto-bruto-calculator`
- `/tools/vakantiegeld-berekenen`
- `/tools/minimumloon-checker`
- `/cv-maken`
- `/gratis-cv-maken`

Anchor examples:

- `Nederlandse salaris-tools`
- `netto-bruto calculator`
- `gratis CV maken`

## Build Sequence

### Step 1

Create the plugin repository scaffold.

### Step 2

Implement:

- plugin bootstrap
- settings class
- renderer class
- shortcode class

### Step 3

Implement Gutenberg blocks.

### Step 4

Create assets:

- icon
- banner
- screenshots

### Step 5

Create WerkCV landing/support/privacy pages.

### Step 6

Write `readme.txt`.

### Step 7

Test on a fresh WordPress install.

### Step 8

Zip and submit for review.

## Local Test Plan

Test on:

- WordPress latest stable
- PHP 8.0+
- fresh install
- classic page with shortcode
- Gutenberg page with block
- mobile viewport

Must verify:

- blocks render
- shortcodes render
- settings persist
- no PHP warnings
- no broken iframe loads
- no forced backlink

## Submission Package Checklist

- plugin zip
- complete plugin code
- `readme.txt`
- icon 128x128
- icon 256x256
- banner 772x250
- banner 1544x500
- screenshots
- support page live
- privacy page live

## Effort Estimate

For a disciplined MVP:

- scaffold + plugin logic: 2 days
- blocks + settings polish: 2 days
- WerkCV landing pages: 1 day
- assets + readme + testing: 1 day
- submission prep: 0.5 day

Total:

- about 6.5 focused days

## Decision After Approval

Once approved:

- publish v1
- monitor plugin page indexing
- add support docs
- then start the Chrome extension as the second distribution channel

