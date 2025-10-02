(function() {
    const { registerBlockType } = wp.blocks;
    const { createElement: el, Fragment } = wp.element;
    const { InspectorControls } = wp.blockEditor;
    const { PanelBody, TextControl, SelectControl, ToggleControl, RangeControl } = wp.components;
    const { __ } = wp.i18n;

    // Verfügbare Icons für den Icon Block
    const availableIcons = [
        { label: __('Kein Icon'), value: '' },
        { label: __('Stern'), value: 'star' },
        { label: __('Herz'), value: 'heart' },
        { label: __('Haus'), value: 'home' },
        { label: __('Person'), value: 'user' },
        { label: __('Personen'), value: 'users' },
        { label: __('Kalender'), value: 'calendar' },
        { label: __('Uhr'), value: 'clock' },
        { label: __('E-Mail'), value: 'mail' },
        { label: __('Telefon'), value: 'phone' },
        { label: __('Ort'), value: 'location' },
        { label: __('Kamera'), value: 'camera' },
        { label: __('Bild'), value: 'image' },
        { label: __('Video'), value: 'video' },
        { label: __('Musik'), value: 'music' },
        { label: __('Mikrofon'), value: 'microphone' },
        { label: __('Einstellungen'), value: 'settings' },
        { label: __('Information'), value: 'info' },
        { label: __('Warnung'), value: 'warning' },
        { label: __('Häkchen'), value: 'check' },
        { label: __('Plus'), value: 'plus' },
        { label: __('Minus'), value: 'minus' },
        { label: __('Suche'), value: 'search' },
        { label: __('Lesezeichen'), value: 'bookmark' },
        { label: __('Tag'), value: 'tag' },
        { label: __('Ordner'), value: 'folder' },
        { label: __('Datei'), value: 'file-text' },
        { label: __('Download'), value: 'download' },
        { label: __('Upload'), value: 'upload' },
        { label: __('Link'), value: 'link' },
        { label: __('Schloss'), value: 'lock' },
        { label: __('Entsperrt'), value: 'unlock' },
        { label: __('Welt'), value: 'world' },
        { label: __('Kommentare'), value: 'comments' },
        { label: __('Sozial'), value: 'social' },
        { label: __('Daumen hoch'), value: 'thumbs-up' },
        { label: __('Geschenk'), value: 'gift' },
        { label: __('Blitz'), value: 'bolt' }
    ];

    // FeV Icon Block
    registerBlockType('fev-metzingen/icon-block', {
        title: __('FeV Icon Block'),
        description: __('Ein einzelnes Icon aus der UIkit Icon-Sammlung.'),
        icon: 'star-filled',
        category: 'common',
        keywords: [__('icon'), __('symbol'), __('uikit')],

        attributes: {
            iconName: { type: 'string', default: 'star' },
            iconSize: { type: 'number', default: 2 },
            iconColor: { type: 'string', default: 'primary' },
            iconCustomColor: { type: 'string', default: '' },
            iconAlignment: { type: 'string', default: 'center' },
            marginTop: { type: 'number', default: 0 },
            marginBottom: { type: 'number', default: 0 },
            marginLeft: { type: 'number', default: 0 },
            marginRight: { type: 'number', default: 0 },
            hoverAnimation: { type: 'boolean', default: true }
        },

        edit: function(props) {
            const { attributes, setAttributes } = props;
            const { iconName, iconSize, iconColor, iconCustomColor, iconAlignment, marginTop, marginBottom, marginLeft, marginRight, hoverAnimation } = attributes;

            const colorOptions = [
                { label: __('Primary'), value: 'primary' },
                { label: __('Secondary'), value: 'secondary' },
                { label: __('Success'), value: 'success' },
                { label: __('Warning'), value: 'warning' },
                { label: __('Danger'), value: 'danger' },
                { label: __('Muted'), value: 'muted' },
                { label: __('Benutzerdefiniert'), value: 'custom' }
            ];

            const alignmentOptions = [
                { label: __('Links'), value: 'left' },
                { label: __('Zentriert'), value: 'center' },
                { label: __('Rechts'), value: 'right' }
            ];

            // Dynamische Icon-Styles
            const iconStyles = {
                marginTop: `${marginTop}px`,
                marginBottom: `${marginBottom}px`,
                marginLeft: `${marginLeft}px`,
                marginRight: `${marginRight}px`,
                color: iconColor === 'custom' && iconCustomColor ? iconCustomColor : undefined
            };

            return el(Fragment, {},
                el(InspectorControls, {},
                    el(PanelBody, { title: __('Icon Einstellungen'), initialOpen: true },
                        el(SelectControl, { 
                            label: __('Icon'), 
                            value: iconName, 
                            options: availableIcons, 
                            onChange: (value) => setAttributes({ iconName: value }) 
                        }),
                        el(RangeControl, { 
                            label: __('Icon Größe'), 
                            value: iconSize, 
                            onChange: (value) => setAttributes({ iconSize: value }),
                            min: 1,
                            max: 5,
                            step: 0.5
                        }),
                        el(SelectControl, { 
                            label: __('Icon Farbe'), 
                            value: iconColor, 
                            options: colorOptions, 
                            onChange: (value) => setAttributes({ iconColor: value }) 
                        }),
                        iconColor === 'custom' && el(TextControl, { 
                            label: __('Benutzerdefinierte Farbe (Hex)'), 
                            value: iconCustomColor, 
                            onChange: (value) => setAttributes({ iconCustomColor: value }),
                            placeholder: '#000000'
                        }),
                        el(SelectControl, { 
                            label: __('Ausrichtung'), 
                            value: iconAlignment, 
                            options: alignmentOptions, 
                            onChange: (value) => setAttributes({ iconAlignment: value }) 
                        }),
                        el(ToggleControl, { 
                            label: __('Hover Animation'), 
                            checked: hoverAnimation, 
                            onChange: (value) => setAttributes({ hoverAnimation: value }) 
                        })
                    ),
                    el(PanelBody, { title: __('Abstände (Margin)'), initialOpen: false },
                        el(RangeControl, { 
                            label: __('Oben'), 
                            value: marginTop, 
                            onChange: (value) => setAttributes({ marginTop: value }),
                            min: 0,
                            max: 50,
                            step: 1
                        }),
                        el(RangeControl, { 
                            label: __('Unten'), 
                            value: marginBottom, 
                            onChange: (value) => setAttributes({ marginBottom: value }),
                            min: 0,
                            max: 50,
                            step: 1
                        }),
                        el(RangeControl, { 
                            label: __('Links'), 
                            value: marginLeft, 
                            onChange: (value) => setAttributes({ marginLeft: value }),
                            min: 0,
                            max: 50,
                            step: 1
                        }),
                        el(RangeControl, { 
                            label: __('Rechts'), 
                            value: marginRight, 
                            onChange: (value) => setAttributes({ marginRight: value }),
                            min: 0,
                            max: 50,
                            step: 1
                        })
                    )
                ),
                el('div', { 
                    className: 'fev-icon-block-editor',
                    style: { textAlign: iconAlignment, padding: '20px', border: '1px dashed #ccc' }
                },
                    iconName && el('span', { 
                        'uk-icon': `icon: ${iconName}; ratio: ${iconSize}`,
                        className: [
                            iconColor !== 'custom' ? `uk-text-${iconColor}` : '',
                            hoverAnimation ? 'uk-transition-scale-up uk-transition-opaque' : ''
                        ].filter(Boolean).join(' '),
                        style: {
                            fontSize: `${iconSize * 16}px`,
                            cursor: hoverAnimation ? 'pointer' : 'default',
                            ...iconStyles
                        }
                    }),
                    !iconName && el('p', { style: { color: '#666', margin: 0 } }, 'Kein Icon ausgewählt')
                )
            );
        },

        save: function(props) {
            const { attributes } = props;
            const { iconName, iconSize, iconColor, iconCustomColor, iconAlignment, marginTop, marginBottom, marginLeft, marginRight, hoverAnimation } = attributes;

            if (!iconName) return null;

            // Dynamische Icon-Styles für Frontend
            const iconStyles = {
                marginTop: `${marginTop}px`,
                marginBottom: `${marginBottom}px`,
                marginLeft: `${marginLeft}px`,
                marginRight: `${marginRight}px`,
                color: iconColor === 'custom' && iconCustomColor ? iconCustomColor : undefined
            };

            // Klassen für das Icon
            const iconClasses = [
                iconColor !== 'custom' ? `uk-text-${iconColor}` : '',
                hoverAnimation ? 'uk-transition-scale-up uk-transition-opaque' : ''
            ].filter(Boolean).join(' ');

            // Container-Klassen für Hover-Effekt
            const containerClasses = [
                `uk-text-${iconAlignment}`,
                hoverAnimation ? 'uk-transition-toggle' : ''
            ].filter(Boolean).join(' ');

            return el('div', { 
                className: containerClasses,
                style: { 
                    textAlign: iconAlignment,
                    cursor: hoverAnimation ? 'pointer' : 'default'
                }
            },
                el('span', { 
                    'uk-icon': `icon: ${iconName}; ratio: ${iconSize}`,
                    className: iconClasses,
                    style: iconStyles
                })
            );
        }
    });
})();
