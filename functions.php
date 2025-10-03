<?php
if (!defined('ABSPATH')) { exit; }
// ==========================
// 1. Theme support and setup
// ==========================
function uikit_theme_setup() {
    add_theme_support('title-tag');
    add_theme_support('menus');
    add_theme_support('post-thumbnails');
    add_theme_support('automatic-feed-links');
    add_theme_support('html5', ['search-form','comment-form','comment-list','gallery','caption','style','script']);
    add_theme_support('responsive-embeds');
    add_theme_support('wp-block-styles');
    add_theme_support('align-wide');
    remove_theme_support('core-block-patterns'); // Removes default block patterns
    if (!defined('DEFAULT_HERO_BACKGROUND_IMAGE')) {
        define('DEFAULT_HERO_BACKGROUND_IMAGE', get_template_directory_uri() . '/assets/images/default-hero.jpg');
    }
    load_theme_textdomain('fev-metzingen', get_template_directory() . '/languages');
}
add_action('after_setup_theme', 'uikit_theme_setup');

// ==========================
// 2. Assets (CSS/JS)
// ==========================
function fev_asset_version($path_rel){
    $file = get_template_directory() . $path_rel;
    return file_exists($file) ? filemtime($file) : false;
}

function uikit_enqueue_assets() {
    // UIkit (keep CDN versioning or use local static version)
    wp_enqueue_style('uikit-css', get_template_directory_uri() . '/assets/css/uikit.min.css', [], '3.23.11');
    wp_enqueue_script('uikit-js', get_template_directory_uri() . '/assets/js/uikit.min.js', [], '3.23.11', true);
    wp_enqueue_script('uikit-js-icons', get_template_directory_uri() . '/assets/js/uikit-icons.min.js', ['uikit-js'], '3.23.11', true);

    // Theme main stylesheet (dynamic version)
    $style_version = fev_asset_version('/style.css') ?: '1.1';
    wp_enqueue_style('theme-style', get_stylesheet_uri(), [], $style_version);

    // Block frontend styles (if registered) – dynamic version
    $card_css_version = fev_asset_version('/assets/css/fev-card-block.css') ?: '1.0';
    $icon_css_version = fev_asset_version('/assets/css/fev-icon-block.css') ?: '1.0';
    $section_css_version = fev_asset_version('/assets/css/fev-section-block.css') ?: '1.0';
    wp_register_style('fev-card-block-frontend', get_template_directory_uri() . '/assets/css/fev-card-block.css', [], $card_css_version);
    wp_register_style('fev-icon-block-frontend', get_template_directory_uri() . '/assets/css/fev-icon-block.css', [], $icon_css_version);
    wp_register_style('fev-section-block-frontend', get_template_directory_uri() . '/assets/css/fev-section-block.css', [], $section_css_version);

    // Theme JS
    $theme_js_version = fev_asset_version('/assets/js/theme.js') ?: '1.0';
    wp_enqueue_script('theme-js', get_template_directory_uri() . '/assets/js/theme.js', [], $theme_js_version, true);
}
add_action('wp_enqueue_scripts', 'uikit_enqueue_assets');

