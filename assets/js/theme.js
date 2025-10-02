// This file is part of the FEV Metzingen theme for WordPress.
// It contains JavaScript for handling the drop-down navigation toggle animation.

document.addEventListener('DOMContentLoaded', function() {
    const nav = document.body;
    nav.addEventListener('click', function(e){
        const btn = e.target.closest('.uk-dropnav-toggle');
        if(!btn) return;
        e.stopPropagation();
        btn.classList.toggle('uk-dropnav-toggle-animate');
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    });
});
