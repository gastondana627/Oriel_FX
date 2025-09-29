// --- CONFIGURATION PANEL ---
// Developers can edit these values to customize the visualizer.

const config = {
    // Shape & Size
    shape: 'cube', // Options: 'cube', 'sphere', 'icosahedron'
    size: 2,

    // Colors
    baseColor: 0xffffff,       // Default wireframe color (white)
    glowColor: 0x8309D5,       // Color it shifts to with treble (purple)
    backgroundColor: 0x111111, // A fallback scene background color

    // Animation
    rotationSpeed: 0.1,
    pulseIntensity: 1.5, // How much the shape scales with the bass

    // Audio Reactivity
    // Lower numbers = more sensitive. Use values from 0-100.
    bassSensitivity: 2, // Which frequency bin to check for bass
    trebleSensitivity: 50 // Which frequency bin to check for treble
};

// ... the rest of your Three.js code will now use these variables
// For example: const geometry = new THREE.BoxGeometry(config.size, config.size, config.size);