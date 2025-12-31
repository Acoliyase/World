# World Builder Simulation

A browser-based 3D simulation inspired by Sword Art Online’s Underworld, where autonomous avatars construct and evolve a living world. Inspired by Fluctlights and self-learning AIs, characters learn building techniques through trial and error, using open-source AI/ML approaches like TensorFlow.js. The world evolves with time, featuring day/night cycles, growing crops, wandering NPCs, and persistent societies.

## Features

- **Autonomous Avatars & NPCs**: Main avatar and 3 NPCs build, learn, and wander independently.
- **Persistent, Evolving World**: Saves to browser storage; world grows over time with time progression.
- **AI Learning**: TensorFlow.js model improves placement decisions; logs show research and evolution.
- **Time & Environment**: Day/night cycle, growing crops, dynamic lighting.
- **Anime-Inspired Style**: Ethereal visuals with toon materials, like SAO's Underworld.
- **Object-Based Building**: Houses, furniture, crops, walls, bushes, trees.
- **Organized Farming**: Crop plots with elevation; crops grow over time.
- **Logging System**: Detailed logs of AI learning, successes, failures, and world events.
- **Lightweight**: Runs smoothly in-browser, deployable on GitHub Pages.

## How to Run Locally

1. Clone the repository
2. Open `index.html` in a web browser, or serve with a local server (e.g., `python3 -m http.server`)

## Controls

- **Build Random Item**: Manual placement.
- **Simulate Learning**: 10 random attempts.
- **Auto Build with AI**: AI-guided placement.
- **Toggle Autonomous Mode**: Continuous building every 2 seconds.
- **Reset World**: Clears all progress.

## World Evolution (SAO-Inspired)

- **Time Progression**: Days pass with lighting changes; crops grow autonomously.
- **NPC Activities**: Wander and occasionally build, simulating a living society.
- **Learning Adaptation**: AIs improve like Fluctlights, adapting to build better structures.
- **Expansion Potential**: Foundation for villages, interactions, and complex behaviors.

## Deployment to GitHub Pages

1. Go to repository settings > Pages.
2. Select "Deploy from a branch" > main branch > /(root).
3. Save; site at `https://acoliyase.github.io/World/`

## Technologies

- Three.js for 3D rendering
- TensorFlow.js for ML
- Open-source assets and libraries