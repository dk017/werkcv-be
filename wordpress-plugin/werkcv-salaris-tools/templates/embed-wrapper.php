<?php

if (!defined('ABSPATH')) {
    exit;
}
?>
<div class="<?php echo esc_attr($wrapper_class); ?>" data-tool="<?php echo esc_attr($tool_config['slug']); ?>">
    <iframe
        src="<?php echo esc_url($iframe_src); ?>"
        title="<?php echo esc_attr($iframe_title); ?>"
        loading="lazy"
        style="width:100%;min-height:640px;border:0;"
        referrerpolicy="strict-origin-when-cross-origin"
    ></iframe>
</div>
