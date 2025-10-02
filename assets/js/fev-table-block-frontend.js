// FeV Table Block - Frontend Processing
(function() {
    'use strict';

    // Initialize table processing when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        processBlockBasedTables();
    });

    function processBlockBasedTables() {
        const tableBlocks = document.querySelectorAll('.fev-table-block-frontend');
        
        tableBlocks.forEach(function(tableBlock) {
            const columns = parseInt(tableBlock.getAttribute('data-columns')) || 3;
            const tableStyle = tableBlock.getAttribute('data-table-style') || 'default';
            
            // Process the table structure
            processTableStructure(tableBlock, columns, tableStyle);
            
            // Add responsive behavior
            addResponsiveBehavior(tableBlock);
            
            // Add hover effects if specified
            if (tableBlock.querySelector('.uk-table-hover')) {
                addHoverEffects(tableBlock);
            }
        });
    }

    function processTableStructure(tableBlock, columns, tableStyle) {
        const tbody = tableBlock.querySelector('.table-body-content');
        if (!tbody) return;

        // Find all group blocks that represent rows
        const rowBlocks = tbody.querySelectorAll('.wp-block-group.table-row');
        
        rowBlocks.forEach(function(rowBlock, rowIndex) {
            // Add row styling based on table style
            if (tableStyle === 'striped' && rowIndex % 2 === 1) {
                rowBlock.classList.add('striped-row');
            }
            
            // Process cell blocks within each row
            const cellBlocks = rowBlock.querySelectorAll('.wp-block-group.table-cell-content');
            cellBlocks.forEach(function(cellBlock, cellIndex) {
                // Add cell identifiers for styling
                cellBlock.setAttribute('data-column', cellIndex);
                cellBlock.setAttribute('data-row', rowIndex);
                
                // Process content within cells
                processCellContent(cellBlock);
            });
        });
    }

    function processCellContent(cellBlock) {
        // Ensure proper spacing for multiple blocks in cells
        const blocks = cellBlock.querySelectorAll('.wp-block');
        blocks.forEach(function(block, index) {
            if (index > 0) {
                block.style.marginTop = '8px';
            }
        });

        // Handle empty cells
        if (cellBlock.children.length === 0) {
            cellBlock.innerHTML = '<p>&nbsp;</p>';
        }
    }

    function addResponsiveBehavior(tableBlock) {
        // Add touch scrolling for mobile
        if (window.innerWidth <= 768) {
            tableBlock.style.overflowX = 'auto';
            tableBlock.style.webkitOverflowScrolling = 'touch';
        }

        // Listen for window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth <= 768) {
                tableBlock.style.overflowX = 'auto';
                tableBlock.style.webkitOverflowScrolling = 'touch';
            } else {
                tableBlock.style.overflowX = '';
                tableBlock.style.webkitOverflowScrolling = '';
            }
        });
    }

    function addHoverEffects(tableBlock) {
        const rowBlocks = tableBlock.querySelectorAll('.wp-block-group.table-row');
        
        rowBlocks.forEach(function(rowBlock) {
            rowBlock.addEventListener('mouseenter', function() {
                rowBlock.classList.add('hover-active');
            });
            
            rowBlock.addEventListener('mouseleave', function() {
                rowBlock.classList.remove('hover-active');
            });
        });
    }

    // Utility function to convert block-based table to standard HTML table (if needed)
    function convertToHtmlTable(tableBlock) {
        const columns = parseInt(tableBlock.getAttribute('data-columns')) || 3;
        const hasHeader = tableBlock.querySelector('thead') !== null;
        const tbody = tableBlock.querySelector('.table-body-content');
        
        if (!tbody) return;

        // Create standard HTML table structure
        const table = document.createElement('table');
        table.className = tableBlock.querySelector('table').className;
        
        // Copy header if exists
        if (hasHeader) {
            const thead = tableBlock.querySelector('thead').cloneNode(true);
            table.appendChild(thead);
        }
        
        // Convert block rows to table rows
        const newTbody = document.createElement('tbody');
        const rowBlocks = tbody.querySelectorAll('.wp-block-group.table-row');
        
        rowBlocks.forEach(function(rowBlock) {
            const tr = document.createElement('tr');
            const cellBlocks = rowBlock.querySelectorAll('.wp-block-group.table-cell-content');
            
            cellBlocks.forEach(function(cellBlock) {
                const td = document.createElement('td');
                td.innerHTML = cellBlock.innerHTML;
                tr.appendChild(td);
            });
            
            newTbody.appendChild(tr);
        });
        
        table.appendChild(newTbody);
        
        // Replace the original table
        const originalTable = tableBlock.querySelector('table');
        originalTable.parentNode.replaceChild(table, originalTable);
    }

    // Export functions for potential external use
    window.FeVTableBlock = {
        processBlockBasedTables: processBlockBasedTables,
        convertToHtmlTable: convertToHtmlTable
    };

})();