// ==========================
// 3. Customizer
// ==========================
function uikit_customizer_settings($wp_customize) {
    // Setting for logo
    $wp_customize->add_setting('custom_logo', [
        'default'           => '',
        'sanitize_callback' => 'esc_url',
    ]);

    // Control for logo
    $wp_customize->add_control(new WP_Customize_Image_Control($wp_customize, 'custom_logo', [
        'label'    => __('Upload logo', 'fev-metzingen'),
        'section'  => 'title_tagline',
        'settings' => 'custom_logo',
    ]));

    // Footer contact section
    $wp_customize->add_section('footer_contact', [
        'title'       => __('Footer contact','fev-metzingen'),
        'priority'    => 160,
        'description' => __('Edit address data for the footer.','fev-metzingen')
    ]);

    // Organization
    $wp_customize->add_setting('footer_org_name', [
        'default'           => 'FeV Metzingen',
        'sanitize_callback' => 'sanitize_text_field',
    ]);
    $wp_customize->add_control('footer_org_name', [
        'label'   => __('Organization','fev-metzingen'),
        'section' => 'footer_contact',
        'type'    => 'text',
    ]);

    // Street
    $wp_customize->add_setting('footer_street', [
        'default'           => 'Maurenstraße 13',
        'sanitize_callback' => 'sanitize_text_field',
    ]);
    $wp_customize->add_control('footer_street', [
        'label'   => __('Street and house number','fev-metzingen'),
        'section' => 'footer_contact',
        'type'    => 'text',
    ]);

    // ZIP
    $wp_customize->add_setting('footer_zip', [
        'default'           => '72555',
        'sanitize_callback' => 'sanitize_text_field',
    ]);
    $wp_customize->add_control('footer_zip', [
        'label'   => __('Postal code','fev-metzingen'),
        'section' => 'footer_contact',
        'type'    => 'text',
    ]);

    // City
    $wp_customize->add_setting('footer_city', [
        'default'           => 'Metzingen',
        'sanitize_callback' => 'sanitize_text_field',
    ]);
    $wp_customize->add_control('footer_city', [
        'label'   => __('City','fev-metzingen'),
        'section' => 'footer_contact',
        'type'    => 'text',
    ]);

    // E-Mail
    $wp_customize->add_setting('footer_email', [
        'default'           => 'info@fev-metzingen.de',
        'sanitize_callback' => 'sanitize_email',
    ]);
    $wp_customize->add_control('footer_email', [
        'label'   => __('E-Mail','fev-metzingen'),
        'section' => 'footer_contact',
        'type'    => 'email',
    ]);

    // Phone (optional)
    $wp_customize->add_setting('footer_phone', [
        'default'           => '',
        'sanitize_callback' => 'sanitize_text_field',
    ]);
    $wp_customize->add_control('footer_phone', [
        'label'   => __('Phone','fev-metzingen'),
        'section' => 'footer_contact',
        'type'    => 'text',
        'description' => __('Format: +49 7123 123456','fev-metzingen')
    ]);
}
add_action('customize_register', 'uikit_customizer_settings');

// ==========================
// 4. Navigation
// ==========================
register_nav_menus([
    'main' => __('Main menu','fev-metzingen'),
    'footer' => __('Footer menu','fev-metzingen')
]);

class Walker_Nav_Menu_Uikit extends Walker_Nav_Menu {
    public function walk($elements, $max_depth, ...$args) {
        // Desktop: Dropnav for nested menus
        $output = '<div class="uk-navbar-center uk-visible@m">';
        $output .= '<ul class="uk-navbar-nav" uk-dropnav="">';
        $output .= $this->render_dropnav($elements, $max_depth);
        $output .= '</ul>';
        $output .= '</div>';

        // Mobile navigation with offcanvas and accordion
        $output .= '<div class="uk-navbar-right uk-hidden@m">';
        $output .= '<a id="navbar-toggle-icon" class="uk-navbar-toggle uk-navbar-toggle-animate" uk-navbar-toggle-icon uk-toggle="target: #offcanvas-nav" href="#"></a>';
        $output .= '</div>';
        
        // Store menu data globally for footer offcanvas
        global $offcanvas_menu_data;
        if (!$offcanvas_menu_data) {
            $offcanvas_menu_data = [
                'elements' => $elements,
                'max_depth' => $max_depth,
                'walker' => $this
            ];
        }
        return $output;
    }

    // Desktop: Dropnav rendering
    private function render_dropnav($elements, $max_depth, $parent_id = 0) {
        $output = '';
        foreach ($elements as $item) {
            if ((int)$item->menu_item_parent === (int)$parent_id) {
                $has_children = $this->has_children($elements, $item->ID);
                $classes = empty($item->classes) ? [] : (array) $item->classes;
                $class_names = array('uk-nav-item');
                if (in_array('current-menu-item', $classes) || in_array('current-menu-ancestor', $classes) || in_array('current-menu-parent', $classes)) {
                    $class_names[] = 'uk-active';
                }
                if ($has_children) {
                    $class_names[] = 'uk-parent';
                }
                $class_attr = $class_names ? ' class="' . esc_attr(join(' ', $class_names)) . '"' : '';
                $output .= '<li' . $class_attr . '>';
                $attributes = !empty($item->url) ? ' href="' . esc_url($item->url) . '"' : '';
                if ($has_children) {
                    $output .= '<a' . $attributes . ' aria-haspopup="true" aria-expanded="false">' . esc_html($item->title) . '<span uk-drop-parent-icon class="uk-dropnav-toggle"></span></a>';
                    $output .= '<div class="uk-dropdown uk-margin-remove" id="dropnav-' . $item->ID . '" hidden>';
                    $output .= '<ul class="uk-nav uk-dropdown-nav">';
                    $output .= $this->render_dropnav($elements, $max_depth, $item->ID);
                    $output .= '</ul>';
                    $output .= '</div>';
                } else {
                    $output .= '<a' . $attributes . '>' . esc_html($item->title) . '</a>';
                }
                $output .= '</li>';
            }
        }
        return $output;
    }

