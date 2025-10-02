// JavaScript for icon selection in cards
(function() {
    const { createElement: el, Fragment } = wp.element;
    const { SelectControl } = wp.components;
    const { useEntityProp } = wp.coreData;
    const { useSelect } = wp.data;
    
    // Available icons (matches the PHP function)
    const availableIcons = {
        'star': 'Stern',
        'heart': 'Herz',
        'home': 'Haus',
        'user': 'Person',
        'users': 'Personen',
        'calendar': 'Kalender',
        'clock': 'Uhr',
        'mail': 'E-Mail',
        'phone': 'Telefon',
        'location': 'Ort',
        'camera': 'Kamera',
        'image': 'Bild',
        'video': 'Video',
        'music': 'Musik',
        'microphone': 'Mikrofon',
        'settings': 'Einstellungen',
        'info': 'Information',
        'warning': 'Warnung',
        'check': 'Häkchen',
        'plus': 'Plus',
        'minus': 'Minus',
        'search': 'Suche',
        'bookmark': 'Lesezeichen',
        'tag': 'Tag',
        'folder': 'Ordner',
        'file-text': 'Datei',
        'download': 'Download',
        'upload': 'Upload',
        'link': 'Link',
        'lock': 'Schloss',
        'unlock': 'Entsperrt',
        'world': 'Welt',
        'comments': 'Kommentare',
        'social': 'Sozial',
        'thumbs-up': 'Daumen hoch',
        'gift': 'Geschenk',
        'bolt': 'Blitz'
    };
    
    // Create options for Select-Control
    const iconOptions = [
        { label: 'Kein Icon', value: '' },
        ...Object.entries(availableIcons).map(([value, label]) => ({
            label: `${label} (${value})`,
            value: value
        }))
    ];
    
    // Hook for meta boxes
    wp.hooks.addFilter(
        'editor.PostFeaturedImage',
        'fev-metzingen/add-icon-controls',
        function(OriginalComponent) {
            return function(props) {
                const postType = useSelect(select => 
                    select('core/editor').getCurrentPostType()
                );
                
                const [icon1_1, setIcon1_1] = useEntityProp('postType', postType, 'card_icon_group_1_1');
                const [icon1_2, setIcon1_2] = useEntityProp('postType', postType, 'card_icon_group_1_2');
                const [icon1_3, setIcon1_3] = useEntityProp('postType', postType, 'card_icon_group_1_3');
                const [icon2_1, setIcon2_1] = useEntityProp('postType', postType, 'card_icon_group_2_1');
                const [icon2_2, setIcon2_2] = useEntityProp('postType', postType, 'card_icon_group_2_2');
                const [icon2_3, setIcon2_3] = useEntityProp('postType', postType, 'card_icon_group_2_3');
                const [icon3_1, setIcon3_1] = useEntityProp('postType', postType, 'card_icon_group_3_1');
                const [icon3_2, setIcon3_2] = useEntityProp('postType', postType, 'card_icon_group_3_2');
                const [icon3_3, setIcon3_3] = useEntityProp('postType', postType, 'card_icon_group_3_3');
                
                return el(Fragment, {},
                    el(OriginalComponent, props),
                    el('div', { className: 'card-icon-controls', style: { marginTop: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '4px' } },
                        el('h4', {}, 'Card Icons für Patterns auswählen'),
                        el('p', { style: { fontSize: '14px', color: '#666' } }, 'Icons für das "Dreispaltiges Layout mit Icons" Pattern:'),
                        
                        el('h5', { style: { marginTop: '20px', marginBottom: '10px' } }, 'Gruppe 1 (erste Cards-Gruppe)'),
                        el(SelectControl, {
                            label: 'Icon für Card 1',
                            value: icon1_1 || 'star',
                            options: iconOptions,
                            onChange: setIcon1_1
                        }),
                        el(SelectControl, {
                            label: 'Icon für Card 2',
                            value: icon1_2 || 'heart',
                            options: iconOptions,
                            onChange: setIcon1_2
                        }),
                        el(SelectControl, {
                            label: 'Icon für Card 3',
                            value: icon1_3 || 'home',
                            options: iconOptions,
                            onChange: setIcon1_3
                        }),
                        
                        el('h5', { style: { marginTop: '20px', marginBottom: '10px' } }, 'Gruppe 2 (zweite Cards-Gruppe)'),
                        el(SelectControl, {
                            label: 'Icon für Card 1',
                            value: icon2_1 || 'star',
                            options: iconOptions,
                            onChange: setIcon2_1
                        }),
                        el(SelectControl, {
                            label: 'Icon für Card 2',
                            value: icon2_2 || 'heart',
                            options: iconOptions,
                            onChange: setIcon2_2
                        }),
                        el(SelectControl, {
                            label: 'Icon für Card 3',
                            value: icon2_3 || 'home',
                            options: iconOptions,
                            onChange: setIcon2_3
                        }),
                        
                        el('h5', { style: { marginTop: '20px', marginBottom: '10px' } }, 'Gruppe 3 (dritte Cards-Gruppe)'),
                        el(SelectControl, {
                            label: 'Icon für Card 1',
                            value: icon3_1 || 'star',
                            options: iconOptions,
                            onChange: setIcon3_1
                        }),
                        el(SelectControl, {
                            label: 'Icon für Card 2',
                            value: icon3_2 || 'heart',
                            options: iconOptions,
                            onChange: setIcon3_2
                        }),
                        el(SelectControl, {
                            label: 'Icon für Card 3',
                            value: icon3_3 || 'home',
                            options: iconOptions,
                            onChange: setIcon3_3
                        })
                    )
                );
            };
        }
    );
})();
