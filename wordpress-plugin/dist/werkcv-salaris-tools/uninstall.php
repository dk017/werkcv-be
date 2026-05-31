<?php

if (!defined('WP_UNINSTALL_PLUGIN')) {
    exit;
}

$werkcv_tools_option_keys = array(
    'werkcv_tools_default_theme',
    'werkcv_tools_enable_cta',
    'werkcv_tools_enable_footer_credit',
    'werkcv_tools_open_links_new_tab',
);

foreach ($werkcv_tools_option_keys as $werkcv_tools_option_key) {
    delete_option($werkcv_tools_option_key);
}
