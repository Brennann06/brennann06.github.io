// Audio management for the portfolio
document.addEventListener('DOMContentLoaded', function() {
    const audio = document.getElementById('backgroundMusic');
    const backgroundDiv = document.querySelector('.background');
    
    // Determine base path based on current page
    const isMainPage = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/');
    const basePath = isMainPage ? '' : '../';
    
    // Load saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.setAttribute('data-theme', savedTheme);
    }
    
    // Load saved background image preference
    const savedBackground = localStorage.getItem('backgroundImage');
    if (savedBackground) {
        backgroundDiv.style.backgroundImage = `url('${basePath}images/${savedBackground}')`;
        if (savedBackground === 'background2.png') {
            backgroundDiv.classList.add('background2');
        } else {
            backgroundDiv.classList.remove('background2');
        }
    }
    
    // Load saved time if it exists
    const savedTime = sessionStorage.getItem('audioTime');
    if (savedTime) {
        audio.currentTime = parseFloat(savedTime);
    }
    
    function startAudio() {
        audio.volume = 0.2;
        let playPromise = audio.play();
        
        if (playPromise !== undefined) {
            playPromise.then(_ => {
                console.log("Audio started playing");
            })
            .catch(error => {
                console.log("Audio playback failed:", error);
                document.body.addEventListener('click', function playOnClick() {
                    audio.play();
                    document.body.removeEventListener('click', playOnClick);
                }, { once: true });
            });
        }
    }

    // Save time periodically
    setInterval(() => {
        sessionStorage.setItem('audioTime', audio.currentTime);
    }, 1000);

    startAudio();
    document.addEventListener('click', startAudio, { once: true });
    document.addEventListener('touchstart', startAudio, { once: true });
    document.addEventListener('keydown', startAudio, { once: true });
}); 