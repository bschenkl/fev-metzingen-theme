(function() {
    const { registerBlockType } = wp.blocks;
    const { createElement: el, Fragment } = wp.element;
    const { InspectorControls, RichText, InnerBlocks } = wp.blockEditor;
    const { PanelBody, SelectControl, ToggleControl, ButtonGroup, Button } = wp.components;
    const { __ } = wp.i18n;

    registerBlockType('fev-metzingen/table', {
        title: __('FeV UIkit Table', 'fev-metzingen'),
        description: __('A responsive UIkit table with customizable styling and flexible content blocks.', 'fev-metzingen'),
        icon: 'editor-table',
        category: 'layout',
        keywords: [__('table'), __('uikit'), __('data')],
        
        attributes: {
            tableStyle: { type: 'string', default: 'default' },
            hover: { type: 'boolean', default: false },
            small: { type: 'boolean', default: false },
            responsive: { type: 'boolean', default: true },
            hasHeader: { type: 'boolean', default: true },
            columns: { type: 'number', default: 3 },
            rows: { type: 'number', default: 2 },
            headerData: {
                type: 'array',
                default: ['Header 1', 'Header 2', 'Header 3']
            }
        },

        edit: function(props) {
            const { attributes, setAttributes, clientId } = props;
            const { tableStyle, hover, small, responsive, hasHeader, columns, rows, headerData } = attributes;

            // Helper functions
            const updateHeaderCell = (cellIndex, value) => {
                const newHeaderData = [...headerData];
                newHeaderData[cellIndex] = value;
                setAttributes({ headerData: newHeaderData });
            };

            const addRow = () => {
                const newRows = rows + 1;
                setAttributes({ rows: newRows });
                
                // Add a new row block
                const existingBlocks = wp.data.select('core/block-editor').getBlocks(clientId);
                const newCellBlocks = [];
                
                for (let colIndex = 0; colIndex < columns; colIndex++) {
                    newCellBlocks.push(
                        wp.blocks.createBlock('fev-metzingen/table-cell', {
                            placeholder: __('Add blocks here...', 'fev-metzingen')
                        })
                    );
                }
                
                const newRowBlock = wp.blocks.createBlock('fev-metzingen/table-row', {}, newCellBlocks);
                
                wp.data.dispatch('core/block-editor').insertBlocks([newRowBlock], existingBlocks.length, clientId);
            };

            const removeRow = () => {
                if (rows <= 1) return;
                const newRows = rows - 1;
                setAttributes({ rows: newRows });
                
                // Remove the last row block
                const existingBlocks = wp.data.select('core/block-editor').getBlocks(clientId);
                if (existingBlocks.length > 0) {
                    const lastBlock = existingBlocks[existingBlocks.length - 1];
                    wp.data.dispatch('core/block-editor').removeBlock(lastBlock.clientId);
                }
            };

            const addColumn = () => {
                const newColumns = columns + 1;
                const newHeaderData = [...headerData, `Header ${newColumns}`];
                setAttributes({ 
                    columns: newColumns,
                    headerData: newHeaderData 
                });
                
                // Add a cell to each existing row
                const existingBlocks = wp.data.select('core/block-editor').getBlocks(clientId);
                existingBlocks.forEach(rowBlock => {
                    if (rowBlock.name === 'fev-metzingen/table-row') {
                        const newCellBlock = wp.blocks.createBlock('fev-metzingen/table-cell', {
                            placeholder: __('Add blocks here...', 'fev-metzingen')
                        });
                        
                        wp.data.dispatch('core/block-editor').insertBlocks(
                            [newCellBlock], 
                            rowBlock.innerBlocks.length, 
                            rowBlock.clientId
                        );
                    }
                });
            };

            const removeColumn = () => {
                if (columns <= 1) return;
                const newColumns = columns - 1;
                const newHeaderData = [...headerData];
                newHeaderData.pop();
                setAttributes({ 
                    columns: newColumns,
                    headerData: newHeaderData 
                });
                
                // Remove the last cell from each row
                const existingBlocks = wp.data.select('core/block-editor').getBlocks(clientId);
                existingBlocks.forEach(rowBlock => {
                    if (rowBlock.name === 'fev-metzingen/table-row' && rowBlock.innerBlocks.length > 0) {
                        const lastCell = rowBlock.innerBlocks[rowBlock.innerBlocks.length - 1];
                        wp.data.dispatch('core/block-editor').removeBlock(lastCell.clientId);
                    }
                });
            };

            // Generate simplified template - one InnerBlocks area per cell
            const generateTableTemplate = () => {
                const template = [];
                
                for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
                    const rowCells = [];
                    
                    for (let colIndex = 0; colIndex < columns; colIndex++) {
                        rowCells.push([
                            'fev-metzingen/table-cell',
                            {
                                placeholder: __('Add blocks here...', 'fev-metzingen')
                            }
                        ]);
                    }
                    
                    template.push([
                        'fev-metzingen/table-row',
                        {},
                        rowCells
                    ]);
                }
                
                return template;
            };

            // Generate actual block instances (for dynamic updates)
            const generateTableBlocks = (numRows, numColumns) => {
                const blocks = [];
                
                for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
                    const cellBlocks = [];
                    
                    for (let colIndex = 0; colIndex < numColumns; colIndex++) {
                        cellBlocks.push(
                            wp.blocks.createBlock('fev-metzingen/table-cell', {
                                placeholder: __('Add blocks here...', 'fev-metzingen')
                            })
                        );
                    }
                    
                    blocks.push(
                        wp.blocks.createBlock('fev-metzingen/table-row', {}, cellBlocks)
                    );
                }
                
                return blocks;
            };

            return el(Fragment, {},
                el(InspectorControls, {},
                    el(PanelBody, { title: __('Table Settings', 'fev-metzingen') },
                        el(SelectControl, {
                            label: __('Table Style', 'fev-metzingen'),
                            value: tableStyle,
                            options: [
                                { label: __('Default', 'fev-metzingen'), value: 'default' },
                                { label: __('Divider', 'fev-metzingen'), value: 'divider' },
                                { label: __('Striped', 'fev-metzingen'), value: 'striped' }
                            ],
                            onChange: (value) => setAttributes({ tableStyle: value })
                        }),
                        el(ToggleControl, {
                            label: __('Has Header Row', 'fev-metzingen'),
                            checked: hasHeader,
                            onChange: (value) => setAttributes({ hasHeader: value })
                        }),
                        el(ToggleControl, {
                            label: __('Hover Effect', 'fev-metzingen'),
                            checked: hover,
                            onChange: (value) => setAttributes({ hover: value })
                        }),
                        el(ToggleControl, {
                            label: __('Small Size', 'fev-metzingen'),
                            checked: small,
                            onChange: (value) => setAttributes({ small: value })
                        }),
                        el(ToggleControl, {
                            label: __('Responsive', 'fev-metzingen'),
                            checked: responsive,
                            onChange: (value) => setAttributes({ responsive: value })
                        })
                    ),
                    el(PanelBody, { title: __('Table Structure', 'fev-metzingen') },
                        el('div', { className: 'table-structure-controls' },
                            el('p', {}, __('Rows:', 'fev-metzingen') + ' ' + rows),
                            el(ButtonGroup, {},
                                el(Button, {
                                    variant: 'secondary',
                                    onClick: removeRow,
                                    disabled: rows <= 1
                                }, __('Remove Row', 'fev-metzingen')),
                                el(Button, {
                                    variant: 'primary',
                                    onClick: addRow
                                }, __('Add Row', 'fev-metzingen'))
                            ),
                            el('p', { style: { marginTop: '16px' } }, __('Columns:', 'fev-metzingen') + ' ' + columns),
                            el(ButtonGroup, {},
                                el(Button, {
                                    variant: 'secondary',
                                    onClick: removeColumn,
                                    disabled: columns <= 1
                                }, __('Remove Column', 'fev-metzingen')),
                                el(Button, {
                                    variant: 'primary',
                                    onClick: addColumn
                                }, __('Add Column', 'fev-metzingen'))
                            )
                        )
                    )
                ),
                el('div', { className: 'fev-table-editor' },
                    hasHeader && el('div', { className: 'table-header' },
                        el('div', { 
                            className: 'table-header-row',
                            style: { display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)` }
                        },
                            headerData.map((headerText, index) =>
                                el('div', { 
                                    key: index,
                                    className: 'table-header-cell'
                                },
                                    el(RichText, {
                                        tagName: 'div',
                                        value: headerText,
                                        onChange: (value) => updateHeaderCell(index, value),
                                        placeholder: `Header ${index + 1}`,
                                        allowedFormats: ['core/bold', 'core/italic']
                                    })
                                )
                            )
                        )
                    ),
                    el('div', { className: 'table-body' },
                        el(InnerBlocks, {
                            template: generateTableTemplate(),
                            templateLock: false,
                            allowedBlocks: ['fev-metzingen/table-row'],
                            renderAppender: false
                        })
                    )
                )
            );
        },

        save: function(props) {
            const { attributes } = props;
            const { tableStyle, hover, small, responsive, hasHeader, columns, headerData } = attributes;

            let tableClasses = ['uk-table'];
            if (tableStyle !== 'default') tableClasses.push(`uk-table-${tableStyle}`);
            if (hover) tableClasses.push('uk-table-hover');
            if (small) tableClasses.push('uk-table-small');

            let wrapperClasses = ['fev-table-block-frontend'];
            if (responsive) wrapperClasses.push('uk-overflow-auto');

            return el('div', { 
                className: wrapperClasses.join(' '),
                'data-columns': columns,
                'data-table-style': tableStyle
            },
                el('table', { className: tableClasses.join(' ') },
                    hasHeader && el('thead', {},
                        el('tr', {},
                            headerData.map((headerText, index) =>
                                el('th', { 
                                    key: index
                                }, headerText)
                            )
                        )
                    ),
                    el('tbody', { className: 'table-body-content' },
                        el(InnerBlocks.Content)
                    )
                )
            );
        }
    });

    // Register Table Row Block (Helper Block)
    registerBlockType('fev-metzingen/table-row', {
        title: __('Table Row', 'fev-metzingen'),
        icon: 'editor-insertmore',
        category: 'layout',
        parent: ['fev-metzingen/table'],
        supports: {
            inserter: false // Don't show in inserter - only used within table
        },

        edit: function(props) {
            const { attributes } = props;
            
            // Get parent table's columns for proper grid layout
            const parentBlock = wp.data.select('core/block-editor').getBlockParents(props.clientId).find(id => {
                const block = wp.data.select('core/block-editor').getBlock(id);
                return block && block.name === 'fev-metzingen/table';
            });
            
            let columns = 3; // default
            if (parentBlock) {
                const tableBlock = wp.data.select('core/block-editor').getBlock(parentBlock);
                if (tableBlock && tableBlock.attributes.columns) {
                    columns = tableBlock.attributes.columns;
                }
            }
            
            return el('div', { 
                className: 'table-row-editor',
                style: { 
                    display: 'grid',
                    gridTemplateColumns: `repeat(${columns}, 1fr)`,
                    gap: '0px',
                    width: '100%'
                }
            },
                el(InnerBlocks, {
                    allowedBlocks: ['fev-metzingen/table-cell'],
                    templateLock: false,
                    renderAppender: false,
                    orientation: 'horizontal'
                })
            );
        },

        save: function(props) {
            return el('tr', { className: 'table-row-content' },
                el(InnerBlocks.Content)
            );
        }
    });

    // Register Table Cell Block (Helper Block)
    registerBlockType('fev-metzingen/table-cell', {
        title: __('Table Cell', 'fev-metzingen'),
        icon: 'editor-table',
        category: 'layout',
        parent: ['fev-metzingen/table-row'],
        supports: {
            inserter: false // Don't show in inserter - only used within table row
        },

        edit: function(props) {
            return el('div', { className: 'table-cell-editor' },
                el(InnerBlocks, {
                    templateLock: false,
                    // Allow all blocks including your custom button block
                    allowedBlocks: [
                        'core/paragraph',
                        'core/heading', 
                        'core/image',
                        'core/list',
                        'core/button',
                        'core/buttons',
                        'fev-metzingen/button', // Your custom button block
                        'core/group',
                        'core/columns'
                    ]
                })
            );
        },

        save: function(props) {
            return el('td', { className: 'table-cell-content' },
                el(InnerBlocks.Content)
            );
        }
    });
})();