    // Mobile: Offcanvas with accordion
    public function render_offcanvas($elements, $max_depth, $parent_id = 0) {
        $output = '';
        foreach ($elements as $item) {
            if ((int)$item->menu_item_parent === (int)$parent_id) {
                $has_children = $this->has_children($elements, $item->ID);
                $classes = empty($item->classes) ? [] : (array) $item->classes;
                $class_names = array('uk-nav-item');
                if (in_array('current-menu-item', $classes) || in_array('current-menu-ancestor', $classes) || in_array('current-menu-parent', $classes)) {
                    $class_names[] = 'uk-active';
                }
                $class_attr = $class_names ? ' class="' . esc_attr(join(' ', $class_names)) . '"' : '';
                $output .= '<li' . $class_attr . '>';
                $attributes = !empty($item->url) ? ' href="' . esc_url($item->url) . '"' : '';
                if ($has_children) {
                    $output .= '<a' . $attributes . ' class="uk-flex uk-flex-middle">';
                    $output .= '<span>' . esc_html($item->title) . '</span>';
                    $output .= '<button class="uk-dropnav-toggle uk-button-link" type="button" aria-label="Open submenu" aria-expanded="false" uk-toggle="target: #offcanvas-sub-' . $item->ID . '" tabindex="0" style="background:none;border:none;padding:4px;cursor:pointer;color:inherit;margin-left:8px;">';
                    $output .= '<span uk-drop-parent-icon class="uk-drop-parent-icon-offcanvas"></span>';
                    $output .= '</button>';
                    $output .= '</a>';
                    $output .= '<ul class="uk-nav-sub" id="offcanvas-sub-' . $item->ID . '" hidden>';
                    $output .= $this->render_offcanvas($elements, $max_depth, $item->ID);
                    $output .= '</ul>';
                } else {
                    $output .= '<a' . $attributes . '>' . esc_html($item->title) . '</a>';
                }
                $output .= '</li>';
            }
        }
        return $output;
    }

    // Helper function: Checks if a menu item has children
    private function has_children($elements, $id) {
        foreach ($elements as $item) {
            if ((int)$item->menu_item_parent === (int)$id) {
                return true;
            }
        }
        return false;
    }

    // The default methods are no longer needed, as everything runs via custom render methods
}

// Offcanvas in Footer (Fix for Header Animation Issues)
function render_offcanvas_in_footer() {
    global $offcanvas_menu_data;
    
    if ($offcanvas_menu_data) {
        echo '<div id="offcanvas-nav" uk-offcanvas="mode: slide; overlay: true; flip: true;" style="position: fixed !important; top: 0 !important; left: 0 !important; width: 100% !important; height: 100vh !important;">';
        echo '<div class="uk-offcanvas-bar uk-height-viewport" style="position: absolute !important; top: 0 !important; height: 100vh !important;">';
        echo '<ul class="uk-nav uk-nav-primary uk-nav-offcanvas uk-margin-large-vertical">';
        
        echo $offcanvas_menu_data['walker']->render_offcanvas($offcanvas_menu_data['elements'], $offcanvas_menu_data['max_depth']);
        
        echo '</ul>';
        echo '</div>';
        echo '</div>';
    }
}
add_action('wp_footer', 'render_offcanvas_in_footer');

// ==========================
// 5. Meta boxes (improved security)
// ==========================
function add_hero_background_meta_box() {
    add_meta_box(
        'hero_content_meta_box',
        'Hero content',
        'render_hero_content_meta_box',
        'page',
        'side',
        'default'
    );
}
add_action('add_meta_boxes', 'add_hero_background_meta_box');

