<footer class="uk-section uk-section-secondary uk-light">
    <div class="uk-container">
        <div class="uk-grid uk-child-width-1-3@m" uk-grid>
            <div>
                <?php
                    $custom_logo = get_theme_mod('custom_logo');
                    if ($custom_logo) {
                        echo '<img id="logo" class="uk-margin-left uk-margin-small-left@s uk-margin-medium-left:m" src="' . esc_url($custom_logo) . '" alt="' . esc_attr(get_bloginfo('name')) . '">';
                    } else {
                        echo '<span class="uk-margin-left uk-margin-small-left@s uk-margin-medium-left:m">' . esc_html(get_bloginfo('name')) . '</span>';
                    }
                ?>
            </div>
            <div>
                <h4><?php esc_html_e('Kontakt','fev-metzingen'); ?></h4>
                <?php
                    $org   = get_theme_mod('footer_org_name', 'FeV Metzingen');
                    $street= get_theme_mod('footer_street', 'Maurenstraße 13');
                    $zip   = get_theme_mod('footer_zip', '72555');
                    $city  = get_theme_mod('footer_city', 'Metzingen');
                    $email = sanitize_email(get_theme_mod('footer_email', 'info@fev-metzingen.de'));
                    $phone = get_theme_mod('footer_phone', '');
                ?>
                <address style="font-style:normal;">
                    <?php echo esc_html($org); ?><br>
                    <?php echo esc_html($street); ?><br>
                    <?php echo esc_html(trim($zip . ' ' . $city)); ?><br><br>
                    <?php if ($email) : ?>
                        <a href="mailto:<?php echo antispambot($email); ?>"><?php echo antispambot($email); ?></a><br>
                    <?php endif; ?>
                    <?php if (!empty($phone)) : ?>
                        <?php $tel_href = preg_replace('/[^+0-9]/', '', $phone); ?>
                        <a href="tel:<?php echo esc_attr($tel_href); ?>"><?php echo esc_html($phone); ?></a>
                    <?php endif; ?>
                </address>
            </div>
            <div>
                <h4><?php esc_html_e('Informationen','fev-metzingen'); ?></h4>
                <?php if (has_nav_menu('footer')) {
                    wp_nav_menu([
                        'theme_location' => 'footer',
                        'container' => 'nav',
                        'container_class' => 'footer-nav',
                        'menu_class' => 'uk-nav',
                        'fallback_cb' => false,
                        'depth' => 1,
                        'aria_label' => __('Footer Menü','fev-metzingen')
                    ]);
                } else {
                    echo '<p>'. esc_html__('Bitte ein Footer Menü im Backend zuweisen.','fev-metzingen') .'</p>';
                } ?>
            </div>
        </div>
    </div>
</footer>
<?php wp_footer(); ?>
</body>
</html>
