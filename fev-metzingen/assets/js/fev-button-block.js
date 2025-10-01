(function(blocks, element, blockEditor, components, i18n) {
    var el = element.createElement;
    var RichText = blockEditor.RichText;
    var InspectorControls = blockEditor.InspectorControls;
    var PanelBody = components.PanelBody;
    var SelectControl = components.SelectControl;
    var ToggleControl = components.ToggleControl;
    var TextControl = components.TextControl;
    var URLInput = components.URLInput;
    var __ = i18n.__;

    blocks.registerBlockType('fev-metzingen/button', {
        title: __('FeV Smart Button', 'fev-metzingen'),
        description: __('A smart button with UIkit styling and advanced options', 'fev-metzingen'),
        icon: 'button',
        category: 'layout',
        keywords: [__('button', 'fev-metzingen'), __('link', 'fev-metzingen'), __('cta', 'fev-metzingen')],
        
        attributes: {
            text: {
                type: 'string',
                default: __('Button Text', 'fev-metzingen')
            },
            url: {
                type: 'string',
                default: ''
            },
            linkTarget: {
                type: 'string',
                default: '_self'
            },
            buttonStyle: {
                type: 'string',
                default: 'default'
            },
            buttonSize: {
                type: 'string',
                default: 'medium'
            },
            buttonWidth: {
                type: 'string',
                default: 'auto'
            },
            alignment: {
                type: 'string',
                default: 'left'
            },
            openInNewTab: {
                type: 'boolean',
                default: false
            },
            addNoFollow: {
                type: 'boolean',
                default: false
            },
            addDownload: {
                type: 'boolean',
                default: false
            },
            customClasses: {
                type: 'string',
                default: ''
            },
            iconBefore: {
                type: 'string',
                default: ''
            },
            iconAfter: {
                type: 'string',
                default: ''
            }
        },

        edit: function(props) {
            var attributes = props.attributes;
            var setAttributes = props.setAttributes;

            function onChangeText(newText) {
                setAttributes({ text: newText });
            }

            function onChangeURL(newURL) {
                setAttributes({ url: newURL });
            }

            function onChangeButtonStyle(newStyle) {
                setAttributes({ buttonStyle: newStyle });
            }

            function onChangeButtonSize(newSize) {
                setAttributes({ buttonSize: newSize });
            }

            function onChangeButtonWidth(newWidth) {
                setAttributes({ buttonWidth: newWidth });
            }

            function onChangeAlignment(newAlignment) {
                setAttributes({ alignment: newAlignment });
            }

            function onToggleNewTab(value) {
                setAttributes({ 
                    openInNewTab: value,
                    linkTarget: value ? '_blank' : '_self'
                });
            }

            function onToggleNoFollow(value) {
                setAttributes({ addNoFollow: value });
            }

            function onToggleDownload(value) {
                setAttributes({ addDownload: value });
            }

            function onChangeCustomClasses(newClasses) {
                setAttributes({ customClasses: newClasses });
            }

            function onChangeIconBefore(newIcon) {
                setAttributes({ iconBefore: newIcon });
            }

            function onChangeIconAfter(newIcon) {
                setAttributes({ iconAfter: newIcon });
            }

            // Build button classes
            var buttonClasses = ['uk-button'];
            
            // Style classes
            switch(attributes.buttonStyle) {
                case 'primary':
                    buttonClasses.push('uk-button-primary');
                    break;
                case 'secondary':
                    buttonClasses.push('uk-button-secondary');
                    break;
                case 'danger':
                    buttonClasses.push('uk-button-danger');
                    break;
                case 'text':
                    buttonClasses.push('uk-button-text');
                    break;
                case 'link':
                    buttonClasses.push('uk-button-link');
                    break;
                default:
                    buttonClasses.push('uk-button-default');
            }

            // Size classes
            switch(attributes.buttonSize) {
                case 'small':
                    buttonClasses.push('uk-button-small');
                    break;
                case 'large':
                    buttonClasses.push('uk-button-large');
                    break;
            }

            // Width classes
            if (attributes.buttonWidth === 'full') {
                buttonClasses.push('uk-width-1-1');
            }

            // Custom classes
            if (attributes.customClasses) {
                buttonClasses.push(attributes.customClasses);
            }

            // Container alignment classes
            var containerClasses = ['fev-button-block'];
            switch(attributes.alignment) {
                case 'center':
                    containerClasses.push('uk-text-center');
                    break;
                case 'right':
                    containerClasses.push('uk-text-right');
                    break;
                default:
                    containerClasses.push('uk-text-left');
            }

            return el('div', { className: 'fev-button-block-editor' },
                el(InspectorControls, {},
                    el(PanelBody, { 
                        title: __('Button Settings', 'fev-metzingen'),
                        initialOpen: true 
                    },
                        el(TextControl, {
                            label: __('Button URL', 'fev-metzingen'),
                            value: attributes.url,
                            onChange: onChangeURL,
                            placeholder: __('https://example.com', 'fev-metzingen')
                        }),
                        
                        el(SelectControl, {
                            label: __('Button Style', 'fev-metzingen'),
                            value: attributes.buttonStyle,
                            options: [
                                { label: __('Default', 'fev-metzingen'), value: 'default' },
                                { label: __('Primary', 'fev-metzingen'), value: 'primary' },
                                { label: __('Secondary', 'fev-metzingen'), value: 'secondary' },
                                { label: __('Danger', 'fev-metzingen'), value: 'danger' },
                                { label: __('Text', 'fev-metzingen'), value: 'text' },
                                { label: __('Link', 'fev-metzingen'), value: 'link' }
                            ],
                            onChange: onChangeButtonStyle
                        }),

                        el(SelectControl, {
                            label: __('Button Size', 'fev-metzingen'),
                            value: attributes.buttonSize,
                            options: [
                                { label: __('Small', 'fev-metzingen'), value: 'small' },
                                { label: __('Medium', 'fev-metzingen'), value: 'medium' },
                                { label: __('Large', 'fev-metzingen'), value: 'large' }
                            ],
                            onChange: onChangeButtonSize
                        }),

                        el(SelectControl, {
                            label: __('Button Width', 'fev-metzingen'),
                            value: attributes.buttonWidth,
                            options: [
                                { label: __('Auto', 'fev-metzingen'), value: 'auto' },
                                { label: __('Full Width', 'fev-metzingen'), value: 'full' }
                            ],
                            onChange: onChangeButtonWidth
                        }),

                        el(SelectControl, {
                            label: __('Alignment', 'fev-metzingen'),
                            value: attributes.alignment,
                            options: [
                                { label: __('Left', 'fev-metzingen'), value: 'left' },
                                { label: __('Center', 'fev-metzingen'), value: 'center' },
                                { label: __('Right', 'fev-metzingen'), value: 'right' }
                            ],
                            onChange: onChangeAlignment
                        })
                    ),

                    el(PanelBody, { 
                        title: __('Link Options', 'fev-metzingen'),
                        initialOpen: false 
                    },
                        el(ToggleControl, {
                            label: __('Open in new tab', 'fev-metzingen'),
                            checked: attributes.openInNewTab,
                            onChange: onToggleNewTab
                        }),

                        el(ToggleControl, {
                            label: __('Add rel="nofollow"', 'fev-metzingen'),
                            checked: attributes.addNoFollow,
                            onChange: onToggleNoFollow
                        }),

                        el(ToggleControl, {
                            label: __('Download link (add download attribute)', 'fev-metzingen'),
                            checked: attributes.addDownload,
                            onChange: onToggleDownload
                        })
                    ),

                    el(PanelBody, { 
                        title: __('Icons & Advanced', 'fev-metzingen'),
                        initialOpen: false 
                    },
                        el(TextControl, {
                            label: __('Icon Before Text (UIkit icon name)', 'fev-metzingen'),
                            value: attributes.iconBefore,
                            onChange: onChangeIconBefore,
                            placeholder: __('e.g. heart, star, mail', 'fev-metzingen'),
                            help: __('UIkit icon name without "uk-icon-" prefix', 'fev-metzingen')
                        }),

                        el(TextControl, {
                            label: __('Icon After Text (UIkit icon name)', 'fev-metzingen'),
                            value: attributes.iconAfter,
                            onChange: onChangeIconAfter,
                            placeholder: __('e.g. arrow-right, chevron-right', 'fev-metzingen'),
                            help: __('UIkit icon name without "uk-icon-" prefix', 'fev-metzingen')
                        }),

                        el(TextControl, {
                            label: __('Custom CSS Classes', 'fev-metzingen'),
                            value: attributes.customClasses,
                            onChange: onChangeCustomClasses,
                            placeholder: __('additional-class another-class', 'fev-metzingen'),
                            help: __('Add custom CSS classes separated by spaces', 'fev-metzingen')
                        })
                    )
                ),

                el('div', { className: containerClasses.join(' ') },
                    el('div', { className: 'uk-button-group' },
                        el(RichText, {
                            tagName: 'a',
                            className: buttonClasses.join(' '),
                            value: attributes.text,
                            onChange: onChangeText,
                            placeholder: __('Button Text', 'fev-metzingen'),
                            allowedFormats: []
                        })
                    )
                )
            );
        },

        save: function(props) {
            var attributes = props.attributes;

            // Build button classes
            var buttonClasses = ['uk-button'];
            
            // Style classes
            switch(attributes.buttonStyle) {
                case 'primary':
                    buttonClasses.push('uk-button-primary');
                    break;
                case 'secondary':
                    buttonClasses.push('uk-button-secondary');
                    break;
                case 'danger':
                    buttonClasses.push('uk-button-danger');
                    break;
                case 'text':
                    buttonClasses.push('uk-button-text');
                    break;
                case 'link':
                    buttonClasses.push('uk-button-link');
                    break;
                default:
                    buttonClasses.push('uk-button-default');
            }

            // Size classes
            switch(attributes.buttonSize) {
                case 'small':
                    buttonClasses.push('uk-button-small');
                    break;
                case 'large':
                    buttonClasses.push('uk-button-large');
                    break;
            }

            // Width classes
            if (attributes.buttonWidth === 'full') {
                buttonClasses.push('uk-width-1-1');
            }

            // Custom classes
            if (attributes.customClasses) {
                buttonClasses.push(attributes.customClasses);
            }

            // Container alignment classes
            var containerClasses = ['fev-button-block'];
            switch(attributes.alignment) {
                case 'center':
                    containerClasses.push('uk-text-center');
                    break;
                case 'right':
                    containerClasses.push('uk-text-right');
                    break;
                default:
                    containerClasses.push('uk-text-left');
            }

            // Build link attributes
            var linkAttributes = {
                className: buttonClasses.join(' '),
                href: attributes.url || '#'
            };

            if (attributes.openInNewTab) {
                linkAttributes.target = '_blank';
                linkAttributes.rel = 'noopener';
            }

            if (attributes.addNoFollow) {
                linkAttributes.rel = (linkAttributes.rel || '') + ' nofollow';
            }

            if (attributes.addDownload) {
                linkAttributes.download = '';
            }

            // Build button content with icons
            var buttonContent = [];
            
            if (attributes.iconBefore) {
                buttonContent.push(
                    el('span', {
                        key: 'icon-before',
                        'uk-icon': attributes.iconBefore,
                        className: 'uk-margin-small-right'
                    })
                );
            }

            buttonContent.push(
                el(RichText.Content, {
                    key: 'text',
                    tagName: 'span',
                    value: attributes.text
                })
            );

            if (attributes.iconAfter) {
                buttonContent.push(
                    el('span', {
                        key: 'icon-after',
                        'uk-icon': attributes.iconAfter,
                        className: 'uk-margin-small-left'
                    })
                );
            }

            return el('div', { className: containerClasses.join(' ') },
                el('a', linkAttributes, buttonContent)
            );
        }
    });
})(
    window.wp.blocks,
    window.wp.element,
    window.wp.blockEditor,
    window.wp.components,
    window.wp.i18n
);