function render_hero_content_meta_box($post) {
    // Security: Add nonce field
    wp_nonce_field('hero_content_nonce', 'hero_content_nonce_field');
    
    $hero_title = get_post_meta($post->ID, '_hero_title', true);
    $hero_description = get_post_meta($post->ID, '_hero_description', true);
    ?>
    <div>
        <p><strong>Note:</strong> Use "Set featured image" for the hero background image.</p>
        
        <p><label for="hero_title"><strong>Hero title:</strong></label></p>
        <input type="text" name="hero_title" id="hero_title" 
               value="<?php echo esc_attr($hero_title); ?>" style="width:100%;" 
               placeholder="Leave empty for default title" />
        
        <p><label for="hero_description"><strong>Hero description:</strong></label></p>
        <input type="text" name="hero_description" id="hero_description" 
               value="<?php echo esc_attr($hero_description); ?>" style="width:100%;" 
               placeholder="Hero subtitle" />
    </div>
    <?php
}

function save_hero_content_meta($post_id) {
    // Security checks
    
    // 1. Nonce verification
    if (!isset($_POST['hero_content_nonce_field']) || 
        !wp_verify_nonce($_POST['hero_content_nonce_field'], 'hero_content_nonce')) {
        return;
    }
    
    // 2. Autosave protection
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }
    
    // 3. Permission check
    if (!current_user_can('edit_page', $post_id)) {
        return;
    }
    
    // 4. Save hero title
    if (array_key_exists('hero_title', $_POST)) {
        $hero_title = sanitize_text_field($_POST['hero_title']);
        update_post_meta($post_id, '_hero_title', $hero_title);
    }
    
    // 5. Save hero description
    if (array_key_exists('hero_description', $_POST)) {
        $hero_description = sanitize_text_field($_POST['hero_description']);
        update_post_meta($post_id, '_hero_description', $hero_description);
    }
}
add_action('save_post', 'save_hero_content_meta');

// ==========================
// Hero helper functions
// ==========================
function get_hero_background_image($post_id = null) {
    if (!$post_id) {
        $post_id = get_the_ID();
    }
    
    // Get featured image
    if (has_post_thumbnail($post_id)) {
        return get_the_post_thumbnail_url($post_id, 'full');
    }
    
    return DEFAULT_HERO_BACKGROUND_IMAGE; // Fallback to default background image
}

function get_hero_title($post_id = null) {
    if (!$post_id) {
        $post_id = get_the_ID();
    }
    
    $hero_title = get_post_meta($post_id, '_hero_title', true);
    
    // Fallback to default title if hero title is empty
    return !empty($hero_title) ? $hero_title : get_the_title($post_id);
}

function get_hero_description($post_id = null) {
    if (!$post_id) {
        $post_id = get_the_ID();
    }
    
    return get_post_meta($post_id, '_hero_description', true);
}

// ==========================
// 6. Security functions
// ==========================
// Removes WordPress version from head for better security
remove_action('wp_head', 'wp_generator');

// Prevents file editing in the admin area
if (!defined('DISALLOW_FILE_EDIT')) {
    define('DISALLOW_FILE_EDIT', true);
}

// Security function: Sanitize file uploads (improved)
function secure_file_upload($file){
    // Only check on successful upload
    if(isset($file['tmp_name']) && is_uploaded_file($file['tmp_name'])){
        $filetype = wp_check_filetype_and_ext($file['tmp_name'],$file['name']);
        $allowed = ['jpg','jpeg','jpe','png','gif','webp'];
        if(empty($filetype['ext']) || !in_array(strtolower($filetype['ext']), $allowed, true)){
            $file['error'] = __('File type not allowed. Allowed: jpg, jpeg, png, gif, webp','fev-metzingen');
        }
    }
    return $file;
}
add_filter('wp_handle_upload_prefilter', 'secure_file_upload');

