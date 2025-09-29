document.addEventListener('DOMContentLoaded', () => {
    const playPauseButton = document.getElementById('play-pause-button');
    const audioElement = document.getElementById('background-music');
    let audioContext;
    let audioInitialized = false;

    window.togglePlayPause = function() {
        if (!audioInitialized) {
            audioContext = initAudio();
            audioInitialized = true;
        }
        if (audioContext.state === 'suspended') {
            audioContext.resume();
            audioElement.play();
            playPauseButton.textContent = "Pause";
            if (window.setAnimationPaused) window.setAnimationPaused(false);
        } else {
            audioContext.suspend();
            audioElement.pause();
            playPauseButton.textContent = "Play";
            if (window.setAnimationPaused) window.setAnimationPaused(true);
        }
    }
    playPauseButton.addEventListener('click', window.togglePlayPause);

    const glowColorInput = document.getElementById('glowColor');
    const pulseInput = document.getElementById('pulse');
    const downloadButton = document.getElementById('download-button');

    glowColorInput.addEventListener('input', (event) => {
        if (window.config) {
            window.config.glowColor = parseInt(event.target.value.replace('#', '0x'));
            downloadButton.style.backgroundColor = event.target.value;
        }
    });

    pulseInput.addEventListener('input', (event) => {
        if (window.config) {
            window.config.pulseIntensity = parseFloat(event.target.value);
        }
    });

    const shapeButtons = document.querySelectorAll('.shape-btn');
    shapeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const shapeName = button.getAttribute('data-shape');
            if (window.config && window.recreateShape) {
                window.config.shape = shapeName;
                window.recreateShape();
            }
        });
    });
});