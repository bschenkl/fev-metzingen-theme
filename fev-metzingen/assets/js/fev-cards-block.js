(function() {
    const { registerBlockType } = wp.blocks;
    const { createElement: el, Fragment } = wp.element;
    const { InspectorControls, InnerBlocks } = wp.blockEditor;
    const { PanelBody, TextControl, SelectControl, ToggleControl } = wp.components;
    const { __ } = wp.i18n;

    // Verfügbare Icons
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

    registerBlockType('fev-metzingen/cards-block', {
        title: __('FeV Cards Block'),
        description: __('Ein dreispaltiges Card-Layout mit optionalen Icons und frei bestimmbarem Inhalt.'),
        icon: 'grid-view',
        category: 'layout',
        keywords: [__('cards'), __('layout'), __('three-column')],

        attributes: {
            card1Icon: { type: 'string', default: '' },
            card1Url: { type: 'string', default: '' },
            card2Icon: { type: 'string', default: '' },
            card2Url: { type: 'string', default: '' },
            card3Icon: { type: 'string', default: '' },
            card3Url: { type: 'string', default: '' }
        },

        edit: function(props) {
            const { attributes, setAttributes } = props;
            const { card1Icon, card1Url, card2Icon, card2Url, card3Icon, card3Url } = attributes;

            const TEMPLATE = [
                ['core/columns', {}, [
                    ['core/column', {}, [
                        ['core/heading', { level: 3, placeholder: 'Card 1 Titel', className: 'uk-card-title' }],
                        ['core/paragraph', { placeholder: 'Beschreibung für Card 1...' }]
                    ]],
                    ['core/column', {}, [
                        ['core/heading', { level: 3, placeholder: 'Card 2 Titel', className: 'uk-card-title' }],
                        ['core/paragraph', { placeholder: 'Beschreibung für Card 2...' }]
                    ]],
                    ['core/column', {}, [
                        ['core/heading', { level: 3, placeholder: 'Card 3 Titel', className: 'uk-card-title' }],
                        ['core/paragraph', { placeholder: 'Beschreibung für Card 3...' }]
                    ]]
                ]]
            ];

            return el(Fragment, {},
                el(InspectorControls, {},
                    el(PanelBody, { title: __('Card 1 Einstellungen'), initialOpen: true },
                        el(SelectControl, { label: __('Icon'), value: card1Icon, options: availableIcons, onChange: (value) => setAttributes({ card1Icon: value }) }),
                        el(TextControl, { label: __('Link (URL)'), value: card1Url, onChange: (value) => setAttributes({ card1Url: value }) })
                    ),
                    el(PanelBody, { title: __('Card 2 Einstellungen'), initialOpen: false },
                        el(SelectControl, { label: __('Icon'), value: card2Icon, options: availableIcons, onChange: (value) => setAttributes({ card2Icon: value }) }),
                        el(TextControl, { label: __('Link (URL)'), value: card2Url, onChange: (value) => setAttributes({ card2Url: value }) })
                    ),
                    el(PanelBody, { title: __('Card 3 Einstellungen'), initialOpen: false },
                        el(SelectControl, { label: __('Icon'), value: card3Icon, options: availableIcons, onChange: (value) => setAttributes({ card3Icon: value }) }),
                        el(TextControl, { label: __('Link (URL)'), value: card3Url, onChange: (value) => setAttributes({ card3Url: value }) })
                    )
                ),
                el('div', { className: 'fev-cards-block-editor uk-width-4-5@m uk-margin-auto uk-margin-large-top' },
                    el('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' } },
                        el('div', { className: 'uk-card uk-card-default uk-card-body', style: { border: '1px solid #ddd', padding: '20px' } },
                            card1Icon && el('div', { className: 'card-icon-container', style: { textAlign: 'center', marginBottom: '15px' } },
                                el('span', { 
                                    'uk-icon': `icon: ${card1Icon}; ratio: 2`,
                                    className: 'uk-text-primary',
                                    style: { fontSize: '32px' }
                                })
                            ),
                            el('p', { style: { fontSize: '12px', color: '#666', marginBottom: '10px' } }, 'Card 1 - Inhalt über InnerBlocks editierbar')
                        ),
                        el('div', { className: 'uk-card uk-card-default uk-card-body', style: { border: '1px solid #ddd', padding: '20px' } },
                            card2Icon && el('div', { className: 'card-icon-container', style: { textAlign: 'center', marginBottom: '15px' } },
                                el('span', { 
                                    'uk-icon': `icon: ${card2Icon}; ratio: 2`,
                                    className: 'uk-text-primary',
                                    style: { fontSize: '32px' }
                                })
                            ),
                            el('p', { style: { fontSize: '12px', color: '#666', marginBottom: '10px' } }, 'Card 2 - Inhalt über InnerBlocks editierbar')
                        ),
                        el('div', { className: 'uk-card uk-card-default uk-card-body', style: { border: '1px solid #ddd', padding: '20px' } },
                            card3Icon && el('div', { className: 'card-icon-container', style: { textAlign: 'center', marginBottom: '15px' } },
                                el('span', { 
                                    'uk-icon': `icon: ${card3Icon}; ratio: 2`,
                                    className: 'uk-text-primary',
                                    style: { fontSize: '32px' }
                                })
                            ),
                            el('p', { style: { fontSize: '12px', color: '#666', marginBottom: '10px' } }, 'Card 3 - Inhalt über InnerBlocks editierbar')
                        )
                    ),
                    el('div', { style: { marginTop: '20px', padding: '20px', border: '2px dashed #ccc', backgroundColor: '#f9f9f9' } },
                        el('h4', { style: { margin: '0 0 15px 0', color: '#666' } }, 'Inhalt der Cards (editierbar):'),
                        el(InnerBlocks, { template: TEMPLATE, templateLock: false })
                    )
                )
            );
        },

        save: function(props) {
            return el(InnerBlocks.Content);
        }
    });
})();
