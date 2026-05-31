<?php

if (!defined('ABSPATH')) {
    exit;
}

class WerkCV_Salaris_Tools_Shortcodes {
    /**
     * @var WerkCV_Salaris_Tools_Renderer
     */
    private $renderer;

    public function __construct($renderer) {
        $this->renderer = $renderer;
    }

    public function register() {
        add_shortcode('werkcv_netto_bruto', array($this, 'render_netto_bruto'));
        add_shortcode('werkcv_vakantiegeld', array($this, 'render_vakantiegeld'));
        add_shortcode('werkcv_minimumloon', array($this, 'render_minimumloon'));
        add_shortcode('werkcv_salaris_tool', array($this, 'render_generic'));
    }

    public function render_netto_bruto($atts = array()) {
        return $this->renderer->render('netto-bruto', (array) $atts);
    }

    public function render_vakantiegeld($atts = array()) {
        return $this->renderer->render('vakantiegeld', (array) $atts);
    }

    public function render_minimumloon($atts = array()) {
        return $this->renderer->render('minimumloon', (array) $atts);
    }

    public function render_generic($atts = array()) {
        $atts = shortcode_atts(
            array(
                'type' => 'netto-bruto',
            ),
            $atts,
            'werkcv_salaris_tool'
        );

        return $this->renderer->render($atts['type'], (array) $atts);
    }
}
