<?php
/**
 * Plugin Name: WerkCV Salaris Tools
 * Plugin URI: https://werkcv.nl/wordpress/salaris-tools-plugin
 * Description: Voeg Nederlandse salaris-tools toe aan je WordPress-site met Gutenberg-blokken en shortcodes.
 * Version: 0.1.1
 * Author: WerkCV
 * Author URI: https://werkcv.nl
 * License: GPLv2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: werkcv-salaris-tools
 * Requires at least: 6.4
 * Requires PHP: 8.0
 */

if (!defined('ABSPATH')) {
    exit;
}

define('WERKCV_SALARIS_TOOLS_VERSION', '0.1.1');
define('WERKCV_SALARIS_TOOLS_FILE', __FILE__);
define('WERKCV_SALARIS_TOOLS_DIR', plugin_dir_path(__FILE__));
define('WERKCV_SALARIS_TOOLS_URL', plugin_dir_url(__FILE__));

require_once WERKCV_SALARIS_TOOLS_DIR . 'includes/class-werkcv-settings.php';
require_once WERKCV_SALARIS_TOOLS_DIR . 'includes/class-werkcv-renderer.php';
require_once WERKCV_SALARIS_TOOLS_DIR . 'includes/class-werkcv-shortcodes.php';
require_once WERKCV_SALARIS_TOOLS_DIR . 'includes/class-werkcv-blocks.php';
require_once WERKCV_SALARIS_TOOLS_DIR . 'includes/class-werkcv-admin-page.php';
require_once WERKCV_SALARIS_TOOLS_DIR . 'includes/class-werkcv-plugin.php';

function werkcv_salaris_tools_activate() {
    $defaults = WerkCV_Salaris_Tools_Settings::get_defaults();

    foreach ($defaults as $key => $value) {
        add_option($key, $value);
    }
}

register_activation_hook(__FILE__, 'werkcv_salaris_tools_activate');

function werkcv_salaris_tools() {
    static $plugin = null;

    if (null === $plugin) {
        $plugin = new WerkCV_Salaris_Tools_Plugin();
    }

    return $plugin;
}

werkcv_salaris_tools()->run();