// Content Security / Security Headers (modernized)
function add_security_headers() {
    if (!is_admin()) {
        header('X-Content-Type-Options: nosniff');
        header('X-Frame-Options: SAMEORIGIN');
        header('Referrer-Policy: strict-origin-when-cross-origin');
        header('Permissions-Policy: geolocation=(), microphone=(), camera=()');
        if (is_ssl()) {
            header('Strict-Transport-Security: max-age=31536000; includeSubDomains; preload');
        }
        // Optional Content-Security-Policy can be added project-specific.
    }
}
add_action('send_headers', 'add_security_headers');

// ==========================
// 5. FeV Custom Blocks (Card & Icon)
// ==========================
function register_fev_custom_blocks() {
    // Single Card Block
    wp_register_script(
        'fev-card-block',
        get_template_directory_uri() . '/assets/js/fev-card-block.js',
        ['wp-blocks', 'wp-element', 'wp-block-editor', 'wp-components', 'wp-i18n'],
        fev_asset_version('/assets/js/fev-card-block.js') ?: '1.0',
        true
    );

    // Icon Block
    wp_register_script(
        'fev-icon-block',
        get_template_directory_uri() . '/assets/js/fev-icon-block.js',
        ['wp-blocks', 'wp-element', 'wp-block-editor', 'wp-components', 'wp-i18n'],
        fev_asset_version('/assets/js/fev-icon-block.js') ?: '1.0',
        true
    );

    wp_register_style(
        'fev-card-block-editor',
        get_template_directory_uri() . '/assets/css/fev-card-block-editor.css',
        ['wp-edit-blocks'],
        fev_asset_version('/assets/css/fev-card-block-editor.css') ?: '1.0'
    );

    wp_register_style(
        'fev-card-block-frontend',
        get_template_directory_uri() . '/assets/css/fev-card-block.css',
        [],
        fev_asset_version('/assets/css/fev-card-block.css') ?: '1.0'
    );

    wp_register_style(
        'fev-icon-block-editor',
        get_template_directory_uri() . '/assets/css/fev-icon-block-editor.css',
        ['wp-edit-blocks'],
        fev_asset_version('/assets/css/fev-icon-block-editor.css') ?: '1.0'
    );

    wp_register_style(
        'fev-icon-block-frontend',
        get_template_directory_uri() . '/assets/css/fev-icon-block.css',
        [],
        fev_asset_version('/assets/css/fev-icon-block.css') ?: '1.0'
    );

    wp_register_script(
        'fev-card-block-frontend',
        get_template_directory_uri() . '/assets/js/fev-card-block-frontend.js',
        [],
        fev_asset_version('/assets/js/fev-card-block-frontend.js') ?: '1.0',
        true
    );



    // Register Single Card Block
    register_block_type('fev-metzingen/card-block', [
        'editor_script' => 'fev-card-block',
        'editor_style' => 'fev-card-block-editor',
        'style' => 'fev-card-block-frontend',
        'script' => 'fev-card-block-frontend',
        'attributes' => [
            'cardUrl' => [
                'type' => 'string',
                'default' => ''
            ],
            'isClickable' => [
                'type' => 'boolean',
                'default' => false
            ],
            'openInNewTab' => [
                'type' => 'boolean',
                'default' => false
            ],
            'cardStyle' => [
                'type' => 'string',
                'default' => 'default'
            ],
            'cardPadding' => [
                'type' => 'number',
                'default' => 20
            ],
            'centerContent' => [
                'type' => 'boolean',
                'default' => false
            ],
            'cardBorder' => [
                'type' => 'boolean',
                'default' => true
            ]
        ]
    ]);

    // Register Icon Block
    register_block_type('fev-metzingen/icon-block', [
        'editor_script' => 'fev-icon-block',
        'editor_style' => 'fev-icon-block-editor',
        'style' => 'fev-icon-block-frontend',
        'attributes' => [
            'iconName' => [
                'type' => 'string',
                'default' => 'star'
            ],
            'iconSize' => [
                'type' => 'number',
                'default' => 2
            ],
            'iconColor' => [
                'type' => 'string',
                'default' => 'primary'
            ],
            'iconAlignment' => [
                'type' => 'string',
                'default' => 'center'
            ]
        ]
    ]);
}
add_action('init', 'register_fev_custom_blocks');

