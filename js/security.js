// Security measures to prevent developer tools access
(function() {
    // Store the original console methods
    const originalConsole = {
        log: console.log,
        info: console.info,
        warn: console.warn,
        error: console.error,
        debug: console.debug
    };

    // Disable console methods
    function disableConsole() {
        console.log = function() {};
        console.info = function() {};
        console.warn = function() {};
        console.error = function() {};
        console.debug = function() {};
    }

    // Re-enable console methods (for debugging purposes)
    function enableConsole() {
        console.log = originalConsole.log;
        console.info = originalConsole.info;
        console.warn = originalConsole.warn;
        console.error = originalConsole.error;
        console.debug = originalConsole.debug;
    }

    // Check for dev tools
    function checkDevTools() {
        const threshold = 160;
        const widthThreshold = window.outerWidth - window.innerWidth > threshold;
        const heightThreshold = window.outerHeight - window.innerHeight > threshold;
        
        if (widthThreshold || heightThreshold) {
            disableConsole();
            document.body.innerHTML = '<div style="text-align: center; padding: 20px;"><h1>Access Denied</h1><p>Developer tools are not allowed on this site.</p></div>';
        }
    }

    // Monitor for dev tools shortcuts
    document.addEventListener('keydown', function(e) {
        // Check for common dev tools shortcuts
        if (
            // F12
            e.keyCode === 123 ||
            // Ctrl+Shift+I
            (e.ctrlKey && e.shiftKey && e.keyCode === 73) ||
            // Ctrl+Shift+J
            (e.ctrlKey && e.shiftKey && e.keyCode === 74) ||
            // Ctrl+Shift+C
            (e.ctrlKey && e.shiftKey && e.keyCode === 67) ||
            // Ctrl+U (View Source)
            (e.ctrlKey && e.keyCode === 85)
        ) {
            e.preventDefault();
            disableConsole();
            checkDevTools();
        }
    });

    // Monitor window resize (dev tools often change window size)
    let lastWidth = window.innerWidth;
    let lastHeight = window.innerHeight;

    window.addEventListener('resize', function() {
        if (
            Math.abs(window.innerWidth - lastWidth) > 100 ||
            Math.abs(window.innerHeight - lastHeight) > 100
        ) {
            checkDevTools();
        }
        lastWidth = window.innerWidth;
        lastHeight = window.innerHeight;
    });

    // Disable right-click
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
    });

    // Disable text selection
    document.addEventListener('selectstart', function(e) {
        e.preventDefault();
    });

    // Disable drag and drop
    document.addEventListener('dragstart', function(e) {
        e.preventDefault();
    });

    // Monitor for dev tools opening
    setInterval(checkDevTools, 1000);

    // Initial check
    checkDevTools();
})(); 