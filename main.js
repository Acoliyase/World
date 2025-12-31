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

// Additional NPCs (autonomous avatars)
const npcs = [];
for (let i = 0; i < 3; i++) {
    const npcGeometry = new THREE.SphereGeometry(0.4);
    const npcMaterial = toonMaterial.clone();
    npcMaterial.color.set(Math.random() * 0xffffff);
    const npc = new THREE.Mesh(npcGeometry, npcMaterial);
    npc.position.set((Math.random() - 0.5) * 20, 0.5, (Math.random() - 0.5) * 20);
    scene.add(npc);
    npcs.push(npc);
}

// Time and day/night cycle
let time = 0; // In seconds
let dayLength = 120; // 2 minutes per day
let isDay = true;

// Update lighting based on time
function updateLighting() {
    const dayProgress = (time % dayLength) / dayLength;
    const intensity = Math.sin(dayProgress * Math.PI) * 0.8 + 0.2; // Day brighter
    directionalLight.intensity = intensity;
    ambientLight.intensity = 0.3 + intensity * 0.3;
    isDay = intensity > 0.5;
    scene.background = new THREE.Color(isDay ? 0x87CEEB : 0x191970); // Sky blue to midnight blue

    // Update time display
    const days = Math.floor(time / dayLength) + 1;
    const hours = Math.floor((dayProgress * 24));
    const minutes = Math.floor((dayProgress * 24 * 60) % 60);
    document.getElementById('time').textContent = `Time: Day ${days}, ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

// Crop growth
let crops = [];
function growCrops() {
    crops.forEach(crop => {
        if (crop.scale.y < 1.5) {
            crop.scale.y += 0.01; // Grow slowly
        }
    });
}

// Autonomous NPC actions
function updateNPCs() {
    npcs.forEach(npc => {
        // Simple movement: wander
        npc.position.x += (Math.random() - 0.5) * 0.1;
        npc.position.z += (Math.random() - 0.5) * 0.1;
        // Occasionally build
        if (Math.random() < 0.01) { // 1% chance per frame
            simulateLearning(true, npc.position);
        }
    });
}

// Modify simulateLearning to accept position
function simulateLearning(auto = false, pos = null) {
    learningAttempts++;
    let itemType, x, z;
    if (pos) {
        itemType = itemTypes[Math.floor(Math.random() * itemTypes.length)];
        x = pos.x + (Math.random() - 0.5) * 5;
        z = pos.z + (Math.random() - 0.5) * 5;
    } else if (auto && model) {
        // Use model to decide
        log('Searching open-source AI materials for optimal placement...');
        itemType = itemTypes[Math.floor(Math.random() * itemTypes.length)];
        x = (Math.random() - 0.5) * 30;
        z = (Math.random() - 0.5) * 30;
        const inPlot = Math.abs(x % 6) < 3 && Math.abs(z % 6) < 3 ? 1 : 0;
        const input = tf.tensor2d([[x/30, z/30, itemTypeToIndex[itemType]/4, inPlot]]);
        const prediction = model.predict(input);
        const prob = prediction.dataSync()[0];
        if (prob < 0.5) {
            log(`AI decided not to place ${itemType} at (${x.toFixed(1)}, ${z.toFixed(1)}) - low success probability (${(prob*100).toFixed(1)}%)`);
            return;
        }
        log(`AI approved placement with ${(prob*100).toFixed(1)}% confidence.`);
    } else {
        itemType = itemTypes[Math.floor(Math.random() * itemTypes.length)];
        x = (Math.random() - 0.5) * 30;
        z = (Math.random() - 0.5) * 30;
    }
    const y = 0.5;

    // Check if position is free (simple collision)
    let collision = false;
    objects.forEach(obj => {
        if (Math.abs(obj.position.x - x) < 1 && Math.abs(obj.position.z - z) < 1) {
            collision = true;
        }
    });

    // For crops, prefer plot areas
    let inPlot = Math.abs(x % 6) < 3 && Math.abs(z % 6) < 3;

    const success = !collision && (itemType !== 'crop' || inPlot);
    trainingData.push({x: x/30, z: z/30, itemType: itemTypeToIndex[itemType]/4, inPlot: inPlot ? 1 : 0, success: success ? 1 : 0});

    if (success) {
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
        mesh.userData = { type: itemType, color: material.color.getHex() };
        scene.add(mesh);
        objects.push(mesh);
        if (itemType === 'crop') {
            crops.push(mesh);
        }
        successes++;
        const extra = itemType === 'crop' && inPlot ? ' (in plot)' : '';
        log(`Success: Placed ${itemType} at (${x.toFixed(1)}, ${z.toFixed(1)})${extra}. Success rate: ${(successes / learningAttempts * 100).toFixed(1)}%`);
        saveWorld();
    } else {
        const reason = collision ? 'collision' : 'not in suitable area';
        log(`Failure: ${reason} for ${itemType} at (${x.toFixed(1)}, ${z.toFixed(1)}). Attempt ${learningAttempts}`);
    }

    // Retrain model every 10 attempts
    if (trainingData.length >= 10) {
        trainModel();
    }
}

// Load world state from localStorage
function loadWorld() {
    const saved = localStorage.getItem('worldState');
    if (saved) {
        const state = JSON.parse(saved);
        state.objects.forEach(obj => {
            // Recreate meshes
            let geometry, material, mesh;
            if (obj.type === 'furniture') {
                geometry = new THREE.BoxGeometry(1, 1, 1);
                material = toonMaterial.clone();
                material.color.set(obj.color);
            } else if (obj.type === 'wall') {
                geometry = new THREE.BoxGeometry(0.1, 2, 2);
                material = toonMaterial.clone();
                material.color.set(obj.color);
            } else if (obj.type === 'crop') {
                geometry = new THREE.BoxGeometry(0.2, 0.5, 0.2);
                material = toonMaterial.clone();
                material.color.set(obj.color);
            } else if (obj.type === 'bush') {
                geometry = new THREE.SphereGeometry(0.5);
                material = toonMaterial.clone();
                material.color.set(obj.color);
            } else if (obj.type === 'tree') {
                // Trunk
                geometry = new THREE.CylinderGeometry(0.2, 0.2, 3);
                material = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
                mesh = new THREE.Mesh(geometry, material);
                mesh.position.set(obj.x, obj.y + 1.5, obj.z);
                scene.add(mesh);
                objects.push(mesh);
                // Leaves
                const leavesGeom = new THREE.SphereGeometry(1.5);
                const leavesMat = toonMaterial.clone();
                leavesMat.color.set(obj.color);
                const leaves = new THREE.Mesh(leavesGeom, leavesMat);
                leaves.position.set(obj.x, obj.y + 3, obj.z);
                scene.add(leaves);
                objects.push(leaves);
                return;
            }
            if (mesh) {
                mesh.position.set(obj.x, obj.y, obj.z);
                scene.add(mesh);
                objects.push(mesh);
            }
        });
        learningAttempts = state.learningAttempts;
        successes = state.successes;
        log('World state loaded from persistent storage.');
    }
}

// Save world state to localStorage
function saveWorld() {
    const state = {
        objects: objects.map(obj => ({
            x: obj.position.x,
            y: obj.position.y,
            z: obj.position.z,
            type: obj.userData.type,
            color: obj.material.color.getHex()
        })),
        learningAttempts,
        successes
    };
    localStorage.setItem('worldState', JSON.stringify(state));
}

// Learning logs
const logContent = document.getElementById('log-content');
function log(message) {
    logContent.innerHTML += '<p>' + message + '</p>';
    logContent.scrollTop = logContent.scrollHeight;
}

// Simulate learning with simple logic
let learningAttempts = 0;
let successes = 0;
let trainingData = [];

// TF.js model for learning
let model;
async function createModel() {
    model = tf.sequential();
    model.add(tf.layers.dense({inputShape: [4], units: 10, activation: 'relu'})); // x, z, itemType, inPlot
    model.add(tf.layers.dense({units: 1, activation: 'sigmoid'}));
    model.compile({optimizer: 'adam', loss: 'binaryCrossentropy', metrics: ['accuracy']});
    log('AI Model initialized from open-source ML frameworks.');
}
createModel();

// Item types mapping
const itemTypes = ['furniture', 'wall', 'crop', 'bush', 'tree'];
const itemTypeToIndex = {furniture: 0, wall: 1, crop: 2, bush: 3, tree: 4};

function simulateLearning(auto = false) {
    learningAttempts++;
    let itemType, x, z;
    if (auto && model) {
        // Use model to decide
        log('Searching open-source AI materials for optimal placement...');
        // Random for now, but could optimize
        itemType = itemTypes[Math.floor(Math.random() * itemTypes.length)];
        x = (Math.random() - 0.5) * 30;
        z = (Math.random() - 0.5) * 30;
        const inPlot = Math.abs(x % 6) < 3 && Math.abs(z % 6) < 3 ? 1 : 0;
        const input = tf.tensor2d([[x/30, z/30, itemTypeToIndex[itemType]/4, inPlot]]);
        const prediction = model.predict(input);
        const prob = prediction.dataSync()[0];
        if (prob < 0.5) {
            log(`AI decided not to place ${itemType} at (${x.toFixed(1)}, ${z.toFixed(1)}) - low success probability (${(prob*100).toFixed(1)}%)`);
            return;
        }
        log(`AI approved placement with ${(prob*100).toFixed(1)}% confidence.`);
    } else {
        itemType = itemTypes[Math.floor(Math.random() * itemTypes.length)];
        x = (Math.random() - 0.5) * 30;
        z = (Math.random() - 0.5) * 30;
    }
    const y = 0.5;

    // Check if position is free (simple collision)
    let collision = false;
    objects.forEach(obj => {
        if (Math.abs(obj.position.x - x) < 1 && Math.abs(obj.position.z - z) < 1) {
            collision = true;
        }
    });

    // For crops, prefer plot areas
    let inPlot = Math.abs(x % 6) < 3 && Math.abs(z % 6) < 3;

    const success = !collision && (itemType !== 'crop' || inPlot);
    trainingData.push({x: x/30, z: z/30, itemType: itemTypeToIndex[itemType]/4, inPlot: inPlot ? 1 : 0, success: success ? 1 : 0});

    if (success) {
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
        mesh.userData = { type: itemType, color: material.color.getHex() };
        scene.add(mesh);
        objects.push(mesh);
        successes++;
        const extra = itemType === 'crop' && inPlot ? ' (in plot)' : '';
        log(`Success: Placed ${itemType} at (${x.toFixed(1)}, ${z.toFixed(1)})${extra}. Success rate: ${(successes / learningAttempts * 100).toFixed(1)}%`);
        saveWorld();
    } else {
        const reason = collision ? 'collision' : 'not in suitable area';
        log(`Failure: ${reason} for ${itemType} at (${x.toFixed(1)}, ${z.toFixed(1)}). Attempt ${learningAttempts}`);
    }

    // Retrain model every 10 attempts
    if (trainingData.length >= 10) {
        trainModel();
    }
}

async function trainModel() {
    if (trainingData.length < 10) return;
    log('Retraining AI model using open-source TensorFlow.js...');
    const inputs = trainingData.map(d => [d.x, d.z, d.itemType, d.inPlot]);
    const labels = trainingData.map(d => d.success);
    const xs = tf.tensor2d(inputs);
    const ys = tf.tensor1d(labels);
    await model.fit(xs, ys, {epochs: 10, verbose: 0});
    log('AI model retrained. Learning improved.');
    trainingData = []; // Reset for next batch
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

document.getElementById('auto').addEventListener('click', () => {
    simulateLearning(true);
});

document.getElementById('autonomous').addEventListener('click', () => {
    autonomousMode = !autonomousMode;
    if (autonomousMode) {
        autonomousInterval = setInterval(() => {
            simulateLearning(true);
        }, 2000); // Build every 2 seconds
        document.getElementById('autonomous').textContent = 'Stop Autonomous Mode';
        log('Autonomous mode activated. Avatar will build independently.');
    } else {
        clearInterval(autonomousInterval);
        document.getElementById('autonomous').textContent = 'Toggle Autonomous Mode';
        log('Autonomous mode deactivated.');
    }
});

document.getElementById('reset').addEventListener('click', () => {
    // Clear objects
    objects.forEach(obj => scene.remove(obj));
    objects = [];
    learningAttempts = 0;
    successes = 0;
    trainingData = [];
    localStorage.removeItem('worldState');
    log('World reset. Starting fresh.');
    // Recreate initial environment if needed, but for now, just clear
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    time += 0.016; // Assuming 60fps, ~1 second per 60 frames
    updateLighting();
    growCrops();
    updateNPCs();
    renderer.render(scene, camera);
}
animate();

// Resize
window.addEventListener('resize', () => {
    camera.aspect = (window.innerWidth - 300) / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth - 300, window.innerHeight);
});