<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="<?php bloginfo('description'); ?>">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php if (function_exists('wp_body_open')) { wp_body_open(); } ?>
<a class="skip-link" href="#main-content"><?php esc_html_e('Zum Inhalt springen','fev-metzingen'); ?></a>


<header class="uk-position-absolute uk-width-1-1 uk-margin-top uk-margin-remove-top@s uk-animation-slide-top-small" style="z-index: 1000; top: 0; left: 0;" role="banner">
    <div class="uk-container">
        <nav class="uk-navbar-container uk-navbar-transparent" uk-navbar role="navigation" aria-label="Hauptnavigation">
            <div class="uk-navbar-left">
                <a class="uk-navbar-item uk-logo uk-light" href="<?php echo esc_url(home_url('/')); ?>" aria-label="Zur Startseite">
                <?php
                    $custom_logo = get_theme_mod('custom_logo');
                    if ($custom_logo) {
                        echo '<img id="logo" class="uk-margin-left uk-margin-small-left@s uk-margin-medium-left@m" src="' . esc_url($custom_logo) . '" alt="' . esc_attr(get_bloginfo('name')) . '" loading="eager" decoding="async" width="220" height="100">';
                    } else {
                        echo '<span class="uk-margin-left uk-margin-small-left@s uk-margin-medium-left@m">' . esc_html(get_bloginfo('name')) . '</span>';
                    }
                    ?>
                </a>
            </div>
                <?php
                    wp_nav_menu([
                        'theme_location' => 'main',
                        'container' => false,
                        'items_wrap' => '%3$s',
                        'walker' => new Walker_Nav_Menu_Uikit(),
                      ]);
                ?>
        </nav>
    </div>
</header>

