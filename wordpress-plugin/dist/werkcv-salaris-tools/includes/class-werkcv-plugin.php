<?php

if (!defined('ABSPATH')) {
    exit;
}

class WerkCV_Salaris_Tools_Plugin {
    /**
     * @var WerkCV_Salaris_Tools_Settings
     */
    private $settings;

    /**
     * @var WerkCV_Salaris_Tools_Renderer
     */
    private $renderer;

    /**
     * @var WerkCV_Salaris_Tools_Shortcodes
     */
    private $shortcodes;

    /**
     * @var WerkCV_Salaris_Tools_Blocks
     */
    private $blocks;

    /**
     * @var WerkCV_Salaris_Tools_Admin_Page
     */
    private $admin_page;

    public function __construct() {
        $this->settings = new WerkCV_Salaris_Tools_Settings();
        $this->renderer = new WerkCV_Salaris_Tools_Renderer($this->settings);
        $this->shortcodes = new WerkCV_Salaris_Tools_Shortcodes($this->renderer);
        $this->blocks = new WerkCV_Salaris_Tools_Blocks($this->renderer);
        $this->admin_page = new WerkCV_Salaris_Tools_Admin_Page($this->settings);
    }

    public function run() {
        add_action('init', array($this->shortcodes, 'register'));
        add_action('init', array($this->blocks, 'register'));
        add_action('admin_init', array($this->settings, 'register'));
        add_action('admin_menu', array($this->admin_page, 'register'));
    }
}
