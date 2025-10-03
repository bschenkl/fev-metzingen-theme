<?php
/**
 * Hero Section Template
 *
 * This template displays the hero section with a background image, title, and subtitle.
 *
 * @package fev-metzingen
 */
$hero_title = $args['hero_title'] ?? '';
$hero_subtitle = $args['hero_subtitle'] ?? '';
$hero_background_image = $args['hero_background_image'] ?? '';
$style = $hero_background_image ? "style=\"background-image: url('$hero_background_image');\"" : '';
if (!$hero_title) {
    $hero_title = get_bloginfo('name'); // Fallback to site title
}
?>
<section id="hero" class="uk-position-relative uk-background-cover uk-background-center-center" <?php echo $style; ?>>
    <div class="uk-position-cover hero-overlay uk-flex uk-flex-center uk-flex-middle">
        <div class="uk-text-center uk-light uk-margin-xlarge-top uk-margin-medium-top@s uk-animation-slide-bottom-medium">
            <h1 class="uk-heading-medium uk-text-uppercase uk-text-bold"><?php echo esc_html($hero_title); ?></h1>
            <p class="uk-text-lead" style="color: white;"><?php echo esc_html($hero_subtitle); ?></p>
        </div>
    </div>
</section>
