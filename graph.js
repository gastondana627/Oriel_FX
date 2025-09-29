// --- CONFIGURATION PANEL ---
window.config = {
    shape: 'cube',
    size: 2,
    baseColor: 0xffffff,
    glowColor: 0x8309D5,
    rotationSpeed: 0.1,
    pulseIntensity: 1.5,
    bassFrequency: 2,
    trebleFrequency: 50
};

// --- 1. SETUP ---
const container = document.getElementById('graph-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 10;
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);
const clock = new THREE.Clock();
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// --- 2. PAUSED STATE ---
let isAnimationPaused = false;
window.setAnimationPaused = function(pausedState) {
    isAnimationPaused = pausedState;
}

// --- 3. AUDIO ANALYSIS SETUP ---
let analyser;
let dataArray;
function initAudio() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const audioElement = document.getElementById('background-music');
    const source = audioContext.createMediaElementSource(audioElement);
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    return audioContext;
}

// --- 4. CREATE THE OBJECT & MATERIALS ---
let shape; // Make shape a global variable so it can be recreated
const material = new THREE.MeshBasicMaterial({ color: config.baseColor, wireframe: true });
const baseColor = new THREE.Color(config.baseColor);
const glowColor = new THREE.Color(config.glowColor);

// This new function handles creating and swapping shapes
window.recreateShape = function() {
    if (shape) {
        scene.remove(shape); // Remove the old shape
    }
    let geometry;
    switch (config.shape) {
        case 'sphere':
            geometry = new THREE.SphereGeometry(config.size / 1.5, 32, 16);
            break;
        case 'icosahedron':
            geometry = new THREE.IcosahedronGeometry(config.size / 1.5);
            break;
        case 'cube':
        default:
            geometry = new THREE.BoxGeometry(config.size, config.size, config.size);
            break;
    }
    shape = new THREE.Mesh(geometry, material); // Assign the new mesh to the global variable
    scene.add(shape); // Add the new shape to the scene
}
recreateShape(); // Create the initial shape when the script loads

// --- 5. ANIMATE ---
function animate() {
    requestAnimationFrame(animate);
    if (isAnimationPaused) return;

    const elapsedTime = clock.getElapsedTime();
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(shape);
    let isHovering = intersects.length > 0;

    if (analyser) {
        analyser.getByteFrequencyData(dataArray);

        const bassValue = (dataArray[config.bassFrequency] + dataArray[config.bassFrequency + 1]) / 2 / 255;
        let bassScale = 1 + bassValue * config.pulseIntensity;
        if (isHovering) {
            bassScale *= 1.2;
        }
        shape.scale.set(bassScale, bassScale, bassScale);

        glowColor.set(config.glowColor); // Update the glow color from the config
        const trebleValue = (dataArray[config.trebleFrequency] + dataArray[config.trebleFrequency + 1]) / 2 / 255;
        material.color.copy(baseColor).lerp(glowColor, trebleValue);
    }

    shape.rotation.x = elapsedTime * config.rotationSpeed;
    shape.rotation.y = elapsedTime * config.rotationSpeed * 1.5;
    renderer.render(scene, camera);
}
animate();

// --- 6. EVENT LISTENERS ---
window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

window.addEventListener('click', () => {
    if (raycaster.intersectObject(shape).length > 0) {
        if (window.togglePlayPause) {
            window.togglePlayPause();
        }
    }
});