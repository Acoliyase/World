// main.js
// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB); // Sky blue

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 10);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth - 300, window.innerHeight);
document.getElementById('scene').appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 10, 5);
scene.add(directionalLight);

// Toon material for anime style
const toonMaterial = new THREE.MeshToonMaterial({ color: 0xff69b4 });

// Terrain with elevation (simple hills)
const terrainGeometry = new THREE.PlaneGeometry(40, 40, 20, 20);
terrainGeometry.rotateX(-Math.PI / 2);
const vertices = terrainGeometry.attributes.position.array;
for (let i = 0; i < vertices.length; i += 3) {
    const x = vertices[i];
    const z = vertices[i + 2];
    vertices[i + 1] = Math.sin(x * 0.1) * 2 + Math.cos(z * 0.1) * 1; // Simple elevation
}
terrainGeometry.computeVertexNormals();
const terrainMaterial = new THREE.MeshLambertMaterial({ color: 0x8FBC8F });
const terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);
scene.add(terrain);

// Ground (flat area around house)
const groundGeometry = new THREE.PlaneGeometry(20, 20);
const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x90EE90 });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.position.y = 0.01; // Slightly above terrain
scene.add(ground);

// House (simple box)
const houseGeometry = new THREE.BoxGeometry(4, 3, 4);
const houseMaterial = toonMaterial.clone();
houseMaterial.color.set(0xFFB6C1);
const house = new THREE.Mesh(houseGeometry, houseMaterial);
house.position.set(0, 1.5, 0);
scene.add(house);

// Trees
for (let i = 0; i < 5; i++) {
    const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.2, 3);
    const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.set((Math.random() - 0.5) * 30, 1.5, (Math.random() - 0.5) * 30);
    scene.add(trunk);

    const leavesGeometry = new THREE.SphereGeometry(1.5);
    const leavesMaterial = toonMaterial.clone();
    leavesMaterial.color.set(0x228B22);
    const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
    leaves.position.set(trunk.position.x, trunk.position.y + 2, trunk.position.z);
    scene.add(leaves);
}

// Bushes
for (let i = 0; i < 10; i++) {
    const bushGeometry = new THREE.SphereGeometry(0.5);
    const bushMaterial = toonMaterial.clone();
    bushMaterial.color.set(0x32CD32);
    const bush = new THREE.Mesh(bushGeometry, bushMaterial);
    bush.position.set((Math.random() - 0.5) * 20, 0.5, (Math.random() - 0.5) * 20);
    scene.add(bush);
}

// Crop plots (organized farming areas)
const plotSize = 5;
const plotSpacing = 6;
for (let x = -10; x <= 10; x += plotSpacing) {
    for (let z = -10; z <= 10; z += plotSpacing) {
        // Plot base
        const plotGeometry = new THREE.PlaneGeometry(plotSize, plotSize);
        const plotMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513, transparent: true, opacity: 0.5 });
        const plot = new THREE.Mesh(plotGeometry, plotMaterial);
        plot.rotation.x = -Math.PI / 2;
        plot.position.set(x, 0.02, z);
        scene.add(plot);

        // Crops in plot
        for (let cx = 0; cx < plotSize; cx += 1) {
            for (let cz = 0; cz < plotSize; cz += 1) {
                if (Math.random() > 0.7) {
                    const cropGeometry = new THREE.BoxGeometry(0.2, 0.5, 0.2);
                    const cropMaterial = toonMaterial.clone();
                    cropMaterial.color.set(0xFFD700);
                    const crop = new THREE.Mesh(cropGeometry, cropMaterial);
                    crop.position.set(x + cx - plotSize/2 + 0.5, 0.25, z + cz - plotSize/2 + 0.5);
                    scene.add(crop);
                }
            }
        }
    }
}

// Avatar (small sphere)
const avatarGeometry = new THREE.SphereGeometry(0.5);
const avatarMaterial = toonMaterial.clone();
avatarMaterial.color.set(0xFFD700);
const avatar = new THREE.Mesh(avatarGeometry, avatarMaterial);
avatar.position.set(2, 0.5, 2);
scene.add(avatar);

