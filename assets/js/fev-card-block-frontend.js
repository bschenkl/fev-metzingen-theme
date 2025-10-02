// FeV Card Block - Frontend JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Enhanced accessibility for clickable cards
    const clickableCards = document.querySelectorAll('.fev-card-link');
    clickableCards.forEach(function(card) {
        // Add keyboard navigation
        card.setAttribute('tabindex', '0');
        
        // Handle keyboard interaction
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
        
        // Add focus styles
        card.addEventListener('focus', function() {
            this.style.outline = '2px solid #0073aa';
            this.style.outlineOffset = '2px';
        });
        
        card.addEventListener('blur', function() {
            this.style.outline = 'none';
        });
    });
});
