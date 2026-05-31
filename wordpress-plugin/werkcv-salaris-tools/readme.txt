=== WerkCV Salaris Tools ===
Contributors: rdhinesh17
Tags: salary calculator, net pay, holiday pay, minimum wage, netherlands
Requires at least: 6.4
Tested up to: 6.9
Requires PHP: 8.0
Stable tag: 0.1.1
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Add Dutch salary tools to your WordPress site with Gutenberg blocks and shortcodes.

== Description ==

WerkCV Salaris Tools helps Dutch career, HR, and expat sites add practical salary tools without custom development or local calculation logic.

The plugin uses hosted embeds from WerkCV.nl. This makes it possible to publish useful Netherlands-focused salary tools without maintaining tax rules, salary tables, or yearly updates inside WordPress.

Included in this version:

* Net-to-gross salary calculator
* Holiday pay calculator
* Minimum wage / hourly wage checker

Available as:

* Gutenberg blocks
* Shortcodes

Useful for:

* career blogs
* HR and recruitment sites
* education and career service pages
* expat and relocation content

Important notes:

* The plugin does not require a public backlink.
* WerkCV CTA and footer credit options are optional and disabled by default.
* Support and privacy information are published on WerkCV.nl.

Support and documentation:

* [Plugin overview](https://werkcv.nl/wordpress/salaris-tools-plugin)
* [Installation guide](https://werkcv.nl/wordpress/salaris-tools-plugin/installatie)
* [Privacy information](https://werkcv.nl/wordpress/salaris-tools-plugin/privacy)
* [Terms](https://werkcv.nl/voorwaarden)

Source code and build instructions:

* The plugin package includes the readable source files required to rebuild the block assets
* Gutenberg block source files live in `blocks/src`
* Compiled block assets live in `blocks/build`
* Build tooling is documented in `package.json` and `webpack.config.js`
* To rebuild block assets: `npm install` and `npm run build`

== Installation ==

1. Upload and activate the plugin.
2. Insert a block or use a shortcode.
3. Adjust optional settings under Settings -> WerkCV Salaris Tools.

Shortcode examples:

* `[werkcv_netto_bruto]`
* `[werkcv_vakantiegeld]`
* `[werkcv_minimumloon]`

== Frequently Asked Questions ==

= Does it work with Gutenberg? =

Yes. The plugin includes three Gutenberg blocks for the included tools.

= Can I place the tools with shortcodes? =

Yes. You can use a shortcode per tool or the generic shortcode variant.

= Do I need a WerkCV account? =

No. A WerkCV account is not required to embed the tools.

= Is a backlink added automatically? =

No. An optional WerkCV link can be enabled in the settings.

= Where can I find support and privacy information? =

* [Support](https://werkcv.nl/wordpress/salaris-tools-plugin)
* [Installation](https://werkcv.nl/wordpress/salaris-tools-plugin/installatie)
* [Privacy](https://werkcv.nl/wordpress/salaris-tools-plugin/privacy)
* [Terms](https://werkcv.nl/voorwaarden)

= Where can I review the source code and build files? =

The Gutenberg block source is included in `blocks/src`, compiled assets are in `blocks/build`, and the build process is documented in `package.json` and `webpack.config.js`.

== Screenshots ==

1. Gutenberg block selector with the three WerkCV tools
2. Net-to-gross calculator on a published page
3. Settings page for CTA, footer credit, and default theme
4. Mobile view of an embedded tool

== Changelog ==

= 0.1.1 =

Added direct support, installation, privacy, and terms links to the WordPress.org readme.

= 0.1.0 =

Initial release with 3 Dutch salary tools, shortcode support, and Gutenberg blocks.