// Basic objects array
let objects = [];

// Learning logs
const logContent = document.getElementById('log-content');
function log(message) {
    logContent.innerHTML += '<p>' + message + '</p>';
    logContent.scrollTop = logContent.scrollHeight;
}

// Simulate learning with simple logic
let learningAttempts = 0;
let successes = 0;

function simulateLearning() {
    learningAttempts++;
    // Random item type
    const itemTypes = ['furniture', 'wall', 'crop', 'bush', 'tree'];
    const itemType = itemTypes[Math.floor(Math.random() * itemTypes.length)];
    const x = (Math.random() - 0.5) * 30;
    const z = (Math.random() - 0.5) * 30;
    const y = 0.5;

    // Check if position is free (simple collision)
    let collision = false;
    objects.forEach(obj => {
        if (Math.abs(obj.position.x - x) < 1 && Math.abs(obj.position.z - z) < 1) {
            collision = true;
        }
    });

    // For crops, prefer plot areas (simple heuristic)
    let inPlot = false;
    if (itemType === 'crop') {
        // Check if near a plot (simplified)
        inPlot = Math.abs(x % 6) < 3 && Math.abs(z % 6) < 3;
    }

    if (!collision && (itemType !== 'crop' || inPlot)) {
        // Place item
        let geometry, material, mesh;
        if (itemType === 'furniture') {
            geometry = new THREE.BoxGeometry(1, 1, 1);
            material = toonMaterial.clone();
            material.color.set(Math.random() * 0xffffff);
        } else if (itemType === 'wall') {
            geometry = new THREE.BoxGeometry(0.1, 2, 2);
            material = toonMaterial.clone();
            material.color.set(0x8B4513);
        } else if (itemType === 'crop') {
            geometry = new THREE.BoxGeometry(0.2, 0.5, 0.2);
            material = toonMaterial.clone();
            material.color.set(0xFFD700);
        } else if (itemType === 'bush') {
            geometry = new THREE.SphereGeometry(0.5);
            material = toonMaterial.clone();
            material.color.set(0x32CD32);
        } else if (itemType === 'tree') {
            // Simple tree
            geometry = new THREE.CylinderGeometry(0.2, 0.2, 3);
            material = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
            mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(x, y + 1.5, z);
            scene.add(mesh);
            objects.push(mesh);

            const leavesGeom = new THREE.SphereGeometry(1.5);
            const leavesMat = toonMaterial.clone();
            leavesMat.color.set(0x228B22);
            const leaves = new THREE.Mesh(leavesGeom, leavesMat);
            leaves.position.set(x, y + 3, z);
            scene.add(leaves);
            objects.push(leaves);
            successes++;
            log(`Success: Placed tree at (${x.toFixed(1)}, ${z.toFixed(1)}). Success rate: ${(successes / learningAttempts * 100).toFixed(1)}%`);
            return;
        }
        mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, z);
        scene.add(mesh);
        objects.push(mesh);
        successes++;
        const extra = itemType === 'crop' && inPlot ? ' (in plot)' : '';
        log(`Success: Placed ${itemType} at (${x.toFixed(1)}, ${z.toFixed(1)})${extra}. Success rate: ${(successes / learningAttempts * 100).toFixed(1)}%`);
    } else {
        const reason = collision ? 'collision' : 'not in suitable area';
        log(`Failure: ${reason} for ${itemType} at (${x.toFixed(1)}, ${z.toFixed(1)}). Attempt ${learningAttempts}`);
    }
}

// Controls
document.getElementById('build').addEventListener('click', () => {
    simulateLearning();
});

document.getElementById('learn').addEventListener('click', () => {
    for (let i = 0; i < 10; i++) {
        simulateLearning();
    }
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

// Resize
window.addEventListener('resize', () => {
    camera.aspect = (window.innerWidth - 300) / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth - 300, window.innerHeight);
});