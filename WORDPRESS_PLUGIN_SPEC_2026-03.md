# WerkCV WordPress Plugin Spec

## Goal

Build a real WordPress plugin that:

- earns a trusted backlink and brand surface on `wordpress.org`
- solves a real need for Dutch publishers
- drives qualified traffic back to `werkcv.nl`
- stays compliant with WordPress plugin rules

The plugin should not exist only for SEO. It needs to be useful on its own.

## Recommended Plugin

### Working name

`WerkCV Salaris Tools`

### Recommended slug

`werkcv-salaris-tools`

Fallback slug if needed:

- `nederlandse-salaris-tools`

## Why This Plugin First

This is a better first plugin than a CV-builder plugin because:

- publishers are more likely to embed salary widgets than a full CV builder
- WerkCV already has Dutch salary/tool authority on-site
- salary intent is close to job-change intent
- career blogs, expat sites, loopbaancoaches, HR blogs, and job sites can all use it
- it creates a cleaner path from utility traffic into CV pages

## MVP Scope

Ship one plugin with three embeddable tools:

1. Netto-bruto calculator
2. Vakantiegeld calculator
3. Minimumloon / uurloon checker

Do not ship more in v1.

## Product Rules

- The plugin must work without creating a WerkCV account.
- The plugin must not force a public backlink.
- Any WerkCV branding/footer link must be optional in settings.
- The embedded calculator must be fast and visually clean.
- The plugin must be usable through both:
  - Gutenberg block
  - shortcode

## User Value

The plugin helps WordPress site owners add Dutch salary tools without custom coding.

Target users:

- Dutch career blogs
- expat blogs for Netherlands
- HR blogs
- loopbaancoaches
- recruitment agencies with content sites
- job boards and niche employment sites

## Positioning

### One-line positioning

`Voeg Nederlandse salaris-tools toe aan je WordPress-site met een Gutenberg-blok of shortcode.`

### What it is not

- not a full HR suite
- not payroll software
- not a CV builder inside WordPress

## Technical Approach

Use a lightweight WordPress plugin that renders tools in either of two ways:

### Preferred v1

Embed a hosted WerkCV calculator app inside a controlled wrapper.

Benefits:

- fastest to ship
- reuses existing WerkCV calculation logic
- keeps calculation updates centralized
- easier to maintain legal/tax changes in one place

Tradeoff:

- relies on external hosted assets from WerkCV

### Optional v2

Port the calculation logic fully into PHP/JS inside the plugin.

Do not do this for v1 unless WordPress review specifically forces a different design.

## Architecture

### Plugin structure

```text
werkcv-salaris-tools/
  werkcv-salaris-tools.php
  readme.txt
  uninstall.php
  assets/
    banner-772x250.png
    banner-1544x500.png
    icon-128x128.png
    icon-256x256.png
  includes/
    class-werkcv-plugin.php
    class-werkcv-admin.php
    class-werkcv-shortcodes.php
    class-werkcv-blocks.php
    class-werkcv-renderer.php
    class-werkcv-settings.php
  blocks/
    build/
    src/
      index.js
      block.json
      edit.js
      save.js
  templates/
    calculator-wrapper.php
  languages/
    werkcv-salaris-tools.pot
  screenshots/
    screenshot-1.png
    screenshot-2.png
    screenshot-3.png
    screenshot-4.png
```

## Core Files

### `werkcv-salaris-tools.php`

Responsibilities:

- plugin header
- constants
- activation hooks
- bootstrap main plugin class

Suggested header fields:

```php
<?php
/**
 * Plugin Name: WerkCV Salaris Tools
 * Plugin URI: https://werkcv.nl/wordpress/salaris-tools-plugin
 * Description: Voeg Nederlandse salaris-tools toe aan je WordPress-site met Gutenberg-blokken en shortcodes.
 * Version: 0.1.0
 * Author: WerkCV
 * Author URI: https://werkcv.nl
 * License: GPLv2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: werkcv-salaris-tools
 * Requires at least: 6.4
 * Requires PHP: 8.0
 */
```

### `class-werkcv-renderer.php`

Responsibilities:

- render a tool container with settings
- output data attributes for tool type, locale, theme
- whitelist tool IDs
- escape all attributes correctly

### `class-werkcv-shortcodes.php`

Shortcodes:

- `[werkcv_netto_bruto]`
- `[werkcv_vakantiegeld]`
- `[werkcv_minimumloon]`
- `[werkcv_salaris_tool type="netto-bruto"]`

### `class-werkcv-blocks.php`

Blocks:

- `werkcv/netto-bruto-calculator`
- `werkcv/vakantiegeld-calculator`
- `werkcv/minimumloon-checker`

## Embed Model

### Recommended hosted endpoint pattern

Create lightweight embeddable routes on WerkCV later, for example:

- `/embed/netto-bruto-calculator`
- `/embed/vakantiegeld-berekenen`
- `/embed/minimumloon-checker`

The plugin iframe or script wrapper points to those routes.

Required query params:

- `source=wordpress`
- `tool=...`
- `theme=light|dark`
- `lang=nl`
- optional `cta=on|off`

## Admin Settings

Add a settings page under `Settings -> WerkCV Salaris Tools`.

Settings:

- Enable WerkCV footer link: yes/no
- Theme: light/default
- Default CTA: yes/no
- Open CTA in new tab: yes/no

Default settings:

