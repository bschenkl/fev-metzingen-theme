<?php
if (!defined('ABSPATH')) { exit; }
// ==========================
// 1. Theme-Support und Setup
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
    remove_theme_support('core-block-patterns'); // Entfernt Standard-Block-Patterns
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
    // UIkit (CDN-Versionierung beibehalten oder lokale statische Version)
    wp_enqueue_style('uikit-css', get_template_directory_uri() . '/assets/css/uikit.min.css', [], '3.23.11');
    wp_enqueue_script('uikit-js', get_template_directory_uri() . '/assets/js/uikit.min.js', [], '3.23.11', true);
    wp_enqueue_script('uikit-js-icons', get_template_directory_uri() . '/assets/js/uikit-icons.min.js', ['uikit-js'], '3.23.11', true);

    // Theme Haupt-Stylesheet (Version dynamisch)
    $style_version = fev_asset_version('/style.css') ?: '1.1';
    wp_enqueue_style('theme-style', get_stylesheet_uri(), [], $style_version);

    // Block Frontend Styles (wenn registriert) – Version dynamisch
    $cards_css_version = fev_asset_version('/assets/css/fev-cards-block.css') ?: '1.0';
    $section_css_version = fev_asset_version('/assets/css/fev-section-block.css') ?: '1.0';
    wp_register_style('fev-cards-block-frontend', get_template_directory_uri() . '/assets/css/fev-cards-block.css', [], $cards_css_version);
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
    // Einstellung für das Logo
    $wp_customize->add_setting('custom_logo', [
        'default'           => '',
        'sanitize_callback' => 'esc_url',
    ]);

    // Kontrollfeld für das Logo
    $wp_customize->add_control(new WP_Customize_Image_Control($wp_customize, 'custom_logo', [
        'label'    => __('Logo hochladen', 'fev-metzingen'),
        'section'  => 'title_tagline',
        'settings' => 'custom_logo',
    ]));

    // Footer Kontakt Sektion
    $wp_customize->add_section('footer_contact', [
        'title'       => __('Footer Kontakt','fev-metzingen'),
        'priority'    => 160,
        'description' => __('Adressdaten für den Footer bearbeiten.','fev-metzingen')
    ]);

    // Organisation
    $wp_customize->add_setting('footer_org_name', [
        'default'           => 'FeV Metzingen',
        'sanitize_callback' => 'sanitize_text_field',
    ]);
    $wp_customize->add_control('footer_org_name', [
        'label'   => __('Organisation','fev-metzingen'),
        'section' => 'footer_contact',
        'type'    => 'text',
    ]);

    // Straße
    $wp_customize->add_setting('footer_street', [
        'default'           => 'Maurenstraße 13',
        'sanitize_callback' => 'sanitize_text_field',
    ]);
    $wp_customize->add_control('footer_street', [
        'label'   => __('Straße und Hausnummer','fev-metzingen'),
        'section' => 'footer_contact',
        'type'    => 'text',
    ]);

    // PLZ
    $wp_customize->add_setting('footer_zip', [
        'default'           => '72555',
        'sanitize_callback' => 'sanitize_text_field',
    ]);
    $wp_customize->add_control('footer_zip', [
        'label'   => __('Postleitzahl','fev-metzingen'),
        'section' => 'footer_contact',
        'type'    => 'text',
    ]);

    // Ort
    $wp_customize->add_setting('footer_city', [
        'default'           => 'Metzingen',
        'sanitize_callback' => 'sanitize_text_field',
    ]);
    $wp_customize->add_control('footer_city', [
        'label'   => __('Ort','fev-metzingen'),
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

    // Telefon (optional)
    $wp_customize->add_setting('footer_phone', [
        'default'           => '',
        'sanitize_callback' => 'sanitize_text_field',
    ]);
    $wp_customize->add_control('footer_phone', [
        'label'   => __('Telefon','fev-metzingen'),
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
    'main' => __('Hauptmenü','fev-metzingen'),
    'footer' => __('Footer Menü','fev-metzingen')
]);

class Walker_Nav_Menu_Uikit extends Walker_Nav_Menu {
    public function walk($elements, $max_depth, ...$args) {
        // Desktop: Dropnav für verschachtelte Menüs
        $output = '<div class="uk-navbar-center uk-visible@m">';
        $output .= '<ul class="uk-navbar-nav" uk-dropnav="">';
        $output .= $this->render_dropnav($elements, $max_depth);
        $output .= '</ul>';
        $output .= '</div>';

        // Mobile Navigation mit Offcanvas und Accordion
        $output .= '<div class="uk-navbar-right uk-hidden@m">';
        $output .= '<a id="navbar-toggle-icon" class="uk-navbar-toggle uk-navbar-toggle-animate" uk-navbar-toggle-icon uk-toggle="target: #offcanvas-nav" href="#"></a>';
        $output .= '</div>';
        $output .= '<div id="offcanvas-nav" uk-offcanvas="mode: push; overlay: true; flip: true;">';
        $output .= '<div class="uk-offcanvas-bar">';
        $output .= '<ul class="uk-nav uk-nav-primary uk-nav-offcanvas uk-margin-auto-vertical">';
        $output .= $this->render_offcanvas($elements, $max_depth);
        $output .= '</ul>';
        $output .= '</div>';
        $output .= '</div>';
        return $output;
    }

    // Desktop: Dropnav-Rendering
    private function render_dropnav($elements, $max_depth, $parent_id = 0) {
        $output = '';
        foreach ($elements as $item) {
            if ((int)$item->menu_item_parent === (int)$parent_id) {
                $has_children = $this->has_children($elements, $item->ID);
                $classes = empty($item->classes) ? [] : (array) $item->classes;
                $class_names = array('uk-nav-item');
                if (in_array('current-menu-item', $classes)) {
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

    // Mobile: Offcanvas mit Accordion
    private function render_offcanvas($elements, $max_depth, $parent_id = 0) {
        $output = '';
        foreach ($elements as $item) {
            if ((int)$item->menu_item_parent === (int)$parent_id) {
                $has_children = $this->has_children($elements, $item->ID);
                $classes = empty($item->classes) ? [] : (array) $item->classes;
                $class_names = array('uk-nav-item');
                if (in_array('current-menu-item', $classes)) {
                    $class_names[] = 'uk-active';
                }
                $class_attr = $class_names ? ' class="' . esc_attr(join(' ', $class_names)) . '"' : '';
                $output .= '<li' . $class_attr . '>';
                $attributes = !empty($item->url) ? ' href="' . esc_url($item->url) . '"' : '';
                if ($has_children) {
                    $output .= '<div style="display:flex;align-items:center;">';
                    $output .= '<a' . $attributes . ' style="margin-right:4px;">' . esc_html($item->title) . '</a>';
                    $output .= '<button class="uk-dropnav-toggle" type="button" aria-label="Untermenü öffnen" aria-expanded="false" uk-toggle="target: #offcanvas-sub-' . $item->ID . '" tabindex="0" style="background:none;border:none;padding:0;cursor:pointer;">';
                    $output .= '<span uk-drop-parent-icon class="uk-drop-parent-icon-offcanvas"></span>';
                    $output .= '</button>';
                    $output .= '</div>';
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

    // Hilfsfunktion: Prüft, ob ein Menüpunkt Kinder hat
    private function has_children($elements, $id) {
        foreach ($elements as $item) {
            if ((int)$item->menu_item_parent === (int)$id) {
                return true;
            }
        }
        return false;
    }

    // Die Standard-Methoden werden nicht mehr benötigt, da alles über die eigenen Render-Methoden läuft
}

// ==========================
// 5. Meta-Boxen (Sicherheitsverbessert)
// ==========================
function add_hero_background_meta_box() {
    add_meta_box(
        'hero_content_meta_box',
        'Hero Inhalte',
        'render_hero_content_meta_box',
        'page',
        'side',
        'default'
    );
}
add_action('add_meta_boxes', 'add_hero_background_meta_box');

function render_hero_content_meta_box($post) {
    // Sicherheit: Nonce-Field hinzufügen
    wp_nonce_field('hero_content_nonce', 'hero_content_nonce_field');
    
    $hero_title = get_post_meta($post->ID, '_hero_title', true);
    $hero_description = get_post_meta($post->ID, '_hero_description', true);
    ?>
    <div>
        <p><strong>Hinweis:</strong> Verwenden Sie "Beitragsbild festlegen" für das Hero-Hintergrundbild.</p>
        
        <p><label for="hero_title"><strong>Hero Titel:</strong></label></p>
        <input type="text" name="hero_title" id="hero_title" 
               value="<?php echo esc_attr($hero_title); ?>" style="width:100%;" 
               placeholder="Leer lassen für Standard-Titel" />
        
        <p><label for="hero_description"><strong>Hero Beschreibung:</strong></label></p>
        <input type="text" name="hero_description" id="hero_description" 
               value="<?php echo esc_attr($hero_description); ?>" style="width:100%;" 
               placeholder="Hero Untertitel" />
    </div>
    <?php
}

function save_hero_content_meta($post_id) {
    // Sicherheitsprüfungen
    
    // 1. Nonce-Verification
    if (!isset($_POST['hero_content_nonce_field']) || 
        !wp_verify_nonce($_POST['hero_content_nonce_field'], 'hero_content_nonce')) {
        return;
    }
    
    // 2. Autosave-Schutz
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }
    
    // 3. Berechtigungsprüfung
    if (!current_user_can('edit_page', $post_id)) {
        return;
    }
    
    // 4. Hero Titel speichern
    if (array_key_exists('hero_title', $_POST)) {
        $hero_title = sanitize_text_field($_POST['hero_title']);
        update_post_meta($post_id, '_hero_title', $hero_title);
    }
    
    // 5. Hero Beschreibung speichern
    if (array_key_exists('hero_description', $_POST)) {
        $hero_description = sanitize_text_field($_POST['hero_description']);
        update_post_meta($post_id, '_hero_description', $hero_description);
    }
}
add_action('save_post', 'save_hero_content_meta');

// ==========================
// Hero Helper Funktionen
// ==========================
function get_hero_background_image($post_id = null) {
    if (!$post_id) {
        $post_id = get_the_ID();
    }
    
    // Featured Image holen
    if (has_post_thumbnail($post_id)) {
        return get_the_post_thumbnail_url($post_id, 'full');
    }
    
    return DEFAULT_HERO_BACKGROUND_IMAGE; // Fallback auf Standard-Hintergrundbild
}

function get_hero_title($post_id = null) {
    if (!$post_id) {
        $post_id = get_the_ID();
    }
    
    $hero_title = get_post_meta($post_id, '_hero_title', true);
    
    // Fallback auf Standard-Titel wenn Hero-Titel leer ist
    return !empty($hero_title) ? $hero_title : get_the_title($post_id);
}

function get_hero_description($post_id = null) {
    if (!$post_id) {
        $post_id = get_the_ID();
    }
    
    return get_post_meta($post_id, '_hero_description', true);
}

// ==========================
// 6. Block-Patterns (Korrigierte Funktionsnamen)
// ==========================
function uikit_register_block_patterns_categories() {
    register_block_pattern_category('fev-metzingen', ['label' => 'FEV Metzingen']);
    register_block_pattern_category('custom', ['label' => 'Custom Patterns']);
    register_block_pattern_category('layout', ['label' => 'Layout']);
}
add_action('init', 'uikit_register_block_patterns_categories', 10);

function uikit_register_block_patterns() {
    $pattern_file = get_template_directory() . '/patterns/cards.php';
    if (file_exists($pattern_file)) {
        register_block_pattern(
            'fev-metzingen/three-cards',
            [
                'title'       => __('Dreispaltiges Layout', 'fev-metzingen'),
                'description' => __('Ein einfaches dreispaltiges Layout mit Überschriften und Text.', 'fev-metzingen'),
                'categories'  => ['layout'],
                'content'     => file_get_contents($pattern_file),
            ]
        );
    }
}
add_action('init', 'uikit_register_block_patterns', 10);

// ==========================
// 7. Sicherheits-Funktionen
// ==========================
// Entfernt WordPress-Version aus Head für bessere Sicherheit
remove_action('wp_head', 'wp_generator');

// Verhindert Datei-Editierung im Admin-Bereich
if (!defined('DISALLOW_FILE_EDIT')) {
    define('DISALLOW_FILE_EDIT', true);
}

// Sicherheitsfunktion: Sanitize file uploads (verbessert)
function secure_file_upload($file){
    // Nur bei erfolgreichem Upload prüfen
    if(isset($file['tmp_name']) && is_uploaded_file($file['tmp_name'])){
        $filetype = wp_check_filetype_and_ext($file['tmp_name'],$file['name']);
        $allowed = ['jpg','jpeg','jpe','png','gif','webp'];
        if(empty($filetype['ext']) || !in_array(strtolower($filetype['ext']), $allowed, true)){
            $file['error'] = __('Dateityp nicht erlaubt. Erlaubt: jpg, jpeg, png, gif, webp','fev-metzingen');
        }
    }
    return $file;
}
add_filter('wp_handle_upload_prefilter', 'secure_file_upload');

// Content Security / Security Headers (modernisiert)
function add_security_headers() {
    if (!is_admin()) {
        header('X-Content-Type-Options: nosniff');
        header('X-Frame-Options: SAMEORIGIN');
        header('Referrer-Policy: strict-origin-when-cross-origin');
        header('Permissions-Policy: geolocation=(), microphone=(), camera=()');
        if (is_ssl()) {
            header('Strict-Transport-Security: max-age=31536000; includeSubDomains; preload');
        }
        // Optionale Content-Security-Policy kann projektspezifisch ergänzt werden.
    }
}
add_action('send_headers', 'add_security_headers');

// ==========================
// 5. Custom Fields für Icons (nur für Gutenberg-Block)
// ==========================
function register_fev_cards_block() {
    wp_register_script(
        'fev-cards-block',
        get_template_directory_uri() . '/assets/js/fev-cards-block.js',
        ['wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'wp-i18n'],
        '1.0',
        true
    );

    wp_register_style(
        'fev-cards-block-editor',
        get_template_directory_uri() . '/assets/css/fev-cards-block-editor.css',
        ['wp-edit-blocks'],
        '1.0'
    );

    wp_register_style(
        'fev-cards-block-frontend',
        get_template_directory_uri() . '/assets/css/fev-cards-block.css',
        [],
        '1.0'
    );

    wp_register_script(
        'fev-cards-block-frontend',
        get_template_directory_uri() . '/assets/js/fev-cards-block-frontend.js',
        [],
        '1.0',
        true
    );

    register_block_type('fev-metzingen/cards-block', [
        'editor_script' => 'fev-cards-block',
        'editor_style' => 'fev-cards-block-editor',
        'style' => 'fev-cards-block-frontend',
        'script' => 'fev-cards-block-frontend',
        'render_callback' => 'render_fev_cards_block',
        'attributes' => [
            'card1Icon' => [
                'type' => 'string',
                'default' => ''
            ],
            'card1Url' => [
                'type' => 'string',
                'default' => ''
            ],
            'card2Icon' => [
                'type' => 'string',
                'default' => ''
            ],
            'card2Url' => [
                'type' => 'string',
                'default' => ''
            ],
            'card3Icon' => [
                'type' => 'string',
                'default' => ''
            ],
            'card3Url' => [
                'type' => 'string',
                'default' => ''
            ]
        ]
    ]);
}
add_action('init', 'register_fev_cards_block');

// Render-Funktion für den Block
function render_fev_cards_block($attributes, $content) {
    $card1Icon = isset($attributes['card1Icon']) ? esc_attr($attributes['card1Icon']) : '';
    $card1Url = isset($attributes['card1Url']) ? esc_url($attributes['card1Url']) : '';
    $card2Icon = isset($attributes['card2Icon']) ? esc_attr($attributes['card2Icon']) : '';
    $card2Url = isset($attributes['card2Url']) ? esc_url($attributes['card2Url']) : '';
    $card3Icon = isset($attributes['card3Icon']) ? esc_attr($attributes['card3Icon']) : '';
    $card3Url = isset($attributes['card3Url']) ? esc_url($attributes['card3Url']) : '';

    // Einfache Lösung: Content direkt verwenden und Icons per CSS/JS hinzufügen
    $output = "<div class='fev-cards-block uk-width-4-5@m uk-margin-auto uk-margin-large-top' ";
    $output .= "data-card1-icon='{$card1Icon}' data-card1-url='{$card1Url}' ";
    $output .= "data-card2-icon='{$card2Icon}' data-card2-url='{$card2Url}' ";
    $output .= "data-card3-icon='{$card3Icon}' data-card3-url='{$card3Url}'>";
    $output .= $content;
    $output .= "</div>";

    return $output;
}

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