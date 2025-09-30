document.addEventListener('DOMContentLoaded', function() {
    const cardBlocks = document.querySelectorAll('.fev-cards-block');
    
    cardBlocks.forEach(function(block) {
        const columns = block.querySelectorAll('.wp-block-column');
        
        if (columns.length >= 3) {
            // Card 1
            const card1Icon = block.getAttribute('data-card1-icon');
            const card1Url = block.getAttribute('data-card1-url');
            processCard(columns[0], card1Icon, card1Url);
            
            // Card 2
            const card2Icon = block.getAttribute('data-card2-icon');
            const card2Url = block.getAttribute('data-card2-url');
            processCard(columns[1], card2Icon, card2Url);
            
            // Card 3
            const card3Icon = block.getAttribute('data-card3-icon');
            const card3Url = block.getAttribute('data-card3-url');
            processCard(columns[2], card3Icon, card3Url);
        }
    });
    
    function processCard(column, icon, url) {
        // Add UIkit card classes to column
        column.classList.add('uk-card', 'uk-card-default', 'uk-card-body');

        // Collect all child elements
        const children = Array.from(column.children);

        // Add icon if specified
        if (icon && icon !== '') {
            const iconContainer = document.createElement('div');
            iconContainer.className = 'card-icon-container';
            iconContainer.style.textAlign = 'center';
            iconContainer.style.marginBottom = '15px';

            const iconSpan = document.createElement('span');
            iconSpan.setAttribute('uk-icon', 'icon: ' + icon + '; ratio: 2');
            iconSpan.className = 'uk-text-emphasis';

            iconContainer.appendChild(iconSpan);
            children.unshift(iconContainer); // Add icon at the beginning
        }

        // Empty the column
        column.innerHTML = '';

        // Build the correct structure
        if (url && url !== '') {
            // With link: .uk-card > .fev-card-link > .fev-card-content
            const link = document.createElement('a');
            link.href = url;
            link.className = 'fev-card-link';

            const contentWrapper = document.createElement('div');
            contentWrapper.className = 'fev-card-content';

            children.forEach(child => contentWrapper.appendChild(child));
            link.appendChild(contentWrapper);
            column.appendChild(link);
        } else {
            // Without link: .uk-card > .fev-card-content
            const contentWrapper = document.createElement('div');
            contentWrapper.className = 'fev-card-content';

            children.forEach(child => contentWrapper.appendChild(child));
            column.appendChild(contentWrapper);
        }
    }
});
