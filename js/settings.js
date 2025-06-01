// Settings management for the portfolio
document.addEventListener('DOMContentLoaded', function() {
    // Determine base path based on current page
    const isMainPage = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/');
    const basePath = isMainPage ? '' : '../';

    // Default values for all settings
    const defaultVolume = 0.2;
    const defaultBackground = 'background.png';
    const defaultTransparency = 85;
    const defaultAudio = 'background.wav';
    const defaultTheme = 'default';
    const defaultAnimations = true;

    // Grab all the elements we need to work with
    const audio = document.getElementById('backgroundMusic');
    const volumeSlider = document.getElementById('volume');
    const muteBtn = document.getElementById('muteBtn');
    const bgOptions = document.querySelectorAll('.bg-option');
    const backgroundDiv = document.querySelector('.background');
    const glassCard = document.querySelector('.glass-card');
    const transparencySlider = document.getElementById('cardTransparency');
    const audioSelect = document.getElementById('audioSelect');
    const themeOptions = document.querySelectorAll('.theme-option');
    const notification = document.querySelector('.settings-notification');
    const animationControl = document.querySelector('.animation-control');

    let isMuted = false;
    let notificationTimeout;

    // Function to show settings notification
    function showNotification(message) {
        // Clear any existing timeout
        if (notificationTimeout) {
            clearTimeout(notificationTimeout);
        }

        // Update message and show notification
        notification.querySelector('.message').textContent = message;
        notification.classList.add('show');

        // Hide notification after 3 seconds
        notificationTimeout = setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    // Function to toggle animations
    function toggleAnimations(enabled) {
        if (enabled) {
            document.body.classList.remove('no-animations');
            if (animationControl) {
                animationControl.classList.remove('active');
            }
            // Re-enable particles
            if (window.pJSDom && window.pJSDom[0] && window.pJSDom[0].pJS) {
                window.pJSDom[0].pJS.fn.particlesStart();
            }
            // Re-enable any other dynamic elements
            document.querySelectorAll('.skill-progress').forEach(progress => {
                progress.style.animation = '';
            });
        } else {
            document.body.classList.add('no-animations');
            if (animationControl) {
                animationControl.classList.add('active');
            }
            // Disable particles
            if (window.pJSDom && window.pJSDom[0] && window.pJSDom[0].pJS) {
                window.pJSDom[0].pJS.fn.particlesStop();
            }
            // Disable any other dynamic elements
            document.querySelectorAll('.skill-progress').forEach(progress => {
                progress.style.animation = 'none';
            });
        }
        localStorage.setItem('animations', enabled);
    }

    // Initialize animation state on page load
    function initializeAnimationState() {
        const savedAnimations = localStorage.getItem('animations');
        if (savedAnimations !== null) {
            const animationsEnabled = savedAnimations === 'true';
            toggleAnimations(animationsEnabled);
        } else {
            toggleAnimations(defaultAnimations);
        }
    }

    // Load saved preferences
    function loadPreferences() {
        // Load background image preference
        const savedBackground = localStorage.getItem('backgroundImage');
        if (savedBackground) {
            backgroundDiv.style.backgroundImage = `url('${basePath}images/${savedBackground}')`;
        } else {
            backgroundDiv.style.backgroundImage = `url('${basePath}images/${defaultBackground}')`;
            document.body.classList.remove('no-background-blur');
        }

        // Load transparency preference
        const savedTransparency = localStorage.getItem('cardTransparency');
        if (savedTransparency !== null) {
            const transparencyValue = parseInt(savedTransparency, 10);
            transparencySlider.value = transparencyValue;
            applyTransparency(transparencyValue);
        } else {
            transparencySlider.value = defaultTransparency;
            applyTransparency(defaultTransparency);
        }

        // Load audio preference
        const savedAudio = localStorage.getItem('backgroundAudio');
        if (savedAudio) {
            audioSelect.value = savedAudio;
            audio.src = `${basePath}sounds/${savedAudio}`;
        } else {
            audioSelect.value = defaultAudio;
            audio.src = `${basePath}sounds/${defaultAudio}`;
        }

        // Load theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.body.setAttribute('data-theme', savedTheme);
        } else {
            document.body.setAttribute('data-theme', defaultTheme);
        }

        // Initialize animation state
        initializeAnimationState();
    }

    // Update the glass card's transparency and glow effects
    function applyTransparency(value) {
        const alpha = value / 100;
        // Make the card more or less see-through
        glassCard.style.background = `linear-gradient(to bottom, rgba(41, 52, 98, ${alpha * 0.85}), rgba(13, 17, 38, ${alpha * 0.8}))`;
        // Adjust the glow effect to match
        glassCard.style.boxShadow = `0 8px 40px 0 rgba(0, 0, 0, ${alpha * 0.06}), 0 1.5px 8px 0 rgba(0,0,0,${alpha * 0.03}), 0 0 ${alpha * 30}px rgba(41, 52, 98, ${alpha * 0.15})`;
    }

    // Event Listeners
    if (volumeSlider) {
        volumeSlider.addEventListener('input', function() {
            audio.volume = this.value / 100;
            if (this.value == 0) {
                muteBtn.innerHTML = '<span class="icon">🔇</span>';
                isMuted = true;
            } else {
                muteBtn.innerHTML = '<span class="icon">🔊</span>';
                isMuted = false;
            }
            showNotification('Volume adjusted');
        });
    }

    if (muteBtn) {
        muteBtn.addEventListener('click', function() {
            if (isMuted) {
                audio.volume = volumeSlider.value / 100;
                this.innerHTML = '<span class="icon">🔊</span>';
                isMuted = false;
                showNotification('Sound unmuted');
            } else {
                audio.volume = 0;
                this.innerHTML = '<span class="icon">🔇</span>';
                isMuted = true;
                showNotification('Sound muted');
            }
        });
    }

    // Background image switcher
    bgOptions.forEach(button => {
        button.addEventListener('click', function() {
            const imageName = this.getAttribute('data-image');
            backgroundDiv.style.backgroundImage = `url('${basePath}images/${imageName}')`;
            localStorage.setItem('backgroundImage', imageName);
            showNotification('Background changed');
        });
    });

    // Transparency slider controls
    if (transparencySlider) {
        transparencySlider.addEventListener('input', function() {
            const transparencyValue = this.value;
            applyTransparency(transparencyValue);
            localStorage.setItem('cardTransparency', transparencyValue);
            showNotification('Transparency adjusted');
        });
    }

    // Music track switcher
    if (audioSelect) {
        audioSelect.addEventListener('change', function() {
            const selectedAudio = this.value;
            audio.src = `${basePath}sounds/${selectedAudio}`;
            audio.play();
            localStorage.setItem('backgroundAudio', selectedAudio);
            showNotification('Music track changed');
        });
    }

    // Theme switcher
    themeOptions.forEach(button => {
        button.addEventListener('click', function() {
            const selectedTheme = this.getAttribute('data-theme');
            document.body.setAttribute('data-theme', selectedTheme);
            localStorage.setItem('theme', selectedTheme);
            showNotification('Theme changed');
        });
    });

    // Animation toggle handler
    if (animationControl) {
        animationControl.addEventListener('click', function() {
            const currentlyEnabled = !document.body.classList.contains('no-animations');
            toggleAnimations(!currentlyEnabled);
            showNotification(currentlyEnabled ? 'Animations disabled' : 'Animations enabled');
        });
    }

    // Settings reset handler
    const resetBtn = document.getElementById('mainResetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            const resetChoice = prompt("Which settings would you like to reset?\nType 'Audio', 'Transparency', 'Theme', 'Animations', or 'All'.").toLowerCase();

            if (resetChoice === 'audio') {
                // Reset all audio-related settings
                audio.volume = defaultVolume;
                volumeSlider.value = defaultVolume * 100;
                muteBtn.innerHTML = '<span class="icon">🔊</span>';
                isMuted = false;
                sessionStorage.removeItem('audioTime');
                audio.currentTime = 0;
                audioSelect.value = defaultAudio;
                audio.src = `${basePath}sounds/${defaultAudio}`;
                localStorage.removeItem('backgroundAudio');
                showNotification('Audio settings reset');
            } else if (resetChoice === 'transparency') {
                // Reset transparency only
                transparencySlider.value = defaultTransparency;
                applyTransparency(defaultTransparency);
                localStorage.removeItem('cardTransparency');
                showNotification('Transparency settings reset');
            } else if (resetChoice === 'theme') {
                // Reset theme
                document.body.setAttribute('data-theme', defaultTheme);
                localStorage.removeItem('theme');
                showNotification('Theme settings reset');
            } else if (resetChoice === 'animations') {
                // Reset animations
                toggleAnimations(defaultAnimations);
                showNotification('Animation settings reset');
            } else if (resetChoice === 'all') {
                // Reset audio settings
                audio.volume = defaultVolume;
                volumeSlider.value = defaultVolume * 100;
                muteBtn.innerHTML = '<span class="icon">🔊</span>';
                isMuted = false;
                sessionStorage.removeItem('audioTime');
                audio.currentTime = 0;
                audioSelect.value = defaultAudio;
                audio.src = `${basePath}sounds/${defaultAudio}`;
                localStorage.removeItem('backgroundAudio');

                // Reset background image
                backgroundDiv.style.backgroundImage = `url('${basePath}images/${defaultBackground}')`;
                localStorage.removeItem('backgroundImage');
                document.body.classList.remove('no-background-blur');

                // Reset transparency
                transparencySlider.value = defaultTransparency;
                applyTransparency(defaultTransparency);
                localStorage.removeItem('cardTransparency');

                // Reset theme
                document.body.setAttribute('data-theme', defaultTheme);
                localStorage.removeItem('theme');

                // Reset animations
                toggleAnimations(defaultAnimations);
                localStorage.removeItem('animations');

                showNotification('All settings reset');
            } else {
                showNotification('No settings were reset');
            }
        });
    }

    // Load preferences when the page loads
    loadPreferences();

    // Initialize animation state immediately
    initializeAnimationState();
}); 