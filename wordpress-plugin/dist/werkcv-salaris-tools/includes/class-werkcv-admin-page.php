<?php

if (!defined('ABSPATH')) {
    exit;
}

class WerkCV_Salaris_Tools_Admin_Page {
    /**
     * @var WerkCV_Salaris_Tools_Settings
     */
    private $settings;

    public function __construct($settings) {
        $this->settings = $settings;
    }

    public function register() {
        add_options_page(
            __('WerkCV Salaris Tools', 'werkcv-salaris-tools'),
            __('WerkCV Salaris Tools', 'werkcv-salaris-tools'),
            'manage_options',
            'werkcv-salaris-tools',
            array($this, 'render')
        );
    }

    public function render() {
        if (!current_user_can('manage_options')) {
            return;
        }
        ?>
        <div class="wrap">
            <h1><?php esc_html_e('WerkCV Salaris Tools', 'werkcv-salaris-tools'); ?></h1>
            <p><?php esc_html_e('Beheer de standaardinstellingen en gebruik de shortcodes of Gutenberg-blokken om WerkCV salaris-tools toe te voegen.', 'werkcv-salaris-tools'); ?></p>

            <form action="options.php" method="post">
                <?php
                settings_fields('werkcv_salaris_tools');
                do_settings_sections('werkcv-salaris-tools');
                submit_button();
                ?>
            </form>

            <hr />

            <h2><?php esc_html_e('Shortcodes', 'werkcv-salaris-tools'); ?></h2>
            <p><code>[werkcv_netto_bruto]</code></p>
            <p><code>[werkcv_vakantiegeld]</code></p>
            <p><code>[werkcv_minimumloon]</code></p>
            <p><code>[werkcv_salaris_tool type="netto-bruto"]</code></p>

            <h2><?php esc_html_e('Support', 'werkcv-salaris-tools'); ?></h2>
            <p>
                <a href="https://werkcv.nl/wordpress/salaris-tools-plugin" target="_blank" rel="noopener noreferrer">
                    <?php esc_html_e('Plugin landingspagina op WerkCV', 'werkcv-salaris-tools'); ?>
                </a>
            </p>
        </div>
        <?php
    }
}
