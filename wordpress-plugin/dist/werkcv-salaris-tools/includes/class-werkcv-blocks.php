<?php

if (!defined('ABSPATH')) {
    exit;
}

class WerkCV_Salaris_Tools_Blocks {
    /**
     * @var WerkCV_Salaris_Tools_Renderer
     */
    private $renderer;

    public function __construct($renderer) {
        $this->renderer = $renderer;
    }

    public function register() {
        $build_dir = WERKCV_SALARIS_TOOLS_DIR . 'blocks/build/';
        $asset_path = $build_dir . 'index.asset.php';
        $script_path = $build_dir . 'index.js';

        if (!file_exists($asset_path) || !file_exists($script_path)) {
            return;
        }

        $asset = require $asset_path;

        wp_register_script(
            'werkcv-salaris-tools-blocks',
            WERKCV_SALARIS_TOOLS_URL . 'blocks/build/index.js',
            isset($asset['dependencies']) ? $asset['dependencies'] : array(),
            isset($asset['version']) ? $asset['version'] : WERKCV_SALARIS_TOOLS_VERSION,
            true
        );

        $blocks = array(
            'werkcv/netto-bruto' => 'netto-bruto',
            'werkcv/vakantiegeld' => 'vakantiegeld',
            'werkcv/minimumloon' => 'minimumloon',
        );

        foreach ($blocks as $block_name => $tool_slug) {
            register_block_type(
                $block_name,
                array(
                    'editor_script' => 'werkcv-salaris-tools-blocks',
                    'attributes' => array(
                        'cta' => array(
                            'type' => 'boolean',
                            'default' => false,
                        ),
                        'footer' => array(
                            'type' => 'boolean',
                            'default' => false,
                        ),
                    ),
                    'render_callback' => function ($attributes) use ($tool_slug) {
                        return $this->renderer->render($tool_slug, (array) $attributes);
                    },
                )
            );
        }
    }
}
