// Smooth page transitions for a better user experience
document.addEventListener('DOMContentLoaded', () => {
    // Fade in the page when it first loads
    document.body.classList.add('page-transition');
    
    // Remove the fade-in effect after it's done
    setTimeout(() => {
        document.body.classList.remove('page-transition');
    }, 100);

    // Handle clicks on internal links (links within our site)
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link && link.href && link.href.startsWith(window.location.origin)) {
            e.preventDefault();
            const href = link.href;
            // Check if we're going back to the home page
            const isBackNavigation = href.includes('index.html') || href === window.location.origin + '/';

            // Start the transition animation
            document.body.classList.add('page-transitioning');
            const glassCard = document.querySelector('.glass-card');
            const background = document.querySelector('.background');
            
            // Apply different animations for going back vs going forward
            if (glassCard) {
                glassCard.classList.add(isBackNavigation ? 'page-transition-back' : 'page-transition');
            }
            if (background) {
                background.classList.add(isBackNavigation ? 'page-transition-back' : 'page-transition');
            }

            // Wait for the animation to finish before changing pages
            setTimeout(() => {
                window.location.href = href;
            }, 500);
        }
    });

    // Handle browser back/forward buttons with the same smooth transitions
    window.addEventListener('popstate', () => {
        document.body.classList.add('page-transitioning');
        const glassCard = document.querySelector('.glass-card');
        const background = document.querySelector('.background');
        
        // Always use the "back" animation when using browser navigation
        if (glassCard) {
            glassCard.classList.add('page-transition-back');
        }
        if (background) {
            background.classList.add('page-transition-back');
        }
    });
}); 