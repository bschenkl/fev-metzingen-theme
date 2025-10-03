(function() {
    const { registerBlockType } = wp.blocks;
    const { createElement: el, Fragment } = wp.element;
    const { InspectorControls, InnerBlocks } = wp.blockEditor;
    const { PanelBody, TextControl, SelectControl, ToggleControl } = wp.components;
    const { __ } = wp.i18n;

    // FeV Single Card Block
    registerBlockType('fev-metzingen/card-block', {
        title: __('FeV Card Block'),
        description: __('Eine einzelne Card mit flexiblem Inhalt und optionalen Design-Einstellungen.'),
        icon: 'id-alt',
        category: 'layout',
        keywords: [__('card'), __('layout'), __('single')],

        attributes: {
            cardUrl: { type: 'string', default: '' },
            isClickable: { type: 'boolean', default: false },
            openInNewTab: { type: 'boolean', default: false },
            cardStyle: { type: 'string', default: 'default' },
            cardPadding: { type: 'string', default: 'large' },
            centerContent: { type: 'boolean', default: false },
            cardBorder: { type: 'boolean', default: false },
            hoverAnimation: { type: 'boolean', default: true }
        },

        edit: function(props) {
            const { attributes, setAttributes } = props;
            const { cardUrl, isClickable, openInNewTab, cardStyle, cardPadding, centerContent, cardBorder, hoverAnimation } = attributes;

            // Card Style Optionen
            const cardStyleOptions = [
                { label: __('Standard'), value: 'default' },
                { label: __('Primary'), value: 'primary' },
                { label: __('Secondary'), value: 'secondary' },
                { label: __('Muted'), value: 'muted' }
            ];

            // Padding Optionen
            const cardPaddingOptions = [
                { label: __('Small'), value: 'small' },
                { label: __('Large'), value: 'large' }
            ];

            // Dynamische Klassen basierend auf Einstellungen - Card Container
            const cardClasses = [
                'uk-card',
                `uk-card-${cardStyle}`,
                cardPadding === 'small' ? 'uk-card-small' : cardPadding === 'large' ? 'uk-card-large' : '',
                hoverAnimation ? 'uk-card-hover' : ''
            ].filter(Boolean).join(' ');

            // Klassen für den Card Body
            const cardBodyClasses = [
                'uk-card-body',
                centerContent ? 'uk-text-center' : ''
            ].filter(Boolean).join(' ');

            const cardStyles = {
                border: cardBorder ? '1px solid #e5e5e5' : 'none'
            };

            return el(Fragment, {},
                el(InspectorControls, {},
                    el(PanelBody, { title: __('Link Einstellungen'), initialOpen: true },
                        el(ToggleControl, { 
                            label: __('Card als Link verwenden'), 
                            checked: isClickable, 
                            onChange: (value) => setAttributes({ isClickable: value }) 
                        }),
                        isClickable && el(Fragment, {},
                            el(TextControl, { 
                                label: __('Link (URL)'), 
                                value: cardUrl, 
                                onChange: (value) => setAttributes({ cardUrl: value }) 
                            }),
                            el(ToggleControl, { 
                                label: __('In neuem Tab öffnen'), 
                                checked: openInNewTab, 
                                onChange: (value) => setAttributes({ openInNewTab: value }) 
                            })
                        )
                    ),
                    el(PanelBody, { title: __('Design Einstellungen'), initialOpen: false },
                        el(SelectControl, { 
                            label: __('Card Stil'), 
                            value: cardStyle, 
                            options: cardStyleOptions, 
                            onChange: (value) => setAttributes({ cardStyle: value }) 
                        }),
                        el(SelectControl, { 
                            label: __('Padding'), 
                            value: cardPadding, 
                            options: cardPaddingOptions, 
                            onChange: (value) => setAttributes({ cardPadding: value }) 
                        }),
                        el(ToggleControl, { 
                            label: __('Inhalt zentrieren'), 
                            checked: centerContent, 
                            onChange: (value) => setAttributes({ centerContent: value }) 
                        }),
                        el(ToggleControl, { 
                            label: __('Rahmen anzeigen'), 
                            checked: cardBorder, 
                            onChange: (value) => setAttributes({ cardBorder: value }) 
                        }),
                        el(ToggleControl, { 
                            label: __('Hover Animation'), 
                            checked: hoverAnimation, 
                            onChange: (value) => setAttributes({ hoverAnimation: value }) 
                        })
                    )
                ),
                el('div', { className: 'fev-card-block-editor' },
                    el('div', { className: cardClasses, style: cardStyles },
                        el('div', { style: { marginBottom: '15px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '4px' } },
                            el('small', { style: { color: '#666' } }, 
                                isClickable ? `📎 Verlinkte Card (${cardUrl || 'URL nicht gesetzt'})` : '📄 Normale Card'
                            )
                        ),
                        el('div', { style: { marginBottom: '10px', padding: '10px', backgroundColor: '#e8f4f8', borderRadius: '4px', border: '1px dashed #0073aa' } },
                            el('h4', { style: { margin: '0 0 10px 0', fontSize: '12px', color: '#0073aa', fontWeight: 'bold' } }, '📋 Card Struktur Anleitung'),
                            el('div', { style: { fontSize: '11px', color: '#666', lineHeight: '1.4' } },
                                el('p', { style: { margin: '0 0 8px 0' } }, '• Verwenden Sie "Gruppe" oder "Spalten" Blöcke für komplexe Layouts'),
                                el('p', { style: { margin: '0 0 8px 0' } }, '• Für Card Header: Überschrift mit Klasse "uk-card-header"'),
                                el('p', { style: { margin: '0 0 8px 0' } }, '• Für Media: Bild-Block für uk-card-media-top'),
                                el('p', { style: { margin: '0' } }, '• Body-Inhalte werden automatisch mit uk-card-body umschlossen')
                            )
                        ),
                        el(InnerBlocks, { 
                            templateLock: false,
                            template: [
                                ['core/group', { className: 'uk-card-body' }, [
                                    ['core/heading', { level: 3, placeholder: 'Card Titel eingeben...', className: 'uk-card-title' }],
                                    ['core/paragraph', { placeholder: 'Card Inhalt eingeben...' }]
                                ]]
                            ],
                            placeholder: 'Card Inhalte hinzufügen...',
                            __experimentalAppenderTagName: 'div'
                        })
                    )
                )
            );
        },

        save: function(props) {
            const { attributes } = props;
            const { cardUrl, isClickable, openInNewTab, cardStyle, cardPadding, centerContent, cardBorder, hoverAnimation } = attributes;

            // Dynamische Klassen für Frontend - Card Container
            const cardClasses = [
                'uk-card',
                `uk-card-${cardStyle}`,
                cardPadding === 'small' ? 'uk-card-small' : cardPadding === 'large' ? 'uk-card-large' : '',
                hoverAnimation ? 'uk-card-hover' : ''
            ].filter(Boolean).join(' ');

            // Klassen für den Card Body
            const cardBodyClasses = [
                'uk-card-body',
                centerContent ? 'uk-text-center' : ''
            ].filter(Boolean).join(' ');

            const cardStyles = {
                border: cardBorder ? '1px solid #e5e5e5' : 'none'
            };

            const cardContent = el('div', { className: cardClasses, style: cardStyles, 'uk-scrollspy': 'cls: uk-animation-slide-bottom-medium; delay: 100' },
                el(InnerBlocks.Content)
            );

            // Wenn Card klickbar ist, als Link wrappen
            if (isClickable && cardUrl) {
                return el('a', { 
                    href: cardUrl,
                    className: 'fev-card-link',
                    target: openInNewTab ? '_blank' : undefined,
                    rel: openInNewTab ? 'noopener noreferrer' : undefined,
                    style: { textDecoration: 'none', color: 'inherit' }
                }, cardContent);
            }

            return cardContent;
        }
    });


})();
