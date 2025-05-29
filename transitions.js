// Handle page transitions
document.addEventListener('DOMContentLoaded', () => {
    // Add transition class to body when page loads
    document.body.classList.add('page-transition');
    
    // Remove transition class after a short delay
    setTimeout(() => {
        document.body.classList.remove('page-transition');
    }, 100);

    // Handle all internal links
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link && link.href && link.href.startsWith(window.location.origin)) {
            e.preventDefault();
            const href = link.href;
            const isBackNavigation = href.includes('index.html') || href === window.location.origin + '/';

            // Add transition classes
            document.body.classList.add('page-transitioning');
            const glassCard = document.querySelector('.glass-card');
            const background = document.querySelector('.background');
            
            if (glassCard) {
                glassCard.classList.add(isBackNavigation ? 'page-transition-back' : 'page-transition');
            }
            if (background) {
                background.classList.add(isBackNavigation ? 'page-transition-back' : 'page-transition');
            }

            // Navigate after transition
            setTimeout(() => {
                window.location.href = href;
            }, 500);
        }
    });

    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => {
        document.body.classList.add('page-transitioning');
        const glassCard = document.querySelector('.glass-card');
        const background = document.querySelector('.background');
        
        if (glassCard) {
            glassCard.classList.add('page-transition-back');
        }
        if (background) {
            background.classList.add('page-transition-back');
        }
    });
}); 