// ==========================
// 8. FeV Section Block (Full-width background wrapper)
// ==========================
function register_fev_section_block() {
    wp_register_script(
        'fev-section-block',
        get_template_directory_uri() . '/assets/js/fev-section-block.js',
        ['wp-blocks', 'wp-element', 'wp-editor', 'wp-block-editor', 'wp-components'],
        '1.0',
        true
    );

    wp_register_style(
        'fev-section-block-editor',
        get_template_directory_uri() . '/assets/css/fev-section-block-editor.css',
        ['wp-edit-blocks'],
        '1.0'
    );

    wp_register_style(
        'fev-section-block-frontend',
        get_template_directory_uri() . '/assets/css/fev-section-block.css',
        [],
        '1.0'
    );

    register_block_type('fev-metzingen/section-block', [
        'editor_script' => 'fev-section-block',
        'editor_style' => 'fev-section-block-editor',
        'style' => 'fev-section-block-frontend',
        'attributes' => [
            'background' => [
                'type' => 'string',
                'default' => 'white'
            ]
        ]
    ]);
}
add_action('init', 'register_fev_section_block');

// ==========================
// 9. FeV Table Block (UIkit table with dynamic rows/columns)
// ==========================
function register_fev_table_block() {
    // Table Block JavaScript
    $table_js_version = fev_asset_version('/assets/js/fev-table-block.js') ?: '1.0';
    wp_register_script(
        'fev-table-block',
        get_template_directory_uri() . '/assets/js/fev-table-block.js',
        ['wp-blocks', 'wp-element', 'wp-block-editor', 'wp-components', 'wp-i18n'],
        $table_js_version,
        true
    );

    // Table Block Editor CSS
    $table_editor_css_version = fev_asset_version('/assets/css/fev-table-block-editor.css') ?: '1.0';
    wp_register_style(
        'fev-table-block-editor',
        get_template_directory_uri() . '/assets/css/fev-table-block-editor.css',
        ['wp-edit-blocks'],
        $table_editor_css_version
    );

    // Table Block Frontend CSS
    $table_css_version = fev_asset_version('/assets/css/fev-table-block.css') ?: '1.0';
    wp_register_style(
        'fev-table-block-frontend',
        get_template_directory_uri() . '/assets/css/fev-table-block.css',
        [],
        $table_css_version
    );

    // Table Block Frontend JavaScript
    $table_frontend_js_version = fev_asset_version('/assets/js/fev-table-block-frontend.js') ?: '1.0';
    wp_register_script(
        'fev-table-block-frontend-js',
        get_template_directory_uri() . '/assets/js/fev-table-block-frontend.js',
        [],
        $table_frontend_js_version,
        true
    );

    register_block_type('fev-metzingen/table', [
        'editor_script' => 'fev-table-block',
        'editor_style' => 'fev-table-block-editor',
        'style' => 'fev-table-block-frontend',
        'script' => 'fev-table-block-frontend-js'
    ]);
}
add_action('init', 'register_fev_table_block');

// ==========================
// 10. FeV Button Block (Smart button with UIkit styling)
// ==========================
function register_fev_button_block() {
    // Button Block JavaScript
    $button_js_version = fev_asset_version('/assets/js/fev-button-block.js') ?: '1.0';
    wp_register_script(
        'fev-button-block',
        get_template_directory_uri() . '/assets/js/fev-button-block.js',
        ['wp-blocks', 'wp-element', 'wp-block-editor', 'wp-components', 'wp-i18n'],
        $button_js_version,
        true
    );

    // Button Block Editor CSS
    $button_editor_css_version = fev_asset_version('/assets/css/fev-button-block-editor.css') ?: '1.0';
    wp_register_style(
        'fev-button-block-editor',
        get_template_directory_uri() . '/assets/css/fev-button-block-editor.css',
        ['wp-edit-blocks'],
        $button_editor_css_version
    );

    // Button Block Frontend CSS
    $button_css_version = fev_asset_version('/assets/css/fev-button-block.css') ?: '1.0';
    wp_register_style(
        'fev-button-block-frontend',
        get_template_directory_uri() . '/assets/css/fev-button-block.css',
        [],
        $button_css_version
    );

    register_block_type('fev-metzingen/button', [
        'editor_script' => 'fev-button-block',
        'editor_style' => 'fev-button-block-editor',
        'style' => 'fev-button-block-frontend'
    ]);
}
add_action('init', 'register_fev_button_block');

