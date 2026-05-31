<?php

if (!defined('ABSPATH')) {
    exit;
}

class WerkCV_Salaris_Tools_Settings {
    public static function get_defaults() {
        return array(
            'werkcv_tools_default_theme' => 'light',
            'werkcv_tools_enable_cta' => '0',
            'werkcv_tools_enable_footer_credit' => '0',
            'werkcv_tools_open_links_new_tab' => '1',
        );
    }

    public function register() {
        register_setting(
            'werkcv_salaris_tools',
            'werkcv_tools_default_theme',
            array($this, 'sanitize_theme')
        );

        register_setting(
            'werkcv_salaris_tools',
            'werkcv_tools_enable_cta',
            array($this, 'sanitize_checkbox')
        );

        register_setting(
            'werkcv_salaris_tools',
            'werkcv_tools_enable_footer_credit',
            array($this, 'sanitize_checkbox')
        );

        register_setting(
            'werkcv_salaris_tools',
            'werkcv_tools_open_links_new_tab',
            array($this, 'sanitize_checkbox')
        );

        add_settings_section(
            'werkcv_tools_general',
            __('WerkCV Salaris Tools instellingen', 'werkcv-salaris-tools'),
            array($this, 'render_section_intro'),
            'werkcv-salaris-tools'
        );

        add_settings_field(
            'werkcv_tools_default_theme',
            __('Standaard thema', 'werkcv-salaris-tools'),
            array($this, 'render_theme_field'),
            'werkcv-salaris-tools',
            'werkcv_tools_general'
        );

        add_settings_field(
            'werkcv_tools_enable_cta',
            __('WerkCV CTA tonen', 'werkcv-salaris-tools'),
            array($this, 'render_cta_field'),
            'werkcv-salaris-tools',
            'werkcv_tools_general'
        );

        add_settings_field(
            'werkcv_tools_enable_footer_credit',
            __('WerkCV footerlink tonen', 'werkcv-salaris-tools'),
            array($this, 'render_footer_credit_field'),
            'werkcv-salaris-tools',
            'werkcv_tools_general'
        );

        add_settings_field(
            'werkcv_tools_open_links_new_tab',
            __('Links openen in nieuw tabblad', 'werkcv-salaris-tools'),
            array($this, 'render_new_tab_field'),
            'werkcv-salaris-tools',
            'werkcv_tools_general'
        );
    }

    public function get($key) {
        $defaults = self::get_defaults();
        $default = isset($defaults[$key]) ? $defaults[$key] : null;

        return get_option($key, $default);
    }

    public function sanitize_theme($value) {
        return in_array($value, array('light'), true) ? $value : 'light';
    }

    public function sanitize_checkbox($value) {
        return empty($value) ? '0' : '1';
    }

    public function render_section_intro() {
        echo '<p>' . esc_html__('Beheer standaardinstellingen voor de ingesloten WerkCV salaris-tools.', 'werkcv-salaris-tools') . '</p>';
    }

    public function render_theme_field() {
        $value = $this->get('werkcv_tools_default_theme');
        ?>
        <select name="werkcv_tools_default_theme">
            <option value="light" <?php selected($value, 'light'); ?>><?php esc_html_e('Light', 'werkcv-salaris-tools'); ?></option>
        </select>
        <?php
    }

    public function render_cta_field() {
        $this->render_checkbox(
            'werkcv_tools_enable_cta',
            __('Toon een optionele WerkCV CTA onder de tool. Standaard uit.', 'werkcv-salaris-tools')
        );
    }

    public function render_footer_credit_field() {
        $this->render_checkbox(
            'werkcv_tools_enable_footer_credit',
            __('Toon een optionele WerkCV footerlink op de publieke site. Standaard uit.', 'werkcv-salaris-tools')
        );
    }

    public function render_new_tab_field() {
        $this->render_checkbox(
            'werkcv_tools_open_links_new_tab',
            __('Open externe links in een nieuw tabblad.', 'werkcv-salaris-tools')
        );
    }

    private function render_checkbox($name, $label) {
        $value = $this->get($name);
        ?>
        <label>
            <input type="checkbox" name="<?php echo esc_attr($name); ?>" value="1" <?php checked($value, '1'); ?> />
            <?php echo esc_html($label); ?>
        </label>
        <?php
    }
}
