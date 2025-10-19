(function() {
    const { registerBlockType } = wp.blocks;
    const { createElement: el, Fragment } = wp.element;
    const { InspectorControls, InnerBlocks } = wp.blockEditor || wp.editor;
    const { PanelBody, SelectControl } = wp.components;
    const { __ } = wp.i18n;

    registerBlockType('fev-metzingen/section-block', {
        title: __('FeV Section'),
        description: __('Full-width section with selectable background (white or grey).'),
        icon: 'format-image',
        category: 'layout',
        supports: { html: false },
        attributes: {
            background: { type: 'string', default: 'white' }
        },
        edit: function(props) {
            const { attributes, setAttributes } = props;
            const { background } = attributes;
            return el(Fragment, {},
                el(InspectorControls, {},
                    el(PanelBody, { title: __('Background') },
                        el(SelectControl, {
                            label: __('Background color'),
                            value: background,
                            options: [
                                { label: __('White'), value: 'white' },
                                { label: __('Grey'), value: 'grey' }
                            ],
                            onChange: (val) => setAttributes({ background: val })
                        })
                    )
                ),
                el('div', { className: `fev-section-block fev-section-${background}` , style: { width: '120%', marginLeft: '0%', transform: 'translateX(-50%)', padding: '40px 20px' }, 'uk-scrollspy': 'cls: uk-animation-slide-left-medium' },
                    el('div', { className: 'uk-container' },
                        el(InnerBlocks)
                    )
                )
            );
        },
        save: function(props) {
            const { attributes } = props;
            const { background } = attributes;
            const animation = background === 'white' ? 'uk-animation-slide-left-medium' : 'uk-animation-slide-right-medium';
            return el('div', { className: `fev-section-block fev-section-${background}` , 'data-background': background, 'uk-scrollspy': `cls: ${animation}; delay: 100` },
                el('div', { className: 'uk-container' },
                    el(InnerBlocks.Content)
                )
            );
        }
    });
})();
