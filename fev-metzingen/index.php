<?php get_header(); ?>

<main>
    <?php
        $title = 'Willkommen';
        $description = 'bei der FeV Metzingen';
        $hero_background_image = '/assets/images/default-hero.jpg';

        get_template_part('template-parts/hero', null, [
            'hero_title' => $title,
            'hero_subtitle' => $description,
            'hero_background_image' => $hero_background_image,
        ]);
        get_template_part('template-parts/intro');
        // Weitere Sektionen modular hinzufügen
    ?>
</main>

<?php get_footer(); ?>
