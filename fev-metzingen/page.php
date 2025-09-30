<?php get_header(); ?>

<main id="main-content" role="main">
    <?php
    // Sichere Abfrage der Post-Meta-Daten
    $hero_title = get_hero_title(get_the_ID());
    $hero_description = get_hero_description(get_the_ID());
    $hero_background_image = get_hero_background_image(get_the_ID());

    get_template_part('template-parts/hero', null, [
        'hero_title' => sanitize_text_field($hero_title),
        'hero_subtitle' => sanitize_text_field($hero_description),
        'hero_background_image' => esc_url($hero_background_image),
    ]); ?>
    
    <section class="uk-section" role="region" aria-label="Hauptinhalt">
        <div class="uk-container">
            <div uk-height-viewport='expand: true' class="uk-grid">
                <div class="uk-width-expand">
                    <?php 
                    if (have_posts()) : 
                        while (have_posts()) : the_post();
                            the_content();
                        endwhile;
                    endif;
                    ?>
                </div>
            </div>
        </div>
    </section>
</main>

<?php get_footer(); ?>