- footer link: off
- CTA: on
- new tab: on

## CTA Rules

CTA copy inside the embedded tool must be soft and relevant:

- `Nieuw CV nodig? Maak gratis een CV op WerkCV`
- `Gebruik onze CV-builder voor je volgende sollicitatie`

Do not make the plugin feel like an ad unit.

## Landing Pages on WerkCV

Create these site pages before submission:

1. `/wordpress/salaris-tools-plugin`
2. `/wordpress/salaris-tools-plugin/installatie`
3. `/wordpress/salaris-tools-plugin/privacy`

### Main landing page sections

- Hero:
  - `Nederlandse salaris-tools voor WordPress`
  - `Voeg een netto-bruto calculator, vakantiegeld tool en minimumloon checker toe aan je site.`
- Who it is for
- Available widgets
- Gutenberg + shortcode examples
- Why use it
- FAQ
- Support and installation links
- Internal links into:
  - `/tools`
  - `/tools/netto-bruto-calculator`
  - `/tools/vakantiegeld-berekenen`
  - `/tools/minimumloon-checker`
  - `/cv-maken`
  - `/gratis-cv-maken`

### Installation page sections

- Requirements
- Install from WordPress.org
- Activate plugin
- Add block
- Use shortcode
- Configure optional CTA/footer settings

### Privacy page sections

- what the plugin renders
- whether embedded tool calls WerkCV-hosted assets
- what analytics, if any, are collected
- no payment processing in plugin
- support contact

## Readme Structure

The `readme.txt` should include:

```text
=== WerkCV Salaris Tools ===
Contributors: werkcv
Tags: salaris calculator, netto bruto, vakantiegeld, minimumloon, nederland
Requires at least: 6.4
Tested up to: 6.8
Requires PHP: 8.0
Stable tag: 0.1.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Voeg Nederlandse salaris-tools toe aan je WordPress-site met Gutenberg-blokken en shortcodes.

== Description ==

WerkCV Salaris Tools helpt Nederlandse career-, HR- en expat-sites om praktische salaris-tools toe te voegen zonder maatwerk.

Inbegrepen in deze versie:
- Netto-bruto calculator
- Vakantiegeld calculator
- Minimumloon / uurloon checker

Gebruik:
- Gutenberg blokken
- shortcodes

== Installation ==

1. Upload en activeer de plugin
2. Voeg een blok toe of gebruik een shortcode
3. Pas optionele instellingen aan

== Frequently Asked Questions ==

= Werkt dit met Gutenberg? =
Ja.

= Kan ik de tools met shortcodes plaatsen? =
Ja.

= Moet ik een WerkCV-account hebben? =
Nee.

= Wordt er automatisch een backlink geplaatst? =
Nee. Een optionele WerkCV-link kan in instellingen worden aangezet.

== Screenshots ==

1. Gutenberg blok selector
2. Netto-bruto calculator op een pagina
3. Vakantiegeld tool op mobiel
4. Instellingenpagina

== Changelog ==

= 0.1.0 =
Eerste release met 3 Nederlandse salaris-tools
```

## Submission Checklist

Before submitting to WordPress.org:

- plugin runs on fresh WordPress install
- no PHP warnings
- block works in Gutenberg
- shortcodes work in classic editor/pages
- no forced backlink in frontend
- all outbound links are optional or clearly user-controlled
- `readme.txt` validates
- plugin icon and banner assets prepared
- screenshots match actual functionality
- GPL-compatible license included
- privacy page live
- support page live
- installation page live

## Review Risk Areas

Things likely to trigger WordPress review issues:

- hidden external calls without disclosure
- forced attribution links
- misleading “free” claims
- plugin acting as a thin ad wrapper
- loading large third-party scripts unnecessarily
- poor i18n or escaping

## Launch Assets Needed

Prepare:

- plugin icon 128x128
- plugin icon 256x256
- banner 772x250
- banner 1544x500
- 4 screenshots
- 132-char short description
- long description

## Suggested Short Description

`Voeg Nederlandse salaris-tools toe aan je WordPress-site met Gutenberg-blokken en shortcodes.`

## Suggested Longer Marketing Copy

`WerkCV Salaris Tools maakt het eenvoudig om praktische Nederlandse salaris-widgets toe te voegen aan je WordPress-site. Gebruik een Gutenberg-blok of shortcode om een netto-bruto calculator, vakantiegeld calculator of minimumloon checker te tonen op career-, HR- of expatpagina's.`

## Tracking and SEO

Use dedicated inbound routes from the plugin landing page into WerkCV:

- `/tools`
- `/cv-maken`
- `/gratis-cv-maken`

Recommended UTM pattern for optional plugin CTA links:

- `utm_source=wordpress`
- `utm_medium=plugin`
- `utm_campaign=werkcv_salaris_tools`

## Build Order

### Phase 1

- write plugin scaffold
- build one shared renderer
- add 3 shortcodes
- add 3 blocks
- add settings page

### Phase 2

- create WerkCV landing pages
- create plugin assets
- prepare readme
- test on clean WordPress install

### Phase 3

- submit to WordPress.org
- respond to review feedback
- publish support/install docs

## Definition of Done

This plugin is ready when:

- WordPress.org submission is accepted
- the plugin page links back to WerkCV through standard metadata
- at least one real widget page is live on WerkCV
- the plugin is installable without custom support
- the plugin creates a legitimate distribution channel for WerkCV tools

