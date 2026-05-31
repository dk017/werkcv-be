<?php

if (!defined('ABSPATH')) {
    exit;
}

class WerkCV_Salaris_Tools_Renderer {
    /**
     * @var WerkCV_Salaris_Tools_Settings
     */
    private $settings;

    public function __construct($settings) {
        $this->settings = $settings;
    }

    public function render($tool, $atts = array()) {
        $tool_config = $this->get_tool_config($tool);

        if (!$tool_config) {
            return '';
        }

        $theme = $this->resolve_theme($atts);
        $cta = $this->resolve_toggle($atts, 'cta', 'werkcv_tools_enable_cta');
        $footer = $this->resolve_toggle($atts, 'footer', 'werkcv_tools_enable_footer_credit');

        $iframe_src = add_query_arg(
            array(
                'source' => 'wordpress',
                'tool' => $tool_config['slug'],
                'theme' => $theme,
                'cta' => $cta ? 'on' : 'off',
                'footer' => $footer ? 'on' : 'off',
                'lang' => 'nl',
            ),
            $tool_config['embed_url']
        );

        $iframe_title = $tool_config['title'];
        $wrapper_class = 'werkcv-salaris-tool werkcv-salaris-tool--' . sanitize_html_class($tool_config['slug']);

        ob_start();
        include WERKCV_SALARIS_TOOLS_DIR . 'templates/embed-wrapper.php';
        return ob_get_clean();
    }

    private function resolve_theme($atts) {
        if (isset($atts['theme']) && 'light' === $atts['theme']) {
            return 'light';
        }

        return $this->settings->get('werkcv_tools_default_theme');
    }

    private function resolve_toggle($atts, $att_name, $setting_key) {
        if (isset($atts[$att_name])) {
            if (is_bool($atts[$att_name])) {
                return $atts[$att_name];
            }

            return in_array($atts[$att_name], array('1', 'true', 'yes', 'on'), true);
        }

        return '1' === $this->settings->get($setting_key);
    }

    private function get_tool_config($tool) {
        $tools = array(
            'netto-bruto' => array(
                'slug' => 'netto-bruto',
                'title' => __('Netto-bruto calculator', 'werkcv-salaris-tools'),
                'embed_url' => 'https://werkcv.nl/embed/netto-bruto-calculator',
            ),
            'vakantiegeld' => array(
                'slug' => 'vakantiegeld',
                'title' => __('Vakantiegeld calculator', 'werkcv-salaris-tools'),
                'embed_url' => 'https://werkcv.nl/embed/vakantiegeld-berekenen',
            ),
            'minimumloon' => array(
                'slug' => 'minimumloon',
                'title' => __('Minimumloon checker', 'werkcv-salaris-tools'),
                'embed_url' => 'https://werkcv.nl/embed/minimumloon-checker',
            ),
        );

        return isset($tools[$tool]) ? $tools[$tool] : null;
    }
}
