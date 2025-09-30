<?php get_header(); ?>

<main id="main-content" role="main">
    <?php
        $title = __('Seite nicht gefunden','fev-metzingen');
        $description = '';
        $hero_background_image = defined('DEFAULT_HERO_BACKGROUND_IMAGE') ? DEFAULT_HERO_BACKGROUND_IMAGE : get_template_directory_uri() . '/assets/images/default-hero.jpg';
        get_template_part('template-parts/hero', null, [
            'hero_title' => $title,
            'hero_subtitle' => $description,
            'hero_background_image' => esc_url($hero_background_image),
        ]);
    ?>
    <section class="uk-section" aria-labelledby="notfound-heading">
        <div class="uk-container">
            <div uk-height-viewport='expand: true' class="uk-grid" uk-grid>
                <div class="uk-width-1-2@s uk-align-center">
                    <h2 id="notfound-heading" class="uk-heading-divider"><?php esc_html_e('Diese Seite wurde nicht gefunden.','fev-metzingen'); ?></h2>
                    <p><?php esc_html_e('Die aufgerufene Adresse existiert nicht oder wurde verschoben.','fev-metzingen'); ?></p>
                    <p><a class="uk-button uk-button-primary" href="<?php echo esc_url(home_url('/')); ?>"><?php esc_html_e('Zur Startseite','fev-metzingen'); ?></a></p>
                </div>
            </div>
        </div>
    </section>
</main>

<?php get_footer(); ?>
